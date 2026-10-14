import {
    _decorator, Component, Node, Sprite, SpriteFrame, resources, Graphics, Color,
    RigidBody2D, CircleCollider2D, BoxCollider2D, Contact2DType, Collider2D,
    Label, Button, UITransform, UIOpacity, tween, Vec2, Vec3, Size,
    PhysicsSystem2D, IPhysics2DContact, director, ERigidBody2DType,
} from 'cc';
import { Fruit } from './Fruit';
import { LevelConfig, LevelData } from '../data/LevelConfig';
const { ccclass } = _decorator;

const DESIGN_W = 750;
const DESIGN_H = 1334;

const WALL_T = 40;
const INNER_HALF_W = 335;

const BOX_RIM_Y = -400;  // 判负线：桶口（V型草坡收窄到竖槽处），堆过此线即桶满溢出
const FUNNEL_TOP_Y = -250;  // V型草坡外端（高位，宽口）
const CLIFF_Y = -400;       // V型草坡内端 = 竖槽口 = 桶口
const THROAT_Y = -660;      // 窄槽平底（托盘）
const RAMP_OUTER_X = 375;   // 斜板外端 x
const RAMP_INNER_X = 50;    // 斜板内端 x（窄槽半宽）
const FUNNEL_H = 410;       // 漏斗素材渲染高度（-250 到 -660）
// 斜板摩擦要低，保证水果落上后一定能向中心滚下；否则会死局
const RAMP_FRICTION = 0.15;
const FRUIT_FRICTION = 0.55;
const CHUTE_FRICTION = 0.4;

const FRUIT_RADIUS = 40;
// 所有水果统一大小

// 关卡数据从 levels.json 加载
const STORAGE_LEVEL_KEY = 'cpgame_level';

const MAX_LEVEL = 5;
const OVERFLOW_HOLD = 0.5;
const OVERFLOW_MIN_Y = 100;  // 水果 y 低于此值才算进入桶区；顶部被挡的水果不计入判负
const LEVEL_RADII = [FRUIT_RADIUS, FRUIT_RADIUS, FRUIT_RADIUS, FRUIT_RADIUS, FRUIT_RADIUS,
    FRUIT_RADIUS, FRUIT_RADIUS, FRUIT_RADIUS, FRUIT_RADIUS, FRUIT_RADIUS, FRUIT_RADIUS];

@ccclass('GameRoot')
export class GameRoot extends Component {
    private frames: SpriteFrame[] = [];
    private fruitsRoot!: Node;
    private readonly staged: Fruit[] = [];
    private readonly alive = new Set<Fruit>();
    private readonly eliminating = new Set<Fruit>();
    private overflowTimer = 0;
    private stageTimer = 0;
    private over = false;
    private score = 0;
    private scoreLabel: Label | null = null;
    private restLabel: Label | null = null;
    private funnelSprite: Sprite | null = null;
    private currentLevel = 1;
    private levelData: LevelData | null = null;
    private descendInterval = 20;
    private descendStep = 30;

    start() {
        this.currentLevel = parseInt(localStorage.getItem(STORAGE_LEVEL_KEY) || '1', 10) || 1;
        this.setupPhysics();
        this.buildWorld();
        this.buildUI();
        resources.load('textures/funnel/spriteFrame', SpriteFrame, (err, sf) => {
            if (err) { console.warn('[GameRoot] funnel load failed', err && err.message || err); return; }
            if (!this.funnelSprite) return;
            this.funnelSprite.spriteFrame = sf || null;
        });
        LevelConfig.load((levels) => {
            this.levelData = LevelConfig.getLevel(this.currentLevel);
            if (!this.levelData) {
                this.levelData = levels[0];
                this.currentLevel = this.levelData ? this.levelData.level : 1;
            }
            if (this.levelData) {
                this.descendInterval = this.levelData.descendInterval;
                this.descendStep = this.levelData.descendStep;
            }
            resources.loadDir('textures/fruits', SpriteFrame, (err, assets) => {
                if (err) {
                    console.error('[GameRoot] load fruit textures failed', err);
                    return;
                }
                this.frames = (assets as SpriteFrame[]).sort(
                    (a, b) => this.levelIndex(a.name) - this.levelIndex(b.name));
                this.buildStage();
                this.refreshHud();
            });
        });
    }

    private levelIndex(name: string): number {
        const m = /level(\d+)/.exec(name);
        return m ? parseInt(m[1], 10) : 99;
    }

