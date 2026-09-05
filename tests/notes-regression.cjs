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
  const w=dom.window;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;Object.defineProperty(w.crypto,'subtle',{value:require('node:crypto').webcrypto.subtle});w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
  for(const f of files)w.eval(fs.readFileSync(path.join(root,f),'utf8'));
  if([3,4].includes(chapter))for(const f of ['notes-study.js','note-labs-study.js'])w.eval(fs.readFileSync(path.join(root,f),'utf8'));
  if([1,2,5].includes(chapter))for(const f of ['notes-core.js',chapter===5?'note-labs-presentation.js':'note-labs-core.js'])w.eval(fs.readFileSync(path.join(root,f),'utf8'));
  if(chapter>=6){w.eval(fs.readFileSync(path.join(root,'notes-extended.js'),'utf8'));const m={6:'network',7:'media',8:'security',10:'data',11:'data'}[chapter];if(m)w.eval(fs.readFileSync(path.join(root,'note-labs-'+m+'.js'),'utf8'));}
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
 const e=env(),c=open(e,'y2021q58');click(c,'open');click(c,'solve');assert.equal(c.querySelector('[data-field="quantity"]').value,'5000');assert.ok(c.querySelector('[data-field="cost"]').disabled);assert.ok(c.querySelector('[data-field="quantity"]').disabled);click(c,'discard');assert.equal(c.querySelector('[data-field="quantity"]').disabled,false);assert.equal(c.querySelector('[data-field="quantity"]').value,'1000');change(e,c,'price',100);click(c,'open');change(e,c,'target',0);click(c,'solve');assert.match(c.querySelector('.lab-output').textContent,/已等于目标/);e.dom.window.close();
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
 const e=env(5),c=open(e,'y2024q65');click(c,'open');change(e,c,'number',true);change(e,c,'hideTitle',true);click(c,'all');assert.equal(c.querySelector('[data-slide-number]').textContent,'1');click(c,'page','1');assert.equal(c.querySelector('[data-slide-number]'),null);click(c,'page','2');assert.equal(c.querySelector('[data-slide-number]').textContent,'3');e.dom.window.close();
});
test('Ctrl adds discontinuous columns and combination chart has a separate success-rate axis',()=>{
 const e=env(),c=open(e,'y2026q52');click(c,'ab');c.querySelector('[data-lab-act="d"]').dispatchEvent(new e.w.MouseEvent('click',{bubbles:true,ctrlKey:true}));click(c,'insert');click(c,'combo');change(e,c,'secondary',true);click(c,'apply');assert.match(c.querySelector('svg').textContent,/成功率%/);assert.ok(c.querySelector('svg polyline'));e.dom.window.close();
});
test('custom show removal is a draft; cancelling retains saved list and all source slides',()=>{
 const e=env(5),c=open(e,'y2026q55');click(c,'open');click(c,'edit');click(c,'select','1');click(c,'remove');click(c,'cancel');assert.match(c.querySelector('.lab-dialog').textContent,/数据/);click(c,'edit');click(c,'remove');click(c,'save');assert.equal(c.querySelectorAll('.core-thumbnails button').length,3);e.dom.window.close();
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
test('Word formatting properties accumulate and zoom preserves document format',()=>{
 const e=env(3),c=open(e,'merged-7');change(e,c,'size','22');change(e,c,'underline','double');change(e,c,'alignment','center');change(e,c,'zoom','150');assert.equal(c.querySelector('[data-field="size"]').value,'22');assert.equal(c.querySelector('[data-field="underline"]').value,'double');assert.match(c.querySelector('.lab-paper p').getAttribute('style'),/center/);e.dom.window.close();
});
test('Word table position and cell alignment are independent; cancel keeps table position',()=>{
 const e=env(3),c=open(e,'y2020q63');click(c,'properties');change(e,c,'draftAlign','center');click(c,'apply');click(c,'cellMiddle');click(c,'properties');change(e,c,'draftAlign','right');click(c,'cancel');assert.match(c.querySelector('output').textContent,/整表：居中/);assert.match(c.querySelector('.lab-paper td').style.cssText,/vertical-align: middle/);e.dom.window.close();
});
test('Word section numbering continues until explicitly restarted and Cancel discards format',()=>{
 const e=env(3),c=open(e,'y2020q41');change(e,c,'scenario','numbers');click(c,'num_page','2');click(c,'num_break');click(c,'num_edit');click(c,'num_insert');assert.equal(c.querySelector('.lab-page-footer').textContent,'3');click(c,'num_link');assert.equal(c.querySelector('.lab-page-footer').textContent,'3');click(c,'num_format');change(e,c,'numDraftMode','restart');change(e,c,'numDraftStart','1');click(c,'num_cancel');assert.equal(c.querySelector('.lab-page-footer').textContent,'3');click(c,'num_format');change(e,c,'numDraftMode','restart');click(c,'num_apply');assert.equal(c.querySelector('.lab-page-footer').textContent,'1');click(c,'num_page','4');assert.equal(c.querySelector('.lab-page-footer').textContent,'2');e.dom.window.close();
});
test('Word table formula is a cached field and actual F9 updates its selected result',()=>{
 const e=env(3),c=open(e,'y2024q8');change(e,c,'scenario','formula');click(c,'formulaOpen');click(c,'formulaApply');assert.match(c.querySelector('[data-lab-act="fieldSelect"]').textContent,/175/);change(e,c,'score0','90');assert.match(c.querySelector('[data-lab-act="fieldSelect"]').textContent,/175/);click(c,'fieldSelect');c.querySelector('[data-lab-act="fieldSelect"]').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'F9',bubbles:true,cancelable:true}));assert.match(c.querySelector('[data-lab-act="fieldSelect"]').textContent,/185/);e.dom.window.close();
});
test('TOC page-only update keeps old title while full update reads current heading',()=>{
 const e=env(3),c=open(e,'merged-5');change(e,c,'tab','home');click(c,'style');change(e,c,'tab','references');click(c,'tocInsert');change(e,c,'title','计算机基础');click(c,'cover');click(c,'tocOpen');change(e,c,'tocMode','pages');click(c,'tocApply');assert.match(c.querySelector('.lab-auto-toc').textContent,/第一章 信息技术/);assert.match(c.querySelector('.lab-auto-toc').textContent,/2/);click(c,'tocOpen');change(e,c,'tocMode','all');click(c,'tocApply');assert.match(c.querySelector('.lab-auto-toc').textContent,/计算机基础/);e.dom.window.close();
});
test('Workbook copy creates independent data; moving removes source; new workbook is available',()=>{
 const e=env(),c=open(e,'y2023q11');click(c,'file');click(c,'fileOpen');click(c,'book','0');click(c,'open');assert.equal(c.querySelector('[data-field="copy"]').checked,false);change(e,c,'copy',true);click(c,'apply');change(e,c,'score0','99');click(c,'book','0');assert.equal(c.querySelector('[data-field="score0"]').value,'86');click(c,'open');change(e,c,'target','new');click(c,'apply');assert.match(c.textContent,/工作簿/);click(c,'book','0');assert.doesNotMatch(c.querySelector('.lab-tabs').textContent,/总表/);e.dom.window.close();
});
test('Freeze panes depends on actual selected cell and can be removed',()=>{
 const e=env(),c=open(e,'y2024q58');click(c,'cell','3:3');click(c,'menu');click(c,'freeze');assert.match(c.querySelector('output').textContent,/前2行和前2列/);assert.match(c.querySelector('tbody td').style.cssText,/position: sticky/);click(c,'menu');click(c,'unfreeze');assert.doesNotMatch(c.querySelector('tbody td').style.cssText,/position: sticky/);e.dom.window.close();
});
test('Print settings are a draft; orientation and fit produce different page layouts',()=>{
 const e=env(),c=open(e,'y2023q10');click(c,'preview');assert.match(c.textContent,/第 1 \/ 2 页/);click(c,'open');click(c,'tab','page');change(e,c,'orientation','landscape');click(c,'cancel');assert.match(c.textContent,/A4 纵向/);click(c,'open');click(c,'tab','page');change(e,c,'orientation','landscape');click(c,'apply');assert.match(c.textContent,/第 1 \/ 1 页/);e.dom.window.close();
});
test('External link loss retains the last calculated value until source becomes available',()=>{
 const e=env(),c=open(e,'y2021q9');change(e,c,'external','320');click(c,'path');change(e,c,'external','999');assert.match(c.querySelector('table').textContent,/320/);assert.doesNotMatch(c.querySelector('table').textContent,/999/);click(c,'path');assert.match(c.querySelector('table').textContent,/999/);e.dom.window.close();
});
test('Validation error disables background editing; Retry enables it without accepting',()=>{
 const e=env(),c=open(e,'y2021q25');click(c,'open');click(c,'apply');change(e,c,'draft','未知');click(c,'commit');assert.equal(c.querySelector('[data-field="draft"]').disabled,true);assert.equal(c.querySelector('[data-lab-act="commit"]').disabled,true);click(c,'retry');assert.equal(c.querySelector('[data-field="draft"]').disabled,false);assert.match(c.querySelector('table').textContent,/男/);e.dom.window.close();
});
test('Reference copying supports base-26 columns and rejects fractional displacement',()=>{
 const e=env(),c=open(e,'merged-10');change(e,c,'style','relative');change(e,c,'dx','25');assert.match(c.querySelector('.lab-office table').textContent,/=AA3/);change(e,c,'dy','1.5');assert.match(c.querySelector('.lab-office table').textContent,/请输入整数/);change(e,c,'dy','-3');assert.match(c.querySelector('.lab-office table').textContent,/#REF!/);e.dom.window.close();
});
test('Clear filter retains arrows; turning filter off removes them and restores rows',()=>{
 const e=env(),c=open(e,'y2026q51');change(e,c,'mode','auto');click(c,'auto');click(c,'clear');assert.match(c.querySelector('thead').textContent,/性别 ▾/);click(c,'auto');click(c,'toggleAuto');assert.doesNotMatch(c.querySelector('thead').textContent,/▾/);assert.match(c.querySelector('tbody').textContent,/周林/);e.dom.window.close();
});
test('CSV reimport cancel restores previously imported rows and options',()=>{
 const e=env(),c=open(e,'y2021q47');click(c,'start');click(c,'next');click(c,'next');click(c,'finish');const previous=c.querySelector('table').textContent;click(c,'start');click(c,'next');change(e,c,'delimiter','tab');click(c,'cancel');assert.equal(c.querySelector('table').textContent,previous);e.dom.window.close();
});
test('Combination chart cancel preserves applied axis configuration',()=>{
 const e=env(),c=open(e,'y2026q52');click(c,'ab');c.querySelector('[data-lab-act="d"]').dispatchEvent(new e.w.MouseEvent('click',{bubbles:true,ctrlKey:true}));click(c,'insert');click(c,'combo');change(e,c,'secondary',true);click(c,'apply');click(c,'combo');change(e,c,'secondary',false);click(c,'cancel');assert.match(c.querySelector('svg').textContent,/成功率%/);e.dom.window.close();
});
test('Word and Excel show 18 comparison tables, external reset controls, and keep keyboard focus',()=>{
 let count=0;for(const ch of [3,4]){const e=env(ch);count+=e.d.querySelectorAll('.note-comparison').length;assert.equal(e.d.querySelectorAll('.simulation-footer').length,0);const c=open(e,ch===3?'merged-7':'merged-10');assert.equal(c.querySelector('[data-sim-reset]').closest('.lab-office'),null);const control=c.querySelector('[data-field]');control.focus();control.dispatchEvent(new e.w.Event('change',{bubbles:true}));assert.equal(e.d.activeElement.dataset.field,control.dataset.field);e.dom.window.close();}assert.equal(count,18);
});
test('Trend forecast preserves slope and places its endpoint on the same month scale',()=>{
 const e=env(),c=open(e,'y2024q68');click(c,'open');change(e,c,'draft','1');click(c,'apply');let line=c.querySelector('[data-trend-line]');assert.equal(line.getAttribute('x2'),'280');const firstY=line.getAttribute('y2');click(c,'open');change(e,c,'draft','3');click(c,'cancel');assert.equal(c.querySelector('[data-trend-line]').getAttribute('y2'),firstY);click(c,'open');change(e,c,'draft','3');click(c,'apply');line=c.querySelector('[data-trend-line]');assert.equal(line.getAttribute('x2'),'360');assert.ok(Number(line.getAttribute('y2'))<Number(firstY));e.dom.window.close();
});
test('Table header choice preserves old titles as data and Enter expands actual rows',()=>{
 const e=env(),c=open(e,'y2024q59');click(c,'open');change(e,c,'draftHeader',false);click(c,'apply');assert.match(c.querySelector('.lab-office tbody').textContent,/列1 ▾列2姓名成绩/);change(e,c,'newa','陈晨');change(e,c,'newb','88');c.querySelector('[data-field="newb"]').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert.match(c.querySelector('output').textContent,/A1:B5/);click(c,'convert');click(c,'convertApply');assert.match(c.querySelector('.lab-office tbody').textContent,/陈晨88/);assert.doesNotMatch(c.querySelector('.lab-office tbody').textContent,/▾/);e.dom.window.close();
});
test('Blank replacement distinguishes zero-length cells from one space and supports undo',()=>{
 const e=env(),c=open(e,'y2023q60');click(c,'all');click(c,'open');click(c,'apply');assert.match(c.querySelector('output').textContent,/2 处/);assert.equal(c.querySelector('[data-row="2"]').textContent,' ');click(c,'cancel');assert.match(c.querySelector('[data-row="1"]').textContent,/缺考/);click(c,'undo');assert.doesNotMatch(c.querySelector('[data-row="1"]').textContent,/缺考/);e.dom.window.close();
});
test('Word page start rejects decimals and text-to-table preserves leading empty fields',()=>{
 const e=env(3),c=open(e,'y2020q41');change(e,c,'scenario','numbers');click(c,'num_edit');click(c,'num_format');change(e,c,'numDraftStart','1.5');click(c,'num_apply');assert.ok(c.querySelector('.lab-dialog'));assert.match(c.querySelector('output').textContent,/整数/);const t=open(e,'y2024q8');change(e,t,'scenario','convert');change(e,t,'raw','\t成绩\n王宁\t80');click(t,'convertOpen');click(t,'convertApply');assert.equal(t.querySelector('.lab-paper table th').textContent,'');e.dom.window.close();
});
test('MID and RIGHT calculate editable source and reject illegal numeric arguments',()=>{
 const e=env(),c=open(e,'y2020q56');change(e,c,'start','0');assert.equal(c.querySelector('[data-extract-result]').textContent,'#VALUE!');change(e,c,'fn','RIGHT');change(e,c,'count','3');change(e,c,'text','SD002');assert.equal(c.querySelector('[data-extract-result]').textContent,'002');change(e,c,'count','-1');assert.equal(c.querySelector('[data-extract-result]').textContent,'#VALUE!');e.dom.window.close();
});
test('Column boundary drag reveals unchanged date and cancelled drag retains committed width',()=>{
 const e=env(),c=open(e,'y2020q7');assert.match(c.querySelector('[data-hash-date]').textContent,/#/);const p=(el,type,x)=>el.dispatchEvent(new e.w.MouseEvent(type,{bubbles:true,button:0,clientX:x,clientY:100}));let h=c.querySelector('[data-lab-drag="column"]');p(h,'pointerdown',100);p(h,'pointermove',220);p(h,'pointerup',220);assert.equal(c.querySelector('[data-hash-date]').textContent,'2026/9/5 14:30');assert.equal(c.querySelector('[data-width-readout]').textContent,'250 px');h=c.querySelector('[data-lab-drag="column"]');p(h,'pointerdown',220);p(h,'pointermove',150);p(h,'pointercancel',150);assert.equal(c.querySelector('[data-width-readout]').textContent,'250 px');e.dom.window.close();
});
test('Text fill ends at pointer row and serial values preserve leading zeroes',()=>{
 const e=env(),c=open(e,'y2020q48');const h=c.querySelector('[data-lab-drag="fill"]');c.querySelectorAll('[data-fill-index]').forEach((el,i)=>el.getBoundingClientRect=()=>({left:100,right:200,top:100+i*40,bottom:140+i*40}));for(const [type,y] of [['pointerdown',130],['pointermove',210],['pointerup',210]])h.dispatchEvent(new e.w.MouseEvent(type,{bubbles:true,button:0,clientX:180,clientY:y}));change(e,c,'mode','series');assert.match(c.querySelector('[data-fill-index="2"]').textContent,/002024000003/);assert.doesNotMatch(c.querySelector('[data-fill-index="3"]').textContent,/002024/);e.dom.window.close();
});
test('Clear formats preserves value while deleting a B cell shifts only column B',()=>{
 const e=env(),c=open(e,'y2024q10');click(c,'menu');click(c,'clear','formats');assert.match(c.querySelector('output').textContent,/底层值 0.128；常规格式/);click(c,'undo');click(c,'deleteDialog');click(c,'cancel');assert.match(c.querySelector('output').textContent,/0.128/);click(c,'deleteDialog');click(c,'delete');assert.match(c.querySelector('output').textContent,/底层值 0.25/);assert.equal(c.querySelector('.lab-office tbody tr td:nth-child(2)').textContent,'甲');e.dom.window.close();
});
test('Consolidation aligns out-of-order labels and cancel preserves applied result',()=>{
 const e=env(),c=open(e,'y2023q57');click(c,'open');for(const i of [0,1,2]){change(e,c,'reference',String(i));click(c,'add-reference');}click(c,'apply');assert.match(c.querySelector('.lab-office tbody').textContent,/王宁867992/);const before=c.querySelector('.lab-office tbody').textContent;click(c,'open');click(c,'remove-reference');click(c,'cancel');assert.equal(c.querySelector('.lab-office tbody').textContent,before);change(e,c,'preset','left');click(c,'open');assert.match(c.querySelector('.lab-dialog').textContent,/A\$2:\$B\$4/);click(c,'apply');assert.match(c.querySelector('.lab-office tbody').textContent,/王宁257/);e.dom.window.close();
});
test('Across-center retains selectable B1 while merge changes actual cell structure',()=>{
 const e=env(),c=open(e,'y2020q47');click(c,'range');click(c,'format');change(e,c,'draft','across');click(c,'apply');click(c,'cell','1');assert.equal(c.querySelector('[aria-label="名称框"]').value,'B1');assert.equal(c.querySelector('[aria-label="编辑栏"]').value,'');click(c,'range');click(c,'merge');assert.ok(c.querySelector('td[colspan="4"]'));assert.equal(c.querySelector('[data-lab-act="cell"][data-value="1"]'),null);e.dom.window.close();
});
test('Word shortcut controls move and extend actual editable textarea selection',()=>{
 const e=env(3),c=open(e,'y2024q7');let editor=c.querySelector('[data-selection-editor]');const total=editor.value.length;editor.setSelectionRange(4,4);editor.dispatchEvent(new e.w.Event('select'));click(c,'key','ctrlShiftEnd');editor=c.querySelector('[data-selection-editor]');assert.equal(editor.selectionStart,4);assert.equal(editor.selectionEnd,total);click(c,'key','ctrlHome');editor=c.querySelector('[data-selection-editor]');assert.equal(editor.selectionEnd,0);editor.dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'End',ctrlKey:true,bubbles:true,cancelable:true}));assert.equal(c.querySelector('[data-selection-editor]').selectionStart,total);e.dom.window.close();
});
test('Caption references keep identity across inserted figures and explicit field updates',()=>{
 const e=env(3),c=open(e,'merged-6');click(c,'captionOpen');click(c,'captionApply');click(c,'referenceOpen');click(c,'referenceApply');assert.equal(c.querySelector('[data-lab-act="field"][data-value="reference"]').textContent,'图 2');click(c,'prepend');assert.equal(c.querySelector('[data-lab-act="field"][data-value="reference"]').textContent,'图 2');click(c,'updateAll');assert.equal(c.querySelector('[data-lab-act="field"][data-value="reference"]').textContent,'图 3');for(let i=0;i<3;i++)click(c,'deleteFirst');click(c,'updateAll');assert.match(c.querySelector('[data-lab-act="field"][data-value="reference"]').textContent,/未找到引用源/);e.dom.window.close();
});
test('Footnote click selects a reference; only Delete removes it and renumbers',()=>{
 const e=env(3),c=open(e,'y2022q55');click(c,'insert');click(c,'select','1');click(c,'insert');click(c,'selectRef','0');assert.equal(c.querySelectorAll('sup').length,2);click(c,'deleteRef');assert.equal(c.querySelectorAll('sup').length,1);assert.equal(c.querySelector('sup').textContent,'1');e.dom.window.close();
});
test('Section breaks isolate middle-page orientation; setup cancellation retains applied direction',()=>{
 const e=env(3),c=open(e,'y2020q61');click(c,'breakMenu');click(c,'nextPage');change(e,c,'point','end');click(c,'breakMenu');click(c,'nextPage');click(c,'view','1');click(c,'directionMenu');click(c,'direction','landscape');assert.equal(c.querySelector('[data-layout-page]').dataset.direction,'landscape');click(c,'view','0');assert.equal(c.querySelector('[data-layout-page]').dataset.direction,'portrait');click(c,'view','2');assert.equal(c.querySelector('[data-layout-page]').dataset.direction,'portrait');click(c,'setup');change(e,c,'draftDirection','landscape');click(c,'cancel');assert.equal(c.querySelector('[data-layout-page]').dataset.direction,'portrait');e.dom.window.close();
});
test('Layer selection is unrestricted; one step and bring-to-front change different orders',()=>{
 const e=env(3),c=open(e,'y2025q56');click(c,'pane');c.querySelector('[data-layer-row="right"]').click();click(c,'layer','forward');assert.match(c.querySelector('output').textContent,/从底向上第2层/);click(c,'frontMenu');click(c,'layer','front');assert.match(c.querySelector('output').textContent,/从底向上第3层/);click(c,'undo');assert.match(c.querySelector('output').textContent,/从底向上第2层/);e.dom.window.close();
});
test('RAM loses unsaved edits while the saved SSD file survives a power cycle',()=>{
 const e=env(1),c=open(e,'y2026q3');change(e,c,'ram','已保存版本');click(c,'save');change(e,c,'ram','未保存的修改');click(c,'power');assert.equal(c.querySelector('textarea'),null);assert.equal(c.querySelector('[data-saved-file]').textContent,'已保存版本');click(c,'power');assert.equal(c.querySelector('textarea').value,'');click(c,'load');assert.equal(c.querySelector('textarea').value,'已保存版本');e.dom.window.close();
});
test('Capacity and bit models calculate independently and reject overflow-sized inputs',()=>{
 const e=env(1),m=e.w.NOTE_LABS.registry['merged-3'],s=structuredClone(m.initial);m.action(s,'bit','0');assert.match(m.render(s),/193/);s.mode='size';s.unit='MiB';assert.match(m.render(s),/1,048,576/);s.unit='MB';assert.match(m.render(s),/1,000,000/);s.amount='1e308';assert.doesNotMatch(m.render(s),/∞|Infinity/);s.mode='image';s.width='1024';s.height='768';s.depth='24';assert.match(m.render(s),/2,359,296/);e.dom.window.close();
});
test('CPU advances PC on fetch and stores the sum only at STORE',()=>{
 const e=env(1),m=e.w.NOTE_LABS.registry['merged-1'],s=structuredClone(m.initial);s.left='5';s.right='8';m.action(s,'step');assert.equal(s.pc,1);assert.equal(s.ir,'LOAD 10');for(let i=0;i<5;i++)m.action(s,'step');assert.equal(s.acc,13);assert.equal(s.result,0);for(let i=0;i<6;i++)m.action(s,'step');assert.equal(s.result,13);assert.equal(s.halted,true);m.action(s,'restart');s.left='1e308';m.action(s,'step');assert.equal(s.phase,0);e.dom.window.close();
});
test('File drag uses destination volume and actual pointerup modifier keys',()=>{
 const e=env(2),c=open(e,'y2020q24');
 const drag=(mods={})=>{const f=c.querySelector('[data-lab-drag="file"]');c.querySelector('[data-file-target]').getBoundingClientRect=()=>({left:150,right:290,top:80,bottom:240});for(const [type,x,y] of [['pointerdown',20,50],['pointermove',200,140],['pointerup',200,140]])f.dispatchEvent(new e.w.MouseEvent(type,{bubbles:true,button:0,clientX:x,clientY:y,...mods}));};
 change(e,c,'drive','D');drag();assert.ok(c.querySelector('[data-lab-drag="file"]'));assert.equal(c.querySelectorAll('[data-file-result]').length,1);change(e,c,'drive','C');drag({ctrlKey:true});assert.ok(c.querySelector('[data-lab-drag="file"]'));change(e,c,'drive','D');drag({shiftKey:true});assert.equal(c.querySelector('[data-lab-drag="file"]'),null);e.dom.window.close();
});
test('Duplicate file copy reports a conflict rather than claiming another copy',()=>{
 const e=env(2),m=e.w.NOTE_LABS.registry.y2020q24,s=structuredClone(m.initial);s.drive='D';m.action(s,'drop');m.action(s,'drop');assert.equal(s.target.length,1);assert.match(s.message,/已存在/);assert.equal(s.source,true);e.dom.window.close();
});
test('Recycle Bin restores original files and Delete in the bin requests permanent removal',()=>{
 const e=env(2),c=open(e,'y2020q3');click(c,'select','2');click(c,'delete');click(c,'tab','bin');assert.match(c.querySelector('table').textContent,/复习提纲/);click(c,'restore');click(c,'tab','folder');click(c,'select','2');click(c,'delete');click(c,'tab','bin');c.querySelector('.note-lab').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Delete',bubbles:true,cancelable:true}));assert.ok(c.querySelector('.lab-dialog'));click(c,'confirm');assert.equal(c.querySelectorAll('[data-lab-act="select"]').length,0);e.dom.window.close();
});
test('Clipboard permits repeated text pastes but completes a file cut only on successful paste',()=>{
 const e=env(2),m=e.w.NOTE_LABS.registry.y2025q33,s=structuredClone(m.initial);s.sourceText='复习';m.action(s,'cut');assert.equal(s.sourceText,'');m.action(s,'paste');m.action(s,'sleep');m.action(s,'sleep');m.action(s,'paste');assert.equal(s.targetText,'复习复习');s.mode='file';m.action(s,'cut');assert.equal(s.sourceFile,true);assert.equal(s.cut,true);m.action(s,'paste');assert.equal(s.sourceFile,false);assert.equal(s.targetFile,true);assert.equal(s.buffer,null);e.dom.window.close();
});
test('A topmost inactive window does not take keyboard focus from the active text field',()=>{
 const e=env(2),c=open(e,'y2020q2');click(c,'activate','A');const a=c.querySelector('[data-field="textA"]');assert.equal(e.d.activeElement,a);assert.equal(c.querySelector('[data-window="B"]').style.zIndex,'3');assert.equal(c.querySelector('[data-window="A"]').style.zIndex,'2');change(e,c,'textA','只改A');assert.equal(c.querySelector('[data-field="textB"]').value,'B中的笔记');e.dom.window.close();
});
test('PowerPoint deletion follows the selected page or object; hidden slides are skipped in playback',()=>{
 const e=env(5),m=e.w.NOTE_LABS.registry.y2020q12,s=structuredClone(m.initial);m.action(s,'page','4');m.action(s,'delete');assert.deepEqual(Array.from(s.slides,x=>x.id),[1,2,3]);m.action(s,'undo');m.action(s,'object');m.action(s,'delete');assert.equal(s.slides.length,4);assert.equal(s.slides[3].object,false);m.action(s,'page','1');m.action(s,'hide');m.action(s,'show');assert.equal(s.playing,2);m.action(s,'next');assert.equal(s.playing,3);e.dom.window.close();
});
test('Master and layout text changes propagate only to their own descendants',()=>{
 const e=env(5),c=open(e,'y2020q11');click(c,'view');change(e,c,'masterText','母版甲');assert.equal([...c.querySelectorAll('.core-master-logo')].filter(el=>el.textContent==='母版甲').length,3);click(c,'node','A/content');change(e,c,'masterText','内容版式文字');assert.equal([...c.querySelectorAll('.core-layout-text')].filter(el=>el.textContent==='内容版式文字').length,2);change(e,c,'hide',true);assert.equal(c.querySelectorAll('.core-local-text').length,5);assert.equal([...c.querySelectorAll('.core-master-logo')].filter(el=>el.textContent==='母版甲').length,2);e.dom.window.close();
});
test('Theme application supports discontinuous selection and keeps unselected pages unchanged',()=>{
 const e=env(5),c=open(e,'y2020q53');c.querySelector('[data-lab-act="page"][data-value="4"]').dispatchEvent(new e.w.MouseEvent('click',{bubbles:true,ctrlKey:true}));click(c,'menu');click(c,'selectedTheme');const rows=[...c.querySelectorAll('.note-lab tbody tr')].map(tr=>tr.textContent);assert.match(rows[0],/紫藤/);assert.match(rows[3],/紫藤/);assert.match(rows[1],/樱粉/);assert.match(rows[2],/樱粉/);e.dom.window.close();
});
test('Footer dialog disables external layout changes and cancellation leaves applied fields untouched',()=>{
 const e=env(5),c=open(e,'y2024q65');click(c,'open');assert.equal(c.querySelector('[data-field="layout"]').matches(':disabled'),true);change(e,c,'number',true);click(c,'cancel');assert.equal(c.querySelector('[data-slide-number]'),null);e.dom.window.close();
});
test('Custom show reordered references determine playback without reordering source slides',()=>{
 const e=env(5),m=e.w.NOTE_LABS.registry.y2026q55,s=structuredClone(m.initial);m.action(s,'edit');m.action(s,'select','2');m.action(s,'up');m.action(s,'save');assert.deepEqual(Array.from(s.saved),[0,2,1]);m.action(s,'show');m.action(s,'next');assert.equal(s.saved[s.playing],2);m.action(s,'next');assert.equal(s.saved[s.playing],1);m.action(s,'next');assert.equal(s.show,false);assert.match(m.render(s),/源文稿|源幻灯片/);e.dom.window.close();
});
test('Rehearsal pauses, preserves unvisited saved times and cannot double-advance a boundary click',()=>{
 const e=env(5),m=e.w.NOTE_LABS.registry.y2023q13,s=structuredClone(m.initial);let now=0;e.w.Date.now=()=>now;s.saved=[10,20,30];m.action(s,'start');now=1000;m.action(s,'pause');now=6000;m.tick(s);assert.equal(s.elapsed,1);m.action(s,'finish');m.action(s,'save');assert.deepEqual(Array.from(s.saved),[1,20,30]);s.saved=[1,1,1];m.action(s,'play');now=7100;m.action(s,'next');assert.equal(s.page,1);e.dom.window.close();
});
test('Transitions use the entering slide settings; animation timing controls completion and automatic advance',()=>{
 const e=env(5),m=e.w.NOTE_LABS.registry['merged-11'],s=structuredClone(m.initial);let now=0;e.w.Date.now=()=>now;s.settings[0].effect='none';m.action(s,'start');assert.equal(s.phase,'slide');assert.match(m.render(s),/opacity:1/);m.action(s,'screen');assert.equal(s.current,1);assert.equal(s.phase,'transition');now=600;m.tick(s);assert.equal(s.phase,'slide');m.action(s,'screen');s.settings[1].auto=true;s.settings[1].after=.5;now=2600;m.tick(s);assert.equal(s.current,1);now=3600;m.tick(s);assert.equal(s.current,2);e.dom.window.close();
});
test('Playback keyboard handling preserves native buttons and grouped notes retain all source points',()=>{
 const e=env(5),m=e.w.NOTE_LABS.registry['merged-11'],s=structuredClone(m.initial);s.show=true;let prevented=false;const button=e.d.createElement('button');assert.equal(m.keydown(s,{key:'Enter',target:button,preventDefault:()=>prevented=true}),undefined);assert.equal(prevented,false);for(const id of ['merged-11','y2020q11']){const n=e.w.NOTES.notes.find(x=>x.id===id);assert.deepEqual(Array.from(n.pointGroups.flatMap(g=>g.indices)).sort((a,b)=>a-b),Array.from({length:n.points.length},(_,i)=>i));assert.equal(e.d.querySelectorAll('#'+id+' .note-point-group li').length,n.points.length);}e.dom.window.close();
});

