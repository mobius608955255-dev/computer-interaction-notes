(() => {
  'use strict';

  // v8 is the single-page shell. Set the flag immediately, before DOMContentLoaded,
  // so the older v6 full-page navigation never installs.
  window.__notesUnifiedSpaV8 = true;
  window.__notesV6NavInstalled = true;

  const CHAPTERS = {
    1: { name: '第1章 计算机基础', prefix: 'concept' },
    2: { name: '第2章 Windows 10', prefix: 'windows' },
    3: { name: '第3章 Word 2016', prefix: 'word' },
    4: { name: '第4章 Excel 2016', prefix: 'excel' },
  };

  // Stable IDs stay unchanged for old links and enhancement hooks. Only the visible
  // learning sequence is normalized here, so later coverage modules sit beside the
  // concepts they extend instead of being dumped at the end of a chapter.
  const COURSE_ORDER = {
    2: [
      'windows-1','windows-2','windows-3','windows-4',
      'windows-5','windows-6','windows-7','windows-8','windows-9','windows-22','windows-15',
      'windows-10','windows-17','windows-18','windows-11','windows-12','windows-23',
      'windows-13','windows-14','windows-19','windows-21','windows-20',
      'windows-16',
    ],
    3: [
      'word-1','word-2','word-3','word-4','word-5','word-21','word-6','word-7',
      'word-8','word-9','word-10','word-11','word-12','word-13','word-14','word-22','word-23',
      'word-15','word-16','word-17','word-18','word-19','word-20',
    ],
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function reactRoot() {
    return document.getElementById('root');
  }

  function ensureCustomRoot() {
    let root = document.getElementById('notes-custom-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'notes-custom-root';
      root.className = 'notes-custom-root v8-hidden';
      const original = reactRoot();
      if (original?.parentNode) original.parentNode.insertBefore(root, original.nextSibling);
      else document.body.appendChild(root);
    }
    return root;
  }

  // v5 asks document.querySelector('#root') before rendering chapters 2/3.
  // Redirect only that render call to the sibling custom root, so React is never destroyed.
  if (!window.__notesV8QueryPatched) {
    window.__notesV8QueryPatched = true;
    const nativeQuery = Document.prototype.querySelector;
    Document.prototype.querySelector = function(selector) {
      if (this === document && selector === '#root') {
        const stack = new Error().stack || '';
        if (window.__notesV8RedirectRoot || stack.includes('renderCustomChapter')) {
          const original = document.getElementById('root');
          const custom = ensureCustomRoot();
          original?.classList.add('v8-hidden');
          custom.classList.remove('v8-hidden');
          return custom;
        }
      }
      return nativeQuery.call(this, selector);
    };
  }

  // Prevent v6 from inserting its obsolete in-page knowledge catalogue.
  if (!window.__notesV8InsertPatched) {
    window.__notesV8InsertPatched = true;
    const nativeInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
      if (window.__notesUnifiedSpaV8 && newNode instanceof Element &&
          (newNode.id === 'v6-chapter-catalogue' || newNode.classList.contains('v6-catalogue-host'))) {
        return newNode;
      }
      return nativeInsertBefore.call(this, newNode, referenceNode);
    };
  }

  function currentChapter() {
    const hash = location.hash.match(/^#chapter-([1-4])$/);
    if (hash) return Number(hash[1]);
    const query = new URLSearchParams(location.search).get('chapter');
    if (query && /^[1-4]$/.test(query)) return Number(query);
    const section = location.hash.match(/^#(concept|windows|word|excel)-/);
    if (section) return { concept:1, windows:2, word:3, excel:4 }[section[1]];
    if (!$('.v8-hidden.windows-page') && $('.windows-page')) return 2;
    if (!$('.v8-hidden.word-page') && $('.word-page')) return 3;
    if ($('.excel-page')) return 4;
    return 1;
  }

  function chapterUrl(n, anchor = '') {
    const hash = anchor || `#chapter-${n}`;
    return `./?v=8&chapter=${n}${hash}`;
  }

  function validSectionHash(n, hash = location.hash) {
    const prefix = CHAPTERS[n].prefix;
    return new RegExp(`^#${prefix}-\\d+`).test(hash) ? hash : `#chapter-${n}`;
  }

  function showContainers(n) {
    const original = reactRoot();
    const custom = ensureCustomRoot();
    const customChapter = n === 2 || n === 3;
    original?.classList.toggle('v8-hidden', customChapter);
    custom.classList.toggle('v8-hidden', !customChapter);
    document.body.dataset.notesChapter = String(n);
  }

  function switchReactChapter(n) {
    if (n !== 1 && n !== 4) return;
    const anchor = document.createElement('a');
    anchor.href = n === 4 ? '/excel' : '/';
    anchor.dataset.v8ReactInternal = '1';
    anchor.hidden = true;
    // Never allow the temporary link to perform native navigation if the React listener is absent.
    anchor.addEventListener('click', event => event.preventDefault());
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function closeDirectory() {
    $('#v7-directory-panel')?.classList.remove('is-open');
    $('.v7-directory-scrim')?.classList.remove('is-open');
    $('#v7-directory-trigger')?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('v7-directory-open');
  }

  function normalizeTextAndChrome() {
    // Delete duplicate maps/catalogues and all count/status chrome.
    [
      '#catalogue',
      '#excel-catalogue',
      '.catalogue.section-shell',
      '.course-catalogue',
      '.hero-stats',
      '.hero-score',
      '.exam-ribbon',
      '#v6-chapter-catalogue',
      '.v6-catalogue-host',
      '[data-v7-count]',
    ].forEach(selector => $$(selector).forEach(el => el.remove()));

    // A removed chapter map must not leave a dead “start here” anchor behind.
    $$('a[href="#catalogue"]').forEach(a => a.setAttribute('href', '#concept-1'));
    $$('a[href="#excel-catalogue"]').forEach(a => a.setAttribute('href', '#excel-1'));

    // Keep chapter 2/3 terminology note-first rather than exercise-first.
    $$('.module-head small').forEach(el => {
      if (el.textContent.trim() === '最小命题颗粒') el.textContent = '核心知识点';
    });
    $$('.course-hero small').forEach(el => {
      el.textContent = '核心规则 · 易错辨析 · 操作演示 · 一条线记住';
    });

    // One top-right directory means the older visible chapter navs are no longer navigation UI.
    $$('.chapter-nav, .course-topbar nav').forEach(el => el.setAttribute('aria-hidden', 'true'));
  }

  function normalizeCourseModuleOrder(n = currentChapter()) {
    if (n !== 2 && n !== 3) return;
    const page = n === 2 ? $('.windows-page', ensureCustomRoot()) : $('.word-page', ensureCustomRoot());
    const footer = page && $('.course-footer', page);
    if (!page || !footer) return;

    const modules = $$('.course-module[id]', page);
    if (!modules.length) return;
    const byId = new Map(modules.map(module => [module.id, module]));
    const desiredIds = COURSE_ORDER[n].filter(id => byId.has(id));
    const unknownIds = modules.map(module => module.id).filter(id => !COURSE_ORDER[n].includes(id));

    // Preserve any future unknown module instead of deleting it. Keep the Windows
    // synthesis module and Word final-check module at the very end whenever present.
    const terminalId = n === 2 ? 'windows-16' : 'word-20';
    const terminalIndex = desiredIds.indexOf(terminalId);
    if (unknownIds.length) {
      if (terminalIndex >= 0) desiredIds.splice(terminalIndex, 0, ...unknownIds);
      else desiredIds.push(...unknownIds);
    }

    const currentIds = modules.map(module => module.id);
    if (currentIds.join('|') !== desiredIds.join('|')) {
      desiredIds.forEach(id => footer.before(byId.get(id)));
    }

    // IDs remain stable, but visible ordinal numbers should follow the learning order.
    $$('.course-module[id]', page).forEach((module, index) => {
      const badge = $('.module-head > span', module);
      const number = String(index + 1).padStart(2, '0');
      if (badge && badge.textContent.trim() !== number) badge.textContent = number;
    });
  }

  function normalizeDocument(n = currentChapter()) {
    const label = CHAPTERS[n]?.name || CHAPTERS[1].name;
    document.title = `${label}｜山东专升本计算机交互笔记`;
    const meta = $('meta[name="description"]');
    if (meta) meta.content = `山东专升本计算机交互笔记：${label}详细笔记。`;

    const anchor = validSectionHash(n);
    const desired = chapterUrl(n, anchor);
    const here = `${location.pathname}${location.search}${location.hash}`;
    const target = new URL(desired, location.href);
    const normalized = `${target.pathname}${target.search}${target.hash}`;
    if (here !== normalized) history.replaceState(history.state, '', desired);

    normalizeCourseModuleOrder(n);
    normalizeTextAndChrome();
    document.dispatchEvent(new CustomEvent('notes:chapterchange', { detail: { chapter: n } }));
  }

  function renderCustomChapter(n, push) {
    const url = chapterUrl(n);
    if (push) history.pushState({}, '', url);
    else history.replaceState(history.state, '', url);
    showContainers(n);

    window.__notesV8SyntheticPop = true;
    window.__notesV8RedirectRoot = true;
    try {
      window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    } finally {
      window.__notesV8RedirectRoot = false;
      window.__notesV8SyntheticPop = false;
    }

    requestAnimationFrame(() => {
      normalizeDocument(n);
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  function renderReactChapter(n, push) {
    const url = chapterUrl(n);
    if (push) history.pushState({}, '', url);
    else history.replaceState(history.state, '', url);
    showContainers(n);
    switchReactChapter(n);
    requestAnimationFrame(() => {
      normalizeDocument(n);
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  function navigateChapter(n, options = {}) {
    n = Number(n);
    if (!(n >= 1 && n <= 4)) return;
    const push = options.push !== false;
    const current = currentChapter();
    closeDirectory();

    if (n === current && !options.force) {
      showContainers(n);
      history.replaceState(history.state, '', chapterUrl(n));
      window.scrollTo({ top: 0, behavior: 'auto' });
      normalizeDocument(n);
      return;
    }

    if (n === 2 || n === 3) renderCustomChapter(n, push);
    else renderReactChapter(n, push);
  }

  window.__notesNavigateChapter = navigateChapter;

  function chapterFromClick(target) {
    const chapterButton = target.closest?.('[data-v7-chapter]');
    if (chapterButton) return Number(chapterButton.dataset.v7Chapter);

    const link = target.closest?.('a');
    if (!link || link.dataset.v8ReactInternal === '1') return 0;
    if (link.dataset.chapter && /^[1-4]$/.test(link.dataset.chapter)) return Number(link.dataset.chapter);
    const href = link.getAttribute('href') || '';
    if (href === '/excel') return 4;
    if (href === '/') return 1;
    const match = href.match(/(?:chapter=|#chapter-)([1-4])/);
    return match ? Number(match[1]) : 0;
  }

  function installNavigation() {
    if (window.__notesV8NavigationInstalled) return;
    window.__notesV8NavigationInstalled = true;

    document.addEventListener('click', event => {
      const internal = event.target.closest?.('[data-v8-react-internal]');
      if (internal) return;

      const point = event.target.closest?.('[data-v7-point]');
      if (point) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const target = document.getElementById(point.dataset.v7Point);
        if (!target) return;
        closeDirectory();
        const n = currentChapter();
        history.replaceState(history.state, '', chapterUrl(n, `#${target.id}`));
        target.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
        return;
      }

      const n = chapterFromClick(event.target);
      if (!n) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      navigateChapter(n);
    }, true);

    window.addEventListener('popstate', () => {
      if (window.__notesV8SyntheticPop) return;
      const n = currentChapter();
      showContainers(n);
      if (n === 1 || n === 4) switchReactChapter(n);
      requestAnimationFrame(() => normalizeDocument(n));
    });
  }

  function init() {
    document.body.classList.add('v8-single-page');
    ensureCustomRoot();
    installNavigation();

    const n = currentChapter();
    showContainers(n);
    normalizeTextAndChrome();

    // v5 initializes chapters 2/3 in a 0ms task after DOMContentLoaded.
    // Its #root lookup is redirected by the prototype patch above.
    if (n === 1 || n === 4) requestAnimationFrame(() => normalizeDocument(n));

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        normalizeTextAndChrome();
        const chapter = currentChapter();
        showContainers(chapter);
        if (chapter === 2 || chapter === 3) normalizeCourseModuleOrder(chapter);
        if ((chapter === 2 || chapter === 3) && ensureCustomRoot().children.length) normalizeDocument(chapter);
      });
    });
    const original = reactRoot();
    if (original) observer.observe(original, { childList: true, subtree: true });
    observer.observe(ensureCustomRoot(), { childList: true, subtree: true });

    // v7 is built before this init; remove its count once, and keep it absent if re-rendered.
    const bodyObserver = new MutationObserver(() => normalizeTextAndChrome());
    bodyObserver.observe(document.body, { childList: true, subtree: false });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
