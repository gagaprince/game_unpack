# cpgame —— 消除类微信小游戏复刻工程

- 引擎：Cocos Creator 3.8.8（模板：Empty(2D)，已裁剪为 2D 配置）
- 平台：微信小游戏（竖屏）
- 设计分辨率：750 × 1334（fit 策略在主场景 Canvas 上设置）
- 物理：Box2D（physics-2d-box2d 已在引擎模块中启用）
- 动画：Spine / DragonBones / tween 均已启用
- 参考分析：`../项目文档_wxf41b76649658b9e3.md`

## 目录结构

```
assets/
├── scene/          # 场景（启动场景 main.scene 待创建）
├── scripts/
│   ├── core/       # 框架层：事件、资源加载、状态机、单例基类
│   ├── game/       # 玩法层：小车、水果、物理消除、障碍、道具、关卡
│   ├── ui/         # 界面：主界面、关卡界面、结算、复活、设置、图鉴、排行
│   ├── system/     # 音频、存档、主题、排行榜（开放数据域）、广告封装
│   ├── data/       # 关卡/段位/主题等配置表与数据结构
│   └── utils/      # 工具
└── res/
    ├── texture/    # 散图
    ├── atlas/      # 自动图集
    ├── prefab/     # 预制体（eff/game/ui 分组）
    ├── audio/      # BGM 与音效
    ├── anim/       # Spine / 动画
    └── config/     # 关卡等配置（先用明文 JSON，上线前再加密）
build-templates/    # 微信小游戏构建模板（game.json/project.config.json 定制）
```

## 常用操作

- 打开工程：Cocos Dashboard → 项目 → 打开本目录；或命令行：
  `/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator --project .`
- 预览：编辑器顶部 ▶（浏览器预览）；微信预览需先在「项目 → 项目设置 → 功能裁剪」确认模块，再构建发布到微信小游戏，用微信开发者工具打开 `build/wechatgame`。
- 微信开发者工具需开启「服务端口」（设置 → 安全设置），Creator 才能自动唤起调试。

## 复刻里程碑（建议顺序）

1. 主场景 + 竖屏 Canvas + 基础 UI 框架（Layer 管理、事件总线）
2. Box2D 水果投放/堆叠/相同碰撞消除核心手感
3. 小车、坑位、障碍、道具与胜负判定
4. 关卡配置表与进度存档
5. 特效与音频
6. 元系统：图鉴、主题、段位、排行榜开放数据域、复活/广告
7. 微信构建、分包、真机适配与上线加固
