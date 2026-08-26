(() => {
  'use strict';

  const DATA_2026 = [
    ['华东地区', 14200, '100%', 2450, 1580, 287],
    ['中南地区', 11800, '98.50%', 1860, 1240, 212],
    ['华北地区', 7600, '97.20%', 1280, 760, 135],
    ['西南地区', 6900, '95.80%', 820, 620, 108],
    ['东北地区', 4800, '92.30%', 450, 380, 76],
    ['西北地区', 4700, '91.70%', 140, 226, 62]
  ];

  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const formula = (s) => `<code class="formula-code">${esc(s).replace(/\$/g, '<b class="dollar">$</b>')}</code>`;
  const q = (sel, root=document) => root.querySelector(sel);
  const qa = (sel, root=document) => [...root.querySelectorAll(sel)];

  function afterLab(section, html, cls='exam-deep-dive') {
    if (!section || section.querySelector(`:scope > .${cls}`)) return null;
    const wrap = document.createElement('section');
    wrap.className = cls;
    wrap.innerHTML = html;
    section.appendChild(wrap);
    return wrap;
  }

  function sectionHeader(kicker, title, sub='') {
    return `<div class="exam-head"><span>${esc(kicker)}</span><h3>${esc(title)}</h3>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;
  }

  function miniTable(headers, rows, cls='') {
    return `<div class="exam-table-wrap ${cls}"><table class="exam-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function optionButtons(name, options) {
    return `<div class="exam-options" data-option-group="${esc(name)}">${options.map(([key,text])=>`<button type="button" data-key="${key}"><b>${key}</b><span>${text}</span></button>`).join('')}</div>`;
  }

  function bindSingleChoice(root, selector, correct, onPick) {
    const box = q(selector, root);
    if (!box) return;
    qa('button', box).forEach(btn => btn.addEventListener('click', () => {
      qa('button', box).forEach(b => b.classList.remove('picked','correct','wrong'));
      btn.classList.add('picked', btn.dataset.key === correct ? 'correct' : 'wrong');
      const right = q(`button[data-key="${correct}"]`, box);
      if (btn.dataset.key !== correct && right) right.classList.add('correct-outline');
      if (onPick) onPick(btn.dataset.key, btn.dataset.key === correct);
    }));
  }

  function round4Pct(n, d) {
    if (!d) return '—';
    return (Math.round((n/d) * 10000) / 10000 * 100).toFixed(2).replace(/\.00$/,'');
  }

  function wrongFillRows(mode) {
    const b = DATA_2026.map(r => r[1]);
    const total = b.reduce((a,c)=>a+c,0);
    return b.map((num, i) => {
      let value, denomLabel, f;
      if (mode === 'correct') {
        value = round4Pct(num, total);
        denomLabel = 'B$2:B$7';
        f = `=ROUND(B${i+2}/SUM(B$2:B$7),4)*100`;
      } else if (mode === 'D') {
        const denom = b.slice(i).reduce((a,c)=>a+c,0);
        value = round4Pct(num, denom);
        denomLabel = `$B${i+2}:$B${i+7}`;
        f = `=ROUND(B${i+2}/SUM($B${i+2}:$B${i+7}),4)*100`;
      } else if (mode === 'C') {
        const avg = total / b.length;
        const shifted = b[i+1] ?? 0;
        value = round4Pct(shifted, avg);
        denomLabel = '$B$2:$B$7 的平均值';
        f = `=ROUND(B${i+3}/AVERAGE($B$2:$B$7),4)*100`;
      } else {
        const denom = b.slice(i).reduce((a,c)=>a+c,0);
        value = round4Pct(num, denom);
        denomLabel = `B${i+2}:B${i+7}`;
        f = `=ROUND(B${i+2}/SUM(B${i+2}:B${i+7}),4)*100`;
      }
      return [DATA_2026[i][0], b[i], formula(f), formula(denomLabel), `<b class="${mode==='correct'?'ok-value':'bad-value'}">${value}%</b>`];
    });
  }

  function renderFillDemo(target, mode='wrong') {
    const rows = wrongFillRows(mode);
    target.innerHTML = miniTable(['区域','B列里程','填充后的公式','实际求和区域','G列结果'], rows, 'wide-table');
  }

  function addReferenceDeepDive() {
    const section = q('#excel-7');
    const root = afterLab(section, `
      ${sectionHeader('七年真题加深 · 高频主轴','公式与引用：三屏排错实验','2020、2022、2023、2024、2025、2026 均涉及引用锁定。重点不是“见到 $ 就锁”，而是判断复制方向上到底哪一维必须固定。')}
      <div class="screen-tabs" role="tablist">
        <button type="button" class="active" data-screen="ref1">① 地址怎么变</button>
        <button type="button" data-screen="ref2">② 2026 排错</button>
        <button type="button" data-screen="ref3">③ 2020 RANK</button>
      </div>
      <div class="screen-panel active" data-panel="ref1">
        <div class="reference-controls">
          <label>E1 固定系数 <input id="ref-e1" type="number" step="0.1" value="2"></label>
          <label>引用方式
            <select id="ref-mode">
              <option value="rel">A2 / E1：全部相对</option>
              <option value="abs">$A$2 / $E$1：全部绝对</option>
              <option value="row">A$2 / E$1：锁行</option>
              <option value="col">$A2 / $E1：锁列</option>
            </select>
          </label>
        </div>
        <div id="ref-grid"></div>
        <p class="exam-note"><b>观察：</b>向下填充只改变相对行号；向右填充只改变相对列标。$ 放在谁前面，就固定谁。</p>
      </div>
      <div class="screen-panel" data-panel="ref2">
        <div class="source-question">
          <h4>2026 年真题第 59—60 题</h4>
          ${miniTable(['区域','高铁运营里程','50万人口以上城市高铁覆盖率','350km/h线路里程','动车组','县域覆盖','运营里程占比'], DATA_2026.map((r,i)=>[...r, i===0?formula('=ROUND(B2/SUM(B2:B7),4)*100'):'']))}
          <p>G2 输入 ${formula('=ROUND(B2/SUM(B2:B7),4)*100')} 后向下填充到 G7，结果不正确。</p>
        </div>
        <h4 class="exam-subhead">第 59 题：可能产生问题的原因是？</h4>
        ${optionButtons('q59', [
          ['A','填充柄操作错误'],['B','单元格区域引用错误'],['C','函数选用和单元格区域引用都有错误'],['D','填充柄操作和单元格区域引用都有错误']
        ])}
        <div class="feedback" id="q59-feedback">先作答，再看填充后的真实结果。</div>
        <div id="wrong-fill-table"></div>
        <h4 class="exam-subhead">第 60 题：哪一种解决方案可行？</h4>
        ${optionButtons('q60', [
          ['A',`公式不变，按 Shift 键同时拖动 G2 填充柄向下重新填充`],
          ['B',`修改为 ${formula('=ROUND(B2/SUM(B$2:B$7),4)*100')} 并重新填充`],
          ['C',`修改为 ${formula('=ROUND(B3/AVERAGE($B$2:$B$7),4)*100')} 并重新填充`],
          ['D',`修改为 ${formula('=ROUND(B2/SUM($B2:$B7),4)*100')} 并双击填充柄`]
        ])}
        <div class="feedback" id="q60-feedback">重点比较 B 与 D：一个锁行，一个锁列。</div>
        <div id="solution-fill-table"></div>
        <div class="trap-compare">
          <div><span>正确 B</span>${formula('B$2:B$7')}<p>向下复制时行 2、7 不变；列本来就不会因“向下”而改变。</p></div>
          <div><span>陷阱 D</span>${formula('$B2:$B7')}<p>只锁了列 B；向下复制后仍会变成 ${formula('$B3:$B8')}、${formula('$B4:$B9')}。</p></div>
        </div>
      </div>
      <div class="screen-panel" data-panel="ref3">
        <h4>2020 年真题：名次为什么错？</h4>
        <ol class="rank-steps">
          <li>F3 输入 ${formula('=C3*0.2+D3*0.2+E3*0.6')}</li>
          <li>拖动 F3 填充柄至第 52 行</li>
          <li>G3 输入 ${formula('=RANK(F3,F3:F52)')}</li>
          <li>双击 G3 填充柄</li>
        </ol>
        ${optionButtons('rankstep', [['A','步骤 1'],['B','步骤 2'],['C','步骤 3'],['D','步骤 4']])}
        <div class="feedback" id="rank-feedback">先判断错在哪一步。</div>
        <div class="rank-lock-demo">
          <h4>修正后</h4>
          <p>官方公开参考答案：${formula('=RANK(F3,$F$3:$F$52)')}</p>
          <p>如果只考虑“向下填充”，${formula('=RANK(F3,F$3:F$52)')} 也能保持排行区域的行号 3—52 不变；但 ${formula('=RANK(F3,F3:F$52)')} <b>不成立</b>，复制到下一行会变成 ${formula('=RANK(F4,F4:F$52)')}，排行区域从顶部不断缩小。</p>
          ${miniTable(['所在行','错误的第二参数','问题'], [
            ['G3',formula('F3:F$52'),'看似正常'],['G4',formula('F4:F$52'),'F3 已被排除'],['G5',formula('F5:F$52'),'F3、F4 都被排除']
          ])}
        </div>
        <div class="same-core"><b>把 2020 和 2026 放在一起：</b>两题都不是“背 $ 的位置”，而是先问：<strong>复制时哪个范围应该保持不变？</strong> 然后只锁住会沿复制方向漂移的维度。</div>
      </div>
      <div class="memory-line supplement-memory"><span>一条线记住</span><strong>复制公式前先判定“谁应该跟着走、谁应该固定”；向下复制重点看行号，向右复制重点看列标。</strong></div>
    `, 'reference-deep-dive');
    if (!root) return;

    qa('.screen-tabs button', root).forEach(btn => btn.addEventListener('click', () => {
      qa('.screen-tabs button', root).forEach(b=>b.classList.toggle('active', b===btn));
      qa('.screen-panel', root).forEach(p=>p.classList.toggle('active', p.dataset.panel===btn.dataset.screen));
    }));

    const e1 = q('#ref-e1', root), mode = q('#ref-mode', root), grid = q('#ref-grid', root);
    function renderRefGrid() {
      const val = Number(e1.value || 0);
      const refs = {
        rel: ['A2','E1'], abs:['$A$2','$E$1'], row:['A$2','E$1'], col:['$A2','$E1']
      }[mode.value];
      const startFormula = `=${refs[0]}*${refs[1]}`;
      const shiftRef = (ref, dr, dc) => ref.replace(/(\$?)([A-Z]+)(\$?)(\d+)/g, (_,ca,col,ra,row) => {
        const colNum = col.charCodeAt(0)-65 + (ca?0:dc);
        const newCol = String.fromCharCode(65+Math.max(0,colNum));
        const newRow = Number(row)+(ra?0:dr);
        return `${ca}${newCol}${ra}${newRow}`;
      });
      const rows = [];
      for (let dr=0; dr<3; dr++) {
        const r=[];
        for (let dc=0; dc<3; dc++) {
          const f = `=${shiftRef(refs[0],dr,dc)}*${shiftRef(refs[1],dr,dc)}`;
          r.push(`<div class="ref-cell"><span>${String.fromCharCode(67+dc)}${2+dr}</span>${formula(f)}<small>E1=${val}</small></div>`);
        }
        rows.push(r.join(''));
      }
      grid.innerHTML = `<div class="e1-visible"><span>E1</span><strong>${val}</strong><small>现在能看见并修改被引用的固定系数</small></div><p>从 C2 输入 ${formula(startFormula)}，然后向右、向下填充：</p><div class="ref-fill-grid">${rows.flat().join('')}</div>`;
    }
    e1.addEventListener('input', renderRefGrid); mode.addEventListener('change', renderRefGrid); renderRefGrid();

    renderFillDemo(q('#wrong-fill-table', root), 'wrong');
    bindSingleChoice(root, '[data-option-group="q59"]', 'B', (key, ok) => {
      q('#q59-feedback', root).innerHTML = ok ? '<b>正确。</b> ROUND 与填充柄都没有问题，错在 SUM 的区域是相对引用，向下填充后整体下移。' : '<b>再看表格。</b> 错误从第二行开始呈规律性变化，说明公式中的引用在复制时发生了位移。';
    });
    bindSingleChoice(root, '[data-option-group="q60"]', 'B', (key, ok) => {
      const modeMap = {A:'wrong',B:'correct',C:'C',D:'D'};
      renderFillDemo(q('#solution-fill-table', root), modeMap[key]);
      q('#q60-feedback', root).innerHTML = ok ? `<b>正确。</b> ${formula('B$2:B$7')} 固定的是行号，正好抵消向下填充造成的行漂移。` : key==='D' ? `<b>D 仍然错。</b> ${formula('$B2:$B7')} 只锁列，向下填充时行号照样漂移。` : '<b>不成立。</b> 观察下面实际渲染出的结果与公式变化。';
    });
    bindSingleChoice(root, '[data-option-group="rankstep"]', 'C', (key, ok) => {
      q('#rank-feedback', root).innerHTML = ok ? `<b>正确。</b> RANK 的排行参照范围应保持固定。` : '重新观察第 3 步的第二参数：它会在填充时移动。';
    });
  }

  function addFunctionsDeepDive() {
    const section = q('#excel-8');
    const root = afterLab(section, `
      ${sectionHeader('七年真题加深','函数专题：查找、条件与文本连接','保留上面的 15 个函数切换；这里专门处理真题里反复出现的组合公式。')}
      <div class="topic-grid">
        <article class="topic-card">
          <span>VLOOKUP · 七年 5 次</span>
          <h4>查找表在另一张工作表，也要先想“复制时它能不能动”</h4>
          <p>跨表引用：${formula('档案!$A$1:$C$1012')}</p>
          <div class="lookup-demo">
            <button type="button" data-lookup-lock="off">不锁查找区域</button>
            <button type="button" data-lookup-lock="on" class="active">锁定查找区域</button>
            <div id="lookup-output"></div>
          </div>
          <p>真题原型：${formula('=IF(G3>=20,0.95,1)*VLOOKUP(E3,产品编号对照!$A$3:$C$19,3,0)')}</p>
          <p class="exam-note">不是 VLOOKUP 语法强制绝对引用；而是当公式向下/向右复制且查找表必须保持不动时，应锁住会漂移的行列。</p>
        </article>
        <article class="topic-card">
          <span>条件函数组</span>
          <h4>先认清“条件区域”和“计算区域”</h4>
          <p>${formula('=SUMIF(E2:E12,"*北斗*",C2:C12)')}</p>
          <div class="wildcard-demo"><code>北斗一号　新北斗系统　北斗导航　GPS</code><strong>“*北斗*” → 匹配前三项</strong><small>* 表示任意多个字符；精确条件 "北斗" 不等于“包含北斗”。</small></div>
          <p>${formula('AVERAGEIF(条件区域, 条件, 平均区域)')}</p>
          <p>${formula('SUMIFS(求和区域, 条件区域1, 条件1, …)')}</p>
          <p>${formula('COUNTIF(条件区域, 条件)')}</p>
        </article>
        <article class="topic-card">
          <span>& 连接符 · 七年 3 次</span>
          <h4>把文本拼起来用 &，不是 +</h4>
          <div class="formula-stack">
            ${formula('=MONTH(B3)&"月"')}
            ${formula('=RIGHT(LEFT(A2,8),2)&"班"')}
            ${formula('=LEFT(D2,7)&"****"')}
          </div>
          <button type="button" id="concat-plus">试着把 & 换成 +</button>
          <div class="feedback" id="concat-feedback">+ 是算术运算符；当参与项含“月”“班”等文本时会产生 #VALUE!。</div>
        </article>
      </div>
      <div class="memory-line supplement-memory"><span>一条线记住</span><strong>函数题先定参数角色：查找表是否固定、条件区域在哪、计算区域在哪；文本拼接用 &。</strong></div>
    `, 'functions-deep-dive');
    if (!root) return;

    const output = q('#lookup-output', root);
    function renderLookup(lock=true) {
      output.innerHTML = miniTable(['填充到','查找区域','结果'], [0,1,2,3].map(i => {
        const ref = lock ? '$A$3:$C$19' : `A${3+i}:C${19+i}`;
        return [`H${3+i}`, formula(`产品编号对照!${ref}`), lock?'<b class="ok-value">保持同一张对照表</b>':'<b class="bad-value">区域逐行下移</b>'];
      }));
    }
    qa('[data-lookup-lock]', root).forEach(btn=>btn.addEventListener('click',()=>{
      qa('[data-lookup-lock]', root).forEach(b=>b.classList.toggle('active',b===btn));
      renderLookup(btn.dataset.lookupLock==='on');
    }));
    renderLookup(true);
    q('#concat-plus', root).addEventListener('click',()=>{
      q('#concat-feedback', root).innerHTML = `<b class="bad-value">#VALUE!</b>　${formula('=MONTH(B3)+"月"')} 会把 + 当作加法，而“月”不是可相加数值。`;
    });
  }

  function addTextNumberAndPaste() {
    const section = q('#excel-5');
    const root = afterLab(section, `
      ${sectionHeader('真题加深','文本型数字：看起来像数字，不等于真的数值','2025、2026 连续考。最危险的是“改成数值格式”看起来像修好了，数据类型却没变。')}
      <div class="textnum-grid">
        <article class="topic-card">
          <span>排错型</span>
          <h4>为什么这一列求和明显偏小？</h4>
          <div id="textnum-cells" class="textnum-cells"></div>
          <div class="sum-result">SUM 结果：<strong id="textnum-sum">0</strong></div>
          <div class="fix-buttons">
            <button type="button" data-fix="format">设置单元格格式 → 数值</button>
            <button type="button" data-fix="warning">叹号 → 转换为数字</button>
            <button type="button" data-fix="columns">分列</button>
            <button type="button" data-fix="multiply">选择性粘贴 → 乘 1</button>
          </div>
          <div class="feedback" id="textnum-feedback"></div>
          <p class="exam-note">设置“数值”格式主要改变显示格式，不会自动把已存储为文本的数字转换成数值。</p>
        </article>
        <article class="topic-card">
          <span>AVERAGEIF 排错</span>
          <h4>参数顺序正确，也可能算错</h4>
          <p>${formula('=AVERAGEIF(C3:C602,H5,D3:D602)')}</p>
          <p>如果 D 列混有文本型数字，符合条件的这些文本项不会像正常数值一样参与平均，结果就会偏离真实平均值。</p>
          <div class="type-strip"><span>92</span><span class="as-text">'88</span><span>76</span><span class="as-text">'95</span></div>
        </article>
      </div>
      <article class="topic-card paste-special-card">
        <span>选择性粘贴 · 七年 2 次</span>
        <h4>值、乘、批注：一次把“粘什么”和“怎么算”分清</h4>
        <div class="paste-tabs">
          <button type="button" class="active" data-paste="value">粘贴值</button>
          <button type="button" data-paste="multiply">粘贴 → 乘</button>
          <button type="button" data-paste="comment">粘贴批注</button>
        </div>
        <div id="paste-demo"></div>
        <div class="step-sorter">
          <h4>步骤排序型：基本工资批量增加 15%</h4>
          <p>点候选步骤，组成正确顺序；多余步骤不要选。</p>
          <div id="step-pool" class="step-pool"></div>
          <div id="step-answer" class="step-answer"><span>你的顺序：</span></div>
          <div class="sort-actions"><button type="button" id="step-undo">撤回</button><button type="button" id="step-reset">重置</button><button type="button" id="step-check">检查</button></div>
          <div class="feedback" id="step-feedback"></div>
        </div>
      </article>
      <div class="memory-line supplement-memory"><span>一条线记住</span><strong>格式不等于类型；文本数字要先“转换为数字”。选择性粘贴既能只粘属性，也能对目标区域执行乘法等运算。</strong></div>
    `, 'textnum-deep-dive');
    if (!root) return;

    let state = [1200,'1500',1800,'2100'];
    function renderTextNums(converted=false) {
      const box = q('#textnum-cells', root);
      box.innerHTML = state.map((v,i)=>`<div class="${typeof v==='string'&&!converted?'text-cell':'number-cell'}"><small>B${i+2}</small><strong>${v}</strong><em>${typeof v==='string'&&!converted?'文本':'数值'}</em></div>`).join('');
      const sum = converted ? state.reduce((a,v)=>a+Number(v),0) : state.reduce((a,v)=>a+(typeof v==='number'?v:0),0);
      q('#textnum-sum', root).textContent = sum;
    }
    renderTextNums(false);
    qa('[data-fix]', root).forEach(btn=>btn.addEventListener('click',()=>{
      const f=btn.dataset.fix;
      if (f==='format') {
        renderTextNums(false);
        q('#textnum-feedback', root).innerHTML='<b class="bad-value">仍未转换。</b> 外观可以显示成“数值”，但原先存储为文本的内容仍是文本。';
      } else {
        renderTextNums(true);
        q('#textnum-feedback', root).innerHTML=`<b class="ok-value">转换成功。</b> ${f==='warning'?'“转换为数字”':f==='columns'?'“分列”在常规识别下会把数字文本转为数值':'与 1 相乘会强制数值化'}。`;
      }
    }));

    const pasteDemo=q('#paste-demo',root);
    function renderPaste(type){
      if(type==='value') pasteDemo.innerHTML=`<div class="paste-scene"><div>${formula('=A2*B2')}<small>源单元格公式</small></div><b>→</b><div><strong>2400</strong><small>只粘计算后的值，不粘公式</small></div></div>`;
      if(type==='multiply') pasteDemo.innerHTML=`<div class="salary-row"><span>4000</span><span>5200</span><span>6800</span></div><div class="paste-arrow">复制 1.15 → 选择性粘贴「乘」</div><div class="salary-row raised"><span>4600</span><span>5980</span><span>7820</span></div>`;
      if(type==='comment') pasteDemo.innerHTML=`<div class="paste-scene"><div class="comment-source">A2<i></i><small>批注：需复核</small></div><b>→</b><div class="comment-source">D2<i></i><small>只复制批注，不替换 D2 的值</small></div></div>`;
    }
    qa('[data-paste]',root).forEach(btn=>btn.addEventListener('click',()=>{qa('[data-paste]',root).forEach(b=>b.classList.toggle('active',b===btn));renderPaste(btn.dataset.paste);}));
    renderPaste('value');

    const steps=[
      ['A','在空白单元格输入 1.15'],['B','复制该单元格'],['C','选中基本工资区域'],['D','打开选择性粘贴'],['E','在“运算”中选择“乘”并确定'],['X','把工资区域设置为百分比格式'],['Y','先对工资列进行降序排序']
    ];
    const correct=['A','B','C','D','E']; let picked=[];
    function drawSteps(){
      q('#step-pool',root).innerHTML=steps.map(([k,t])=>`<button type="button" data-step="${k}" ${picked.includes(k)?'disabled':''}><b>${k}</b>${t}</button>`).join('');
      q('#step-answer',root).innerHTML='<span>你的顺序：</span>'+picked.map(k=>`<b>${k}</b>`).join('<i>→</i>');
      qa('[data-step]',root).forEach(b=>b.addEventListener('click',()=>{picked.push(b.dataset.step);drawSteps();}));
    }
    q('#step-undo',root).addEventListener('click',()=>{picked.pop();drawSteps();});
    q('#step-reset',root).addEventListener('click',()=>{picked=[];drawSteps();q('#step-feedback',root).textContent='';});
    q('#step-check',root).addEventListener('click',()=>{
      const ok=JSON.stringify(picked)===JSON.stringify(correct);
      q('#step-feedback',root).innerHTML=ok?'<b class="ok-value">顺序正确。</b> 1.15 是倍率，选择性粘贴“乘”会直接改写选中工资值。':'<b class="bad-value">还不对。</b> 必要步骤是 A → B → C → D → E；X、Y 都是干扰项。';
    }); drawSteps();
  }

  function addChartDeepDive() {
    const section=q('#excel-20');
    const root=afterLab(section, `
      ${sectionHeader('真题加深','图表为什么会“变形”','图表不是静态图片：它引用源区域。排序会改变源区域的记录顺序；行列含义颠倒时用“切换行/列”。')}
      <div class="chart-error-grid">
        <article class="topic-card">
          <span>排错 1 · 排序联动</span><h4>先插图，再排序数据</h4>
          <div class="chart-source" id="chart-source"></div>
          <button type="button" id="chart-sort">对源数据按销售额降序</button>
          <div class="mini-bars" id="chart-bars"></div>
          <p class="exam-note">图表系列引用的是单元格区域；区域中的类别和值发生重排，图表会同步重新绘制。</p>
        </article>
        <article class="topic-card">
          <span>排错 2 · 行列颠倒</span><h4>同一数据源，两种系列解释</h4>
          <button type="button" id="switch-rowcol">切换行/列</button>
          <div id="rowcol-view"></div>
        </article>
      </div>
      <div class="memory-line supplement-memory"><span>一条线记住</span><strong>图表跟着源数据走；顺序变了图就变，系列/类别反了优先检查“切换行/列”。</strong></div>
    `,'chart-deep-dive');
    if(!root)return;
    let rows=[['一班',82],['二班',91],['三班',76],['四班',88]];
    function drawChart(){
      q('#chart-source',root).innerHTML=miniTable(['班级','平均分'],rows);
      q('#chart-bars',root).innerHTML=rows.map(([n,v])=>`<div><i style="height:${v}%"></i><span>${n}<small>${v}</small></span></div>`).join('');
    }
    q('#chart-sort',root).addEventListener('click',()=>{rows=[...rows].sort((a,b)=>b[1]-a[1]);drawChart();});drawChart();
    let switched=false;
    function drawRowCol(){
      q('#rowcol-view',root).innerHTML=switched?
        `<div class="series-view"><strong>按课程为系列</strong><span>数学：一班→四班</span><span>英语：一班→四班</span><span>计算机：一班→四班</span></div>`:
        `<div class="series-view warn"><strong>当前按班级为系列</strong><span>一班：数学/英语/计算机</span><span>二班：数学/英语/计算机</span><small>若题目要“同一课程比较不同班级”，这个方向就反了。</small></div>`;
    }
    q('#switch-rowcol',root).addEventListener('click',()=>{switched=!switched;drawRowCol();});drawRowCol();
  }

  function addSubtotalCount() {
    const section=q('#excel-14');
    const root=afterLab(section, `
      ${sectionHeader('真题加深','分类汇总：汇总方式也要选对','“先排序”只是第一关；还要根据题目问的是金额、平均值还是人数选择汇总方式。')}
      <div class="subtotal-methods">
        <button type="button" data-method="sum">求和</button><button type="button" data-method="count">计数</button><button type="button" data-method="average">平均值</button>
      </div>
      <p>题目：统计每个班级符合条件的<strong>人数</strong>。</p>
      <div id="subtotal-method-result" class="feedback">请选择汇总方式。</div>
      <div class="memory-line supplement-memory"><span>一条线记住</span><strong>分类汇总 = 先按分类字段排序 + 选分类字段 + 选汇总方式 + 选汇总项；问人数通常选“计数”。</strong></div>
    `,'subtotal-deep-dive');
    if(!root)return;
    qa('[data-method]',root).forEach(btn=>btn.addEventListener('click',()=>{
      qa('[data-method]',root).forEach(b=>b.classList.toggle('active',b===btn));
      const ok=btn.dataset.method==='count';
      q('#subtotal-method-result',root).innerHTML=ok?'<b class="ok-value">正确：计数。</b> “人数”是记录条数，不是把姓名、学号或成绩相加。':'<b class="bad-value">不对。</b> 题目问“人数”，核心是统计记录个数。';
    }));
  }

  function addDeleteAndProtectNotes() {
    const s4=q('#excel-4');
    const r4=afterLab(s4, `${sectionHeader('补充易混','删除 ≠ 隐藏','隐藏可重新显示；删除会移除工作表及其中内容。')}<div class="delete-hide-demo"><button type="button" data-sheet-act="hide">隐藏“二月”</button><button type="button" data-sheet-act="delete">删除“二月”</button><div id="delete-hide-state">一月　<span>二月</span>　汇总</div></div>`,'delete-hide-supplement');
    if(r4){qa('[data-sheet-act]',r4).forEach(b=>b.addEventListener('click',()=>{q('#delete-hide-state',r4).innerHTML=b.dataset.sheetAct==='hide'?'一月　<em>（二月已隐藏，可重新显示）</em>　汇总':'一月　<del>二月已删除</del>　汇总';}));}
    const s6=q('#excel-6');
    const r6=afterLab(s6, `${sectionHeader('补充易混','锁定属性要配合“保护工作表”','单元格默认具有“锁定”属性，但只有保护工作表后，锁定才真正限制编辑。')}<div class="protect-demo"><button type="button" id="toggle-lock">A2：已锁定</button><button type="button" id="toggle-protect">工作表：未保护</button><strong id="protect-result">A2 仍可编辑</strong></div>`,'protect-supplement');
    if(r6){let locked=true,protectedSheet=false;const render=()=>{q('#toggle-lock',r6).textContent=`A2：${locked?'已锁定':'未锁定'}`;q('#toggle-protect',r6).textContent=`工作表：${protectedSheet?'已保护':'未保护'}`;q('#protect-result',r6).textContent=protectedSheet&&locked?'A2 现在不可编辑':'A2 仍可编辑';};q('#toggle-lock',r6).onclick=()=>{locked=!locked;render();};q('#toggle-protect',r6).onclick=()=>{protectedSheet=!protectedSheet;render();};render();}
  }

  function binaryToHex(bin) {
    const clean=bin.trim().replace(/[₂bB]/g,'');
    if(!/^[01]+(?:\.[01]+)?$/.test(clean)) return null;
    const [intPart,fracPart='']=clean.split('.');
    const intPad=intPart.padStart(Math.ceil(intPart.length/4)*4,'0');
    const fracPad=fracPart.padEnd(Math.ceil(fracPart.length/4)*4,'0');
    const map=s=>s.match(/.{4}/g)?.map(g=>parseInt(g,2).toString(16).toUpperCase()).join('')||'';
    const ih=map(intPad).replace(/^0+(?=.)/,'')||'0';
    const fh=fracPad?map(fracPad).replace(/0+$/,''):'';
    return {hex:fh?`${ih}.${fh}`:ih,intPad,fracPad};
  }

  function addBinaryDecimal() {
    const section=q('#concept-9');
    const root=afterLab(section, `
      ${sectionHeader('填空题加深 · 2023—2026 连考','数制转换补上小数部分','示例：11.11₂ = 3.C₁₆。二进制转十六进制最稳的方法是以小数点为界，两侧分别每 4 位一组。')}
      <label class="number-input-label">手写式输入二进制（支持小数点）</label>
      <input id="binary-fraction-input" class="number-input" inputmode="decimal" value="11.11" placeholder="例如 11.11">
      <div id="binary-fraction-result"></div>
      <div class="method-clarify"><b>别混算法：</b><span>十进制小数 → 二进制：乘 2 取整；十进制小数 → 十六进制：乘 16 取整；二进制小数 → 十六进制：每 4 位分组最直接。</span></div>
      <div class="memory-line supplement-memory"><span>一条线记住</span><strong>二 ↔ 八按 3 位分组，二 ↔ 十六按 4 位分组；小数点左右分别分组，不足位补 0。</strong></div>
    `,'binary-fraction-deep-dive');
    if(!root)return;
    const input=q('#binary-fraction-input',root),out=q('#binary-fraction-result',root);
    function render(){const r=binaryToHex(input.value);if(!r){out.innerHTML='<p class="input-error">只能输入 0、1 和一个小数点。</p>';return;}const left=r.intPad.match(/.{4}/g)||[],right=r.fracPad.match(/.{4}/g)||[];out.innerHTML=`<div class="group-convert"><span>${left.join('　')} ${right.length?'. '+right.join('　'):''}</span><b>↓ 每 4 位对应 1 个十六进制位</b><strong>${r.hex}<sub>16</sub></strong></div>${input.value==='11.11'?'<p class="exam-note">11.11₂ → 0011.1100₂ → 3.C₁₆</p>':''}`;}
    input.addEventListener('input',render);render();
  }

  function addHanEncoding() {
    const section=q('#concept-10');
    if(!section)return;
    afterLab(section, `
      ${sectionHeader('真题加深','汉字编码：输入、交换、机内、字形四层不要混','现有页面已经有四层框架；这里补上真题常考的“谁负责什么”和字形码分类。')}
      <div class="encoding-map">
        <div><b>输入码（外码）</b><span>方便键盘输入汉字，如拼音、五笔等</span></div>
        <div><b>国标码 / 交换码</b><span>用于信息交换的标准编码</span></div>
        <div><b>机内码</b><span>计算机内部存储和处理汉字时使用</span></div>
        <div><b>字形码</b><span>决定显示/打印形状；点阵码、矢量码都属于字形表示</span></div>
      </div>
      <div class="encoding-quiz">
        <p>下列哪些编码能够表示汉字？</p>
        <button type="button" data-enc="ascii">ASCII</button><button type="button" data-enc="gb">GB18030</button><button type="button" data-enc="utf8">UTF-8</button><button type="button" data-enc="utf32">UTF-32</button>
        <div id="encoding-feedback" class="feedback">点击判断。</div>
      </div>
      <p class="exam-note">应试口径：ASCII 不用于汉字编码；GB18030 能编码汉字。UTF-8/UTF-32 是 Unicode 编码形式，可表示包括汉字在内的 Unicode 字符。</p>
      <div class="memory-line supplement-memory"><span>一条线记住</span><strong>输入码管“怎么输入”，交换码管“怎么交换”，机内码管“怎么存和算”，字形码管“怎么显示和打印”。</strong></div>
    `,'han-encoding-deep-dive');
    const root=q('.han-encoding-deep-dive',section);if(!root)return;
    qa('[data-enc]',root).forEach(b=>b.addEventListener('click',()=>{const ascii=b.dataset.enc==='ascii';b.classList.toggle(ascii?'wrong':'correct');q('#encoding-feedback',root).innerHTML=ascii?'<b class="bad-value">ASCII：不是汉字编码。</b> 标准 ASCII 主要编码英文字母、数字、控制字符等。':'<b class="ok-value">可以表示汉字。</b>'; }));
  }

  function addEniacTrap() {
    const section=q('#concept-5');
    afterLab(section, `
      ${sectionHeader('高频陷阱','ENIAC ≠ 冯·诺依曼存储程序机','2025 真题把“第一代/电子管”和“二进制/存储程序”放在一起混淆。')}
      <div class="eniac-compare">
        <div class="truth"><span>ENIAC 正确</span><b>第一代计算机</b><b>主要电子元件：电子管</b></div>
        <div class="false"><span>ENIAC 错误归因</span><b>“以二进制为运算基础” ✕</b><b>“采用存储程序工作原理” ✕</b></div>
      </div>
      <p class="exam-note">ENIAC 的主要算术运算采用十进制；“二进制 + 存储程序 + 程序控制”是冯·诺依曼体系结构的核心思想，不能倒贴到 ENIAC 身上。</p>
      <div class="memory-line supplement-memory"><span>一条线记住</span><strong>ENIAC：电子管、第一代、十进制、非典型存储程序机；冯·诺依曼：二进制、存储程序、程序控制。</strong></div>
    `,'eniac-deep-dive');
  }

  function addMultimedia() {
    if(q('#concept-16')) return;
    const footer=q('main:not(.excel-page) .footer');
    if(!footer)return;
    const article=document.createElement('article');
    article.className='concept section-shell multimedia-concept';article.id='concept-16';
    article.innerHTML=`
      <div class="concept-index" aria-hidden="true">16</div>
      <div class="concept-copy"><p class="kicker">16 · 多媒体技术</p><h2>文本也属于多媒体元素；声音和图像的“采样/位深/压缩”决定数据量与质量</h2><div class="note-body"><p><strong>多媒体元素</strong>包括文本、图形、图像、音频、视频和动画。多媒体技术常见特点是集成性、交互性、实时性和多样性。</p><p>音频数字化涉及采样；图像文件大小与像素数量、颜色深度及压缩方式有关。</p></div><div class="memory-line"><span>一条线记住</span><strong>多媒体不是“只有音视频”：文本也算；采样越密数据越多，位深越高通常数据量越大。</strong></div></div>
      <section class="lab-card tone-blue multimedia-lab">
        <div class="lab-heading"><span class="lab-dot"></span><div><p>操作观察 · 16</p><h3>三组真题交互</h3></div></div>
        <div class="screen-tabs multimedia-tabs"><button type="button" class="active" data-mm="elements">媒体元素</button><button type="button" data-mm="audio">音频采样</button><button type="button" data-mm="image">图像与格式</button></div>
        <div class="mm-panel active" data-mm-panel="elements">
          <p>点出所有多媒体元素：</p><div class="media-checks">${['文本','图形','图像','音频','视频','动画','硬盘','U盘'].map(x=>`<button type="button" data-media="${x}">${x}</button>`).join('')}</div>
          <div class="feature-chips"><b>集成性</b><b>交互性</b><b>实时性</b><b>多样性</b><s>单一性</s></div>
        </div>
        <div class="mm-panel" data-mm-panel="audio">
          <label class="slider-label">采样频率 <span id="sample-rate">44.1 kHz</span></label><input id="sample-slider" class="range" type="range" min="8" max="96" step="4" value="44"><div class="sample-bars" id="sample-bars"></div><p class="exam-note">在采样位数、声道数和时长相同的前提下，采样频率越高，单位时间采样点越多，原始数据量越大。</p>
        </div>
        <div class="mm-panel" data-mm-panel="image">
          <div class="depth-control"><label>颜色深度 <select id="depth-select"><option>8 bit</option><option selected>24 bit</option><option>32 bit</option></select></label><strong id="depth-size">24 bit：每像素信息更多</strong></div>
          <div class="vector-bitmap"><div><b>图形（考试教材常指矢量图）</b><span class="vector-shape">A</span><small>按几何描述缩放，通常不失真</small></div><div><b>图像（考试教材常指位图）</b><span class="bitmap-shape">A</span><small>按像素记录，放大可见像素/失真</small></div></div>
          ${miniTable(['格式','应试归类','备注'], [['MP3','有损音频压缩','常用于音乐'],['JPEG','有损图像压缩','适合照片'],['PNG','无损图像压缩','支持透明'],['WAV','通常按未压缩 PCM 音频掌握','技术上 WAV 是容器，可承载不同编码']])}
        </div>
      </section>`;
    footer.before(article);

    const heroStat=q('main:not(.excel-page) .hero-stats strong');if(heroStat&&heroStat.textContent.trim()==='15')heroStat.textContent='16';
    const cat=q('main:not(.excel-page) #catalogue .catalogue-strip');if(cat&&!cat.querySelector('a[href="#concept-16"]')){const a=document.createElement('a');a.href='#concept-16';a.setAttribute('role','listitem');a.innerHTML='<span>16</span>多媒体技术';cat.appendChild(a);}
    const chip=q('main:not(.excel-page) #catalogue .number-chip');if(chip)chip.textContent='01—16';
    qa('[data-mm]',article).forEach(b=>b.addEventListener('click',()=>{qa('[data-mm]',article).forEach(x=>x.classList.toggle('active',x===b));qa('[data-mm-panel]',article).forEach(p=>p.classList.toggle('active',p.dataset.mmPanel===b.dataset.mm));}));
    const valid=new Set(['文本','图形','图像','音频','视频','动画']);qa('[data-media]',article).forEach(b=>b.addEventListener('click',()=>b.classList.toggle(valid.has(b.dataset.media)?'correct':'wrong')));
    const slider=q('#sample-slider',article),rate=q('#sample-rate',article),bars=q('#sample-bars',article);function drawSample(){const v=Number(slider.value);rate.textContent=`${v} kHz`;bars.innerHTML=Array.from({length:Math.max(4,Math.round(v/4))},(_,i)=>`<i style="height:${20+(i%5)*12}%"></i>`).join('');}slider.addEventListener('input',drawSample);drawSample();
    const depth=q('#depth-select',article),size=q('#depth-size',article);depth.addEventListener('change',()=>{size.textContent=`${depth.value}：颜色信息越多，同尺寸未压缩图像的数据量通常越大`;});
  }

  function patchMergeArithmetic() {
    const section=q('#excel-15'); if(!section)return;
    const fix=()=>qa('strong',section).forEach(el=>{if(el.textContent.includes('第 1 行 2770')||el.textContent.includes('第 2 行 2940'))el.textContent='第 1 行 2870 · 第 2 行 2840';});
    fix(); new MutationObserver(fix).observe(section,{subtree:true,childList:true,characterData:true});
  }

  function init() {
    addReferenceDeepDive();
    addFunctionsDeepDive();
    addTextNumberAndPaste();
    addChartDeepDive();
    addSubtotalCount();
    addDeleteAndProtectNotes();
    addBinaryDecimal();
    addHanEncoding();
    addEniacTrap();
    addMultimedia();
    patchMergeArithmetic();
  }

  function waitForApp(attempt=0) {
    if (q('#concept-9') && q('#excel-7')) return init();
    if (attempt < 80) setTimeout(()=>waitForApp(attempt+1), 75);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',()=>waitForApp());
  else waitForApp();
})();