    private setupPhysics() {
        const sys = PhysicsSystem2D.instance;
        sys.gravity = new Vec2(0, this.levelData ? this.levelData.gravity : -750);
        sys.allowSleep = true;
        sys.autoSimulation = true;
        sys.fixedTimeStep = 1 / 60;
    }

    private buildWorld() {
        const wallsRoot = new Node('Walls');
        wallsRoot.layer = this.node.layer;
        this.node.addChild(wallsRoot);

        // 水果层加到背景墙之上渲染，避免被漏斗/墙体盖住
        this.fruitsRoot = new Node('Fruits');
        this.fruitsRoot.layer = this.node.layer;
        this.node.addChild(this.fruitsRoot);

        // 漏斗底图（原游戏素材：草皮土坡向中心收拢）
        const funnelNode = new Node('Funnel');
        funnelNode.layer = wallsRoot.layer;
        wallsRoot.addChild(funnelNode);
        funnelNode.setPosition(0, FUNNEL_TOP_Y - FUNNEL_H / 2);
        funnelNode.addComponent(UITransform).setContentSize(750, FUNNEL_H);
        this.funnelSprite = funnelNode.addComponent(Sprite);
        this.funnelSprite.sizeMode = Sprite.SizeMode.CUSTOM;

        // 左右斜板（倒圆锥）：水果落上后向中心滚动，到内端落入窄槽
        const dx = RAMP_OUTER_X - RAMP_INNER_X;
        const dy = FUNNEL_TOP_Y - CLIFF_Y;
        const rampLen = Math.sqrt(dx * dx + dy * dy);
        const rampAngle = Math.atan2(dy, dx) * 180 / Math.PI;
        const rampMidY = (FUNNEL_TOP_Y + CLIFF_Y) / 2;
        this.addRamp(wallsRoot, 'RampL', -(RAMP_OUTER_X + RAMP_INNER_X) / 2, rampMidY,
            rampLen, 30, -rampAngle);
        this.addRamp(wallsRoot, 'RampR', (RAMP_OUTER_X + RAMP_INNER_X) / 2, rampMidY,
            rampLen, 30, rampAngle);

        // 窄槽：内端竖直侧壁 + 平底，水果在此堆积
        const wallT = 20;
        const chuteH = CLIFF_Y - THROAT_Y;
        this.addWall(wallsRoot, 'ChuteL', -RAMP_INNER_X - wallT / 2,
            THROAT_Y + chuteH / 2, wallT, chuteH + 24);
        this.addWall(wallsRoot, 'ChuteR', RAMP_INNER_X + wallT / 2,
            THROAT_Y + chuteH / 2, wallT, chuteH + 24);
        this.addWall(wallsRoot, 'Throat', 0, THROAT_Y - 12, RAMP_INNER_X * 2 + wallT, 24);

        // 左右隐形墙：防止水果滚出画布（不画任何视觉）
        const boundaryX = 392;  // 画布边缘外，避免与斜板重叠
        const boundaryTop = 667;  // 从画布顶开始
        const boundaryH = boundaryTop - THROAT_Y;
        const boundaryY = (boundaryTop + THROAT_Y) / 2;
        this.addInvisibleWall(wallsRoot, 'BoundaryL', -boundaryX, boundaryY, 20, boundaryH);
        this.addInvisibleWall(wallsRoot, 'BoundaryR', boundaryX, boundaryY, 20, boundaryH);

        const line = new Node('RimLine');
        line.layer = this.node.layer;
        this.node.addChild(line);
        const g = line.addComponent(Graphics);
        g.lineWidth = 3;
        g.strokeColor = new Color(230, 70, 70, 200);
        for (let x = -INNER_HALF_W; x < INNER_HALF_W; x += 28) {
            g.moveTo(x, BOX_RIM_Y);
            g.lineTo(Math.min(x + 14, INNER_HALF_W), BOX_RIM_Y);
        }
        g.stroke();

        const tag = new Node('LineTag');
        tag.layer = line.layer;
        line.addChild(tag);
        tag.setPosition(INNER_HALF_W - 66, BOX_RIM_Y + 20);
        tag.addComponent(UITransform).setContentSize(120, 30);
        const tagLabel = tag.addComponent(Label);
        tagLabel.string = '装满线';
        tagLabel.fontSize = 22;
        tagLabel.lineHeight = 30;
        tagLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        tagLabel.color = new Color(230, 70, 70, 230);
    }