test('network transfer uses the bottleneck, payload proportion and actual elapsed time',()=>{
 const e=env(6),r=e.w.NOTE_LABS.registry.y2020q26,s=structuredClone(r.initial),calc=e.w.NOTE_LABS.networkMath.transfer;
 let x=calc(s);assert.equal(x.capacity,20);assert.equal(x.goodput,16);assert.equal(x.bits,16777216);
 s.first='1000';assert.equal(calc(s).seconds,x.seconds);s.second='40';assert.equal(calc(s).seconds,x.seconds/2);
 s.second='0';assert.equal(calc(s),null);s.second='20';let now=1000;e.w.Date.now=()=>now;r.action(s,'start');now=1200;r.tick(s);assert.equal(s.elapsed,.2);assert.match(r.render(s),/aria-valuenow="0"/);now=5000;r.tick(s);assert.equal(s.running,false);assert.match(r.render(s),/aria-valuenow="100"/);e.dom.window.close();
});
test('URL resolution treats a trailing slash, queries and fragments separately',()=>{
 const e=env(6),c=open(e,'y2026q14');change(e,c,'base','https://notes.example/course/');change(e,c,'target','page.html?q=1#part');assert.match(c.querySelector('.ext-address').textContent,/\/course\/page.html\?q=1#part/);change(e,c,'base','https://notes.example/course');assert.match(c.querySelector('.ext-address').textContent,/https:\/\/notes.example\/page.html/);change(e,c,'target','javascript:alert(1)');assert.equal(c.querySelector('.ext-address'),null);assert.match(c.textContent,/有效的HTTP/);e.dom.window.close();
});
test('IPv6 canonicalization handles zero runs, legal single-group compression and invalid forms',()=>{
 const e=env(6),parse=e.w.NOTE_LABS.networkMath.ipv6;
 assert.equal(parse('::').full,'0000:0000:0000:0000:0000:0000:0000:0000');assert.equal(parse('2001:0:0:1:0:0:1:1').canonical,'2001::1:0:0:1:1');assert.equal(parse('1:2:3:4:5:6::8').canonical,'1:2:3:4:5:6:0:8');assert.equal(parse('2001:DB8::1').canonical,'2001:db8::1');
 for(const raw of ['1::2::3','1:2:3:4:5:6:7:8:9','1:2:3:4:5:6:7:8::','::ffff:192.0.2.1','g::1'])assert.equal(parse(raw),null,raw);e.dom.window.close();
});
test('PCM byte counts preserve channels and reject fractional samples; quantization uses finite levels',()=>{
 const e=env(7),m=e.w.NOTE_LABS.mediaMath,s=structuredClone(e.w.NOTE_LABS.registry.y2024q32.initial);
 assert.equal(m.pcm(s).bytes,10584000);s.channels='2';assert.equal(m.pcm(s).bytes,21168000);s.duration='.001';assert.equal(m.pcm(s),null);
 const levels=new Set(m.samples(s).map(x=>x.q));assert.ok(levels.size<=8);assert.ok(m.samples(s).every(x=>x.q>=-1&&x.q<=1));const c=open(e,'y2024q32');change(e,c,'mode','pcm');change(e,c,'channels','2');assert.match(c.textContent,/21,168,000/);e.dom.window.close();
});
test('run-length coding restores its input but cannot recover earlier grayscale reduction',()=>{
 const e=env(7),m=e.w.NOTE_LABS.mediaMath;assert.deepEqual(JSON.parse(JSON.stringify(m.runLength([1,1,2,3,3]))),[[1,2],[2,1],[3,2]]);assert.equal(m.parsePixels('0,256'),null);
 const c=open(e,'merged-14');change(e,c,'raw','30,31,30,31');assert.match(c.textContent,/这次反而变大/);change(e,c,'mode','reduce');assert.match(c.textContent,/否，编码前已丢失灰度差别/);assert.match(c.textContent,/是，游程可逐项还原/);e.dom.window.close();
});
test('firewall matches the unchanged packet across source, port, direction and protocol',()=>{
 const e=env(8),c=open(e,'merged-16'),m=e.w.NOTE_LABS.securityMath;
 assert.equal(m.cidr('10.20.8.0/   '),null);assert.equal(m.cidr('10.20.8.0/0x10'),null);assert.equal(m.cidr('10.20.8.0/1e1'),null);assert.equal(m.inSubnet('203.0.113.27','0.0.0.0/0'),true);assert.equal(m.inSubnet('10.20.8.16','10.20.8.16/32'),true);assert.equal(m.inSubnet('10.20.8.17','10.20.8.16/32'),false);
 click(c,'send');assert.match(c.querySelector('.lab-output').textContent,/203.0.113.27.*已阻止/);change(e,c,'source','10.20.9.16');click(c,'send');assert.match(c.querySelector('.lab-output').textContent,/允许通过/);change(e,c,'protocol','UDP');click(c,'send');assert.match(c.querySelector('.lab-output').textContent,/没有命中/);change(e,c,'protocol','TCP');change(e,c,'direction','out');click(c,'send');assert.match(c.querySelector('.lab-output').textContent,/出站.*已阻止/);e.dom.window.close();
});
test('dragging firewall rules changes first-match behavior without changing the packet',()=>{
 const e=env(8),c=open(e,'merged-16');change(e,c,'source','10.20.8.16');click(c,'send');assert.match(c.querySelector('.lab-output').textContent,/允许通过/);
 const rows=[...c.querySelectorAll('[data-lab-drop]')];rows.forEach((el,i)=>el.getBoundingClientRect=()=>({left:100,right:400,top:100+i*100,bottom:200+i*100}));const h=c.querySelector('[data-key="2"]');const p=(type,x,y)=>h.dispatchEvent(new e.w.MouseEvent(type,{bubbles:true,button:0,clientX:x,clientY:y}));p('pointerdown',180,250);p('pointermove',180,150);p('pointerup',180,150);const afterDrop=e.w.Date.now()+500;e.w.Date.now=()=>afterDrop;click(c,'send');assert.match(c.querySelector('.lab-output').textContent,/10.20.8.16.*已阻止.*第1条/);e.dom.window.close();
});
const settle=async fn=>{for(let i=0;i<250;i++){if(fn())return;await new Promise(r=>setTimeout(r,20));}assert.fail('async model did not finish');};
test('real signature UI verifies original, rejects tampering and rejects a different public key',async()=>{
 const e=env(8),c=open(e,'merged-15');click(c,'keys');await settle(()=>c.querySelector('.lab-output').textContent.includes('新密钥已生成'));click(c,'sign');await settle(()=>c.querySelector('.lab-output').textContent.includes('已用发送方私钥签名'));click(c,'verify');await settle(()=>c.querySelector('.lab-output').textContent.includes('验签通过'));
 change(e,c,'received','被篡改的消息');click(c,'verify');await settle(()=>c.querySelector('.lab-output').textContent.includes('验签失败'));change(e,c,'received','本周学习计算机网络');change(e,c,'signer','other');click(c,'verify');await settle(()=>c.querySelector('.lab-output').textContent.includes('验签失败'));e.dom.window.close();
});
test('real RSA-OAEP restores messages, rejects modified ciphertext and displays empty plaintext',async()=>{
 const e=env(8),r=e.w.NOTE_LABS.registry['merged-15'],s=structuredClone(r.initial);await r.action(s,'keys');s.mode='encryption';s.text='实际密文';await r.action(s,'encrypt');assert.equal(s.cipher.length,512);await r.action(s,'decrypt');assert.equal(s.clear,'实际密文');s.cipher=(s.cipher[0]==='0'?'1':'0')+s.cipher.slice(1);await r.action(s,'decrypt');assert.equal(s.decrypted,false);assert.match(s.message,/解密失败/);s.text='';await r.action(s,'encrypt');await r.action(s,'decrypt');assert.equal(s.decrypted,true);assert.match(r.render(s),/空字符串/);s.mode='hash';s.text='abc';await r.action(s,'hash');assert.equal(s.digest,'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');e.dom.window.close();
});
test('natural join matches all shared attributes and projection removes actual duplicates',()=>{
 const e=env(10),c=open(e,'merged-20');let tables=c.querySelectorAll('.note-lab table');assert.equal(tables[2].querySelectorAll('tbody tr').length,2);assert.doesNotMatch(tables[2].textContent,/91/);change(e,c,'mode','project');tables=c.querySelectorAll('.note-lab table');assert.equal(tables[2].querySelectorAll('tbody tr').length,2);change(e,c,'left','01,甲,A\n02,乙,A');tables=c.querySelectorAll('.note-lab table');assert.equal(tables[2].querySelectorAll('tbody tr').length,1);change(e,c,'mode','select');change(e,c,'filter','Z');assert.match(c.textContent,/结果为空关系/);e.dom.window.close();
});
test('SQL operations accumulate, preserve NULL semantics and never revive a dropped table',()=>{
 const e=env(10),m=e.w.NOTE_LABS.dataMath,db=m.initialDB();m.sqlExecute(db,'DELETE FROM students WHERE score < 60;');assert.deepEqual(Array.from(db.rows,r=>r.id),[1,3,4]);assert.equal(m.sqlExecute(db,'DELETE FROM students WHERE score < 60;').message,'DELETE删除了0行；表、字段和约束仍保留。');m.sqlExecute(db,'ALTER TABLE students ADD COLUMN remark TEXT;');m.sqlExecute(db,"INSERT INTO students (id,name,score) VALUES (5,'O''Brien',75);");assert.equal(db.rows.at(-1).name,"O'Brien");assert.equal(db.rows.at(-1).remark,null);m.sqlExecute(db,'UPDATE students SET score = 60 WHERE score IS NULL;');assert.equal(db.rows.find(r=>r.id===4).score,60);m.sqlExecute(db,'DELETE FROM students;');assert.equal(db.exists,true);assert.equal(db.columns.length,4);m.sqlExecute(db,'DROP TABLE students;');assert.equal(db.exists,false);assert.throws(()=>m.sqlExecute(db,'SELECT * FROM students;'),/已被DROP/);e.dom.window.close();
});
test('SQL invalid numeric precision and identifiers cannot silently change the table',()=>{
 const e=env(10),c=open(e,'y2024q36');for(const sql of ['UPDATE students SET score=9007199254740993;','UPDATE students SET score='+ '9'.repeat(400)+';','UPDATE students SET score=1.1234567;','ALTER TABLE students ADD COLUMN select TEXT;']){change(e,c,'sql',sql);click(c,'execute');assert.equal(c.querySelector('.note-lab table').querySelectorAll('tbody tr').length,4);assert.match(c.querySelector('.note-lab table').textContent,/88/);assert.match(c.querySelector('.lab-output').textContent,/不执行|不支持/);}change(e,c,'example','drop');click(c,'execute');assert.match(c.textContent,/表不存在/);click(c,'undo');assert.equal(c.querySelector('.note-lab table').querySelectorAll('tbody tr').length,4);e.dom.window.close();
});
test('bubble sorting computes one pass, both directions and stable equal values',()=>{
 const e=env(11),r=e.w.NOTE_LABS.registry.y2024q69,s=structuredClone(r.initial);r.action(s,'load');r.action(s,'pass');assert.deepEqual(Array.from(s.items,x=>x.value),[5,2,8,7,3,9]);assert.equal(s.comparisons,5);assert.equal(s.done,false);r.action(s,'all');assert.deepEqual(Array.from(s.items,x=>x.value),[2,3,5,7,8,9]);s.raw='3,1,3,-2';s.direction='desc';r.action(s,'load');r.action(s,'all');assert.deepEqual(Array.from(s.items,x=>x.value),[3,3,1,-2]);assert.deepEqual(Array.from(s.items.filter(x=>x.value===3),x=>x.origin),[1,3]);s.raw='1,2,3';s.direction='asc';r.action(s,'load');r.action(s,'all');assert.equal(s.pass,1);assert.equal(s.swaps,0);e.dom.window.close();
});
test('released cloud instance cannot resume billing through its resize action',()=>{
 const e=env(9),c=open(e,'y2026q39');c.querySelector('[data-sim-choice="4"]').click();assert.equal(c.querySelector('[data-instance-state]').textContent,'已释放');const resize=c.querySelector('[data-sim-choice="0"]');assert.equal(resize.disabled,true);resize.click();assert.equal(c.querySelector('[data-bill]').textContent,'¥0.00/h');c.querySelector('[data-sim-reset]').click();assert.equal(c.querySelector('[data-instance-state]').textContent,'运行中');assert.equal(c.querySelector('[data-sim-choice="0"]').disabled,false);e.dom.window.close();
});
