(() => {
  'use strict';
  const data = window.NOTES2020;
  const page = document.body.dataset.chapter;
  const chapterNumber = Number(page);
  const chapter = data.chapters.find(item => item.number === chapterNumber);
  const notes = data.notes.filter(item => item.chapter === chapterNumber);

  document.body.insertAdjacentHTML('afterbegin', `
    <a class="skip-link" href="#main-content">跳到正文</a>
    <header class="site-header">
      <a class="brand" href="./index.html?v=10"><span class="brand-mark">20</span><span class="brand-copy"><strong>计算机系统笔记</strong><small id="brand-chapter">2020真题来源</small></span></a>
      <div class="header-actions"><a href="./index.html?v=10">全部章节</a><button id="open-drawer" type="button">目录</button></div>
    </header>
    <div class="progress" aria-hidden="true"><i id="progress-bar"></i></div>
    <aside class="drawer" id="drawer" aria-label="章节与题号目录">
      <div class="drawer-head"><div><small>2020真题来源笔记</small><strong>章节目录</strong></div><button id="close-drawer" type="button" aria-label="关闭目录">×</button></div>
      <ol class="chapter-list" id="chapter-list"></ol><ol class="note-list" id="note-list"></ol>
    </aside>
    <button class="scrim" id="scrim" type="button" aria-label="关闭目录"></button>
    <main id="main-content">
      <section class="chapter-intro" id="chapter-top">
        <p class="chapter-kicker" id="chapter-kicker"></p><h1 id="chapter-title"></h1><p class="chapter-summary" id="chapter-summary"></p>
        <div class="chapter-meta"><span id="chapter-count"></span><span>逐题追溯</span><span>现行口径校正</span></div>
        <p class="method-note">题号只表示知识点来自2020年真题。正文不保留过时答案：软件操作按Office 2016整理，其他内容按现行考纲或标准概念表述。</p>
      </section>
      <section class="chapter-tools" aria-label="搜索本章笔记"><div class="search"><span aria-hidden="true">⌕</span><label class="sr-only" for="search-input">搜索本章</label><input id="search-input" type="search" placeholder="搜索本章知识点" autocomplete="off"></div><span class="count" id="result-count"></span></section>
      <div id="notes-root"></div>
    </main>
    <footer class="site-footer"><p>教材目录为页面骨架；知识点由2020年真题逐题反推，并按现行范围校正。</p><a href="https://www.sdzk.cn/NewsInfo.aspx?BCID=1195&amp;CID=1133&amp;NewsID=7081" target="_blank" rel="noreferrer">现行考试要求</a></footer>
    <nav class="mobile-nav" aria-label="移动端快捷导航"><a href="#chapter-top"><span>↑</span>章首</a><button id="mobile-directory" type="button"><span>☰</span>目录</button><button id="mobile-search" type="button"><span>⌕</span>搜索</button><a href="#notes-root"><span>↓</span>正文</a></nav>`);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  if (!chapter) return;
  document.title = `第${chapter.number}章 ${chapter.title}｜2020真题来源笔记`;
  $('#brand-chapter').textContent = `第${chapter.number}章 · 2020真题来源`;
  $('#chapter-kicker').textContent = `教材第${chapter.number}章 · 2020年真题逐题整理`;
  $('#chapter-title').textContent = chapter.title;
  $('#chapter-summary').textContent = chapter.summary;
  $('#chapter-count').textContent = `${notes.length}道题命中`;
  $('#result-count').textContent = `${notes.length}条笔记`;

  const grouped = chapter.sections.map(section => ({...section, notes: notes.filter(note => note.section === section.id)})).filter(section => section.notes.length);
  $('#notes-root').innerHTML = grouped.length ? grouped.map(section => `
    <section class="section-block" id="section-${section.id.replace('.', '-')}">
      <header class="section-head"><p>${section.id}</p><h2>${section.title}</h2></header>
      ${section.notes.map(renderNote).join('')}
    </section>`).join('') : `<section class="empty-year"><h2>2020年未命中本章</h2><p>这一年没有能够归入本章的题目，因此不凭空补写知识点。后续年份出现本章题目时，再按题号追加。</p></section>`;

  $('#chapter-list').innerHTML = data.chapters.map(item => {
    const count = data.notes.filter(note => note.chapter === item.number).length;
    return `<li><a href="./chapter${item.number}.html?v=10" class="${item.number === chapterNumber ? 'active' : ''}"><b>${String(item.number).padStart(2,'0')}</b><span>${item.title}</span><small>${count || '—'}</small></a></li>`;
  }).join('');
  $('#note-list').innerHTML = notes.length ? `<strong>本章题号</strong>${notes.map(note => `<li><a href="#q${note.q}"><span>第${note.q}题</span><b>${note.title}</b></a></li>`).join('')}` : '';

  function renderNote(note) {
    return `<article class="note-item" id="q${note.q}">
      <div class="note-source"><span>2020 · 第${note.q}题</span><small>${note.type} · ${note.topic}</small></div>
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
  $('#mobile-directory').addEventListener('click', open);
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
  $('#mobile-search').addEventListener('click', () => { $('#search-input').scrollIntoView({behavior:'smooth',block:'center'}); $('#search-input').focus(); });
  const updateProgress = () => { const root = document.documentElement; const max = root.scrollHeight - innerHeight; $('#progress-bar').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`; };
  addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();
})();
