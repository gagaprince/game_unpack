# wxrestore — 微信小游戏 Cocos Creator 构建产物还原工具

把**微信小游戏解包目录**（Cocos Creator 3.x，已在 3.8.8 构建产物上验证）
还原成可以用同版本 Cocos Creator 正常打开的工程。

详细中文使用说明见 [使用文档.md](./使用文档.md)（环境准备、参数、验收标准、报告字段解读、常见问题、新案例回归流程）。


## 用法

```bash
# 1) 还原（编辑器路径可省略，默认取 /Applications/Cocos/Creator 下最新版本）
python3 restore.py <解包目录> <输出工程目录> \
    --name my-game \
    --editor /Applications/Cocos/Creator/3.8.8/CocosCreator.app

# 2) 无头校验（引用完整性 / 脚本壳 / JSON 合法性）
python3 verify.py <输出工程目录> --src <解包目录>
# ok:true 表示无硬错误（degraded-ref 为 B 档策略内的材质等悬空引用）
```

输出工程用 Cocos Creator 3.8.8 直接「打开已有项目」即可，首次打开会
自动导入资源并编译脚本。依赖：Python 3.9+（仅标准库）；Pillow 为可选依赖，仅图集裁帧需要。

## 还原档位

- **A 档**：全部可还原资产（散图/图集裁帧、音频、粒子 plist、Json、
  AnimationClip、场景、全部 Prefab，含嵌套 Prefab），UUID 与原工程一致，
  跨 bundle 引用、跨 bundle native 纹理自动归位；工程设置（设计分辨率、
  物理分组与碰撞矩阵、启动场景）从 `src/settings.json` 恢复。
- **B 档（本工具当前目标）**：A 档 + 自定义组件**空壳脚本**：
  保留原脚本压缩 UUID 与 `@ccclass('<原压缩id>')`，按扫描到的字段生成
  `@property` 声明（类型推断为 Node/Asset/值类型/数组等），方法体为空。
  组件因此能正常挂载、属性值能反序列化显示，但游戏逻辑不可执行。

## 模块

| 文件 | 职责 |
| --- | --- |
| `wxrestore/packed.py` | packed JSON v1 解包 |
| `wxrestore/msgpack_codec.py` | CCON msgpack 编解码（大端多字节数值） |
| `wxrestore/ccon.py` | CCON 二进制解析 + RealCurve chunk 解码 + 转编辑器文档 |
| `wxrestore/uuid.py` | 官方 UUID 压缩/解压、脚本类型 id 判定 |
| `wxrestore/bundle.py` | bundle（config/index/import/native）通用读取 |
| `wxrestore/indexer.py` | 跨 bundle 全局资产索引 |
| `wxrestore/editorize.py` | 运行时对象图 → 编辑器扁平序列化数组（场景/Prefab/嵌套 Prefab） |
| `wxrestore/images.py` | 图集 SpriteFrame 裁帧（rect/旋转/offset 反推，PIL） |
| `wxrestore/metas.py` | 各类资产/目录/脚本 meta 生成（版本号对齐 3.8.8） |
| `wxrestore/scripts_shell.py` | B 档组件空壳 `.ts` + meta |
| `wxrestore/builtins.py` | 扫描编辑器内置资产 UUID 黑名单 |
| `wxrestore/project.py` | 工程骨架（settings/profiles/tsconfig/物理与分辨率配置） |
| `wxrestore/writer.py` | 资产写入编排与脚本字段扫描 |
| `verify.py` | 无头完整性校验 |
| `legacy/`、`work/` | 早期案例分析/调试脚本，存档勿引用 |

## 明确降级项（无法从构建产物恢复，均有依据）

- **自定义材质 / Effect**：构建包只含编译后的 EffectAsset 描述与
  GLSL，不含 `.effect` 源文件，不重建；悬空材质引用由引擎自动回退内置材质。
- **SpriteAtlas / AutoAtlas 资产**：不重建图集资产本体，帧以独立散图导出，
  UUID 保持不变，引用不断。
- **脚本方法体**：编译产物不含 TS 源码，只生成属性壳。
- **缺失分包**：解包目录中不存在的分包（`game.json` 已声明）只能在
  `restore-report.json` 的 `missing_bundles` 中列出，其资产引用无法恢复。
- **嵌套 Prefab 实例（实验性）**：含 prefab 套 prefab 的资源，其节点树/组件/属性/子
  prefab 引用都能完整还原并正常打开，但编辑器在识别实例根的 prefab 关联时会报
  `getOutMostPrefabInstanceInfo ... root node has loop` 告警（构建产物缺少编辑器侧
  `mountedChildren/mountedComponents` 挂载描述，`prefabRootNode` 自指无法消解）。
  不影响查看、运行时实例化和非嵌套部分的编辑。本案例 107 个 prefab 中仅 1 个命中。
- **引擎内置资产**：构建包内夹带的内置资源（default_ui 图、内置粒子等）
  不落盘，UUID 引用直接解析到编辑器自带副本，避免 UUID 冲突。

## 已验证案例

- `wxf41b76649658b9e3`（合成大西瓜类，7 个 bundle 在盘）：
  111 prefab + 1 场景 + 24 脚本壳 + 391 图 + 24 音频 + 3 anim + 2 粒子，
  `verify.py` 零硬错误；单 Prefab 已在真实 3.8.8 编辑器闭环验证
  （节点层级/层/SpriteFrame/UITransform/碰撞点/RigidBody2D/UIOpacity）。
