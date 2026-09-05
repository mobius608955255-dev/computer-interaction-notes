# 2021 补充及全卷复核：修复记录

状态：2021与全卷复核已完成。v30修复长公式折行及求解对话框背景输入；v31补上窄屏画布尺寸与文本框边界。下面保留问题及修复记录。

## 已完成读取

- 2021：题目10页、答案13页，60题全部逐页视觉核读。
- `notes-2021-data.js`：60题映射，16条新增笔记，其余归并；全部11章已接入。
- `note-labs-2021.js`：16个独立演示已接入；含文本框拖动、CSV逐页导入、填充、数据验证与单变量求解。
- 回归测试确认220条笔记、460个来源，全部笔记可打开、重置、收起。
- 第二轮原卷复核：2022年75题、2023年70题、2024年70题逐页完成。

## 资料读取已恢复

- 资料库中2020—2026题目及答案14份均存在，不需要用户重新上传。
- 2020题卷10页、答案12页，65题全部视觉核读；2025题卷10页、答案1页，60题核读；2026题卷10页、答案7页，60题核读。
- 2021已核读60题；2022已核读75题；2023、2024各70题。合计460题。
- 220条笔记按11章归并，每题来源唯一。来源连续性与内容/行为正确性分别检查。

## 已定位并在v29修复：代码/状态确定问题

1. 本章搜索后点击目录，目标仍hidden；hashchange也需恢复目标。
2. 全局 `/` 快捷键劫持contenteditable/IME及模态抽屉焦点。
3. Word y2023q56：关闭修订时old=draft，隐式接受已有修改；须分离tracking与pending。
4. 透视表y2024q67移除筛选字段不清filter；层级行目前平铺而非分组小计。
5. 标尺y2022q24缺右缩进、页边距，整段左缩进独立限幅破坏首行相对差。
6. merged-20自然连接结果漏性别列；merged-21 SQL不能改查询，只触发提示。
7. y2026q28检索率是硬编码并与文献集合不一致。
8. y2026q6第5特征图标undefined；GCD对小数/非数/0的输入校验和陈旧结果错误。
9. y2026q42含糊伪代码模式在改数后又输出最大值。
10. y2023q69循环计数无数据，固定声称7人不及格。
11. y2023q17地址可改但C类/192的反馈固定。
12. y2020q2选A却反馈B；y2020q24右键拖放菜单项是不能操作的span。
13. y2025q51排序不改变折线与数据；y2020q59切换行列只换色。
14. y2020q58分类汇总不真正排序/汇总/折叠；y2020q9高级筛选不改变结果。
15. merged-10引用/排名演示公式不随偏移改变且错误码硬编码。
16. y2025q52条件格式改日期没有输入；更重要是跨表VLOOKUP原考法丢失。
17. y2026q50 SUMIF包含北斗原考法被SUMIFS代替，需要两种可计算场景。
18. y2024q65真实复选框无效，另有虚构勾选按钮；还缺自动日期/固定日期对照。
19. y2022q54学习弧度滑条放在Word功能区，应摘到外侧。
20. y2024q54边框入口误放页眉工具设计选项卡，应为开始→段落→边框。
21. y2023q35音频/视频共用状态，返回页会错误重播视频；独立状态。
22. y2023q13排练时间固定24/46/33秒，须真实计时或可操作的加速模型。
23. y2025q10节的折叠、新建、重命名不改实际对象。
24. y2025q2标题说输入字符，实际无输入框。

## 已定位并在v29修复：正文与丢失考点

