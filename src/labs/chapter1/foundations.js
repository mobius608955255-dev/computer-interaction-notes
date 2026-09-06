/* Chapter 1: foundations. Maintained source; edit this domain directly. */
/* Source provenance: note-labs.js:2. Preserve this closure. */
(() => {
'use strict';
const {radixConvert}=window.NOTE_LABS;
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
register(['y2022q4'],'沿三条总线完成一次取数','分别发出地址、读信号与返回数据，观察方向和用途。', {signal:'address'}, s => {
    const signals={address:['地址总线','CPU → 内存','地址 0x0020'],control:['控制信号','CPU → 内存','READ：读'],data:['数据总线','内存 → CPU','内容 42'],interrupt:['控制信号','设备 → CPU','IRQ：中断请求']};
    const x=signals[s.signal];
    return `<div class="lab-bus"><div class="lab-chip">CPU<small>地址寄存器 / 数据寄存器</small></div><div class="lab-wires">${['地址','数据','控制'].map((v,i)=>`<div class="${['address','data','control'][i]===s.signal || i===2&&s.signal==='interrupt'?'active':''}">${v} ━━━━━━━━━</div>`).join('')}</div><div class="lab-chip">内存 / 设备<small>0x0020 → 42</small></div></div><div class="lab-controls">${Object.entries(signals).map(([k,v])=>btn(v[2],'signal',k)).join('')}</div>${output(`${x[0]}：${x[1]}；传送 ${x[2]}。`)}`;
  },(s,a,v)=>{s.signal=v;});
register(['y2026q41'],'以小数点为界，四位二进制变一位十六进制','输入二进制数，观察补零位置、分组和结果随输入改变。',{raw:'100010.01'},s=>{
    const x=radixConvert(s.raw);return `<div class="lab-controls">${field('raw','二进制数',s.raw)}</div>${x?`<div class="lab-radix"><code>${x.binary}</code><span>每组 4 bit ↓</span><strong>${x.hex}₁₆</strong><p>十进制校验：${x.decimal}</p></div>`:output('请输入最多16位整数、12位小数的二进制数，仅含0和1。')}${coach('整数左端补0，小数右端补0；不跨小数点凑组。0.1₁₀的二进制展开无限循环，不能用有限补零把它写成精确有限值。')}`;
  },()=>{});
})();

/* Source provenance: note-labs-audit.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui,clusteredChart,daysBetween}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
register(['y2025q2'],'字符的编码和字形是两件事','输入一个字符，再改变字体；码位与字节会显示，字形外观单独变化。',{char:'G',font:'serif',size:40},s=>{
 const c=[...s.char][0]||'',cp=c.codePointAt(0),bytes=c?Array.from(new TextEncoder().encode(c)):[];
 return controls(field('char','一个字符',s.char)+select('font','字体',s.font,[['serif','宋体风格'],['sans-serif','黑体风格'],['monospace','等宽']])+field('size','显示字号',s.size,'range','min="24" max="64"'))+`<div class="lab-glyph" style="font-family:${s.font};font-size:${s.size}px">${esc(c||'—')}</div>`+table(['表示','实际值'],[['Unicode码位',cp===undefined?'—':'U+'+cp.toString(16).toUpperCase().padStart(4,'0')],['UTF-8字节',bytes.map(x=>x.toString(16).toUpperCase().padStart(2,'0')).join(' ')||'—'],['标准ASCII',cp<128?`${cp} = ${cp.toString(16).toUpperCase()}H`:'不在7位ASCII范围内']])+output('字形改变不改变字符码位。这里显示UTF-8，不把Unicode码位或UTF-8字节称为GB2312机内码。GB2312双字节汉字机内码还须满足各自有效码位规则。');
},()=>{});
})();

/* Source provenance: note-labs-core.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,esc}=ui;
const controls=html=>`<div class="lab-controls">${html}</div>`;
const area=(key,label,value,extra='')=>`<label>${label}<textarea data-field="${key}" rows="3" ${extra}>${esc(value)}</textarea></label>`;
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
})();
