# 复刻第一个游戏 - 主逻辑代码讲解

> 本文逐段拆解游戏场景（game.scene）的核心脚本 `GameRoot.ts`（522 行），以及配套的 `Fruit.ts`、`LevelConfig.ts`、`levels.json`。读完可以完整理解：物理世界怎么搭出来、水果为什么点一下就掉、相同水果怎么消除、游戏怎么判赢判负。

---

## 一、整体架构

游戏场景只有一个脚本入口：`GameRoot`，挂在 Canvas 节点上。整个游戏**没有在编辑器里摆任何游戏元素**——漏斗、墙壁、水果、UI、结算面板全部由代码在运行时 `new Node()` 动态创建。

```
GameRoot.ts（主控制器，522 行）
├── Fruit.ts        水果数据组件（8 行，只存 level / dropped 两个状态）
├── LevelConfig.ts  关卡配置加载器（45 行，读 levels.json）
└── levels.json     关卡数据（水果坐标、种类、重力、下坠节奏）
```

`GameRoot` 干的事按执行顺序：

1. `start()`：读关卡进度 → 初始化物理系统 → 搭物理世界 → 建 UI → 加载贴图 → 生成水果
2. 运行期 `update()`：定时下坠 + 判负检测
3. 点击事件：水果 Static → Dynamic，交给物理引擎
4. 碰撞回调：同种水果碰撞 → 消除 → 判赢

---

## 二、常量区：整个游戏的"几何图纸"

文件开头的常量是反复调试出来的物理坐标，是理解全部逻辑的地图：

```typescript
const DESIGN_W = 750;
const DESIGN_H = 1334;          // 设计分辨率（竖屏）

const BOX_RIM_Y = -400;         // 判负线：桶口，水果静止堆过此线即判负
const FUNNEL_TOP_Y = -250;      // V 型草坡外端（宽口、高位）
const CLIFF_Y = -400;           // V 型草坡内端 = 竖槽口 = 桶口
const THROAT_Y = -660;          // 窄槽平底（托盘，贴屏幕底 -667）
const RAMP_OUTER_X = 375;       // 斜板外端 x
const RAMP_INNER_X = 50;        // 斜板内端 x（窄槽半宽）
const FUNNEL_H = 410;           // 漏斗素材高度（-250 到 -660）

const RAMP_FRICTION = 0.15;     // 斜板低摩擦：保证水果一定滚得下去
const FRUIT_FRICTION = 0.55;    // 水果摩擦：堆积时不乱滑
const CHUTE_FRICTION = 0.4;     // 窄槽壁摩擦

const FRUIT_RADIUS = 40;        // 所有水果统一半径（大小一致）
```

画面纵剖面（y 轴向上为正）：

```
 y=+667 ───────── 屏幕顶（HUD、返回按钮在这）
   ↑  待投放水果区（Static，点击才掉）
 y=-250 ──╲─────────────╱── 草坡外端 FUNNEL_TOP_Y（x=±375）
           ╲           ╱
            ╲         ╱   低摩擦斜板，水果自动滚向中心
 y=-400 ─────╲_______╱───── 桶口/警戒线 BOX_RIM_Y（x=±50）
              │     │
              │ 桶区 │      水果在这里两两堆积消除
              │     │
 y=-660 ──────┴─────┴────── 托盘平底 THROAT_Y（贴屏幕底）
 y=-667 ─────────────────── 屏幕底
```

判负相关的另外三个常量：

```typescript
const OVERFLOW_HOLD = 0.5;     // 溢出状态要持续 0.5 秒才判负（防抖）
const OVERFLOW_MIN_Y = 100;    // 水果低于此 y 才算"进了桶区"
```

---

## 三、成员变量：三个集合管全部水果

