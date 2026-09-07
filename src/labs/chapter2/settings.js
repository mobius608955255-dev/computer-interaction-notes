/* Windows settings use committed state and explicit, reversible learning actions. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,table,dialog,output,esc,number}=ui;
  const controls=html=>`<div class="lab-controls">${html}</div>`;
  const check=(key,label,value)=>`<label><input type="checkbox" data-field="${key}" ${value?'checked':''}>${label}</label>`;
  const windowBox=(title,body)=>`<div class="lab-browser"><header>Windows 10 · ${title}</header><div class="lab-browser-page">${body}</div></div>`;

  register(['y2026q33'],'分别管理保护开关、空间上限与还原点','调整最大用量不会创造还原点；关闭保护会清除本例已有还原点。',{
    enabled:true,quota:6,points:[{id:1,label:'安装驱动前',size:1.2},{id:2,label:'更新前',size:.8}],next:3,confirm:false,message:'系统盘总容量100 GB；还原点大小为教学示例。'
  },s=>{
    const used=s.points.reduce((sum,p)=>sum+p.size,0);
    return windowBox('系统属性 → 系统保护 → 配置',`<p>保护状态：<b>${s.enabled?'已启用':'已关闭'}</b></p>`+
      controls(field('quota','最大用量（GB）',s.quota,'number','min="1" max="20" step="1"')+btn(s.enabled?'关闭系统保护…':'启用系统保护','toggle')+btn('创建还原点','create','',s.enabled?'':'disabled'))+
      `<p>当前占用 <b>${used.toFixed(1)} GB</b> / 最大用量 <b>${s.quota} GB</b></p><progress max="${s.quota}" value="${used}"></progress>`+
      table(['还原点','占用'],s.points.map(p=>[esc(p.label),p.size.toFixed(1)+' GB']))+(!s.points.length?'<p class="lab-empty">没有可用还原点</p>':'')+
      controls(btn('删除所有还原点','delete','',s.points.length?'':'disabled'))+
      (s.confirm?dialog('关闭系统保护','<p>已有还原点会被删除。取消则保留保护与还原点。</p>',btn('关闭并删除','confirm')+btn('取消','cancel')):''))+output(esc(s.message));
  },(s,a)=>{if(s.confirm&&!['confirm','cancel'].includes(a))return;if(a==='toggle'){if(s.enabled)s.confirm=true;else{s.enabled=true;s.message='已启用保护；现在尚无还原点。';}}if(a==='confirm'){s.enabled=false;s.points=[];s.confirm=false;s.message='保护已关闭，还原点已删除，当前占用为0。';}if(a==='cancel')s.confirm=false;if(a==='delete'){s.points=[];s.message='还原点已删除，最大用量设置保持不变。';}if(a==='create'&&s.enabled){s.points.push({id:s.next,label:'手动创建 #'+s.next++,size:1});trim(s);s.message='创建了1 GB的示例还原点；超过最大用量时移除最旧的点。';}},
    (s,k,v)=>{if(s.confirm)return;s.quota=Math.round(number(v,1,20));trim(s);s.message='最大用量已调整；未超上限的已有还原点保持不变，空集合不会增加占用。';});
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
