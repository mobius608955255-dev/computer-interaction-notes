/* Shared-printer queue belongs to network applications. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,table,output,esc}=ui;
  const controls=html=>`<div class="lab-controls">${html}</div>`;
  const check=(key,label,value)=>`<label><input type="checkbox" data-field="${key}" ${value?'checked':''}>${label}</label>`;
  const windowBox=(title,body)=>`<div class="lab-browser"><header>Windows 10 · ${title}</header><div class="lab-browser-page">${body}</div></div>`;
  register(['y2026q13'],'提交、处理和取消共享打印任务','分别从电脑A、B提交，按实际顺序处理队列，再关闭共享重试。',{
    shared:true,jobs:[],next:1,printed:0,message:'当前队列为空。示例打印机连接在主机；A、B通过共享使用。'
  },s=>windowBox('共享打印机',controls(check('shared','共享这台打印机',s.shared))+controls(btn('电脑A：提交讲义','submit','A')+btn('电脑B：提交笔记','submit','B'))+
    table(['顺序','来源 / 文档','操作'],s.jobs.map((job,i)=>[i+1,`电脑${job.owner} · ${job.owner==='A'?'讲义':'笔记'} #${job.id}`,btn('取消此任务','cancel',job.id)]))+
    (!s.jobs.length?'<p class="lab-empty">队列为空</p>':'')+controls(btn('打印队首任务','print','',s.jobs.length?'':'disabled'))+`<p>已完成 ${s.printed} 项任务；共享${s.shared?'已开启':'已关闭'}。</p>`)+output(esc(s.message)),
    (s,a,v)=>{if(a==='submit'){if(!s.shared){s.message=`电脑${v}无法提交：共享已关闭。`;return;}s.jobs.push({id:s.next++,owner:v});s.message=`电脑${v}的任务排在第${s.jobs.length}位。`;}if(a==='cancel'){s.jobs=s.jobs.filter(job=>job.id!==Number(v));s.message='指定任务已取消，其余任务保持提交顺序。';}if(a==='print'&&s.jobs.length){const job=s.jobs.shift();s.printed++;s.message=`电脑${job.owner}的任务 #${job.id} 已完成。`; }},
    (s,k,v)=>{s.shared=v;s.message=v?'共享已开启，新任务可以进入队列。':'共享已关闭，拒绝新的远程提交；已经进入主机队列的任务仍可处理。';});

})();
