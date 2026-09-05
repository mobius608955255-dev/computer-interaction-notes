/* Run: NODE_PATH=/path/to/jsdom/node_modules node --test tests/notes-regression.cjs */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const files=[2020,2021,2022,2023,2024,2025,2026].map(y=>`notes-${y}-data.js`).concat(['notes-data.js','demos-data.js','simulations.js','note-labs.js','note-labs-2021.js','note-labs-audit.js','notes-standard.js']);
function env(chapter=4){
  const dom=new JSDOM(`<body data-chapter="${chapter}"></body>`,{url:'https://notes.example/chapter'+chapter+'.html',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
  for(const f of files)w.eval(fs.readFileSync(path.join(root,f),'utf8'));
  w.eval(fs.readFileSync(path.join(root,'notes-app.js'),'utf8'));
  return {dom,w,d:w.document};
}
function open(e,id){const c=e.d.getElementById(id);assert.ok(c,`note ${id}`);c.querySelector('.simulation-toggle').click();return c;}
function click(c,action,value){const s=`[data-lab-act="${action}"]${value!==undefined?`[data-value="${value}"]`:''}`;const b=c.querySelector(s);assert.ok(b,s);b.click();}
function change(e,c,name,value){const el=c.querySelector(`[data-field="${name}"]`);assert.ok(el,name);if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new e.w.Event('change',{bubbles:true}));}
test('460 unique sources; all seven years mapped; all 220 notes have simulations',()=>{
  const e=env();const notes=e.w.NOTES.notes;assert.equal(notes.length,220);assert.equal(e.w.NOTES.sourceCount,460);
  const keys=notes.flatMap(n=>n.sources.map(s=>`${s.year}-${s.q}`));assert.equal(new Set(keys).size,460);
  assert.deepEqual(Array.from(notes.flatMap(n=>n.sources).filter(s=>s.year===2022).map(s=>s.q).sort((a,b)=>a-b)),Array.from({length:75},(_,i)=>i+1));
  for(const n of notes){assert.ok(e.w.NOTE_SIMULATIONS.demos[n.id],n.id);assert.equal(typeof e.w.NOTE_SIMULATIONS.scenes[n.id],'function');assert.ok(e.w.NOTES.chapters[n.chapter-1].sections.some(s=>s.id===n.section),n.id);}
  e.dom.window.close();
});
test('all chapters mount, open, reset and collapse every card without exceptions',()=>{
  for(let chapter=1;chapter<=11;chapter++){
    const e=env(chapter),errors=[];e.w.addEventListener('error',x=>errors.push(x.error?.stack||x.message));
    assert.equal(e.d.querySelector('#chapter-select').options.length,11);
    assert.equal(e.d.querySelectorAll('[data-sim-mount]>*').length,0,'scenes are lazy mounted');
    for(const b of e.d.querySelectorAll('.simulation-toggle')){b.click();assert.equal(b.getAttribute('aria-expanded'),'true');const c=b.closest('[data-sim-id]');assert.ok(c.querySelector('[data-sim-mount]').children.length);c.querySelector('[data-sim-reset]').click();b.click();assert.equal(b.getAttribute('aria-expanded'),'false');}
    assert.deepEqual(errors,[],'chapter '+chapter);e.dom.window.close();
  }
});
test('drawer is inert when closed, focus returns, search filters and restores',()=>{
  const e=env();const drawer=e.d.querySelector('#drawer');assert.equal(drawer.getAttribute('aria-hidden'),'true');
  e.d.querySelector('#open-drawer').click();assert.equal(drawer.getAttribute('aria-hidden'),'false');assert.equal(e.d.activeElement.id,'close-drawer');
  e.d.querySelector('#close-drawer').click();assert.equal(drawer.inert,true);assert.equal(e.d.activeElement.id,'open-drawer');
  const search=e.d.querySelector('#search-input');search.value='数据透视表';search.dispatchEvent(new e.w.Event('input',{bubbles:true}));assert.ok(e.d.querySelectorAll('.note-item:not(.hidden)').length>=1);search.value='';search.dispatchEvent(new e.w.Event('input',{bubbles:true}));assert.equal(e.d.querySelectorAll('.note-item.hidden').length,0);e.dom.window.close();
});
test('salary paste multiplication modifies selected range, not the whole sheet',()=>{
  const e=env(),c=open(e,'y2022q58');click(c,'copy');click(c,'cell','1');click(c,'paste');click(c,'apply');
  const nums=[...c.querySelectorAll('.lab-cell')].map(x=>x.textContent.trim());assert.deepEqual(nums,['10,000','10,925','3,500','12,000']);e.dom.window.close();
});
test('range selection, pivot field drag and fill handle use pointer positions',()=>{
  const e=env();const pointer=(el,type,x,y)=>el.dispatchEvent(new e.w.MouseEvent(type,{bubbles:true,button:0,clientX:x,clientY:y}));
  let c=open(e,'y2022q58');click(c,'copy');let cells=[...c.querySelectorAll('[data-row]')];cells.forEach((x,i)=>x.getBoundingClientRect=()=>({left:100,right:220,top:100+i*45,bottom:145+i*45}));
  pointer(cells[0],'pointerdown',150,120);pointer(cells[0],'pointermove',150,260);pointer(cells[0],'pointerup',150,260);assert.equal(c.querySelectorAll('.lab-cell.lab-selected').length,4);
  c=open(e,'y2024q67');const drag=c.querySelector('[data-key="产品"]'),zone=c.querySelector('[data-lab-drop="row"]');zone.getBoundingClientRect=()=>({left:100,right:250,top:150,bottom:250});pointer(drag,'pointerdown',25,25);pointer(drag,'pointermove',175,200);pointer(drag,'pointerup',175,200);assert.match(c.querySelector('[data-lab-drop="row"]').textContent,/产品/);
  c=open(e,'y2020q57');let handle=c.querySelector('.lab-fill-handle');[...c.querySelectorAll('[data-fill-index]')].forEach((x,i)=>x.getBoundingClientRect=()=>({left:100,right:200,top:100+i*45,bottom:145+i*45}));pointer(handle,'pointerdown',190,135);pointer(handle,'pointermove',190,255);pointer(handle,'pointerup',190,255);assert.match(c.querySelector('[data-fill-index="3"]').textContent,/3120/);e.dom.window.close();
});
test('paste comments keeps data values and copies only annotations',()=>{
  const e=env(),c=open(e,'y2022q61');click(c,'copy');click(c,'all');click(c,'paste');click(c,'apply');assert.equal(c.querySelectorAll('.lab-comment-corner').length,4);assert.match(c.textContent,/ID-004/);e.dom.window.close();
});
test('VLOOKUP absolute range stays fixed, relative range drifts',()=>{
  const e=env(),c=open(e,'y2020q57');click(c,'fill');assert.match(c.querySelector('[data-fill-index="2"]').textContent,/2322/);change(e,c,'locked','false');assert.match(c.querySelector('[data-fill-index="2"]').textContent,/#N\/A/);e.dom.window.close();
});
test('pivot values are derived from source records and filtering changes totals',()=>{
  const e=env(),c=open(e,'y2024q67');click(c,'pick','产品');click(c,'place','row');click(c,'pick','月份');click(c,'place','column');click(c,'pick','销量');click(c,'place','value');assert.match(c.querySelector('.lab-pivot-layout').textContent,/32/);click(c,'pick','分部');click(c,'place','filter');change(e,c,'filter','一部');assert.match(c.querySelector('.lab-pivot-layout').textContent,/12/);e.dom.window.close();
});
test('mail merge IF rule and record navigation generate distinct recipients',()=>{
  const e=env(3),c=open(e,'y2025q36');click(c,'connect');click(c,'name');click(c,'rule');click(c,'apply');click(c,'preview');assert.match(c.querySelector('.lab-paper').textContent,/王宁女士/);click(c,'next');assert.match(c.querySelector('.lab-paper').textContent,/李明先生/);e.dom.window.close();
});
test('Word link refresh differs from embedded copy and missing source',()=>{
  const e=env(3),c=open(e,'y2022q69');change(e,c,'source',1200);click(c,'refresh');assert.match(c.querySelector('.lab-word').textContent,/1200/);change(e,c,'mode','embed');change(e,c,'source',1300);click(c,'refresh');assert.doesNotMatch(c.querySelector('.lab-word').textContent,/1300/);change(e,c,'mode','link');click(c,'path');change(e,c,'source',1400);click(c,'refresh');assert.doesNotMatch(c.querySelector('.lab-word').textContent,/1400/);e.dom.window.close();
});
test('restricted table is readonly and body exception remains editable',()=>{
  const e=env(3),c=open(e,'y2022q71');click(c,'pane');change(e,c,'exception',true);click(c,'protect');assert.equal(c.querySelector('[data-field="cell"]').readOnly,true);assert.equal(c.querySelector('[data-field="body"]').readOnly,false);e.dom.window.close();
});
test('outline import generates real selectable slides',()=>{
  const e=env(5),c=open(e,'y2022q72');click(c,'import');assert.equal(c.querySelectorAll('.lab-deck aside button').length,2);click(c,'page','1');assert.match(c.querySelector('.lab-slide').textContent,/下一年度计划/);assert.doesNotMatch(c.querySelector('.lab-slide').textContent,/年度销售总结/);e.dom.window.close();
});
test('sum loop is computed, not hardcoded; radix and date math handle boundaries',()=>{
  const e=env(11),c=open(e,'y2022q43');change(e,c,'n',5);click(c,'run');assert.match(c.querySelector('.lab-output').textContent,/S=15/);
  assert.equal(e.w.NOTE_LABS.radixConvert('100010.01').hex,'22.4');assert.equal(e.w.NOTE_LABS.radixConvert('11.11').hex,'3.C');assert.equal(e.w.NOTE_LABS.radixConvert('102'),null);assert.equal(e.w.NOTE_LABS.daysBetween('2020-01-01','2021-01-01'),366);e.dom.window.close();
});
test('all new labs render on every exposed action and valid field change',()=>{
  const e=env();for(const [id,r] of Object.entries(e.w.NOTE_LABS.registry)){
    const s={...structuredClone(r.initial),uid:'audit'};const html=r.render(s);assert.ok(html.length>100,id);
    const d=new JSDOM(html).window.document;
    for(const el of d.querySelectorAll('[data-lab-act]')){const x={...structuredClone(r.initial),uid:'audit'};r.action(x,el.dataset.labAct,el.dataset.value);assert.ok(r.render(x).length>100,`${id}/${el.dataset.labAct}`);}
  }e.dom.window.close();
});
test('long press opens menu; tap and cancelled hold do not',async()=>{
  const e=env(2),c=open(e,'y2022q75');let folder=c.querySelector('[data-lab-drag="hold"]');
  const p=(el,type)=>el.dispatchEvent(new e.w.MouseEvent(type,{bubbles:true,button:0,clientX:20,clientY:20}));
  p(folder,'pointerdown');p(folder,'pointerup');assert.equal(c.querySelector('.lab-context-menu'),null);
  p(folder,'pointerdown');p(folder,'pointercancel');await new Promise(r=>setTimeout(r,650));assert.equal(c.querySelector('.lab-context-menu'),null);
  p(folder,'pointerdown');await new Promise(r=>setTimeout(r,650));assert.ok(c.querySelector('.lab-context-menu'));e.dom.window.close();
});
test('date grouping keeps different years separate and aggregates same month',()=>{
  const e=env(),c=open(e,'y2024q67');change(e,c,'scenario','grades');click(c,'pick','日期');click(c,'place','row');click(c,'pick','成绩');click(c,'place','value');click(c,'group');assert.match(c.querySelector('.lab-pivot-layout').textContent,/2023\/03/);assert.match(c.querySelector('.lab-pivot-layout').textContent,/2024\/03/);assert.match(c.querySelector('.lab-pivot-layout').textContent,/246/);e.dom.window.close();
});
test('blur caused by a pointer click does not detach the clicked action',()=>{
  const e=env(),c=open(e,'y2022q58');const copy=c.querySelector('[data-lab-act="copy"]');copy.dispatchEvent(new e.w.MouseEvent('pointerdown',{bubbles:true,button:0}));change(e,c,'multiplier',1.2);assert.ok(copy.isConnected);copy.dispatchEvent(new e.w.MouseEvent('pointerup',{bubbles:true,button:0}));copy.click();assert.match(c.querySelector('.lab-output').textContent,/已复制 1.2/);e.dom.window.close();
});
test('Excel wildcard replacement works without an invented option',()=>{
  const e=env(),c=open(e,'y2024q57');click(c,'open');click(c,'replace');assert.match(c.querySelector('table').textContent,/销售部/);assert.doesNotMatch(c.querySelector('table').textContent,/销售部-01/);assert.match(c.querySelector('table').textContent,/DD-001/);e.dom.window.close();
});
test('input state is current even before blur/change fires',()=>{
  const e=env(),c=open(e,'y2022q58'),input=c.querySelector('[data-field="multiplier"]');input.value='1.2';input.dispatchEvent(new e.w.Event('input',{bubbles:true}));click(c,'copy');assert.match(c.querySelector('.lab-output').textContent,/已复制 1.2/);e.dom.window.close();
});
test('each year is continuous and every HTML chapter loads the complete scripts',()=>{
 const e=env();for(const [year,count] of [[2020,65],[2021,60],[2022,75],[2023,70],[2024,70],[2025,60],[2026,60]])assert.deepEqual(Array.from(e.w.NOTES.notes.flatMap(n=>n.sources).filter(s=>s.year===year).map(s=>s.q).sort((a,b)=>a-b)),Array.from({length:count},(_,i)=>i+1));
 for(let ch=1;ch<=11;ch++){const html=fs.readFileSync(path.join(root,`chapter${ch}.html`),'utf8');for(const script of files)assert.ok(html.includes(script),`${ch}: ${script}`);for(const match of html.matchAll(/(?:src|href)="\.\/([^"?]+)(?:\?[^"]*)?"/g))assert.ok(fs.existsSync(path.join(root,match[1])),match[1]);}e.dom.window.close();
});
test('directory navigation reveals a search-hidden note; shortcuts respect editable context',()=>{
 const e=env(3),search=e.d.querySelector('#search-input');search.value='不存在的搜索';search.dispatchEvent(new e.w.Event('input',{bubbles:true}));e.d.querySelector('#open-drawer').click();e.d.querySelector('#drawer a[href="#y2026q47"]').click();assert.equal(e.d.querySelector('#y2026q47').classList.contains('hidden'),false);assert.equal(search.value,'');
 const editable=e.d.createElement('div');editable.contentEditable='true';editable.setAttribute('contenteditable','true');e.d.body.append(editable);const event=new e.w.KeyboardEvent('keydown',{key:'/',bubbles:true,cancelable:true});editable.dispatchEvent(event);assert.equal(event.defaultPrevented,false);e.dom.window.close();
});
test('Word revision survives disabling tracking and can still be rejected',()=>{
 const e=env(3),c=open(e,'y2023q56');click(c,'track');change(e,c,'draft','明显改善');click(c,'track');assert.match(c.querySelector('del').textContent,/可能产生改善/);click(c,'reject');assert.match(c.querySelector('.lab-paper').textContent,/可能产生改善/);assert.equal(c.querySelector('ins'),null);e.dom.window.close();
});
test('advanced filtering cancellation keeps applied criteria; clear restores source rows',()=>{
 const e=env(),c=open(e,'y2020q9');click(c,'open');click(c,'apply');assert.match(c.textContent,/王宁/);assert.doesNotMatch(c.querySelector('tbody').textContent,/周林/);click(c,'open');change(e,c,'threshold',95);click(c,'cancel');assert.match(c.querySelector('tbody').textContent,/王宁/);click(c,'clear');assert.match(c.querySelector('tbody').textContent,/周林/);e.dom.window.close();
});
test('removing a pivot filter restores unfiltered total; two row fields create subtotals',()=>{
 const e=env(),c=open(e,'y2024q67');for(const [f,z] of [['产品','row'],['销量','value'],['分部','filter']]){click(c,'pick',f);click(c,'place',z);}change(e,c,'filter','一部');click(c,'remove','filter:分部');assert.match(c.querySelector('.lab-pivot-layout').textContent,/50/);click(c,'pick','分部');click(c,'place','row');assert.match(c.querySelector('.lab-pivot-layout').textContent,/产品1 小计/);assert.match(c.querySelector('.lab-pivot-layout').textContent,/95/);e.dom.window.close();
});
test('CSV text versus general changes precision and preserves a quoted comma',()=>{
 const e=env(),c=open(e,'y2021q47');click(c,'start');click(c,'next');click(c,'next');change(e,c,'textColumns','false');click(c,'finish');assert.match(c.textContent,/王,宁/);assert.doesNotMatch(c.querySelector('table').textContent,/001234567890123456/);assert.match(c.querySelector('table').textContent,/1234567890123450/);assert.deepEqual(Array.from(e.w.NOTE_LABS.parseCSV('a,"b,c"\n1,"two""quotes"'),r=>Array.from(r)),[['a','b,c'],['1','two"quotes']]);e.dom.window.close();
});
test('drawing a text box requires tool selection; real pointer drag creates editable content',()=>{
 const e=env(5),c=open(e,'y2021q10');click(c,'tool');const canvas=c.querySelector('[data-lab-drag="box"]');canvas.getBoundingClientRect=()=>({left:0,top:0,width:400,height:300});for(const [type,x,y] of [['pointerdown',20,30],['pointermove',250,180],['pointerup',250,180]])canvas.dispatchEvent(new e.w.MouseEvent(type,{bubbles:true,button:0,clientX:x,clientY:y}));assert.ok(c.querySelector('.lab-drawn-box'));change(e,c,'text','独立文本框');assert.equal(c.querySelector('textarea').value,'独立文本框');e.dom.window.close();
});
test('Goal Seek candidate can be cancelled; equal zero-profit target is already satisfied',()=>{
 const e=env(),c=open(e,'y2021q58');click(c,'open');click(c,'solve');assert.equal(c.querySelector('[data-field="quantity"]').value,'5000');click(c,'discard');assert.equal(c.querySelector('[data-field="quantity"]').value,'1000');change(e,c,'price',100);click(c,'open');change(e,c,'target',0);click(c,'solve');assert.match(c.querySelector('.lab-output').textContent,/已等于目标/);e.dom.window.close();
});
test('month fill uses MONTH and relative references, not a fixed answer',()=>{
 const e=env(),c=open(e,'y2025q50');click(c,'fill');assert.match(c.querySelector('[data-fill-index="1"]').textContent,/6月/);assert.match(c.querySelector('[data-fill-index="2"]').textContent,/MONTH\(B5\)/);change(e,c,'date1','2025-02-20');assert.match(c.querySelector('[data-fill-index="1"]').textContent,/2月/);e.dom.window.close();
});
test('conditional averages ignore text until source conversion; VALUE leaves source intact',()=>{
 const e=env(),c=open(e,'y2026q49');assert.match(c.querySelector('.lab-office output').textContent,/结果：25/);change(e,c,'method','value');click(c,'convert');assert.match(c.querySelector('.lab-office output').textContent,/结果：25/);assert.match(c.querySelector('table').textContent,/文本/);change(e,c,'method','error');click(c,'convert');assert.match(c.querySelector('.lab-office output').textContent,/结果：21.5/);e.dom.window.close();
});
test('SUMIF formula escapes literal wildcard input and recalculates edited amounts',()=>{
 const e=env(),c=open(e,'y2026q50');assert.match(c.textContent,/350/);change(e,c,'value0',100);assert.match(c.textContent,/330/);change(e,c,'keyword','?');assert.match(c.querySelector('code').textContent,/\*~\?\*/);assert.match(c.querySelector('output').textContent,/0/);e.dom.window.close();
});
test('Chinese-number spacing and Chinese-Latin spacing are independent',()=>{
 const e=env(3),c=open(e,'y2026q47');click(c,'open');change(e,c,'pn',false);click(c,'apply');assert.match(c.querySelector('output').textContent,/中文与数字：关；中文与西文：开/);e.dom.window.close();
});
test('title slide footer is suppressed without renumbering subsequent slides',()=>{
 const e=env(5),c=open(e,'y2024q65');click(c,'open');change(e,c,'number',true);change(e,c,'hideTitle',true);click(c,'apply');assert.equal(c.querySelector('.lab-slide-footer'),null);click(c,'next');assert.equal(c.querySelector('.lab-slide-footer span:last-child').textContent,'2');e.dom.window.close();
});
test('Ctrl adds discontinuous columns and combination chart has a separate success-rate axis',()=>{
 const e=env(),c=open(e,'y2026q52');click(c,'ab');c.querySelector('[data-lab-act="d"]').dispatchEvent(new e.w.MouseEvent('click',{bubbles:true,ctrlKey:true}));click(c,'insert');click(c,'combo');change(e,c,'secondary',true);click(c,'apply');assert.match(c.querySelector('svg').textContent,/成功率%/);assert.ok(c.querySelector('svg polyline'));e.dom.window.close();
});
test('custom show removal is a draft; cancelling retains saved list and all source slides',()=>{
 const e=env(5),c=open(e,'y2026q55');click(c,'open');click(c,'edit');click(c,'select','1');click(c,'remove');click(c,'cancel');assert.match(c.querySelector('.lab-dialog').textContent,/数据/);click(c,'edit');click(c,'remove');click(c,'save');assert.equal(c.querySelectorAll('.lab-deck aside button').length,3);e.dom.window.close();
});
test('sections follow selected slide and black screen hides ink without deleting it',()=>{
 const e=env(5),c=open(e,'y2025q10');click(c,'page','2');click(c,'rename');assert.equal(c.querySelector('[data-field="name"]').value,'第二部分');click(c,'cancel');const r=e.w.NOTE_LABS.registry.y2025q10,s={...structuredClone(r.initial),show:true,strokes:[{page:0,color:'#f00',points:[[0,0],[10,10]]}]};assert.match(r.render(s),/<polyline/);r.action(s,'black');assert.doesNotMatch(r.render(s),/<polyline/);r.action(s,'black');assert.match(r.render(s),/<polyline/);e.dom.window.close();
});
test('task manager ends a process without changing host name; Apply survives Cancel',()=>{
 const e=env(2),c=open(e,'y2026q34');click(c,'end','记事本');assert.doesNotMatch(c.querySelector('tbody').textContent,/记事本/);assert.match(c.querySelector('.lab-browser>header').textContent,/学习电脑/);const f=open(e,'y2025q32');change(e,f,'draft',true);click(f,'apply');change(e,f,'draft',false);click(f,'cancel');assert.doesNotMatch(f.querySelector('.lab-browser-page').textContent,/\.txt/);click(f,'open');assert.equal(f.querySelector('[data-field="draft"]').checked,true);e.dom.window.close();
});
test('GCD handles immediate divisibility and clears results after invalid input',()=>{
 const e=env(11),c=open(e,'y2026q6');change(e,c,'a','12');change(e,c,'b','6');click(c,'start');click(c,'step');assert.match(c.querySelector('output').textContent,/最大公约数：6/);change(e,c,'a','0');click(c,'start');assert.match(c.querySelector('output').textContent,/不能输入0/);assert.doesNotMatch(c.querySelector('output').textContent,/最大公约数/);e.dom.window.close();
});
