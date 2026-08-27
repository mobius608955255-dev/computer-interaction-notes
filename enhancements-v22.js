(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function conceptBlock(id, number, title, intro, what, use, rules, memory) {
    return `<section id="${id}" class="concept v22-matrix-concept" data-v22="1">
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
            <div class="lab-heading"><span class="lab-dot"></span><div><p>核心规则</p><h3>先把概念和运行结果讲清楚</h3></div></div>
            <div class="note-body"><ul>${rules.map(x=>`<li>${x}</li>`).join('')}</ul></div>
          </div>
          <div class="memory-line"><span>一条线记住</span><strong>${memory}</strong></div>
        </div>
      </div>
    </section>`;
  }

  function courseBlock(id, number, title, lead, what, use, rules, boundary, memory) {
    return `<section id="${id}" class="course-module v22-matrix-module" data-v22="1">
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

  function addChapter1Coverage() {
    if ($('#concept-17')) return;
    const concepts = $$('.concept[id^="concept-"]').filter(x => x.offsetParent !== null);
    const last = concepts.at(-1);
    if (!last || !$('#concept-1')) return;

    const html = [
      conceptBlock(
        'concept-17',17,'计算思维',
        '计算思维不是“会用电脑”，也不是“必须写程序”，而是一套把复杂问题变成可处理步骤的思考方式。',
        '计算思维通常包括问题分解、抽象、模式识别、算法化表达和把可重复步骤交给计算系统自动执行等思想。它可以用于计算机问题，也可以用于医学、管理和日常决策。',
        '它帮助你判断一道题到底在考“怎么拆问题、保留哪些关键特征、怎样形成可执行步骤”，而不是只记某个软件按钮。',
        [
          '分解：把大问题拆成若干较小、可处理的子问题。',
          '抽象：忽略当前无关细节，保留解决问题真正需要的属性和关系。',
          '算法化：把解决方案组织成有先后关系、能明确执行的步骤。',
          '自动化是计算思维的重要落地方向，但“计算思维 = 使用计算机”或“计算思维 = 计算机科学本身”都过于绝对。'
        ],
        '先分解和抽象，再把解决方法写成算法；计算机只是执行这些方法的重要工具。'
      ),
      conceptBlock(
        'concept-18',18,'算法：定义、特征与表示',
        '算法先回答“怎样一步一步解决问题”，程序才是把其中一类算法写成计算机可以执行的形式。',
        '算法是为解决一类问题而规定的有限步骤序列。教材常从有穷性、确定性、可行性以及输入/输出关系等方面描述算法特征。',
        '学会算法的定义和表示，才能看懂流程图、伪代码、循环累加、排序过程，也能判断哪些图根本不是算法表示。',
        [
          '有穷性：执行有限步骤后应结束；“永远执行下去”通常不符合一个完整求解算法的要求。',
          '确定性：每一步含义明确，在给定条件下知道下一步做什么。',
          '可行性：基本操作应当能够在有限时间内实际完成。',
          '输入可以是零个或多个；求解算法应产生至少一个输出结果。',
          '常见表示方法有自然语言、流程图、伪代码和程序设计语言；E-R 图主要描述数据库实体联系，不属于通常的算法表示。',
          '时间复杂度和空间复杂度描述两种不同资源消耗，二者并不必然成正比。'
        ],
        '算法 = 明确、可执行、会结束的求解步骤；自然语言、流程图和伪代码只是不同表达方式。'
      ),
      conceptBlock(
        'concept-19',19,'顺序、分支、循环与流程图',
        '绝大多数基础算法都可以拆回三种控制结构：顺序、分支和循环。',
        '顺序结构按既定次序执行；分支结构根据条件选择路径；循环结构在条件控制下重复执行一组步骤。流程图用标准图形把这些控制关系画出来。',
        '这部分直接决定你能不能看懂“循环到什么时候停、累加器为什么这样变、计数器代表什么、一次排序后序列变成什么”。',
        [
          '顺序结构：没有条件选择，也没有回到前面重复执行的控制边。',
          '分支结构：先判断条件，再在不同路径中选择一条或多条规定路径。',
          '循环结构：包含循环条件、循环体以及使循环逐步接近结束的变量变化。',
          '累加器常写成 S=S+x，用于累计总量；计数器常写成 C=C+1，用于记录发生次数。',
          '分析流程图时按“初值 → 判断 → 执行 → 更新变量 → 再判断”逐轮追踪，不要只盯最终公式。',
          '冒泡排序的一趟操作是相邻元素逐对比较并按规则交换；一趟结束只保证一个极值被推到相应端点，并不等于整个序列已经完全有序。'
        ],
        '顺序看次序，分支看条件，循环看“初值—条件—循环体—变量更新”。'
      ),
      conceptBlock(
        'concept-20',20,'程序设计语言与程序执行',
        '算法要交给计算机执行，需要用程序设计语言表达，并最终转成处理器能够执行的机器指令。',
        '机器语言直接使用机器指令的二进制形式；汇编语言用助记符表示低级指令；高级语言更接近人的表达方式，例如 C、C++ 等。源程序经过翻译后才能形成或驱动可执行过程。',
        '它把“高级语言、机器语言、编译/解释、程序装入内存”串成一条运行链，避免把源代码文件和正在运行的程序混为一谈。',
        [
          '机器语言与具体处理器体系密切相关，可由计算机直接执行，但可读性和可移植性较差。',
          '汇编语言通常需要汇编程序翻译；高级语言通常通过编译或解释等方式转换/执行。',
          'C、C++属于高级程序设计语言；“高级”描述抽象层次，不表示程序一定更复杂。',
          '程序保存在外存时只是文件；真正运行时，相关程序和数据需要装入内存，由 CPU 按指令执行。',
          '源程序、目标程序、可执行程序和运行中的进程不是同一个概念。'
        ],
        '算法规定怎么做，程序语言把算法写出来；运行时程序进入内存，CPU 才能执行指令。'
      ),
      conceptBlock(
        'concept-21',21,'面向对象与队列基础',
        '这部分不是让你写大型程序，而是先认识两个稳定出现的基础概念：对象模型和先进先出的队列。',
        '面向对象把数据和操作组织为对象，类用于描述一类对象共有的属性和行为；队列是一种受限线性结构，通常在队尾入队、队头出队。',
        '它们帮助你处理“类和对象是什么关系”“封装/继承/多态属于什么思想”“一串元素按什么顺序出队”这类基础判断。',
        [
          '类可以看作对象的抽象模板，对象是类的具体实例；类与对象不能直接画等号。',
          '封装把数据和相关操作组织在一起并控制访问；继承用于复用和扩展已有类型；多态允许同一接口表现出不同实现。',
          '对象之间可以通过消息/方法调用发生交互。',
          '队列遵循 FIFO（先进先出）：先进入队列的元素通常先被删除；入队和出队作用在不同端。',
          '栈遵循 LIFO（后进先出），不要把栈和队列的删除顺序混在一起。'
        ],
        '类描述一类对象，对象是实例；队列先进先出，栈后进先出。'
      )
    ].join('');

    last.insertAdjacentHTML('afterend', html);
  }

  function addWindowsCoverage() {
    const footer = $('.windows-page .course-footer');
    if (!footer || $('#windows-22')) return;
    const html = [
      courseBlock(
        'windows-22',22,'剪贴板、压缩文件与文件资源管理器',
        '复制/剪切先经过剪贴板；ZIP 是归档压缩文件；快速访问只是入口。',
        '剪贴板是 Windows 在复制、剪切等操作中暂存数据的机制；压缩文件把一个或多个文件组织到压缩包中；文件资源管理器负责浏览、搜索和管理文件系统中的对象。',
        '把三者分清，可以判断“复制后原文件是否还在、压缩包是不是新文件、快速访问是不是新存储位置、睡眠是否必然清空剪贴板”等结果。',
        [
          '复制把数据放入剪贴板并保留原对象；剪切表示准备移动，文件通常在真正粘贴完成前仍存在于原位置。',
          'Windows 10 可在启用条件下使用剪贴板历史（Win+V）保存多条记录；不能把“进入睡眠”绝对写成“剪贴板必然丢失”。',
          '“发送到 → 压缩(zipped)文件夹”等操作会创建 ZIP 压缩包，通常不会自动删除源文件。',
          'ZIP 是一个新的归档文件；已经高度压缩的 JPEG、MP4 等内容再次压缩时，体积不一定明显减小。',
          '快速访问、搜索结果和库都属于访问/组织入口，不是把原文件复制到一个新的物理存储位置。'
        ],
        '复制、剪切、压缩和“快速访问”改变的对象不同：一个管临时数据，一个管移动意图，一个生成归档文件，一个只是入口。',
        '先问“真实文件在哪里”，再判断剪贴板、压缩包或入口发生了什么变化。'
      ),
      courseBlock(
        'windows-23',23,'本地组策略与系统工具边界',
        '任务管理器管进程，设备管理器管硬件驱动，组策略管系统策略。',
        '本地组策略编辑器用于配置计算机和用户级策略，例如某些设备访问限制、系统组件行为等；它与任务管理器、设备管理器、控制面板/设置的管理对象不同。',
        '真题会把多个“系统工具”放在一起，让你根据问题对象选择正确工具。理解职责比背入口更稳定。',
        [
          '任务管理器：查看/结束进程、观察性能、管理启动项等，不是常规卸载工具，也不是远程计算机监控平台。',
          '设备管理器：查看硬件设备状态并管理驱动；设备出现黄色感叹号时应优先检查设备/驱动状态。',
          '本地组策略编辑器：配置策略和限制；例如对可移动存储访问实施策略限制属于这类管理思路。',
          '控制面板/设置：面向大量常规系统与用户配置；不能因为都叫“系统设置”就认为任何限制都只能在控制面板完成。',
          'Windows 10 Home 通常不提供完整的本地组策略编辑器管理界面；具体可用功能还取决于 Windows 版本。'
        ],
        '先按“进程—硬件驱动—策略—常规设置”四类对象选工具，名称相似也不会混。',
        '问题对象决定工具：进程找任务管理器，设备找设备管理器，策略找组策略。'
      )
    ].join('');
    footer.insertAdjacentHTML('beforebegin', html);
  }

  function addWordCoverage() {
    const footer = $('.word-page .course-footer');
    if (!footer || $('#word-21')) return;
    const html = [
      courseBlock(
        'word-21',21,'项目符号、编号与多级列表',
        '项目符号表示并列，编号表示顺序，多级列表再增加“层级关系”。',
        '项目符号用于无严格顺序的条目；编号用于有顺序的条目；多级列表可以让一级、二级、三级等条目形成层次，并分别控制编号格式和缩进。',
        '这部分决定你能不能看懂“为什么编号层级不对、Tab 为什么能改变级别、编号和正文之间为什么离得太远”。',
        [
          '多级列表的“级别”是结构属性，不是单纯把文字向右拖一点；字体、字形变化也不会自动改变列表级别。',
          '在列表项开头使用 Tab 通常可以降低一级，Shift+Tab 通常可以提升一级；也可使用提高/降低列表级别等命令。',
          '“编号位置”控制编号本身离左边界的位置；“文本缩进”控制编号之后正文开始的位置，两者共同影响编号与正文间距。',
          '改变某一级的编号样式时，应先确认正在修改的是哪个列表级别，否则可能把一级编号和二级编号一起改乱。',
          '多级列表可以与标题样式关联，形成“1、1.1、1.1.1”式章节编号；这与手工键入数字不是一回事。'
        ],
        '“层级错”先改列表级别；“编号和正文距离错”再看编号位置与文本缩进。',
        '项目符号看并列，编号看顺序，多级列表还要看层级。'
      ),
      courseBlock(
        'word-22',22,'对象层叠、链接对象与嵌入对象',
        '浮动对象有前后层次；链接对象依赖源文件，嵌入对象把内容带进文档。',
        '图片、形状、艺术字等浮动对象可以设置置于顶层/底层、上移/下移等层叠次序；Excel 等外部内容插入 Word 时，还要区分“链接到源文件”和“嵌入到文档”。',
        '它能解释形状为什么被其他对象遮住、源 Excel 改动为什么可能同步到 Word，以及为什么有些对象不能直接自由组合。',
        [
          '“置于顶层/上移一层”改变对象的 Z 顺序，不改变对象本身大小或环绕类型。',
          '嵌入型图片像字符一样位于正文流中；要进行自由层叠、对齐或组合，通常需要先使用浮动型文字环绕。',
          '链接对象保存与源文件的联系，源内容更新后可更新 Word 中的链接结果；源文件移动、改名或不可访问时链接可能失效。',
          '嵌入对象把对象内容保存进 Word 文档，独立性更强，但会增加文档体积，且不会按外部源文件路径自动同步。',
          '链接与嵌入都不同于“把数据截图粘贴成普通图片”。'
        ],
        '对象遮挡看层叠次序；是否随外部源更新，看它是链接还是嵌入。',
        '浮动对象先看层叠；外部内容再分链接与嵌入。'
      )
    ].join('');
    footer.insertAdjacentHTML('beforebegin', html);
  }

  function appendNote(sectionSelector, marker, title, paragraphs) {
    const section = $(sectionSelector);
    if (!section || $(`[data-v22-note="${marker}"]`, section)) return;
    const host = $('.section-shell, .module-shell', section) || section;
    host.insertAdjacentHTML('beforeend', `<div class="lab-card v22-matrix-note" data-v22-note="${marker}">
      <div class="lab-heading"><span class="lab-dot"></span><div><p>完整矩阵补全</p><h3>${title}</h3></div></div>
      <div class="note-body">${paragraphs.map(p=>`<p>${p}</p>`).join('')}</div>
    </div>`);
  }

  function enhanceExistingWord() {
    appendNote('#word-5','cn-number-spacing','中文与数字 / 中文与西文是两个设置',[
      'Word 的中文版式里，“自动调整中文与数字的间距”和“自动调整中文与西文的间距”是两个不同选项。题目只有中文与数字时，应针对“中文与数字”判断，不能笼统写成“中文与西文间距”。'
    ]);
    appendNote('#word-10','page-background','页面背景不是页面方向/页边距',[
      '页面颜色、水印、页面边框属于页面背景类效果；纸张方向、纸张大小、页边距属于页面设置。水印常用于“草稿、机密”等背景标识，不要把它和页眉文字、图片环绕混成同一操作。'
    ]);
  }

  function enhanceExcelCoverage() {
    appendNote('#excel-18','data-toolkit','其它数据处理：每个工具到底改什么',[
      '<strong>删除重复项：</strong>按你选择的列判断重复，并删除对应的重复记录；它会修改当前数据，操作前应确认判断重复的字段。',
      '<strong>分列：</strong>按分隔符或固定宽度把一列文本拆成多列；目标区域右侧已有数据时要防止被覆盖。',
      '<strong>CSV / 外部文本：</strong>CSV 本质是分隔文本，不等同于完整 Excel 工作簿；导入时可处理分隔符、编码和列数据类型。',
      '<strong>冻结窗格：</strong>冻结的是当前活动单元格上方的行、左侧的列；“冻结首行”只冻结第1行，不能替代任意位置的冻结。',
      '<strong>数据验证：</strong>用于限制或提示输入规则；“停止”型错误警告才会强制阻止直接输入非法值，警告/信息型可允许用户继续。'
    ]);
    appendNote('#excel-20','combo-chart','组合图与次坐标轴',[
      '组合图允许不同数据系列使用不同图表类型，例如“客流量用柱形、增长率用折线”。当两个系列数量级或单位差异很大时，可把其中一个系列放到<strong>次坐标轴</strong>。',
      '设置次坐标轴只是改变图表的显示刻度，不会修改工作表中的源数据。切换行/列也只是重新解释“系列”和“分类”，并不会把源数据区域真正转置。'
    ]);
  }

  function normalizeNoteLanguage() {
    $$('.module-head small').forEach(el => {
      if (el.textContent.includes('最小命题颗粒')) el.textContent = '知识点';
    });
    $$('.special-title span').forEach(el => {
      if (el.textContent.includes('操作实验')) el.textContent = '操作演示';
    });
    $$('.course-hero small').forEach(el => {
      el.textContent = '概念讲解 · 核心规则 · 操作结果 · 易错补充';
    });
    $$('.course-module h2').forEach(h => {
      if (h.textContent.trim() === 'Windows 真题操作链') h.textContent = 'Windows 综合操作关系';
    });
    $$('span,small,p,b,strong,h3').forEach(el => {
      if (el.childElementCount) return;
      const t = el.textContent.trim();
      if (t === '真题加深') el.textContent = '补充理解';
      else if (t === '排错型') el.textContent = '结果分析';
      else if (t === '步骤排序型') el.textContent = '操作顺序';
    });
  }

  function apply() {
    addChapter1Coverage();
    addWindowsCoverage();
    addWordCoverage();
    enhanceExistingWord();
    enhanceExcelCoverage();
    normalizeNoteLanguage();
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
  else schedule();
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
})();