    private addWall(parent: Node, name: string, x: number, y: number, w: number, h: number) {
        const node = new Node(name);
        node.layer = parent.layer;
        parent.addChild(node);
        node.setPosition(x, y);
        node.addComponent(UITransform).setContentSize(w, h);
        const g = node.addComponent(Graphics);
        g.fillColor = new Color(120, 86, 50, 255);
        g.roundRect(-w / 2, -h / 2, w, h, 10);
        g.fill();
        const body = node.addComponent(RigidBody2D);
        body.type = ERigidBody2DType.Static;
        const col = node.addComponent(BoxCollider2D);
        col.size = new Size(w, h);
        col.restitution = 0.02;
        col.friction = CHUTE_FRICTION;
    }

    private addInvisibleWall(parent: Node, name: string, x: number, y: number, w: number, h: number) {
        const node = new Node(name);
        node.layer = parent.layer;
        parent.addChild(node);
        node.setPosition(x, y);
        node.addComponent(UITransform).setContentSize(w, h);
        const body = node.addComponent(RigidBody2D);
        body.type = ERigidBody2DType.Static;
        const col = node.addComponent(BoxCollider2D);
        col.size = new Size(w, h);
        col.restitution = 0.1;
        col.friction = 0.3;
    }

    private addRamp(parent: Node, name: string, x: number, y: number, w: number, h: number, angle: number) {
        const node = new Node(name);
        node.layer = parent.layer;
        parent.addChild(node);
        node.setPosition(x, y);
        node.angle = angle;
        node.addComponent(UITransform).setContentSize(w, h);
        const g = node.addComponent(Graphics);
        // 只画草皮唇边，土坡身体由漏斗底图 PNG 呈现
        g.fillColor = new Color(106, 166, 24, 255);
        g.roundRect(-w / 2, h / 2 - 13, w, 16, 8);
        g.fill();
        const body = node.addComponent(RigidBody2D);
        body.type = ERigidBody2DType.Static;
        const col = node.addComponent(BoxCollider2D);
        col.size = new Size(w, h);
        col.restitution = 0.02;
        col.friction = RAMP_FRICTION;
    }

    private buildUI() {
        const back = this.makeButton('BackBtn', '‹ 返回', -300, 620, 120, 48,
            new Color(255, 255, 255, 200));
        this.node.addChild(back);
        back.on(Button.EventType.CLICK, () => director.loadScene('main'));

        const tipNode = new Node('TipText');
        tipNode.layer = this.node.layer;
        this.node.addChild(tipNode);
        tipNode.setPosition(80, 560);
        tipNode.addComponent(UITransform).setContentSize(400, 32);
        const tip = tipNode.addComponent(Label);
        tip.string = '点击顶部水果掉落 · 同色水果落入漏斗后自动消除';
        tip.fontSize = 26;
        tip.lineHeight = 32;
        tip.color = new Color(90, 70, 40, 255);
        tip.enableOutline = true;
        tip.outlineColor = new Color(255, 255, 255, 200);
        tip.outlineWidth = 3;

        const hud = new Node('Hud');
        hud.layer = this.node.layer;
        this.node.addChild(hud);
        hud.setPosition(0, 620);
        hud.addComponent(UITransform).setContentSize(620, 40);

        const mkLabel = (name: string, x: number, align: number) => {
            const n = new Node(name);
            n.layer = hud.layer;
            hud.addChild(n);
            n.setPosition(x, 0);
            n.addComponent(UITransform).setContentSize(300, 40);
            const l = n.addComponent(Label);
            l.fontSize = 28;
            l.lineHeight = 36;
            l.horizontalAlign = align;
            l.color = new Color(70, 55, 30, 255);
            l.enableOutline = true;
            l.outlineColor = new Color(255, 255, 255, 210);
            l.outlineWidth = 3;
            return l;
        };
        this.restLabel = mkLabel('Rest', -60, Label.HorizontalAlign.RIGHT);
        this.scoreLabel = mkLabel('Score', 180, Label.HorizontalAlign.RIGHT);
    }

    private makeButton(name: string, text: string, x: number, y: number, w: number, h: number, bg: Color): Node {
        const node = new Node(name);
        node.layer = this.node.layer;
        node.setPosition(x, y);
        node.addComponent(UITransform).setContentSize(w, h);
        const g = node.addComponent(Graphics);
        g.fillColor = bg;
        g.roundRect(-w / 2, -h / 2, w, h, h / 2);
        g.fill();
        const labNode = new Node('Label');
        labNode.layer = node.layer;
        node.addChild(labNode);
        labNode.addComponent(UITransform).setContentSize(w, h);
        const lab = labNode.addComponent(Label);
        lab.string = text;
        lab.fontSize = 28;
        lab.lineHeight = 34;
        lab.color = new Color(80, 50, 20, 255);
        const btn = node.addComponent(Button);
        btn.transition = Button.Transition.SCALE;
        btn.zoomScale = 0.92;
        return node;
    }

