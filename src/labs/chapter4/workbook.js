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
    if(/[A-Za-z$!:,"&<>=]/.test(text.slice(1)))return {type:'公式',value:'演示未支持',detail:'本输入卡仅计算无引用的算术公式；引用、函数、文本连接与比较请阅读相应卡片。这不是Excel错误值。'};
    let pos=1;const fail=(message,code='公式未完成')=>{throw {message,code,position:pos+1};};
    const skip=()=>{while(/\s/.test(text[pos]||'')&&pos<text.length)pos++;};
    function primary(){skip();if(text[pos]==='('){pos++;const value=expression();skip();if(text[pos]!==')')fail('缺少右括号');pos++;return value;}const match=text.slice(pos).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);if(!match)fail(pos>=text.length?'这里还需要一个数值':`无法识别“${text[pos]}”`,/[A-Za-z×]/.test(text[pos]||'')?'#NAME?':'公式未完成');pos+=match[0].length;return Number(match[0]);}
    function unary(){skip();if(text[pos]==='+'||text[pos]==='-'){const sign=text[pos++];return (sign==='-'?-1:1)*unary();}return primary();}
    function percent(){let value=unary();skip();while(text[pos]==='%'){pos++;value/=100;skip();}return value;}
    function power(){let value=percent();skip();while(text[pos]==='^'){pos++;value=Math.pow(value,percent());skip();}return value;}
    function product(){let value=power();skip();while(text[pos]==='*'||text[pos]==='/'){const op=text[pos++],right=power();if(op==='/'&&right===0)fail('除数为0','#DIV/0!');value=op==='*'?value*right:value/right;skip();}return value;}
    function expression(){let value=product();skip();while(text[pos]==='+'||text[pos]==='-'){const op=text[pos++],right=product();value=op==='+'?value+right:value-right;skip();}return value;}
    try{const value=expression();skip();if(pos!==text.length)fail(`这里的“${text[pos]}”不是本例支持的运算符`,/[A-Za-z×]/.test(text[pos])?'#NAME?':'不支持的表达式');if(!Number.isFinite(value))fail('结果超出本例可表示范围','#NUM!');return {type:'公式',value:String(Number(value.toPrecision(15))),detail:'本例依次处理括号、负号、百分号、乘方、乘除、加减；同级从左向右。'};}catch(error){return {type:'公式',value:error.code||'无法计算',detail:`第${error.position||pos+1}个字符附近：${error.message||'请检查表达式'}。${text.includes('×')?'Excel乘法使用星号 *。':''}`};}
  }
  // A six-cell teaching surface; values, display formats and pending edits are separate.
  function inputRecord(raw){
    const text=String(raw),t=text.trim();let value=parseInput(text);
    if(!text.startsWith("'")&&!text.startsWith('=')){
      if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)%$/.test(t))value={type:'数值',value:String(Number(t.slice(0,-1))/100),detail:'百分数按数值保存；25%对应0.25。'};
      else if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)e[+-]?\d+$/i.test(t)&&Number.isFinite(Number(t)))value={type:'数值',value:String(Number(t)),detail:'科学计数输入被解释为数值。'};
      else {const f=t.match(/^0 (\d+)\/(\d+)$/);if(f&&Number(f[2])!==0)value={type:'数值',value:String(Number(f[1])/Number(f[2])),detail:'0、空格、分数的输入按数值解释；本例用常规小数显示。'};}
    }
    return {...value,raw:text,bar:value.type==='数值'?value.value:text};
  }
  const addresses=['A1','B1','A2','B2','A3','B3'];
  function shown(cell){
    if(cell.raw==='')return '';
    const r=inputRecord(cell.raw),v=Number(r.value);
    if(r.type!=='文本'&&Number.isFinite(v))return cell.format==='fixed2'?v.toFixed(2):cell.format==='percent'?(v*100).toFixed(2)+'%':r.value;
    return r.value;
  }
  function commitInput(s,move=0){
    const address=addresses[s.active];s.cells[s.active].raw=s.raw;s.applied=s.raw;
    if(move)s.active=(s.active+move)%6;
    s.raw=s.cells[s.active].raw;s.message=`已确认${address}；当前活动单元格为${addresses[s.active]}。`;
  }
  register(['y2024q11'],'输入、确认，再比较单元格与编辑栏','实际值、公式和显示格式分开保存；修改未确认时可以取消。',{
    raw:'=2*3',applied:null,active:0,cells:Array.from({length:6},()=>({raw:'',format:'general'})),message:'当前编辑A1；勾号只确认，Enter向下，Tab向右。本例在6格内循环。'
  },s=>{
    const cell=s.cells[s.active],value=cell.raw===''?null:inputRecord(cell.raw);
    return office('Excel','开始',field('raw','编辑'+addresses[s.active]+'内容',s.raw,'text','maxlength="100"')+btn('✓ 确认输入','apply')+btn('× 取消修改','cancel'),
      `<p><b>名称框：${addresses[s.active]}</b>　已保存的编辑栏内容：<code data-input-bar>${esc(value?.bar||'（空白）')}</code></p>`+
      table(['行','A','B'],[0,1,2].map(row=>[row+1,...[0,1].map(col=>{const i=row*2+col;return btn(esc(shown(s.cells[i]))||'（空白）','cell',i,`aria-label="选择${addresses[i]}" aria-pressed="${s.active===i}"`);})]))+
      window.NOTE_LABS.ui.select('format','当前格的显示格式',cell.format,[['general','常规（本例不按列宽切换科学计数）'],['fixed2','数值：2位小数'],['percent','百分比：2位小数']])+
      `<p>比较示例：${['2*3','=2*3',"'001",'12.857','0.25'].map(x=>btn(esc(x),'example',x)).join('')}</p>`+
      (value?table(['原输入','保存类型','单元格显示'],[[esc(cell.raw),value.type,`<span data-input-display>${esc(shown(cell))}</span>`]]):'<p class="lab-empty">当前格尚无已确认内容。</p>'))+
      output(esc(s.message)+(value?' '+esc(value.detail):''))+coach('网页仅模拟这6格的短文本、数值、单引号、百分数、科学计数、0 空格分数及无引用的 + - * / % ^ 算术公式。日期地区解析、超过15位数值的精确截断、单元格引用与函数未模拟；不生成Excel文件。选择另一格会先确认当前输入，切换后编辑栏显示该格已保存内容。');
  },(s,a,v)=>{
    if(a==='apply')commitInput(s);
    if(a==='cancel'){s.raw=s.cells[s.active].raw;s.message='已取消本次未确认修改，原内容与格式保留。';}
    if(a==='cell'){commitInput(s);s.active=Math.max(0,Math.min(5,Number(v)));s.raw=s.cells[s.active].raw;s.message='已选中'+addresses[s.active]+'。';}
    if(a==='example'){s.raw=v;commitInput(s);}
  },(s,k,v)=>{if(k==='raw')s.raw=v;if(k==='format'){s.cells[s.active].format=v;s.message='只改变当前格显示格式，原内容未改。';}});
  registry.y2024q11.keydown=(s,e)=>{
    if(e.target.dataset.field!=='raw'||!['Enter','Tab','Escape'].includes(e.key))return false;
    e.preventDefault();if(e.key==='Escape'){s.raw=s.cells[s.active].raw;s.message='已取消本次未确认修改。';}else commitInput(s,e.key==='Enter'?2:1);return true;
  };
  registry.y2024q11.parseInput=parseInput;
  registry.y2024q11.inputRecord=inputRecord;
})();