```typescript
private frames: SpriteFrame[] = [];          // 11 种水果贴图
private fruitsRoot!: Node;                   // 所有水果的父节点
private readonly staged: Fruit[] = [];       // 还没被点击的水果
private readonly alive = new Set<Fruit>();   // 场上所有活着的水果（含 staged）
private readonly eliminating = new Set<Fruit>(); // 正在播放消除、防重复触发
private overflowTimer = 0;                   // 溢出累计计时
private stageTimer = 0;                      // 定时下坠累计计时
private over = false;                        // 游戏是否已结束
private score = 0;
```

关键是理解 `staged` 和 `alive` 的区别：

- `staged`：顶部"待投放"的水果，还是 Static 障碍物，点击一个就从数组删掉一个
- `alive`：场上所有还存在的水果（待投放 + 已掉落），消除一个删一个
- 水果刚创建时同时进两个集合；点击时只出 `staged`；消除时才出 `alive`

---

## 四、start()：启动流水线

```typescript
start() {
    this.currentLevel = parseInt(localStorage.getItem('cpgame_level') || '1', 10) || 1;
    this.setupPhysics();
    this.buildWorld();
    this.buildUI();
    resources.load('textures/funnel/spriteFrame', SpriteFrame, (err, sf) => { ... });
    LevelConfig.load((levels) => {
        this.levelData = LevelConfig.getLevel(this.currentLevel) ?? levels[0];
        ...
        resources.loadDir('textures/fruits', SpriteFrame, (err, assets) => {
            this.frames = assets.sort((a, b) => this.levelIndex(a.name) - this.levelIndex(b.name));
            this.buildStage();
            this.refreshHud();
        });
    });
}
```

执行顺序和依赖关系：

1. 从 `localStorage` 读上次过关进度（通关后写入下一关，见第九节）
2. 物理系统、世界、UI 都是纯代码构建，不依赖资源，先建
3. 漏斗贴图和水果贴图走 `resources.load` **异步加载**
4. 必须等关卡 JSON 和水果贴图都回来后才能 `buildStage()`（生成水果既要坐标又要贴图）

`resources.loadDir('textures/fruits')` 会把目录下所有 SpriteFrame 一次拿回来，再用正则 `/level(\d+)/` 从文件名（level1.png ~ level11.png）提取数字排序，保证 `frames[0]` 对应 1 号水果。

注意：所有 Cocos 资源加载都是异步回调，不能假设 load 之后下一行就能用——这也是这里层层嵌套回调的原因。

---

## 五、setupPhysics()：物理系统配置

```typescript
private setupPhysics() {
    const sys = PhysicsSystem2D.instance;
    sys.gravity = new Vec2(0, this.levelData ? this.levelData.gravity : -750);
    sys.allowSleep = true;        // 允许刚体休眠（静止后不再消耗计算）
    sys.autoSimulation = true;    // 引擎每帧自动步进物理世界
    sys.fixedTimeStep = 1 / 60;   // 物理步长固定 60Hz
}
```

- 重力向下（y 负方向），大小由关卡配置决定（关卡 3 是 -800，下落更快更难）
- 游戏用的是 Cocos 内置的 **Box2D 2D 物理引擎**：刚体（RigidBody2D）负责受力运动，碰撞体（Collider2D）负责形状和碰撞回调
- 物理步长与渲染帧分离，固定 1/60 秒，保证不同帧率手机上物理表现一致

---

## 六、buildWorld()：代码搭出整个漏斗世界

这是最长的函数，但本质就是"按图纸摆静态碰撞体"。

### 6.1 节点分层

```typescript
const wallsRoot = new Node('Walls');   // 墙壁、斜板、漏斗图（下层）
this.fruitsRoot = new Node('Fruits');  // 水果层（上层，避免被墙盖住）
```

Cocos 同级节点后 addChild 的渲染在上层，所以水果层后加，保证水果始终可见。

### 6.2 漏斗底图

```typescript
const funnelNode = new Node('Funnel');
funnelNode.setPosition(0, FUNNEL_TOP_Y - FUNNEL_H / 2);  // 中心 = (-250 + -660)/2
funnelNode.addComponent(UITransform).setContentSize(750, FUNNEL_H);
this.funnelSprite = funnelNode.addComponent(Sprite);
```

