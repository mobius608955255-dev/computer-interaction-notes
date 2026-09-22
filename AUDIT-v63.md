# AUDIT-v63

v63 是在冻结 v62（`319f06b` / tree `f1421f8e`）上的 UX / 视觉系统打磨。

知识正文、顺序、note ID、points、anchor 语义、搜索排序、Windows / Word / Excel 拟真内核均不改。

## 范围

1. 共享 token 与笔记外壳按钮（消灭原生「展开操作区」）
2. 字体层级：核心结论；H4 ≥ H5 的单调视觉层级
3. 同节轻分隔
4. 目录辅助色对比度 ≥ 4.5:1
5. 搜索命中高亮：首页摘要 mark、章内标题 / 正文命中、保留现有命中段落紫条
6. 子主题芯片压缩：不删除、不 sticky、保留合理触控面积
7. 390px：清空 / 搜索全部约 40–44px；仅在确实横向溢出的表显示 scroll hint
8. 实验室外壳 containment
9. 第4章公式 / 公式型内容等宽显示
10. 极短交互反馈 + `prefers-reduced-motion`
11. 第1–4章完整桌面 / 390px 验证
12. 第5 / 第11章共享回归

## 不改

知识正文、v62 知识顺序、note / point 锚点、搜索语义、默认折叠、搜索条 sticky、第3章目录删减或扁平化、Windows / Word / Excel 拟真内核重绘、首页大改、大 hero、玻璃拟态、强渐变 / 发光、重卡片墙、暗色模式、新框架、架构重构、大型图标库、P2 polish 自动扩入。

## 实现要点

- `.shell-btn` / `.shell-btn-primary` 统一「展开操作区」「重置演示」「返回笔记」
- `.conclusion` 左侧 2px 强调条、字重 500
- `.note-point-group h4` 18/700 ink；H5 16/650；H6 15/650
- 同节 `.note-item + .note-item` 内阴影细线
- 目录 / 辅助小字加深到约 `#5e4a6a`（目录 h2 实测对比约 7.88:1）
- `NOTE_SEARCH.highlight`：先 HTML escape，再包 `<mark>`；不改检索
- `.note-subtopics` 桌面 13px / min-height 32；窄屏 14px / min-height 40
- `#clear-search` 44×44；`#search-all` min-height 44
- 溢出表才插入 `.table-hint`
- `.reality-demo { isolation:isolate }`；`.simulation-mount` 局部滚动 + contain
- `.note-formula` 与第4章公式输入等宽，中文解释保持原字体

## 验证

`content/*.json` 与 v62 字节一致。第1–4章卡片 19 / 28 / 42 / 46，合计 135。完整回归 271/271。390px 第1–4 / 5 / 11 章 overflow=0、issues=[]。

最终 commit / tree 由仓库外恢复包 `UX与视觉系统优化_v63_本地恢复与验收.zip` 记录，避免自指提交 ID。仅本地冻结，不 push、不 deploy。
