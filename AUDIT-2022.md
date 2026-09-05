# 2022 年逐题归档与交互复查

本轮读取题目扫描件13页、答案3页，核对第1—75题。2022年新增21条笔记，54题并入已有笔记；全站204条笔记、400道唯一来源，保持11章组织，不增加按年学习入口。

## 内容与演示

- 逐题映射在 `notes-2022-data.js`。每题具有章节、小节、考法、概念及合并目标，新笔记保留定义、操作与易错边界。
- 本轮新增/重做37个状态化演示。拖选工资区域、字段拖放、VLOOKUP填充柄、标尺拖动和长按均读取实际指针行为；轻点不冒充拖动或长按。
- 透视表汇总、条件格式、VLOOKUP、日期差、累加循环、进制转换按输入计算；邮件合并按记录与IF规则生成内容。
- 修订接受/拒绝、编辑例外、链接/嵌入、大纲导入与播放页面具有可观察的不同结果。
- 校正2024年Excel通配符笔记：删除误加的Word通配符选项，辅助列方案使用Excel 2016可用的LEFT/FIND。
- 题号与重复考法说明移入折叠来源，演示按需挂载；修正嵌套main受到全局阅读宽度影响、重复进制分支、不可见目录的焦点，以及输入失焦时吞掉第一次点击的问题。

## 参考口径

- [山东省教育招生考试院：2026年公共基础课考试要求](https://www.sdzk.cn/NewsInfo.aspx?NewsID=7081)
- [Microsoft：VLOOKUP](https://support.microsoft.com/en-us/excel/functions/vlookup-function)
- [Microsoft：选择性粘贴](https://support.microsoft.com/en-us/excel/paste-options)
- [Microsoft：邮件合并规则](https://support.microsoft.com/en-us/word/set-the-rules-for-a-mail-merge)
- [Microsoft：保护文档并设置编辑例外](https://support.microsoft.com/en-us/word/allow-changes-to-parts-of-a-protected-word-document)
- [Microsoft：Excel通配符](https://support.microsoft.com/en-us/excel/using-wildcard-characters-in-searches)
- [NIST：私有云](https://csrc.nist.gov/glossary/term/private_cloud)

## 验证与边界

`tests/notes-regression.cjs`检查来源完整唯一、11章全部卡片开关及重置、选区与拖动、公式结果、分组筛选、邮件合并、链接刷新、只读保护、大纲生成、循环与进制、长按取消、失焦点击、Excel通配符。

浏览器检查使用真实页面和同源窄屏窗口，并以指针拖动验证字段确实落入目标区域。窄屏窗口不等于真实Android设备测试。旧场景虽能全部挂载，不代表每一条旧演示的所有分支均已人工验证，也不代表现行考纲已经全部覆盖。
