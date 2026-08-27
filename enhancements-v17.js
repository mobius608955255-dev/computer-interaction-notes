(() => {
  'use strict';
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function apply() {
    // 2026 Q59-Q60: keep the verified source wording rather than a compressed label.
    $$('.source-question th').forEach(th => {
      if (th.textContent.trim() === '350km/h线路里程') {
        th.textContent = '时速350公里线路里程（公里）';
      }
    });
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; apply(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
  else schedule();
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
})();
