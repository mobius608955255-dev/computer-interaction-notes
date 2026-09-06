/* Chapter 2: windows. Maintained source; edit this domain directly. */
/* Source provenance: note-labs.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
register(['y2022q34'],'对话框开着，父窗口还能编辑吗','分别打开模式与无模式窗口，再尝试在父窗口输入。',{mode:'modal',open:false,text:'可编辑的正文'},s=>
    `<div class="lab-controls">${select('mode','窗口类型',s.mode,[['modal','模式'],['modeless','无模式']])}${btn('打开对话框','open')}</div><div class="lab-dialog-demo"><div ${s.open&&s.mode==='modal'?'inert aria-hidden="true"':''}>${field('text','父窗口正文',s.text)}</div>${s.open?dialog(s.mode==='modal'?'模式对话框':'无模式查找窗口','<p>模式窗口打开时，父窗口输入会被阻止。</p>',btn('关闭','close')):''}</div>${output(s.open?(s.mode==='modal'?'父窗口已锁定；先关闭对话框才能继续。':'父窗口仍可编辑；该窗口不阻塞父窗口。'):'对话框已关闭，正文可以编辑。')}`,
    (s,a)=>{s.open=a==='open';});
register(['y2022q44'],'启动同一程序，观察多个运行实例','打开记事本并结束其中一个进程；磁盘上的程序不会被卸载。',{processes:[],pid:1200},s=>
    `<div class="lab-program-file"><b>磁盘文件：notepad.exe</b>${btn('启动记事本','launch')}</div><div class="lab-task-manager"><header>任务管理器 · 进程（${s.processes.length}）</header>${table(['名称','PID','内存（示意）','操作'],s.processes.map(p=>['记事本',p,'12 MB',btn('结束任务','end',p)]))}</div>${output(s.processes.length?`一个程序文件，${s.processes.length}个独立运行实例。`:'没有正在运行的记事本进程；程序文件仍存在。')}`,
    (s,a,v)=>{if(a==='launch'&&s.processes.length<6)s.processes.push(s.pid++);if(a==='end')s.processes=s.processes.filter(p=>p!==Number(v));});
register(['y2022q75'],'创建ZIP副本，不是改一个扩展名','在资源管理器菜单中创建压缩文件夹，再查看包内目录。',{zip:false,renamed:false,open:false,menu:false},s=>
    `<div class="lab-explorer"><header>文件资源管理器 · 文稿资料</header><div class="lab-ribbon">${btn('右键菜单 / 长按','menu')}</div><div class="lab-file-list"><button data-lab-drag="hold" data-lab-act="folder">📁 年度总结 ${s.renamed?'.zip':''}<small>类型：文件夹</small></button>${s.zip?btn('▣ 年度总结.zip<br><small>类型：ZIP压缩文件</small>','open'):''}</div>${s.menu?`<div class="lab-context-menu">${btn('发送到 → 压缩(zipped)文件夹','zip')}${btn('重命名为 年度总结.zip','rename')}</div>`:''}${s.open?table(['包内文件','内容'],[['年度报告.docx','文档'],['销售汇总.xlsx','工作簿'],['汇报.pptx','演示文稿']]):''}</div>${output(s.renamed?'名称变了，类型仍是文件夹，没有执行压缩。':s.zip?'已创建包含3个文件的ZIP副本，原文件夹仍保留。':'长按文件夹约0.6秒打开菜单；轻点不会触发长按。')}`,
    (s,a)=>{if(a==='menu')s.menu=!s.menu;if(a==='zip'){s.zip=true;s.menu=false;s.renamed=false;}if(a==='rename'){s.renamed=true;s.menu=false;}if(a==='open')s.open=!s.open;});
})();

/* Source provenance: note-labs-audit.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui,clusteredChart,daysBetween}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
register(['y2026q34'],'在任务管理器里操作真实的示例进程','切换进程、性能、启动页，结束任务后列表会改变，主机名称保持不变。',{tab:'process',processes:['记事本','计算器'],selected:'记事本',startup:true,view:null},s=>
 `<div class="lab-browser"><header>任务管理器 · 当前主机：学习电脑</header><div class="lab-tabs">${[['process','进程'],['performance','性能'],['startup','启动']].map(([k,t])=>btn(t,'tab',k,`aria-pressed="${s.tab===k}"`)).join('')}</div><div class="lab-browser-page">${s.tab==='process'?table(['名称','操作'],s.processes.map(n=>[btn(n,'select',n),btn('结束任务','end',n)]))+controls(btn('打开文件所在位置','location')+btn('属性','properties')):s.tab==='performance'?table(['资源','示例使用量'],[['CPU','12%'],['内存','3.2 / 8 GB'],['网络','0.1 Mbps']]):table(['启动项','状态','操作'],[['示例同步工具',s.startup?'已启用':'已禁用',btn(s.startup?'禁用':'启用','startup')]])}${s.view?dialog(s.view==='location'?'文件资源管理器':'文件属性',s.view==='location'?'<p>C:\\Windows\\System32</p><p>'+ (s.selected==='记事本'?'notepad.exe':'calc.exe')+'</p>':'<p>文件类型：应用程序</p><p>示例所选进程：'+esc(s.selected)+'</p>',btn('关闭','close')):''}</div></div>`+output('结束任务终止运行实例；打开文件位置进入磁盘目录。性能数值为静态示例，不读取你的设备。'),
 (s,a,v)=>{if(a==='tab'){s.tab=v;s.view=null;}if(a==='select')s.selected=v;if(a==='end'){s.processes=s.processes.filter(n=>n!==v);s.view=null;}if(a==='startup')s.startup=!s.startup;if(a==='location'||a==='properties')s.view=a;if(a==='close')s.view=null;});
register(['y2025q26'],'同一控制面板，切换三种查看方式','类别显示分组，大小图标直接列出项目；账户管理需另行提升。',{view:'category',uac:false,admin:false},s=>{
 const items=['系统','Windows Defender防火墙','用户账户','程序和功能','文件资源管理器选项','声音'];
 return `<div class="lab-browser"><header>控制面板</header>${controls(select('view','查看方式',s.view,[['category','类别'],['large','大图标'],['small','小图标']]))}<div class="lab-panel-items ${s.view}">${s.view==='category'?['系统和安全','用户账户','程序','外观和个性化'].map(x=>`<section><b>${x}</b>${x==='用户账户'?btn('更改账户类型','account'):'<p>此类别下的设置项目</p>'}</section>`).join(''):items.map(x=>btn(x,'item',x)).join('')}</div>${s.uac?dialog('用户账户控制','<p>此操作需要管理员确认。演示不收集真实凭据。</p>',btn('确认提升（示例）','elevate')+btn('取消','cancel')):''}${s.admin?'<p>已进入账户类型管理：标准用户 / 管理员。</p>':''}</div>`+output('管理员账户也可能需要UAC确认；更改查看方式不改变账户权限。');
},(s,a,v)=>{if(a==='account'||a==='item'&&v==='用户账户')s.uac=true;if(a==='elevate'){s.admin=true;s.uac=false;}if(a==='cancel')s.uac=false;});
register(['y2025q32'],'应用、确定和取消分别保留什么','在文件资源管理器选项中改复选框，观察文件列表与窗口是否关闭。',{open:true,saved:false,draft:false},s=>
 `<div class="lab-browser"><header>文件资源管理器</header><div class="lab-browser-page"><p>${s.saved?'笔记':'笔记.txt'}</p><p>${s.saved?'名单':'名单.csv'}</p></div>${s.open?dialog('文件资源管理器选项 · 查看',`<label><input type="checkbox" data-field="draft" ${s.draft?'checked':''}>隐藏已知文件类型的扩展名</label>`,btn('确定','ok')+btn('取消','cancel')+btn('应用','apply','',s.draft===s.saved?'disabled':'')):controls(btn('重新打开选项','open'))}</div>`+output(`已保存设置：${s.saved?'隐藏':'显示'}扩展名。${s.open?'选项窗口仍打开。':'选项窗口已关闭。'}`),
 (s,a)=>{if(a==='apply'||a==='ok')s.saved=s.draft;if(a==='ok'||a==='cancel')s.open=false;if(a==='open'){s.open=true;s.draft=s.saved;}});
register(['y2026q26'],'任务栏搜索与桌面背景从不同入口操作','输入查询查看范围，或从桌面个性化进入背景设置。',{pane:'desktop',query:'笔记',scope:'local',background:'solid',slide:0},s=>{
 const files=['计算机笔记.docx','复习计划.xlsx'];const matches=files.filter(x=>x.includes(s.query));
 return `<div class="lab-browser"><header>Windows 10 · 桌面</header><div class="lab-windows-desktop bg-${s.background}"><h4>${s.background==='solid'?'纯色背景':s.background==='picture'?'选定的一张背景图片':`背景幻灯片 ${s.slide+1}`}</h4>${btn('桌面右键 → 个性化','personalize')}</div><div class="lab-taskbar">${btn('开始 / 搜索','search')}<span>任务视图　应用　网络　音量　时钟</span></div>${s.pane==='search'?dialog('搜索',field('query','搜索内容',s.query)+select('scope','结果范围',s.scope,[['local','本地文档'],['web','网络结果']])+ (s.scope==='local'?matches.map(x=>`<p>${x}</p>`).join('')||'<p>没有匹配的示例文档</p>':`<p>网络查询：${esc(s.query)}</p><p>本演示不发送请求。Windows搜索可包含网络结果，实际取决于配置。</p>`),btn('关闭','close')):''}${s.pane==='background'?dialog('设置 → 个性化 → 背景',select('background','背景',s.background,[['solid','纯色'],['picture','图片'],['slideshow','幻灯片放映']]),btn('关闭','close')):''}</div>`+controls(s.background==='slideshow'?btn('学习控制：下一张背景','next'):'')+output('桌面背景的纯色、图片、幻灯片设置位于个性化，不是任务栏里的应用按钮。');
},(s,a)=>{if(a==='search')s.pane='search';if(a==='personalize')s.pane='background';if(a==='close')s.pane='desktop';if(a==='next')s.slide=(s.slide+1)%3;});
})();

/* Source provenance: note-labs-core.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,esc}=ui;
const controls=html=>`<div class="lab-controls">${html}</div>`;
const clone=x=>structuredClone(x);
const area=(key,label,value,extra='')=>`<label>${label}<textarea data-field="${key}" rows="3" ${extra}>${esc(value)}</textarea></label>`;
const check=(key,label,value)=>`<label><input type="checkbox" data-field="${key}" ${value?'checked':''}>${label}</label>`;
const shell=(title,commands,body)=>`<div class="lab-office core-windows"><header>Windows 10 · ${title}</header><div class="lab-ribbon">${commands}</div><div class="lab-workspace">${body}</div></div>`;
register(['y2020q24'],'拖动同一个文件，比较同盘、跨盘与组合键','把文件真正拖入目标文件夹；源目录与目标目录分别显示操作后的结果。',{
    source:true,target:[],drive:'C',ctrl:false,shift:false,alt:false,mode:'left',menu:false,message:'同盘普通拖动默认移动。可切换目标盘符，或点选按键后再拖动。'
  },s=>`<div class="lab-controls core-drag-options">${select('drive','目标文件夹',s.drive,[['C','C 盘 · 同盘'],['D','D 盘 · 跨盘']])}<div class="core-modifier-controls" role="group" aria-label="组合键（触屏辅助）"><span class="core-modifier-label">组合键（触屏辅助）</span><div class="core-modifier-keys">${[['ctrl','Ctrl'],['shift','Shift'],['alt','Alt']].map(([key,label])=>btn(label,'modifier',key,`aria-pressed="${s[key]}"`)).join('')}</div></div>${select('mode','鼠标按键',s.mode,[['left','左键'],['right','右键']])}</div>`+
    `<div class="lab-file-transfer core-file-transfer"><section><b>源文件夹 C:\\资料</b>${s.source?'<button type="button" data-lab-drag="file" data-lab-act="select" class="lab-file" aria-label="拖动笔记.txt">笔记.txt</button>':'<p>源文件已移走</p>'}</section><section data-file-target><b>目标文件夹 ${s.drive}:\\复习</b>${s.target.length?s.target.map(x=>`<p data-file-result>${esc(x)}</p>`).join(''):'<p>放到这里</p>'}</section></div>`+
    (s.menu?`<div class="lab-context-menu" aria-label="拖放菜单">${btn('复制到这里','copy')}${btn('移动到这里','move')}${btn('创建快捷方式','link')}${btn('取消','cancel')}</div>`:'')+controls(btn('键盘辅助：执行拖放','drop','',s.source?'':'disabled')+btn('重新放回源文件','restore'))+output(s.message)+coach('点一下按住，再点一下松开；可同时选中多个键，全部松开就是普通拖动。Ctrl 为复制，Shift 为移动，Ctrl+Shift 或 Alt 为创建快捷方式。电脑按松开鼠标时的实际按键执行。停留长按约 0.6 秒可打开操作菜单。本例是普通文件，假定有权限且目标没有同名冲突。'),
  (s,a,v)=>{
    if(a==='modifier'&&['ctrl','shift','alt'].includes(v)){s[v]=!s[v];return;}
    if(a==='restore'){s.source=true;s.target=[];s.menu=false;s.message='源文件已恢复，可重新比较拖动规则。';return;}
    if(a==='menu'&&s.source){s.menu=true;return;}if(a==='cancel'){s.menu=false;return;}
    if(a==='drop'){if(s.mode==='right'){s.menu=true;return;}a=s.alt||s.ctrl&&s.shift?'link':s.ctrl?'copy':s.shift?'move':s.drive==='C'?'move':'copy';}
    if(['copy','move','link'].includes(a)&&s.source){const name=a==='link'?'笔记.txt — 快捷方式.lnk':'笔记.txt';if(s.target.includes(name)){s.menu=false;s.message='目标中已存在同名项目，本次操作未执行；可重新放回源文件后再比较。';return;}s.target.push(name);if(a==='move')s.source=false;s.menu=false;s.message=a==='copy'?'已复制：源文件保留，目标新增副本。':a==='move'?'已移动：目标出现文件，源文件夹不再显示它。':'已创建快捷方式：目标保存入口，原文件仍在 C:\\资料。';}
  },(s,k,v)=>{s[k]=v;if(k==='drive'){s.target=[];s.source=true;s.menu=false;s.message='已切换到新的目标文件夹，并恢复示例源文件。';}});
registry.y2020q24.gesture=(s,g,root)=>{
    if(g.kind!=='file')return;
    const r=root.querySelector('[data-file-target]').getBoundingClientRect();
    if(g.endX<r.left||g.endX>r.right||g.endY<r.top||g.endY>r.bottom){s.message='没有放入目标文件夹，原文件保持不变。';return;}
    if(g.button===2||s.mode==='right'){s.menu=true;return;}
    const key=g.altKey||g.ctrlKey&&g.shiftKey?'link':g.ctrlKey?'copy':g.shiftKey?'move':null;
    registry.y2020q24.action(s,key||'drop');
  };
const initialFiles=[{id:1,name:'课堂笔记.txt',path:'C:\\资料',state:'source'},{id:2,name:'复习提纲.txt',path:'C:\\资料',state:'source'}];
register(['y2020q3'],'在文件夹和回收站之间删除、还原','选一个文件再删除，切到回收站检查；Shift+Delete 和特殊位置走不同路径。',{
    files:initialFiles,selected:1,tab:'folder',location:'fixed',bypass:false,confirm:null,message:'本地固定磁盘、回收站启用、文件大小未超过限制。'
  },s=>{
    const list=s.files.filter(f=>f.state===(s.tab==='folder'?'source':'bin'));
    const rows=list.map(f=>[btn(esc(f.name),'select',f.id,`aria-pressed="${s.selected===f.id}"`),esc(s.tab==='bin'?f.path:({fixed:'C:\\资料',usb:'E:\\资料',network:'\\\\服务器\\共享'}[s.location]))]);
    return controls(select('location','示例文件位置',s.location,[['fixed','本地固定磁盘'],['usb','U 盘（本例不支持回收站）'],['network','网络共享（不进本机回收站）']])+check('bypass','本地回收站设置：删除时不移入回收站',s.bypass))+
      shell(s.tab==='folder'?'文件资源管理器':'回收站',btn('资料文件夹','tab','folder',s.confirm?'disabled':'')+btn('回收站','tab','bin',s.confirm?'disabled':''),`<div ${s.confirm?'inert':''}>${table(['名称',s.tab==='folder'?'所在位置':'原位置'],rows)}${!list.length?'<p class="core-empty">这里没有文件。</p>':''}${controls(s.tab==='folder'?btn('删除','delete','',list.some(x=>x.id===s.selected)?'':'disabled'):btn('还原所选项目','restore','',list.some(x=>x.id===s.selected)?'':'disabled')+btn('清空回收站','empty','',list.length?'':'disabled'))}</div>`+
      (s.confirm?dialog('永久删除？',`<p>${s.confirm==='empty'?'回收站中的所有项目':esc(s.files.find(f=>f.id===s.selected)?.name||'文件')}将无法通过本卡片的回收站还原。</p>`,btn('是','confirm')+btn('否','cancel')):''))+
      controls(btn('模拟 Shift + Delete','permanent','',s.confirm||s.tab!=='folder'||!list.some(x=>x.id===s.selected)?'disabled':'')+btn('恢复示例文件','resetFiles'))+output(s.message)+coach('“永久删除”指绕过回收站，不等于已安全擦除存储介质。更换位置会重新载入本例文件。普通 U 盘与网络共享的回收行为不能套用本机固定磁盘的设置。');
  },(s,a,v)=>{
    const item=()=>s.files.find(f=>f.id===s.selected);
    if(a==='resetFiles'){s.files=clone(initialFiles);s.selected=1;s.tab='folder';s.confirm=null;s.message='示例文件已恢复。';return;}
    if(a==='tab'){s.tab=v;s.selected=s.files.find(f=>f.state===(v==='folder'?'source':'bin'))?.id??null;return;}
    if(a==='select'){s.selected=Number(v);return;}if(a==='cancel'){s.confirm=null;return;}
    if(a==='delete'&&item()?.state==='source'){
      if(s.location!=='fixed'||s.bypass)s.confirm='selected';else{item().state='bin';s.message='文件已从资料文件夹移入回收站。切换到回收站可查看原位置并还原。';}
    }
    if((a==='permanent'||a==='delete'&&s.tab==='bin')&&['source','bin'].includes(item()?.state))s.confirm='selected';if(a==='empty')s.confirm='empty';
    if(a==='confirm'){if(s.confirm==='empty')s.files.filter(f=>f.state==='bin').forEach(f=>f.state='deleted');else if(s.confirm&&item())item().state='deleted';s.confirm=null;s.message='已永久删除，回收站内没有可还原副本。';}
    if(a==='restore'&&item()?.state==='bin'){item().state='source';s.message='已还原到原文件夹 C:\\资料。还原会从回收站移除该条目。';}
  },(s,k,v)=>{s[k]=v;if(k==='location'){s.files=clone(initialFiles);s.selected=1;s.tab='folder';s.confirm=null;s.message='已载入该位置的示例文件。';}});
registry.y2020q3.keydown=(s,e)=>{if(e.key==='Delete'&&!e.target.closest('input,textarea,select')&&!s.confirm){e.preventDefault();registry.y2020q3.action(s,e.shiftKey?'permanent':'delete');return true;}};
register(['y2025q33'],'粘贴文本与移动文件，不是同一条规则','先复制或剪切，再连续粘贴；也可模拟睡眠，观察剪贴板与源内容。',{
    mode:'text',sourceText:'复习计算机基础',targetText:'',sourceFile:true,targetFile:false,cut:false,buffer:null,sleeping:false,message:'选择文本或文件场景。当前剪贴板为空。'
  },s=>{
    const buffer=s.buffer?s.buffer.kind==='text'?`文本：${esc(s.buffer.value)}`:`文件传输信息：C:\\资料\\笔记.txt（${s.buffer.op==='cut'?'待移动':'复制'}）`:'空';
    return controls(select('mode','观察场景',s.mode,[['text','文本编辑'],['file','文件资源管理器']]))+
      `<div class="core-clipboard"><section><h4>源内容</h4>${s.mode==='text'?area('sourceText','源文本',s.sourceText,s.sleeping?'disabled':''):s.sourceFile?`<p class="core-file-token ${s.cut?'core-cut':''}">笔记.txt</p><p>C:\\资料</p>`:'<p>源文件已移走</p>'}</section><section><h4>当前剪贴板</h4><p data-clipboard>${buffer}</p></section><section><h4>目标位置</h4>${s.mode==='text'?area('targetText','目标文本',s.targetText,s.sleeping?'disabled':''):`<p>D:\\复习</p><p>${s.targetFile?'笔记.txt':'没有文件'}</p>`}</section></div>`+
      controls(btn(s.mode==='text'?'复制整段文本':'复制文件','copy','',s.sleeping?'disabled':'')+btn(s.mode==='text'?'剪切整段文本':'剪切文件','cut','',s.sleeping?'disabled':'')+btn(s.mode==='text'?'粘贴到目标末尾':'粘贴到目标文件夹','paste','',s.sleeping?'disabled':'')+btn(s.sleeping?'唤醒':'模拟正常睡眠','sleep')+btn('清空当前剪贴板','clear'))+
      output(s.message)+coach('文件剪切先标记待移动，粘贴成功才移走源文件。本卡片的文件目标已有同名文件时会阻止重复复制；不会静默新增副本。这里只观察当前剪贴板，Windows历史与Office剪贴板的规则见正文。');
  },(s,a)=>{
    if(a==='sleep'){s.sleeping=!s.sleeping;s.message=s.sleeping?'进入正常睡眠，当前会话的剪贴板内容保留。':'已唤醒，可继续使用之前的当前剪贴板内容。';return;}
    if(a==='clear'){s.buffer=null;s.cut=false;s.message='已清空当前剪贴板；源文件或目标内容不会因此被删除。';return;}
    if(s.sleeping)return;
    if(a==='copy'||a==='cut'){
      s.cut=false;
      if(s.mode==='text'){if(!s.sourceText){s.message='源文本为空，没有可复制的文字。';return;}s.buffer={kind:'text',value:s.sourceText};if(a==='cut')s.sourceText='';s.message=a==='cut'?'所选整段文字已离开源位置，内容保存在剪贴板中。':'文本已复制，源文字保留。';}
      else{if(!s.sourceFile){s.message='源位置没有这个文件。';return;}s.buffer={kind:'file',op:a,value:'笔记.txt'};s.cut=a==='cut';s.message=s.cut?'图标变淡，只标记待移动；源文件仍在原文件夹。':'剪贴板保存文件传输信息，源文件仍保留。';}
    }
    if(a==='paste'){
      if(!s.buffer){s.message='当前剪贴板为空。';return;}
      if(s.buffer.kind!==s.mode){s.message='当前剪贴板类型与目标不匹配，请切换到对应场景。';return;}
      if(s.mode==='text'){s.targetText+=s.buffer.value;s.message='已把文本添加到目标末尾；剪贴板文字仍在，可再次粘贴。';}
      else if(!s.sourceFile){s.message='源文件已不可用，不能从这条文件传输信息再复制。';}
      else if(s.targetFile){s.message='目标已有同名文件，本次未执行。';}
      else{s.targetFile=true;if(s.buffer.op==='cut'){s.sourceFile=false;s.cut=false;s.buffer=null;s.message='粘贴成功，文件已移动到D盘，待移动操作完成。';}else s.message='目标建立文件副本，源文件保留。';}
    }
  });
register(['y2020q2'],'让置顶窗口盖住活动窗口，再实际输入','点击A或B标题，把键盘输入送到相应文本框；B置顶时不必成为活动窗口。',{
    active:'A',top:true,textA:'A中的笔记',textB:'B中的笔记',focusWindow:null,message:'B当前置顶；点击A标题后，可输入A，同时B仍覆盖在前。'
  },s=>controls(btn(s.top?'取消B置顶':'学习辅助：将B置顶','top'))+`<div class="lab-window-stack core-window-stack">${['A','B'].map((id,i)=>`<section class="lab-sample-window ${s.active===id?'active':''}" data-window="${id}" style="left:${i*15}%;top:${i*100}px;z-index:${id==='B'&&s.top?3:s.active===id?2:1}">${btn(`记事本 ${id}${s.active===id?' · 活动':''}${id==='B'&&s.top?' · 置顶':''}`,'activate',id)}${area('text'+id,'窗口'+id+'的文本',s['text'+id])}</section>`).join('')}</div>`+table(['窗口','实际文本'],[['A',esc(s.textA)],['B',esc(s.textB)]])+output(s.message)+coach('A、B是两个独立文本框。这里的“置顶”是外部学习辅助，不能理解成每个Windows窗口自带该按钮；覆盖次序与键盘输入焦点可以不同。'),
  (s,a,v)=>{if(a==='activate'){s.active=v;s.focusWindow=v;s.message='键盘输入送到窗口'+v+'的文本框。';}if(a==='top')s.top=!s.top;});
registry.y2020q2.focus=(s,key)=>{if(['textA','textB'].includes(key))s.active=key.slice(-1);};
registry.y2020q2.afterRender=(s,root)=>{
    const paint=()=>root.querySelectorAll('[data-window]').forEach(el=>{const id=el.dataset.window;el.style.zIndex=String(id==='B'&&s.top?3:s.active===id?2:1);el.classList.toggle('active',s.active===id);el.querySelector('button').textContent=`记事本 ${id}${s.active===id?' · 活动':''}${id==='B'&&s.top?' · 置顶':''}`;});
    root.querySelectorAll('textarea').forEach(el=>el.addEventListener('focus',()=>{s.active=el.dataset.field.slice(-1);paint();}));
    if(s.focusWindow){const id=s.focusWindow;s.focusWindow=null;root.querySelector(`[data-field="text${id}"]`)?.focus({preventScroll:true});}
  };
})();
