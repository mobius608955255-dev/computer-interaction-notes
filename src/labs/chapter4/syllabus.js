/* Small data-driven additions for two explicit syllabus gaps. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,table,office,output,esc}=ui;
  function spark(raw,type,mark){
    const parts=raw.split(/[,，]/).map(v=>v.trim()),values=parts.map(Number),valid=parts.length===4&&parts.every(v=>v!=='')&&values.every(v=>Number.isFinite(v)&&Math.abs(v)<=1000);
    if(!valid)return '请输入4个−1000至1000之间的数（演示范围）';
    const lo=Math.min(0,...values),hi=Math.max(0,...values),range=hi-lo||1,y=n=>65-(n-lo)/range*55,zero=y(0),color=v=>mark&&v===Math.max(...values)?'#b2536a':mark&&v===Math.min(...values)?'#286988':v<0?'#bb688b':'#9e7bbb';let shapes='';
    if(type==='line')shapes=`<polyline points="${values.map((v,i)=>`${15+i*50},${y(v)}`).join(' ')}" fill="none" stroke="#9670ae" stroke-width="3"/>`+(mark?values.map((v,i)=>`<circle cx="${15+i*50}" cy="${y(v)}" r="4" fill="${color(v)}"/>`).join(''):'');
    else shapes=values.map((v,i)=>{const end=type==='win'?(v>0?12:v<0?65:38):y(v),base=type==='win'?38:zero;return `<rect x="${i*50+5}" y="${Math.min(base,end)}" width="24" height="${Math.abs(base-end)}" fill="${color(v)}"/>`;}).join('');
    return `<svg viewBox="0 0 180 80" role="img" aria-label="${esc({line:'折线',column:'柱形',win:'盈亏'}[type])}迷你图：${values.join('、')}" style="width:180px;max-width:100%;height:80px"><path d="M0 ${type==='win'?38:zero}H180" stroke="#ded1e6"/>${shapes}</svg>`;
  }
  register(['syllabus-sparkline'],'确认数据范围和位置范围，再看迷你图','同一行可改类型；换来源行或输出列，观察哪一格真正承载图形。',{
    raw:'4,8,5,10',rawOther:'40,80,50,100',type:'line',source:'row2',location:'F',mark:false,pane:false,draftSource:'row2',draftLocation:'F',message:''
  },s=>{
    const assignments=s.source==='two'?[[2,2],[3,3]]:s.source==='row3'?[[3,2]]:[[2,2]],range=s.source==='two'?'B2:E3':s.source==='row3'?'B3:E3':'B2:E2',place=s.location+'2'+(s.source==='two'?':'+s.location+'3':'');
    const display=(row,col)=>{const pair=assignments.find(a=>a[1]===row);return pair&&col===s.location?`<div data-spark-location="${col}${row}" data-spark-source="B${pair[0]}:E${pair[0]}">${spark(pair[0]===2?s.raw:s.rawOther,s.type,s.mark)}</div>`:'（空）';};
    return office('Excel','迷你图工具 · 设计',btn('编辑数据与位置范围…','ranges','',s.pane?'disabled':'')+select('type','迷你图类型',s.type,[['line','折线'],['column','柱形'],['win','盈亏']])+`<label><input type="checkbox" data-field="mark" ${s.mark?'checked':''}>标出高点、低点</label>`,
      (s.pane?ui.dialog('范围设置 · 本例可选范围',select('draftSource','数据范围',s.draftSource,[['row2','B2:E2 · 第一行'],['row3','B3:E3 · 第二行'],['two','B2:E3 · 两行']])+select('draftLocation','位置范围起始列',s.draftLocation,[['F','F列（从F2起）'],['G','G列（从G2起）']])+'<p>两行来源对应两个位置格；单行来源对应一个位置格。本例只提供可匹配范围。</p>',btn('确定','applyRanges')+btn('取消','cancelRanges')):'')+
      `<p data-spark-mapping>数据范围 ${range} → 位置范围 ${place}</p>`+table(['行 / B:E数据','F列','G列'],[2,3].map(row=>[field(row===2?'raw':'rawOther',`第${row}行源数据`,row===2?s.raw:s.rawOther,'text',`maxlength="60" ${s.pane?'disabled':''}`),display(row,'F'),display(row,'G')]))+
      '<p>极值标记：红色为高点，蓝色为低点；本例每行独立缩放。</p>')+output(esc(s.message||'换来源不移动原数据；换位置将图形放入新的承载格。'))+
      output(s.type==='win'?'盈亏只表示正负；4与40的正向柱等高。':'各行独立缩放时，4/8/5/10与40/80/50/100外形可相同，不能据图高判断金额相同。')+'<p class="core-caption">只模拟数值、给定范围和三种迷你图；不模拟任意区域、分组轴设置或原生Excel文件保存。</p>';
  },(s,a)=>{
    if(a==='ranges'){s.pane=true;s.draftSource=s.source;s.draftLocation=s.location;}
    if(a==='applyRanges'){s.source=s.draftSource;s.location=s.draftLocation;s.pane=false;s.message='已重建数据行与位置格的对应关系，原数据仍在原处。';}
    if(a==='cancelRanges'){s.pane=false;s.message='已取消，原数据范围和位置范围保持。';}
  },(s,k,v)=>{if(s.pane&&!k.startsWith('draft'))return;s[k]=v;});

  register(['syllabus-worksheet-protection'],'锁定属性与保护开关一起决定能否编辑','先只勾锁定，再启用保护；比较A1与解除锁定的B1。',{
    protected:false,locked:true,a:'公式区',b:'请填写',message:'工作表尚未保护，两个单元格均可编辑。'
  },s=>office('Excel','审阅',btn(s.protected?'撤销工作表保护':'保护工作表','protect')+
    `<label><input type="checkbox" data-field="locked" ${s.locked?'checked':''} ${s.protected?'disabled':''}>A1锁定属性</label>`,
    table(['单元格','内容','当前权限'],[['A1',field('a','A1内容',s.a,'text',s.protected&&s.locked?'disabled':''),s.protected&&s.locked?'不可编辑':'可编辑'],['B1（已解除锁定）',field('b','B1内容',s.b),'可编辑']]))+
    output(esc(s.message))+'<p class="core-caption">工作表保护用于限制误操作，不提供文件内容加密。本例不设置密码。</p>',
    (s,a)=>{if(a==='protect'){s.protected=!s.protected;s.message=s.protected?(s.locked?'保护已启用：A1锁定，B1仍可填写。':'保护已启用，但A1已解除锁定，因此仍可编辑。'):'保护已撤销；内容保留，锁定属性不再阻止输入。';}},
    (s,k,v)=>{if(k==='locked'&&!s.protected)s.locked=v;else if(k==='a'&&!(s.protected&&s.locked))s.a=v;else if(k==='b')s.b=v;});
})();
