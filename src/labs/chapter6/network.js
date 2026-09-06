/* Chapter 6: network. Maintained source; edit this domain directly. */
/* Source provenance: note-labs.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
register(['y2022q15'],'网络服务收发台','切换服务，再执行一次具体网络任务。',{service:'FTP',sent:false},s=>{
    const info={FTP:['文件传输','影像资料.zip','文件服务器','226 Transfer complete'],SMTP:['发送邮件','会议邀请.eml','邮件服务器','250 Message accepted'],POP3:['收取邮件','收件箱中的新邮件','邮件服务器','+OK 1 message'],Telnet:['远程终端','远程命令：date','远程主机','终端返回系统日期']}; const v=info[s.service];
    return `<div class="lab-controls">${select('service','服务',s.service,Object.keys(info).map(k=>[k,k]))}</div><div class="lab-service"><section><b>本地客户端</b><p>${v[1]}</p>${btn(v[0],'send')}</section><div class="lab-packet ${s.sent?'travel':''}">${s.sent?'已传送':'等待任务'} ${s.service==='POP3'?'←':'→'}</div><section><b>${v[2]}</b><p>${s.sent?esc(v[3]):'等待连接'}</p></section></div>${output(`${s.service}负责${v[0]}。此处不连接外网；传统FTP/Telnet的明文连接不适合传输秘密。`)}`;
  },s=>{s.sent=true;},(s,k,v)=>{s[k]=v;s.sent=false;});
register(['y2022q16'],'编辑HTML，看标签页与正文各自改变','修改title与h1，切换两个标签页验证它们的位置。',{title:'计算机笔记',heading:'第一章 信息技术',tab:0},s=>
    `<div class="lab-code-editor">${field('title','<code>&lt;title&gt;</code>',s.title)}${field('heading','<code>&lt;h1&gt;</code>',s.heading)}</div><div class="lab-browser"><div class="lab-tabs">${btn(esc(s.title),'tab',0,`aria-pressed="${s.tab===0}"`)}${btn('参考资料','tab',1,`aria-pressed="${s.tab===1}"`)}</div><div class="lab-address">https://notes.example/${s.tab?'reference':'chapter1'}</div><div class="lab-browser-page"><h2>${s.tab?'资料索引':esc(s.heading)}</h2><p>${s.tab?'这是真正独立的一页内容。':'title不会作为正文自动显示；h1是这段内容的标题。'}</p></div></div>`,(s,a,v)=>{s.tab=Number(v);});
register(['y2023q16'],'用HTTP和HTTPS发送同一份数据','观察传输内容是否暴露，证书校验失败时连接是否继续。',{scheme:'https',cert:'valid',sent:false},s=>
    `<div class="lab-controls">${select('scheme','协议',s.scheme,[['http','HTTP'],['https','HTTPS']])}${select('cert','服务器证书',s.cert,[['valid','可信且域名匹配'],['invalid','域名不匹配']])}${btn('发送表单','send')}</div><div class="lab-browser"><div class="lab-address">${s.scheme}://notes.example/profile</div><div class="lab-browser-page">${s.sent?(s.scheme==='https'&&s.cert==='invalid'?'<h3>连接被阻止</h3><p>证书身份校验失败，未发送表单。</p>':'<h3>服务器收到表单</h3><p>姓名：王宁　课程：计算机</p>'):'等待发送'}</div></div><div class="lab-code"><b>链路旁观者看到的内容（示意）</b><p>${!s.sent?'尚未发送':s.scheme==='http'?'姓名=王宁&课程=计算机':s.cert==='invalid'?'没有应用数据':'🔒 TLS加密的应用数据，不能直接读出表单正文'}</p></div>${coach('HTTPS保护传输并认证服务器身份，不保证网站内容诚实，也不掩盖所有连接元数据。')}`,
    s=>{s.sent=true;},(s,k,v)=>{s[k]=v;s.sent=false;});
register(['y2023q17'],'同一个IP，掩码变了，网络边界也会变','对比传统C类默认/24与现代CIDR的实际前缀长度。',{ip:'192.168.10.42',prefix:24},s=>{
    const parts=s.ip.split('.'),valid=parts.length===4&&parts.every(x=>/^\d{1,3}$/.test(x)&&Number(x)<=255);const ip=parts.reduce((a,b)=>(a*256+Number(b))>>>0,0),mask=(0xffffffff<<(32-s.prefix))>>>0;const dotted=n=>[24,16,8,0].map(b=>(n>>>b)&255).join('.');
    return `<div class="lab-controls">${field('ip','IPv4地址',s.ip)}${select('prefix','实际前缀长度',s.prefix,[[16,'/16'],[24,'/24'],[26,'/26']])}</div>${valid?`<div class="lab-registers"><b>掩码 ${dotted(mask)}</b><b>网络地址 ${dotted(ip&mask)}</b></div><div class="lab-ip-bits">${[...parts.map(x=>Number(x).toString(2).padStart(8,'0')).join('')].map((b,i)=>`<span class="${i<s.prefix?'network':'host'}">${b}</span>`).join('')}</div>${output(`前${s.prefix}位是网络前缀，后${32-s.prefix}位是主机部分。首字节${parts[0]}${Number(parts[0])<128?'位于历史A类范围（0、127另有用途）':Number(parts[0])<192?'位于历史B类范围':Number(parts[0])<224?'位于历史C类范围':Number(parts[0])<240?'位于D类组播范围':'位于保留范围'}，但实际划分必须看掩码。`)}`:output('请输入4组0—255的十进制数。')}`;
  },()=>{},(s,k,v)=>{s[k]=k==='prefix'?Number(v):v;});
})();

/* Source provenance: note-labs-2021.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui} = window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money} = ui;
const chips=values=>`<div class="lab-tape">${values.map(v=>`<span>${esc(String(v))}</span>`).join('')}</div>`;
register(['y2021q15'],'跟随一帧数据离开本机','选择同网或异网目的地，逐段看网卡、交换机、网关的工作。',{remote:true,step:0,random:false},s=>{
    const route=s.remote?['本机网卡','交换机','默认网关 / 路由器','目标网络主机']:['本机网卡','交换机','同网主机'];
    return `<div class="lab-controls">${select('remote','目标位置',String(s.remote),[['true','另一网络'],['false','本地网络']])}${btn('发送下一段','step','',s.step===route.length?'disabled':'')}${btn(s.random?'恢复示例MAC':'启用示例随机MAC','random')}</div><div class="lab-network">${route.map((v,i)=>`<div class="${i<s.step?'safe':''}">${v}${i<s.step?'<small>已处理</small>':''}</div>`).join('')}</div>${table(['本机IP','当前接口MAC'],[['192.0.2.10',s.random?'02:AB:CD:10:20:30':'02:10:20:30:40:50']])}${output(s.remote?'IP目的地址仍是远端主机；第一段链路帧先交给默认网关。':'同网通信通常可在本地链路完成，无须经过跨网路由。')}${coach('只模拟职责分工；MAC随机化不保证匿名，也不改变IP地址的位数。')}`;
  },(s,a)=>{if(a==='step')s.step=Math.min(s.step+1,s.remote?4:3);if(a==='random')s.random=!s.random;},(s,k,v)=>{s.remote=v==='true';s.step=0;});
const dnsRecords={'notes.example':['192.0.2.10','192.0.2.11'],'files.example':['192.0.2.10'],'video.example':['2001:db8::20']};
register(['y2021q28'],'DNS不是一行一个IP的通讯录','查询两个不同域名，更新权威记录后观察缓存失效。',{domain:'notes.example',cache:{},time:0,changed:false,result:[],message:'尚未查询。'},s=>
    `<div class="lab-controls">${select('domain','查询域名',s.domain,Object.keys(dnsRecords).map(k=>[k,k]))}${btn('查询','query')}${btn('推进60秒（学习控制）','tick')}${btn('更新notes.example权威记录','change','',s.changed?'disabled':'')}</div><div class="lab-dns-panels"><section><b>权威记录</b>${table(['名称','地址'],Object.entries(dnsRecords).map(([k,v])=>[k,k==='notes.example'&&s.changed?'192.0.2.99':v.join('<br>')]))}</section><section><b>本次查询结果</b>${chips(s.result)}<p>示例时间 ${s.time} 秒</p></section></div>${output(s.message)}`,
    (s,a)=>{if(a==='tick')s.time+=60;if(a==='change'){s.changed=true;s.message='权威记录已改变，本地未到期缓存仍可返回旧值。';}if(a==='query'){const cached=s.cache[s.domain];if(cached&&cached.until>s.time){s.result=cached.values;s.message=`命中缓存；还有${cached.until-s.time}秒到期。`;}else{s.result=s.domain==='notes.example'&&s.changed?['192.0.2.99']:dnsRecords[s.domain];s.cache[s.domain]={values:[...s.result],until:s.time+60};s.message='查询权威记录并缓存60秒。A/AAAA地址数量不必为1。';}}});
register(['y2021q37'],'编辑元数据，不让它误跑到正文里','分别修改描述、标签页标题与正文标题，观察各自的作用域。',{description:'按教材章节整理的计算机笔记',title:'我的计算机笔记',heading:'第一章 信息技术',view:'page'},s=>
    `<div class="lab-controls">${field('title','title',s.title)}${field('description','meta description',s.description)}${field('heading','h1',s.heading)}</div><pre class="lab-code">${esc(`<head>\n  <title>${esc(s.title)}</title>\n  <meta name="description" content="${esc(s.description)}">\n</head>\n<body><h1>${esc(s.heading)}</h1></body>`)}</pre><div class="lab-tabs">${btn('浏览器正文','view','page')}${btn('查看元数据读取结果','view','meta')}</div><div class="lab-browser"><header>${esc(s.title)}</header><div class="lab-browser-page">${s.view==='page'?`<h3>${esc(s.heading)}</h3><p>meta描述不会自动成为这里的正文。</p>`:`<b>description 字段</b><p>${esc(s.description)}</p><small>这是元数据检查器，不是搜索引擎排名预览。</small>`}</div></div>`,(s,a,v)=>{s.view=v;});
})();

/* Source provenance: note-labs-audit.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui,clusteredChart,daysBetween}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
const documents=[['物联网传感器',true],['物联网协议',true],['物联网医疗',true],['物联网应用',true],['物联网安全',true],['传感器网络',true],['智能设备联网',true],['嵌入式采集',true],['互联网新闻',false],['网络广告',false]];
register(['y2026q28'],'把查全率与查准率放回真实集合','选择检索范围，再点文献切换是否被检出；两项比率由集合重算。',{found:[0,1,2,3,4,8,9],mode:'metrics',expression:'standard',ordered:false,gap:1},s=>{
 const modes=controls(select('mode','检索场景',s.mode,[['metrics','查全率与查准率'],['boolean','布尔优先级'],['near','邻近与词序']]));
 if(s.mode==='boolean'){const rows=[['文献1',true,false,false],['文献2',false,true,true],['文献3',false,true,false],['文献4',true,true,true]];const hit=r=>s.expression==='standard'?r[1]||(r[2]&&r[3]):(r[1]||r[2])&&r[3];return modes+controls(select('expression','检索式',s.expression,[['standard','A OR B AND C'],['parentheses','(A OR B) AND C']]))+table(['文献','含A','含B','含C','是否检出'],rows.map(r=>[r[0],...r.slice(1).map(v=>v?'是':'否'),hit(r)?'✓ 检出':'未检出']))+output('本例采用教材常见NOT＞AND＞OR规则。无括号式先算B AND C；加括号后先算A OR B，文献1的去留随之改变。实际检索平台可能另定优先级。');}
 if(s.mode==='near'){const lines=['data science','science data','data and science','data can improve modern science'];const matched=text=>{const words=text.split(' '),a=words.indexOf('data'),b=words.indexOf('science');return Math.abs(a-b)-1<=Number(s.gap)&&(!s.ordered||a<b);};return modes+controls(select('ordered','词序规则',String(s.ordered),[['false','无序邻近'],['true','有序邻近：data在前']])+field('gap','允许的中间词数',s.gap,'number','min="0" max="3"'))+table(['示例文本','结果'],lines.map(text=>[text,matched(text)?'✓ 匹配':'不匹配']))+output('本例按两词中间的词数计距离。NEAR不必然禁止词序颠倒；实际语法、计数方法和有序参数以平台说明为准。');}
 const relevant=documents.filter(x=>x[1]).length,hits=s.found.filter(i=>documents[i][1]).length;
 return modes+controls(btn('精确词匹配','preset','exact')+btn('扩大检索','preset','broad')+btn('清空检出','preset','none'))+`<div class="lab-doc-set">${documents.map((d,i)=>btn(`${s.found.includes(i)?'✓ ':''}${d[0]} · ${d[1]?'相关':'不相关'}`,'toggle',i,`aria-pressed="${s.found.includes(i)}"`)).join('')}</div>`+table(['指标','计算','值'],[['查全率',`${hits}/${relevant}`,`${(hits/relevant*100).toFixed(1)}%`],['查准率',`${hits}/${s.found.length}`,s.found.length?`${(hits/s.found.length*100).toFixed(1)}%`:'未定义（尚无检出）']])+output('文献的相关性由这份示例资料集事先给定；扩大结果集不保证查准率一定下降，必须看新增文献是否相关。');
},(s,a,v)=>{if(a==='toggle'){const i=Number(v);s.found=s.found.includes(i)?s.found.filter(x=>x!==i):[...s.found,i];}if(a==='preset')s.found=v==='none'?[]:v==='exact'?[0,1,2,3,4]:documents.map((_,i)=>i);},(s,k,v)=>{s[k]=k==='ordered'?v==='true':k==='gap'?number(v,0,3):v;});
register(['y2026q38'],'段落、换行与可省略的结束标签','对照源码与真实浏览器段落布局，区分省略结束标签和空元素。',{mode:'closed'},s=>{
 const code=s.mode==='br'?'<p>第一行<br>第二行</p>':s.mode==='omit'?'<p>第一段<p>第二段':'<p>第一段</p><p>第二段</p>';
 return controls(select('mode','HTML写法',s.mode,[['closed','显式结束p'],['omit','符合条件时省略p结束标签'],['br','在一个p内用br换行']]))+`<pre class="lab-code">${esc(code)}</pre><div class="lab-browser-page">${code}</div>`+output(s.mode==='br'?'只有一个段落；br是空元素，没有结束标签。':'浏览器形成两个段落。第二个p开始时，前一个p可按HTML规则隐式结束；p仍不是空元素。');
},()=>{});
})();

/* Source provenance: note-labs-network.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,esc}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
const fmt=n=>Number(n).toLocaleString('zh-CN',{maximumFractionDigits:3});
const finite=(v,min,max)=>String(v).trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max;
function transfer(s){
    if(!finite(s.size,0.001,1000)||!finite(s.first,0.1,10000)||!finite(s.second,0.1,10000)||!finite(s.efficiency,1,100)||!finite(s.delay,0,10000))return null;
    const bits=Number(s.size)*1048576*8,capacity=Math.min(Number(s.first),Number(s.second)),goodput=capacity*Number(s.efficiency)/100;
    return {bits,capacity,goodput,seconds:bits/(goodput*1e6),wait:Number(s.delay)/1000};
  }
register(['y2020q26'],'改链路、改文件：实际传输进度由谁决定','比较瓶颈容量、有效载荷速率与启动等待；开始后进度按计时推进。',{
    size:'2',first:'100',second:'20',efficiency:'80',delay:'300',running:false,elapsed:0,stamp:0
  },s=>{
    const x=transfer(s),disabled=s.running?'disabled':'',fraction=x?Math.min(1,Math.max(0,s.elapsed-x.wait)/x.seconds):0;
    return controls(field('size','文件大小（MiB）',s.size,'number',`min="0.001" max="1000" ${disabled}`)+field('first','链路 A 容量（Mbit/s）',s.first,'number',`min="0.1" max="10000" ${disabled}`)+field('second','链路 B 容量（Mbit/s）',s.second,'number',`min="0.1" max="10000" ${disabled}`)+field('efficiency','有效载荷比例（%）',s.efficiency,'number',`min="1" max="100" ${disabled}`)+field('delay','启动等待（ms）',s.delay,'number',`min="0" max="10000" ${disabled}`))+
      (x?`<div class="ext-route"><span>发送端</span><span>A · ${esc(s.first)} Mbit/s</span><span>B · ${esc(s.second)} Mbit/s</span><span>接收端</span></div><div class="ext-transfer"><div role="progressbar" aria-label="已接收文件比例" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(fraction*100)}"><i style="width:${fraction*100}%"></i></div><strong>${fmt(fraction*100)}%</strong><p>已接收 ${fmt(fraction*Number(s.size))} / ${esc(s.size)} MiB</p></div>`+table(['计算环节','本次结果'],[['容量上限',`min(${s.first}, ${s.second}) = ${fmt(x.capacity)} Mbit/s`],['有效载荷速率',`${fmt(x.capacity)} × ${s.efficiency}% = ${fmt(x.goodput)} Mbit/s`],['文件数据量',`${s.size} × 1,048,576 × 8 = ${fmt(x.bits)} bit`],['本例完成时间',`${fmt(x.wait)} + ${fmt(x.seconds)} = ${fmt(x.wait+x.seconds)} 秒`]]):output('请输入规定范围内的数值，文件和链路容量必须大于0。'))+
      controls(btn(s.running?'传输中…':'开始传输','start','',s.running||!x?'disabled':'')+btn('停止并重置','reset'))+output(!x?'参数尚不完整。':fraction===1?'文件已到达。提高非瓶颈链路容量不一定更快；启动等待不改变文件的字节数。':s.running?`已用 ${fmt(s.elapsed)} 秒 · ${s.elapsed<x.wait?'等待启动':'正在接收有效载荷'}`:'修改参数会清空上一轮结果。这里的进度使用实际时间。')+coach('简化模型假定速率稳定、不丢包、无其他流量；只计一次启动等待，不复刻TCP握手或完整端到端流水过程。Mbit/s按百万位计，MiB按2²⁰字节计；有效载荷速率（goodput）扣除了本例开销。');
  },(s,a)=>{if(a==='reset'){s.running=false;s.elapsed=0;}if(a==='start'&&transfer(s)&&!s.running){s.running=true;s.elapsed=0;s.stamp=Date.now();}},(s,k,v)=>{if(!s.running){s[k]=v;s.elapsed=0;}});
registry.y2020q26.tick=s=>{if(!s.running)return false;const x=transfer(s);s.elapsed=Math.min((Date.now()-s.stamp)/1000,x.wait+x.seconds);if(s.elapsed>=x.wait+x.seconds)s.running=false;return true;};
registry.y2020q26.tickInterval=100;
registry.y2020q26.frameKey=s=>String(s.running);
registry.y2020q26.patchFrame=(s,root)=>ui.patchRegions(root,registry.y2020q26.render(s),['.ext-transfer','.lab-output']);
function parseURL(s){try{const base=new URL(s.base);if(!['http:','https:'].includes(base.protocol))return null;const resolved=new URL(s.target,base);if(!['http:','https:'].includes(resolved.protocol))return null;return {base,resolved};}catch{return null;}}
register(['y2026q14'],'把相对地址放回当前网页，计算真正目标','编辑基准网页与href；路径、查询和片段会分别显示。',{
    base:'https://notes.example/course/chapter1.html',target:'../media/audio.html?mode=pcm#sample'
  },s=>{const x=parseURL(s),u=x?.resolved;return controls(field('base','当前网页的绝对URL',s.base)+field('target','链接的href（相对或绝对地址）',s.target))+
    (u?`<div class="ext-address"><b>解析后的完整地址</b><code>${esc(u.href)}</code></div>`+table(['组成','解析结果'],[['协议',esc(u.protocol)],['主机名',esc(u.hostname)],['端口',u.port||'未单独保留；HTTP默认80，HTTPS默认443'],['路径',esc(u.pathname)],['查询',esc(u.search||'无')],['片段',esc(u.hash||'无')]])+table(['链接写法','基于当前网页的结果'],['summary.html','../summary.html','/summary.html','?view=compact','#part2'].map(v=>[esc(v),esc(new URL(v,x.base).href)])):output('请输入有效的HTTP或HTTPS基准地址，目标也须解析为HTTP或HTTPS地址。'))+
    coach('相对路径按当前文档所在目录解析；以 / 开头则从主机根目录解析。? 后是查询；# 后是片段，通常由浏览器在客户端处理，不作为HTTP请求目标的一部分。默认端口可能被URL标准化省略。');},
    ()=>{});
function ipv6(raw){
    const text=String(raw).trim();if(!text||/[^0-9a-f:]/i.test(text)||text.split('::').length>2)return null;
    let groups;if(text.includes('::')){const [l,r]=text.split('::'),left=l?l.split(':'):[],right=r?r.split(':'):[];if(left.length+right.length>=8)return null;groups=[...left,...Array(8-left.length-right.length).fill('0'),...right];}else{groups=text.split(':');if(groups.length!==8)return null;}
    if(groups.some(v=>! /^[0-9a-f]{1,4}$/i.test(v)))return null;
    const values=groups.map(v=>parseInt(v,16)),short=values.map(v=>v.toString(16));let best=-1,length=0;
    for(let i=0;i<8;){if(values[i]!==0){i++;continue;}let j=i;while(j<8&&values[j]===0)j++;if(j-i>=2&&j-i>length){best=i;length=j-i;}i=j;}
    const canonical=best<0?short.join(':'):short.slice(0,best).join(':')+'::'+short.slice(best+length).join(':');
    return {values,full:values.map(v=>v.toString(16).padStart(4,'0')).join(':'),canonical};
  }
register(['y2023q47'],'自己压缩IPv6，再展开核对128位','输入完整或缩写地址，观察被省略的零组；试试全零与两个同长零段。',{raw:'2001:0db8:0000:0000:0001:0000:0000:0001'},s=>{
    const x=ipv6(s.raw);return controls(field('raw','IPv6地址（纯十六进制写法）',s.raw)+btn('文档示例','sample','2001:db8::1')+btn('两个同长零段','sample','2001:0:0:1:0:0:1:1')+btn('全零地址','sample','::'))+(x?`<div class="ext-ipv6">${x.values.map((n,i)=>`<div><small>第${i+1}组 · 16 bit</small><code>${n.toString(16).padStart(4,'0')}</code><span>${n.toString(2).padStart(16,'0')}</span></div>`).join('')}</div>`+table(['表示','结果'],[['完整8组',`<code>${x.full}</code>`],['推荐缩写',`<code>${x.canonical}</code>`],['存储长度','8 × 16 = 128 bit = 16 B']]):output('地址应展开为8组，每组1—4个十六进制数字；::只能出现一次且必须省略至少一组。此卡不接收IPv4混合写法、前缀长度或区域标识。'))+coach('前导零可以省略；规范推荐压缩最长的连续全零段，同长取最左段，单个零组不压缩。缩短的是文字写法，不是128位地址长度。');},(s,a,v)=>{if(a==='sample')s.raw=v;});
window.NOTE_LABS.networkMath={transfer,ipv6};
})();
