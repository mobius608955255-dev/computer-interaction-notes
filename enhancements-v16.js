(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function ensureStyle() {
    if ($('#v16-content-audit-style')) return;
    const style = document.createElement('style');
    style.id = 'v16-content-audit-style';
    style.textContent = `
      .v16-accuracy-note{margin:16px 0 0;padding:14px 16px;border:1px solid #ddd2ef;border-radius:16px;background:#faf7ff;color:#4f4758;font-size:13px;line-height:1.7}
      .v16-accuracy-note b{color:#68449d}
      .v16-demo{margin-top:22px;padding:18px;border:1px solid #e5dcef;border-radius:20px;background:#fff}
      .v16-demo h4{margin:0 0 12px;font-size:17px}
      .v16-demo p{margin:8px 0;color:#5d5664;line-height:1.7}
      .v16-demo .v16-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
      .v16-demo button{border:1px solid #d9c9ee;border-radius:12px;background:#f8f2ff;color:#5d3c8f;padding:9px 12px;font-weight:700}
      .v16-demo button.active{background:#6f50a8;color:#fff;border-color:#6f50a8}
      .v16-subtotal-table{display:grid;gap:6px;margin-top:12px}
      .v16-subtotal-row{display:grid;grid-template-columns:minmax(72px,1fr) minmax(70px,.8fr) minmax(100px,1.2fr);gap:8px;padding:9px 10px;border-radius:12px;background:#f7f4f9;font-size:13px}
      .v16-subtotal-row.total{background:#f0e8fa;font-weight:800;color:#5e3a8c}
      .v16-goal-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}
      .v16-goal-grid label{display:grid;gap:5px;color:#736b7b;font-size:12px}
      .v16-goal-grid input{min-width:0;width:100%;padding:9px 10px;border:1px solid #ddd3e5;border-radius:10px;background:#fff}
      .v16-goal-result{display:block;margin-top:10px;padding:12px;border-radius:12px;background:#f3edf9;color:#56357f}
      @media(max-width:560px){.v16-goal-grid{grid-template-columns:1fr}.v16-subtotal-row{grid-template-columns:1fr .7fr 1fr}}
    `;
    document.head.appendChild(style);
  }

  function addNote(section, key, html) {
    if (!section || section.querySelector(`[data-v16-note="${key}"]`)) return;
    const note = document.createElement('div');
    note.className = 'v16-accuracy-note';
    note.dataset.v16Note = key;
    note.innerHTML = html;
    const copy = section.querySelector('.concept-copy, .excel-copy, .note-body');
    (copy || section).appendChild(note);
  }

  function replaceText(section, replacements) {
    if (!section) return 0;
    let count = 0;
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT','STYLE'].includes(parent.tagName)) return;
      let next = node.nodeValue;
      replacements.forEach(([from, to]) => {
        const changed = typeof from === 'string' ? next.replaceAll(from, to) : next.replace(from, to);
        if (changed !== next) { next = changed; count++; }
      });
      if (next !== node.nodeValue) node.nodeValue = next;
    });
    return count;
  }

  function patchStorageHierarchy() {
    const section = $('#concept-12');
    if (!section) return;
    replaceText(section, [
      ['越贵', '单位容量成本通常越高'],
      ['价格越高', '单位容量成本通常越高']
    ]);
    addNote(section, 'storage-cost', '<b>准确表述：</b>存储层次中越靠近 CPU 的层级通常速度越快、容量越小，<strong>单位容量成本通常越高</strong>。这里说的是“每 GB / 每 bit 的成本”，不是说整个寄存器或缓存器件的总售价一定比大容量外存更高。');
  }

  function patchWorksheetDelete() {
    const section = $('#excel-4');
    if (!section) return;
    if (!section.querySelector('[data-v16-delete-sheet]')) {
      const buttons = $$('button', section);
      const anchor = buttons.find(b => ['插入','复制','移动','重命名','隐藏','显示'].includes(b.textContent.trim()));
      if (anchor && anchor.parentElement) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.v16DeleteSheet = '1';
        btn.className = anchor.className;
        btn.textContent = '删除';
        anchor.parentElement.appendChild(btn);
        const out = document.createElement('div');
        out.className = 'v16-accuracy-note';
        out.dataset.v16DeleteResult = '1';
        out.innerHTML = '<b>删除工作表：</b>会把该工作表及其中内容从工作簿中移除；这和“隐藏”不同，隐藏的工作表仍存在，可以重新显示。';
        anchor.parentElement.insertAdjacentElement('afterend', out);
        btn.addEventListener('click', () => { out.innerHTML = '<b>结果：</b>当前工作表被删除。保存工作簿后，不能靠“取消隐藏”把它恢复；重要内容删除前应先确认或保留副本。'; });
      }
    }
    addNote(section, 'sheet-delete', '<b>操作边界：</b>插入、复制、移动、重命名、隐藏/显示和<strong>删除</strong>都属于工作表管理。隐藏≠删除。');
  }

  function patchTextNumbers() {
    const section = $('#excel-5');
    if (!section) return;
    replaceText(section, [
      ['不参与普通数值计算', '按文本存储；在 SUM、AVERAGE 等对区域进行统计时通常不会按普通数值参与（具体取决于函数或运算）']
    ]);

    // A leading apostrophe is an input prefix in Excel; it is normally not displayed in the cell.
    $$('*', section).filter(el => el.children.length === 0 && el.textContent.trim() === "'00126" && !el.closest('code,p')).forEach(el => {
      el.textContent = '00126';
      el.title = "输入时可键入前导单引号 '00126；单元格通常显示为 00126";
    });

    addNote(section, 'text-number', '<b>文本型数字：</b>输入 <code>\'00126</code> 时，前导单引号是 Excel 的输入前缀，<strong>单元格中通常显示 00126，而不是显示单引号</strong>。它仍按文本存储；把显示格式改成“数值”也不会自动完成底层类型转换。');
  }

  function patchLockedAttribute() {
    const section = $('#excel-6');
    if (!section) return;
    $$('*', section).filter(el => el.children.length === 0 && el.textContent.trim() === '已锁定').forEach(el => {
      el.textContent = '锁定属性：开（保护工作表后才限制编辑）';
    });
    addNote(section, 'locked-attribute', '<b>锁定不是立即生效的禁写开关：</b>单元格“锁定”只是属性；只有启用<strong>保护工作表</strong>后，锁定单元格才真正限制编辑。未保护工作表时，即使“锁定”处于开启状态，仍可正常编辑。');
  }

  function patchTextFormat() {
    const section = $('#excel-10');
    if (!section) return;
    addNote(section, 'text-format', '<b>“文本”格式的关键边界：</b>把一个<strong>已经存在的数值</strong>从“常规/数值”改成“文本”，通常不会立即把底层数值转换成文本，也不会凭空给它加前导单引号。若要按文本存储，通常应先设为文本格式再重新输入，或使用明确的转换方法。');

    const selects = $$('select', section);
    selects.forEach(sel => {
      if (sel.dataset.v16TextFormat === '1') return;
      if (![...sel.options].some(o => o.textContent.trim() === '文本' || o.value === '文本')) return;
      sel.dataset.v16TextFormat = '1';
      sel.addEventListener('change', () => {
        const selected = sel.options[sel.selectedIndex]?.textContent.trim() || sel.value;
        if (selected !== '文本') return;
        setTimeout(() => {
          $$('*', section).filter(el => el.children.length === 0 && !el.closest('code,p') && /^'\d/.test(el.textContent.trim())).forEach(el => {
            el.textContent = el.textContent.trim().slice(1);
          });
        }, 0);
      });
    });
  }

  function patchDataList() {
    const section = $('#excel-12');
    if (!section) return;
    replaceText(section, [
      ['首行字段名唯一且连续', '规范的数据清单通常首行为字段名，每列一个字段；字段名应清晰且尽量唯一，数据区域尽量连续'],
      ['字段名唯一且连续', '字段名应清晰且尽量唯一，数据区域尽量连续']
    ]);
    addNote(section, 'data-list', '<b>规范而不是绝对限制：</b>Excel 数据清单通常要求首行为字段名、每列表示一个字段、每行表示一条记录。字段名应清晰并尽量唯一，数据区域尽量连续，这样排序、筛选、分类汇总和数据透视表最稳定；不要把它记成“任何 Excel 区域都必须满足的硬性语法规则”。');
  }

  function patchSubtotal() {
    const section = $('#excel-14');
    if (!section || section.querySelector('[data-v16-subtotal]')) return;

    const oldLab = $('.lab-card', section);
    if (oldLab) oldLab.style.display = 'none';

    const demo = document.createElement('div');
    demo.className = 'v16-demo';
    demo.dataset.v16Subtotal = '1';
    demo.innerHTML = `
      <h4>分类汇总为什么必须先按分类字段排序</h4>
      <p>原始顺序：家具 1200 → 数码 900 → 家具 1800 → 数码 1500。分类汇总按<strong>相邻、连续的同类记录</strong>分组，不会自动把分散在不同位置的“家具”先合并到一起。</p>
      <div class="v16-actions"><button type="button" data-mode="raw" class="active">未排序</button><button type="button" data-mode="sorted">先按类别排序</button></div>
      <div class="v16-subtotal-table" data-table></div>
      <p><b>结论：</b>要得到“家具小计 3000、数码小计 2400”，应先按“类别”排序，再执行分类汇总。</p>
    `;
    (oldLab || section.querySelector('.concept-copy') || section).insertAdjacentElement('afterend', demo);

    const table = $('[data-table]', demo);
    const render = mode => {
      const rows = mode === 'sorted'
        ? [['家具','1200',''],['家具','1800',''],['','', '家具小计 3000'],['数码','900',''],['数码','1500',''],['','', '数码小计 2400']]
        : [['家具','1200','家具小计 1200'],['数码','900','数码小计 900'],['家具','1800','家具小计 1800'],['数码','1500','数码小计 1500']];
      table.innerHTML = rows.map(r => `<div class="v16-subtotal-row ${r[0] ? '' : 'total'}"><span>${r[0] || '小计'}</span><span>${r[1]}</span><span>${r[2]}</span></div>`).join('');
    };
    $$('.v16-actions button', demo).forEach(btn => btn.addEventListener('click', () => {
      $$('.v16-actions button', demo).forEach(b => b.classList.toggle('active', b === btn));
      render(btn.dataset.mode);
    }));
    render('raw');
  }

  function patchGoalSeek() {
    const section = $('#excel-17');
    if (!section || section.querySelector('[data-v16-goal-seek]')) return;

    const oldLab = $('.lab-card', section);
    if (oldLab && /目标|销量|单变量|求解/.test(oldLab.textContent)) oldLab.style.display = 'none';

    const demo = document.createElement('div');
    demo.className = 'v16-demo';
    demo.dataset.v16GoalSeek = '1';
    demo.innerHTML = `
      <h4>单变量求解（Goal Seek）</h4>
      <p>已知公式“销售额 = 单价 × 销量”，指定目标销售额，让 Excel 反求“销量”。单变量求解本身按连续数值求解，<strong>不会自动把结果向上取整成整数件</strong>。</p>
      <div class="v16-goal-grid"><label>单价<input type="number" min="0.0001" step="0.1" value="80" data-price></label><label>目标销售额<input type="number" step="1" value="10001" data-target></label></div>
      <strong class="v16-goal-result" data-result></strong>
      <p>如果业务规则要求销量必须是整数件，应在求解后另行应用取整/约束，并重新检查是否达到目标；这不是 Goal Seek 自动替你完成的步骤。</p>
    `;
    (oldLab || section.querySelector('.concept-copy') || section).insertAdjacentElement('afterend', demo);

    const price = $('[data-price]', demo), target = $('[data-target]', demo), result = $('[data-result]', demo);
    const update = () => {
      const p = Number(price.value), t = Number(target.value);
      if (!(p > 0) || !Number.isFinite(t)) { result.textContent = '请输入有效的单价和目标值。'; return; }
      const q = t / p;
      const shown = Number.isInteger(q) ? String(q) : q.toFixed(4).replace(/0+$/,'').replace(/\.$/,'');
      result.textContent = `连续求解结果：销量 = ${shown} 件（${t} ÷ ${p}）`;
    };
    price.addEventListener('input', update); target.addEventListener('input', update); update();
  }

  function apply() {
    ensureStyle();
    patchStorageHierarchy();
    patchWorksheetDelete();
    patchTextNumbers();
    patchLockedAttribute();
    patchTextFormat();
    patchDataList();
    patchSubtotal();
    patchGoalSeek();
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; apply(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
  else schedule();
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
})();