这里只是先放一个空 Sprite 节点，贴图在 `start()` 的异步回调里补上去。节点的 y 坐标是素材矩形的**中心**：从 -250 到 -660 的中点。

### 6.3 左右斜板（倒圆锥的关键）

```typescript
const dx = RAMP_OUTER_X - RAMP_INNER_X;   // 375 - 50 = 325
const dy = FUNNEL_TOP_Y - CLIFF_Y;        // -250 - (-400) = 150
const rampLen = Math.sqrt(dx * dx + dy * dy);
const rampAngle = Math.atan2(dy, dx) * 180 / Math.PI;
this.addRamp(wallsRoot, 'RampL', -(375 + 50) / 2, (-250 + -400) / 2, rampLen, 30, -rampAngle);
this.addRamp(wallsRoot, 'RampR',  (375 + 50) / 2, (-250 + -400) / 2, rampLen, 30,  rampAngle);
```

斜板就是一个旋转过的矩形静态碰撞体：

- 用勾股定理算板长，`atan2` 算倾角（左边取负角度，镜像对称）
- 左右各一块，外高内低，水果落上去必然向中心滚
- 这就是"倒圆锥让所有水果汇聚到一起"的 2D 实现：两条斜线 + 一个窄槽

### 6.4 窄槽（桶）

```typescript
const chuteH = CLIFF_Y - THROAT_Y;       // -400 到 -660，高 260
this.addWall(wallsRoot, 'ChuteL', -60, ..., 20, chuteH + 24);  // 左竖直壁
this.addWall(wallsRoot, 'ChuteR',  60, ..., 20, chuteH + 24);  // 右竖直壁
this.addWall(wallsRoot, 'Throat', 0, THROAT_Y - 12, 100 + 20, 24); // 平底托盘
```

三块静态墙围成桶：左右竖壁 + 底部托盘。水果从 ±50 的槽口掉进来，在托盘上堆积。

### 6.5 左右隐形边界墙

```typescript
const boundaryX = 392;                  // 画布边缘外一点
this.addInvisibleWall(wallsRoot, 'BoundaryL', -392, ..., 20, boundaryH);
this.addInvisibleWall(wallsRoot, 'BoundaryR',  392, ..., 20, boundaryH);
```

只挂刚体和碰撞体、**不挂任何渲染组件**，所以看不见但能撞。作用：防止水果从斜板上弹飞出画布，碰到就被弹回来。

### 6.6 警戒线（装满线）

```typescript
const g = line.addComponent(Graphics);
g.strokeColor = new Color(230, 70, 70, 200);
for (let x = -INNER_HALF_W; x < INNER_HALF_W; x += 28) {
    g.moveTo(x, BOX_RIM_Y);
    g.lineTo(Math.min(x + 14, INNER_HALF_W), BOX_RIM_Y);
}
```

用 `Graphics` 手绘一条红色虚线，y 与桶口平齐（-400）。它**纯视觉，没有碰撞体**，真正的判负在 `update()` 里比对水果坐标。旁边还有个"装满线"文字标签。

### 6.7 三种墙体工厂方法

`addWall` / `addInvisibleWall` / `addRamp` 结构完全一样，差别只在渲染和物理参数：

```typescript
const body = node.addComponent(RigidBody2D);
body.type = ERigidBody2DType.Static;   // 静态刚体：自己不动，但能挡住别人
const col = node.addComponent(BoxCollider2D);
col.restitution = 0.02;                // 弹性极低，水果撞上去不蹦
col.friction = RAMP_FRICTION;
```

- `Static` 刚体：不受重力、撞不动，适合做地形
- `restitution` 是弹性系数（0=不弹，1=完全弹性），全部调得很低，对应"不要乱蹦"
- `addRamp` 只画一条 16px 高的绿色草皮唇边，土坡的身体由漏斗 PNG 呈现，视觉和碰撞体是分开的两套东西

