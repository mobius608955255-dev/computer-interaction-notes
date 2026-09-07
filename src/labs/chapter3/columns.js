/* Partial columns: shared section formats, independent dialog drafts and visible boundaries. */
(() => {
 'use strict';
 const {register,ui}=window.NOTE_LABS;
 const {btn,select,office,dialog,paper,output,coach,esc}=ui;
 const controls=html=>`<div class="lab-controls">${html}</div>`;
 const parts=[
  {label:'标题与引言',html:'<h4>校园科技节</h4><p>用不同版式组织同一篇文章。</p>'},
  {label:'中间正文',paragraphs:['人工智能与医学交叉正在形成新的研究方向。计算机不仅负责计算，还能辅助影像分析、临床决策与科研设计。','报刊式分栏让文字先从上到下，再流向下一栏。改变栏数后，文字内容保留，排版区域发生变化。']},
  {label:'结束语',html:'<p>结束语：设置完成后，检查标题、正文和后文的范围。</p>'}
 ];
 function save(s){s.history.push(structuredClone({sections:s.sections,formats:s.formats,breakBefore:s.breakBefore}));}
 function sectionGroups(s){return parts.reduce((groups,part,i)=>{const id=s.sections[i];if(groups.at(-1)?.id===id)groups.at(-1).indices.push(i);else groups.push({id,indices:[i]});return groups;},[]);}
 const singleColumnLimit='本演示暂未覆盖保留分栏符时恢复单栏。请取消草稿，删除本例分栏符后再应用单栏；这不是Word本身的限制。';
 const unsupportedSingle=s=>s.breakBefore&&s.draft?.count==1&&(s.draft.scope==='all'||s.sections[s.active]===s.sections[1]);
 register(['y2020q44'],'标题通栏，只把中间正文排成两栏','先用连续分节隔离正文，再设置本节栏数、间距和分隔线；观察前后范围，并练习取消与恢复。',{
  sections:[1,1,1],formats:{1:{count:1,gap:6,line:false}},active:1,breakBefore:false,draft:null,history:[],message:'初始全文同属第1节。直接设置本节，会同时影响标题与结束语。'
 },s=>{
  const current=s.sections[s.active],groups=sectionGroups(s),form=s.draft;
  const content=groups.map(({id,indices},index)=>{
   const f=s.formats[id],text=indices.map(i=>parts[i].paragraphs?parts[i].paragraphs.map((p,j)=>`<p ${j===1&&s.breakBefore?'data-column-break style="break-before:column"':''}>${j===1&&s.breakBefore?'<small class="lab-mark">分栏符</small><br>':''}${esc(p)}</p>`).join(''):parts[i].html).join('');
   return `${index?'<p class="lab-mark" data-continuous-break>分节符（连续）</p>':''}<section data-column-section="${id}" data-column-count="${f.count}" data-column-gap="${f.gap}" data-column-line="${f.line}"><p><strong>第${index+1}节 · ${f.count}栏</strong> · ${indices.map(i=>parts[i].label).join('、')}</p><div data-column-flow style="column-count:${f.count};column-gap:${f.gap}mm;column-rule:${f.line?'1px solid #8d7092':'none'};line-height:1.8;overflow-wrap:anywhere">${text}</div></section>`;
  }).join('');
  return controls(`<fieldset style="display:contents" ${form?'disabled':''}>${select('active','辅助定位到',s.active,parts.map((p,i)=>[i,p.label]))}</fieldset>`)+
   office('Word','布局 · 页面设置',btn('栏 → 更多栏…','open','',form?'disabled':'')+btn('插入分栏符（正文第二段前）','columnBreak','',form||s.formats[s.sections[1]].count===1?'disabled':''),
    (form?dialog('栏',select('draftCount','栏数',form.count,[[1,'一栏'],[2,'两栏']])+select('draftGap','间距',form.gap,[[6,'0.6厘米'],[10,'1厘米']])+`<label><input type="checkbox" data-field="draftLine" ${form.line?'checked':''}>分隔线</label>`+select('draftScope','应用于',form.scope,[['section','本节'],['all','整篇文档']])+`<p>插入点：${parts[s.active].label}；第${groups.findIndex(g=>g.id===current)+1}节。</p>${unsupportedSingle(s)?`<p>${singleColumnLimit}</p>`:''}`,btn('确定','apply')+btn('取消','cancel')):'')+paper(content))+
   controls(btn('辅助操作：在正文前后插入连续分节符','isolate','',form||groups.length>1?'disabled':'')+btn('删除本例分栏符','removeBreak','',form||!s.breakBefore?'disabled':'')+btn('撤销上一步','undo','',form||!s.history.length?'disabled':''))+output(s.message)+
   coach('“辅助操作”一次完成正文前后两处分节；真实Word须分别定位插入。本例仅模拟一栏/等宽两栏、同页连续分节、指定位置分栏符及本节/全文范围；可恢复一栏或撤销。间距在屏幕上示意，不含不等宽、多页重排或全部自动分节细节。Word2016和实体手机未实测。','本演示的范围与限制');
 },(s,a)=>{
  if(a==='open'){s.draft={...s.formats[s.sections[s.active]],scope:'section'};}
  if(a==='cancel'){s.draft=null;s.message='已取消草稿，栏数、间距、分隔线和节范围保持原状。';}
  if(a==='apply'&&s.draft){
   if(unsupportedSingle(s)){s.message=singleColumnLimit;return;}
   save(s);const {scope,count,gap,line}=s.draft,ids=scope==='all'?[...new Set(s.sections)]:[s.sections[s.active]];
   for(const id of ids)s.formats[id]={count:Number(count),gap:Number(gap),line};
   s.draft=null;s.message=`已应用${count}栏到${scope==='all'?'整篇文档':parts[s.active].label+'所在节'}。文字内容与现有节边界保留；恢复一栏也在此对话框进行。`;
  }
  if(a==='isolate'&&new Set(s.sections).size===1){save(s);s.formats[2]={...s.formats[1]};s.formats[3]={...s.formats[1]};s.sections=[1,2,3];s.active=1;s.message='正文前后各插入一处连续分节符：同页分成3节，先继承原栏设置；现在可单独设置中间第2节。';}
  if(a==='columnBreak'&&s.formats[s.sections[1]].count>1&&!s.breakBefore){save(s);s.breakBefore=true;s.message='正文第二段前已插入分栏符，第二段从下一栏开始；节的数量不变。';}
  if(a==='removeBreak'&&s.breakBefore){save(s);s.breakBefore=false;s.message='已删除分栏符，文字按当前栏设置自然流动；连续分节边界保留。';}
  if(a==='undo'&&s.history.length){Object.assign(s,s.history.pop());s.draft=null;s.message='已恢复上一步的栏设置、节边界与分栏符。';}
 },(s,k,v)=>{
  if(k==='active'&&!s.draft)s.active=Number(v);
  if(s.draft&&k.startsWith('draft'))s.draft[{draftCount:'count',draftGap:'gap',draftLine:'line',draftScope:'scope'}[k]]=v;
 });
})();
