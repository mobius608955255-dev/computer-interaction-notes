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
