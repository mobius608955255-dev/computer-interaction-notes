/* Chapter 10: database. Maintained source; edit this domain directly. */
/* Source provenance: note-labs.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
register(['y2023q14'],'在关系表中分清元组、属性和域','点一行或列标题，并尝试给性别字段写入不同值。',{row:-1,col:-1,value:'女'},s=>
    table(['学号','姓名','性别'].map((v,i)=>btn(v,'column',i)),[['01','王宁','女'],['02','李明','男'],['03','赵敏','女']].map((r,i)=>r.map((v,j)=>`<button class="${s.row===i||s.col===j?'lab-selected':''}" data-lab-act="row" data-value="${i}">${v}</button>`)))+`<div class="lab-controls">${select('value','性别域示例：{男,女,未说明}',s.value,[['女','女'],['男','男'],['未说明','未说明'],['300','300']])}</div>${output(s.value==='300'?'300不属于本表设定的性别域，不能作为合法取值。':s.col>=0?`所选是一列，叫属性。${s.col===2?'本表性别属性的允许值集合叫域。':''}`:s.row>=0?'所选是一行，叫元组，表示一条完整记录。':'域是允许取值的集合，不是一行或一列当前显示的值。')}`,
    (s,a,v)=>{s.row=a==='row'?Number(v):-1;s.col=a==='column'?Number(v):-1;});
register(['y2020q14'],'从两个方向判断联系基数','切换业务规则，观察一对一、一对多和多对多的连接。',{mode:'one-many'},s=>{
    const pairs={'one-one':[[0,0],[1,1]],'one-many':[[0,0],[0,1],[0,2],[1,3]],'many-many':[[0,0],[0,1],[0,2],[1,1],[1,2],[1,3]]};const labels=s.mode==='many-many'?['出版社','书店']:s.mode==='one-one'?['人','身份证']:['班级','学生'];
    return `<div class="lab-controls">${select('mode','业务规则',s.mode,[['one-one','每人一个证号，每证号对应一人'],['one-many','一班多名学生，每生属于一班'],['many-many','多家出版社向多家书店供书']])}</div><svg class="lab-cardinality" viewBox="0 0 500 280" role="img" aria-label="实体联系图">${pairs[s.mode].map(([a,b])=>`<line x1="150" y1="${70+a*140}" x2="350" y2="${35+b*70}" stroke="#6d9981" stroke-width="2"/>`).join('')}${[0,1].map(i=>`<rect x="10" y="${45+i*140}" width="140" height="50" rx="8" fill="#e1eee0"/><text x="80" y="${76+i*140}" text-anchor="middle">${labels[0]} ${i+1}</text>`).join('')}${Array.from({length:s.mode==='one-one'?2:4},(_,i)=>`<rect x="350" y="${10+i*70}" width="140" height="50" rx="8" fill="#e9e8d7"/><text x="420" y="${41+i*70}" text-anchor="middle">${labels[1]} ${i+1}</text>`).join('')}</svg>${output({'one-one':'两边每个实例都只对应一个，属于一对一。','one-many':'班级能连多个学生，但每个学生只连一个班级，属于一对多。','many-many':'任一方向都可能对应多个实例，属于多对多。'}[s.mode])}`;
  },(s,a,v)=>{s.mode=v;});
})();

/* Source provenance: note-labs-audit.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui,clusteredChart,daysBetween}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
const studentRows=[['01','王宁','女',88],['02','李明','男',76],['03','赵敏','女',92],['04','周林','男',58]];
register(['merged-21'],'改查询条件，再运行SQL','在同一张学生表上选择字段、阈值和排序，结果只在执行后更新。',{min:80,sex:'全部',order:'DESC',fields:'姓名,成绩',result:null},s=>{
 const sql=`SELECT ${s.fields} FROM 学生 WHERE 成绩 >= ${Number(s.min)}${s.sex==='全部'?'':` AND 性别 = '${s.sex}'`} ORDER BY 成绩 ${s.order};`;
 return controls(field('min','最低成绩',s.min,'number')+select('sex','性别条件',s.sex,[['全部','全部'],['女','女'],['男','男']])+select('order','成绩排序',s.order,[['DESC','降序'],['ASC','升序']])+select('fields','投影字段',s.fields,[['姓名,成绩','姓名、成绩'],['学号,姓名,性别,成绩','全部四列']]))+`<pre class="lab-code">${esc(sql)}</pre>`+controls(btn('执行查询','run'))+table(['学号','姓名','性别','成绩'],studentRows)+(s.result?table(s.result.head,s.result.rows):output('等待执行。'));
},(s,a)=>{if(a==='run'){const rows=studentRows.filter(r=>r[3]>=Number(s.min)&&(s.sex==='全部'||r[2]===s.sex)).sort((a,b)=>(a[3]-b[3])*(s.order==='ASC'?1:-1));s.result={head:s.fields.split(','),rows:s.fields.startsWith('学号')?rows:rows.map(r=>[r[1],r[3]])};}});
})();

/* Source provenance: note-labs-data.js:2. Preserve this closure. */
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
Object.assign(window.NOTE_LABS.dataMath ||= {}, {unique,parseRelation,relation,initialDB,predicate,sqlExecute});
})();
