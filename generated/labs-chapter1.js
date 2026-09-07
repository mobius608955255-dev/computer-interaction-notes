// Generated from src/labs; edit the corresponding chapter source.
/* Shared lab calculations. Runtime must load first. */
(() => {
'use strict';
const {esc}=window.NOTE_LABS.ui;
const daysBetween=(a,b)=>Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000);
const radixConvert = raw => {
    if(!/^[01]{1,16}(\.[01]{1,12})?$/.test(raw))return null;
    const [whole,frac='']=raw.split('.');
    const left=whole.padStart(Math.ceil(whole.length/4)*4,'0');const right=frac.padEnd(Math.ceil(frac.length/4)*4,'0');
    const groups=x=>x.match(/.{4}/g)||[];
    return {binary:[groups(left).join(' '),groups(right).join(' ')].filter(Boolean).join(' . '),hex:parseInt(whole,2).toString(16).toUpperCase()+(frac?'.'+groups(right).map(x=>parseInt(x,2).toString(16).toUpperCase()).join(''):''),decimal:parseInt(whole,2)+[...frac].reduce((sum,v,i)=>sum+Number(v)*2**(-i-1),0)};
  };
function clusteredChart(labels,series){
    const all=series.flatMap(x=>x.values),max=Math.max(1,...all),group=420/labels.length,bw=Math.min(40,group/(series.length+1));
    return `<svg class="lab-data-chart" viewBox="0 0 480 270" role="img" aria-label="簇状柱形图"><line x1="40" x2="460" y1="220" y2="220" stroke="#687482"/>${labels.map((label,i)=>series.map((x,j)=>{const h=Number(x.values[i])/max*165,xp=40+i*group+15+j*bw;return `<rect x="${xp}" y="${220-h}" width="${bw-5}" height="${h}" fill="${x.color}"/><text x="${xp+(bw-5)/2}" y="${210-h}" text-anchor="middle">${x.values[i]}</text>`;}).join('')+`<text x="${40+i*group+group/2}" y="244" text-anchor="middle">${esc(label)}</text>`).join('')}</svg><div class="lab-chart-legend">${series.map(x=>`<span><i style="background:${x.color}"></i>${esc(x.name)}</span>`).join('')}</div>`;
  }
Object.assign(window.NOTE_LABS,{radixConvert,daysBetween,clusteredChart});
})();

