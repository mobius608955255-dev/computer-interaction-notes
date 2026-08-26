(() => {
  'use strict';

  const WINDOWS = [
    {title:'操作系统的职责与类型', lead:'先分清“谁在管理资源”，再辨认系统类型。', points:['操作系统统一管理处理器、内存、文件和设备','系统软件与应用软件的分类依据是职责，不是是否自带','批处理系统交互性弱；分时系统强调多个用户交互','并发表示同一时间段内多个任务都在推进'], traps:[['Word 属于系统软件',0,'Word 面向用户完成文字处理，是应用软件。'],['操作系统负责文件与设备管理',1,'这是操作系统的基本职责。'],['并发必须表示同一瞬间执行多个程序',0,'并发强调同一时间段内交替推进，并不等于每一瞬间都同时执行。']]},
    {title:'桌面、图标与个性化', lead:'桌面上的入口、真实文件和显示设置不是一回事。', points:['桌面背景只是图像；主题可成组改变背景、颜色和声音','“此电脑”等系统图标可在桌面图标设置中恢复','删除快捷方式通常不删除目标文件','图标排列、大小和显示状态可独立调整'], traps:[['删除桌面快捷方式会同步删除目标文件',0,'快捷方式只是入口，通常不会删除目标。'],['桌面背景与主题完全等同',0,'主题包含的设置范围更广。'],['系统桌面图标可以重新显示',1,'可在个性化相关设置中恢复。']]},
    {title:'窗口组成与状态切换', lead:'最小化、最大化、还原、关闭必须形成动作—结果映射。', points:['双击标题栏在最大化与还原之间切换','拖窗口到屏幕顶部通常触发贴靠最大化','最小化后程序通常仍运行','关闭窗口才通常结束该窗口或应用任务'], demo:'window', traps:[['最小化窗口等于关闭程序',0,'最小化只改变显示状态。'],['双击标题栏通常可最大化或还原',1,'这是 Windows 的常见窗口操作。'],['窗口最大化后不能恢复原大小',0,'可再次双击标题栏或单击还原按钮。']]},
    {title:'开始菜单、任务栏与多任务', lead:'固定入口、正在运行和启动项属于不同层次。', points:['任务栏按钮可代表正在运行的窗口，也可固定常用应用','自动隐藏只改变任务栏显示行为，不会删除任务栏','Alt+Tab 用于切换窗口；Win+Tab 打开任务视图','“固定到任务栏”不等于创建桌面快捷方式'], traps:[['任务栏自动隐藏会删除已固定应用',0,'它只改变何时显示任务栏。'],['Alt+Tab 可在窗口间切换',1,'这是常用的多任务切换快捷键。'],['固定到任务栏与创建桌面快捷方式完全相同',0,'两者入口位置和管理方式不同。']]},
    {title:'文件名、路径与扩展名', lead:'显示方式变化不等于文件自身被修改。', points:['Windows 文件名不能包含 \\ / : * ? " < > | 等字符','扩展名常用于标识文件类型及默认打开方式','隐藏已知文件类型扩展名只是“不显示”，不是删除','完整路径由驱动器、文件夹层次和文件名组成'], traps:[['隐藏扩展名会把扩展名从文件中删除',0,'只是资源管理器不显示。'],['冒号可随意出现在 Windows 文件名中',0,'冒号属于非法字符。'],['修改扩展名可能影响默认打开方式',1,'系统常依据扩展名关联应用。']]},
    {title:'文件与文件夹属性', lead:'只读、隐藏、系统属性的效果不能按字面绝对化。', points:['只读主要限制常规修改保存，不等于禁止删除','隐藏属性只影响默认显示，文件仍然存在','显示隐藏项目后可看到普通隐藏文件','属性变化与文件内容变化是两回事'], traps:[['只读文件绝对不能删除',0,'只读不是删除保护。'],['隐藏文件仍占用磁盘空间',1,'文件没有被删除。'],['显示隐藏项目会自动取消文件的隐藏属性',0,'它只改变查看方式。']]},
    {title:'复制、移动与拖放规则', lead:'先看来源与目标是否同分区，再看 Ctrl、Shift 是否覆盖默认行为。', points:['Ctrl+C 复制，原对象保留；Ctrl+X 剪切，等待移动','同分区拖动通常移动，跨分区拖动通常复制','Ctrl+拖动通常强制复制；Shift+拖动通常强制移动','复制同名文件时要根据提示选择覆盖、跳过或保留两者'], demo:'drag', traps:[['跨分区拖动文件默认通常是移动',0,'跨分区通常复制。'],['Ctrl+拖动通常强制复制',1,'Ctrl 可覆盖默认拖放行为。'],['剪切后对象立即从磁盘永久删除',0,'通常要在目标位置粘贴后才完成移动。']]},
    {title:'删除、回收站与恢复', lead:'删除去向取决于位置、方法和系统设置。', points:['本地磁盘按 Delete 通常进入回收站','Shift+Delete 通常绕过回收站','U 盘等可移动介质删除通常不进入本机回收站','清空回收站后不能再用“还原”命令恢复'], demo:'delete', traps:[['所有删除操作都会进入回收站',0,'Shift+Delete、可移动介质等是常见例外。'],['回收站中的文件可以还原到原位置',1,'未清空前通常可以还原。'],['清空回收站等于隐藏其中内容',0,'这是进一步删除，不是隐藏。']]},
    {title:'搜索、快速访问与快捷方式', lead:'搜索结果和快速访问都是入口，不是新的真实存储位置。', points:['Windows 搜索不仅能找文件，也可找应用和设置','快速访问保存常用位置入口','快捷方式保存目标路径等信息','目标移动或删除后，快捷方式可能失效'], traps:[['快速访问是文件的真实物理位置',0,'它只是便捷入口。'],['Windows 搜索只能搜索文件名',0,'还可搜索应用、设置等。'],['快捷方式目标不存在时可能无法打开',1,'入口还在，但目标已失效。']]},
    {title:'设置、控制面板与对话框', lead:'“应用、确定、取消”考的是保存与关闭的组合。', points:['控制面板可按类别、大图标或小图标查看','“应用”保存当前设置但通常不关闭','“确定”通常保存并关闭','“取消”通常放弃当前尚未应用的更改'], demo:'dialog', traps:[['“应用”和“确定”的结果完全相同',0,'是否关闭对话框通常不同。'],['“取消”能撤销此前所有系统历史操作',0,'它通常只处理当前未应用更改。'],['控制面板可以切换查看方式',1,'常见有类别和图标方式。']]},
    {title:'任务管理器与资源诊断', lead:'看进程、看资源、结束任务、管启动项是核心链路。', points:['进程页查看应用和后台进程','性能页观察 CPU、内存、磁盘、网络','启动页管理登录启动项','“打开文件所在位置”帮助定位进程程序文件'], demo:'task', traps:[['任务管理器可结束无响应任务',1,'这是常用故障处理。'],['任务管理器是标准的软件卸载入口',0,'卸载通常通过设置或控制面板。'],['结束任务可能导致未保存内容丢失',1,'强制结束前应考虑数据风险。']]},
    {title:'设备管理器与驱动程序', lead:'先认设备状态，再决定更新、回退、禁用或卸载驱动。', points:['黄色感叹号通常表示驱动或设备异常','更新驱动用于安装较新或适配版本','回退驱动可处理新版驱动导致的问题','禁用设备不同于物理移除设备'], demo:'device', traps:[['黄色感叹号通常表示设备工作完全正常',0,'它是异常提示。'],['卸载设备驱动与卸载普通应用完全同义',0,'管理对象和后果不同。'],['驱动程序帮助操作系统控制硬件',1,'它是系统与设备之间的重要接口。']]},
    {title:'应用、默认程序与卸载', lead:'默认打开方式、扩展名和应用安装状态要分开判断。', points:['默认应用决定某类文件优先由哪个程序打开','“打开方式”可临时或永久选择应用','改变默认应用不会改变文件内容','卸载应用通常不会自动删除所有用户文档'], traps:[['修改默认打开方式等于修改文件扩展名',0,'两者是不同操作。'],['卸载应用一定删除所有用它创建的文档',0,'用户文档通常独立保留。'],['同一扩展名可以更换默认应用',1,'可通过设置或打开方式更改关联。']]},
    {title:'电源、睡眠与系统恢复', lead:'关机、重启、睡眠、休眠的状态保存程度不同。', points:['睡眠保留工作状态并低功耗待机','重启会结束当前系统会话后重新启动','强按电源键不是正常关机方法','系统还原主要恢复系统文件和设置，不等同个人文件备份'], traps:[['系统还原等于完整备份所有个人文件',0,'它主要针对系统状态。'],['睡眠与彻底关机完全相同',0,'恢复速度和状态保存不同。'],['异常无响应时才可能考虑强制关机',1,'日常应使用正常关机命令。']]},
    {title:'记事本、截图与常用附件', lead:'轻量工具能做什么、不能做什么，常被绝对化设坑。', points:['记事本可改变显示字体和字号','记事本不是逐段富文本排版工具','截图工具用于捕获、标注和保存屏幕图像','计算器可进行标准、科学等模式运算'], traps:[['记事本完全不能修改字体和字号',0,'可以调整显示字体和字号。'],['截图工具的标准功能包括自动去除所有水印',0,'这不是其正常功能。'],['记事本适合编辑纯文本',1,'它的核心是纯文本处理。']]},
    {title:'Windows 真题操作链', lead:'把分散动作串起来，按“观察现象—定位工具—执行修复”作答。', points:['窗口无响应：任务管理器定位进程并结束任务','设备异常：设备管理器查看状态与驱动','找不到扩展名：资源管理器显示设置','误删本地文件：先检查回收站并还原'], traps:[['设备黄色感叹号应先去回收站处理',0,'应查看设备管理器和驱动状态。'],['文件只是隐藏时不应按“已删除”处理',1,'显示隐藏项目即可验证。'],['筛查启动慢可查看任务管理器启动项',1,'禁用不必要启动项是常见诊断步骤。']]}
  ];

  const WORD = [
    {title:'界面、视图与显示比例', lead:'视图改变工作方式，显示比例只改变观看尺度。', points:['页面视图接近打印版式；阅读模式面向阅读','大纲视图按标题层次组织文档','Web 版式按连续网页方式显示','缩放不改变真实字号和打印排版'], demo:'zoom', traps:[['显示比例增大等于字号增大',0,'缩放只影响屏幕显示。'],['大纲视图适合查看标题层次',1,'可折叠和调整文档结构。'],['阅读模式就是打印预览',0,'二者用途不同。']]},
    {title:'输入、选择与编辑文本', lead:'选中范围决定操作对象，插入与改写模式决定输入结果。', points:['拖动、Shift 和 Ctrl 可扩展或组合选择','Backspace 删除光标前字符，Delete 删除后字符','剪切移动内容，复制保留原内容','撤销与恢复针对编辑历史'], traps:[['Ctrl+X 与 Ctrl+C 完全相同',0,'剪切用于移动，复制保留原内容。'],['选中文本后直接输入会替换选中内容',1,'这是常见编辑行为。'],['Delete 一定删除整段文字',0,'删除范围取决于当前选择或光标位置。']]},
    {title:'字体、字号与字符格式', lead:'字体格式作用于字符，不要与段落和样式混为一谈。', points:['字体、字号、字形、颜色属于字符格式','加粗、倾斜、下划线可独立组合','上标与下标改变字符基线位置','清除所有格式可恢复为基础样式格式'], traps:[['字体与样式是完全相同的概念',0,'样式可包含字符和段落等成组规则。'],['上标适合输入指数形式',1,'例如 x²。'],['下划线只有一种类型',0,'Word 提供多种线型和颜色设置。']]},
    {title:'段落对齐、缩进与制表位', lead:'缩进控制段落边界，页边距控制页面正文区域。', points:['左、右、居中、两端、分散对齐效果不同','首行缩进只移动第一行起点','悬挂缩进让后续行相对第一行缩进','左右缩进不同于页面左右边距'], demo:'paragraph', traps:[['首行缩进会同时移动段落所有行',0,'只有第一行起点单独变化。'],['悬挂缩进常用于参考文献等排版',1,'后续行相对第一行缩进。'],['段落左缩进等同于页面左边距',0,'前者是段落级，后者是页面级。']]},
    {title:'行距、段距与换行控制', lead:'行内距离和段落之间距离要分别设置。', points:['行距控制同一段落内各行距离','段前、段后控制相邻段落间距','中文与西文/数字间距设置可能改变换行结果','孤行控制等选项影响分页时段落完整性'], traps:[['段后间距就是行距',0,'它们控制不同层次的距离。'],['改变中文与西文间距可能使三行变两行',1,'字符间距变化会影响换行。'],['按多次空格是稳定的段落缩进方法',0,'应使用段落缩进或制表位。']]},
    {title:'样式与格式刷', lead:'重复排版优先使用样式，局部复制格式使用格式刷。', points:['样式可同时保存字符和段落格式','修改样式可同步更新所有应用者','格式刷复制格式而非文字内容','标题样式还是自动目录的重要结构来源'], traps:[['格式刷会复制原文字内容',0,'它只复制格式。'],['修改样式可统一更新多个标题',1,'这是样式的核心价值。'],['手工加粗必然等于应用标题样式',0,'视觉相似不代表结构相同。']]},
    {title:'查找、替换与格式替换', lead:'不只找文字，也能找格式、特殊字符和样式。', points:['查找可使用大小写、全字匹配等条件','替换可一次替换或全部替换','查找框留空也可只查找特定格式','格式替换可批量改变字形而不改文字'], demo:'replace', traps:[['查找替换只能处理文字内容',0,'还可按格式和特殊字符查找。'],['替换全部前应确认范围与条件',1,'过宽条件可能误改内容。'],['只替换格式时必须修改文字',0,'可保持文字不变。']]},
    {title:'分页符与分节符', lead:'分页只换页，分节还会建立新的页面设置边界。', points:['分页符使后续内容从下一页开始','下一页分节符同时换页并创建新节','连续分节符创建新节但不一定换页','奇数页、偶数页分节符用于章节起始控制'], demo:'section', traps:[['分页符和下一页分节符完全相同',0,'分节符还建立新节。'],['连续分节符一定产生新页',0,'它可在同一页创建新节。'],['单页横向通常需要分节',1,'先隔离节再改页面方向。']]},
    {title:'页眉、页脚与页码', lead:'节之间默认可能联动，不同页眉的关键是断开链接。', points:['页眉页脚位于正文之外的重复区域','“链接到前一节”控制节间联动','首页不同、奇偶页不同不等于不同节','页码可继续前一节或重新设起始值'], demo:'header', traps:[['插入分节符后页眉必然自动不同',0,'新节可能仍链接前一节。'],['断开链接后可独立修改新节页眉',1,'这是不同节页眉的核心步骤。'],['首页不同等于每一节都不同',0,'它只区分首页与其他页。']]},
    {title:'页面设置、分栏与单页横向', lead:'页面级设置按节生效，复杂版式先划分边界。', points:['页边距、纸张、方向属于页面设置','分栏把正文流排成多栏，不等于多个文本框','对部分内容分栏通常需选中内容或使用分节','单页横向需前后分节以隔离'], traps:[['分栏就是插入多个文本框',0,'分栏仍属于连续正文流。'],['页边距与段落左右缩进完全相同',0,'一个是页面级，一个是段落级。'],['文档可让不同节使用不同纸张方向',1,'节级页面设置支持这种组合。']]},
    {title:'表格创建、编辑与跨页', lead:'合并单元格、拆分单元格、拆分表格是三种不同操作。', points:['可插入、删除行列与单元格','合并把多个单元格变成一个','拆分单元格在一个格内重新划分；拆分表格把表分成两张','重复标题行让跨页表格每页显示表头'], demo:'table', traps:[['拆分单元格等于拆分表格',0,'操作对象和结果不同。'],['Word 表格可以排序',1,'可按列和数据类型排序。'],['跨页表头只能手工复制',0,'可设置重复标题行。']]},
    {title:'Word 表格排序与公式', lead:'Word 表格能计算，但语法和 Excel 使用场景不同。', points:['排序可指定主要和次要关键字','表格公式常用 SUM、AVERAGE 等函数','ABOVE、LEFT 等位置参数引用相邻数据','结果变化后可能需要更新域'], traps:[['Word 表格完全不能使用公式',0,'可用公式命令进行基础计算。'],['=SUM(ABOVE) 常用于汇总上方单元格',1,'这是常见位置引用。'],['Word 表格公式与 Excel 工作簿模型完全相同',0,'能力和引用方式存在明显差异。']]},
    {title:'图片、裁剪与文字环绕', lead:'缩放改变显示尺寸，裁剪隐藏边缘内容；环绕决定文字关系。', points:['嵌入型图片像字符一样参与排版','四周型按矩形边界环绕，紧密型更贴轮廓','上下型不在图片左右排列正文','衬于文字下方与浮于文字上方控制叠放层次'], demo:'wrap', traps:[['裁剪与缩放是同一操作',0,'裁剪改变可见区域，缩放改变尺寸。'],['锁定纵横比可避免图片比例变形',1,'调整宽高时保持比例。'],['上下型环绕会在图片左右排满正文',0,'它让文字主要位于上下。']]},
    {title:'形状、艺术字与对象组合', lead:'多个浮动对象可对齐、分布、组合并统一移动。', points:['形状可设置填充、轮廓和效果','艺术字属于带特殊文本效果的对象','组合后多个对象可作为整体操作','嵌入型对象与浮动对象的组合条件不同'], traps:[['组合对象后永远不能取消组合',0,'可取消组合后分别编辑。'],['对齐与分布用于整理多个对象位置',1,'能提高版面整齐度。'],['所有图片无论环绕方式都可直接组合',0,'嵌入型对象常需先改为浮动环绕。']]},
    {title:'题注与交叉引用', lead:'题注负责编号，交叉引用负责在正文中引用编号。', points:['题注可按“图、表”等标签自动编号','插入新题注后后续编号可更新','交叉引用可引用题注编号或完整题注','手敲“图 1”不会自动跟随编号变化'], demo:'caption', traps:[['批注与题注作用相同',0,'批注是审阅意见，题注是编号标题。'],['交叉引用可随题注编号更新',1,'它引用的是域。'],['手工输入图号具备自动更新能力',0,'普通文本不会跟随编号。']]},
    {title:'脚注、尾注、批注与域', lead:'四者位置和用途不同，必须并排辨析。', points:['脚注通常位于当前页底部','尾注位于节末或文档末','批注用于审阅交流，不进入正文内容流','题注、交叉引用、目录等自动内容常由域实现'], traps:[['脚注通常出现在文档末尾',0,'那更符合尾注。'],['批注用于记录审阅意见',1,'它与脚注的正文补充用途不同。'],['更新域可刷新自动编号和引用',1,'编号变化后常需要更新域。']]},
    {title:'标题结构与自动目录', lead:'目录质量取决于文档结构，而不是手工做出“像标题”的外观。', points:['标题样式建立文档层次','自动目录可选择显示级别','标题变化后可更新页码或整个目录','手工目录不会自动跟随标题和页码变化'], demo:'toc', traps:[['普通加粗文本一定会进入自动目录',0,'还需标题样式或正确大纲级别。'],['自动目录可以更新页码',1,'版式变化后应更新。'],['删除目录会删除正文标题',0,'目录只是引用结构。']]},
    {title:'邮件合并完整流程', lead:'主文档放固定内容，数据源放个性化记录，合并域连接二者。', points:['选择文档类型并准备主文档','连接 Excel 等数据源','插入姓名、地址等合并域','预览结果后完成并合并'], demo:'mail', traps:[['合并域中的姓名来自主文档固定文字',0,'它来自数据源记录。'],['筛选收件人可只合并部分记录',1,'可在收件人列表中筛选。'],['完成并合并前无需预览任何记录',0,'预览有助于发现格式和数据问题。']]},
    {title:'修订、接受拒绝与文档比较', lead:'开启修订记录变化；接受或拒绝才决定最终正文。', points:['修订记录插入、删除和格式变化','接受修订把变化纳入正文','拒绝修订放弃该变化','比较文档用于找出两个版本差异'], demo:'revision', traps:[['开启修订会自动接受所有修改',0,'它只是记录变化。'],['拒绝删除修订会保留原文字',1,'拒绝意味着不采用删除。'],['文档比较与修订是同一个按钮和概念',0,'比较用于生成版本差异。']]},
    {title:'打印、保护与最终检查', lead:'打印前检查页面范围、标记显示和文档保护状态。', points:['打印预览用于检查分页、页边距和对象位置','可选择打印全部、当前页或指定页码','修订和批注是否打印由打印标记设置决定','限制编辑可控制允许的修改类型'], traps:[['打印预览会自动修正文档错误',0,'它主要用于观察和检查。'],['隐藏修订标记不等于接受修订',1,'只是显示状态变化。'],['限制编辑可用于保护文档结构或格式',1,'可结合密码等设置。']]}
  ];

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function ensureStyle() {
    if ($('link[data-v5-style]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = './enhancements-v5.css?v=5'; link.dataset.v5Style = '1';
    document.head.appendChild(link);
  }

  function chapterHref(n) { return `./?v=5&chapter=${n}#chapter-${n}`; }
  function goChapter(n) {
    if (n === 2 || n === 3) {
      history.pushState({}, '', chapterHref(n));
      renderCustomChapter(n);
    } else location.href = chapterHref(n);
  }

  function chapterLinks(current) {
    const labels = [['01','计算机基础'],['02','Windows 10'],['03','Word 2016'],['04','Excel 2016']];
    return labels.map(([num,label],i) => `<a href="${chapterHref(i+1)}" data-chapter="${i+1}" class="${current===i+1?'active':''}"><span>${num}</span><b>${label}</b></a>`).join('');
  }

  function renderSpecial(type) {
    const demos = {
      window:`<div class="sim-window" data-window-state="normal"><header><span>学习资料</span><i></i></header><main>窗口内容</main><footer><button data-win="min">最小化</button><button data-win="max">最大化/还原</button><button data-win="close">关闭</button></footer></div>`,
      drag:`<div class="choice-row"><label>来源<select data-drag-from><option value="c">C:盘</option><option value="d">D:盘</option></select></label><label>目标<select data-drag-to><option value="c">C:盘</option><option value="d" selected>D:盘</option></select></label><label>按键<select data-drag-key><option value="none">不按键</option><option value="ctrl">Ctrl</option><option value="shift">Shift</option></select></label></div><strong class="demo-result" data-drag-result>跨分区：默认复制</strong>`,
      delete:`<div class="choice-row"><label>位置<select data-del-place><option value="local">本地磁盘</option><option value="usb">U 盘</option></select></label><label>操作<select data-del-method><option value="delete">Delete</option><option value="shift">Shift+Delete</option></select></label></div><strong class="demo-result" data-del-result>通常进入回收站，可还原</strong>`,
      dialog:`<div class="dialog-demo"><p>桌面背景：<b data-setting>浅色</b></p><button data-dialog="change">修改为深色</button><button data-dialog="apply">应用</button><button data-dialog="ok">确定</button><button data-dialog="cancel">取消</button><strong data-dialog-result>尚未修改</strong></div>`,
      task:`<div class="process-list"><button data-process="browser"><span>浏览器</span><b>CPU 8%</b></button><button data-process="stuck"><span>文档编辑器 · 未响应</span><b>CPU 96%</b></button><button data-process="system"><span>系统进程</span><b>CPU 2%</b></button></div><strong class="demo-result" data-task-result>选择需要诊断的进程</strong>`,
      device:`<div class="device-list"><button data-device="ok">⌨ 键盘 <b>正常</b></button><button data-device="warn">⚠ 无线网卡 <b>黄色感叹号</b></button></div><strong class="demo-result" data-device-result>点击设备查看诊断</strong>`,
      zoom:`<div class="zoom-demo"><label>显示比例 <input type="range" min="75" max="175" value="100" data-zoom><b data-zoom-label>100%</b></label><label>真实字号 <input type="range" min="10" max="28" value="12" data-font><b data-font-label>12 磅</b></label><p data-zoom-paper style="--zoom:1;--font:12px">显示比例只影响观看；字号改变真实排版。</p></div>`,
      paragraph:`<div class="paragraph-demo"><div class="choice-row"><button data-indent="first">首行缩进</button><button data-indent="hanging">悬挂缩进</button><button data-indent="none">无缩进</button></div><p data-paragraph>第一行与后续行的位置关系，是区分首行缩进和悬挂缩进的关键。不要用连续空格代替段落格式。</p></div>`,
      replace:`<div class="replace-demo"><p><b>考试重点</b>：格式替换不会改变文字。<br><b>操作重点</b>：先限定范围再全部替换。</p><button data-replace>把“粗体”替换为“紫色强调”</button><strong data-replace-result>文字内容保持不变</strong></div>`,
      section:`<div class="section-demo"><div class="choice-row"><button data-break="page">分页符</button><button data-break="next">下一页分节符</button><button data-break="continuous">连续分节符</button></div><div data-break-result><span>第 1 页 · 同一节</span><i>仅换页</i><span>第 2 页 · 同一节</span></div></div>`,
      header:`<div class="header-demo"><div><span>第 1 节页眉</span><b>山东专升本</b></div><button data-header-link aria-pressed="true">链接到前一节：开</button><div><span>第 2 节页眉</span><b data-header-two>山东专升本</b></div><button data-header-edit>把第 2 节改为“第三章 Word”</button><strong data-header-result>当前修改会联动前一节</strong></div>`,
      table:`<div class="word-table"><div>班级</div><div>姓名</div><div>成绩</div><div>A班</div><div>小燕</div><div>88</div><div>A班</div><div>小齐</div><div>92</div></div><div class="choice-row"><button data-table="merge">合并班级单元格</button><button data-table="title">设置重复标题行</button></div><strong class="demo-result" data-table-result>选择一个操作</strong>`,
      wrap:`<div class="wrap-demo" data-wrap-mode="inline"><div class="choice-row"><button data-wrap="inline">嵌入型</button><button data-wrap="square">四周型</button><button data-wrap="top">上下型</button><button data-wrap="behind">衬于文字下方</button></div><p>这是一段用于观察文字环绕关系的正文。<i>图</i>切换环绕方式后，文字与图片的空间关系会明显改变。</p></div>`,
      caption:`<div class="caption-demo"><figure><div>示意图</div><figcaption data-caption>（尚未插入题注）</figcaption></figure><p>如 <b data-cross-ref>［手工文字：图 1］</b> 所示，这是自动化引用训练。</p><button data-add-caption>插入题注</button><button data-add-ref>插入交叉引用</button><button data-renumber>在前面新增一幅图</button><strong data-caption-result>先插入题注，再建立交叉引用</strong></div>`,
      toc:`<div class="toc-demo"><div><button data-heading="0">普通加粗</button><button data-heading="1">标题 1</button><button data-heading="2">标题 2</button></div><ol data-toc><li>目录尚未生成</li></ol><button data-build-toc>生成/更新目录</button></div>`,
      mail:`<div class="mail-demo"><label>数据源记录<select data-mail><option value="小燕|济南市历下区">小燕</option><option value="小齐|青岛市市南区">小齐</option><option value="小鲁|烟台市芝罘区">小鲁</option></select></label><article><small>主文档固定内容 + 合并域</small><p><b data-mail-name>小燕</b>同学：</p><p>录取通知书将寄往 <u data-mail-address>济南市历下区</u>。</p></article></div>`,
      revision:`<div class="revision-demo"><p>这是一段<span data-revision-old>原来的</span><ins data-revision-new>修改后的</ins>文字。</p><button data-revision="accept">接受修订</button><button data-revision="reject">拒绝修订</button><strong data-revision-result>修订仍在等待处理</strong></div>`
    };
    return demos[type] || '';
  }

  function renderModule(module, index, prefix) {
    return `<section id="${prefix}-${index+1}" class="course-module">
      <div class="module-shell">
        <header class="module-head"><span>${String(index+1).padStart(2,'0')}</span><div><small>最小命题颗粒</small><h2>${esc(module.title)}</h2><p>${esc(module.lead)}</p></div></header>
        <div class="module-grid">
          <div class="knowledge-card"><h3>必须形成的判断</h3><ul>${module.points.map(point=>`<li>${esc(point)}</li>`).join('')}</ul></div>
          <div class="truth-lab"><h3>真题陷阱句</h3><p>先判断，再看解释。</p><div>${module.traps.map((item,i)=>`<button type="button" data-truth="${item[1]}" data-why="${esc(item[2])}"><b>${String.fromCharCode(65+i)}</b><span>${esc(item[0])}</span><i>判断</i></button>`).join('')}</div><strong class="truth-feedback" aria-live="polite">点击一句话判断正误</strong></div>
        </div>
        ${module.demo ? `<div class="special-lab"><div class="special-title"><span>操作实验</span><b>让结果真实发生</b></div>${renderSpecial(module.demo)}</div>` : ''}
        <div class="course-memory"><span>一条线记住</span><strong>${esc(module.lead)} ${esc(module.points[0])}。</strong></div>
      </div>
    </section>`;
  }

  function renderCustomChapter(number, anchor='') {
    if (number !== 2 && number !== 3) return;
    const isWord = number === 3;
    const modules = isWord ? WORD : WINDOWS;
    const prefix = isWord ? 'word' : 'windows';
    const title = isWord ? 'Word 2016' : 'Windows 10';
    const subtitle = isWord ? '把排版结果拆回设置链路' : '把每一个动作变成可预测的结果';
    const root = $('#root'); if (!root) return;
    root.innerHTML = `<main class="course-page ${prefix}-page">
      <header class="course-topbar"><a href="${chapterHref(1)}" data-chapter="1" class="course-brand"><span>NOTE</span><b>计算机交互笔记</b></a><nav>${chapterLinks(number)}</nav></header>
      <section class="course-hero"><div class="course-hero-inner"><div><span>CHAPTER ${String(number).padStart(2,'0')}</span><h1>${title}</h1><p>${subtitle}</p><small>概念辨析 · 结果诊断 · 操作实验 · 真题陷阱</small></div><div class="hero-score"><b>${modules.length}</b><span>个知识模块</span><i>${modules.reduce((n,m)=>n+m.traps.length,0)}</i><span>条陷阱训练</span></div></div></section>
      <section class="course-catalogue"><div><header><span>学习目录</span><b>点击直达考点</b></header><nav>${modules.map((m,i)=>`<a href="#${prefix}-${i+1}"><span>${String(i+1).padStart(2,'0')}</span>${esc(m.title)}</a>`).join('')}</nav></div></section>
      <section class="exam-ribbon"><div><span>高频主轴</span><p>${isWord?'样式 → 分节 → 页眉页脚 → 题注引用 → 邮件合并':'文件操作 → 窗口状态 → 回收站 → 系统工具 → 故障诊断'}</p><b>每个模块底部都能标记掌握，右下角复习中心会自动统计。</b></div></section>
      ${modules.map((m,i)=>renderModule(m,i,prefix)).join('')}
      <footer class="course-footer"><div><span>第 ${number} 章完成</span><h2>${isWord?'排版不是“调到好看”，而是让结构和结果都可控。':'记住动作的结果，Windows 判断题就不再靠猜。'}</h2></div><a href="${chapterHref(number+1)}" data-chapter="${number+1}">${number===2?'进入第三章 Word':'进入第四章 Excel'} →</a></footer>
    </main>`;
    document.title = `第${number}章 ${title}｜山东专升本计算机交互笔记`;
    const meta = $('meta[name="description"]'); if (meta) meta.content = `山东专升本计算机交互笔记第${number}章：${title} 真题颗粒化训练`;
    bindPage(number, anchor);
    patchGlobalNavigation();
    window.scrollTo({top:0,behavior:'auto'});
  }

  function bindPage(number, anchor='') {
    $$('[data-chapter]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); goChapter(Number(link.dataset.chapter)); }));
    $$('.truth-lab button').forEach(button => button.addEventListener('click', () => {
      const box = button.closest('.truth-lab');
      const correct = button.dataset.truth === '1';
      button.classList.add(correct ? 'truth-correct' : 'truth-wrong');
      button.querySelector('i').textContent = correct ? '✓ 正确' : '✕ 错误';
      $('.truth-feedback', box).innerHTML = `<b>${correct?'这句话成立。':'这是典型错误句。'}</b>${button.dataset.why}`;
    }));
    bindSpecialLabs();
    const targetHash = anchor || `#chapter-${number}`;
    history.replaceState({},'',`./?v=5&chapter=${number}${targetHash}`);
    if (anchor) requestAnimationFrame(() => document.querySelector(anchor)?.scrollIntoView({block:'start'}));
  }

  function bindSpecialLabs() {
    $$('[data-win]').forEach(button=>button.onclick=()=>{const box=button.closest('.sim-window'),act=button.dataset.win;if(act==='min'){box.dataset.windowState='min';$('main',box).textContent='窗口已最小化，但程序仍在运行';}if(act==='max'){box.dataset.windowState=box.dataset.windowState==='max'?'normal':'max';$('main',box).textContent=box.dataset.windowState==='max'?'窗口已最大化':'窗口已还原';}if(act==='close'){box.dataset.windowState='closed';$('main',box).textContent='窗口已关闭';}});
    const drag=()=>{const f=$('[data-drag-from]'),t=$('[data-drag-to]'),k=$('[data-drag-key]'),o=$('[data-drag-result]');if(!f||!t||!k||!o)return;o.textContent=k.value==='ctrl'?'按 Ctrl：强制复制':k.value==='shift'?'按 Shift：强制移动':f.value===t.value?'同分区：默认移动':'跨分区：默认复制';};$$('[data-drag-from],[data-drag-to],[data-drag-key]').forEach(el=>el.onchange=drag);
    const del=()=>{const p=$('[data-del-place]'),m=$('[data-del-method]'),o=$('[data-del-result]');if(!p||!m||!o)return;o.textContent=p.value==='local'&&m.value==='delete'?'通常进入回收站，可还原':'通常绕过本机回收站';};$$('[data-del-place],[data-del-method]').forEach(el=>el.onchange=del);
    let pending=false,applied=false;$$('[data-dialog]').forEach(b=>b.onclick=()=>{const a=b.dataset.dialog,o=$('[data-dialog-result]');if(a==='change'){pending=true;$('[data-setting]').textContent='深色（待应用）';o.textContent='设置已修改但尚未应用';}if(a==='apply'){applied=pending=true;$('[data-setting]').textContent='深色';o.textContent='已应用，对话框保持打开';}if(a==='ok'){applied=pending=true;$('[data-setting]').textContent='深色';o.textContent='已保存并关闭（模拟）';}if(a==='cancel'){pending=false;$('[data-setting]').textContent=applied?'深色':'浅色';o.textContent=applied?'已应用的设置保留':'未应用修改已放弃';}});
    $$('[data-process]').forEach(b=>b.onclick=()=>{$('[data-task-result]').textContent=b.dataset.process==='stuck'?'定位正确：可结束未响应任务，但未保存内容可能丢失':b.dataset.process==='system'?'系统进程不应随意结束':'浏览器运行正常，可继续观察资源占用';});
    $$('[data-device]').forEach(b=>b.onclick=()=>{$('[data-device-result]').textContent=b.dataset.device==='warn'?'检查设备状态 → 更新或回退驱动 → 重新启用测试':'设备工作正常，无需修复';});
    const zoom=()=>{const z=$('[data-zoom]'),f=$('[data-font]'),p=$('[data-zoom-paper]');if(!z||!f||!p)return;$('[data-zoom-label]').textContent=z.value+'%';$('[data-font-label]').textContent=f.value+' 磅';p.style.setProperty('--zoom',z.value/100);p.style.setProperty('--font',f.value+'px');};$$('[data-zoom],[data-font]').forEach(e=>e.oninput=zoom);
    $$('[data-indent]').forEach(b=>b.onclick=()=>{$('[data-paragraph]').className='indent-'+b.dataset.indent;});
    $('[data-replace]')?.addEventListener('click',()=>{const p=$('.replace-demo p');p.innerHTML=p.textContent.replaceAll('重点', '<mark>重点</mark>');$('[data-replace-result]').textContent='完成：文字未改，原粗体位置改为紫色强调';});
    $$('[data-break]').forEach(b=>b.onclick=()=>{const r=$('[data-break-result]'),type=b.dataset.break;r.innerHTML=type==='page'?'<span>第 1 页 · 第 1 节</span><i>只换页</i><span>第 2 页 · 第 1 节</span>':type==='next'?'<span>第 1 页 · 第 1 节</span><i>换页 + 新节</i><span>第 2 页 · 第 2 节</span>':'<span>同一页 · 第 1 节</span><i>不换页 + 新节</i><span>同一页 · 第 2 节</span>';});
    let linked=true;$('[data-header-link]')?.addEventListener('click',e=>{linked=!linked;e.currentTarget.textContent=`链接到前一节：${linked?'开':'关'}`;e.currentTarget.setAttribute('aria-pressed',String(linked));$('[data-header-result]').textContent=linked?'当前修改会联动前一节':'已断开：第 2 节可独立修改';});$('[data-header-edit]')?.addEventListener('click',()=>{$('[data-header-two]').textContent='第三章 Word';$('[data-header-result]').textContent=linked?'错误结果：第 1 节也会被联动修改':'正确：只有第 2 节改变';});
    $$('[data-table]').forEach(b=>b.onclick=()=>{$('[data-table-result]').textContent=b.dataset.table==='merge'?'同一班级两格合并；这不是“拆分表格”':'跨页时每页顶部重复表头；无需手工复制';});
    $$('[data-wrap]').forEach(b=>b.onclick=()=>{b.closest('.wrap-demo').dataset.wrapMode=b.dataset.wrap;});
    let caption=0,ref=false;const drawCaption=()=>{if(!$('[data-caption]'))return;$('[data-caption]').textContent=caption?`图 ${caption}　示意图`:'（尚未插入题注）';$('[data-cross-ref]').textContent=ref&&caption?`图 ${caption}`:'［手工文字：图 1］';};$('[data-add-caption]')?.addEventListener('click',()=>{caption=1;drawCaption();$('[data-caption-result]').textContent='题注已建立自动编号';});$('[data-add-ref]')?.addEventListener('click',()=>{ref=true;drawCaption();$('[data-caption-result]').textContent=caption?'交叉引用已连接题注编号':'应先插入题注';});$('[data-renumber]')?.addEventListener('click',()=>{if(caption)caption=2;drawCaption();$('[data-caption-result]').textContent=ref?'编号和交叉引用同步变为图 2':'手工文字仍是图 1，不会自动更新';});
    const heading=[];$$('[data-heading]').forEach(b=>b.onclick=()=>{heading.push(Number(b.dataset.heading));b.classList.add('selected');});$('[data-build-toc]')?.addEventListener('click',()=>{const valid=heading.filter(Boolean);$('[data-toc]').innerHTML=valid.length?valid.map((level,i)=>`<li class="level-${level}">${level===1?'第 '+(i+1)+' 章':'小节 '+(i+1)}<span>${i+1}</span></li>`).join(''):'<li>普通加粗没有标题结构，目录仍为空</li>';});
    $('[data-mail]')?.addEventListener('change',e=>{const [n,a]=e.target.value.split('|');$('[data-mail-name]').textContent=n;$('[data-mail-address]').textContent=a;});
    $$('[data-revision]').forEach(b=>b.onclick=()=>{const accept=b.dataset.revision==='accept';$('[data-revision-old]').style.display=accept?'none':'inline';$('[data-revision-new]').style.display=accept?'inline':'none';$('[data-revision-result]').textContent=accept?'已接受：修改后的文字进入正文':'已拒绝：保留原来的文字';});
  }

  function patchGlobalNavigation() {
    const hub = $('#study-hub');
    if (hub && !$('.study-chapters', hub)) {
      const nav=document.createElement('nav'); nav.className='study-chapters'; nav.setAttribute('aria-label','四章切换'); nav.innerHTML=chapterLinks(0);
      $('.study-progress',hub)?.after(nav);
      $$('[data-chapter]',nav).forEach(a=>a.onclick=e=>{e.preventDefault();goChapter(Number(a.dataset.chapter));});
    }
    const current = location.hash.match(/chapter-(\d)/)?.[1];
    $$('.study-chapters a').forEach(a=>a.classList.toggle('active',a.dataset.chapter===current));
    const drawer = $('.chapter-drawer nav');
    if (drawer && !drawer.querySelector('[data-added-chapter]')) {
      [2,3].forEach(n=>{const a=document.createElement('a');a.href=chapterHref(n);a.dataset.chapter=String(n);a.dataset.addedChapter='1';a.innerHTML=`<span>0${n}</span><div><strong>${n===2?'Windows 10':'Word 2016'}</strong><small>${n===2?'文件、窗口与系统工具':'排版、分节与自动化'}</small></div>`;a.onclick=e=>{e.preventDefault();goChapter(n);};drawer.appendChild(a);});
    }
  }

  function init() {
    ensureStyle();
    patchGlobalNavigation();
    const match=location.hash.match(/^#chapter-([23])$/);
    const moduleMatch=location.hash.match(/^#(windows|word)-\d+$/);
    if(match) renderCustomChapter(Number(match[1]));
    else if(moduleMatch) renderCustomChapter(moduleMatch[1]==='windows'?2:3,location.hash);
    window.addEventListener('popstate',()=>{const m=location.hash.match(/^#chapter-([23])$/);const section=location.hash.match(/^#(windows|word)-\d+$/);if(m)renderCustomChapter(Number(m[1]));else if(section)renderCustomChapter(section[1]==='windows'?2:3,location.hash);});
    new MutationObserver(()=>patchGlobalNavigation()).observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});
  else setTimeout(init,0);
})();
