/* View changes keep the same prose, anchors and live demonstration nodes. */
(() => {
  'use strict';
  const storageKey = 'notes-reading-mode';
  function reveal(target) {
    for (let parent=target?.parentElement; parent; parent=parent.parentElement) if (parent.matches('details')) parent.open=true;
    document.querySelectorAll('.note-search-target').forEach(el=>el.classList.remove('note-search-target'));
    if (target?.closest('.note-item') && !target.matches('.note-item')) target.classList.add('note-search-target');
  }
  function init() {
    let saved='detail';
    try { saved=localStorage.getItem(storageKey) || saved; } catch {}
    const buttons=[...document.querySelectorAll('[data-reading-mode]')];
    const apply = mode => {
      const quick=mode==='quick';
      document.body.dataset.readingMode=quick?'quick':'detail';
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.readingMode===document.body.dataset.readingMode)));
      document.querySelectorAll('.note-explanation').forEach(el=>el.open=!quick);
      document.getElementById('reading-hint').textContent=quick?'保留结论和易错边界；可逐条展开完整推理。':'展示完整推理；演示按需打开。';
      try { localStorage.setItem(storageKey,document.body.dataset.readingMode); } catch {}
    };
    buttons.forEach(button=>button.addEventListener('click',()=>apply(button.dataset.readingMode)));
    apply(saved);
  }
  window.NOTE_READING={init,reveal};
})();
