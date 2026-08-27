(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function setMeta(selector, value) {
    const el = $(selector);
    if (el && el.getAttribute('content') !== value) el.setAttribute('content', value);
  }

  function replaceExact(selector, from, to) {
    $$(selector).forEach(el => {
      if (el.textContent.trim() === from) el.textContent = to;
    });
  }

  function apply() {
    const desc = '山东专升本计算机互动笔记：概念讲解、核心规则、操作演示、真题校验与易错点整理。';
    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[name="twitter:description"]', desc);

    // Exam material is evidence and explanation, not an answer-picking exercise.
    replaceExact('.exam-head > span', '七年真题加深 · 高频主轴', '真题校验 · 高频考点');
    replaceExact('.source-question h4', '2026 年真题第 59—60 题', '真题来源：2026 年第 59—60 题');
    replaceExact('.exam-subhead', '第 59 题：可能产生问题的原因是？', '为什么向下填充后结果错误');
    replaceExact('.exam-subhead', '第 60 题：哪一种解决方案可行？', '正确修正：锁定会随复制方向漂移的行');
    replaceExact('.screen-panel > h4', '2020 年真题：名次为什么错？', 'RANK 排名范围为什么会漂移');

    $$('.rank-lock-demo p').forEach(p => {
      if (p.textContent.includes('官方公开参考答案')) {
        p.innerHTML = p.innerHTML.replace('官方公开参考答案：', '真题配套参考答案：');
      }
    });

    // Hidden legacy feedback should not keep exercise-oriented wording if it ever becomes visible.
    $$('.feedback').forEach(el => {
      el.textContent = el.textContent
        .replace(/先作答，再看/g, '直接观察')
        .replace(/先判断错在哪一步。?/g, '下面直接说明错误所在。');
    });
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once:true });
  else schedule();
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList:true, subtree:true });
})();