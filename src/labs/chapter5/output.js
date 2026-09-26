/* Print objects and range selection, not a printer or PowerPoint renderer. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,office,dialog,output,esc}=ui;
  const modes=[['handout','讲义'],['slides','整页幻灯片'],['notes','备注页'],['outline','大纲']];
  const range=raw=>{
    const result=[];
    for(const part of raw.split(/[,，]/)){
      const m=part.trim().match(/^(\d+)(?:-(\d+))?$/);if(!m)return null;
      const start=Number(m[1]),end=Number(m[2]||start);if(start<1||end>7||start>end)return null;
      for(let n=start;n<=end;n++)if(!result.includes(n))result.push(n);
    }
    return result;
  };
  const thumbnail=slide=>`<div data-output-slide="${slide.id}" style="border:1px solid #aaa;padding:8px;min-width:0;overflow-wrap:anywhere"><b>${slide.id} · ${esc(slide.title)}</b><p>${esc(slide.body)}</p><span>自由文本框：示例标识</span></div>`;
  register(['syllabus-ppt-output'],'把7张源幻灯片排成讲义、备注页或大纲','修改范围和输出内容，确认后观察纸面；取消只放弃草稿，源幻灯片保持7张。',{
    slides:Array.from({length:7},(_,i)=>({id:i+1,title:['开场','任务','材料','方法','观察','结果','总结'][i],body:'正文要点'+(i+1),notes:'讲稿提示'+(i+1)})),
    hidden4:false,applied:{mode:'handout',perPage:3,range:'1-7',includeHidden:true},draft:null,message:'初始按每页3张讲义排成3个纸面，源文稿仍是7张幻灯片。'
  },s=>{
    const a=s.applied,ids=range(a.range).filter(id=>a.includeHidden||!s.hidden4||id!==4),slides=ids.map(id=>s.slides.find(x=>x.id===id));
    const per=a.mode==='handout'?a.perPage:1,pages=[];for(let i=0;i<slides.length;i+=per)pages.push(slides.slice(i,i+per));
    const paper=(page,i)=>`<section data-output-page="${i+1}" style="border:1px solid #bbb;background:white;color:#222;margin:12px 0;padding:12px;min-width:0"><p>纸面 ${i+1}</p><div style="display:grid;gap:10px;grid-template-columns:repeat(${a.mode==='handout'?(a.perPage===3?1:a.perPage===9?3:[4,6].includes(a.perPage)?2:1):1},minmax(0,1fr))">${page.map(slide=>`<div style="min-width:0">${thumbnail(slide)}${a.mode==='notes'?`<p data-speaker-notes>${esc(slide.notes)}</p>`:a.mode==='handout'&&a.perPage===3?'<p data-handout-lines style="border-bottom:1px solid #aaa;padding:6px">读者笔记线</p>':''}</div>`).join('')}</div></section>`;
    const preview=a.mode==='outline'?`<div data-outline-output>${slides.map(slide=>`<section data-outline-slide="${slide.id}"><h4>${slide.id} · ${esc(slide.title)}</h4><p>${esc(slide.body)}</p></section>`).join('')}<p>大纲仅展示标题和正文层级；本例不计算大纲实际分页。</p></div>`:pages.map(paper).join('');
    return `<div ${s.draft?'inert':''}>`+office('PowerPoint','文件 · 打印',btn('设置输出…','settings')+btn(s.hidden4?'取消隐藏第4张':'隐藏第4张源幻灯片','hide'),
      `<p data-source-count>源文稿：${s.slides.length}张；第4张：${s.hidden4?'已隐藏':'未隐藏'}。隐藏状态保存在源文稿，是否输出另看打印选项。</p><p data-output-summary>${modes.find(x=>x[0]===a.mode)[1]} · 选定输出 ${ids.length}张${a.mode==='outline'?'':` · 每份 ${pages.length}个纸面`} · 范围 ${esc(a.range)}</p>`+preview)+'</div>'+
      (s.draft?dialog('范围与输出内容',
        field('range','幻灯片范围（如1,3,5-7）',s.draft.range,'text','maxlength="40"')+select('mode','打印内容',s.draft.mode,modes)+select('perPage','讲义每页张数',s.draft.perPage,[1,2,3,4,6,9].map(n=>[n,String(n)]),s.draft.mode==='handout'?'':'disabled')+`<label><input type="checkbox" data-field="includeHidden" ${s.draft.includeHidden?'checked':''}>打印隐藏幻灯片</label><p>本模型只修改预览，未向打印机提交任务。</p>`,btn('确认预览','apply')+btn('取消','cancel')):'')+
      output(esc(s.message))+'<p class="core-caption">限定为1—7张、单份单面、按行排列的教学预览，重复输入的编号去重。实际打印还受纸张、方向、字号和驱动影响；未模拟PDF、视频导出或真实打印。备注页按短讲稿示例，大纲不收录自由文本框和讲稿。</p>';
  },(s,a)=>{
    if(s.draft){
      if(a==='cancel'){s.draft=null;s.message='已取消，输出预览保留上次确认的设置。';}
      if(a==='apply'){
        if(!range(s.draft.range)?.length){s.message='本例范围须为1—7内的编号或升序区间，如1,3,5-7；未更改已确认预览。';return;}
        s.applied={...s.draft};s.draft=null;s.message='输出设置已确认；源幻灯片、正文与备注均未删除。';
      }
      return;
    }
    if(a==='settings')s.draft={...s.applied};
    if(a==='hide'){s.hidden4=!s.hidden4;s.message='源文稿第4张的隐藏状态已改变；输出是否包含它由打印隐藏幻灯片选项决定。';}
  },(s,k,v)=>{
    if(!s.draft)return;
    if(k==='range')s.draft.range=v;
    if(k==='mode'&&modes.some(x=>x[0]===v))s.draft.mode=v;
    if(k==='perPage'&&[1,2,3,4,6,9].includes(Number(v)))s.draft.perPage=Number(v);
    if(k==='includeHidden')s.draft.includeHidden=Boolean(v);
  });
})();
