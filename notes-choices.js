/* Page-owned choices: keep the existing select as the model's single value source. */
(() => {
  'use strict';
  const pickers = new WeakMap();
  let serial = 0, opened = null;
  const element = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  function enhance(root = document) {
    const sources = root.matches?.('select') ? [root] : [...root.querySelectorAll('select')];
    for (const source of sources) {
      if (pickers.has(source)) { pickers.get(source).sync(); continue; }
      // These are actual list boxes, including the Excel reference list.
      if (source.multiple || source.size > 1 || source.hidden || !source.options.length) continue;
      const label = source.closest('label');
      if (label && label.querySelectorAll('input,select,textarea,button').length !== 1) continue;
      const labelCopy = label?.cloneNode(true);
      labelCopy?.querySelectorAll('select').forEach(el => el.remove());
      const title = source.getAttribute('aria-label') || labelCopy?.textContent.trim() || source.title || '选择';
      const chapter = source.id === 'chapter-select';
      const options = [...source.options];
      const inline = !chapter && options.length <= 4 && options.every(o => o.textContent.trim().length <= 18) && !source.closest('.lab-office');
      const box = element('div', 'notes-picker' + (inline ? ' is-inline' : ' is-collapsible') + (chapter ? ' is-chapter' : ''));
      const heading = element('span', 'choice-label', title);
      heading.id = 'choice-label-' + (++serial);
      const list = element('div', 'choice-options');
      list.id = 'choice-options-' + serial;
      list.setAttribute('role', 'radiogroup');
      list.setAttribute('aria-labelledby', heading.id);
      const original = label || source;
      original.replaceWith(box);
      box.append(original, heading);
      original.classList.add('choice-source');
      source.hidden = true;
      source.tabIndex = -1;
      source.setAttribute('aria-hidden', 'true');
      let trigger;
      if (!inline) {
        trigger = element('button', 'choice-trigger');
        trigger.type = 'button';
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', list.id);
        trigger.setAttribute('aria-label', title);
        box.append(trigger);
        list.hidden = true;
      }
      box.append(list);

      const picker = {box, source, trigger, inline, sync, close};
      pickers.set(source, picker);
      let signature = '';
      function sync() {
        const opts = [...source.options];
        const next = JSON.stringify(opts.map(o => [o.textContent, o.value, o.disabled, o.hidden, o.parentElement.disabled]));
        if (next !== signature) {
          signature = next;
          list.replaceChildren();
          opts.forEach((option, index) => {
            const button = element('button', 'choice-option');
            button.type = 'button';
            button.dataset.choiceIndex = index;
            button.setAttribute('role', 'radio');
            const text = option.textContent.trim();
            button.append(element('span', '', text));
            const mark = element('span', 'choice-check', '✓');
            mark.setAttribute('aria-hidden', 'true');
            button.append(mark);
            list.append(button);
          });
        }
        const disabled = source.matches(':disabled');
        box.classList.toggle('is-disabled', disabled);
        const buttons = [...list.children];
        let first = true;
        buttons.forEach((button, index) => {
          const option = opts[index], selected = index === source.selectedIndex;
          button.hidden = option.hidden;
          button.disabled = disabled || option.disabled || !!option.parentElement.disabled;
          button.setAttribute('aria-checked', String(selected));
          button.tabIndex = selected && !button.disabled ? 0 : -1;
          if (source.selectedIndex < 0 && first && !button.disabled && !button.hidden) { button.tabIndex = 0; first = false; }
        });
        if (trigger) {
          const text = opts[source.selectedIndex]?.textContent.trim() || '请选择';
          trigger.replaceChildren(element('span', 'choice-current', text), element('span', 'choice-chevron', '⌄'));
          trigger.lastChild.setAttribute('aria-hidden', 'true');
          trigger.setAttribute('aria-label', title + '：' + text);
          trigger.disabled = disabled;
        }
        if (disabled) close();
      }
      function close(returnFocus = false) {
        if (inline) return;
        list.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        box.classList.remove('is-open');
        if (opened === picker) opened = null;
        if (returnFocus) trigger.focus({preventScroll: true});
      }
      function open() {
        if (source.matches(':disabled')) return;
        if (opened && opened !== picker) opened.close();
        sync();
        opened = picker;
        list.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        box.classList.add('is-open');
        (list.querySelector('[aria-checked="true"]:not(:disabled)') || list.querySelector('button:not(:disabled):not([hidden])'))?.focus({preventScroll: true});
      }
      function commit(button) {
        if (button.disabled || source.matches(':disabled')) return;
        const index = Number(button.dataset.choiceIndex);
        const changed = source.selectedIndex !== index;
        source.selectedIndex = index;
        sync();
        if (inline) button.focus({preventScroll: true}); else close(true);
        // Only change: lab model setters can reset data and must run once.
        if (changed) source.dispatchEvent(new Event('change', {bubbles: true}));
        if (box.isConnected) sync();
      }
      box.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button === trigger) { if (list.hidden) open(); else close(); }
        else if (button.dataset.choiceIndex !== undefined) commit(button);
      });
      box.addEventListener('keydown', event => {
        // Keep demonstration hotkeys from interpreting choice navigation.
        event.stopPropagation();
        if (event.key === 'Escape' && !inline && !list.hidden) { event.preventDefault(); close(true); return; }
        if (event.target === trigger) {
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); open(); }
          return;
        }
        const choices = [...list.querySelectorAll('button:not(:disabled):not([hidden])')];
        if (!choices.length || !['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const current = choices.indexOf(event.target);
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : (current + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1) + choices.length) % choices.length;
        if (inline) commit(choices[index]);
        else { choices.forEach(b => b.tabIndex = -1); choices[index].tabIndex = 0; choices[index].focus({preventScroll: true}); }
      });
      box.addEventListener('focusout', () => queueMicrotask(() => {
        if (!box.isConnected) { if (opened === picker) opened = null; return; }
        if (!box.contains(document.activeElement)) close();
      }));
      sync();
    }
  }

  function focus(source) {
    const picker = pickers.get(source);
    if (!picker) { source?.focus({preventScroll: true}); return; }
    (picker.trigger || picker.box.querySelector('[aria-checked="true"]:not(:disabled)') || picker.box.querySelector('button:not(:disabled)'))?.focus({preventScroll: true});
  }
  document.addEventListener('click', event => {
    if (opened && !opened.box.contains(event.target)) opened.close();
  }, true);
  document.addEventListener('change', event => {
    if (pickers.has(event.target)) queueMicrotask(() => { if (event.target.isConnected) pickers.get(event.target).sync(); });
  }, true);
  document.addEventListener('reset', event => queueMicrotask(() => enhance(event.target)));

  // Legacy scenes also insert selects after actions. Inspect only changed subtrees.
  new MutationObserver(records => {
    const pending = new Set();
    for (const record of records) {
      const select = record.target.closest?.('select');
      if (select) pending.add(select);
      if (record.type === 'attributes' && record.target.matches?.('fieldset')) record.target.querySelectorAll('select').forEach(s => pending.add(s));
      for (const node of record.addedNodes) if (node.nodeType === 1) {
        if (node.matches('select')) pending.add(node);
        node.querySelectorAll('select').forEach(s => pending.add(s));
      }
    }
    for (const select of pending) if (select.isConnected) enhance(select);
  }).observe(document.body, {subtree: true, childList: true, attributes: true, attributeFilter: ['disabled', 'selected', 'label', 'value']});
  window.NOTE_CHOICES = {enhance, focus};
  enhance();
})();
