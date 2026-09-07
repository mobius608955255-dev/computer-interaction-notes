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

/* Chapter 11: algorithms. Maintained source; edit this domain directly. */
/* Source provenance: note-labs.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
register(['y2022q33'],'用缓存换计算：区间求和工作台','改变数据规模和查询次数，对照重复扫描与前缀和。',{n:100,q:10},s=>
    `<div class="lab-controls">${field('n','数据项数 n',s.n,'range','min="10" max="1000" step="10"')}${field('q','查询次数 q',s.q,'range','min="1" max="100"')}</div><div class="lab-complexity">${[['逐次扫描',s.n*s.q,1],['先建前缀和',s.n+s.q,s.n+1]].map(([name,time,space])=>`<section><h4>${name}</h4><div class="lab-bar"><i style="width:${Math.max(2,time/(s.n*s.q)*100)}%"></i></div><p>示意运算量 ${money(time)}</p><p>额外存储单元 ${money(space)}</p></section>`).join('')}</div>${output(`n=${s.n}，q=${s.q}。采用全长查询估算：扫描约nq次，前缀和约n+q次；两种方法都能得到相同和。`)}`,()=>{},(s,k,v)=>{s[k]=number(v,1,1000);});
register(['y2022q43'],'逐轮执行1到n的累加','每次执行一轮，查看S与i的实际更新，而不是直接跳到答案。',{n:10,i:1,sum:0,history:[]},s=>
    `<div class="lab-controls">${field('n','循环上限 n',s.n,'number','min="1" max="30"')}${btn('执行一轮','step','',s.i>s.n?'disabled':'')}${btn('运行到结束','run','',s.i>s.n?'disabled':'')}</div><div class="lab-registers"><b>i = ${s.i}</b><b>S = ${s.sum}</b><b>i ≤ ${s.n}：${s.i<=s.n?'成立':'不成立'}</b></div><pre class="lab-code">S ← 0; i ← 1\nwhile i ≤ n:\n    S ← S + i\n    i ← i + 1</pre><div class="lab-tape">${s.history.map(x=>`<span>${x}</span>`).join('')}</div>${output(s.i>s.n?`循环结束。S=${s.sum}；下次条件检查时i=${s.i}。`:'等待下一轮，S保留此前累加结果。')}`,
    (s,a)=>{const step=()=>{if(s.i<=s.n){const old=s.sum;s.sum+=s.i;s.history.push(`${old} + ${s.i} = ${s.sum}`);s.i++;}};if(a==='run')while(s.i<=s.n)step();else step();},(s,k,v)=>{s.n=number(v,1,30);s.i=1;s.sum=0;s.history=[];});
})();

/* Source provenance: note-labs-2021.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui} = window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money} = ui;
const chips=values=>`<div class="lab-tape">${values.map(v=>`<span>${esc(String(v))}</span>`).join('')}</div>`;
register(['y2021q3'],'两队过桥：只能放行队首','交替放行两个队列，观察合法次序怎样形成。',{a:['A','B','C','D'],b:['E','F','G','H'],passed:[],message:'A与E分别处在各自队首。'},s=>
    `<div class="lab-queue"><section><b>车道一 · 队首在左</b>${chips(s.a)}${btn('放行车道一队首','release','a',s.a.length?'':'disabled')}</section><section><b>车道二 · 队首在左</b>${chips(s.b)}${btn('放行车道二队首','release','b',s.b.length?'':'disabled')}</section></div><div class="lab-bridge"><b>单向窄桥 · 已通过顺序</b>${chips(s.passed)}</div><div class="lab-controls">${btn('尝试让F越过E','overtake','',s.b.includes('E')&&s.b.includes('F')?'':'disabled')}</div>${output(s.message)}`,
    (s,a,v)=>{if(a==='release'&&s[v].length){const x=s[v].shift();s.passed.push(x);s.message=`${x}通过。只移除该队队首，另一队不受影响。`;}if(a==='overtake')s.message='F被E挡在后面：先让E通过，才能轮到F。这一步不会改变队列。';});
register(['y2021q33'],'按流程箭头走：先加，再更新，再判断','每次执行一轮，或改变终止边界看最后一项是否进入和。',{limit:10,inclusive:false,k:1,sum:0,done:false,rows:[]},s=>
    `<div class="lab-controls">${field('limit','边界值',s.limit,'number','min="1" max="31"')}${select('inclusive','继续条件',String(s.inclusive),[['false','k < 边界'],['true','k ≤ 边界']])}${btn('执行一轮','step','',s.done?'disabled':'')}</div><pre class="lab-code">S = 0; k = 1\ndo:\n    S = S + k\n    k = k + 3\nwhile k ${s.inclusive?'≤':'<'} ${s.limit}</pre>${table(['加进S的k','新的S','更新后的k','继续？'],s.rows)}${output(`当前 S=${s.sum}，k=${s.k}。${s.done?'条件不成立，循环已结束。':'下一次先执行循环体。'}`)}`,
    (s)=>{if(s.done)return;const old=s.k;s.sum+=s.k;s.k+=3;const again=s.inclusive?s.k<=s.limit:s.k<s.limit;s.rows.push([old,s.sum,s.k,again?'是':'否']);s.done=!again;},(s,k,v)=>{s[k]=k==='inclusive'?v==='true':number(v,1,31);s.k=1;s.sum=0;s.rows=[];s.done=false;});
})();

/* Source provenance: note-labs-audit.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui,clusteredChart,daysBetween}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
const area=(n,l,v)=>`<label>${l}<textarea data-field="${n}">${esc(v)}</textarea></label>`;
register(['y2026q6'],'让辗转相除真正走到终点','输入两个正整数，逐轮观察被除数、除数和余数。',{a:'48',b:'18',x:null,y:null,rows:[],answer:null,error:''},s=>
 controls(field('a','正整数 a',s.a)+field('b','正整数 b',s.b)+btn('开始计算','start')+btn('执行一轮','step','',s.x===null||s.answer!==null?'disabled':''))+table(['被除数','除数','余数'],s.rows)+output(s.error|| (s.answer!==null?`余数为0，当前除数是最大公约数：${s.answer}`:s.x!==null?`下一轮：${s.x} ÷ ${s.y}`:'等待输入。'))+table(['特征','在本算法中的体现'],[['输入','两个正整数'],['输出','最大公约数'],['确定性','每轮取余和赋值明确'],['可行性','整除和取余可执行'],['有穷性','非零余数严格递减']]),
 (s,a)=>{if(a==='start'){s.rows=[];s.answer=null;s.error='';const x=Number(s.a),y=Number(s.b);if(!/^\d+$/.test(s.a)||!/^\d+$/.test(s.b)||![x,y].every(n=>Number.isSafeInteger(n)&&n>0)){s.x=s.y=null;s.error='本模型的输入域是正的安全整数，不能输入0、小数或文字。';return;}s.x=x;s.y=y;}if(a==='step'&&s.x!==null&&s.answer===null){const r=s.x%s.y;s.rows.push([s.x,s.y,r]);if(r===0)s.answer=s.y;else{s.x=s.y;s.y=r;}}},(s,k,v)=>{s[k]=v;s.x=null;s.answer=null;s.rows=[];s.error='输入已改变，请重新开始。';});
register(['y2026q42'],'三数比较：明确规则才有确定输出','修改数值，比较明确算法与没有定义判断规则的伪代码。',{a:3,b:8,c:5,mode:'max'},s=>{
 const values=[Number(s.a),Number(s.b),Number(s.c)],valid=values.every(Number.isFinite);
 return controls(field('a','a',s.a,'number')+field('b','b',s.b,'number')+field('c','c',s.c,'number')+select('mode','伪代码',s.mode,[['max','明确：求最大值'],['ambiguous','含糊：选一个合适的数']]))+`<pre class="lab-code">${s.mode==='max'?'m ← a\n若 b > m 则 m ← b\n若 c > m 则 m ← c\n输出 m':'从 a、b、c 选择一个“合适”的数\n输出它'}</pre>`+output(s.mode==='ambiguous'?'“合适”没有可执行的判断规则，无法推出唯一结果。':valid?`m依次比较三个输入，最终输出 ${Math.max(...values)}。`:'请输入有限数值。');
},()=>{});
register(['y2023q69'],'逐个读成绩，只有不及格才加计数','编辑成绩列表，每轮读一个值；循环次数与不及格人数分开累计。',{raw:'85,59,72,40,91,60,58',data:[],i:0,count:0,rows:[],error:''},s=>
 controls(area('raw','成绩（逗号分隔，0—100）',s.raw)+btn('载入成绩','load')+btn('执行一轮','step','',s.i>=s.data.length?'disabled':''))+table(['本轮序号','读入成绩','成绩<60？','累计不及格人数'],s.rows)+output(s.error||`已处理 ${s.i}/${s.data.length} 人，不及格 ${s.count} 人。`),
 (s,a)=>{if(a==='load'){const t=s.raw.split(/[,，\s]+/).filter(Boolean),v=t.map(Number);s.i=s.count=0;s.rows=[];s.data=[];s.error='';if(!v.length||v.length>60||v.some(x=>!Number.isFinite(x)||x<0||x>100)){s.error='请输入1—60个0到100之间的成绩。';return;}s.data=v;}if(a==='step'&&s.i<s.data.length){const v=s.data[s.i++];if(v<60)s.count++;s.rows.push([s.i,v,v<60?'是':'否',s.count]);}},(s,k,v)=>{s.raw=v;s.data=[];s.rows=[];s.i=s.count=0;s.error='成绩已修改，请重新载入。';});
})();

/* Source provenance: note-labs-data.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,esc}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
function parseSort(raw){const t=String(raw).trim().split(/[,，\s]+/);if(t.length<2||t.length>12||t.some(v=>! /^-?\d+$/.test(v)||Math.abs(Number(v))>999))return null;return t.map((v,i)=>({value:Number(v),origin:i+1}));}
function sortStep(s){if(!s.items||s.done)return;const n=s.items.length,a=s.items[s.j],b=s.items[s.j+1],swap=s.direction==='asc'?a.value>b.value:a.value<b.value;
   s.comparisons++;s.last=[s.j,s.j+1];if(swap){[s.items[s.j],s.items[s.j+1]]=[b,a];s.swaps++;s.passSwaps++;}
   s.trace.push(`第${s.pass+1}趟，第${s.j+1}次：${a.value} ${s.direction==='asc'?'>':'<'} ${b.value} 为${swap?'真，交换':'假，保留'}。`);s.j++;
   if(s.j>=n-1-s.pass){s.pass++;s.j=0;s.message=`第${s.pass}趟完成：${s.items.map(x=>x.value).join('，')}。`;if(s.passSwaps===0||s.pass>=n-1){s.done=true;s.message+=s.passSwaps===0?' 本趟未交换，提前结束。':' 全部有序。';}else{s.message+=' 一趟结束不代表全序列已有序。';s.passSwaps=0;}}
   else s.message=`下一次比较第${s.j+1}与第${s.j+2}个元素。`;
 }
register(['y2024q69'],'输入自己的数组，比较一次或跑完一趟冒泡','可改升降序、重复值和负数；每一步的交换、趟数与比较次数都实际计算。',{
   raw:'8,5,2,9,7,3',direction:'asc',items:null,pass:0,j:0,passSwaps:0,comparisons:0,swaps:0,done:false,last:[],trace:[],message:'载入数组后，从相邻元素开始。'
 },s=>controls(field('raw','数组（2—12个整数，−999—999）',s.raw)+select('direction','排序方向',s.direction,[['asc','升序：左值 > 右值才交换'],['desc','降序：左值 < 右值才交换']])+btn('载入数组','load'))+
   (s.items?`<div class="ext-sort-array">${s.items.map((v,i)=>`<div class="${s.last.includes(i)?'active ':''}${s.done||i>=s.items.length-s.pass?'settled':''}"><b>${v.value}</b><small>原位置${v.origin}</small></div>`).join('')}</div>`+controls(btn('比较一次','step','',s.done?'disabled':'')+btn('完成当前一趟','pass','',s.done?'disabled':'')+btn('完成全部排序','all','',s.done?'disabled':''))+table(['已完成趟数','比较次数','交换次数'],[[s.pass,s.comparisons,s.swaps]]):'')+output(esc(s.message))+`<ol class="ext-step-log">${s.trace.slice(-12).map(t=>`<li>${esc(t)}</li>`).join('')}</ol>`+coach('采用从左往右扫描、每趟缩短右端范围、无交换即提前退出的版本。相等时不交换，重复值按原先相对顺序保留，因此这个实现稳定。原位置标签帮助核对相等元素，不参与大小比较。'),
 (s,a)=>{if(a==='load'){s.items=parseSort(s.raw);Object.assign(s,{pass:0,j:0,passSwaps:0,comparisons:0,swaps:0,done:false,last:[],trace:[]});s.message=s.items?'已载入，尚未比较。':'请输入2—12个−999到999的整数。';}if(a==='step')sortStep(s);if(a==='pass'&&s.items){const p=s.pass;while(!s.done&&s.pass===p)sortStep(s);}if(a==='all'&&s.items)while(!s.done)sortStep(s);},(s,k,v)=>{s[k]=v;s.items=null;s.trace=[];s.message='数组或方向已改变，请重新载入。';});
Object.assign(window.NOTE_LABS.dataMath ||= {}, {parseSort,sortStep});
})();
