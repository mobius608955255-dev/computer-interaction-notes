(() => {
  'use strict';

  const data = window.NOTES;
  const simulation = window.NOTE_SIMULATIONS;
  const chapterNumber = Number(document.body.dataset.chapter);
  const chapter = data.chapters.find(item => item.number === chapterNumber);
  const notes = data.notes.filter(item => item.chapter === chapterNumber);
  const sourceCount = notes.reduce((sum, note) => sum + note.sources.length, 0);
  const version = 15;
  const chapterUrl = number => `./chapter${number}.html?v=${version}`;
  const homeUrl = `./index.html?v=${version}`;
  const appNames = {1:'原理实验室',2:'Windows 10',3:'Word 2016',4:'Excel 2016',5:'PowerPoint 2016',6:'网络实验室',7:'多媒体工作台',8:'安全控制台',9:'前沿技术沙盘',10:'数据库实验室',11:'算法运行器'};

  document.body.insertAdjacentHTML('afterbegin', `
    <a class="skip-link" href="#main-content">跳到正文</a>
    <header class="site-header">
      <a class="brand" href="${homeUrl}"><span class="brand-mark">11</span><span class="brand-copy"><strong>计算机系统笔记</strong><small id="brand-chapter"></small></span></a>
      <div class="header-actions">
        <label class="chapter-select-wrap"><span class="sr-only">切换章节</span><select id="chapter-select" aria-label="切换章节"></select></label>
        <button id="open-drawer" type="button">本章目录</button>
      </div>
    </header>
    <div class="progress" aria-hidden="true"><i id="progress-bar"></i></div>
    <aside class="drawer" id="drawer" aria-label="本章知识点目录">
      <div class="drawer-head"><div><small id="drawer-chapter"></small><strong>本章目录</strong></div><button id="close-drawer" type="button" aria-label="关闭目录">×</button></div>
      <ol class="note-list" id="note-list"></ol>
    </aside>
    <button class="scrim" id="scrim" type="button" aria-label="关闭目录"></button>
    <main id="main-content">
      <section class="chapter-intro" id="chapter-top">
        <p class="chapter-kicker" id="chapter-kicker"></p><h1 id="chapter-title"></h1><p class="chapter-summary" id="chapter-summary"></p>
        <div class="chapter-meta"><span id="chapter-count"></span><span id="source-count"></span></div>
      </section>
      <section class="chapter-tools" aria-label="搜索本章笔记"><div class="search"><span aria-hidden="true">⌕</span><label class="sr-only" for="search-input">搜索本章</label><input id="search-input" type="search" placeholder="搜索本章知识点" autocomplete="off"></div><span class="count" id="result-count"></span></section>
      <div id="notes-root"></div>
    </main>
    <footer class="site-footer"><a href="${homeUrl}">全部章节</a><a href="https://www.sdzk.cn/NewsInfo.aspx?BCID=1195&amp;CID=1133&amp;NewsID=7081" target="_blank" rel="noreferrer">现行考试要求</a></footer>`);

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  if (!chapter || !simulation) return;

  document.title = `第${chapter.number}章 ${chapter.title}｜计算机系统笔记`;
  $('#brand-chapter').textContent = `第${chapter.number}章 · 真题来源笔记`;
  $('#chapter-kicker').textContent = `教材第${chapter.number}章 · 真题来源笔记`;
  $('#chapter-title').textContent = chapter.title;
  $('#chapter-summary').textContent = chapter.summary;
  $('#chapter-count').textContent = `${notes.length}条知识笔记`;
  $('#source-count').textContent = `${sourceCount}道真题来源`;
  $('#result-count').textContent = `${notes.length}条笔记`;
  $('#drawer-chapter').textContent = `第${chapter.number}章 · ${chapter.title}`;

  const grouped = chapter.sections.map(section => ({...section, notes: notes.filter(note => note.section === section.id)})).filter(section => section.notes.length);
  $('#notes-root').innerHTML = grouped.map(section => `
    <section class="section-block" id="section-${section.id.replace('.', '-')}">
      <header class="section-head"><p>${section.id}</p><h2>${section.title}</h2></header>
      ${section.notes.map(renderNote).join('')}
    </section>`).join('');

  $('#chapter-select').innerHTML = data.chapters.map(item => `<option value="${item.number}" ${item.number === chapterNumber ? 'selected' : ''}>第${item.number}章　${item.title}</option>`).join('');
  $('#chapter-select').addEventListener('change', event => { location.href = chapterUrl(event.target.value); });
  $('#note-list').innerHTML = notes.map(note => `<li><a href="#${note.id}"><span>${note.sources.length > 1 ? note.sources.length + '题' : note.sources[0].year}</span><b>${note.title}</b></a></li>`).join('');

  function renderNote(note) {
    const sources = note.sources.map(source => `<span>${source.year} · 第${source.q}题</span>`).join('');
    return `<article class="note-item" id="${note.id}">
      <div class="note-source">${sources}<small>${note.topic}</small></div>
      <h3>${note.title}</h3>
      <p class="trigger">${note.trigger}</p>
      <p class="conclusion"><b>核心结论：</b>${note.conclusion}</p>
      <ul class="points">${note.points.map(point => `<li>${point}</li>`).join('')}</ul>
      <p class="boundary"><b>易错边界：</b>${note.boundary}</p>
      ${renderSimulation(note)}
      ${note.version ? `<span class="version-note">${note.version}</span>` : ''}
    </article>`;
  }

  function renderSimulation(note) {
    const demo = simulation.demos[note.id];
    const scene = simulation.scenes[note.id];
    if (!demo || !scene) return '';
    const bodyId = `simulation-${note.id}`;
    const types = [...new Set(note.sources.map(source => source.type))];
    const operation = types.some(type => /操作|分析|综合/.test(type));
    const sourceLabel = note.sources.map(source => `${source.year}第${source.q}题`).join('、');
    return `<section class="reality-demo chapter-sim-${note.chapter} ${operation ? 'is-operation' : 'is-concept'}" data-sim-id="${note.id}" data-state="-1" data-progress="0" data-tone="">
      <button class="simulation-toggle" type="button" aria-expanded="false" aria-controls="${bodyId}">
        <span class="simulation-icon" aria-hidden="true"><i></i><b>${String(note.chapter).padStart(2,'0')}</b></span>
        <span class="simulation-heading"><small>${operation ? '拟真操作演示' : '拟真概念演示'} · ${appNames[note.chapter]}</small><b>${simulation.escapeHTML(demo.title)}</b></span>
        <span class="simulation-open"><i>打开</i><b>›</b></span>
      </button>
      <div class="simulation-body" id="${bodyId}" hidden>
        <header class="simulation-brief"><span>真题任务</span><p>${simulation.escapeHTML(demo.task)}</p><small>来源：${sourceLabel}</small></header>
        <div class="simulation-mount" data-sim-mount>${scene(demo)}</div>
        <footer class="simulation-footer"><span>直接操作画面；不计分</span><button type="button" data-sim-reset>↻ 恢复初始状态</button></footer>
      </div>
    </section>`;
  }

  $('#notes-root').addEventListener('click', event => {
    const card = event.target.closest('[data-sim-id]');
    if (!card) return;
    const id = card.dataset.simId;
    const demo = simulation.demos[id];
    const toggle = event.target.closest('.simulation-toggle');
    if (toggle) {
      const body = $('.simulation-body', card);
      const opening = body.hidden;
      body.hidden = !opening;
      toggle.setAttribute('aria-expanded', String(opening));
      $('.simulation-open i', toggle).textContent = opening ? '收起' : '打开';
      if (opening && !card.dataset.mounted) { card.dataset.mounted = '1'; initialiseSpecialScene(card, id); }
      return;
    }
    if (event.target.closest('[data-sim-reset]')) { resetSimulation(card, id, demo); return; }

    const chosen = event.target.closest('[data-sim-choice]');
    if (chosen) {
      const index = Number(chosen.dataset.simChoice);
      const item = (demo.kind === 'choose' ? demo.options : demo.actions)[index];
      if (!item) return;
      card.dataset.state = String(index);
      card.dataset.tone = item.tone || '';
      $$('[data-sim-choice]', card).forEach(button => {
        let active = button === chosen;
        if (id === 'y2026q30') {
          const gate = button.classList.contains('publish-gate');
          active = gate ? button.classList.contains('active') || button === chosen : index === 3 && button === chosen;
        }
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      updateFeedback(card, item.result, item.label);
      applyChoiceEffect(card, id, index);
      return;
    }

    const next = event.target.closest('[data-sim-step]');
    if (next) {
      const picked = Number(next.dataset.simStep);
      const progress = Number(card.dataset.progress);
      if (picked !== progress) {
        const expected = demo.steps[progress];
        updateFeedback(card, `当前先在画面中完成“${expected.label}”。`, '操作顺序还没到这里', 'bad');
        next.classList.remove('nudge');
        requestAnimationFrame(() => next.classList.add('nudge'));
        return;
      }
      next.disabled = true;
      next.classList.add('done');
      card.dataset.progress = String(progress + 1);
      card.dataset.tone = progress + 1 === demo.steps.length ? 'good' : '';
      updateFeedback(card, demo.steps[progress].detail, progress + 1 === demo.steps.length ? '操作完成' : `第${progress + 1}步完成`);
      applyStepEffect(card, id, progress, progress + 1 === demo.steps.length);
      return;
    }

    if (event.target.closest('[data-column-handle]')) {
      card.dataset.state = '0';
      $('[data-hash-cell]', card).textContent = '2026/9/2 10:28';
      updateFeedback(card, 'B列变宽后，原日期时间正常显示；单元格内容从未丢失。', '列宽已增加');
    }
    if (event.target.closest('[data-fill-handle]')) {
      card.dataset.state = '2';
      $$('[data-fill-row]', card).forEach((cell, index) => { cell.textContent = String(20260001 + index); });
      updateFeedback(card, '填充柄按连续编号扩展到20260006；文本型编号仍保持完整位数。', '填充序列已完成');
    }
    if (event.target.closest('[data-run-query]')) {
      card.classList.remove('query-ran');
      requestAnimationFrame(() => card.classList.add('query-ran'));
      updateFeedback(card, '查询只返回成绩大于80的姓名和成绩，并按成绩降序显示；原表行序没有改变。', '查询执行完成', 'good');
    }
    if (event.target.closest('[data-gcd-run]')) runGcd(card);
  });

  $('#notes-root').addEventListener('input', event => {
    const card = event.target.closest('[data-sim-id]');
    if (!card) return;
    const id = card.dataset.simId;
    if (event.target.matches('[data-sim-toggle="extensions"]')) {
      $('[data-filename]', card).textContent = event.target.checked ? 'report' : 'report.docx';
      updateFeedback(card, '只是隐藏界面中的扩展名，文件实际仍是report.docx。', '显示设置已改变');
    }
    if (event.target.matches('[data-sim-toggle="readonly"]')) {
      $('[data-file-attr]', card).textContent = event.target.checked ? 'R' : '—';
      updateFeedback(card, event.target.checked ? '只读属性主要限制内容修改，不等于绝对禁止删除。' : '只读属性已取消。', '属性已更新');
    }
    if (id === 'y2026q47' && event.target.matches('[data-cjk-toggle],[data-num-toggle]')) updateCjk(card);
    if (id === 'y2020q56' && event.target.matches('[data-mid-text],[data-mid-start],[data-mid-count]')) updateMid(card);
    if (id === 'y2026q42' && event.target.matches('[data-pseudo-a],[data-pseudo-b]')) updatePseudo(card);
  });

  function updateFeedback(card, text, label = '操作反馈', tone = '') {
    const box = $('[data-sim-feedback]', card);
    if (!box) return;
    box.className = `sim-feedback ${tone ? `tone-${tone}` : card.dataset.tone ? `tone-${card.dataset.tone}` : ''}`;
    box.innerHTML = `<span>${simulation.escapeHTML(label)}</span><p>${simulation.escapeHTML(text)}</p>`;
  }

  function resetSimulation(card, id, demo) {
    card.dataset.state = '-1'; card.dataset.progress = '0'; card.dataset.tone = ''; card.classList.remove('simulation-complete','cjk-compact','query-ran');
    $('[data-sim-mount]', card).innerHTML = simulation.scenes[id](demo);
    initialiseSpecialScene(card, id);
  }

  function applyChoiceEffect(card, id, index) {
    const text = (selector, value) => { const node = $(selector, card); if (node) node.textContent = value; };
    const html = (selector, value) => { const node = $(selector, card); if (node) node.innerHTML = value; };
    switch (id) {
      case 'y2026q18': text('[data-sim-gauge]', ['62%','48%','35%','54%'][index]); break;
      case 'y2026q8': text('[data-device-status]', [
        '此设备无法启动（代码 10）。先核对设备状态，再检查或更新匹配的驱动程序。',
        '设备当前被禁用。确认用途与安全后，可选择“启用设备”。',
        '列表中没有发现设备。先检查连接，再执行“扫描检测硬件改动”。'
      ][index]); break;
      case 'y2026q34': {
        const host = ['DESKTOP-DRD','没有远程地址入口','REMOTE-LAB-02','集中管理控制台'][index];
        text('.machine-chip strong', host);
        break;
      }
      case 'y2026q41': {
        const values = [['7','0111'],['A','1010'],['F','1111'],['2F','0010 1111']][index];
        text('[data-hex-value]', values[0]);
        html('[data-bit-cells]', values[1].split('').map(bit => bit === ' ' ? '<span></span>' : `<i class="bit-${bit}">${bit}</i>`).join(''));
        break;
      }
      case 'y2026q3':
        if (index === 0) { html('[data-ram-bits]','······<br>内容已丢失<br>等待重新装入'); text('[data-ram-led]','○ 断电'); }
        else { html('[data-ram-bits]','101101<br>重新装入程序<br>新的临时数据'); text('[data-ram-led]','● 通电'); }
        break;
      case 'y2026q9':
        text('[data-read-policy]', index === 1 || index === 2 ? '已启用' : '未配置');
        text('[data-write-policy]', index === 0 || index === 2 ? '已启用' : '未配置');
        text('[data-usb-read]', index === 1 || index === 2 ? '读取被拒绝' : '可读取');
        text('[data-usb-write]', index === 0 || index === 2 ? '写入被拒绝' : '可写入');
        break;
      case 'y2026q33':
        if (index === 0) { const p=$('[data-restore-points]',card); if(p?.lastElementChild)p.lastElementChild.remove(); }
        if (index === 1) $('[data-disk-meter]',card)?.style.setProperty('width','34%');
        if (index === 2) { html('[data-restore-points]','<small>没有可用还原点</small>'); text('[data-protection]','关闭'); $('[data-disk-meter]',card)?.style.setProperty('width','0'); }
        break;
      case 'y2026q47': if (index === 0) { $$('[data-cjk-toggle],[data-num-toggle]',card).forEach(x=>x.checked=false); updateCjk(card); } break;
      case 'y2020q7': if(index===0) text('[data-hash-cell]','2026/9/2 10:28'); else if(index===1) text('[data-hash-cell]','2026/9/2'); else text('[data-hash-cell]',''); break;
      case 'y2020q48': if(index===2) $$('[data-fill-row]',card).forEach((cell,i)=>cell.textContent=String(20260001+i)); break;
      case 'y2026q49': if(index===1||index===2) { text('[data-sum-result]','=SUM(A1:A3) → 329'); $$('.text-cell',card).forEach(x=>x.classList.add('converted')); } break;
      case 'y2020q56': {
        const presets=[[3,4],[2,4],[3,2],[1,4]][index];
        if(index<3){ $('[data-mid-start]',card).value=presets[0]; $('[data-mid-count]',card).value=presets[1]; updateMid(card); }
        else { text('[data-mid-result]','SD20'); highlightChars(card,0,4); }
        break;
      }
      case 'y2020q57': text('[data-lookup-result]', index===0 ? '356' : index===1 ? '#N/A' : '可能误匹配'); break;
      case 'y2026q50': {
        const matches=[[2],[0,1,2],[0,1]][index] || [];
        $$('[data-sumif-row]',card).forEach((row,i)=>row.classList.toggle('matched',matches.includes(i)));
        text('[data-sumif-total]',[5,25,20][index]); break;
      }
      case 'y2020q26':
        text('[data-network-value]', ['100 Mb/s','72 Mb/s','61 Mb/s','28 ms'][index]);
        text('[data-network-label]', ['理论管道上限','当前接口速率','有效数据吞吐','一次响应等待'][index]);
        break;
      case 'y2026q14': {
        const codes = ['HTTPS 握手与加密通道','Host: example.com','GET /Python/page.html','GET /Python/page.html?q=1','浏览器本地滚动到 #top'];
        const notes = ['决定怎样通信','决定访问哪台服务器','决定请求哪个资源','把查询参数发送给服务器','#top 通常不会随HTTP请求发送'];
        text('.server-envelope code', codes[index]); text('.server-envelope small', notes[index]);
        break;
      }
      case 'y2026q28': {
        const values = [['95%','58%'],['48%','92%'],['38%','96%'],['66%','86%']][index];
        text('[data-recall]', values[0]); text('[data-precision]', values[1]);
        break;
      }
      case 'y2026q39': if(index===0){text('[data-vcpu]','8');text('[data-vram]','16 GB');text('[data-bill]','¥1.28/h');} else if(index===2){text('[data-instance-state]','已释放');text('[data-bill]','¥0.00/h');} break;
      case 'y2026q16':
        text('[data-cia-a]',index===0?'0%':'100%'); text('[data-cia-c]',index===1?'0%':'100%'); text('[data-cia-i]',index===2?'0%':'100%'); break;
      case 'merged-16': text('[data-firewall-log]', index===0?'ALLOW 203.0.113.27:3389 — 规则过宽':index===1?'ALLOW 10.20.8.16:3389 — 管理网段匹配':index===2?'BLOCK 203.0.113.27:3389 — 已记录':'防火墙在线，但漏洞仍未修补'); break;
      case 'y2026q30': {
        const done = $$('.publish-gate.active',card).length;
        if(index<3){ const gate=$(`.gate-${index} [data-gate-status]`,card); if(gate)gate.textContent='已检查'; text('[data-publication-status]',done===3?'检查完成：可以审慎发布':`发布锁定：还有 ${3-done} 项未完成`); }
        if(index===3){
          const allowed = done === 3;
          text('[data-publication-status]', allowed ? '已通过三道检查：进入人工复核后发布' : `发布被拦截：还有 ${3-done} 项未完成`);
          updateFeedback(card, allowed ? '三项发布前检查均完成；仍应由发布者进行最终人工复核。' : '事实核验、权利检查和AI标识没有全部完成，系统拒绝直接发布。', allowed ? '进入人工复核' : '发布已拦截', allowed ? 'good' : 'bad');
        }
        break;
      }
      case 'y2026q42': {
        const programs = [
          'INPUT a, b\nIF a > b THEN\n  OUTPUT a\nELSE\n  OUTPUT b\nEND IF',
          '比较一下\n然后输出结果',
          'if (a > b) {\n  printf(a);\n} else {\n  printf(b);\n}'
        ];
        text('[data-pseudo-code]', programs[index]);
        if (index === 1) text('[data-pseudo-output]', '?'); else updatePseudo(card);
        break;
      }
      case 'y2026q45': text('[data-real-tops]', ['82 TOPS','31 TOPS','24 TOPS','指标不可直接混比'][index]); break;
      case 'merged-20': renderRelation(card,index); break;
      default: break;
    }
  }

  function applyStepEffect(card, id, stepIndex, complete) {
    const text = (selector, value) => { const node = $(selector, card); if (node) node.textContent = value; };
    switch (id) {
      case 'y2020q31': {
        const answers=['· · · ·','· · · 0','· · 1 0','0 0 1 0'];
        text('[data-binary-column]', ['数位已右对齐','最低位：1−1','中间位连续借位','十进制校验：9−7=2'][stepIndex]);
        text('[data-binary-answer]',answers[stepIndex]); if(stepIndex===2) text('[data-borrow-row]','¹ ¹ ¹'); break;
      }
      case 'merged-1': {
        const packet = $('[data-packet]', card); if (packet) packet.style.left = ['3%','42%','62%','96%'][stepIndex];
        break;
      }
      case 'y2020q41': if(stepIndex===1) text('[data-header-text]','[在此键入页眉]'); if(stepIndex===2) text('[data-header-text]','山东专升本计算机'); break;
      case 'y2020q61': if(stepIndex===0) text('[data-break-before]','✓ 前分节符'); if(stepIndex===1) text('[data-break-after]','✓ 后分节符'); break;
      case 'y2020q60': if(complete) $('[data-border-table]',card)?.classList.add('all-borders-applied'); break;
      case 'y2020q62': if(complete) $('[data-repeated-header]',card)?.classList.add('visible'); break;
      case 'y2026q36': if(stepIndex===0) $('.photo-object small',card).textContent='四周型环绕'; if(complete)$('[data-group-boundary]',card)?.classList.add('visible'); break;
      case 'merged-6': if(stepIndex===1) text('[data-caption]','图 1 模型准确率'); if(stepIndex===3) text('[data-cross-ref]','图 1'); break;
      case 'y2020q52': if(complete) $$('[data-score]',card).forEach(x=>x.classList.toggle('low',Number(x.textContent)<60)); break;
      case 'y2020q49': if(complete) $('.duplicate-row',card)?.remove(); break;
      case 'y2020q58': if(stepIndex===0)$('[data-subtotal-table]',card)?.classList.add('sorted'); if(complete)$('[data-subtotal-table]',card)?.classList.add('subtotaled'); break;
      case 'y2026q52': if(stepIndex===3)$('[data-secondary-axis]',card)?.classList.add('active'); break;
      case 'y2020q54': if(stepIndex===2)$('[data-background-slide]',card)?.classList.add('image-filled'); break;
      case 'merged-12': if(complete)$('[data-ppt-chart]',card)?.classList.add('play-series'); break;
      case 'y2026q55': if(complete)$('[data-sim-step="2"]',card)?.remove(); break;
      case 'y2026q15': if(stepIndex===0)text('[data-device-count]','0 · 热点已开'); if(stepIndex===1)text('[data-device-count]','1'); break;
      case 'merged-19': if(complete)$('[data-alert-screen]',card)?.classList.add('alerting'); break;
      default: break;
    }
    if (complete) card.classList.add('simulation-complete');
  }

  function initialiseSpecialScene(card, id) { if (id === 'y2020q56') updateMid(card); if (id === 'y2026q42') updatePseudo(card); }
  function updateCjk(card) {
    const compact = !$$('[data-cjk-toggle],[data-num-toggle]',card).some(x=>x.checked);
    card.classList.toggle('cjk-compact',compact); $('[data-line-count]',card).textContent=compact?'2':'3';
    updateFeedback(card,compact?'自动间距已取消；同一段文字现在占2行。':'自动间距开启；中文与西文/数字之间保留排版间距。','实时排版');
  }
  function updateMid(card) {
    const source=$('[data-mid-text]',card)?.value||'',start=Math.max(1,Number($('[data-mid-start]',card)?.value)||1),count=Math.max(0,Number($('[data-mid-count]',card)?.value)||0);
    $('[data-mid-result]',card).textContent=source.substr(start-1,count); highlightChars(card,start-1,count);
  }
  function highlightChars(card,start,count) { $$('[data-char-index]',card).forEach((char,index)=>char.classList.toggle('picked',index>=start&&index<start+count)); }
  function updatePseudo(card) { const a=Number($('[data-pseudo-a]',card)?.value)||0,b=Number($('[data-pseudo-b]',card)?.value)||0; $('[data-pseudo-output]',card).textContent=Math.max(a,b); }
  function runGcd(card) {
    let a=Math.abs(parseInt($('[data-gcd-a]',card)?.value,10)||0),b=Math.abs(parseInt($('[data-gcd-b]',card)?.value,10)||0),rows=[];
    if(!a&&!b)return; while(b){const r=a%b;rows.push(`${a} ÷ ${b} → 余 ${r}`);a=b;b=r;}
    $('[data-division-tape]',card).innerHTML=rows.map(row=>`<span>${row}</span>`).join(''); $('[data-gcd-result]',card).textContent=a;
    updateFeedback(card,`每一步可执行，并在${rows.length}步后余数变为0。`,`最大公约数 = ${a}`);
  }
  function renderRelation(card,index) {
    const results=[
      '<table><tr><th>学号</th><th>姓名</th><th>性别</th></tr><tr><td>01</td><td>王宁</td><td>女</td></tr><tr><td>03</td><td>张琳</td><td>女</td></tr></table>',
      '<table><tr><th>姓名</th></tr><tr><td>王宁</td></tr><tr><td>李悦</td></tr><tr><td>张琳</td></tr></table>',
      '<table><tr><th>学号</th><th>姓名</th><th>成绩</th></tr><tr><td>01</td><td>王宁</td><td>92</td></tr><tr><td>02</td><td>李悦</td><td>86</td></tr><tr><td>03</td><td>张琳</td><td>88</td></tr></table>',
      '<table><tr><th>姓名</th><th>成绩</th></tr><tr><td>王宁</td><td>92</td></tr><tr><td>张琳</td><td>88</td></tr></table>'
    ];
    $('[data-relation-result]',card).innerHTML=`<b>结果关系</b>${results[index]}`;
  }

  const openDrawer = () => { $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeDrawer = () => { $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); document.body.style.overflow = ''; };
  $('#open-drawer').addEventListener('click', openDrawer); $('#close-drawer').addEventListener('click', closeDrawer); $('#scrim').addEventListener('click', closeDrawer);
  $('#drawer').addEventListener('click', event => { if (event.target.closest('a')) closeDrawer(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDrawer(); if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) { event.preventDefault(); $('#search-input').focus(); } });
  const applySearch = () => {
    const query = $('#search-input').value.trim().toLowerCase(); let shown = 0;
    $$('.note-item').forEach(item => { const visible = !query || item.textContent.toLowerCase().includes(query); item.classList.toggle('hidden', !visible); if (visible) shown++; });
    $$('.section-block').forEach(section => section.classList.toggle('hidden', !$$('.note-item:not(.hidden)', section).length)); $('#result-count').textContent = `${shown}条笔记`;
  };
  $('#search-input').addEventListener('input', applySearch);
  const updateProgress = () => { const root = document.documentElement; const max = root.scrollHeight - innerHeight; $('#progress-bar').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`; };
  addEventListener('scroll', updateProgress, {passive:true}); updateProgress();
})();
