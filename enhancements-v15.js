(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function patchWordFormatReplace() {
    const demo = $('#word-7 .replace-demo');
    if (!demo || demo.dataset.v15Replace === '1') return;
    demo.dataset.v15Replace = '1';

    demo.innerHTML = `
      <p class="replace-sample">万里<b class="v15-replace-target">长城</b>是中华文明的重要象征。保护<b class="v15-replace-target">长城</b>需要长期投入。</p>
      <div class="replace-fields">
        <p><b>查找内容：</b>长城</p>
        <p><b>替换为：</b>长城</p>
        <p><b>替换格式：</b>字体 → 字形 → 常规</p>
      </div>
      <button type="button" data-v15-replace>全部替换</button>
      <strong data-replace-result>文字内容保持不变，只改变匹配文字的格式</strong>
    `;

    $('[data-v15-replace]', demo)?.addEventListener('click', () => {
      $$('.v15-replace-target', demo).forEach(el => {
        el.style.fontWeight = '400';
        el.classList.add('is-regular');
      });
      const result = $('[data-replace-result]', demo);
      if (result) result.textContent = '完成：两个“长城”文字没有改变，字形由粗体改为常规。';
    });
  }

  function patchExcelChartLabel() {
    const btn = $('#excel-20 #chart-sort');
    if (btn && btn.textContent.trim() !== '对源数据按平均分降序') {
      btn.textContent = '对源数据按平均分降序';
    }
  }

  function patchBinaryProvenance() {
    const kicker = $('.binary-fraction-deep-dive .exam-head > span');
    if (kicker && (kicker.textContent.includes('2023—2026 连考') || kicker.textContent.includes('填空题加深'))) {
      kicker.textContent = '真题校验 · 数制转换';
    }
  }

  function patchWindowsPath() {
    const section = $('#windows-5');
    if (!section) return;

    $$('.knowledge-card li', section).forEach(li => {
      if (li.textContent.includes('完整路径由驱动器、文件夹层次和文件名组成')) {
        li.textContent = '本地磁盘中的常见绝对路径可写成“盘符:\\文件夹层次\\文件名”；网络共享还可使用 UNC 路径（如 \\\\服务器\\共享名\\文件夹），因此完整路径并不一定以盘符开头。';
      }
    });

    const intro = $('.v10-concept-note > div:first-child p', section);
    if (intro && !intro.textContent.includes('UNC')) {
      intro.textContent = '文件名用于标识文件；路径描述文件或文件夹在存储设备或网络中的具体位置；扩展名通常位于文件名最后一个“.”之后，用来表示文件类型并帮助系统关联默认打开程序。本地路径常以盘符开头，网络共享路径也可以使用 UNC 形式。';
    }
  }

  function patchNotepadDetails() {
    const section = $('#windows-15');
    if (!section) return;

    $$('.knowledge-card li', section).forEach(li => {
      if (li.textContent.includes('记事本可改变显示字体和字号')) {
        li.textContent = 'Windows 10 经典记事本可通过“格式 → 字体”设置整个编辑区的字体、字形（如常规、粗体、斜体，具体取决于字体）和字号；它不是 Word 那样的逐字符富文本格式。';
      }
    });

    const intro = $('.v10-concept-note > div:first-child p', section);
    if (intro && !intro.textContent.includes('字形')) {
      intro.textContent = '记事本是 Windows 的纯文本编辑器，可编辑纯文字，并可通过“格式 → 字体”调整整个编辑区的字体、字形和字号；这些并不是写入 .txt 文件的逐字符富文本格式。截图工具用于捕获屏幕画面，画图、计算器等属于常用附件程序。';
    }
  }

  function patchWordZoomUnit() {
    const demo = $('#word-1 .zoom-demo');
    if (!demo || demo.dataset.v15Unit === '1') return;
    demo.dataset.v15Unit = '1';
    const font = $('[data-font]', demo);
    const paper = $('[data-zoom-paper]', demo);
    if (!font || !paper) return;

    const sync = () => paper.style.setProperty('--font', `${font.value}pt`);
    font.addEventListener('input', sync);
    sync();
  }

  function apply() {
    patchWordFormatReplace();
    patchExcelChartLabel();
    patchBinaryProvenance();
    patchWindowsPath();
    patchNotepadDetails();
    patchWordZoomUnit();
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
