(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function addNote(section, key, html) {
    if (!section || section.querySelector(`[data-v20-note="${key}"]`)) return;
    const note = document.createElement('div');
    note.className = 'same-core v20-audit-note';
    note.dataset.v20Note = key;
    note.innerHTML = html;
    const memory = $('.memory-line', section);
    if (memory) memory.insertAdjacentElement('beforebegin', note);
    else section.appendChild(note);
  }

  function patchV19SortDirection() {
    const note = $('[data-v19-note="sort-filter"]');
    if (!note) return;
    $$('p', note).forEach(p => {
      if (p.textContent.includes('数值型数字排在文本型数字之前')) {
        p.innerHTML = '<strong>混合类型是高频陷阱：</strong>同一列若既有真正的数值，又有“以文本存储的数字”，Excel 会把它们按不同类型处理。<strong>升序排序时</strong>，作为数值存储的数字排在作为文本存储的数字之前；降序不能继续死记成“数值永远在文本前”，因为排序方向会改变整体次序。真正稳妥的做法是先把同一列的数据类型统一。日期如果只是看起来像日期的文本，也不会按真正日期先后可靠排序。';
      }
    });
  }

  function patchWordRevisionCompare() {
    const section = $('#word-19');
    if (!section) return;
    addNote(section, 'revision-compare', `
      <b>“关闭修订”“隐藏标记”“接受/拒绝修订”是三件事。</b>
      <p><strong>关闭修订</strong>只表示从此刻开始的新修改不再被 Track Changes 记录；已经存在的修订不会因此消失。<strong>无标记（No Markup）</strong>只是把修订痕迹暂时隐藏起来，也没有真正接受或拒绝它们。要把文档清干净，必须对已有修订执行“接受”或“拒绝”。</p>
      <p><strong>比较（Compare）</strong>用于找两个版本的差异，默认可把结果显示在一个新的第三文档中，并以修订标记表示差异；原始文档和修订文档本身默认不被改写。<strong>合并（Combine）</strong>更适合把多个审阅者在不同副本中的修订合到一起。比较和合并不是同一个用途。</p>
    `);
  }

  function patchWordPrintAndProtection() {
    const section = $('#word-20');
    if (!section) return;

    $$('.v10-pitfall-list > div, .v9-pitfall-list > div', section).forEach(card => {
      const p = $('p', card);
      const small = $('small', card);
      if (p?.textContent.includes('限制编辑可用于保护文档结构或格式')) {
        p.textContent = 'Word 2016 的“限制编辑”可限制格式设置，并限制文档允许的编辑类型。';
        if (small) small.textContent = '正确。可设置格式限制和编辑限制，例如只允许修订、批注、填写窗体或不允许更改（只读）；这不等同于 Excel 的“保护工作簿结构”。';
      }
    });

    addNote(section, 'print-markup-protection', `
      <b>打印时“看不见修订”与“修订已经不存在”不能混为一谈。</b>
      <p>Word 可以通过“打印标记（Print Markup）”决定是否把修订和批注打印出来；切换到“无标记”也可以让屏幕或输出看起来像最终稿，但这些操作都不会自动接受或拒绝修订。</p>
      <p><strong>限制编辑</strong>是 Word 的文档保护功能：可以限制格式设置，也可以限制允许的编辑类型，并可对部分区域设置例外。它与 Excel 的“锁定单元格 / 保护工作表 / 保护工作簿结构”属于不同产品中的不同保护层级，不能只因为都有“保护”二字就互相套用。</p>
    `);
  }

  function patchWordTableAcrossPages() {
    const section = $('#word-11');
    if (!section) return;
    addNote(section, 'table-across-pages', `
      <b>“重复标题行”有条件，不是所有跨页方式都自动重复。</b>
      <p>设置重复标题行时，所选标题区域必须包含表格的<strong>第一行</strong>；重复标题主要在“打印布局”视图和实际打印中体现。Word 因内容自然溢出产生的<strong>自动分页</strong>会重复标题行，但如果在表格内部手工插入分页符，后续页不会按同样规则重复该标题。</p>
      <p>“允许跨页断行”控制的是<strong>一整行能否被拆到两页</strong>；取消它可尽量让该行保持在同一页。它与“重复标题行”分别控制行的拆分和表头的重复，不是同一个选项。</p>
    `);
  }

  function patchWordTocAndFields() {
    const section = $('#word-17');
    if (!section) return;
    addNote(section, 'toc-fields', `
      <b>自动目录更新有两个按钮含义：</b>
      <p><strong>仅更新页码</strong>只刷新现有目录项所在页码，不会把新标题加入目录，也不会同步修改过的标题文字；<strong>更新整个目录</strong>才会同时重新读取标题文字、层级和页码。手工敲出来的“假目录”没有这种自动更新能力。</p>
      <p>目录、页码、交叉引用、题注引用、Word 表格公式等很多自动内容本质上属于<strong>域</strong>。单个域可用 F9 更新；常见做法是 Ctrl+A 后按 F9 更新正文中的大量字段，但表格中的字段或公式有时仍需要单独选中表格再按 F9。</p>
    `);
  }

  function patchWindowsPowerAndRestore() {
    const section = $('#windows-14');
    if (!section) return;
    addNote(section, 'power-restore', `
      <b>睡眠、休眠、关机：关键看“工作状态保存在哪里、还需不需要持续供电”。</b>
      <p><strong>睡眠</strong>使用很少的电量并保留当前工作状态，恢复最快；因此“进入睡眠后剪贴板内容必然立即丢失”这种绝对判断不成立。<strong>休眠</strong>比睡眠更省电，重新开机后仍能回到离开前的工作状态，但恢复通常比睡眠慢；并不是所有电脑都提供休眠选项。<strong>关机</strong>则结束本次系统会话。</p>
      <p><strong>系统还原</strong>使用还原点回退系统文件、注册表、已安装程序/驱动和系统设置等状态，主要用于撤销近期系统变更；它不等于个人文件备份，正常的 System Restore 不以删除个人文档、照片等为目标。它也不等于“重置此电脑”，后者会重新安装 Windows，并根据所选方案移除应用、设置，甚至个人文件。</p>
    `);
  }

  function patchWindowsAccounts() {
    const section = $('#windows-10');
    if (!section) return;
    addNote(section, 'accounts', `
      <b>用户账户要分两个维度：账户身份来源，与账户权限级别。</b>
      <p><strong>标准用户</strong>适合日常使用，权限受限；<strong>管理员</strong>拥有更高的系统控制权限，可以修改影响整台计算机的设置、安装软件等。即使当前用户属于管理员组，涉及系统级更改时仍可能出现用户账户控制（UAC）提示。</p>
      <p><strong>本地账户 / Microsoft 账户</strong>描述的是登录身份和同步方式；<strong>标准用户 / 管理员</strong>描述的是权限级别。一个 Microsoft 账户可以是标准用户，也可以是管理员，所以这两组分类不能互相替代。</p>
    `);
  }

  function patchClipboardTerminology() {
    const section = $('#windows-7');
    if (!section) return;
    addNote(section, 'clipboard-terms', `
      <b>“Windows 剪贴板”“Windows 10 剪贴板历史”“Office 剪贴板”不要混成一个概念。</b>
      <p>普通复制/剪切会把可粘贴的数据放入系统剪贴板；粘贴一次并不会自动把它清空。Windows 10 还提供可选的<strong>剪贴板历史</strong>，可用 Win+V 打开并保存多条历史，因此“Windows 10 的剪贴板任何时候只能存一个项目”不能作为无条件结论。</p>
      <p>Word/Excel 里的<strong>Office 剪贴板</strong>又是 Office 自己的多项目收集面板，Word 2016 可从“开始 → 剪贴板”组打开。它与 Windows 系统剪贴板/剪贴板历史不是同一个界面和容量概念；考试看到“Office 剪贴板”时必须单独判断。</p>
    `);
  }

  function patchQuickAccess() {
    const section = $('#windows-9');
    if (!section) return;
    addNote(section, 'quick-access', `
      <b>快速访问显示的是入口和历史，不是把文件重新存了一份。</b>
      <p>Windows 10 的快速访问可以显示固定的文件夹、常用文件夹以及近期使用记录。把某个文件夹“从快速访问取消固定”，或清除快速访问历史，只会移除这个入口/记录，不会删除磁盘上的原文件夹或文件。</p>
    `);
  }

  function apply() {
    patchV19SortDirection();
    patchWordRevisionCompare();
    patchWordPrintAndProtection();
    patchWordTableAcrossPages();
    patchWordTocAndFields();
    patchWindowsPowerAndRestore();
    patchWindowsAccounts();
    patchClipboardTerminology();
    patchQuickAccess();
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
