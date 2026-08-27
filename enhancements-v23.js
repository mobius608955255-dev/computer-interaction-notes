(() => {
  'use strict';
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  function appendNote(selector, key, title, paragraphs) {
    const section=$(selector);
    if(!section || $(`[data-v23="${key}"]`,section)) return;
    const host=$('.section-shell,.module-shell',section)||section;
    host.insertAdjacentHTML('beforeend',`<div class="lab-card v23-matrix-note" data-v23="${key}">
      <div class="lab-heading"><span class="lab-dot"></span><div><p>概念补全</p><h3>${title}</h3></div></div>
      <div class="note-body">${paragraphs.map(p=>`<p>${p}</p>`).join('')}</div>
    </div>`);
  }

  function courseBlock(id,number,title,lead,what,use,rules,boundary,memory){
    return `<section id="${id}" class="course-module v23-matrix-module" data-v23="module">
      <div class="module-shell">
        <header class="module-head"><span>${String(number).padStart(2,'0')}</span><div><small>知识点</small><h2>${title}</h2><p>${lead}</p></div></header>
        <div class="v10-concept-note"><div><span>是什么</span><p>${what}</p></div><div><span>有什么用</span><p>${use}</p></div></div>
        <div class="module-grid"><div class="knowledge-card"><h3>核心规则与操作结果</h3><ul>${rules.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="knowledge-card"><h3>边界要分清</h3><p>${boundary}</p></div></div>
        <div class="memory-line"><span>一条线记住</span><strong>${memory}</strong></div>
      </div>
    </section>`;
  }

  function chapter1Details(){
    appendNote('#concept-16','media-details','数字音频、流媒体与图像处理的几个真题级概念',[
      '<strong>MIDI：</strong>主要记录音符、音高、时值、力度、乐器等演奏指令，而不是像 WAV/MP3 那样逐点保存真实声音波形。因此 MIDI 文件通常较小，但播放效果依赖合成器/音色库。',
      '<strong>流媒体：</strong>核心是数据一边传输、一边在缓冲后播放，不必等整个媒体文件全部下载完才开始观看或收听；网络带宽不足时可能出现等待或卡顿。',
      '<strong>锐化：</strong>属于图像增强处理，主要增强边缘和细节，使轮廓看起来更清晰；它不是“提高原始拍摄分辨率”，过度锐化还可能放大噪声和产生光晕。',
      '<strong>无损/有损压缩：</strong>无损压缩可完整还原原始数据；有损压缩通过舍弃部分信息换取更高压缩率。PNG通常按无损图像格式掌握，JPEG通常按有损图像格式掌握。'
    ]);
    appendNote('#concept-12','cpu-gpu','CPU 与 GPU：分工不同，不能说谁能完全替代谁',[
      '<strong>CPU</strong>擅长通用控制、复杂分支和低延迟串行任务；<strong>GPU</strong>拥有大量并行计算单元，适合图形渲染以及矩阵/向量等高度并行任务。',
      'GPU 可以承担大量通用并行计算，但不能据此得出“GPU 能全面替代 CPU”。现代计算机通常让 CPU 与 GPU 按任务特点协同工作。'
    ]);
  }

  function wordDetails(){
    appendNote('#word-1','navigation','导航窗格为什么看得到标题、看不到普通加粗文字',[
      '导航窗格可以按标题浏览文档结构，也可以辅助搜索和定位页面。能否在“标题”列表中出现，关键看段落是否具有相应的<strong>标题样式/大纲级别</strong>，而不是文字看起来是否加粗、放大。',
      '因此“把文字调成粗体和大字号”只改变外观；要让它成为可导航的结构标题，应应用标题样式或设置合适的大纲级别。'
    ]);
    appendNote('#word-4','ruler','标尺：缩进、制表位和页面边界不要混',[
      '水平标尺上可以看到并调整首行缩进、悬挂缩进、左右缩进标记，也可以设置/移动制表位。缩进标记作用于段落；页面边距属于页面设置，虽然标尺能反映正文区边界，但两者不是同一层级的格式。'
    ]);
    appendNote('#word-9','header-border','页眉下面那条横线通常是“段落边框”',[
      '页眉中常见的自动横线，很多情况下来自“页眉”段落/样式的<strong>下边框</strong>，不是画出来的直线，也不是页面边框。要删掉或修改颜色、线宽，应检查页眉段落的边框设置或“页眉”样式。'
    ]);

    const footer=$('.word-page .course-footer');
    if(footer && !$('#word-23')){
      footer.insertAdjacentHTML('beforebegin',courseBlock(
        'word-23',23,'数学公式、符号与域：三个概念不要混',
        '数学公式负责排数学表达式，符号负责插入字符，域负责自动生成/更新动态内容。',
        'Word 的“公式”功能用于建立分式、根式、上下标、积分等数学结构；“符号”用于插入普通键盘不便输入的特殊字符；域则是一种可计算或自动更新的文档机制，例如页码、日期、题注引用、目录等。',
        '理解三者后，可以判断“要输入一个数学式、一个特殊字符、还是一个会随文档变化自动更新的结果”分别该用什么工具。',
        [
          '插入数学公式时使用“插入 → 公式”等公式工具，公式对象支持结构化数学排版。',
          '“符号”适合插入希腊字母、特殊标点等字符；单个符号不等同于完整数学公式对象。',
          'Word 表格中的 =SUM(ABOVE) 属于表格计算公式；数学排版公式与表格求和不是同一功能。',
          '页码、交叉引用、目录等常由域实现；域结果发生依赖变化后有时需要更新域。',
          '不要把“公式”“符号”“域”因为都在插入/自动化相关区域就当成一个概念。'
        ],
        '数学公式解决“怎么排数学结构”；符号解决“怎么插字符”；域解决“怎么让内容按规则自动生成或更新”。',
        '先问对象是什么：数学结构用公式，特殊字符用符号，动态内容看域。'
      ));
    }
  }

  function excelDetails(){
    appendNote('#excel-16','pivot-date','数据透视表日期分组与值区域',[
      '日期字段放到行/列区域后，可以对日期项目进行<strong>组合/分组</strong>，按月、季度、年等层级汇总。它不是把源数据中的日期文本真正改成“月份”。',
      '值区域中的字段还可以切换求和、计数、平均值等汇总方式；纯数值通常默认求和，包含空白/非数值时可能默认计数，所以看到“计数”不能只认定为用户点错。'
    ]);
    appendNote('#excel-20','trendline','趋势线与预测：前推周期只改变趋势线延伸',[
      '给数据系列添加趋势线后，可以在“设置趋势线格式”中选择趋势线类型并设置<strong>预测 → 前推/后推</strong>的周期数。例如“前推3个周期”表示把趋势线向未来方向延伸3个类别/周期。',
      '趋势线预测是基于已有数据的模型外推，不会在工作表源数据区域自动新增真实的未来记录，也不等于“把横轴向右拖3格”。'
    ]);
  }

  function normalizeLegacyWording(){
    $$('span,small,p,b,strong,h3,h4').forEach(el=>{
      if(el.childElementCount) return;
      let t=el.textContent;
      if(t.includes('官方公开参考答案')) el.textContent=t.replaceAll('官方公开参考答案','真题配套参考答案');
      else if(t.includes('七年真题加深 · 高频主轴')) el.textContent=t.replaceAll('七年真题加深 · 高频主轴','补充理解');
      else if(t.includes('先作答，再看')) el.textContent=t.replaceAll('先作答，再看','先观察结果，再理解');
    });
  }

  function apply(){chapter1Details();wordDetails();excelDetails();normalizeLegacyWording();}
  let queued=false;
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply();});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  document.addEventListener('notes:chapterchange',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
})();