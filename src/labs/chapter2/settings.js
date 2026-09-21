/* Windows settings use committed state and explicit, reversible learning actions. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,table,dialog,output,esc,number}=ui;
  const controls=html=>`<div class="lab-controls">${html}</div>`;
  const check=(key,label,value)=>`<label><input type="checkbox" data-field="${key}" ${value?'checked':''}>${label}</label>`;
  const windowBox=(title,body)=>`<div class="lab-browser"><header>Windows 10 · ${title}</header><div class="lab-browser-page">${body}</div></div>`;

  register(['y2026q33'],'还原系统状态，保留个人文档','先改变示例驱动和个人文档，再选择还原点；比较系统状态与个人文件。',{
    enabled:true,quota:6,points:[{id:1,label:'安装驱动前',size:1.2,driver:'1.0'},{id:2,label:'更新前',size:.8,driver:'1.1'}],next:3,confirm:false,restore:false,target:'1',driver:'2.0',personal:'今天补写的复习笔记',message:'系统盘100 GB；点大小与驱动版本均为教学示例。'
  },s=>{
    const used=s.points.reduce((sum,p)=>sum+p.size,0);
    return windowBox('系统保护与系统还原',`<p>保护状态：<b>${s.enabled?'已启用':'已关闭'}</b></p>`+
      controls(field('quota','最大用量（GB）',s.quota,'number','min="1" max="20" step="1"')+btn(s.enabled?'关闭系统保护…':'启用系统保护','toggle')+btn('创建还原点','create','',s.enabled?'':'disabled'))+
      `<p>当前占用 <b>${used.toFixed(1)} GB</b> / 最大用量 <b>${s.quota} GB</b></p><progress max="${s.quota}" value="${used}"></progress>`+
      table(['还原点','占用','该点的示例驱动'],s.points.map(p=>[esc(p.label),p.size.toFixed(1)+' GB',esc(p.driver)]))+(!s.points.length?'<p class="lab-empty">没有可用还原点</p>':'')+
      `<p>当前系统驱动：<b data-current-driver>${esc(s.driver)}</b></p>`+field('personal','当前个人文档',s.personal)+controls(btn('安装示例驱动3.0','install')+btn('系统还原…','restore','',s.points.length?'':'disabled')+btn('删除所有还原点','delete','',s.points.length?'':'disabled'))+
      (s.confirm?dialog('关闭系统保护','<p>已有还原点会被删除。取消则保留保护与还原点。</p>',btn('关闭并删除','confirm')+btn('取消','cancel')):'')+
      (s.restore?dialog('选择还原点并核对影响',select('target','还原点',s.target,s.points.map(p=>[String(p.id),p.label]))+`<p data-restore-impact>示例驱动将由 ${esc(s.driver)} 回到 ${esc(s.points.find(p=>String(p.id)===s.target)?.driver||'未选择')}；个人文档保持当前内容。</p>`,btn('确认还原','applyRestore')+btn('取消','cancelRestore')):''))+
      output(esc(s.message))+`<p class="lab-coach">仅模拟驱动快照、空间配额及个人文档的独立性；不执行真实系统恢复，不模拟完整快照、重启、撤销还原和所有软件兼容行为。</p>`;
  },(s,a)=>{
    if(s.restore){if(a==='cancelRestore'){s.restore=false;s.message='已取消还原，当前系统状态未改。';return;}if(a==='applyRestore'){const p=s.points.find(p=>String(p.id)===s.target);if(!p){s.message='请选择仍存在的还原点。';return;}s.driver=p.driver;s.restore=false;s.message='示例驱动已回退；个人文档保持当前内容，没有从还原点找回旧文档。';}return;}
    if(s.confirm&&!['confirm','cancel'].includes(a))return;
    if(a==='toggle'){if(s.enabled)s.confirm=true;else{s.enabled=true;s.message='已启用保护；现在尚无还原点。';}}
    if(a==='confirm'){s.enabled=false;s.points=[];s.confirm=false;s.message='保护已关闭，还原点已删除，当前系统驱动未回退。';}
    if(a==='cancel')s.confirm=false;
    if(a==='delete'){s.points=[];s.message='还原点已删除，最大用量与当前驱动保持不变。';}
    if(a==='create'&&s.enabled){s.points.push({id:s.next,label:'手动创建 #'+s.next++,size:1,driver:s.driver});trim(s);s.message='保存当前示例驱动快照；超出最大用量时移除最旧的点。';}
    if(a==='install'){s.driver='3.0';s.message='当前驱动改为3.0；已有还原点的快照保持不变。';}
    if(a==='restore'&&s.points.length){s.target=String(s.points[0].id);s.restore=true;}
  },(s,k,v)=>{if(s.confirm)return;if(s.restore){if(k==='target'&&s.points.some(p=>String(p.id)===v))s.target=v;return;}if(k==='personal')s.personal=String(v);if(k==='quota'){s.quota=Math.round(number(v,1,20));trim(s);s.message='只调整空间上限；没有创造还原点或回退系统状态。';}});
  function trim(s){while(s.points.reduce((sum,p)=>sum+p.size,0)>s.quota)s.points.shift();}

  register(['y2026q35'],'快速访问入口与原文件夹分别变化','取消固定后检查原位置，再删除原文件夹，比较两种结果。',{
    exists:true,pinned:true,opened:false,message:'“复习资料”位于 D:\\资料；快速访问只保存导航入口。'
  },s=>windowBox('文件资源管理器',`<div class="lab-two-pane"><section><h4>快速访问</h4>${s.pinned?btn('复习资料 ↗','open'):'<p class="lab-empty">未固定此文件夹</p>'}</section><section><h4>D:\\资料</h4>${s.exists?'<div class="folder-card">复习资料 · 2个文件</div>':'<p class="lab-empty">原文件夹已删除</p>'}${s.opened&&s.exists?'<p>已进入：笔记.txt、练习.docx</p>':''}</section></div>`+
    controls(btn('固定到快速访问','pin','',s.exists&&!s.pinned?'':'disabled')+btn('取消固定','unpin','',s.pinned?'':'disabled')+btn('删除原文件夹','delete','',s.exists?'':'disabled')))+output(esc(s.message)),
    (s,a)=>{if(a==='pin'&&s.exists){s.pinned=true;s.message='已添加导航入口，原位置没有移动。';}if(a==='unpin'){s.pinned=false;s.message='只移除入口，D:\\资料中的原文件夹和内容仍在。';}if(a==='delete'){s.exists=false;s.pinned=false;s.opened=false;s.message='原文件夹和内容已移除，入口不再可用。可用卡片重置恢复教学文件。';}if(a==='open'&&s.exists){s.opened=true;s.message='通过入口打开同一个原文件夹，没有复制出第二份。';}});

  const deviceModes=[['normal','正常连接'],['driver','驱动未安装'],['disabled','设备被禁用'],['absent','设备未连接']];
  register(['y2026q8'],'从设备状态和错误码判断下一步','改变教学故障条件，再查看属性、安装匹配驱动或扫描硬件。',{
    mode:'driver',driverInstalled:false,properties:false,message:'这是一组独立故障情境；改变条件会重新设置示例设备。'
  },s=>controls(select('mode','教学故障条件',s.mode,deviceModes))+windowBox('设备管理器',
    s.mode==='absent'?'<p class="lab-empty">没有检测到示例网卡</p>'+controls(btn('扫描检测硬件改动','scan')):
    table(['设备','状态'],[['示例网卡',s.mode==='normal'?'正常':s.mode==='driver'?'⚠ 未安装驱动程序':'↓ 已禁用']])+controls(btn('属性','properties')+btn('更新驱动程序','update')+btn(s.mode==='disabled'?'启用设备':'禁用设备','enable')+btn('扫描检测硬件改动','scan'))+
    (s.properties?dialog('设备属性',`<p>${{normal:'这个设备运转正常。',driver:'没有安装这个设备的驱动程序。（代码28）',disabled:'这个设备已被禁用。（代码22）'}[s.mode]}</p>`,btn('关闭','close')):''))+output(esc(s.message)),
    (s,a)=>{if(a==='properties'&&s.mode!=='absent')s.properties=true;if(a==='close')s.properties=false;if(a==='scan')s.message=s.mode==='absent'?'扫描完成：仍未检测到。请先检查实际连接；扫描不能凭空生成硬件。':'扫描完成：设备仍在列表，扫描本身不会安装驱动或启用设备。';if(a==='update'&&s.mode!=='absent'){if(!s.driverInstalled){s.driverInstalled=true;if(s.mode!=='disabled')s.mode='normal';s.message=s.mode==='disabled'?'匹配驱动已安装，设备仍被禁用；需要单独启用。':'教学条件：已提供匹配驱动，安装后设备正常。';}else s.message='未发现需要替换的驱动；禁用状态需要单独启用。';}if(a==='enable'&&s.mode!=='absent'){s.mode=s.mode==='disabled'?(s.driverInstalled?'normal':'driver'):'disabled';s.message=s.mode==='disabled'?'设备已禁用，仍保留在列表。':s.driverInstalled?'设备已启用，驱动已安装。':'设备已启用，但仍未安装驱动（代码28）。';}},
    (s,k,v)=>{s.mode=v;s.driverInstalled=v!=='driver';s.properties=false;s.message='已切换故障条件；请按当前设备状态诊断。';});

  register(['y2026q25'],'勾选系统图标，应用后核对桌面','分别改变计算机与回收站；取消会放弃尚未应用的勾选。',{
    computer:false,recycle:true,draftComputer:false,draftRecycle:true,pane:false,message:'当前桌面显示回收站。'
  },s=>windowBox('个性化 → 主题',controls(btn('桌面图标设置','open'))+
    `<div class="lab-desktop-icons" aria-label="桌面">${s.computer?'<span>▣ 此电脑</span>':''}${s.recycle?'<span>♲ 回收站</span>':''}${!s.computer&&!s.recycle?'<p>这两个系统图标均未显示</p>':''}</div>`+
    (s.pane?dialog('桌面图标设置',controls(check('draftComputer','计算机',s.draftComputer)+check('draftRecycle','回收站',s.draftRecycle)),btn('应用','apply')+btn('确定','ok')+btn('取消','cancel')):''))+output(esc(s.message)),
    (s,a)=>{if(a==='open'){s.draftComputer=s.computer;s.draftRecycle=s.recycle;s.pane=true;}if((a==='apply'||a==='ok')&&s.pane){s.computer=s.draftComputer;s.recycle=s.draftRecycle;s.message='桌面已按勾选结果更新；隐藏图标不删除系统功能。';if(a==='ok')s.pane=false;}if(a==='cancel'){s.pane=false;s.message='未应用的勾选已放弃。';}},(s,k,v)=>{if(s.pane&&['draftComputer','draftRecycle'].includes(k))s[k]=v;});
})();
