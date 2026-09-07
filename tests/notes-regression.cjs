/* Run: NODE_PATH=/path/to/jsdom/node_modules node --test tests/notes-regression.cjs */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const scriptsFor=chapter=>[...fs.readFileSync(path.join(root,`chapter${chapter}.html`),'utf8').matchAll(/<script src="\.\/([^"?]+)/g)].map(m=>m[1]);
const allNotes=()=>Array.from({length:11},(_,i)=>JSON.parse(fs.readFileSync(path.join(root,`content/chapter${i+1}.json`),'utf8'))).flat();
const releaseVersion=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8')).version;
test('v47 supplements and worked examples preserve the 460 original source identities',()=>{
 const notes=allNotes(),supplements=notes.filter(n=>n.origin==='syllabus');assert.equal(supplements.length,18);
 assert.deepEqual(supplements.filter(n=>n.chapter===2).map(n=>n.id),['syllabus-windows-paths','syllabus-windows-selection','syllabus-windows-search']);
 assert.ok(supplements.every(n=>n.sources.length===0));assert.equal(notes.flatMap(n=>n.workedExamples||[]).length,16);
 for(const n of notes)for(const example of n.workedExamples||[])assert.ok(n.sources.some(s=>s.year===example.year&&s.q===example.q));
});
function env(chapter=4,{url,oldReadingMode}={}){
  const dom=new JSDOM(`<body data-chapter="${chapter}"></body>`,{url:url||'https://notes.example/chapter'+chapter+'.html',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;Object.defineProperty(w.crypto,'subtle',{value:require('node:crypto').webcrypto.subtle});w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
  if(oldReadingMode)w.localStorage.setItem('notes-reading-mode',oldReadingMode);
  for(const f of scriptsFor(chapter))w.eval(fs.readFileSync(path.join(root,f),'utf8'));
  return {dom,w,d:w.document};
}
function open(e,id){const c=e.d.getElementById(id);assert.ok(c,`note ${id}`);c.querySelector('.simulation-toggle').click();return c;}
function click(c,action,value){const buttons=[...c.querySelectorAll(`[data-lab-act="${action}"]`)];const b=buttons.find(el=>value===undefined||el.dataset.value===String(value));assert.ok(b,`${action}: ${value??''}`);b.click();}
function change(e,c,name,value){const el=c.querySelector(`[data-field="${name}"]`);assert.ok(el,name);if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new e.w.Event('change',{bubbles:true}));}
function choice(c,name,value){const source=c.querySelector(`select[data-field="${name}"]`);assert.ok(source?.hidden,'native popup is removed');const i=[...source.options].findIndex(o=>o.value===value);return source.closest('.notes-picker').querySelector(`[data-choice-index="${i}"]`);}
function tap(e,button){button.dispatchEvent(new e.w.MouseEvent('pointerdown',{bubbles:true,button:0}));button.focus();button.dispatchEvent(new e.w.MouseEvent('pointerup',{bubbles:true,button:0}));button.click();}
function pointer(e,el,type,{id=1,x=20,y=20,primary=true,pointerType='touch',...rest}={}){
 const event=new e.w.MouseEvent(type,{bubbles:true,cancelable:true,button:0,clientX:x,clientY:y,...rest});
 Object.defineProperties(event,{pointerId:{value:id},pointerType:{value:pointerType},isPrimary:{value:primary}});el.dispatchEvent(event);
}
test('touch choices commit once while modifier keys toggle independently',()=>{
 const e=env(2),c=open(e,'y2020q24');let calls=0;const model=e.w.NOTE_LABS.registry.y2020q24,original=model.change;model.change=(...args)=>{calls++;return original(...args);};
 const key=k=>c.querySelector(`[data-lab-act="modifier"][data-value="${k}"]`);
 assert.equal(c.querySelectorAll('.notes-picker.is-inline').length,2);assert.deepEqual([...c.querySelectorAll('.core-modifier-keys button')].map(b=>b.textContent),['Ctrl','Shift','Alt']);
 tap(e,key('ctrl'));assert.equal(key('ctrl').getAttribute('aria-pressed'),'true');assert.equal(e.d.activeElement,key('ctrl'));
 tap(e,key('ctrl'));assert.equal(key('ctrl').getAttribute('aria-pressed'),'false');tap(e,key('ctrl'));
 click(c,'drop');assert.ok(c.querySelector('.lab-file'));assert.match(c.querySelector('[data-file-target]').textContent,/笔记.txt/);
 tap(e,choice(c,'drive','D'));assert.equal(calls,1);assert.doesNotMatch(c.querySelector('[data-file-target]').textContent,/笔记.txt/);
 tap(e,choice(c,'drive','D'));assert.equal(calls,1,'repeated single choice does not reset the model');
 tap(e,key('shift'));assert.equal(key('ctrl').getAttribute('aria-pressed'),'true');assert.equal(key('shift').getAttribute('aria-pressed'),'true');click(c,'drop');assert.match(c.querySelector('[data-file-target]').textContent,/快捷方式/);assert.ok(c.querySelector('.lab-file'));
 click(c,'restore');tap(e,key('ctrl'));click(c,'drop');assert.equal(c.querySelector('.lab-file'),null);
 c.querySelector('[data-sim-reset]').click();assert.equal(c.querySelector('select[data-field="drive"]').value,'C');for(const k of ['ctrl','shift','alt'])assert.equal(key(k).getAttribute('aria-pressed'),'false');
 tap(e,key('alt'));click(c,'drop');assert.match(c.querySelector('[data-file-target]').textContent,/快捷方式/);assert.ok(c.querySelector('.lab-file'));e.dom.window.close();
});
test('radio arrows survive rerenders and do not trigger demonstration hotkeys',()=>{
 const e=env(2),c=open(e,'y2020q24');choice(c,'mode','left').focus();
 for(const [key,value] of [['ArrowRight','right'],['ArrowRight','left'],['End','right'],['Home','left']]){e.d.activeElement.dispatchEvent(new e.w.KeyboardEvent('keydown',{bubbles:true,key}));assert.equal(c.querySelector('select[data-field="mode"]').value,value);assert.equal(e.d.activeElement,choice(c,'mode',value));}
 assert.equal(c.querySelector('[data-field="mode"]').closest('.notes-picker').querySelectorAll('[tabindex="0"]').length,1);e.dom.window.close();
});
test('long choices expand locally, cancel with Escape, and close on outside click',()=>{
 const e=env(1),c=open(e,'merged-3');tap(e,choice(c,'mode','size'));const source=c.querySelector('[data-field="unit"]'),box=source.closest('.notes-picker');
 assert.ok(box.classList.contains('is-collapsible'));box.querySelector('.choice-trigger').click();assert.equal(box.querySelector('.choice-options').hidden,false);
 e.d.activeElement.dispatchEvent(new e.w.KeyboardEvent('keydown',{bubbles:true,key:'ArrowDown'}));assert.equal(source.value,'MiB','navigation does not commit before selection');
 e.d.activeElement.dispatchEvent(new e.w.KeyboardEvent('keydown',{bubbles:true,key:'Escape'}));assert.equal(box.querySelector('.choice-options').hidden,true);assert.equal(e.d.activeElement,box.querySelector('.choice-trigger'));
 box.querySelector('.choice-trigger').click();e.d.querySelector('h1').click();assert.equal(box.querySelector('.choice-options').hidden,true);e.dom.window.close();
});
test('blurred input and following touch choice both reach the model',()=>{
 const e=env(1),c=open(e,'merged-3');tap(e,choice(c,'mode','size'));const input=c.querySelector('[data-field="amount"]');input.focus();input.value='2';input.dispatchEvent(new e.w.Event('input',{bubbles:true}));
 const trigger=c.querySelector('[data-field="unit"]').closest('.notes-picker').querySelector('.choice-trigger');trigger.dispatchEvent(new e.w.MouseEvent('pointerdown',{bubbles:true,button:0}));input.dispatchEvent(new e.w.Event('change',{bubbles:true}));trigger.focus();trigger.click();assert.ok(c.querySelector('.notes-picker.is-open'));
 tap(e,choice(c,'unit','KiB'));assert.match(c.querySelector('.lab-output').textContent,/2 KiB = 2,048 B/);e.dom.window.close();
});
test('native pointer focus transfer keeps the choice open until the option click',async()=>{
 const e=env(3),c=open(e,'syllabus-word-paragraph-spacing');click(c,'open');
 const box=c.querySelector('[data-field="kind"]').closest('.notes-picker');box.querySelector('.choice-trigger').click();
 const option=choice(c,'kind','exact'),focused=e.d.activeElement;
 // Model the browser's intermediate activeElement=body, with the incoming
 // option already identified by FocusEvent.relatedTarget.
 Object.defineProperty(e.d,'activeElement',{configurable:true,get:()=>e.d.body});
 focused.dispatchEvent(new e.w.FocusEvent('focusout',{bubbles:true,relatedTarget:option}));
 await Promise.resolve();
 assert.equal(box.querySelector('.choice-options').hidden,false);
 delete e.d.activeElement;
 option.focus();option.click();
 assert.equal(c.querySelector('[data-field="kind"]').value,'exact');
 assert.ok(c.querySelector('[data-field="amount"]'));e.dom.window.close();
});
test('legacy option updates, disabled groups, and list-box exceptions are preserved',async()=>{
 const e=env(4),host=e.d.createElement('div');host.innerHTML='<fieldset disabled><label>测试<select><option>A</option><option>B</option></select></label></fieldset><label>引用<select size="3"><option>A1:A5</option></select></label>';e.d.body.append(host);e.w.NOTE_CHOICES.enhance(host);
 assert.equal(host.querySelectorAll('.notes-picker').length,1);assert.ok(host.querySelector('.choice-option').disabled);assert.equal(host.querySelector('select[size]').hidden,false);
 host.querySelector('fieldset').disabled=false;e.w.NOTE_CHOICES.enhance(host);assert.equal(host.querySelector('.choice-option').disabled,false);
 const source=host.querySelector('select');source.innerHTML='<option>新条目</option><option selected>当前条目</option>';await new Promise(r=>e.w.setTimeout(r,0));assert.equal(host.querySelector('[aria-checked="true"]').textContent,'当前条目✓');e.dom.window.close();
});
test('one directory contains chapter links and grouped notes with a working focus boundary',()=>{
 const e=env(2),d=e.d,drawer=d.getElementById('drawer'),trigger=d.getElementById('open-drawer');
 assert.equal(d.querySelectorAll('.header-actions button').length,1);assert.equal(d.querySelector('#chapter-select'),null);
 trigger.click();assert.equal(trigger.getAttribute('aria-expanded'),'true');
 const menu=drawer.querySelector('.directory-chapters');assert.equal(menu.open,false);menu.querySelector('summary').click();assert.equal(menu.open,true);
 const links=[...menu.querySelectorAll('a')];assert.equal(links.length,11);assert.match(links[1].textContent,/Windows 10/);assert.equal(links[1].getAttribute('aria-current'),'page');
 assert.equal(new URL(links[3].href).pathname,'/chapter4.html');let prevented;
 d.addEventListener('click',event=>{if(event.target===links[3]){prevented=event.defaultPrevented;event.preventDefault();}});links[3].click();assert.equal(prevented,false,'chapter links retain normal browser navigation');
 menu.querySelector('summary').click();const last=drawer.querySelector('.directory-section:last-child .note-list li:last-child a');last.focus();last.dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));assert.equal(d.activeElement.id,'close-drawer');
 d.activeElement.dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true}));assert.equal(d.activeElement,last);
 last.click();assert.equal(trigger.getAttribute('aria-expanded'),'false');assert.equal(drawer.hidden,true);assert.equal(e.w.location.hash,last.hash);assert.equal(d.activeElement.id,last.hash.slice(1));assert.equal(last.getAttribute('aria-current'),'location');
 trigger.click();d.getElementById('scrim').click();assert.equal(d.activeElement,trigger);e.dom.window.close();
});
test('460 unique sources; all seven years mapped; canonical notes have valid sections',()=>{
  const e=env();const notes=allNotes();assert.equal(notes.filter(n=>n.origin!=='syllabus').length,220);assert.equal(e.w.NOTES.sourceCount,460);
  const keys=notes.flatMap(n=>n.sources.map(s=>`${s.year}-${s.q}`));assert.equal(new Set(keys).size,460);
  assert.deepEqual(Array.from(notes.flatMap(n=>n.sources).filter(s=>s.year===2022).map(s=>s.q).sort((a,b)=>a-b)),Array.from({length:75},(_,i)=>i+1));
  for(const n of notes)assert.ok(e.w.NOTES.chapters[n.chapter-1].sections.some(s=>s.id===n.section),n.id);
  e.dom.window.close();
});
test('all chapters mount, open, reset and collapse every card without exceptions',()=>{
  for(let chapter=1;chapter<=11;chapter++){
    const e=env(chapter),errors=[];e.w.addEventListener('error',x=>errors.push(x.error?.stack||x.message));
    assert.deepEqual(JSON.parse(JSON.stringify(e.w.NOTES.notes)),allNotes().filter(n=>n.chapter===chapter),'generated content matches canonical chapter');
    assert.equal(e.d.querySelectorAll('.directory-chapters a').length,11);
    assert.equal(e.d.querySelectorAll('[data-reading-mode],details.note-explanation').length,0);
    assert.equal(e.d.querySelectorAll('.directory-section .note-list a').length,e.w.NOTES.notes.length);
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
test('final labs in every chapter render after each initially exposed action',async()=>{
  const seen=new Set();
  for(let chapter=1;chapter<=11;chapter++){
    const e=env(chapter);
    for(const note of e.w.NOTES.notes){
      if(e.w.NOTE_SIMULATIONS.demos[note.id].kind!=='lab')continue;
      const card=open(e,note.id),id=card.querySelector('[data-lab]').dataset.lab;
      if(seen.has(id))continue;seen.add(id);
      const r=e.w.NOTE_LABS.registry[id],s={...structuredClone(r.initial),uid:'audit'},html=r.render(s);
      assert.ok(html.length>100,id);const isolated=new JSDOM(html);
      for(const el of isolated.window.document.querySelectorAll('[data-lab-act]')){
        if(el.disabled)continue;
        const x={...structuredClone(r.initial),uid:'audit'};await r.action(x,el.dataset.labAct,el.dataset.value);assert.ok(r.render(x).length>100,`${id}/${el.dataset.labAct}`);
      }
      isolated.window.close();
    }
    e.dom.window.close();
  }
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
test('each year is continuous and generated HTML assets exist',()=>{
 const notes=allNotes();for(const [year,count] of [[2020,65],[2021,60],[2022,75],[2023,70],[2024,70],[2025,60],[2026,60]])assert.deepEqual(notes.flatMap(n=>n.sources).filter(s=>s.year===year).map(s=>s.q).sort((a,b)=>a-b),Array.from({length:count},(_,i)=>i+1));
 for(let ch=1;ch<=11;ch++){const html=fs.readFileSync(path.join(root,`chapter${ch}.html`),'utf8');assert.equal(scriptsFor(ch).filter(f=>/^generated\/chapter\d+\.js$/.test(f)).length,1);assert.equal(scriptsFor(ch).filter(f=>f.startsWith('generated/labs-')).length,1);for(const match of html.matchAll(/(?:src|href)="\.\/([^"?]+)(?:\?[^"]*)?"/g))assert.ok(fs.existsSync(path.join(root,match[1])),match[1]);}
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
 const e=env(3),c=open(e,'merged-5');change(e,c,'tab','home');click(c,'style');change(e,c,'tab','references');click(c,'tocInsert');change(e,c,'title','计算机基础');click(c,'cover');change(e,c,'tab','references');click(c,'tocOpen');change(e,c,'tocMode','pages');click(c,'tocApply');assert.match(c.querySelector('.lab-auto-toc').textContent,/第一章 信息技术/);assert.match(c.querySelector('.lab-auto-toc').textContent,/2/);click(c,'tocOpen');change(e,c,'tocMode','all');click(c,'tocApply');assert.match(c.querySelector('.lab-auto-toc').textContent,/计算机基础/);e.dom.window.close();
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
 const e=env(),c=open(e,'y2026q51');change(e,c,'mode','auto');click(c,'auto');click(c,'clear');assert.match(c.querySelector('.note-lab thead').textContent,/性别 ▾/);click(c,'auto');click(c,'toggleAuto');assert.doesNotMatch(c.querySelector('.note-lab thead').textContent,/▾/);assert.match(c.querySelector('.note-lab tbody').textContent,/周林/);e.dom.window.close();
});
test('CSV reimport cancel restores previously imported rows and options',()=>{
 const e=env(),c=open(e,'y2021q47');click(c,'start');click(c,'next');click(c,'next');click(c,'finish');const previous=c.querySelector('table').textContent;click(c,'start');click(c,'next');change(e,c,'delimiter','tab');click(c,'cancel');assert.equal(c.querySelector('table').textContent,previous);e.dom.window.close();
});
test('Combination chart cancel preserves applied axis configuration',()=>{
 const e=env(),c=open(e,'y2026q52');click(c,'ab');c.querySelector('[data-lab-act="d"]').dispatchEvent(new e.w.MouseEvent('click',{bubbles:true,ctrlKey:true}));click(c,'insert');click(c,'combo');change(e,c,'secondary',true);click(c,'apply');click(c,'combo');change(e,c,'secondary',false);click(c,'cancel');assert.match(c.querySelector('svg').textContent,/成功率%/);e.dom.window.close();
});
test('Word and Excel show their canonical comparison tables, external reset controls, and keep keyboard focus',()=>{
 let count=0;for(const ch of [3,4]){const e=env(ch);count+=e.d.querySelectorAll('.note-comparison').length;assert.equal(e.d.querySelectorAll('.simulation-footer').length,0);const c=open(e,ch===3?'merged-7':'merged-10');assert.equal(c.querySelector('[data-sim-reset]').closest('.lab-office'),null);const control=c.querySelector('[data-field]');control.focus();control.dispatchEvent(new e.w.Event('change',{bubbles:true}));assert.equal(e.d.activeElement.closest('.notes-picker')?.querySelector('select').dataset.field||e.d.activeElement.dataset.field,control.dataset.field);e.dom.window.close();}assert.equal(count,allNotes().filter(n=>[3,4].includes(n.chapter)&&n.comparison).length);
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
 change(e,c,'drive','D');drag();assert.ok(c.querySelector('[data-lab-drag="file"]'));assert.equal(c.querySelectorAll('[data-file-result]').length,1);change(e,c,'drive','C');drag({ctrlKey:true});assert.ok(c.querySelector('[data-lab-drag="file"]'));change(e,c,'drive','D');drag({shiftKey:true});assert.equal(c.querySelector('[data-lab-drag="file"]'),null);
 for(const mods of [{ctrlKey:true,shiftKey:true},{altKey:true}]){change(e,c,'drive','C');drag(mods);assert.ok(c.querySelector('.lab-file'));assert.match(c.querySelector('[data-file-target]').textContent,/快捷方式/);}
 change(e,c,'drive','C');change(e,c,'mode','right');click(c,'modifier','ctrl');drag();assert.ok(c.querySelector('.lab-context-menu'));assert.equal(c.querySelectorAll('[data-file-result]').length,0);click(c,'cancel');assert.ok(c.querySelector('.lab-file'));e.dom.window.close();
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
 const rows=[...c.querySelectorAll('[data-lab-drop]')];rows.forEach((el,i)=>el.getBoundingClientRect=()=>({left:100,right:400,top:100+i*100,bottom:200+i*100}));const h=c.querySelector('[data-key="2"]');const p=(type,x,y)=>h.dispatchEvent(new e.w.MouseEvent(type,{bubbles:true,button:0,clientX:x,clientY:y}));p('pointerdown',180,250);p('pointermove',180,150);p('pointerup',180,150);c.querySelector('[data-lab-act="send"]').dispatchEvent(new e.w.MouseEvent('pointerdown',{bubbles:true,button:0}));click(c,'send');assert.match(c.querySelector('.lab-output').textContent,/10.20.8.16.*已阻止.*第1条/);e.dom.window.close();
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

test('search matches separated normalized terms without indexing changing demo output',()=>{
 const e=env(3),s=e.d.querySelector('#search-input');
 const search=q=>{s.value=q;s.dispatchEvent(new e.w.Event('input',{bubbles:true}));return [...e.d.querySelectorAll('.note-item:not(.hidden)')].map(x=>x.id);};
 const a=search('word'),b=search('ＷＯＲＤ');assert.ok(a.length);assert.deepEqual(b,a);
 const c=open(e,'y2026q47');const token='演示临时输入不属于笔记';const p=e.d.createElement('p');p.textContent=token;c.querySelector('.simulation-body').append(p);
 assert.deepEqual(search(token),[]);
 const note=e.w.NOTES.notes.find(n=>n.id==='y2026q47');const key=note.title.slice(0,4);assert.ok(search(key+'  '+note.conclusion.slice(0,4)).includes(note.id));
 assert.ok(search('邮件 合并').length);e.dom.window.close();
});
test('empty search explains recovery and restores every note with focus on search',()=>{
 const e=env(6),s=e.d.querySelector('#search-input');s.value='找不到的知识点xyz';s.dispatchEvent(new e.w.Event('input',{bubbles:true}));
 assert.equal(e.d.querySelector('#search-empty').hidden,false);assert.equal(e.d.querySelector('#clear-search').hidden,false);assert.equal(e.d.querySelector('#result-count').textContent,`0 / ${e.w.NOTES.notes.length}条`);
 e.d.querySelector('#restore-notes').click();assert.equal(e.d.querySelectorAll('.note-item:not(.hidden)').length,e.w.NOTES.notes.length);assert.equal(e.d.querySelector('#search-empty').hidden,true);assert.equal(e.d.querySelector('#clear-search').hidden,true);assert.equal(e.d.activeElement,s);
 s.value='IPv6';s.dispatchEvent(new e.w.Event('input',{bubbles:true}));e.d.querySelector('#clear-search').click();assert.equal(s.value,'');assert.equal(e.d.querySelectorAll('.note-item.hidden').length,0);e.dom.window.close();
});
test('directory isolates background and transfers focus to the selected hidden note',()=>{
 const e=env(3),s=e.d.querySelector('#search-input');s.value='找不到的知识点xyz';s.dispatchEvent(new e.w.Event('input',{bubbles:true}));e.d.querySelector('#open-drawer').click();
 assert.equal(e.d.querySelector('#main-content').inert,true);assert.equal(e.d.querySelector('.site-header').inert,true);
 e.d.querySelector('#drawer a[href="#y2026q47"]').click();assert.equal(e.w.location.hash,'#y2026q47');assert.equal(e.d.activeElement.id,'y2026q47');assert.equal(e.d.querySelector('#main-content').inert,false);assert.equal(e.d.querySelector('#search-empty').hidden,true);
 e.d.querySelector('#open-drawer').click();e.d.dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(e.d.activeElement.id,'open-drawer');assert.equal(e.d.querySelector('.site-header').inert,false);e.dom.window.close();
});

test('foreign pointers cannot replace or finish the active file drag',()=>{
 const e=env(2),c=open(e,'y2020q24'),file=c.querySelector('.lab-file'),lab=c.querySelector('[data-lab]');
 c.querySelector('[data-file-target]').getBoundingClientRect=()=>({left:150,right:290,top:80,bottom:240});
 pointer(e,file,'pointerdown',{x:20,y:50});pointer(e,file,'pointermove',{x:200,y:140});
 pointer(e,file,'pointerdown',{id:2,primary:false,x:200,y:140});pointer(e,lab,'pointerup',{id:2,primary:false,x:200,y:140});
 assert.ok(c.querySelector('.lab-file'));assert.equal(c.querySelectorAll('[data-file-result]').length,0);
 pointer(e,file,'pointerup',{x:200,y:140});assert.equal(c.querySelector('.lab-file'),null);assert.equal(c.querySelectorAll('[data-file-result]').length,1);e.dom.window.close();
});
test('lost capture cancels a file drag without committing its preview',()=>{
 const e=env(2),c=open(e,'y2020q24'),file=c.querySelector('.lab-file');
 c.querySelector('[data-file-target]').getBoundingClientRect=()=>({left:150,right:290,top:80,bottom:240});
 pointer(e,file,'pointerdown');pointer(e,file,'pointermove',{x:200,y:140});pointer(e,file,'lostpointercapture',{x:200,y:140});
 assert.ok(c.querySelector('.lab-file'));assert.equal(c.querySelector('.lab-file').style.transform,'');assert.equal(c.querySelectorAll('[data-file-result]').length,0);e.dom.window.close();
});
test('reset and collapse cancel a pending long-press action',async()=>{
 const e=env(2),c=open(e,'y2020q24'),model=e.w.NOTE_LABS.registry.y2020q24,original=model.action;let menus=0;
 model.action=(...args)=>{if(args[1]==='menu')menus++;return original(...args);};
 pointer(e,c.querySelector('.lab-file'),'pointerdown');c.querySelector('[data-sim-reset]').click();
 await new Promise(resolve=>setTimeout(resolve,650));assert.equal(menus,0);
 pointer(e,c.querySelector('.lab-file'),'pointerdown');c.querySelector('.simulation-toggle').click();
 await new Promise(resolve=>setTimeout(resolve,650));assert.equal(menus,0);e.dom.window.close();
});
test('typing, copying and pasting preserve literal entities and markup',()=>{
 const e=env(2),c=open(e,'y2025q33'),raw='AT&amp;T &lt;标题&gt; <b>原样</b>',source=c.querySelector('[data-field="sourceText"]');
 source.value=raw;source.dispatchEvent(new e.w.Event('input',{bubbles:true}));click(c,'copy');
 assert.equal(c.querySelector('[data-field="sourceText"]').value,raw);assert.equal(c.querySelector('[data-clipboard]').textContent,'文本：'+raw);
 click(c,'paste');click(c,'paste');assert.equal(c.querySelector('[data-field="targetText"]').value,raw+raw);e.dom.window.close();
});
test('generated entrypoints keep the release version, required styles and source data',()=>{
 for(let ch=1;ch<=11;ch++){
  const e=env(ch),html=fs.readFileSync(path.join(root,`chapter${ch}.html`),'utf8');
  assert.equal(e.w.NOTES.version,releaseVersion);
  if(ch>=6)assert.match(html,/notes-extended\.css/);
  for(const link of e.d.querySelectorAll('a[href*=".html?v="]'))assert.ok(link.href.includes('?v='+releaseVersion),link.href);
  assert.equal(new Set(scriptsFor(ch)).size,scriptsFor(ch).length);
  assert.equal(e.w.NOTES.notes.every(n=>n.chapter===ch),true);e.dom.window.close();
 }
});
test('quantity discount changes at 20 and keeps absolute lookup behavior',()=>{
 const e=env(4),c=open(e,'y2020q57');change(e,c,'task','discount');click(c,'fill');
 const value=i=>c.querySelector(`[data-fill-index="${i}"]`).textContent;
 assert.match(value(0),/1,628/);change(e,c,'quantity0',20);assert.match(value(0),/1,546.6/);change(e,c,'quantity0',21);assert.match(value(0),/1,546.6/);
 change(e,c,'locked','false');assert.match(value(2),/#N\/A/);e.dom.window.close();
});
test('cross-sheet conditional formatting follows identifiers through reordering and missing keys',()=>{
 const e=env(4),c=open(e,'y2025q52');const highlighted=()=>[...c.querySelectorAll('.lab-row-emphasis')].map(el=>el.closest('tr').querySelector('[data-field^="id"]').value);
 assert.deepEqual(highlighted(),['A01']);click(c,'reorder');assert.deepEqual(highlighted(),['A01']);change(e,c,'id1','A01');change(e,c,'value1',100);assert.deepEqual(highlighted(),['A01','A01']);
 change(e,c,'id0','missing');assert.match(c.textContent,/#N\/A/);assert.deepEqual(highlighted(),['A01']);e.dom.window.close();
});
test('duplicate text identifiers highlight every occurrence and retain leading zeroes',()=>{
 const e=env(4),c=open(e,'y2020q52');change(e,c,'rule','duplicate');assert.equal(c.querySelectorAll('.lab-highlight').length,2);
 change(e,c,'id2','A03');assert.equal(c.querySelectorAll('.lab-highlight').length,0);change(e,c,'id0','000000000000000018');change(e,c,'id1','000000000000000018');assert.equal(c.querySelectorAll('.lab-highlight').length,2);assert.equal(c.querySelector('[data-field="id0"]').value,'000000000000000018');e.dom.window.close();
});
test('numeric formatting is distinct from arithmetic conversion and whitespace remains text',()=>{
 const e=env(4),c=open(e,'y2026q49');change(e,c,'method','format');click(c,'convert');assert.match(c.querySelector('.lab-office output').textContent,/结果：25/);
 change(e,c,'method','multiply');click(c,'convert');assert.match(c.querySelector('.lab-office output').textContent,/结果：21.5/);
 change(e,c,'method','format');click(c,'convert');assert.doesNotMatch(c.textContent,/原存储类型仍是文本/);
 change(e,c,'amount0','   ');change(e,c,'method','value');click(c,'convert');assert.match(c.querySelector('tbody tr').textContent,/文本/);assert.match(c.querySelector('tbody tr').textContent,/#VALUE!/);e.dom.window.close();
});
test('Word fullwidth conversion and character colors remain independent of paragraph alignment',()=>{
 const e=env(3),c=open(e,'merged-7');change(e,c,'color','#c03535');change(e,c,'highlight','#fff29a');click(c,'width','half');assert.match(c.querySelector('.lab-paper').textContent,/2026/);
 click(c,'select','1');change(e,c,'alignment','distribute');assert.match(c.querySelectorAll('.lab-paper p')[1].style.cssText,/text-align-last: justify/);
 change(e,c,'alignment','justify');assert.equal(c.querySelectorAll('.lab-paper p')[1].style.textAlignLast,'auto');
 click(c,'select','0');assert.equal(c.querySelector('[data-field="color"]').value,'#c03535');assert.equal(c.querySelector('[data-field="highlight"]').value,'#fff29a');e.dom.window.close();
});
test('outline moves each same-level title with its body and updates TOC by stable identity',()=>{
 const e=env(3),c=open(e,'merged-5');change(e,c,'tab','home');click(c,'style');click(c,'select','1');click(c,'style');change(e,c,'tab','references');click(c,'tocInsert');change(e,c,'tab','view');click(c,'view','outline');click(c,'move','up');
 const body=c.querySelector('.lab-workspace').textContent;assert.ok(body.lastIndexOf('操作系统管理硬件和软件资源。')<body.lastIndexOf('数据是信息的符号化表示。'));
 change(e,c,'tab','references');click(c,'tocOpen');change(e,c,'tocMode','pages');click(c,'tocApply');assert.equal(c.querySelector('.lab-auto-toc p b').textContent,'2');e.dom.window.close();
});
test('image dimensions use height 8.5 by width 6 and cropping preserves the target ratio',()=>{
 const e=env(3),c=open(e,'merged-9');change(e,c,'height',6);assert.ok(Math.abs(Number(c.querySelector('[data-field="width"]').value)-6*6/8.5)<1e-8);
 change(e,c,'width',5);assert.ok(Math.abs(Number(c.querySelector('[data-field="height"]').value)-5*8.5/6)<1e-8);
 change(e,c,'mode','crop');assert.equal(c.querySelector('svg').getAttribute('viewBox'),'0 65 600 720');assert.equal(c.querySelector('[data-field="height"]').value,'6');e.dom.window.close();
});
test('equation structures survive save, delete and reinsert; header border commits or cancels',()=>{
 const e=env(3),c=open(e,'y2023q7');click(c,'insert');change(e,c,'numerator','x+2');assert.match(c.querySelector('mfrac').textContent,/x\+2/);click(c,'save');click(c,'delete');assert.equal(c.querySelector('math'),null);click(c,'restore');assert.match(c.querySelector('math').textContent,/x\+2/);
 const h=open(e,'y2024q54');click(h,'edit');click(h,'menu');change(e,h,'width',3);change(e,h,'color','#c03535');click(h,'apply');assert.match(h.querySelector('.lab-page-header').style.borderBottom,/3pt/);click(h,'menu');change(e,h,'width',.5);click(h,'close');assert.match(h.querySelector('.lab-page-header').style.borderBottom,/3pt/);e.dom.window.close();
});
test('chart category and series animation groups reveal different sets of bars',()=>{
 const e=env(5),c=open(e,'merged-12');const visible=()=>c.querySelectorAll('g[opacity="1"]').length;
 click(c,'start');assert.equal(visible(),4);click(c,'next');assert.equal(visible(),8);change(e,c,'mode','series');click(c,'start');assert.equal(visible(),3);click(c,'next');assert.equal(visible(),6);e.dom.window.close();
});
test('background edits, apply-all and reset affect their intended pages',()=>{
 const e=env(5),c=open(e,'y2020q54');change(e,c,'source','stationery');change(e,c,'transparency',38);change(e,c,'x',12);assert.equal(c.querySelector('[data-background-layer]').style.opacity,'0.62');click(c,'all');click(c,'page','1');assert.equal(c.querySelector('[data-field="x"]').value,'12');click(c,'reset');assert.equal(c.querySelector('[data-field="source"]').value,'none');click(c,'page','0');assert.equal(c.querySelector('[data-field="source"]').value,'stationery');e.dom.window.close();
});
test('section selection is separate from collapse and applies transitions to the selected scope',()=>{
 const e=env(5),c=open(e,'y2025q10');click(c,'section','0');assert.ok(c.querySelector('[data-lab-act="page"][data-value="1"]'));change(e,c,'tab','transition');change(e,c,'transition','fade');assert.match(c.querySelector('[data-lab-act="page"][data-value="1"]').textContent,/淡化/);assert.match(c.querySelector('[data-lab-act="page"][data-value="2"]').textContent,/无/);
 click(c,'collapseSection','0');assert.equal(c.querySelector('[data-lab-act="page"][data-value="1"]'),null);click(c,'transitionAll');assert.match(c.querySelector('[data-lab-act="page"][data-value="2"]').textContent,/淡化/);e.dom.window.close();
});
test('animation reorder preserves object durations and mouseover obeys action settings',()=>{
 const e=env(5),m=e.w.NOTE_LABS.registry['merged-11'],s=structuredClone(m.initial);s.firstDuration=2;s.secondDuration=1;m.action(s,'animUp');assert.deepEqual(Array.from(s.order),['shape','title']);assert.equal(s.firstDuration,2);
 s.show=true;s.current=1;s.phase='slide';s.phaseStart=e.w.Date.now();s.actionTrigger='hover';s.actionTarget=0;
 m.action(s,'jump');assert.equal(s.current,1);m.action(s,'hoverJump');assert.equal(s.current,0);e.dom.window.close();
});
test('multiple pivot values remain side by side and recompute with a class filter',()=>{
 const e=env(4),c=open(e,'y2024q67');change(e,c,'scenario','grades');for(const field of ['成绩','数学','外语','总分']){click(c,'pick',field);click(c,'place','value');}
 assert.equal(c.querySelectorAll('[data-lab-drop="value"] button').length,4);assert.match(c.querySelector('.lab-pivot-layout').textContent,/337/);click(c,'pick','班级');click(c,'place','filter');change(e,c,'filter','一班');assert.match(c.querySelector('.lab-pivot-layout').textContent,/261/);change(e,c,'filterLabel','班级选择');assert.match(c.querySelector('[data-field="filter"]').closest('label').textContent,/班级选择/);e.dom.window.close();
});
test('salary pie excludes detail rows and detects an included grand total',()=>{
 const e=env(4),c=open(e,'y2020q58');change(e,c,'scenario','wages');click(c,'wageSort');click(c,'wageOpen');click(c,'wageApply');click(c,'wageLevel','2');click(c,'wageSelect','summary');click(c,'wageChart');assert.match(c.querySelector('figcaption').textContent,/6,000/);assert.doesNotMatch(c.querySelector('figcaption').textContent,/总计/);
 click(c,'wageSelect','whole');click(c,'wageChart');assert.match(c.querySelector('figcaption').textContent,/总计/);assert.match(c.querySelector('.lab-output').textContent,/不符合/);e.dom.window.close();
});
test('Boolean parentheses and ordered proximity change the retrieved records',()=>{
 const e=env(6),c=open(e,'y2026q28');change(e,c,'mode','boolean');assert.equal(c.querySelectorAll('[data-lab] tbody tr')[0].lastElementChild.textContent,'✓ 检出');change(e,c,'expression','parentheses');assert.equal(c.querySelectorAll('[data-lab] tbody tr')[0].lastElementChild.textContent,'未检出');change(e,c,'mode','near');assert.equal(c.querySelectorAll('[data-lab] tbody tr')[1].lastElementChild.textContent,'✓ 匹配');change(e,c,'ordered','true');assert.equal(c.querySelectorAll('[data-lab] tbody tr')[1].lastElementChild.textContent,'不匹配');e.dom.window.close();
});

test('collapsing a drag preview restores committed column width on reopening',()=>{
 const e=env(4),c=open(e,'y2020q7'),handle=c.querySelector('[data-lab-drag="column"]');
 pointer(e,handle,'pointerdown',{x:100,y:100});pointer(e,handle,'pointermove',{x:220,y:100});
 c.querySelector('.simulation-toggle').click();c.querySelector('.simulation-toggle').click();
 assert.equal(c.querySelector('[data-width-readout]').textContent,'130 px');e.dom.window.close();
});

test('editing a horizontally scrolled table keeps its position and focused input',()=>{
 const e=env(4),c=open(e,'y2020q57');change(e,c,'task','discount');const scroller=c.querySelector('.lab-table-scroll');scroller.scrollLeft=115;
 const input=c.querySelector('[data-field="quantity0"]');input.focus();change(e,c,'quantity0',20);
 assert.equal(c.querySelector('.lab-table-scroll').scrollLeft,115);assert.equal(e.d.activeElement.dataset.field,'quantity0');assert.equal(e.d.activeElement.value,'20');e.dom.window.close();
});
test('a transfer completed during a plain button press paints after an outside release or cancel',async()=>{
 for(const type of ['pointerup','pointercancel']){
  const e=env(6),timers=[];let now=10000;e.w.Date.now=()=>now;e.w.setInterval=fn=>{timers.push(fn);return 1;};e.w.clearInterval=()=>{};
  const c=open(e,'y2020q26');click(c,'start');now+=500;timers.forEach(fn=>fn());const before=c.querySelector('.lab-output').textContent;
  pointer(e,c.querySelector('[data-lab-act="reset"]'),'pointerdown',{id:37});now+=5000;timers.forEach(fn=>fn());assert.equal(c.querySelector('.lab-output').textContent,before,'no redraw removes the pressed button');
  pointer(e,e.d.body,type,{id:37});await new Promise(r=>setTimeout(r,10));assert.match(c.querySelector('.lab-output').textContent,/文件已到达/);assert.equal(c.querySelector('[data-lab-act="start"]').disabled,false);e.dom.window.close();
 }
});
test('idle drawing surfaces allow ordinary scrolling; only active tools claim a gesture',()=>{
 const e=env(5),box=open(e,'y2021q10'),ink=open(e,'y2025q10');
 for(const [c,selector] of [[box,'.lab-draw-slide'],[ink,'.lab-ink-slide']]){
  const canvas=c.querySelector(selector);let captured=false;canvas.setPointerCapture=()=>{captured=true;};pointer(e,canvas,'pointerdown');const event=new e.w.MouseEvent('pointermove',{bubbles:true,cancelable:true,clientY:150});Object.defineProperty(event,'pointerId',{value:1});canvas.dispatchEvent(event);pointer(e,canvas,'pointerup');assert.equal(captured,false);assert.equal(event.defaultPrevented,false);
 }
 click(box,'tool');assert.ok(box.querySelector('[data-lab-drag="box"]'));click(box,'tool');assert.equal(box.querySelector('[data-lab-drag="box"]'),null);
 click(ink,'show');assert.equal(ink.querySelector('[data-lab-drag="ink"]'),null);click(ink,'pen');assert.ok(ink.querySelector('[data-lab-drag="ink"]'));click(ink,'black');assert.equal(ink.querySelector('[data-lab-drag="ink"]'),null);e.dom.window.close();
});
test('unique filtering preserves all source records and its copied list survives clearing',()=>{
 const e=env(4),c=open(e,'y2020q49');change(e,c,'scenario','unique');const rows=()=>c.querySelectorAll('table')[0].querySelectorAll('tbody tr').length;
 assert.equal(rows(),5);click(c,'uniqueOpen');click(c,'uniqueApply');assert.equal(rows(),3);click(c,'uniqueClear');assert.equal(rows(),5);
 click(c,'uniqueOpen');change(e,c,'destination','copy');click(c,'uniqueApply');assert.equal(rows(),5);assert.equal(c.querySelectorAll('table')[1].querySelectorAll('tbody tr').length,3);click(c,'uniqueClear');assert.equal(c.querySelectorAll('table').length,2);
 change(e,c,'scenario','delete');click(c,'select');click(c,'open');click(c,'apply');assert.equal(rows(),2);click(c,'undo');assert.equal(rows(),3);e.dom.window.close();
});
test('scholarship eligibility intersects the copied top-quarter set with all five thresholds',()=>{
 const e=env(4),c=open(e,'y2020q9');change(e,c,'scenario','scholarship');const tables=()=>[...c.querySelectorAll('table')].map(t=>[...t.querySelectorAll('tbody tr')].map(r=>r.textContent));
 assert.equal(tables()[0].length,8);click(c,'rankOpen');click(c,'rankCancel');assert.equal(tables()[0].length,8);click(c,'rankOpen');click(c,'rankApply');assert.equal(tables()[0].length,2);
 click(c,'rankCopy');click(c,'subjectsOpen');click(c,'subjectsApply');assert.equal(tables()[1].length,1);assert.match(tables()[1][0],/王宁/);assert.doesNotMatch(tables()[1][0],/李明|赵敏/);
 click(c,'rankClear');assert.equal(tables()[0].length,8);assert.equal(tables()[1].length,1);click(c,'subjectsClear');assert.equal(tables()[1].length,2);e.dom.window.close();
});
test('class-text subtotals count records rather than distinct class names',()=>{
 const e=env(4),c=open(e,'y2020q58');click(c,'sort');click(c,'open');change(e,c,'aggregate','count');change(e,c,'class',true);for(const key of ['math','english','computer'])change(e,c,key,false);click(c,'apply');click(c,'level','2');
 const text=c.querySelector('table').textContent;assert.match(text,/一班 小计 · 班级计数 2/);assert.match(text,/二班 小计 · 班级计数 2/);assert.match(text,/总计 · 班级计数 4/);e.dom.window.close();
});
test('chart title, axis titles and legend position are separate visible elements',()=>{
 const e=env(4),c=open(e,'y2026q52');click(c,'ab');change(e,c,'ctrl',true);click(c,'d');click(c,'insert');click(c,'elements');change(e,c,'title','航天发射统计');change(e,c,'axes',true);change(e,c,'legend','right');
 assert.equal(c.querySelector('[data-chart-title]').textContent,'航天发射统计');assert.equal(c.querySelector('[data-axis-title="horizontal"]').textContent,'年份');assert.equal(c.querySelector('[data-axis-title="vertical"]').textContent,'发射次数');assert.ok(c.querySelector('[data-chart-legend="right"] .study-chart-legend'));
 change(e,c,'showTitle',false);assert.equal(c.querySelector('[data-chart-title]'),null);assert.equal(c.querySelectorAll('[data-axis-title]').length,2);e.dom.window.close();
});
test('text autofit menu keeps shape growth in the shape-format entry',()=>{
 const e=env(5),c=open(e,'y2026q54');click(c,'menu');assert.equal(c.querySelector('[aria-label="占位符自动调整选项"] [data-lab-act="shape"]'),null);click(c,'shrink');assert.equal(c.querySelector('.lab-placeholder p').style.fontSize,'16px');assert.equal(c.querySelector('.lab-placeholder.grow'),null);
 click(c,'format');click(c,'shape');assert.equal(c.querySelector('.lab-placeholder p').style.fontSize,'24px');assert.ok(c.querySelector('.lab-placeholder.grow'));e.dom.window.close();
});
test('draft hides document images; Web layout restores them and remains editable',()=>{
 const e=env(3),c=open(e,'merged-5');assert.equal(c.querySelectorAll('[data-document-image]').length,2);click(c,'view','draft');assert.equal(c.querySelectorAll('[data-document-image]').length,0);click(c,'view','web');assert.equal(c.querySelectorAll('[data-document-image]').length,2);change(e,c,'title','网页中编辑');assert.match(c.querySelector('.lab-workspace').textContent,/网页中编辑/);click(c,'view','print');assert.match(c.querySelector('.lab-workspace').textContent,/网页中编辑/);e.dom.window.close();
});
test('colloquial aliases retrieve the intended concept without reading mutable learner input',()=>{
 for(const [chapter,query,id] of [[3,'目录不显示标题','merged-5'],[4,'去重','y2020q49'],[5,'文字放不下','y2026q54']]){
  const e=env(chapter),input=e.d.querySelector('#search-input');input.value=query;input.dispatchEvent(new e.w.Event('input',{bubbles:true}));assert.equal(e.d.getElementById(id).classList.contains('hidden'),false);e.dom.window.close();
 }
});


test('full-site search normalizes aliases and resolves every note paragraph and related link',()=>{
 const index=JSON.parse(fs.readFileSync(path.join(root,'generated/search-index.json'),'utf8')), notes=allNotes(),byId=new Map(notes.map(n=>[n.id,n]));
 assert.equal(index.filter(x=>x.kind==='note').length,notes.length);
 for(let chapter=1;chapter<=11;chapter++){
  const e=env(chapter);
  for(const entry of index.filter(x=>x.chapter===chapter))for(const field of entry.fields)assert.ok(e.d.getElementById(field.anchor),field.anchor);
  for(const n of notes.filter(x=>x.chapter===chapter)){
   const article=e.d.getElementById(n.id);
   assert.equal(article.querySelectorAll('.points li').length,n.points.length);
   for(const [i,p] of n.points.entries()){const expected=e.d.createElement('div');expected.innerHTML=p;assert.equal(e.d.getElementById(`${n.id}--point-${i}`).textContent,expected.textContent);}
   for(const link of article.querySelectorAll('.note-related ul a')){const url=new URL(link.href);assert.ok(byId.has(url.hash.slice(1)));assert.equal(url.pathname,`/chapter${byId.get(url.hash.slice(1)).chapter}.html`);}
  }
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/labs/manifest.json'),'utf8'));assert.equal(Object.keys(e.w.NOTE_LABS.registry).length,manifest.chapters[chapter].models,'no unrelated chapter registrations');
  if(chapter===4){e.w.eval(fs.readFileSync(path.join(root,'notes-search.js'),'utf8'));const find=q=>e.w.NOTE_SEARCH.search(index,q);assert.ok(find('ＶＬＯＯＫＵＰ FALSE').some(r=>r.id==='y2020q57'));assert.ok(find('黑屏').some(r=>r.chapter===5));assert.ok(find('Ctrl Shift').some(r=>r.id==='y2020q24'));assert.equal(find('不存在的组合词 abcxyz').length,0);assert.ok(find('Delete').some(r=>r.kind==='comparison'));}
  e.dom.window.close();
 }
});
test('full prose ignores the removed preference and paragraph jumps preserve the live demonstration',()=>{
 const e=env(2,{oldReadingMode:'quick'}),c=open(e,'y2020q24');click(c,'modifier','ctrl');const lab=c.querySelector('[data-lab]');
 assert.equal(e.d.querySelectorAll('[data-reading-mode],details.note-explanation').length,0);assert.equal(e.w.localStorage.getItem('notes-reading-mode'),null);
 const target=e.d.getElementById('y2020q24--point-1');assert.equal(target.closest('details'),null);
 e.w.location.hash='#'+target.id;e.w.dispatchEvent(new e.w.HashChangeEvent('hashchange'));assert.equal(target.classList.contains('note-search-target'),true);
 assert.equal(c.querySelector('[data-lab]'),lab);assert.equal(c.querySelector('[data-lab-act="modifier"][data-value="ctrl"]').getAttribute('aria-pressed'),'true');e.dom.window.close();
});
test('PPT rename fixes its target and leaving slideshow synchronizes page, section and transition',()=>{
 const e=env(5),c=open(e,'y2025q10');click(c,'rename');const name=c.querySelector('[data-field="name"]');name.value='改名后的第一节';name.dispatchEvent(new e.w.Event('input',{bubbles:true}));
 assert.equal(c.querySelector('[data-lab-act="section"][data-value="1"]').disabled,true);assert.equal(c.querySelector('[data-lab-act="new"]').disabled,true);click(c,'section','1');click(c,'apply');assert.match(c.querySelector('[data-lab-act="section"][data-value="0"]').textContent,/改名后的第一节/);assert.match(c.querySelector('[data-lab-act="section"][data-value="1"]').textContent,/第二部分/);
 click(c,'show');click(c,'next');click(c,'next');click(c,'end');click(c,'rename');assert.equal(c.querySelector('[data-field="name"]').value,'第二部分');change(e,c,'name','不应保存');click(c,'cancel');assert.match(c.querySelector('[data-lab-act="section"][data-value="1"]').textContent,/第二部分/);
 const m=e.w.NOTE_LABS.registry.y2025q10,s=structuredClone(m.initial);m.action(s,'rename');m.action(s,'section','1');m.action(s,'new');m.action(s,'show');assert.equal(s.selected,0);assert.equal(s.sections.length,2);assert.equal(s.show,false);m.action(s,'cancel');s.transitions=['none','fade','push'];m.action(s,'show');m.action(s,'next');m.action(s,'next');m.action(s,'end');assert.equal(s.selected,1);assert.equal(s.transition,'push');assert.equal(s.selection,'page');e.dom.window.close();
});
test('advanced-filter copies survive mode switches, clearing, and source filtering',()=>{
 const e=env(4),c=open(e,'y2020q9');click(c,'open');change(e,c,'destination','copy');click(c,'apply');const m=e.w.NOTE_LABS.registry.y2020q9,s=structuredClone(m.initial);s.destination='copy';m.action(s,'apply');const copy=JSON.stringify(s.copy);m.change(s,'mode','auto');m.action(s,'auto');m.action(s,'clear');m.change(s,'mode','advanced');assert.equal(JSON.stringify(s.copy),copy);
 change(e,c,'mode','auto');click(c,'auto');click(c,'clear');change(e,c,'mode','advanced');assert.match(c.querySelector('.lab-output').textContent,/副本/);assert.ok(c.querySelectorAll('table').length>=2);e.dom.window.close();
});
test('timed transfer and presentations patch live regions without replacing stable controls',async()=>{
 for(const [chapter,id,action] of [[6,'y2020q26','start'],[5,'y2023q13','start'],[5,'merged-11','start']]){
  const e=env(chapter),c=open(e,id);let now=1000;e.w.Date.now=()=>now;click(c,action);const lab=c.querySelector('[data-lab]'),control=lab.querySelector(id==='y2020q26'?'[data-lab-act="reset"]':id==='y2023q13'?'[data-lab-act="pause"]':'[data-lab-act="stop"]');const before=lab.textContent;control.focus();now+=300;await new Promise(resolve=>setTimeout(resolve,250));
  assert.equal(lab.contains(control),true,id+' keeps control node');assert.equal(e.d.activeElement,control,id+' keeps focus');assert.notEqual(lab.textContent,before,id+' advances output');
  const m=e.w.NOTE_LABS.registry[id];assert.ok(m.frameKey&&m.patchFrame);e.dom.window.close();
 }
});

function homeEnv(url='https://notes.example/index.html',fetchIndex){
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),dom=new JSDOM(html,{url,runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
 w.HTMLElement.prototype.scrollIntoView=()=>{};w.fetch=fetchIndex||(async()=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,'generated/search-index.json'),'utf8'))}));
 for(const match of html.matchAll(/<script src="\.\/([^"?]+)/g))w.eval(fs.readFileSync(path.join(root,match[1]),'utf8'));
 return {dom,w,d:w.document};
}
const typeGlobal=(e,value)=>{const field=e.d.getElementById('global-search');field.value=value;field.dispatchEvent(new e.w.Event('input',{bubbles:true}));};
test('more search results append in place, focus the next item and restore through the URL',async()=>{
 const e=homeEnv();typeGlobal(e,'数据');await new Promise(setImmediate);
 const list=e.d.getElementById('global-results'),first=list.firstElementChild;assert.equal(list.children.length,30);
 e.d.getElementById('search-more').click();assert.equal(list.children.length,60);assert.equal(list.firstElementChild,first);assert.equal(e.d.activeElement,list.children[30].querySelector('a'));
 const url=e.w.location.href;assert.equal(new URL(url).searchParams.get('shown'),'60');
 const next=homeEnv(url);await new Promise(setImmediate);assert.equal(next.d.getElementById('global-results').children.length,60);
 typeGlobal(next,'SUMIF');await new Promise(setImmediate);assert.equal(new URL(next.w.location.href).searchParams.has('shown'),false);
 next.w.history.pushState(null,'',url);next.w.dispatchEvent(new next.w.PopStateEvent('popstate'));await new Promise(setImmediate);assert.equal(next.d.getElementById('global-results').children.length,60);
 e.dom.window.close();next.dom.window.close();
});
test('manually opened comparisons retain their place when following a source and restoring',async()=>{
 const e=homeEnv(),topic=e.d.getElementById('compare-cmp-delete-context');topic.querySelector('summary').click();await new Promise(r=>setTimeout(r,0));assert.equal(e.w.location.hash,'#'+topic.id);
 const source=topic.querySelector('a');source.addEventListener('click',event=>event.preventDefault());source.click();const next=homeEnv(e.w.location.href);assert.equal(next.d.getElementById(topic.id).open,true);
 next.d.getElementById(topic.id).querySelector('summary').click();await new Promise(r=>setTimeout(r,0));assert.equal(next.w.location.hash,'#browse-comparisons');e.dom.window.close();next.dom.window.close();
});
test('chapter queries restore, highlight paragraphs and temporarily open source matches',()=>{
 const e=env(2,{url:'https://notes.example/chapter2.html?q=Ctrl%20Shift'}),input=e.d.getElementById('search-input'),c=open(e,'y2020q24');click(c,'modifier','ctrl');const lab=c.querySelector('[data-lab]');
 assert.equal(input.value,'Ctrl Shift');assert.equal(c.classList.contains('hidden'),false);assert.ok(c.querySelectorAll('.note-search-match').length);
 const search=query=>{input.value=query;input.dispatchEvent(new e.w.Event('input',{bubbles:true}));};
 search('2020');const source=e.d.querySelector('.note-provenance.note-search-match');assert.equal(source.open,true);search('');assert.equal(source.open,false);
 search('2020');source.querySelector('summary').click();source.querySelector('summary').click();search('');assert.equal(source.open,true,'manual opening survives clearing');
 search('找不到的知识点xyz');e.d.getElementById('open-drawer').click();e.d.querySelector('#drawer a[href="#y2020q24"]').click();assert.equal(input.value,'');assert.equal(new URL(e.w.location.href).searchParams.has('q'),false);assert.equal(c.querySelector('[data-lab]'),lab);assert.equal(c.querySelector('[data-value="ctrl"]').getAttribute('aria-pressed'),'true');
 e.dom.window.close();
});
test('Chinese composition waits for the committed query on both search pages',async()=>{
 const e=env(2),input=e.d.getElementById('search-input');input.value='未提交拼音xyz';input.dispatchEvent(new e.w.InputEvent('input',{bubbles:true,isComposing:true}));assert.equal(e.d.querySelectorAll('.note-item.hidden').length,0);
 input.value='Ctrl';input.dispatchEvent(new e.w.CompositionEvent('compositionend',{bubbles:true}));assert.equal(new URL(e.w.location.href).searchParams.get('q'),'Ctrl');assert.ok(e.d.querySelectorAll('.note-item.hidden').length);
 const h=homeEnv(),global=h.d.getElementById('global-search');global.dispatchEvent(new h.w.CompositionEvent('compositionstart',{bubbles:true}));global.value='未提交拼音xyz';global.dispatchEvent(new h.w.InputEvent('input',{bubbles:true,isComposing:true}));assert.equal(h.d.getElementById('global-search-results').hidden,true);
 global.value='数据';global.dispatchEvent(new h.w.CompositionEvent('compositionend',{bubbles:true}));await new Promise(setImmediate);assert.equal(h.d.getElementById('global-results').children.length,30);e.dom.window.close();h.dom.window.close();
});
test('Word titles remain literal in navigation, status and updated tables of contents',()=>{
 const e=env(3),c=open(e,'merged-5'),value='标题<i data-v46-probe>原文</i>&lt;';change(e,c,'title',value);change(e,c,'tab','home');click(c,'style');click(c,'select','0');
 assert.ok(c.querySelector('.lab-output').textContent.includes(value));assert.equal(c.querySelector('[data-v46-probe]'),null);
 change(e,c,'tab','references');click(c,'tocInsert');assert.ok(c.querySelector('.lab-auto-toc').textContent.includes(value));change(e,c,'title',value+'新');click(c,'tocOpen');click(c,'tocApply');assert.ok(c.querySelector('.lab-auto-toc').textContent.includes(value+'新'));assert.equal(c.querySelector('[data-v46-probe]'),null);e.dom.window.close();
});
test('restarting an active text import cannot replace the cancellation snapshot',()=>{
 const e=env(4),c=open(e,'y2021q47');for(const action of ['start','next','next','finish'])click(c,action);
 const original=c.querySelector('table').textContent;click(c,'start');assert.equal(c.querySelector('[data-lab-act="start"]').disabled,true);click(c,'start');click(c,'cancel');assert.equal(c.querySelector('table').textContent,original);assert.match(c.querySelector('.lab-output').textContent,/原表数据保留/);
 const m=e.w.NOTE_LABS.registry.y2021q47,s=structuredClone(m.initial);for(const action of ['start','next','next','finish','start','start','cancel'])m.action(s,action);assert.equal(s.imported,true);assert.equal(s.step,0);m.action(s,'cancel');assert.equal(s.imported,true);
 m.action(s,'start');m.action(s,'finish');assert.equal(s.step,1,'finish requires the last wizard page');m.action(s,'cancel');assert.equal(s.imported,true);e.dom.window.close();
});
test('search begun from a comparison survives refresh and shared URL restoration',async()=>{
 const e=homeEnv('https://notes.example/index.html#compare-cmp-delete-context');assert.equal(e.d.querySelector('.comparison-topic[open]').id,'compare-cmp-delete-context');typeGlobal(e,'Delete');await new Promise(setImmediate);
 const url=e.w.location.href;assert.equal(new URL(url).hash,'');assert.equal(new URL(url).searchParams.get('q'),'Delete');assert.ok(e.d.querySelectorAll('#global-results li').length);
 const next=homeEnv(url);await new Promise(setImmediate);assert.equal(next.d.getElementById('global-search').value,'Delete');assert.equal(next.d.getElementById('global-search-results').hidden,false);assert.ok(next.d.querySelectorAll('#global-results li').length);e.dom.window.close();next.dom.window.close();
});
test('deferred search respects the newest query, clearing and retry after a failed index',async()=>{
 let resolve;const pending=new Promise(r=>resolve=r),index=JSON.parse(fs.readFileSync(path.join(root,'generated/search-index.json'),'utf8'));
 const e=homeEnv(undefined,()=>pending);typeGlobal(e,'Delete');typeGlobal(e,'SUMIF');resolve({ok:true,json:async()=>index});await new Promise(setImmediate);assert.match(e.d.getElementById('global-results').textContent,/SUMIF/);assert.equal(e.d.getElementById('global-search').value,'SUMIF');e.dom.window.close();
 let finish;const unfinished=new Promise(r=>finish=r),f=homeEnv(undefined,()=>unfinished);typeGlobal(f,'Delete');f.d.getElementById('global-clear').click();finish({ok:true,json:async()=>index});await new Promise(setImmediate);assert.equal(f.d.getElementById('global-search-results').hidden,true);assert.equal(f.d.getElementById('browse-notes').hidden,false);f.dom.window.close();
 let calls=0;const g=homeEnv(undefined,async()=>{if(++calls===1)throw Error('offline');return {ok:true,json:async()=>index};});typeGlobal(g,'Delete');await new Promise(setImmediate);assert.equal(g.d.getElementById('search-retry').hidden,false);g.d.getElementById('search-retry').click();await new Promise(setImmediate);assert.ok(g.d.querySelectorAll('#global-results li').length);typeGlobal(g,'<img src=x onerror=alert(1)>');await new Promise(setImmediate);assert.equal(g.d.querySelector('#global-results img'),null);g.dom.window.close();
});

test('v47 disk cleanup confirms the selected categories once and cancellation frees no space',()=>{
 const e=env(2),m=e.w.NOTE_LABS.registry.y2024q5,s=structuredClone(m.initial);m.change(s,'downloads',true);m.action(s,'review');assert.equal(s.pending.size,6380);m.action(s,'cancel');assert.equal(s.used,184000);m.action(s,'review');m.action(s,'confirm');assert.equal(s.used,177620);assert.equal(s.remaining.downloads,0);assert.equal(s.remaining.recycle,420);m.action(s,'confirm');assert.equal(s.used,177620);e.dom.window.close();
});
test('v47 workbook preserves new sheets and protects the final visible sheet',()=>{
 const e=env(4),m=e.w.NOTE_LABS.registry.y2020q8,s=structuredClone(m.initial);m.action(s,'new');m.action(s,'new');assert.equal(s.sheets.length,4);m.action(s,'hide');m.action(s,'delete');m.action(s,'cancel');assert.equal(s.sheets.length,4);m.action(s,'delete');m.action(s,'confirm');m.action(s,'hide');assert.equal(s.sheets.filter(x=>x.visible).length,1);m.action(s,'delete');assert.equal(s.pending,null);assert.match(s.message,/最后一张/);e.dom.window.close();
});
test('v47 formula parser respects precedence, decimals, long integers and errors',()=>{
 const e=env(4),parse=e.w.NOTE_LABS.registry.y2024q11.parseInput;
 for(const [input,result] of [['=(2+3)*4','20'],['=0.1+0.2','0.3'],['=1000000000000+1','1000000000001'],['2*3','2*3'],['=2×3','#NAME?'],['=4/0','#DIV/0!']])assert.equal(parse(input).value,result,input);e.dom.window.close();
});
test('v47 binary borrowing crosses consecutive zeroes without changing the arithmetic result',()=>{
 const e=env(1),m=e.w.NOTE_LABS.registry.y2020q31,s=structuredClone(m.initial);m.change(s,'a','10000');m.change(s,'b','00001');m.action(s,'load');for(let i=0;i<5;i++)m.action(s,'step');assert.match(m.render(s),/15/);assert.match(m.render(s),/01111/);e.dom.window.close();
});
test('v47 UPDATE invalidates a stale preview and escapes displayed SQL string literals',()=>{
 const e=env(10),c=open(e,'y2023q15');click(c,'preview');change(e,c,'score','65');assert.equal(c.querySelector('[data-lab-act="run"]').disabled,true);click(c,'preview');click(c,'run');assert.match(c.querySelector('.note-lab table').textContent,/李明65/);change(e,c,'id',"02'");assert.match(c.querySelector('.lab-code').textContent,/id = '02''';/);click(c,'preview');assert.match(c.querySelector('output').textContent,/命中0行/);change(e,c,'where','false');click(c,'preview');click(c,'run');assert.equal([...c.querySelectorAll('.note-lab tbody tr')].filter(r=>r.textContent.endsWith('65')).length,3);e.dom.window.close();
});
test('v47 shared printing follows submission order and rejects new jobs after sharing closes',()=>{
 const e=env(6),m=e.w.NOTE_LABS.registry.y2026q13,s=structuredClone(m.initial);m.action(s,'submit','B');m.action(s,'submit','A');assert.deepEqual(Array.from(s.jobs,j=>j.owner),['B','A']);m.change(s,'shared',false);m.action(s,'submit','A');assert.equal(s.jobs.length,2);m.action(s,'print');assert.equal(s.jobs[0].owner,'A');m.action(s,'cancel',String(s.jobs[0].id));assert.equal(s.jobs.length,0);e.dom.window.close();
});
test('v47 disabled devices retain missing-driver state until a driver is installed',()=>{
 const e=env(2),m=e.w.NOTE_LABS.registry.y2026q8,s=structuredClone(m.initial);m.action(s,'enable');m.action(s,'enable');assert.equal(s.mode,'driver');m.action(s,'update');assert.equal(s.mode,'normal');m.change(s,'mode','absent');m.action(s,'scan');assert.equal(s.mode,'absent');assert.doesNotMatch(m.render(s),/未知设备/);e.dom.window.close();
});
test('v47 restore quotas, desktop drafts and quick-access shortcuts keep independent state',()=>{
 const e=env(2),r=e.w.NOTE_LABS.registry;let m=r.y2026q33,s=structuredClone(m.initial);m.action(s,'toggle');m.action(s,'confirm');m.change(s,'quota',10);m.action(s,'delete');assert.equal(s.points.length,0);assert.equal(s.enabled,false);assert.match(m.render(s),/没有可用还原点/);
 m=r.y2026q25;s=structuredClone(m.initial);m.action(s,'open');m.change(s,'draftComputer',true);m.change(s,'draftRecycle',false);m.action(s,'apply');m.change(s,'draftRecycle',true);m.action(s,'cancel');assert.equal(s.computer,true);assert.equal(s.recycle,false);
 m=r.y2026q35;s=structuredClone(m.initial);m.action(s,'unpin');assert.equal(s.exists,true);m.action(s,'pin');m.action(s,'delete');m.action(s,'pin');assert.equal(s.pinned,false);assert.equal(s.exists,false);e.dom.window.close();
});
test('v47 default presentation view is committed explicitly and applied on reopening',()=>{
 const e=env(5),m=e.w.NOTE_LABS.registry.y2024q46,s=structuredClone(m.initial);for(const a of ['file','options','advanced'])m.action(s,a);m.change(s,'draft','sorter');m.action(s,'cancel');m.action(s,'reopen');assert.equal(s.view,'normal');for(const a of ['file','options','advanced'])m.action(s,a);m.change(s,'draft','notes');m.action(s,'save');assert.equal(s.view,'normal');m.action(s,'reopen');assert.equal(s.view,'notes');e.dom.window.close();
});
test('v47 slide duplicate preserves content and repeated insertion increases the deck',()=>{
 const e=env(5),m=e.w.NOTE_LABS.registry.y2024q12,s=structuredClone(m.initial);m.action(s,'duplicate');assert.equal(s.docs[0].slides[1].title,'牡丹');assert.equal(s.docs[0].slides[1].body,s.docs[0].slides[0].body);m.action(s,'new');m.action(s,'new');assert.equal(s.docs[0].slides.length,5);assert.equal(s.docs[0].slides[3].body,'');m.action(s,'document');assert.equal(s.docs.length,2);assert.equal(s.docs[0].slides.length,5);e.dom.window.close();
});
test('v47 picture replacement preserves identity but reinsertion creates a new object',()=>{
 const e=env(5),m=e.w.NOTE_LABS.registry.y2026q53,s=structuredClone(m.initial);m.change(s,'crop',20);m.action(s,'replace');assert.equal(s.source,'B');assert.equal(s.crop,20);assert.equal(s.animation,true);m.action(s,'reinsert');m.action(s,'inspect');assert.equal(s.object,2);assert.equal(s.source,'B');assert.equal(s.animation,false);assert.equal(s.crop,0);e.dom.window.close();
});
test('v47 ordinary textboxes have no placeholder menu and mixed fonts scale proportionally',()=>{
 const e=env(5),c=open(e,'y2026q54');click(c,'menu');click(c,'shrink');assert.deepEqual([...c.querySelectorAll('.lab-placeholder p')].map(p=>p.style.fontSize),['16px','12px','12px']);change(e,c,'object','textbox');assert.equal(c.querySelector('.lab-autofit'),null);click(c,'format');click(c,'shrink');assert.equal(c.querySelector('.lab-placeholder p').style.fontSize,'16px');e.dom.window.close();
});
test('v47 frame playback pauses after programmatic slider updates without changing total duration',async()=>{
 const e=env(7);try{const c=open(e,'y2020q38');click(c,'play');await new Promise(r=>setTimeout(r,90));const slider=c.querySelector('[data-field="time"]');assert.ok(Number(slider.value)>0);assert.equal(slider.value,slider.defaultValue);click(c,'play');const time=c.querySelector('[data-field="time"]').value;await new Promise(r=>setTimeout(r,60));assert.equal(c.querySelector('[data-field="time"]').value,time);change(e,c,'fps','60');assert.match(c.querySelector('.note-lab table').textContent,/60 fps \/ 120 帧/);}finally{e.dom.window.close();}
});
test('v47 seeking past downloaded media produces zero buffer and waits for data',()=>{
 const e=env(7),m=e.w.NOTE_LABS.registry.y2023q18,s=structuredClone(m.initial);m.change(s,'position',20);m.action(s,'play');m.change(s,'rate',0);m.action(s,'tick');assert.equal(s.position,20);assert.equal(s.downloaded,12);assert.match(m.render(s),/等待下载/);m.change(s,'rate',2);for(let i=0;i<5;i++)m.action(s,'tick');assert.equal(s.downloaded,22);assert.equal(s.position,21);e.dom.window.close();
});
test('v47 block tampering remains visible when changing admission mode or recomputing one block',()=>{
 const e=env(9),m=e.w.NOTE_LABS.registry['merged-17'],s=structuredClone(m.initial);m.change(s,'block0','甲向乙转账100');m.action(s,'verify');assert.match(s.message,/1/);m.change(s,'mode','permissioned');assert.match(m.render(s),/发现被改动/);m.action(s,'rehash');m.action(s,'verify');assert.match(s.message,/2/);e.dom.window.close();
});
test('v47 conceptual readouts and hyperlink source agree with their selected condition',()=>{
 let e=env(8),c=open(e,'y2026q16');c.querySelector('[data-sim-choice="0"]').click();assert.match(c.querySelector('[data-service-screen]').textContent,/不可用/);assert.equal(c.querySelector('[data-cia-a]').textContent,'受损');e.dom.window.close();
 e=env(6);c=open(e,'y2020q36');const hash=e.w.location.hash;c.querySelector('[data-preview-link]').click();assert.equal(e.w.location.hash,hash);c.querySelector('[data-sim-choice="3"]').click();assert.equal(c.querySelector('[data-preview-link]').hasAttribute('href'),false);assert.equal(c.querySelector('[data-anchor-attribute]').hidden,true);e.dom.window.close();
});
test('v47 expanded operation surface preserves live nodes and focus when returning',()=>{
 const e=env(4);e.w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};e.w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new e.w.Event('close'));};
 const c=open(e,'y2024q11'),lab=c.querySelector('[data-lab]');change(e,c,'raw','=8*7');click(c,'apply');const opener=c.querySelector('[data-sim-expand]');opener.click();assert.ok(c.querySelector('dialog').open);assert.equal(c.querySelector('[data-lab]'),lab);assert.match(c.querySelector('.note-lab table').textContent,/56/);c.querySelector('[data-demo-close]').click();assert.equal(c.querySelector('dialog'),null);assert.equal(c.querySelector('[data-lab]'),lab);assert.equal(e.d.activeElement,opener);e.dom.window.close();
});
test('v47 Office ribbon buttons switch the displayed commands and retain button focus',()=>{
 const e=env(3),c=open(e,'merged-5');const target=c.querySelector('[data-lab-tab="tab"][data-value="home"]');assert.ok(target);target.focus();target.click();assert.ok(c.querySelector('[data-lab-act="style"]'));assert.equal(e.d.activeElement.dataset.labTab,'tab');assert.equal(e.d.activeElement.dataset.value,'home');assert.equal(c.querySelectorAll('.lab-office nav button[aria-pressed="true"]').length,1);e.dom.window.close();
});
test('v47 text fields can be counted in a PivotTable value area',()=>{
 const e=env(4),c=open(e,'y2024q67');click(c,'pick','产品');click(c,'place','value');assert.equal(c.querySelector('[data-field="aggregate"]').value,'count');assert.match(c.querySelector('.lab-pivot-layout').textContent,/总计6/);e.dom.window.close();
});
test('v47 syllabus models recalculate trends, protection, print sheets and input tables',()=>{
 let e=env(4),c=open(e,'syllabus-sparkline');change(e,c,'raw','4,-8,5,10');change(e,c,'type','win');assert.match(c.querySelector('svg').getAttribute('aria-label'),/4、-8、5、10/);change(e,c,'raw','4,坏值,5,10');assert.equal(c.querySelector('svg'),null);
 c=open(e,'syllabus-worksheet-protection');click(c,'protect');assert.equal(c.querySelector('[data-field="a"]').disabled,true);assert.equal(c.querySelector('[data-field="b"]').disabled,false);click(c,'protect');assert.equal(c.querySelector('[data-field="a"]').disabled,false);
 c=open(e,'syllabus-excel-whatif-table');assert.match(c.querySelector('.note-lab tbody').textContent,/80400010050001206000/);change(e,c,'price',60);assert.match(c.querySelector('.note-lab tbody').textContent,/80480010060001207200/);e.dom.window.close();
 e=env(3);c=open(e,'syllabus-word-print-controls');change(e,c,'range','2-4');change(e,c,'duplex','true');click(c,'preview');assert.match(c.querySelector('.lab-workspace').textContent,/需要4张纸/);change(e,c,'range','9');click(c,'preview');assert.equal(c.querySelector('.lab-mini-deck'),null);e.dom.window.close();
});
test('v47 multikey sort honors secondary ties and both score directions',()=>{
 const e=env(4),m=e.w.NOTE_LABS.registry['syllabus-excel-multikey-sort'],s=structuredClone(m.initial);m.action(s,'sort');assert.deepEqual(Array.from(s.rows,x=>x.id),['01','02','04','03']);m.change(s,'first','score');m.change(s,'descending','false');m.action(s,'sort');assert.deepEqual(Array.from(s.rows,x=>x.id),['04','03','01','02']);e.dom.window.close();
});
test('file selection supports real Ctrl/Shift ranges and rejects duplicate or invalid names',()=>{
 const e=env(2),c=open(e,'syllabus-windows-selection');
 const select=(id,keys={})=>c.querySelector(`[data-lab-act="choose"][data-value="${id}"]`).dispatchEvent(new e.w.MouseEvent('click',{bubbles:true,...keys}));
 const selected=()=>[...c.querySelectorAll('[data-lab-act="choose"][aria-pressed="true"]')].map(b=>Number(b.dataset.value));
 select(2);select(4,{shiftKey:true});assert.deepEqual(selected(),[2,3,4]);select(3,{ctrlKey:true});assert.deepEqual(selected(),[2,4]);
 select(5,{ctrlKey:true,shiftKey:true});assert.deepEqual(selected(),[2,3,4,5]);
 click(c,'clear');click(c,'modifier','ctrl');select(1);select(5);assert.deepEqual(selected(),[1,5]);click(c,'modifier','ctrl');
 select(1);change(e,c,'name','02 练习.txt');click(c,'rename');assert.match(c.querySelector('.lab-output').textContent,/已有同名/);assert.match(c.querySelector('[data-value="1"]').textContent,/01 笔记.txt/);
 change(e,c,'name','NUL.txt');click(c,'rename');assert.match(c.querySelector('.lab-output').textContent,/名称无效/);
 change(e,c,'name','<img>.txt');click(c,'new');assert.equal(c.querySelector('img'),null);assert.equal(c.querySelectorAll('[data-lab-act="choose"]').length,5);
 change(e,c,'name','新目录');click(c,'new');assert.equal(c.querySelectorAll('[data-lab-act="choose"]').length,6);assert.match(c.querySelector('.lab-output').textContent,/未创建文档/);
 c.querySelector('[data-lab-act="choose"][data-value="6"]').focus();e.d.activeElement.dispatchEvent(new e.w.KeyboardEvent('keydown',{bubbles:true,key:'F2'}));assert.equal(e.d.activeElement.dataset.field,'name');
 e.dom.window.close();
});
test('path navigation distinguishes parent from history; filename matches respect scope',()=>{
 const e=env(2),c=open(e,'syllabus-windows-paths');click(c,'go','C:\\课程');click(c,'up');assert.equal(c.querySelector('[data-current-path]').textContent,'C:\\');
 click(c,'back');assert.equal(c.querySelector('[data-current-path]').textContent,'C:\\课程');click(c,'back');assert.equal(c.querySelector('[data-current-path]').textContent,'D:\\资料');
 change(e,c,'address','Z:\\缺失');click(c,'address');assert.equal(c.querySelector('[data-current-path]').textContent,'D:\\资料');
 const search=open(e,'syllabus-windows-search');assert.match(search.querySelector('.lab-output').textContent,/匹配 1 项/);change(e,search,'scope','all');assert.match(search.querySelector('.lab-output').textContent,/匹配 2 项/);
 change(e,search,'pattern','笔记*.txt');assert.match(search.querySelector('.lab-output').textContent,/匹配 4 项/);change(e,search,'pattern','*复习*.txt');change(e,search,'scope','current');assert.match(search.querySelector('.lab-output').textContent,/匹配 0 项/);change(e,search,'scope','tree');assert.match(search.querySelector('.lab-output').textContent,/匹配 1 项/);
 change(e,search,'pattern','[.*');assert.match(search.querySelector('.lab-output').textContent,/匹配 0 项/);e.dom.window.close();
});
test('ZIP sequential actions preserve names, reject conflicts and show independent extraction',()=>{
 const e=env(2),c=open(e,'y2022q75');click(c,'menu');click(c,'rename');click(c,'menu');click(c,'zip');assert.match(c.querySelector('[data-lab-drag="hold"]').textContent,/年度总结.zip/);assert.match(c.querySelector('[data-lab-act="open"]').textContent,/年度总结.zip.zip/);
 click(c,'open');click(c,'extract');assert.match(c.querySelector('[data-extracted]').textContent,/年度总结.zip/);
 c.querySelector('[data-sim-reset]').click();click(c,'menu');click(c,'zip');click(c,'menu');click(c,'rename');assert.match(c.querySelector('.lab-output').textContent,/已有.*不能/);assert.doesNotMatch(c.querySelector('[data-lab-drag="hold"]').textContent,/年度总结.zip/);e.dom.window.close();
});
test('file attributes retain independent display, association and folder permission state',()=>{
 const e=env(2),c=open(e,'merged-4');click(c,'extension');assert.doesNotMatch(c.querySelector('[data-property-file] b').textContent,/docx/);click(c,'extension');assert.equal(c.querySelector('[data-property-file] b').textContent,'report.docx');
 click(c,'readonly');click(c,'save');assert.match(c.querySelector('.lab-output').textContent,/拒绝覆盖/);click(c,'new');assert.match(c.querySelector('.lab-output').textContent,/已在文件夹中新建/);
 click(c,'permission');click(c,'new');assert.match(c.querySelector('.lab-output').textContent,/拒绝访问/);change(e,c,'app','WordPad');assert.match(c.querySelector('[data-property-file]').textContent,/写字板|WordPad/);assert.match(c.querySelector('[data-property-file]').textContent,/只读/);
 click(c,'hidden');assert.match(c.querySelector('[data-property-file]').textContent,/不显示/);click(c,'showHidden');assert.equal(c.querySelector('[data-property-file] b').textContent,'report.docx');assert.match(c.querySelector('[data-property-file]').textContent,/隐藏/);e.dom.window.close();
});
test('long notes expose real search paragraph anchors and clear transient jump links',async()=>{
 const e=env(2),input=e.d.getElementById('search-input');input.value='EFS';input.dispatchEvent(new e.w.Event('input',{bubbles:true}));
 const c=e.d.getElementById('merged-4'),links=[...c.querySelectorAll('.note-search-jumps a')];assert.ok(links.length>=2);assert.ok(links.some(a=>a.hash==='#merged-4--point-11'));assert.ok(links.every(a=>e.d.querySelector(a.hash)?.classList.contains('note-search-match')));
 links[0].click();await new Promise(resolve=>e.w.setTimeout(resolve,0));assert.equal(e.w.location.hash,links[0].hash);
 e.d.getElementById('clear-search').click();assert.equal(e.d.querySelector('.note-search-jumps'),null);assert.equal(e.d.querySelector('.note-search-match'),null);assert.equal(e.d.querySelectorAll('.note-item:not(.hidden)').length,28);e.dom.window.close();
});

test('Word paragraph spacing applies independent values and cancellation preserves the page',()=>{
 const e=env(3),c=open(e,'syllabus-word-paragraph-spacing');
 const sample=()=>c.querySelector('[data-spacing-line]').style.height;
 const original=sample();click(c,'open');change(e,c,'before','12');change(e,c,'after','24');change(e,c,'kind','double');
 click(c,'cancel');assert.equal(sample(),original);assert.equal(c.querySelector('[data-spacing-before]').style.height,'0pt');
 click(c,'open');change(e,c,'before','12');change(e,c,'after','24');change(e,c,'kind','exact');change(e,c,'amount','10');click(c,'apply');
 assert.equal(c.querySelector('[data-spacing-before]').style.height,'12pt');assert.equal(c.querySelector('[data-spacing-after]').style.height,'24pt');assert.equal(sample(),'10pt');assert.match(c.querySelector('output').textContent,/固定值 10磅.*裁切/);
 click(c,'open');change(e,c,'kind','minimum');change(e,c,'amount','10');click(c,'apply');assert.equal(sample(),'18pt');assert.equal(c.querySelectorAll('[data-spacing-line]').length,3);e.dom.window.close();
});
test('Word Home and Shift+Home use the active line while Ctrl+A selects the actual editable document',()=>{
 const e=env(3),c=open(e,'y2024q7');let editor=c.querySelector('[data-selection-editor]');editor.value='\n第一行\n第二行文字';editor.dispatchEvent(new e.w.Event('input',{bubbles:true}));
 editor=c.querySelector('[data-selection-editor]');editor.setSelectionRange(0,0);editor.dispatchEvent(new e.w.Event('select'));click(c,'key','home');editor=c.querySelector('[data-selection-editor]');assert.equal(editor.selectionStart,0);
 editor.setSelectionRange(8,8);editor.dispatchEvent(new e.w.Event('select'));editor.dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Home',shiftKey:true,bubbles:true,cancelable:true}));editor=c.querySelector('[data-selection-editor]');assert.equal(editor.selectionStart,5);assert.equal(editor.selectionEnd,8);assert.equal(editor.selectionDirection,'backward');
 click(c,'key','end');editor=c.querySelector('[data-selection-editor]');assert.equal(editor.selectionStart,editor.value.length);assert.equal(editor.selectionStart,editor.selectionEnd);click(c,'key','all');editor=c.querySelector('[data-selection-editor]');assert.equal(editor.selectionStart,0);assert.equal(editor.selectionEnd,editor.value.length);e.dom.window.close();
});
test('Word text editing moves the actual selection and keeps clipboard text after paste and undo',()=>{
 const e=env(3),c=open(e,'syllabus-word-text-editing');let editor=c.querySelector('[data-edit-text]');const original=editor.value;
 editor.setSelectionRange(0,2);editor.dispatchEvent(new e.w.Event('select'));editor.dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'c',ctrlKey:true,bubbles:true,cancelable:true}));
 editor=c.querySelector('[data-edit-text]');assert.equal(editor.value,original);assert.equal(c.querySelector('[data-edit-clipboard]').textContent,'笔记');
 click(c,'cut');editor=c.querySelector('[data-edit-text]');assert.equal(editor.value,original.slice(2));editor.setSelectionRange(editor.value.length,editor.value.length);editor.dispatchEvent(new e.w.Event('select'));click(c,'paste');editor=c.querySelector('[data-edit-text]');assert.equal(editor.value,original.slice(2)+'笔记');
 click(c,'paste');assert.equal(c.querySelector('[data-edit-text]').value,original.slice(2)+'笔记笔记');click(c,'undo');assert.equal(c.querySelector('[data-edit-text]').value,original.slice(2)+'笔记');assert.equal(c.querySelector('[data-edit-clipboard]').textContent,'笔记');
 click(c,'undo');click(c,'undo');assert.equal(c.querySelector('[data-edit-text]').value,original);e.dom.window.close();
});
