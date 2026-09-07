/* Small data-driven additions for two explicit syllabus gaps. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,table,office,output,esc}=ui;
  register(['syllabus-sparkline'],'改一行数，观察单元格里的迷你图','输入4个以逗号分隔的数，再比较折线、柱形和盈亏类型。',{
    raw:'4,8,5,10',type:'line'
  },s=>{
    const parts=s.raw.split(/[,，]/).map(v=>v.trim()),values=parts.map(Number),valid=parts.length===4&&parts.every(v=>v!=='')&&values.every(v=>Number.isFinite(v)&&Math.abs(v)<=1000);
    let chart='请输入4个−1000至1000之间的数';
    if(valid){const lo=Math.min(0,...values),hi=Math.max(0,...values),range=hi-lo||1,y=n=>65-(n-lo)/range*55,zero=y(0);let shapes='';
      if(s.type==='line')shapes=`<polyline points="${values.map((v,i)=>`${15+i*50},${y(v)}`).join(' ')}" fill="none" stroke="#9670ae" stroke-width="3"/>`;
      else shapes=values.map((v,i)=>{const end=s.type==='win'?(v>0?12:v<0?65:38):y(v),base=s.type==='win'?38:zero;return `<rect x="${i*50+5}" y="${Math.min(base,end)}" width="24" height="${Math.abs(base-end)}" fill="${v<0?'#bb688b':'#9e7bbb'}"/>`;}).join('');
      chart=`<svg viewBox="0 0 180 80" role="img" aria-label="${esc({line:'折线',column:'柱形',win:'盈亏'}[s.type])}迷你图：${values.join('、')}" style="width:180px;height:80px"><path d="M0 ${s.type==='win'?38:zero}H180" stroke="#ded1e6"/>${shapes}</svg>`;
    }
    return office('Excel','迷你图工具 · 设计',select('type','迷你图类型',s.type,[['line','折线'],['column','柱形'],['win','盈亏']]),
      table(['B2:E2 · 四个月数据','F2 · 位置单元格'],[[field('raw','源数据',s.raw,'text','maxlength="60"'),chart]]))+
      output(valid?(s.type==='win'?'盈亏标记只比较正负；把4改成40，正向柱仍等高。':'迷你图读取这行数值；数据改变后图形同步变化。此处按当前行自动缩放。'):'源数据无效，图形暂不绘制。');
  },()=>{});

  register(['syllabus-worksheet-protection'],'锁定属性与保护开关一起决定能否编辑','先只勾锁定，再启用保护；比较A1与解除锁定的B1。',{
    protected:false,locked:true,a:'公式区',b:'请填写',message:'工作表尚未保护，两个单元格均可编辑。'
  },s=>office('Excel','审阅',btn(s.protected?'撤销工作表保护':'保护工作表','protect')+
    `<label><input type="checkbox" data-field="locked" ${s.locked?'checked':''} ${s.protected?'disabled':''}>A1锁定属性</label>`,
    table(['单元格','内容','当前权限'],[['A1',field('a','A1内容',s.a,'text',s.protected&&s.locked?'disabled':''),s.protected&&s.locked?'不可编辑':'可编辑'],['B1（已解除锁定）',field('b','B1内容',s.b),'可编辑']]))+
    output(esc(s.message))+'<p class="core-caption">工作表保护用于限制误操作，不提供文件内容加密。本例不设置密码。</p>',
    (s,a)=>{if(a==='protect'){s.protected=!s.protected;s.message=s.protected?(s.locked?'保护已启用：A1锁定，B1仍可填写。':'保护已启用，但A1已解除锁定，因此仍可编辑。'):'保护已撤销；内容保留，锁定属性不再阻止输入。';}},
    (s,k,v)=>{if(k==='locked'&&!s.protected)s.locked=v;else if(k==='a'&&!(s.protected&&s.locked))s.a=v;else if(k==='b')s.b=v;});
})();
