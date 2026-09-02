(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function ensureStyle() {
    if ($('style[data-v29-style]')) return;
    const style = document.createElement('style');
    style.dataset.v29Style = '1';
    style.textContent = `
      .v29-static-boundary {
        margin-top: 18px;
        padding: 18px;
        border: 1px solid rgba(127,127,127,.20);
        border-radius: 18px;
        background: rgba(255,255,255,.58);
      }
      .v29-static-boundary > h3 { margin: 0 0 6px; }
      .v29-static-boundary > p { margin: 0 0 12px; opacity: .72; }
      .v29-boundary-list { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
      .v29-boundary-row {
        display: grid;
        grid-template-columns: auto minmax(0,1fr);
        gap: 10px;
        align-items: start;
        padding: 12px 0;
        border-top: 1px solid rgba(127,127,127,.14);
      }
      .v29-boundary-row:first-child { border-top: 0; }
      .v29-boundary-row > b {
        white-space: nowrap;
        font-size: .78rem;
        line-height: 1.55;
        padding: 2px 8px;
        border: 1px solid currentColor;
        border-radius: 999px;
        opacity: .76;
      }
      .v29-boundary-row p { margin: 0; line-height: 1.72; }
      .v29-boundary-row small { display: block; margin-top: 5px; line-height: 1.65; opacity: .76; }
      .v29-reference-details {
        margin-top: 18px;
        border: 1px solid rgba(127,127,127,.18);
        border-radius: 18px;
        overflow: clip;
      }
      .v29-reference-details > summary {
        cursor: pointer;
        list-style: none;
        padding: 14px 18px;
        font-weight: 700;
      }
      .v29-reference-details > summary::-webkit-details-marker { display: none; }
      .v29-reference-note { margin: 0; padding: 0 18px 14px; line-height: 1.65; opacity: .72; }
      .v29-reference-details > section { margin-top: 0 !important; }
      @media (max-width: 720px) {
        .v29-static-boundary { padding: 15px; border-radius: 15px; }
        .v29-boundary-row { grid-template-columns: 1fr; gap: 5px; }
        .v29-boundary-row > b { justify-self: start; }
      }
    `;
    document.head.appendChild(style);
  }

  function cleanText(el) {
    return (el?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function staticizeTruthLab(lab) {
    if (!lab || lab.dataset.v29Normalized === '1') return;
    const buttons = $$('button[data-truth]', lab);
    if (!buttons.length) return;

    const list = document.createElement('ul');
    list.className = 'v29-boundary-list';

    buttons.forEach(button => {
      const truth = button.dataset.truth === '1';
      const statement = cleanText($('span', button)) || cleanText(button);
      const why = (button.dataset.why || '').trim();

      const row = document.createElement('li');
      row.className = 'v29-boundary-row';
      const badge = document.createElement('b');
      badge.textContent = truth ? '规则' : '常见误区';
      const body = document.createElement('p');
      body.append(document.createTextNode(statement));
      if (why) {
        const detail = document.createElement('small');
        detail.textContent = `${truth ? '说明' : '正确理解'}：${why}`;
        body.appendChild(detail);
      }
      row.append(badge, body);
      list.appendChild(row);
    });

    lab.replaceChildren();
    lab.classList.add('v29-static-boundary');
    lab.dataset.v29Normalized = '1';

    const heading = document.createElement('h3');
    heading.textContent = '易错边界';
    const intro = document.createElement('p');
    intro.textContent = '直接看规则与边界，不需要先做判断题。';
    lab.append(heading, intro, list);

    const shell = lab.closest('.module-shell');
    if (shell) {
      const memory = $('.course-memory, .memory-line', shell);
      if (memory) memory.before(lab);
      else shell.appendChild(lab);
    }
  }

  function normalizeCourseModules() {
    $$('.windows-page .truth-lab, .word-page .truth-lab').forEach(staticizeTruthLab);

    $$('.windows-page .knowledge-card h3, .word-page .knowledge-card h3').forEach(h => {
      if (cleanText(h) === '必须形成的判断') h.textContent = '核心规则';
    });

    $$('.windows-page .special-title span, .word-page .special-title span').forEach(el => {
      if (cleanText(el).includes('操作实验')) el.textContent = '操作演示';
    });

    $$('.windows-page .module-head h2').forEach(h => {
      if (cleanText(h) === 'Windows 真题操作链') h.textContent = 'Windows 综合操作链';
    });

    $$('.windows-page .truth-feedback, .word-page .truth-feedback').forEach(el => el.remove());
  }

  function collapseDeepDive(section) {
    if (!section || section.closest('details[data-v29-reference="1"]')) return;
    const details = document.createElement('details');
    details.className = 'v29-reference-details';
    details.dataset.v29Reference = '1';

    const summary = document.createElement('summary');
    summary.textContent = '真题例证（选看，不影响笔记主线）';
    const note = document.createElement('p');
    note.className = 'v29-reference-note';
    note.textContent = '这里保留原来的真题与排错演示作为核对材料；正文知识不要求先完成这些题目。';

    section.before(details);
    details.append(summary, note, section);
  }

  function normalizeReactSupplements() {
    $$('section.exam-deep-dive, section.reference-deep-dive, section[class$="-deep-dive"]').forEach(collapseDeepDive);
  }

  function apply() {
    ensureStyle();
    normalizeCourseModules();
    normalizeReactSupplements();
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once: true});
  else schedule();
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {childList: true, subtree: true});
})();