---

## 七、buildUI()：纯代码画 UI

```typescript
// 返回按钮：点击 director.loadScene('main') 回欢迎页
const back = this.makeButton('BackBtn', '‹ 返回', -300, 620, ...);

// 操作提示文字
tip.string = '点击顶部水果掉落 · 同色水果落入漏斗后自动消除';

// HUD：剩余数 + 得分，放在顶部 y=620
this.restLabel  = mkLabel('Rest',  -60, ...);   // "剩余 N"
this.scoreLabel = mkLabel('Score', 180, ...);   // "得分 N"
```

`makeButton` 是个小工厂：`UITransform` 定尺寸 → `Graphics.roundRect` 画胶囊形背景 → 子节点放 `Label` → 挂 `Button` 组件并开启按压缩放（`zoomScale = 0.92`）。结算面板的两个按钮也复用它。

---

## 八、水果的一生（核心中的核心）

### 8.1 创建：生来就是 Static 障碍物

```typescript
private createStagedFruit(level: number, x: number, y: number): Fruit {
    const node = new Node(`Fruit_${level}`);
    node.setPosition(x, y);
    node.addComponent(UITransform).setContentSize(r * 2, r * 2);
    const sp = node.addComponent(Sprite);
    sp.spriteFrame = this.frames[level - 1] || null;

    const fruit = node.addComponent(Fruit);
    fruit.level = level;
    fruit.dropped = false;

    const body = node.addComponent(RigidBody2D);
    body.type = ERigidBody2DType.Static;    // ★ 初始是静态的
    body.linearDamping = 0.15;              // 线性阻尼：空气阻力感
    body.angularDamping = 0.6;              // 角阻尼：转动很快停下
    body.enabledContactListener = true;    // ★ 必须开，否则收不到碰撞回调

    const col = node.addComponent(CircleCollider2D);
    col.radius = r;
    col.restitution = 0.0;
    col.friction = FRUIT_FRICTION;
    col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

    node.on(Node.EventType.TOUCH_END, () => this.onFruitTouch(fruit), this);
    return fruit;
}
```

几个关键设计：

1. **坐标和种类全部来自 `levels.json`**。每种水果的数量在配置里保证成对出现，否则永远消不完
2. **未点击的水果是 Static**：它不受重力、也不会被别的水果撞动——这就是"没点过的水果是固定的、不可逾越的障碍"的实现
3. 水果大小统一取常量 `FRUIT_RADIUS = 40`，贴图只决定颜色种类，不决定大小
4. `enabledContactListener = true` 是碰撞回调的开关，漏了它 `onBeginContact` 永远不会触发
5. 圆形碰撞体（CircleCollider2D）滚起来最自然，不会像方块那样卡边

`Fruit.ts` 本身只有数据，没有逻辑：

```typescript
@ccclass('Fruit')
export class Fruit extends Component {
    public level = 1;      // 水果种类（1~11），同种才消除
    public dropped = false; // 是否已被点击投放
}
```

挂这个组件更重要的作用是**碰撞时识别对方身份**：碰撞体上 `getComponent(Fruit)` 能取到，就说明撞的是水果而不是墙。

### 8.2 点击：Static 切 Dynamic

```typescript
private onFruitTouch(fruit: Fruit) {
    if (this.over) return;
    if (!fruit.dropped) this.dropStaged(fruit);
}

private dropStaged(fruit: Fruit) {
    const i = this.staged.indexOf(fruit);
    if (i >= 0) this.staged.splice(i, 1);

    const body = fruit.node.getComponent(RigidBody2D);
    body.type = ERigidBody2DType.Dynamic;   // ★ 切换成动态刚体
    body.linearVelocity = new Vec2(0, -60); // 轻轻给一个初速度

    fruit.dropped = true;
    this.refreshHud();
    // 按压缩放反馈：1 → 1.08 → 1
}
```

这就是整个交互的全部魔法：

