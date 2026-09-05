/* PowerPoint models use independent source slides, selection and playback state. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,table,coach,output,office,dialog,esc}=ui;
  const clone=x=>structuredClone(x);
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const check=(k,label,v)=>`<label><input type="checkbox" data-field="${k}" ${v?'checked':''}>${label}</label>`;
  const themes={pink:{name:'樱粉',bg:'#fff1f6',ink:'#824566',accent:'#b66494',font:'sans-serif'},violet:{name:'紫藤',bg:'#f0eafb',ink:'#583f82',accent:'#8161b0',font:'serif'},blue:{name:'晴空',bg:'#ecf5ff',ink:'#365a80',accent:'#5083af',font:'sans-serif'}};
  const newSlides=()=>['课程导览','数据与信息','备用案例','本章总结'].map((title,i)=>({id:i+1,title,body:['认识概念，理解操作。','同一数据可以在不同情境表达信息。','需要时再展示的补充内容。','先确定操作对象，再核对作用范围。'][i],hidden:false,object:true,theme:'pink'}));
  const canvas=(slide,body='',extra='')=>`<div class="core-slide" ${extra}><h4>${esc(slide?.title||'没有幻灯片')}</h4>${body}</div>`;
  const thumbs=(slides,selected,act='page')=>`<div class="core-thumbnails" aria-label="幻灯片缩略图">${slides.map((x,i)=>btn(`<span class="${x.hidden?'core-hidden-number':''}">${i+1}</span> ${esc(x.title)}${x.hidden?'<small>隐藏</small>':''}`,act,x.id,`aria-pressed="${Array.isArray(selected)?selected.includes(x.id):selected===x.id}"`)).join('')}</div>`;

  register(['y2020q12'],'先选操作对象，再隐藏、删除或放映','任意选择一页或页内对象；删除结果跟随选区，隐藏页会被常规放映跳过。',{
    slides:newSlides(),selected:1,target:'slide',show:false,playing:null,undo:[],message:'当前选中第1页缩略图。选中页内对象后，Delete只删除对象。'
  },s=>{
    const active=s.slides.find(x=>x.id===(s.show?s.playing:s.selected));
    const path=s.slides.filter(x=>!x.hidden);
    let stage=s.show?canvas(active,active?.object?`<p>${esc(active.body)}</p>`:''):
      canvas(active,active?.object?`<button class="core-slide-object ${s.target==='object'?'lab-selected':''}" data-lab-act="object">${esc(active.body)}</button>${s.target==='object'?`<label>编辑对象文字<textarea data-field="body" rows="2">${esc(active.body)}</textarea></label>`:''}`:'<p class="core-empty">本页对象已删除，幻灯片仍在。</p>');
    if(!active)stage='<p class="core-empty">没有可显示的幻灯片。</p>';
    return office('PowerPoint',s.show?'幻灯片放映':'开始',s.show?btn('结束放映','end'):btn('幻灯片放映 → 隐藏幻灯片','hide','',active?'':'disabled')+btn('从头开始','show','',path.length?'':'disabled'),
      `${s.show?'':thumbs(s.slides,s.target==='slide'?s.selected:null)}${stage}`)+
      controls(s.show?btn('下一页','next')+select('jump','放映导航：选择幻灯片',s.playing,s.slides.map(x=>[x.id,x.title+(x.hidden?'（隐藏）':'')])):btn('模拟 Delete','delete','',active?'':'disabled')+btn('撤销删除或隐藏','undo','',s.undo.length?'':'disabled'))+
      output(s.message)+`<p class="core-caption">源文稿 ${s.slides.length} 页；常规播放顺序：${path.map(x=>esc(x.title)).join(' → ')||'没有可播放页'}</p>`+coach('先点缩略图，再Delete会删除整页；先点页内对象，再Delete只删对象。文字框内的Delete按光标或选区删除文字。隐藏只改变常规播放资格，放映导航仍可访问该页。');
  },(s,a,v)=>{
    const current=()=>s.slides.find(x=>x.id===s.selected);
    const remember=()=>s.undo.push({slides:clone(s.slides),selected:s.selected,target:s.target});
    if(a==='page'){s.selected=Number(v);s.target='slide';s.message=`已选中“${current()?.title}”的缩略图。`;}
    if(a==='object'){s.target='object';s.message='已选中页内文本对象，Delete将删除这个对象。';}
    if(a==='hide'&&current()){remember();current().hidden=!current().hidden;s.message=`“${current().title}”${current().hidden?'已隐藏，仍保留在文件中':'已取消隐藏'}。`;}
    if(a==='delete'&&current()){
      remember();if(s.target==='object'){current().object=false;s.message='只删除了页内对象，页数没有减少。';}
      else{const at=s.slides.findIndex(x=>x.id===s.selected),name=current().title;s.slides.splice(at,1);s.selected=s.slides[Math.min(at,s.slides.length-1)]?.id??null;s.message=`已删除“${name}”整页，剩余 ${s.slides.length} 页。`;}
      s.target='slide';
    }
    if(a==='undo'&&s.undo.length){Object.assign(s,s.undo.pop());s.message='已恢复上一步删除或隐藏前的状态。';}
    if(a==='show'){s.playing=s.slides.find(x=>!x.hidden)?.id??null;s.show=s.playing!==null;s.message=s.show?'正在从头放映，隐藏页不会出现在常规顺序中。':'没有未隐藏的幻灯片。';}
    if(a==='next'){const at=s.slides.findIndex(x=>x.id===s.playing),next=s.slides.slice(at+1).find(x=>!x.hidden);if(next){s.playing=next.id;s.message='正在放映：'+next.title;}else{s.show=false;s.message='放映结束，源文稿与隐藏状态保持不变。';}}
    if(a==='end'){s.show=false;s.message='已结束放映。';}
  },(s,k,v)=>{if(k==='body'){const x=s.slides.find(x=>x.id===s.selected);if(x)x.body=v;}if(k==='jump'){s.playing=Number(v);s.message='通过放映导航访问所选页面，不更改它的隐藏状态。';}});
  registry.y2020q12.keydown=(s,e)=>{if(e.key==='Delete'&&!s.show&&!e.target.closest('input,textarea,select')){e.preventDefault();registry.y2020q12.action(s,'delete');return true;}if(e.key==='Escape'&&s.show){e.preventDefault();registry.y2020q12.action(s,'end');return true;}};

  const masterSlides=[{id:1,title:'课程封面',master:'A',layout:'title'},{id:2,title:'基础概念',master:'A',layout:'content'},{id:3,title:'操作方法',master:'A',layout:'content'},{id:4,title:'拓展阅读',master:'B',layout:'content'},{id:5,title:'复习封面',master:'B',layout:'title'}];
  register(['y2020q11'],'改母版或版式，观察哪些页面继承','选择母版树的不同节点修改固定文字；五页预览始终同时显示各自归属。',{
    mode:'normal',node:'A',page:2,master:{A:'计算机笔记',B:'拓展资料'},layout:{'A/title':'复习导览','A/content':'学习要点','B/title':'附录','B/content':'延伸阅读'},colors:{A:'#b66494',B:'#6285b4'},hide:{},message:'第1—3页属于母版A，第4—5页属于母版B。'
  },s=>{
    const selected=masterSlides.find(x=>x.id===s.page),parts=s.node.split('/'),text=parts.length===1?s.master[s.node]:s.layout[s.node];
    const previews=masterSlides.map(x=>`<section class="core-master-preview"><p>${x.id} · 母版${x.master} / ${x.layout==='title'?'标题幻灯片':'标题和内容'}</p>${canvas(x,`${s.hide[x.id]?'':`<span class="core-master-logo" style="color:${s.colors[x.master]}">${esc(s.master[x.master])}</span><p class="core-layout-text">${esc(s.layout[x.master+'/'+x.layout])}</p>`}<p class="core-local-text">本页自己的内容 ${x.id}</p>`)}${btn('选择第'+x.id+'页','page',x.id,`aria-pressed="${s.page===x.id}"`)}</section>`).join('');
    return office('PowerPoint',s.mode==='normal'?'视图':'幻灯片母版',btn(s.mode==='normal'?'幻灯片母版':'关闭母版视图','view'),
      (s.mode==='master'?`<div class="core-master-tree" aria-label="母版和版式">${['A','B'].map(m=>`<section>${btn('母版 '+m,'node',m,`aria-pressed="${s.node===m}"`)}${['title','content'].map(l=>btn('↳ '+(l==='title'?'标题幻灯片':'标题和内容'),'node',m+'/'+l,`aria-pressed="${s.node===m+'/'+l}"`)).join('')}</section>`).join('')}</div><div class="core-master-editor"><b>当前编辑：${parts.length===1?'母版'+s.node:'母版'+parts[0]+'的'+(parts[1]==='title'?'标题':'内容')+'版式'}</b><label>固定文本框<textarea data-field="masterText" rows="2">${esc(text)}</textarea></label></div>`:`<p>普通视图 · 当前第${s.page}页。继承的固定文本不能在普通页中直接选取。</p>`)+`<div class="core-master-grid">${previews}</div>`)+
      controls(select('color','学习编辑器：母版 '+parts[0]+' 的标识颜色',s.colors[parts[0]],[['#b66494','樱粉'],['#6285b4','晴空'],['#7d5fa4','紫藤']])+check('hide','第'+s.page+'页：隐藏背景图形',!!s.hide[s.page]))+
      output(s.message)+coach('本卡片修改的是母版或版式上的普通固定文本，不是占位符结构。隐藏背景图形后，本页自己创建的对象仍保留。改占位符布局后，已有页面可能还需重新应用版式。');
  },(s,a,v)=>{if(a==='view')s.mode=s.mode==='normal'?'master':'normal';if(a==='node'){s.node=v;s.message=v.includes('/')?'正在修改指定版式，只影响使用该版式的页面。':'正在修改母版'+v+'，另一组母版的页面不会跟着改变。';}if(a==='page')s.page=Number(v);},
  (s,k,v)=>{if(k==='masterText'){if(s.node.includes('/'))s.layout[s.node]=v;else s.master[s.node]=v;s.message='固定文字已改变，下面各页按其母版与版式归属继承。';}if(k==='color'){s.colors[s.node.split('/')[0]]=v;s.message='已修改该母版标识的颜色。';}if(k==='hide'){s.hide[s.page]=v;s.message=`第${s.page}页${v?'隐藏':'显示'}继承的背景图形，本页自己的内容保留。`;}});

  register(['y2020q53'],'自己多选页面，再限定主题应用范围','按 Ctrl 多选或启用触屏辅助；主题可右击或长按，打开“应用于选定幻灯片”。',{
    slides:newSlides(),selected:[1],active:1,assist:false,theme:'violet',menu:false,background:null,message:'先任意选择目标页面；主题左键单击与菜单的选定范围要分清。'
  },s=>{
    const slide=s.slides.find(x=>x.id===s.active),t=themes[slide.theme];
    return controls(check('assist','辅助多选（作用等同按住 Ctrl）',s.assist)+select('theme','键盘或触屏菜单目标',s.theme,Object.entries(themes).map(([k,v])=>[k,v.name]))+btn('打开主题菜单','menu'))+
      office('PowerPoint','设计',`<div class="core-theme-gallery">${Object.entries(themes).map(([k,t])=>btn(t.name,'allTheme',k,`data-lab-drag="hold" data-theme="${k}" style="border-bottom:5px solid ${t.accent}"`)).join('')}</div>`+
      (s.menu?`<div class="lab-context-menu" aria-label="主题菜单"><b>${themes[s.theme].name}</b>${btn('应用于选定幻灯片','selectedTheme','',s.selected.length?'':'disabled')}${btn('应用于所有幻灯片','allTheme',s.theme)}${btn('取消','cancel')}</div>`:''),
      `${thumbs(s.slides,s.selected)}${canvas(slide,`<p>${esc(slide.body)}</p><p class="core-caption">主题：${t.name} · ${t.font==='serif'?'衬线字体':'无衬线字体'}</p>`,`style="background:${slide.background||t.bg};color:${t.ink};font-family:${t.font};border-top:7px solid ${t.accent}"`)}${table(['页面','主题','独立背景'],s.slides.map(x=>[x.id,themes[x.theme].name,x.background?'已单独修改':'跟随主题']))}`)+
      controls(btn('对照：只改当前页背景','background'))+output(s.message)+coach('左键点击主题在本例应用到全部页面；要明确限定范围，请右击、长按或用外部辅助入口选择“应用于选定幻灯片”。主题会改变颜色、字体与效果；这里只用颜色、字体和装饰样式呈现这些差别。');
  },(s,a,v)=>{
    if(a==='page'){const id=Number(v);if(s.assist||s._ctrl){s.selected=s.selected.includes(id)?s.selected.filter(x=>x!==id):[...s.selected,id];}else s.selected=[id];s.active=id;s.message='已选页：'+(s.selected.join('、')||'无')+'。';}
    if(a==='menu')s.menu=true;if(a==='cancel')s.menu=false;
    if(a==='allTheme'||a==='selectedTheme'){const theme=a==='allTheme'?v:s.theme;s.slides.filter(x=>a==='allTheme'||s.selected.includes(x.id)).forEach(x=>{x.theme=theme;delete x.background;});s.menu=false;s.message=`已将“${themes[theme].name}”应用于${a==='allTheme'?'全部页面':'第'+s.selected.join('、')+'页'}。`;}
    if(a==='background'){s.slides.find(x=>x.id===s.active).background='#fffbe9';s.message='只改当前页背景色，主题字体及强调色保持原值。';}
  });
  registry.y2020q53.afterRender=(s,root)=>root.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('pointerdown',()=>{s.theme=b.dataset.theme;}));

  const showTitles=['开场','数据','结论'];
  register(['y2026q55'],'编辑放映清单，再按它真正播放','从源页添加、移除或调整顺序；取消不会覆盖已保存的方案。',{
    pane:'none',saved:[0,1,2],draft:[],source:0,selected:0,page:0,show:false,playing:0,message:'源文稿始终保留3张幻灯片。'
  },s=>{
    const id=s.show?s.saved[s.playing]:s.page;
    const content=canvas({title:showTitles[id]},`<p>源幻灯片 ${id+1} · ${['欢迎进入计算机复习。','比较实际结果，理解操作范围。','回顾本次放映的要点。'][id]}</p>`);
    const edit=dialog('定义自定义放映',`<div class="core-show-editor"><section><h4>源幻灯片</h4>${showTitles.map((t,i)=>btn(t,'source',i,`aria-pressed="${s.source===i}"`)).join('')}${btn('添加 →','add')}</section><section><h4>自定义放映中的幻灯片</h4>${s.draft.map((x,i)=>btn(`${i+1}. ${showTitles[x]}`,'select',i,`aria-pressed="${s.selected===i}"`)).join('')}${controls(btn('上移','up','',s.selected>0?'':'disabled')+btn('下移','down','',s.selected<s.draft.length-1?'':'disabled')+btn('移除','remove','',s.draft.length?'':'disabled'))}</section></div>`,btn('确定','save','',s.draft.length?'':'disabled')+btn('取消','cancel'));
    return office('PowerPoint','幻灯片放映',btn(s.show?'结束放映':'自定义幻灯片放映','open','',s.pane!=='none'?'disabled':''),`<div ${s.pane!=='none'?'inert':''}>${s.show?'':thumbs(showTitles.map((title,id)=>({id,title})),s.page)}${content}</div>`+
      (s.pane==='manage'?dialog('自定义放映',`<p>已保存：${s.saved.map(i=>showTitles[i]).join(' → ')}</p>`,btn('编辑…','edit')+btn('放映','show','',s.saved.length?'':'disabled')+btn('关闭','close')):s.pane==='edit'?edit:''))+
      (s.show?controls(btn('上一页','previous','',s.playing?'':'disabled')+btn('下一页','next')):'')+output(s.message)+coach('右侧清单只保存对源页的引用及顺序。相同源页可重复加入；这不会复制源幻灯片。放映结束后，普通视图的真实页序仍是开场、数据、结论。');
  },(s,a,v)=>{
    if(a==='open'){if(s.show){s.show=false;s.message='已结束自定义放映。';}else s.pane='manage';}
    if(a==='page')s.page=Number(v);if(a==='edit'){s.draft=[...s.saved];s.selected=0;s.pane='edit';}
    if(a==='source')s.source=Number(v);if(a==='select')s.selected=Number(v);
    if(a==='add'){s.draft.push(s.source);s.selected=s.draft.length-1;}
    if(a==='remove'){s.draft.splice(s.selected,1);s.selected=Math.max(0,Math.min(s.selected,s.draft.length-1));}
    if(a==='up'&&s.selected>0){[s.draft[s.selected-1],s.draft[s.selected]]=[s.draft[s.selected],s.draft[s.selected-1]];s.selected--;}
    if(a==='down'&&s.selected<s.draft.length-1){[s.draft[s.selected+1],s.draft[s.selected]]=[s.draft[s.selected],s.draft[s.selected+1]];s.selected++;}
    if(a==='save'&&s.draft.length){s.saved=[...s.draft];s.pane='manage';s.message='新方案已保存在当前文件中，源页顺序没有改变。';}
    if(a==='cancel')s.pane='manage';if(a==='close')s.pane='none';
    if(a==='show'&&s.saved.length){s.pane='none';s.show=true;s.playing=0;s.message='正在按已保存的自定义顺序放映。';}
    if(a==='previous')s.playing=Math.max(0,s.playing-1);
    if(a==='next'){if(s.playing<s.saved.length-1)s.playing++;else{s.show=false;s.message='自定义放映结束，源幻灯片仍全部保留。';}}
  });
  const baseDate=new Date(2026,8,5);
  const dateLabel=day=>{const d=new Date(baseDate);d.setDate(d.getDate()+day);return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;};
  const footerDefaults={footer:false,number:false,date:false,hideTitle:false,kind:'fixed',text:'课程笔记',fixed:'2026/9/5'};
  register(['y2024q65'],'标题版式不一定在第1页，编号也不会重排','把任意一页切成标题版式；应用页脚后观察标题页隐藏规则和固定日期。',{
    pane:false,page:0,day:0,layouts:['content','title','content'],applied:[null,null,null],draft:footerDefaults,message:'第2页使用标题版式，第1页使用内容版式。'
  },s=>{
    const a=s.applied[s.page],hidden=a?.hideTitle&&s.layouts[s.page]==='title';
    return office('PowerPoint','插入',btn('页眉和页脚','open','',s.pane?'disabled':''),`<div ${s.pane?'inert':''}>${thumbs(showTitles.map((title,id)=>({title,id})),s.page)}${canvas({title:showTitles[s.page]},`<p>第${s.page+1}页 · ${s.layouts[s.page]==='title'?'标题幻灯片':'标题和内容'}版式</p><div class="core-slide-footer">${a&&!hidden?`${a.date?'<span>'+esc(a.kind==='auto'?dateLabel(s.day):a.fixed)+'</span>':''}${a.footer?'<span>'+esc(a.text)+'</span>':''}${a.number?'<span data-slide-number>'+String(s.page+1)+'</span>':''}`:''}</div>`)}</div>`+
      (s.pane?dialog('页眉和页脚',check('date','日期和时间',s.draft.date)+select('kind','日期方式',s.draft.kind,[['fixed','固定'],['auto','自动更新']])+(s.draft.kind==='fixed'?field('fixed','固定日期文字',s.draft.fixed):'')+check('number','幻灯片编号',s.draft.number)+check('footer','页脚',s.draft.footer)+field('text','页脚文字',s.draft.text)+check('hideTitle','标题幻灯片中不显示',s.draft.hideTitle),btn('应用','apply')+btn('全部应用','all')+btn('取消','cancel')):''))+
      `<fieldset class="core-controls" ${s.pane?'disabled':''}>`+controls(select('layout','当前页版式（模拟“开始 → 版式”）',s.layouts[s.page],[['content','标题和内容'],['title','标题幻灯片']])+btn('学习时钟：推进一天','day','',s.pane?'disabled':''))+'</fieldset>'+output(s.message)+coach('标题幻灯片由版式决定，可以不在第一页。“标题幻灯片中不显示”隐藏日期、页脚、编号的显示，不会重新排列源页编号。固定日期是保存的文字；自动日期随本例时钟更新。');
  },(s,a,v)=>{if(a==='page'&&!s.pane)s.page=Number(v);if(a==='open'){s.draft=clone(s.applied[s.page]||footerDefaults);s.pane=true;}if(a==='cancel')s.pane=false;if(a==='apply'||a==='all'){s.applied=s.applied.map((old,i)=>a==='all'||i===s.page?clone(s.draft):old);s.pane=false;s.message=a==='all'?'设置已应用到3页，分别按各页版式判断是否显示。':'只更新当前第'+(s.page+1)+'页。';}if(a==='day')s.day++;},(s,k,v)=>{if(s.pane)s.draft[k]=v;else if(k==='layout')s.layouts[s.page]=v;});

  function rehearsalUpdate(s,now){
    if(!['rehearse','play'].includes(s.phase)||s.paused)return false;
    const delta=Math.max(0,now-s.last)/1000;s.last=now;s.elapsed+=delta;
    if(s.phase==='play'&&s.useTiming&&s.saved&&s.saved[s.page]!==null&&s.elapsed>=s.saved[s.page]){
      if(s.page<2){s.elapsed=0;s.page++;}else{s.phase='idle';s.elapsed=0;s.message='已按保存的排练时间自动放映完毕。';}
    }
    return true;
  }
  register(['y2023q13'],'记录、保存，再采用或忽略排练时间','每页停留时间由真实时钟记录；保存后可按计时自动放映，也可改为手动。',{
    phase:'idle',page:0,elapsed:0,times:[null,null,null],saved:null,paused:false,last:0,useTiming:true,message:'尚未排练。'
  },s=>{
    const total=s.times.slice(0,s.page).reduce((n,x)=>n+x,0)+s.elapsed;
    return office('PowerPoint','幻灯片放映',s.phase==='idle'?btn('排练计时','start')+btn('从头开始','play','',s.saved?'':'disabled'):s.phase==='rehearse'?btn(s.paused?'继续':'暂停','pause')+btn('下一页','next','',s.paused?'disabled':'')+btn('结束排练','finish'):s.phase==='play'?btn('下一页','next')+btn('结束放映','stop'):'',
      `${canvas({title:showTitles[s.page]},`<p>${['开场：今天复习什么？','数据：观察操作前后结果。','总结：把关键边界说清楚。'][s.page]}</p>`)}<p class="core-clock">${s.phase==='rehearse'?'排练':s.phase==='play'?'正式放映':'当前'} · 本页 ${s.elapsed.toFixed(1)} 秒${s.phase==='rehearse'?' · 累计 '+total.toFixed(1)+' 秒':''}${s.paused?'（已暂停）':''}</p>`+
      (s.phase==='confirm'?dialog('是否保留排练计时？',table(['页面','本次排练'],s.times.map((t,i)=>[showTitles[i],t===null?'本次未排练':t.toFixed(1)+' 秒'])),btn('是','save')+btn('否','discard')):''))+
      controls(check('useTiming','正式放映使用已保存的计时',s.useTiming))+table(['幻灯片','已保存的时间'],showTitles.map((x,i)=>[x,s.saved&&s.saved[i]!==null?s.saved[i].toFixed(1)+' 秒':'未计时']))+output(s.message)+coach('暂停期间不增加时长。关闭“使用计时”保留原数据，只使正式放映等待手动换页；结束时选择不保留，不会覆盖此前已保存的计时。');
  },(s,a)=>{
    const now=Date.now(),beforePage=s.page,beforePhase=s.phase;rehearsalUpdate(s,now);
    if(a==='next'&&beforePhase==='play'&&(s.page!==beforePage||s.phase!==beforePhase))return;
    if(a==='start'){Object.assign(s,{phase:'rehearse',page:0,elapsed:0,times:[null,null,null],paused:false,last:now,message:'排练已开始，可以实际等待、暂停或换页。'});}
    if(a==='pause'&&s.phase==='rehearse'){s.paused=!s.paused;s.last=now;}
    if(a==='next'&&s.phase==='rehearse'&&!s.paused){s.times[s.page]=s.elapsed;if(s.page<2){s.page++;s.elapsed=0;s.last=now;}else{s.phase='confirm';s.message='排练结束，决定是否保存本次计时。';}}
    if(a==='finish'&&s.phase==='rehearse'){s.times[s.page]=s.elapsed;s.phase='confirm';s.paused=false;s.message='未排练页会保留先前计时；若原来未计时，正式放映时等待手动前进。';}
    if(a==='save'&&s.phase==='confirm'){s.saved=s.times.map((t,i)=>t===null?s.saved?.[i]??null:t);s.phase='idle';s.elapsed=0;s.message='已保存本次计时。点击“从头开始”检验正式放映。';}
    if(a==='discard'&&s.phase==='confirm'){s.phase='idle';s.elapsed=0;s.message='本次计时未保存，先前保存的计时保留。';}
    if(a==='play'&&s.saved){Object.assign(s,{phase:'play',page:0,elapsed:0,paused:false,last:now});s.message=s.useTiming?'正式放映将按已保存的各页时间自动前进。':'正式放映忽略计时，等待手动换页。';}
    if(a==='next'&&s.phase==='play'){if(s.page<2){s.page++;s.elapsed=0;s.last=now;}else{s.phase='idle';s.message='正式放映结束。';}}
    if(a==='stop'){s.phase='idle';s.elapsed=0;s.message='已结束正式放映，保存的计时没有删除。';}
  });
  registry.y2023q13.tick=s=>rehearsalUpdate(s,Date.now());

  const timingDefaults={effect:'fade',duration:0.6,click:true,auto:false,after:2};
  function startSlide(s,id,now){s.current=id;s.phase=s.settings[id].effect==='none'?'slide':'transition';s.phaseStart=now;s.clock=0;s.animStart=null;s.show=true;s.message='进入第'+(id+1)+'页，使用目标页的切换设置。';}
  function animEnd(s){return Math.max(s.firstDuration,(s.secondStart==='with'?0:s.firstDuration)+s.delay+s.secondDuration);}
  function timelineUpdate(s,now){
    if(!s.show)return false;
    s.clock=Math.max(0,(now-s.phaseStart)/1000);
    if(s.phase==='transition'&&s.clock>=(s.settings[s.current].effect==='none'?0:s.settings[s.current].duration)){s.phase='slide';s.phaseStart=now;s.clock=0;s.animStart=null;}
    if(s.phase==='slide'){
      const ready=s.current!==1?0:s.animStart===null?null:s.animStart+animEnd(s);
      if(ready!==null&&s.settings[s.current].auto&&s.clock>=ready+s.settings[s.current].after){if(s.current<2)startSlide(s,s.current+1,now);else{s.show=false;s.message='按自动换片条件播放完毕。';}}
    }
    return true;
  }
  register(['merged-11'],'真正计时：过渡、对象动画、换片各管一段','选择页面设置进入过渡，再改变第2页两对象的先后关系；放映会按实际时间推进。',{
    editPage:1,settings:[clone(timingDefaults),clone(timingDefaults),clone(timingDefaults)],firstDuration:1,secondStart:'after',secondDuration:1,delay:0.5,show:false,current:0,phase:'slide',phaseStart:0,clock:0,animStart:null,message:'第2页的标题等待单击；图形可与标题同时或在标题之后开始。'
  },s=>{
    const setting=s.settings[s.editPage],page=s.show?s.current:s.editPage;
    let first=1,second=1,transition=1,status='编辑状态';
    if(s.show){transition=s.phase==='transition'?Math.min(1,s.clock/Math.max(.01,s.settings[page].duration)):1;if(s.phase==='transition'){first=second=page===1?0:1;status='整页切换中';}else if(page===1){const elapsed=s.animStart===null?-1:s.clock-s.animStart,secondAt=(s.secondStart==='with'?0:s.firstDuration)+s.delay;first=Math.max(0,Math.min(1,elapsed/s.firstDuration));second=Math.max(0,Math.min(1,(elapsed-secondAt)/s.secondDuration));status=s.animStart===null?'等待单击，启动标题动画':elapsed<animEnd(s)?'对象动画进行中':s.settings[page].auto?'动画结束，等待自动换片':'动画结束，等待换页';}else status=s.settings[page].auto?'等待自动换片':'等待单击换页';}
    const style=s.show&&s.settings[page].effect==='push'?`transform:translateX(${(1-transition)*100}%);`:s.show?`opacity:${transition};`:'';
    const stage=`<div class="core-stage-window"><div class="core-slide core-timed-slide" ${s.show?'data-lab-act="screen" role="button" tabindex="0" aria-label="单击放映画面"':''} style="${style}"><h4 style="opacity:${first}">${showTitles[page]}</h4>${page===1?`<div class="core-animation-object" style="opacity:${second};transform:translateX(${(1-second)*65}px)">数据图形</div><p>标题淡入；图形飞入</p>`:`<p>${page===0?'单击进入第2页，观察它自己的进入切换。':'已到总结页，动作按钮真正改变了当前页面。'}</p>`}${s.show&&page===1?btn('转到总结','jump'):''}</div></div>`;
    return (s.show?'':controls(select('editPage','设置哪一页',s.editPage,showTitles.map((x,i)=>[i,`第${i+1}页 ${x}`]))))+
      office('PowerPoint',s.show?'幻灯片放映':'切换',s.show?'':select('effect','进入切换',setting.effect,[['none','无'],['fade','淡化'],['push','推进']])+field('duration','持续时间（秒）',setting.duration,'number','min="0.2" max="5" step="0.2"')+check('click','单击鼠标时换片',setting.click)+check('auto','设置自动换片时间',setting.auto)+field('after','动画结束后换片等待（秒）',setting.after,'number','min="0" max="10" step="0.5"'),stage)+
      (s.show?controls(btn('单击放映画面','screen')+btn('结束放映','stop')):controls(field('firstDuration','第2页标题动画时长（秒）',s.firstDuration,'number','min="0.2" max="5" step="0.2"')+select('secondStart','第2页图形开始方式',s.secondStart,[['with','与上一动画同时'],['after','上一动画之后']])+field('delay','图形延迟（秒）',s.delay,'number','min="0" max="5" step="0.5"')+field('secondDuration','图形动画时长（秒）',s.secondDuration,'number','min="0.2" max="5" step="0.2"')+btn('从头放映本例','start')))+
      (s.show?`<p class="core-clock">第${page+1}页 · ${s.clock.toFixed(1)}秒 · ${status}</p>`:table(['第2页动画','开始条件','持续时间'],[['标题','单击时',s.firstDuration+'秒'],['图形',s.secondStart==='with'?'同一单击启动组 + 延迟'+s.delay+'秒':'标题完成 + 延迟'+s.delay+'秒',s.secondDuration+'秒']]))+
      output(s.message)+coach('上方“持续时间”控制进入所选页的过渡；自动换片时间从本页动画完成后计算。两对象时序控件是卡片外的学习编辑器。放映画面中的“转到总结”模拟单击动作，直接跳转到第3页。');
  },(s,a)=>{
    const now=Date.now(),before=s.current,wasShowing=s.show;timelineUpdate(s,now);
    if(a==='screen'&&wasShowing&&(s.current!==before||!s.show))return;
    if(a==='start')startSlide(s,0,now);
    if(a==='stop'){s.show=false;s.message='结束放映，页面设置仍保留。';}
    if(a==='jump'&&s.show)startSlide(s,2,now);
    if(a==='screen'&&s.show&&s.phase==='slide'){
      if(s.current===1&&s.animStart===null){s.animStart=s.clock;s.message='单击启动标题动画；图形按设定的同时或之后关系运行。';}
      else if(s.current===1&&s.clock-s.animStart<animEnd(s)){s.message='本例请观察当前动画完成；学习模型不模拟单击快进动画。';}
      else if(s.settings[s.current].click){if(s.current<2)startSlide(s,s.current+1,now);else{s.show=false;s.message='放映结束。';}}
      else s.message='该页关闭了单击换片；若自动换片也关闭，可结束放映后调整设置。';
    }
  },(s,k,v)=>{
    if(k==='editPage'){s.editPage=Number(v);return;}
    const numeric={duration:[.2,5],after:[0,10],firstDuration:[.2,5],secondDuration:[.2,5],delay:[0,5]};
    if(numeric[k]){const [min,max]=numeric[k];v=Math.max(min,Math.min(max,Number(v)||min));}
    if(['effect','duration','click','auto','after'].includes(k))s.settings[s.editPage][k]=v;else s[k]=v;
  });
  registry['merged-11'].tick=s=>timelineUpdate(s,Date.now());
  registry['merged-11'].tickInterval=50;
  registry['merged-11'].keydown=(s,e)=>{if(s.show&&(e.key==='Escape'||!e.target.closest('button,input,textarea,select'))&&[' ','ArrowRight','Enter','Escape'].includes(e.key)){e.preventDefault();registry['merged-11'].action(s,e.key==='Escape'?'stop':'screen');return true;}};
})();
