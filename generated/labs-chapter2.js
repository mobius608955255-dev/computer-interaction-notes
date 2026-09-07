// Generated from src/labs; edit the corresponding chapter source.
/* Shared lab calculations. Runtime must load first. */
(() => {
'use strict';
const {esc}=window.NOTE_LABS.ui;
const daysBetween=(a,b)=>Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000);
const radixConvert = raw => {
    if(!/^[01]{1,16}(\.[01]{1,12})?$/.test(raw))return null;
    const [whole,frac='']=raw.split('.');
    const left=whole.padStart(Math.ceil(whole.length/4)*4,'0');const right=frac.padEnd(Math.ceil(frac.length/4)*4,'0');
    const groups=x=>x.match(/.{4}/g)||[];
    return {binary:[groups(left).join(' '),groups(right).join(' ')].filter(Boolean).join(' . '),hex:parseInt(whole,2).toString(16).toUpperCase()+(frac?'.'+groups(right).map(x=>parseInt(x,2).toString(16).toUpperCase()).join(''):''),decimal:parseInt(whole,2)+[...frac].reduce((sum,v,i)=>sum+Number(v)*2**(-i-1),0)};
  };
function clusteredChart(labels,series){
    const all=series.flatMap(x=>x.values),max=Math.max(1,...all),group=420/labels.length,bw=Math.min(40,group/(series.length+1));
    return `<svg class="lab-data-chart" viewBox="0 0 480 270" role="img" aria-label="簇状柱形图"><line x1="40" x2="460" y1="220" y2="220" stroke="#687482"/>${labels.map((label,i)=>series.map((x,j)=>{const h=Number(x.values[i])/max*165,xp=40+i*group+15+j*bw;return `<rect x="${xp}" y="${220-h}" width="${bw-5}" height="${h}" fill="${x.color}"/><text x="${xp+(bw-5)/2}" y="${210-h}" text-anchor="middle">${x.values[i]}</text>`;}).join('')+`<text x="${40+i*group+group/2}" y="244" text-anchor="middle">${esc(label)}</text>`).join('')}</svg><div class="lab-chart-legend">${series.map(x=>`<span><i style="background:${x.color}"></i>${esc(x.name)}</span>`).join('')}</div>`;
  }
Object.assign(window.NOTE_LABS,{radixConvert,daysBetween,clusteredChart});
})();

