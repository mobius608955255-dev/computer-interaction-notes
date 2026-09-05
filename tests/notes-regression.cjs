/* Run: NODE_PATH=/path/to/jsdom/node_modules node --test tests/notes-regression.cjs */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const files=[2020,2022,2023,2024,2025,2026].map(y=>`notes-${y}-data.js`).concat(['notes-data.js','demos-data.js','simulations.js','note-labs.js']);
function env(chapter=4){
  const dom=new JSDOM(`<body data-chapter="${chapter}"></body>`,{url:'https://notes.example/chapter'+chapter+'.html',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;w.structuredClone=structuredClone;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
  for(const f of files)w.eval(fs.readFileSync(path.join(root,f),'utf8'));
  w.eval(fs.readFileSync(path.join(root,'notes-app.js'),'utf8'));
  return {dom,w,d:w.document};
}
function open(e,id){const c=e.d.getElementById(id);assert.ok(c,`note ${id}`);c.querySelector('.simulation-toggle').click();return c;}
function click(c,action,value){const s=`[data-lab-act="${action}"]${value!==undefined?`[data-value="${value}"]`:''}`;const b=c.querySelector(s);assert.ok(b,s);b.click();}
function change(e,c,name,value){const el=c.querySelector(`[data-field="${name}"]`);assert.ok(el,name);if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new e.w.Event('change',{bubbles:true}));}
test('400 unique sources; 2022 questions 1—75 exactly once; all 204 notes have simulations',()=>{
  const e=env();const notes=e.w.NOTES.notes;assert.equal(notes.length,204);assert.equal(e.w.NOTES.sourceCount,400);
  const keys=notes.flatMap(n=>n.sources.map(s=>`${s.year}-${s.q}`));assert.equal(new Set(keys).size,400);
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
