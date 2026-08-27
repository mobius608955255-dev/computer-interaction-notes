(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function addBoundary(selector, key, title, html) {
    const section = $(selector);
    if (!section || $(`[data-v25="${key}"]`, section)) return;
    const note = document.createElement('div');
    note.className = 'same-core v25-terminology-note';
    note.dataset.v25 = key;
    note.innerHTML = `<b>${title}</b>${html}`;
    const memory = $('.memory-line', section);
    if (memory) memory.insertAdjacentElement('beforebegin', note);
    else section.appendChild(note);
  }

  function replaceText(root, from, to) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.nodeValue.includes(from)) node.nodeValue = node.nodeValue.replaceAll(from, to);
    });
  }

  function patchWindowsTerms() {
    addBoundary('#windows-6', 'windows-hidden', '术语边界：隐藏 ≠ 删除', `
      <p><strong>隐藏属性</strong>只影响资源管理器默认是否显示对象；文件仍然存在、仍占磁盘空间，也仍可被程序按路径访问。开启“隐藏的项目”只是改变查看方式，不会自动取消文件本身的隐藏属性。</p>
      <p><strong>删除</strong>改变的是对象的存储状态和删除去向；对本地磁盘文件按 Delete 通常会进入回收站，而隐藏文件并不会因为“看不见”就进入回收站。考试看到“隐藏、显示、删除”时，先判断题目是在改<strong>可见性</strong>还是改<strong>对象是否仍存在</strong>。</p>
    `);

    addBoundary('#windows-21', 'windows-format', '术语边界：磁盘“格式化”不是 Word/Excel 的“设置格式”', `
      <p>Windows 磁盘管理中的<strong>格式化</strong>是面向分区/卷和文件系统的存储操作，用于建立或重新建立文件系统结构，应把它视为可能破坏原有数据的操作。</p>
      <p>Word 的字符/段落格式、Excel 的单元格格式主要描述内容如何显示或排版。三者都含“格式”二字，但操作对象完全不同：<strong>磁盘格式化管存储结构，文档/单元格格式管呈现规则</strong>。</p>
    `);
  }

  function patchWordTerms() {
    const charSection = $('#word-3');
    replaceText(charSection,
      '清除所有格式可恢复为基础样式格式',
      '清除所有格式会移除所选文字的格式设置，使其回到默认格式样式所决定的显示；文字内容本身仍保留');

    addBoundary('#word-3', 'word-clear-format', '术语边界：清除格式 ≠ 删除文字 ≠ 撤销操作', `
      <p><strong>清除所有格式</strong>处理的是加粗、下划线、倾斜、颜色、上下标等格式属性，文字内容仍在；<strong>Delete/Backspace</strong>处理的是内容；<strong>撤销</strong>则是回退先前操作。三者作用对象不同。</p>
      <p>因此“把文字恢复成普通外观”优先判断是否是清除格式，而不是删除后重新输入；“清除格式”也不等于把文档恢复到几步之前。</p>
    `);

    addBoundary('#word-15', 'word-cross-reference', '术语边界：Word 交叉引用 ≠ Excel 单元格引用', `
      <p>Word 的<strong>交叉引用</strong>是在正文中引用标题、题注、编号项等对象，插入后通常以<strong>域</strong>实现，可在源对象编号或页码变化后更新。</p>
      <p>Excel 的<strong>单元格引用</strong>则是公式用地址指向单元格或区域，例如相对引用、绝对引用和混合引用。两者都叫“引用”，但 Word 重点是<strong>文档对象之间的动态指向</strong>，Excel 重点是<strong>公式地址如何随复制移动</strong>。</p>
    `);

    addBoundary('#word-16', 'word-field-comment', '术语边界：域是动态指令；批注是审阅意见', `
      <p>Word 的<strong>域</strong>是一类动态内容机制，交叉引用、目录、页码、日期、部分表格公式和邮件合并域都可由域实现；域代码告诉 Word 应当插入或计算什么结果，必要时可用 F9 更新。</p>
      <p><strong>批注</strong>则用于审阅和交流意见，不因为“也能自动显示在页面边缘”就属于域。删除批注、接受/拒绝修订、更新域是三套不同操作。</p>
    `);

    addBoundary('#word-20', 'word-protection', '术语边界：Word“限制编辑”不要套用 Excel 的保护层级', `
      <p>Word 的<strong>限制编辑</strong>主要限制格式设置和允许的编辑类型；Excel 则要分别判断<strong>锁定单元格、保护工作表、保护工作簿结构、文件加密</strong>。它们都可笼统叫“保护”，但控制对象和生效条件不同。</p>
      <p>另外，Windows 文件的“只读”属性也不等于 Word/Excel 的密码保护。看到“保护”类题目时，必须先回答：<strong>保护的是内容、工作表、工作簿结构、文件打开权限，还是普通文件属性？</strong></p>
    `);
  }

  function patchExcelTerms() {
    addBoundary('#excel-4', 'excel-sheet-hide', '术语边界：隐藏工作表 ≠ 删除工作表', `
      <p><strong>隐藏工作表</strong>只是让工作表标签暂时不可见，工作表和其中数据仍保留，公式仍可引用其数据，也可以执行取消隐藏。</p>
      <p><strong>删除工作表</strong>改变的是工作簿结构并移除该工作表。不要把“看不到标签”直接判断成“工作表已经被删除”。</p>
    `);

    addBoundary('#excel-6', 'excel-delete-clear-hide', '术语边界：删除、清除、隐藏是三种结果', `
      <p><strong>按 Delete 或 Backspace</strong>通常只是清除所选单元格的内容，单元格本身、格式和批注仍保留；“开始 → 清除”还可以分别选择清除全部、清除格式、清除内容、清除批注等。</p>
      <p><strong>删除单元格</strong>则会把单元格从当前结构中移除，并让周围单元格按所选方向移动来补位；删除整行/整列同样会改变表格结构。<strong>隐藏行/列</strong>只改变可见性，数据仍在。</p>
      <p>判断口诀不是死背按钮，而是看结果：<strong>清除＝格子还在；删除＝结构发生变化；隐藏＝数据还在但暂时看不见。</strong></p>
    `);

    addBoundary('#excel-7', 'excel-reference', '术语边界：Excel“引用”首先是公式地址规则', `
      <p>Excel 中的相对、绝对、混合<strong>引用</strong>描述公式中的单元格/区域地址在复制或填充时如何变化，例如 <code>A1</code>、<code>$A$1</code>、<code>A$1</code>、<code>$A1</code>。</p>
      <p>这与 Word 的“交叉引用”不是同一机制。Word 交叉引用通常由域动态指向题注、标题或编号项；Excel 引用则直接参与工作表公式计算。不要因为题目都写“引用”就套同一套规则。</p>
    `);

    addBoundary('#excel-9', 'excel-word-comment', '术语边界：Excel 2016 批注与 Word 批注同属“注释”，但对象不同', `
      <p>Excel 2016 的<strong>批注</strong>附着在单元格上，可显示、隐藏、编辑、删除，也可以在选择性粘贴中只粘贴批注；Word 的<strong>批注</strong>则用于对文档文字或位置提出审阅意见。</p>
      <p>两者共同点是“注释/审阅信息”，但操作对象分别是<strong>单元格</strong>和<strong>文档内容</strong>。Excel 2016 的批注也不要与 Microsoft 365 后来的线程式“评论”命名混淆。</p>
    `);

    addBoundary('#excel-10', 'excel-format-value', '术语边界：单元格格式 ≠ 底层值或数据类型', `
      <p>数字格式、日期格式、百分比、小数位数、字体、边框等主要控制<strong>显示方式</strong>。把一个“以文本存储的数字”仅仅改成“数值”显示格式，并不保证底层文本已经转换成真正数值。</p>
      <p>因此 Excel 里遇到“看起来一样但排序、求和、AVERAGEIF 结果异常”，要先检查底层值和数据类型，而不是只看格式面板。这里的“格式”与 Windows 的磁盘格式化更不是同一概念。</p>
    `);
  }

  function apply() {
    patchWindowsTerms();
    patchWordTerms();
    patchExcelTerms();
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