/* Independent comparisons are labelled as such; they do not imitate saved operations. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,table,output,esc}=ui;
  const comparisons={
    'syllabus-word-smartart':[
      ['流程布局','按步骤组织内容',[['登记 → 审核 → 归档','依次进行的三步'],['增加步骤','选相邻形状，再从设计中添加形状']]],
      ['层次布局','表示上下级关系',[['学校 → 院系 → 班级','不是按时间排列的三个动作'],['修改对象','先分清文字、形状与整幅SmartArt']]],
      ['截图后的流程','只剩画面快照',[['图片','可以缩放、裁剪'],['结构','不能再按SmartArt节点添加形状']]]
    ],
    'syllabus-word-screen-clipping':[
      ['可用视窗','插入一个完整窗口的快照',[['准备','打开目标窗口，保持未最小化'],['入口','Word → 插入 → 屏幕截图 → 选择窗口缩略图']]],
      ['屏幕剪辑','只插入拖选的矩形区域',[['选择','拖出需要的对话框或局部内容'],['结果','插入的是图片，源窗口改变不会同步修改它']]]
    ],
    'syllabus-media-edit-export':[
      ['编辑工程','保留剪辑结构供继续修改',[['保存','轨道、片段位置、效果与素材引用'],['迁移','同时核对所需素材，工程文件不一定内含全部媒体']]],
      ['导出音频','产生可播放的声音文件',[['设置','格式、声道与编码参数'],['检查','预听起止点，多轨按需要混合']]],
      ['导出视频','产生按时间播放的成片',[['设置','分辨率、帧率、编码与保存位置'],['检查','重新播放，核对起止画面、音画同步']]]
    ],
    'syllabus-document-coauthor':[
      ['共享查看链接','同一份云端文档',[['参与者','可以阅读，不能直接改正文'],['讨论与编辑','需要相应功能及权限；查看权不等于编辑权']]],
      ['共享编辑链接','同一份云端文档',[['参与者','具备编辑权限时可协同修改'],['收尾','核对同步状态与版本，避免相互覆盖']]],
      ['发送附件','每位接收者得到独立副本',[['内容位置','改动保存在各自文件中'],['合并','需要另外汇总，不能自动视为共同编辑']]],
      ['批注与修订','讨论和审阅是不同动作',[['批注','提出意见，不直接替换正文'],['修订','记录文字增删，接受或拒绝决定最终文本']]]
    ],
    'syllabus-office-exchange':[
      ['DOCX','继续编辑结构化文档',[['保留','段落样式、表格、图片等文档结构'],['核对','跨软件打开后检查字体、分页和对象']]],
      ['TXT','交换纯文本',[['保留','字符与换行'],['不保留','复杂版面、字符富格式和嵌入图片']]],
      ['PDF','按固定页面阅读或打印',[['重点','检查导出后的页数和版面'],['编辑','PDF可有编辑工具，但不等于保留完整Word源结构']]]
    ],
    'syllabus-ppt-output':[
      ['讲义打印','一张纸包含多张幻灯片',[['适合','课堂分发、并排查看'],['检查','每页张数、顺序、缩放和可读性']]],
      ['备注页打印','幻灯片与演讲者备注同页',[['适合','演讲者准备讲稿'],['区别','大纲打印侧重标题和文本层级']]],
      ['导出PDF','固定页面供阅读',[['保留目标','页面外观与可支持的链接'],['动态效果','不会按放映时间执行动画和切换']]],
      ['导出视频','按时间形成连续画面',[['检查','旁白、对象动画和幻灯片计时'],['编辑源','仍保留PPTX，成片不保留可编辑幻灯片结构']]]
    ],
    'syllabus-quantum-basics':[
      ['经典比特','取0或1',[['表示','以确定的二值状态编码'],['读取','读取该比特的值']]],
      ['量子基态','计算基测量为对应结果',[['|0⟩','理想计算基测量得到0'],['|1⟩','理想计算基测量得到1']]],
      ['等幅叠加态','一次测量仍只有一个结果',[['理想重复实验','分别有50%的概率得到0和1'],['不能推出','一次性读取所有可能答案']]],
      ['纠缠','多个量子系统有不可独立分解的关联',[['利用','量子信息处理中的关联资源'],['边界','不能据此超光速发送可控消息']]]
    ],
    'syllabus-mobile-communication':[
      ['蜂窝上网','手机通过移动通信网络接入',[['终端到网络','蜂窝无线链路'],['体验','受覆盖、终端能力与网络负载影响']]],
      ['手机热点','笔记本到互联网分为两段',[['笔记本 → 手机','通常是Wi-Fi'],['手机 → 运营商','移动通信网络；不是5 GHz Wi-Fi']]],
      ['5G应用方向','三个方向关注不同目标',[['增强移动宽带','高数据速率业务'],['大规模机器通信','大量设备连接'],['超可靠低时延通信','对时效与可靠性敏感的业务']]]
    ]
  };
  for(const note of window.NOTES.notes){
    const cases=comparisons[note.id];if(!cases)continue;
    register([note.id],note.title,'选择一个独立情境，观察对象、作用与结果的对应关系。',{scenario:0},s=>
      `<div class="lab-controls">${cases.map((entry,i)=>btn(esc(entry[0]),'scenario',i,`aria-pressed="${s.scenario===i}"`)).join('')}</div>`+
      table(['观察对象','含义'],cases[s.scenario][2].map(row=>row.map(esc)))+output(esc(cases[s.scenario][1]))+
      '<p class="core-caption">独立情境对照 · 切换情境用于比较概念。</p>',(s,a,v)=>{if(a==='scenario')s.scenario=Number(v);});
  }
})();

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
register(['y2022q75'],'创建ZIP副本，不是改一个扩展名','先改文件夹名再压缩，或先压缩再改名，比较名称冲突和独立副本。',{
    folder:'年度总结',zipName:null,packedFolder:null,open:false,menu:false,extracted:false,message:'长按文件夹约0.6秒打开菜单；轻点不会触发长按。'
  },s=>`<div class="lab-explorer lab-file-management"><header>文件资源管理器 · 文稿资料</header><div class="lab-ribbon">${btn('右键菜单 / 长按','menu')}</div><div class="lab-file-list"><button type="button" data-lab-drag="hold" data-lab-act="folder">📁 ${esc(s.folder)}<small>类型：文件夹</small></button>${s.zipName?btn('▣ '+esc(s.zipName)+'<br><small>类型：ZIP压缩文件</small>','open'):''}</div>${s.menu?`<div class="lab-context-menu">${btn('发送到 → 压缩(zipped)文件夹','zip')}${btn('重命名为 年度总结.zip','rename')}${btn('取消','cancel')}</div>`:''}${s.open?table(['包内路径','内容'],[['年度报告.docx','文档'],['销售汇总.xlsx','工作簿'],['汇报.pptx','演示文稿']].map(([name,type])=>[esc(s.packedFolder+'/'+name),type]))+btn('全部提取到独立目录','extract'):''}${s.extracted?`<p data-extracted>解压结果：提取目录\\${esc(s.packedFolder)}\\（3 个文件）。原文件夹和 ZIP 仍保留。</p>`:''}</div>${output(esc(s.message))}${coach('本卡用文件夹当前完整名称加 .zip 为教学包命名；真实系统的默认命名及同名提示需现场核对。“全部提取”展示解压后的目录关系，不读取或生成真实压缩文件。')}`,
    (s,a)=>{
      if(a==='menu')s.menu=!s.menu;if(a==='cancel')s.menu=false;
      if(a==='zip'){
        s.menu=false;if(s.zipName){s.message='已有 ZIP 副本，本卡不覆盖它；可重置后比较另一操作顺序。';return;}
        s.packedFolder=s.folder;s.zipName=s.folder+'.zip';s.message='已创建 '+s.zipName+'；原文件夹仍名为 '+s.folder+'，没有自动改回原名。';
      }
      if(a==='rename'){s.menu=false;if(s.zipName==='年度总结.zip'){s.message='当前目录已有 年度总结.zip，不能给文件夹使用相同完整名称；原名称保留。';return;}s.folder='年度总结.zip';s.message='名称变了，类型仍是文件夹，没有执行压缩。';}
      if(a==='open'&&s.zipName)s.open=!s.open;
      if(a==='extract'&&s.zipName){s.extracted=true;s.message='已展示独立解压副本；原文件夹、ZIP 与解压结果不会自动同步。';}
    });
})();

/* Source provenance: note-labs-audit.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui,clusteredChart,daysBetween}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
register(['y2026q34'],'在任务管理器里操作真实的示例进程','切换进程、性能、启动页，结束任务后列表会改变，主机名称保持不变。',{tab:'process',processes:['记事本','计算器'],selected:'记事本',startup:true,view:null},s=>
 `<div class="lab-browser"><header>任务管理器 · 当前主机：学习电脑</header><div class="lab-tabs">${[['process','进程'],['performance','性能'],['startup','启动']].map(([k,t])=>btn(t,'tab',k,`aria-pressed="${s.tab===k}"`)).join('')}</div><div class="lab-browser-page">${s.tab==='process'?table(['名称','操作'],s.processes.map(n=>[btn(n,'select',n),btn('结束任务','end',n)]))+controls(btn('打开文件所在位置','location','',s.selected?'':'disabled')+btn('属性','properties','',s.selected?'':'disabled')):s.tab==='performance'?table(['资源','示例使用量'],[['CPU','12%'],['内存','3.2 / 8 GB'],['网络','0.1 Mbps']]):table(['启动项','状态','操作'],[['示例同步工具',s.startup?'已启用':'已禁用',btn(s.startup?'禁用':'启用','startup')]])}${s.view?dialog(s.view==='location'?'文件资源管理器':'文件属性',s.view==='location'?'<p>C:\\Windows\\System32</p><p>'+ (s.selected==='记事本'?'notepad.exe':'calc.exe')+'</p>':'<p>文件类型：应用程序</p><p>示例所选进程：'+esc(s.selected)+'</p>',btn('关闭','close')):''}</div></div>`+output('结束任务终止运行实例；打开文件位置进入磁盘目录。性能数值为静态示例，不读取你的设备。'),
 (s,a,v)=>{if(a==='tab'){s.tab=v;s.view=null;}if(a==='select')s.selected=v;if(a==='end'){s.processes=s.processes.filter(n=>n!==v);if(s.selected===v)s.selected=s.processes[0]||null;s.view=null;}if(a==='startup')s.startup=!s.startup;if((a==='location'||a==='properties')&&s.processes.includes(s.selected))s.view=a;if(a==='close')s.view=null;});
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

/* Bounded Windows 10 file-management exercises. No host filesystem access. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,table,output,coach,esc}=ui;
  const controls=html=>`<div class="lab-controls">${html}</div>`;
  const shell=(title,body)=>`<div class="lab-explorer lab-file-management"><header>${title}</header>${body}</div>`;
  const validName=name=>!!name.trim()&&name.length<=255&&!/[\\/:*?"<>|\u0000-\u001f]/.test(name)&&!/[ .]$/.test(name)&&!/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(name);
  const nameTaken=(files,name,except)=>files.some(f=>f.id!==except&&f.name.toLowerCase()===name.toLowerCase());

  const folders={
    'C:\\':{parent:null,children:['C:\\课程']},
    'C:\\课程':{parent:'C:\\',children:['C:\\课程\\Windows'],files:['笔记.txt']},
    'C:\\课程\\Windows':{parent:'C:\\课程',children:[],files:['笔记.txt','复习.txt']},
    'D:\\资料':{parent:'D:\\',children:[],files:['笔记.txt']},
    'D:\\':{parent:null,children:['D:\\资料']}
  };
  register(['syllabus-windows-paths'],'上一级与后退，去的是同一个位置吗','先从 D 盘跳到 C 盘的课程文件夹，再分别比较上一级与后退。',{
    path:'D:\\资料',history:[],address:'D:\\资料',message:'当前在 D:\\资料；同名文件可以位于不同目录。'
  },s=>shell('目录导航 · 有限样本',
    controls(field('address','地址栏（示例路径）',s.address)+btn('进入路径','address'))+
    controls(btn('上一级','up','',folders[s.path].parent?'':'disabled')+btn('后退','back','',s.history.length?'':'disabled')+btn('跳到 C:\\课程','go','C:\\课程'))+
    `<p class="lab-path" data-current-path>${esc(s.path)}</p><div class="lab-file-list">${folders[s.path].children.map(p=>btn('进入文件夹：'+esc(p.split('\\').pop()),'go',p)).join('')}${(folders[s.path].files||[]).map(f=>`<p>${esc(f)}<small>完整路径：${esc(s.path+'\\'+f)}</small></p>`).join('')}</div>`)+output(esc(s.message))+coach('“进入文件夹”按钮是学习用导航入口；本卡不模拟所有系统对象、盘符和真实磁盘。地址输入仅接受本卡列出的示例路径。', '本演示的范围与限制'),
    (s,a,v)=>{
      let target=a==='go'?v:a==='up'?folders[s.path].parent:a==='address'?s.address:null;
      if(a==='back'&&s.history.length){s.path=s.history.pop();s.address=s.path;s.message='后退回到刚访问过的 '+s.path;return;}
      if(target&&!folders[target]){s.message='此路径不在教学样本中；当前目录未改变。';return;}
      if(target&&target!==s.path){s.history.push(s.path);s.path=target;s.address=target;s.message=(a==='up'?'按目录层级进入上一级：':'已进入：')+target;}
    });

  const selectionId='syllabus-windows-selection';
  const chosen=s=>s.files.filter(f=>s.selected.includes(f.id));
  register([selectionId],'连续、不连续与混合选择','点击项目选择；同时按住或点亮 Ctrl、Shift，再观察选区。新建和单项改名会更新同一份文件列表。',{
    files:[{id:1,name:'01 笔记.txt',folder:false},{id:2,name:'02 练习.txt',folder:false},{id:3,name:'03 答案.txt',folder:false},{id:4,name:'04 图片',folder:true},{id:5,name:'05 作业.docx',folder:false}],
    nextId:6,selected:[],anchor:null,ctrl:false,shift:false,name:'复习资料',message:'尚未选中项目。'
  },s=>shell('C:\\课程 · 选择和命名',
    controls(`<div role="group" aria-label="选择组合键（触屏辅助）">${['ctrl','shift'].map(k=>btn(k==='ctrl'?'Ctrl':'Shift','modifier',k,`aria-pressed="${s[k]}"`)).join('')}</div>`+btn('全选','all')+btn('反向选择','invert')+btn('取消选择','clear'))+
    `<div class="lab-file-list lab-selection-list" role="group" aria-label="可选择项目">${s.files.map(f=>btn(`${f.folder?'📁':'▤'} ${esc(f.name)}`,'choose',f.id,`aria-pressed="${s.selected.includes(f.id)}"`)).join('')}</div><p data-selection-summary>已选 ${s.selected.length} 项：${esc(chosen(s).map(f=>f.name).join('、')||'无')}</p>`+
    controls(field('name','新名称（单项改名时含扩展名）',s.name,'text','maxlength="255"')+btn('新建文件夹','new')+btn('给选中项目改名','rename','',s.selected.length===1?'':'disabled')))+output(esc(s.message))+coach('普通点击替换选区，Ctrl 增减单项，Shift 从锚点选到当前项，Ctrl+Shift 把新范围加入原选区。电脑可使用实际 Ctrl/Shift 单击；Ctrl+A 全选，F2 把选中名称送入输入框。此练习不实现框选、批量编号或长按多选。', '本演示的范围与限制'),
    (s,a,v)=>{
      if(a==='modifier'&&['ctrl','shift'].includes(v)){s[v]=!s[v];return;}
      if(a==='choose'){
        const id=Number(v),keys=s.pointerKeys||{};delete s.pointerKeys;
        if(!s.files.some(f=>f.id===id))return;
        const ctrl=s.ctrl||keys.ctrl,shift=s.shift||keys.shift;
        if(shift&&s.anchor!==null){
          const first=s.files.findIndex(f=>f.id===s.anchor),last=s.files.findIndex(f=>f.id===id);
          const range=s.files.slice(Math.min(first,last),Math.max(first,last)+1).map(f=>f.id);
          s.selected=ctrl?[...new Set([...s.selected,...range])]:range;
        }else{s.selected=ctrl?(s.selected.includes(id)?s.selected.filter(x=>x!==id):[...s.selected,id]):[id];s.anchor=id;}
        s.message='选区已改变；文件的位置和内容没有变化。';return;
      }
      if(a==='all')s.selected=s.files.map(f=>f.id);
      if(a==='invert')s.selected=s.files.filter(f=>!s.selected.includes(f.id)).map(f=>f.id);
      if(a==='clear'){s.selected=[];s.anchor=null;}
      if(['all','invert','clear'].includes(a)){s.message='已更新选择，共 '+s.selected.length+' 项。';return;}
      if(a==='rename'||a==='new'){
        const target=chosen(s)[0];if(a==='rename'&&s.selected.length!==1)return;
        if(!validName(s.name)){s.message='名称无效：检查空名称、禁用字符、保留名、末尾空格/句点与长度。';return;}
        if(nameTaken(s.files,s.name,a==='rename'?target.id:null)){s.message='当前目录已有同名项目；原列表未改变。';return;}
        if(a==='new'){const id=s.nextId++;s.files.push({id,name:s.name,folder:true});s.selected=[id];s.anchor=id;s.message='已在 C:\\课程 新建文件夹，未创建文档。';}
        else{target.name=s.name;s.message='已改变选中项目的名称；其类型和内容未转换。';}
      }
    });
  registry[selectionId].afterRender=(s,root)=>{
    root.querySelectorAll('[data-lab-act="choose"]').forEach(b=>b.addEventListener('click',e=>{s.pointerKeys={ctrl:e.ctrlKey||e.metaKey,shift:e.shiftKey};},{capture:true}));
    if(s.focusName){delete s.focusName;const input=root.querySelector('[data-field="name"]');input.focus({preventScroll:true});input.select();}
  };
  registry[selectionId].keydown=(s,e)=>{
    if(e.target.matches('input,textarea,select'))return false;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a'){e.preventDefault();registry[selectionId].action(s,'all');return true;}
    if(e.key==='F2'&&s.selected.length===1){e.preventDefault();s.name=chosen(s)[0].name;s.focusName=true;return true;}
    return false;
  };

  const samples=[
    {name:'笔记.txt',path:'C:\\课程'},{name:'笔记1.txt',path:'C:\\课程'},{name:'笔记12.txt',path:'C:\\课程'},
    {name:'期末复习.txt',path:'C:\\课程\\Windows'},{name:'笔记2.docx',path:'C:\\课程\\Windows'},
    {name:'笔记3.txt',path:'D:\\资料'}
  ];
  const matches=s=>{const re=new RegExp('^'+s.pattern.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.')+'$','iu');return samples.filter(f=>(s.scope==='all'||f.path==='C:\\课程'||s.scope==='tree'&&f.path.startsWith('C:\\课程\\'))&&re.test(f.name));};
  register(['syllabus-windows-search'],'同一个模式，搜索范围会改变结果','修改文件名模式与目录范围，再核对命中项的完整位置。',{
    pattern:'笔记?.txt',scope:'current'
  },s=>shell('文件名模式练习 · 6 个固定样本',
    controls(field('pattern','文件名模式',s.pattern,'text','maxlength="120"')+select('scope','搜索范围',s.scope,[['current','C:\\课程 · 仅当前文件夹'],['tree','C:\\课程 · 含子文件夹'],['all','全部教学位置（含 D 盘）']]))+
    table(['命中文件','所在位置'],matches(s).map(f=>[esc(f.name),esc(f.path)]))+
    `<details><summary>查看全部 6 个样本</summary>${table(['文件','所在位置'],samples.map(f=>[esc(f.name),esc(f.path)]))}</details>`)+output(`匹配 ${matches(s).length} 项。* 可匹配零个或多个字符，? 匹配一个字符。`)+coach('只进行整段文件名模式匹配，不模拟 Windows 索引、正文检索或完整 AQS。输入笔记*.txt与笔记?.txt比较，再切换范围；这些结果不能用来声称已实测原生 Windows 搜索。', '本演示的范围与限制'),()=>{});

  register(['merged-4'],'名称显示、默认应用和属性分别改变什么','连续切换设置，再尝试在示例文件夹中新建项目；同一张卡片保留实际状态。',{
    extension:true,app:'Word',readonly:false,hidden:false,showHidden:false,writable:true,children:[],message:'report.docx 的真实内容是 Word 文档。'
  },s=>shell('属性与显示 · 局部教学模型',
    controls(btn(s.extension?'隐藏扩展名':'显示扩展名','extension')+btn(s.showHidden?'不显示隐藏项':'显示隐藏项','showHidden'))+
    (s.hidden&&!s.showHidden?'<p data-property-file>文件列表不显示隐藏的 report.docx。</p>':`<p data-property-file class="${s.hidden?'lab-hidden-file':''}"><b>${s.extension?'report.docx':'report'}</b><br>真实类型：Word 文档；默认应用：${esc(s.app)}；文件属性：${s.readonly?'只读':'可写'}${s.hidden?'、隐藏':''}</p>`)+
    controls(select('app','默认打开应用（已安装的教学选项）',s.app,[['Word','Word'],['WordPad','写字板']])+btn(s.readonly?'取消文件只读':'给文件设只读','readonly')+btn(s.hidden?'取消文件隐藏':'给文件设隐藏','hidden')+btn('尝试保存文件修改','save'))+
    `<section><h4>课程资料 · 文件夹</h4><p>只读标记 ◼；写入权限：${s.writable?'允许':'拒绝（示例条件）'}</p>${controls(btn(s.writable?'教学条件：拒绝写入':'教学条件：允许写入','permission')+btn('在文件夹中新建','new'))}${s.children.map(x=>`<p>📁 ${esc(x)}</p>`).join('')}</section>`)+output(esc(s.message))+coach('这是属性区别的有限模型。只读操作作用于 report.docx；隐藏项显示与隐藏属性分别保存。默认应用只改关联；本卡不模拟安全权限编辑器、格式兼容性或所有删除接口。', '本演示的范围与限制'),
    (s,a)=>{
      if(['extension','showHidden','readonly','hidden'].includes(a)){s[a]=!s[a];s.message=a==='extension'?'只改变名称显示，真实扩展名和内容保留。':a==='showHidden'?'只改变隐藏项是否显示，文件隐藏属性保留。':'已改变文件属性，目录写入权限未改变。';}
      if(a==='permission'){s.writable=!s.writable;s.message='只改变教学文件夹的写入权限条件；文件只读属性未改变。';}
      if(a==='save')s.message=s.readonly?'示例应用拒绝覆盖只读文件；请先处理属性或另存为。':'示例应用完成保存；文件格式仍为 Word 文档。';
      if(a==='new'){if(!s.writable){s.message='拒绝访问：没有文件夹写入权限，未新建。';return;}s.children.push('新建文件夹'+(s.children.length?' ('+s.children.length+')':''));s.message='已在文件夹中新建；只读方块并不等于禁止创建子项。';}
    },(s,k,v)=>{if(k==='app'&&['Word','WordPad'].includes(v)){s.app=v;s.message='默认打开程序已改变，report.docx 的内容和格式未转换。';}});
})();
