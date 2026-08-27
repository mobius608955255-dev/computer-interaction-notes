(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);

  function addNote(section, key, html) {
    if (!section || section.querySelector(`[data-v19-note="${key}"]`)) return;
    const note = document.createElement('div');
    note.className = 'same-core v19-audit-note';
    note.dataset.v19Note = key;
    note.innerHTML = html;
    const memory = $('.memory-line', section);
    if (memory) memory.insertAdjacentElement('beforebegin', note);
    else section.appendChild(note);
  }

  function patchSortAndFilter() {
    const section = $('#excel-13');
    if (!section) return;

    addNote(section, 'sort-filter', `
      <b>排序先看“底层类型”，筛选先看“是否只是隐藏”。</b>
      <p><strong>排序：</strong>文本按文字顺序、数值按大小、真正的日期/时间按序列值先后排序；还可以按单元格颜色、字体颜色、图标或自定义序列排序。多关键字排序中，上面的级别优先级更高。</p>
      <p><strong>混合类型是高频陷阱：</strong>同一列若既有真正的数值，又有“以文本存储的数字”，排序结果会分成不同类型处理；Microsoft 的规则中，数值型数字排在文本型数字之前。日期如果只是看起来像日期的文本，也不会按真正日期先后正确排序。</p>
      <p><strong>真正空白单元格：</strong>普通排序时无论升序还是降序通常都放在最后；但含空格字符、公式返回空字符串 <code>""</code> 的单元格并不一定等同于真正空白。</p>
      <p><strong>自动筛选：</strong>不符合条件的整行只是暂时隐藏，数据没有被删除；可通过标题下拉箭头按值、文本/数字条件、颜色等筛选。<strong>高级筛选</strong>则使用独立条件区域，能原地筛选，也能把符合条件的记录复制到另一区域，还可筛选唯一记录。修改高级筛选条件后不会自动重新执行，需要再次应用。</p>
    `);
  }

  function patchCommentsVersion() {
    const section = $('#excel-9');
    if (!section) return;

    addNote(section, 'comments-version', `
      <b>版本口径：Excel 2016 这里就叫“批注”。</b>
      <p>本章按 Excel 2016 考纲使用“批注”这一名称：它是附着在单元格上的说明文字，可显示、隐藏、编辑、删除，也可通过选择性粘贴只复制批注。</p>
      <p>Microsoft 365 后来引入了可回复的线程式“评论（Comments）”，并把 Excel 2016 这类旧式批注改名为“备注（Notes）”。因此看到新版教程写“备注”，不要误以为它是 2016 里另一个完全不同的功能。</p>
    `);
  }

  function patchCharts() {
    const section = $('#excel-20');
    if (!section) return;

    addNote(section, 'chart-source', `
      <b>图表与源数据的联动有两个层次。</b>
      <p>已经包含在图表数据源中的单元格，其数值或标题改变后，图表会随之更新；对源数据排序后，类别和值的排列改变，图表也会重新绘制。</p>
      <p>但<strong>在现有数据源旁边新增加一整列/行数据</strong>，不等于任何情况下都会自动成为新的数据系列。若新增范围没有被图表数据源包含，需要扩展数据源或在“选择数据”中添加系列。</p>
      <p><strong>切换行/列</strong>只改变“哪些行/列被解释为数据系列和分类”的绘制方式，不会真的转置工作表中的单元格数据。</p>
    `);
  }

  function patchSparklines() {
    const section = $('#excel-21');
    if (!section) return;

    addNote(section, 'sparkline', `
      <b>迷你图是放在单元格里的微型趋势图，不是把一张普通图表缩小塞进去。</b>
      <p>Excel 2016 常见三类迷你图是<strong>折线、柱形、盈亏</strong>。迷你图有自己的数据范围和位置范围；源数据变化后，迷你图会随之更新。</p>
      <p>空单元格可以按“间隙、零值、连接数据点”等方式处理；是否显示隐藏行列中的数据也可设置。因此“隐藏了一行，迷你图一定不再使用它”并不是无条件成立。</p>
      <p>创建一组迷你图时，数据区域与位置区域的维度必须匹配；删除迷你图应使用“清除迷你图/迷你图组”，单纯按 Delete 清除单元格内容的思路不能机械套用。</p>
    `);
  }

  function patchPrinting() {
    const section = $('#excel-22');
    if (!section) return;

    addNote(section, 'printing', `
      <b>打印区域、打印标题、分页符、缩放、冻结窗格是五个不同概念。</b>
      <p><strong>打印区域</strong>决定“哪些单元格要打印”，并会随工作簿保存；一个工作表可设置多个不连续打印区域，这些区域通常分别打印在独立页面上。</p>
      <p><strong>打印标题</strong>是在多页打印时，让指定行在每页顶部重复、或指定列在每页左侧重复；它不是页眉/页脚，也不是“冻结窗格”。冻结窗格只影响屏幕滚动时的可见状态，不会自动变成每页打印标题。</p>
      <p><strong>分页符</strong>控制打印分页位置，不会拆散或删除工作表数据；Excel 有自动分页符，也可以插入、移动或删除手动分页符。</p>
      <p><strong>调整为 N 页宽 × M 页高</strong>改变的是打印缩放比例，让内容压缩到指定页数；它不是把工作表里的字号、列宽、行高永久改小。</p>
    `);
  }

  function patchWordTableFormula() {
    const section = $('#word-12');
    if (!section) return;

    addNote(section, 'word-table-formula', `
      <b>Word 表格公式本质上是“域”，不是 Excel 那套持续自动重算的工作簿模型。</b>
      <p>常见位置参数包括 <code>ABOVE</code>、<code>BELOW</code>、<code>LEFT</code>、<code>RIGHT</code>，可与 <code>SUM</code>、<code>AVERAGE</code>、<code>COUNT</code>、<code>MAX</code>、<code>MIN</code>、<code>PRODUCT</code> 等配合。例如 <code>=SUM(ABOVE)</code> 汇总当前单元格上方的数值。</p>
      <p>Word 也支持 A1 式单元格引用，例如 <code>=PRODUCT(B2:C2)</code>。所以“Word 表格公式只能写 ABOVE/LEFT，不能写具体地址”是错误的。</p>
      <p>公式插入时、重新打开文档时会计算；修改参与计算的表格数据后，结果可能需要选中公式或整张表按 <code>F9</code> 更新。使用位置参数求和时，计算范围中的空单元格也可能造成问题，考试里不要把空白和数值 0 当成完全相同。</p>
    `);
  }

  function patchMailMerge() {
    const section = $('#word-18');
    if (!section) return;

    addNote(section, 'mail-merge-source', `
      <b>邮件合并不是“Word + Excel”这一种固定组合。</b>
      <p><strong>主文档</strong>保存每份都相同的正文与版式；<strong>数据源</strong>保存一条条收件人记录；<strong>合并域</strong>来自数据源字段名；完成合并后，Word 按记录生成个性化结果。</p>
      <p>Word 2016 常见数据源包括 Excel 工作表、Access 数据库、Outlook 联系人以及其他可连接的数据源；没有现成名单时，还可以在 Word 的邮件合并流程中“键入新列表”。因此不能把概念死记成“邮件合并的数据源只能是 Excel”。</p>
      <p>若使用 Excel，邮政编码、身份证号式编号等需要保留前导 0 的字段应优先按文本准备；百分比、货币、日期也要提前检查格式。连接数据源后还可以筛选或取消勾选收件人，只生成部分记录。</p>
    `);
  }

  function apply() {
    patchSortAndFilter();
    patchCommentsVersion();
    patchCharts();
    patchSparklines();
    patchPrinting();
    patchWordTableFormula();
    patchMailMerge();
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
