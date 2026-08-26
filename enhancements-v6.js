(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function chapterFromHref(href) {
    if (!href) return 0;
    const m = String(href).match(/(?:chapter=|#chapter-)([1-4])/);
    return m ? Number(m[1]) : 0;
  }

  function currentChapter() {
    const byHash = location.hash.match(/^#chapter-([1-4])/);
    if (byHash) return Number(byHash[1]);
    const byQuery = new URLSearchParams(location.search).get('chapter');
    if (byQuery && /^[1-4]$/.test(byQuery)) return Number(byQuery);
    if ($('.windows-page')) return 2;
    if ($('.word-page')) return 3;
    if ($('.excel-page')) return 4;
    return 1;
  }

  function chapterUrl(n) {
    return `./?v=6&chapter=${n}#chapter-${n}`;
  }

  // v5 在 2/3 章使用 root.innerHTML 局部换页，而 1/4 章仍由原 React 页面接管。
  // 统一跨章为完整页面导航，避免两套路由和 MutationObserver 互相覆盖导致卡死。
  function installStableChapterNavigation() {
    if (window.__notesV6NavInstalled) return;
    window.__notesV6NavInstalled = true;
    document.addEventListener('click', event => {
      const link = event.target.closest('a[data-chapter], a[href*="chapter="], a[href*="#chapter-"]');
      if (!link) return;
      const target = Number(link.dataset.chapter || chapterFromHref(link.getAttribute('href')));
      if (!(target >= 1 && target <= 4)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (target === currentChapter()) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        history.replaceState({}, '', chapterUrl(target));
        return;
      }
      location.assign(chapterUrl(target));
    }, true);
  }

  function sortChapterNavigation() {
    $$('nav').forEach(nav => {
      const links = $$(':scope > a[data-chapter]', nav);
      const nums = [...new Set(links.map(a => Number(a.dataset.chapter)).filter(n => n >= 1 && n <= 4))];
      if (nums.length < 4) return;
      links.sort((a, b) => Number(a.dataset.chapter) - Number(b.dataset.chapter)).forEach(a => nav.appendChild(a));
    });
  }

  function sectionTitle(section) {
    const heading = $('h2, .section-heading h3, h3', section);
    return (heading?.textContent || section.id)
      .trim()
      .replace(/^\d+[.、]?\s*/, '')
      .replace(/^Concept\s*\d+[:：]?\s*/i, '');
  }

  function visibleChapterSections() {
    const chapter = currentChapter();
    const selectors = {
      1: '.concept[id^="concept-"]',
      2: '.course-module[id^="windows-"]',
      3: '.course-module[id^="word-"]',
      4: '.excel-concept[id^="excel-"]'
    };
    return $$(selectors[chapter] || '').filter(el => el.offsetParent !== null);
  }

  function buildCatalogueDetails(sections) {
    const details = document.createElement('details');
    details.className = 'v6-knowledge-catalogue';
    details.innerHTML = `
      <summary>
        <span><b>知识点目录</b><small>${sections.length} 个知识模块 · 默认收起</small></span>
        <i aria-hidden="true">⌄</i>
      </summary>
      <nav>${sections.map((section, index) => `
        <a href="#${section.id}"><span>${String(index + 1).padStart(2, '0')}</span><b>${escapeHtml(sectionTitle(section))}</b></a>`).join('')}</nav>`;
    details.addEventListener('click', event => {
      const a = event.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      details.open = false;
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      history.replaceState({}, '', `${chapterUrl(currentChapter())}${a.getAttribute('href')}`.replace(`#chapter-${currentChapter()}#`, '#'));
    });
    return details;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function ensureCompactCatalogue() {
    const sections = visibleChapterSections();
    if (!sections.length) return;

    // 2/3 章已有很长的 v5 目录，替换成默认收起版本。
    const old = $('.course-catalogue');
    if (old) {
      if (!$('.v6-knowledge-catalogue', old)) {
        old.innerHTML = '';
        old.appendChild(buildCatalogueDetails(sections));
        old.classList.add('v6-catalogue-host');
      }
      return;
    }

    // 1/4 章原页面没有知识点目录，直接插到第一个知识模块之前。
    if ($('#v6-chapter-catalogue')) return;
    const host = document.createElement('section');
    host.id = 'v6-chapter-catalogue';
    host.className = 'v6-catalogue-host v6-native-catalogue';
    host.appendChild(buildCatalogueDetails(sections));
    sections[0].parentNode?.insertBefore(host, sections[0]);
  }

  // 把第2/3章的点击判断训练还原成可直接查询的易错辨析笔记。
  function convertTruthLabsToNotes() {
    $$('.truth-lab').forEach(lab => {
      if (lab.dataset.v6Notes === '1') return;
      lab.dataset.v6Notes = '1';
      const h = $('h3', lab);
      if (h) h.textContent = '易错辨析';
      const intro = $('h3 + p', lab);
      if (intro) intro.textContent = '直接看结论与原因；真题只用于确定这些细节值得写进笔记。';
      const wrap = $('h3 + p + div', lab) || $('div', lab);
      if (wrap) {
        const cards = $$('button[data-truth]', wrap).map(button => {
          const ok = button.dataset.truth === '1';
          const statement = $('span', button)?.textContent || button.textContent;
          const why = button.dataset.why || '';
          const card = document.createElement('div');
          card.className = `v6-trap-note ${ok ? 'is-right' : 'is-wrong'}`;
          card.innerHTML = `<span>${ok ? '✓' : '✕'}</span><div><b>${escapeHtml(statement.trim())}</b><p>${escapeHtml(why)}</p></div>`;
          return card;
        });
        if (cards.length) wrap.replaceChildren(...cards);
      }
      $('.truth-feedback', lab)?.remove();
    });
  }

  // v4 会持续生成“标记为已掌握”按钮；不再参与笔记页面，也不显示掌握统计。
  function neutralizePracticeChrome() {
    $$('.study-hub-trigger > span').forEach(el => { el.textContent = '目录'; });
    const title = $('#study-hub-title');
    if (title) title.textContent = '快速目录';
    const directoryTab = $('[data-study-tab="directory"]');
    if (directoryTab) directoryTab.textContent = '本章目录';
    const search = $('#study-search');
    if (search) search.placeholder = '搜索本章知识点';
    $$('#study-directory [data-go-section] i').forEach(i => { i.textContent = ''; });
  }

  function apply() {
    sortChapterNavigation();
    ensureCompactCatalogue();
    convertTruthLabsToNotes();
    neutralizePracticeChrome();
  }

  function init() {
    installStableChapterNavigation();
    apply();
    let scheduled = false;
    new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        apply();
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
