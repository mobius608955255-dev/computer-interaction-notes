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

  register(['y2024q12'],'新建空白页与复制所选页，结果逐次保留','选择缩略图，再按Ctrl+M或Ctrl+D；Ctrl+N创建另一份文稿，可切回原文稿。',{
    docs:[{id:1,slides:[{id:1,title:'牡丹',body:'花开时节，观察花瓣与叶片。'},{id:2,title:'荷花',body:'比较不同花卉的生长环境。'}],selected:1}],doc:1,nextDoc:2,nextSlide:3,message:'当前选中牡丹页。'
  },s=>{
    const doc=s.docs.find(d=>d.id===s.doc),slide=doc.slides.find(x=>x.id===doc.selected);
    return controls(select('doc','演示文稿',s.doc,s.docs.map(d=>[d.id,'演示文稿'+d.id])))+office('PowerPoint','开始',btn('Ctrl+M · 新建幻灯片','new')+btn('Ctrl+D · 复制所选页','duplicate')+btn('Ctrl+N · 新建演示文稿','document'),
      `<div class="lab-deck"><aside>${doc.slides.map((x,i)=>btn(`${i+1} · ${esc(x.title||'空白标题')}`,'page',x.id,`aria-pressed="${x.id===doc.selected}"`)).join('')}</aside><div class="lab-slide">${field('title','标题',slide.title)}<label>正文<textarea data-field="body" rows="3">${esc(slide.body)}</textarea></label></div></div>`)+output(esc(s.message))+`<p class="core-caption">本例快捷键作用于幻灯片缩略图选择。文字输入框内保留文字编辑键盘行为。</p>`;
  },(s,a,v)=>{
    const doc=s.docs.find(d=>d.id===s.doc),i=doc.slides.findIndex(x=>x.id===doc.selected);
    if(a==='page')doc.selected=Number(v);
    if(a==='new'||a==='duplicate'){const slide=a==='duplicate'?{...doc.slides[i],id:s.nextSlide++}:{id:s.nextSlide++,title:'',body:''};doc.slides.splice(i+1,0,slide);doc.selected=slide.id;s.message=a==='duplicate'?'已复制所选页的标题与正文。':'已插入空白的新页，没有复制原页内容。';}
    if(a==='document'){const id=s.nextDoc++,slide={id:s.nextSlide++,title:'',body:''};s.docs.push({id,slides:[slide],selected:slide.id});s.doc=id;s.message='已创建另一份文稿；上方可切回保留的原文稿。';}
  },(s,k,v)=>{if(k==='doc')s.doc=Number(v);else{const d=s.docs.find(d=>d.id===s.doc);d.slides.find(x=>x.id===d.selected)[k]=v;}});
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

  register(['y2024q26'],'旋转艺术字，组合后继续编辑组内文字','拖动旋转手柄，或用角度输入；按住Shift拖动时按15°步长对齐。',{
    angle:0,text:'课程展示',grouped:false,message:'艺术字保留为可编辑文字对象。'
  },s=>office('PowerPoint','绘图工具 · 格式',btn(s.grouped?'取消组合':'与矩形组合','group')+btn('组合是否变成位图？','explain'),
    `<div class="lab-art-stage"><div class="lab-rotating-art" style="transform:rotate(${s.angle}deg)"><button data-lab-drag="rotate-art" class="lab-rotation-grip" aria-label="旋转手柄"></button><strong>${esc(s.text)}</strong>${s.grouped?'<span>组内矩形</span>':''}</div></div>`+
    controls(field('angle','旋转角度',s.angle,'number','min="-180" max="180"')+field('text',s.grouped?'编辑组内艺术字':'编辑艺术字',s.text,'text','maxlength="16"')))+output(esc(s.message)),
    (s,a)=>{if(a==='group'){s.grouped=!s.grouped;s.message=s.grouped?'两个对象已组合，艺术字仍能单独编辑。':'已取消组合。';}if(a==='explain')s.message='组合只建立共同操作的对象组，不会自动栅格化为位图。现在仍可修改下面的文字。';},
    (s,k,v)=>{s[k]=k==='angle'?Math.round(number(v,-180,180)):v;});
  registry.y2024q26.gesture=(s,g,root)=>{if(g.kind!=='rotate-art')return;const r=root.querySelector('.lab-art-stage').getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;let angle=Math.atan2(g.endY-y,g.endX-x)*180/Math.PI+90;angle=((angle+540)%360)-180;s.angle=Math.round(g.shiftKey?Math.round(angle/15)*15:angle);s.message=`已旋转到${s.angle}°${g.shiftKey?'，按15°步长对齐':''}，内容仍可编辑。`;};
})();
