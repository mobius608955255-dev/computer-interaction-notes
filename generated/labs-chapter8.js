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

/* Chapter 8: security. Maintained source; edit this domain directly. */
/* Source provenance: note-labs.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
register(['y2022q39'],'一台终端出问题，会扩散到哪里','启用分区策略或冗余，再观察攻击和链路故障的影响。',{segmented:false,attacked:false,failed:false,redundant:false},s=>
    `<div class="lab-controls">${btn(s.segmented?'关闭分区策略':'启用分区策略','segment')}${btn('模拟终端被攻陷','attack')}${btn(s.redundant?'关闭备用链路':'配置备用链路','redundant')}${btn('模拟主链路故障','fail')}</div><div class="lab-network"><div class="${s.attacked?'danger':''}">办公终端</div><span>→ ${s.segmented?'策略隔离':'允许互访'} →</span><div class="${s.attacked&&!s.segmented?'danger':'safe'}">核心数据库</div><span>${s.failed&&!s.redundant?'× 主链路中断':'↔ 链路可用'}</span><div>备份服务</div></div>${output(s.attacked?(s.segmented?'攻击源仍存在，但本例横向访问被策略阻止。':'本例允许互访，数据库暴露于横向攻击路径。'):'尚未注入攻击。')}${output(s.failed?(s.redundant?'已切到事先配置的备用链路。':'没有备用路径，服务不可达。'):'主链路正常。')}`,
    (s,a)=>{if(a==='segment')s.segmented=!s.segmented;if(a==='attack')s.attacked=true;if(a==='redundant')s.redundant=!s.redundant;if(a==='fail')s.failed=true;});
})();

/* Source provenance: note-labs-2021.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui} = window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money} = ui;
register(['y2021q18'],'看清地址，再决定从哪里进入','展开消息地址，核对站点身份；没有真实登录或密码输入。',{message:0,expanded:false,verified:false},s=>{
    const messages=[['好友转发','请立即领取补贴，今晚失效。','https://campus.example.claim-benefit.test/login','claim-benefit.test'],['教务通知','请从收藏的学校入口查看通知。','https://campus.example/notice','campus.example']];const m=messages[s.message];
    return `<div class="lab-controls">${select('message','消息样本',String(s.message),[['0','熟人发来的催促链接'],['1','要求从已知入口核实']])}</div><div class="lab-message"><b>${m[0]}</b><p>${m[1]}</p>${btn(s.expanded?'收起完整地址':'查看完整地址','inspect')}${s.expanded?`<code class="lab-url">${m[2]}</code><p>实际站点：<strong>${m[3]}</strong></p>`:''}</div><div class="lab-controls">${btn('从已知官方入口独立核实','verify')}</div>${s.verified?`<div class="lab-browser-page"><h4>campus.example · 示例官方入口</h4><p>${s.message===0?'公告列表中没有该补贴活动，不继续提交信息。':'公告内容与消息一致，仍只在已核实入口操作。'}</p></div>`:''}${output('完整域名从右向左核对；地址里含“campus.example”字样，不表示它就是campus.example网站。')}`;
  },(s,a)=>{if(a==='inspect')s.expanded=!s.expanded;if(a==='verify')s.verified=true;},(s,k,v)=>{s.message=Number(v);s.expanded=false;s.verified=false;});
})();

/* Source provenance: note-labs-security.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,esc}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
const area=(k,l,v,disabled=false)=>`<label>${l}<textarea data-field="${k}" rows="3" ${disabled?'disabled':''}>${esc(v)}</textarea></label>`;
function ip4(raw){const p=String(raw).split('.');return p.length===4&&p.every(v=>/^\d{1,3}$/.test(v)&&Number(v)<=255)?p.reduce((a,v)=>a*256+Number(v),0):null;}
function cidr(raw){if(raw==='*')return {network:0,mask:0};const p=raw.split('/'),ip=ip4(p[0]),bits=p.length===1?32:Number(p[1]);if(ip===null||p.length>2||(p.length===2&&!/^\d{1,2}$/.test(p[1]))||!Number.isInteger(bits)||bits<0||bits>32)return null;const mask=bits===0?0:(0xffffffff<<(32-bits))>>>0;return {network:(ip&mask)>>>0,mask};}
const inSubnet=(ip,range)=>{const x=ip4(ip),net=cidr(range);return x!==null&&net!==null&&((x&net.mask)>>>0)===net.network;};
function matchRule(s,r){return inSubnet(s.source,r.source)&&(r.direction==='any'||r.direction===s.direction)&&(r.protocol==='any'||r.protocol===s.protocol)&&(r.port==='*'||Number(r.port)===Number(s.port));}
const defaults=[{id:1,source:'10.20.0.0/16',direction:'in',protocol:'TCP',port:'3389',action:'allow'},{id:2,source:'*',direction:'in',protocol:'TCP',port:'3389',action:'deny'},{id:3,source:'*',direction:'in',protocol:'TCP',port:'443',action:'allow'}];
function reorder(s,from,to){const i=s.rules.findIndex(r=>r.id===from);if(i<0||to<0||to>=s.rules.length)return;const [r]=s.rules.splice(i,1);s.rules.splice(to,0,r);s.last=null;}
register(['merged-16'],'同一份请求穿过规则：来源、方向、端口一起判断','修改请求、添加规则或真正拖动规则次序，再发送请求观察首条命中。',{
   source:'203.0.113.27',destination:'192.0.2.10',direction:'in',protocol:'TCP',port:'3389',rules:defaults,nextId:4,fallback:'deny',last:null,error:'',draftSource:'10.20.0.0/16',draftDirection:'in',draftProtocol:'TCP',draftPort:'3389',draftAction:'allow'
 },s=>controls(field('source','请求来源IPv4',s.source)+select('direction','相对受保护主机的方向',s.direction,[['in','入站'],['out','出站']])+select('protocol','请求协议',s.protocol,[['TCP','TCP'],['UDP','UDP']])+field('port','目标端口',s.port,'number','min="1" max="65535"')+btn('发送这份请求','send'))+
   `<div class="ext-address"><b>当前请求</b><code>${esc(s.source)} → ${s.destination} : ${esc(s.port)} / ${esc(s.protocol)} · ${s.direction==='in'?'入站':'出站'}</code></div><h4>从上向下：本例首条匹配决定动作</h4>${s.rules.map((r,i)=>`<section class="ext-rule-row ${s.last?.rule===r.id?'match':''}" data-lab-drop="${i}"><div><b>第${i+1}条 · ${r.action==='allow'?'允许':'阻止'}</b><p>来源 ${esc(r.source==='*'?'任意':r.source)}；${{in:'入站',out:'出站',any:'任意方向'}[r.direction]}；${esc(r.protocol)}；端口 ${esc(r.port)}</p></div><div class="ext-rule-actions"><button type="button" data-lab-drag="object" data-key="${r.id}" aria-label="拖动第${i+1}条规则">拖动排序</button>${btn('上移','up',r.id,i?'':'disabled')}${btn('下移','down',r.id,i<s.rules.length-1?'':'disabled')}${btn('移除','remove',r.id)}</div></section>`).join('')}`+controls(select('fallback','没有命中时',s.fallback,[['deny','默认阻止'],['allow','默认允许']]))+
   `<section class="ext-dataset"><h4>添加一条规则</h4>${controls(field('draftSource','来源IP或CIDR（*表示任意）',s.draftSource)+select('draftDirection','规则方向',s.draftDirection,[['in','入站'],['out','出站'],['any','任意方向']])+select('draftProtocol','规则协议',s.draftProtocol,[['TCP','TCP'],['UDP','UDP'],['any','任意协议']])+field('draftPort','规则端口（*表示任意）',s.draftPort)+select('draftAction','匹配动作',s.draftAction,[['allow','允许'],['deny','阻止']])+btn('加到规则末尾','add'))}</section>`+
   output(s.error|| (s.last?`${s.last.packet}：${s.last.action==='allow'?'允许通过':'已阻止'}。${s.last.rule?'命中第'+s.last.position+'条':'没有命中，采用默认动作'}。`:'发送前先核对来源、方向、协议和端口。更改规则或请求后需重新发送。'))+coach('这是按“首条匹配”处理的有序访问控制模型，不是Windows防火墙的规则优先级仿真。不同产品的冲突处理方式不同。端口获准不等于应用没有漏洞，也不会自动证明请求者身份。'),
 (s,a,v)=>{s.error='';if(a==='send'){if(ip4(s.source)===null||!/^\d+$/.test(s.port)||Number(s.port)<1||Number(s.port)>65535){s.last=null;s.error='请提供有效IPv4和1—65535端口。';return;}const index=s.rules.findIndex(r=>matchRule(s,r)),r=s.rules[index];s.last={packet:`${s.source} → ${s.destination}:${s.port}/${s.protocol} · ${s.direction==='in'?'入站':'出站'}`,rule:r?.id,position:index+1,action:r?.action||s.fallback};}
   if(a==='add'){if(s.rules.length>=12){s.error='本例最多12条规则，请先移除不需要的规则。';return;}if(!cidr(s.draftSource)||!(s.draftPort==='*'||/^\d+$/.test(s.draftPort)&&Number(s.draftPort)>=1&&Number(s.draftPort)<=65535)){s.error='规则来源须为IPv4、CIDR或*，端口须为1—65535或*。';return;}s.rules.push({id:s.nextId++,source:s.draftSource,direction:s.draftDirection,protocol:s.draftProtocol,port:s.draftPort,action:s.draftAction});s.last=null;}
   if(a==='remove'){s.rules=s.rules.filter(r=>r.id!==Number(v));s.last=null;}if(a==='up'||a==='down'){const index=s.rules.findIndex(r=>r.id===Number(v));reorder(s,Number(v),index+(a==='up'?-1:1));}
 },(s,k,v)=>{s[k]=v;s.error='';s.last=null;});
registry['merged-16'].gesture=(s,g,root)=>{if(g.kind!=='object'||!g.moved)return;const target=[...root.querySelectorAll('[data-lab-drop]')].find(el=>{const r=el.getBoundingClientRect();return g.endX>=r.left&&g.endX<=r.right&&g.endY>=r.top&&g.endY<=r.bottom;});if(target)reorder(s,Number(g.key),Number(target.dataset.labDrop));};
const hex=buffer=>Array.from(new Uint8Array(buffer),v=>v.toString(16).padStart(2,'0')).join('');
const unhex=text=>/^(?:[0-9a-f]{2})+$/i.test(text)?new Uint8Array(text.match(/../g).map(v=>parseInt(v,16))):null;
const bytes=text=>new TextEncoder().encode(text);
register(['merged-15'],'亲自签名、篡改和验签，再比较加密与摘要','本卡调用浏览器密码API计算；修改原文、换公钥或改密文，结果会真实变化。',{
   mode:'signature',text:'本周学习计算机网络',received:'本周学习计算机网络',signer:'sender',keys:null,busy:false,signature:'',cipher:'',clear:'',decrypted:false,digest:'',message:'先生成本次示例密钥。密钥与内容只保留在本次卡片内。'
 },s=>{const disabled=s.busy?'disabled':'',ready=s.keys&&!s.busy;let body='';
   if(s.mode==='signature')body=area('text','发送方要签名的原文',s.text,s.busy)+controls(btn('使用发送方私钥签名','sign','',ready?'':'disabled'))+(s.signature?`<code class="ext-code">签名（十六进制）：${s.signature}</code>`:'')+area('received','收到的原文（可改字模拟篡改）',s.received,s.busy)+controls(select('signer','用谁的公钥验证',s.signer,[['sender','发送方公钥'],['other','另一人的公钥']])+btn('验证收到的原文与签名','verify','',ready&&s.signature?'':'disabled'));
   if(s.mode==='encryption')body=area('text','发给接收方的短消息',s.text,s.busy)+controls(btn('用接收方公钥加密','encrypt','',ready?'':'disabled'))+area('cipher','密文（十六进制，可改动后再尝试解密）',s.cipher,s.busy)+controls(btn('用接收方私钥解密','decrypt','',ready&&s.cipher?'':'disabled'))+(s.decrypted?`<section class="ext-dataset"><h4>实际解密结果</h4><p>${esc(s.clear||'空字符串')}</p></section>`:'')+coach('本例直接用RSA-OAEP加密短消息，UTF-8最多190字节；真实大文件通常使用对称加密，并通过非对称机制保护或协商密钥。签名和加密使用不同算法与密钥。');
   if(s.mode==='hash')body=area('text','计算摘要的原文',s.text,s.busy)+controls(btn('计算SHA-256摘要','hash','',disabled))+(s.digest?`<code class="ext-code">${s.digest}</code><p>256 bit = 32 B；十六进制写成64个字符。</p>`:'')+coach('摘要没有对应的解密操作；没有密钥的摘要本身不能证明发送者身份。收到文本和摘要后，攻击者若能同时替换二者，仅重算比对摘要不足以认证来源。');
   return controls(select('mode','比较的机制',s.mode,[['signature','数字签名：原文与身份绑定'],['encryption','公钥加密：保密传输'],['hash','摘要：数据指纹']])+btn(s.busy?'计算中…':s.keys?'重新生成示例密钥':'生成本次示例密钥','keys','',disabled))+`<div class="ext-key">${s.keys?'已生成发送方、另一人的签名密钥，以及接收方的加密密钥。':'尚未生成示例密钥。'}</div>`+body+output(esc(s.message))+coach('签名私钥属于签名者，验证使用其公钥；加密使用接收方公钥，解密由接收方私钥完成。真实场景还需核验公钥与身份的可信绑定。本例使用Web Crypto：ECDSA P-256、RSA-OAEP/SHA-256与SHA-256，不向网络发送内容。');
 },async(s,a)=>{
   if(s.busy)return;const api=window.crypto?.subtle;if(!api){s.message='当前浏览器未提供安全环境中的Web Crypto，无法执行此卡计算。';return;}s.busy=true;s.message='正在计算…';
   try{
     if(a==='keys'){const [sender,other,receiver]=await Promise.all([api.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']),api.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']),api.generateKey({name:'RSA-OAEP',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},false,['encrypt','decrypt'])]);s.keys={sender,other,receiver};s.signature=s.cipher=s.clear=s.digest='';s.decrypted=false;s.message='新密钥已生成，旧签名与密文已清空。';}
     if(a==='hash'){if(bytes(s.text).length>20000)throw Error('text');s.digest=hex(await api.digest('SHA-256',bytes(s.text)));s.message='摘要已由当前原文计算。改变任一字符后重新计算，可比较结果。';}
     if(a==='sign'&&s.keys){if(bytes(s.text).length>20000)throw Error('text');s.signature=hex(await api.sign({name:'ECDSA',hash:'SHA-256'},s.keys.sender.privateKey,bytes(s.text)));s.received=s.text;s.message='已用发送方私钥签名；原文仍是可读文本，签名不把原文变成密文。';}
     if(a==='verify'&&s.keys&&s.signature){const valid=await api.verify({name:'ECDSA',hash:'SHA-256'},s.keys[s.signer].publicKey,unhex(s.signature),bytes(s.received));s.message=valid?'验签通过：此原文与签名匹配所选公钥。公钥属于谁仍需可信来源。':'验签失败：收到的原文被改动，或所选公钥与签名者不匹配。';}
     if(a==='encrypt'&&s.keys){if(bytes(s.text).length>190){s.message='本例RSA-OAEP短消息上限为190个UTF-8字节，请缩短原文。';return;}s.cipher=hex(await api.encrypt({name:'RSA-OAEP'},s.keys.receiver.publicKey,bytes(s.text)));s.clear='';s.decrypted=false;s.message='已用接收方公钥生成实际密文；私钥仍留在接收方。';}
     if(a==='decrypt'&&s.keys){s.clear='';s.decrypted=false;const b=unhex(s.cipher);if(!b||b.length!==256){s.message='本例RSA密文应为256字节，即512个十六进制字符。';return;}s.clear=new TextDecoder().decode(await api.decrypt({name:'RSA-OAEP'},s.keys.receiver.privateKey,b));s.decrypted=true;s.message='已用接收方私钥解出原文。';}
   }catch{s.message=a==='decrypt'?'解密失败：密文被改动或不属于本次密钥。':'计算未完成，请检查输入长度并重试。';}finally{s.busy=false;}
 },(s,k,v)=>{if(s.busy)return;s[k]=v;s.message='内容或机制已改变，请重新执行对应操作。';if(k==='text')s.digest='';if(k==='cipher'||k==='mode'){s.clear='';s.decrypted=false;}});
window.NOTE_LABS.securityMath={ip4,cidr,inSubnet,matchRule,reorder};
})();
