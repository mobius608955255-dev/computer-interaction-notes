(() => {
  'use strict';

  const STORE = {
    mastered: 'computer-notes-v4-mastered',
    wrong: 'computer-notes-v4-wrong',
    answered: 'computer-notes-v4-answered'
  };

  const QUESTIONS = [
    { id:'c1-eniac', chapter:'第一章', topic:'起源与发展', q:'关于 ENIAC，下列说法正确的是？', options:['以二进制为运算基础','采用冯·诺依曼存储程序原理','属于第一代计算机，主要使用电子管','主要使用晶体管'], answer:2, why:'ENIAC 属于第一代电子管计算机，主要采用十进制；不能把后来的存储程序思想直接套在它身上。' },
    { id:'c1-cache', chapter:'第一章', topic:'硬件系统', q:'按通常的存取速度由快到慢排列，正确的是？', options:['RAM → Cache → 寄存器 → 硬盘','寄存器 → Cache → RAM → 外存','Cache → 寄存器 → 外存 → RAM','寄存器 → RAM → Cache → 外存'], answer:1, why:'寄存器离 CPU 执行单元最近，其后通常是 Cache、主存 RAM、外存。' },
    { id:'c1-byte', chapter:'第一章', topic:'存储单位', q:'1 Byte 等于多少 bit？', options:['1','4','8','16'], answer:2, why:'B 表示 Byte（字节），bit 表示位；1 B = 8 bit，大小写不能混。' },
    { id:'c1-binary', chapter:'第一章', topic:'数制转换', q:'二进制数 11.11₂ 转换为十六进制是？', options:['3.3₁₆','3.C₁₆','B.C₁₆','3.75₁₆'], answer:1, why:'小数点两侧分别按 4 位分组：0011.1100₂ = 3.C₁₆。' },
    { id:'c1-code', chapter:'第一章', topic:'信息编码', q:'下列哪项不是汉字编码体系或编码形式？', options:['GB18030','UTF-8','UTF-32','ASCII'], answer:3, why:'标准 ASCII 主要编码英文字符、数字和控制字符，不能把它当作汉字编码。' },
    { id:'c1-media', chapter:'第一章', topic:'多媒体', q:'相同尺寸、未经压缩的图像，颜色深度提高通常会怎样？', options:['文件数据量减小','文件数据量不变','文件数据量增大','一定变成矢量图'], answer:2, why:'每个像素需要更多位来保存颜色信息，因此数据量通常增大。' },
    { id:'x-ref1', chapter:'第四章', topic:'公式与引用', q:'公式向下填充时，要让求和范围始终保持 B2:B7，哪种写法正确？', options:['$B2:$B7','B$2:B$7','$B2:B$7','B2:B7'], answer:1, why:'向下复制会改变行号，因此锁行即可；B$2:B$7 的 2 和 7 不会漂移。' },
    { id:'x-ref2', chapter:'第四章', topic:'公式与引用', q:'$B2 表示什么？', options:['固定第 2 行','固定 B 列','行列都固定','行列都不固定'], answer:1, why:'$ 放在列标 B 前，只固定列；行号 2 仍会随纵向复制变化。' },
    { id:'x-vlookup', chapter:'第四章', topic:'VLOOKUP', q:'VLOOKUP 的查找值必须位于查找区域的哪一列？', options:['最后一列','任意一列','首列','返回列'], answer:2, why:'VLOOKUP 从 table_array 的首列查找，再按区域内部的列序号返回结果。' },
    { id:'x-sumifs', chapter:'第四章', topic:'条件函数', q:'SUMIFS 的参数顺序应从哪一项开始？', options:['条件区域1','条件1','求和区域','查找值'], answer:2, why:'SUMIFS(求和区域, 条件区域1, 条件1, …)；它和 SUMIF 的起始参数顺序不同。' },
    { id:'x-wildcard', chapter:'第四章', topic:'条件函数', q:'要匹配“内容中包含北斗”的文本，条件应写为？', options:['"北斗"','"北斗*"','"*北斗"','"*北斗*"'], answer:3, why:'* 可代表任意长度字符，两侧都加 * 才表示任意位置包含“北斗”。' },
    { id:'x-textnum', chapter:'第四章', topic:'文本型数字', q:'把文本型数字的单元格格式改为“数值”，能否完成类型转换？', options:['一定可以','不能，只改变显示格式','只在求和后可以','只有加前导单引号才可以'], answer:1, why:'设置格式不改变底层类型；可用“转换为数字”、分列或选择性粘贴乘 1。' },
    { id:'x-filter', chapter:'第四章', topic:'排序与筛选', q:'筛选后未显示的记录，能否用右键“取消隐藏”恢复？', options:['可以','不能，应清除或更改筛选条件','只能逐行恢复','按 F4 恢复'], answer:1, why:'筛选隐藏与手工隐藏行不是同一种状态，应通过筛选命令恢复。' },
    { id:'x-subtotal', chapter:'第四章', topic:'分类汇总', q:'分类汇总要统计每个班级的人数，汇总方式通常应选择？', options:['求和','平均值','计数','最大值'], answer:2, why:'人数对应记录条数，通常选“计数”，不是把学号或成绩求和。' },
    { id:'x-chart', chapter:'第四章', topic:'图表', q:'对图表引用的数据区域执行排序后，图表通常会怎样？', options:['保持完全不变','随源数据的新顺序更新','自动删除','只改变标题'], answer:1, why:'图表引用源单元格区域；区域的类别和值重排后，图表会同步重绘。' },
    { id:'x-protect', chapter:'第四章', topic:'保护工作表', q:'单元格设置了“锁定”属性后，何时才真正限制编辑？', options:['设置后立即生效','保存工作簿后','保护工作表后','隐藏公式后'], answer:2, why:'“锁定”是属性；只有启用工作表保护后，它才真正阻止编辑。' }
  ];

  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const readSet = key => {
    try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); }
    catch { return new Set(); }
  };
  const writeSet = (key, set) => {
    try { localStorage.setItem(key, JSON.stringify([...set])); } catch {}
  };

  let mastered = readSet(STORE.mastered);
  let wrong = readSet(STORE.wrong);
  let answered = readSet(STORE.answered);
  let activeQuestion = null;
  let lastFocus = null;

  function visibleSections() {
    return qa('[id^="concept-"], [id^="excel-"]').filter(el => el.offsetParent !== null);
  }

  function sectionTitle(section) {
    const title = q('h2, .section-heading h3, h3', section);
    return title?.textContent.trim().replace(/^\d+[.、]?\s*/, '') || section.id;
  }

  function currentChapter() {
    return q('.excel-page') ? '第四章' : '第一章';
  }

  function ensureStyle() {
    if (q('link[data-v4-style]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './enhancements-v4.css?v=4';
    link.dataset.v4Style = '1';
    document.head.appendChild(link);
  }

  function patchProjectLinks(root = document) {
    qa('a[href="/excel"], a[href="/"]', root).forEach(link => {
      const isExcel = link.getAttribute('href') === '/excel';
      link.setAttribute('href', `./${isExcel ? '#chapter-4' : '#chapter-1'}`);
    });
  }

  function addMasteryButtons() {
    visibleSections().forEach(section => {
      if (q(':scope > .mastery-toggle', section)) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mastery-toggle';
      button.dataset.sectionId = section.id;
      button.addEventListener('click', () => {
        mastered.has(section.id) ? mastered.delete(section.id) : mastered.add(section.id);
        writeSet(STORE.mastered, mastered);
        refreshProgress();
      });
      section.appendChild(button);
    });
  }

  function refreshProgress() {
    const sections = visibleSections();
    sections.forEach(section => {
      const button = q(':scope > .mastery-toggle', section);
      if (!button) return;
      const done = mastered.has(section.id);
      if (button.dataset.done === String(done)) return;
      button.dataset.done = String(done);
      button.classList.toggle('is-done', done);
      button.setAttribute('aria-pressed', String(done));
      button.innerHTML = done ? '<span>✓</span> 已掌握，点击取消' : '<span>○</span> 标记为已掌握';
    });
    const done = sections.filter(section => mastered.has(section.id)).length;
    const total = sections.length;
    if (q('#study-hub-progress')) q('#study-hub-progress').textContent = `${done}/${total}`;
    if (q('#study-progress-bar')) q('#study-progress-bar').style.width = total ? `${done / total * 100}%` : '0%';
    if (q('#study-progress-label')) q('#study-progress-label').textContent = `${currentChapter()}已掌握 ${done} / ${total}`;
    renderDirectory();
    renderStats();
  }

  function buildHub() {
    if (q('#study-hub')) return;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'study-hub-trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'study-hub');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<span>复习</span><b id="study-hub-progress">0/0</b>';

    const scrim = document.createElement('button');
    scrim.type = 'button';
    scrim.className = 'study-hub-scrim';
    scrim.setAttribute('aria-label', '关闭复习中心');

    const hub = document.createElement('aside');
    hub.id = 'study-hub';
    hub.className = 'study-hub';
    hub.setAttribute('role', 'dialog');
    hub.setAttribute('aria-modal', 'true');
    hub.setAttribute('aria-labelledby', 'study-hub-title');
    hub.innerHTML = `
      <header class="study-hub-head">
        <div><small>STUDY CENTER</small><h2 id="study-hub-title">复习中心</h2></div>
        <button type="button" id="study-hub-close" aria-label="关闭">×</button>
      </header>
      <div class="study-progress"><div><span id="study-progress-label">本章已掌握 0 / 0</span><b id="study-stats"></b></div><i><em id="study-progress-bar"></em></i></div>
      <nav class="study-tabs" aria-label="复习中心功能">
        <button type="button" class="active" data-study-tab="directory">本章目录</button>
        <button type="button" data-study-tab="quiz">真题自测</button>
        <button type="button" data-study-tab="wrong">错题本 <b id="wrong-count">0</b></button>
      </nav>
      <section class="study-panel active" data-study-panel="directory">
        <label class="study-search"><span>⌕</span><input id="study-search" type="search" placeholder="搜索本章考点" autocomplete="off"></label>
        <div id="study-directory" class="study-directory"></div>
      </section>
      <section class="study-panel" data-study-panel="quiz"><div id="study-quiz"></div></section>
      <section class="study-panel" data-study-panel="wrong"><div id="study-wrong"></div></section>`;

    document.body.append(trigger, scrim, hub);
    trigger.addEventListener('click', openHub);
    scrim.addEventListener('click', closeHub);
    q('#study-hub-close', hub).addEventListener('click', closeHub);
    qa('[data-study-tab]', hub).forEach(button => button.addEventListener('click', () => showTab(button.dataset.studyTab)));
    q('#study-search', hub).addEventListener('input', renderDirectory);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && hub.classList.contains('is-open')) closeHub();
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openHub('directory');
        q('#study-search', hub).focus();
      }
    });
  }

  function openHub(tab) {
    lastFocus = document.activeElement;
    q('#study-hub').classList.add('is-open');
    q('.study-hub-scrim').classList.add('is-open');
    q('.study-hub-trigger').setAttribute('aria-expanded', 'true');
    document.body.classList.add('study-hub-open');
    if (typeof tab === 'string') showTab(tab);
    refreshProgress();
    requestAnimationFrame(() => q('#study-hub-close').focus());
  }

  function closeHub() {
    q('#study-hub')?.classList.remove('is-open');
    q('.study-hub-scrim')?.classList.remove('is-open');
    q('.study-hub-trigger')?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('study-hub-open');
    lastFocus?.focus?.();
  }

  function showTab(name) {
    qa('[data-study-tab]').forEach(button => button.classList.toggle('active', button.dataset.studyTab === name));
    qa('[data-study-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.studyPanel === name));
    if (name === 'quiz') renderQuiz();
    if (name === 'wrong') renderWrong();
  }

  function renderDirectory() {
    const box = q('#study-directory');
    if (!box) return;
    const term = q('#study-search')?.value.trim().toLowerCase() || '';
    const sections = visibleSections().map(section => ({ id:section.id, title:sectionTitle(section), done:mastered.has(section.id) }))
      .filter(item => !term || item.title.toLowerCase().includes(term));
    box.innerHTML = sections.length ? sections.map((item, index) => `
      <button type="button" data-go-section="${esc(item.id)}" class="${item.done ? 'is-done' : ''}">
        <span>${String(index + 1).padStart(2, '0')}</span><b>${esc(item.title)}</b><i>${item.done ? '已掌握' : '去学习'}</i>
      </button>`).join('') : '<p class="study-empty">没有找到匹配的考点。</p>';
    qa('[data-go-section]', box).forEach(button => button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.goSection);
      closeHub();
      target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start' });
    }));
  }

  function pickQuestion(pool) {
    const candidates = pool.length ? pool : QUESTIONS;
    const currentIndex = activeQuestion ? candidates.findIndex(item => item.id === activeQuestion.id) : -1;
    activeQuestion = candidates[(currentIndex + 1) % candidates.length];
    return activeQuestion;
  }

  function renderQuiz(question) {
    const box = q('#study-quiz');
    if (!box) return;
    const chapterQuestions = QUESTIONS.filter(item => item.chapter === currentChapter());
    const item = question || pickQuestion(chapterQuestions);
    activeQuestion = item;
    box.innerHTML = `
      <div class="quiz-meta"><span>${esc(item.chapter)} · ${esc(item.topic)}</span><small>已作答 ${answered.size} 题</small></div>
      <h3>${esc(item.q)}</h3>
      <div class="quiz-options">${item.options.map((option, index) => `<button type="button" data-quiz-option="${index}"><b>${String.fromCharCode(65 + index)}</b>${esc(option)}</button>`).join('')}</div>
      <div id="quiz-feedback" class="quiz-feedback" aria-live="polite">先独立判断，再点击选项。</div>
      <div class="quiz-actions"><button type="button" id="quiz-next">换一题</button><button type="button" id="quiz-mixed">跨章随机</button></div>`;
    qa('[data-quiz-option]', box).forEach(button => button.addEventListener('click', () => answerQuiz(item, Number(button.dataset.quizOption))));
    q('#quiz-next', box).addEventListener('click', () => renderQuiz());
    q('#quiz-mixed', box).addEventListener('click', () => renderQuiz(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]));
  }

  function answerQuiz(item, choice) {
    const box = q('#study-quiz');
    qa('[data-quiz-option]', box).forEach((button, index) => {
      button.disabled = true;
      button.classList.toggle('correct', index === item.answer);
      button.classList.toggle('wrong', index === choice && choice !== item.answer);
    });
    answered.add(item.id);
    if (choice === item.answer) wrong.delete(item.id); else wrong.add(item.id);
    writeSet(STORE.answered, answered);
    writeSet(STORE.wrong, wrong);
    q('#quiz-feedback', box).innerHTML = `<b>${choice === item.answer ? '回答正确。' : '这题答错了。'}</b>${esc(item.why)}`;
    renderStats();
  }

  function renderWrong() {
    const box = q('#study-wrong');
    if (!box) return;
    const items = QUESTIONS.filter(item => wrong.has(item.id));
    box.innerHTML = items.length ? `
      <p class="wrong-intro">错题会保存在当前设备。答对后自动移出。</p>
      <div class="wrong-list">${items.map(item => `<button type="button" data-retry="${esc(item.id)}"><span>${esc(item.chapter)}</span><b>${esc(item.q)}</b><i>重做</i></button>`).join('')}</div>
      <button type="button" id="clear-wrong" class="clear-wrong">清空错题记录</button>` : '<div class="study-empty"><b>暂时没有错题</b><span>去“真题自测”做几道高频易错题吧。</span></div>';
    qa('[data-retry]', box).forEach(button => button.addEventListener('click', () => {
      showTab('quiz');
      renderQuiz(QUESTIONS.find(item => item.id === button.dataset.retry));
    }));
    q('#clear-wrong', box)?.addEventListener('click', () => {
      wrong.clear(); writeSet(STORE.wrong, wrong); renderWrong(); renderStats();
    });
  }

  function renderStats() {
    if (q('#wrong-count')) q('#wrong-count').textContent = String(wrong.size);
    if (q('#study-stats')) q('#study-stats').textContent = `答题 ${answered.size} · 错题 ${wrong.size}`;
  }

  function mountPageFeatures() {
    patchProjectLinks();
    addMasteryButtons();
    refreshProgress();
  }

  function init() {
    ensureStyle();
    buildHub();
    mountPageFeatures();
    let scheduled = false;
    const root = q('#root');
    if (root) new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; mountPageFeatures(); });
    }).observe(root, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
