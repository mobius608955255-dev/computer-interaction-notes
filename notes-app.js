(() => {
  'use strict';

  const data = window.NOTES;
  const simulation = window.NOTE_SIMULATIONS;
  const chapterNumber = Number(document.body.dataset.chapter);
  const refined = true;
  const chapter = data.chapters.find(item => item.number === chapterNumber);
  const notes = data.notes.filter(item => item.chapter === chapterNumber);
  const sourceCount = notes.reduce((sum, note) => sum + note.sources.length, 0);
  const version = 38;
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
    <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="本章知识点目录" aria-hidden="true" inert hidden>
      <div class="drawer-head"><div><small id="drawer-chapter"></small><strong>本章目录</strong></div><button id="close-drawer" type="button" aria-label="关闭目录">×</button></div>
      <ol class="note-list" id="note-list"></ol>
    </aside>
    <button class="scrim" id="scrim" type="button" aria-label="关闭目录" tabindex="-1" aria-hidden="true"></button>
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
  $('#note-list').innerHTML = notes.map(note => `<li><a href="#${note.id}"><span>${note.section}</span><b>${note.title}</b></a></li>`).join('');

  function renderNote(note) {
    const sources = note.sources.map(source => `<span>${source.year} · 第${source.q}题</span>`).join('');
    const references = (window.NOTE_REFERENCES?.[note.id] || []).map(([title,url])=>`<p><a href="${url}" target="_blank" rel="noreferrer">${title} ↗</a></p>`).join('');
    return `<article class="note-item" id="${note.id}">
      ${refined ? '' : `<div class="note-topic">${note.topic}</div>`}
      <h3>${note.title}</h3>
      <p class="conclusion"><b>核心结论：</b>${note.conclusion}</p>
      ${note.pointGroups ? note.pointGroups.map(group=>`<section class="note-point-group"><h4>${simulation.escapeHTML(group.title)}</h4><ul class="points">${group.indices.map(i=>`<li>${note.points[i]}</li>`).join('')}</ul></section>`).join('') : `<ul class="points">${note.points.map(point => `<li>${point}</li>`).join('')}</ul>`}
      ${note.comparison ? renderComparison(note.comparison) : ''}
      <p class="boundary"><b>易错边界：</b>${note.boundary}</p>
      <details class="note-provenance"><summary>真题来源 · ${note.sources.length}题</summary><div class="note-source">${sources}</div><p>${note.trigger}</p>${references}</details>
      ${renderSimulation(note)}
    </article>`;
  }

  function renderComparison(comparison) {
    const escape = simulation.escapeHTML;
    return `<div class="note-comparison" role="region" aria-label="${escape(comparison.caption || '知识点对照')}" tabindex="0"><table>${comparison.caption ? `<caption>${escape(comparison.caption)}</caption>` : ''}<thead><tr>${comparison.headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${comparison.rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${escape(cell)}</th>`:`<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function renderSimulation(note) {
    const demo = simulation.demos[note.id];
    const scene = simulation.scenes[note.id];
    if (!demo || !scene) return '';
    const bodyId = `simulation-${note.id}`;
    const types = [...new Set(note.sources.map(source => source.type))];
    const operation = types.some(type => /操作|分析|综合/.test(type));
    return `<section class="reality-demo chapter-sim-${note.chapter} ${operation ? 'is-operation' : 'is-concept'}" data-sim-id="${note.id}" data-state="-1" data-progress="0" data-tone="">
      <button class="simulation-toggle" type="button" aria-expanded="false" aria-controls="${bodyId}">
        ${refined ? '' : `<span class="simulation-icon" aria-hidden="true"><i></i><b>${String(note.chapter).padStart(2,'0')}</b></span>`}
        <span class="simulation-heading"><small>${operation ? '拟真操作演示' : '拟真概念演示'} · ${appNames[note.chapter]}</small><b>${simulation.escapeHTML(demo.title)}</b></span>
        <span class="simulation-open"><i>打开</i><b>›</b></span>
      </button>
      <div class="simulation-body" id="${bodyId}" hidden>
        <header class="simulation-brief">${refined ? '' : '<span>动手理解</span>'}<p>${simulation.escapeHTML(demo.task)}</p>${refined ? '<button type="button" data-sim-reset>重置演示</button>' : ''}</header>
        <div class="simulation-mount" data-sim-mount></div>
        ${refined ? '' : '<footer class="simulation-footer"><span>直接操作画面；不计分</span><button type="button" data-sim-reset>↻ 恢复初始状态</button></footer>'}
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
      if (opening && !card.dataset.mounted) {
        card.dataset.mounted = '1';
        $('[data-sim-mount]', card).innerHTML = simulation.scenes[id](demo);
        initialiseSpecialScene(card, id); refreshSequenceAvailability(card, demo);
      }
      return;
    }
    if (event.target.closest('[data-sim-reset]')) { resetSimulation(card, id, demo); return; }

    const dragMode = event.target.closest('[data-drag-mode]');
    if (dragMode) {
      card.dataset.dragMode = dragMode.dataset.dragMode;
      $$('[data-drag-mode]', card).forEach(button => {
        const active = button === dragMode;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      updateFeedback(card, `当前拖动条件：${dragMode.textContent.trim()}。现在把文件拖到同盘或跨盘目标。`, '条件已设置');
      return;
    }

    const slideNav = event.target.closest('[data-slide-nav]');
    if (slideNav) {
      navigateSlide(card, id, Number(slideNav.dataset.slideNav));
      return;
    }

    const chosen = event.target.closest('[data-sim-choice]');
    if (chosen) {
      const index = Number(chosen.dataset.simChoice);
      activateChoice(card, id, demo, index, chosen);
      return;
    }

    const next = event.target.closest('[data-sim-step]');
    if (next) {
      const picked = Number(next.dataset.simStep);
      if (id === 'y2020q52' && picked === 3) {
        const threshold = $('[data-condition-threshold]', card)?.value.trim();
        const format = $('[data-condition-format]', card)?.value;
        if (threshold !== '60' || !format) {
          updateFeedback(card, '请在“小于”对话框中输入60，并选择一种突出显示格式后再确定。', '条件还未填写完整', 'bad');
          return;
        }
      }
      completeSequenceStep(card, id, demo, next, picked);
      return;
    }

    if (event.target.closest('[data-run-query]')) {
      card.classList.remove('query-ran');
      requestAnimationFrame(() => card.classList.add('query-ran'));
      updateFeedback(card, '查询只返回成绩大于80的姓名和成绩，并按成绩降序显示；原表行序没有改变。', '查询执行完成', 'good');
    }
    if (event.target.closest('[data-gcd-run]')) runGcd(card);
  });

  $('#notes-root').addEventListener('dblclick', event => {
    const doubleStep = event.target.closest('[data-sim-double-step]');
    if (doubleStep) {
      const card = doubleStep.closest('[data-sim-id]');
      completeSequenceStep(card, card.dataset.simId, simulation.demos[card.dataset.simId], doubleStep, Number(doubleStep.dataset.simDoubleStep));
      return;
    }
    const handle = event.target.closest('[data-fill-handle]');
    if (!handle) return;
    const card = handle.closest('[data-sim-id]');
    const demo = simulation.demos[card.dataset.simId];
    fillSeries(card);
    activateChoice(card, card.dataset.simId, demo, 3, handle);
  });

  function activateChoice(card, id, demo, index, chosen = null) {
    const items = demo.kind === 'choose' ? demo.options : demo.actions;
    const item = items[index];
    if (!item) return;
    card.dataset.state = String(index);
    card.dataset.tone = item.tone || '';
    $$('[data-sim-choice]', card).forEach(button => {
      let active = chosen ? button === chosen : Number(button.dataset.simChoice) === index;
      if (id === 'y2026q30') {
        const gate = button.classList.contains('publish-gate');
        active = gate ? button.classList.contains('active') || button === chosen : index === 3 && button === chosen;
      }
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (id === 'y2020q2' && chosen) {
      const currentWindow = chosen.closest('[data-demo-window]');
      if (currentWindow) {
        $$('[data-demo-window]', card).forEach(win => win.classList.toggle('active', index !== 1 && win === currentWindow));
      }
    }
    updateFeedback(card, item.result, item.label);
    applyChoiceEffect(card, id, index);
  }

  function completeSequenceStep(card, id, demo, control, picked) {
    const progress = Number(card.dataset.progress);
    if (picked !== progress) {
      const expected = demo.steps[progress];
      if (!expected) { updateFeedback(card,'本次操作已完成。可恢复初始状态重新尝试。','操作已完成'); return false; }
      updateFeedback(card, `当前先在画面中完成“${expected.label}”。`, '操作顺序还没到这里', 'bad');
      control.classList.remove('nudge');
      requestAnimationFrame(() => control.classList.add('nudge'));
      return false;
    }
    control.disabled = true;
    control.classList.add('done');
    card.dataset.progress = String(progress + 1);
    const complete = progress + 1 === demo.steps.length;
    card.dataset.tone = complete ? 'good' : '';
    refreshSequenceAvailability(card, demo);
    updateFeedback(card, demo.steps[progress].detail, complete ? '操作完成' : `第${progress + 1}步完成`);
    applyStepEffect(card, id, progress, complete);
    keepCurrentStageVisible(card);
    return true;
  }

  function keepCurrentStageVisible(card) {
    requestAnimationFrame(() => {
      const currentStage = $$('[data-v25-stage],[data-stage-view]', card)
        .find(stage => getComputedStyle(stage).display !== 'none');
      currentStage?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  }

  let activeGesture = null;
  const gestureRoot = $('#notes-root');

  gestureRoot.addEventListener('pointerdown', event => {
    const pressTarget = event.target.closest('[data-long-press-choice]');
    if (pressTarget) {
      startPressGesture(event, pressTarget);
      return;
    }
    const windowHandle = event.target.closest('[data-window-drag]');
    if (windowHandle && !event.target.closest('button')) {
      startDragGesture(event, windowHandle, 'window');
      return;
    }
    const dragSource = event.target.closest('[data-drag-kind]');
    if (dragSource) startDragGesture(event, dragSource, dragSource.dataset.dragKind);
  });

  gestureRoot.addEventListener('contextmenu', event => {
    if (event.target.closest('[data-drag-kind="file"],[data-long-press-choice]')) event.preventDefault();
  });

  gestureRoot.addEventListener('keydown', event => {
    const fauxButton = event.target.closest('[role="button"][data-sim-step]');
    if (fauxButton && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      fauxButton.click();
      return;
    }
    const source = event.target.closest('[data-drag-kind]');
    if (!source || !['Enter',' '].includes(event.key)) return;
    event.preventDefault();
    const card = source.closest('[data-sim-id]');
    const id = card.dataset.simId;
    const demo = simulation.demos[id];
    if (source.dataset.dragKind === 'column-resize') finishColumnResize(card, 92, demo);
    if (source.dataset.dragKind === 'fill') { fillSeries(card); activateChoice(card, id, demo, 2, source); }
    if (source.dataset.dragKind === 'file') completeFileDrag(card, source, $('[data-drop-target="cross"]', card), demo, {});
    if (['workload','relation'].includes(source.dataset.dragKind)) completeMappedDrag(card, source, $(`[data-drop-target="${source.dataset.correctTarget}"]`, card), demo);
  });

  document.addEventListener('pointermove', event => {
    const gesture = activeGesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    gesture.distance = Math.hypot(dx, dy);
    if (gesture.type === 'press') {
      if (gesture.distance > 10) cancelPressGesture(gesture);
      return;
    }
    event.preventDefault();
    gesture.dx = dx; gesture.dy = dy;
    moveDragGesture(gesture, dx, dy);
  }, {passive:false});

  document.addEventListener('pointerup', finishPointerGesture);
  document.addEventListener('pointercancel', cancelPointerGesture);

  function startPressGesture(event, target) {
    if (activeGesture) cancelPointerGesture({pointerId:activeGesture.pointerId});
    const card = target.closest('[data-sim-id]');
    const gesture = {type:'press', pointerId:event.pointerId, target, card, startX:event.clientX, startY:event.clientY, distance:0, fired:false};
    activeGesture = gesture;
    target.classList.remove('press-complete');
    target.classList.add('pressing');
    target.setPointerCapture?.(event.pointerId);
    const label = $('[data-press-label]', card);
    if (label) label.textContent = '继续按住…达到圆环终点才会强制断电';
    gesture.timer = setTimeout(() => {
      if (activeGesture !== gesture) return;
      gesture.fired = true;
      target.classList.remove('pressing');
      target.classList.add('press-complete');
      const demo = simulation.demos[card.dataset.simId];
      activateChoice(card, card.dataset.simId, demo, Number(target.dataset.longPressChoice), target);
      if (label) label.textContent = '已持续按住：触发强制断电';
    }, 700);
  }

  function cancelPressGesture(gesture) {
    clearTimeout(gesture.timer);
    gesture.target.classList.remove('pressing');
    const label = $('[data-press-label]', gesture.card);
    if (label && !gesture.fired) label.textContent = '手指移动过远，长按已取消';
  }

  function startDragGesture(event, source, kind) {
    if (event.button !== 0 && !(kind === 'file' && event.button === 2)) return;
    const card = source.closest('[data-sim-id]');
    const movable = kind === 'window' ? source.closest('[data-demo-window]') : source;
    const measured = kind.startsWith('picture-') ? source.closest('[data-picture],[data-ppt-picture]') : movable;
    const rect = measured.getBoundingClientRect();
    activeGesture = {
      type:'drag', kind, source, movable, card, pointerId:event.pointerId,
      startX:event.clientX, startY:event.clientY, startWidth:rect.width, startHeight:rect.height,
      dx:0, dy:0, distance:0,
      baseX:Number(movable.dataset.dragX) || 0, baseY:Number(movable.dataset.dragY) || 0,
      rightButton:event.button===2, ctrlKey:event.ctrlKey, shiftKey:event.shiftKey
    };
    source.setPointerCapture?.(event.pointerId);
    movable.classList.add('dragging');
    if (kind === 'window') {
      $$('[data-demo-window]', card).forEach(win => win.classList.toggle('active', win === movable));
    }
  }

  function moveDragGesture(gesture, dx, dy) {
    const {kind, movable, card} = gesture;
    if (kind === 'window') {
      movable.style.setProperty('--drag-x', `${gesture.baseX + dx}px`);
      movable.style.setProperty('--drag-y', `${gesture.baseY + dy}px`);
      return;
    }
    if (kind === 'column-resize') {
      const extra = Math.max(0, Math.min(170, dx));
      const grid = $('[data-column-grid]', card);
      if (grid) grid.style.gridTemplateColumns = `40px ${72 + extra}px`;
      const heading = $('[data-column-b]', card);
      if (heading) heading.style.width = `${72 + extra}px`;
      const cell = $('[data-hash-cell]', card);
      if (cell) { cell.style.width = `${72 + extra}px`; cell.textContent = extra > 62 ? '2026/9/2 10:28' : '########'; }
      return;
    }
    if (kind === 'fill') {
      const y = Math.max(0, Math.min(155, dy));
      movable.style.setProperty('--drag-y', `${y}px`);
      card.style.setProperty('--fill-preview', `${y}px`);
      card.classList.add('fill-previewing');
      return;
    }
    if (kind === 'picture-resize') {
      const picture = movable.closest('[data-picture],[data-ppt-picture]');
      if (!gesture.picture) gesture.picture = picture;
      const lock = $('[data-aspect-lock]', card)?.checked !== false;
      const width = Math.max(110, Math.min(380, gesture.startWidth + dx));
      const height = lock ? width * gesture.startHeight / gesture.startWidth : Math.max(80, Math.min(300, gesture.startHeight + dy));
      picture.style.width = `${width}px`; picture.style.height = `${height}px`;
      updatePictureReadout(card, width, height);
      return;
    }
    if (kind === 'picture-crop') {
      const picture = movable.closest('[data-picture],[data-ppt-picture]');
      const art = $('.photo-art,.scan-image', picture);
      const crop = Math.max(0, Math.min(48, -dx / Math.max(1, picture.getBoundingClientRect().width) * 100));
      if (art) art.style.clipPath = `inset(0 ${crop}% 0 0)`;
      gesture.crop = crop;
      return;
    }
    if (kind === 'group') {
      $$('.group-object,[data-group-boundary]', card).forEach(object => {
        object.style.setProperty('--drag-x', `${gesture.baseX + dx}px`);
        object.style.setProperty('--drag-y', `${gesture.baseY + dy}px`);
      });
      return;
    }
    movable.style.setProperty('--drag-x', `${dx}px`);
    movable.style.setProperty('--drag-y', `${dy}px`);
    const selector = kind === 'slide' ? '[data-drag-kind="slide"]' : '[data-drop-target]';
    const hovered = findPointTarget(card, gesture.startX + dx, gesture.startY + dy, selector, movable);
    $$(selector, card).forEach(target => target.classList.toggle('drag-over', target === hovered));
  }

  function finishPointerGesture(event) {
    const gesture = activeGesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    activeGesture = null;
    if (gesture.type === 'press') {
      clearTimeout(gesture.timer);
      gesture.target.classList.remove('pressing');
      if (!gesture.fired && gesture.distance <= 10) {
        const demo = simulation.demos[gesture.card.dataset.simId];
        activateChoice(gesture.card, gesture.card.dataset.simId, demo, Number(gesture.target.dataset.shortPressChoice), gesture.target);
        const label = $('[data-press-label]', gesture.card);
        if (label) label.textContent = '这是短按：行为由电源选项决定，没有触发强制断电';
      }
      return;
    }
    const {card, kind, source, movable} = gesture;
    $$('[data-drop-target],[data-drag-kind="slide"]', card).forEach(target => target.classList.remove('drag-over'));
    movable.classList.remove('dragging');
    if (kind === 'window') {
      movable.dataset.dragX = String(gesture.baseX + gesture.dx);
      movable.dataset.dragY = String(gesture.baseY + gesture.dy);
      if (gesture.distance > 8) activateChoice(card, card.dataset.simId, simulation.demos[card.dataset.simId], 2, source);
      return;
    }
    if (kind === 'column-resize') {
      finishColumnResize(card, gesture.dx, simulation.demos[card.dataset.simId]);
      return;
    }
    if (kind === 'fill') {
      card.classList.remove('fill-previewing');
      card.style.removeProperty('--fill-preview');
      source.style.removeProperty('--drag-y');
      if (gesture.dy > 62) {
        fillSeries(card);
        activateChoice(card, card.dataset.simId, simulation.demos[card.dataset.simId], 2, source);
      } else updateFeedback(card, '要把绿色填充柄向下拖到A7附近，松手后才会生成序列。', '拖动距离不足', 'warn');
      return;
    }
    if (kind === 'picture-resize' || kind === 'picture-crop') {
      if (kind === 'picture-crop' && gesture.crop > 4 && card.dataset.simId === 'y2026q53') activateChoice(card, card.dataset.simId, simulation.demos[card.dataset.simId], 2, source);
      else updateFeedback(card, kind === 'picture-crop' ? '裁剪只改变可见范围，图片对象与动画仍保留。' : '图片尺寸已随手柄连续变化；锁定纵横比时宽高联动。', kind === 'picture-crop' ? '裁剪边界已移动' : '缩放完成', 'good');
      return;
    }
    if (kind === 'group') {
      $$('.group-object,[data-group-boundary]', card).forEach(object => {
        object.dataset.dragX = String(gesture.baseX + gesture.dx);
        object.dataset.dragY = String(gesture.baseY + gesture.dy);
      });
      updateFeedback(card, gesture.distance > 8 ? '三个对象保持相对位置并一起移动，说明它们已经成为一个组合。' : '按住组合外框并拖动，三个对象会一起移动。', gesture.distance > 8 ? '组合拖动成功' : '尚未移动', gesture.distance > 8 ? 'good' : 'warn');
      return;
    }
    const target = findPointTarget(card, event.clientX, event.clientY, kind === 'slide' ? '[data-drag-kind="slide"]' : '[data-drop-target]', source);
    movable.style.removeProperty('--drag-x'); movable.style.removeProperty('--drag-y');
    if (kind === 'file') completeFileDrag(card, source, target, simulation.demos[card.dataset.simId], gesture);
    if (kind === 'workload' || kind === 'relation') completeMappedDrag(card, source, target, simulation.demos[card.dataset.simId]);
    if (kind === 'slide') completeSlideDrag(card, source, target);
  }

  function cancelPointerGesture(event) {
    const gesture = activeGesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    activeGesture = null;
    if (gesture.type === 'press') cancelPressGesture(gesture);
    else {
      gesture.movable.classList.remove('dragging');
      if (gesture.kind === 'window') {
        gesture.movable.style.setProperty('--drag-x', `${gesture.baseX}px`);
        gesture.movable.style.setProperty('--drag-y', `${gesture.baseY}px`);
      } else if (gesture.kind === 'group') {
        $$('.group-object,[data-group-boundary]', gesture.card).forEach(object => {
          object.style.setProperty('--drag-x', `${gesture.baseX}px`);
          object.style.setProperty('--drag-y', `${gesture.baseY}px`);
        });
      } else {
        gesture.movable.style.removeProperty('--drag-x');
        gesture.movable.style.removeProperty('--drag-y');
      }
    }
  }

  function findPointTarget(card, x, y, selector, source) {
    return $$(selector, card).find(target => {
      if (target === source) return false;
      const rect = target.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }) || null;
  }

  function finishColumnResize(card, dx, demo) {
    if (dx < 36) {
      updateFeedback(card, '请抓住B列标题右边界向右拖动；轻点不会改变列宽。', '还没有加宽', 'warn');
      return;
    }
    $('[data-hash-cell]', card).textContent = '2026/9/2 10:28';
    activateChoice(card, card.dataset.simId, demo, 0, $('[data-column-b]', card));
  }

  function fillSeries(card) {
    $$('[data-fill-row]', card).forEach((cell, index) => { cell.textContent = String(20260001 + index); });
    card.classList.add('series-filled');
  }

  function completeFileDrag(card, source, target, demo, gesture) {
    if (!target) {
      updateFeedback(card, '文件没有落在目标文件夹中，请再拖一次。', '未放入目标', 'warn');
      return;
    }
    const mode = gesture.rightButton ? 'right' : gesture.ctrlKey ? 'ctrl' : gesture.shiftKey ? 'shift' : card.dataset.dragMode || 'none';
    const targetType = target.dataset.dropTarget;
    const index = mode === 'ctrl' ? 2 : mode === 'shift' ? 3 : mode === 'right' ? 4 : targetType === 'same' ? 0 : 1;
    $$('.drop-zone', card).forEach(zone => { zone.classList.remove('drop-complete','right-drop'); zone.querySelector('.dropped-file,.drag-menu')?.remove(); });
    if (index === 4) {
      target.classList.add('right-drop');
      target.insertAdjacentHTML('beforeend','<div class="drag-menu"><span>复制到此处</span><span>移动到此处</span><span>在当前位置创建快捷方式</span></div>');
    } else {
      target.classList.add('drop-complete');
      target.insertAdjacentHTML('beforeend','<span class="dropped-file">W　笔记.docx</span>');
    }
    source.classList.toggle('moved-away', index === 0 || index === 3);
    activateChoice(card, card.dataset.simId, demo, index, source);
  }

  function completeMappedDrag(card, source, target, demo) {
    if (!target) {
      updateFeedback(card, '请把对象完整拖入有“放到这里”提示的目标区域。', '没有放到目标', 'warn');
      return;
    }
    const expected = source.dataset.correctTarget;
    if (target.dataset.dropTarget !== expected) {
      target.classList.remove('wrong-drop');
      requestAnimationFrame(() => target.classList.add('wrong-drop'));
      updateFeedback(card, source.dataset.dragKind === 'relation' ? '联系方向必须从起点拖到另一端，不能在原实体内松手。' : '这个工作负载与目标处理器不匹配，已退回任务队列。', '放置不合适', 'bad');
      return;
    }
    target.classList.add('accepted-drop');
    activateChoice(card, card.dataset.simId, demo, Number(source.dataset.choice), source);
  }

  function completeSlideDrag(card, source, target) {
    if (!target) {
      updateFeedback(card, '松手位置没有落在另一张缩略图上，顺序保持不变。', '未重排', 'warn');
      return;
    }
    const list = source.parentElement;
    const oldOrder = [...list.children].indexOf(source) + 1;
    const targetOrder = [...list.children].indexOf(target) + 1;
    if (oldOrder < targetOrder) target.after(source); else target.before(source);
    [...list.querySelectorAll('[data-slide-num]')].forEach((slide, index) => slide.querySelector('span').textContent = `位置 ${index + 1} · 原第${slide.dataset.slideNum}页`);
    updateFeedback(card, `原第${source.dataset.slideNum}页已从位置${oldOrder}移动到位置${targetOrder}。`, '缩略图已重排', 'good');
  }

  function updatePictureReadout(card, width, height) {
    const readout = $('[data-picture-readout]', card);
    if (!readout) return;
    const w = width / 35, h = height / 35;
    const ratio = width / height;
    const ratioText = Math.abs(ratio - 8.5 / 6) < .04 ? '保持原始8.5:6' : Math.abs(ratio - 6 / 5) < .04 ? '目标6:5' : '比例已改变';
    readout.textContent = `${w.toFixed(2)} × ${h.toFixed(2)} cm · ${ratioText}`;
    const widthInput = $('[data-image-width]', card), heightInput = $('[data-image-height]', card);
    if (widthInput) widthInput.value = `${w.toFixed(2)} cm`;
    if (heightInput) heightInput.value = `${h.toFixed(2)} cm`;
  }

  function navigateSlide(card, id, page) {
    $$('[data-slide-nav]', card).forEach(button => button.classList.toggle('selected', Number(button.dataset.slideNav) === page));
    const titles = {
      y2020q10:['人工智能辅助医学影像','研究背景','数据与方法','实验结果','局限与讨论','总结与展望'],
      y2020q12:['答辩封面','研究方法','备用数据','致谢'],
      y2026q54:['学习目标','学习目标（续）']
    };
    const title = titles[id]?.[page - 1];
    if (!title) return;
    const slide = $('.ppt-main-slide', card);
    slide?.classList.remove('page-changing');
    requestAnimationFrame(() => slide?.classList.add('page-changing'));
    const number = $('[data-slide-number]', card);
    if (number) number.textContent = String(page).padStart(2,'0');
    const heading = $('[data-slide-heading],[data-slide-title]', card);
    if (heading) heading.textContent = title;
    if (id === 'y2020q12') {
      const stamp = $('[data-hidden-stamp]', card);
      if (stamp) stamp.hidden = page !== 3;
      const subtitle = $('[data-slide-subtitle]', card);
      if (subtitle) subtitle.textContent = page === 3 ? '页面仍保留在文件中，只在正常放映时被跳过。' : `当前正在编辑第${page}页；隐藏状态只属于第3页。`;
    }
    if (id === 'y2020q10') {
      const subtitle = $('[data-slide-subtitle]', card);
      if (subtitle) subtitle.textContent = ['课程汇报','为什么需要辅助诊断','数据集与训练流程','准确率与召回率','误差来源','课程汇报结束'][page-1];
    }
    if (id === 'y2026q54') {
      const text = $('[data-autofit-text]', card);
      if (text) text.textContent = page === 1 ? '掌握计算机基础概念；理解操作系统的基本功能。' : '完成Word、Excel和PowerPoint规范操作；形成信息安全意识。';
    }
    updateFeedback(card, `已切换到第${page}页：${title}。`, '页面已切换', 'good');
  }

  $('#notes-root').addEventListener('input', event => {
    const card = event.target.closest('[data-sim-id]');
    if (!card) return;
    const id = card.dataset.simId;
    if (id === 'y2020q41' && event.target.matches('[data-sequence-input]')) {
      const stepIndex = Number(event.target.dataset.sequenceInput);
      const expected = stepIndex === 4 ? '牡丹' : '山东专升本计算机';
      if (event.target.value.trim() === expected) completeSequenceStep(card, id, simulation.demos[id], event.target, stepIndex);
      else updateFeedback(card, `继续输入完整页眉：“${expected}”。`, '正在编辑页眉');
      return;
    }
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
    card.dataset.state = '-1'; card.dataset.progress = '0'; card.dataset.tone = ''; delete card.dataset.dragMode; card.classList.remove('simulation-complete','cjk-compact','query-ran','series-filled','fill-previewing');
    $('[data-sim-mount]', card).innerHTML = simulation.scenes[id](demo);
    initialiseSpecialScene(card, id);
    refreshSequenceAvailability(card, demo);
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
        const state = ['进程已结束','已定位 WINWORD.EXE','启动项已禁用','请转到“应用和功能”','没有远程地址入口'][index];
        text('.machine-chip strong', state);
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
      case 'y2020q8': {
        const tabs = $('[data-sheet-tabs]', card);
        if (!tabs) break;
        if (index === 0) tabs.innerHTML = '<button class="active">Sheet1</button><button aria-label="新建工作表">＋</button>';
        if (index === 1) tabs.innerHTML = '<button class="active">Sheet1</button><button aria-label="新建工作表">＋</button>';
        if (index === 2) tabs.innerHTML = '<button>Sheet2</button><button class="active">Sheet3</button><button aria-label="新建工作表">＋</button>';
        break;
      }
      case 'y2020q7': {
        if (index !== 0) {
          $('[data-column-grid]',card)?.style.removeProperty('grid-template-columns');
          $('[data-column-b]',card)?.style.removeProperty('width');
          $('[data-hash-cell]',card)?.style.removeProperty('width');
        }
        if(index===0) text('[data-hash-cell]','2026/9/2 10:28'); else if(index===1) text('[data-hash-cell]','2026/9/2'); else text('[data-hash-cell]','');
        break;
      }
      case 'merged-9': {
        const picture = $('[data-picture]', card), art = $('.photo-art', card);
        if (!picture) break;
        const sizes = [[210,148.2],[210,175],[210,175]][index];
        picture.style.width = `${sizes[0]}px`; picture.style.height = `${sizes[1]}px`;
        if (art) { art.style.clipPath = index === 2 ? 'inset(0 0 0 0)' : ''; art.style.transform = index === 2 ? 'scale(1.18)' : ''; }
        const lock = $('[data-aspect-lock]', card); if (lock) lock.checked = index !== 1;
        updatePictureReadout(card,sizes[0],sizes[1]);
        break;
      }
      case 'y2020q48': if(index===2) $$('[data-fill-row]',card).forEach((cell,i)=>cell.textContent=String(20260001+i)); break;
      case 'y2026q49':
        if(index===1||index===2) { text('[data-sum-result]','=SUM(A1:A3) → 329'); $$('.text-cell',card).forEach(x=>x.classList.add('converted')); }
        if(index===3) text('[data-sum-result]','=AVERAGEIF(B2:B6,"男",C2:C6) → 86');
        break;
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
      case 'y2020q12': {
        const thumb = $('.thumb-3', card);
        const stamp = $('[data-hidden-stamp]', card);
        if (index === 0) { thumb?.classList.add('is-hidden'); if(stamp)stamp.textContent='隐藏'; }
        if (index === 1) { thumb?.classList.remove('is-hidden'); if(stamp)stamp.textContent='正常放映'; }
        if (index === 2) { thumb?.remove(); if(stamp)stamp.textContent='已删除'; navigateSlide(card,'y2020q12',2); }
        break;
      }
      case 'y2026q54': {
        if (index === 2) {
          const generated = $('[data-generated-slide]', card);
          if (generated) generated.hidden = false;
          navigateSlide(card,'y2026q54',2);
        }
        break;
      }
      case 'merged-11': {
        if (index === 2) {
          text('[data-slide-number]','08');
          text('[data-slide-heading]','课程总结与练习');
          text('[data-slide-subtitle]','动作按钮已导航到指定的非相邻幻灯片。');
          text('[data-motion-page]','8 / 8');
          $('.ppt-main-slide', card)?.classList.add('page-changing');
        }
        break;
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
      case 'y2026q39': if(index===0){text('[data-vcpu]','8');text('[data-vram]','16 GB');text('[data-bill]','¥1.28/h');} else if(index===4){text('[data-instance-state]','已释放');text('[data-vcpu]','—');text('[data-vram]','—');text('[data-bill]','¥0.00/h');const resize=$('[data-sim-choice="0"]',card);if(resize)resize.disabled=true;} break;
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
      case 'merged-4':
        text('[data-v26-file-name]', index === 0 ? 'report' : 'report.docx');
        break;
      case 'y2023q18':
        text('[data-buffer-label]', ['缓冲 8.4 秒','缓冲 2.1 秒','缓冲 0 秒 · 卡顿','HTTPS 传输 · 缓冲 8.4 秒'][index]);
        break;
      case 'y2023q35':
        text('[data-media-page]', ['当前页','切换到下一页','第 2 页继续播放','重新开始'][index]);
        text('[data-media-playing]', index === 1 ? '视频随页面离开而停止' : '音频：持续播放');
        break;
      case 'y2023q45': {
        const states = [
          ['.pptx','进入编辑界面','编辑模式'],
          ['.ppsx','直接开始放映','放映模式'],
          ['.potx','以此创建新演示文稿','模板模式'],
          ['.ppsm','直接放映并允许宏','启用宏的放映']
        ][index] || ['.pptx','进入编辑界面','编辑模式'];
        text('[data-ppt-ext]', states[0]); text('[data-ppt-action]', states[1]); text('[data-launch-mode]', states[2]);
        break;
      }
      case 'y2024q41':
        text('[data-op-readout]', ['ADD → 算术加法','R1 → 寄存器操作数','2048 → 存储器地址','字段职责混淆：无法正确译码'][index]);
        break;
      case 'y2024q10':
        text('[data-clear-formula]', index === 0 || index === 2 ? '' : index === 3 ? '下一行上移到A2' : '128');
        break;
      case 'y2024q11': {
        const values = [['2*3','2*3 · 文本'],['=2*3','6'],['=2×3','#NAME?'],["'=2*3",'=2*3 · 文本']][index];
        text('[data-parse-input]', values[0]); text('[data-parse-result]', values[1]);
        break;
      }
      case 'y2024q49':
        text('[data-server-load]', ['200,000 req/s · 过载','异常流量已告警','恶意流量被清洗','等待日志证据'][index]);
        break;
      case 'y2024q36':
        text('[data-sql-command]', ["DELETE FROM student WHERE 班级='一班';",'DELETE FROM student;','DROP TABLE student;',"SELECT * FROM student WHERE 班级='一班';"][index]);
        break;
      case 'y2026q41': {
        const values = [['10001₂','17₁₀'],['11.11₂','3.C₁₆'],['0.1₁₀','0.000110011…₂'],['F₁₆','1111₂']][index];
        text('[data-radix-source]', values[0]); text('[data-radix-result]', values[1]);
        break;
      }
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
      case 'y2026q25': {
        if (stepIndex === 3) {
          const checkbox = $('[data-icon-checkbox]', card);
          if (checkbox) checkbox.checked = true;
        }
        break;
      }
      case 'y2020q41': if(stepIndex===3)$('[data-sequence-input="4"]',card)?.focus(); break;
      case 'y2020q61': if(stepIndex===0) text('[data-break-before]','✓ 前分节符'); if(stepIndex===1) text('[data-break-after]','✓ 后分节符'); break;
      case 'y2020q60': if(complete) $('[data-border-table]',card)?.classList.add('all-borders-applied'); break;
      case 'y2020q62': if(complete) $('[data-repeated-header]',card)?.classList.add('visible'); break;
      case 'y2026q36': if(stepIndex===0) $('.photo-object small',card).textContent='四周型环绕'; if(complete)$('[data-group-boundary]',card)?.classList.add('visible'); break;
      case 'merged-6': if(stepIndex===1) text('[data-caption]','图 1 模型准确率'); if(stepIndex===3) text('[data-cross-ref]','图 1'); break;
      case 'y2020q52': if(complete) $$('[data-score]',card).forEach(x=>x.classList.toggle('low',Number(x.textContent)<60)); break;
      case 'y2020q49': if(stepIndex===2){const box=$('[data-dialog-stage="duplicates"] input[data-sim-step]',card);if(box)box.checked=true;} if(complete) $('.duplicate-row',card)?.remove(); break;
      case 'y2020q58': if(stepIndex===0)$('[data-subtotal-table]',card)?.classList.add('sorted'); if(stepIndex===2){const box=$('[data-dialog-stage="subtotal"] input[data-sim-step]',card);if(box)box.checked=true;} if(complete)$('[data-subtotal-table]',card)?.classList.add('subtotaled'); break;
      case 'y2026q52': if(stepIndex===3)$('[data-secondary-axis]',card)?.classList.add('active'); break;
      case 'y2020q54': if(stepIndex===2)$('[data-background-slide]',card)?.classList.add('image-filled'); break;
      case 'merged-12': if(complete)$('[data-ppt-chart]',card)?.classList.add('play-series'); break;
      case 'y2026q55':
        if (complete) {
          $('[data-sim-step="2"]',card)?.remove();
          text('[data-scheme-count]','3 张幻灯片');
        }
        break;
      case 'y2026q15': if(stepIndex===0)text('[data-device-count]','0 · 热点已开'); if(stepIndex===1)text('[data-device-count]','1'); break;
      case 'merged-19': if(complete)$('[data-alert-screen]',card)?.classList.add('alerting'); break;
      default: break;
    }
    if (complete) card.classList.add('simulation-complete');
  }

  function refreshSequenceAvailability(card, demo) {
    if (demo?.kind !== 'sequence') return;
    const progress = Number(card.dataset.progress);
    $$('[data-v25-stage]',card).forEach(stage => { stage.hidden = Number(stage.dataset.v25Stage) !== progress; });
    $$('[data-sim-step],[data-sim-double-step],[data-sequence-input]', card).forEach(node => {
      const index = Number(node.dataset.simStep ?? node.dataset.simDoubleStep ?? node.dataset.sequenceInput);
      node.classList.toggle('is-current-step', index === progress);
      node.classList.toggle('is-past-step', index < progress);
      node.classList.toggle('is-future-step', index > progress);
      if (node.matches('[data-sequence-input]')) node.disabled = index !== progress;
      if (index === progress) node.setAttribute('aria-current','step'); else node.removeAttribute('aria-current');
    });
  }

  function initialiseSpecialScene(card, id) { if(card.querySelector('[data-lab]')){window.NOTE_LABS?.mount(card);return;} if (id === 'y2020q56') updateMid(card); if (id === 'y2026q42') updatePseudo(card); window.NOTE_LABS?.mount(card); }
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

  const openDrawer = () => { $('#drawer').hidden=false; $('#drawer').inert=false; $('#drawer').setAttribute('aria-hidden','false'); $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); document.body.style.overflow = 'hidden'; $('#close-drawer').focus(); };
  const closeDrawer = () => { if(!$('#drawer').classList.contains('open'))return; $('#drawer').classList.remove('open'); $('#drawer').hidden=true; $('#drawer').inert=true; $('#drawer').setAttribute('aria-hidden','true'); $('#scrim').classList.remove('open'); document.body.style.overflow = ''; $('#open-drawer').focus(); };
  $('#open-drawer').addEventListener('click', openDrawer); $('#close-drawer').addEventListener('click', closeDrawer); $('#scrim').addEventListener('click', closeDrawer);
  $('#drawer').addEventListener('click', event => { const link=event.target.closest('a'); if(link){closeDrawer(); revealNote(link.hash);} });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDrawer(); if (event.key === '/' && !event.isComposing && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable]') && !$('#drawer').classList.contains('open')) { event.preventDefault(); $('#search-input').focus(); } });
  $('#drawer').addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const items=$$('button,a', $('#drawer'));const first=items[0],last=items.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  const applySearch = () => {
    const query = $('#search-input').value.trim().toLowerCase(); let shown = 0;
    $$('.note-item').forEach(item => { const visible = !query || item.textContent.toLowerCase().includes(query); item.classList.toggle('hidden', !visible); if (visible) shown++; });
    $$('.section-block').forEach(section => section.classList.toggle('hidden', !$$('.note-item:not(.hidden)', section).length)); $('#result-count').textContent = `${shown}条笔记`;
  };
  $('#search-input').addEventListener('input', applySearch);
  function revealNote(hash){
    let id;try{id=decodeURIComponent(hash.slice(1));}catch{return;}
    const target=document.getElementById(id);if(!target)return;
    if(target.closest('.hidden')||target.classList.contains('hidden')){$('#search-input').value='';applySearch();}
    target.scrollIntoView({block:'start'});
  }
  addEventListener('hashchange',()=>revealNote(location.hash));
  if(location.hash)revealNote(location.hash);
  const updateProgress = () => { const root = document.documentElement; const max = root.scrollHeight - innerHeight; $('#progress-bar').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`; };
  addEventListener('scroll', updateProgress, {passive:true}); updateProgress();
})();
