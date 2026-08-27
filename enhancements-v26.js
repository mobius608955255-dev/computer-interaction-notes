(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);

  function appendNote(selector, key, title, paragraphs) {
    const section = $(selector);
    if (!section || $(`[data-v26="${key}"]`, section)) return;
    const host = $('.section-shell,.module-shell', section) || section;
    const note = document.createElement('div');
    note.className = 'lab-card v26-syllabus-note';
    note.dataset.v26 = key;
    note.innerHTML = `<div class="lab-heading"><span class="lab-dot"></span><div><p>考纲补全</p><h3>${title}</h3></div></div><div class="note-body">${paragraphs.map(p=>`<p>${p}</p>`).join('')}</div>`;
    const memory = $('.memory-line,.course-memory', host);
    if (memory) memory.insertAdjacentElement('beforebegin', note);
    else host.appendChild(note);
  }

  function courseBlock(id, title, lead, what, use, rules, boundary, memory) {
    return `<section id="${id}" class="course-module v26-syllabus-module" data-v26-module="1">
      <div class="module-shell">
        <header class="module-head"><span>24</span><div><small>考纲补全</small><h2>${title}</h2><p>${lead}</p></div></header>
        <div class="v10-concept-note"><div><span>是什么</span><p>${what}</p></div><div><span>有什么用</span><p>${use}</p></div></div>
        <div class="module-grid">
          <div class="knowledge-card"><h3>核心规则与操作结果</h3><ul>${rules.map(x=>`<li>${x}</li>`).join('')}</ul></div>
          <div class="knowledge-card"><h3>边界要分清</h3><p>${boundary}</p></div>
        </div>
        <div class="memory-line"><span>一条线记住</span><strong>${memory}</strong></div>
      </div>
    </section>`;
  }

  function chapter1() {
    appendNote('#concept-5','it-history-domestic','信息技术发展、企业平台迁移与国产计算机',[
      '<strong>信息技术发展不能只背“第几代计算机”。</strong>从大型机、个人计算机、互联网、移动互联网到云计算与人工智能，主导平台不断迁移；企业优势也会随核心技术、标准、用户需求、商业模式、生态和转型速度变化。',
      '<strong>典型企业线索：</strong>IBM 在大型机和企业计算时代影响深远；Intel 与 Microsoft 推动了标准化 PC 生态；Apple 体现软硬件一体化与智能终端生态；Nokia、BlackBerry 等案例说明原有硬件优势可能因平台和应用生态迁移而削弱。这里考的是“技术平台变化如何影响企业”，不是背某一年市值排名。',
      '<strong>国产计算机看完整生态。</strong>我国经历了从早期自主研制到高性能计算和国产软硬件生态建设的发展过程，典型线索包括 103 机、银河、曙光、神威、天河等；今天还要同时理解龙芯、飞腾、鲲鹏等处理器路线，以及麒麟、统信等操作系统、驱动、数据库、办公和行业软件适配。',
      '“国产计算机”不等于只看整机品牌，也不要求所有零部件来自同一家企业；长期稳定考点是自主研发、软硬件协同、生态适配与安全可靠，具体排行榜和峰值性能会随时间变化。'
    ]);

    appendNote('#concept-16','multimedia-system-tools','多媒体计算机系统、应用领域与常用处理软件',[
      '<strong>多媒体计算机系统</strong>不仅是“能播放视频的电脑”。基础结构可以按硬件、软件和媒体数据理解：硬件包括 CPU/GPU、内存与存储、显示器、声卡、音箱、麦克风、摄像头、扫描仪/采集设备等；软件包括操作系统、驱动以及音频、图像、动画、视频处理和播放/创作软件。',
      '<strong>应用领域</strong>包括教育培训、数字娱乐、广告展示、远程会议、医疗影像、虚拟现实、数字出版等。题目常用场景反推所需媒体元素和处理技术。',
      '<strong>软件名和文件格式必须分层：</strong>Paint、Photoshop、GIMP 属于图像处理工具；录音机、Audacity 属于音频录制/编辑工具；Premiere、DaVinci Resolve 属于视频剪辑工具。JPG、PNG、WAV、MP3、MP4 等是文件格式或容器，不能和软件名互换。',
      '基础操作按结果理解：裁剪改变保留的图像/音频范围，调整大小改变图像像素尺寸，降噪/调色/字幕/转场属于编辑处理，导出成品不等于保留完整可编辑工程结构。'
    ]);

    appendNote('#concept-18','strategy-optimization','典型求解策略、复杂度与时间/空间优化',[
      '<strong>典型求解策略</strong>可以从穷举、递推/迭代、分治等思路理解：穷举遍历候选解；递推/迭代利用前一步结果不断推进；分治把大问题拆成较小子问题后再合并结果。考试重点是识别思路，不要求把所有算法学到专业数据结构课程深度。',
      '<strong>时间复杂度</strong>关注输入规模增长时基本操作次数如何增长；<strong>空间复杂度</strong>关注额外存储需求如何增长。二者衡量不同资源，不能直接画等号。',
      '<strong>时间优化</strong>常通过减少重复计算、选择更高效的算法/数据组织方式、提前终止无效搜索等实现；<strong>空间优化</strong>常通过复用存储、原地处理、只保存当前需要的状态等实现。',
      '时间和空间有时可以互换：例如缓存中间结果会增加空间占用却减少重复计算。优化必须以结果正确为前提，不存在“占用内存越少就一定越快”或“循环次数少就一定是更优算法”的绝对结论。'
    ]);
  }

  function windows() {
    appendNote('#windows-1','os-features-types-domestic','操作系统四个主要特征、分类与国产操作系统',[
      '<strong>主要特征：</strong>并发性是多个任务在同一时间段推进；共享性是多个任务共同使用系统资源；虚拟性把物理资源抽象为逻辑资源，如虚拟内存；异步性表示并发任务按不可预知速度推进。并发不等于单核 CPU 每一瞬间都真正并行。',
      '<strong>按工作方式/场景分类：</strong>批处理强调成批自动处理、交互弱；分时通过时间片服务多个用户/任务、交互强；实时系统强调在规定时限内响应；还要认识网络、分布式、嵌入式和移动操作系统。实时系统的核心不是“绝对速度最快”，而是时限可预测。',
      '<strong>按用户和任务可区分</strong>单用户单任务、单用户多任务、多用户多任务。分类依据不同可以同时成立，不能把“多任务”和“分时系统”机械当成同义词。',
      '<strong>国产操作系统：</strong>麒麟/银河麒麟面向桌面、服务器等场景并强调国产软硬件适配与安全可靠；统信 UOS 提供桌面/服务器等产品并重视国产处理器和应用生态；HarmonyOS/鸿蒙面向多种智能终端并突出跨设备协同。不同产品线、版本和底层技术会变化，基础题应抓应用场景与生态特点。'
    ]);

    appendNote('#windows-10','dialog-controls','对话框常见控件：控件决定能选几个、能输什么',[
      '<strong>文本框</strong>用于输入文字或数值；<strong>复选框</strong>通常允许多个选项彼此独立地选中/取消；<strong>单选按钮</strong>通常用于一组选项中择一；<strong>列表框/下拉列表</strong>从给定项目中选择；滑块、微调框等用于在一定范围调整数值。',
      '“确定、取消、应用”是命令按钮，负责确认、放弃或应用设置；它们与单选/复选等用于输入设置值的控件职责不同。具体对话框可能组合多个控件，判断时先看控件允许的交互方式。'
    ]);

    appendNote('#windows-14','session-power','锁定、注销、切换用户、睡眠与关机：结束的层级不同',[
      '<strong>锁定</strong>保留当前用户会话和已打开程序，只回到登录验证界面；<strong>注销</strong>结束当前用户会话并关闭该账户正在运行的应用，但 Windows 系统本身仍在运行。',
      '<strong>切换用户</strong>允许另一账户登录，同时通常保留原账户会话；<strong>睡眠</strong>则让整台计算机进入低功耗状态并尽量保留当前工作状态。',
      '<strong>重启</strong>结束系统会话后重新启动；<strong>关机</strong>结束运行并关闭系统。不要把“注销 = 关机”“锁定 = 睡眠”“切换用户 = 注销”互相替代。'
    ]);

    appendNote('#windows-15','paint-recorder','画图、截图工具与录音机：按处理对象区分',[
      '<strong>画图（Paint）</strong>面向基础位图编辑，可完成选择、裁剪、调整大小、旋转、绘制、填充、文本标注和另存为常见图像格式等操作；“缩放查看”与真正“调整图像大小”不是同一结果。',
      '<strong>截图工具</strong>用于捕获屏幕区域/窗口并进行简单标注和保存；截图得到的是图像，不会自动获得被截界面中的可编辑文本或原始对象结构。',
      '<strong>录音机/语音录音机</strong>使用麦克风采集声音，可进行录制、暂停/继续、播放以及版本支持范围内的简单修剪等操作。它处理音频，不是视频剪辑软件。',
      '三个工具按对象记：画图处理图像，截图工具获取屏幕图像，录音机采集声音。具体按钮会随 Windows 更新变化，考试基础题优先判断功能结果。'
    ]);

    appendNote('#windows-15','other-accessories','教材中的其他 Windows 附件：知道对象和用途即可',[
      '<strong>写字板（WordPad）</strong>是 Windows 10 传统附件中的轻量富文本编辑工具，能力介于记事本和完整文字处理软件之间；它不是 Word 的等价替代品。',
      '<strong>字符映射表</strong>用于浏览并复制字体中可用的特殊字符；<strong>放大镜</strong>用于放大屏幕局部或整体，是辅助功能；<strong>屏幕键盘</strong>提供可用鼠标/触控操作的虚拟键盘。',
      '<strong>步骤记录器</strong>可记录用户操作步骤并生成带截图/说明的记录，用于问题复现和支持；它不是通用视频录屏软件。',
      '这些工具在不同 Windows 10 版本和后续系统中的入口、名称或保留状态可能变化。教材题优先掌握“工具处理什么对象、会产生什么结果”，不要把版本界面当永久定律。'
    ]);
  }

  function word() {
    appendNote('#word-1','doc-software-wps-interface','文档格式、常用文字处理软件、WPS Office 与 Word 基础界面',[
      '<strong>常见文档格式：</strong>DOCX/DOC 是 Word 常见文档格式；TXT 主要保存纯文本；RTF 可保存一定富文本格式；PDF 侧重版面固定与分发阅读。文件扩展名有助于识别格式，但不能仅凭改扩展名完成真正格式转换。',
      '<strong>常用文档处理软件</strong>包括 Microsoft Word、WPS 文字、LibreOffice Writer 等。WPS Office 是办公套件，包含文字、表格、演示等组件，强调常见 Office 文档兼容、跨平台及云端办公等能力；兼容不等于所有复杂格式、宏和高级功能在不同软件之间百分之百无差异。',
      '<strong>Word 2016 界面</strong>要认识标题栏、快速访问工具栏、文件选项卡、功能区（选项卡—组—命令）、编辑区、滚动条、状态栏和视图/缩放控件。功能区位置属于界面结构，不要把“功能”与“所在选项卡”混成同一个知识点。'
    ]);

    appendNote('#word-1','word-start-exit','Word 的启动、关闭文档与退出程序',[
      '启动 Word 可以通过开始菜单、快捷方式，或打开与 Word 关联的文档文件等方式进入；打开某个 DOCX 与“先启动 Word 再打开文档”入口不同，但最终都进入 Word 的文档处理环境。',
      '<strong>关闭当前文档</strong>只结束该文档窗口/文件的编辑状态；<strong>退出 Word</strong>结束应用程序。存在未保存修改时，正常关闭或退出通常会提示是否保存。',
      '快捷键也要分层：Ctrl+W 常用于关闭当前文档，Alt+F4 常用于关闭当前应用窗口。不要把“关闭文档”“关闭窗口”“退出 Word”“删除文档文件”视为同一操作。'
    ]);

    appendNote('#word-2','document-file-clipboard-windows','新建、打开、保存、关闭、多窗口与 Office 剪贴板',[
      '<strong>文档级操作：</strong>新建创建新的文档；打开读取已有文件；保存把当前修改写回文件；另存为用于改变位置、名称或文件格式；关闭文档不等于退出整个 Word 程序。',
      '<strong>多窗口：</strong>Word 可以同时打开多个文档窗口并在窗口间切换；窗口切换只改变当前操作对象，不会自动把两个文档内容合并。',
      '<strong>Office 剪贴板</strong>可以收集多个复制/剪切项目；它与 Windows 系统剪贴板/Windows 10 剪贴板历史不是同一个界面。复制保留原内容，剪切用于移动，粘贴读取剪贴板内容。',
      '撤销/恢复作用于编辑历史；“关闭而不保存”“撤销几步操作”“删除文件”是三个不同层次的结果。'
    ]);

    appendNote('#word-4','border-shading','边框与底纹：先判断应用对象',[
      '<strong>边框</strong>可以作用于文字、段落、表格/单元格或页面；<strong>底纹</strong>给相应对象添加背景填充。题目看到“加框”不能只凭视觉判断，必须先确定作用对象。',
      '段落边框会随段落宽度和缩进形成边界；文字边框更贴近选中文字；页面边框属于页面背景层；表格边框属于表格结构格式。页眉下的自动横线也常来自段落下边框。'
    ]);

    appendNote('#word-6','template-style','模板与样式：模板管文档起点，样式管格式规则',[
      '<strong>样式</strong>是一组可复用的字符/段落等格式规则，修改样式可同步影响使用该样式的内容；<strong>模板</strong>是创建新文档时使用的结构和格式基础，可包含样式、版式及其他预设内容。',
      'Word 常见模板文件可使用 DOTX/DOTM 等格式；普通 DOCX 文档和模板用途不同。手工把一个标题加粗放大，不等于它已经应用了标题样式，也不会因此自动具备目录层级。'
    ]);

    appendNote('#word-11','table-format-convert','表格格式化、数据编辑与文字/表格转换',[
      '<strong>表格格式化</strong>包括边框、底纹、对齐、行高列宽、单元格边距、表格样式等；表格的整体水平对齐与单元格内部文字对齐是两个层级。',
      '<strong>文字转换为表格</strong>时需要根据制表符、逗号、段落标记或其他分隔符确定列；<strong>表格转换为文字</strong>则把单元格边界转换为指定分隔符。转换改变结构，不等于复制粘贴一张图片。',
      '删除单元格内容、删除行列、拆分/合并单元格、拆分整个表格也分别改变不同层级的结构。'
    ]);

    appendNote('#word-14','text-box-smartart-screenshot','文本框、SmartArt 与屏幕截图',[
      '<strong>文本框</strong>是可独立放置文字的对象，可设置形状、填充、轮廓、大小、位置和文字环绕；它与普通正文段落不是同一排版容器。',
      '<strong>SmartArt</strong>把列表、流程、循环、层次结构、关系等信息转成结构化图形；通过文本窗格/图形层级可添加项目、升级/降级层次、改变布局和样式。SmartArt 不等于随意组合若干普通形状。',
      '<strong>屏幕截图/屏幕剪辑</strong>可把当前可用窗口或屏幕区域捕获并插入 Word，插入后本质上按图片对象处理；它不会保持被截程序中按钮、单元格或文字的原始可编辑结构。',
      '图片、形状、SmartArt、文本框、艺术字、公式都属于可插入对象，但编辑工具、结构能力和是否参与正文流的方式不同。'
    ]);

    const footer = $('.word-page .course-footer');
    if (footer && !$('#word-24')) {
      footer.insertAdjacentHTML('beforebegin', courseBlock(
        'word-24',
        '文档协同编辑',
        '协同编辑的核心是共享同一份受权限控制的文档，并处理并发修改、评论和版本。',
        '文档协同编辑软件允许多人通过网络共同查看或编辑同一文档，常结合云端存储、共享链接、权限、评论/批注、版本历史和多人实时或异步编辑。',
        '它帮助你区分“把附件分别发给多人修改”与“围绕共享文档协同”，并理解为什么权限、版本和冲突处理属于协同编辑的基础能力。',
        [
          '常见平台包括 Microsoft 365/OneDrive/SharePoint、WPS 云文档、腾讯文档等；具体按钮和套餐会变化，考试应抓共同机制而不是某一版本界面。',
          '共享前要设置查看/编辑等权限；“有链接”不必然意味着任何人都能编辑。',
          '多人编辑时系统需要同步修改并处理冲突；评论/批注用于讨论，不等于直接改正文。',
          '版本历史用于查看或恢复较早版本；它不同于 Word 本地文档中的“撤销”，也不同于“修订”功能本身。',
          '涉及敏感信息时应遵守访问控制、隐私和组织的数据安全要求。'
        ],
        '协同编辑不是单纯“多人各改一个附件”；核心是共享文档、权限控制、同步修改与版本管理。',
        '共享同一文档 → 控权限 → 协同修改/评论 → 用版本记录追踪变化。'
      ));
    }
  }

  function excel() {
    appendNote('#excel-1','spreadsheet-software','常用电子表格处理软件：先认类别，再学 Excel 2016',[
      '电子表格处理软件用于以工作表/单元格组织数据，并进行公式计算、数据处理、图表和打印等。常见产品包括 Microsoft Excel、WPS 表格、LibreOffice Calc 等。',
      '本章操作口径以 <strong>Excel 2016</strong> 为准；其他电子表格软件可以兼容常见 XLSX/XLS/CSV 等数据，但界面、函数支持、宏和高级功能可能存在差异，所以“能打开同一种文件”不等于所有操作完全相同。'
    ]);
  }

  function apply() {
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
  else setTimeout(schedule, 60);
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
})();
