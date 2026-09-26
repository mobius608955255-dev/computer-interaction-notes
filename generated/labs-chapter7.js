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
    'syllabus-quantum-basics':[
      ['经典比特','取0或1',[['表示','以确定的二值状态编码'],['读取','读取该比特的值']]],
      ['量子基态','计算基测量为对应结果',[['|0⟩','理想计算基测量得到0'],['|1⟩','理想计算基测量得到1']]],
      ['等幅叠加态','一次测量仍只有一个结果',[['每次重新制备等幅叠加态','分别有50%的概率得到0和1'],['不能推出','一次性读取所有可能答案']]],
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

/* Chapter 7: media. Maintained source; edit this domain directly. */
/* Source provenance: note-labs.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
register(['y2023q19'],'放大同一颗星：路径与像素','调节缩放，比较矢量路径重新绘制与位图像素格显现。',{zoom:1},s=>
    `<div class="lab-controls">${field('zoom','放大倍数',s.zoom,'range','min="1" max="4" step="0.25"')}</div><div class="lab-image-compare"><section><b>矢量路径</b><div><svg viewBox="0 0 100 100" role="img" aria-label="矢量星形"><path transform="translate(50 50) scale(${s.zoom}) translate(-50 -50)" d="M50 12 60 38 88 40 66 58 74 86 50 70 26 86 34 58 12 40 40 38Z" fill="#427b68"/></svg></div></section><section><b>低分辨率位图示意</b><div><svg viewBox="0 0 100 100" shape-rendering="crispEdges" role="img" aria-label="放大后像素格显现"><g transform="translate(50 50) scale(${s.zoom}) translate(-50 -50)">${['000010000','000111000','111111111','011111110','001111100','001111100','011000110','010000010','000000000'].flatMap((r,y)=>[...r].map((v,x)=>v==='1'?`<rect x="${5+x*10}" y="${5+y*10}" width="10" height="10" fill="#427b68"/>`:'')).join('')}</g></svg></div></section></div>${output(`${s.zoom}倍；这里只模拟低分辨率位图，实际像素数越高，在相同放大下块感越不明显。`)}`,()=>{},(s,k,v)=>{s.zoom=Number(v);});
})();

/* Source provenance: note-labs-media.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,esc}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
const fmt=n=>Number(n).toLocaleString('zh-CN',{maximumFractionDigits:3});
const number=(v,min,max)=>String(v).trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max;
function pcm(s){if(!number(s.rate,1,192000)||!number(s.duration,0.001,86400))return null;const bits=Number(s.depth),channels=Number(s.channels);if(![8,16,24,32].includes(bits)||![1,2].includes(channels))return null;if(!Number.isInteger(Number(s.rate)*Number(s.duration)))return null;return {bitrate:Number(s.rate)*bits*channels,bytes:Number(s.rate)*bits*channels*Number(s.duration)/8};}
function samples(s){const rate=Number(s.sample),depth=Number(s.quant),frequency=Number(s.frequency),levels=2**depth;return Array.from({length:rate+1},(_,i)=>{const t=i/rate,raw=Math.sin(2*Math.PI*frequency*t),q=Math.round((raw+1)/2*(levels-1))/(levels-1)*2-1;return {t,raw,q};});}
register(['y2024q32'],'采样取时间点，量化分幅度档，再计算PCM大小','拖动采样率和位深，看同一条波形如何被记录；另页计算真题中的音频数据量。',{
    mode:'wave',frequency:'3',sample:'16',quant:'3',rate:'44100',depth:'16',channels:'1',duration:'120'
  },s=>{
    let body='';if(s.mode==='wave'){
      const dots=samples(s),line=Array.from({length:401},(_,i)=>`${20+i*1.5},${100-70*Math.sin(2*Math.PI*Number(s.frequency)*i/400)}`).join(' '),quant=dots.map(p=>`${20+p.t*600},${100-p.q*70}`).join(' ');
      body=controls(field('frequency',`原波频率：${s.frequency} Hz`,s.frequency,'range','min="1" max="12" step="1"')+select('sample','每秒采样点数',s.sample,[8,16,32,64].map(n=>[n,n+' 次/秒']))+select('quant','每个样本的量化位数',s.quant,[2,3,4,8].map(n=>[n,n+' bit：'+2**n+' 档'])))+
      `<svg class="ext-wave" viewBox="0 0 640 200" role="img" aria-label="1秒波形：平滑曲线是原波，圆点是量化样本，连线仅辅助观察"><path d="M20 100H620 M20 30V170" fill="none" stroke="#b8a9c0"/><polyline points="${line}" fill="none" stroke="#92759e" stroke-width="2"/><polyline points="${quant}" fill="none" stroke="#c34b91" stroke-width="2" stroke-dasharray="4 3"/>${dots.map(p=>`<circle cx="${20+p.t*600}" cy="${100-p.q*70}" r="3.5" fill="#a63877"/>`).join('')}</svg><p>横轴：0—1秒；纵轴：归一化幅度 −1—1。紫线为原波，粉点为样本，虚线仅连接样本帮助观察。</p>`+
      output(`每秒采样 ${s.sample} 次；每个样本 ${s.quant} bit，共 ${2**Number(s.quant)} 个量化档。${Number(s.sample)<=2*Number(s.frequency)?'本次采样率未高于信号最高频率的2倍，可能发生混叠，不能保证重建。':'对本例单频且带限的信号，采样率高于2倍信号频率；真实采集仍需抗混叠滤波等条件。'}`)+
      table(['前6个样本时刻（秒）','采样幅度','量化后幅度'],dots.slice(0,6).map(p=>[p.t.toFixed(3),p.raw.toFixed(3),p.q.toFixed(3)]))+coach('为了看清差别，图中使用教学低频、少量样本和简化均匀量化；不是声卡真实ADC。增加采样率主要改变时间取点密度，增加位深主要细化幅度档位。末端t=1点用于画图，不重复计入“每秒采样点数”。');
    }else{
      const x=pcm(s);body=controls(field('rate','采样率（Hz）',s.rate,'number','min="1" max="192000"')+select('depth','每样本位数',s.depth,[8,16,24,32].map(n=>[n,n+' bit']))+select('channels','声道数',s.channels,[[1,'单声道：1'],[2,'双声道：2']])+field('duration','时长（秒）',s.duration,'number','min="0.001" max="86400"'))+
      (x?`<div class="ext-metrics"><div><b>PCM数据码率</b><span>${fmt(x.bitrate)} bit/s</span></div><div><b>音频数据量</b><span>${fmt(x.bytes)} B</span></div><div><b>二进制容量</b><span>${fmt(x.bytes/1048576)} MiB</span></div></div>`+table(['计算步骤','本次代入'],[['每秒数据量',`${s.rate} × ${s.depth} × ${s.channels} = ${fmt(x.bitrate)} bit/s`],['乘以时间',`${fmt(x.bitrate)} × ${s.duration} = ${fmt(x.bytes*8)} bit`],['位换为字节',`${fmt(x.bytes*8)} ÷ 8 = ${fmt(x.bytes)} B`]]):output('请输入规定范围内的采样率与时长，时长应对应整数个采样点。'))+coach('计算固定样本宽度、未压缩PCM的音频数据，不计文件头等封装开销。kHz先乘1000换Hz，分钟先乘60换秒；不要直接用于MP3码率或MIDI事件文件。');
    }
    return controls(select('mode','观察内容',s.mode,[['wave','看采样与量化'],['pcm','计算PCM音频大小']]))+body;
  },()=>{});
function parsePixels(raw){const tokens=String(raw).trim().split(/[,，\s]+/);if(!tokens.length||tokens.length>24||tokens.some(v=>!/^\d+$/.test(v)||Number(v)>255))return null;return tokens.map(Number);}
const runLength=a=>a.reduce((out,n)=>{if(out.length&&out.at(-1)[0]===n)out.at(-1)[1]++;else out.push([n,1]);return out;},[]);
const swatches=a=>`<div class="ext-swatch-row">${a.map(n=>`<div><i style="background:rgb(${n},${n},${n})"></i><b>${n}</b></div>`).join('')}</div>`;
register(['merged-14'],'先改数据，再压缩：无损保证的是哪一步','编辑一行灰度像素，比较直接无损编码与先减色再编码；解码后逐项核对。',{
    raw:'30,30,30,31,31,31,120,120,120,121,121,121',mode:'lossless',step:'32'
  },s=>{const original=parsePixels(s.raw),valid=original&&number(s.step,1,128),input=valid?(s.mode==='lossless'?original:original.map(v=>Math.min(255,Math.round(v/Number(s.step))*Number(s.step)))):null,runs=input?runLength(input):[],decoded=runs.flatMap(([value,count])=>Array(count).fill(value));
    return controls(field('raw','灰度值（1—24个整数，0—255，逗号分隔）',s.raw)+select('mode','进入无损编码前',s.mode,[['lossless','直接保留原始像素'],['reduce','先减少灰度档位']])+(s.mode==='reduce'?select('step','灰度间隔',s.step,[8,16,32,64,128].map(n=>[n,String(n)])):''))+
      (valid?`<section class="ext-dataset"><h4>原始像素</h4>${swatches(original)}</section><section class="ext-dataset"><h4>进入编码器的像素</h4>${swatches(input)}<p>游程表示（数值 × 连续次数）</p><code class="ext-code">${runs.map(([value,count])=>`${value} × ${count}`).join('；')}</code></section><section class="ext-dataset"><h4>解码后的像素</h4>${swatches(decoded)}</section>`+table(['比较对象','是否完全一致'],[['解码结果 vs 编码器输入','是，游程可逐项还原'],['解码结果 vs 最初像素',decoded.every((n,i)=>n===original[i])?'是':'否，编码前已丢失灰度差别']])+output(`原始序列 ${original.length} 个值；游程 ${runs.length} 组。若值与次数各占1 B，本例原始 ${original.length} B、游程 ${runs.length*2} B。${runs.length*2>original.length?'这次反而变大；无损压缩并不保证每份数据都变小。':''}`):output('请输入1—24个0—255整数，不能夹入文字。'))+
      coach('这是可逆的游程编码教学例子，不是PNG、GIF或JPEG的真实文件编码器。它展示：无损编码能保住输入的数据，却不能恢复此前减色丢掉的信息；游程表示也不等于图像文件实际字节数。');
  },()=>{});
window.NOTE_LABS.mediaMath={pcm,samples,parsePixels,runLength};
})();

/* Media samples share a clock: changing sample frequency never changes motion speed. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,table,output,number,esc}=ui;
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const sample=s=>Math.min(2,Math.floor(s.time*s.fps)/s.fps);
  register(['y2020q38'],'保持运动时长，比较帧率与分辨率','拖动时间轴或播放；每次运动都用2秒完成，帧率只改变采样密度。',{
    fps:24,resolution:'320',time:0,playing:false
  },s=>{
    const width=Number(s.resolution),height=width*3/4,frames=2*s.fps,bytes=width*height*3*frames;
    return controls(select('fps','帧率',s.fps,[[8,'8 fps'],[24,'24 fps'],[60,'60 fps']])+select('resolution','每帧分辨率',s.resolution,[['320','320 × 240'],['640','640 × 480']]))+
      `<div class="lab-sample-track" aria-label="固定2秒运动轨迹"><span style="left:calc(${sample(s)/2*100}% - ${sample(s)/2*30}px)"></span></div>`+
      controls(field('time','时间轴（秒）',s.time,'range','min="0" max="2" step="0.01"')+btn(s.playing?'暂停':'播放','play')+btn('回到起点','start'))+
      table(['参数','本例数值'],[['当前时间 / 采样时刻',`${s.time.toFixed(2)} / ${sample(s).toFixed(3)} 秒`],['帧率 / 总帧数',`${s.fps} fps / ${frames} 帧`],['RGB 24位未压缩视频',`${width} × ${height} × 3 B × ${frames} = ${bytes.toLocaleString('zh-CN')} B`]])+
      output('提高帧率使相同轨迹的相邻画面更密；分辨率长宽各翻倍，每帧像素数变为4倍。这里不计音频、文件头和压缩，屏幕轨迹用于表示采样位置。');
  },(s,a)=>{if(a==='play'){if(s.time>=2)s.time=0;s.playing=!s.playing;if(s.playing)s.startedAt=performance.now()-s.time*1000;}if(a==='start'){s.time=0;s.playing=false;}},(s,k,v)=>{if(k==='time'){s.time=number(v,0,2);s.playing=false;}else s[k]=k==='fps'?Number(v):v;});
  registry.y2020q38.tickInterval=16;
  registry.y2020q38.tick=s=>{if(!s.playing)return false;s.time=Math.min(2,(performance.now()-s.startedAt)/1000);if(s.time===2)s.playing=false;return true;};
  registry.y2020q38.frameKey=s=>`${s.playing}:${s.fps}:${s.resolution}`;
  registry.y2020q38.patchFrame=(s,root)=>{const patched=ui.patchRegions(root,registry.y2020q38.render(s),['.lab-sample-track','.lab-table-scroll']);const slider=root.querySelector('[data-field="time"]');slider.value=slider.defaultValue=String(s.time);return patched;};

  register(['y2023q18'],'拖动播放头，观察下载与缓冲的关系','调整下载速度，启动播放后逐秒推进；拖到未下载的位置会等待数据。',{
    position:0,downloaded:12,rate:2,playing:false,message:'总长30秒；初始已顺序下载12秒。速度单位表示每秒下载多少秒的媒体数据。'
  },s=>{
    const buffer=Math.max(0,s.downloaded-s.position),waiting=s.playing&&s.position>=s.downloaded&&s.position<30;
    return controls(select('rate','示例下载速度',s.rate,[[0,'0：断网'],[.5,'0.5：慢于播放'],[1,'1：等于播放'],[2,'2：快于播放']]))+
      `<div class="lab-stream-track"><div style="width:${s.downloaded/30*100}%"></div><i style="left:${s.position/30*100}%"></i></div>`+
      controls(field('position','拖动播放头（秒）',s.position,'range','min="0" max="30" step="0.5"')+btn(s.playing?'暂停播放':'播放','play')+btn('推进1秒','tick'))+
      table(['状态','秒'],[['已下载到',s.downloaded.toFixed(1)],['播放到',s.position.toFixed(1)],['前方已缓冲',buffer.toFixed(1)]])+
      output(`${s.position===30?'播放完毕':waiting?'等待下载':s.playing?'正在播放':'已暂停'}。${esc(s.message)}`)+
      '<p class="core-caption">本例只模拟从开头顺序下载；真实流媒体还可分段请求、切换码率。HTTPS保护传输，不能保证带宽充足或消除卡顿。</p>';
  },(s,a)=>{if(a==='play'){if(s.position===30)s.position=0;s.playing=!s.playing;}if(a==='tick'){s.downloaded=Math.min(30,s.downloaded+s.rate);if(s.playing)s.position=Math.min(30,Math.max(s.position,Math.min(s.position+1,s.downloaded)));if(s.position===30)s.playing=false;s.message='位置、填充长度与缓冲均由同一时间状态计算。';}},
    (s,k,v)=>{s[k]=k==='position'?number(v,0,30):Number(v);if(k==='position')s.message='播放头已移动；超过已下载位置时，前方可播放缓冲为0。';});
})();

/* Focused image models: raw pixels and editing scope, not a file encoder or Photoshop. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {field,select,btn,table,output,coach,esc}=ui;
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const integer=(value,max)=>String(value).trim()!==''&&Number.isInteger(Number(value))&&Number(value)>=1&&Number(value)<=max;
  const formats={mono:{bits:1,label:'1位黑白',colors:'2种黑白状态'},gray:{bits:8,label:'8位灰度',colors:'256个灰度值'},rgb:{bits:24,label:'RGB：3 × 8位',colors:'16777216种RGB组合'},rgba:{bits:32,label:'RGBA：4 × 8位',colors:'16777216种RGB组合；另有256级Alpha'}};
  function size(s){
    if(!integer(s.width,16384)||!integer(s.height,16384)||!integer(s.ppi,2400)||!formats[s.mode])return {error:'本演示仅接受1—16384的整数像素宽高与1—2400的整数PPI；请输入范围内数值。整数PPI是演示输入限制，不是实际图像格式规则。'};
    const width=Number(s.width),height=Number(s.height),ppi=Number(s.ppi),format=formats[s.mode],pixels=width*height,bits=pixels*format.bits;
    return {width,height,ppi,format,pixels,bits,bytes:bits/8,minimumBytes:Math.ceil(bits/8),cmWidth:width/ppi*2.54,cmHeight:height/ppi*2.54};
  }
  register(['y2020q27'],'改变像素、位深与PPI，分别看容量和打印尺寸','像素数据量按宽×高×位数计算；只改PPI时像素数保持。',{
    width:'800',height:'600',mode:'rgb',ppi:'300'
  },s=>{
    const v=size(s),inputs=controls(field('width','宽（像素）',s.width,'number','min="1" max="16384" step="1"')+field('height','高（像素）',s.height,'number','min="1" max="16384" step="1"')+select('mode','像素表示',s.mode,Object.entries(formats).map(([k,f])=>[k,f.label]))+field('ppi','打印PPI（不重新采样）',s.ppi,'number','min="1" max="2400" step="1"'));
    return inputs+(v.error?output(esc(v.error)):
      `<div data-image-size data-pixels="${v.pixels}" data-bits="${v.bits}" data-bytes="${v.bytes}" data-minimum-bytes="${v.minimumBytes}">`+
      table(['量','计算与结果'],[['像素数',`${v.width} × ${v.height} = ${v.pixels.toLocaleString('zh-CN')}`],['未压缩像素位数',`${v.pixels.toLocaleString('zh-CN')} × ${v.format.bits} = ${v.bits.toLocaleString('zh-CN')} bit`],['换成Byte',`${v.bits.toLocaleString('zh-CN')} ÷ 8 = ${v.bytes.toLocaleString('zh-CN')} B`],['容量前缀',`${(v.bytes/1e6).toFixed(6)} MB；${(v.bytes/1048576).toFixed(6)} MiB`],['颜色与Alpha',v.format.colors],['打印宽 × 高',`${v.cmWidth.toFixed(3)} × ${v.cmHeight.toFixed(3)} cm（${v.ppi} PPI）`]])+'</div>'+
      output(Number.isInteger(v.bytes)?'仅计像素数据。PPI改变纸面尺寸；像素数与位数不变时，上面的bit和B保持。':`公式得到${v.bytes} B是理论位数换算；按整字节装入至少需${v.minimumBytes} B。不能把零碎字节当成真实文件大小。`))+
      coach('本例不生成图片文件，不计调色板、文件头、每行填充或压缩。真实格式可能有额外开销；RGBA32中的8位Alpha表示透明度，不是额外的RGB颜色。PPI不等于打印机DPI。');
  },()=>{});

  const initialImage=()=>({width:8,height:6,pixels:Array.from({length:48},(_,i)=>{
    const x=i%8,y=Math.floor(i/8);return x>=2&&x<=5&&y>=1&&y<=4?(x===2||y===1?'#b64637':'#25658b'):null;
  })});
  function edit(image,width,height,operation){
    if(!integer(width,16)||!integer(height,16))return {error:'本演示宽高须为1—16整数像素；无效输入不修改已确认图像。'};
    if(!['resample','canvas'].includes(operation))return {error:'本演示只支持重新采样与画布裁扩。'};
    width=Number(width);height=Number(height);
    const pixels=Array.from({length:width*height},(_,i)=>{
      const x=i%width,y=Math.floor(i/width);
      if(operation==='canvas')return x<image.width&&y<image.height?image.pixels[y*image.width+x]:null;
      const sx=Math.min(image.width-1,Math.floor((x+.5)*image.width/width)),sy=Math.min(image.height-1,Math.floor((y+.5)*image.height/height));
      return image.pixels[sy*image.width+sx];
    });
    return {width,height,pixels};
  }
  function grid(image,label,role){
    const colored=image.pixels.filter(x=>x!==null).length;
    return `<div data-image-${role} data-width="${image.width}" data-height="${image.height}" data-colored="${colored}"><h4>${label}：${image.width} × ${image.height}</h4>`+
      `<svg role="img" aria-label="${label}像素网格，${colored}个有色像素；灰白格为透明" viewBox="0 0 ${image.width*20} ${image.height*20}" style="width:100%;max-width:480px;height:auto;display:block">`+
      image.pixels.map((color,i)=>{const x=i%image.width,y=Math.floor(i/image.width);return `<rect data-pixel="${x},${y}" data-color="${color||'transparent'}" x="${x*20}" y="${y*20}" width="20" height="20" fill="${color||((x+y)%2?'#e3e7eb':'#f7f8fa')}" stroke="#b4bec8" stroke-width="0.4"/>`;}).join('')+'</svg></div>';
  }
  register(['syllabus-image-editing'],'相同目标尺寸：缩放像素，还是改变画布？','先预览；取消保留已确认图像，应用后才改变像素阵列。',{
    image:initialImage(),width:'12',height:'9',operation:'resample',preview:null,message:'初始8×6像素；灰白格表示透明，彩色主体位于中间。'
  },s=>controls(select('operation','操作',s.operation,[['resample','图像大小：重新采样'],['canvas','画布大小：固定左上锚点']])+field('width','目标宽（像素）',s.width,'number','min="1" max="16" step="1"')+field('height','目标高（像素）',s.height,'number','min="1" max="16" step="1"'))+
    controls(btn('预览','preview')+btn('应用','apply')+btn('取消草稿','cancel'))+
    grid(s.image,'已确认图像','committed')+(s.preview?grid(s.preview,'待确认预览','preview'):'')+
    output(esc(s.message))+
    coach('只模拟小像素图：重新采样用最近邻方法；画布锚点固定左上，新增区透明，缩小时丢弃右侧/下侧越界像素。真实软件可换锚点、背景和插值方法；本例没有完整图层、撤销历史或文件保存。重复操作以上次已应用结果为起点，重置可回到原图。'),
  (s,a)=>{
    if(a==='preview'){
      const next=edit(s.image,s.width,s.height,s.operation);
      if(next.error){s.preview=null;s.message=next.error;return;}
      s.preview=next;s.message=s.operation==='resample'?'待确认：整幅图像重新取样，主体随网格变化；还没有修改已确认图像。':'待确认：左上锚点不动，原像素不等比缩放；裁去的部分不会因稍后扩大画布而自动恢复。';
    }
    if(a==='apply'){
      if(!s.preview){s.message='请先生成有效预览；已确认图像保持不变。';return;}
      s.image=structuredClone(s.preview);s.preview=null;s.message='已应用：下次操作从当前像素阵列开始。可比较有色区域的位置、大小及透明边缘。';
    }
    if(a==='cancel'){s.preview=null;s.width=String(s.image.width);s.height=String(s.image.height);s.message='草稿已取消，已确认图像保持不变。';}
  },(s,k,v)=>{s[k]=v;s.preview=null;s.message='参数已改变，请重新预览；旧预览不会被误应用。';});
  window.NOTE_LABS.imageMath={size,edit};
})();
