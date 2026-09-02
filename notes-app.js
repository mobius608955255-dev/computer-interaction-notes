(() => {
  'use strict';

  const data = window.NOTES;
  const chapterNumber = Number(document.body.dataset.chapter);
  const chapter = data.chapters.find(item => item.number === chapterNumber);
  const notes = data.notes.filter(item => item.chapter === chapterNumber);
  const sourceCount = notes.reduce((sum, note) => sum + note.sources.length, 0);
  const version = 13;
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
    return `<article class="note-item" id="${note.id}">
      <div class="note-source">${sources}<small>${note.topic}</small></div>
      <h3>${note.title}</h3>
      <p class="trigger">${note.trigger}</p>
      <p class="conclusion"><b>核心结论：</b>${note.conclusion}</p>
      <ul class="points">${note.points.map(point => `<li>${point}</li>`).join('')}</ul>
      <p class="boundary"><b>易错边界：</b>${note.boundary}</p>
      ${note.version ? `<span class="version-note">${note.version}</span>` : ''}
    </article>`;
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
