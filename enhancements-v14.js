(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function setText(el, text) {
    if (el && el.textContent !== text) el.textContent = text;
  }

  function patchWindowsReadonly() {
    const section = $('#windows-6');
    if (!section) return;

    const intro = $('.v10-concept-note > div:first-child p', section);
    if (intro && !intro.textContent.includes('文件夹属性中的“只读”')) {
      intro.textContent = '文件或文件夹除了名称和位置外，还可以显示只读、隐藏等属性。但“只读”的语义要分对象：对普通文件，它主要表示不应直接修改内容；Windows 文件夹属性中的“只读”并不等同于“文件夹不可写”，也不能用它代替访问权限。';
    }

    $$('.knowledge-card li', section).forEach(li => {
      if (li.textContent.includes('只读主要限制常规修改保存')) {
        li.textContent = '对普通文件而言，只读主要限制常规修改保存，不等于禁止删除；文件夹属性中的“只读”不能按文件的只读语义机械理解。';
      }
    });
  }

  function forceWrongPitfall(card, statement, why) {
    if (!card) return;
    const label = $('b', card);
    const p = $('p', card);
    const small = $('small', card);
    setText(label, '错误');
    setText(p, statement);
    setText(small, why);
    card.classList.remove('is-correct');
    card.classList.add('is-wrong');
    let icon = $('.pitfall-state-icon', card);
    if (!icon) {
      icon = document.createElement('span');
      icon.className = 'pitfall-state-icon';
      icon.setAttribute('aria-hidden', 'true');
      card.prepend(icon);
    }
    icon.textContent = '✕';
  }

  function patchWordSpacing() {
    const section = $('#word-5');
    if (!section) return;

    $$('.knowledge-card li', section).forEach(li => {
      if (li.textContent.includes('中文与西文/数字间距设置可能改变换行结果')) {
        li.textContent = '“自动调整中文与数字的间距”和“自动调整中文与西文的间距”作用对象不同：前者影响中文与数字相邻处，后者影响中文与西文字符相邻处。应先看段落里实际出现了哪类字符。';
      }
    });

    $$('.v10-pitfall-list > div, .v9-pitfall-list > div', section).forEach(card => {
      const statement = $('p', card)?.textContent || '';
      if (statement.includes('改变中文与西文间距可能使三行变两行') || statement.includes('取消“自动调整中文与西文')) {
        forceWrongPitfall(
          card,
          '针对 2026 年对应题目的段落，取消“自动调整中文与西文的间距”可以使三行变两行。',
          '错误。该题段落的关键组合是中文与数字，配套答案对应“自动调整中文与数字的间距”；题面没有西文字符时，中文与西文间距设置不是造成该结果的关键。'
        );
      }
    });
  }

  function patchHeaderDemo() {
    const demo = $('#word-9 .header-demo');
    if (!demo || demo.dataset.v14Header === '1') return;
    demo.dataset.v14Header = '1';
    const edit = $('[data-header-edit]', demo);
    if (!edit) return;
    edit.addEventListener('click', () => {
      const linked = $('[data-header-link]', demo)?.getAttribute('aria-pressed') === 'true';
      const first = $('div:first-of-type b', demo);
      const second = $('[data-header-two]', demo);
      if (linked) {
        if (first) first.textContent = '第三章 Word';
        if (second) second.textContent = '第三章 Word';
      }
    });
  }

  function patchCaptionDemo() {
    const section = $('#word-15');
    if (!section) return;

    $$('.v10-pitfall-list > div, .v9-pitfall-list > div', section).forEach(card => {
      const p = $('p', card);
      const small = $('small', card);
      if (p?.textContent.includes('交叉引用可随题注编号更新')) {
        p.textContent = '交叉引用可在字段更新后随题注编号变化。';
        if (small) small.textContent = '交叉引用本质上是域；编号变化后可更新域，必要时使用 Ctrl+A → F9 刷新全部相关字段。';
      }
    });

    const demo = $('.caption-demo', section);
    if (!demo) return;
    if (!$('.v14-field-note', demo)) {
      const note = document.createElement('p');
      note.className = 'v14-field-note';
      note.innerHTML = '<b>注意：</b>这里展示的是“更新域后的结果”。真实 Word 中，题注或交叉引用编号变化后有时需要按 <code>Ctrl+A</code> → <code>F9</code> 更新字段。';
      demo.appendChild(note);
    }
    if (demo.dataset.v14Caption !== '1') {
      demo.dataset.v14Caption = '1';
      $('[data-renumber]', demo)?.addEventListener('click', () => {
        const result = $('[data-caption-result]', demo);
        if (result) result.textContent = '更新域后：题注编号和交叉引用可同步变为图 2';
      });
    }
  }

  function patchAudioSample() {
    const slider = $('#sample-slider');
    if (!slider || slider.dataset.v14Sample === '1') return;
    slider.dataset.v14Sample = '1';
    slider.step = '0.1';
    if (slider.value === '44' || slider.value === '44.0') {
      slider.value = '44.1';
      slider.dispatchEvent(new Event('input', {bubbles:true}));
    }
  }

  function patchUnverifiedFrequencies() {
    $$('.topic-card > span').forEach(span => {
      if (/·\s*七年\s*\d+\s*次/.test(span.textContent)) {
        span.textContent = span.textContent.replace(/·\s*七年\s*\d+\s*次/g, '· 真题反复出现');
      }
    });

    $$('.exam-head > span').forEach(span => {
      if (span.textContent.includes('七年真题加深')) span.textContent = '真题校验';
    });

    $$('.exam-head > p').forEach(p => {
      if (p.textContent.includes('2020、2022、2023、2024、2025、2026 均涉及引用锁定')) {
        p.textContent = '多年度真题反复涉及公式复制与引用锁定。重点不是“见到 $ 就锁”，而是判断复制方向上到底哪一维必须固定。';
      }
    });
  }

  function apply() {
    patchWindowsReadonly();
    patchWordSpacing();
    patchHeaderDemo();
    patchCaptionDemo();
    patchAudioSample();
    patchUnverifiedFrequencies();
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
  else schedule();
  document.addEventListener('notes:chapterchange', schedule);
  new MutationObserver(schedule).observe(document.documentElement, {childList:true, subtree:true});
})();
