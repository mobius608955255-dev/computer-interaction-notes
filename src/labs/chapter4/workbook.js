/* A small continuous workbook, and a bounded expression parser without eval. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,office,dialog,table,output,coach,esc}=ui;
  const visible=s=>s.sheets.filter(sheet=>sheet.visible);
  function removeSheet(s,id){s.sheets=s.sheets.filter(x=>x.id!==id);s.selected=visible(s)[0].id;s.pending=null;s.message='工作表已删除，其他工作表保留。本例的学习重置可重新载入初始工作簿。';}
  register(['y2020q8'],'在同一个工作簿里新建、隐藏和删除','直接点工作表标签与新建按钮；连续操作，观察最后一张可见工作表的限制。',{
    sheets:[{id:1,name:'Sheet1',visible:true},{id:2,name:'Sheet2',visible:true}],selected:1,next:3,pending:null,message:'两张工作表均可见。删除前先确认当前选中的标签。'
  },s=>{
    const selected=s.sheets.find(x=>x.id===s.selected),busy=!!s.pending;
    return office('Excel','开始',`<fieldset class="lab-command-group" ${busy?'disabled':''}>${btn('删除工作表','delete')}${btn('隐藏工作表','hide')}${s.sheets.filter(x=>!x.visible).map(x=>btn('取消隐藏 '+esc(x.name),'unhide',x.id)).join('')}</fieldset>`,
      `<p>当前工作表：<b>${esc(selected.name)}</b>；共${s.sheets.length}张，其中${visible(s).length}张可见。</p>${table(['A','B'],[['教学示例',esc(selected.name)],['数据','保留在各自工作表中']])}<fieldset class="lab-sheet-tabs" aria-label="工作表标签" ${busy?'disabled':''}>${visible(s).map(x=>btn(esc(x.name),'sheet',x.id,`aria-pressed="${x.id===s.selected}"`)).join('')}${btn('＋ 新建工作表','new')}</fieldset>${s.pending?dialog('删除工作表',`<p>将删除${esc(s.pending.name)}及其数据。请确认目标工作表。</p>`,btn('确认删除','confirm')+btn('取消','cancel')):''}`)+output(esc(s.message))+coach('隐藏仍保留工作表和数据；删除移除整张工作表。工作簿须保留至少一张可见工作表，隐藏的工作表不能代替这个条件。');
  },(s,a,v)=>{
    if(s.pending){if(a==='cancel'){s.pending=null;s.message='已取消删除，当前工作簿未改变。';}else if(a==='confirm')removeSheet(s,s.pending.id);return;}
    const current=s.sheets.find(x=>x.id===s.selected);
    if(a==='sheet'&&s.sheets.some(x=>x.id===Number(v)&&x.visible)){s.selected=Number(v);s.message=`已选中${s.sheets.find(x=>x.id===s.selected).name}。`;}
    if(a==='new'){const id=s.next++;s.sheets.push({id,name:'Sheet'+id,visible:true});s.selected=id;s.message=`已新建Sheet${id}，原有工作表仍在。`;}
    if(a==='delete'||a==='hide'){
      if(visible(s).length===1){s.message=`不能${a==='delete'?'删除':'隐藏'}最后一张可见工作表；可先新建或取消隐藏其他工作表。`;return;}
      if(a==='delete')s.pending={id:current.id,name:current.name};
      else{current.visible=false;s.selected=visible(s)[0].id;s.message=`${current.name}已隐藏，内容仍保留；可用“取消隐藏”恢复。`;}
    }
    if(a==='unhide'){const sheet=s.sheets.find(x=>x.id===Number(v));if(sheet){sheet.visible=true;s.selected=sheet.id;s.message=`${sheet.name}重新可见，原有数据保留。`;}}
  });

  function parseInput(raw){
    const text=String(raw);
    if(text.length>100)return {type:'输入过长',value:'请控制在100个字符内',detail:'本例只解析短算术表达式。'};
    if(text.startsWith("'"))return {type:'文本',value:text.slice(1),detail:'开头的单引号用于标记文本，不作为显示内容的一部分。'};
    if(!text.startsWith('=')){
      const trimmed=text.trim();return trimmed&&/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed)?{type:'数值',value:String(Number(trimmed)),detail:'输入为可识别的数值。'}:{type:'文本',value:text||'（空白）',detail:'没有公式前导等号，这段输入不按算术公式执行。'};
    }
    let pos=1;const fail=(message,code='公式未完成')=>{throw {message,code,position:pos+1};};
    const skip=()=>{while(/\s/.test(text[pos]||'')&&pos<text.length)pos++;};
    function primary(){skip();if(text[pos]==='('){pos++;const value=expression();skip();if(text[pos]!==')')fail('缺少右括号');pos++;return value;}const match=text.slice(pos).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);if(!match)fail(pos>=text.length?'这里还需要一个数值':`无法识别“${text[pos]}”`,/[A-Za-z×]/.test(text[pos]||'')?'#NAME?':'公式未完成');pos+=match[0].length;return Number(match[0]);}
    function unary(){skip();if(text[pos]==='+'||text[pos]==='-'){const sign=text[pos++];return (sign==='-'?-1:1)*unary();}return primary();}
    function product(){let value=unary();skip();while(text[pos]==='*'||text[pos]==='/'){const op=text[pos++],right=unary();if(op==='/'&&right===0)fail('除数为0','#DIV/0!');value=op==='*'?value*right:value/right;skip();}return value;}
    function expression(){let value=product();skip();while(text[pos]==='+'||text[pos]==='-'){const op=text[pos++],right=product();value=op==='+'?value+right:value-right;skip();}return value;}
    try{const value=expression();skip();if(pos!==text.length)fail(`这里的“${text[pos]}”不是本例支持的运算符`,/[A-Za-z×]/.test(text[pos])?'#NAME?':'不支持的表达式');if(!Number.isFinite(value))fail('结果超出本例可表示范围','#NUM!');return {type:'公式',value:String(Number(value.toPrecision(15))),detail:'先计算括号，再乘除，最后加减；同级运算从左到右。'};}catch(error){return {type:'公式',value:error.code||'无法计算',detail:`第${error.position||pos+1}个字符附近：${error.message||'请检查表达式'}。${text.includes('×')?'Excel乘法使用星号 *。':''}`};}
  }
  register(['y2024q11'],'自己输入，再看文本、数值和公式的区别','改变数字或运算符，比较输入内容、保存类型与显示结果。',{raw:'=2*3',applied:null},s=>{
    const value=s.applied===null?null:parseInput(s.applied);
    return office('Excel','开始',field('raw','编辑A1内容',s.raw,'text','maxlength="100"')+btn('确认输入','apply'),
      `<p>示例：${['2*3','=2*3','=2×3',"'=2*3"].map(x=>btn(esc(x),'example',x)).join('')}</p>${value?table(['公式栏输入','内容类型','单元格显示'],[[esc(s.applied),value.type,esc(value.value)]]):'<p class="lab-empty">编辑后确认，结果显示在这里。</p>'}`)+(value?output(esc(value.detail)):output('可以先比较示例，再把2改成8或给表达式加上括号。'))+coach('本例开放数值、文本、前导单引号，以及 + − * / 和括号。日期、单元格引用和函数有各自解析规则，使用对应笔记演示；此处不模拟它们。');
  },(s,a,v)=>{if(a==='apply')s.applied=s.raw;if(a==='example'){s.raw=v;s.applied=v;}},(s,k,v)=>{if(k==='raw')s.raw=v;});
  registry.y2024q11.parseInput=parseInput;
})();
