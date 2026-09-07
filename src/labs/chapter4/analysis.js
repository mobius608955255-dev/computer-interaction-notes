/* Multilevel sorting and one/two-input tables compute from source records. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,table,office,output,esc,number}=ui;
  const sortRows=[{id:'03',group:'二班',score:88},{id:'02',group:'一班',score:92},{id:'01',group:'一班',score:92},{id:'04',group:'一班',score:75}];
  register(['syllabus-excel-multikey-sort'],'交换排序优先级，检查整条记录的去向','先按班级再按成绩，与先按成绩再按班级，得到的主顺序不同。',{
    first:'group',descending:true,rows:sortRows,message:'源记录还未排序。'
  },s=>office('Excel','数据 · 排序',select('first','主要关键字',s.first,[['group','班级优先'],['score','成绩优先']])+select('descending','成绩次序',String(s.descending),[['true','降序'],['false','升序']])+btn('确定排序','sort'),
    table(['学号','班级','成绩'],s.rows.map(row=>[row.id,row.group,row.score])))+output(esc(s.message))+
    '<p class="core-caption">班级按一班、二班排列；主次条件均相同后，按学号升序打破同分。</p>',
    (s,a)=>{if(a!=='sort')return;const compare={group:(a,b)=>a.group===b.group?0:a.group==='一班'?-1:1,score:(a,b)=>(a.score-b.score)*(s.descending?-1:1)};const order=s.first==='group'?['group','score']:['score','group'];s.rows.sort((a,b)=>compare[order[0]](a,b)||compare[order[1]](a,b)||Number(a.id)-Number(b.id));s.message='已按'+(s.first==='group'?'班级→成绩':'成绩→班级')+'→学号排序，整条记录一起移动。';},(s,k,v)=>{s[k]=k==='descending'?v==='true':v;});

  register(['syllabus-excel-whatif-table'],'试代销量与单价，计算一组结果','B4=B2×B3；单变量只改变销量，双变量同时比较单价和销量。',{
    price:50,quantity:100,mode:'one',quantities:'80,100,120',prices:'40,50,60'
  },s=>{
    const parse=raw=>{const tokens=raw.split(/[,，]/).map(x=>x.trim()),values=tokens.map(Number);return tokens.length===3&&tokens.every(Boolean)&&values.every(v=>Number.isFinite(v)&&v>=0&&v<=10000)?values:null;};
    const quantities=parse(s.quantities),prices=s.mode==='two'?parse(s.prices):[s.price];
    return office('Excel','数据 · 模拟分析 · 模拟运算表',select('mode','试代方式',s.mode,[['one','单变量：销量'],['two','双变量：单价和销量']]),
      `<div class="lab-controls">${field('price','B2 单价',s.price,'number','min="0" max="10000"')}${field('quantity','B3 销量',s.quantity,'number','min="0" max="10000"')}${field('quantities','列方向的3个销量',s.quantities)}${s.mode==='two'?field('prices','行方向的3个单价',s.prices):''}</div><p>B4 = B2 × B3 = ${s.price*s.quantity}</p>`+
      (quantities&&prices?table([s.mode==='two'?'H1 = B4 · 销量↓ / 单价→':'D1空白 / E1 = B4',...prices.map(p=>s.mode==='two'?String(p):'试代结果')],quantities.map(q=>[q,...prices.map(p=>p*q)])):'<p class="lab-empty">候选输入各需3个0—10000内的数，以逗号分隔。</p>'))+
      output(s.mode==='one'?'D2:D4为候选销量，E1放=B4。列输入单元格设B3，行输入留空；单价保持B2当前值。':'H1放=B4。行输入设B2、列输入设B3；交点是该单价与销量的乘积，不覆盖原模型的输入。');
  },()=>{},(s,k,v)=>{s[k]=['price','quantity'].includes(k)?number(v,0,10000):v;});
})();
