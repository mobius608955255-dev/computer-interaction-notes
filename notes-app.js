(() => {
  'use strict';

  const data = window.NOTES;
  const chapterNumber = Number(document.body.dataset.chapter);
  const chapter = data.chapters.find(item => item.number === chapterNumber);
  const notes = data.notes.filter(item => item.chapter === chapterNumber);
  const sourceCount = notes.reduce((sum, note) => sum + note.sources.length, 0);
  const demos = window.NOTE_DEMOS;
  const version = 14;
  const chapterUrl = number => `./chapter${number}.html?v=${version}`;
  const homeUrl = `./index.html?v=${version}`;

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
  if (!chapter) return;

  document.title = `第${chapter.number}章 ${chapter.title}｜计算机系统笔记`;
  $('#brand-chapter').textContent = `第${chapter.number}章 · 历年真题整理`;
  $('#chapter-kicker').textContent = `教材第${chapter.number}章 · 历年真题整理`;
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
    const demo = demos[note.id];
    return `<article class="note-item" id="${note.id}">
      <div class="note-source">${sources}<small>${note.topic}</small></div>
      <h3>${note.title}</h3>
      <p class="trigger">${note.trigger}</p>
      <p class="conclusion"><b>核心结论：</b>${note.conclusion}</p>
      <ul class="points">${note.points.map(point => `<li>${point}</li>`).join('')}</ul>
      <p class="boundary"><b>易错边界：</b>${note.boundary}</p>
      ${renderDemo(note, demo)}
      ${note.version ? `<span class="version-note">${note.version}</span>` : ''}
    </article>`;
  }

  function renderDemo(note, demo) {
    if (!demo) return '';
    const bodyId = `demo-${note.id}`;
    const types = [...new Set(note.sources.map(source => source.type))];
    const isOperation = types.some(type => type === '操作' || type === '分析' || type === '综合');
    const label = isOperation ? '操作题重点演示' : `${types.join('、')}考法演示`;
    return `<section class="exam-demo ${isOperation ? 'operation-demo' : ''}" data-exam-demo data-kind="${demo.kind}" data-progress="0">
      <button class="demo-toggle" type="button" aria-expanded="false" aria-controls="${bodyId}">
        <span><small>${label}</small><b>${demo.title}</b></span><i aria-hidden="true">开始操作</i>
      </button>
      <div class="demo-body" id="${bodyId}" hidden>
        <p class="demo-task">${demo.task}</p>
        ${renderDemoControls(demo)}
      </div>
    </section>`;
  }

  function renderDemoControls(demo) {
    if (demo.kind === 'sequence') {
      const order = demo.steps.map((_, index) => index);
      if (order.length > 1) order.push(order.shift());
      return `<div class="sequence-meter"><i data-sequence-meter></i></div>
        <div class="sequence-path" data-sequence-path><span>按正确顺序点击下方步骤</span></div>
        <div class="demo-controls sequence-controls">${order.map(index => `<button type="button" data-sequence-step="${index}">${demo.steps[index].label}</button>`).join('')}</div>
        <div class="demo-stage" data-demo-stage aria-live="polite"><small>等待操作</small><strong>先找第一步</strong><p>完成一步后会显示它为什么必须放在这里。</p></div>
        <button class="demo-reset" type="button" data-demo-reset>重新演示</button>`;
    }
    const items = demo.kind === 'choose' ? demo.options : demo.actions;
    return `<div class="demo-controls">${items.map((item, index) => `<button type="button" data-demo-action="${index}" aria-pressed="false">${item.label}</button>`).join('')}</div>
      <div class="demo-stage" data-demo-stage aria-live="polite"><small>${demo.kind === 'choose' ? '等待判断' : '当前状态'}</small><strong>${demo.kind === 'choose' ? '点一个选项，看判断依据' : demo.initial}</strong><p>${demo.kind === 'choose' ? '这里不计分，只展示考试为什么这样判断。' : '选择上方操作，观察状态怎样改变。'}</p></div>`;
  }

  $('#notes-root').addEventListener('click', event => {
    const card = event.target.closest('[data-exam-demo]');
    if (!card) return;
    const noteId = card.closest('.note-item').id;
    const demo = demos[noteId];

    const toggle = event.target.closest('.demo-toggle');
    if (toggle) {
      const body = card.querySelector('.demo-body');
      const opening = body.hidden;
      body.hidden = !opening;
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.querySelector('i').textContent = opening ? '收起演示' : '开始操作';
      return;
    }

    const action = event.target.closest('[data-demo-action]');
    if (action) {
      const item = (demo.kind === 'choose' ? demo.options : demo.actions)[Number(action.dataset.demoAction)];
      card.querySelectorAll('[data-demo-action]').forEach(button => {
        const active = button === action;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      setStage(card, demo.kind === 'choose' ? '操作结果' : item.stage, item.label, item.result, item.tone);
      return;
    }

    const stepButton = event.target.closest('[data-sequence-step]');
    if (stepButton) {
      const progress = Number(card.dataset.progress);
      const chosen = Number(stepButton.dataset.sequenceStep);
      const expected = demo.steps[progress];
      if (chosen !== progress) {
        setStage(card, '顺序提示', '这一步还没到', `当前应先完成：${expected.label}`, 'bad');
        stepButton.classList.remove('nudge');
        requestAnimationFrame(() => stepButton.classList.add('nudge'));
        return;
      }
      stepButton.disabled = true;
      stepButton.classList.add('done');
      const nextProgress = progress + 1;
      card.dataset.progress = String(nextProgress);
      const path = card.querySelector('[data-sequence-path]');
      if (progress === 0) path.innerHTML = '';
      path.insertAdjacentHTML('beforeend', `<span>${progress + 1}. ${expected.label}</span>`);
      card.querySelector('[data-sequence-meter]').style.width = `${nextProgress / demo.steps.length * 100}%`;
      setStage(card, `第${progress + 1}步`, expected.label, expected.detail, nextProgress === demo.steps.length ? 'good' : '');
      if (nextProgress === demo.steps.length) card.querySelector('[data-demo-stage] small').textContent = '操作完成';
      return;
    }

    if (event.target.closest('[data-demo-reset]')) resetSequence(card);
  });

  function setStage(card, label, title, text, tone = '') {
    const stage = card.querySelector('[data-demo-stage]');
    stage.className = `demo-stage ${tone ? `tone-${tone}` : ''}`;
    stage.innerHTML = `<small>${label}</small><strong>${title}</strong><p>${text}</p>`;
  }

  function resetSequence(card) {
    card.dataset.progress = '0';
    card.querySelectorAll('[data-sequence-step]').forEach(button => { button.disabled = false; button.classList.remove('done', 'nudge'); });
    card.querySelector('[data-sequence-meter]').style.width = '0';
    card.querySelector('[data-sequence-path]').innerHTML = '<span>按正确顺序点击下方步骤</span>';
    setStage(card, '等待操作', '先找第一步', '完成一步后会显示它为什么必须放在这里。');
  }

  const open = () => { $('#drawer').classList.add('open'); $('#scrim').classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { $('#drawer').classList.remove('open'); $('#scrim').classList.remove('open'); document.body.style.overflow = ''; };
  $('#open-drawer').addEventListener('click', open);
  $('#close-drawer').addEventListener('click', close);
  $('#scrim').addEventListener('click', close);
  $('#drawer').addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) { event.preventDefault(); $('#search-input').focus(); } });

  const applySearch = () => {
    const query = $('#search-input').value.trim().toLowerCase();
    let shown = 0;
    $$('.note-item').forEach(item => { const visible = !query || item.textContent.toLowerCase().includes(query); item.classList.toggle('hidden', !visible); if (visible) shown++; });
    $$('.section-block').forEach(section => section.classList.toggle('hidden', !$$('.note-item:not(.hidden)', section).length));
    $('#result-count').textContent = `${shown}条笔记`;
  };
  $('#search-input').addEventListener('input', applySearch);
  const updateProgress = () => { const root = document.documentElement; const max = root.scrollHeight - innerHeight; $('#progress-bar').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`; };
  addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();
})();
