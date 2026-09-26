/* Persistent presentation objects and settings, separated from fixed scenario comparisons. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,table,office,dialog,output,esc,number}=ui;
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const views=[['normal','普通视图'],['sorter','幻灯片浏览视图'],['notes','备注视图']];
  const viewLabel=key=>views.find(x=>x[0]===key)[1];
  register(['y2024q46'],'保存默认视图，再重新打开文稿验证','在文件、选项、高级的显示设置中选择视图；取消与确定的结果不同。',{
    saved:'normal',draft:'normal',view:'normal',pane:null,message:'当前与默认打开视图均为普通视图。'
  },s=>office('PowerPoint',s.pane?'文件 · 选项':'视图',
    btn('文件','file')+btn('重新打开文稿','reopen','',s.pane?'disabled':''),
    `<p>当前视图：<b>${viewLabel(s.view)}</b>；保存的默认值：${viewLabel(s.saved)}</p><div class="${s.view==='sorter'?'lab-mini-deck':'lab-slide'}">${s.view==='sorter'?'<div>1 · 开场</div><div>2 · 内容</div><div>3 · 总结</div>':s.view==='notes'?'<h3>1 · 开场</h3><hr><p>演讲者备注：介绍本次课程。</p>':'<h3>1 · 开场</h3><p>在普通视图编辑当前页。</p>'}</div>`+
    (s.pane==='file'?dialog('文件','<p>应用级设置在PowerPoint选项中。</p>',btn('选项','options')+btn('返回','cancel')):s.pane==='options'?dialog('PowerPoint选项','<p>显示设置属于“高级”。</p>',btn('高级','advanced')+btn('取消','cancel')):s.pane==='advanced'?dialog('高级 → 显示',select('draft','使用此视图打开所有文档',s.draft,views),btn('确定','save')+btn('取消','cancel')):''))+output(esc(s.message)),
    (s,a)=>{if(a==='file'){s.draft=s.saved;s.pane='file';}if(a==='options'&&s.pane==='file')s.pane='options';if(a==='advanced'&&s.pane==='options')s.pane='advanced';if(a==='save'&&s.pane==='advanced'){s.saved=s.draft;s.pane=null;s.message='默认视图已保存；重新打开文稿来验证。当前页面不因保存设置自动切换。';}if(a==='cancel'){s.pane=null;s.draft=s.saved;s.message='已退出，未保存的选择已放弃。';}if(a==='reopen'&&!s.pane){s.view=s.saved;s.message='重新打开后使用已保存的'+viewLabel(s.saved)+'。';}},(s,k,v)=>{if(s.pane==='advanced'&&k==='draft')s.draft=v;});

  const slideLayouts=[['content','标题和内容'],['caption','标题在下（自定义版式示意）']];
  register(['y2024q12'],'新建、复制、移动整页，再换版式检查内容','选择缩略图操作整页；移动保留身份，复制形成独立副本，版式改变内容的安排。',{
    docs:[{id:1,slides:[{id:1,title:'牡丹',body:'花开时节，观察花瓣与叶片。',layout:'content',offset:0},{id:2,title:'荷花',body:'比较不同花卉的生长环境。',layout:'content',offset:0}],selected:1}],doc:1,nextDoc:2,nextSlide:3,layoutPane:false,draftLayout:'content',message:'当前选中牡丹页。'
  },s=>{
    const doc=s.docs.find(d=>d.id===s.doc),slide=doc.slides.find(x=>x.id===doc.selected),i=doc.slides.indexOf(slide),caption=slide.layout==='caption';
    return `<div ${s.layoutPane?'inert':''}>`+controls(select('doc','演示文稿',s.doc,s.docs.map(d=>[d.id,'演示文稿'+d.id])))+office('PowerPoint','开始',btn('Ctrl+M · 新建幻灯片','new')+btn('Ctrl+D · 复制所选页','duplicate')+btn('Ctrl+N · 新建演示文稿','document')+btn('前移一页','up','',i===0?'disabled':'')+btn('后移一页','down','',i===doc.slides.length-1?'disabled':'')+btn('版式…','layout')+btn('重设占位符','resetLayout'),
      `<div class="lab-deck"><aside>${doc.slides.map((x,i)=>btn(`${i+1} · ${esc(x.title||'空白标题')}`,'page',x.id,`aria-pressed="${x.id===doc.selected}" data-slide-id="${x.id}"`)).join('')}</aside><div class="lab-slide" data-active-slide="${slide.id}" data-layout="${slide.layout}" style="display:flex;flex-direction:column;gap:12px"><p>页面对象 ${slide.id} · ${caption?'上下位置变化':'标题在上、正文在下'}</p><div data-placeholder="title" style="order:${caption?2:0};margin-left:${slide.offset}px">${field('title','标题占位符',slide.title)}</div><label data-placeholder="body" style="order:1">正文占位符<textarea data-field="body" rows="3">${esc(slide.body)}</textarea></label></div></div>`)+controls(btn('手动右移标题','offset'))+'</div>'+
      (s.layoutPane?dialog('选择本页版式',select('draftLayout','版式',s.draftLayout,slideLayouts)+'<p>本例仅改变已有两个占位符的位置，不模拟所有对象映射。</p>',btn('应用版式','applyLayout')+btn('取消','cancelLayout')):'')+output(esc(s.message))+`<p class="core-caption">本例新建页没有内容，采用示例的标题和内容版式；不据此断言Ctrl+M总插入“空白版式”。前移/后移是缩略图拖动的学习辅助。版式预览不是PowerPoint完整排版引擎；文字输入时保留文字编辑快捷键。</p>`;
  },(s,a,v)=>{
    const doc=s.docs.find(d=>d.id===s.doc),i=doc.slides.findIndex(x=>x.id===doc.selected);
    if(s.layoutPane){if(a==='cancelLayout'){s.layoutPane=false;s.draftLayout=doc.slides[i].layout;s.message='已取消，版式与内容保持。';}if(a==='applyLayout'){doc.slides[i].layout=s.draftLayout;doc.slides[i].offset=0;s.layoutPane=false;s.message='已应用版式，标题和正文的内容、页面身份保持。';}return;}
    if(a==='page'&&doc.slides.some(x=>x.id===Number(v)))doc.selected=Number(v);
    if(a==='new'||a==='duplicate'){const slide=a==='duplicate'?{...doc.slides[i],id:s.nextSlide++}:{id:s.nextSlide++,title:'',body:'',layout:'content',offset:0};doc.slides.splice(i+1,0,slide);doc.selected=slide.id;s.message=a==='duplicate'?'已复制所选页，副本可独立修改。':'已插入没有内容的新页，使用本例的标题和内容版式。';}
    if(a==='document'){const id=s.nextDoc++,slide={id:s.nextSlide++,title:'',body:'',layout:'content',offset:0};s.docs.push({id,slides:[slide],selected:slide.id});s.doc=id;s.message='已创建另一份文稿；上方可切回保留的原文稿。';}
    if(a==='up'||a==='down'){const to=i+(a==='up'?-1:1);if(to<0||to>=doc.slides.length)return;[doc.slides[i],doc.slides[to]]=[doc.slides[to],doc.slides[i]];s.message='已移动整页，仍选中同一页面对象，页数不变。';}
    if(a==='layout'){s.layoutPane=true;s.draftLayout=doc.slides[i].layout;}
    if(a==='offset')doc.slides[i].offset=Math.min(40,doc.slides[i].offset+10);
    if(a==='resetLayout'){doc.slides[i].offset=0;s.message='占位符恢复当前版式的位置，内容没有清空。';}
  },(s,k,v)=>{if(s.layoutPane){if(k==='draftLayout'&&slideLayouts.some(x=>x[0]===v))s.draftLayout=v;return;}if(k==='doc'&&s.docs.some(d=>d.id===Number(v)))s.doc=Number(v);else if(['title','body'].includes(k)){const d=s.docs.find(d=>d.id===s.doc);d.slides.find(x=>x.id===d.selected)[k]=v;}});
  registry.y2024q12.keydown=(s,e)=>{if(!e.ctrlKey||e.target.closest('input,textarea,select'))return false;const action={m:'new',d:'duplicate',n:'document'}[e.key.toLowerCase()];if(!action)return false;e.preventDefault();registry.y2024q12.action(s,action);return true;};

  register(['y2026q53'],'更换图源，检查同一个图片对象的效果','拖右下角调整大小，拖左侧裁剪柄改变可见区域；更换图片与删除后重插分别处理。',{
    object:1,source:'A',width:240,height:160,crop:0,animation:true,message:'对象1 · 原图A，已有淡入动画。图形仅代表图片内容。'
  },s=>office('PowerPoint','图片工具 · 格式',btn('更改图片','replace')+btn('删除后重新插入','reinsert')+btn('检查裁剪与动画','inspect'),
    `<div class="lab-picture-stage"><div class="lab-edit-picture" style="width:min(100%,${s.width}px);height:${s.height}px" aria-label="图片对象${s.object}"><div class="lab-picture-content" style="clip-path:inset(0 0 0 ${s.crop}%);background:${s.source==='A'?'#dacced':'#f2d0db'}"><b>${s.source==='A'?'原图A':'新图B'}</b><span>图片内容</span></div><button data-lab-drag="picture-crop" class="lab-crop-grip" aria-label="向右拖动裁剪左边界"></button><button data-lab-drag="picture-size" class="lab-resize-grip" aria-label="拖动调整图片大小"></button></div></div>`+
    controls(field('width','宽度（示例px）',s.width,'number','min="120" max="400"')+field('height','高度（示例px）',s.height,'number','min="100" max="260"')+field('crop','左侧裁剪（%）',s.crop,'range','min="0" max="65" step="1"'))+
    `<p>对象${s.object} · 图源${s.source} · 动画：<b>${s.animation?'淡入':'无'}</b> · 裁掉左侧 ${s.crop}%</p>`)+output(esc(s.message)),
    (s,a)=>{if(a==='replace'){s.source=s.source==='A'?'B':'A';s.message='只更换图源，仍是对象'+s.object+'，尺寸、裁剪与已有动画保留。实际替换后仍应核对效果。';}if(a==='reinsert'){s.object++;s.source='B';s.width=240;s.height=160;s.crop=0;s.animation=false;s.message='已建立新对象'+s.object+'，旧对象的动画和裁剪没有转移。';}if(a==='inspect')s.message=`当前对象${s.object}：图源${s.source}，${s.width}×${s.height}，左裁剪${s.crop}%，${s.animation?'淡入动画仍在':'没有动画'}。检查不会改变这些状态。`;},
    (s,k,v)=>{s[k]=Math.round(number(v,k==='width'?120:k==='height'?100:0,k==='width'?400:k==='height'?260:65));});
  registry.y2026q53.gesture=(s,g,root)=>{if(g.kind==='picture-size'){s.width=Math.round(number(s.width+g.endX-g.x,120,400));s.height=Math.round(number(s.height+g.endY-g.y,100,260));}if(g.kind==='picture-crop'){const width=root.querySelector('.lab-edit-picture').getBoundingClientRect().width||s.width;s.crop=Math.round(number(s.crop+(g.endX-g.x)/width*100,0,65));}s.message='图片对象的尺寸或裁剪已改变，图源与动画保持原状态。';};

  register(['y2024q26'],'旋转艺术字，再观察组合前后的共同移动','艺术字和矩形从开始就各自存在。选中两者才能组合，取消组合不删除成员。',{
    angle:0,text:'课程展示',grouped:false,selection:'both',art:{x:80,y:80},rect:{x:250,y:180},message:'两个独立对象已选中；可先顶端对齐，再组合移动。'
  },s=>office('PowerPoint','绘图工具 · 格式',btn(s.grouped?'取消组合':'组合','group')+btn('顶端对齐','align')+btn('向右移动','right')+btn('向左移动','left'),
    controls(select('selection',s.grouped?'取消组合后可另选移动对象':'选择对象',s.selection,[['art','艺术字'],['rect','矩形'],['both','艺术字和矩形']],s.grouped?'disabled':''))+
    `<svg class="lab-object-canvas" viewBox="0 0 420 280" style="width:100%;height:auto;display:block" role="img" aria-label="两个对象的位置与组合关系"><rect width="420" height="280" fill="#faf3f7"/>${s.grouped?`<rect data-group-boundary x="${Math.min(s.art.x,s.rect.x)-60}" y="${Math.min(s.art.y,s.rect.y)-30}" width="${Math.abs(s.art.x-s.rect.x)+120}" height="${Math.abs(s.art.y-s.rect.y)+60}" fill="none" stroke="#8161b0" stroke-dasharray="5 4"/>`:''}<g data-art-position data-x="${s.art.x}" data-y="${s.art.y}" transform="translate(${s.art.x},${s.art.y}) rotate(${s.angle})"><rect x="-60" y="-20" width="120" height="40" fill="none" stroke="#a386b7" stroke-dasharray="3 3"/><text text-anchor="middle" dominant-baseline="middle" fill="#713f79" font-size="14">${esc(s.text)}</text></g><rect data-rectangle-position data-x="${s.rect.x}" data-y="${s.rect.y}" x="${s.rect.x-40}" y="${s.rect.y-20}" width="80" height="40" fill="#cddced" stroke="#527eaa"/></svg>`+
    controls('<button data-lab-drag="rotate-art" style="touch-action:none" aria-label="拖动旋转艺术字，或使用角度输入框">拖动旋转艺术字</button>'+field('angle','单独编辑艺术字成员：角度' ,s.angle,'number','min="-180" max="180"')+field('text',s.grouped?'编辑组内艺术字':'编辑艺术字',s.text,'text','maxlength="8"')))+output(esc(s.message))+
    '<p class="core-caption">仅模拟这两个可组合对象的选择、顶端对齐、共同水平移动及成员文字/角度；文字上限8字，不模拟任意对象类型、组整体旋转和完整排列工具。组合时移动目标为整组，文字/角度输入只编辑艺术字成员。虚线仅表示组合关系，不是旋转后的精确选框；未把成员变成位图。</p>',
    (s,a)=>{
      if(a==='group'){if(s.grouped){s.grouped=false;s.message='已取消组合，两个成员及当前位置保留。';}else if(s.selection!=='both')s.message='本例须选中艺术字和矩形两个对象，单个对象不能组合。';else{s.grouped=true;s.message='两个对象已组合，共同移动时相对位置不变。';}}
      if(a==='align'){if(s.angle!==0){s.message='本例未模拟旋转后外框的对齐计算，请先将艺术字角度设回0°再比较；不表示PowerPoint不能对齐旋转对象。';return;}if(!s.grouped&&s.selection==='both'){s.art.y=s.rect.y=Math.min(s.art.y-20,s.rect.y-20)+20;s.message='两个对象顶端对齐；文字内容保持。';}else s.message='本例先取消组合并选择两个对象，再比较顶端对齐。';}
      if(a==='right'||a==='left'){const keys=s.grouped||s.selection==='both'?['art','rect']:[s.selection],want=a==='right'?20:-20,delta=want>0?Math.min(want,...keys.map(k=>340-s[k].x)):Math.max(want,...keys.map(k=>80-s[k].x));keys.forEach(k=>s[k].x+=delta);s.message=s.grouped?'组合成员共同移动，相对距离保持。':'移动了当前所选对象，未选对象位置保持。';}
    },
    (s,k,v)=>{if(k==='angle')s.angle=Math.round(number(v,-180,180));if(k==='text')s.text=v.slice(0,8);if(k==='selection'&&!s.grouped&&['art','rect','both'].includes(v))s.selection=v;});
  registry.y2024q26.gesture=(s,g,root)=>{if(g.kind!=='rotate-art')return;const r=root.querySelector('.lab-object-canvas').getBoundingClientRect(),x=r.left+(r.width||420)*s.art.x/420,y=r.top+(r.height||280)*s.art.y/280;let angle=Math.atan2(g.endY-y,g.endX-x)*180/Math.PI+90;angle=((angle+540)%360)-180;s.angle=Math.round(g.shiftKey?Math.round(angle/15)*15:angle);s.message=`已旋转到${s.angle}°${g.shiftKey?'，按15°步长对齐':''}，内容仍可编辑。`;};
})();
