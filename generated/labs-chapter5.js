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

/* Chapter 5: presentation. Maintained source; edit this domain directly. */
/* Source provenance: note-labs.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
const textsForOutline=['年度销售总结','总销量增长15%','下一年度计划','提高服务质量'];
register(['y2022q72'],'Word大纲如何变成一套幻灯片','改变段落层级，导入后点击缩略图，检查内容属于哪一页。',{levels:[1,2,1,2],slides:[],page:0},s=>{
    const texts=['年度销售总结','总销量增长15%','下一年度计划','提高服务质量'];
    return `<div class="lab-outline-source"><b>源文档 · 标题层级</b>${texts.map((t,i)=>select('level'+i,t,s.levels[i],[[1,'标题1'],[2,'标题2'],[0,'正文']])).join('')}</div>`+office('PowerPoint','开始',btn('新建幻灯片 ▾ → 幻灯片（从大纲）','import'),`<div class="lab-deck"><aside>${s.slides.map((x,i)=>btn(`${i+1}　${esc(x.title)}`,'page',i,`aria-pressed="${s.page===i}"`)).join('')||'尚未导入'}</aside><div class="lab-slide">${s.slides[s.page]?`<h3>${esc(s.slides[s.page].title)}</h3><ul>${s.slides[s.page].items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'空白演示文稿'}</div></div>`)+output(s.slides.length?`已生成${s.slides.length}张幻灯片。改变源大纲后可再次导入观察。`:'标题1拆分页面，标题2附属于最近的标题1；全文没有标题1/2时，每段生成一页。');
  },(s,a,v)=>{if(a==='page')s.page=Number(v);if(a==='import'){s.slides=[];['年度销售总结','总销量增长15%','下一年度计划','提高服务质量'].forEach((t,i)=>{if(s.levels[i]===1)s.slides.push({title:t,items:[]});else if(s.levels[i]===2&&s.slides.length)s.slides.at(-1).items.push(t);});if(s.levels.every(level=>level===0))s.slides=textsForOutline.map(title=>({title,items:[]}));s.page=0;}},(s,k,v)=>{s.levels[Number(k.slice(5))]=Number(v);});
})();

/* Source provenance: note-labs-2021.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui} = window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money} = ui;
const area=(name,label,value,extra='')=>`<label>${label}<textarea data-field="${name}" ${extra}>${esc(value)}</textarea></label>`;
register(['y2021q10'],'在空白幻灯片上真正拖出文本框','先选择文本框工具，在画布内按住拖动，再输入文字。',{tool:false,box:null,text:'',message:'单击空白背景不会自动建立文本对象。'},s=>
    office('PowerPoint','插入',btn('文本框','tool','',`aria-pressed="${s.tool}"`),`<div class="lab-draw-slide" ${s.tool?'data-lab-drag="box"':''} aria-label="空白幻灯片画布">${s.box?`<div class="lab-drawn-box" style="left:${s.box.x}%;top:${s.box.y}%;width:${s.box.w}%;height:${s.box.h}%">${area('text','文本框内容',s.text,'aria-label="文本框内容"')}</div>`:'<span class="lab-canvas-hint">在这里拖出文本区域</span>'}</div>`)+`<div class="lab-controls">${btn('键盘辅助：创建文本框','create')}${btn('删除文本框','delete','',s.box?'':'disabled')}</div>${output(s.message)}`,
    (s,a)=>{if(a==='tool'){s.tool=!s.tool;s.message=s.tool?'文本框工具已就绪，请在画布内拖动。':'已退出文本框工具，可以滑动页面或编辑已有文字。';}if(a==='create'){s.box={x:10,y:20,w:75,h:45};s.tool=false;s.message='已创建文本框，可在对象内输入。';}if(a==='delete'){s.box=null;s.text='';s.message='文本对象已删除，幻灯片背景仍保留。';}});
registry.y2021q10.gesture=(s,g)=>{if(g.kind==='box'&&s.tool&&g.box){const b=g.box,minW=Math.min(100,Math.max(25,120/(g.rect?.width||480)*100)),minH=Math.min(100,Math.max(35,110/(g.rect?.height||300)*100));b.x=Math.min(b.x,100-minW);b.y=Math.min(b.y,100-minH);b.w=Math.max(minW,Math.min(b.w,100-b.x));b.h=Math.max(minH,Math.min(b.h,100-b.y));s.box=b;s.tool=false;s.message='拖动创建了一个文本框；文字属于此对象，不属于背景。';}};
})();

/* Source provenance: note-labs-audit.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui,clusteredChart,daysBetween}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
register(['y2023q35'],'跨页音频与留在本页的视频分别播放','分别启动音频、视频，再切到另一页查看各自状态。',{cross:true,loop:false,rewind:false,page:1,audio:{playing:false,time:0},video:{playing:false,time:0}},s=>
 office('PowerPoint','音频工具 · 播放',select('cross','跨幻灯片播放',String(s.cross),[['true','启用'],['false','关闭']])+select('loop','循环播放直到停止',String(s.loop),[['false','关闭'],['true','启用']])+select('rewind','播完返回开头',String(s.rewind),[['false','关闭'],['true','启用']]),`<div class="lab-slide"><h3>第${s.page}页</h3>${s.page===1?`<div class="lab-video-frame">视频：${s.video.playing?'播放':'停止'} ${s.video.time}/20秒</div>`:'<p>此页没有视频对象。</p>'}<p>音频：${s.audio.playing?'播放':'停止'} ${s.audio.time}/20秒</p></div>`)+controls(btn('播放音频','audio')+btn('播放视频','video','',s.page===1?'':'disabled')+btn('推进5秒（学习控制）','tick')+btn('下一页','next')+btn('返回第1页','first'))+output('音频的跨页、循环、返回开头是三个独立设置；换页后的视频不会自动继续或在返回时自动重播。'),
 (s,a)=>{if(a==='audio'){s.audio.playing=true;if(s.audio.time===20)s.audio.time=0;}if(a==='video'&&s.page===1){s.video.playing=true;if(s.video.time===20)s.video.time=0;}if(a==='tick'){for(const k of ['audio','video']){const m=s[k];if(!m.playing)continue;m.time+=5;if(m.time>=20){if(k==='audio'&&s.loop)m.time=0;else{m.playing=false;m.time=k==='audio'&&s.rewind?0:20;}}}}if(a==='next'||a==='first'){s.page=a==='first'?1:s.page%3+1;s.video.playing=false;s.video.time=0;if(!s.cross){s.audio.playing=false;s.audio.time=0;}}},(s,k,v)=>{s[k]=v==='true';});
register(['y2026q54'],'保持混合字号关系，处理文字溢出','先看对象是正文占位符还是普通文本框，再比较缩小文字与扩大形状。',{object:'placeholder',menu:false,format:false,mode:'none',page:1},s=>{
 const scale=s.mode==='shrink'?2/3:1,lines=[['研究背景',24],['数据来源与分析过程',18],['结果讨论与后续计划',18]],shown=s.mode==='split'?(s.page===1?lines.slice(0,1):lines.slice(1)):lines;
 return controls(select('object','对象类型',s.object,[['placeholder','正文占位符'],['textbox','普通文本框']]))+office('PowerPoint','开始',btn('右击对象 → 设置形状格式…','format'),
  `<div class="lab-slide"><div class="lab-placeholder ${s.mode==='shape'?'grow':''}" style="line-height:${s.mode==='shrink'?'1.25':'1.5'}">${shown.map(([text,size])=>`<p style="font-size:${size*scale}px">${text}</p>`).join('')}${s.object==='placeholder'?btn('↕','menu','','class="lab-autofit" aria-label="自动调整选项"'):''}</div>${s.menu?`<div class="lab-context-menu" role="group" aria-label="占位符自动调整选项">${btn('根据占位符自动调整文本','shrink')}${btn('停止根据占位符调整文本','none')}${btn('拆分为两张幻灯片','split')}</div>`:''}</div>`+
  (s.format?dialog('设置形状格式 → 文本选项 → 文本框','<p>两类对象均可在这里设置缩小文字或扩大形状。拆分幻灯片选项属于正文占位符。</p>',btn('溢出时缩小文字','shrink')+btn('调整形状大小以适应文字','shape')+btn('不自动调整','none')+btn('关闭','formatClose')):''))+
 controls(s.mode==='split'?btn('第1页','page','1')+btn('第2页','page','2'):'')+table(['原字号','本例显示字号'],[[24,24*scale],[18,18*scale]])+
 output(s.mode==='split'?'溢出内容移到第2页，各段原字号保留。':s.mode==='shrink'?'边界不变，24/18分别按相同比例变成16/12，行距也可压缩；不会统一成同一字号。本例使用固定缩放比例说明机制。':s.mode==='shape'?'字号仍为24/18，形状高度增加。':'正文占位符溢出时有左下角入口；普通文本框请从设置形状格式进入。');
},(s,a,v)=>{if(a==='menu'&&s.object==='placeholder'){s.menu=!s.menu;s.format=false;}else if(a==='format'){s.format=true;s.menu=false;}else if(a==='formatClose')s.format=false;else if(a==='page')s.page=Number(v);else if(['shrink','none','shape','split'].includes(a)&&(a!=='split'||s.object==='placeholder')){s.mode=a;s.menu=s.format=false;s.page=1;}},(s,k,v)=>{s.object=v;s.mode='none';s.menu=s.format=false;s.page=1;});
register(['y2025q10'],'组织节，再放映并用画笔标注','编辑节会改变缩略图分组；放映时可黑屏和真正按住画笔拖动。',{sections:[{name:'第一部分',slides:[0,1],closed:false},{name:'第二部分',slides:[2],closed:false}],selected:0,selection:'page',tab:'home',transitions:['none','none','none'],transition:'none',page:0,name:'第一部分',show:false,black:false,pen:false,color:'#cb443c',strokes:[]},s=>
 controls(select('color','画笔颜色',s.color,[['#cb443c','红色'],['#2563a0','蓝色']]))+office('PowerPoint',s.show?'幻灯片放映':s.tab==='transition'?'切换':'开始',s.show?'':(s.tab==='home'?btn('节 → 重命名节','rename')+btn('节 → 添加节','new'):select('transition','切换效果',s.transition,[['none','无'],['fade','淡化'],['push','推进']])+btn('全部应用','transitionAll'))+btn('开始放映','show'),`<div class="lab-deck"><aside>${s.sections.map((g,i)=>`<section>${btn(g.closed?'▸':'▾','collapseSection',i,`aria-label="${g.closed?'展开':'折叠'}${esc(g.name)}" aria-expanded="${!g.closed}"`)}${btn(esc(g.name),'section',i,`aria-pressed="${s.selection==='section'&&s.selected===i}"`)}${g.closed?'':g.slides.map(n=>btn(`幻灯片${n+1} · ${{none:'无',fade:'淡化',push:'推进'}[s.transitions[n]]}`,'page',n,`aria-pressed="${s.selection==='section'?s.selected===i:s.page===n}"`)).join('')}</section>`).join('')}</aside><div class="lab-slide lab-ink-slide" ${s.show&&s.pen&&!s.black?'data-lab-drag="ink"':''} style="background:${s.show&&s.black?'#111':'#fff'}">${s.show&&s.black?'':`<h3>幻灯片${s.page+1}</h3><p>${['问题背景','研究方法','结果总结'][s.page]}</p>`}<svg class="lab-ink-layer" viewBox="0 0 100 100" preserveAspectRatio="none">${(s.show&&s.black?[]:s.strokes.filter(x=>x.page===s.page)).map(x=>`<polyline points="${x.points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${x.color}" stroke-width=".7"/>`).join('')}</svg></div></div>${s.renaming?dialog('重命名节',field('name','节名称',s.name),btn('重命名','apply')+btn('取消','cancel')):''}`,s.show?'':ui.tabs('tab',s.tab,[['home','开始'],['transition','切换']]))+controls(s.show?btn('B · 黑屏/恢复','black')+btn(s.pen?'关闭画笔':'启用画笔','pen')+btn('下一页','next')+btn('结束放映','end'):'')+output('节标题选择该节全部页，旁边三角只负责折叠。在切换选项卡选择效果即应用于选区：选单页改该页，选节改整节；全部应用改整份演示稿。画笔在放映且启用时留下笔迹。'),
 (s,a,v)=>{if(s.renaming&&!['apply','cancel'].includes(a))return;if(a==='section'){s.selected=Number(v);s.selection='section';s.page=s.sections[s.selected].slides[0];s.transition=s.transitions[s.page];}if(a==='collapseSection')s.sections[Number(v)].closed=!s.sections[Number(v)].closed;if(a==='transitionAll')s.transitions=s.transitions.map(()=>s.transition);if(a==='page'){s.selection='page';s.page=Number(v);s.transition=s.transitions[s.page];s.selected=s.sections.findIndex(g=>g.slides.includes(s.page));}if(a==='rename'){s.renameTarget=s.selected;s.name=s.sections[s.renameTarget].name;s.renaming=true;}if(a==='apply'&&s.renaming){s.sections[s.renameTarget].name=s.name||'未命名节';s.renaming=false;}if(a==='cancel')s.renaming=false;if(a==='new'){const idx=s.sections.findIndex(g=>g.slides.includes(s.page)),g=s.sections[idx],at=g.slides.indexOf(s.page);const tail=g.slides.splice(at);s.sections.splice(idx+1,0,{name:'新节',slides:tail,closed:false});s.sections=s.sections.filter(g=>g.slides.length);s.selected=s.sections.findIndex(g=>g.slides.includes(s.page));}if(a==='show')s.show=true;if(a==='black')s.black=!s.black;if(a==='pen')s.pen=!s.pen;if(a==='next')s.page=(s.page+1)%3;if(a==='end'){s.show=false;s.black=false;s.pen=false;s.selection='page';s.selected=s.sections.findIndex(g=>g.slides.includes(s.page));s.transition=s.transitions[s.page];}},(s,k,v)=>{if(s.renaming&&k!=='name')return;s[k]=v;if(k==='transition'){const pages=s.selection==='section'?s.sections[s.selected].slides:[s.page];pages.forEach(n=>s.transitions[n]=v);}});
registry.y2025q10.gesture=(s,g)=>{if(g.kind==='ink'&&s.show&&s.pen&&!s.black&&g.points)s.strokes.push({page:s.page,color:s.color,points:g.points});};
registry.y2025q10.afterRender=(s,root)=>{if(!s.renaming)return;root.querySelectorAll('button,input,select,textarea').forEach(el=>{if(!el.closest('.lab-dialog'))el.disabled=true;});};
registry.y2025q10.keydown=(s,e)=>{if(s.show&&!e.target.closest('input,textarea,select')&&e.key.toLowerCase()==='b'){e.preventDefault();s.black=!s.black;return true;}};
register(['y2025q53'],'选择SmartArt节点，再改变结构或外观','单击节点边框选择；按住Ctrl可多选。切换对应工具选项卡操作。',{tab:'design',selected:[1],nodes:[{id:1,text:'公共基础',level:0,shape:'rect',link:false},{id:2,text:'专业基础',level:0,shape:'rect',link:false},{id:3,text:'实践课程',level:0,shape:'rect',link:false}],next:4,linkedView:false},s=>
 controls(btn('SmartArt工具：设计','tab','design')+btn('SmartArt工具：格式','tab','format')+btn('插入','tab','insert'))+office('PowerPoint',s.tab==='design'?'SmartArt工具 · 设计':s.tab==='format'?'SmartArt工具 · 格式':'插入',s.tab==='design'?btn('添加形状 → 在后面添加','add')+btn('降级','demote')+btn('升级','promote'):s.tab==='format'?btn('更改形状 → 圆角矩形','round'):btn('超链接 → 课程体系.docx','link'),`<div class="lab-smartart"><h4>课程体系</h4>${s.nodes.map(n=>btn(esc(n.text)+(n.link?' ↗':''),'select',n.id,`class="lab-smart-node" style="margin-left:${n.level*22}px;border-radius:${n.shape==='round'?'18':'2'}px" aria-pressed="${s.selected.includes(n.id)}"`)).join('')}</div>${s.linkedView?dialog('课程体系.docx · 模拟打开','<p>课程体系说明文档的独立内容。</p>',btn('返回演示文稿','back')):''}`)+controls(btn('放映中打开所选节点的链接','follow'))+output(s.message||'节点边框的选择范围决定命令作用对象；更改形状在“格式”，添加和升降级在“设计”。'),
 (s,a,v)=>{if(a==='tab')s.tab=v;if(a==='select'){const id=Number(v);s.selected=s._ctrl?[...new Set([...s.selected,id])]:[id];}const chosen=s.nodes.filter(n=>s.selected.includes(n.id));if(a==='round')chosen.forEach(n=>n.shape='round');if(a==='demote')chosen.forEach(n=>n.level=Math.min(2,n.level+1));if(a==='promote')chosen.forEach(n=>n.level=Math.max(0,n.level-1));if(a==='add'&&chosen.length){const n=chosen[chosen.length-1],i=s.nodes.indexOf(n),id=s.next++;s.nodes.splice(i+1,0,{id,text:'新节点',level:n.level,shape:'rect',link:false});s.selected=[id];}if(a==='link')chosen.forEach(n=>n.link=true);if(a==='follow'){s.linkedView=chosen.some(n=>n.link);if(!s.linkedView)s.message='所选节点还没有链接。';}if(a==='back')s.linkedView=false;});
})();

/* Source provenance: note-labs-presentation.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,esc}=ui;
const clone=x=>structuredClone(x);
const controls=x=>`<div class="lab-controls">${x}</div>`;
const check=(k,label,v)=>`<label><input type="checkbox" data-field="${k}" ${v?'checked':''}>${label}</label>`;
const themes={pink:{name:'樱粉',bg:'#fff1f6',ink:'#824566',accent:'#b66494',font:'sans-serif'},violet:{name:'紫藤',bg:'#f0eafb',ink:'#583f82',accent:'#8161b0',font:'serif'},blue:{name:'晴空',bg:'#ecf5ff',ink:'#365a80',accent:'#5083af',font:'sans-serif'}};
const newSlides=()=>['课程导览','数据与信息','备用案例','本章总结'].map((title,i)=>({id:i+1,title,body:['认识概念，理解操作。','同一数据可以在不同情境表达信息。','需要时再展示的补充内容。','先确定操作对象，再核对作用范围。'][i],hidden:false,object:true,theme:'pink'}));
const canvas=(slide,body='',extra='')=>`<div class="core-slide" ${extra}><h4>${esc(slide?.title||'没有幻灯片')}</h4>${body}</div>`;
const thumbs=(slides,selected,act='page')=>`<div class="core-thumbnails" aria-label="幻灯片缩略图">${slides.map((x,i)=>btn(`<span class="${x.hidden?'core-hidden-number':''}">${i+1}</span> ${esc(x.title)}${x.hidden?'<small>隐藏</small>':''}`,act,x.id,`aria-pressed="${Array.isArray(selected)?selected.includes(x.id):selected===x.id}"`)).join('')}</div>`;
register(['y2020q12'],'先选操作对象，再隐藏、删除或放映','任意选择一页或页内对象；删除结果跟随选区，隐藏页会被常规放映跳过。',{
    slides:newSlides(),selected:1,target:'slide',show:false,playing:null,undo:[],message:'当前选中第1页缩略图。选中页内对象后，Delete只删除对象。'
  },s=>{
    const active=s.slides.find(x=>x.id===(s.show?s.playing:s.selected));
    const path=s.slides.filter(x=>!x.hidden);
    let stage=s.show?canvas(active,active?.object?`<p>${esc(active.body)}</p>`:''):
      canvas(active,active?.object?`<button class="core-slide-object ${s.target==='object'?'lab-selected':''}" data-lab-act="object">${esc(active.body)}</button>${s.target==='object'?`<label>编辑对象文字<textarea data-field="body" rows="2">${esc(active.body)}</textarea></label>`:''}`:'<p class="core-empty">本页对象已删除，幻灯片仍在。</p>');
    if(!active)stage='<p class="core-empty">没有可显示的幻灯片。</p>';
    return office('PowerPoint',s.show?'幻灯片放映':'开始',s.show?btn('结束放映','end'):btn('幻灯片放映 → 隐藏幻灯片','hide','',active?'':'disabled')+btn('从头开始','show','',path.length?'':'disabled'),
      `${s.show?'':thumbs(s.slides,s.target==='slide'?s.selected:null)}${stage}`)+
      controls(s.show?btn('下一页','next')+select('jump','放映导航：选择幻灯片',s.playing,s.slides.map(x=>[x.id,x.title+(x.hidden?'（隐藏）':'')])):btn('模拟 Delete','delete','',active?'':'disabled')+btn('撤销删除或隐藏','undo','',s.undo.length?'':'disabled'))+
      output(s.message)+`<p class="core-caption">源文稿 ${s.slides.length} 页；常规播放顺序：${path.map(x=>esc(x.title)).join(' → ')||'没有可播放页'}</p>`+coach('先点缩略图，再Delete会删除整页；先点页内对象，再Delete只删对象。文字框内的Delete按光标或选区删除文字。隐藏只改变常规播放资格，放映导航仍可访问该页。');
  },(s,a,v)=>{
    const current=()=>s.slides.find(x=>x.id===s.selected);
    const remember=()=>s.undo.push({slides:clone(s.slides),selected:s.selected,target:s.target});
    if(a==='page'){s.selected=Number(v);s.target='slide';s.message=`已选中“${current()?.title}”的缩略图。`;}
    if(a==='object'){s.target='object';s.message='已选中页内文本对象，Delete将删除这个对象。';}
    if(a==='hide'&&current()){remember();current().hidden=!current().hidden;s.message=`“${current().title}”${current().hidden?'已隐藏，仍保留在文件中':'已取消隐藏'}。`;}
    if(a==='delete'&&current()){
      remember();if(s.target==='object'){current().object=false;s.message='只删除了页内对象，页数没有减少。';}
      else{const at=s.slides.findIndex(x=>x.id===s.selected),name=current().title;s.slides.splice(at,1);s.selected=s.slides[Math.min(at,s.slides.length-1)]?.id??null;s.message=`已删除“${name}”整页，剩余 ${s.slides.length} 页。`;}
      s.target='slide';
    }
    if(a==='undo'&&s.undo.length){Object.assign(s,s.undo.pop());s.message='已恢复上一步删除或隐藏前的状态。';}
    if(a==='show'){s.playing=s.slides.find(x=>!x.hidden)?.id??null;s.show=s.playing!==null;s.message=s.show?'正在从头放映，隐藏页不会出现在常规顺序中。':'没有未隐藏的幻灯片。';}
    if(a==='next'){const at=s.slides.findIndex(x=>x.id===s.playing),next=s.slides.slice(at+1).find(x=>!x.hidden);if(next){s.playing=next.id;s.message='正在放映：'+next.title;}else{s.show=false;s.message='放映结束，源文稿与隐藏状态保持不变。';}}
    if(a==='end'){s.show=false;s.message='已结束放映。';}
  },(s,k,v)=>{if(k==='body'){const x=s.slides.find(x=>x.id===s.selected);if(x)x.body=v;}if(k==='jump'){s.playing=Number(v);s.message='通过放映导航访问所选页面，不更改它的隐藏状态。';}});
registry.y2020q12.keydown=(s,e)=>{if(e.key==='Delete'&&!s.show&&!e.target.closest('input,textarea,select')){e.preventDefault();registry.y2020q12.action(s,'delete');return true;}if(e.key==='Escape'&&s.show){e.preventDefault();registry.y2020q12.action(s,'end');return true;}};
const masterSlides=[{id:1,title:'课程封面',master:'A',layout:'title'},{id:2,title:'基础概念',master:'A',layout:'content'},{id:3,title:'操作方法',master:'A',layout:'content'},{id:4,title:'拓展阅读',master:'B',layout:'content'},{id:5,title:'复习封面',master:'B',layout:'title'}];
register(['y2020q11'],'改母版或版式，观察哪些页面继承','选择母版树的不同节点修改固定文字；五页预览始终同时显示各自归属。',{
    mode:'normal',node:'A',page:2,master:{A:'计算机笔记',B:'拓展资料'},layout:{'A/title':'复习导览','A/content':'学习要点','B/title':'附录','B/content':'延伸阅读'},colors:{A:'#b66494',B:'#6285b4'},hide:{},message:'第1—3页属于母版A，第4—5页属于母版B。'
  },s=>{
    const selected=masterSlides.find(x=>x.id===s.page),parts=s.node.split('/'),text=parts.length===1?s.master[s.node]:s.layout[s.node];
    const previews=masterSlides.map(x=>`<section class="core-master-preview"><p>${x.id} · 母版${x.master} / ${x.layout==='title'?'标题幻灯片':'标题和内容'}</p>${canvas(x,`${s.hide[x.id]?'':`<span class="core-master-logo" style="color:${s.colors[x.master]}">${esc(s.master[x.master])}</span><p class="core-layout-text">${esc(s.layout[x.master+'/'+x.layout])}</p>`}<p class="core-local-text">本页自己的内容 ${x.id}</p>`)}${btn('选择第'+x.id+'页','page',x.id,`aria-pressed="${s.page===x.id}"`)}</section>`).join('');
    return office('PowerPoint',s.mode==='normal'?'视图':'幻灯片母版',btn(s.mode==='normal'?'幻灯片母版':'关闭母版视图','view'),
      (s.mode==='master'?`<div class="core-master-tree" aria-label="母版和版式">${['A','B'].map(m=>`<section>${btn('母版 '+m,'node',m,`aria-pressed="${s.node===m}"`)}${['title','content'].map(l=>btn('↳ '+(l==='title'?'标题幻灯片':'标题和内容'),'node',m+'/'+l,`aria-pressed="${s.node===m+'/'+l}"`)).join('')}</section>`).join('')}</div><div class="core-master-editor"><b>当前编辑：${parts.length===1?'母版'+s.node:'母版'+parts[0]+'的'+(parts[1]==='title'?'标题':'内容')+'版式'}</b><label>固定文本框<textarea data-field="masterText" rows="2">${esc(text)}</textarea></label></div>`:`<p>普通视图 · 当前第${s.page}页。继承的固定文本不能在普通页中直接选取。</p>`)+`<div class="core-master-grid">${previews}</div>`)+
      controls(select('color','学习编辑器：母版 '+parts[0]+' 的标识颜色',s.colors[parts[0]],[['#b66494','樱粉'],['#6285b4','晴空'],['#7d5fa4','紫藤']])+check('hide','第'+s.page+'页：隐藏背景图形',!!s.hide[s.page]))+
      output(s.message)+coach('本卡片修改的是母版或版式上的普通固定文本，不是占位符结构。隐藏背景图形后，本页自己创建的对象仍保留。改占位符布局后，已有页面可能还需重新应用版式。');
  },(s,a,v)=>{if(a==='view')s.mode=s.mode==='normal'?'master':'normal';if(a==='node'){s.node=v;s.message=v.includes('/')?'正在修改指定版式，只影响使用该版式的页面。':'正在修改母版'+v+'，另一组母版的页面不会跟着改变。';}if(a==='page')s.page=Number(v);},
  (s,k,v)=>{if(k==='masterText'){if(s.node.includes('/'))s.layout[s.node]=v;else s.master[s.node]=v;s.message='固定文字已改变，下面各页按其母版与版式归属继承。';}if(k==='color'){s.colors[s.node.split('/')[0]]=v;s.message='已修改该母版标识的颜色。';}if(k==='hide'){s.hide[s.page]=v;s.message=`第${s.page}页${v?'隐藏':'显示'}继承的背景图形，本页自己的内容保留。`;}});
register(['y2020q53'],'自己多选页面，再限定主题应用范围','按 Ctrl 多选或启用触屏辅助；主题可右击或长按，打开“应用于选定幻灯片”。',{
    slides:newSlides(),selected:[1],active:1,assist:false,theme:'violet',menu:false,background:null,message:'先任意选择目标页面；主题左键单击与菜单的选定范围要分清。'
  },s=>{
    const slide=s.slides.find(x=>x.id===s.active),t=themes[slide.theme];
    return controls(check('assist','辅助多选（作用等同按住 Ctrl）',s.assist)+select('theme','键盘或触屏菜单目标',s.theme,Object.entries(themes).map(([k,v])=>[k,v.name]))+btn('打开主题菜单','menu'))+
      office('PowerPoint','设计',`<div class="core-theme-gallery">${Object.entries(themes).map(([k,t])=>btn(t.name,'allTheme',k,`data-lab-drag="hold" data-theme="${k}" style="border-bottom:5px solid ${t.accent}"`)).join('')}</div>`+
      (s.menu?`<div class="lab-context-menu" aria-label="主题菜单"><b>${themes[s.theme].name}</b>${btn('应用于选定幻灯片','selectedTheme','',s.selected.length?'':'disabled')}${btn('应用于所有幻灯片','allTheme',s.theme)}${btn('取消','cancel')}</div>`:''),
      `${thumbs(s.slides,s.selected)}${canvas(slide,`<p>${esc(slide.body)}</p><p class="core-caption">主题：${t.name} · ${t.font==='serif'?'衬线字体':'无衬线字体'}</p>`,`style="background:${slide.background||t.bg};color:${t.ink};font-family:${t.font};border-top:7px solid ${t.accent}"`)}${table(['页面','主题','独立背景'],s.slides.map(x=>[x.id,themes[x.theme].name,x.background?'已单独修改':'跟随主题']))}`)+
      controls(btn('对照：只改当前页背景','background'))+output(s.message)+coach('左键点击主题在本例应用到全部页面；要明确限定范围，请右击、长按或用外部辅助入口选择“应用于选定幻灯片”。主题会改变颜色、字体与效果；这里只用颜色、字体和装饰样式呈现这些差别。');
  },(s,a,v)=>{
    if(a==='page'){const id=Number(v);if(s.assist||s._ctrl){s.selected=s.selected.includes(id)?s.selected.filter(x=>x!==id):[...s.selected,id];}else s.selected=[id];s.active=id;s.message='已选页：'+(s.selected.join('、')||'无')+'。';}
    if(a==='menu')s.menu=true;if(a==='cancel')s.menu=false;
    if(a==='allTheme'||a==='selectedTheme'){const theme=a==='allTheme'?v:s.theme;s.slides.filter(x=>a==='allTheme'||s.selected.includes(x.id)).forEach(x=>{x.theme=theme;delete x.background;});s.menu=false;s.message=`已将“${themes[theme].name}”应用于${a==='allTheme'?'全部页面':'第'+s.selected.join('、')+'页'}。`;}
    if(a==='background'){s.slides.find(x=>x.id===s.active).background='#fffbe9';s.message='只改当前页背景色，主题字体及强调色保持原值。';}
  });
registry.y2020q53.afterRender=(s,root)=>root.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('pointerdown',()=>{s.theme=b.dataset.theme;}));
const showTitles=['开场','数据','结论'];
register(['y2026q55'],'编辑放映清单，再按它真正播放','从源页添加、移除或调整顺序；取消不会覆盖已保存的方案。',{
    pane:'none',saved:[0,1,2],draft:[],source:0,selected:0,page:0,show:false,playing:0,message:'源文稿始终保留3张幻灯片。'
  },s=>{
    const id=s.show?s.saved[s.playing]:s.page;
    const content=canvas({title:showTitles[id]},`<p>源幻灯片 ${id+1} · ${['欢迎进入计算机复习。','比较实际结果，理解操作范围。','回顾本次放映的要点。'][id]}</p>`);
    const edit=dialog('定义自定义放映',`<div class="core-show-editor"><section><h4>源幻灯片</h4>${showTitles.map((t,i)=>btn(t,'source',i,`aria-pressed="${s.source===i}"`)).join('')}${btn('添加 →','add')}</section><section><h4>自定义放映中的幻灯片</h4>${s.draft.map((x,i)=>btn(`${i+1}. ${showTitles[x]}`,'select',i,`aria-pressed="${s.selected===i}"`)).join('')}${controls(btn('上移','up','',s.selected>0?'':'disabled')+btn('下移','down','',s.selected<s.draft.length-1?'':'disabled')+btn('移除','remove','',s.draft.length?'':'disabled'))}</section></div>`,btn('确定','save','',s.draft.length?'':'disabled')+btn('取消','cancel'));
    return office('PowerPoint','幻灯片放映',btn(s.show?'结束放映':'自定义幻灯片放映','open','',s.pane!=='none'?'disabled':''),`<div ${s.pane!=='none'?'inert':''}>${s.show?'':thumbs(showTitles.map((title,id)=>({id,title})),s.page)}${content}</div>`+
      (s.pane==='manage'?dialog('自定义放映',`<p>已保存：${s.saved.map(i=>showTitles[i]).join(' → ')}</p>`,btn('编辑…','edit')+btn('放映','show','',s.saved.length?'':'disabled')+btn('关闭','close')):s.pane==='edit'?edit:''))+
      (s.show?controls(btn('上一页','previous','',s.playing?'':'disabled')+btn('下一页','next')):'')+output(s.message)+coach('右侧清单只保存对源页的引用及顺序。相同源页可重复加入；这不会复制源幻灯片。放映结束后，普通视图的真实页序仍是开场、数据、结论。');
  },(s,a,v)=>{
    if(a==='open'){if(s.show){s.show=false;s.message='已结束自定义放映。';}else s.pane='manage';}
    if(a==='page')s.page=Number(v);if(a==='edit'){s.draft=[...s.saved];s.selected=0;s.pane='edit';}
    if(a==='source')s.source=Number(v);if(a==='select')s.selected=Number(v);
    if(a==='add'){s.draft.push(s.source);s.selected=s.draft.length-1;}
    if(a==='remove'){s.draft.splice(s.selected,1);s.selected=Math.max(0,Math.min(s.selected,s.draft.length-1));}
    if(a==='up'&&s.selected>0){[s.draft[s.selected-1],s.draft[s.selected]]=[s.draft[s.selected],s.draft[s.selected-1]];s.selected--;}
    if(a==='down'&&s.selected<s.draft.length-1){[s.draft[s.selected+1],s.draft[s.selected]]=[s.draft[s.selected],s.draft[s.selected+1]];s.selected++;}
    if(a==='save'&&s.draft.length){s.saved=[...s.draft];s.pane='manage';s.message='新方案已保存在当前文件中，源页顺序没有改变。';}
    if(a==='cancel')s.pane='manage';if(a==='close')s.pane='none';
    if(a==='show'&&s.saved.length){s.pane='none';s.show=true;s.playing=0;s.message='正在按已保存的自定义顺序放映。';}
    if(a==='previous')s.playing=Math.max(0,s.playing-1);
    if(a==='next'){if(s.playing<s.saved.length-1)s.playing++;else{s.show=false;s.message='自定义放映结束，源幻灯片仍全部保留。';}}
  });
const baseDate=new Date(2026,8,5);
const dateLabel=day=>{const d=new Date(baseDate);d.setDate(d.getDate()+day);return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;};
const footerDefaults={footer:false,number:false,date:false,hideTitle:false,kind:'fixed',text:'课程笔记',fixed:'2026/9/5'};
register(['y2024q65'],'标题版式不一定在第1页，编号也不会重排','把任意一页切成标题版式；应用页脚后观察标题页隐藏规则和固定日期。',{
    pane:false,page:0,day:0,layouts:['content','title','content'],applied:[null,null,null],draft:footerDefaults,message:'第2页使用标题版式，第1页使用内容版式。'
  },s=>{
    const a=s.applied[s.page],hidden=a?.hideTitle&&s.layouts[s.page]==='title';
    return office('PowerPoint','插入',btn('页眉和页脚','open','',s.pane?'disabled':''),`<div ${s.pane?'inert':''}>${thumbs(showTitles.map((title,id)=>({title,id})),s.page)}${canvas({title:showTitles[s.page]},`<p>第${s.page+1}页 · ${s.layouts[s.page]==='title'?'标题幻灯片':'标题和内容'}版式</p><div class="core-slide-footer">${a&&!hidden?`${a.date?'<span>'+esc(a.kind==='auto'?dateLabel(s.day):a.fixed)+'</span>':''}${a.footer?'<span>'+esc(a.text)+'</span>':''}${a.number?'<span data-slide-number>'+String(s.page+1)+'</span>':''}`:''}</div>`)}</div>`+
      (s.pane?dialog('页眉和页脚',check('date','日期和时间',s.draft.date)+select('kind','日期方式',s.draft.kind,[['fixed','固定'],['auto','自动更新']])+(s.draft.kind==='fixed'?field('fixed','固定日期文字',s.draft.fixed):'')+check('number','幻灯片编号',s.draft.number)+check('footer','页脚',s.draft.footer)+field('text','页脚文字',s.draft.text)+check('hideTitle','标题幻灯片中不显示',s.draft.hideTitle),btn('应用','apply')+btn('全部应用','all')+btn('取消','cancel')):''))+
      `<fieldset class="core-controls" ${s.pane?'disabled':''}>`+controls(select('layout','当前页版式（模拟“开始 → 版式”）',s.layouts[s.page],[['content','标题和内容'],['title','标题幻灯片']])+btn('学习时钟：推进一天','day','',s.pane?'disabled':''))+'</fieldset>'+output(s.message)+coach('标题幻灯片由版式决定，可以不在第一页。“标题幻灯片中不显示”隐藏日期、页脚、编号的显示，不会重新排列源页编号。固定日期是保存的文字；自动日期随本例时钟更新。');
  },(s,a,v)=>{if(a==='page'&&!s.pane)s.page=Number(v);if(a==='open'){s.draft=clone(s.applied[s.page]||footerDefaults);s.pane=true;}if(a==='cancel')s.pane=false;if(a==='apply'||a==='all'){s.applied=s.applied.map((old,i)=>a==='all'||i===s.page?clone(s.draft):old);s.pane=false;s.message=a==='all'?'设置已应用到3页，分别按各页版式判断是否显示。':'只更新当前第'+(s.page+1)+'页。';}if(a==='day')s.day++;},(s,k,v)=>{if(s.pane)s.draft[k]=v;else if(k==='layout')s.layouts[s.page]=v;});
function rehearsalUpdate(s,now){
    if(!['rehearse','play'].includes(s.phase)||s.paused)return false;
    const delta=Math.max(0,now-s.last)/1000;s.last=now;s.elapsed+=delta;
    if(s.phase==='play'&&s.useTiming&&s.saved&&s.saved[s.page]!==null&&s.elapsed>=s.saved[s.page]){
      if(s.page<2){s.elapsed=0;s.page++;}else{s.phase='idle';s.elapsed=0;s.message='已按保存的排练时间自动放映完毕。';}
    }
    return true;
  }
register(['y2023q13'],'记录、保存，再采用或忽略排练时间','每页停留时间由真实时钟记录；保存后可按计时自动放映，也可改为手动。',{
    phase:'idle',page:0,elapsed:0,times:[null,null,null],saved:null,paused:false,last:0,useTiming:true,message:'尚未排练。'
  },s=>{
    const total=s.times.slice(0,s.page).reduce((n,x)=>n+x,0)+s.elapsed;
    return office('PowerPoint','幻灯片放映',s.phase==='idle'?btn('排练计时','start')+btn('从头开始','play','',s.saved?'':'disabled'):s.phase==='rehearse'?btn(s.paused?'继续':'暂停','pause')+btn('下一页','next','',s.paused?'disabled':'')+btn('结束排练','finish'):s.phase==='play'?btn('下一页','next')+btn('结束放映','stop'):'',
      `${canvas({title:showTitles[s.page]},`<p>${['开场：今天复习什么？','数据：观察操作前后结果。','总结：把关键边界说清楚。'][s.page]}</p>`)}<p class="core-clock">${s.phase==='rehearse'?'排练':s.phase==='play'?'正式放映':'当前'} · 本页 ${s.elapsed.toFixed(1)} 秒${s.phase==='rehearse'?' · 累计 '+total.toFixed(1)+' 秒':''}${s.paused?'（已暂停）':''}</p>`+
      (s.phase==='confirm'?dialog('是否保留排练计时？',table(['页面','本次排练'],s.times.map((t,i)=>[showTitles[i],t===null?'本次未排练':t.toFixed(1)+' 秒'])),btn('是','save')+btn('否','discard')):''))+
      controls(check('useTiming','正式放映使用已保存的计时',s.useTiming))+table(['幻灯片','已保存的时间'],showTitles.map((x,i)=>[x,s.saved&&s.saved[i]!==null?s.saved[i].toFixed(1)+' 秒':'未计时']))+output(s.message)+coach('暂停期间不增加时长。关闭“使用计时”保留原数据，只使正式放映等待手动换页；结束时选择不保留，不会覆盖此前已保存的计时。');
  },(s,a)=>{
    const now=Date.now(),beforePage=s.page,beforePhase=s.phase;rehearsalUpdate(s,now);
    if(a==='next'&&beforePhase==='play'&&(s.page!==beforePage||s.phase!==beforePhase))return;
    if(a==='start'){Object.assign(s,{phase:'rehearse',page:0,elapsed:0,times:[null,null,null],paused:false,last:now,message:'排练已开始，可以实际等待、暂停或换页。'});}
    if(a==='pause'&&s.phase==='rehearse'){s.paused=!s.paused;s.last=now;}
    if(a==='next'&&s.phase==='rehearse'&&!s.paused){s.times[s.page]=s.elapsed;if(s.page<2){s.page++;s.elapsed=0;s.last=now;}else{s.phase='confirm';s.message='排练结束，决定是否保存本次计时。';}}
    if(a==='finish'&&s.phase==='rehearse'){s.times[s.page]=s.elapsed;s.phase='confirm';s.paused=false;s.message='未排练页会保留先前计时；若原来未计时，正式放映时等待手动前进。';}
    if(a==='save'&&s.phase==='confirm'){s.saved=s.times.map((t,i)=>t===null?s.saved?.[i]??null:t);s.phase='idle';s.elapsed=0;s.message='已保存本次计时。点击“从头开始”检验正式放映。';}
    if(a==='discard'&&s.phase==='confirm'){s.phase='idle';s.elapsed=0;s.message='本次计时未保存，先前保存的计时保留。';}
    if(a==='play'&&s.saved){Object.assign(s,{phase:'play',page:0,elapsed:0,paused:false,last:now});s.message=s.useTiming?'正式放映将按已保存的各页时间自动前进。':'正式放映忽略计时，等待手动换页。';}
    if(a==='next'&&s.phase==='play'){if(s.page<2){s.page++;s.elapsed=0;s.last=now;}else{s.phase='idle';s.message='正式放映结束。';}}
    if(a==='stop'){s.phase='idle';s.elapsed=0;s.message='已结束正式放映，保存的计时没有删除。';}
  });
registry.y2023q13.tick=s=>rehearsalUpdate(s,Date.now());
registry.y2023q13.frameKey=s=>`${s.phase}:${s.page}:${s.paused}`;
registry.y2023q13.patchFrame=(s,root)=>ui.patchRegions(root,registry.y2023q13.render(s),['.core-clock']);
const timingDefaults={effect:'fade',duration:0.6,click:true,auto:false,after:2};
function startSlide(s,id,now){s.current=id;s.phase=s.settings[id].effect==='none'?'slide':'transition';s.phaseStart=now;s.clock=0;s.animStart=null;s.show=true;s.message='进入第'+(id+1)+'页，使用目标页的切换设置。';}
const animName=id=>id==='title'?'标题':'图形';
const animDuration=(s,id)=>id==='title'?s.firstDuration:s.secondDuration;
function animEnd(s){const first=animDuration(s,s.order[0]),second=animDuration(s,s.order[1]);return Math.max(first,(s.secondStart==='with'?0:first)+s.delay+second);}
function timelineUpdate(s,now){
    if(!s.show)return false;
    s.clock=Math.max(0,(now-s.phaseStart)/1000);
    if(s.phase==='transition'&&s.clock>=(s.settings[s.current].effect==='none'?0:s.settings[s.current].duration)){s.phase='slide';s.phaseStart=now;s.clock=0;s.animStart=null;}
    if(s.phase==='slide'){
      const ready=s.current!==1?0:s.animStart===null?null:s.animStart+animEnd(s);
      if(ready!==null&&s.settings[s.current].auto&&s.clock>=ready+s.settings[s.current].after){if(s.current<2)startSlide(s,s.current+1,now);else{s.show=false;s.message='按自动换片条件播放完毕。';}}
    }
    return true;
  }
register(['merged-11'],'真正计时：过渡、对象动画、换片各管一段','选择页面设置进入过渡，再改变第2页两对象的先后关系；放映会按实际时间推进。',{
    order:['title','shape'],selectedAnim:'shape',actionTrigger:'click',actionTarget:2,editPage:1,settings:[clone(timingDefaults),clone(timingDefaults),clone(timingDefaults)],firstDuration:1,secondStart:'after',secondDuration:1,delay:0.5,show:false,current:0,phase:'slide',phaseStart:0,clock:0,animStart:null,message:'第2页的标题等待单击；图形可与标题同时或在标题之后开始。'
  },s=>{
    const setting=s.settings[s.editPage],page=s.show?s.current:s.editPage;
    let first=1,second=1,transition=1,status='编辑状态';
    if(s.show){transition=s.phase==='transition'?Math.min(1,s.clock/Math.max(.01,s.settings[page].duration)):1;if(s.phase==='transition'){first=second=page===1?0:1;status='整页切换中';}else if(page===1){const elapsed=s.animStart===null?-1:s.clock-s.animStart,firstLength=animDuration(s,s.order[0]),secondLength=animDuration(s,s.order[1]),secondAt=(s.secondStart==='with'?0:firstLength)+s.delay;first=Math.max(0,Math.min(1,elapsed/firstLength));second=Math.max(0,Math.min(1,(elapsed-secondAt)/secondLength));status=s.animStart===null?'等待单击，启动'+animName(s.order[0])+'动画':elapsed<animEnd(s)?'对象动画进行中':s.settings[page].auto?'动画结束，等待自动换片':'动画结束，等待换页';}else status=s.settings[page].auto?'等待自动换片':'等待单击换页';}
    const style=s.show&&s.settings[page].effect==='push'?`transform:translateX(${(1-transition)*100}%);`:s.show?`opacity:${transition};`:'';
    const stage=`<div class="core-stage-window"><div class="core-slide core-timed-slide" ${s.show?'data-lab-act="screen" role="button" tabindex="0" aria-label="单击放映画面"':''} style="${style}"><h4 style="opacity:${page!==1||s.order[0]==='title'?first:second}">${showTitles[page]}</h4>${page===1?`<div class="core-animation-object" style="opacity:${s.order[0]==='shape'?first:second};transform:translateX(${(1-(s.order[0]==='shape'?first:second))*65}px)">数据图形</div><p>标题淡入；图形飞入</p>`:`<p>${page===0?'单击进入第2页，观察它自己的进入切换。':'已到总结页，动作按钮真正改变了当前页面。'}</p>`}${s.show&&page===1?btn('转到'+showTitles[s.actionTarget],'jump'):''}</div></div>`;
    return (s.show?'':controls(select('editPage','设置哪一页',s.editPage,showTitles.map((x,i)=>[i,`第${i+1}页 ${x}`]))))+
      office('PowerPoint',s.show?'幻灯片放映':'切换',s.show?'':select('effect','进入切换',setting.effect,[['none','无'],['fade','淡化'],['push','推进']])+field('duration','持续时间（秒）',setting.duration,'number','min="0.2" max="5" step="0.2"')+check('click','单击鼠标时换片',setting.click)+check('auto','设置自动换片时间',setting.auto)+field('after','动画结束后换片等待（秒）',setting.after,'number','min="0" max="10" step="0.5"'),stage)+
      (s.show?controls(btn('单击放映画面','screen')+(s.actionTrigger==='hover'&&s.current===1?btn('触屏辅助：模拟悬停动作','hoverJump'):'')+btn('结束放映','stop')):controls(field('firstDuration','第2页标题动画时长（秒）',s.firstDuration,'number','min="0.2" max="5" step="0.2"')+select('secondStart','第2个动画（'+animName(s.order[1])+'）开始方式',s.secondStart,[['with','与上一动画同时'],['after','上一动画之后']])+field('delay','第2个动画延迟（秒）',s.delay,'number','min="0" max="5" step="0.5"')+field('secondDuration','图形动画时长（秒）',s.secondDuration,'number','min="0.2" max="5" step="0.2"')+select('actionTrigger','动作设置：触发方式',s.actionTrigger,[['click','单击鼠标'],['hover','鼠标移过']])+select('actionTarget','超链接到幻灯片',s.actionTarget,[[0,'第1页'],[2,'第3页']])+btn('从头放映本例','start')))+
      (s.show?`<p class="core-clock">第${page+1}页 · ${s.clock.toFixed(1)}秒 · ${status}</p>`:table(['动画窗格：选择对象','开始条件','持续时间'],s.order.map((id,i)=>[btn((i+1)+'. '+animName(id),'animSelect',id,`aria-pressed="${s.selectedAnim===id}"`),i===0?'单击时':s.secondStart==='with'?'与上一动画同时 + 延迟'+s.delay+'秒':'上一动画之后 + 延迟'+s.delay+'秒',animDuration(s,id)+'秒']))+controls(btn('向前移动','animUp','',s.order[0]===s.selectedAnim?'disabled':'')+btn('向后移动','animDown','',s.order[1]===s.selectedAnim?'disabled':'')))+
      output(s.message)+coach('上方“持续时间”控制进入所选页的过渡；自动换片时间从本页动画完成后计算。两对象时序控件是卡片外的学习编辑器。动画窗格的移动命令改变对象先后，保留各自时长。动作设置可以选择单击或鼠标移过；触屏辅助可模拟悬停。');
  },(s,a,v)=>{
    if(a==='animSelect')s.selectedAnim=v;
    if(a==='animUp'||a==='animDown'){const from=s.order.indexOf(s.selectedAnim),to=from+(a==='animUp'?-1:1);if(to>=0&&to<s.order.length){[s.order[from],s.order[to]]=[s.order[to],s.order[from]];s.message=animName(s.order[0])+'先开始，'+animName(s.order[1])+'按设定关系开始。';}}
    const now=Date.now(),before=s.current,wasShowing=s.show;timelineUpdate(s,now);
    if(a==='screen'&&wasShowing&&(s.current!==before||!s.show))return;
    if(a==='start')startSlide(s,0,now);
    if(a==='stop'){s.show=false;s.message='结束放映，页面设置仍保留。';}
    if(s.show&&s.current===1&&(a==='jump'&&s.actionTrigger==='click'||a==='hoverJump'&&s.actionTrigger==='hover'))startSlide(s,s.actionTarget,now);
    if(a==='screen'&&s.show&&s.phase==='slide'){
      if(s.current===1&&s.animStart===null){s.animStart=s.clock;s.message='单击启动'+animName(s.order[0])+'动画；'+animName(s.order[1])+'按设定的同时或之后关系运行。';}
      else if(s.current===1&&s.clock-s.animStart<animEnd(s)){s.message='本例请观察当前动画完成；学习模型不模拟单击快进动画。';}
      else if(s.settings[s.current].click){if(s.current<2)startSlide(s,s.current+1,now);else{s.show=false;s.message='放映结束。';}}
      else s.message='该页关闭了单击换片；若自动换片也关闭，可结束放映后调整设置。';
    }
  },(s,k,v)=>{
    if(k==='editPage'||k==='actionTarget'){s[k]=Number(v);return;}
    const numeric={duration:[.2,5],after:[0,10],firstDuration:[.2,5],secondDuration:[.2,5],delay:[0,5]};
    if(numeric[k]){const [min,max]=numeric[k];v=Math.max(min,Math.min(max,Number(v)||min));}
    if(['effect','duration','click','auto','after'].includes(k))s.settings[s.editPage][k]=v;else s[k]=v;
  });
registry['merged-11'].hover=(s,e)=>{const target=e.target.closest('[data-lab-act="jump"]');if(!target||target.contains(e.relatedTarget)||e.pointerType==='touch'||s.actionTrigger!=='hover'||!s.show||s.current!==1)return false;registry['merged-11'].action(s,'hoverJump');return true;};
registry['merged-11'].tick=s=>timelineUpdate(s,Date.now());
registry['merged-11'].tickInterval=50;
registry['merged-11'].frameKey=s=>`${s.show}:${s.current}`;
registry['merged-11'].patchFrame=(s,root)=>ui.patchRegions(root,registry['merged-11'].render(s),['.core-stage-window','.core-clock']);
registry['merged-11'].keydown=(s,e)=>{if(s.show&&(e.key==='Escape'||!e.target.closest('button,input,textarea,select'))&&[' ','ArrowRight','Enter','Escape'].includes(e.key)){e.preventDefault();registry['merged-11'].action(s,e.key==='Escape'?'stop':'screen');return true;}};
})();

/* Source provenance: note-labs-presentation.js:199. Preserve this closure. */
(() => {
'use strict';
const {register,ui}=window.NOTE_LABS;
const {btn,field,select,office,output,number,table}=ui;
const defaults={source:'none',transparency:0,x:0,y:0};
const background=s=>{
    const pattern=s.source==='stationery'?'repeating-linear-gradient(0deg,#fdf6e5 0px,#fdf6e5 22px,#b3c6d7 23px,#fdf6e5 24px)':s.source==='picture'?'repeating-linear-gradient(45deg,#91b3a0 0px,#91b3a0 30px,#d8e6d9 30px,#d8e6d9 60px)':'none';
    return `background-image:${pattern};background-position:${s.x}px ${s.y}px;opacity:${1-s.transparency/100}`;
  };
register(['y2020q54'],'调整背景，再检查当前页和全部页面','选择图片或信纸纹理，调整透明度与平铺偏移；全部应用和重置会改变不同范围。',{
    page:0,slides:[structuredClone(defaults),structuredClone(defaults),structuredClone(defaults)]
  },s=>{
    const current=s.slides[s.page];
    return office('PowerPoint','设计 · 设置背景格式',select('source','图片或纹理填充',current.source,[['none','无填充'],['picture','示例图片：几何纹样'],['stationery','内置纹理：信纸']])+field('transparency','透明度（%）',current.transparency,'range','min="0" max="100"')+field('x','平铺水平偏移（示意像素）',current.x,'number','min="-100" max="100"')+field('y','平铺垂直偏移（示意像素）',current.y,'number','min="-100" max="100"')+btn('全部应用','all')+btn('重置背景','reset'),
      `<div class="lab-deck"><aside>${s.slides.map((item,i)=>btn(`第${i+1}页 · ${{none:'无填充',picture:'图片',stationery:'信纸'}[item.source]}`,'page',i,`aria-pressed="${s.page===i}"`)).join('')}</aside><div class="lab-slide" style="position:relative;isolation:isolate"><div data-background-layer style="position:absolute;inset:0;z-index:-1;${background(current)}"></div><h3>第${s.page+1}页 · 学习计划</h3><p>文字和图形位于背景之上。</p></div></div>`)+
      output(`当前页透明度 ${current.transparency}%；偏移 ${current.x} / ${current.y}。调整直接作用于当前页；“全部应用”复制到另外两页，“重置背景”只恢复当前页的默认背景。此例默认背景为无填充。`);
  },(s,a,v)=>{
    if(a==='page')s.page=Number(v);
    if(a==='all')s.slides=s.slides.map(()=>structuredClone(s.slides[s.page]));
    if(a==='reset')s.slides[s.page]=structuredClone(defaults);
  },(s,k,v)=>{s.slides[s.page][k]=k==='source'?v:number(v,k==='transparency'?0:-100,100);});
const subjects=['数学','英语','计算机'];
const classes=['一班','二班','三班','四班'];
const scores=[[80,75,90],[72,85,78],[90,80,88],[82,92,84]];
const colors=['#527eaa','#bc7750','#558777','#9b6694'];
register(['merged-12'],'按类别和按系列，出现的是哪一组柱','同一张3门课×4个班的图，切换分组方式并逐组播放。',{
    mode:'category',playing:false,step:0
  },s=>{
    const groups=s.mode==='category'?subjects:classes;
    const bars=subjects.flatMap((subject,ci)=>classes.map((name,si)=>{
      const visible=!s.playing||(s.mode==='category'?ci:si)<=s.step;
      const x=45+ci*145+si*27, height=scores[si][ci]*1.8;
      return `<g data-category="${ci}" data-series="${si}" opacity="${visible?1:.1}"><rect x="${x}" y="${210-height}" width="23" height="${height}" fill="${colors[si]}"/><text x="${x+11}" y="${201-height}" text-anchor="middle" font-size="10">${scores[si][ci]}</text></g>`;
    })).join('');
    return office('PowerPoint','动画 · 效果选项',select('mode','图表分组',s.mode,[['category','按类别'],['series','按系列']])+btn(s.playing?'重新播放':'预览动画','start')+btn('下一组','next','',!s.playing||s.step>=groups.length-1?'disabled':''),
      `<svg class="lab-data-chart" viewBox="0 0 500 260" role="img" aria-label="三门课程、四个班级的簇状柱形图">${bars}${subjects.map((name,i)=>`<text x="${97+i*145}" y="240" text-anchor="middle">${name}</text>`).join('')}</svg><p>${classes.map((name,i)=>`<span style="color:${colors[i]}">■ ${name}</span>`).join('　')}</p>`)+
      table(['播放方式','一次出现的对象'],[['按类别','一门课程下，4个班的柱一起出现'],['按系列','同一个班在3门课程下的柱一起出现']])+
      output(s.playing?`第${s.step+1}/${groups.length}组：${groups[s.step]}。${s.mode==='category'?'本组出现4根柱，分别代表4个班。':'本组出现3根柱，分别属于3门课程。'}`:'横轴是课程类别，图例是班级系列。预览中的淡柱表示尚未出现的位置，背景和坐标轴保留。');
  },(s,a)=>{if(a==='start'){s.playing=true;s.step=0;}if(a==='next'&&s.playing)s.step=Math.min(s.mode==='category'?2:3,s.step+1);},(s,k,v)=>{s.mode=v;s.playing=false;s.step=0;});
})();

