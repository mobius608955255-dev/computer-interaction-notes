/* Selection and confirmation operate on the same simulated disk. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,table,dialog,output,coach,esc}=ui;
  const categories=[['updates','Windows更新清理',4200,'旧更新组件'],['thumbnails','缩略图',580,'可重新生成的缩略图缓存'],['downloads','下载',1600,'下载中的安装包与学习资料'],['recycle','回收站',420,'尚可从回收站还原的文件']];
  const gb=mb=>(mb/1000).toLocaleString('zh-CN',{maximumFractionDigits:3})+' GB';
  const chosen=s=>categories.filter(([key])=>s[key]&&s.remaining[key]>0);
  const amount=rows=>rows.reduce((sum,row)=>sum+row[2],0);
  register(['y2024q5'],'选择哪些文件，实际释放多少空间','改变勾选，核对确认清单，再观察剩余分类和可用空间。',{
    total:256000,used:184000,remaining:Object.fromEntries(categories.map(([key,,size])=>[key,size])),updates:true,thumbnails:true,downloads:false,recycle:false,pending:null,message:'本例磁盘原有72 GB可用。勾选只改变待清理范围，确认删除后才释放空间。'
  },s=>{
    const rows=chosen(s),size=amount(rows);
    return `<div class="lab-office core-windows"><header>Windows 10 · 临时文件</header><div class="lab-workspace">${table(['总容量','已用','可用'],[[gb(s.total),gb(s.used),gb(s.total-s.used)]])}<fieldset class="lab-clean-categories" ${s.pending?'disabled':''}><legend>选择要清理的分类</legend>${categories.map(([key,label,,description])=>`<label><input type="checkbox" data-field="${key}" ${s[key]?'checked':''} ${s.remaining[key]?'':'disabled'}><span><b>${label} · ${gb(s.remaining[key])}</b><small>${description}${s.remaining[key]?'':'（本次已清理）'}</small></span></label>`).join('')}</fieldset><p>已选 ${rows.length} 类，预计释放 ${gb(size)}</p>${btn('核对删除清单','review','',!size||s.pending?'disabled':'')}${s.pending?dialog('确认删除所选文件',table(['将删除的分类','容量'],s.pending.rows.map(([,label,n])=>[label,gb(n)]))+`<p>合计 ${gb(s.pending.size)}。${s.pending.rows.some(([key])=>key==='downloads'||key==='recycle')?'本次包含个人文件所在分类，请核对清单。':'本次未选择下载与回收站，里面的文件保留。'}</p>`,btn('删除所选文件','confirm')+btn('取消','cancel')):''}</div></div>`+output(esc(s.message))+coach('这是虚构磁盘，操作只影响本卡片。为便于核算，容量统一按1 GB＝1000 MB表示。清理不会扩大磁盘总容量，也不等同于驱动器优化。');
  },(s,a)=>{
    if(a==='review'&&!s.pending){const rows=chosen(s);if(rows.length)s.pending={rows:structuredClone(rows),size:amount(rows)};}
    if(a==='cancel'){s.pending=null;s.message='已取消，文件和可用空间均未改变。';}
    if(a==='confirm'&&s.pending){const {rows,size}=s.pending;for(const [key] of rows){s.remaining[key]=0;s[key]=false;}s.used-=size;s.pending=null;s.message=`已清理${rows.map(r=>r[1]).join('、')}，释放${gb(size)}；现在可用${gb(s.total-s.used)}。未选择的分类保留。`;}
  },(s,k,v)=>{if(!s.pending&&categories.some(([key])=>key===k)&&s.remaining[k])s[k]=!!v;});
})();
