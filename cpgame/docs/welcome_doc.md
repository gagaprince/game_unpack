# 复刻第一个游戏 - 欢迎页代码讲解

> 本文逐段拆解 `Welcome.ts` 脚本，讲清楚欢迎页（main.scene）的完整逻辑：节点绑定、Logo 动画、按钮交互、场景切换。

---

## 一、文件关联机制

**问题**：`Welcome.ts` 脚本是怎么和 `main.scene` 关联起来的？

### 关联链路

1. `Welcome.ts` 脚本文件
2. `Welcome.ts.meta` 自动分配 UUID
3. 编辑器拖脚本到 Canvas 节点
4. `main.scene` 用压缩 UUID 引用脚本
5. 运行时引擎反查 UUID 实例化脚本

### 关键证据

`Welcome.ts.meta` 里的 UUID：
```
44363449-7bac-4ea1-857d-1c1c65ce3513
```

`main.scene` 第 34 个对象：
```json
{
  "__type__": "44363RJe6xOoYV9HBxlzjUT",
  "node": { "__id__": 2 }
}
```

`__type__` 字段就是压缩后的 UUID：
- 引擎内置组件：`cc.Sprite`、`cc.Label`、`cc.Button`
- **自定义脚本**：用压缩后的 UUID（前 5 位明文 + 后面 base64）

`node.__id__: 2` 表示脚本挂在 **Canvas** 节点上。

---

## 二、代码逐段讲解

### 第 1 段：导入依赖

```typescript
import { _decorator, Component, Node, Button, Label, UIOpacity, tween, Vec3, director } from 'cc';
const { ccclass } = _decorator;
```

| 模块 | 作用 |
|---|---|
| `Component` | 所有脚本的基类 |
| `Node` | 场景节点（按钮、图片、文字） |
| `Button` / `Label` | UI 组件 |
| `UIOpacity` | 控制透明度（提示淡入淡出） |
| `tween` | 补间动画（Logo 浮动、按钮按压） |
| `Vec3` | 3D 向量（scale 缩放） |
| `director` | 场景切换控制器 |

---

### 第 2 段：类声明和成员变量

```typescript
@ccclass('Welcome')
export class Welcome extends Component {
    private startButton!: Node;
    private settingButton!: Node;
    private logo!: Node;
    private tipLabel!: Label;
    private tipOpacity!: UIOpacity;
```

`@ccclass('Welcome')` 是装饰器，告诉 Cocos 这是个可挂载的脚本组件。

5 个成员变量对应场景里 5 个 UI 元素：

| 变量 | 场景节点 | 作用 |
|---|---|---|
| `startButton` | `BtnStart` | 「开始游戏」按钮 |
| `settingButton` | `BtnSetting` | 「设置」按钮 |
| `logo` | `Logo` | 游戏 Logo（做浮动动画） |
| `tipLabel` | `TipLabel` | 提示文字（"设置面板开发中"） |
| `tipOpacity` | `TipLabel` 上的 UIOpacity | 提示文字的透明度控制 |

`!` 表示"我保证后面会赋值"（避免 TypeScript 严格模式报错）。

---

### 第 3 段：start() — 场景加载完成后自动执行

```typescript
start() {
    this.startButton = this.node.getChildByPath('BtnStart')!;
    this.settingButton = this.node.getChildByPath('BtnSetting')!;
    this.logo = this.node.getChildByPath('Logo')!;
    const tipNode = this.node.getChildByPath('TipLabel');
```

`start()` 是 Cocos 生命周期函数，场景加载完自动调。

`getChildByPath('BtnStart')`：从当前节点的子节点里找叫 `BtnStart` 的节点。这些名字是在编辑器里给节点起的。

```typescript
    this.tipLabel = tipNode!.getComponent(Label)!;
    this.tipOpacity = tipNode!.getComponent(UIOpacity) || tipNode!.addComponent(UIOpacity);
    this.tipOpacity.opacity = 0;
```

从 `TipLabel` 节点上取两个组件：
- `Label`：文字内容
- `UIOpacity`：透明度控制（如果没有就动态加一个）

初始透明度设为 0（隐藏），点击设置按钮时才显示。

```typescript
    this.startButton.on(Button.EventType.CLICK, this.onStartClick, this);
    this.settingButton.on(Button.EventType.CLICK, this.onSettingClick, this);
    this.playLogoIdle();
}
```

给两个按钮绑定点击事件，最后启动 Logo 浮动动画。

---

### 第 4 段：playLogoIdle() — Logo 呼吸动画

```typescript
private playLogoIdle() {
    tween(this.logo)
        .repeatForever(
            tween()
                .to(1.2, { scale: new Vec3(1.04, 1.04, 1) }, { easing: 'sineInOut' })
                .to(1.2, { scale: new Vec3(1, 1, 1) }, { easing: 'sineInOut' })
        )
        .start();
}
```

