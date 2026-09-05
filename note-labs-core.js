/* Task-specific models for computer fundamentals, Windows and PowerPoint. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,table,coach,output,office,dialog,esc}=ui;
  const controls=html=>`<div class="lab-controls">${html}</div>`;
  const clone=x=>structuredClone(x);
  const area=(key,label,value,extra='')=>`<label>${label}<textarea data-field="${key}" rows="3" ${extra}>${esc(value)}</textarea></label>`;
  const check=(key,label,value)=>`<label><input type="checkbox" data-field="${key}" ${value?'checked':''}>${label}</label>`;
  const shell=(title,commands,body)=>`<div class="lab-office core-windows"><header>Windows 10 · ${title}</header><div class="lab-ribbon">${commands}</div><div class="lab-workspace">${body}</div></div>`;

  register(['y2026q3'],'编辑、保存、断电：看内容留在哪里','先写一段未保存的文字，再保存或断电；比较 RAM、固件和 SSD。',{
    power:true,ram:'第一次学习 RAM',disk:'上次保存的笔记',message:'编辑中的文本在本例 RAM 内；已保存文件在 SSD 上。'
  },s=>controls(btn(s.power?'断开电源':'重新通电','power'))+`<div class="core-memory-grid">
    <section><h4>RAM · 易失性</h4>${s.power?area('ram','正在编辑的文字',s.ram):'<p class="core-empty">断电后，原先的工作内容丢失。</p>'}</section>
    <section><h4>固件存储 · 非易失性</h4><p>开机固件</p><p class="core-status">${s.power?'内容保留，可读取':'内容保留；断电时不能读取执行'}</p></section>
    <section><h4>SSD · 非易失性</h4><p data-saved-file>${esc(s.disk)}</p><p class="core-status">${s.power?'已保存的文件':'断电后文件仍保留'}</p></section>
  </div>`+controls(btn('保存文件','save','',s.power?'':'disabled')+btn('打开已保存文件','load','',s.power?'':'disabled'))+output(s.message)+coach('这是存储位置示意，断电按钮只影响本卡片。固件可以存放在可更新的 Flash 中；“内容断电保留”和“绝对不能改写”是不同属性。'),
  (s,a)=>{if(a==='power'){s.power=!s.power;s.ram='';s.message=s.power?'重新通电不会恢复丢失的编辑内容；可从 SSD 重新打开已保存文件。':'RAM 原内容丢失；固件和 SSD 中的内容保留。';}if(a==='save'&&s.power){s.disk=s.ram;s.message='当前文字已保存到 SSD。继续修改 RAM 不会自动修改这个文件。';}if(a==='load'&&s.power){s.ram=s.disk;s.message='将已保存的文件读入 RAM，重新开始编辑。';}},(s,k,v)=>{if(s.power)s.ram=v;});

  register(['merged-3'],'把位、字节、容量和像素分开算','翻转 8 个二进制位，再切换容量或图像计算；结果由当前输入计算。',{
    mode:'bits',bits:[0,1,0,0,0,0,0,1],amount:'1',unit:'MiB',width:'640',height:'480',depth:'24'
  },s=>{
    let body='';
    if(s.mode==='bits'){
      const value=s.bits.reduce((n,b)=>n*2+b,0);
      body=`<div class="core-bit-row">${s.bits.map((b,i)=>btn(`${b}<small>${2**(7-i)}</small>`,'bit',i,`aria-label="位权${2**(7-i)}，当前${b}" aria-pressed="${!!b}"`)).join('')}</div>`+table(['表示','数值'],[['二进制',s.bits.join('')],['无符号十进制',value],['存储长度','8 bit = 1 B']])+output('翻转某一位改变数值；仍然使用同样的 8 个二进制位。位权从右到左为 1、2、4、8……');
    }else if(s.mode==='size'){
      const factors={B:1,kB:1000,MB:1000000,KiB:1024,MiB:1048576},v=Number(s.amount),valid=s.amount.trim()!==''&&Number.isFinite(v)&&v>=0&&v<=1e9;
      body=controls(field('amount','容量数值',s.amount,'number','min="0" max="1000000000"')+select('unit','容量单位',s.unit,Object.keys(factors).map(k=>[k,k])))+output(valid?`${s.amount} ${s.unit} = ${(v*factors[s.unit]).toLocaleString('zh-CN')} B = ${(v*factors[s.unit]*8).toLocaleString('zh-CN')} bit`:'请输入 0—10亿 的数值。')+coach('标准记号：kB、MB 按 1000 进位；KiB、MiB 按 1024。教材题若明确 KB 按 1024，应按题设换算。b 表示位，B 表示字节。');
    }else{
      const w=Number(s.width),h=Number(s.height),d=Number(s.depth),valid=Number.isInteger(w)&&Number.isInteger(h)&&w>0&&h>0&&w<=100000&&h<=100000;
      body=controls(field('width','宽度（像素）',s.width,'number','min="1" max="100000"')+field('height','高度（像素）',s.height,'number','min="1" max="100000"')+select('depth','每像素位数',s.depth,[['1','1 bit'],['8','8 bit'],['24','24 bit'],['32','32 bit']]))+output(valid?`${w} × ${h} = ${(w*h).toLocaleString('zh-CN')} 像素；像素数据共 ${(w*h*d).toLocaleString('zh-CN')} bit，连续紧密存储需 ${Math.ceil(w*h*d/8).toLocaleString('zh-CN')} B。`:'宽、高应为 1—100000 的整数。')+coach('这里计算未压缩的像素数据，不计文件头、调色板、行对齐等开销；文件实际大小还受编码格式影响。');
    }
    return controls(select('mode','观察内容',s.mode,[['bits','1 字节的 8 个位'],['size','容量换算'],['image','图像像素数据']]))+body;
  },(s,a,v)=>{if(a==='bit')s.bits[Number(v)]=1-s.bits[Number(v)];});

  register(['merged-1'],'让 CPU 从同一存储器中取指和取数','逐拍执行 LOAD、ADD、STORE；看 PC、指令寄存器和运算结果变化。',{
    left:'12',right:'7',pc:0,instruction:0,ir:'—',acc:0,result:0,phase:0,halted:false,bus:'等待取指',active:-1,trace:[]
  },s=>{
    const program=['LOAD 10','ADD 11','STORE 12','HALT'],rows=[...program.map((x,i)=>[i,'指令',x]),[10,'数据',s.left],[11,'数据',s.right],[12,'数据',s.result]];
    return controls(field('left','地址 10 的初始数据',s.left,'number',s.trace.length?'disabled':'min="-1000000000" max="1000000000"')+field('right','地址 11 的初始数据',s.right,'number',s.trace.length?'disabled':'min="-1000000000" max="1000000000"')+btn(s.phase===0?'取指':s.phase===1?'译码':'执行','step','',s.halted?'disabled':'')+btn('重新执行','restart'))+
      `<div class="core-cpu"><section><h4>CPU</h4><p>控制器：协调取指与执行</p><div class="lab-registers"><b>PC = ${s.pc}</b><b>IR = ${s.ir}</b></div><p>运算器：${s.phase===2&&s.instruction===1?'准备加法运算':'算术与逻辑运算'}</p><div class="lab-registers"><b>累加器 = ${s.acc}</b></div></section><section><h4>同一存储器</h4>${table(['地址','本例用途','内容'],rows.map(r=>r.map((v,i)=>s.active===r[0]?`<strong class="lab-highlight">${esc(String(v))}</strong>`:esc(String(v)))))}</section></div>`+output(s.bus)+`<ol class="core-trace">${s.trace.slice(-5).map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`+coach('LOAD 等是便于阅读的教学助记符，机器中存为二进制。PC 保存下一条待取指令的位置；这里暂停在各阶段边界显示数值，不模拟具体处理器流水线。');
  },(s,a)=>{
    if(a==='restart'){Object.assign(s,{pc:0,instruction:0,ir:'—',acc:0,result:0,phase:0,halted:false,bus:'等待取指',active:-1,trace:[]});return;}
    if(a!=='step'||s.halted)return;
    if(!Number.isFinite(Number(s.left))||!Number.isFinite(Number(s.right))||s.left===''||s.right===''||Math.abs(Number(s.left))>1e9||Math.abs(Number(s.right))>1e9){s.bus='本例两项数据都应在 −10亿 至 10亿 之间。';return;}
    const program=['LOAD 10','ADD 11','STORE 12','HALT'];
    if(s.phase===0){s.instruction=s.pc;s.ir=program[s.pc];s.active=s.pc;s.pc++;s.bus=`取指：读取地址 ${s.instruction} 的 ${s.ir}，PC 前进到 ${s.pc}。`;s.phase=1;}
    else if(s.phase===1){s.active=s.instruction;s.bus=`译码：识别 ${s.ir.split(' ')[0]} 操作${s.instruction<3?'及数据地址 '+s.ir.split(' ')[1]:'，准备结束'}。`;s.phase=2;}
    else{if(s.instruction===0){s.acc=Number(s.left);s.active=10;s.bus=`执行 LOAD：读取地址 10，累加器变为 ${s.acc}。`;}if(s.instruction===1){const old=s.acc;s.acc+=Number(s.right);s.active=11;s.bus=`执行 ADD：${old} + ${s.right} = ${s.acc}。`;}if(s.instruction===2){s.result=s.acc;s.active=12;s.bus=`执行 STORE：将 ${s.acc} 写回地址 12。`;}if(s.instruction===3){s.halted=true;s.active=3;s.bus=`执行 HALT：本例程序结束，地址 12 保存 ${s.result}。`;}s.phase=0;}
    s.trace.push(s.bus);
  });

  register(['y2020q24'],'拖动同一个文件，比较同盘、跨盘与组合键','把文件真正拖入目标文件夹；源目录与目标目录分别显示操作后的结果。',{
    source:true,target:[],drive:'C',modifier:'none',mode:'left',menu:false,message:'同盘普通拖动默认移动。可切到 D 盘，或使用 Ctrl / Shift。'
  },s=>controls(select('drive','目标盘符',s.drive,[['C','C: 同一驱动器'],['D','D: 不同驱动器']])+select('modifier','触屏组合键辅助',s.modifier,[['none','不按组合键'],['ctrl','Ctrl：复制'],['shift','Shift：移动'],['link','Ctrl + Shift：快捷方式']])+select('mode','拖动方式',s.mode,[['left','普通拖动'],['right','右键拖动菜单']]))+
    `<div class="lab-file-transfer core-file-transfer"><section><b>源文件夹 C:\\资料</b>${s.source?'<button type="button" data-lab-drag="file" data-lab-act="select" class="lab-file" aria-label="拖动笔记.txt">笔记.txt</button>':'<p>源文件已移走</p>'}</section><section data-file-target><b>目标文件夹 ${s.drive}:\\复习</b>${s.target.length?s.target.map(x=>`<p data-file-result>${esc(x)}</p>`).join(''):'<p>放到这里</p>'}</section></div>`+
    (s.menu?`<div class="lab-context-menu" aria-label="拖放菜单">${btn('复制到这里','copy')}${btn('移动到这里','move')}${btn('创建快捷方式','link')}${btn('取消','cancel')}</div>`:'')+controls(btn('键盘辅助：执行拖放','drop','',s.source?'':'disabled')+btn('重新放回源文件','restore'))+output(s.message)+coach('电脑可在松开鼠标时按住 Ctrl、Shift 或 Ctrl+Shift；触屏辅助选择器在模拟窗口外。停留长按约 0.6 秒可打开操作菜单。本例是普通文件，假定有权限且目标没有同名冲突。'),
  (s,a)=>{
    if(a==='restore'){s.source=true;s.target=[];s.menu=false;s.message='源文件已恢复，可重新比较拖动规则。';return;}
    if(a==='menu'&&s.source){s.menu=true;return;}if(a==='cancel'){s.menu=false;return;}
    if(a==='drop'){if(s.mode==='right'){s.menu=true;return;}a=s.modifier==='ctrl'?'copy':s.modifier==='shift'?'move':s.modifier==='link'?'link':s.drive==='C'?'move':'copy';}
    if(['copy','move','link'].includes(a)&&s.source){const name=a==='link'?'笔记.txt — 快捷方式.lnk':'笔记.txt';if(s.target.includes(name)){s.menu=false;s.message='目标中已存在同名项目，本次操作未执行；可重新放回源文件后再比较。';return;}s.target.push(name);if(a==='move')s.source=false;s.menu=false;s.message=a==='copy'?'已复制：源文件保留，目标新增副本。':a==='move'?'已移动：目标出现文件，源文件夹不再显示它。':'已创建快捷方式：目标保存入口，原文件仍在 C:\\资料。';}
  },(s,k,v)=>{s[k]=v;if(k==='drive'){s.target=[];s.source=true;s.menu=false;s.message='已切换到新的目标文件夹，并恢复示例源文件。';}});
  registry.y2020q24.gesture=(s,g,root)=>{
    if(g.kind!=='file')return;
    const r=root.querySelector('[data-file-target]').getBoundingClientRect();
    if(g.endX<r.left||g.endX>r.right||g.endY<r.top||g.endY>r.bottom){s.message='没有放入目标文件夹，原文件保持不变。';return;}
    if(g.button===2||s.mode==='right'){s.menu=true;return;}
    const key=g.ctrlKey&&g.shiftKey?'link':g.ctrlKey?'copy':g.shiftKey?'move':null;
    registry.y2020q24.action(s,key||'drop');
  };

  const initialFiles=[{id:1,name:'课堂笔记.txt',path:'C:\\资料',state:'source'},{id:2,name:'复习提纲.txt',path:'C:\\资料',state:'source'}];
  register(['y2020q3'],'在文件夹和回收站之间删除、还原','选一个文件再删除，切到回收站检查；Shift+Delete 和特殊位置走不同路径。',{
    files:initialFiles,selected:1,tab:'folder',location:'fixed',bypass:false,confirm:null,message:'本地固定磁盘、回收站启用、文件大小未超过限制。'
  },s=>{
    const list=s.files.filter(f=>f.state===(s.tab==='folder'?'source':'bin'));
    const rows=list.map(f=>[btn(esc(f.name),'select',f.id,`aria-pressed="${s.selected===f.id}"`),esc(s.tab==='bin'?f.path:({fixed:'C:\\资料',usb:'E:\\资料',network:'\\\\服务器\\共享'}[s.location]))]);
    return controls(select('location','示例文件位置',s.location,[['fixed','本地固定磁盘'],['usb','U 盘（本例不支持回收站）'],['network','网络共享（不进本机回收站）']])+check('bypass','本地回收站设置：删除时不移入回收站',s.bypass))+
      shell(s.tab==='folder'?'文件资源管理器':'回收站',btn('资料文件夹','tab','folder',s.confirm?'disabled':'')+btn('回收站','tab','bin',s.confirm?'disabled':''),`<div ${s.confirm?'inert':''}>${table(['名称',s.tab==='folder'?'所在位置':'原位置'],rows)}${!list.length?'<p class="core-empty">这里没有文件。</p>':''}${controls(s.tab==='folder'?btn('删除','delete','',list.some(x=>x.id===s.selected)?'':'disabled'):btn('还原所选项目','restore','',list.some(x=>x.id===s.selected)?'':'disabled')+btn('清空回收站','empty','',list.length?'':'disabled'))}</div>`+
      (s.confirm?dialog('永久删除？',`<p>${s.confirm==='empty'?'回收站中的所有项目':esc(s.files.find(f=>f.id===s.selected)?.name||'文件')}将无法通过本卡片的回收站还原。</p>`,btn('是','confirm')+btn('否','cancel')):''))+
      controls(btn('模拟 Shift + Delete','permanent','',s.confirm||s.tab!=='folder'||!list.some(x=>x.id===s.selected)?'disabled':'')+btn('恢复示例文件','resetFiles'))+output(s.message)+coach('“永久删除”指绕过回收站，不等于已安全擦除存储介质。更换位置会重新载入本例文件。普通 U 盘与网络共享的回收行为不能套用本机固定磁盘的设置。');
  },(s,a,v)=>{
    const item=()=>s.files.find(f=>f.id===s.selected);
    if(a==='resetFiles'){s.files=clone(initialFiles);s.selected=1;s.tab='folder';s.confirm=null;s.message='示例文件已恢复。';return;}
    if(a==='tab'){s.tab=v;s.selected=s.files.find(f=>f.state===(v==='folder'?'source':'bin'))?.id??null;return;}
    if(a==='select'){s.selected=Number(v);return;}if(a==='cancel'){s.confirm=null;return;}
    if(a==='delete'&&item()?.state==='source'){
      if(s.location!=='fixed'||s.bypass)s.confirm='selected';else{item().state='bin';s.message='文件已从资料文件夹移入回收站。切换到回收站可查看原位置并还原。';}
    }
    if((a==='permanent'||a==='delete'&&s.tab==='bin')&&['source','bin'].includes(item()?.state))s.confirm='selected';if(a==='empty')s.confirm='empty';
    if(a==='confirm'){if(s.confirm==='empty')s.files.filter(f=>f.state==='bin').forEach(f=>f.state='deleted');else if(s.confirm&&item())item().state='deleted';s.confirm=null;s.message='已永久删除，回收站内没有可还原副本。';}
    if(a==='restore'&&item()?.state==='bin'){item().state='source';s.message='已还原到原文件夹 C:\\资料。还原会从回收站移除该条目。';}
  },(s,k,v)=>{s[k]=v;if(k==='location'){s.files=clone(initialFiles);s.selected=1;s.tab='folder';s.confirm=null;s.message='已载入该位置的示例文件。';}});
  registry.y2020q3.keydown=(s,e)=>{if(e.key==='Delete'&&!e.target.closest('input,textarea,select')&&!s.confirm){e.preventDefault();registry.y2020q3.action(s,e.shiftKey?'permanent':'delete');return true;}};
  register(['y2025q33'],'粘贴文本与移动文件，不是同一条规则','先复制或剪切，再连续粘贴；也可模拟睡眠，观察剪贴板与源内容。',{
    mode:'text',sourceText:'复习计算机基础',targetText:'',sourceFile:true,targetFile:false,cut:false,buffer:null,sleeping:false,message:'选择文本或文件场景。当前剪贴板为空。'
  },s=>{
    const buffer=s.buffer?s.buffer.kind==='text'?`文本：${esc(s.buffer.value)}`:`文件传输信息：C:\\资料\\笔记.txt（${s.buffer.op==='cut'?'待移动':'复制'}）`:'空';
    return controls(select('mode','观察场景',s.mode,[['text','文本编辑'],['file','文件资源管理器']]))+
      `<div class="core-clipboard"><section><h4>源内容</h4>${s.mode==='text'?area('sourceText','源文本',s.sourceText,s.sleeping?'disabled':''):s.sourceFile?`<p class="core-file-token ${s.cut?'core-cut':''}">笔记.txt</p><p>C:\\资料</p>`:'<p>源文件已移走</p>'}</section><section><h4>当前剪贴板</h4><p data-clipboard>${buffer}</p></section><section><h4>目标位置</h4>${s.mode==='text'?area('targetText','目标文本',s.targetText,s.sleeping?'disabled':''):`<p>D:\\复习</p><p>${s.targetFile?'笔记.txt':'没有文件'}</p>`}</section></div>`+
      controls(btn(s.mode==='text'?'复制整段文本':'复制文件','copy','',s.sleeping?'disabled':'')+btn(s.mode==='text'?'剪切整段文本':'剪切文件','cut','',s.sleeping?'disabled':'')+btn(s.mode==='text'?'粘贴到目标末尾':'粘贴到目标文件夹','paste','',s.sleeping?'disabled':'')+btn(s.sleeping?'唤醒':'模拟正常睡眠','sleep')+btn('清空当前剪贴板','clear'))+
      output(s.message)+coach('文件剪切先标记待移动，粘贴成功才移走源文件。本卡片的文件目标已有同名文件时会阻止重复复制；不会静默新增副本。这里只观察当前剪贴板，Windows历史与Office剪贴板的规则见正文。');
  },(s,a)=>{
    if(a==='sleep'){s.sleeping=!s.sleeping;s.message=s.sleeping?'进入正常睡眠，当前会话的剪贴板内容保留。':'已唤醒，可继续使用之前的当前剪贴板内容。';return;}
    if(a==='clear'){s.buffer=null;s.cut=false;s.message='已清空当前剪贴板；源文件或目标内容不会因此被删除。';return;}
    if(s.sleeping)return;
    if(a==='copy'||a==='cut'){
      s.cut=false;
      if(s.mode==='text'){if(!s.sourceText){s.message='源文本为空，没有可复制的文字。';return;}s.buffer={kind:'text',value:s.sourceText};if(a==='cut')s.sourceText='';s.message=a==='cut'?'所选整段文字已离开源位置，内容保存在剪贴板中。':'文本已复制，源文字保留。';}
      else{if(!s.sourceFile){s.message='源位置没有这个文件。';return;}s.buffer={kind:'file',op:a,value:'笔记.txt'};s.cut=a==='cut';s.message=s.cut?'图标变淡，只标记待移动；源文件仍在原文件夹。':'剪贴板保存文件传输信息，源文件仍保留。';}
    }
    if(a==='paste'){
      if(!s.buffer){s.message='当前剪贴板为空。';return;}
      if(s.buffer.kind!==s.mode){s.message='当前剪贴板类型与目标不匹配，请切换到对应场景。';return;}
      if(s.mode==='text'){s.targetText+=s.buffer.value;s.message='已把文本添加到目标末尾；剪贴板文字仍在，可再次粘贴。';}
      else if(!s.sourceFile){s.message='源文件已不可用，不能从这条文件传输信息再复制。';}
      else if(s.targetFile){s.message='目标已有同名文件，本次未执行。';}
      else{s.targetFile=true;if(s.buffer.op==='cut'){s.sourceFile=false;s.cut=false;s.buffer=null;s.message='粘贴成功，文件已移动到D盘，待移动操作完成。';}else s.message='目标建立文件副本，源文件保留。';}
    }
  });

  register(['y2020q2'],'让置顶窗口盖住活动窗口，再实际输入','点击A或B标题，把键盘输入送到相应文本框；B置顶时不必成为活动窗口。',{
    active:'A',top:true,textA:'A中的笔记',textB:'B中的笔记',focusWindow:null,message:'B当前置顶；点击A标题后，可输入A，同时B仍覆盖在前。'
  },s=>controls(btn(s.top?'取消B置顶':'学习辅助：将B置顶','top'))+`<div class="lab-window-stack core-window-stack">${['A','B'].map((id,i)=>`<section class="lab-sample-window ${s.active===id?'active':''}" data-window="${id}" style="left:${i*15}%;top:${i*100}px;z-index:${id==='B'&&s.top?3:s.active===id?2:1}">${btn(`记事本 ${id}${s.active===id?' · 活动':''}${id==='B'&&s.top?' · 置顶':''}`,'activate',id)}${area('text'+id,'窗口'+id+'的文本',s['text'+id])}</section>`).join('')}</div>`+table(['窗口','实际文本'],[['A',esc(s.textA)],['B',esc(s.textB)]])+output(s.message)+coach('A、B是两个独立文本框。这里的“置顶”是外部学习辅助，不能理解成每个Windows窗口自带该按钮；覆盖次序与键盘输入焦点可以不同。'),
  (s,a,v)=>{if(a==='activate'){s.active=v;s.focusWindow=v;s.message='键盘输入送到窗口'+v+'的文本框。';}if(a==='top')s.top=!s.top;});
  registry.y2020q2.focus=(s,key)=>{if(['textA','textB'].includes(key))s.active=key.slice(-1);};
  registry.y2020q2.afterRender=(s,root)=>{
    const paint=()=>root.querySelectorAll('[data-window]').forEach(el=>{const id=el.dataset.window;el.style.zIndex=String(id==='B'&&s.top?3:s.active===id?2:1);el.classList.toggle('active',s.active===id);el.querySelector('button').textContent=`记事本 ${id}${s.active===id?' · 活动':''}${id==='B'&&s.top?' · 置顶':''}`;});
    root.querySelectorAll('textarea').forEach(el=>el.addEventListener('focus',()=>{s.active=el.dataset.field.slice(-1);paint();}));
    if(s.focusWindow){const id=s.focusWindow;s.focusWindow=null;root.querySelector(`[data-field="text${id}"]`)?.focus({preventScroll:true});}
  };
})();