/* Persistent presentation objects and settings, separated from fixed scenario comparisons. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,table,office,dialog,output,esc,number}=ui;
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const views=[['normal','普通视图'],['sorter','幻灯片浏览视图'],['notes','备注视图']];
  const viewLabel=key=>views.find(x=>x[0]===key)[1];
  register(['y2024q46'],'保存默认视图，再重新打开文稿验证','在文件、选项、高级的显示设置中选择视图；取消与确定的结果不同。',{
    saved:'normal',draft:'normal',view:'normal',pane:null,message:'当前与默认打开视图均为普通视图。'
  },s=>office('PowerPoint',s.pane?'文件 · 选项':'视图',
    btn('文件','file')+btn('重新打开文稿','reopen','',s.pane?'disabled':''),
    `<p>当前视图：<b>${viewLabel(s.view)}</b>；保存的默认值：${viewLabel(s.saved)}</p><div class="${s.view==='sorter'?'lab-mini-deck':'lab-slide'}">${s.view==='sorter'?'<div>1 · 开场</div><div>2 · 内容</div><div>3 · 总结</div>':s.view==='notes'?'<h3>1 · 开场</h3><hr><p>演讲者备注：介绍本次课程。</p>':'<h3>1 · 开场</h3><p>在普通视图编辑当前页。</p>'}</div>`+
    (s.pane==='file'?dialog('文件','<p>应用级设置在PowerPoint选项中。</p>',btn('选项','options')+btn('返回','cancel')):s.pane==='options'?dialog('PowerPoint选项','<p>显示设置属于“高级”。</p>',btn('高级','advanced')+btn('取消','cancel')):s.pane==='advanced'?dialog('高级 → 显示',select('draft','使用此视图打开所有文档',s.draft,views),btn('确定','save')+btn('取消','cancel')):''))+output(esc(s.message)),
    (s,a)=>{if(a==='file'){s.draft=s.saved;s.pane='file';}if(a==='options'&&s.pane==='file')s.pane='options';if(a==='advanced'&&s.pane==='options')s.pane='advanced';if(a==='save'&&s.pane==='advanced'){s.saved=s.draft;s.pane=null;s.message='默认视图已保存；重新打开文稿来验证。当前页面不因保存设置自动切换。';}if(a==='cancel'){s.pane=null;s.draft=s.saved;s.message='已退出，未保存的选择已放弃。';}if(a==='reopen'&&!s.pane){s.view=s.saved;s.message='重新打开后使用已保存的'+viewLabel(s.saved)+'。';}},(s,k,v)=>{if(s.pane==='advanced'&&k==='draft')s.draft=v;});

  register(['y2024q12'],'新建空白页与复制所选页，结果逐次保留','选择缩略图，再按Ctrl+M或Ctrl+D；Ctrl+N创建另一份文稿，可切回原文稿。',{
    docs:[{id:1,slides:[{id:1,title:'牡丹',body:'花开时节，观察花瓣与叶片。'},{id:2,title:'荷花',body:'比较不同花卉的生长环境。'}],selected:1}],doc:1,nextDoc:2,nextSlide:3,message:'当前选中牡丹页。'
  },s=>{
    const doc=s.docs.find(d=>d.id===s.doc),slide=doc.slides.find(x=>x.id===doc.selected);
    return controls(select('doc','演示文稿',s.doc,s.docs.map(d=>[d.id,'演示文稿'+d.id])))+office('PowerPoint','开始',btn('Ctrl+M · 新建幻灯片','new')+btn('Ctrl+D · 复制所选页','duplicate')+btn('Ctrl+N · 新建演示文稿','document'),
      `<div class="lab-deck"><aside>${doc.slides.map((x,i)=>btn(`${i+1} · ${esc(x.title||'空白标题')}`,'page',x.id,`aria-pressed="${x.id===doc.selected}"`)).join('')}</aside><div class="lab-slide">${field('title','标题',slide.title)}<label>正文<textarea data-field="body" rows="3">${esc(slide.body)}</textarea></label></div></div>`)+output(esc(s.message))+`<p class="core-caption">本例快捷键作用于幻灯片缩略图选择。文字输入框内保留文字编辑键盘行为。</p>`;
  },(s,a,v)=>{
    const doc=s.docs.find(d=>d.id===s.doc),i=doc.slides.findIndex(x=>x.id===doc.selected);
    if(a==='page')doc.selected=Number(v);
    if(a==='new'||a==='duplicate'){const slide=a==='duplicate'?{...doc.slides[i],id:s.nextSlide++}:{id:s.nextSlide++,title:'',body:''};doc.slides.splice(i+1,0,slide);doc.selected=slide.id;s.message=a==='duplicate'?'已复制所选页的标题与正文。':'已插入空白的新页，没有复制原页内容。';}
    if(a==='document'){const id=s.nextDoc++,slide={id:s.nextSlide++,title:'',body:''};s.docs.push({id,slides:[slide],selected:slide.id});s.doc=id;s.message='已创建另一份文稿；上方可切回保留的原文稿。';}
  },(s,k,v)=>{if(k==='doc')s.doc=Number(v);else{const d=s.docs.find(d=>d.id===s.doc);d.slides.find(x=>x.id===d.selected)[k]=v;}});
  registry.y2024q12.keydown=(s,e)=>{if(!e.ctrlKey||e.target.closest('input,textarea,select'))return false;const action={m:'new',d:'duplicate',n:'document'}[e.key.toLowerCase()];if(!action)return false;e.preventDefault();registry.y2024q12.action(s,action);return true;};

  register(['y2026q53'],'更换图源，检查同一个图片对象的效果','拖右下角调整大小，拖左侧裁剪柄改变可见区域；更换图片与删除后重插分别处理。',{
    object:1,source:'A',width:240,height:160,crop:0,animation:true,message:'对象1 · 原图A，已有淡入动画。图形仅代表图片内容。'
  },s=>office('PowerPoint','图片工具 · 格式',btn('更改图片','replace')+btn('删除后重新插入','reinsert')+btn('检查裁剪与动画','inspect'),
    `<div class="lab-picture-stage"><div class="lab-edit-picture" style="width:min(100%,${s.width}px);height:${s.height}px" aria-label="图片对象${s.object}"><div class="lab-picture-content" style="clip-path:inset(0 0 0 ${s.crop}%);background:${s.source==='A'?'#dacced':'#f2d0db'}"><b>${s.source==='A'?'原图A':'新图B'}</b><span>图片内容</span></div><button data-lab-drag="picture-crop" class="lab-crop-grip" aria-label="向右拖动裁剪左边界"></button><button data-lab-drag="picture-size" class="lab-resize-grip" aria-label="拖动调整图片大小"></button></div></div>`+
    controls(field('width','宽度（示例px）',s.width,'number','min="120" max="400"')+field('height','高度（示例px）',s.height,'number','min="100" max="260"')+field('crop','左侧裁剪（%）',s.crop,'range','min="0" max="65" step="1"'))+
    `<p>对象${s.object} · 图源${s.source} · 动画：<b>${s.animation?'淡入':'无'}</b> · 裁掉左侧 ${s.crop}%</p>`)+output(esc(s.message)),
    (s,a)=>{if(a==='replace'){s.source=s.source==='A'?'B':'A';s.message='只更换图源，仍是对象'+s.object+'，尺寸、裁剪与已有动画保留。实际替换后仍应核对效果。';}if(a==='reinsert'){s.object++;s.source='B';s.width=240;s.height=160;s.crop=0;s.animation=false;s.message='已建立新对象'+s.object+'，旧对象的动画和裁剪没有转移。';}if(a==='inspect')s.message=`当前对象${s.object}：图源${s.source}，${s.width}×${s.height}，左裁剪${s.crop}%，${s.animation?'淡入动画仍在':'没有动画'}。检查不会改变这些状态。`;},
    (s,k,v)=>{s[k]=Math.round(number(v,k==='width'?120:k==='height'?100:0,k==='width'?400:k==='height'?260:65));});
  registry.y2026q53.gesture=(s,g,root)=>{if(g.kind==='picture-size'){s.width=Math.round(number(s.width+g.endX-g.x,120,400));s.height=Math.round(number(s.height+g.endY-g.y,100,260));}if(g.kind==='picture-crop'){const width=root.querySelector('.lab-edit-picture').getBoundingClientRect().width||s.width;s.crop=Math.round(number(s.crop+(g.endX-g.x)/width*100,0,65));}s.message='图片对象的尺寸或裁剪已改变，图源与动画保持原状态。';};

  register(['y2024q26'],'旋转艺术字，组合后继续编辑组内文字','拖动旋转手柄，或用角度输入；按住Shift拖动时按15°步长对齐。',{
    angle:0,text:'课程展示',grouped:false,message:'艺术字保留为可编辑文字对象。'
  },s=>office('PowerPoint','绘图工具 · 格式',btn(s.grouped?'取消组合':'与矩形组合','group')+btn('组合是否变成位图？','explain'),
    `<div class="lab-art-stage"><div class="lab-rotating-art" style="transform:rotate(${s.angle}deg)"><button data-lab-drag="rotate-art" class="lab-rotation-grip" aria-label="旋转手柄"></button><strong>${esc(s.text)}</strong>${s.grouped?'<span>组内矩形</span>':''}</div></div>`+
    controls(field('angle','旋转角度',s.angle,'number','min="-180" max="180"')+field('text',s.grouped?'编辑组内艺术字':'编辑艺术字',s.text,'text','maxlength="16"')))+output(esc(s.message)),
    (s,a)=>{if(a==='group'){s.grouped=!s.grouped;s.message=s.grouped?'两个对象已组合，艺术字仍能单独编辑。':'已取消组合。';}if(a==='explain')s.message='组合只建立共同操作的对象组，不会自动栅格化为位图。现在仍可修改下面的文字。';},
    (s,k,v)=>{s[k]=k==='angle'?Math.round(number(v,-180,180)):v;});
  registry.y2024q26.gesture=(s,g,root)=>{if(g.kind!=='rotate-art')return;const r=root.querySelector('.lab-art-stage').getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;let angle=Math.atan2(g.endY-y,g.endX-x)*180/Math.PI+90;angle=((angle+540)%360)-180;s.angle=Math.round(g.shiftKey?Math.round(angle/15)*15:angle);s.message=`已旋转到${s.angle}°${g.shiftKey?'，按15°步长对齐':''}，内容仍可编辑。`;};
})();