    private buildStage() {
        if (!this.levelData) return;
        for (const f of this.levelData.fruits) {
            const fruit = this.createStagedFruit(f.level, f.x, f.y);
            this.staged.push(fruit);
            this.alive.add(fruit);
        }
    }

    private createStagedFruit(level: number, x: number, y: number): Fruit {
        const r = LEVEL_RADII[level - 1];
        const node = new Node(`Fruit_${level}`);
        node.layer = this.fruitsRoot.layer;
        this.fruitsRoot.addChild(node);
        node.setPosition(x, y);
        node.addComponent(UITransform).setContentSize(r * 2, r * 2);
        const sp = node.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.CUSTOM;
        sp.spriteFrame = this.frames[level - 1] || null;
        const fruit = node.addComponent(Fruit);
        fruit.level = level;
        fruit.dropped = false;
        // 创建时即挂刚体+碰撞体：初始 Static（未点击是障碍），点击时切 Dynamic
        const body = node.addComponent(RigidBody2D);
        body.type = ERigidBody2DType.Static;
        body.gravityScale = 1;
        body.linearDamping = 0.15;
        body.angularDamping = 0.6;
        body.enabledContactListener = true;
        const col = node.addComponent(CircleCollider2D);
        col.radius = r;
        col.restitution = 0.0;
        col.friction = FRUIT_FRICTION;
        col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        node.on(Node.EventType.TOUCH_END, () => this.onFruitTouch(fruit), this);
        return fruit;
    }

    private onFruitTouch(fruit: Fruit) {
        if (this.over) return;
        if (!fruit.node || !fruit.node.isValid) return;
        // 只有顶部待投放的水果可点击；已掉落的水果由漏斗物理自然滚落消除
        if (!fruit.dropped) this.dropStaged(fruit);
    }

