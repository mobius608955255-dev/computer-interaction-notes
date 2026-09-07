/* Independent, stateful demonstrations. No worksheet actions are learning controls. */
(() => {
  'use strict';
  const sim = window.NOTE_SIMULATIONS;
  // User text must round-trip literally; legacy note HTML has separate normalization.
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const registry = {};
  const owners = new Map();
  const states = new WeakMap();
  const frameKeys = new WeakMap();
  const lifecycles = new WeakMap();
  let serial = 0;
  const btn = (text,act,value='',extra='') => `<button type="button" data-lab-act="${act}" data-value="${esc(String(value))}" ${extra}>${text}</button>`;
  const field = (name,label,value,type='text',extra='') => `<label>${label}<input data-field="${name}" type="${type}" value="${esc(String(value))}" ${extra}></label>`;
  const select = (name,label,value,options,extra='') => `<label>${label}<select data-field="${name}" ${extra}>${options.map(o=>`<option value="${esc(String(o[0]))}" ${String(o[0])===String(value)?'selected':''}>${esc(o[1])}</option>`).join('')}</select></label>`;
  const table = (head,rows) => `<div class="lab-table-scroll" tabindex="0" aria-label="数据表，可横向滚动"><table><thead><tr>${head.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const coach = text => `<div class="lab-coach"><b>操作提示</b><p>${text}</p></div>`;
  const output = text => `<output class="lab-output" aria-live="polite">${text}</output>`;
  const tabs = (name,value,items) => `<select data-field="${name}" hidden aria-label="功能区位置">${items.map(([key,label])=>`<option value="${key}" ${key===value?'selected':''}>${label}</option>`).join('')}</select>${items.map(([key,label])=>`<button type="button" data-lab-tab="${name}" data-value="${key}" aria-pressed="${key===value}">${label}</button>`).join('')}`;
  const office = (app,tab,commands,body,navigation='') => `<div class="lab-office lab-${app.toLowerCase()}"><header>${app} 2016 · 局部操作仿真</header><nav aria-label="功能区位置">${navigation||`<span>${esc(tab)}</span>`}</nav><div class="lab-ribbon">${commands}</div><div class="lab-workspace">${body}</div><footer>演示文档 · 操作仅影响本卡片</footer></div>`;
  const dialog = (title,body,commands) => `<section class="lab-dialog" role="group" aria-label="${title}"><header>${title}</header><div>${body}</div><footer>${commands}</footer></section>`;
  const paper = body => `<div class="lab-paper">${body}</div>`;
  const register = (ids,title,task,initial,render,action,change) => {
    const key = ids[0];
    if(registry[key])throw new Error(`Duplicate lab registration: ${key}`);
    for(const id of ids)if(owners.has(id))throw new Error(`Duplicate lab alias: ${id}`);
    registry[key] = {initial,render,action,change};
    for (const id of ids) {
      owners.set(id,key);
      sim.demos[id] = {kind:'lab',title,task,initial:'直接操作画面。'};
      sim.scenes[id] = () => `<div class="note-lab" data-lab="${key}"></div>`;
    }
  };
  const fresh = key => ({...structuredClone(registry[key].initial),uid:`lab-${++serial}`});
  const number = (v,min,max) => Math.max(min,Math.min(max,Number(v)||0));
  const money = n => Number(n).toLocaleString('zh-CN',{maximumFractionDigits:2});

  // Timed models name the regions that change; stable controls keep their DOM identity.
  const patchRegions = (root, html, selectors) => {
    const template=document.createElement('template');template.innerHTML=html;
    const pairs=selectors.map(selector=>[root.querySelector(selector),template.content.querySelector(selector)]);
    if(pairs.some(([old,next])=>!old||!next))return false;
    function sync(old,next){
      if(old.isEqualNode(next))return;
      if(old.nodeType!==next.nodeType||old.nodeName!==next.nodeName){old.replaceWith(next.cloneNode(true));return;}
      if(old.nodeType===Node.TEXT_NODE){old.data=next.data;return;}
      if(old.nodeType!==Node.ELEMENT_NODE)return;
      for(const attr of [...old.attributes])if(!next.hasAttribute(attr.name))old.removeAttribute(attr.name);
      for(const attr of next.attributes)if(old.getAttribute(attr.name)!==attr.value)old.setAttribute(attr.name,attr.value);
      const before=[...old.childNodes],after=[...next.childNodes];
      for(let i=0;i<Math.max(before.length,after.length);i++){
        if(!after[i])before[i].remove();else if(!before[i])old.append(after[i].cloneNode(true));else sync(before[i],after[i]);
      }
    }
    pairs.forEach(([old,next])=>sync(old,next));return true;
  };

  function render(root, frame=false){
    const state=states.get(root),model=registry[root.dataset.lab];
    if(frame&&model.frameKey&&frameKeys.get(root)===model.frameKey(state)&&model.patchFrame?.(state,root))return;
    // Keep local scroll positions through a same-layout redraw, including textareas.
    const scrolls=[...root.querySelectorAll('*')].filter(el=>el.scrollLeft||el.scrollTop).map(el=>{
      const path=[];for(let node=el;node!==root;node=node.parentElement)path.unshift([...node.parentElement.children].indexOf(node));
      return {path,tag:el.tagName,classes:el.getAttribute('class'),field:el.dataset.field,left:el.scrollLeft,top:el.scrollTop};
    });
    const focused=root.contains(document.activeElement)?document.activeElement:null;
    const choiceSource=focused?.closest('.notes-picker')?.querySelector('select');
    const descriptor=choiceSource?.dataset.field?['field',choiceSource.dataset.field]:focused?.dataset.field?['field',focused.dataset.field]:focused?.dataset.labAct?['labAct',focused.dataset.labAct,focused.dataset.value]:focused?.dataset.labTab?['labTab',focused.dataset.labTab,focused.dataset.value]:null;
    const selection=focused&&['text','search'].includes(focused.type)||focused?.tagName==='TEXTAREA'?[focused.selectionStart,focused.selectionEnd]:null;
    const s=states.get(root);root.innerHTML=registry[root.dataset.lab].render(s);
    window.NOTE_CHOICES?.enhance(root);
    if(descriptor){const target=[...root.querySelectorAll('[data-field],[data-lab-act],[data-lab-tab]')].find(el=>el.dataset[descriptor[0]]===descriptor[1]&&(descriptor[0]==='field'||el.dataset.value===descriptor[2]));if(target&&!target.disabled){if(target.tagName==='SELECT'&&window.NOTE_CHOICES)window.NOTE_CHOICES.focus(target);else target.focus({preventScroll:true});if(selection&&target.setSelectionRange)target.setSelectionRange(...selection);}}
    registry[root.dataset.lab].afterRender?.(s,root);
    frameKeys.set(root,model.frameKey?.(s));
    for(const saved of scrolls){const el=saved.path.reduce((node,i)=>node?.children[i],root);if(el&&el.tagName===saved.tag&&el.getAttribute('class')===saved.classes&&el.dataset.field===saved.field){el.scrollLeft=saved.left;el.scrollTop=saved.top;}}
  }
  function mount(card){
    card.querySelectorAll('[data-lab]').forEach(root=>{
      if(states.has(root))return;
      const controller=new AbortController();
      const listen=(event,handler)=>root.addEventListener(event,handler,{signal:controller.signal});
      let timer=null,paintTimer=null;
      const cancelGesture=()=>{
        const g=gesture;gesture=null;pointerTarget=null;pressedId=null;dirty=false;
        if(!g)return;
        clearTimeout(g.timer);
        if(g.el.hasPointerCapture?.(g.pointerId))g.el.releasePointerCapture(g.pointerId);
        g.el.style.transform='';
        root.querySelectorAll('.lab-box-preview,[data-live-ink]').forEach(el=>el.remove());
        root.querySelectorAll('.lab-drop-hover,.lab-dragging').forEach(el=>el.classList.remove('lab-drop-hover','lab-dragging'));
      };
      lifecycles.set(root,{cancelGesture,dispose:()=>{cancelGesture();clearInterval(timer);clearTimeout(paintTimer);controller.abort();states.delete(root);lifecycles.delete(root);}});
      states.set(root,fresh(root.dataset.lab));render(root);
      const model=registry[root.dataset.lab];
      listen('focusin',e=>{const field=e.target.closest('[data-field]')||e.target.closest('.notes-picker')?.querySelector('[data-field]');if(field)model.focus?.(states.get(root),field.dataset.field);});
      const paintPending=()=>{if(dirty&&!pointerTarget&&!gesture&&!root.closest('[hidden]')&&!root.querySelector('.notes-picker.is-open')){const frame=dirty==='frame';dirty=false;render(root,frame);}};
      if(model.tick){timer=setInterval(()=>{if(!root.isConnected){lifecycles.get(root)?.dispose();return;}if(model.tick(states.get(root))&&!dirty)dirty='frame';paintPending();},model.tickInterval||200);}
      listen('pointerover',e=>{if(model.hover?.(states.get(root),e,root))render(root);});
      listen('dblclick',e=>{if(model.dblclick?.(states.get(root),e,root))render(root);});
      let suppressUntil=0, gesture=null, pointerTarget=null, pressedId=null, dirty=false;
      const act=(a,v,field)=>{
        const model=registry[root.dataset.lab],s=states.get(root);
        root.querySelectorAll('input[data-field],textarea[data-field]').forEach(x=>{
          const value=x.type==='checkbox'?x.checked:x.value,initial=x.type==='checkbox'?x.defaultChecked:x.defaultValue;
          if(value===initial)return;
          if(model.change)model.change(s,x.dataset.field,value);else s[x.dataset.field]=value;
        });
        const pending=field?(model.change?model.change(s,field,v):(s[field]=v)):model.action(s,a,v);render(root);
        if(pending&&typeof pending.then==='function')pending.then(()=>{
          if(root.isConnected&&states.get(root)===s)render(root);
        }).catch(()=>{
          s.busy=false;s.message='本次操作未完成，请重试。';
          if(root.isConnected&&states.get(root)===s)render(root);
        });
      };
      listen('click',e=>{const b=e.target.closest('[data-lab-act],[data-lab-tab]');pointerTarget=null;states.get(root)._ctrl=e.ctrlKey||e.metaKey;if(!b||b.disabled){if(dirty&&!root.querySelector('.notes-picker.is-open')){dirty=false;const target=e.target.closest('[data-field]');const name=target?.dataset.field;render(root);if(name)root.querySelector(`[data-field="${name}"]`)?.focus();}return;}e.stopPropagation();if(Date.now()<suppressUntil)return;dirty=false;act(b.dataset.labAct,b.dataset.value,b.dataset.labTab);});
      listen('contextmenu',e=>{if(e.target.closest('[data-lab-drag="hold"],[data-lab-drag="file"]')){e.preventDefault();act('menu');}});
      // Capture typing immediately; do not depend on blur/change before a toolbar click.
      listen('input',e=>{const x=e.target.closest('[data-field]');if(!x)return;const s=states.get(root),v=x.type==='checkbox'?x.checked:x.value;const fn=registry[root.dataset.lab].change;if(fn)fn(s,x.dataset.field,v);else s[x.dataset.field]=v;});
      listen('change',e=>{const x=e.target.closest('[data-field]');if(!x)return;const s=states.get(root),v=x.type==='checkbox'?x.checked:x.value;const fn=registry[root.dataset.lab].change;if(fn)fn(s,x.dataset.field,v);else s[x.dataset.field]=v;if(pointerTarget&&pointerTarget!==x){dirty=true;return;}render(root);});
      listen('keydown',e=>{
        if(model.keydown?.(states.get(root),e,root)){render(root);return;}
        const h=e.target.closest('[data-lab-drag="ruler"]');if(!h||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const s=states.get(root),k=h.dataset.key,delta=e.key==='ArrowRight'?2:-2;if(k==='both'){const change=number(delta,-Math.min(s.rest,s.first),Math.min(60,s.right-8)-Math.max(s.rest,s.first));s.rest+=change;s.first+=change;}else s[k]=number(s[k]+delta,k==='right'?Math.max(s.first,s.rest)+8:0,k==='right'?100:Math.min(60,s.right-8));render(root);root.querySelector(`[data-key="${k}"]`)?.focus();
      });
      listen('pointerdown',e=>{
        if(gesture||e.isPrimary===false)return;
        pointerTarget=e.target.closest('button,input,select,textarea');
        pressedId=e.pointerId;
        if(e.target.closest('.notes-picker'))return;
        // A fresh press on another command is intentional, not the drag's ghost click.
        if(pointerTarget?.dataset.labAct&&!pointerTarget.dataset.labDrag)suppressUntil=0;
        const el=e.target.closest('[data-lab-drag]');if(!el||![0,2].includes(e.button))return;if(e.target.closest('input,textarea,select')&&el!==e.target)return;
        const s=states.get(root);gesture={el,pointerId:e.pointerId,kind:el.dataset.labDrag,x:e.clientX,y:e.clientY,moved:false,key:el.dataset.key,first:s.first,rest:s.rest,button:e.button,startValue:s[el.dataset.key]};
        el.setPointerCapture?.(e.pointerId);
        if(gesture.kind==='hold'||gesture.kind==='file')gesture.timer=setTimeout(()=>{if(!root.isConnected||!gesture||states.get(root)!==s)return;cancelGesture();suppressUntil=Date.now()+500;act('menu');},600);
        if(gesture.kind==='box'||gesture.kind==='ink')gesture.rect=el.getBoundingClientRect();
        if(gesture.kind==='ruler')gesture.rect=root.querySelector('[data-ruler]').getBoundingClientRect();
      });
      listen('pointermove',e=>{
        if(!gesture||e.pointerId!==gesture.pointerId)return;const g=gesture;const moved=Math.hypot(e.clientX-g.x,e.clientY-g.y)>7;if(moved){g.moved=true;clearTimeout(g.timer);}
        if(!g.moved)return;e.preventDefault();
        g.dx=e.clientX-g.x;g.dy=e.clientY-g.y;
        model.preview?.(states.get(root),g,root,e);
        if(g.kind==='box'){const r=g.rect;const x=number((g.x-r.left)/r.width*100,0,100),y=number((g.y-r.top)/r.height*100,0,100),x2=number((e.clientX-r.left)/r.width*100,0,100),y2=number((e.clientY-r.top)/r.height*100,0,100);g.box={x:Math.min(x,x2),y:Math.min(y,y2),w:Math.abs(x2-x),h:Math.abs(y2-y)};let preview=root.querySelector('.lab-box-preview');if(!preview){preview=document.createElement('div');preview.className='lab-box-preview';g.el.append(preview);}Object.assign(preview.style,{left:g.box.x+'%',top:g.box.y+'%',width:g.box.w+'%',height:g.box.h+'%'});}
        if(g.kind==='file'||g.kind==='object')g.el.style.transform=`translate(${g.dx}px,${g.dy}px)`;
        if(g.kind==='ink'){const r=g.rect;g.points??=[[(g.x-r.left)/r.width*100,(g.y-r.top)/r.height*100]];g.points.push([number((e.clientX-r.left)/r.width*100,0,100),number((e.clientY-r.top)/r.height*100,0,100)]);const state=states.get(root);if(state.show&&state.pen&&!state.black){let line=g.el.querySelector('[data-live-ink]');if(!line){line=document.createElementNS('http://www.w3.org/2000/svg','polyline');line.setAttribute('data-live-ink','');line.setAttribute('fill','none');line.setAttribute('stroke',state.color);line.setAttribute('stroke-width','.7');g.el.querySelector('svg').append(line);}line.setAttribute('points',g.points.map(p=>p.join(',')).join(' '));}}
        if(g.kind==='ruler'){const delta=(e.clientX-g.x)/g.rect.width*100;const value=number((g.key==='both'?g.rest:g.startValue)+delta,g.key==='right'?Math.max(g.first,g.rest)+8:0,g.key==='right'?100:Math.min(60,states.get(root).right-8));g.el.style.left=value+'%';g.value=value;}
        if(g.kind==='field'){g.el.style.transform=`translate(${e.clientX-g.x}px,${e.clientY-g.y}px)`;g.el.classList.add('lab-dragging');root.querySelectorAll('[data-lab-drop]').forEach(z=>{const r=z.getBoundingClientRect();z.classList.toggle('lab-drop-hover',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);});}
        if(g.kind==='range')root.querySelectorAll('[data-row]').forEach(x=>{const r=x.getBoundingClientRect();if(e.clientY>=r.top&&e.clientY<=r.bottom){g.end=Number(x.dataset.row);const a=Number(g.el.dataset.row);root.querySelectorAll('[data-row]').forEach(y=>y.classList.toggle('lab-selected',Number(y.dataset.row)>=Math.min(a,g.end)&&Number(y.dataset.row)<=Math.max(a,g.end)));}});
        if(g.kind==='fill')root.querySelectorAll('[data-fill-index]').forEach(x=>{const r=x.getBoundingClientRect();if(e.clientY>=r.top&&e.clientY<=r.bottom){g.end=Number(x.dataset.fillIndex);x.classList.add('lab-selected');}});
      });
      const finish=(e,cancel=false)=>{
        if(!gesture){
          if(e.pointerId!==pressedId)return;
          pointerTarget=null;pressedId=null;
          // Let the following click consume its original DOM target before repainting.
          clearTimeout(paintTimer);paintTimer=setTimeout(()=>{if(states.has(root))paintPending();},0);return;
        }
        if(e.pointerId!==gesture.pointerId)return;const g=gesture;clearTimeout(g.timer);gesture=null;pointerTarget=null;pressedId=null;if(g.el.hasPointerCapture?.(g.pointerId))g.el.releasePointerCapture(g.pointerId);if(!g.moved){paintTimer=setTimeout(paintPending,0);return;}suppressUntil=Date.now()+400;dirty=false;const s=states.get(root);
        if(!cancel){
          if(g.kind==='ruler'&&g.value!==undefined){if(g.key==='both'){const d=number(g.value-s.rest,-Math.min(s.rest,s.first),Math.min(60,s.right-8)-Math.max(s.rest,s.first));s.rest+=d;s.first+=d;}else s[g.key]=g.value;}
          if(g.kind==='field'){const zone=[...root.querySelectorAll('[data-lab-drop]')].find(z=>{const r=z.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});if(zone)model.dropField?.(s,g.key,zone.dataset.labDrop);else s.message='没有落入区域，字段保持原位置。';}
          if(g.kind==='range'&&g.end!==undefined){s.start=Number(g.el.dataset.row);s.end=g.end;}
          if(g.kind==='fill'&&g.end!==undefined)s.filled=g.end;
          registry[root.dataset.lab].gesture?.(s,{...g,endX:e.clientX,endY:e.clientY,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,altKey:e.altKey},root);
        }render(root);
      };
      // A finger can be released outside a plain input/button without pointer capture.
      document.addEventListener('pointerup',e=>finish(e),{signal:controller.signal});
      document.addEventListener('pointercancel',e=>finish(e,true),{signal:controller.signal});
      listen('lostpointercapture',e=>finish(e,true));
    });
  }
  const eachRoot=(card,callback)=>card.querySelectorAll('[data-lab]').forEach(root=>callback(lifecycles.get(root)));
  const unmount=card=>eachRoot(card,lifecycle=>lifecycle?.dispose());
  const cancel=card=>card.querySelectorAll('[data-lab]').forEach(root=>{if(lifecycles.has(root)){lifecycles.get(root).cancelGesture();render(root);}});
  window.NOTE_LABS={mount,unmount,cancel,registry,register,ui:{btn,field,select,table,coach,output,office,tabs,dialog,paper,esc,number,money,patchRegions}};
})();
