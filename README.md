# 山东专升本计算机系统笔记

[打开网站](https://mobius608955255-dev.github.io/computer-interaction-notes/?v=43)

根据2020—2026年山东专升本计算机真题整理，保留教材11章结构。460道题归并为220条知识笔记，每题可追溯年份、题号与所属知识点。Windows和Office操作按Windows 10 / Office 2016口径解释；发现扫描答案错误时，以可靠标准纠正并说明边界。

## 开发

需要Node 24及以上。站点是可直接发布到GitHub Pages的静态HTML、CSS与JavaScript，不需要生产服务器或运行时依赖。

```sh
npm ci
npm run check
```

`check`先生成静态页面，再运行行为回归。只修改内容时可用`npm run build`。生成物随源码提交，CI会检查它们是否一致；CI只检查，不改写或自动提交代码。

## 文件职责

| 文件 | 维护位置与职责 |
|---|---|
| `content/chapter1.json`—`chapter11.json` | 每条笔记唯一的正文记录，保留稳定ID、来源与章节归属 |
| `content/chapters.json` | 教材目录 |
| `content/references.json` | 知识点的标准参考来源 |
| `content/legacy-demos.json` | 86个旧场景的步骤或选择元数据 |
| `templates/`、`scripts/build.cjs` | 页面模板与确定性构建；按章生成数据，首页只加载目录摘要 |
| `generated/`、`chapter*.html`、`index.html` | 生成物，不直接修改 |
| `site.config.json` | 全站资源及内链共用的版本号 |
| `notes-app.js` | 阅读、搜索、目录、卡片挂载和保留的旧场景事件 |
| `notes-choices.js` | 页面内单选控件、键盘与焦点行为 |
| `note-labs-runtime.js` | 演示注册、输入分发、重绘、指针与计时器生命周期，以及纯文本转义 |
| `note-labs*.js`（除runtime） | 独立知识点模型；按主题扩展其原定义 |
| `simulations.js` | 仍在使用的旧场景，每个场景只保留最终一份定义 |
| `tests/notes-regression.cjs` | 来源、真实页面加载顺序、状态变化与计算边界回归 |
| `tests/layout.html` | 可手动使用的同源布局检查工具，不是学习入口 |

## 继续修改时

1. 编辑对应章节的正文记录，扩展原模型。不要新增“最后覆盖一次”的内容补丁或重复注册；注册器遇到重复模型或别名会报错。
2. 模型通过`initial/render/action/change`维护状态，`render`只呈现状态。拖动、异步动作和计时可使用运行时提供的钩子，不在模型中另建全局监听或无人清理的计时器。
3. 用户输入必须用`NOTE_LABS.ui.esc`纯转义，不能先解码用户写入的实体。重置先卸载旧模型；收起取消未完成的手势并恢复已提交画面。
4. 增加或修正行为时，测试实际可观察结果和重要边界。测试从章节HTML读取脚本顺序，避免另维护一套与生产不同的入口。
5. 修改`site.config.json`版本号，运行构建与回归，提交源码和生成物。GitHub Pages继续从原仓库发布。

每章当前加载8—9个脚本，未压缩JS总量约312—488KB，较v42减少55%—67%；这是静态资源体积，不是实测网络时间。新版保留220个笔记ID和460条来源映射。

本轮核对、修正与验证见[AUDIT-2026-09-06.md](AUDIT-2026-09-06.md)。旧版本记录见[docs/HISTORY.md](docs/HISTORY.md)，其中旧文件名和测试数量仅反映当时状态。

演示仍是围绕考点的局部教学模型；来源齐全不等于覆盖完整考纲，也不等同于完整Office软件。