`tween` 是 Cocos 的补间动画系统。这段意思是：

- 每 1.2 秒 Logo 从原始大小放大到 1.04 倍
- 再 1.2 秒缩回原始大小
- `sineInOut` 缓动函数让放大缩小都平滑，不生硬
- `repeatForever` 无限循环

**效果**：Logo 在欢迎页一直轻轻"呼吸"（放大缩小），让界面不呆板。

---

### 第 5 段：onStartClick() — 点击开始游戏

```typescript
private onStartClick() {
    console.log('[Welcome] start button clicked');
    director.loadScene('game');
    tween(this.startButton)
        .to(0.08, { scale: new Vec3(0.92, 0.92, 1) })
        .to(0.12, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
        .start();
}
```

点击「开始游戏」后：

1. `director.loadScene('game')`：切换到游戏场景（`game.scene`）
2. 按钮动画：先快速缩小到 0.92 倍（0.08 秒），再弹回原始大小（0.12 秒）
3. `backOut` 缓动：回弹时会稍微超过一点再回来，有物理按压感

这个"先缩小再弹回"是手游按钮的标准反馈，让玩家感觉按钮真的被按下去了。

---

### 第 6 段：onSettingClick() — 点击设置

```typescript
private onSettingClick() {
    console.log('[Welcome] setting button clicked');
    this.tipLabel.string = '设置面板开发中';
    tween(this.tipOpacity)
        .set({ opacity: 255 })
        .delay(1.2)
        .to(0.5, { opacity: 0 })
        .start();
}
```

点击「设置」后：

1. 把提示文字改成"设置面板开发中"
2. `set({ opacity: 255 })`：立即把提示文字显示出来（不透明）
3. `delay(1.2)`：停留 1.2 秒
4. `to(0.5, { opacity: 0 })`：用 0.5 秒慢慢淡出

**效果**：点设置 → 显示"开发中" → 停留一会儿 → 自动消失。

---

## 三、Canvas 节点树

```
Canvas（this.node 指向这里，Welcome 脚本挂在这）
├── Camera
├── Bg          ← 背景图（Widget 组件自动撑满屏幕）
├── Logo        ← getChildByPath('Logo')
├── BtnStart    ← getChildByPath('BtnStart')
│   └── Text     ← 按钮上的文字
├── BtnSetting  ← getChildByPath('BtnSetting')
├── Strawberry  ← 装饰草莓
└── TipLabel    ← getChildByPath('TipLabel')
```

**核心概念**：
- 脚本挂在哪，`this.node` 就是哪
- 通过 `getChildByPath` 往下找子节点
- 不是"Canvas 上挂载的所有东西都能直接拿到"，而是从 Canvas 作为入口遍历子节点树

---

## 四、Widget 组件：为什么 Bg 位置不对但预览是对的

> **常见坑：Widget 一开，手动坐标就失效了**

### 问题现象

Bg 节点的手动位置：
```
_lpos: { x: 0, y: 1948 }
```

这个 y=1948 远在屏幕上方（屏幕顶才 667），正常显示应该完全看不见。

但预览时 Bg 却是铺满整个屏幕的。

### 原因：Widget 组件强制覆盖位置

```json
{
  "__type__": "cc.Widget",
  "_alignFlags": 41,
  "_left": 795,
  "_right": 795,
  "_top": -1281,
  "_bottom": -540,
  "_originalWidth": 750,
  "_originalHeight": 1334
}
```

`_alignFlags: 41` 换算成二进制是 `101001`，表示同时启用了：
- 左对齐 + 右对齐（宽度撑满）
- 顶部对齐 + 底部对齐（高度撑满）

**Widget 运行时自动计算位置，无视你手动设的 `_lpos`。**

### Widget 的作用

解决"不同手机屏幕尺寸不一样，UI 元素怎么自适应"的问题。

| 场景 | Widget 设置 |
|---|---|
| 背景图 | 四边都对齐，撑满全屏 |
| 返回按钮 | 只贴左上角，左右上固定边距 |
| 底部横幅 | 只贴底部，左右撑满 |
| 居中弹窗 | 水平居中 + 垂直居中 |

**一句话总结**：Widget = "别管我手动摆哪，运行时自动按屏幕大小帮我贴边/居中/撑满"。

---

## 五、总结

整个欢迎页就 80 行代码，做了三件事：

1. **Logo 呼吸动画**（让界面有活力）
2. **开始按钮**（点击切换到游戏场景）
3. **设置按钮**（占位，显示"开发中"提示）

没有复杂逻辑，就是个入口页。
