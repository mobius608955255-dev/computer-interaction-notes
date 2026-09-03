(function () {
  'use strict';

  const demos = window.NOTE_DEMOS || {};
  const escapeHTML = value => String(value ?? '').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const getItems = demo => demo?.kind === 'choose' ? demo.options : demo?.actions || [];
  const choice = (demo, index, className = '') => {
    const item = getItems(demo)[index];
    return item ? `<button type="button" class="sim-hit ${className}" data-sim-choice="${index}"><span>${escapeHTML(item.label)}</span></button>` : '';
  };
  const choices = (demo, className = '') => getItems(demo).map((_, index) => choice(demo, index, className)).join('');
  const step = (demo, index, label, className = '') => `<button type="button" class="sim-hit ${className}" data-sim-step="${index}"><span>${escapeHTML(label || demo.steps[index].label)}</span></button>`;
  const toolbar = (app, active, commands = '', tabStep = null) => {
    const tabs = app === 'Excel' ? ['开始','插入','页面布局','公式','数据','审阅','视图'] : app === 'PowerPoint' ? ['开始','插入','设计','切换','动画','幻灯片放映','审阅','视图'] : ['开始','插入','设计','布局','引用','邮件','审阅','视图'];
    if (active && !tabs.includes(active)) tabs.push(active);
    return `<div class="office-ribbon" aria-label="${app} 2016 功能区" ${tabStep === null ? '' : `data-tab-step="${tabStep}"`}>
    <div class="office-tabs"><span>文件</span>${tabs.map(tab => tab === active && tabStep !== null ? `<button type="button" class="office-tab active" data-sim-step="${tabStep}">${tab}</button>` : `<span class="${tab === active ? 'active' : ''}">${tab}</span>`).join('')}</div>
    <div class="office-commands">${commands}</div>
  </div>`;
  };
  const office = (app, title, activeTab, commands, canvas, side = '', tabStep = null) => `<div class="office-window app-${app.toLowerCase()}">
    <div class="office-titlebar"><i></i><strong>${escapeHTML(title)} - ${app} 2016</strong><span>—　□　×</span></div>
    ${toolbar(app, activeTab, commands, tabStep)}
    <div class="office-workspace">${canvas}${side}</div>
    <div class="office-status"><span>第 1 页</span><span>${app === 'Excel' ? '就绪' : '中文（中国）'}　　▁▂▃　100%</span></div>
  </div>`;
  const win = (title, body, taskbar = true) => `<div class="win10-screen">
    <div class="win-window"><div class="win-title"><span class="win-app-dot"></span><strong>${escapeHTML(title)}</strong><span>—　□　×</span></div>${body}</div>
    ${taskbar ? '<div class="win-taskbar"><b>⊞</b><span class="win-search">在这里输入你要搜索的内容</span><i></i><i></i><i></i><small>10:28<br>2026/9/2</small></div>' : ''}
  </div>`;
  const feedback = text => `<div class="sim-feedback" data-sim-feedback aria-live="polite"><span>观察区</span><p>${escapeHTML(text)}</p></div>`;
  const coach = (label, text, controls = '') => `<aside class="practice-dock" aria-label="练习引导">
    <div class="practice-copy"><span>${escapeHTML(label)}</span><p>${escapeHTML(text)}</p></div>
    ${controls ? `<div class="practice-controls">${controls}</div>` : ''}
  </aside>`;
  const genericInitial = demo => demo?.initial || (demo?.kind === 'sequence' ? '从界面中找到第一步并开始操作。' : '直接操作画面中的对象，观察它怎样变化。');

  const scenes = {
    // 第1章：每个概念对应一种独立的可操控模型。
    y2026q18(demo) {
      return `<div class="sovereignty-map">
        <div class="sovereignty-core"><b>长期自主运行</b><span data-sim-gauge>100%</span></div>
        <div class="dependency-ring">${getItems(demo).map((item, i) => `<button type="button" data-sim-choice="${i}" class="dependency-node node-${i}"><i>${['⌘','§','◇','↻'][i]}</i><b>${escapeHTML(item.label)}</b><small>${['能否修改','能否合法用','能否替代','能否维护'][i]}</small></button>`).join('')}</div>
        <p class="diagram-caption">点开任一依赖环节，中心仪表会显示缺失它的真实后果。</p>
      </div>${feedback('“国产”只是来源标签；自主可控是一条不能断裂的能力链。')}`;
    },
    y2026q1(demo) {
      return `<div class="evolution-lab">
        <div class="evolution-axis"><span>性能 ↑</span><i></i><small>体积 →</small>
          <button data-sim-choice="1" class="device-dot super"><b>超算</b><em>极强 · 极大</em></button>
          <button data-sim-choice="1" class="device-dot phone"><b>手机</b><em>强 · 很小</em></button>
          <button data-sim-choice="1" class="device-dot embed"><b>嵌入式</b><em>专用 · 微型</em></button>
          <button data-sim-choice="0" class="false-rule">体积越大<br>速度越快？</button>
        </div>
        <div class="trend-chips">${choice(demo, 2, 'trend-chip')}</div>
      </div>${feedback('看散点位置：性能和体积不是一条必然同向的直线。')}`;
    },
    y2020q31(demo) {
      return `<div class="binary-desk" data-binary-board>
        <div class="binary-paper">
          <div class="borrow-row" data-borrow-row>　　</div>
          <div class="binary-line"><span></span><b>1 0 0 1</b></div>
          <div class="binary-line"><span>−</span><b>0 1 1 1</b></div>
          <div class="binary-rule"></div><div class="binary-answer" data-binary-answer>· · · ·</div>
        </div>
        <div class="binary-pencil"><span>当前数位</span><b data-binary-column>等待开始</b></div>
        <div class="binary-keys">${demo.steps.map((item, i) => step(demo, i, item.label, `binary-key key-${i}`)).join('')}</div>
      </div>${feedback('从最低位开始；遇到0不够减1时，向高位借1，相当于本位增加2。')}`;
    },
    'merged-3'(demo) {
      return `<div class="unit-studio">
        <div class="pixel-photo"><div class="pixel-grid">${Array.from({length:36},(_,i)=>`<i style="--p:${i}"></i>`).join('')}</div><b>6 × 6 像素</b></div>
        <div class="unit-inspector"><div><span>一个开关</span><b>0 / 1</b>${choice(demo,0,'unit-lens')}</div><div><span>文件容量</span><b>8 个位</b>${choice(demo,1,'unit-lens')}</div><div><span>画面小格</span><b>Pixel</b>${choice(demo,2,'unit-lens')}</div><div><span>网络速率</span><b>100 Mb/s</b>${choice(demo,3,'unit-lens')}</div></div>
      </div>${feedback('同一个数字前后的语境，决定单位是位、字节还是像素。')}`;
    },
    y2026q41(demo) {
      const pads = ['7','A','F','2F'];
      return `<div class="nibble-console">
        <div class="hex-display"><small>HEX</small><b data-hex-value>?</b><span>⇣ 每位展开 4 bit</span><div class="bit-cells" data-bit-cells><i>·</i><i>·</i><i>·</i><i>·</i></div></div>
        <div class="hex-pad">${pads.map((v,i)=>`<button type="button" data-sim-choice="${i}">${v}</button>`).join('')}</div>
        <div class="nibble-ruler"><span>8</span><span>4</span><span>2</span><span>1</span></div>
      </div>${feedback('16 = 2⁴，所以一个十六进制数码恰好占满四个二进制位。')}`;
    },
    'merged-1'(demo) {
      return `<div class="vonneumann-machine">
        <div class="vn-bus"><i data-packet></i></div>
        <div class="vn-unit memory"><small>存储器</small><b>程序 + 数据</b><div class="memory-lines">1010<br>LOAD<br>0011</div></div>
        <div class="vn-cpu"><div class="vn-unit controller"><small>控制器</small><b>取指 / 译码</b></div><div class="vn-unit alu"><small>运算器</small><b>执行</b></div></div>
        <div class="vn-unit io"><small>输入 / 输出</small><b>结果</b></div>
        <div class="machine-clock">${demo.steps.map((item,i)=>step(demo,i,`${i+1} · ${item.label}`,`clock-tick tick-${i}`)).join('')}</div>
      </div>${feedback('程序和数据先放入同一存储器，控制器再按地址逐条取指。')}`;
    },
    y2020q23(demo) {
      return `<div class="language-terminal">
        <div class="code-panes"><div class="code-pane human"><span>高级语言</span><code>total = a + b</code></div><div class="compiler-tunnel"><i>编译 / 汇编</i><b>→</b></div><div class="code-pane cpu"><span>CPU</span><code>1011 0010</code></div></div>
        <div class="language-elevator">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}"><b>${escapeHTML(item.label)}</b><small>${['直接执行','助记符层','接近人类'][i]}</small></button>`).join('')}</div>
      </div>${feedback('点一种语言，观察它到CPU之间还需要哪一层翻译。')}`;
    },
    'merged-2'(demo) {
      return `<div class="software-desktop">
        <div class="software-icons">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="app-tile app-${i}"><i>${['⊞','▧','W','{ }'][i]}</i><b>${escapeHTML(item.label)}</b></button>`).join('')}</div>
        <div class="software-drawers"><div><span>系统软件</span><p>管理资源 · 提供环境</p></div><div><span>应用软件</span><p>完成用户具体任务</p></div></div>
      </div>${feedback('不是看“系统自带”还是“后来安装”，而是看软件的主要功能。')}`;
    },
    y2026q3(demo) {
      return `<div class="memory-power-lab">
        <div class="power-strip"><b>POWER</b>${choices(demo,'power-button')}</div>
        <div class="memory-modules"><div class="ram-module"><small>RAM · 运行现场</small><div data-ram-bits>101101<br>窗口 / 文档<br>临时数据</div><b data-ram-led>● 通电</b></div><div class="rom-module"><small>ROM · 固化内容</small><div data-rom-bits>BOOT<br>FIRMWARE<br>100101</div><b>◆ 非易失</b></div></div>
      </div>${feedback('试着断电：RAM中的运行现场会消失，ROM中的固化内容仍保留。')}`;
    },
    y2026q31(demo) {
      return `<div class="compute-arena" data-drag-lab>
        <div class="processor cpu-board" data-drop-target="cpu"><header><b>CPU</b><span>4 个复杂核心</span></header><div>${Array.from({length:4},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><small>分支 · 调度 · 通用控制</small><em>放到这里</em></div>
        <div class="workload-queue">${getItems(demo).map((item,i)=>`<button type="button" data-drag-kind="workload" data-choice="${i}" data-correct-target="${i===1?'gpu':'cpu'}" aria-label="拖动${['复杂分支与系统调度','大规模矩阵并行','整个操作系统'][i]}"><span>${['系统调度','矩阵运算','操作系统'][i]}</span><i>按住并拖动</i></button>`).join('')}</div>
        <div class="processor gpu-board" data-drop-target="gpu"><header><b>GPU</b><span>大量并行单元</span></header><div>${Array.from({length:48},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><small>同类任务 · 大规模并行</small><em>放到这里</em></div>
      </div>${feedback('选择工作负载，合适的一侧会点亮；CPU和GPU是协作关系。')}`;
    },
    y2020q1(demo) {
      const parts = [['内存条','▥▥▥▥▥'],['CPU','▣'],['网卡','▤○'],['主板','▦']];
      return `<div class="pc-workbench"><div class="anti-static-mat">${parts.map((p,i)=>`<button type="button" data-sim-choice="${i}" class="pc-part part-${i}"><i>${p[1]}</i><b>${p[0]}</b><small>${['长条PCB · 金手指','方形封装','RJ45接口','大型电路板'][i]}</small></button>`).join('')}</div><div class="bench-label">装机识别台 · 点击零件查看辨识证据</div></div>${feedback('内存条最稳定的外形线索是长条电路板和底边成排金手指。')}`;
    },
    y2020q22(demo) {
      return `<div class="io-station"><div class="computer-core"><span>计算机</span><b>数据</b></div>${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="io-device io-${i}"><i>${['✎','◉','▰','▱'][i]}</i><b>${escapeHTML(item.label)}</b><span data-direction>${['→','→','←','↔'][i]}</span></button>`).join('')}<div class="io-legend"><span>→ 信息进入计算机</span><span>← 信息离开计算机</span></div></div>${feedback('沿着数据流箭头判断主要功能；硬盘是存储设备，同时具有双向读写。')}`;
    },

    // 第2章：直接操作一个缩小但结构真实的 Windows 10 场景。
    y2026q7(demo) {
      return `<div class="scheduler-sim"><div class="cpu-mode">${getItems(demo).slice(0,2).map((_,i)=>choice(demo,i,'mode-switch')).join('')}</div><div class="timeline"><div class="core-row"><b>核心 1</b>${['A','B','A','B','A','B'].map(x=>`<i class="task-${x}">${x}</i>`).join('')}</div><div class="core-row second"><b>核心 2</b>${['B','B','B'].map(x=>`<i class="task-${x}">${x}</i>`).join('')}</div><span class="time-cursor"></span></div>${choice(demo,2,'exam-keyword')}</div>${feedback('单核也能让多个任务在同一时间段内推进，这叫并发；多核同一时刻执行才是并行。')}`;
    },
    y2020q2(demo) {
      return win('桌面', `<div class="window-playground" data-window-lab>
        <section class="mini-window window-a active" data-demo-window="a"><div class="mini-title" data-window-drag><span>记事本</span><b>按住这里拖动</b></div><textarea class="window-focus" data-sim-choice="0" aria-label="记事本内容">键盘输入会到这里</textarea></section>
        <section class="mini-window window-b" data-demo-window="b"><div class="mini-title" data-window-drag><span>计算器</span><button type="button" data-sim-choice="1" aria-label="最小化计算器">—</button></div><button type="button" class="window-focus" data-sim-choice="0"><span class="sr-only">激活计算器窗口</span><b>128</b></button></section>
      </div>`)+coach('手势练习','直接拖动任一窗口的标题栏；只有普通窗口能这样移动。')+feedback('点击任一窗口，它会来到最前并获得输入焦点；可见、运行、活动是三个不同状态。');
    },
    y2026q32(demo) {
      return `<div class="power-comparison">
        <div class="power-scene"><div class="desktop-wallpaper"><div class="start-menu"><header>Drd</header><div class="start-apps"><i>文档</i><i>设置</i><i>图片</i></div><footer><b>⏻</b><button type="button" data-sim-choice="0">关机</button></footer></div><div class="shutdown-overlay" data-shutdown-state><b>Windows</b><span>正在关闭应用并写回数据…</span></div></div></div>
        <aside class="device-chassis"><span>实体电源键</span><button type="button" class="physical-power" data-long-press-choice="1" data-short-press-choice="2" aria-label="短按或长按实体电源键"><i></i><b>⏻</b></button><strong data-press-label>轻触＝短按 · 持续按住＝强制断电</strong></aside>
      </div>${feedback('规范关机会先通知程序、写回缓存并卸载文件系统；强制断电跳过这些步骤。')}`;
    },
    y2020q3(demo) {
      return win('文件资源管理器', `<div class="explorer-body recycle-scene"><aside><b>快速访问</b><span>此电脑</span><span>本地磁盘 (C:)</span><span>USB (E:)</span><span>回收站</span></aside><main><div class="pathbar">此电脑 › 文档</div><div class="file-route"><div class="paper-file"><i>TXT</i><b>复习计划.txt</b></div><div class="route-destinations">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="route-${i}"><i>${['♲','USB','⇧','?'][i] || '×'}</i><span>${escapeHTML(item.label)}</span></button>`).join('')}</div></div></main></div>`)+feedback('同样是Delete，文件所在介质不同，是否进入回收站也不同。');
    },
    y2020q24(demo) {
      const modes = [['none','不按键'],['ctrl','Ctrl'],['shift','Shift'],['right','右键拖动']];
      return win('文件资源管理器', `<div class="dual-explorer" data-file-lab>
        <section class="source-pane"><header>本地磁盘 (C:) · 文档</header><button class="drag-file" type="button" data-drag-kind="file" aria-label="拖动笔记.docx"><i>DOCX</i><b>笔记.docx</b><small>按住并拖动</small></button></section>
        <section><header>本地磁盘 (C:) · 归档</header><div class="drop-zone" data-drop-target="same"><b>同盘目标</b><span>拖到这里</span></div></section>
        <section><header>数据盘 (D:) · 资料</header><div class="drop-zone" data-drop-target="cross"><b>跨盘目标</b><span>拖到这里</span></div></section>
      </div>`)+coach('拖动条件','这些是练习条件，不是资源管理器按钮。先选一种，再亲手拖文件。',modes.map((mode,i)=>`<button type="button" data-drag-mode="${mode[0]}" class="${i===0?'active':''}">${mode[1]}</button>`).join(''))+feedback('源盘和目标盘决定默认动作；Ctrl、Shift和右键拖动可以明确覆盖默认规则。');
    },
    'merged-4'(demo) {
      return win('文件资源管理器', `<div class="file-property-scene"><div class="explorer-list"><header><span>名称</span><span>类型</span><span>属性</span></header><button class="selected-file"><i>W</i><b data-filename>report.docx</b><span>Microsoft Word 文档</span><small data-file-attr>—</small></button></div><div class="property-panel"><strong>report.docx 属性</strong><label><input type="checkbox" data-sim-toggle="extensions"> 隐藏已知文件类型的扩展名</label><label><input type="checkbox" data-sim-toggle="readonly"> 只读</label><button type="button" data-sim-choice="1">更改打开方式…</button><button type="button" data-sim-choice="3">尝试重命名为 report?.docx</button></div></div>`)+feedback('扩展名、打开方式和只读属性分别控制不同层面，互不等价。');
    },
    y2026q25(demo) {
      return win('Windows 10', `<div class="settings-flow">
        <section class="settings-view desktop-settings-view" data-stage-view="0"><div class="desktop-icons"><i>回收站</i></div><div class="desktop-context-menu"><button type="button" data-sim-step="0">个性化</button></div></section>
        <section class="settings-view personalization-view" data-stage-view="1"><aside><b>主页</b><span>背景</span><button type="button" data-sim-step="1">主题</button><span>字体</span><span>锁屏界面</span></aside><main><header>个性化</header><div class="settings-hero">选择背景、颜色、主题与锁屏界面</div></main></section>
        <section class="settings-view themes-view" data-stage-view="2"><aside><b>个性化</b><strong>主题</strong></aside><main><header>主题</header><div class="theme-preview-card"><i></i><b>Windows</b></div><h4>相关的设置</h4><button type="button" class="settings-link" data-sim-step="2">桌面图标设置</button></main></section>
        <section class="settings-view icon-dialog-view" data-stage-view="3"><div class="real-dialog"><header>桌面图标设置</header><fieldset><legend>桌面图标</legend><label class="step-checkbox"><input type="checkbox" data-icon-checkbox data-sim-step="3"> 计算机</label><label><input type="checkbox" checked> 回收站</label></fieldset><div class="dialog-preview"><i data-thispc>此电脑</i><i>回收站</i></div><button type="button" class="primary-command" data-sim-step="4">应用</button></div></section>
        <section class="settings-view desktop-result-view" data-stage-view="4"><div class="desktop-icons"><i class="this-pc-visible">此电脑</i><i>回收站</i></div><div class="success-toast">“此电脑”已恢复到桌面</div></section>
      </div>`)+feedback('按Windows 10的真实层级进入设置；每一步都会打开新的页面或对话框。');
    },
    y2026q35(demo) {
      return win('文件资源管理器', `<div class="explorer-body quick-scene"><aside><b>快速访问</b><div data-quick-list><span>桌面</span><span class="pinned">课程资料　📌</span></div><b>此电脑</b><span>文档</span></aside><main><div class="pathbar">D:\学习\课程资料</div><div class="folder-card"><i>▰</i><b>课程资料</b><small>原位置：D:\学习</small></div><div class="context-menu">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div></main></div>`)+feedback('快速访问只是导航入口；取消固定不会移动或删除原文件夹。');
    },
    y2026q8(demo) {
      return win('设备管理器', `<div class="device-manager"><div class="device-tree"><span>〉音频输入和输出</span><b>⌄ 显示适配器</b>${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="device-state state-${i}"><i>${['!','↓','?'][i]}</i><span>${['NVIDIA 显示适配器','USB 输入设备','未知设备'][i]}</span></button>`).join('')}<span>〉网络适配器</span></div><div class="device-properties"><header>设备状态</header><p data-device-status>选择带状态标记的设备，读取“属性”中的诊断信息。</p><button>更新驱动程序…</button><button>扫描检测硬件改动</button></div></div>`)+feedback('黄色感叹号是警报，不是结论；下一步要打开属性读取设备状态。');
    },
    y2026q9(demo) {
      return win('本地组策略编辑器', `<div class="policy-editor"><aside><b>计算机配置</b><span>管理模板</span><span>系统</span><strong>可移动存储访问</strong></aside><main><header>策略设置</header><div class="policy-row"><b>可移动磁盘：拒绝读取权限</b><span data-read-policy>未配置</span></div><div class="policy-row"><b>可移动磁盘：拒绝写入权限</b><span data-write-policy>未配置</span></div><div class="policy-actions">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div><div class="usb-test"><i>USB</i><span data-usb-read>可读取</span><span data-usb-write>可写入</span></div></main></div>`)+feedback('读权限和写权限是两条独立策略，可以形成三种不同限制组合。');
    },
    y2026q26(demo) {
      return `<div class="taskbar-anatomy"><div class="wallpaper-icons"><span>此电脑</span><span>回收站</span></div><div class="anatomy-bar"><button type="button">⊞</button>${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="taskbar-zone zone-${i}"><i>${['▦','W','◉','▧'][i]}</i><span>${escapeHTML(item.label)}</span></button>`).join('')}<time>10:28</time></div><div class="zone-labels"><span>启动</span><span>切换</span><span>系统状态</span></div></div>${feedback('直接点任务栏区域，看它负责启动、切换还是显示状态；桌面背景设置不在这里。')}`;
    },
    y2026q34(demo) {
      return win('任务管理器', `<div class="task-manager"><div class="tm-tabs"><b>进程</b><span>性能</span><span>应用历史记录</span><span>启动</span></div><div class="machine-chip">当前计算机：<strong>DESKTOP-DRD</strong></div><table><thead><tr><th>名称</th><th>CPU</th><th>内存</th></tr></thead><tbody><tr><td>Microsoft Word</td><td>2.1%</td><td>286 MB</td></tr><tr><td>浏览器</td><td>8.4%</td><td>1,204 MB</td></tr><tr><td>系统</td><td>0.3%</td><td>92 MB</td></tr></tbody></table><div class="tm-actions">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div></div>`)+feedback('窗口始终标出“当前计算机”；远程桌面里打开的任务管理器，管理的是远程会话所在主机。');
    },
    y2026q33(demo) {
      return win('系统属性', `<div class="restore-dialog"><div class="restore-header"><b>系统保护</b><span>为系统设置和以前版本的文件创建还原点。</span></div><div class="drive-protection"><strong>本地磁盘 (C:)　保护：<i data-protection>启用</i></strong><div class="restore-points" data-restore-points><span>9月1日 更新前</span><span>8月28日 安装Office前</span><span>8月20日 手动创建</span></div><div class="disk-meter"><i data-disk-meter></i></div></div><div class="restore-actions">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div></div>`)+feedback('空间与恢复能力是一组交换关系；关闭保护会同时清掉相应恢复基础。');
    },

    // 第3章：在缩小的 Word 2016 工作区内完成实际题目动作。
    'merged-5'(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command view-${i}"><i>${['▤','☷','▯','≋'][i]}</i><span>${escapeHTML(item.label)}</span></button>`).join('');
      return office('Word','长文档复习笔记','视图',commands,`<div class="word-view-canvas"><aside class="outline-pane"><b>绪论</b><span>1 信息技术</span><span>　1.1 数据</span><span>2 计算机系统</span></aside><div class="word-pages" data-word-pages><article><h4>计算机系统复习笔记</h4><p>第一章　信息技术与计算机文化</p><p>这是一段用于观察分页和标题层级的正文。切换视图不会修改文档内容。</p></article><article><h4>第二章　Windows 10</h4><p>页面、页眉和对象位置会随视图呈现方式改变。</p></article></div></div>`)+feedback('视图只是观察和编辑方式；切换后文档内容不被改写。');
    },
    'merged-8'(demo) {
      const commands = `<div class="ribbon-group"><b>段落</b>${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command"><i>${['↦','↤','⇤','◁'][i]}</i><span>${escapeHTML(item.label)}</span></button>`).join('')}</div>`;
      return office('Word','多级列表练习','开始',commands,`<div class="word-page list-page"><div class="word-ruler"><i class="first-indent"></i><i class="hanging-indent"></i><span>0　1　2　3　4　5　6　7　8</span></div><div class="list-line level-1"><b>1</b><span>信息技术基础</span></div><div class="list-line level-2 active-list"><b>1.1</b><span contenteditable="true">计算机发展</span></div><div class="list-line level-2"><b>1.2</b><span>计算机系统</span></div><div class="format-readout"><span>编号位置：0.74 cm</span><span>文本缩进：1.48 cm</span><span>级别：2</span></div></div>`)+feedback('编号级别、编号位置和文本起点是三个独立参数；不要把“缩进”笼统看成一件事。');
    },
    y2020q41(demo) {
      const commands = `<div class="ribbon-group sequence-ribbon">${step(demo,1,'页眉 ▼','ribbon-command header-command')}${step(demo,3,'关闭页眉和页脚','ribbon-command close-command')}</div>`;
      return office('Word','考试说明.docx','插入',commands,`<div class="word-page header-page"><div class="header-zone" data-header-zone><input type="text" data-sequence-input="2" aria-label="页眉文字" placeholder="[在此键入页眉]" autocomplete="off" disabled></div><div class="page-body"><h4>考试说明</h4><p>考生应在规定时间内完成所有操作。</p></div><div class="page-boundary">页眉距顶端 1.5 cm</div></div>`,'',0)+coach('操作位置','先点真实的“插入”选项卡，再从功能区打开页眉；然后在页眉区域完整输入“山东专升本计算机”。')+feedback('从真正的“插入”选项卡进入功能区，输入内容后必须退出页眉编辑，才能回到正文。');
    },
    'merged-7'(demo) {
      const commands = `<div class="font-box"><select aria-label="字体"><option>宋体</option></select>${choice(demo,0,'font-size-button')}${choice(demo,1,'bold-button')}</div><div class="paragraph-box">${choice(demo,2,'align-button')}${choice(demo,3,'space-button')}</div>`;
      return office('Word','通知.docx','开始',commands,`<div class="word-page formatting-page"><div class="selection-mark"><h4 data-format-title>关于开展计算机技能竞赛的通知</h4></div><p>各班级：</p><p>为提高同学们的计算机应用能力，现组织技能竞赛。</p></div>`)+feedback('标题看起来是一行文字，但“居中”改变的是它所在的整个段落。');
    },
    y2020q43(demo) {
      const commands = `<div class="paragraph-dialog"><header>段落</header><div class="dialog-fields"><label>左侧缩进 <input value="0 字符" readonly></label><label>特殊格式 <select data-indent-select><option>（无）</option><option>首行缩进</option><option>悬挂缩进</option></select></label><label>度量值 <input value="2 字符" readonly></label></div>${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="dialog-choice">${escapeHTML(item.label)}</button>`).join('')}</div>`;
      return office('Word','议论文.docx','开始','',`<div class="word-page indent-page"><div class="word-ruler"><i class="first-indent"></i><i class="hanging-indent"></i><span>0　1　2　3　4　5　6</span></div><p data-indent-paragraph>择业不应只有一把尺。职业选择既要考虑个人能力，也要考虑长期成长与社会价值。</p><p>当页面宽度改变时，规范段落格式仍会稳定保持。</p></div>`,commands)+feedback('在右侧“段落”对话框中试四种做法，看第一行和后续行是否仍然稳定。');
    },
    y2020q44(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command"><i>${['▥','▯▯','▦','⇥'][i]}</i><span>${escapeHTML(item.label)}</span></button>`).join('');
      return office('Word','校报.docx','布局',commands,`<div class="word-page columns-page"><h4>校园科技节</h4><div class="column-text" data-column-text><p>人工智能与医学交叉正在形成新的研究方向。计算机不仅负责计算，还能辅助影像分析、临床决策与科研设计。</p><p>报刊式分栏让文字先填满左栏，再流向右栏；它不是把两个窗口并排摆放。</p></div><span class="section-mark">:::::::::::::::::::: 分节符（连续） ::::::::::::::::::::</span></div>`)+feedback('真正的“分栏”改变正文流向；“并排查看”只改变屏幕上的窗口排列。');
    },
    y2020q61(demo) {
      const commands = `${step(demo,3,'方向 ▼','ribbon-command orientation-command')}<span class="ribbon-separator"></span>${step(demo,0,'前：分节符','ribbon-command')}${step(demo,1,'后：分节符','ribbon-command')}`;
      return office('Word','实验报告.docx','布局',commands,`<div class="orientation-stage"><article class="mini-page portrait"><b>第 1 节</b><p>正文</p></article><button type="button" data-sim-step="2" class="mini-page portrait target-page" aria-label="在第2节页面中放置光标"><b>第 2 节</b><p>宽表格</p><i class="page-caret" aria-hidden="true"></i></button><article class="mini-page portrait"><b>第 3 节</b><p>正文</p></article><div class="section-scissors"><span data-break-before>前边界未建立</span><span data-break-after>后边界未建立</span></div></div>`)+coach('当前动作','分节完成后，直接点中间那张页面放置光标；练习提示不放进文档内容。')+feedback('纸张方向属于“节”的页面设置；先把目标页用两个分节符单独围起来。');
    },
    y2026q47(demo) {
      const commands = `<div class="asian-layout-dialog"><b>中文版式</b><label><input type="checkbox" checked data-cjk-toggle> 自动调整中文与西文的间距</label><label><input type="checkbox" checked data-num-toggle> 自动调整中文与数字的间距</label></div>`;
      const alternatives = getItems(demo).slice(1).map((item,i)=>`<button type="button" data-sim-choice="${i+1}">${escapeHTML(item.label)}</button>`).join('');
      return office('Word','中西文混排.docx','开始','',`<div class="word-page cjk-page"><div class="cjk-measure"><i>可用行宽</i></div><p data-cjk-paragraph>医学AI（Artificial Intelligence）在2026年进入临床研究的新阶段。</p></div>`,commands)+coach('排版读数与对照','行数读数、“缩小字号”和“删除空格”都属于练习区，不是文档页面或中文版式对话框。',`<span class="line-counter"><b data-line-count>3</b><span>行</span></span>${alternatives}`)+feedback('取消自动中西文/数字间距后，字符占宽减少，行数可能改变；文字内容并没有被删除。');
    },
    y2020q60(demo) {
      const commands = `<div class="table-tools">${step(demo,2,'边框 ▼','ribbon-command')}${step(demo,3,'所有框线','ribbon-command all-borders')}</div>`;
      return office('Word','成绩表.docx','设计',commands,`<div class="word-page table-border-page"><button type="button" data-sim-step="0" class="table-select-handle" aria-label="选中整张表">✥</button><table data-border-table><thead><tr><th>姓名</th><th>计算机</th><th>高数</th></tr></thead><tbody><tr><td>王宁</td><td>92</td><td>88</td></tr><tr><td>李悦</td><td>86</td><td>94</td></tr></tbody></table></div>`,'',1)+feedback('选中整表后才会出现真正的表格工具“设计”选项卡，再从边框菜单应用“所有框线”。');
    },
    y2020q62(demo) {
      const commands = `<div class="table-tools">${step(demo,2,'重复标题行','ribbon-command repeat-header')}</div>`;
      const rows = Array.from({length:8},(_,i)=>`<tr><td>${String(i+1).padStart(2,'0')}</td><td>学生 ${i+1}</td><td>${80+i}</td></tr>`);
      return office('Word','长成绩表.docx','布局',commands,`<div class="two-paper-table"><article><table><thead data-sim-step="0" tabindex="0" role="button" aria-label="选中表格首行标题"><tr><th>序号</th><th>姓名</th><th>成绩</th></tr></thead><tbody>${rows.slice(0,4).join('')}</tbody></table></article><article><table><thead data-repeated-header><tr><th>序号</th><th>姓名</th><th>成绩</th></tr></thead><tbody>${rows.slice(4).join('')}</tbody></table></article></div>`,'',1)+coach('当前动作','直接点第一页表格的首行进行选择；选中后会出现真正的表格工具“布局”选项卡。')+feedback('重复标题只在表格自然跨页时显示；手工复制一行不是同一功能。');
    },
    y2020q63(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command"><i>${['▤','↔','✥'][i]}</i><span>${escapeHTML(item.label)}</span></button>`).join('');
      return office('Word','数据表.docx','布局',commands,`<div class="word-page table-align-page"><table data-align-table><tbody><tr><td data-align-cell>姓名</td><td>成绩</td></tr><tr><td>王宁</td><td>92</td></tr></tbody></table><div class="page-centerline"></div></div>`)+coach('位置读数','这块读数属于练习区，不是文档内容。','<div class="alignment-readout"><span data-table-align>整表：左对齐</span><span data-cell-align>格内文字：左上</span></div>')+feedback('整表相对页面居中，与单元格内容在格内居中，是两个作用对象。');
    },
    'merged-9'(demo) {
      const commands = `<div class="picture-size-box"><label>高度 <input value="6.00 cm" data-image-height readonly></label><label>宽度 <input value="8.50 cm" data-image-width readonly></label><label><input type="checkbox" checked data-aspect-lock> 锁定纵横比</label><span class="real-control-note">图片工具 · 格式 · 大小</span></div>`;
      const comparisons = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('');
      return office('Word','实验图.docx','格式',commands,`<div class="word-page picture-page"><div class="selected-picture" data-picture><div class="photo-art">CT<br><small>原图 8.5 × 6 cm</small></div><i class="resize-handle nw"></i><i class="resize-handle ne"></i><i class="resize-handle sw"></i><button type="button" class="resize-handle se" data-drag-kind="picture-resize" aria-label="拖动右下角缩放图片"></button><button type="button" class="crop-grip" data-drag-kind="picture-crop" aria-label="拖动右侧裁剪图片"></button></div></div>`)+coach('方案对比','下列按钮和尺寸读数属于练习区，不是Word页面内容。先拖动右下角缩放柄或右侧黑色裁剪柄，再比较考试条件。',`<span class="picture-readout" data-picture-readout>8.50 × 6.00 cm · 原始8.5:6</span>${comparisons}`)+feedback('锁定比例时改一边，另一边随比例联动；裁剪是改变可见区域，不是拉伸像素。');
    },
    y2026q36(demo) {
      const commands = `<div class="arrange-tools">${step(demo,2,'组合 ▼ → 组合','ribbon-command group-command')}</div>`;
      return office('Word','封面设计.docx','格式',commands,`<div class="word-page grouping-page"><button type="button" data-sim-step="0" class="group-object photo-object"><i>图片</i><small>嵌入型</small></button><button type="button" data-sim-step="1" class="group-object shape-object"><i>形状</i></button><button type="button" data-sim-step="1" class="group-object wordart-object"><i>医学 × AI</i></button><button type="button" class="group-boundary" data-group-boundary data-drag-kind="group" aria-label="拖动已组合对象"></button></div>`)+coach('组合后的验证','完成三步后，按住组合外框拖动；三个对象应一起移动，而不是只动其中一个。')+feedback('嵌入型图片像一个文字字符，先改为环绕型，才能与浮动形状一起多选并组合。');
    },
    'merged-6'(demo) {
      const commands = `<div class="references-tools">${step(demo,1,'插入题注','ribbon-command')}${step(demo,3,'交叉引用','ribbon-command')}${step(demo,4,'更新域','ribbon-command')}</div>`;
      return office('Word','论文.docx','引用',commands,`<div class="word-page caption-page"><p>如<button type="button" data-sim-step="2" class="text-caret" aria-label="在此处放置交叉引用光标"><i></i></button><span class="cross-reference" data-cross-ref>图 ?</span>所示，模型准确率随训练轮次提高。</p><button type="button" data-sim-step="0" class="figure-object" aria-label="选中图表"><div class="mini-chart"><i></i><i></i><i></i></div><span data-caption></span></button></div>`)+coach('选择对象与插入点','点击图表是选择对象；闪烁竖线才是正文光标。练习提示和命令窗口都不会写进论文。')+feedback('题注负责生成和管理图号，交叉引用负责在正文中引用这个动态编号。');
    },

    // 第4章：每张卡都是一块真正可变化的 Excel 2016 工作表。
    y2020q7(demo) {
      const alternatives = getItems(demo).slice(1).map((item,i)=>`<button type="button" data-sim-choice="${i+1}">${escapeHTML(item.label)}</button>`).join('');
      return office('Excel','销售数据.xlsx','开始','',`<div class="excel-sheet hash-sheet"><div class="formula-bar"><b>fx</b><span>2026/09/02 10:28</span></div><div class="excel-grid two-cols" data-column-grid><b class="col-head">A</b><b class="col-head narrow" data-column-b>B<button type="button" data-drag-kind="column-resize" aria-label="拖动B列右边界调整列宽"><i></i></button></b><span>日期</span><strong data-hash-cell>########</strong><span>金额</span><em>1280.00</em></div><div class="cell-tip">抓住B列标题右边界向右拖动；内容一直在公式栏中。</div></div>`)+coach('替代做法','拖动列边界是当前实操；以下是对照选项，不属于Excel工作表。',alternatives)+feedback('加宽B列后日期会正常显示；清除内容会丢数据，不能当作“修复显示”。');
    },
    y2020q8(demo) {
      const scenarios = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('');
      return office('Excel','工作簿1.xlsx','开始','',`<div class="excel-sheet sheet-delete"><div class="empty-grid">当前工作表内容</div><div class="sheet-tabs" data-sheet-tabs><button class="active">Sheet1</button><button>Sheet2</button><button aria-label="新建工作表">＋</button></div><div class="sheet-menu"><span>插入</span><span>删除</span><span>重命名</span><span>移动或复制</span></div><div class="excel-dialog" data-excel-dialog><b>Microsoft Excel</b><p>工作簿内至少含有一张可见工作表。</p><button>确定</button></div></div>`)+coach('操作情境','下列是三种完整情境，不是工作表内部按钮；选择后观察真实标签栏与系统提示怎样变化。',scenarios)+feedback('删除Sheet2可以成功；只剩Sheet1时再次删除，Excel会阻止操作。');
    },
    y2020q48(demo) {
      const commands = `<div class="excel-number-tools"><label>数字格式 <select aria-label="数字格式"><option>文本</option></select></label><span class="real-control-note">当前A2：文本</span></div>`;
      const rows = Array.from({length:6},(_,i)=>`<span>${i+2}</span><b data-fill-row="${i}">${i===0?'20260001':''}</b><em>${['张琳','王宁','李悦','赵飞','周然','陈安'][i]}</em>`).join('');
      const alternatives = [0,1].map(i=>`<button type="button" data-sim-choice="${i}">${escapeHTML(getItems(demo)[i].label)}</button>`).join('');
      return office('Excel','学生信息.xlsx','开始',commands,`<div class="excel-sheet fill-sheet" data-fill-lab><div class="formula-bar"><b>fx</b><span data-fill-formula>'20260001</span></div><div class="excel-grid fill-grid"><b></b><b>A 学号</b><b>B 姓名</b>${rows}</div><button type="button" data-drag-kind="fill" data-fill-handle aria-label="把填充柄向下拖到A7，双击可自动填充"></button><div class="fill-guide" aria-hidden="true">拖到 A7</div><div class="fill-options" data-fill-options><span>自动填充选项</span><b>填充序列</b></div></div>`)+coach('输入前提','这两项是练习判断，不是工作表里的按钮；完成选择后直接拖绿色填充柄。',alternatives)+feedback('长编号先按文本安全输入；是否递增取决于样本和填充选项，不是“文本一定重复”。');
    },
    y2026q49(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command">${escapeHTML(item.label)}</button>`).join('');
      return office('Excel','导入数据.xlsx','开始',commands,`<div class="excel-sheet text-number-sheet"><div class="formula-bar"><b>fx</b><span>'128</span></div><div class="excel-grid single-column"><b>A</b><button class="text-cell">128<i>◤</i></button><button class="text-cell">96<i>◤</i></button><button class="text-cell">105<i>◤</i></button><strong data-sum-result>=SUM(A1:A3) → 0</strong></div><div class="error-menu"><b>此单元格中的数字为文本格式</b><span>转换为数字</span><span>忽略错误</span></div></div>`)+feedback('显示格式只改变数值怎样呈现；文本要先完成“类型转换”，才能正常参与数值计算。');
    },
    'merged-10'(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="reference-control"><code>${escapeHTML(item.label)}</code></button>`).join('');
      return office('Excel','成绩分析.xlsx','公式',commands,`<div class="excel-sheet reference-sheet"><div class="formula-bar"><b>fx</b><code data-formula>=B2/SUM(B2:B7)</code></div><div class="excel-grid ref-grid"><b></b><b>A 姓名</b><b>B 成绩</b><b>C 占比</b>${['王宁','李悦','张琳'].map((n,i)=>`<span>${i+2}</span><em>${n}</em><strong>${[92,86,78][i]}</strong><button class="formula-cell" data-ref-cell="${i}">${i===0?'22.1%':''}</button>`).join('')}</div><div class="reference-colors"><span>相对引用 B2</span><span>绝对引用 $B$2:$B$7</span><span>混合引用 B$2</span></div></div>`)+feedback('复制公式时观察彩色引用框：没有$的行列会随复制方向移动。');
    },
    y2020q56(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="function-preset"><code>${escapeHTML(item.label)}</code></button>`).join('');
      return office('Excel','身份证明.xlsx','公式',commands,`<div class="excel-sheet mid-sheet"><div class="function-wizard"><header>函数参数　MID</header><label>Text <input value="SD20260018" data-mid-text></label><label>Start_num <input value="3" data-mid-start></label><label>Num_chars <input value="4" data-mid-count></label><div>函数结果 = <b data-mid-result>2026</b></div></div><div class="string-ruler">${[...'SD20260018'].map((c,i)=>`<span data-char-index="${i}"><i>${i+1}</i>${c}</span>`).join('')}</div></div>`)+feedback('MID从第start_num个字符开始，连续取num_chars个；位置从1计数。');
    },
    y2020q57(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="lookup-preset"><code>${escapeHTML(item.label)}</code></button>`).join('');
      return office('Excel','总成绩.xlsx','公式',commands,`<div class="excel-sheet vlookup-sheet"><section><div class="formula-bar"><b>fx</b><code data-vlookup-formula>=VLOOKUP(A2,成绩表!$A$2:$D$100,4,FALSE)</code></div><table><tr><th>学号</th><th>姓名</th><th>总分</th></tr><tr><td class="lookup-key">20260018</td><td>王宁</td><td data-lookup-result>—</td></tr></table></section><div class="lookup-beam">1 找首列 → 2 定位行 → 3 返回第4列</div><section><table class="lookup-table"><tr><th>学号</th><th>高数</th><th>计算机</th><th>总分</th></tr><tr class="matched"><td>20260018</td><td>88</td><td>92</td><td>356</td></tr><tr><td>20260019</td><td>94</td><td>86</td><td>362</td></tr></table></section></div>`)+feedback('VLOOKUP只在所选区域第一列查找学号；FALSE要求精确匹配。');
    },
    y2026q50(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="criteria-chip"><code>${escapeHTML(item.label)}</code></button>`).join('');
      const items = [['北斗终端',12],['车载北斗模块',8],['北斗',5],['GPS终端',20]];
      return office('Excel','库存.xlsx','公式',commands,`<div class="excel-sheet sumif-sheet"><div class="formula-bar"><b>fx</b><code>=SUMIF(A2:A5,"*北斗*",B2:B5)</code></div><table><tr><th>产品</th><th>数量</th><th>是否匹配</th></tr>${items.map((x,i)=>`<tr data-sumif-row="${i}"><td>${x[0]}</td><td>${x[1]}</td><td data-match>${i<3?'✓':'—'}</td></tr>`).join('')}<tfoot><tr><th>合计</th><th data-sumif-total>25</th><th></th></tr></tfoot></table><div class="wildcard-key"><span>* 任意多个字符</span><span>? 任意一个字符</span></div></div>`)+feedback('条件两侧的*允许“北斗”出现在文本任意位置；?只代表一个字符。');
    },
    y2020q47(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command">${escapeHTML(item.label)}</button>`).join('');
      return office('Excel','报表标题.xlsx','开始',commands,`<div class="excel-sheet center-sheet"><div class="excel-grid title-grid"><b>A</b><b>B</b><b>C</b><b>D</b><button class="title-cell" data-cell-a1>2026年成绩分析</button><i data-cell-b1></i><i data-cell-c1></i><i data-cell-d1></i><span>A2</span><span>B2</span><span>C2</span><span>D2</span></div><div class="name-box" data-name-box>当前可单独选中：A1、B1、C1、D1</div></div>`)+feedback('“跨列居中”保留四个独立单元格；“合并后居中”会把区域变成一个单元格。');
    },
    y2020q52(demo) {
      const commands = `<div class="conditional-tools">${step(demo,1,'条件格式 ▼','ribbon-command')}${step(demo,2,'突出显示单元格规则 → 小于…','ribbon-command')}</div>`;
      return office('Excel','成绩表.xlsx','开始',commands,`<div class="excel-sheet conditional-sheet"><table><tr><th>姓名</th><th>成绩</th></tr>${[['王宁',92],['李悦',58],['张琳',46],['赵飞',76]].map((r,i)=>`<tr><td>${r[0]}</td><td class="score-${r[1]}" data-score>${r[1]}</td></tr>`).join('')}</table><button type="button" data-sim-step="0" class="range-selector" aria-label="选中成绩区域B2到B5"><i></i></button><div class="conditional-dialog" data-dialog-stage="conditional"><header>小于</header><label>为小于以下值的单元格设置格式：<input data-condition-threshold inputmode="numeric" placeholder="输入数值"></label><select data-condition-format aria-label="格式"><option value="">选择格式…</option><option value="red">浅红填充深红色文本</option><option value="green">绿填充深绿色文本</option></select>${step(demo,3,'确定','primary-command')}</div></div>`)+coach('选择区域','直接点工作表中绿色轮廓的B2:B5；范围名称只在练习引导中说明。')+feedback('条件格式保留原数值，只根据规则改变外观；分数变化后格式会自动重算。');
    },
    y2020q9(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="criteria-layout-button">${escapeHTML(item.label)}</button>`).join('');
      return office('Excel','学生成绩.xlsx','数据',commands,`<div class="excel-sheet advanced-filter"><section class="criteria-area"><b>条件区域</b><div class="excel-grid criteria-grid" data-criteria-grid><span>计算机</span><span>班级</span><em>&gt;=90</em><em>1班</em><em></em><em>2班</em></div><small data-logic-readout>同一行：计算机≥90 且 班级=1班；下一行：或 班级=2班</small></section><section class="filter-result"><b>筛选结果</b><table><tr><th>姓名</th><th>计算机</th><th>班级</th></tr><tr><td>王宁</td><td>92</td><td>1班</td></tr><tr><td>李悦</td><td>86</td><td>2班</td></tr></table></section></div>`)+feedback('高级筛选：同一行的多个条件是“且”，不同行是“或”；条件标题必须与数据列名一致。');
    },
    y2020q49(demo) {
      const commands = `<div class="data-tools">${step(demo,1,'删除重复项','ribbon-command')}</div>`;
      return office('Excel','报名表.xlsx','数据',commands,`<div class="excel-sheet duplicates-sheet"><table data-duplicate-table><tr><th><button type="button" data-sim-step="0" aria-label="选中数据区域中的学号单元格">学号</button></th><th>姓名</th><th>电话</th></tr><tr><td>20260018</td><td>王宁</td><td>138…01</td></tr><tr class="duplicate-row"><td>20260018</td><td>王宁</td><td>139…99</td></tr><tr><td>20260019</td><td>李悦</td><td>137…28</td></tr></table><div class="remove-duplicates-dialog" data-dialog-stage="duplicates"><header>删除重复项</header><p>若记录在所选列中包含相同值，则删除重复记录。</p><label class="step-checkbox"><input type="checkbox" data-sim-step="2"> 学号</label><label><input type="checkbox"> 姓名</label><label><input type="checkbox"> 电话</label>${step(demo,3,'确定','primary-command')}</div></div>`)+feedback('选哪些列，就按哪些列的组合判重；这里只勾“学号”才符合题意。');
    },
    y2020q58(demo) {
      const commands = `<div class="data-tools">${step(demo,0,'排序：按班级','ribbon-command')}${step(demo,1,'分类汇总','ribbon-command')}</div>`;
      return office('Excel','班级成绩.xlsx','数据',commands,`<div class="excel-sheet subtotal-sheet"><table data-subtotal-table><tr><th>班级</th><th>姓名</th><th>成绩</th></tr><tr><td>2班</td><td>李悦</td><td>86</td></tr><tr><td>1班</td><td>王宁</td><td>92</td></tr><tr><td>2班</td><td>赵飞</td><td>76</td></tr><tr><td>1班</td><td>张琳</td><td>88</td></tr></table><div class="subtotal-dialog" data-dialog-stage="subtotal"><header>分类汇总</header><label>分类字段 <select><option>班级</option></select></label><label>汇总方式 <select><option>平均值</option></select></label><fieldset><legend>选定汇总项</legend><label class="step-checkbox"><input type="checkbox" data-sim-step="2"> 成绩</label></fieldset>${step(demo,3,'确定','primary-command')}</div><div class="outline-levels">1　2　3</div></div>`)+feedback('分类汇总只会在相邻同类记录之间插入汇总，所以必须先按分类字段排序。');
    },
    y2026q51(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command">${escapeHTML(item.label)}</button>`).join('');
      return office('Excel','筛选练习.xlsx','数据',commands,`<div class="excel-sheet clear-filter-sheet"><table><tr><th>姓名</th><th>成绩 <button class="filter-funnel">▼</button></th></tr><tr><td>王宁</td><td>92</td></tr><tr class="filtered-row"><td>李悦</td><td>58</td></tr><tr><td>张琳</td><td>88</td></tr></table><div class="filter-status"><span data-visible-count>2 / 3 条记录可见</span><b data-filter-ui>筛选按钮仍显示</b></div></div>`)+feedback('“清除”撤销条件但保留筛选按钮；再次点击“筛选”才关闭筛选功能。');
    },
    y2020q59(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command">${escapeHTML(item.label)}</button>`).join('');
      return office('Excel','季度销量.xlsx','设计',commands,`<div class="excel-sheet chart-switch-sheet"><table><tr><th></th><th>一季度</th><th>二季度</th><th>三季度</th></tr><tr><th>华东</th><td>20</td><td>35</td><td>42</td></tr><tr><th>华北</th><td>28</td><td>30</td><td>38</td></tr></table><div class="mini-bar-chart" data-chart-switch><div class="chart-legend"><span>华东</span><span>华北</span></div><div class="chart-bars">${[20,28,35,30,42,38].map(v=>`<i style="--h:${v}%"></i>`).join('')}</div><div class="chart-axis">一季度　　二季度　　三季度</div></div></div>`)+feedback('切换行/列只是重新解释同一源数据的系列与分类，不会转置工作表数据。');
    },
    y2026q52(demo) {
      const commands = `<div class="chart-tools">${step(demo,1,'插入柱形图','ribbon-command')}${step(demo,2,'更改图表类型 → 组合图','ribbon-command')}${step(demo,3,'增长率：次坐标轴','ribbon-command')}${step(demo,4,'添加图表元素 → 轴标题','ribbon-command')}</div>`;
      return office('Excel','经营分析.xlsx','插入',commands,`<div class="excel-sheet combo-chart-sheet"><div class="data-range-wrap"><table><tr><th>月份</th><th>销售额/万元</th><th>增长率/%</th></tr><tr><td>1月</td><td>120</td><td>3</td></tr><tr><td>2月</td><td>180</td><td>7</td></tr><tr><td>3月</td><td>240</td><td>5</td></tr></table><button type="button" data-sim-step="0" class="select-data-range" aria-label="选中数据区域A1到C4"><i></i></button></div><div class="combo-chart"><div class="primary-axis">240<br>120<br>0</div><div class="combo-bars"><i style="--h:40%"></i><i style="--h:62%"></i><i style="--h:82%"></i><svg viewBox="0 0 240 100" preserveAspectRatio="none"><polyline points="10,75 120,25 230,48"/></svg></div><div class="secondary-axis" data-secondary-axis>10%<br>5%<br>0%</div></div></div>`)+coach('当前选择','先直接点绿色轮廓选中A1:C4；轴标题命令现在只出现在真实功能区。')+feedback('销售额和增长率量纲悬殊；给增长率设置次坐标轴，二者趋势才同时可读。');
    },

    // 第5章：还原 PowerPoint 的缩略图、幻灯片画布、窗格和放映行为。
    y2020q10(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command"><i>${['▦','▣','▶'][i]}</i><span>${escapeHTML(item.label)}</span></button>`).join('');
      return office('PowerPoint','医学AI汇报.pptx','视图',commands,`<div class="ppt-view-stage"><aside class="ppt-thumbnails">${Array.from({length:6},(_,i)=>`<button type="button" data-slide-nav="${i+1}"><span>${i+1}</span><i style="--slide:${i}"></i></button>`).join('')}</aside><div class="ppt-main-slide" data-ppt-view><small data-slide-number>01</small><h4 data-slide-heading>人工智能辅助医学影像</h4><div class="ppt-hero-chart"><i></i><i></i><i></i></div><p data-slide-subtitle>课程汇报</p></div><div class="slide-sorter" data-slide-sorter>${Array.from({length:6},(_,i)=>`<button type="button" data-drag-kind="slide" data-slide-num="${i+1}" aria-label="拖动第${i+1}张幻灯片重排"><i style="--slide:${i}"></i><span>第${i+1}页</span></button>`).join('')}</div></div>`)+coach('页面与排序','普通视图可直接点左侧缩略图换页；切到浏览视图后，按住任一缩略图拖到另一页上即可重排。')+feedback('幻灯片浏览视图把全部页面平铺，最适合整体重排；普通视图适合编辑单页。');
    },
    y2020q12(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command">${escapeHTML(item.label)}</button>`).join('');
      return office('PowerPoint','答辩.pptx','幻灯片放映',commands,`<div class="ppt-hide-stage"><aside class="ppt-thumbnails">${[1,2,3,4].map(i=>`<button type="button" class="thumb-${i} ${i===3?'selected':''}" data-slide-nav="${i}"><i>${i}</i><span>第${i}页</span></button>`).join('')}</aside><div class="ppt-main-slide"><small data-slide-number>03</small><h4 data-slide-title>第 3 页：备用数据</h4><div class="hidden-stamp" data-hidden-stamp>隐藏</div><p data-slide-subtitle>页面仍保留在文件中，只在正常放映时被跳过。</p></div><div class="play-route"><span>1</span><span>2</span><i>跳过 3</i><span>4</span></div></div>`)+coach('页面导航','先点左侧缩略图真正切换当前页；隐藏或删除操作只作用于当前选中的第3页。')+feedback('隐藏是放映属性，删除才会从演示文稿中移除页面。');
    },
    y2026q53(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ribbon-command">${escapeHTML(item.label)}</button>`).join('');
      return office('PowerPoint','病例展示.pptx','格式',commands,`<div class="ppt-picture-stage"><aside class="animation-pane"><b>动画窗格</b><span><i>1</i> 图片：淡入</span><span><i>2</i> 标题：浮入</span></aside><div class="ppt-main-slide"><div class="ppt-selected-picture" data-ppt-picture><div class="scan-image">CT<br><small>原图</small></div><i class="resize-handle nw"></i><i class="resize-handle ne"></i><i class="resize-handle sw"></i><button type="button" class="resize-handle se" data-drag-kind="picture-resize" aria-label="拖动右下角缩放图片"></button><button type="button" class="crop-grip" data-drag-kind="picture-crop" aria-label="拖动右侧裁剪图片"></button><span class="picture-effect">柔化边缘 5 磅</span></div><h4>影像学表现</h4></div><div class="picture-source-gallery"><span>MRI 新图</span><span>本地文件</span><span>剪贴板</span></div></div>`)+coach('直接操作图片','替换后可拖动右下角缩放柄，也可拖动右侧黑色裁剪柄检查可见区域；这些是真实对象手柄。')+feedback('“更改图片”保留原对象身份，所以位置、大小、边框和动画大多能继续保留。');
    },
    y2026q54(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="autofit-option">${escapeHTML(item.label)}</button>`).join('');
      return office('PowerPoint','课程提纲.pptx','开始',commands,`<div class="ppt-autofit-stage"><aside class="autofit-slides"><button type="button" class="selected" data-slide-nav="1"><i>1</i><span>学习目标</span></button><button type="button" data-generated-slide data-slide-nav="2" hidden><i>2</i><span>学习目标（续）</span></button></aside><div class="ppt-main-slide"><small data-slide-number>01</small><div class="text-placeholder" data-autofit-box><h4 data-slide-heading>学习目标</h4><p data-autofit-text>掌握计算机基础概念；理解操作系统的基本功能；能够在Word、Excel和PowerPoint中完成规范操作；形成信息安全意识。</p><button class="autofit-smarttag" aria-label="自动调整选项">↙</button></div></div><div class="overflow-meter"><b data-overflow-value>超出 32%</b><i></i><small>占位符边界固定</small></div></div>`)+coach('真实页面变化','选择“拆成两张幻灯片”后会生成第2页；可以直接点左侧缩略图在两页间切换。')+feedback('自适应不是只有一种：可以缩小文字、扩大形状，或把溢出内容拆到新幻灯片。');
    },
    y2020q11(demo) {
      const commands = getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="master-scope">${escapeHTML(item.label)}</button>`).join('');
      return office('PowerPoint','统一模板.pptx','视图',commands,`<div class="ppt-master-stage"><aside class="master-tree"><button class="master-top"><i></i><b>幻灯片母版</b></button><button><i></i><span>标题幻灯片版式</span></button><button><i></i><span>标题和内容版式</span></button><button><i></i><span>两栏内容版式</span></button></aside><div class="master-canvas"><div class="master-badge">母版视图</div><h4 data-master-title>单击此处编辑母版标题样式</h4><div class="master-footer" data-master-footer>山东专升本 · 2027</div><div class="affected-slides"><span>影响：全部相关幻灯片</span></div></div></div>`)+feedback('修改顶层母版影响其下多种版式；修改某个版式只影响使用该版式的页面。');
    },
    y2020q53(demo) {
      const commands = `<div class="theme-gallery"><button class="theme-a">Aa<br><small>主题A</small></button>${getItems(demo).slice(0,2).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="theme-b">Aa<br><small>${escapeHTML(item.label)}</small></button>`).join('')}${choice(demo,2,'background-only')}</div>`;
      return office('PowerPoint','专题汇报.pptx','设计',commands,`<div class="ppt-theme-stage"><aside class="ppt-thumbnails">${[1,2,3,4].map(i=>`<button class="${i===2||i===3?'selected':''}"><i data-theme-thumb="${i}">${i}</i><span>第${i}页</span></button>`).join('')}</aside><div class="ppt-main-slide" data-theme-slide><h4>人工智能前沿</h4><p>已选中第2、3页</p><div class="theme-swatches"><i></i><i></i><i></i></div></div></div>`)+feedback('直接单击主题通常应用于全部页；右键“应用于所选幻灯片”才限定范围。');
    },
    y2020q54(demo) {
      const commands = `${step(demo,0,'设置背景格式','ribbon-command')}`;
      return office('PowerPoint','封面.pptx','设计',commands,`<div class="ppt-background-stage"><div class="ppt-main-slide" data-background-slide><h4>医学 × 人工智能</h4><p>研究计划汇报</p></div><aside class="format-background"><b>设置背景格式</b>${step(demo,1,'图片或纹理填充','pane-command')}${step(demo,2,'插入图片：从文件…','pane-command')}<div class="background-preview"><i></i><span>已选择 neural-grid.png</span></div>${step(demo,3,'应用到当前页 / 全部应用','pane-command primary')}</aside></div>`)+feedback('最后一步决定作用范围：当前页还是全部幻灯片。');
    },
    'merged-11'(demo) {
      return office('PowerPoint','交互课件.pptx','动画',`<div class="motion-tabs"><span>切换</span><span>动画</span><span>动作</span></div>`,`<div class="ppt-motion-stage"><aside class="motion-timeline"><b>当前页</b><strong data-motion-page>1 / 8</strong><i data-motion-marker></i><span>0s</span><span>5s</span></aside><div class="ppt-main-slide"><small data-slide-number>01</small><button type="button" data-sim-choice="1" class="animated-title" data-slide-heading>医学AI导论</button><button type="button" data-sim-choice="2" class="action-button">跳到第8页</button><div class="slide-transition" data-transition-layer></div><p data-slide-subtitle>点击动作按钮会真正导航，而非只显示提示。</p></div><div class="motion-controls">${choice(demo,0)}${choice(demo,3)}</div></div>`)+feedback('切换作用于整页之间；动画作用于对象；动作决定点击后跳到哪里。');
    },
    'merged-12'(demo) {
      const commands = `${step(demo,2,'添加动画：擦除','ribbon-command')}${step(demo,3,'效果选项：按类别','ribbon-command')}`;
      return `<div class="chart-transfer-source"><div><span>Excel 2016 · 成绩.xlsx</span><div class="source-chart"><i></i><i></i><i></i></div></div>${step(demo,0,'复制图表','source-command')}</div>`+office('PowerPoint','数据汇报.pptx','动画',commands,`<div class="ppt-chart-animation"><aside class="animation-pane"><b>动画窗格</b><span data-animation-item>1　图表：擦除</span>${step(demo,4,'▶ 预览','preview-command')}</aside><div class="ppt-main-slide"><div class="ppt-chart" data-ppt-chart>${[['一班',72],['二班',88],['三班',63]].map((x,i)=>`<div class="ppt-bar bar-${i}"><i style="--h:${x[1]}%"></i><span>${x[0]}</span></div>`).join('')}</div></div><div class="paste-options-panel"><b>粘贴选项</b>${step(demo,1,'保留源格式并嵌入工作簿','source-command')}<span>图片</span></div></div>`)+coach('软件边界','“复制图表”属于上方Excel源窗口；粘贴选项属于PowerPoint界面，两者都不再塞进幻灯片画布。')+feedback('只有保留图表结构，PowerPoint才认识系列与类别，才能分组依次播放。');
    },
    y2026q55(demo) {
      const commands = `${step(demo,0,'自定义幻灯片放映','ribbon-command')}`;
      return office('PowerPoint','答辩.pptx','幻灯片放映',commands,`<div class="custom-show-stage"><div class="ppt-main-slide custom-show-slide"><h4>毕业答辩</h4><p>研究方法与结果</p></div><section class="custom-show-dialog show-manager" data-custom-view="manager"><header>自定义放映</header><div class="scheme-row"><b>答辩精简版</b><span data-scheme-count>4 张幻灯片</span></div>${step(demo,1,'编辑…','dialog-command')}</section><section class="custom-show-dialog show-editor" data-custom-view="editor"><header>定义自定义放映</header><div class="show-list"><section><b>演示文稿中的幻灯片</b>${[1,2,3,4,5].map(i=>`<span>第${i}页</span>`).join('')}</section><div class="show-arrows">›<br>‹</div><section><b>答辩精简版</b>${[1,2,3,4].map(i=>`<button type="button" ${i===3?'data-sim-step="2"':''}>第${i}页</button>`).join('')}</section></div><div class="custom-show-actions">${step(demo,3,'删除并确定','primary-command')}</div><div class="slide-file-count">文件中仍有 <b>5</b> 张幻灯片</div></section></div>`)+feedback('先打开方案管理窗口，再进入编辑窗口；从方案中移除引用不会删除源幻灯片。');
    },

    // 第6章：让数据包、协议层、地址和检索集合在画面里真正流动。
    y2020q15(demo) {
      return `<div class="network-zoom-map"><div class="map-ring wan"><span>WAN · 世界</span><div class="map-ring man"><span>MAN · 城市</span><div class="map-ring lan"><span>LAN · 校园/楼宇</span><div class="map-building">教学楼</div></div></div></div><div class="map-controls">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="map-zoom zoom-${i}">${escapeHTML(item.label)}</button>`).join('')}</div></div>${feedback('点覆盖范围，镜头会落到LAN、MAN或WAN对应的尺度。')}`;
    },
    y2020q26(demo) {
      return `<div class="packet-track"><div class="network-sliders">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="metric-dial metric-${i}"><b>${escapeHTML(item.label)}</b><i></i><small>${['100 Mb/s 上限','当前 72 Mb/s','有效 61 Mb/s','28 ms 往返'][i]}</small></button>`).join('')}</div><div class="packet-pipe"><div class="packet-stream">${Array.from({length:10},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><span class="pipe-capacity">管道容量</span><span class="pipe-clock">响应等待</span></div><div class="network-readout"><b data-network-value>61 Mb/s</b><span data-network-label>实际有效吞吐</span></div></div>${feedback('带宽是上限，速率是当前传输快慢，吞吐量是有效数据，时延是等待时间。')}`;
    },
    y2026q13(demo) {
      return `<div class="print-network"><div class="print-client client-a"><b>电脑 A</b>${choice(demo,0,'print-submit')}</div><div class="print-client client-b"><b>电脑 B</b>${choice(demo,1,'print-submit')}</div><div class="network-lines"><i></i><i></i></div><div class="shared-printer"><span>网络打印机</span><div class="paper-slot"></div><div class="print-queue" data-print-queue><small>队列为空</small></div>${choice(demo,2,'share-toggle')}</div></div>${feedback('两台电脑提交后进入同一队列，说明共享的是一台硬件资源，而不是复制了一台打印机。')}`;
    },
    'merged-13'(demo) {
      const layers=[['应用层','HTTP · DNS','应用/表示/会话'],['传输层','TCP · UDP','传输层'],['网际层','IP','网络层'],['网络接口层','Ethernet · Wi-Fi','数据链路/物理']];
      return `<div class="protocol-stack"><div class="tcp-stack">${layers.map((x,i)=>`<button type="button" data-sim-choice="${i}" class="protocol-layer layer-${i}"><b>${x[0]}</b><span>${x[1]}</span></button>`).join('')}</div><div class="encapsulation-arrow"><span>封装 ↓</span><i data-protocol-packet>DATA</i><span>↑ 解封装</span></div><div class="osi-stack">${layers.map((x,i)=>`<div class="osi-layer layer-${i}"><b>${x[2]}</b><span>OSI对应</span></div>`).join('')}</div></div>${feedback('点击TCP/IP的一层，右侧会点亮它近似对应的OSI层。')}`;
    },
    y2026q14(demo) {
      const segs=[['https','协议'],['example.com','主机'],['/Python/page.html','路径'],['?q=1','查询'],['#top','片段']];
      return `<div class="browser-url-lab"><div class="browser-chrome"><div class="browser-tabs"><span>Python学习笔记　×</span><i>＋</i></div><div class="address-bar"><b>🔒</b>${segs.map((x,i)=>`<button type="button" data-sim-choice="${i}" class="url-segment seg-${i}">${escapeHTML(x[0])}</button>`).join('')}</div></div><div class="web-page-preview"><h4>Python 学习笔记</h4><p id="top">页面顶部 #top</p><div class="server-envelope"><span>发送给服务器</span><code>GET /Python/page.html?q=1</code><small>#top 不发送</small></div></div></div>${feedback('点击地址栏各段，观察它们分别决定协议、服务器、资源、参数和页内位置。')}`;
    },
    y2026q15(demo) {
      return `<div class="hotspot-scene"><div class="laptop-device"><div class="laptop-screen"><b>可用网络</b>${step(demo,1,'连接 DRD-Hotspot','wifi-network')}</div><i></i></div><div class="wifi-waves"><i></i><i></i><i></i><span data-hotspot-packet></span></div><div class="phone-device"><div class="phone-screen"><b>个人热点</b>${step(demo,0,'开启热点','phone-switch')}<span>已连接设备：<i data-device-count>0</i></span>${step(demo,2,'转发流量 / NAT','phone-route')}</div></div><div class="cell-tower">${step(demo,3,'连接移动网络','tower-button')}<i></i><i></i></div></div>${feedback('先开启接入点，再建立Wi‑Fi连接，手机随后转发流量到移动网络。')}`;
    },
    y2020q16(demo) {
      return `<div class="web-ide"><aside class="file-tree"><b>网站项目</b>${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="file-type file-${i}"><i>${['HTML','CSS','JS','DOC'][i]}</i><span>${escapeHTML(item.label)}</span></button>`).join('')}</aside><main><div class="editor-tabs"><span>index.html　×</span></div><pre><code>&lt;h1&gt;计算机笔记&lt;/h1&gt;\n&lt;p&gt;网页由结构、样式和脚本组成。&lt;/p&gt;</code></pre><div class="live-preview"><h4>计算机笔记</h4><p>网页由结构、样式和脚本组成。</p></div></main></div>${feedback('HTML、CSS和JavaScript是网页资源；docx即使能被浏览器下载，也不是网页源文件。')}`;
    },
    y2020q36(demo) {
      return `<div class="anchor-builder"><div class="html-code-line"><span>&lt;</span>${choice(demo,0,'code-token tag-token')} ${choice(demo,1,'code-token attr-token')}<span>=&quot;chapter1.html&quot;&gt;</span>${choice(demo,2,'code-token text-token')}<span>&lt;/a&gt;</span></div><div class="anchor-wire"><i></i></div><div class="link-preview"><b>浏览器预览</b><a href="#" data-preview-link>第一章</a><span>目标：chapter1.html</span></div>${choice(demo,3,'remove-href')}</div>${feedback('a是元素，href决定目标，标签之间的文字才是用户真正看到并点击的内容。')}`;
    },
    y2026q38(demo) {
      return `<div class="html-layout-lab"><div class="code-editor">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}"><code>${escapeHTML(item.label)}</code></button>`).join('')}<pre data-html-code>&lt;p&gt;第一段&lt;/p&gt;\n&lt;p&gt;第二段&lt;/p&gt;</pre></div><div class="rendered-page" data-html-render><p>第一段</p><p>第二段</p><div class="dom-tree"><span>body</span><i>p</i><i>p</i></div></div></div>${feedback('br只在当前位置换行；p建立有语义、有起止标签的段落节点。')}`;
    },
    y2026q28(demo) {
      const docs=Array.from({length:20},(_,i)=>`<i class="doc ${i<8?'relevant':''} ${[0,1,2,4,7,11,13,18].includes(i)?'retrieved':''}" style="--i:${i}"></i>`).join('');
      return `<div class="search-metrics-lab"><div class="query-builder">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="query-tool">${escapeHTML(item.label)}</button>`).join('')}</div><div class="document-universe">${docs}<div class="retrieval-net" data-retrieval-net></div></div><div class="metric-cards"><div><b data-recall>75%</b><span>查全率</span><small>找回多少相关文献</small></div><div><b data-precision>75%</b><span>查准率</span><small>结果中多少真正相关</small></div></div></div>${feedback('扩大检索网通常少漏但噪声增多；收紧字段和AND条件通常更准但可能漏检。')}`;
    },

    // 第7章：把格式、帧、颜色和多媒体特征变成可观察的创作台。
    'merged-14'(demo) {
      const cards=[['GIF','动图','256色'],['PNG','透明','无损'],['JPEG','照片','有损'],['MP3','音频','有损'],['WAV','容器','常见PCM']];
      return `<div class="format-gallery"><div class="asset-preview" data-format-preview><div class="format-art"><i></i><i></i><i></i><span>同一素材</span></div><b data-format-size>原始：12.4 MB</b><small data-format-quality>选择格式查看取舍</small></div><div class="format-cards">${cards.map((x,i)=>`<button type="button" data-sim-choice="${i}" class="format-card card-${i}"><b>${x[0]}</b><span>${x[1]}</span><small>${x[2]}</small></button>`).join('')}</div></div>${feedback('格式名不是一个孤立标签；要同时看媒体类型、压缩方式、透明、动画和容器边界。')}`;
    },
    y2020q27(demo) {
      return `<div class="media-stage"><div class="creative-canvas"><div class="media-layer text-layer">文字</div><div class="media-layer image-layer">图像</div><div class="media-layer sound-layer">♪ 声音</div><div class="media-layer video-layer">▶ 视频</div></div><div class="media-shelf">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="shelf-item item-${i}"><i>${['Aa ◉ ♪','▶ ◫','SSD USB'][i]}</i><b>${escapeHTML(item.label)}</b></button>`).join('')}</div><div class="carrier-slot"><span>硬盘 / U盘只负责保存文件</span></div></div>${feedback('能表达信息的是媒体元素；硬盘、U盘属于保存这些文件的物理载体。')}`;
    },
    y2020q38(demo) {
      return `<div class="frame-rate-lab"><div class="flipbook-screen"><div class="moving-ball" data-moving-ball></div><div class="motion-ghosts">${Array.from({length:8},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><span data-fps-label>24 fps</span></div><div class="video-timeline">${Array.from({length:12},(_,i)=>`<i style="--i:${i}">${i+1}</i>`).join('')}</div><div class="video-controls">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div><div class="video-meter"><span>流畅度</span><i data-smooth-meter></i><span>数据量</span><i data-data-meter></i></div></div>${feedback('帧率决定每秒画面数；分辨率决定每帧像素数；码率决定压缩后每秒数据量。')}`;
    },
    y2026q4(demo) {
      return `<div class="multimedia-console"><div class="conference-screen"><div class="video-person"><i></i><b>实时视频</b></div><div class="shared-slide"><b>CT影像讲解</b><div class="scan-lines"></div></div><div class="live-captions">正在识别语音并生成字幕…</div></div><div class="conference-controls">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="feature-control feature-${i}"><i>${['▦','☝','●','□'][i]}</i><span>${escapeHTML(item.label)}</span></button>`).join('')}</div><div class="latency-chip">LIVE · 38 ms</div></div>${feedback('多种媒体被集成；用户能改变内容；采集、处理和反馈必须及时。')}`;
    },
    y2020q17(demo) {
      return `<div class="color-workbench"><div class="color-output screen-output"><div class="rgb-lights"><i class="red"></i><i class="green"></i><i class="blue"></i></div><b>显示器 · 自发光</b></div><div class="color-mode-switch">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div><div class="color-output print-output"><div class="cmyk-dots"><i class="cyan"></i><i class="magenta"></i><i class="yellow"></i><i class="black"></i></div><b>印刷纸张 · 反射光</b></div><div class="gamut-warning" data-gamut-warning>屏幕亮蓝可能超出印刷色域</div></div>${feedback('RGB用光做加色混合；CMYK用油墨吸收光做减色混合，输出介质决定模式。')}`;
    },

    // 第8章：安全机制在真实消息、服务、账户与网络连接中产生反馈。
    'merged-15'(demo) {
      return `<div class="crypto-messenger"><div class="person-card alice"><i>A</i><b>发送者</b><span class="key private">私钥 A</span><span class="key public">公钥 A</span></div><div class="message-channel"><div class="plain-message" data-plain-message>病例摘要：复诊</div><div class="crypto-lock" data-crypto-lock>🔒</div><div class="cipher-text" data-cipher>7F A2 19 C0</div><div class="crypto-actions">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div></div><div class="person-card bob"><i>B</i><b>接收者</b><span class="key private">私钥 B</span><span class="key public">公钥 B</span></div></div>${feedback('保密发送用接收方公钥加密；身份签名用发送者自己的私钥。哈希摘要通常不可逆。')}`;
    },
    y2026q16(demo) {
      return `<div class="cia-hospital"><div class="hospital-server"><header>电子病历系统</header><div class="service-screen" data-service-screen><b>服务在线</b><span>12 名医护正在访问</span></div></div><div class="cia-gauges"><div class="cia-gauge confidential"><b data-cia-c>100%</b><span>机密性</span></div><div class="cia-gauge integrity"><b data-cia-i>100%</b><span>完整性</span></div><div class="cia-gauge availability"><b data-cia-a>100%</b><span>可用性</span></div></div><div class="attack-console">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="attack attack-${i}">${escapeHTML(item.label)}</button>`).join('')}</div></div>${feedback('触发一个事件，观察它最直接击中CIA三属性中的哪一项。')}`;
    },
    y2020q28(demo) {
      return `<div class="account-defense"><div class="mail-inbox"><header>收件箱　1 封未读</header><button class="phishing-mail" data-sim-choice="0"><b>紧急：账号即将停用</b><span>security-update@examp1e.com</span><small>附件：账户验证.exe</small></button></div><div class="security-center"><div class="defense-ring" data-defense-ring><span>账户</span>${['附件','补丁','MFA','杀毒'].map((x,i)=>`<i class="shield-${i}">${x}</i>`).join('')}</div><div class="defense-controls">${getItems(demo).slice(1).map((item,i)=>`<button type="button" data-sim-choice="${i+1}">${escapeHTML(item.label)}</button>`).join('')}</div></div></div>${feedback('安全是多层防线：谨慎入口、修补漏洞、保护身份、检测恶意软件缺一不可。')}`;
    },
    'merged-16'(demo) {
      return `<div class="firewall-console"><div class="incoming-packet"><b>203.0.113.27</b><span>TCP → 3389</span><i data-firewall-packet></i></div><div class="firewall-wall">${Array.from({length:12},()=>'<i></i>').join('')}<b>防火墙</b></div><div class="rule-table"><header><span>动作</span><span>来源</span><span>端口</span></header><div class="rule allow"><b>允许</b><span>10.20.0.0/16</span><span>3389</span></div><div class="rule block"><b>阻止</b><span>其他</span><span>3389</span></div></div><div class="firewall-actions">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div><div class="firewall-log" data-firewall-log>等待连接…</div></div>${feedback('防火墙按来源、方向、端口和动作匹配规则；规则越宽，暴露面越大。')}`;
    },
    y2020q20(demo) {
      return `<div class="permission-console"><div class="identity-badge"><i>DRD</i><b>当前身份：普通用户</b><span>授权范围：自己的设备与文件</span></div><div class="permission-grid">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="permission-case case-${i}"><i>${['✓','🔒','⚠','✉'][i]}</i><b>${escapeHTML(item.label)}</b><span data-verdict>检查授权</span></button>`).join('')}</div><div class="permission-scales"><span>是否授权</span><span>行为目的</span><span>对他人影响</span></div></div>${feedback('网络行为先检查授权，再看目的和影响；“没有造成损失”不能补上缺失的授权。')}`;
    },
    y2026q30(demo) {
      return `<div class="ai-publish-studio"><div class="draft-post"><span class="ai-badge">AI 草稿</span><h4>某医院已实现100%治愈率</h4><p>未经核验的夸张医学信息准备公开发布。</p><div class="post-image-placeholder">合成示意图</div><button class="publish-button" data-sim-choice="3">立即发布</button></div><div class="publish-gates">${getItems(demo).slice(0,3).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="publish-gate gate-${i}"><i>${i+1}</i><b>${escapeHTML(item.label)}</b><span data-gate-status>未检查</span></button>`).join('')}</div><div class="publication-status" data-publication-status>发布锁定：还有 3 项未完成</div></div>${feedback('事实、权利和标识是发布前的三道门；“AI生成”不免除传播者责任。')}`;
    },

    // 第9章：用可操作的技术沙盘呈现前沿概念的判断边界。
    'merged-18'(demo) {
      return `<div class="vr-cockpit"><div class="headset-view"><div class="vr-world" data-vr-world><div class="virtual-room"><i></i><i></i><i></i><span>虚拟训练室</span></div><div class="tracking-reticle">＋</div></div><div class="headset-frame"></div></div><div class="vr-sensors"><span>头部定位 <b data-vr-track>OFF</b></span><span>手柄交互 <b data-vr-hand>OFF</b></span><span>实时反馈 <b data-vr-live>OFF</b></span></div><div class="vr-scenes">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div></div>${feedback('3D画面只是视觉形式；典型VR还要有沉浸、空间跟踪和实时交互。')}`;
    },
    y2026q39(demo) {
      return `<div class="cloud-control-panel"><aside class="cloud-nav"><b>云服务器 ECS</b><span>实例</span><span>镜像</span><span>安全组</span><span>费用中心</span></aside><main><div class="instance-card"><header><i></i><b>study-server-01</b><span data-instance-state>运行中</span></header><div class="resource-dials"><div><b data-vcpu>2</b><span>vCPU</span></div><div><b data-vram>4 GB</b><span>内存</span></div><div><b data-bill>¥0.32/h</b><span>按量费用</span></div></div><div class="cloud-actions">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div></div><div class="resource-pool">共享资源池 <i></i><i></i><i></i><i></i></div></main></div>${feedback('云计算的关键不是“远程”，而是资源池化、按需弹性、网络交付和可度量。')}`;
    },
    'merged-19'(demo) {
      return `<div class="iot-ward"><div class="patient-sensor"><b>床旁传感器</b><div class="pulse-wave"><svg viewBox="0 0 200 60"><polyline points="0,35 35,35 45,8 56,52 69,25 81,35 200,35"/></svg></div>${step(demo,0,'采集：心率 132','sensor-step')}</div><div class="iot-link">${step(demo,1,'Wi‑Fi 上传','link-step')}<i data-iot-packet></i></div><div class="edge-gateway">${step(demo,2,'边缘判断：超过阈值','gateway-step')}</div><div class="nurse-phone">${step(demo,3,'护士站收到告警','alert-step')}<div data-alert-screen>监护提醒</div></div></div>${feedback('物联网链条必须走完：感知 → 传输 → 处理 → 应用反馈。')}`;
    },
    'merged-17'(demo) {
      const blocks=[['#1042','A→B 2.0'],['#1043','B→C 1.5'],['#1044','C→D 0.8'],['#1045','D→E 0.3']];
      return `<div class="blockchain-lab"><div class="chain-mode">${choice(demo,0,'chain-mode-button')}${choice(demo,1,'chain-mode-button')}</div><div class="block-chain">${blocks.map((x,i)=>`<button type="button" ${i===1?'data-sim-choice="2"':''} class="block block-${i}"><b>${x[0]}</b><span>${x[1]}</span><code>${['8A1F','3C9D','71B2','0FE8'][i]}</code></button><i>→</i>`).join('')}</div><div class="consensus-nodes"><i>节点 A</i><i>节点 B</i><i>节点 C</i><span data-chain-status>哈希链接完整</span></div>${choice(demo,3,'zk-proof-button')}</div>${feedback('篡改历史块会改变哈希并断开后续链接；“难篡改”不是绝对不可改，隐私也需额外设计。')}`;
    },
    y2020q30(demo) {
      return `<div class="ai-lab"><div class="ai-senses"><div class="camera-feed"><i></i><span>视觉输入</span></div><div class="mic-wave"><i></i><i></i><i></i><span>声音输入</span></div></div><div class="model-core"><b>模型</b><span>识别 · 学习 · 推理 · 决策</span><i data-model-pulse></i></div><div class="ai-apps">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="ai-app app-${i}"><i>${['◉','◎','◇','⏱'][i]}</i><b>${escapeHTML(item.label)}</b></button>`).join('')}</div><div class="rule-timer">固定规则：19:00 → 开灯</div></div>${feedback('自动执行不等于AI；要看系统是否在进行感知、学习、推理或自适应决策。')}`;
    },
    y2026q45(demo) {
      return `<div class="compute-benchmark"><div class="chip-die"><b>AI 加速器</b><div class="compute-cores">${Array.from({length:64},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><div class="memory-bus" data-memory-bus><span>HBM 带宽</span><i></i></div></div><div class="benchmark-screen"><header>推理基准</header><div class="benchmark-bars"><span>峰值 <i style="--w:100%"></i><b>100 TOPS</b></span><span>实际 <i data-real-performance style="--w:63%"></i><b data-real-tops>63 TOPS</b></span></div><div class="benchmark-actions">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div></div></div>${feedback('实际算力受并行单元、内存带宽、软件优化和数值精度共同限制。')}`;
    },

    // 第10章：数据库操作直接作用于表、查询与关系结构。
    'merged-20'(demo) {
      const students=[['01','王宁','女'],['02','李悦','男'],['03','张琳','女']];
      return `<div class="relational-algebra"><div class="relation-source"><table><caption>学生表</caption><tr><th>学号</th><th>姓名</th><th>性别</th></tr>${students.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</table><table><caption>成绩表</caption><tr><th>学号</th><th>成绩</th></tr><tr><td>01</td><td>92</td></tr><tr><td>02</td><td>86</td></tr><tr><td>03</td><td>88</td></tr></table></div><div class="algebra-operators">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="operator op-${i}">${['σ','π','⋈','σπ⋈'][i]}<span>${escapeHTML(item.label)}</span></button>`).join('')}</div><div class="relation-result" data-relation-result><b>结果关系</b><table><tr><th>等待选择运算</th></tr></table></div></div>${feedback('选择筛行、投影选列、连接拼表；组合运算按目标逐步缩小结果。')}`;
    },
    'merged-21'(demo) {
      return `<div class="sql-workbench"><div class="sql-editor"><div class="line-numbers">1<br>2<br>3<br>4</div><pre data-sql-code><span>SELECT</span> 姓名, 成绩\n<span>FROM</span> 学生\n<span>WHERE</span> 成绩 &gt; 80\n<span>ORDER BY</span> 成绩 DESC;</pre><button type="button" class="run-query" data-run-query>▶ 运行</button></div><div class="sql-builder">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="sql-clause clause-${i}">${escapeHTML(item.label)}</button>`).join('')}</div><div class="query-result"><header data-query-count>结果　2 行</header><table><tr><th>姓名</th><th>成绩</th></tr><tr><td>王宁</td><td>92</td></tr><tr><td>张琳</td><td>88</td></tr></table></div></div>${feedback('SELECT定列、FROM定来源、WHERE筛行、ORDER BY排序；排序不改变原表存储。')}`;
    },
    y2020q13(demo) {
      return `<div class="access-window"><div class="access-title">Microsoft Access　学生管理.accdb</div><aside class="access-nav"><b>所有Access对象</b><span>表</span><i>学生</i><i>成绩</i><span>查询</span><i>女生名单</i></aside><main><div class="access-tabs"><span>学生表　×</span></div><table><tr><th>ID</th><th>姓名</th><th>班级</th></tr><tr><td>1</td><td>王宁</td><td>1班</td></tr><tr><td>2</td><td>李悦</td><td>2班</td></tr></table><div class="access-objects">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}"><i>${['DB','A','▦','W'][i]}</i><span>${escapeHTML(item.label)}</span></button>`).join('')}</div></main></div>${feedback('accdb是数据库文件，Access是管理它的DBMS，二维表及关系属于数据模型。')}`;
    },
    y2020q14(demo) {
      const alternatives = getItems(demo).slice(2).map((item,i)=>`<button type="button" data-sim-choice="${i+2}">${escapeHTML(item.label)}</button>`).join('');
      return `<div class="er-designer" data-relation-lab><div class="entity branch" data-drop-target="branch"><b>团支部</b><span><i>🔑</i> 支部编号</span><span>支部名称</span><button type="button" class="relation-grip" data-drag-kind="relation" data-choice="0" data-correct-target="member">从这里拖向团员</button></div><div class="relationship-line"><strong>1</strong><i data-relation-arrow></i><strong>∞</strong></div><div class="entity member" data-drop-target="member"><b>团员</b><span><i>🔑</i> 学号</span><span>姓名</span><span class="foreign-key">支部编号（外键）</span><button type="button" class="relation-grip" data-drag-kind="relation" data-choice="1" data-correct-target="branch">从这里拖向支部</button></div><div class="record-validator" data-record-validator>新增团员时，支部编号必须引用已存在的支部。</div></div>${coach('建模判断','上方两端要用真实拖动读取方向；下列是结构实现的对照选项。',alternatives)}${feedback('从支部看是“一对多”，从团员看是“多对一”；外键通常放在多端。')}`;
    },
    y2026q12(demo) {
      return `<div class="database-model-lab"><div class="document-store"><header>文档型 NoSQL</header><pre>{ name: "王宁", score: 92 }\n{ name: "李悦", tags: ["AI"], city: "济宁" }</pre><div class="cluster-nodes"><i>Node A</i><i>Node B</i><i>Node C</i></div></div><div class="model-selector">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div><div class="relational-store"><header>关系数据库</header><table><tr><th>ID</th><th>姓名</th><th>班级ID</th></tr><tr><td>01</td><td>王宁</td><td>1</td></tr><tr><td>02</td><td>李悦</td><td>2</td></tr></table><small>固定结构 · 约束 · 事务 · SQL</small></div></div>${feedback('模型选择看结构、事务、查询与扩展需求；NoSQL不是“无SQL、无一致性、一定更快”。')}`;
    },

    // 第11章：让伪代码与控制结构在输入数据上实际运行。
    y2026q42(demo) {
      return `<div class="pseudocode-studio"><div class="natural-task"><b>任务卡</b><p>输入两个数，输出较大值。</p><label>a = <input value="8" inputmode="numeric" data-pseudo-a></label><label>b = <input value="5" inputmode="numeric" data-pseudo-b></label></div><div class="pseudo-editor"><header>伪代码</header><pre data-pseudo-code>INPUT a, b\nIF a &gt; b THEN\n　OUTPUT a\nELSE\n　OUTPUT b\nEND IF</pre><div class="pseudo-options">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}">${escapeHTML(item.label)}</button>`).join('')}</div></div><div class="pseudo-output"><span>运行结果</span><b data-pseudo-output>8</b><small>不依赖某门语言的括号和分号</small></div></div>${feedback('伪代码应清楚、可执行、结构明确，但不要求严格服从某种编程语言语法。')}`;
    },
    y2026q6(demo) {
      return `<div class="euclid-machine"><div class="gcd-inputs"><label>a <input value="48" inputmode="numeric" data-gcd-a></label><label>b <input value="18" inputmode="numeric" data-gcd-b></label><button type="button" data-gcd-run>运行欧几里得算法</button></div><div class="division-tape" data-division-tape><span>48 ÷ 18 → 余 12</span><span>18 ÷ 12 → 余 6</span><span>12 ÷ 6 → 余 0</span></div><div class="algorithm-checks">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="property property-${i}"><i>${['?','✓','■','≡'][i]}</i><span>${escapeHTML(item.label)}</span></button>`).join('')}</div><div class="gcd-result">GCD = <b data-gcd-result>6</b></div></div>${feedback('每一步都能机械执行，条件含义唯一，并在余数为0时有限结束，才是一套算法。')}`;
    },
    y2026q5(demo) {
      return `<div class="control-flow-theatre"><div class="flowchart" data-flowchart><div class="flow-node start">开始</div><i>↓</i><div class="flow-node input">读取 x</div><i>↓</i><div class="flow-node branch">x &gt; 0？</div><div class="flow-split"><section><span>是</span><div class="flow-node loop">重复输出 x 次</div></section><section><span>否</span><div class="flow-node output">输出“无效”</div></section></div><i>↓</i><div class="flow-node end">结束</div></div><div class="structure-controls">${getItems(demo).map((item,i)=>`<button type="button" data-sim-choice="${i}" class="structure structure-${i}">${escapeHTML(item.label)}</button>`).join('')}</div><div class="execution-cursor" data-execution-cursor>●</div></div>${feedback('顺序、分支、循环可以互相嵌套；结构化控制保持清晰入口、出口和可追踪路径。')}`;
    }
  };

  window.NOTE_SIMULATIONS = { demos, scenes, escapeHTML, choice, choices, step, toolbar, office, win, feedback, genericInitial };
})();