- merged-3：SI的kB/MB/GB/TB为1000，KiB/MiB/GiB/TiB为1024；传统考题约定单独说明。
- y2020q2：活动窗口不保证覆盖置顶窗口。
- y2026q28：布尔优先级依平台，PubMed按从左到右；用括号。
- y2026q38：p可按HTML规定省略结束标签但不是空元素。
- y2026q6：GCD输出本轮余数为0时的除数，避免“最后非零余数”首轮整除歧义。
- y2026q50：补SUMIF完整语法与*北斗*；SUMIFS范围必须同尺寸，SUMIF不同尺寸按左上角扩展而非必报错。
- y2025q52：恢复 = $D3>VLOOKUP($A3,'2023'!$A$2:$C$22,3,0) 与整行粗斜体任务。
- merged-10：补RANK.EQ完整语法与order=0降序、固定比较范围。
- merged-7：补上标Ctrl+Shift+=、下划线/删除线/着重号、两端/分散末行区别（2021稿已补后者）。
- merged-12：按系列对应图例系列、按类别对应横轴类别。
- y2025q53：补SmartArt工具→格式→更改形状→圆角矩形。
- merged-5：Web版式/草稿不显示正常页眉页脚版式；打印布局显示。
- y2023q13：去掉Office2016可摄像头录制的笼统表述，保留旁白、墨迹、计时。
- y2025q2：GB2312常见双字节机内码两字节最高位1；字形码包括点阵/矢量且随字体字号变化、不唯一。
- merged-19：明确感知层、网络层、应用层三个完整名称。
- y2023q10：Excel可设置起始页码、多个打印区域及先列后行/先行后列页序。
- y2024q8：Word文本转表格、按笔划排序、单元格公式=SUM(ABOVE)遗漏。
- y2020q27：补MP3音频编码与MP4容器（可承载音视频）、多媒体系统硬件软件及采集数字化。
- y2025q33：补Windows传统Print Screen全屏/Alt+Print Screen活动窗口截图入剪贴板（按键重配置除外）。
- y2025q10：原2024q13还涉及放映B黑屏/恢复、画笔颜色与实际拖动标注，不能只保留节管理。
- y2025q34：明确传统Windows 10记事本不保存逐字颜色等富文本格式。
- 已复核2026q47：中文与数字、中文与西文是独立设置；正文及演示均按两种独立设置处理。
- 已复核2026q51：原题为高级筛选后恢复，已区分自动筛选与原位置高级筛选的“数据→清除”。

## 官方证据（已在本轮查询）

- Microsoft的Goal Seek、外部引用、3D引用、CSV导入、数据验证、文本框、COUNTIFS/AVERAGEIF/MOD函数、标尺、修订、页设置等官方说明由审查代理核实；恢复时可按具体功能再次打开证据，勿照抄旧答案不严谨结论。
- https://support.microsoft.com/en-us/excel/use-goal-seek-to-find-the-result-you-want-by-adjusting-an-input-value
- https://support.microsoft.com/en-us/excel/create-workbook-links
- https://support.microsoft.com/en-us/excel/create-a-3-d-reference-to-the-same-cell-range-on-multiple-worksheets
- https://support.microsoft.com/en-us/excel/get-started/import-or-export-text-txt-or-csv-files
- https://support.microsoft.com/en-us/excel/get-started/apply-data-validation-to-cells
- https://support.microsoft.com/en-us/word/training/accept-tracked-changes
- https://support.microsoft.com/en-us/word/using-the-ruler-in-word
- https://physics.nist.gov/cuu/Units/binary.html
- https://www.postgresql.org/docs/current/queries-table-expressions.html
- https://pubmed.ncbi.nlm.nih.gov/help/
- https://html.spec.whatwg.org/multipage/grouping-content.html#the-p-element

## 验收说明

2021脚本已在全部11个章节页加载，独立新增16个演示。原有问题通过新模型或基础框架修正，包括真正的填充/文本框/字段拖动、长按菜单、筛选取消、修订保留、跨页媒体状态与实际数据计算。

验收：37项回归全部通过；11章在360px预览框（正文可用345px）测量均无正文横向溢出。浏览器CSV三步导入确认分隔符、引号中的逗号、前导0和长编号保留。测试覆盖全部笔记开合及重点操作模型；未宣称逐一人工执行所有操作分支。源题全覆盖不等于全考纲或完整Office功能覆盖。
