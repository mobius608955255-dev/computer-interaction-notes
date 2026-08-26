(() => {
  'use strict';

  let lastMode = null;
  let rerun = 0;

  const currentMode = () => {
    if (document.querySelector('#excel-1')) return 'excel';
    if (document.querySelector('#concept-1')) return 'chapter1';
    return null;
  };

  function addMissingCounterpart(mode) {
    const id = mode === 'excel' ? 'concept-9' : 'excel-7';
    if (document.getElementById(id)) return null;
    const dummy = document.createElement('div');
    dummy.id = id;
    dummy.hidden = true;
    dummy.setAttribute('aria-hidden', 'true');
    dummy.dataset.enhancementBootstrapDummy = '1';
    document.body.appendChild(dummy);
    return dummy;
  }

  function activate(firstPass = false) {
    const mode = currentMode();
    if (!mode) return;
    if (!firstPass && mode === lastMode) return;
    lastMode = mode;

    const dummy = addMissingCounterpart(mode);

    // On first load, enhancements-v3.js is already polling and will see the dummy.
    if (firstPass) {
      window.setTimeout(() => dummy?.remove(), 450);
      return;
    }

    // Chapter navigation replaces the React tree without reloading the page.
    // Load a fresh copy of the enhancement IIFE for the newly visible chapter.
    const script = document.createElement('script');
    script.src = `./enhancements-v3.js?v=3&rerun=${++rerun}`;
    script.async = false;
    script.onload = () => window.setTimeout(() => {
      dummy?.remove();
      script.remove();
    }, 80);
    document.body.appendChild(script);
  }

  function start() {
    window.setTimeout(() => activate(true), 0);
    const root = document.querySelector('#root');
    if (!root) return;
    new MutationObserver(() => window.setTimeout(() => activate(false), 0))
      .observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