- Static 水果点击后**原地切成 Dynamic**，开始受重力、能滚动能碰撞
- 给一个 -60 的微小初速度，避免某些情况下堆叠接触时"卡住不掉"
- 同时从 `staged` 移除、标记 `dropped`、播一个放大回弹的点击反馈

> 踩坑记录：最初版本是 `removeComponent(RigidBody2D)` 再 `addComponent`，会导致碰撞监听器注册失效。直接改 `body.type` 是官方推荐的正确姿势，物理组件实例始终只有一个。

因为没点的水果还是 Static，掉落中的 Dynamic 水果撞上它们**只能被挡住、绕开，绝不可能穿透**——物理引擎天然保证。

### 8.3 碰撞消除：只在"两个都已掉落 + 同种"时触发

```typescript
private onBeginContact(selfCol, otherCol, _c) {
    const a = selfCol.getComponent(Fruit);
    const b = otherCol.getComponent(Fruit);
    if (!a || !b || a === b) return;        // 撞墙、自己碰自己：忽略
    if (a.level !== b.level) return;        // 不同种：不消除
    if (!a.dropped || !b.dropped) return;   // 有待投放水果：不消除
    if (this.eliminating.has(a) || this.eliminating.has(b)) return; // 防重复
    this.eliminating.add(a);
    this.eliminating.add(b);
    this.scheduleOnce(() => this.eliminate(a, b));  // ★ 延迟一帧销毁
}
```

四个过滤条件对应四个实际需求：

| 条件 | 为什么需要 |
|---|---|
| 两边都有 Fruit 组件 | 撞斜板、墙壁、边界不触发 |
| `level` 相同 | 只有同种水果才消除 |
| 都 `dropped` | 顶部没点的水果只是障碍，碰了不消 |
| 不在 `eliminating` 集合 | 一次碰撞 Box2D 可能回调多次，防止一对水果被消两次甚至触发连锁误删 |

最后**不立即 destroy，而是 `scheduleOnce` 延迟到下一帧**：在物理碰撞回调内部直接销毁刚碰过的刚体，可能导致 Box2D 遍历世界时访问已释放对象而崩溃。延迟一帧是标准安全做法。

### 8.4 销毁与特效

```typescript
private eliminate(a: Fruit, b: Fruit) {
    this.eliminating.delete(a);
    this.eliminating.delete(b);
    for (const f of [a, b]) {
        this.spawnPop(f.level, f.node.position);  // 黄色光圈扩散
        f.node.destroy();
        this.alive.delete(f);
        this.score += 10;
    }
    this.refreshHud();
    this.scheduleOnce(() => this.checkState());   // 销毁稳定后再判赢
}
```

`spawnPop` 在水果位置画一个黄色圆圈，0.2 秒内放大 1.7 倍同时淡出，然后自删——一个轻量的消除反馈，没有用粒子资源。

得分规则简单固定：每消除一对 +10。

---

## 九、胜负判定

### 9.1 判赢：全清空

```typescript
private checkState() {
    if (this.over) return;
    if (this.alive.size === 0 && this.staged.length === 0) {
        const next = this.currentLevel + 1;
        if (next <= LevelConfig.maxLevel) {
            localStorage.setItem('cpgame_level', String(next));  // 记录进度
        }
        this.showResult(true);
    }
}
```

场上水果全没了（待投放数组和存活集合都空）就是过关，把下一关编号写进 localStorage，下次进游戏自动续关。

### 9.2 判负：桶装满了，且要"真的静止"

判负在每帧 `update()` 里做，是调得最多的一块逻辑：

