(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  // Exact titles used by enhancements-v5.js. These notes intentionally explain the
  // concept before rules, demos and exam-derived pitfalls.
  const INTRO = {
    // Chapter 2 — Windows 10
    '操作系统的职责与类型': {
      what: '操作系统（Operating System，OS）是计算机最基本的系统软件，位于硬件与应用程序、用户之间。它统一管理处理器、内存、文件、外部设备等资源，并为应用程序提供运行环境。批处理、分时、实时等是按工作方式划分的不同操作系统类型。',
      use: '先理解“操作系统在管什么”，才能分清系统软件与应用软件，也才能理解多任务、文件管理、设备管理等后续内容。'
    },
    '桌面、图标与个性化': {
      what: '桌面是登录 Windows 后的主要工作区域。图标是文件、文件夹、应用或系统功能的可视入口；快捷方式图标只是指向目标的链接。个性化用于调整背景、主题、颜色、桌面图标等外观设置。',
      use: '这部分解决“桌面上看到的东西到底是什么”以及“改变外观会不会改变真实文件”的问题。'
    },
    '窗口组成与状态切换': {
      what: '窗口是应用程序、文件夹或系统工具在屏幕上的工作区域，通常包含标题栏、工作区以及最小化、最大化/还原、关闭等控制按钮。窗口可以处于普通、最大化、最小化等状态。',
      use: '理解窗口状态后，才能正确判断双击标题栏、拖到屏幕边缘、最小化和关闭分别会发生什么。'
    },
    '开始菜单、任务栏与多任务': {
      what: '开始菜单是应用、设置、电源等功能的主要入口；任务栏用于启动、固定和切换程序，并显示部分运行状态；多任务是操作系统在同一时间段内协调多个程序推进运行的能力。',
      use: '三者共同构成 Windows 日常导航和任务切换的核心界面。'
    },
    '文件名、路径与扩展名': {
      what: '文件名用于标识文件；路径描述文件或文件夹在存储设备中的具体位置；扩展名通常位于文件名最后一个“.”之后，用来表示文件类型并帮助系统关联默认打开程序。',
      use: '这三个概念分别回答“叫什么”“在哪里”“是什么类型”，不能混成一个概念。'
    },
    '文件与文件夹属性': {
      what: '文件或文件夹除了名称和位置外，还具有只读、隐藏等属性。属性是对象的状态信息，会影响常规编辑或显示方式，但不等于删除、加密或改变文件类型。',
      use: '理解属性可以避免把“只读”误解为“不能删除”，或把“隐藏”误解为“文件不存在”。'
    },
    '复制、移动与拖放规则': {
      what: '复制会在目标位置产生副本而保留原对象；移动会改变对象所在位置；拖放是用鼠标完成复制或移动的一种操作方式，结果会受到来源位置、目标位置和 Ctrl、Shift 等按键影响。',
      use: '关键是观察操作后原位置和目标位置各有什么，而不是死背“拖动一定等于复制”或“拖动一定等于移动”。'
    },
    '删除、回收站与恢复': {
      what: '删除是把文件或文件夹从原位置移除。回收站是 Windows 为部分本地磁盘删除对象提供的临时存放区域，允许在清空前恢复；Shift+Delete 等方式可能绕过回收站。',
      use: '这部分用于判断文件删除后的去向以及是否还能通过普通“还原”恢复。'
    },
    '搜索、快速访问与快捷方式': {
      what: 'Windows 搜索用于定位应用、文件和设置；快速访问是资源管理器中的常用位置入口；快捷方式是指向文件、文件夹或程序的链接。它们都帮助“找到对象”，但都不等于对象的真实存储位置。',
      use: '理解“入口”和“真实文件”的区别，可以避免删除入口时误以为原文件也被删除。'
    },
    '设置、控制面板与对话框': {
      what: '“设置”和“控制面板”都是 Windows 的系统配置入口。对话框中的“应用、确定、取消”控制当前修改是否生效以及窗口是否关闭。',
      use: '很多操作题真正考的是“修改有没有保存、窗口有没有关闭”，而不是只认按钮名字。'
    },
    '任务管理器与资源诊断': {
      what: '任务管理器是 Windows 用来查看和管理正在运行的应用、进程以及 CPU、内存、磁盘、网络等资源使用情况的系统工具，也可以管理部分启动项。',
      use: '程序无响应、系统变慢或需要判断资源占用时，任务管理器是最常用的诊断入口之一。'
    },
    '设备管理器与驱动程序': {
      what: '设备管理器用于查看和管理计算机硬件设备；驱动程序是操作系统与具体硬件之间的接口软件，使系统能够识别并控制设备。黄色感叹号等标记通常提示设备或驱动存在异常。',
      use: '硬件不能正常工作时，应先判断设备状态，再决定更新、回退、启用、禁用或重新安装驱动。'
    },
    '应用、默认程序与卸载': {
      what: '应用程序是完成具体任务的软件；默认程序决定某类文件双击时优先由哪个应用打开；卸载则是从系统中移除应用本身。三者分别涉及“软件是什么”“文件默认用谁打开”“软件是否继续安装在系统中”。',
      use: '这可以避免把“更换默认打开方式”“修改扩展名”和“卸载应用”误认为同一件事。'
    },
    '电源、睡眠与系统恢复': {
      what: '关机、重启、睡眠和休眠是不同的电源状态；系统还原则利用还原点把系统文件、注册表、驱动和部分设置恢复到较早状态。系统还原不是个人文件备份。',
      use: '这部分用于理解不同电源操作对当前工作状态的影响，以及系统异常时“恢复系统配置”和“恢复个人文件”的区别。'
    },
    '记事本、截图与常用附件': {
      what: '记事本是 Windows 的纯文本编辑器；截图工具用于捕获屏幕画面；画图、计算器等属于常用附件程序。它们功能明确、轻量，但不具备 Word、Photoshop 等专业软件的完整能力。',
      use: '先知道每个工具的定位，再判断它能做什么、不能做什么。'
    },
    'Windows 真题操作链': {
      rename: '常见故障处理思路',
      what: 'Windows 故障处理通常遵循“观察现象 → 判断对象 → 选择合适的系统工具 → 执行处理”的思路。例如窗口无响应看任务管理器，设备异常看设备管理器，误删本地文件先看回收站。',
      use: '这一节不是刷题，而是把前面分散的系统工具按真实问题串起来，帮助形成完整的处理思路。'
    },

    // Chapter 3 — Word 2016
    '界面、视图与显示比例': {
      what: 'Word 的“视图”是对同一份文档采用不同的屏幕显示和工作方式，例如页面视图、阅读模式、大纲视图、Web 版式等；“显示比例”只是把屏幕上的文档放大或缩小观看。',
      use: '视图决定你以什么方式观察和组织文档，显示比例只影响观看尺度，不会改变真实字号和打印排版。'
    },
    '输入、选择与编辑文本': {
      what: '文本编辑包括输入字符、选择文本、插入或替换内容，以及剪切、复制、粘贴、删除、撤销和恢复等操作。光标位置和选中范围决定操作作用于哪里。',
      use: '这是所有 Word 排版的基础：先准确选中对象，后面的字符格式、段落格式和删除操作才会作用在正确范围。'
    },
    '字体、字号与字符格式': {
      what: '字符格式是直接作用于文字字符外观的设置，包括字体、字号、字形、颜色、下划线、删除线、上标、下标、字符间距等。',
      use: '它控制“字长什么样”，与控制整段布局的段落格式、以及成组管理格式的样式不同。'
    },
    '段落对齐、缩进与制表位': {
      what: '段落格式控制整段文字在页面中的布局。对齐决定文字相对段落边界的位置；缩进决定段落左右边界和首行位置；制表位用于把同一行中的文字按预设位置整齐对齐。',
      use: '需要调整“整段放哪儿、第一行从哪开始、同一行多列文字怎么对齐”时，应使用这些段落级工具，而不是反复敲空格。'
    },
    '行距、段距与换行控制': {
      what: '行距控制同一段落内各行之间的距离；段前、段后间距控制相邻段落之间的距离；换行与中文版式选项会影响一行能容纳多少文字以及分页时段落怎样保持完整。',
      use: '这部分决定正文疏密、段落间隔和换行结果，是排版整齐与控制篇幅的重要工具。'
    },
    '样式与格式刷': {
      what: '样式是一组已经命名的字符和段落格式集合，例如“标题1”“正文”；格式刷用于把一个位置的格式快速复制到另一个位置。',
      use: '样式适合统一管理大量同类内容，格式刷适合局部快速复制格式；长文档优先建立样式体系。'
    },
    '查找、替换与格式替换': {
      what: '查找用于定位文档中的文字、格式或特殊字符；替换在查找基础上批量把匹配内容改成新的文字或格式。Word 还可以做到“文字不变，只替换格式”。',
      use: '它适合批量修改重复内容，比逐处手工查找和修改更快、更稳定。'
    },
    '分页符与分节符': {
      what: '分页符只强制后续内容从下一页开始；分节符则把文档分成多个可以独立设置版式的“节”。下一页分节符会换页并建立新节，连续分节符建立新节但不一定换页。',
      use: '只想换页用分页符；想让前后部分拥有不同页眉、页码、页面方向、页边距或分栏时，需要分节符。'
    },
    '页眉、页脚与页码': {
      what: '页眉和页脚是页面顶部、底部重复出现的独立区域；页码通常以自动字段形式插入。不同节的页眉页脚是否相同，受“链接到前一节”等设置影响。',
      use: '它们用于在多页文档中统一显示章节名、日期、页码等重复信息，并支持不同节使用不同内容。'
    },
    '页面设置、分栏与单页横向': {
      what: '页面设置控制页边距、纸张大小、纸张方向等页面级属性；分栏把连续正文排成两栏或多栏；若只让某一页横向或某一部分分栏，通常要借助“节”划定作用范围。',
      use: '这部分解决的是整页或整节的版式，而不是某一个段落或某几个字符的外观。'
    },
    '表格创建、编辑与跨页': {
      what: 'Word 表格由行、列和单元格组成，用于结构化排版文字和数据。可以插入或删除行列、合并或拆分单元格、设置边框底纹，并让跨页表格重复显示标题行。',
      use: '当内容需要严格按行列对齐时，表格比空格和制表位更稳定，也能承担简单的数据组织任务。'
    },
    'Word 表格排序与公式': {
      what: 'Word 表格除了排版，还支持按列排序和简单计算。公式可以使用 SUM、AVERAGE 等函数，以及 ABOVE、LEFT 等位置参数引用相邻单元格。',
      use: '适合在文档中的小型表格完成基础汇总，但它的计算模型和 Excel 并不相同。'
    },
    '图片、裁剪与文字环绕': {
      what: '图片插入 Word 后是一个文档对象。调整大小改变显示尺寸；裁剪改变可见区域；文字环绕决定正文与图片之间怎样排列，例如嵌入型、四周型、紧密型、上下型等。',
      use: '理解“尺寸、可见区域、文字关系”这三个不同层次，才能正确完成图文混排。'
    },
    '形状、艺术字与对象组合': {
      what: '形状是可绘制并设置填充、轮廓和效果的图形对象；艺术字是具有特殊文字效果的对象；多个浮动对象可以对齐、分布或组合成一个整体操作。',
      use: '这些对象用于制作示意图、标注和装饰性排版，组合后可以统一移动、缩放和排列。'
    },
    '题注与交叉引用': {
      what: '题注用于给图片、表格、公式等对象自动添加“标签 + 编号 + 说明”，例如“图1 泰山石”；交叉引用是在正文中插入对这些编号对象的动态引用，例如“如图1所示”。',
      use: '它们让图表编号可以自动维护，前面新增或删除对象后不必手工逐个修改正文中的“图1、图2”。'
    },
    '脚注、尾注、批注与域': {
      what: '脚注通常放在当前页底部用于补充说明；尾注位于节末或文档末；批注用于审阅交流；域是 Word 中能够自动计算或更新内容的特殊对象，页码、目录、交叉引用等很多自动功能都依赖域。',
      use: '这些对象都属于“正文之外的辅助信息或自动内容”，但位置、用途和更新方式完全不同。'
    },
    '标题结构与自动目录': {
      what: '标题结构通过“标题1、标题2、标题3”等样式或大纲级别建立文档层次；自动目录根据这些结构自动提取标题和页码生成目录。',
      use: '正确建立标题结构后，可以使用导航窗格管理长文档，并在版式变化后自动更新目录页码。'
    },
    '邮件合并完整流程': {
      what: '邮件合并把一份固定格式的主文档与包含姓名、地址等变化数据的数据源结合，再通过合并域批量生成多份个性化文档。',
      use: '适合批量制作通知书、邀请函、信封、标签等“版式相同、对象不同”的文档。'
    },
    '修订、接受拒绝与文档比较': {
      what: '“修订”用于记录对文档的插入、删除和格式变化；接受或拒绝决定这些修改是否正式进入正文；“比较”则用于找出两个文档版本之间的差异。',
      use: '它们构成多人协作审阅的核心流程：先看修改痕迹，再决定采用哪些修改，必要时比较不同版本。'
    },
    '打印、保护与最终检查': {
      what: '打印是把文档输出到纸面或打印设备；打印预览用于检查最终页面效果；文档保护或限制编辑用于控制他人可以进行的修改类型。',
      use: '在文档交付前，需要同时检查页面范围、分页、页眉页脚、修订标记是否显示，以及文档是否需要限制编辑。'
    }
  };

  function makeConceptNote(info) {
    return `<section class="v10-concept-note" aria-label="概念笔记">
      <div><span>是什么</span><p>${esc(info.what)}</p></div>
      <div><span>有什么用</span><p>${esc(info.use)}</p></div>
    </section>`;
  }

  function convertPitfall(module) {
    let lab = $('.truth-lab, .v9-pitfall-note, .v10-pitfall-note', module);
    if (!lab) return;

    if (!lab.classList.contains('v10-pitfall-note')) {
      const entries = [];

      // v6 has already converted buttons into static cards on many pages.
      $$('.v6-trap-note', lab).forEach(card => {
        entries.push({
          ok: card.classList.contains('is-right'),
          statement: $('b', card)?.textContent?.trim() || '',
          why: $('p', card)?.textContent?.trim() || ''
        });
      });

      // Fallback if v6 did not run yet.
      if (!entries.length) {
        $$('button[data-truth]', lab).forEach(btn => entries.push({
          ok: btn.dataset.truth === '1' || btn.dataset.truth === 'true',
          statement: $('span', btn)?.textContent?.trim() || '',
          why: btn.dataset.why || ''
        }));
      }

      // Fallback if v9 has already converted the block.
      if (!entries.length) {
        $$('.v9-pitfall-list > div', lab).forEach(card => {
          const label = $('b', card)?.textContent || '';
          entries.push({
            ok: /正确/.test(label),
            statement: $('p', card)?.textContent?.trim() || '',
            why: $('small', card)?.textContent?.trim() || ''
          });
        });
      }

      if (entries.length) {
        lab.className = 'v10-pitfall-note';
        lab.removeAttribute('data-v6-notes');
        lab.innerHTML = `<details><summary>补充：易错点</summary><div class="v10-pitfall-list">${entries.map(item => `
          <div><b>${item.ok ? '正确表述' : '错误表述'}</b><p>${esc(item.statement)}</p><small>${esc(item.why)}</small></div>`).join('')}</div></details>`;
      }
    }

    // Easy-error material must come after the actual notes and demos, never before them.
    const shell = $('.module-shell', module);
    if (shell && lab.parentNode !== shell) shell.appendChild(lab);
    else if (shell && shell.lastElementChild !== lab) shell.appendChild(lab);
  }

  function upgrade(module) {
    const titleEl = $('.module-head h2', module);
    if (!titleEl) return;
    const originalTitle = titleEl.textContent.trim();
    const info = INTRO[originalTitle];
    if (!info) return;

    if (info.rename && titleEl.textContent !== info.rename) titleEl.textContent = info.rename;
    const effectiveTitle = info.rename || originalTitle;
    module.dataset.v10ConceptFirst = '1';

    const head = $('.module-head', module);
    const small = $('small', head);
    if (small) small.textContent = '知识点笔记';

    // Replace any older concept layer so exact-title mapping always wins.
    $$('.v9-concept-note, .v10-concept-note', module).forEach(el => el.remove());
    head.insertAdjacentHTML('afterend', makeConceptNote(info));

    const knowledgeTitle = $('.knowledge-card h3', module);
    if (knowledgeTitle) knowledgeTitle.textContent = '核心规则与操作';

    const special = $('.special-title', module);
    if (special) {
      const span = $('span', special), bold = $('b', special);
      if (span) span.textContent = '理解演示';
      if (bold) bold.textContent = '通过变化直接看懂效果';
    }

    // Keep the one-line summary, but make it clearly subordinate to the definition.
    const lead = $('.module-head p', module);
    if (lead) lead.setAttribute('aria-label', `${effectiveTitle}摘要`);

    convertPitfall(module);
  }

  function apply() {
    $$('.windows-page .course-module, .word-page .course-module').forEach(upgrade);
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      apply();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
  else schedule();
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
})();