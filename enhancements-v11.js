(() => {
  'use strict';

  function applyPitfallStates(root = document) {
    root.querySelectorAll('.v10-pitfall-list > div, .v9-pitfall-list > div').forEach(card => {
      const label = card.querySelector('b')?.textContent?.trim() || '';
      const correct = /正确/.test(label);
      const wrong = /错误/.test(label);
      if (!correct && !wrong) return;

      card.classList.toggle('is-correct', correct);
      card.classList.toggle('is-wrong', wrong);

      if (!card.querySelector(':scope > .pitfall-state-icon')) {
        const icon = document.createElement('span');
        icon.className = 'pitfall-state-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = correct ? '✓' : '✕';
        card.prepend(icon);
      }

      const b = card.querySelector('b');
      if (b) b.textContent = correct ? '正确' : '错误';
    });
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyPitfallStates();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();