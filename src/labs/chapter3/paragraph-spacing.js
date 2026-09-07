/* Word paragraph spacing: one bounded state model, no document pagination engine. */
(() => {
  'use strict';
  const { register, ui } = window.NOTE_LABS;
  const { btn, field, select, office, paper, dialog, output, coach, number } = ui;
  const kinds = [['single', '单倍'], ['oneHalf', '1.5倍'], ['double', '2倍'], ['multiple', '多倍'], ['minimum', '最小值'], ['exact', '固定值']];
  const defaults = { before: 0, after: 6, kind: 'oneHalf', amount: 1.5 };
  function sampleHeight(s) {
    if (s.kind === 'minimum') return Math.max(18, s.amount);
    if (s.kind === 'exact') return s.amount;
    return 18 * ({ single: 1, oneHalf: 1.5, double: 2 }[s.kind] || s.amount);
  }
  function settingSummary(s) {
    const name = kinds.find(([key]) => key === s.kind)[1];
    const value = s.kind === 'multiple' ? ` ${s.amount}倍` : ['minimum', 'exact'].includes(s.kind) ? ` ${s.amount}磅` : '';
    return `段前 ${s.before}磅；段后 ${s.after}磅；行距 ${name}${value}。`;
  }
  register(['syllabus-word-paragraph-spacing'], '分开调整段前、段后和段内行距', '先设间距，再观察哪些区域改变；取消对话框应保留原设置。',
    { ...defaults, draft: null }, s => {
      const d = s.draft;
      const numeric = d && ['multiple', 'minimum', 'exact'].includes(d.kind);
      const height = sampleHeight(s);
      const rows = ['同一段落的第一行', '同一段落的第二行', '同一段落的第三行'];
      return `<div class="lab-word-spacing">${office('Word', '开始 · 段落', btn('段落对话框 ↘', 'open'),
        (d ? dialog('段落 · 缩进和间距',
          field('before', '段前（磅）', d.before, 'number', 'min="0" max="36" step="1"') +
          field('after', '段后（磅）', d.after, 'number', 'min="0" max="36" step="1"') +
          select('kind', '行距', d.kind, kinds) +
          (numeric ? field('amount', d.kind === 'multiple' ? '设置值（倍）' : '设置值（磅）', d.amount, 'number', d.kind === 'multiple' ? 'min="0.5" max="3" step="0.1"' : 'min="8" max="40" step="1"') : ''),
          btn('确定', 'apply') + btn('取消', 'cancel')) : '') +
        paper(`<div class="lab-spacing-caption">段前区域 · ${s.before}磅</div><div data-spacing-before style="height:${s.before}pt;background:#f5dfec"></div>
          <div class="lab-spacing-sample" data-spacing-sample>${rows.map(row => `<div data-spacing-line style="height:${height}pt;line-height:${height}pt">${row}</div>`).join('')}</div>
          <div data-spacing-after style="height:${s.after}pt;background:#eaddf5"></div><div class="lab-spacing-caption">段后区域 · ${s.after}磅</div>`))}
        ${output(settingSummary(s) + (s.kind === 'exact' && s.amount < 18 ? ' 本示例固定值偏小，文字可能被行框裁切。' : ''))}
        ${coach('这里只展示一个段落，色块标明段落外的留白；三行样本文字保持不变。单倍高度依赖字体，本例采用固定样本比较比例，不预测真实Word的行数、页数或相邻段落间距。', '本演示的范围与限制')}
      </div>`;
    }, (s, action) => {
      if (action === 'open') s.draft = { before: s.before, after: s.after, kind: s.kind, amount: s.amount };
      if (action === 'cancel') s.draft = null;
      if (action === 'apply' && s.draft) { Object.assign(s, s.draft); s.draft = null; }
    }, (s, key, value) => {
      if (!s.draft) return;
      if (key === 'kind' && kinds.some(([name]) => name === value)) {
        s.draft.kind = value;
        s.draft.amount = ['minimum', 'exact'].includes(value) ? 18 : 1.5;
      } else if (key === 'before' || key === 'after') s.draft[key] = number(value, 0, 36);
      else if (key === 'amount') s.draft.amount = s.draft.kind === 'multiple' ? number(value, 0.5, 3) : number(value, 8, 40);
    });
})();