```typescript
update(dt: number) {
    if (this.over) return;

    // ① 定时下坠
    this.stageTimer += dt;
    if (this.stageTimer >= this.descendInterval) {
        this.stageTimer -= this.descendInterval;
        this.descendStage();
    }

    // ② 溢出检测
    let overflow = false;
    for (const f of this.alive) {
        if (!f.dropped || !f.node.isValid) continue;
        const body = f.node.getComponent(RigidBody2D);
        const linSpeed = body.linearVelocity.lengthSqr();      // 线速度平方
        const angSpeed = Math.abs(body.angularVelocity);      // 角速度绝对值
        const isResting = linSpeed < 4 && angSpeed < 0.5;     // ★ 真静止
        const inBucket = f.node.position.y < OVERFLOW_MIN_Y;  // 进了桶区
        if (inBucket && f.node.position.y > BOX_RIM_Y && isResting) {
            overflow = true;
            break;
        }
    }

    // ③ 持续 0.5 秒才判负
    if (overflow) {
        this.overflowTimer += dt;
        if (this.overflowTimer >= OVERFLOW_HOLD) this.showResult(false);
    } else {
        this.overflowTimer = Math.max(0, this.overflowTimer - dt * 2);
    }
}
```

判负必须**同时**满足四个条件：

1. 水果已掉落（顶部被挡着的 Static 水果不算）
2. `y < 100`：确实进了桶区，排除还在半空中、被顶部其他水果挡住的情况
3. `y > -400`：身体越过了桶口警戒线
4. **真正静止**：线速度平方 < 4 且角速度绝对值 < 0.5

为什么要判静止：水果滚落途中可能短暂越过警戒线，如果立刻判负，玩家会看到"水果还在滚就输了"。必须等它在警戒线上方**停稳**，才说明桶真的满了。

为什么不用"速度严格等于 0"：Box2D 里刚体靠迭代求解，堆在一起的水果可能永远保持每秒零点几像素的微小蠕动和抖动，严格等于 0 可能永远等不到。小阈值（速度²<4 ≈ 速度<2 像素/秒）是物理游戏判定静止的通用做法。`allowSleep` 也会让停稳的刚体进入休眠，休眠后速度自然为 0。

为什么还要持续 0.5 秒：单帧检测可能因为瞬间挤压抖动误判，连续半秒才确认；条件不满足时计时器以 2 倍速度回落，既防抖又反应快。

### 9.3 定时下坠：持续加压

```typescript
private descendStage() {
    for (const f of this.staged) {
        f.node.setPosition(f.node.position.x, f.node.position.y - this.descendStep);
    }
    for (const f of this.staged) {
        if (f.node.position.y < FUNNEL_TOP_Y + 100) {
            this.showResult(false);   // 待投放区被压到桶口附近 = 没空间了
            return;
        }
    }
}
```

每隔 `descendInterval` 秒（关卡配置，如 20 秒），所有**未点击**的水果整体下移 `descendStep` 像素。Static 水果直接改坐标即可（物理引擎不管 Static 的运动）。水果可以初始摆在屏幕外上方，随时间一批批压下来，制造紧迫感。如果待投放区被压到桶口附近还没清完，同样判负。

---

## 十、结算面板

```typescript
private showResult(win: boolean) {
    if (this.over) return;
    this.over = true;
    // 全屏半透明黑遮罩（带 Button 组件吞掉点击，防止点到背后的水果）
    // 标题："过关啦"（绿描边）/ "装不下啦"（红描边）
    // 副标题：得分 / 已消除个数
    // [再来一次] → director.loadScene('game') 重开本关
    // [返回主页] → director.loadScene('main') 回欢迎页
}
```

面板用代码拼：遮罩层 + Graphics 画的背景 + 两个 Label + `makeButton` 生成的按钮，最后整体从 0.8 倍 `backOut` 弹到 1 倍出场。`this.over = true` 之后，`update()`、水果点击全部立即失效，防止结算后还能操作。

---

## 十一、关卡配置化

`LevelConfig.ts` 是 `resources/data/levels.json` 的加载器，带内存缓存：

```typescript
static load(cb: (levels: LevelData[]) => void) {
    if (this.cache) { cb(this.cache); return; }
    resources.load('data/levels', JsonAsset, (err, asset) => {
        this.cache = (asset.json as any).levels || [];
        cb(this.cache);
    });
}
static getLevel(level: number) { return this.cache?.find(l => l.level === level) ?? null; }
static get maxLevel() { return this.cache ? this.cache.length : 3; }
```

