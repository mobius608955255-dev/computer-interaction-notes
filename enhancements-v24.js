(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function conceptBlock(id, number, title, intro, what, use, rules, boundary, memory) {
    return `<section id="${id}" class="concept v24-matrix-concept" data-v24="module">
      <div class="section-shell">
        <div class="concept-index">${String(number).padStart(2,'0')}</div>
        <div class="concept-copy">
          <p class="kicker">CONCEPT ${String(number).padStart(2,'0')}</p>
          <h2>${title}</h2>
          <p>${intro}</p>
          <div class="v10-concept-note">
            <div><span>是什么</span><p>${what}</p></div>
            <div><span>有什么用</span><p>${use}</p></div>
          </div>
          <div class="lab-card">
            <div class="lab-heading"><span class="lab-dot"></span><div><p>核心规则</p><h3>把组成、作用和边界分开</h3></div></div>
            <div class="note-body"><ul>${rules.map(x=>`<li>${x}</li>`).join('')}</ul></div>
          </div>
          <div class="lab-card tone-peach">
            <div class="lab-heading"><span class="lab-dot"></span><div><p>边界</p><h3>不能这样绝对化</h3></div></div>
            <div class="note-body"><p>${boundary}</p></div>
          </div>
          <div class="memory-line"><span>一条线记住</span><strong>${memory}</strong></div>
        </div>
      </div>
    </section>`;
  }

  function courseBlock(id, number, title, lead, what, use, rules, boundary, memory) {
    return `<section id="${id}" class="course-module v24-matrix-module" data-v24="module">
      <div class="module-shell">
        <header class="module-head"><span>${String(number).padStart(2,'0')}</span><div><small>知识点</small><h2>${title}</h2><p>${lead}</p></div></header>
        <div class="v10-concept-note">
          <div><span>是什么</span><p>${what}</p></div>
          <div><span>有什么用</span><p>${use}</p></div>
        </div>
        <div class="module-grid">
          <div class="knowledge-card"><h3>核心规则与操作结果</h3><ul>${rules.map(x=>`<li>${x}</li>`).join('')}</ul></div>
          <div class="knowledge-card"><h3>边界要分清</h3><p>${boundary}</p></div>
        </div>
        <div class="memory-line"><span>一条线记住</span><strong>${memory}</strong></div>
      </div>
    </section>`;
  }

  function excelBlock(id, number, title, intro, what, use, rules, boundary, memory) {
    return `<section id="${id}" class="concept v24-excel-concept" data-v24="module">
      <div class="section-shell">
        <div class="concept-index">${String(number).padStart(2,'0')}</div>
        <div class="concept-copy">
          <p class="kicker">EXCEL ${String(number).padStart(2,'0')}</p>
          <h2>${title}</h2>
          <p>${intro}</p>
          <div class="v10-concept-note">
            <div><span>是什么</span><p>${what}</p></div>
            <div><span>有什么用</span><p>${use}</p></div>
          </div>
          <div class="lab-card tone-mint">
            <div class="lab-heading"><span class="lab-dot"></span><div><p>核心规则</p><h3>先看对象，再看操作结果</h3></div></div>
            <div class="note-body"><ul>${rules.map(x=>`<li>${x}</li>`).join('')}</ul></div>
          </div>
          <div class="lab-card">
            <div class="lab-heading"><span class="lab-dot"></span><div><p>边界</p><h3>容易被一个词带偏的地方</h3></div></div>
            <div class="note-body"><p>${boundary}</p></div>
          </div>
          <div class="memory-line"><span>一条线记住</span><strong>${memory}</strong></div>
        </div>
      </div>
    </section>`;
  }

  function addChapter1() {
    if (!$('#concept-21') || $('#concept-22')) return;
    const last = $$('.concept[id^="concept-"]').filter(x => x.offsetParent !== null).at(-1);
    if (!last) return;
    const html = [
      conceptBlock(
        'concept-22', 22, '指令、总线、性能指标与 SSD',
        '这些词都属于“计算机硬件基础”，但分别回答四个不同问题：CPU 执行什么、部件怎样传信息、机器有多快、数据长期存在哪里。',
        '基础教材通常把机器指令抽象为操作码和地址码/操作数地址等字段；系统总线按传递内容常分为数据总线、地址总线和控制总线；BIPS 等指标描述处理速度；SSD 是以半导体存储介质为核心的外存设备。',
        '这组概念能把“指令组成、总线类别、BIPS 含义、SSD 特点”四类真题放进同一硬件框架，而不是零散背四句话。',
        [
          '<strong>指令组成：</strong>按基础教材模型，操作码指出“做什么操作”，地址码/操作数字段指出“对谁操作、数据在哪里”。不同指令系统的真实编码可以更复杂，考试先按教材抽象理解。',
          '<strong>数据总线：</strong>传送数据；<strong>地址总线：</strong>传送地址信息；<strong>控制总线：</strong>传送读写、中断、时序等控制信号。三者按“传什么”分类，不按物理线的颜色或位置分类。',
          '<strong>BIPS：</strong>Billion Instructions Per Second，表示每秒十亿条指令这一数量级；MIPS 是每秒百万条指令。它们是特定性能度量，不能单独代表一台计算机所有场景下的综合性能。',
          '<strong>性能指标：</strong>主频、字长、核心数、缓存、存储器速度、I/O 与具体程序负载都会影响实际表现；“主频更高 = 所有程序一定更快”过于绝对。',
          '<strong>SSD：</strong>固态硬盘通常使用 NAND 闪存等半导体存储介质，没有机械磁头和旋转盘片，随机访问延迟低、抗震性较好；它属于外存，断电后仍可保存数据。'
        ],
        '“指令由操作码和地址码组成”是基础教材的抽象模型，不应外推为所有现代指令都只能有两个字段；BIPS、主频也都不能脱离体系结构和任务类型直接比较所有计算机。SSD 不是内存，更不是“速度快所以属于主存”。',
        '指令看“做什么/对谁做”，总线看“传什么”，性能指标看“多快”，SSD 看“长期怎么存”。'
      ),
      conceptBlock(
        'concept-23', 23, '信息、数据与颜色模式',
        '“信息”和“数据”不是两个互不相干的词；RGB、CMYK、灰度也不是三种图片文件格式。',
        '数据是信息的表示和载体之一，信息是从数据中获得的有意义内容；颜色模式则规定如何用若干颜色分量表达颜色，例如 RGB 用红绿蓝光分量，CMYK 用青品黄黑油墨分量，灰度主要用明暗等级表达。',
        '这部分解决两类容易被一句话带偏的基础题：一类考“数据与信息是什么关系”，另一类考“显示、印刷、灰度图该怎样理解”。',
        [
          '<strong>数据与信息：</strong>文字、数字、图像、声音等都可以作为数据形式承载信息；同一组数据在不同语境下可能表达不同信息，因此“数据 = 信息”并不严谨。',
          '<strong>RGB：</strong>典型的加色模型，常用于显示器、手机屏幕、摄像和面向屏幕的图像工作流程；三个通道数值共同决定颜色。',
          '<strong>CMYK：</strong>典型的减色印刷模型，服务于油墨/印刷工作流程；它不是“显示器的默认发光方式”。',
          '<strong>灰度：</strong>主要记录亮度层级，没有完整彩色通道信息；灰度图不等于只有黑和白两个值。',
          '<strong>颜色深度：</strong>描述每个像素可用多少位来编码颜色，与图像可表示的颜色数量及未压缩数据量有关；它和 RGB/CMYK 这种颜色模式不是同一个维度。'
        ],
        '现代 Photoshop 新建文档的具体默认颜色模式会随预设、用途和版本变化，不能把“Photoshop 永远默认 RGB”当产品定律。考试遇到颜色模式时，优先根据“屏幕显示 / 印刷输出 / 灰度”判断用途。',
        '数据承载信息；RGB 面向光显示，CMYK 面向印刷，灰度看明暗层级。'
      )
    ].join('');
    last.insertAdjacentHTML('afterend', html);
  }

  function addWindows() {
    const footer = $('.windows-page .course-footer');
    if (!footer || !$('#windows-23') || $('#windows-24')) return;
    const html = [
      courseBlock(
        'windows-24', 24, '活动窗口与模式/非模式对话框',
        '“窗口在屏幕上”不等于“窗口正在接收键盘输入”；“弹出对话框”也不等于一定锁住父窗口。',
        '活动窗口通常指当前具有输入焦点、正在接受用户键盘等操作的前台窗口；模式对话框要求先处理当前对话框，才能继续操作其父窗口；非模式对话框允许在对话框保持打开时回到文档或其他相关窗口继续操作。',
        '理解焦点和交互限制，才能判断标题栏状态、窗口切换以及“对话框打开后还能不能继续编辑文档”等结果。',
        [
          '多个窗口可以同时存在并运行，但通常只有一个前台活动窗口接受主要键盘输入；后台窗口不等于程序已经停止。',
          '单击另一个可交互窗口、使用 Alt+Tab 等方式可以改变活动窗口。',
          '模式对话框的核心是对父窗口的交互限制：通常必须确定、取消或关闭后才能回到父窗口继续操作。',
          '非模式对话框可以保持打开，同时允许用户回到文档继续工作；“查找”等功能在一些版本/界面中就具有这种交互特征。',
          '“是否模式”描述交互方式，不由窗口大小、是否有标题栏、有没有最大化按钮单独决定。'
        ],
        '活动窗口强调当前输入焦点，不表示只有它在占用 CPU；非活动窗口和后台进程仍可继续运行。模式对话框通常限制的是父窗口交互，不宜扩大成“整个 Windows 任何窗口都绝对不能使用”。',
        '活动窗口看焦点；模式对话框先处理再返回，非模式对话框可边开着边继续工作。'
      ),
      courseBlock(
        'windows-25', 25, '磁盘清理、卸载残留与远程桌面',
        '三个功能都和“系统维护”有关，但一个清理无用文件，一个移除应用，一个通过网络控制远端计算机。',
        '磁盘清理用于删除符合条件的临时文件、回收站内容等可清理项目；卸载用于移除应用程序主体；远程桌面用于在满足网络、权限和系统配置条件时远程登录/控制另一台计算机。',
        '把三个工具的管理对象分开，就不会因为题目都出现“系统工具”四个字而选错。',
        [
          '<strong>磁盘清理：</strong>主要释放磁盘空间，可清理临时文件、缩略图缓存、回收站等项目；它不是磁盘碎片整理，也不是驱动程序更新工具。',
          '<strong>卸载应用：</strong>通常删除程序主体和注册的组件，但用户文档、配置、缓存或第三方残留不一定全部自动消失，因此“卸载后绝无任何残留”过于绝对。',
          '<strong>远程桌面：</strong>需要远端设备支持并启用相应功能、网络可达且账户有权限；连接成功后可看到并操作远端桌面环境。',
          '远程桌面和“远程协助/屏幕共享”概念相近但目的与权限模型并不完全相同，考试先按教材给定场景判断。',
          '任务管理器的主要职责仍是本机进程/性能/启动项等管理，不能因为系统存在远程桌面，就把任务管理器说成普通的远程电脑控制工具。'
        ],
        '磁盘清理不保证“电脑变快”，卸载也不保证“所有痕迹归零”，远程桌面更不等于只要知道 IP 就必然能连接；三者都受具体对象和条件限制。',
        '清空间用磁盘清理，移程序用卸载，跨网络控制远端桌面用远程桌面。'
      )
    ].join('');
    footer.insertAdjacentHTML('beforebegin', html);
  }

  function addWord() {
    const footer = $('.word-page .course-footer');
    if (!footer || !$('#word-23') || $('#word-24')) return;
    const html = [
      courseBlock(
        'word-24', 24, '文本选择、全半角与突出显示',
        '这三类操作都发生在文字上，但一个决定“选多少”，一个改变字符宽度形态，一个改变视觉标记。',
        'Word 的选择快捷键可以快速扩展选区；全角/半角描述某些字符在东亚排版中的占位和字形形式；文本突出显示颜色类似荧光笔背景，而字体颜色改变的是字符笔画本身的颜色。',
        '这组概念能直接解释 Ctrl+Shift+End、全半角转换以及“黄色背景到底是字体颜色还是突出显示”等真题。',
        [
          '<strong>Ctrl+Shift+End：</strong>从当前插入点扩展选择到文档结尾；Ctrl+Shift+Home 则扩展到文档开头。Ctrl+End 只移动光标，不建立选区。',
          '<strong>Shift：</strong>常用于从当前插入点扩展连续选区；Ctrl 常与方向键、单击等组合实现按词、按段或非连续选择，具体行为取决于组合方式。',
          '<strong>全角/半角：</strong>常见于数字、英文字母和标点的东亚文字排版。全角字符通常占一个汉字宽度，半角字符通常较窄；转换改变字符形式，不等于改变字体字号。',
          '<strong>突出显示颜色：</strong>相当于文字后的荧光笔底色；<strong>字体颜色：</strong>改变字形笔画颜色。两者可以同时存在。',
          '清除突出显示不应顺带理解为清除字体颜色、加粗、字号等全部字符格式。'
        ],
        '全角/半角并不是“中文一定全角、英文一定半角”的绝对规则；选择快捷键也要区分“移动光标”和“扩展选择”，有没有 Shift 是关键之一。',
        'Ctrl+Shift+End 选到文末；全半角改字符形态；突出显示改背景，字体颜色改字。'
      ),
      courseBlock(
        'word-25', 25, '嵌入型图片、固定行距、页面背景与校对标记',
        '图片被截掉、页面有水印、文字下面有波浪线，这三个现象分别来自段落布局、页面背景和校对系统。',
        '嵌入型图片像一个大字符一样参加行内排版；固定值行距会严格限制行高；页面颜色/水印/页面边框属于页面背景；拼写和语法波浪线属于屏幕校对标记。',
        '学会按现象定位层级，能避免“图片被挡就双击图片”“有波浪线就会打印出来”“水印就是普通正文图片”等错误处理。',
        [
          '<strong>嵌入型图片 + 固定值行距：</strong>如果固定行距小于图片实际需要的高度，图片上下部分可能被行框裁切/遮住。解决方向是调整行距、图片大小或环绕方式，而不是靠双击图片。',
          '<strong>固定值行距：</strong>指定的是严格的行高；“最小值”则允许遇到较高内容时把行高撑大，两者结果不同。',
          '<strong>页面背景：</strong>页面颜色、水印、页面边框属于页面级效果；水印通常位于正文之后，Word 内部常借助页眉层中的形状/艺术字等对象实现。',
          '<strong>拼写/语法波浪线：</strong>是编辑界面的校对提示，正常情况下不会作为正文内容打印；它们也不等于文档已经自动改正错误。',
          '<strong>PAGE 域：</strong>页码本质上可以由 PAGE 等域生成。需要在文本框/形状等文本容器中显示当前页码时，可插入相应域；这和“预设页码样式只能放页眉页脚”不是同一句话。'
        ],
        '“嵌入型”决定图片像字符一样参与段落排版，所以行距能裁切它；浮动环绕图片的定位规则不同。校对波浪线是界面提示，不要和下划线格式混淆。',
        '图片被截先查行距；水印属于页面背景；校对波浪线只提示、不随正文正常打印。'
      )
    ].join('');
    footer.insertAdjacentHTML('beforebegin', html);
  }

  function addExcel() {
    if (!$('#excel-22') || $('#excel-23')) return;
    const last = $$('.concept[id^="excel-"]').filter(x => x.offsetParent !== null).at(-1);
    if (!last) return;
    const html = [
      excelBlock(
        'excel-23', 23, '输入解析、清除内容、删除单元格与跨列居中',
        'Excel 不只存“文字和数字”，还会根据输入形式判断常量、日期、公式；而清除、删除、合并、跨列居中改变的层级也不同。',
        '单元格可以保存常量、公式等内容；清除内容只移除内容，删除单元格会改变表格结构并可能让周围单元格移动；“跨列居中”在不合并单元格的情况下让显示效果跨多个单元格居中。',
        '这是操作题里非常典型的“看起来一样，底层结果不同”：标题都能居中，但合并会改变单元格结构，跨列居中不会。',
        [
          '<strong>公式起始：</strong>通常以 = 开始输入，例如 =A1+B1；如果前面加英文单引号，Excel 会把后续内容按文本保存，单引号本身通常不在单元格正常显示结果中显示。',
          '<strong>日期识别：</strong>输入能被当前区域设置识别的日期形式时，Excel 通常保存为日期序列值并用日期格式显示；看起来像日期的字符串也可能因为格式/输入方式而成为文本。',
          '<strong>清除内容：</strong>删除单元格中的值或公式，但单元格位置仍在；格式是否保留取决于使用“清除内容”还是“全部清除”等具体命令。',
          '<strong>删除单元格：</strong>会移除该结构位置，并让其他单元格按提示左移/上移，或者删除整行/整列；这不是“按 Delete 键清空内容”的同义词。',
          '<strong>跨列居中：</strong>在“设置单元格格式 → 对齐”等位置可实现标题跨选定区域显示居中，同时保留每个单元格独立；“合并后居中”会把区域合成一个单元格。',
          '<strong>自动调整行高：</strong>按内容自动确定行高；若存在合并单元格等特殊结构，自动调整结果可能受限制，不能把它理解成任何情况下都能完美适配。'
        ],
        '“显示效果一样”不代表底层结构一样。跨列居中和合并居中尤其要分：前者保留多个独立单元格，后者改变区域结构。清除内容和删除单元格也同理。',
        '先问“只是改内容/显示，还是改了单元格结构”；这一步能区分清除、删除、跨列居中和合并。'
      ),
      excelBlock(
        'excel-24', 24, '数据验证、表格格式与 TODAY 日期计算',
        '这三个功能分别解决“允许输入什么”“把区域变成怎样的数据表”“当前日期怎样参与公式”。',
        '数据验证（旧版本/教材中也常称“数据有效性”）给单元格设输入规则；套用表格格式会把普通区域转成 Excel 表并应用表格样式；TODAY() 返回当前日期，可参与日期差计算。',
        '把概念讲清后，列表下拉、限制日期范围、自动表格样式、按今天计算工龄等操作就不需要靠记截图。',
        [
          '<strong>数据验证：</strong>可限制整数、小数、列表、日期、时间、文本长度或使用自定义公式；“列表”规则可以生成下拉选项。Office 不同版本中文名称可能见到“数据有效性/数据验证”，核心功能相同。',
          '<strong>输入信息与出错警告：</strong>数据验证不仅能限制值，还可在选中单元格时提示输入信息，并在无效输入时给出停止、警告或信息等不同级别的提示。',
          '<strong>套用表格格式：</strong>Excel 2016 的“套用表格格式”通常会把区域转换为表（Table）并应用样式，常伴随筛选按钮、带状行、结构化引用等表功能；它不只是给单元格刷一层颜色。',
          '<strong>单元格样式：</strong>是另一类预定义格式集合，和“套用表格格式”作用对象、结果并不完全相同。',
          '<strong>TODAY()：</strong>返回系统当前日期且会随工作簿重新计算更新。考试中常见 INT((TODAY()-入职日期)/365) 这种按天数近似计算整年工龄的方法。',
          '<strong>精确整年：</strong>直接除以 365 会受闰年影响，若题目要求精确完整年数，应根据题意使用更严谨的年月日逻辑；不要把考试给定近似公式宣称为日历意义上的绝对精确。'
        ],
        '“数据验证”限制的是输入规则，不等于工作表保护；“套用表格格式”会引入表对象特性，也不等于条件格式；TODAY() 返回日期而不是固定文本“今天”。',
        '验证管“能输什么”，表格格式管“区域成为表并怎么显示”，TODAY() 管“今天这个日期值”。'
      ),
      excelBlock(
        'excel-25', 25, '数据透视表报表筛选与工作表/工作簿引用',
        '数据透视表里的“筛选字段”和公式里的“跨表引用”都在改变数据来源范围，但一个是分析视图，一个是公式地址。',
        '报表筛选是数据透视表字段布局区域之一，用一个字段对整张透视表进行项目筛选；工作表引用用工作表名和 ! 指向其他表，外部引用还会带工作簿名；标准的 3-D 引用则可以跨一组连续工作表引用同一位置。',
        '这部分专门解决两个容易混词的问题：把“报表筛选”误当普通自动筛选，以及把“跨工作簿引用”一概叫成 3-D 引用。',
        [
          '<strong>报表筛选：</strong>把字段拖入数据透视表“筛选/报表筛选”区域后，可以按该字段的项目筛选整张透视表，例如按专业只看某一专业汇总。',
          '<strong>行/列/值/筛选：</strong>四个区域职责不同：行列负责分组展示，值负责汇总计算，筛选负责对整张报表限定项目。',
          '<strong>跨工作表引用：</strong>例如 Sheet2!A1；工作表名含空格等特殊字符时通常用单引号括起，例如 \'销售 数据\'!A1。',
          '<strong>外部工作簿引用：</strong>可出现类似 \'[Book2.xlsx]Sheet1\'!$A$1 的形式，表示引用另一工作簿中的单元格。',
          '<strong>标准 3-D 引用：</strong>通常指跨一段连续工作表引用同一地址，例如 SUM(Sheet1:Sheet3!A1)。它和“引用另一个工作簿”不是完全同一个概念。',
          '<strong>复制公式：</strong>无论本表、跨表还是外部引用，都还要继续判断相对/绝对引用是否会在复制方向上漂移。'
        ],
        '旧教材有时把“工作簿—工作表—单元格”这种多层地址笼统称为三维地址，但现代 Excel 的“3-D reference”有更具体含义。笔记同时保留教材语境和标准术语，避免概念混用。',
        '透视表筛选管整张分析报表；公式引用先分本表、跨表、外部工作簿，再判断是否是真正的 3-D 工作表范围引用。'
      )
    ].join('');
    last.insertAdjacentHTML('afterend', html);
  }

  function normalizeWording() {
    $$('span,small,p,b,strong,h3,h4').forEach(el => {
      if (el.childElementCount) return;
      const t = el.textContent;
      if (t.includes('陷阱训练')) el.textContent = t.replaceAll('陷阱训练','易错点');
      if (t.includes('真题陷阱句')) el.textContent = el.textContent.replaceAll('真题陷阱句','易错辨析');
      if (t.includes('点击一句话判断正误')) el.textContent = el.textContent.replaceAll('点击一句话判断正误','点开可查看这句话为什么对或错');
    });
  }

  function apply() {
    addChapter1();
    addWindows();
    addWord();
    addExcel();
    normalizeWording();
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