    private dropStaged(fruit: Fruit) {
        const i = this.staged.indexOf(fruit);
        if (i >= 0) this.staged.splice(i, 1);

        // 直接把刚体从 Static 切到 Dynamic，物理组件保持不变
        const body = fruit.node.getComponent(RigidBody2D);
        body.type = ERigidBody2DType.Dynamic;
        body.linearVelocity = new Vec2(0, -60);

        fruit.dropped = true;
        this.refreshHud();
        tween(fruit.node)
            .to(0.08, { scale: new Vec3(1.08, 1.08, 1) })
            .to(0.08, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    private onBeginContact(selfCol: Collider2D, otherCol: Collider2D, _c: IPhysics2DContact | null) {
        const a = selfCol.getComponent(Fruit);
        const b = otherCol.getComponent(Fruit);
        if (!a || !b || a === b) return;
        if (a.level !== b.level) return;
        if (!a.dropped || !b.dropped) return;
        if (this.eliminating.has(a) || this.eliminating.has(b)) return;
        this.eliminating.add(a);
        this.eliminating.add(b);
        this.scheduleOnce(() => this.eliminate(a, b));
    }

    private eliminate(a: Fruit, b: Fruit) {
        this.eliminating.delete(a);
        this.eliminating.delete(b);
        for (const f of [a, b]) {
            if (!f.node || !f.node.isValid) continue;
            this.spawnPop(f.level, f.node.position);
            f.node.destroy();
            this.alive.delete(f);
            this.score += 10;
        }
        this.refreshHud();
        this.scheduleOnce(() => this.checkState());
    }

    private spawnPop(level: number, at: Vec3) {
        const pop = new Node('Pop');
        pop.layer = this.fruitsRoot.layer;
        this.fruitsRoot.addChild(pop);
        pop.setPosition(at.x, at.y, 0);
        pop.addComponent(UITransform).setContentSize(10, 10);
        const g = pop.addComponent(Graphics);
        g.fillColor = new Color(255, 238, 120, 220);
        g.circle(0, 0, LEVEL_RADII[level - 1]);
        g.fill();
        const op = pop.addComponent(UIOpacity);
        tween(pop).to(0.2, { scale: new Vec3(1.7, 1.7, 1) }).start();
        tween(op).to(0.2, { opacity: 0 }).call(() => pop.destroy()).start();
    }

    private refreshHud() {
        if (this.restLabel) this.restLabel.string = `剩余 ${this.alive.size}`;
        if (this.scoreLabel) this.scoreLabel.string = `得分 ${this.score}`;
    }

    update(dt: number) {
        if (this.over) return;

        // 定时下坠：每隔 descendInterval 秒，未点击水果整体下移
        this.stageTimer += dt;
        if (this.stageTimer >= this.descendInterval) {
            this.stageTimer -= this.descendInterval;
            this.descendStage();
        }

        let overflow = false;
        if (this.alive.size > 0) {
            for (const f of this.alive) {
                if (!f.dropped || !f.node.isValid) continue;
                const body = f.node.getComponent(RigidBody2D);
                // 判断静止：线速度和角速度都接近0
                const linSpeed = body ? body.linearVelocity.lengthSqr() : 0;
                const angSpeed = body ? Math.abs(body.angularVelocity) : 0;
                const isResting = !body || (linSpeed < 4 && angSpeed < 0.5);
                const inBucket = f.node.position.y < OVERFLOW_MIN_Y;
                if (inBucket && f.node.position.y > BOX_RIM_Y && isResting) {
                    overflow = true;
                    break;
                }
            }
        }
        if (overflow) {
            this.overflowTimer += dt;
            if (this.overflowTimer >= OVERFLOW_HOLD) this.showResult(false);
        } else {
            this.overflowTimer = Math.max(0, this.overflowTimer - dt * 2);
        }
    }

    private descendStage() {
        for (const f of this.staged) {
            if (!f.node || !f.node.isValid) continue;
            f.node.setPosition(f.node.position.x, f.node.position.y - this.descendStep);
        }
        // 未点击的水果压到桶口附近 => 桶满判负
        for (const f of this.staged) {
            if (!f.node || !f.node.isValid) continue;
            if (f.node.position.y < FUNNEL_TOP_Y + 100) {
                this.showResult(false);
                return;
            }
        }
    }

    private checkState() {
        if (this.over) return;
        if (this.alive.size === 0 && this.staged.length === 0) {
            const next = this.currentLevel + 1;
            if (next <= LevelConfig.maxLevel) {
                localStorage.setItem(STORAGE_LEVEL_KEY, String(next));
            }
            this.showResult(true);
        }
    }

    private showResult(win: boolean) {
        if (this.over) return;
        this.over = true;

        const panel = new Node('ResultPanel');
        panel.layer = this.node.layer;
        this.node.addChild(panel);
        panel.addComponent(UITransform).setContentSize(DESIGN_W, DESIGN_H);
        panel.addComponent(Button);

        const g = panel.addComponent(Graphics);
        g.fillColor = new Color(0, 0, 0, 140);
        g.rect(-DESIGN_W / 2, -DESIGN_H / 2, DESIGN_W, DESIGN_H);
        g.fill();

        const titleNode = new Node('Title');
        titleNode.layer = panel.layer;
        panel.addChild(titleNode);
        titleNode.setPosition(0, 150);
        titleNode.addComponent(UITransform).setContentSize(560, 90);
        const title = titleNode.addComponent(Label);
        title.string = win ? '过关啦' : '装不下啦';
        title.fontSize = 64;
        title.lineHeight = 80;
        title.color = new Color(255, 255, 255, 255);
        title.enableOutline = true;
        title.outlineColor = win ? new Color(70, 160, 60, 255) : new Color(180, 60, 60, 255);
        title.outlineWidth = 6;

        const subNode = new Node('Sub');
        subNode.layer = panel.layer;
        panel.addChild(subNode);
        subNode.setPosition(0, 70);
        subNode.addComponent(UITransform).setContentSize(560, 50);
        const sub = subNode.addComponent(Label);
        sub.string = win ? `得分 ${this.score}` : `已消除 ${this.score / 10} 个水果`;
        sub.fontSize = 34;
        sub.lineHeight = 44;
        sub.color = new Color(255, 245, 210, 255);

        const retry = this.makeButton('RetryBtn', '再来一次', 0, -30, 300, 96,
            new Color(120, 210, 90, 255));
        panel.addChild(retry);
        retry.getChildByName('Label')!.getComponent(Label)!.fontSize = 38;
        retry.on(Button.EventType.CLICK, () => director.loadScene('game'));

        const backHome = this.makeButton('HomeBtn', '返回主页', 0, -160, 240, 80,
            new Color(255, 255, 255, 230));
        panel.addChild(backHome);
        backHome.on(Button.EventType.CLICK, () => director.loadScene('main'));

        panel.setScale(0.8, 0.8, 1);
        tween(panel).to(0.22, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }).start();
    }
}
