(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);

  function addNote(selector, key, title, paragraphs) {
    const section = $(selector);
    if (!section || section.querySelector(`[data-v27="${key}"]`)) return;
    const host = $('.section-shell, .module-shell', section) || section;
    const note = document.createElement('div');
    note.className = 'lab-card v27-syllabus-note';
    note.dataset.v27 = key;
    note.innerHTML = `
      <div class="lab-heading"><span class="lab-dot"></span><div><p>2026 官方考纲补全</p><h3>${title}</h3></div></div>
      <div class="note-body">${paragraphs.map(p => `<p>${p}</p>`).join('')}</div>`;
    const memory = $('.memory-line, .course-memory', host);
    if (memory) memory.insertAdjacentElement('beforebegin', note);
    else host.appendChild(note);
  }

  function apply() {
    addNote('#concept-19', 'pseudocode-analysis', '伪代码：会看结构、会追踪变量、会判断结果', [
      '<strong>伪代码的目标是表达算法逻辑，而不是遵守某一种编程语言的全部语法。</strong>常见写法会使用 IF / ELSE 表示分支，FOR / WHILE 表示循环，赋值语句表示变量更新，也可以直接用中文描述输入、输出和处理步骤。',
      '<strong>分析伪代码仍按一条固定链：</strong>先写变量初值 → 判断当前条件 → 只执行满足条件的分支或循环体 → 更新变量 → 回到下一次判断，直到停止 → 读出最终输出。遇到循环时最好把每一轮关键变量列成小表，避免只凭直觉猜结果。',
      '<strong>顺序、分支、循环的逻辑与流程图完全一致。</strong>流程图把控制关系画出来，伪代码把控制关系写出来；同一算法可以用两种方式表达。判断题若只改变表示形式而不改变步骤和条件，算法逻辑并没有因此改变。',
      '<strong>边界：</strong>伪代码不是机器语言，不能直接交给 CPU 执行；也不是“随便写几句自然语言”。它仍应明确变量、条件、重复范围和输出，使别人能够按同样步骤得到同样结果。'
    ]);
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
