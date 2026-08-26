(() => {
  'use strict';

  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function syncChoiceGroup(select, group) {
    const value = select.value;
    $$('button[data-v12-value]', group).forEach(btn => {
      const active = btn.dataset.v12Value === value;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function upgradeSelect(select) {
    if (!select || select.dataset.v12Choices === '1') return;
    const options = [...select.options].filter(opt => !opt.hidden);
    if (!options.length) return;

    select.dataset.v12Choices = '1';
    select.classList.add('v12-native-select');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    const group = document.createElement('div');
    group.className = 'v12-choice-group';
    group.setAttribute('role', 'group');
    group.dataset.count = String(options.length);

    const longest = Math.max(...options.map(opt => opt.textContent.trim().length));
    if (options.length > 4 || longest > 14) group.classList.add('is-card-grid');
    else group.classList.add('is-compact');

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.v12Value = opt.value;
      btn.textContent = opt.textContent.trim();
      btn.disabled = opt.disabled;
      btn.setAttribute('aria-pressed', opt.selected ? 'true' : 'false');
      if (opt.selected) btn.classList.add('is-active');
      btn.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (select.value === opt.value) return;
        select.value = opt.value;
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
        syncChoiceGroup(select, group);
      });
      group.appendChild(btn);
    });

    select.insertAdjacentElement('afterend', group);
    select.addEventListener('change', () => syncChoiceGroup(select, group));
    select.closest('label')?.classList.add('v12-choice-label');
    syncChoiceGroup(select, group);
  }

  function apply() {
    // All selects in the note experience are explanatory controls, so keep their
    // alternatives visible instead of hiding them behind a native dropdown.
    $$('select').forEach(upgradeSelect);
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();