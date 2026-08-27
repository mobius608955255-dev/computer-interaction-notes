(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function addNote(section, key, html) {
    if (!section || section.querySelector(`[data-v18-note="${key}"]`)) return;
    const note = document.createElement('div');
    note.className = 'same-core v18-audit-note';
    note.dataset.v18Note = key;
    note.innerHTML = html;
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

  function patchAdvancedFilter() {
    const section = $('#excel-13');
    if (!section) return;

    $$('.memory-line strong', section).forEach(el => {
      if (el.textContent.includes('同行为') && el.textContent.includes('异行为')) {
        el.textContent = '高级筛选：同一条件行中的条件共同成立（AND）；不同条件行表示不同条件组合（OR）。';
      }
    });

    addNote(section, 'advanced-filter', `
      <b>高级筛选的条件区域要按“整行逻辑”读：</b>
      <p>同一条件行内，不同列的条件必须同时满足；不同条件行之间，只要满足其中一整行条件即可。条件区域的普通字段标题应与数据清单字段名一致。</p>
      <div class="exam-table-wrap"><table class="exam-table">
        <thead><tr><th>科目</th><th>分数</th><th>分数</th></tr></thead>
        <tbody><tr><td>计算机</td><td>&gt;=80</td><td>&lt;=90</td></tr></tbody>
      </table></div>
      <p><b>同一字段做区间 AND：</b>例如“分数 ≥80 且 ≤90”，需要在条件区域重复“分数”字段标题，并把两个条件放在同一行。若把两个条件上下分成两行，就会变成 OR。</p>
      <p><b>公式条件是例外：</b>使用公式作为高级筛选条件时，条件标题应留空或使用与数据清单不同的标题；公式本身必须返回 TRUE/FALSE。不要把“字段标题必须完全相同”机械套到公式条件。</p>
    `);
  }

  function patchValidation() {
    const section = $('#excel-18');
    if (!section) return;

    replaceText(section, '输入 126 → 阻止', '错误警告=停止时：输入 126 → 阻止');
    replaceText(section, '输入126 → 阻止', '错误警告=停止时：输入126 → 阻止');

    addNote(section, 'validation', `
      <b>数据验证不是“一律禁止非法值”。</b>
      <p>当错误警告样式为“停止（Stop）”时，直接键入不合规则的值会被阻止；“警告（Warning）”允许用户确认后继续，“信息（Information）”提示后也可以接受该值。</p>
      <p>还有一个容易漏掉的边界：数据验证主要拦截<strong>直接键入</strong>。通过复制、填充、公式或宏写入时，非法值可能进入单元格而不弹出验证提示；可用“圈释无效数据”检查已有非法值。</p>
    `);
  }

  function patchProtection() {
    const section = $('#excel-6');
    if (!section) return;

    addNote(section, 'protection-levels', `
      <b>“锁定单元格”“保护工作表”“保护工作簿结构”“文件加密”是四件事。</b>
      <p><strong>锁定单元格</strong>只是单元格属性，只有启用“保护工作表”后才真正限制编辑；<strong>保护工作表</strong>控制当前工作表中哪些单元格或操作允许修改；<strong>保护工作簿结构</strong>主要限制新增、移动、删除、隐藏/取消隐藏、重命名工作表等结构变化；<strong>文件加密密码</strong>才是控制能否打开文件的另一层机制。</p>
    `);
  }

  function patchPivotTable() {
    const section = $('#excel-16');
    if (!section) return;

    addNote(section, 'pivot-summary', `
      <b>透视表“值”区域的默认汇总方式不是永远求和。</b>
      <p>字段被 Excel 识别为纯数值时，值区域通常默认使用“求和”；如果该字段包含空白或非数值内容，放入值区域时可能默认改为“计数”。所以看到“计数项”不要先怀疑透视表坏了，应先检查源数据类型是否混杂。</p>
      <p>源数据新增或修改后，已有数据透视表通常需要<strong>刷新</strong>才能反映变化。</p>
    `);
  }

  function patchConsolidation() {
    const section = $('#excel-15');
    if (!section) return;

    addNote(section, 'consolidation', `
      <b>合并计算的两种匹配依据不要混：</b>
      <p><strong>按位置</strong>要求各源区域采用相同布局，按相同相对位置汇总；<strong>按分类</strong>根据首行和/或最左列的标签匹配项目，因此项目位置可以不同，但标签必须能正确对应。标签文字不一致时，Excel 不会凭语义自动判断它们属于同一类。</p>
    `);
  }

  function patchDateTime() {
    const section = $('#excel-5');
    if (!section) return;

    addNote(section, 'datetime', `
      <b>日期和时间在 Excel 里不是“只供显示的文字”。</b>
      <p>Windows 版 Excel 默认使用 1900 日期系统：日期以连续序列值存储；时间表示一天中的小数部分，例如 12:00 对应约 0.5。正因为底层是数值，日期和时间可以参与加减运算；把单元格显示格式改成“常规”时，可能看到它们对应的序列值或小数。</p>
      <p>这和前面的“显示格式不改变已有底层值”是同一个原则：看到的样子与单元格真正存的值必须分开。</p>
    `);
  }

  function patchFormulaErrors() {
    const section = $('#excel-8');
    if (!section) return;

    addNote(section, 'formula-errors', `
      <b>公式排错先认错误值，再找原因：</b>
      <p><code>#DIV/0!</code>：除数为 0 或空白；<code>#REF!</code>：引用失效；<code>#VALUE!</code>：参与运算的数据类型或参数不合适；<code>#NAME?</code>：函数名、名称或公式中的文本无法识别；<code>#N/A</code>：需要的值不可用，查找函数没有找到匹配项是常见原因。</p>
      <p><code>#####</code>要单独看：它通常表示列宽不足，或在 1900 日期系统下出现无法显示的负日期/时间等显示问题，<strong>不是</strong>与 <code>#DIV/0!</code>、<code>#REF!</code> 同类的公式错误值。</p>
    `);
  }

  function apply() {
    patchAdvancedFilter();
    patchValidation();
    patchProtection();
    patchPivotTable();
    patchConsolidation();
    patchDateTime();
    patchFormulaErrors();
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
