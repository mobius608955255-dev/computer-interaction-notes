(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function appendNote(selector, key, title, paragraphs) {
    const section = $(selector);
    if (!section || $(`[data-v24="${key}"]`, section)) return;
    const host = $('.section-shell,.module-shell', section) || section;
    host.insertAdjacentHTML('beforeend', `<div class="lab-card v24-audit-note" data-v24="${key}">
      <div class="lab-heading"><span class="lab-dot"></span><div><p>概念补全</p><h3>${title}</h3></div></div>
      <div class="note-body">${paragraphs.map(p => `<p>${p}</p>`).join('')}</div>
    </div>`);
  }

  function removeLegacyV24Modules() {
    [
      '#concept-22','#concept-23',
      '#windows-24','#windows-25',
      '#word-24','#word-25',
      '#excel-23','#excel-24','#excel-25'
    ].forEach(id => {
      const node = $(id);
      if (node) node.remove();
    });
  }

  function chapter1() {
    appendNote('#concept-1','data-information','数据与信息：有联系，但不能直接画等号',[
      '<strong>数据</strong>是信息的表示和载体之一，文字、数字、图像、声音等都可以作为数据形式；<strong>信息</strong>强调从数据中获得的有意义内容。',
      '同一组数据放在不同语境中可能传递不同信息，所以“数据就是信息”不严谨；更稳妥的理解是：数据经过解释、处理后可以表达和传递信息。'
    ]);

    appendNote('#concept-11','instruction-fields','机器指令：操作码回答“做什么”，地址字段回答“对谁做”',[
      '基础教材常把一条机器指令抽象为<strong>操作码 + 地址码/操作数字段</strong>：操作码说明执行哪一种操作，地址字段说明操作数、结果或相关地址信息。',
      '这是便于理解计算机工作过程的教材模型。现代处理器的真实指令编码可能包含更多字段、不同长度和不同寻址方式，不能把教材抽象扩大成“所有 CPU 指令永远只有两个字段”。'
    ]);

    appendNote('#concept-12','system-bus','系统总线：按“传什么”区分数据、地址和控制',[
      '<strong>数据总线</strong>传送数据；<strong>地址总线</strong>传送地址信息；<strong>控制总线</strong>传送读写、中断、时序等控制信号。',
      '三类总线是按传递信息的性质来区分，不是按物理导线的位置、颜色或数量简单划分。地址总线位数通常会影响可直接表示的地址空间，但实际可寻址范围还受体系结构等因素约束。'
    ]);

    appendNote('#concept-14','bips-performance','BIPS、MIPS 与综合性能：指标只能回答特定问题',[
      '<strong>BIPS</strong>是 Billion Instructions Per Second，即每秒十亿条指令这一数量级；<strong>MIPS</strong>是每秒百万条指令。它们属于指令执行速度的度量方式。',
      '主频、字长、核心数、缓存、内存速度、I/O、指令集与具体程序负载都会影响实际性能。因此 BIPS、MIPS 或主频都不能脱离体系结构和任务类型，单独代表一台计算机在所有场景下的综合性能。',
      '原知识点中的“同代、同架构下主频越高通常越快”应保留这个限定；不能简化成“主频越高，计算机一定越快”。'
    ]);

    appendNote('#concept-15','ssd-storage','SSD 是外存：速度快不等于主存',[
      '<strong>SSD 固态硬盘</strong>通常使用 NAND 闪存等半导体存储介质，没有机械磁头和旋转盘片，随机访问延迟较低、抗震性通常较好。',
      'SSD 断电后仍能保存数据，按存储层次属于<strong>外存/辅助存储</strong>。不能因为它比机械硬盘快，就把它归到内存或主存。'
    ]);

    appendNote('#concept-16','color-modes','RGB、CMYK、灰度与颜色深度不是同一个维度',[
      '<strong>RGB</strong>是典型加色模型，常用于显示器、手机屏幕、摄像和面向屏幕的图像流程；<strong>CMYK</strong>是典型减色印刷模型，主要服务于油墨印刷；<strong>灰度</strong>主要记录亮度层级，不等于只有纯黑和纯白两个值。',
      '<strong>颜色深度</strong>描述每个像素用多少位编码颜色，它影响可表示颜色数量和未压缩图像数据量；颜色深度和 RGB/CMYK 这种颜色模式不是同一个概念。',
      '具体软件的新建文档默认颜色模式可能随预设、用途和版本变化。考试遇到“屏幕显示 / 印刷输出 / 灰度”时，优先根据用途判断，不把“某软件永远默认 RGB”当成产品定律。'
    ]);
  }

  function windows() {
    appendNote('#windows-3','active-window','活动窗口看输入焦点，不看程序是否仍在运行',[
      '多个窗口可以同时存在并运行，但通常只有当前具有主要<strong>输入焦点</strong>的前台窗口接收键盘等操作，这就是活动窗口的核心含义。',
      '非活动窗口不等于程序停止，也不表示它不再占用 CPU 或进行后台工作；“活动”描述当前交互焦点，不描述整个系统只运行这一个程序。'
    ]);

    appendNote('#windows-10','modal-dialog','模式与非模式对话框：区别在是否必须先处理',[
      '<strong>模式对话框</strong>通常要求先处理或关闭当前对话框，才能继续操作它所依附的父窗口；<strong>非模式对话框</strong>则允许对话框保持打开，同时回到文档或相关窗口继续工作。',
      '模式对话框限制的通常是其父窗口/所属应用的交互，不宜扩大成“整个 Windows 的任何窗口都绝对无法使用”。'
    ]);

    appendNote('#windows-13','uninstall-residue','卸载应用不等于所有相关文件必然归零',[
      '正常卸载会移除程序主体和已注册组件，但用户文档、配置文件、缓存或第三方插件等内容不一定全部自动删除。',
      '因此“卸载后绝无任何残留”过于绝对；同样，卸载应用和删除由该应用创建的个人文档也不是一回事。'
    ]);

    appendNote('#windows-23','cleanup-remote','磁盘清理与远程桌面：管理对象完全不同',[
      '<strong>磁盘清理</strong>用于释放磁盘空间，可清理符合条件的临时文件、缩略图缓存、回收站内容等；它不是磁盘碎片整理、驱动更新或应用卸载的同义词。',
      '<strong>远程桌面</strong>用于在系统支持、功能已启用、网络可达且账户具有权限等条件满足时远程登录/控制另一台计算机。知道 IP 地址并不意味着一定可以连接。',
      '任务管理器的核心仍是本机进程、性能、启动项等管理。系统存在远程桌面功能，并不能推出“任务管理器是普通的远程电脑控制工具”。'
    ]);
  }

  function word() {
    appendNote('#word-2','selection-width-proofing','选择范围、全半角与校对标记分别改变不同对象',[
      '<strong>Ctrl+Shift+End</strong>从当前位置扩展选择到文档末尾；<strong>Ctrl+End</strong>通常只是把插入点移动到文末。有没有 Shift，决定它是“移动”还是“扩展选择”的关键之一。',
      '<strong>全角/半角</strong>改变字符占用宽度和编码/字形表现，不等于“中文一定全角、英文一定半角”。',
      '拼写、语法等波浪线属于编辑界面的<strong>校对提示</strong>，正常情况下不会作为正文内容打印，也不表示 Word 已经自动把错误改正。'
    ]);

    appendNote('#word-3','highlight-color','突出显示与字体颜色：一个改背景，一个改文字本身',[
      '<strong>文本突出显示颜色</strong>类似荧光笔，改变字符背后的高亮背景；<strong>字体颜色</strong>改变字形本身的颜色。',
      '二者可以同时存在，也不能用“看起来都是彩色”把它们当成同一种字符格式。'
    ]);

    appendNote('#word-5','fixed-minimum-spacing','固定值与最小值行距：是否允许内容撑高是关键',[
      '<strong>固定值</strong>指定严格的行高；如果行内对象实际高度更大，内容可能发生裁切或显示不完整。',
      '<strong>最小值</strong>给出最低行高，当某一行出现更高内容时允许行高继续增大。因此“固定值”和“最小值”即使填写同一个数值，最终排版也可能不同。'
    ]);

    appendNote('#word-13','inline-picture-spacing','嵌入型图片为什么会被固定行距截住',[
      '嵌入型图片像一个较大的字符一样参与当前段落的行内排版，所以段落行距会直接影响它所在行的可用高度。',
      '当固定值行距小于图片实际所需高度时，图片上下部分可能被行框裁切/遮住。解决方向通常是调整行距、调整图片尺寸，或根据版式需求改用适当的浮动环绕方式；这不是“双击图片”能够直接解决的问题。'
    ]);

    appendNote('#word-18','page-field','PAGE 域：页码是一类可自动更新的动态内容',[
      '页码可以由 <strong>PAGE 域</strong>等机制生成。域不是普通静态文字，而是 Word 按规则计算或更新的动态内容。',
      '题注编号、交叉引用、目录和页码都可能涉及域，但“域”只是实现机制，不表示这些功能的用途相同。需要在文本框等文本容器中显示当前页码时，也可以按题目场景插入相应域。'
    ]);
  }

  function excel() {
    appendNote('#excel-5','input-date-clear','日期识别与清除内容：看到的显示形式不等于底层类型',[
      '输入能被当前区域设置识别的日期形式时，Excel 通常把它保存为日期序列值，再通过日期格式显示；看起来像日期的字符串也可能因为输入方式或格式成为文本。',
      '<strong>清除内容</strong>只移除单元格中的值或公式，单元格位置仍然存在；格式是否保留取决于使用“清除内容”还是“全部清除”等具体命令。按 Delete 键清空内容也不等于删除单元格结构。'
    ]);

    appendNote('#excel-6','delete-autofit','删除单元格与自动调整行高：一个改结构，一个改尺寸',[
      '<strong>删除单元格</strong>会移除相应结构位置，并根据选择让周围单元格左移/上移，或者删除整行、整列；这和仅把内容清空不是同一个结果。',
      '<strong>自动调整行高</strong>按内容估算合适的行高；合并单元格等特殊结构可能限制自动调整效果，因此不能把它理解成任何情况下都能完美适配。'
    ]);

    appendNote('#excel-7','formula-external-3d','公式输入、跨表/跨工作簿引用与标准 3-D 引用',[
      '公式通常以 <strong>=</strong> 开始，例如 =A1+B1；若在输入前加英文单引号，后续内容会按文本处理，单引号通常不作为正常显示内容出现。',
      '<strong>跨工作表引用</strong>可写成 Sheet2!A1；工作表名含空格等特殊字符时通常需要单引号，例如 \'销售 数据\'!A1。',
      '<strong>外部工作簿引用</strong>可出现类似 \'[Book2.xlsx]Sheet1\'!$A$1 的形式；<strong>标准 3-D 引用</strong>通常指跨一段连续工作表引用相同地址，例如 SUM(Sheet1:Sheet3!A1)。两者不是同一个概念。',
      '旧教材有时会把“工作簿—工作表—单元格”的多层地址笼统称为三维地址；遇到题目时要结合教材语境判断，但笔记中的标准术语保持区分。无论是哪类引用，复制公式时仍要继续判断相对/绝对引用是否会漂移。'
    ]);

    appendNote('#excel-8','today-date','TODAY() 返回日期值；除以 365 的工龄公式只是常见近似',[
      '<strong>TODAY()</strong>返回系统当前日期，并可在工作簿重新计算时更新。它返回的是日期值，不是固定文本“今天”。',
      '考试中常见 INT((TODAY()-入职日期)/365) 这种按天数近似求整年工龄的写法；直接除以 365 会受到闰年等因素影响。如果题目强调精确完整年数，应根据题意采用更严谨的年月日逻辑，不能把近似公式宣称为日历意义上的绝对精确。'
    ]);

    appendNote('#excel-10','center-across','跨列居中与合并后居中：外观看起来像，底层结构不同',[
      '<strong>跨列居中</strong>可让标题在选定区域视觉上居中，同时保留区域内各单元格彼此独立；<strong>合并后居中</strong>则会真正把区域合并成一个单元格。',
      '因此二者的显示效果可以相近，但后续排序、筛选、引用和编辑时的结构并不一样。操作题先判断题目要的是“视觉居中”还是“真正合并”。'
    ]);

    appendNote('#excel-11','table-format','套用表格格式不是单纯刷颜色，也不是条件格式',[
      'Excel 2016 的<strong>套用表格格式</strong>通常会把普通区域转换为 Excel 表（Table）并应用表格样式，常伴随筛选按钮、带状行和结构化引用等表对象特性。',
      '<strong>单元格样式</strong>是预定义格式集合；<strong>条件格式</strong>则根据单元格值或公式动态决定格式。三者虽然都能改变外观，但作用机制不同。'
    ]);

    appendNote('#excel-16','pivot-report-filter','数据透视表的报表筛选：筛整张分析视图，不是普通自动筛选',[
      '数据透视表字段区域中的<strong>筛选/报表筛选</strong>可以用某个字段的项目限制整张透视表，例如只查看某一专业的汇总。',
      '行、列、值、筛选四个区域职责不同：行列负责分组展示，值负责汇总计算，筛选负责限定整张报表。它属于数据透视表字段布局，不等于直接在源数据标题行上做普通“自动筛选”。',
      '日期字段还可以按年、季度、月等进行组合/分组；值区域的汇总方式可在求和、计数、平均值等之间调整。这里与原知识点共同组成完整的“字段布局—分组—汇总—筛选”链。'
    ]);

    appendNote('#excel-18','validation-details','数据验证/数据有效性：不仅限制值，还能给输入提示',[
      '<strong>数据验证</strong>（旧版本/教材中也常称“数据有效性”）可以限制整数、小数、列表、日期、时间、文本长度，或使用自定义公式；“列表”规则可以生成下拉选项。',
      '它还可以设置<strong>输入信息</strong>，在选中单元格时提示用户，并设置无效输入时的出错警告。不同警告样式的阻止程度不同，因此“有验证规则就任何非法值都绝对无法输入”也要结合具体设置判断。',
      '数据验证控制“允许输入什么”，工作表保护控制“谁能改什么”，二者不能混为一谈。'
    ]);
  }

  function apply() {
    removeLegacyV24Modules();
    chapter1();
    windows();
    word();
    excel();
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
  else setTimeout(schedule, 40);
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
})();