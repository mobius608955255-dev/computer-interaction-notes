(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function ensureStyle() {
    if ($('#v28-interaction-style')) return;
    const style = document.createElement('style');
    style.id = 'v28-interaction-style';
    style.textContent = [
      '.v28-lab{margin-top:30px;padding:clamp(18px,4vw,30px);border:1px solid #b9ddcf;border-radius:24px;background:linear-gradient(145deg,#eaf8f2,#fff 62%);box-shadow:0 16px 42px rgba(28,107,77,.08)}',
      '.v28-head{display:flex;gap:12px;align-items:flex-start}.v28-dot{width:12px;height:12px;flex:0 0 auto;margin-top:6px;border:3px solid #fff;border-radius:50%;background:#2e8c68;box-shadow:0 0 0 3px #bde9d8}',
      '.v28-head small{display:block;margin:0 0 4px;color:#2e755e;font-size:11px;font-weight:850;letter-spacing:.1em}.v28-head h3{margin:0;color:#203a31;font-size:clamp(20px,4vw,27px)}.v28-lead{margin:13px 0 0;color:#52665e;line-height:1.65}',
      '.v28-toolbar{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 14px}.v28-choice,.v28-primary,.v28-secondary{min-height:40px;padding:9px 12px;border-radius:12px;cursor:pointer;font:inherit;font-size:13px;font-weight:760;transition:transform .15s ease,background .15s ease,border-color .15s ease}',
      '.v28-choice{border:1px solid #b8d9cc;background:rgba(255,255,255,.86);color:#35624f}.v28-choice:hover,.v28-choice:focus-visible{border-color:#2e8c68;outline:2px solid rgba(46,140,104,.22);outline-offset:2px}.v28-choice.is-active{border-color:#216e50;background:#216e50;color:#fff;box-shadow:0 7px 16px rgba(33,110,80,.17)}',
      '.v28-primary{border:1px solid #216e50;background:#216e50;color:#fff}.v28-primary:hover{transform:translateY(-1px);background:#17563e}.v28-primary:disabled{cursor:default;opacity:.58;transform:none}.v28-secondary{border:1px solid #b8d9cc;background:#fff;color:#35624f}',
      '.v28-sheet{overflow-x:auto;margin:16px 0;border:1px solid #cde4da;border-radius:16px;background:#fff;-webkit-overflow-scrolling:touch}.v28-sheet table{width:100%;min-width:340px;border-collapse:collapse;color:#304b40;font-size:13px}.v28-sheet th,.v28-sheet td{padding:9px 11px;border-right:1px solid #e1eee8;border-bottom:1px solid #e1eee8;text-align:left;vertical-align:top}.v28-sheet th{background:#f1faf5;color:#2e755e;font-weight:820}.v28-sheet tr:last-child td{border-bottom:0}.v28-sheet th:last-child,.v28-sheet td:last-child{border-right:0}.v28-bad{background:#fff4ed!important;color:#a94c2f}.v28-good{background:#effaf5!important;color:#226b4d}',
      '.v28-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v28-cell{min-width:0;padding:13px;border:1px solid #cde4da;border-radius:14px;background:rgba(255,255,255,.86)}.v28-cell span{display:block;margin-bottom:7px;color:#5c776b;font-size:11px;font-weight:800;letter-spacing:.04em}.v28-cell code{display:block;overflow-wrap:anywhere;color:#174d39;font-family:Consolas,monospace;font-size:13px;font-weight:700}',
      '.v28-live{margin:15px 0 0;padding:12px 14px;border-left:4px solid #2e8c68;border-radius:0 12px 12px 0;background:rgba(255,255,255,.72);color:#315548;line-height:1.6}.v28-live.warn{border-left-color:#d98641;color:#87501f;background:#fff9f0}.v28-live.ok{border-left-color:#2e8c68;color:#1d6247;background:#f0faf5}',
      '.v28-status{display:grid;gap:7px;margin:14px 0 0}.v28-status div{display:flex;gap:9px;align-items:flex-start;padding:9px 11px;border-radius:12px;background:rgba(255,255,255,.72);color:#576d63;font-size:13px;line-height:1.5}.v28-status div.done{background:#effaf5;color:#1f674a}.v28-caption{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:14px 0 6px;color:#315548;font-size:13px;font-weight:800}.v28-caption em{color:#668176;font-size:12px;font-style:normal;font-weight:700}',
      '@media(max-width:620px){.v28-lab{padding:17px;border-radius:19px}.v28-grid{grid-template-columns:1fr}.v28-choice,.v28-primary,.v28-secondary{flex:1 1 calc(50% - 8px)}.v28-sheet th,.v28-sheet td{padding:8px;font-size:12px}#excel-8 .functions-deep-dive,#excel-20 .chart-deep-dive{overflow-x:auto;-webkit-overflow-scrolling:touch}#excel-8 .topic-grid,#excel-20 .chart-error-grid{min-width:0!important;grid-template-columns:1fr!important}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function button(label, attribute, value, extra) {
    return '<button class="v28-choice" type="button" aria-pressed="false" data-' + attribute + '="' + value + '"' + (extra || '') + '>' + label + '</button>';
  }

  function mount(selector, key, title, lead, body) {
    const section = $(selector);
    if (!section || section.querySelector('[data-v28="' + key + '"]')) return null;
    const host = $('.section-shell,.module-shell', section) || section;
    const card = document.createElement('section');
    card.className = 'v28-lab';
    card.dataset.v28 = key;
    card.innerHTML = '<div class="v28-head"><i class="v28-dot"></i><div><small>动手看结果</small><h3>' + title + '</h3></div></div><p class="v28-lead">' + lead + '</p>' + body;
    const memory = $('.memory-line,.course-memory', host);
    if (memory) memory.insertAdjacentElement('beforebegin', card);
    else host.appendChild(card);
    return card;
  }

  function setActive(root, attribute, value) {
    $$('[' + attribute + ']', root).forEach(node => {
      const active = node.getAttribute(attribute) === value;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-pressed', String(active));
    });
  }

  function simpleTable(headers, rows) {
    return '<table><thead><tr>' + headers.map(value => '<th>' + value + '</th>').join('') + '</tr></thead><tbody>' + rows.map(row => '<tr>' + row.map(value => '<td>' + value + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
  }

  function lockLab() {
    const lab = mount(
      '#excel-6',
      'lock-freeze',
      '锁定与冻结：一个限制编辑，一个固定视图',
      '选择要处理的整行或整列，依次设置 Locked 属性和保护工作表；再试试冻结。两者都可能说“锁定”，但最终结果完全不同。',
      '<div class="v28-toolbar">' +
        button('选择整行', 'lock-scope', 'row') +
        button('选择整列', 'lock-scope', 'column') +
      '</div><div class="v28-toolbar">' +
        '<button class="v28-primary" type="button" data-lock-property>设置 Locked 属性</button>' +
        '<button class="v28-primary" type="button" data-lock-protect>保护工作表</button>' +
        '<button class="v28-secondary" type="button" data-lock-reset>重置</button>' +
      '</div><div class="v28-toolbar">' +
        button('冻结首行', 'freeze', 'top') +
        button('冻结首列', 'freeze', 'left') +
        button('取消冻结', 'freeze', 'none') +
      '</div><div class="v28-grid"><div class="v28-cell"><span>编辑限制状态</span><code data-lock-edit></code></div><div class="v28-cell"><span>滚动视图状态</span><code data-lock-view></code></div></div><p class="v28-live" aria-live="polite" data-lock-result></p>'
    );
    if (!lab) return;
    const state = { scope: 'row', property: false, protect: false, freeze: 'none' };
    function render() {
      const object = state.scope === 'row' ? '所选整行中的单元格' : '所选整列中的单元格';
      let edit = '仍可编辑';
      let message = 'Locked 是单元格属性；只设置属性而未保护工作表时，编辑不会被真正限制。';
      if (state.property && state.protect) {
        edit = object + '受保护，不能直接编辑';
        message = '现在才真正生效：先选中整行或整列所含单元格设置 Locked，再保护工作表。它限制编辑，不固定滚动位置。';
      } else if (state.property) {
        edit = object + '已标记 Locked，但仍可编辑';
      }
      const view = state.freeze === 'top' ? '滚动时首行仍显示' : state.freeze === 'left' ? '滚动时首列仍显示' : '不冻结，滚动时行列正常离开视图';
      $('[data-lock-edit]', lab).textContent = edit;
      $('[data-lock-view]', lab).textContent = view;
      $('[data-lock-result]', lab).textContent = message + ' 冻结窗格只改变查看方式，不会阻止任何人编辑数据。';
      setActive(lab, 'data-lock-scope', state.scope);
      setActive(lab, 'data-freeze', state.freeze);
      $('[data-lock-property]', lab).disabled = state.property;
      $('[data-lock-protect]', lab).disabled = state.protect;
    }
    lab.addEventListener('click', event => {
      const scope = event.target.closest('[data-lock-scope]');
      const freeze = event.target.closest('[data-freeze]');
      if (scope) state.scope = scope.dataset.lockScope;
      if (freeze) state.freeze = freeze.dataset.freeze;
      if (event.target.closest('[data-lock-property]')) state.property = true;
      if (event.target.closest('[data-lock-protect]')) state.protect = true;
      if (event.target.closest('[data-lock-reset]')) {
        state.property = false;
        state.protect = false;
        state.freeze = 'none';
      }
      if (scope || freeze || event.target.closest('[data-lock-property]') || event.target.closest('[data-lock-protect]') || event.target.closest('[data-lock-reset]')) render();
    });
    render();
  }

  function referenceLab() {
    const lab = mount(
      '#excel-7',
      'reference-builder',
      '引用构造器：复制一次，地址到底怎样变',
      '先选引用类型，再选向右或向下填充。看行号、列号、工作表范围和工作簿名是否发生实际位移。',
      '<div class="v28-toolbar">' +
        button('相对 A1', 'ref-mode', 'relative') +
        button('绝对 $A$1', 'ref-mode', 'absolute') +
        button('混合 A$1', 'ref-mode', 'mixed-row') +
        button('混合 $A1', 'ref-mode', 'mixed-col') +
        button('标准 3-D', 'ref-mode', 'three-d') +
        button('外部工作簿', 'ref-mode', 'external') +
      '</div><div class="v28-toolbar">' +
        button('向右填充', 'ref-fill', 'right') +
        button('向下填充', 'ref-fill', 'down') +
      '</div><div class="v28-grid"><div class="v28-cell"><span>原单元格</span><code data-ref-from></code></div><div class="v28-cell"><span data-ref-label>向右填充后</span><code data-ref-after></code></div></div><p class="v28-live" aria-live="polite" data-ref-note></p>'
    );
    if (!lab) return;
    const presets = {
      relative: { label: '相对引用 A1', from: '=A2*B2', right: '=B2*C2', down: '=A3*B3', note: '没有 $：复制到哪里，行号和列号就跟着相对位移。' },
      absolute: { label: '绝对引用 $A$1', from: '=$A$2*B2', right: '=$A$2*C2', down: '=$A$2*B3', note: 'A 列和第 2 行均被锁住；未锁定的 B2 才会移动。' },
      'mixed-row': { label: '混合引用 A$1', from: '=A$2*B2', right: '=B$2*C2', down: '=A$2*B3', note: '只锁行：横向填充时列会变，纵向填充时第 2 行保持不变。' },
      'mixed-col': { label: '混合引用 $A1', from: '=$A2*B2', right: '=$A2*C2', down: '=$A3*B3', note: '只锁列：横向填充时 A 列保持不变，纵向填充时行号会变。' },
      'three-d': { label: '标准 3-D 引用', from: '=SUM(一月:三月!B2)', right: '=SUM(一月:三月!C2)', down: '=SUM(一月:三月!B3)', note: '标准 3-D 跨一段连续工作表汇总同一相对地址；填充时地址仍会移动。' },
      external: { label: '外部工作簿引用', from: "='[预算.xlsx]明细'!$B$2", right: "='[预算.xlsx]明细'!$B$2", down: "='[预算.xlsx]明细'!$B$2", note: '引用含工作簿名、工作表名和地址；这里是绝对地址，所以填充不漂移。' }
    };
    const state = { mode: 'relative', fill: 'right' };
    function render() {
      const preset = presets[state.mode];
      $('[data-ref-from]', lab).textContent = preset.from;
      $('[data-ref-after]', lab).textContent = preset[state.fill];
      $('[data-ref-label]', lab).textContent = state.fill === 'right' ? '向右填充后' : '向下填充后';
      $('[data-ref-note]', lab).textContent = preset.label + '：' + preset.note;
      setActive(lab, 'data-ref-mode', state.mode);
      setActive(lab, 'data-ref-fill', state.fill);
    }
    lab.addEventListener('click', event => {
      const mode = event.target.closest('[data-ref-mode]');
      const fill = event.target.closest('[data-ref-fill]');
      if (mode) state.mode = mode.dataset.refMode;
      if (fill) state.fill = fill.dataset.refFill;
      if (mode || fill) render();
    });
    render();
  }

  function dataListLab() {
    const lab = mount(
      '#excel-12',
      'data-list-repair',
      '数据清单修复台：先让数据能被稳定处理',
      '这不是说所有区域都必须排成同一张表，而是帮助你识别：字段名重复、清单被空行切断时，排序、筛选和透视分析为什么会更容易选错范围。',
      '<div class="v28-toolbar"><button class="v28-choice" type="button" data-list-fix="header">改正重复字段名</button><button class="v28-choice" type="button" data-list-fix="blank">移除中间空行</button><button class="v28-choice" type="button" data-list-fix="range">确认完整数据区域</button><button class="v28-secondary" type="button" data-list-reset>重置</button></div><div class="v28-sheet" data-list-table></div><div class="v28-status" data-list-status></div><p class="v28-live" aria-live="polite" data-list-result></p>'
    );
    if (!lab) return;
    const state = { header: false, blank: false, range: false };
    function render() {
      const headers = state.header ? ['订单号', '部门', '分数'] : ['订单号', '部门', '部门'];
      const rows = [['A-01', '济南', '80']];
      if (!state.blank) rows.push(['— 空行 —', '— 空行 —', '— 空行 —']);
      rows.push(['A-02', '青岛', '88']);
      if (state.range) rows.push(['A-03', '济南', '92']);
      $('[data-list-table]', lab).innerHTML = '<table><thead><tr>' + headers.map((value, index) => '<th class="' + (!state.header && index === 2 ? 'v28-bad' : '') + '">' + value + '</th>').join('') + '</tr></thead><tbody>' + rows.map(row => '<tr>' + row.map(value => '<td class="' + (value === '— 空行 —' ? 'v28-bad' : '') + '">' + value + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
      const checks = [
        ['header', '字段名清晰且尽量唯一'],
        ['blank', '数据记录之间没有中间空行'],
        ['range', '操作时选择完整、连续的数据区域']
      ];
      $('[data-list-status]', lab).innerHTML = checks.map(item => '<div class="' + (state[item[0]] ? 'done' : '') + '"><span>' + (state[item[0]] ? '✓' : '○') + '</span><span>' + (state[item[0]] ? '已处理 · ' : '待处理 · ') + item[1] + '</span></div>').join('');
      $$('[data-list-fix]', lab).forEach(node => {
        const done = state[node.dataset.listFix];
        node.classList.toggle('is-active', done);
        node.setAttribute('aria-pressed', String(done));
      });
      const allDone = Object.values(state).every(Boolean);
      const result = $('[data-list-result]', lab);
      result.className = 'v28-live ' + (allDone ? 'ok' : 'warn');
      result.textContent = allDone ? '现在可把它作为规范数据清单去排序、筛选、分类汇总或建立透视表。Excel 并不禁止其他排版，只是这种结构最不容易造成范围歧义。' : '继续完成三项修复；否则字段或范围容易在后续处理时被错误识别。';
    }
    lab.addEventListener('click', event => {
      const fix = event.target.closest('[data-list-fix]');
      if (fix) state[fix.dataset.listFix] = !state[fix.dataset.listFix];
      if (event.target.closest('[data-list-reset]')) {
        state.header = false;
        state.blank = false;
        state.range = false;
      }
      if (fix || event.target.closest('[data-list-reset]')) render();
    });
    render();
  }

  function consolidateLab() {
    const lab = mount(
      '#excel-15',
      'consolidate-judge',
      '合并计算：先问看位置还是看标签',
      '切换场景，再选择合并依据。相同位置不等于相同分类；标签顺序不一致也不代表无法按分类汇总。',
      '<div class="v28-toolbar">' + button('场景 A：位置一致', 'merge-case', 'position') + button('场景 B：标签对应', 'merge-case', 'label') + '</div><div class="v28-grid" data-merge-sources></div><div class="v28-toolbar">' + button('按位置合并', 'merge-method', 'position') + button('按分类（标签）合并', 'merge-method', 'label') + '</div><p class="v28-live" aria-live="polite" data-merge-result></p>'
    );
    if (!lab) return;
    const cases = {
      position: {
        left: [['一月', '20'], ['二月', '30']],
        right: [['三月', '25'], ['四月', '35']],
        labelLeft: '区域 1（布局一致）',
        labelRight: '区域 2（布局一致）',
        correct: 'position',
        good: '按位置正确：相同相对位置配对，得到 20+25=45、30+35=65；不要求位置上的文字标签相同。',
        bad: '按分类不合适：一月和三月并非同一类别，Excel 不会仅凭“都是第 1 行”把不同标签当同类。'
      },
      label: {
        left: [['华东', '60'], ['华南', '40']],
        right: [['华南', '30'], ['华东', '70']],
        labelLeft: '门店 1（标签顺序）',
        labelRight: '门店 2（标签顺序不同）',
        correct: 'label',
        good: '按分类正确：最左列标签配对，华东为 60+70=130，华南为 40+30=70；行的位置不同不影响标签匹配。',
        bad: '按位置会错配：第一行的华东和华南不是同一分类，不能仅因处在相对第一行就相加。'
      }
    };
    const state = { scenario: 'position', method: '' };
    function table(title, rows) {
      return '<div><div class="v28-caption"><strong>' + title + '</strong><em>最左列是分类线索</em></div><div class="v28-sheet">' + simpleTable(['类别', '金额'], rows) + '</div></div>';
    }
    function render() {
      const current = cases[state.scenario];
      $('[data-merge-sources]', lab).innerHTML = table(current.labelLeft, current.left) + table(current.labelRight, current.right);
      setActive(lab, 'data-merge-case', state.scenario);
      setActive(lab, 'data-merge-method', state.method);
      const result = $('[data-merge-result]', lab);
      if (!state.method) {
        result.className = 'v28-live';
        result.textContent = '请选择按位置或按分类；先问两个区域应当依靠什么规则建立对应关系。';
      } else if (state.method === current.correct) {
        result.className = 'v28-live ok';
        result.textContent = current.good;
      } else {
        result.className = 'v28-live warn';
        result.textContent = current.bad;
      }
    }
    lab.addEventListener('click', event => {
      const scenario = event.target.closest('[data-merge-case]');
      const method = event.target.closest('[data-merge-method]');
      if (scenario) {
        state.scenario = scenario.dataset.mergeCase;
        state.method = '';
      }
      if (method) state.method = method.dataset.mergeMethod;
      if (scenario || method) render();
    });
    render();
  }

  function pivotLab() {
    const lab = mount(
      '#excel-16',
      'pivot-refresh',
      '数据透视表：源数据变了，还要刷新',
      '选择报表筛选项，再给源数据新增一条记录。筛选只限定透视报表视图；源表变了不代表已有透视表立即重算。',
      '<div class="v28-toolbar">' + button('全部地区', 'pivot-filter', 'all') + button('济南', 'pivot-filter', '济南') + button('青岛', 'pivot-filter', '青岛') + '</div><div class="v28-toolbar"><button class="v28-primary" type="button" data-pivot-add>源数据新增 2月·青岛·30</button><button class="v28-secondary" type="button" data-pivot-refresh>刷新数据透视表</button><button class="v28-secondary" type="button" data-pivot-reset>重置演示</button></div><div class="v28-grid"><div><div class="v28-caption"><strong>源数据</strong><em>日期字段已按月显示</em></div><div class="v28-sheet" data-pivot-source></div></div><div><div class="v28-caption"><strong>透视表：行=月份，值=销量求和</strong><em data-pivot-stamp></em></div><div class="v28-sheet" data-pivot-table></div></div></div><p class="v28-live" aria-live="polite" data-pivot-result></p>'
    );
    if (!lab) return;
    const initial = [
      { month: '1月', region: '济南', sales: 20 },
      { month: '1月', region: '青岛', sales: 15 },
      { month: '2月', region: '济南', sales: 25 }
    ];
    const state = { source: initial.map(row => Object.assign({}, row)), snapshot: initial.map(row => Object.assign({}, row)), filter: 'all', added: false };
    function render() {
      $('[data-pivot-source]', lab).innerHTML = simpleTable(['月份', '地区', '销量'], state.source.map(row => [row.month, row.region, String(row.sales)]));
      const filtered = state.snapshot.filter(row => state.filter === 'all' || row.region === state.filter);
      const months = [...new Set(state.snapshot.map(row => row.month))];
      const values = months.map(month => [month, String(filtered.filter(row => row.month === month).reduce((sum, row) => sum + row.sales, 0))]);
      $('[data-pivot-table]', lab).innerHTML = simpleTable(['月份', '销量（求和）'], values);
      const stale = state.added && state.snapshot.length < state.source.length;
      $('[data-pivot-stamp]', lab).textContent = stale ? '尚未刷新' : '已与源数据同步';
      const result = $('[data-pivot-result]', lab);
      result.className = 'v28-live ' + (stale ? 'warn' : 'ok');
      result.textContent = stale ? '新记录已在源数据，但右侧透视表仍使用上一次快照。点击刷新后才会把它计入对应月份/地区。' : '报表筛选当前为“' + (state.filter === 'all' ? '全部地区' : state.filter) + '”。它只改变右侧汇总视图，不会删除或隐藏左侧源数据。';
      setActive(lab, 'data-pivot-filter', state.filter);
      $('[data-pivot-add]', lab).disabled = state.added;
    }
    lab.addEventListener('click', event => {
      const filter = event.target.closest('[data-pivot-filter]');
      if (filter) state.filter = filter.dataset.pivotFilter;
      if (event.target.closest('[data-pivot-add]') && !state.added) {
        state.source.push({ month: '2月', region: '青岛', sales: 30 });
        state.added = true;
      }
      if (event.target.closest('[data-pivot-refresh]')) state.snapshot = state.source.map(row => Object.assign({}, row));
      if (event.target.closest('[data-pivot-reset]')) {
        state.source = initial.map(row => Object.assign({}, row));
        state.snapshot = initial.map(row => Object.assign({}, row));
        state.filter = 'all';
        state.added = false;
      }
      if (filter || event.target.closest('[data-pivot-add]') || event.target.closest('[data-pivot-refresh]') || event.target.closest('[data-pivot-reset]')) render();
    });
    render();
  }

  function importLab() {
    const lab = mount(
      '#excel-18',
      'import-validation',
      'CSV 导入与数据验证：三件事分开看',
      '分隔符决定能不能拆列，列类型决定前导 0 是否保留，错误警告样式决定非法值是否一定被阻止。',
      '<div class="v28-toolbar">' + button('按逗号分列', 'csv-delimiter', 'comma') + button('误按分号分列', 'csv-delimiter', 'semicolon') + '</div><div class="v28-toolbar">' + button('编号列按文本导入', 'csv-type', 'text') + button('编号列按常规导入', 'csv-type', 'general') + '</div><div class="v28-toolbar">' + button('停止 Stop', 'validation', 'stop') + button('警告 Warning', 'validation', 'warning') + button('信息 Information', 'validation', 'information') + '</div><div class="v28-grid"><div class="v28-cell"><span>CSV 原文</span><code>编号,姓名,分数<br>00126,王明,88<br>00127,李华,102</code></div><div class="v28-sheet" data-csv-output></div></div><p class="v28-live" aria-live="polite" data-csv-result></p>'
    );
    if (!lab) return;
    const raw = [
      ['编号', '姓名', '分数'],
      ['00126', '王明', '88'],
      ['00127', '李华', '102']
    ];
    const state = { delimiter: 'comma', type: 'text', validation: 'stop' };
    function render() {
      const parsed = state.delimiter === 'comma' ? raw : raw.map(row => [row.join(',')]);
      const display = parsed.map((row, rowIndex) => row.map((value, columnIndex) => {
        if (state.delimiter === 'comma' && rowIndex > 0 && columnIndex === 0 && state.type === 'general') return String(Number(value));
        return value;
      }));
      $('[data-csv-output]', lab).innerHTML = '<table><thead><tr>' + display[0].map(value => '<th>' + value + '</th>').join('') + '</tr></thead><tbody>' + display.slice(1).map(row => '<tr>' + row.map((value, index) => '<td class="' + (state.delimiter === 'comma' && index === 2 && value === '102' ? 'v28-bad' : '') + '">' + value + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
      const result = $('[data-csv-result]', lab);
      if (state.delimiter !== 'comma') {
        result.className = 'v28-live warn';
        result.textContent = '分隔符选错后，每一行会停在一个单元格里。这不是“导入成功但类型不对”，而是拆列规则没有匹配。';
      } else {
        const idText = state.type === 'text' ? '编号按文本读取，00126 的前导 0 保留。' : '编号按常规读取，00126 会成为数值 126，前导 0 丢失。';
        const alertText = state.validation === 'stop' ? '停止：102 超过 0–100 时，常规手工输入会被阻止。' : state.validation === 'warning' ? '警告：系统提示风险，但用户仍可继续输入。' : '信息：只给出提示，用户仍可确认继续输入。';
        result.className = 'v28-live ' + (state.validation === 'stop' ? 'ok' : 'warn');
        result.textContent = idText + ' ' + alertText + ' 复制、填充、公式或宏带入非法值时，也不能只凭普通输入提示断定数据绝对合法。';
      }
      setActive(lab, 'data-csv-delimiter', state.delimiter);
      setActive(lab, 'data-csv-type', state.type);
      setActive(lab, 'data-validation', state.validation);
    }
    lab.addEventListener('click', event => {
      const delimiter = event.target.closest('[data-csv-delimiter]');
      const type = event.target.closest('[data-csv-type]');
      const validation = event.target.closest('[data-validation]');
      if (delimiter) state.delimiter = delimiter.dataset.csvDelimiter;
      if (type) state.type = type.dataset.csvType;
      if (validation) state.validation = validation.dataset.validation;
      if (delimiter || type || validation) render();
    });
    render();
  }

  function apply() {
    ensureStyle();
    lockLab();
    referenceLab();
    dataListLab();
    consolidateLab();
    pivotLab();
    importLab();
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else setTimeout(schedule, 80);
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();