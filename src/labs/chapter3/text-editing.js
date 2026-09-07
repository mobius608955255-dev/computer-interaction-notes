/* A text-only editing exercise with its own clipboard; no system clipboard access. */
(() => {
  'use strict';
  const { register, registry, ui } = window.NOTE_LABS;
  const { btn, office, paper, output, coach, esc } = ui;
  const id = 'syllabus-word-text-editing';
  function remember(s) {
    s.history.push({ text: s.text, start: s.start, end: s.end });
    if (s.history.length > 20) s.history.shift();
  }
  function edit(s, action) {
    const selected = s.text.slice(s.start, s.end);
    if (action === 'copy' || action === 'cut') {
      if (!selected) { s.message = '先选中要处理的文字。'; return; }
      s.clipboard = selected;
      if (action === 'cut') {
        remember(s); s.text = s.text.slice(0, s.start) + s.text.slice(s.end); s.end = s.start;
      }
      s.message = action === 'copy' ? '已复制，原文字仍保留；再单击目标位置粘贴。' : '已剪切，原文字已从编辑区移除；再单击目标位置粘贴。';
    }
    if (action === 'paste') {
      if (!s.clipboard) { s.message = '卡片内剪贴板为空，请先复制或剪切。'; return; }
      remember(s); s.text = s.text.slice(0, s.start) + s.clipboard + s.text.slice(s.end);
      s.start += s.clipboard.length; s.end = s.start;
      s.message = '已粘贴到当前选区或插入点；剪贴板内容仍保留，可再次粘贴。';
    }
    if (action === 'undo') {
      const previous = s.history.pop();
      if (!previous) { s.message = '当前没有可撤销的编辑。'; return; }
      Object.assign(s, previous); s.message = '已撤销最近一次编辑；复制的文本仍在卡片内剪贴板。';
    }
    s.focusEditor = true;
  }
  register([id], '实际选中文字，再比较复制与剪切', '在编辑区拖选文字，复制或剪切后单击目标位置粘贴；观察源文字和剪贴板是否保留。',
    { text: '笔记整理：先阅读，再练习。\n复习记录：', start: 0, end: 0, clipboard: '', history: [], focusEditor: false, message: '请先选中文字。' },
    s => `<div class="lab-word-editing">${office('Word', '开始 · 剪贴板',
      btn('复制 · Ctrl+C', 'copy') + btn('剪切 · Ctrl+X', 'cut') + btn('粘贴 · Ctrl+V', 'paste') + btn('撤销 · Ctrl+Z', 'undo'),
      paper(`<label>可编辑的示例正文<textarea data-edit-text aria-label="复制移动练习正文" rows="5" spellcheck="false">
${esc(s.text)}</textarea></label>`))}
      <p data-edit-range>当前选择 ${s.end - s.start} 个字符。</p>
      <div class="lab-edit-clipboard"><b>卡片内剪贴板</b><pre data-edit-clipboard>${esc(s.clipboard || '尚未复制')}</pre></div>
      ${output(s.message)}${coach('本卡只处理普通文本，使用自己的剪贴板；不访问系统剪贴板、不模拟富文本粘贴或Office的24项列表。支持此处显示的实体快捷键，撤销只恢复卡片内近期编辑。')}
    </div>`, edit);
  const model = registry[id];
  model.afterRender = (s, root) => {
    const editor = root.querySelector('[data-edit-text]');
    const paint = () => {
      root.querySelector('[data-edit-range]').textContent = `当前选择 ${s.end - s.start} 个字符。`;
      root.querySelector('[data-edit-clipboard]').textContent = s.clipboard || '尚未复制';
      root.querySelector('output').textContent = s.message;
    };
    const capture = () => {
      if (s.text !== editor.value) { remember(s); s.text = editor.value; s.message = '正文已编辑；可撤销这次输入。'; }
      s.start = editor.selectionStart; s.end = editor.selectionEnd; paint();
    };
    editor.setSelectionRange(s.start, s.end);
    if (s.focusEditor) { s.focusEditor = false; editor.focus({ preventScroll: true }); }
    for (const event of ['select', 'selectionchange', 'pointerup', 'keyup', 'input', 'beforeinput']) editor.addEventListener(event, capture);
    root.querySelectorAll('[data-lab-act]').forEach(button => button.addEventListener('pointerdown', capture));
  };
  model.keydown = (s, event) => {
    if (!event.target.matches('[data-edit-text]') || !event.ctrlKey || event.altKey || event.shiftKey) return;
    const action = { c: 'copy', x: 'cut', v: 'paste', z: 'undo' }[event.key.toLowerCase()];
    if (!action) return;
    event.preventDefault(); s.start = event.target.selectionStart; s.end = event.target.selectionEnd;
    edit(s, action); return true;
  };
})();
