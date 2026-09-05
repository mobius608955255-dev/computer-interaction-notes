/* Independent, stateful demonstrations. No worksheet actions are learning controls. */
(() => {
  'use strict';
  const sim = window.NOTE_SIMULATIONS;
  const esc = sim.escapeHTML;
  const registry = {};
  const states = new WeakMap();
  let serial = 0;
  const btn = (text,act,value='',extra='') => `<button type="button" data-lab-act="${act}" data-value="${esc(String(value))}" ${extra}>${text}</button>`;
  const field = (name,label,value,type='text',extra='') => `<label>${label}<input data-field="${name}" type="${type}" value="${esc(String(value))}" ${extra}></label>`;
  const select = (name,label,value,options) => `<label>${label}<select data-field="${name}">${options.map(o=>`<option value="${esc(String(o[0]))}" ${String(o[0])===String(value)?'selected':''}>${esc(o[1])}</option>`).join('')}</select></label>`;
  const table = (head,rows) => `<div class="lab-table-scroll" tabindex="0" aria-label="数据表，可横向滚动"><table><thead><tr>${head.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const coach = text => `<div class="lab-coach"><b>操作提示</b><p>${text}</p></div>`;
  const output = text => `<output class="lab-output" aria-live="polite">${text}</output>`;
  const office = (app,tab,commands,body) => `<div class="lab-office lab-${app.toLowerCase()}"><header>${app} 2016 · 局部操作仿真</header><nav aria-label="功能区位置">${[...new Set(['文件','开始','插入',tab])].map(t=>t===tab?`<span>${t}</span>`:t).join('　')}</nav><div class="lab-ribbon">${commands}</div><div class="lab-workspace">${body}</div><footer>演示文档 · 操作仅影响本卡片</footer></div>`;
  const dialog = (title,body,commands) => `<section class="lab-dialog" role="group" aria-label="${title}"><header>${title}</header><div>${body}</div><footer>${commands}</footer></section>`;
  const paper = body => `<div class="lab-paper">${body}</div>`;
  const register = (ids,title,task,initial,render,action,change) => {
    const key = ids[0];
    registry[key] = {initial,render,action,change};
    for (const id of ids) {
      sim.demos[id] = {kind:'lab',title,task,initial:'直接操作画面。'};
      sim.scenes[id] = () => `<div class="note-lab" data-lab="${key}"></div>`;
    }
  };
  const fresh = key => ({...structuredClone(registry[key].initial),uid:`lab-${++serial}`});
  const number = (v,min,max) => Math.max(min,Math.min(max,Number(v)||0));
  const money = n => Number(n).toLocaleString('zh-CN',{maximumFractionDigits:2});

  register(['y2022q4'],'沿三条总线完成一次取数','分别发出地址、读信号与返回数据，观察方向和用途。', {signal:'address'}, s => {
    const signals={address:['地址总线','CPU → 内存','地址 0x0020'],control:['控制信号','CPU → 内存','READ：读'],data:['数据总线','内存 → CPU','内容 42'],interrupt:['控制信号','设备 → CPU','IRQ：中断请求']};
    const x=signals[s.signal];
    return `<div class="lab-bus"><div class="lab-chip">CPU<small>地址寄存器 / 数据寄存器</small></div><div class="lab-wires">${['地址','数据','控制'].map((v,i)=>`<div class="${['address','data','control'][i]===s.signal || i===2&&s.signal==='interrupt'?'active':''}">${v} ━━━━━━━━━</div>`).join('')}</div><div class="lab-chip">内存 / 设备<small>0x0020 → 42</small></div></div><div class="lab-controls">${Object.entries(signals).map(([k,v])=>btn(v[2],'signal',k)).join('')}</div>${output(`${x[0]}：${x[1]}；传送 ${x[2]}。`)}`;
  },(s,a,v)=>{s.signal=v;});

  register(['y2022q10'],'选中样式实例，再删除文字','区别“选择所有实例”“清除格式”和“删除内容”。',{selected:false,deleted:false,plain:false},s=>
    office('Word','开始',btn('标题 1 ▾','menu')+(s.menu?btn('选择所有 3 个实例','select')+btn('清除格式','clear'):''),paper([1,2,3].map((n)=>`${s.deleted?'':`<h4 class="${s.selected?'lab-selected':''} ${s.plain?'lab-plain':''}">第${n}章　${['信息技术','操作系统','文字处理'][n-1]}</h4>`}<p>这一章的正文内容仍然保留。</p>`).join('')))+`<div class="lab-keyboard" aria-label="模拟键盘">${btn('Delete','delete')}</div>${coach('样式菜单属于Word功能区；下方是独立模拟键盘。先选择实例，再按Delete。')}${output(s.deleted?'3个标题文字已删除，正文没有被删除。':s.plain?'文字仍在，只移除了标题格式。':s.selected?'已选中3个标题段落。':'当前没有批量选择。')}`,
    (s,a)=>{if(a==='menu')s.menu=!s.menu;if(a==='select')s.selected=true;if(a==='clear'&&s.selected){s.plain=true;s.selected=false;}if(a==='delete'&&s.selected){s.deleted=true;s.selected=false;}});

  register(['y2022q15'],'网络服务收发台','切换服务，再执行一次具体网络任务。',{service:'FTP',sent:false},s=>{
    const info={FTP:['文件传输','影像资料.zip','文件服务器','226 Transfer complete'],SMTP:['发送邮件','会议邀请.eml','邮件服务器','250 Message accepted'],POP3:['收取邮件','收件箱中的新邮件','邮件服务器','+OK 1 message'],Telnet:['远程终端','远程命令：date','远程主机','终端返回系统日期']}; const v=info[s.service];
    return `<div class="lab-controls">${select('service','服务',s.service,Object.keys(info).map(k=>[k,k]))}</div><div class="lab-service"><section><b>本地客户端</b><p>${v[1]}</p>${btn(v[0],'send')}</section><div class="lab-packet ${s.sent?'travel':''}">${s.sent?'已传送':'等待任务'} ${s.service==='POP3'?'←':'→'}</div><section><b>${v[2]}</b><p>${s.sent?esc(v[3]):'等待连接'}</p></section></div>${output(`${s.service}负责${v[0]}。此处不连接外网；传统FTP/Telnet的明文连接不适合传输秘密。`)}`;
  },s=>{s.sent=true;},(s,k,v)=>{s[k]=v;s.sent=false;});

  register(['y2022q16'],'编辑HTML，看标签页与正文各自改变','修改title与h1，切换两个标签页验证它们的位置。',{title:'计算机笔记',heading:'第一章 信息技术',tab:0},s=>
    `<div class="lab-code-editor">${field('title','<code>&lt;title&gt;</code>',s.title)}${field('heading','<code>&lt;h1&gt;</code>',s.heading)}</div><div class="lab-browser"><div class="lab-tabs">${btn(esc(s.title),'tab',0,`aria-pressed="${s.tab===0}"`)}${btn('参考资料','tab',1,`aria-pressed="${s.tab===1}"`)}</div><div class="lab-address">https://notes.example/${s.tab?'reference':'chapter1'}</div><div class="lab-browser-page"><h2>${s.tab?'资料索引':esc(s.heading)}</h2><p>${s.tab?'这是真正独立的一页内容。':'title不会作为正文自动显示；h1是这段内容的标题。'}</p></div></div>`,(s,a,v)=>{s.tab=Number(v);});

  register(['y2022q24'],'抓住标尺三角，观察段落的第一行与其余行','拖动上三角、下三角和方块；也可聚焦标记后使用方向键。',{first:12,rest:0,right:100},s=>{
    const handle=(name,label,pos,shape)=>`<button class="lab-ruler-handle ${shape}" data-lab-drag="ruler" data-key="${name}" style="left:${pos}%" role="slider" aria-label="${label}" aria-valuemin="0" aria-valuemax="60" aria-valuenow="${pos}">${shape==='square'?'■':'▼'}</button>`;
    return office('Word','视图','<span>☑ 标尺</span>',`<div class="lab-ruler" data-ruler>${Array.from({length:11},(_,i)=>`<span>${i}</span>`).join('')}${handle('first','首行缩进',s.first,'upper')}${handle('rest','悬挂缩进',s.rest,'lower')}${handle('both','整段左缩进',s.rest,'square')}</div>${paper(`<p class="lab-indent" style="margin-left:${s.rest}%;text-indent:${(s.first-s.rest)/(100-s.rest)*100}%">真正理解缩进，要看第一行与其余行的位置。上方三角控制第一行；下方三角控制后续行。拖动方块会把它们一同移动，首行与其余行的相对距离保持不变。</p>`)}`)+output(`首行位置 ${s.first.toFixed(0)}；其余行位置 ${s.rest.toFixed(0)}。标尺以相对刻度示意，不是厘米。`);
  },()=>{});

  register(['y2022q33'],'用缓存换计算：区间求和工作台','改变数据规模和查询次数，对照重复扫描与前缀和。',{n:100,q:10},s=>
    `<div class="lab-controls">${field('n','数据项数 n',s.n,'range','min="10" max="1000" step="10"')}${field('q','查询次数 q',s.q,'range','min="1" max="100"')}</div><div class="lab-complexity">${[['逐次扫描',s.n*s.q,1],['先建前缀和',s.n+s.q,s.n+1]].map(([name,time,space])=>`<section><h4>${name}</h4><div class="lab-bar"><i style="width:${Math.max(2,time/(s.n*s.q)*100)}%"></i></div><p>示意运算量 ${money(time)}</p><p>额外存储单元 ${money(space)}</p></section>`).join('')}</div>${output(`n=${s.n}，q=${s.q}。采用全长查询估算：扫描约nq次，前缀和约n+q次；两种方法都能得到相同和。`)}`,()=>{},(s,k,v)=>{s[k]=number(v,1,1000);});

  register(['y2022q34'],'对话框开着，父窗口还能编辑吗','分别打开模式与无模式窗口，再尝试在父窗口输入。',{mode:'modal',open:false,text:'可编辑的正文'},s=>
    `<div class="lab-controls">${select('mode','窗口类型',s.mode,[['modal','模式'],['modeless','无模式']])}${btn('打开对话框','open')}</div><div class="lab-dialog-demo"><div ${s.open&&s.mode==='modal'?'inert aria-hidden="true"':''}>${field('text','父窗口正文',s.text)}</div>${s.open?dialog(s.mode==='modal'?'模式对话框':'无模式查找窗口','<p>模式窗口打开时，父窗口输入会被阻止。</p>',btn('关闭','close')):''}</div>${output(s.open?(s.mode==='modal'?'父窗口已锁定；先关闭对话框才能继续。':'父窗口仍可编辑；该窗口不阻塞父窗口。'):'对话框已关闭，正文可以编辑。')}`,
    (s,a)=>{s.open=a==='open';});

  register(['y2022q39'],'一台终端出问题，会扩散到哪里','启用分区策略或冗余，再观察攻击和链路故障的影响。',{segmented:false,attacked:false,failed:false,redundant:false},s=>
    `<div class="lab-controls">${btn(s.segmented?'关闭分区策略':'启用分区策略','segment')}${btn('模拟终端被攻陷','attack')}${btn(s.redundant?'关闭备用链路':'配置备用链路','redundant')}${btn('模拟主链路故障','fail')}</div><div class="lab-network"><div class="${s.attacked?'danger':''}">办公终端</div><span>→ ${s.segmented?'策略隔离':'允许互访'} →</span><div class="${s.attacked&&!s.segmented?'danger':'safe'}">核心数据库</div><span>${s.failed&&!s.redundant?'× 主链路中断':'↔ 链路可用'}</span><div>备份服务</div></div>${output(s.attacked?(s.segmented?'攻击源仍存在，但本例横向访问被策略阻止。':'本例允许互访，数据库暴露于横向攻击路径。'):'尚未注入攻击。')}${output(s.failed?(s.redundant?'已切到事先配置的备用链路。':'没有备用路径，服务不可达。'):'主链路正常。')}`,
    (s,a)=>{if(a==='segment')s.segmented=!s.segmented;if(a==='attack')s.attacked=true;if(a==='redundant')s.redundant=!s.redundant;if(a==='fail')s.failed=true;});

  register(['y2022q43'],'逐轮执行1到n的累加','每次执行一轮，查看S与i的实际更新，而不是直接跳到答案。',{n:10,i:1,sum:0,history:[]},s=>
    `<div class="lab-controls">${field('n','循环上限 n',s.n,'number','min="1" max="30"')}${btn('执行一轮','step','',s.i>s.n?'disabled':'')}${btn('运行到结束','run','',s.i>s.n?'disabled':'')}</div><div class="lab-registers"><b>i = ${s.i}</b><b>S = ${s.sum}</b><b>i ≤ ${s.n}：${s.i<=s.n?'成立':'不成立'}</b></div><pre class="lab-code">S ← 0; i ← 1\nwhile i ≤ n:\n    S ← S + i\n    i ← i + 1</pre><div class="lab-tape">${s.history.map(x=>`<span>${x}</span>`).join('')}</div>${output(s.i>s.n?`循环结束。S=${s.sum}；下次条件检查时i=${s.i}。`:'等待下一轮，S保留此前累加结果。')}`,
    (s,a)=>{const step=()=>{if(s.i<=s.n){const old=s.sum;s.sum+=s.i;s.history.push(`${old} + ${s.i} = ${s.sum}`);s.i++;}};if(a==='run')while(s.i<=s.n)step();else step();},(s,k,v)=>{s.n=number(v,1,30);s.i=1;s.sum=0;s.history=[];});

  register(['y2022q44'],'启动同一程序，观察多个运行实例','打开记事本并结束其中一个进程；磁盘上的程序不会被卸载。',{processes:[],pid:1200},s=>
    `<div class="lab-program-file"><b>磁盘文件：notepad.exe</b>${btn('启动记事本','launch')}</div><div class="lab-task-manager"><header>任务管理器 · 进程（${s.processes.length}）</header>${table(['名称','PID','内存（示意）','操作'],s.processes.map(p=>['记事本',p,'12 MB',btn('结束任务','end',p)]))}</div>${output(s.processes.length?`一个程序文件，${s.processes.length}个独立运行实例。`:'没有正在运行的记事本进程；程序文件仍存在。')}`,
    (s,a,v)=>{if(a==='launch'&&s.processes.length<6)s.processes.push(s.pid++);if(a==='end')s.processes=s.processes.filter(p=>p!==Number(v));});

  register(['y2022q54'],'把邀请语变成弧形艺术字','修改文字、弯曲程度和填充，查看路径上的实时文字。',{text:'诚挚邀请，敬候光临！',curve:40,color:'#b95729'},s=>
    office('Word','绘图工具 · 格式',select('color','文字填充',s.color,[['#b95729','赭橙'],['#2563a0','蓝色'],['#21443d','墨绿']])+field('curve','转换：弧度',s.curve,'range','min="0" max="80"'),paper(`<svg class="lab-art" viewBox="0 0 400 150" role="img" aria-label="弧形艺术字预览"><defs><path id="${s.uid}-arc" d="M20 100 Q200 ${100-s.curve*2} 380 100"/></defs><text fill="${s.color}" font-size="24"><textPath href="#${s.uid}-arc" startOffset="50%" text-anchor="middle">${esc(s.text)}</textPath></text></svg>`))+`<div class="lab-controls">${field('text','艺术字内容',s.text)}</div>${coach('弧度控件是学习调节器；Word实际从“文字效果→转换”选择路径样式。')}`,()=>{},(s,k,v)=>{s[k]=k==='curve'?number(v,0,80):v;});

  register(['y2022q55'],'插入脚注，看引用标记与说明对应','选择正文位置插入脚注，删引用标记后观察自动重编号。',{active:0,refs:[]},s=>
    office('Word','引用',btn('插入脚注','insert'),paper([0,1,2].map(n=>`<p>${btn(['数字化将信息编码。','压缩可减少数据量。','传输需要考虑时序。'][n],'select',n,`class="lab-text-select ${s.active===n?'lab-selected':''}"`)}${s.refs.includes(n)?`<sup>${btn(String(s.refs.indexOf(n)+1),'remove',n,'aria-label="删除此脚注引用标记"')}</sup>`:''}</p>`).join('')+`<div class="lab-footnotes">${s.refs.map((n,i)=>`<p>${i+1}　${['信息表示为离散的编码数据。','无损可精确恢复，有损不保证。','实时媒体需要控制时延与抖动。'][n]}</p>`).join('')||'页底说明区'}</div>`))+coach('先点一句正文确定插入位置。点上标删除对应引用标记，其余编号会重新排列。'),
    (s,a,v)=>{if(a==='select')s.active=Number(v);if(a==='insert'&&!s.refs.includes(s.active))s.refs.push(s.active);if(a==='remove')s.refs=s.refs.filter(n=>n!==Number(v));s.refs.sort((a,b)=>a-b);});

  const salaryRows=[10000,9500,3500,12000];
  const salarySheet=(s,mode)=>table(['行','姓名',mode==='comments'?'证件编号（示意）':'基本工资'],s.values.map((v,i)=>[i+3,['王宁','李明','赵敏','周林'][i],`<button data-lab-drag="range" data-row="${i}" data-lab-act="cell" data-value="${i}" class="lab-cell ${i>=Math.min(s.start,s.end)&&i<=Math.max(s.start,s.end)?'lab-selected':''}">${mode==='comments'?['ID-001','ID-002','ID-003','ID-004'][i]:money(v)}${s.comments?.[i]?'<i class="lab-comment-corner"></i>':''}</button>`]));
  register(['y2022q58'],'复制倍率，框选工资，再选择性粘贴','从第一格拖到最后一格选择区域；倍率和粘贴运算都会影响真实结果。',{values:salaryRows,start:-1,end:-1,multiplier:1.15,copied:null,paste:false,operation:'multiply',message:'先复制倍率单元格。'},s=>
    office('Excel','开始',btn('复制','copy')+btn('选择性粘贴…','paste'),`${field('multiplier','M1 倍率（初始选中）',s.multiplier,'number','step="0.01"')}${salarySheet(s)}${s.paste?dialog('选择性粘贴',select('operation','运算',s.operation,[['multiply','乘'],['add','加'],['none','无（普通覆盖）']])+`<p>已复制：${s.copied??'空'}；目标：${s.start<0?'未选中':`J${Math.min(s.start,s.end)+3}:J${Math.max(s.start,s.end)+3}`}</p>`,btn('确定','apply')+btn('取消','cancel')):''}`)+`<div class="lab-controls">${btn('键盘辅助：选择 J3:J6','all')}</div>${output(s.message)}`,
    (s,a,v)=>{if(a==='copy'){s.copied=s.start<0?s.multiplier:s.values[s.start];s.message=`已复制 ${s.copied}，现在选中目标工资。`;}if(a==='cell')s.start=s.end=Number(v);if(a==='all'){s.start=0;s.end=3;}if(a==='paste')s.paste=true;if(a==='cancel')s.paste=false;if(a==='apply'){if(s.copied===null||s.start<0){s.message='需要先复制倍率并选择目标区域。';return;}s.values=s.values.map((x,i)=>i>=Math.min(s.start,s.end)&&i<=Math.max(s.start,s.end)?Math.round((s.operation==='multiply'?x*s.copied:s.operation==='add'?x+s.copied:s.copied)*100)/100:x);s.paste=false;s.message='所选单元格的数值已改变；未选中的单元格保持原值。';}},(s,k,v)=>{s[k]=k==='multiplier'?number(v,0,100):v;if(k==='multiplier')s.start=s.end=-1;});

  const daysBetween=(a,b)=>Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000);
  register(['y2022q59'],'工龄究竟是取整，还是只改显示','改变日期，看INT、ROUND和显示格式得出的区别。',{start:'2020-09-01',end:'2022-05-07'},s=>{
    const days=daysBetween(s.start,s.end),years=days/365;const valid=Number.isFinite(days)&&days>=0;
    return `<div class="lab-controls">${field('start','入职日期',s.start,'date')}${field('end','计算基准日',s.end,'date')}</div>${valid?office('Excel','公式',`<code>=INT((基准日-入职日)/365)</code>`,table(['方法','显示值','实际数值'],[['INT向下取整',Math.floor(years),Math.floor(years)],['ROUND四舍五入',Math.round(years),Math.round(years)],['原值只显示0位小数',Math.round(years),years.toFixed(6)]]))+output(`${days}天 ÷ 365 = ${years.toFixed(6)}。满365天才增加一个整年。`):output('请选择合法日期，且入职日期不得晚于基准日。')}${coach('为了可重复观察，这里手动指定基准日；实际公式TODAY()读取当天日期。')}`;
  },()=>{});

  register(['y2022q61'],'复制说明，不覆盖证件编号','创建批注后选择多格，用选择性粘贴只复制批注。',{values:salaryRows,comments:['请核对原始证件','','',''],start:0,end:0,clipboard:null,paste:false,kind:'comments',message:'第一格已有批注，其他格没有。'},s=>
    office('Excel','开始 / 审阅',btn('复制','copy')+btn('选择性粘贴…','paste'),`${salarySheet(s,'comments')}${s.start>=0?`<aside class="lab-comment">批注：${esc(s.comments[s.start]||'无')}</aside>`:''}${s.paste?dialog('选择性粘贴',select('kind','粘贴',s.kind,[['comments','批注'],['format','格式']]),btn('确定','apply')+btn('取消','cancel')):''}`)+`<div class="lab-controls">${btn('键盘辅助：选择后3格','all')}</div>${output(s.message)}`,
    (s,a,v)=>{if(a==='cell')s.start=s.end=Number(v);if(a==='copy'){s.clipboard=s.comments[s.start];s.message='已复制所选单元格，接下来选择目标区域。';}if(a==='all'){s.start=1;s.end=3;}if(a==='paste')s.paste=true;if(a==='cancel')s.paste=false;if(a==='apply'){if(s.clipboard===null){s.message='请先复制带有批注的单元格。';return;}if(s.kind==='comments')s.comments=s.comments.map((x,i)=>i>=Math.min(s.start,s.end)&&i<=Math.max(s.start,s.end)?s.clipboard:x);s.message=s.kind==='comments'?'批注已复制；原始编号没有改变。':'仅复制格式，批注没有复制。';s.paste=false;}});

  register(['y2022q66'],'为什么第4行看不见','分别制造行高过小、隐藏与筛选，再用对应命令恢复。',{cause:'short',fixed:false},s=>
    `<div class="lab-controls">${select('cause','模拟原因',s.cause,[['short','行高过小'],['hidden','行被隐藏'],['filter','筛选排除']])}</div>`+office('Excel','开始 / 数据',btn('自动调整行高','autofit')+btn('取消隐藏行','unhide')+btn('清除筛选','clear'),`<div class="lab-rows">${[3,4,5,6].map(n=>`<div ${n===4&&!s.fixed?(s.cause==='short'?'style="height:5px;overflow:hidden"':'hidden'):''}><b>${n}</b><span>产品${n-2}</span><span>${n*120}</span></div>`).join('')}</div>`)+output(s.fixed?'第4行已恢复。':`第4行因${{short:'行高过小',hidden:'隐藏',filter:'筛选'}[s.cause]}不可见。${s.message||''}`),
    (s,a)=>{s.fixed=a==={short:'autofit',hidden:'unhide',filter:'clear'}[s.cause];s.message=s.fixed?'':'所选命令不解决当前原因。';},(s,k,v)=>{s[k]=v;s.fixed=false;s.message='';});

  register(['y2022q69'],'源表改了，Word会不会跟着变','切换链接与嵌入，修改Excel源值后刷新Word中的数据。',{source:898,word:898,mode:'link',path:true},s=>
    `<div class="lab-linked-apps">${office('Excel','数据','<span>销售汇总.xlsx</span>',field('source','产品1 · 总销量',s.source,'number','min="0" max="99999"'))}${office('Word','开始',btn('更新链接','refresh'),paper(`<h4>年度销售报告</h4>${table(['产品','销量'],[['产品1',s.word]])}<small>${s.mode==='link'?'链接对象':'嵌入副本'}</small>`))}</div><div class="lab-controls">${select('mode','粘贴方式',s.mode,[['link','粘贴链接'],['embed','嵌入副本']])}${btn(s.path?'模拟源文件移走':'恢复源文件','path')}</div>${output(!s.path&&s.mode==='link'?'源路径失效，无法取得新数据。':s.mode==='embed'?'这是独立副本；修改源表不会同步。':'链接已建立。修改源值后点“更新链接”；真实Word也可能提示允许更新。')}`,
    (s,a)=>{if(a==='path')s.path=!s.path;if(a==='refresh'&&s.path&&s.mode==='link')s.word=s.source;},(s,k,v)=>{s[k]=k==='source'?number(v,0,99999):v;if(k==='mode')s.word=s.source;});

  register(['y2022q70'],'给报告加淡化Logo背景','比较图片水印、普通衬底图片和页面边框的实际范围。',{mode:'none',page:1},s=>
    office('Word','设计',select('mode','页面背景',s.mode,[['none','无'],['watermark','图片水印'],['behind','普通图片：衬于文字下方'],['border','页面边框']]),paper(`<div class="lab-bg-page ${s.mode==='border'?'bordered':''}">${s.mode==='watermark'||s.mode==='behind'&&s.page===1?'<div class="lab-watermark" aria-label="背景Logo">M<br><small>研究中心</small></div>':''}<h4>年度报告 · 第${s.page}页</h4><p>背景应辅助辨认，不妨碍阅读。</p><p>正文与数据保持清晰。</p></div>`))+`<div class="lab-controls">${btn('上一页','page',1)}${btn('下一页','page',2)}</div>${output(s.mode==='behind'?'本例普通图片只放在第1页；切到第2页不会自动复制。':s.mode==='watermark'?'图片水印通过页眉层重复显示。':s.mode==='border'?'边框只改变页面边缘，不添加Logo。':'尚未设置背景。')}`,(s,a,v)=>{s.page=Number(v);});

  register(['y2022q71'],'保护表格，仍允许改正文','给正文设置编辑例外，再启动强制保护，并分别尝试输入。',{protected:false,exception:false,body:'本年度销售情况如下。',cell:'898',message:''},s=>
    office('Word','审阅',btn('限制编辑','pane'),`<div class="lab-protect-layout">${paper(`<label>正文<textarea data-field="body" ${s.protected&&!s.exception?'readonly':''}>${esc(s.body)}</textarea></label>${field('cell','表格：总销量',s.cell,'text',s.protected?'readonly':'')}`)}${s.pane?dialog('限制编辑',`<p>编辑限制：不允许任何更改（只读）</p><label><input type="checkbox" data-field="exception" ${s.exception?'checked':''} ${s.protected?'disabled':''}>正文允许“每个人”编辑</label>`,btn(s.protected?'停止保护':'是，启动强制保护','protect')):''}</div>`)+output(s.protected?`表格已只读；正文${s.exception?'作为例外仍可编辑':'也被锁定'}。`:'尚未保护，正文和表格都可输入。')+coach('这里省略真实密码输入；实际文档启动保护时按需要设置密码。学习按钮不放在文档正文里。'),
    (s,a)=>{if(a==='pane')s.pane=!s.pane;if(a==='protect')s.protected=!s.protected;});

  register(['y2022q72'],'Word大纲如何变成一套幻灯片','改变段落层级，导入后点击缩略图，检查内容属于哪一页。',{levels:[1,2,1,2],slides:[],page:0},s=>{
    const texts=['年度销售总结','总销量增长15%','下一年度计划','提高服务质量'];
    return `<div class="lab-outline-source"><b>源文档 · 标题层级</b>${texts.map((t,i)=>select('level'+i,t,s.levels[i],[[1,'标题1'],[2,'标题2'],[0,'正文（本例不导入）']])).join('')}</div>`+office('PowerPoint','开始',btn('新建幻灯片 ▾ → 幻灯片（从大纲）','import'),`<div class="lab-deck"><aside>${s.slides.map((x,i)=>btn(`${i+1}　${esc(x.title)}`,'page',i,`aria-pressed="${s.page===i}"`)).join('')||'尚未导入'}</aside><div class="lab-slide">${s.slides[s.page]?`<h3>${esc(s.slides[s.page].title)}</h3><ul>${s.slides[s.page].items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'空白演示文稿'}</div></div>`)+output(s.slides.length?`已生成${s.slides.length}张幻灯片。改变源大纲后可再次导入观察。`:'标题1拆分页面，标题2附属于最近的标题1。');
  },(s,a,v)=>{if(a==='page')s.page=Number(v);if(a==='import'){s.slides=[];['年度销售总结','总销量增长15%','下一年度计划','提高服务质量'].forEach((t,i)=>{if(s.levels[i]===1)s.slides.push({title:t,items:[]});else if(s.levels[i]===2&&s.slides.length)s.slides.at(-1).items.push(t);});s.page=0;}},(s,k,v)=>{s.levels[Number(k.slice(5))]=Number(v);});

  register(['y2022q75'],'创建ZIP副本，不是改一个扩展名','在资源管理器菜单中创建压缩文件夹，再查看包内目录。',{zip:false,renamed:false,open:false,menu:false},s=>
    `<div class="lab-explorer"><header>文件资源管理器 · 文稿资料</header><div class="lab-ribbon">${btn('右键菜单 / 长按','menu')}</div><div class="lab-file-list"><button data-lab-drag="hold" data-lab-act="folder">📁 年度总结 ${s.renamed?'.zip':''}<small>类型：文件夹</small></button>${s.zip?btn('▣ 年度总结.zip<br><small>类型：ZIP压缩文件</small>','open'):''}</div>${s.menu?`<div class="lab-context-menu">${btn('发送到 → 压缩(zipped)文件夹','zip')}${btn('重命名为 年度总结.zip','rename')}</div>`:''}${s.open?table(['包内文件','内容'],[['年度报告.docx','文档'],['销售汇总.xlsx','工作簿'],['汇报.pptx','演示文稿']]):''}</div>${output(s.renamed?'名称变了，类型仍是文件夹，没有执行压缩。':s.zip?'已创建包含3个文件的ZIP副本，原文件夹仍保留。':'长按文件夹约0.6秒打开菜单；轻点不会触发长按。')}`,
    (s,a)=>{if(a==='menu')s.menu=!s.menu;if(a==='zip'){s.zip=true;s.menu=false;s.renamed=false;}if(a==='rename'){s.renamed=true;s.menu=false;}if(a==='open')s.open=!s.open;});

  // Updates to earlier notes: calculate and render actual results instead of changing a caption.
  const radixConvert = raw => {
    if(!/^[01]{1,16}(\.[01]{1,12})?$/.test(raw))return null;
    const [whole,frac='']=raw.split('.');
    const left=whole.padStart(Math.ceil(whole.length/4)*4,'0');const right=frac.padEnd(Math.ceil(frac.length/4)*4,'0');
    const groups=x=>x.match(/.{4}/g)||[];
    return {binary:[groups(left).join(' '),groups(right).join(' ')].filter(Boolean).join(' . '),hex:parseInt(whole,2).toString(16).toUpperCase()+(frac?'.'+groups(right).map(x=>parseInt(x,2).toString(16).toUpperCase()).join(''):''),decimal:parseInt(whole,2)+[...frac].reduce((sum,v,i)=>sum+Number(v)*2**(-i-1),0)};
  };
  register(['y2026q41'],'以小数点为界，四位二进制变一位十六进制','输入二进制数，观察补零位置、分组和结果随输入改变。',{raw:'100010.01'},s=>{
    const x=radixConvert(s.raw);return `<div class="lab-controls">${field('raw','二进制数',s.raw)}</div>${x?`<div class="lab-radix"><code>${x.binary}</code><span>每组 4 bit ↓</span><strong>${x.hex}₁₆</strong><p>十进制校验：${x.decimal}</p></div>`:output('请输入最多16位整数、12位小数的二进制数，仅含0和1。')}${coach('整数左端补0，小数右端补0；不跨小数点凑组。0.1₁₀的二进制展开无限循环，不能用有限补零把它写成精确有限值。')}`;
  },()=>{});

  const pivotData=[['产品1','一部','1月',12],['产品1','二部','1月',20],['产品1','一部','2月',8],['产品2','一部','1月',15],['产品2','二部','2月',30],['产品1','二部','2月',10]];
  const gradeData=[['王宁','一班','2023/03/01',82],['李明','二班','2023/03/05',76],['赵敏','一班','2024/03/02',91],['王宁','一班','2023/03/12',88]];
  register(['y2024q67'],'真正拖动字段，建立交叉汇总报表','把字段拖到行、列、值、筛选器，报表按放置位置重新汇总。',{zones:{row:[],column:[],value:[],filter:[]},scenario:'sales',monthly:false,filter:'全部',aggregate:'sum',picked:'产品',message:'将“产品”拖到行，“月份”拖到列，“销量”拖到值。'},s=>{
    const grades=s.scenario==='grades';const fields=grades?['姓名','班级','日期','成绩']:['产品','分部','月份','销量'];const zones=[['row','行'],['column','列'],['value','值'],['filter','筛选器']];
    const data=grades?gradeData:pivotData;const rows=data.filter(r=>s.filter==='全部'||r[1]===s.filter).map(r=>r.map((v,i)=>grades&&s.monthly&&i===2?v.slice(0,7):v));
    const index=name=>fields.indexOf(name);
    const rnames=s.zones.row.length?[...new Set(rows.map(r=>s.zones.row.map(n=>r[index(n)]).join(' / ')))]:['总计'];
    const cnames=s.zones.column.length?[...new Set(rows.map(r=>s.zones.column.map(n=>r[index(n)]).join(' / ')))]:['总计'];
    const result=s.zones.value.length?table(['行标签',...cnames],rnames.map(rn=>[esc(rn),...cnames.map(cn=>{const set=rows.filter(r=>(!s.zones.row.length||s.zones.row.map(n=>r[index(n)]).join(' / ')===rn)&&(!s.zones.column.length||s.zones.column.map(n=>r[index(n)]).join(' / ')===cn));return set.length?(s.aggregate==='count'?set.length:money(set.reduce((sum,r)=>sum+r[3],0)/(s.aggregate==='average'?set.length:1))):'—';})])):'<p class="lab-empty">报表还没有值字段。将“销量”放入值区域。</p>';
    return `<div class="lab-controls">${select('scenario','源数据场景',s.scenario,[['sales','产品销量（2022考法）'],['grades','班级成绩（日期分组）']])}</div>`+office('Excel','数据透视表分析',select('aggregate','值汇总方式',s.aggregate,[['sum','求和'],['average','平均值'],['count','计数']])+(grades?btn(s.monthly?'取消日期组合':'日期 → 按年、月组合','group'):''),`<div class="lab-pivot-layout"><div>${s.zones.filter.includes(fields[1])?select('filter',fields[1]+'筛选',s.filter,[['全部','全部'],...([...new Set(data.map(r=>r[1]))].map(v=>[v,v]))]):''}${result}</div><aside class="lab-fields"><b>数据透视表字段</b><div class="lab-field-bank">${fields.map(f=>`<button data-lab-drag="field" data-key="${f}" data-lab-act="pick" data-value="${f}" aria-pressed="${s.picked===f}">${f} <span>⠿</span></button>`).join('')}</div><div class="lab-drop-zones">${zones.map(([k,v])=>`<section data-lab-drop="${k}"><b>${v}</b>${s.zones[k].map(f=>btn(`${f} ×`,'remove',k+':'+f)).join('')||'<small>拖到这里</small>'}</section>`).join('')}</div></aside></div>`)+`<details class="lab-assist"><summary>键盘操作 / 查看源数据</summary><p>选择字段后，指定区域；也可拖动上方字段。</p>${zones.map(([k,v])=>btn(`放入${v}`,'place',k)).join('')}${table(fields,data)}</details>${output(s.message)}`;
  },(s,a,v)=>{if(a==='pick')s.picked=v;if(a==='remove'){const [z,f]=v.split(':');s.zones[z]=s.zones[z].filter(x=>x!==f);}if(a==='place')placeField(s,s.picked,v);if(a==='group'){s.monthly=!s.monthly;s.message=s.monthly?'日期按年、月合并；不同年份的3月不会混在一起。':'恢复逐日显示。';}},(s,k,v)=>{s[k]=v;if(k==='scenario'){s.zones={row:[],column:[],value:[],filter:[]};s.filter='全部';s.picked=v==='grades'?'姓名':'产品';s.message='已更换源数据，请重新放置字段。';}});
  function placeField(s,field,zone){
    const metric=s.scenario==='grades'?'成绩':'销量',filter=s.scenario==='grades'?'班级':'分部';
    if(zone==='value'&&field!==metric){s.message=`本任务把${metric}放入值区域；文本字段用于分类或筛选。`;return;}
    for(const key of Object.keys(s.zones))s.zones[key]=s.zones[key].filter(f=>f!==field);
    s.zones[zone].push(field);if(!s.zones.filter.includes(filter))s.filter='全部';
    s.message=`${field}已放入${{row:'行',column:'列',value:'值',filter:'筛选器'}[zone]}区域，报表已按当前配置重算。`;
  }

  const products=[['产品1','BKC-001',2322],['产品2','BKC-002',1628],['产品3','BKC-003',3120],['产品4','BKC-004',670]];
  register(['y2020q57'],'精确查价，再拖动填充柄','先确认公式参数，再从第一格填充柄拖到末行；查找区未锁定时观察漂移。',{locked:true,exact:true,col:3,filled:0,selected:0},s=>{
    const names=['产品2','产品4','产品1','产品3'];const formula=i=>`=VLOOKUP(D${i+3},产品信息!${s.locked?'$A$2:$C$5':`A${i+2}:C${i+5}`},${s.col},${s.exact?'FALSE':'TRUE'})`;
    return office('Excel','公式',`<code class="lab-formula">${formula(s.selected)}</code>`,table(['行','D 产品名称','G 查找结果'],names.map((name,i)=>{const pool=s.locked?products:products.slice(i);const row=pool.find(r=>r[0]===name);return[i+3,name,`<div class="lab-lookup-cell" data-fill-index="${i}">${i<=s.filled?(s.exact?(row?row[s.col-1]:'#N/A'):'需检查排序条件'):'—'}${i===0?'<button data-lab-drag="fill" class="lab-fill-handle" aria-label="向下拖动填充柄"></button>':''}</div>`];})))+`<div class="lab-controls">${select('locked','查找区域',s.locked?'true':'false',[['true','绝对引用（固定）'],['false','相对引用（漂移）']])}${select('exact','匹配方式',s.exact?'true':'false',[['true','FALSE 精确匹配'],['false','TRUE 近似匹配']])}${select('col','返回第几列',s.col,[[1,'1 产品名'],[2,'2 编号'],[3,'3 单价']])}${btn('键盘辅助：向下填充','fill')}</div><details class="lab-assist"><summary>产品信息源表</summary>${table(['A 产品名','B 编号','C 单价'],products)}</details>${output(s.filled?'已填充，公式的行号会逐行变化。产品查价应使用FALSE。':'第一行已有公式。抓住右下角小方块向下拖动。')}`;
  },(s,a)=>{if(a==='fill')s.filled=3;},(s,k,v)=>{s[k]=k==='col'?Number(v):v==='true';});

  register(['y2025q36'],'为不同收件人生成不同称谓','连接Excel名单，插入姓名域，再设置IF规则并切换预览记录。',{connected:false,name:false,rule:false,preview:false,record:0,pane:false,ifValue:'女',then:'女士',otherwise:'先生'},s=>{
    const people=[['王宁','女'],['李明','男'],['赵敏','女']];const person=people[s.record];const salutation=s.preview&&s.rule?(person[1]===s.ifValue?s.then:s.otherwise):s.rule?'«IF 称谓»':'';
    return office('Word','邮件',btn('选择收件人','connect')+btn('插入合并域：姓名','name','',s.connected?'':'disabled')+btn('规则 → 如果…那么…否则','rule','',s.connected?'':'disabled')+btn('预览结果','preview','',s.connected?'':'disabled'),`${s.pane?dialog('插入Word域：IF',`<p>域名：性别　比较：等于</p>${select('ifValue','比较值',s.ifValue,[['女','女'],['男','男']])}${field('then','则插入此文字',s.then)}${field('otherwise','否则插入此文字',s.otherwise)}`,btn('确定','apply')):''}${paper(`<h4>邀请函</h4><p>尊敬的${s.name?(s.preview?person[0]:'«姓名»'):'＿＿'}${esc(salutation)}：</p><p>诚邀您参加计算机基础教学交流。</p>`)}${s.preview?`<div class="lab-record-nav">${btn('上一条','previous')}<b>记录 ${s.record+1}/3</b>${btn('下一条','next')}</div>`:''}`)+output(s.connected?'已连接专家名单.xlsx。字段取自当前记录，条件规则只改变输出文字。':'先选择收件人，加载Excel名单。')+`<details class="lab-assist"><summary>收件人名单</summary>${table(['姓名','性别'],people)}</details>`;
  },(s,a)=>{if(a==='connect')s.connected=true;if(a==='name'&&s.connected)s.name=true;if(a==='rule'&&s.connected)s.pane=true;if(a==='apply'){s.rule=true;s.pane=false;}if(a==='preview'&&s.connected)s.preview=!s.preview;if(a==='next')s.record=Math.min(2,s.record+1);if(a==='previous')s.record=Math.max(0,s.record-1);});

  register(['y2020q52'],'条件格式会随着数据重新判断','设置低于阈值或高于平均值，再改数据，看高亮自动变化。',{values:salaryRows,rule:'average',threshold:9000},s=>{
    const avg=s.values.reduce((a,b)=>a+b,0)/s.values.length;
    return office('Excel','开始 · 条件格式',select('rule','规则',s.rule,[['average','高于平均值'],['below','小于…']])+(s.rule==='below'?field('threshold','阈值',s.threshold,'number'):''),table(['姓名','工资'],s.values.map((v,i)=>[['王宁','李明','赵敏','周林'][i],`<label class="${(s.rule==='average'?v>avg:v<s.threshold)?'lab-highlight':''}"><span class="sr-only">${['王宁','李明','赵敏','周林'][i]}工资</span><input type="number" data-field="salary${i}" value="${v}"></label>`])))+output(`当前平均值 ${money(avg)}；${s.rule==='average'?'仅严格高于平均值的项':'低于'+s.threshold+'的项'}着色。改变数据后重新计算。`);
  },()=>{},(s,k,v)=>{if(k.startsWith('salary'))s.values[Number(k.slice(6))]=number(v,0,1000000);else s[k]=k==='threshold'?number(v,0,1000000):v;});

  register(['y2023q56'],'修改文稿，再接受或拒绝修订','编辑文字产生修订；接受和拒绝真正改变最终文稿。',{tracking:false,old:'可能产生改善',draft:'可能产生改善',decided:false},s=>
    office('Word','审阅',btn(s.tracking?'修订：开':'修订：关','track')+btn('接受修订','accept')+btn('拒绝修订','reject'),paper(`<h4>研究结果</h4><p>该方法${s.tracking&&s.draft!==s.old?`<del>${esc(s.old)}</del><ins>${esc(s.draft)}</ins>`:esc(s.draft)}。</p>`))+`<div class="lab-keyboard">${field('draft','模拟键盘输入：替换选中的短语',s.draft)}</div>${output(s.tracking?'修订已开启，旧文字显示删除线，新文字带下划线。':'未开启修订；编辑直接改变当前文稿。')}`,
    (s,a)=>{if(a==='track'){s.tracking=!s.tracking;s.old=s.draft;}if(a==='accept'){s.old=s.draft;s.decided=true;}if(a==='reject'){s.draft=s.old;s.decided=true;}},(s,k,v)=>{s.draft=v;if(!s.tracking)s.old=v;});

  register(['y2023q19'],'放大同一颗星：路径与像素','调节缩放，比较矢量路径重新绘制与位图像素格显现。',{zoom:1},s=>
    `<div class="lab-controls">${field('zoom','放大倍数',s.zoom,'range','min="1" max="4" step="0.25"')}</div><div class="lab-image-compare"><section><b>矢量路径</b><div><svg viewBox="0 0 100 100" role="img" aria-label="矢量星形"><path transform="translate(50 50) scale(${s.zoom}) translate(-50 -50)" d="M50 12 60 38 88 40 66 58 74 86 50 70 26 86 34 58 12 40 40 38Z" fill="#427b68"/></svg></div></section><section><b>低分辨率位图示意</b><div><svg viewBox="0 0 100 100" shape-rendering="crispEdges" role="img" aria-label="放大后像素格显现"><g transform="translate(50 50) scale(${s.zoom}) translate(-50 -50)">${['000010000','000111000','111111111','011111110','001111100','001111100','011000110','010000010','000000000'].flatMap((r,y)=>[...r].map((v,x)=>v==='1'?`<rect x="${5+x*10}" y="${5+y*10}" width="10" height="10" fill="#427b68"/>`:'')).join('')}</g></svg></div></section></div>${output(`${s.zoom}倍；这里只模拟低分辨率位图，实际像素数越高，在相同放大下块感越不明显。`)}`,()=>{},(s,k,v)=>{s.zoom=Number(v);});

  register(['y2023q55'],'校对提示与真正的下划线，打印时有何不同','进入打印预览，观察波浪线消失而格式下划线保留。',{printing:false,corrected:false},s=>
    office('Word',s.printing?'文件 · 打印':'审阅',btn(s.printing?'返回编辑':'打印预览','print')+btn('更正 ChatGTP → ChatGPT','correct'),paper(`<h4>${s.printing?'打印预览':'编辑页面'}</h4><p>本研究使用<span class="${!s.printing&&!s.corrected?'lab-spell':''}">${s.corrected?'ChatGPT':'ChatGTP'}</span>辅助整理。</p><p>这一段带有<span style="text-decoration:underline">真实下划线格式</span>。</p>`))+output(s.printing?'打印内容不包含校对波浪提示，字体下划线保留。':'红色波浪线是校对提示，不是字符下划线。'),
    (s,a)=>{if(a==='print')s.printing=!s.printing;if(a==='correct')s.corrected=true;});

  register(['y2023q14'],'在关系表中分清元组、属性和域','点一行或列标题，并尝试给性别字段写入不同值。',{row:-1,col:-1,value:'女'},s=>
    table(['学号','姓名','性别'].map((v,i)=>btn(v,'column',i)),[['01','王宁','女'],['02','李明','男'],['03','赵敏','女']].map((r,i)=>r.map((v,j)=>`<button class="${s.row===i||s.col===j?'lab-selected':''}" data-lab-act="row" data-value="${i}">${v}</button>`)))+`<div class="lab-controls">${select('value','性别域示例：{男,女,未说明}',s.value,[['女','女'],['男','男'],['未说明','未说明'],['300','300']])}</div>${output(s.value==='300'?'300不属于本表设定的性别域，不能作为合法取值。':s.col>=0?`所选是一列，叫属性。${s.col===2?'本表性别属性的允许值集合叫域。':''}`:s.row>=0?'所选是一行，叫元组，表示一条完整记录。':'域是允许取值的集合，不是一行或一列当前显示的值。')}`,
    (s,a,v)=>{s.row=a==='row'?Number(v):-1;s.col=a==='column'?Number(v):-1;});

  register(['y2023q16'],'用HTTP和HTTPS发送同一份数据','观察传输内容是否暴露，证书校验失败时连接是否继续。',{scheme:'https',cert:'valid',sent:false},s=>
    `<div class="lab-controls">${select('scheme','协议',s.scheme,[['http','HTTP'],['https','HTTPS']])}${select('cert','服务器证书',s.cert,[['valid','可信且域名匹配'],['invalid','域名不匹配']])}${btn('发送表单','send')}</div><div class="lab-browser"><div class="lab-address">${s.scheme}://notes.example/profile</div><div class="lab-browser-page">${s.sent?(s.scheme==='https'&&s.cert==='invalid'?'<h3>连接被阻止</h3><p>证书身份校验失败，未发送表单。</p>':'<h3>服务器收到表单</h3><p>姓名：王宁　课程：计算机</p>'):'等待发送'}</div></div><div class="lab-code"><b>链路旁观者看到的内容（示意）</b><p>${!s.sent?'尚未发送':s.scheme==='http'?'姓名=王宁&课程=计算机':s.cert==='invalid'?'没有应用数据':'🔒 TLS加密的应用数据，不能直接读出表单正文'}</p></div>${coach('HTTPS保护传输并认证服务器身份，不保证网站内容诚实，也不掩盖所有连接元数据。')}`,
    s=>{s.sent=true;},(s,k,v)=>{s[k]=v;s.sent=false;});

  register(['y2023q17'],'同一个IP，掩码变了，网络边界也会变','对比传统C类默认/24与现代CIDR的实际前缀长度。',{ip:'192.168.10.42',prefix:24},s=>{
    const parts=s.ip.split('.'),valid=parts.length===4&&parts.every(x=>/^\d{1,3}$/.test(x)&&Number(x)<=255);const ip=parts.reduce((a,b)=>(a*256+Number(b))>>>0,0),mask=(0xffffffff<<(32-s.prefix))>>>0;const dotted=n=>[24,16,8,0].map(b=>(n>>>b)&255).join('.');
    return `<div class="lab-controls">${field('ip','IPv4地址',s.ip)}${select('prefix','实际前缀长度',s.prefix,[[16,'/16'],[24,'/24'],[26,'/26']])}</div>${valid?`<div class="lab-registers"><b>掩码 ${dotted(mask)}</b><b>网络地址 ${dotted(ip&mask)}</b></div><div class="lab-ip-bits">${[...parts.map(x=>Number(x).toString(2).padStart(8,'0')).join('')].map((b,i)=>`<span class="${i<s.prefix?'network':'host'}">${b}</span>`).join('')}</div>${output(`前${s.prefix}位是网络前缀，后${32-s.prefix}位是主机部分。首字节192属于历史C类范围，但实际划分必须看掩码。`)}`:output('请输入4组0—255的十进制数。')}`;
  },()=>{},(s,k,v)=>{s[k]=k==='prefix'?Number(v):v;});

  register(['y2023q47'],'地址缩写以后，128位有没有变短','在完整写法、双冒号缩写和字节表示之间切换。',{view:'full'},s=>{
    const groups=['2001','0db8','0000','0000','0000','8a2e','0370','7334'];return `<div class="lab-controls">${btn('完整8组','view','full')}${btn('双冒号缩写','view','short')}${btn('拆成16字节','view','bytes')}</div><div class="lab-ipv6">${s.view==='short'?'<code>2001:db8::8a2e:370:7334</code><p>::在这里代替连续的3组0000</p>':(s.view==='bytes'?groups.flatMap(v=>[v.slice(0,2),v.slice(2)]):groups).map(v=>`<span><b>${v}</b><small>${s.view==='bytes'?'8':'16'} bit</small></span>`).join('')}</div>${output('三种表示都对应同一个128位地址，即16字节。缩写改变显示长度，不改变地址的位数。')}`;
  },(s,a,v)=>{s.view=v;});

  register(['y2023q35'],'跨页音频、循环播放与播完返回开头','播放媒体并切换幻灯片，观察音频和视频各自的状态。',{cross:true,loop:false,rewind:false,page:1,playing:false,time:0},s=>
    office('PowerPoint','音频工具 · 播放',select('cross','跨幻灯片播放',String(s.cross),[['true','启用'],['false','关闭']])+select('loop','循环播放直到停止',String(s.loop),[['false','关闭'],['true','启用']])+select('rewind','播完返回开头',String(s.rewind),[['false','关闭'],['true','启用']]),`<div class="lab-slide"><h3>${['媒体介绍','结果分析','讨论总结'][s.page-1]}</h3>${s.page===1?`<div class="lab-video-frame">视频 ${s.playing?'▶ 播放中':'Ⅱ 停止'}</div>`:'<p>这是另一张幻灯片，上一页的视频对象不再显示。</p>'}<p>♫ 音频 ${s.playing?'播放中':'已停止'} · ${s.time}/20 秒</p><progress value="${s.time}" max="20"></progress></div>`)+`<div class="lab-controls">${btn('开始播放','play')}${btn('推进5秒（学习控制）','tick')}${btn('下一页','next')}${btn('返回第1页','first')}</div>${output(s.page>1?(s.cross?'音频允许跨页继续；视频留在原页。':'未启用跨页，换页后音频停止。'):'循环会重播；播完返回开头只复位，不等于自动重播。')}`,
    (s,a)=>{if(a==='play'){s.playing=true;if(s.time===20)s.time=0;}if(a==='tick'&&s.playing){s.time+=5;if(s.time>=20){if(s.loop)s.time=0;else{s.playing=false;s.time=s.rewind?0:20;}}}if(a==='next'){s.page=s.page%3+1;if(!s.cross)s.playing=false;}if(a==='first')s.page=1;},(s,k,v)=>{s[k]=v==='true';});

  register(['y2023q52'],'修改一次样式，三个标题同步更新','在修改样式窗口设置段前间距，确定后全部同级标题继承。',{before:0,pending:20,pane:false,menu:false},s=>
    office('Word','开始 · 样式',btn('标题 1 ▾','menu')+(s.menu?btn('修改…','modify'):''),`${s.pane?dialog('修改样式：标题1 → 格式 → 段落',field('pending','段前（磅）',s.pending,'number','min="0" max="48"')+'<p>设置作用于所有使用标题1的段落。</p>',btn('确定','apply')+btn('取消','cancel')):''}${paper([1,2,3].map(n=>`<h4 style="margin-top:${s.before}pt">第${n}章　学习主题</h4><p>正文格式不随标题样式改变。</p>`).join(''))}`)+output(`当前标题1段前 ${s.before} 磅；三个实例保持同步。`),
    (s,a)=>{if(a==='menu')s.menu=!s.menu;if(a==='modify'){s.pane=true;s.menu=false;s.pending=s.before;}if(a==='apply'){s.before=number(s.pending,0,48);s.pane=false;}if(a==='cancel')s.pane=false;},(s,k,v)=>{s.pending=number(v,0,48);});

  register(['y2020q14'],'从两个方向判断联系基数','切换业务规则，观察一对一、一对多和多对多的连接。',{mode:'one-many'},s=>{
    const pairs={'one-one':[[0,0],[1,1]],'one-many':[[0,0],[0,1],[0,2],[1,3]],'many-many':[[0,0],[0,1],[0,2],[1,1],[1,2],[1,3]]};const labels=s.mode==='many-many'?['出版社','书店']:s.mode==='one-one'?['人','身份证']:['班级','学生'];
    return `<div class="lab-controls">${select('mode','业务规则',s.mode,[['one-one','每人一个证号，每证号对应一人'],['one-many','一班多名学生，每生属于一班'],['many-many','多家出版社向多家书店供书']])}</div><svg class="lab-cardinality" viewBox="0 0 500 280" role="img" aria-label="实体联系图">${pairs[s.mode].map(([a,b])=>`<line x1="150" y1="${70+a*140}" x2="350" y2="${35+b*70}" stroke="#6d9981" stroke-width="2"/>`).join('')}${[0,1].map(i=>`<rect x="10" y="${45+i*140}" width="140" height="50" rx="8" fill="#e1eee0"/><text x="80" y="${76+i*140}" text-anchor="middle">${labels[0]} ${i+1}</text>`).join('')}${Array.from({length:s.mode==='one-one'?2:4},(_,i)=>`<rect x="350" y="${10+i*70}" width="140" height="50" rx="8" fill="#e9e8d7"/><text x="420" y="${41+i*70}" text-anchor="middle">${labels[1]} ${i+1}</text>`).join('')}</svg>${output({'one-one':'两边每个实例都只对应一个，属于一对一。','one-many':'班级能连多个学生，但每个学生只连一个班级，属于一对多。','many-many':'任一方向都可能对应多个实例，属于多对多。'}[s.mode])}`;
  },(s,a,v)=>{s.mode=v;});

  register(['y2024q57'],'在Excel中直接用通配符清理部门名称','编辑查找内容与替换文字，观察所选列实际被替换的结果。',{values:['销售部-01','财务部-02','综合部-03'],find:'-*',replacement:'',pane:false,message:'仅处理部门列，订单编号不会改动。'},s=>
    office('Excel','开始',btn('查找和选择 → 替换','open'),`${table(['订单编号','部门'],s.values.map((v,i)=>['DD-00'+(i+1),esc(v)]))}${s.pane?dialog('查找和替换',field('find','查找内容',s.find)+field('replacement','替换为',s.replacement),btn('全部替换','replace')+btn('关闭','close')):''}`)+output(s.message)+coach('Excel直接识别*、?、~，这里没有“使用通配符”复选框。试试把-*改为-0?，或用~*查找真正的星号。'),
    (s,a)=>{if(a==='open')s.pane=true;if(a==='close')s.pane=false;if(a==='replace'){if(!s.find){s.message='本卡片请提供非空查找表达式。';return;}let pattern='';for(let i=0;i<s.find.length;i++){const ch=s.find[i];if(ch==='~'&&i+1<s.find.length)pattern+=s.find[++i].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');else pattern+=ch==='*'?'.*':ch==='?'?'.':ch.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}const rx=new RegExp(pattern,'g');let count=0;s.values=s.values.map(v=>v.replace(rx,match=>{if(!match)return match;count++;return s.replacement;}));s.message=`已替换${count}处；订单编号列保持不变。`;}});

  function render(root){const s=states.get(root);root.innerHTML=registry[root.dataset.lab].render(s);}
  function mount(card){
    card.querySelectorAll('[data-lab]').forEach(root=>{
      if(states.has(root))return;
      states.set(root,fresh(root.dataset.lab));render(root);
      let suppressUntil=0, gesture=null, pointerTarget=null, dirty=false;
      const act=(a,v)=>{registry[root.dataset.lab].action(states.get(root),a,v);render(root);};
      root.addEventListener('click',e=>{const b=e.target.closest('[data-lab-act]');pointerTarget=null;if(!b||b.disabled){if(dirty){dirty=false;const target=e.target.closest('[data-field]');const name=target?.dataset.field;render(root);if(name)root.querySelector(`[data-field="${name}"]`)?.focus();}return;}e.stopPropagation();if(Date.now()<suppressUntil)return;dirty=false;act(b.dataset.labAct,b.dataset.value);});
      root.addEventListener('contextmenu',e=>{if(e.target.closest('[data-lab-drag="hold"]')){e.preventDefault();act('menu');}});
      root.addEventListener('change',e=>{const x=e.target.closest('[data-field]');if(!x)return;const s=states.get(root),v=x.type==='checkbox'?x.checked:x.value;const fn=registry[root.dataset.lab].change;if(fn)fn(s,x.dataset.field,v);else s[x.dataset.field]=v;if(pointerTarget&&pointerTarget!==x){dirty=true;return;}render(root);});
      root.addEventListener('keydown',e=>{
        const h=e.target.closest('[data-lab-drag="ruler"]');if(!h||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const s=states.get(root),k=h.dataset.key,delta=e.key==='ArrowRight'?2:-2;if(k==='both'){const change=number(s.rest+delta,0,55)-s.rest;s.rest+=change;s.first=number(s.first+change,0,60);}else s[k]=number(s[k]+delta,0,60);render(root);root.querySelector(`[data-key="${k}"]`)?.focus();
      });
      root.addEventListener('pointerdown',e=>{
        pointerTarget=e.target.closest('button,input,select,textarea');
        const el=e.target.closest('[data-lab-drag]');if(!el||e.button!==0)return;
        const s=states.get(root);gesture={el,kind:el.dataset.labDrag,x:e.clientX,y:e.clientY,moved:false,key:el.dataset.key,first:s.first,rest:s.rest};
        el.setPointerCapture(e.pointerId);
        if(gesture.kind==='hold')gesture.timer=setTimeout(()=>{suppressUntil=Date.now()+500;gesture=null;act('menu');},600);
        if(gesture.kind==='ruler')gesture.rect=root.querySelector('[data-ruler]').getBoundingClientRect();
      });
      root.addEventListener('pointermove',e=>{
        if(!gesture)return;const g=gesture;const moved=Math.hypot(e.clientX-g.x,e.clientY-g.y)>7;if(moved){g.moved=true;clearTimeout(g.timer);}
        if(!g.moved)return;e.preventDefault();
        if(g.kind==='ruler'){const delta=(e.clientX-g.x)/g.rect.width*100;const value=number((g.key==='first'?g.first:g.rest)+delta,0,60);g.el.style.left=value+'%';g.value=value;}
        if(g.kind==='field'){g.el.style.transform=`translate(${e.clientX-g.x}px,${e.clientY-g.y}px)`;g.el.classList.add('lab-dragging');root.querySelectorAll('[data-lab-drop]').forEach(z=>{const r=z.getBoundingClientRect();z.classList.toggle('lab-drop-hover',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);});}
        if(g.kind==='range')root.querySelectorAll('[data-row]').forEach(x=>{const r=x.getBoundingClientRect();if(e.clientY>=r.top&&e.clientY<=r.bottom){g.end=Number(x.dataset.row);const a=Number(g.el.dataset.row);root.querySelectorAll('[data-row]').forEach(y=>y.classList.toggle('lab-selected',Number(y.dataset.row)>=Math.min(a,g.end)&&Number(y.dataset.row)<=Math.max(a,g.end)));}});
        if(g.kind==='fill')root.querySelectorAll('[data-fill-index]').forEach(x=>{const r=x.getBoundingClientRect();if(e.clientY>=r.top&&e.clientY<=r.bottom){g.end=Number(x.dataset.fillIndex);x.classList.add('lab-selected');}});
      });
      const finish=(e,cancel=false)=>{
        if(!gesture)return;const g=gesture;clearTimeout(g.timer);gesture=null;if(!g.moved)return;suppressUntil=Date.now()+400;const s=states.get(root);
        if(!cancel){
          if(g.kind==='ruler'&&g.value!==undefined){if(g.key==='both'){const d=g.value-s.rest;s.rest=g.value;s.first=number(s.first+d,0,60);}else s[g.key]=g.value;}
          if(g.kind==='field'){const zone=[...root.querySelectorAll('[data-lab-drop]')].find(z=>{const r=z.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;});if(zone)placeField(s,g.key,zone.dataset.labDrop);else s.message='没有落入区域，字段保持原位置。';}
          if(g.kind==='range'&&g.end!==undefined){s.start=Number(g.el.dataset.row);s.end=g.end;}
          if(g.kind==='fill'&&g.end!==undefined)s.filled=g.end;
        }render(root);
      };
      root.addEventListener('pointerup',e=>finish(e));root.addEventListener('pointercancel',e=>finish(e,true));
    });
  }
  window.NOTE_LABS={mount,registry,radixConvert,daysBetween,placeField};
})();
