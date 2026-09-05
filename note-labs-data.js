/* Relational transformations, sequential SQL state, and computed bubble sorting. */
(() => {
 'use strict';
 const {register,ui}=window.NOTE_LABS;
 const {btn,field,select,table,coach,output,esc}=ui;
 const controls=x=>`<div class="lab-controls">${x}</div>`;
 const area=(k,l,v)=>`<label>${l}<textarea data-field="${k}" rows="4">${esc(v)}</textarea></label>`;
 const unique=rows=>rows.filter((r,i)=>rows.findIndex(x=>JSON.stringify(x)===JSON.stringify(r))===i);
 function parseRelation(raw,n){const lines=String(raw).trim().split('\n');if(lines.length>12||!raw.trim())return null;const rows=lines.map(line=>line.split(/[,，]/).map(v=>v.trim()));if(rows.some(r=>r.length!==n||r.some(v=>!v||v.length>30)))return null;return unique(rows);}
 function relation(s){const a=parseRelation(s.left,3),b=parseRelation(s.right,3);if(!a||!b)return null;let rows,head;
   if(s.mode==='join'){head=['学号','姓名','班级','成绩'];rows=a.flatMap(x=>b.filter(y=>x[0]===y[0]&&x[2]===y[1]).map(y=>[...x,y[2]]));}
   if(s.mode==='select'){head=['学号','姓名','班级'];rows=a.filter(r=>r[2]===s.filter);}
   if(s.mode==='project'){head=s.columns==='class'?['班级']:['姓名','班级'];rows=unique(a.map(r=>s.columns==='class'?[r[2]]:[r[1],r[2]]));}
   return {a,b,head,rows};
 }
 register(['merged-20'],'编辑两个关系，再做选择、投影与自然连接','同名属性要全部匹配，投影后实际去重；改学号或班级即可观察结果。',{
   left:'01,王宁,A\n02,李明,B\n03,赵敏,A',right:'01,A,88\n02,B,76\n01,B,91\n04,A,92',mode:'join',filter:'A',columns:'class'
 },s=>{const x=relation(s);return controls(area('left','关系S：每行 学号,姓名,班级',s.left)+area('right','关系T：每行 学号,班级,成绩',s.right)+select('mode','关系运算',s.mode,[['join','自然连接：S ⋈ T'],['select','选择：只筛选S中的行'],['project','投影：只取S中的列']])+(s.mode==='select'?field('filter','保留哪个班级',s.filter):'')+(s.mode==='project'?select('columns','保留哪些属性',s.columns,[['class','班级'],['name-class','姓名、班级']]):''))+
   (x?`<section class="ext-dataset"><h4>关系S · ${x.a.length}个元组</h4>${table(['学号','姓名','班级'],x.a.map(r=>r.map(esc)))}</section><section class="ext-dataset"><h4>关系T · ${x.b.length}个元组</h4>${table(['学号','班级','成绩'],x.b.map(r=>r.map(esc)))}</section><section class="ext-dataset"><h4>运算结果 · ${x.rows.length}个元组</h4>${table(x.head,x.rows.map(r=>r.map(esc)))}${x.rows.length?'':'<p>结果为空关系，属性结构仍在。</p>'}</section>`+output(s.mode==='join'?'共同属性是“学号”和“班级”，本例要求两者同时相等；同名列只保留一次。学号01、班级B不会误接到学号01、班级A。':s.mode==='project'?'关系代数投影会消除相同结果元组；投影班级时，多名同班学生只产生一个班级值。':'选择只筛选行，不减少属性列。'):output('每个关系填写1—12行，每行3个非空字段，用逗号分隔；每个字段不超过30字。'))+coach('此处按关系代数的集合语义处理，完全相同的输入元组也去重；SQL普通SELECT通常保留重复结果，要用DISTINCT才去重。模型中的自然连接匹配全部同名属性，不是只看第一个同名字段。');},()=>{});

 const initialDB=()=>({exists:true,columns:['id','name','score'],rows:[{id:1,name:'王宁',score:88},{id:2,name:'李明',score:56},{id:3,name:'赵敏',score:92},{id:4,name:'周林',score:null}]});
 const queries={delete:'DELETE FROM students WHERE score < 60;',deleteAll:'DELETE FROM students;',update:'UPDATE students SET score = 60 WHERE id = 2;',insert:"INSERT INTO students (id, name, score) VALUES (5, '陈晨', 75);",alter:'ALTER TABLE students ADD COLUMN remark TEXT;',drop:'DROP TABLE students;',query:'SELECT * FROM students;'};
 const display=v=>v===null?'<i>NULL</i>':esc(String(v));
 const numeric=raw=>{const n=Number(raw);if((String(raw).split('.')[1]?.length||0)>6)throw Error('本例最多支持6位小数，超出精度范围不执行。');if(!Number.isFinite(n)||Math.abs(n)>1000000000)throw Error('本例数值须在−10亿到10亿之间，超出范围不执行。');return n;};
 function predicate(clause,db){if(!clause)return ()=>true;let m=clause.trim().match(/^(id|score)\s+IS\s+(NOT\s+)?NULL$/i);if(m){const k=m[1].toLowerCase();return r=>m[2]?r[k]!==null:r[k]===null;}
   m=clause.trim().match(/^(id|score)\s*(<=|>=|<>|!=|=|<|>)\s*(-?\d+(?:\.\d+)?)$/i);if(!m||!db.columns.includes(m[1].toLowerCase()))throw Error('WHERE只支持id或score的单个数值比较，以及IS NULL / IS NOT NULL。');const k=m[1].toLowerCase(),v=numeric(m[3]);return r=>r[k]!==null&&({'=':r[k]===v,'<>':r[k]!==v,'!=':r[k]!==v,'<':r[k]<v,'>':r[k]>v,'<=':r[k]<=v,'>=':r[k]>=v}[m[2]]);
 }
 function sqlExecute(db,raw){const sql=String(raw).trim().replace(/;\s*$/,'').trim();if(!db.exists)throw Error('students表已被DROP删除，后续命令不能再访问它；可用卡片外的“恢复样例”重新开始。');let m;
   if((m=sql.match(/^SELECT\s+\*\s+FROM\s+students(?:\s+WHERE\s+(.+))?$/i))){const hit=predicate(m[1],db);return {message:'查询完成；原表没有改动。',result:db.rows.filter(hit).map(r=>({...r})),changed:false};}
   if((m=sql.match(/^DELETE\s+FROM\s+students(?:\s+WHERE\s+(.+))?$/i))){const hit=predicate(m[1],db),n=db.rows.filter(hit).length;db.rows=db.rows.filter(r=>!hit(r));return {message:`DELETE删除了${n}行；表、字段和约束仍保留。`,changed:true};}
   if((m=sql.match(/^UPDATE\s+students\s+SET\s+score\s*=\s*(NULL|-?\d+(?:\.\d+)?)(?:\s+WHERE\s+(.+))?$/i))){const value=m[1].toUpperCase()==='NULL'?null:numeric(m[1]),hit=predicate(m[2],db);let n=0;db.rows.forEach(r=>{if(hit(r)){r.score=value;n++;}});return {message:`UPDATE匹配${n}行，只改score字段；行数与表结构保持。`,changed:true};}
   if((m=sql.match(/^INSERT\s+INTO\s+students\s*\(\s*id\s*,\s*name\s*,\s*score\s*\)\s*VALUES\s*\(\s*(\d+)\s*,\s*'((?:[^']|'')*)'\s*,\s*(NULL|-?\d+(?:\.\d+)?)\s*\)$/i))){const id=Number(m[1]);if(!Number.isSafeInteger(id)||db.rows.some(r=>r.id===id))throw Error('插入失败：id须为不重复的安全整数，本例把id声明为主键。');const row=Object.fromEntries(db.columns.map(k=>[k,null]));Object.assign(row,{id,name:m[2].replace(/''/g,"'"),score:m[3].toUpperCase()==='NULL'?null:numeric(m[3])});db.rows.push(row);return {message:'INSERT新增1行，原有记录保留。未提供的新字段取本例默认值NULL。',changed:true};}
   if((m=sql.match(/^ALTER\s+TABLE\s+students\s+ADD(?:\s+COLUMN)?\s+([a-z][a-z0-9_]*)\s+TEXT$/i))){const key=m[1].toLowerCase();if(!/^(remark|note|tag|extra_[a-z0-9_]+)$/.test(key))throw Error('本例新增列名支持remark、note、tag或extra_开头的名称；不支持其他或引用标识符。');if(db.columns.includes(key))throw Error('字段已经存在，不能重复添加。');if(db.columns.length>=7)throw Error('本例最多7列，请恢复样例后继续。');db.columns.push(key);db.rows.forEach(r=>r[key]=null);return {message:`ALTER TABLE新增${key}列，既有行仍在，新列值为NULL。`,changed:true};}
   if(/^DROP\s+TABLE\s+students$/i.test(sql)){db.exists=false;db.columns=[];db.rows=[];return {message:'DROP删除了students表对象；表结构和数据均已不存在。',changed:true};}
   throw Error('本例不支持这条语句。请参考上方语句形式：单条SELECT *、DELETE、UPDATE score、指定三列的INSERT、ADD TEXT列或DROP；不支持多语句、JOIN和事务语法。');
 }
 register(['y2024q36'],'连续执行SQL：删行、改值、增列和删表各改哪层','每条命令都作用于上一次的结果；删表以后不会因点击其他命令自动恢复。',{
   db:initialDB(),sql:queries.delete,example:'delete',history:[],undo:[],result:null,message:'students包含4行，其中一行score为NULL。id是本例主键。'
 },s=>controls(select('example','载入语句示例',s.example,Object.entries({delete:'有条件删除',deleteAll:'删除全部行',update:'更新字段值',insert:'新增记录',alter:'新增字段',drop:'删除表对象',query:'查询当前表'})))+
   `<section class="ext-database"><h4>SQL编辑区 · 本地示例</h4>${area('sql','单条SQL（可直接修改）',s.sql)}${controls(btn('执行当前语句','execute'))}<h4>当前students表</h4>${s.db.exists?table(s.db.columns,s.db.rows.map(r=>s.db.columns.map(k=>display(r[k])))):'<p>表不存在。DROP已删除表对象。</p>'}${s.db.exists?`<p>表存在 · ${s.db.rows.length}行 · ${s.db.columns.length}列</p>`:''}${s.result?`<h4>本次查询结果</h4>${table(s.db.columns,s.result.map(r=>s.db.columns.map(k=>display(r[k]))))}`:''}</section>`+
   controls(btn('学习辅助：撤销上次数据变更','undo','',s.undo.length?'':'disabled')+btn('学习辅助：恢复样例','reset'))+output(esc(s.message))+`<ol class="ext-step-log">${s.history.slice(-5).map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`+coach('这是语法范围明确的内存SQL模型，不连接数据库。新增列名限remark、note、tag或extra_开头。WHERE支持id/score的单个比较与IS NULL；NULL不满足普通大小比较。撤销与恢复样例是学习辅助，不是真实SQL命令，也不表示数据库一定能撤销已提交的DROP。'),
 (s,a)=>{if(a==='reset'){s.db=initialDB();s.result=null;s.undo=[];s.history=[];s.message='样例已恢复为初始4行。';return;}if(a==='undo'&&s.undo.length){s.db=s.undo.pop();s.result=null;s.message='已恢复本卡片上一次变更前的完整状态。';return;}if(a==='execute'){const before=structuredClone(s.db);try{const r=sqlExecute(s.db,s.sql);if(r.changed)s.undo.push(before);s.result=r.result||null;s.message=r.message;s.history.push(s.sql.trim()+' → '+r.message);}catch(e){s.db=before;s.result=null;s.message=e.message;}}},(s,k,v)=>{s[k]=v;if(k==='example')s.sql=queries[v];s.result=null;});

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
 window.NOTE_LABS.dataMath={unique,parseRelation,relation,initialDB,predicate,sqlExecute,parseSort,sortStep};
})();
