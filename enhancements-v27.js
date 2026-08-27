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
      <div class="lab-heading"><span class="lab-dot"></span><div><p>最终覆盖审计补全</p><h3>${title}</h3></div></div>
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

    addNote('#windows-12', 'hardware-sound-settings', '硬件和声音：常规设置与设备管理器分工不同', [
      '<strong>鼠标设置</strong>可以调整主按钮、双击速度、指针方案/速度、滚轮等；这些是用户层面的输入设备使用设置，不等同于安装或回退鼠标驱动。',
      '<strong>声音设置</strong>围绕播放设备、录制设备、音量和相关声音属性展开。选择默认播放/录制设备决定应用通常优先使用哪个设备，但不会把其他设备从电脑中删除。静音只改变声音输出状态，也不等于禁用声卡驱动。',
      '<strong>设备和打印机/相关硬件入口</strong>用于查看或配置已连接设备的常规属性；<strong>设备管理器</strong>更偏向设备状态、驱动、启用/禁用等底层管理。看到“黄色感叹号、更新驱动”优先想设备管理器；看到“默认扬声器、鼠标双击速度”优先想常规硬件/声音设置。',
      '<strong>边界：</strong>改变系统音量、默认播放设备、鼠标行为不会自动修改音频文件、文档或硬件本身的数据。'
    ]);

    addNote('#word-4', 'borders-shading', '边框和底纹：先确认作用对象是文字还是段落', [
      '<strong>边框</strong>可以围绕文字、段落等对象绘制线条；<strong>底纹</strong>用于给相应对象设置背景填充。设置前最重要的是确认“应用于”谁，因为文字级与段落级结果不同。',
      '<strong>应用于文字</strong>时，边框/底纹通常紧贴所选文字范围；<strong>应用于段落</strong>时，效果按段落区域和段落边界展开，可能覆盖整段可用宽度。视觉上都像“框起来/涂底色”，但作用层级不同。',
      '页眉下面的横线常来自页眉段落的下边框；页面边框又属于页面级效果；表格边框则作用于表格/单元格。四者都叫“边框”，不能互套操作路径。',
      '底纹不是“文本突出显示颜色”的同义词。突出显示更接近给文字加荧光笔效果；段落底纹属于边框和底纹体系，作用范围和入口不同。'
    ]);

    addNote('#word-13', 'picture-insert-source', '插入图片：来源不同，插入后都按图片对象继续处理', [
      '<strong>来自文件的图片</strong>从本地或可访问文件位置选择图像插入；<strong>联机图片</strong>通过 Word 2016 支持的在线来源搜索/获取图片。在线服务的具体入口可能随服务可用性变化，但教材考点的核心是“图片可以从不同来源插入”。',
      '图片插入文档后，后续仍围绕图片对象进行：调整大小、裁剪、旋转、图片样式、位置和文字环绕等。图片来源不会自动决定它必须使用哪一种环绕方式。',
      '<strong>插入图片、屏幕截图、链接/嵌入外部对象</strong>不是同一操作：普通图片得到图像对象；屏幕截图捕获屏幕画面；链接对象还保留与外部源文件的联系。'
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
