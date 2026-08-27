(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const CHAPTERS = [
    { n: 1, name: '第1章 计算机基础' },
    { n: 2, name: '第2章 Windows 10' },
    { n: 3, name: '第3章 Word 2016' },
    { n: 4, name: '第4章 Excel 2016' },
  ];

  // Original React cards sometimes use an explanatory teaching headline as h2.
  // Keep directory labels deterministic and retrieval-oriented instead of depending
  // on whichever headline/kicker happens to be rendered by the current React build.
  const TITLE_OVERRIDES = {
    'concept-1': '信息与数据',
    'concept-2': '信息技术',
    'concept-3': '信息社会',
    'concept-4': '计算机文化',
    'concept-5': '计算机的起源与发展',
    'concept-6': '计算机的特点与分类',
    'concept-7': '计算机的应用',
    'concept-8': '计算机的发展趋势',
    'concept-9': '数制及其转换',
    'concept-10': '信息的编码',
    'concept-11': '计算机工作原理',
    'concept-12': '计算机硬件系统',
    'concept-13': '计算机软件系统',
    'concept-14': '计算机的主要性能指标',
    'concept-15': '常见微型计算机的硬件设备',
    'concept-16': '多媒体基础',
    'concept-21': '面向对象基础',
    'concept-21-queue': '队列与栈',
    'excel-1': 'Excel 2016 窗口界面',
    'excel-2': '工作簿与工作表',
    'excel-3': '单元格和单元格区域',
    'excel-4': '工作表管理',
    'excel-5': '输入和编辑数据',
    'excel-6': '行、列和单元格管理',
    'excel-7': '公式与引用',
    'excel-8': '常见函数',
    'excel-9': '批注',
    'excel-10': '格式化工作表',
    'excel-11': '自动套用格式和条件格式',
    'excel-12': '数据清单',
    'excel-13': '排序和筛选',
    'excel-14': '分类汇总',
    'excel-15': '合并计算',
    'excel-16': '数据透视表',
    'excel-17': '模拟分析',
    'excel-18': '数据清理、验证与外部导入',
    'excel-19': '图表简介',
    'excel-20': '创建和编辑图表',
    'excel-21': '迷你图',
    'excel-22': '页面布局与打印',
  };

  function currentChapter() {
    const hash = location.hash.match(/^#chapter-([1-4])/);
    if (hash) return Number(hash[1]);
    const q = new URLSearchParams(location.search).get('chapter');
    if (q && /^[1-4]$/.test(q)) return Number(q);
    if ($('.windows-page')) return 2;
    if ($('.word-page')) return 3;
    if ($('.excel-page')) return 4;
    return 1;
  }

  function chapterUrl(n) {
    return `./?v=7&chapter=${n}#chapter-${n}`;
  }

  function cleanTitle(text) {
    return (text || '')
      .trim()
      .replace(/^\d+[.、]?\s*/, '')
      .replace(/^Concept\s*\d+[:：]?\s*/i, '');
  }

  function sectionTitle(section) {
    if (TITLE_OVERRIDES[section.id]) return TITLE_OVERRIDES[section.id];

    const moduleTitle = $('.module-head h2', section);
    if (moduleTitle) return cleanTitle(moduleTitle.textContent) || section.id;

    const kicker = $('.concept-copy .kicker', section);
    if (kicker) {
      const raw = kicker.textContent.trim();
      const topic = raw.match(/^\s*\d+\s*[·.、]\s*(.+)$/);
      if (topic?.[1]) return cleanTitle(topic[1]) || section.id;
    }

    const heading = $('.concept-copy h2, h2, .section-heading h3, h3', section);
    return cleanTitle(heading?.textContent) || section.id;
  }

  function currentSections() {
    const selector = {
      1: '.concept[id^="concept-"]',
      2: '.course-module[id^="windows-"]',
      3: '.course-module[id^="word-"]',
      4: '.excel-concept[id^="excel-"]',
    }[currentChapter()];
    return selector ? $$(selector).filter(el => el.offsetParent !== null) : [];
  }

  function removeLegacyDirectories() {
    [
      '.chapter-menu-trigger',
      '.chapter-drawer-scrim',
      '.chapter-drawer',
      '.study-hub-trigger',
      '.study-hub-scrim',
      '.study-hub',
      '.course-catalogue',
      '#v6-chapter-catalogue',
      '.v6-catalogue-host',
    ].forEach(selector => $$(selector).forEach(el => {
      if (!el.closest('.v7-directory')) el.remove();
    }));
  }

  function normalizeVisibleChapterNavs() {
    $$('nav').forEach(nav => {
      const links = $$(':scope > a[data-chapter]', nav);
      if (links.length < 4) return;
      const byChapter = new Map();
      links.forEach(link => {
        const n = Number(link.dataset.chapter);
        if (n >= 1 && n <= 4 && !byChapter.has(n)) byChapter.set(n, link);
      });
      if (byChapter.size !== 4) return;
      CHAPTERS.forEach(({n}) => {
        const link = byChapter.get(n);
        const span = $('span', link);
        const b = $('b', link);
        if (span) span.textContent = String(n).padStart(2, '0');
        if (b) b.textContent = CHAPTERS[n - 1].name.replace(/^第\d章\s*/, '');
        nav.appendChild(link);
      });
    });
  }

  function menuSignature() {
    return `${currentChapter()}::${currentSections().map(s => `${s.id}:${sectionTitle(s)}`).join('|')}`;
  }

  function buildUnifiedDirectory() {
    if ($('#v7-directory-trigger')) return;

    const trigger = document.createElement('button');
    trigger.id = 'v7-directory-trigger';
    trigger.className = 'v7-directory-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'v7-directory-panel');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<span aria-hidden="true">☰</span><b>目录</b>';

    const scrim = document.createElement('button');
    scrim.className = 'v7-directory-scrim';
    scrim.type = 'button';
    scrim.setAttribute('aria-label', '关闭目录');

    const panel = document.createElement('aside');
    panel.id = 'v7-directory-panel';
    panel.className = 'v7-directory';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'v7-directory-title');
    panel.innerHTML = `
      <header class="v7-directory-head">
        <div><small>CONTENTS</small><h2 id="v7-directory-title">目录</h2></div>
        <button type="button" data-v7-close aria-label="关闭目录">×</button>
      </header>
      <section class="v7-directory-chapters">
        <h3>章节</h3>
        <div data-v7-chapters></div>
      </section>
      <section class="v7-directory-points">
        <div class="v7-directory-points-head"><h3>本章知识点</h3><span data-v7-count></span></div>
        <label class="v7-directory-search"><span>⌕</span><input type="search" data-v7-search placeholder="搜索本章知识点" autocomplete="off"></label>
        <nav data-v7-points></nav>
      </section>`;

    document.body.append(trigger, scrim, panel);

    const open = () => {
      renderUnifiedDirectory(true);
      panel.classList.add('is-open');
      scrim.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('v7-directory-open');
      requestAnimationFrame(() => $('[data-v7-close]', panel)?.focus());
    };
    const close = () => {
      panel.classList.remove('is-open');
      scrim.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('v7-directory-open');
    };

    trigger.addEventListener('click', open);
    scrim.addEventListener('click', close);
    $('[data-v7-close]', panel).addEventListener('click', close);
    $('[data-v7-search]', panel).addEventListener('input', () => renderPoints(panel));

    panel.addEventListener('click', event => {
      const chapterButton = event.target.closest('[data-v7-chapter]');
      if (chapterButton) {
        const n = Number(chapterButton.dataset.v7Chapter);
        if (n === currentChapter()) {
          close();
          window.scrollTo({top: 0, behavior: 'auto'});
        } else {
          location.assign(chapterUrl(n));
        }
        return;
      }

      const point = event.target.closest('[data-v7-point]');
      if (point) {
        const target = document.getElementById(point.dataset.v7Point);
        if (!target) return;
        close();
        target.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
        history.replaceState({}, '', `./?v=7&chapter=${currentChapter()}#${target.id}`);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) close();
    });
  }

  function renderChapters(panel) {
    const current = currentChapter();
    const box = $('[data-v7-chapters]', panel);
    if (!box) return;
    box.innerHTML = CHAPTERS.map(({n, name}) => `
      <button type="button" data-v7-chapter="${n}" class="${n === current ? 'is-current' : ''}">
        <span>${String(n).padStart(2, '0')}</span>
        <b>${name}</b>
        <i>${n === current ? '当前' : '进入'}</i>
      </button>`).join('');
  }

  function renderPoints(panel) {
    const sections = currentSections();
    const input = $('[data-v7-search]', panel);
    const term = input?.value.trim().toLowerCase() || '';
    const items = sections
      .map((section, index) => ({ id: section.id, title: sectionTitle(section), index }))
      .filter(item => !term || item.title.toLowerCase().includes(term));

    const count = $('[data-v7-count]', panel);
    if (count) count.textContent = `${sections.length} 个`;

    const nav = $('[data-v7-points]', panel);
    if (!nav) return;
    nav.innerHTML = items.length ? items.map(item => `
      <button type="button" data-v7-point="${item.id}">
        <span>${String(item.index + 1).padStart(2, '0')}</span>
        <b>${item.title}</b>
      </button>`).join('') : '<p class="v7-directory-empty">没有找到匹配的知识点。</p>';
  }

  function renderUnifiedDirectory(force = false) {
    const panel = $('#v7-directory-panel');
    if (!panel) return;
    const signature = menuSignature();
    if (!force && panel.dataset.signature === signature) return;
    panel.dataset.signature = signature;
    renderChapters(panel);
    renderPoints(panel);
  }

  function apply() {
    removeLegacyDirectories();
    normalizeVisibleChapterNavs();
    buildUnifiedDirectory();
    renderUnifiedDirectory();
  }

  function init() {
    apply();
    const root = $('#root');
    if (root) {
      let scheduled = false;
      new MutationObserver(() => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          apply();
        });
      }).observe(root, {childList: true, subtree: true});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once: true});
  } else {
    init();
  }
})();