`levels.json` 每关的结构：

```json
{
  "level": 1,
  "descendInterval": 25,   // 定时下坠间隔（秒）
  "descendStep": 25,       // 每次下坠像素
  "gravity": -750,         // 本关重力
  "fruits": [
    { "x": -142.9, "y": 304.2, "level": 1 },
    { "x": -222.6, "y": 580.7, "level": 1 }
  ]
}
```

配置化的好处：调难度（重力、下坠节奏）、摆关卡（水果坐标和种类）全部不用改代码、不用重新编译脚本，改 JSON 重新预览即可。**硬性约束：每种 `level` 的水果数量必须是偶数（成对）**，否则该种水果剩一个永远无法消除，关卡无解。

坐标由关卡设计保证水果初始互不重叠（圆形间距 ≥ 直径 80），所以 Static 初始状态不需要物理引擎做防重叠。

---

## 十二、运行时节点树

游戏跑起来后，Canvas 下的节点全部由代码生成：

```
Canvas（挂 GameRoot）
├── Camera
├── Walls
│   ├── Funnel      漏斗 PNG（纯视觉）
│   ├── RampL/RampR 斜板（绿色唇边 + 旋转的静态碰撞体）
│   ├── ChuteL/ChuteR/Throat 窄槽竖壁与托盘（棕色静态碰撞体）
│   └── BoundaryL/BoundaryR 隐形边界墙（无渲染）
├── Fruits
│   ├── Fruit_3     每个水果：Sprite + Fruit + RigidBody2D + CircleCollider2D
│   ├── Fruit_1
│   └── Pop...      消除特效（0.2 秒后自删）
├── RimLine         红色警戒虚线（Graphics 纯视觉）+ "装满线"标签
├── BackBtn / TipText / Hud(Rest, Score)
└── ResultPanel     结算时才出现
```

记忆要点：**视觉节点和物理碰撞体是两套独立的东西**。漏斗 PNG 只是画，真正托住水果的是 Ramp/Chute/Throat 上的隐形静态碰撞体；警戒线只是画，真正判负靠 update 里的坐标比较。

---

## 十三、一帧游戏的完整数据流

以"点击一个水果"为例串起全链路：

1. 玩家触摸 → 节点的 `TOUCH_END` 事件 → `onFruitTouch`
2. `dropStaged`：刚体 Static → Dynamic，给初速度，移出 staged
3. Box2D 每 1/60 秒模拟：重力让它下落，与 Static 水果/斜板碰撞被弹开或沿坡滚下
4. 滚进窄槽，与另一个同种 Dynamic 水果接触 → `BEGIN_CONTACT` 回调
5. 四个条件校验通过 → 下一帧 `eliminate`：光圈特效、销毁、+10 分、刷新 HUD
6. `checkState`：alive 清空？→ 过关写 localStorage、弹胜利面板
7. 与此同时 `update` 每帧都在跑：定时下坠、检查有没有水果静止堆过警戒线、满 0.5 秒 → 失败面板

---

## 十四、总结

主逻辑 522 行，但可以压缩成四个机制：

1. **地形机制**：V 型斜板（低摩擦汇聚）+ 窄槽（堆积区）+ 隐形边界，全部 Static 刚体
2. **水果机制**：生来 Static 当障碍，点击切 Dynamic 受物理支配；圆形碰撞 + 高阻尼 + 零弹性保证不乱蹦
3. **消除机制**：碰撞回调四重过滤（是水果、同种、都已掉落、未在消除中），延迟一帧安全销毁
4. **胜负机制**：清空即赢；水果静止越过桶口线持续 0.5 秒即输；定时下坠给压力

道具、音效、连击、合成升级等扩展点都没有做，后续可以在 `onBeginContact`（消除时机）、`eliminate`（得分与特效）、`levels.json`（关卡内容）这三处挂接。
