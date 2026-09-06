/* Computed, task-specific models replacing text-only imitations. */
(() => {
'use strict';
const {register,registry,ui,clusteredChart,daysBetween}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
const area=(n,l,v)=>`<label>${l}<textarea data-field="${n}">${esc(v)}</textarea></label>`;
const studentRows=[['01','王宁','女',88],['02','李明','男',76],['03','赵敏','女',92],['04','周林','男',58]];
register(['merged-21'],'改查询条件，再运行SQL','在同一张学生表上选择字段、阈值和排序，结果只在执行后更新。',{min:80,sex:'全部',order:'DESC',fields:'姓名,成绩',result:null},s=>{
 const sql=`SELECT ${s.fields} FROM 学生 WHERE 成绩 >= ${Number(s.min)}${s.sex==='全部'?'':` AND 性别 = '${s.sex}'`} ORDER BY 成绩 ${s.order};`;
 return controls(field('min','最低成绩',s.min,'number')+select('sex','性别条件',s.sex,[['全部','全部'],['女','女'],['男','男']])+select('order','成绩排序',s.order,[['DESC','降序'],['ASC','升序']])+select('fields','投影字段',s.fields,[['姓名,成绩','姓名、成绩'],['学号,姓名,性别,成绩','全部四列']]))+`<pre class="lab-code">${esc(sql)}</pre>`+controls(btn('执行查询','run'))+table(['学号','姓名','性别','成绩'],studentRows)+(s.result?table(s.result.head,s.result.rows):output('等待执行。'));
},(s,a)=>{if(a==='run'){const rows=studentRows.filter(r=>r[3]>=Number(s.min)&&(s.sex==='全部'||r[2]===s.sex)).sort((a,b)=>(a[3]-b[3])*(s.order==='ASC'?1:-1));s.result={head:s.fields.split(','),rows:s.fields.startsWith('学号')?rows:rows.map(r=>[r[1],r[3]])};}});
const documents=[['物联网传感器',true],['物联网协议',true],['物联网医疗',true],['物联网应用',true],['物联网安全',true],['传感器网络',true],['智能设备联网',true],['嵌入式采集',true],['互联网新闻',false],['网络广告',false]];
register(['y2026q28'],'把查全率与查准率放回真实集合','选择检索范围，再点文献切换是否被检出；两项比率由集合重算。',{found:[0,1,2,3,4,8,9],mode:'metrics',expression:'standard',ordered:false,gap:1},s=>{
 const modes=controls(select('mode','检索场景',s.mode,[['metrics','查全率与查准率'],['boolean','布尔优先级'],['near','邻近与词序']]));
 if(s.mode==='boolean'){const rows=[['文献1',true,false,false],['文献2',false,true,true],['文献3',false,true,false],['文献4',true,true,true]];const hit=r=>s.expression==='standard'?r[1]||(r[2]&&r[3]):(r[1]||r[2])&&r[3];return modes+controls(select('expression','检索式',s.expression,[['standard','A OR B AND C'],['parentheses','(A OR B) AND C']]))+table(['文献','含A','含B','含C','是否检出'],rows.map(r=>[r[0],...r.slice(1).map(v=>v?'是':'否'),hit(r)?'✓ 检出':'未检出']))+output('本例采用教材常见NOT＞AND＞OR规则。无括号式先算B AND C；加括号后先算A OR B，文献1的去留随之改变。实际检索平台可能另定优先级。');}
 if(s.mode==='near'){const lines=['data science','science data','data and science','data can improve modern science'];const matched=text=>{const words=text.split(' '),a=words.indexOf('data'),b=words.indexOf('science');return Math.abs(a-b)-1<=Number(s.gap)&&(!s.ordered||a<b);};return modes+controls(select('ordered','词序规则',String(s.ordered),[['false','无序邻近'],['true','有序邻近：data在前']])+field('gap','允许的中间词数',s.gap,'number','min="0" max="3"'))+table(['示例文本','结果'],lines.map(text=>[text,matched(text)?'✓ 匹配':'不匹配']))+output('本例按两词中间的词数计距离。NEAR不必然禁止词序颠倒；实际语法、计数方法和有序参数以平台说明为准。');}
 const relevant=documents.filter(x=>x[1]).length,hits=s.found.filter(i=>documents[i][1]).length;
 return modes+controls(btn('精确词匹配','preset','exact')+btn('扩大检索','preset','broad')+btn('清空检出','preset','none'))+`<div class="lab-doc-set">${documents.map((d,i)=>btn(`${s.found.includes(i)?'✓ ':''}${d[0]} · ${d[1]?'相关':'不相关'}`,'toggle',i,`aria-pressed="${s.found.includes(i)}"`)).join('')}</div>`+table(['指标','计算','值'],[['查全率',`${hits}/${relevant}`,`${(hits/relevant*100).toFixed(1)}%`],['查准率',`${hits}/${s.found.length}`,s.found.length?`${(hits/s.found.length*100).toFixed(1)}%`:'未定义（尚无检出）']])+output('文献的相关性由这份示例资料集事先给定；扩大结果集不保证查准率一定下降，必须看新增文献是否相关。');
},(s,a,v)=>{if(a==='toggle'){const i=Number(v);s.found=s.found.includes(i)?s.found.filter(x=>x!==i):[...s.found,i];}if(a==='preset')s.found=v==='none'?[]:v==='exact'?[0,1,2,3,4]:documents.map((_,i)=>i);},(s,k,v)=>{s[k]=k==='ordered'?v==='true':k==='gap'?number(v,0,3):v;});
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
register(['y2025q2'],'字符的编码和字形是两件事','输入一个字符，再改变字体；码位与字节会显示，字形外观单独变化。',{char:'G',font:'serif',size:40},s=>{
 const c=[...s.char][0]||'',cp=c.codePointAt(0),bytes=c?Array.from(new TextEncoder().encode(c)):[];
 return controls(field('char','一个字符',s.char)+select('font','字体',s.font,[['serif','宋体风格'],['sans-serif','黑体风格'],['monospace','等宽']])+field('size','显示字号',s.size,'range','min="24" max="64"'))+`<div class="lab-glyph" style="font-family:${s.font};font-size:${s.size}px">${esc(c||'—')}</div>`+table(['表示','实际值'],[['Unicode码位',cp===undefined?'—':'U+'+cp.toString(16).toUpperCase().padStart(4,'0')],['UTF-8字节',bytes.map(x=>x.toString(16).toUpperCase().padStart(2,'0')).join(' ')||'—'],['标准ASCII',cp<128?`${cp} = ${cp.toString(16).toUpperCase()}H`:'不在7位ASCII范围内']])+output('字形改变不改变字符码位。这里显示UTF-8，不把Unicode码位或UTF-8字节称为GB2312机内码。GB2312双字节汉字机内码还须满足各自有效码位规则。');
},()=>{});
const sales=[['北斗科技','一季度',120],['北斗导航','二季度',80],['南方科技','一季度',90],['北斗科技','二季度',150]];
register(['y2026q50'],'文字包含条件与交叉条件如何求和','改公司名、季度和金额，观察SUMIF和SUMIFS各自选中了哪些行。',{mode:'single',keyword:'北斗',company:'北斗科技',quarter:'一季度',values:[120,80,90,150]},s=>{
 const hit=r=>s.mode==='single'?r[0].includes(s.keyword):r[0]===s.company&&r[1]===s.quarter;
 const formula=s.mode==='single'?`=SUMIF(A2:A5,"*${s.keyword.replace(/[~*?]/g,c=>'~'+c).replace(/"/g,'""')}*",C2:C5)`:`=SUMIFS(C2:C5,A2:A5,"${s.company}",B2:B5,"${s.quarter}")`;
 return controls(select('mode','求和任务',s.mode,[['single','公司名包含文字'],['multi','指定公司且指定季度']])+(s.mode==='single'?field('keyword','包含文字',s.keyword):select('company','公司',s.company,[...new Set(sales.map(r=>r[0]))].map(v=>[v,v]))+select('quarter','季度',s.quarter,[['一季度','一季度'],['二季度','二季度']])))+office('Excel','公式',`<code>${esc(formula)}</code>`,table(['A 公司','B 季度','C 金额'],sales.map((r,i)=>[`<span class="${hit(r)?'lab-highlight':''}">${r[0]}</span>`,r[1],field('value'+i,'第'+(i+2)+'行金额',s.values[i],'number')]))+output(`实际求和：${money(sales.reduce((sum,r,i)=>sum+(hit(r)?Number(s.values[i]):0),0))}`));
},()=>{},(s,k,v)=>{if(k.startsWith('value'))s.values[Number(k.slice(5))]=Number(v);else s[k]=v;});
register(['merged-10'],'复制公式，查看地址与排名怎样变化','在复制方向和锁定方式之间切换；相同分数也参与实际排名。',{mode:'ref',style:'mixed',dx:1,dy:1,order:'0',scores:[88,76,88,92],locked:true},s=>{
 const origin={relative:'B2',absolute:'$B$2',mixed:'$B2',row:'B$2'},lockCol=['absolute','mixed'].includes(s.style),lockRow=['absolute','row'].includes(s.style);
 const col=2+(lockCol?0:Number(s.dx)),row=2+(lockRow?0:Number(s.dy));
 const columnName=n=>{let text='';while(n>0){n--;text=String.fromCharCode(65+n%26)+text;n=Math.floor(n/26);}return text;};
 const valid=s.dx!==''&&s.dy!==''&&Number.isInteger(Number(s.dx))&&Number.isInteger(Number(s.dy)),address=!valid?'请输入整数位移':col<1||row<1||col>16384||row>1048576?'#REF!':`${lockCol?'$':''}${columnName(col)}${lockRow?'$':''}${row}`;
 return controls(select('mode','场景',s.mode,[['ref','复制引用'],['rank','RANK.EQ排名']]))+(s.mode==='ref'?controls(select('style','引用形式',s.style,Object.entries(origin))+field('dx','向右复制列数',s.dx,'number','step="1"')+field('dy','向下复制行数',s.dy,'number','step="1"'))+office('Excel','公式','',table(['原公式','复制后公式'],[[`=${origin[s.style]}`,`=${address}`]])):controls(select('locked','比较范围',String(s.locked),[['true','固定$B$2:$B$5'],['false','相对B2:B5']])+select('order','排名方向',s.order,[['0','0：降序'],['1','1：升序']]))+office('Excel','公式','',table(['行','分数 B','公式','名次'],s.scores.map((v,i)=>{const pool=(s.locked?s.scores:s.scores.slice(i)).filter(x=>x!==''&&Number.isFinite(Number(x))).map(Number),rank=v===''?'空白':1+pool.filter(x=>s.order==='0'?x>Number(v):x<Number(v)).length;return[i+2,field('score'+i,'第'+(i+2)+'行分数',v,'number'),`=RANK.EQ(B${i+2},${s.locked?'$B$2:$B$5':`B${i+2}:B${i+5}`},${s.order})`,rank];}))))+output(s.mode==='ref'?'$锁住它后面的行号或列标，复制方向决定未锁住部分的变化。':'88并列时获得相同名次，后续名次跳号；范围漂移会改变比较对象。仅向下填充时，B$2:B$5也可固定比较行。');
},()=>{},(s,k,v)=>{if(k.startsWith('score'))s.scores[Number(k.slice(5))]=v===''?'':Number(v);else s[k]=k==='locked'?v==='true':v;});
register(['y2020q59'],'切换行列，同时交换系列与横轴','原表不变，图例和柱的分组随着“切换行/列”重建。',{swapped:false},s=>{
 const data=[['一班',80,75,90],['二班',72,85,78],['三班',90,80,88],['四班',82,92,84]],colors=['#527eaa','#bc7750','#558777','#9b6694'];
 const labels=s.swapped?['数学','英语','计算机']:data.map(r=>r[0]);const series=s.swapped?data.map((r,i)=>({name:r[0],values:r.slice(1),color:colors[i]})):['数学','英语','计算机'].map((name,i)=>({name,values:data.map(r=>r[i+1]),color:colors[i]}));
 return office('Excel','图表工具 · 设计',btn('切换行/列','switch'),clusteredChart(labels,series)+table(['班级','数学','英语','计算机'],data))+output(`横轴是${s.swapped?'课程':'班级'}；图例是${series.map(x=>x.name).join('、')}。数据值本身没有被交换或改写。`);
},s=>{s.swapped=!s.swapped;});
const filterRows=[['王宁','女',88],['李明','男',76],['赵敏','女',58],['周林','男',92]];
// Two consecutive filters, with a copied intermediate table that remains independent.
const scholarshipRows=[
 ['王宁',92,94,90,93,91],['李明',99,98,97,96,74],['赵敏',88,89,90,91,92],['周林',87,88,86,89,85],
 ['陈晨',84,85,86,83,82],['刘悦',80,81,82,83,84],['孙宁',78,79,80,81,82],['吴林',76,77,78,79,80]
];
const scholarshipTotal=row=>row.slice(1).reduce((a,b)=>a+b,0);
const scholarshipTop=rows=>{const totals=rows.map(scholarshipTotal).sort((a,b)=>b-a),cut=totals[Math.max(0,Math.ceil(rows.length*.25)-1)];return rows.filter(r=>scholarshipTotal(r)>=cut);};
const scholarshipTable=rows=>table(['姓名','课程1','课程2','课程3','课程4','课程5','总分'],rows.map(r=>[...r,scholarshipTotal(r)]));
function renderScholarship(s){
 const rows=s.top?scholarshipTop(scholarshipRows):scholarshipRows;
 return office('Excel','数据',btn('总分 ▾ → 数字筛选 → 前10项…','rankOpen')+btn('复制可见记录到奖学金表','rankCopy','',s.top?'':'disabled')+btn('清除源表筛选','rankClear'),
   (s.rankPane?dialog('前10个自动筛选','<p>显示：前／25／百分比</p><p>按总分排名人数比例筛选，不是总分乘以25%。</p>',btn('确定','rankApply')+btn('取消','rankCancel')):'')+
   '<h4>原始成绩表 · 8条示例记录</h4>'+scholarshipTable(rows)+
   (s.copy?'<h4>奖学金表 · 已复制的前25%记录</h4>'+controls(btn('高级…','subjectsOpen')+btn('清除奖学金表条件','subjectsClear'))+
     (s.subjectsPane?dialog('高级筛选 · 五科门槛', '<p>列表区域为已复制的奖学金表；五科条件放在同一行。</p>'+table(['课程1','课程2','课程3','课程4','课程5'],[['&gt;=75','&gt;=75','&gt;=75','&gt;=75','&gt;=75']]),btn('确定','subjectsApply')+btn('取消','subjectsCancel')):'')+
     scholarshipTable(s.filtered?s.copy.filter(r=>r.slice(1).every(v=>v>=75)):s.copy):''))+output(s.message||'先筛总分前25%，再筛五科均不低于75分。课程名称和数据为缩小后的示例。');
}
function actScholarship(s,a){
 if(a==='rankOpen')s.rankPane=true;
 if(a==='rankCancel')s.rankPane=false;
 if(a==='rankApply'){s.top=true;s.rankPane=false;s.message='8人取总分最高2人；如边界分数并列，会全部保留。先复制可见记录。';}
 if(a==='rankCopy'&&s.top){s.copy=structuredClone(scholarshipTop(scholarshipRows));s.filtered=false;s.subjectsPane=false;s.message='已复制前25%的2人；其中一人课程5为74分，尚不满足奖学金的全部条件。';}
 if(a==='rankClear'){s.top=false;s.message='源表8条记录恢复；奖学金表中的已复制记录保持不变。';}
 if(a==='subjectsOpen'&&s.copy)s.subjectsPane=true;
 if(a==='subjectsCancel')s.subjectsPane=false;
 if(a==='subjectsApply'&&s.copy){s.filtered=true;s.subjectsPane=false;s.message='两层条件取交集：先满足总分排名，再要求五科均≥75。高级筛选仅隐藏未达标记录。';}
 if(a==='subjectsClear'){s.filtered=false;s.message='奖学金表恢复已复制的前25%记录；不会变回源表全部8人。';}
}

register(['y2020q9','y2026q51'],'设置条件区，再观察高级筛选和清除','条件同一行是AND、不同行是OR；输出可留在原处或复制到旁表。',{scenario:'logic',scholarship:{top:false,copy:null,filtered:false,rankPane:false,subjectsPane:false},mode:'advanced',autoEnabled:true,logic:'and',destination:'inplace',threshold:80,filtered:false,copy:null,applied:{logic:'and',threshold:80}},s=>{
 const scenario=controls(select('scenario','真题场景',s.scenario,[['logic','条件区AND / OR'],['scholarship','奖学金：前25%再筛五科']]));
 if(s.scenario==='scholarship')return scenario+renderScholarship(s.scholarship);
 const hit=r=>s.logic==='and'?r[1]==='女'&&r[2]>=Number(s.threshold):r[1]==='女'||r[2]>=Number(s.threshold);
 const active=r=>s.applied.logic==='and'?r[1]==='女'&&r[2]>=Number(s.applied.threshold):r[1]==='女'||r[2]>=Number(s.applied.threshold);const shown=s.filtered?filterRows.filter(active):filterRows;
 return scenario+controls(select('mode','筛选方式',s.mode,[['advanced','高级筛选'],['auto','自动筛选']]))+office('Excel','数据',(s.mode==='advanced'?btn('高级…','open'):btn(s.autoEnabled?'筛选：开':'筛选：关','toggleAuto'))+btn('清除','clear'),`${s.pane?dialog('高级筛选',select('logic','条件行关系',s.logic,[['and','同一行：女 且 成绩达标'],['or','不同行：女 或 成绩达标']])+field('threshold','最低成绩',s.threshold,'number')+select('destination','方式',s.destination,[['inplace','在原有区域显示'],['copy','复制到其他位置']])+table(['性别','成绩'],s.logic==='and'?[['女','>='+s.threshold]]:[['女',''],['','>='+s.threshold]]),btn('确定','apply')+btn('取消','cancel')):''}${s.mode==='auto'&&s.autoEnabled?controls(btn('性别筛选：女','auto')):''}${table(['姓名',`性别${s.mode==='auto'&&s.autoEnabled?' ▾':''}`,'成绩'],shown)}${s.copy?'<h4>复制出的结果</h4>'+table(['姓名','性别','成绩'],s.copy):''}`)+output(s.message||'未隐藏任何原始记录。');
},(s,a)=>{if(s.scenario==='scholarship'){actScholarship(s.scholarship,a);return;}if(a==='open')s.pane=true;if(a==='cancel')s.pane=false;if(a==='apply'){const hit=r=>s.logic==='and'?r[1]==='女'&&r[2]>=Number(s.threshold):r[1]==='女'||r[2]>=Number(s.threshold);if(s.destination==='inplace'){s.filtered=true;s.applied={logic:s.logic,threshold:s.threshold};}else s.copy=filterRows.filter(hit);s.pane=false;s.message=s.destination==='inplace'?'原位置仅显示匹配记录；清除可恢复。':'旁表是独立结果副本；源记录保持显示。';}if(a==='clear'){s.filtered=false;s.message='原区域已恢复全部记录；已复制的结果副本不被自动删除。';}if(a==='toggleAuto'){s.autoEnabled=!s.autoEnabled;if(!s.autoEnabled)s.filtered=false;s.message=s.autoEnabled?'已显示筛选下拉入口。':'已关闭自动筛选，全部记录恢复，下拉入口移除。';}if(a==='auto'&&s.autoEnabled){s.logic='and';s.threshold=0;s.applied={logic:'and',threshold:0};s.filtered=true;s.message='自动筛选只显示性别为女的记录，清除后下拉入口仍在。';}},(s,k,v)=>{s[k]=v;if(k==='mode'){s.filtered=false;s.copy=null;s.pane=false;}});
register(['y2025q52'],'跨表按编号查找，再给整行设置条件格式','调换历史记录的顺序，或修改当前编号，验证查找依赖键而不是行号。',{
 mode:'lookup',ids:['A01','A02','A03'],old:[['A02',85],['A03',95],['A01',90]],values:[110,80,95],starts:['2024-03-01','2024-03-02','2024-03-03'],ends:['2024-03-10','2024-03-07','2024-03-12'],lockedRow:false,full:true
},s=>{
 const lookup=id=>s.old.find(r=>r[0].toLowerCase()===id.toLowerCase())?.[1];
 const hit=i=>{const j=s.lockedRow?0:i,old=lookup(s.ids[j]);return s.mode==='lookup'?old!==undefined&&s.values[j]>old:daysBetween(s.starts[j],s.ends[j])>7;};
 const formula=s.mode==='lookup'?`=$D${s.lockedRow?'$':''}3>VLOOKUP($A${s.lockedRow?'$':''}3,'2023'!$A$2:$C$4,3,0)`:`=$C${s.lockedRow?'$':''}3-$B${s.lockedRow?'$':''}3>7`;
 const rows=s.ids.map((id,i)=>`<tr class="${s.full&&hit(i)?'lab-row-emphasis':''}"><td>${field('id'+i,'第'+(i+3)+'行编号',id)}</td><td>${s.mode==='lookup'?'景区':field('start'+i,'开始日期',s.starts[i],'date')}</td>${s.mode==='lookup'?'<td>示例记录</td>':''}<td class="${!s.full&&hit(i)?'lab-row-emphasis':''}">${s.mode==='lookup'?field('value'+i,'当前值',s.values[i],'number'):field('end'+i,'完成日期',s.ends[i],'date')}</td></tr>`).join('');
 return controls(select('mode','判断任务',s.mode,[['lookup','超过历史年度值'],['date','日期相差超过7天']])+select('lockedRow','引用行',String(s.lockedRow),[['false','随行变化'],['true','错误地锁在首行']])+select('full','应用范围',String(s.full),[['true','完整数据行'],['false','仅判断数值列']]))+
  office('Excel','开始 · 条件格式',`<code>${esc(formula)}</code>`,`<div class="lab-table-scroll"><table><thead><tr><th>A 编号</th><th>B ${s.mode==='lookup'?'项目':'开始日期'}</th>${s.mode==='lookup'?'<th>C 说明</th>':''}<th>${s.mode==='lookup'?'D 当前值':'C 完成日期'}</th></tr></thead><tbody>${rows}</tbody></table></div>`)+
  (s.mode==='lookup'?controls(btn('调换历史表顺序','reorder'))+table(['2023表 A 编号','B 名称','C 历史值'],s.old.map(r=>[r[0],'景区',r[1]]))+table(['当前编号','实际查回的历史值'],s.ids.map(id=>[esc(id),lookup(id)??'#N/A'])):'')+
  output('精确匹配按编号定位；历史表排序不改变查回值。找不到编号时返回#N/A，本规则不着色。严格大于才符合，相等不符合。');
},(s,a)=>{if(a==='reorder')s.old.reverse();},(s,k,v)=>{
 if(k.startsWith('value'))s.values[Number(k.slice(5))]=Number(v);
 else if(k.startsWith('id'))s.ids[Number(k.slice(2))]=v;
 else if(k.startsWith('start'))s.starts[Number(k.slice(5))]=v;
 else if(k.startsWith('end'))s.ends[Number(k.slice(3))]=v;
 else s[k]=['full','lockedRow'].includes(k)?v==='true':v;
});

register(['y2025q50'],'从日期取月份，再真正向下填充','在E3输入公式，拖动右下角填充柄，逐行读取B列日期。',{dates:['2024-03-15','2024-06-20','2024-11-08'],filled:0,formula:'=MONTH(B3)&"月"'},s=>
 controls(field('formula','E3公式',s.formula)+btn('键盘辅助：向下填充','fill'))+office('Excel','公式','<span>选中E3，将填充柄向下拖</span>',table(['行','B 日期','E 月份'],s.dates.map((v,i)=>{const valid=/^=MONTH\(B3\)&"月"$/i.test(s.formula.trim()),month=v?Number(v.slice(5,7))+'月':'日期为空';return[i+3,field('date'+i,'第'+(i+3)+'行日期',v,'date'),`<div class="lab-lookup-cell" data-fill-index="${i}">${i<=s.filled?(valid?month:'请检查公式'):'—'}<small>${i<=s.filled?esc(s.formula.replace(/B3/gi,'B'+(i+3))):''}</small>${i===0?'<button class="lab-fill-handle" data-lab-drag="fill" aria-label="向下拖动月份填充柄"></button>':''}</div>`];})))+output('MONTH返回1—12的数值，&"月"把它连接成文本。B3是相对引用，下拉后变为B4、B5。'),
 (s,a)=>{if(a==='fill')s.filled=2;},(s,k,v)=>{if(k.startsWith('date'))s.dates[Number(k.slice(4))]=v;else{s.formula=v;s.filled=0;}});
register(['y2022q24'],'拖标尺，区分首行、悬挂、左右缩进','抓住不同标记拖动；方块连同两个左侧标记一起移动。',{first:12,rest:0,right:100,margin:8},s=>{
 const handle=(k,label,pos,shape)=>`<button class="lab-ruler-handle ${shape}" data-lab-drag="ruler" data-key="${k}" style="left:${pos}%" role="slider" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pos}">${shape==='square'?'■':'▼'}</button>`;
 return controls(field('margin','学习调节器：左右页边距（相对单位）',s.margin,'range','min="4" max="16"'))+office('Word','视图','<span>☑ 标尺</span>',`<div class="lab-ruler-page" style="padding-inline:${s.margin}%"><div class="lab-ruler" data-ruler>${Array.from({length:11},(_,i)=>`<span>${i}</span>`).join('')}${handle('first','首行缩进',s.first,'upper')}${handle('rest','悬挂缩进',s.rest,'lower')}${handle('both','左缩进',s.rest,'square')}${handle('right','右缩进边界',s.right,'upper')}</div><div class="lab-indent-area"><p style="margin-left:${s.rest}%;margin-right:${100-s.right}%;text-indent:${s.first-s.rest}cqw">首行缩进控制第一行起点。悬挂缩进控制其余行起点。拖动方块会把两个左侧标记一起移动，保持两者之间的距离。右侧标记限制段落右边界，页边距则限定整页可排版区域。</p></div></div>`)+output(`第一行起点 ${s.first.toFixed(0)}；其余行起点 ${s.rest.toFixed(0)}；右边界 ${s.right.toFixed(0)}。刻度为比例示意。`);
},()=>{});
register(['y2026q47'],'只改一种间距，观察对应字符边界','数字和西文字母分别受两个选项控制；实际换行由当前版面计算。',{numbers:true,latin:true,pn:true,pl:true,pane:false},s=>{
 const text='泰山石经历10亿年到20亿年的形成过程，其中约13亿年的地质变化留下了记录。这里另加Word示例用于对照。';
 const html=[...text].map((c,i,a)=>{const han=x=>/[\u4e00-\u9fff]/.test(x||''),num=x=>/[0-9]/.test(x||''),latin=x=>/[A-Za-z]/.test(x||'');const gap=(s.numbers&&(han(a[i-1])&&num(c)||num(a[i-1])&&han(c)))||(s.latin&&(han(a[i-1])&&latin(c)||latin(a[i-1])&&han(c)));return `<span style="${gap?'margin-left:.24em':''}">${esc(c)}</span>`;}).join('');
 return office('Word','开始 · 段落',btn('段落对话框 ↘','open'),`${s.pane?dialog('段落 · 中文版式',`<label><input data-field="pn" type="checkbox" ${s.pn?'checked':''}>自动调整中文与数字的间距</label><label><input data-field="pl" type="checkbox" ${s.pl?'checked':''}>自动调整中文与西文的间距</label>`,btn('确定','apply')+btn('取消','cancel')):''}${paper(`<p class="lab-cjk-text">${html}</p>`)}`)+output(`中文与数字：${s.numbers?'开':'关'}；中文与西文：${s.latin?'开':'关'}。改变数字选项不会改变“Word”的两侧自动间距。`);
},(s,a)=>{if(a==='open'){s.pane=true;s.pn=s.numbers;s.pl=s.latin;}if(a==='apply'){s.numbers=s.pn;s.latin=s.pl;s.pane=false;}if(a==='cancel')s.pane=false;});
register(['y2024q54'],'设置页眉段落的下边框','进入页眉后调整颜色、线宽和应用范围，比较段落边框与文字边框。',{
 editing:false,border:true,menu:false,color:'#555555',width:1,style:'solid',scope:'paragraph',draft:null
},s=>{
 const settings=s.draft||s;
 const border=s.border?`${s.width}pt ${s.style} ${s.color}`:'none';
 return office('Word',s.editing?'开始':'插入',s.editing?btn('段落 · 边框和底纹…','menu'):btn('页眉 → 编辑页眉','edit'),
  (s.menu?dialog('边框和底纹 · 边框',select('color','颜色',settings.color,[['#555555','灰黑'],['#2563a0','蓝色'],['#c03535','红色']])+select('width','宽度（磅）',settings.width,[[.5,'0.5'],[1,'1'],[2.25,'2.25'],[3,'3']])+select('style','线型',settings.style,[['solid','实线'],['dashed','虚线'],['double','双线']])+select('scope','应用于',settings.scope,[['paragraph','段落'],['text','文字']])+btn('无框线','none')+btn('下框线','bottom'),btn('确定','apply')+btn('取消','close')):'')+
  paper(`<div class="lab-page-header" style="border-bottom:${s.scope==='paragraph'?border:'none'};padding-bottom:8px"><span style="border-bottom:${s.scope==='text'?border:'none'}">资料汇编 · 页眉</span></div><p>正文与页眉分开编辑。段落边框铺到段落边界，文字边框只围住所选文字。</p>`))+
  output(s.editing?'原题要求改变页眉横线，应设置段落下边框的颜色和宽度。删除页眉文字不必然删除这条线。':'先进入页眉编辑状态。');
},(s,a)=>{
 if(a==='edit')s.editing=true;
 if(a==='menu'&&s.editing){s.draft={color:s.color,width:s.width,style:s.style,scope:s.scope,border:s.border};s.menu=true;}
 if(a==='none'&&s.draft)s.draft.border=false;
 if(a==='bottom'&&s.draft)s.draft.border=true;
 if(a==='apply'&&s.draft){Object.assign(s,s.draft);s.menu=false;s.draft=null;}
 if(a==='close'){s.menu=false;s.draft=null;}
},(s,k,v)=>{if(s.draft)s.draft[k]=k==='width'?Number(v):v;});

register(['y2023q7'],'插入有结构的公式对象','编辑分数或根式，再切换专业显示、线性显示和内嵌位置。',{
 exists:false,kind:'fraction',numerator:'a+b',denominator:'c',radicand:'x+1',display:'professional',position:'inline',saved:null
},s=>{
 const structure=s.kind==='fraction'?`<mfrac><mtext>${esc(s.numerator)}</mtext><mtext>${esc(s.denominator)}</mtext></mfrac>`:`<msqrt><mtext>${esc(s.radicand)}</mtext></msqrt>`;
 const linear=s.kind==='fraction'?`(${s.numerator})/(${s.denominator})`:`sqrt(${s.radicand})`;
 const equation=`<span class="lab-equation" style="display:${s.position==='display'?'block':'inline-block'};text-align:center;padding:14px;border:1px solid #af92bb">${s.display==='professional'?`<math xmlns="http://www.w3.org/1998/Math/MathML" display="${s.position==='display'?'block':'inline'}">${structure}</math>`:esc(linear)}</span>`;
 return office('Word',s.exists?'公式工具 · 设计':'插入',btn('公式 → 插入新公式','insert')+(s.exists?select('kind','结构',s.kind,[['fraction','分数'],['root','根式']])+select('display','显示形式',s.display,[['professional','专业'],['linear','线性']])+select('position','公式位置',s.position,[['inline','内嵌'],['display','独立显示']])+btn('保存到公式库','save')+btn('删除公式','delete'):'')+(s.saved?btn('插入已保存公式','restore'):''),paper(`<p>公式示例：${s.exists?equation:'光标位于正文。'} 后续说明文字。</p>`))+
  (s.exists?controls(s.kind==='fraction'?field('numerator','分子',s.numerator)+field('denominator','分母',s.denominator):field('radicand','被开方项',s.radicand)):'')+
  output('这里的分子、分母和根式是独立结构；专业与线性形式保存同一内容。内嵌公式随正文行排列，独立显示公式单占一行。');
},(s,a)=>{
 if(a==='insert')s.exists=true;
 if(a==='delete')s.exists=false;
 if(a==='save'&&s.exists)s.saved={kind:s.kind,numerator:s.numerator,denominator:s.denominator,radicand:s.radicand,display:s.display,position:s.position};
 if(a==='restore'&&s.saved){Object.assign(s,s.saved);s.exists=true;}
});

register(['y2023q35'],'跨页音频与留在本页的视频分别播放','分别启动音频、视频，再切到另一页查看各自状态。',{cross:true,loop:false,rewind:false,page:1,audio:{playing:false,time:0},video:{playing:false,time:0}},s=>
 office('PowerPoint','音频工具 · 播放',select('cross','跨幻灯片播放',String(s.cross),[['true','启用'],['false','关闭']])+select('loop','循环播放直到停止',String(s.loop),[['false','关闭'],['true','启用']])+select('rewind','播完返回开头',String(s.rewind),[['false','关闭'],['true','启用']]),`<div class="lab-slide"><h3>第${s.page}页</h3>${s.page===1?`<div class="lab-video-frame">视频：${s.video.playing?'播放':'停止'} ${s.video.time}/20秒</div>`:'<p>此页没有视频对象。</p>'}<p>音频：${s.audio.playing?'播放':'停止'} ${s.audio.time}/20秒</p></div>`)+controls(btn('播放音频','audio')+btn('播放视频','video','',s.page===1?'':'disabled')+btn('推进5秒（学习控制）','tick')+btn('下一页','next')+btn('返回第1页','first'))+output('音频的跨页、循环、返回开头是三个独立设置；换页后的视频不会自动继续或在返回时自动重播。'),
 (s,a)=>{if(a==='audio'){s.audio.playing=true;if(s.audio.time===20)s.audio.time=0;}if(a==='video'&&s.page===1){s.video.playing=true;if(s.video.time===20)s.video.time=0;}if(a==='tick'){for(const k of ['audio','video']){const m=s[k];if(!m.playing)continue;m.time+=5;if(m.time>=20){if(k==='audio'&&s.loop)m.time=0;else{m.playing=false;m.time=k==='audio'&&s.rewind?0:20;}}}}if(a==='next'||a==='first'){s.page=a==='first'?1:s.page%3+1;s.video.playing=false;s.video.time=0;if(!s.cross){s.audio.playing=false;s.audio.time=0;}}},(s,k,v)=>{s[k]=v==='true';});
register(['y2025q51'],'表格排序后，折线图跟着数据顺序改变','按客流量升降序排列完整记录，对照横轴与折线的位置。',{order:'original'},s=>{
 const data=[['景区A',3261],['景区B',2311],['景区C',3261]],rows=s.order==='original'?data:[...data].sort((a,b)=>(a[1]-b[1])*(s.order==='asc'?1:-1));
 const points=rows.map((r,i)=>`${70+i*150},${220-r[1]/4000*160}`).join(' ');
 return office('Excel','数据',btn('客流量升序','sort','asc')+btn('客流量降序','sort','desc')+btn('恢复示例顺序','sort','original'),table(['A 景区','D 客流量'],rows)+`<svg class="lab-data-chart" viewBox="0 0 460 270" aria-label="客流量折线图"><polyline points="${points}" fill="none" stroke="#527eaa" stroke-width="3"/>${rows.map((r,i)=>`<circle cx="${70+i*150}" cy="${220-r[1]/4000*160}" r="5" fill="#527eaa"/><text x="${70+i*150}" y="245" text-anchor="middle">${r[0]}</text><text x="${70+i*150}" y="${205-r[1]/4000*160}" text-anchor="middle">${r[1]}</text>`).join('')}</svg>`)+output('排序改变完整记录顺序，图表横轴随源区域同步更新；套用颜色本身不会改变数值顺序。');
},(s,a,v)=>{s.order=v;});
const launchData=[['2021',55,115,.964],['2022',64,182,.969],['2023',67,221,.985]];
function launchChart(s){
 const legend=s.legend==='none'?'':`<p class="study-chart-legend">蓝色：发射次数<br>橙色：成功率</p>`;
 const svg=`<svg class="lab-data-chart" viewBox="0 0 500 340" role="img" aria-label="发射次数与成功率组合图">
  ${s.showTitle?`<text x="250" y="25" text-anchor="middle" data-chart-title>${esc(s.title)}</text>`:''}
  <text x="30" y="55">次数</text>${s.secondaryApplied?'<text x="415" y="55">成功率%</text>':''}
  <path d="M60 65V270H405${s.secondaryApplied?'V65':''}" fill="none" stroke="#74877f"/>
  ${[0,20,40,60,80].map(v=>`<text x="50" y="${275-v*2.5}" text-anchor="end">${v}</text>`).join('')}
  ${s.secondaryApplied?[0,25,50,75,100].map(v=>`<text x="412" y="${275-v*2}">${v}%</text>`).join(''):''}
  ${launchData.map((r,i)=>`<rect x="${85+i*110}" y="${270-r[1]*2.5}" width="42" height="${r[1]*2.5}" fill="#527eaa"/><text x="${111+i*110}" y="293" text-anchor="middle">${r[0]}</text>`).join('')}
  ${s.combo?`<polyline points="${launchData.map((r,i)=>`${111+i*110},${270-r[3]*(s.secondaryApplied?200:2.5)}`).join(' ')}" stroke="#be704e" fill="none" stroke-width="3"/>`:launchData.map((r,i)=>`<rect x="${130+i*110}" y="${270-r[3]*2.5}" width="24" height="${r[3]*2.5}" fill="#be704e"/>`).join('')}
  ${s.axes?`<text x="250" y="326" text-anchor="middle" data-axis-title="horizontal">${esc(s.xTitle)}</text><text transform="translate(16 170) rotate(-90)" text-anchor="middle" data-axis-title="vertical">${esc(s.yTitle)}</text>`:''}
 </svg>`;
 return `<div class="lab-table-scroll" tabindex="0" aria-label="组合图，可横向滚动"><div data-chart-legend="${s.legend}" style="min-width:420px;display:grid;grid-template-columns:${s.legend==='right'?'minmax(0,1fr) 100px':'minmax(0,1fr)'};align-items:center">${svg}${legend}</div></div>`;
}
register(['y2026q52'],'按住Ctrl加选，再建立双轴组合图','先选A:B，再按住Ctrl点击D；设置组合图后补齐标题、轴标题与图例。',{
 cols:[],ctrl:false,created:false,combo:false,secondary:false,secondaryApplied:false,axes:false,elements:false,showTitle:true,title:'图表标题',xTitle:'年份',yTitle:'发射次数',legend:'bottom'
},s=>{
 const commands=s.created?btn('更改图表类型 → 组合','combo')+btn('添加图表元素…','elements'):btn('插入图表','insert');
 const elements=s.elements?dialog('添加图表元素',`<label><input type="checkbox" data-field="showTitle" ${s.showTitle?'checked':''}>图表标题</label>`+field('title','标题文字',s.title)+`<label><input type="checkbox" data-field="axes" ${s.axes?'checked':''}>坐标轴标题</label>`+field('xTitle','主要横坐标轴标题',s.xTitle)+field('yTitle','主要纵坐标轴标题',s.yTitle)+select('legend','图例位置',s.legend,[['bottom','底部'],['right','右侧'],['none','无']]),btn('关闭','elementsClose')):'';
 return controls(`<label><input type="checkbox" data-field="ctrl" ${s.ctrl?'checked':''}>触屏辅助：保持Ctrl</label>`)+office('Excel',s.created?'图表工具 · 设计':'插入',commands,
  table([btn('A 年份','ab'),btn('B 发射次数','ab'),'C 新增卫星数',btn('D 成功率','d')],launchData.map(r=>r.map((v,i)=>`<span class="${s.cols.includes(i)?'lab-selected':''}">${i===3?(v*100).toFixed(1)+'%':v}</span>`)))+
  (s.pane?dialog('更改图表类型 · 组合','<p>发射次数：簇状柱形图；成功率：折线图</p>'+`<label><input type="checkbox" data-field="secondary" ${s.secondary?'checked':''}>成功率使用次坐标轴</label>`,btn('确定','apply')+btn('取消','cancel')):'')+elements+(s.created?launchChart(s):''))+output(s.message||'本卡使用3条示例记录缩小原区域；选择A:B后加选D，跳过C。');
},(s,a)=>{
 if(a==='ab')s.cols=[0,1];
 if(a==='d')s.cols=s.ctrl||s._ctrl?[...new Set([...s.cols,3])]:[3];
 if(a==='insert'){if(![0,1,3].every(i=>s.cols.includes(i))){s.message='当前选择缺少年份、次数或成功率；按住Ctrl加选D列。';return;}s.created=true;s.message='已插入图表；进入图表工具设计设置组合类型。';}
 if(a==='combo'){s.secondary=s.secondaryApplied;s.pane=true;s.elements=false;}
 if(a==='cancel'){s.secondary=s.secondaryApplied;s.pane=false;s.message='取消了本次设置，原图表保留。';}
 if(a==='apply'){s.combo=true;s.secondaryApplied=s.secondary;s.pane=false;s.message=s.secondary?'成功率用右侧百分比轴，次数用左侧数量轴。':'两个量纲共用次数轴，0—1的成功率被压在底部；应把成功率设为次轴。';}
 if(a==='elements'){s.elements=!s.elements;s.pane=false;}
 if(a==='elementsClose')s.elements=false;
});
register(['y2026q54'],'从正确入口处理溢出的占位符文字','比较缩小文字、扩大形状与拆分幻灯片；留意哪些操作改变边界。',{menu:false,format:false,mode:'none',page:1},s=>
 office('PowerPoint','开始',btn('右击占位符 → 设置形状格式…','format'),
  `<div class="lab-slide"><div class="lab-placeholder ${s.mode==='shape'?'grow':''}" style="font-size:${s.mode==='shrink'?'16':'24'}px">${s.mode==='split'?(s.page===1?'<p>研究背景</p>':'<p>数据来源与分析过程</p><p>结果讨论与后续计划</p>'):'<p>研究背景</p><p>数据来源与分析过程</p><p>结果讨论与后续计划</p>'}${btn('↕','menu','','class="lab-autofit" aria-label="自动调整选项"')}</div>${s.menu?`<div class="lab-context-menu" role="group" aria-label="占位符自动调整选项">${btn('根据占位符自动调整文本','shrink')}${btn('停止根据占位符调整文本','none')}${btn('拆分为两张幻灯片','split')}</div>`:''}</div>`+
  (s.format?dialog('设置形状格式 → 文本选项 → 文本框','<p>调整形状大小以适应文字会扩大占位符，不能满足原题“不改变占位符大小”的要求。</p>',btn('调整形状大小以适应文字','shape')+btn('关闭','formatClose')):''))+
 controls(s.mode==='split'?btn('第1页','page','1')+btn('第2页','page','2'):'')+output(s.mode==='split'?'溢出内容移到新的第2页，可分别查看。':s.mode==='shrink'?'占位符边界不变，文字字号缩小。':s.mode==='shape'?'文字字号保留，占位符高度增加。':'文字可能超出占位符。点左下角自动调整入口选择处理方式。'),
 (s,a,v)=>{if(a==='menu'){s.menu=!s.menu;s.format=false;}else if(a==='format'){s.format=true;s.menu=false;}else if(a==='formatClose')s.format=false;else if(a==='page')s.page=Number(v);else if(['shrink','none','shape','split'].includes(a)){s.mode=a;s.menu=s.format=false;s.page=1;}});
register(['y2025q10'],'组织节，再放映并用画笔标注','编辑节会改变缩略图分组；放映时可黑屏和真正按住画笔拖动。',{sections:[{name:'第一部分',slides:[0,1],closed:false},{name:'第二部分',slides:[2],closed:false}],selected:0,selection:'page',tab:'home',transitions:['none','none','none'],transition:'none',page:0,name:'第一部分',show:false,black:false,pen:false,color:'#cb443c',strokes:[]},s=>
 controls((s.show?'':select('tab','功能区位置',s.tab,[['home','开始'],['transition','切换']]))+select('color','画笔颜色',s.color,[['#cb443c','红色'],['#2563a0','蓝色']]))+office('PowerPoint',s.show?'幻灯片放映':s.tab==='transition'?'切换':'开始',s.show?'':(s.tab==='home'?btn('节 → 重命名节','rename')+btn('节 → 添加节','new'):select('transition','切换效果',s.transition,[['none','无'],['fade','淡化'],['push','推进']])+btn('全部应用','transitionAll'))+btn('开始放映','show'),`<div class="lab-deck"><aside>${s.sections.map((g,i)=>`<section>${btn(g.closed?'▸':'▾','collapseSection',i,`aria-label="${g.closed?'展开':'折叠'}${esc(g.name)}" aria-expanded="${!g.closed}"`)}${btn(esc(g.name),'section',i,`aria-pressed="${s.selection==='section'&&s.selected===i}"`)}${g.closed?'':g.slides.map(n=>btn(`幻灯片${n+1} · ${{none:'无',fade:'淡化',push:'推进'}[s.transitions[n]]}`,'page',n,`aria-pressed="${s.selection==='section'?s.selected===i:s.page===n}"`)).join('')}</section>`).join('')}</aside><div class="lab-slide lab-ink-slide" ${s.show&&s.pen&&!s.black?'data-lab-drag="ink"':''} style="background:${s.show&&s.black?'#111':'#fff'}">${s.show&&s.black?'':`<h3>幻灯片${s.page+1}</h3><p>${['问题背景','研究方法','结果总结'][s.page]}</p>`}<svg class="lab-ink-layer" viewBox="0 0 100 100" preserveAspectRatio="none">${(s.show&&s.black?[]:s.strokes.filter(x=>x.page===s.page)).map(x=>`<polyline points="${x.points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${x.color}" stroke-width=".7"/>`).join('')}</svg></div></div>${s.renaming?dialog('重命名节',field('name','节名称',s.name),btn('重命名','apply')+btn('取消','cancel')):''}`)+controls(s.show?btn('B · 黑屏/恢复','black')+btn(s.pen?'关闭画笔':'启用画笔','pen')+btn('下一页','next')+btn('结束放映','end'):'')+output('节标题选择该节全部页，旁边三角只负责折叠。在切换选项卡选择效果即应用于选区：选单页改该页，选节改整节；全部应用改整份演示稿。画笔在放映且启用时留下笔迹。'),
 (s,a,v)=>{if(a==='section'){s.selected=Number(v);s.selection='section';s.page=s.sections[s.selected].slides[0];s.transition=s.transitions[s.page];}if(a==='collapseSection')s.sections[Number(v)].closed=!s.sections[Number(v)].closed;if(a==='transitionAll')s.transitions=s.transitions.map(()=>s.transition);if(a==='page'){s.selection='page';s.page=Number(v);s.transition=s.transitions[s.page];s.selected=s.sections.findIndex(g=>g.slides.includes(s.page));}if(a==='rename'){s.name=s.sections[s.selected].name;s.renaming=true;}if(a==='apply'){s.sections[s.selected].name=s.name||'未命名节';s.renaming=false;}if(a==='cancel')s.renaming=false;if(a==='new'){const idx=s.sections.findIndex(g=>g.slides.includes(s.page)),g=s.sections[idx],at=g.slides.indexOf(s.page);const tail=g.slides.splice(at);s.sections.splice(idx+1,0,{name:'新节',slides:tail,closed:false});s.sections=s.sections.filter(g=>g.slides.length);s.selected=s.sections.findIndex(g=>g.slides.includes(s.page));}if(a==='show')s.show=true;if(a==='black')s.black=!s.black;if(a==='pen')s.pen=!s.pen;if(a==='next')s.page=(s.page+1)%3;if(a==='end'){s.show=false;s.black=false;s.pen=false;}},(s,k,v)=>{s[k]=v;if(k==='transition'){const pages=s.selection==='section'?s.sections[s.selected].slides:[s.page];pages.forEach(n=>s.transitions[n]=v);}});
registry.y2025q10.gesture=(s,g)=>{if(g.kind==='ink'&&s.show&&s.pen&&!s.black&&g.points)s.strokes.push({page:s.page,color:s.color,points:g.points});};
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
register(['y2020q41'],'进入页眉后，再决定各节是否共享','第一页和正文属于不同节，取消链接后可分别编辑页眉。',{section:1,editing:false,linked:true,headers:['',''],text:''},s=>
 office('Word',s.editing?'页眉和页脚工具 · 设计':'插入',s.editing?btn(s.linked?'链接到前一节：开':'链接到前一节：关','link','',s.section===2?'':'disabled')+btn('关闭页眉和页脚','close'):btn('页眉 → 编辑页眉','edit'),paper(`<div class="lab-page-header">${s.editing?field('text',`第${s.section}节页眉${s.section===2&&s.linked?' · 与上一节相同':''}`,s.section===2&&s.linked?s.headers[0]:s.headers[s.section-1]):esc(s.section===2&&s.linked?s.headers[0]:s.headers[s.section-1])||'页眉区域（双击可编辑）'}</div><h4>${s.section===1?'封面与目录':'正文第一章'}</h4><p>正文区域与页眉区域分开编辑。</p>`))+controls(btn('查看前置页（第1节）','page',1)+btn('查看正文（第2节）','page',2))+output('第2节链接开启时继承前节；取消链接后再修改，才能形成独立页眉。此示例已预置下一页分节符。'),
 (s,a,v)=>{if(a==='edit')s.editing=true;if(a==='close')s.editing=false;if(a==='page'){s.section=Number(v);s.text=s.section===2&&s.linked?s.headers[0]:s.headers[s.section-1];}if(a==='link'&&s.section===2){if(s.linked)s.headers[1]=s.headers[0];s.linked=!s.linked;}},(s,k,v)=>{s.text=v;if(s.section===2&&s.linked)s.headers[0]=v;else s.headers[s.section-1]=v;});
register(['y2020q43'],'先设首行缩进，再比较两种换行','Enter建立新段落，Shift+Enter只在同段换行。',{special:'first',amount:2,break:'paragraph'},s=>
 office('Word','开始 · 段落',select('special','特殊格式',s.special,[['first','首行缩进'],['hanging','悬挂缩进'],['none','无']])+field('amount','字符数',s.amount,'number','min="0" max="4"'),paper(`<div class="lab-paragraph-demo" style="${s.special==='hanging'?`padding-left:${s.amount}em;`:''}"><p style="text-indent:${s.special==='first'?s.amount:s.special==='hanging'?-s.amount:0}em">第一行按段落格式缩进，自动换行的后续行使用同一段落规则。${s.break==='line'?'<span class="lab-mark">↵</span><br>':'<span class="lab-mark">¶</span></p><p style="text-indent:'+(s.special==='first'?s.amount:s.special==='hanging'?-s.amount:0)+'em">'}第二段内容从这里开始，观察这一行是否重新应用首行缩进。</p></div>`))+controls(btn('模拟键盘：Enter','break','paragraph')+btn('模拟键盘：Shift+Enter','break','line'))+output(s.break==='line'?'这里只有一个段落，手动换行后的新行不是新的首行。':'这里有两个段落，第二段重新应用首行缩进。'),
 (s,a,v)=>{s.break=v;},(s,k,v)=>{s[k]=k==='amount'?number(v,0,4):v;});
// The page-number task has a different state from header text editing.
const headerModel=registry.y2020q41,headerRender=headerModel.render,headerAction=headerModel.action,headerChange=headerModel.change;
Object.assign(headerModel.initial,{scenario:'headers',physical:3,split:false,nEditing:false,nLinked:true,numbers:[false,false],nStart:1,nDialog:false,nMessage:''});
headerModel.render=s=>controls(select('scenario','操作任务',s.scenario,[['headers','页眉文字与前节链接'],['numbers','封面目录无页码，正文从1开始']]))+(s.scenario==='headers'?headerRender(s):office('Word',s.nEditing?'页眉和页脚工具 · 设计':'布局',s.nEditing?btn(s.nLinked?'链接到前一节：开':'链接到前一节：关','num_link','',s.split&&s.physical>=3?'':'disabled')+btn('插入页码','num_insert')+btn('设置页码格式…','num_format')+btn('关闭页脚编辑','num_close'):btn('分隔符 → 下一页','num_break')+btn('编辑页脚','num_edit'),`${s.nDialog?dialog('页码格式',field('nStart','起始页码',s.nStart,'number','min="1" max="99"'),btn('确定','num_apply')):''}${paper(`<h4>${['封面','目录','正文第一章','正文第二页'][s.physical-1]}</h4><p>第${s.physical}个物理页面 · 第${s.split&&s.physical>=3?2:1}节</p><div class="lab-page-footer">${s.numbers[s.split&&s.physical>=3?1:0]?(s.split&&s.physical>=3?s.physical-3+Number(s.nStart):s.physical):'未插入页码'}</div>`)}`)+controls([1,2,3,4].map(i=>btn(['封面','目录','正文首页','正文后页'][i-1],'num_page',i)).join(''))+output(s.nMessage||'在目录末尾插入下一页分节符；到正文页脚取消前节链接，再插入页码并设起始页码1。'));
headerModel.action=(s,a,v)=>{if(!a.startsWith('num_'))return headerAction(s,a,v);if(a==='num_page')s.physical=Number(v);if(a==='num_break'){if(s.physical!==2){s.nMessage='先选择目录页，在目录末尾建立正文新节。';return;}s.split=true;s.physical=3;s.nMessage='正文已从第2节开始；分页和分节不是同一个操作。';}if(a==='num_edit')s.nEditing=true;if(a==='num_close')s.nEditing=false;if(a==='num_link'&&s.split&&s.physical>=3)s.nLinked=!s.nLinked;if(a==='num_insert'){if(!s.split||s.nLinked)s.numbers=[true,true];else s.numbers[s.physical>=3?1:0]=true;s.nMessage=s.nLinked?'链接未断开，前置页也出现页码。可重置后按正确顺序操作。':'正文页脚已独立插入页码。';}if(a==='num_format')s.nDialog=true;if(a==='num_apply'){s.nStart=number(s.nStart,1,99);s.nDialog=false;}};
headerModel.change=(s,k,v)=>{if(k==='scenario')s.scenario=v;else if(k==='nStart')s.nStart=v;else headerChange(s,k,v);};
register(['y2026q38'],'段落、换行与可省略的结束标签','对照源码与真实浏览器段落布局，区分省略结束标签和空元素。',{mode:'closed'},s=>{
 const code=s.mode==='br'?'<p>第一行<br>第二行</p>':s.mode==='omit'?'<p>第一段<p>第二段':'<p>第一段</p><p>第二段</p>';
 return controls(select('mode','HTML写法',s.mode,[['closed','显式结束p'],['omit','符合条件时省略p结束标签'],['br','在一个p内用br换行']]))+`<pre class="lab-code">${esc(code)}</pre><div class="lab-browser-page">${code}</div>`+output(s.mode==='br'?'只有一个段落；br是空元素，没有结束标签。':'浏览器形成两个段落。第二个p开始时，前一个p可按HTML规则隐式结束；p仍不是空元素。');
},()=>{});
register(['y2025q53'],'选择SmartArt节点，再改变结构或外观','单击节点边框选择；按住Ctrl可多选。切换对应工具选项卡操作。',{tab:'design',selected:[1],nodes:[{id:1,text:'公共基础',level:0,shape:'rect',link:false},{id:2,text:'专业基础',level:0,shape:'rect',link:false},{id:3,text:'实践课程',level:0,shape:'rect',link:false}],next:4,linkedView:false},s=>
 controls(btn('SmartArt工具：设计','tab','design')+btn('SmartArt工具：格式','tab','format')+btn('插入','tab','insert'))+office('PowerPoint',s.tab==='design'?'SmartArt工具 · 设计':s.tab==='format'?'SmartArt工具 · 格式':'插入',s.tab==='design'?btn('添加形状 → 在后面添加','add')+btn('降级','demote')+btn('升级','promote'):s.tab==='format'?btn('更改形状 → 圆角矩形','round'):btn('超链接 → 课程体系.docx','link'),`<div class="lab-smartart"><h4>课程体系</h4>${s.nodes.map(n=>btn(esc(n.text)+(n.link?' ↗':''),'select',n.id,`class="lab-smart-node" style="margin-left:${n.level*22}px;border-radius:${n.shape==='round'?'18':'2'}px" aria-pressed="${s.selected.includes(n.id)}"`)).join('')}</div>${s.linkedView?dialog('课程体系.docx · 模拟打开','<p>课程体系说明文档的独立内容。</p>',btn('返回演示文稿','back')):''}`)+controls(btn('放映中打开所选节点的链接','follow'))+output(s.message||'节点边框的选择范围决定命令作用对象；更改形状在“格式”，添加和升降级在“设计”。'),
 (s,a,v)=>{if(a==='tab')s.tab=v;if(a==='select'){const id=Number(v);s.selected=s._ctrl?[...new Set([...s.selected,id])]:[id];}const chosen=s.nodes.filter(n=>s.selected.includes(n.id));if(a==='round')chosen.forEach(n=>n.shape='round');if(a==='demote')chosen.forEach(n=>n.level=Math.min(2,n.level+1));if(a==='promote')chosen.forEach(n=>n.level=Math.max(0,n.level-1));if(a==='add'&&chosen.length){const n=chosen[chosen.length-1],i=s.nodes.indexOf(n),id=s.next++;s.nodes.splice(i+1,0,{id,text:'新节点',level:n.level,shape:'rect',link:false});s.selected=[id];}if(a==='link')chosen.forEach(n=>n.link=true);if(a==='follow'){s.linkedView=chosen.some(n=>n.link);if(!s.linkedView)s.message='所选节点还没有链接。';}if(a==='back')s.linkedView=false;});
})();