/* Independent comparisons are labelled as such; they do not imitate saved operations. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,table,output,esc}=ui;
  const comparisons={
    'syllabus-word-smartart':[
      ['流程布局','按步骤组织内容',[['登记 → 审核 → 归档','依次进行的三步'],['增加步骤','选相邻形状，再从设计中添加形状']]],
      ['层次布局','表示上下级关系',[['学校 → 院系 → 班级','不是按时间排列的三个动作'],['修改对象','先分清文字、形状与整幅SmartArt']]],
      ['截图后的流程','只剩画面快照',[['图片','可以缩放、裁剪'],['结构','不能再按SmartArt节点添加形状']]]
    ],
    'syllabus-word-screen-clipping':[
      ['可用视窗','插入一个完整窗口的快照',[['准备','打开目标窗口，保持未最小化'],['入口','Word → 插入 → 屏幕截图 → 选择窗口缩略图']]],
      ['屏幕剪辑','只插入拖选的矩形区域',[['选择','拖出需要的对话框或局部内容'],['结果','插入的是图片，源窗口改变不会同步修改它']]]
    ],
    'syllabus-media-edit-export':[
      ['编辑工程','保留剪辑结构供继续修改',[['保存','轨道、片段位置、效果与素材引用'],['迁移','同时核对所需素材，工程文件不一定内含全部媒体']]],
      ['导出音频','产生可播放的声音文件',[['设置','格式、声道与编码参数'],['检查','预听起止点，多轨按需要混合']]],
      ['导出视频','产生按时间播放的成片',[['设置','分辨率、帧率、编码与保存位置'],['检查','重新播放，核对起止画面、音画同步']]]
    ],
    'syllabus-document-coauthor':[
      ['共享查看链接','同一份云端文档',[['参与者','可以阅读，不能直接改正文'],['讨论与编辑','需要相应功能及权限；查看权不等于编辑权']]],
      ['共享编辑链接','同一份云端文档',[['参与者','具备编辑权限时可协同修改'],['收尾','核对同步状态与版本，避免相互覆盖']]],
      ['发送附件','每位接收者得到独立副本',[['内容位置','改动保存在各自文件中'],['合并','需要另外汇总，不能自动视为共同编辑']]],
      ['批注与修订','讨论和审阅是不同动作',[['批注','提出意见，不直接替换正文'],['修订','记录文字增删，接受或拒绝决定最终文本']]]
    ],
    'syllabus-office-exchange':[
      ['DOCX','继续编辑结构化文档',[['保留','段落样式、表格、图片等文档结构'],['核对','跨软件打开后检查字体、分页和对象']]],
      ['TXT','交换纯文本',[['保留','字符与换行'],['不保留','复杂版面、字符富格式和嵌入图片']]],
      ['PDF','按固定页面阅读或打印',[['重点','检查导出后的页数和版面'],['编辑','PDF可有编辑工具，但不等于保留完整Word源结构']]]
    ],
    'syllabus-ppt-output':[
      ['讲义打印','一张纸包含多张幻灯片',[['适合','课堂分发、并排查看'],['检查','每页张数、顺序、缩放和可读性']]],
      ['备注页打印','幻灯片与演讲者备注同页',[['适合','演讲者准备讲稿'],['区别','大纲打印侧重标题和文本层级']]],
      ['导出PDF','固定页面供阅读',[['保留目标','页面外观与可支持的链接'],['动态效果','不会按放映时间执行动画和切换']]],
      ['导出视频','按时间形成连续画面',[['检查','旁白、对象动画和幻灯片计时'],['编辑源','仍保留PPTX，成片不保留可编辑幻灯片结构']]]
    ],
    'syllabus-quantum-basics':[
      ['经典比特','取0或1',[['表示','以确定的二值状态编码'],['读取','读取该比特的值']]],
      ['量子基态','计算基测量为对应结果',[['|0⟩','理想计算基测量得到0'],['|1⟩','理想计算基测量得到1']]],
      ['等幅叠加态','一次测量仍只有一个结果',[['理想重复实验','分别有50%的概率得到0和1'],['不能推出','一次性读取所有可能答案']]],
      ['纠缠','多个量子系统有不可独立分解的关联',[['利用','量子信息处理中的关联资源'],['边界','不能据此超光速发送可控消息']]]
    ],
    'syllabus-mobile-communication':[
      ['蜂窝上网','手机通过移动通信网络接入',[['终端到网络','蜂窝无线链路'],['体验','受覆盖、终端能力与网络负载影响']]],
      ['手机热点','笔记本到互联网分为两段',[['笔记本 → 手机','通常是Wi-Fi'],['手机 → 运营商','移动通信网络；不是5 GHz Wi-Fi']]],
      ['5G应用方向','三个方向关注不同目标',[['增强移动宽带','高数据速率业务'],['大规模机器通信','大量设备连接'],['超可靠低时延通信','对时效与可靠性敏感的业务']]]
    ]
  };
  for(const note of window.NOTES.notes){
    const cases=comparisons[note.id];if(!cases)continue;
    register([note.id],note.title,'选择一个独立情境，观察对象、作用与结果的对应关系。',{scenario:0},s=>
      `<div class="lab-controls">${cases.map((entry,i)=>btn(esc(entry[0]),'scenario',i,`aria-pressed="${s.scenario===i}"`)).join('')}</div>`+
      table(['观察对象','含义'],cases[s.scenario][2].map(row=>row.map(esc)))+output(esc(cases[s.scenario][1]))+
      '<p class="core-caption">独立情境对照 · 切换情境用于比较概念。</p>',(s,a,v)=>{if(a==='scenario')s.scenario=Number(v);});
  }
})();

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

/* One column at a time: each borrowed unit changes the donor column. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {field,btn,table,output,esc}=ui;
  register(['y2020q31'],'逐位借位完成二进制减法','输入两个二进制整数，从右侧逐位相减，观察借位怎样经过中间的0。',{
    a:'10000',b:'00001',top:null,bottom:[],result:[],index:-1,rows:[],message:'本例处理不超过12位且被减数不小于减数的非负整数。'
  },s=>`<div class="lab-controls">${field('a','被减数（二进制）',s.a,'text','maxlength="12" inputmode="numeric"')}${field('b','减数（二进制）',s.b,'text','maxlength="12" inputmode="numeric"')}${btn('载入算式','load')}${btn('计算当前位','step','',s.index<0?'disabled':'')}</div>`+
    (s.top?table(['位权',...s.top.map((_,i)=>'2^'+(s.top.length-1-i))],[['被减数当前各位',...s.top.map((v,i)=>i===s.index?`<b class="lab-highlight">${v}</b>`:v)],['减数',...s.bottom],['已求出的差',...s.result.map(v=>v??'·')]]):'')+output(esc(s.message))+(s.rows.length?`<ol class="lab-borrow-log">${s.rows.map(row=>`<li>${esc(row)}</li>`).join('')}</ol>`:''),
  (s,a)=>{
    if(a==='load'){
      if(!/^[01]{1,12}$/.test(s.a)||!/^[01]{1,12}$/.test(s.b)||parseInt(s.a,2)<parseInt(s.b,2)){s.top=null;s.index=-1;s.rows=[];s.message='请使用1—12位的0和1，且被减数不能小于减数。';return;}
      const length=Math.max(s.a.length,s.b.length);s.top=[...s.a.padStart(length,'0')].map(Number);s.bottom=[...s.b.padStart(length,'0')].map(Number);s.result=Array(length).fill(null);s.index=length-1;s.rows=[];s.message='从最右一位开始；若不够减，向左侧有1的位借。';
    }
    if(a==='step'&&s.index>=0){
      const i=s.index,power=s.top.length-1-i;let text=`2^${power}位：`;
      if(s.top[i]<s.bottom[i]){
        let donor=i-1;while(donor>=0&&!s.top[donor])donor--;
        s.top[donor]--;const chain=[];
        for(let j=donor+1;j<i;j++){s.top[j]=1;chain.push('2^'+(s.top.length-1-j));}
        s.top[i]+=2;text+=`向2^${s.top.length-1-donor}位借1，该位减1；${chain.length?chain.join('、')+'经过借位后各剩1；':''}本位得到2。`;
      }
      s.result[i]=s.top[i]-s.bottom[i];text+=`${s.top[i]}−${s.bottom[i]}=${s.result[i]}。`;s.rows.push(text);s.index--;
      s.message=s.index<0?`完成：${s.a}₂ − ${s.b}₂ = ${s.result.join('')}₂；十进制核验 ${parseInt(s.a,2)}−${parseInt(s.b,2)}=${parseInt(s.result.join(''),2)}。`:text;
    }
  },(s,k,v)=>{s[k]=v;s.top=null;s.index=-1;s.rows=[];s.message='算式已改变，请重新载入。';});
})();
