/* Suggested replacements; root integrates after note-labs-audit.js.
   Shared engine hooks needed:
   1. focusin: if target [data-field], call model.focus?.(state, target.dataset.field).
   2. pointermove: use the existing file transform preview for kind==='object' as well.
*/
(() => {
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,office,paper,dialog,output,esc,number}=ui;
const controls=s=>`<div class="lab-controls">${s}</div>`;
const expandRuns=runs=>runs.flatMap(r=>[...r.text].map(ch=>({text:ch,font:r.font})));
const compactRuns=chars=>chars.reduce((a,c)=>{if(!c.text)return a;if(a.length&&a.at(-1).font===c.font)a.at(-1).text+=c.text;else a.push({...c});return a;},[]);
function replaceRuns(runs,find,replacement,findFont,replaceFont){
 const chars=expandRuns(runs),needle=[...find],replacementChars=[...replacement],result=[];let count=0;
 if(!needle.length)return{runs,count};
 for(let i=0;i<chars.length;){
  const match=needle.every((ch,j)=>chars[i+j]?.text===ch&&(!findFont||chars[i+j]?.font===findFont));
  if(!match){result.push(chars[i++]);continue;}
  replacementChars.forEach((ch,j)=>result.push({text:ch,font:replaceFont||((replacement===find?chars[i+j]:chars[i])?.font)||'常规'}));
  i+=needle.length;count++;
 }
 return{runs:compactRuns(result),count};
}
register(['y2025q48'],'先确定查找对象，再设置替换内容与格式','查找跨越格式边界也能匹配；只有明确设置替换字体时才统一字形。',{
 find:'山东',replacement:'山东',pane:false,more:false,fontPane:false,target:'find',findFont:null,replaceFont:null,draftFont:'常规',message:'先打开替换，查看粗体与普通正文。',
 runs:[{text:'山东',font:'加粗'},{text:'专升本资料。',font:'常规'},{text:'山东',font:'加粗'},{text:'省考试信息。其他正文保持原样。',font:'常规'}]
},s=>office('Word','开始',btn('替换','open'),`${s.pane?dialog('查找和替换',field('find','查找内容',s.find,'text',s.fontPane?'disabled':'')+`<small>查找格式：${s.findFont||'不限'}</small>`+field('replacement','替换为',s.replacement,'text',s.fontPane?'disabled':'')+`<small>替换格式：${s.replaceFont||'未指定，保留匹配文字的格式'}</small>`+btn(s.more?'更少':'更多','more','',s.fontPane?'disabled':'')+(s.more?btn('格式 → 字体…','font','',s.fontPane?'disabled':'')+btn('不限定格式','clearFont','',s.fontPane?'disabled':''):'')+(s.fontPane?dialog(s.fontTarget==='find'?'查找字体':'替换字体',select('draftFont','字形',s.draftFont,[['常规','常规'],['加粗','加粗'],['倾斜','倾斜']]),btn('确定','fontOK')+btn('取消','fontCancel')):''),btn('全部替换','replace','',s.fontPane?'disabled':'')+btn('关闭','close','',s.fontPane?'disabled':'')):''}${paper(`<p>${s.runs.map(r=>`<span style="font-weight:${r.font==='加粗'?700:400};font-style:${r.font==='倾斜'?'italic':'normal'}">${esc(r.text)}</span>`).join('')}</p>`)}`)+output(s.message),
(s,a)=>{
 if(a==='open'){s.pane=true;s.target='find';}
 if(a==='close'){s.pane=false;s.fontPane=false;}
 if(a==='more')s.more=!s.more;
 if(a==='font'){s.fontTarget=s.target;s.draftFont=(s.target==='find'?s.findFont:s.replaceFont)||'常规';s.fontPane=true;}
 if(a==='fontOK'){s[s.fontTarget==='find'?'findFont':'replaceFont']=s.draftFont;s.fontPane=false;s.message=(s.fontTarget==='find'?'查找':'替换为')+'格式已设为'+s.draftFont+'。';}
 if(a==='fontCancel'){s.fontPane=false;s.message='字体设置已取消，已应用的查找/替换条件不变。';}
 if(a==='clearFont'){s[s.target==='find'?'findFont':'replaceFont']=null;s.message='已清除'+(s.target==='find'?'查找':'替换为')+'的格式条件。';}
 if(a==='replace'&&!s.fontPane){if(!s.find){s.message='本演示请先输入要查找的文字。';return;}const r=replaceRuns(s.runs,s.find,s.replacement,s.findFont,s.replaceFont);s.runs=r.runs;s.message=`实际替换 ${r.count} 处。`+(s.replaceFont?'匹配文字的字形改为'+s.replaceFont+'。':'未指定替换字体，保留原有字形。');}
});
registry.y2025q48.focus=(s,k)=>{if(k==='find'||k==='replacement')s.target=k;};
registry.y2025q48.replaceRuns=replaceRuns;

const objectLabels={photo:'图片',shape:'形状',wordart:'医学与 AI'};
const initialObjects=[{id:'photo',x:6,y:10,w:28,h:42},{id:'shape',x:55,y:10,w:35,h:24},{id:'wordart',x:48,y:62,w:45,h:23}];
const groupBounds=s=>{const os=s.objects.filter(o=>s.group.includes(o.id));return{x:Math.min(...os.map(o=>o.x)),y:Math.min(...os.map(o=>o.y)),right:Math.max(...os.map(o=>o.x+o.w)),bottom:Math.max(...os.map(o=>o.y+o.h))};};
const objectHTML=(s,o,offset={x:0,y:0},parentSize={w:100,h:100})=>btn(objectLabels[o.id]+(o.id==='photo'?`<small>${s.wrap==='inline'?'嵌入型':'四周型'}</small>`:''),'select',o.id,`class="lab-group-item ${s.selected.includes(o.id)?'lab-selected':''}" style="position:absolute;left:${(o.x-offset.x)/parentSize.w*100}%;top:${(o.y-offset.y)/parentSize.h*100}%;width:${o.w/parentSize.w*100}%;height:${o.h/parentSize.h*100}%;border:2px solid ${s.selected.includes(o.id)?'#7e559b':'#c6a9ca'};background:${o.id==='photo'?'#e7d9f2':'#fae6ee'};border-radius:${o.id==='shape'?'24':'4'}px" aria-pressed="${s.selected.includes(o.id)}"`);
register(['y2026q36'],'先把图片变为浮动对象，再多选、组合和拖动','Ctrl单击可添加或移除选中对象；安卓可启用卡片外的辅助多选。',{objects:initialObjects,wrap:'inline',selected:[],group:[],groupSelected:false,assist:false,message:'当前图片为嵌入型。先选中图片，再设为四周型环绕。'},s=>{
 const canGroup=s.selected.length>=2&&(!s.selected.includes('photo')||s.wrap!=='inline')&&!s.group.length;
 const group=s.group.length?groupBounds(s):null;
 const groupHTML=group?`<div data-lab-drag="object" class="lab-object-group ${s.groupSelected?'lab-selected':''}" style="position:absolute;left:${group.x}%;top:${group.y}%;width:${group.right-group.x}%;height:${group.bottom-group.y}%;border:2px dashed #a46499;touch-action:none" tabindex="0" aria-label="已组合对象，可拖动">${s.objects.filter(o=>s.group.includes(o.id)).map(o=>objectHTML(s,o,group,{w:group.right-group.x,h:group.bottom-group.y})).join('')}</div>`:'';
 return controls(`<label><input type="checkbox" data-field="assist" ${s.assist?'checked':''}>辅助多选（触屏使用，作用等同按住Ctrl）</label>`)+office('Word','绘图工具 · 格式',btn('环绕文字 → 四周型','wrap','',s.selected.includes('photo')&&!s.group.length?'':'disabled')+btn('组合','group','',canGroup?'':'disabled')+btn('取消组合','ungroup','',s.group.length?'':'disabled'),`<div class="lab-group-canvas" style="position:relative;min-height:330px;background:#fff;border:1px solid #dfd3e0;overflow:hidden">${s.objects.filter(o=>!s.group.includes(o.id)).map(o=>objectHTML(s,o)).join('')}${groupHTML}</div>`)+output(s.message);
},(s,a,v)=>{
 if(a==='select'){
  if(s.group.includes(v)){s.groupSelected=true;s.selected=[...s.group];s.message='已选中组合外框。拖动外框时，组合内对象一起移动。';return;}
  s.groupSelected=false;s.selected=s._ctrl||s.assist?(s.selected.includes(v)?s.selected.filter(id=>id!==v):[...s.selected,v]):[v];s.message='当前选中：'+(s.selected.map(id=>objectLabels[id]).join('、')||'无')+'。';
 }
 if(a==='wrap'&&s.selected.includes('photo')){s.wrap='square';s.message='图片改为四周型，具备与浮动形状组合的条件。';}
 if(a==='group'){
  if(s.selected.length<2){s.message='至少选择两个对象。';return;}
  if(s.selected.includes('photo')&&s.wrap==='inline'){s.message='选区包含嵌入型图片，先改变其环绕方式。';return;}
  s.group=[...s.selected];s.groupSelected=true;s.message=`已组合 ${s.group.length} 个所选对象；未选中的对象不加入。可拖动组合外框验证。`;
 }
 if(a==='ungroup'){s.selected=[...s.group];s.group=[];s.groupSelected=false;s.message='已取消组合，各对象保持当前位置。';}
});
registry.y2026q36.gesture=(s,g,root)=>{
 if(g.kind!=='object'||!s.group.length)return;
 const rect=root.querySelector('.lab-group-canvas').getBoundingClientRect(),b=groupBounds(s);
 const dx=number(g.dx/rect.width*100,-b.x,100-b.right),dy=number(g.dy/rect.height*100,-b.y,100-b.bottom);
 s.objects.forEach(o=>{if(s.group.includes(o.id)){o.x+=dx;o.y+=dy;}});
 s.message=`组合内 ${s.group.length} 个对象一起移动，相对位置不变。`;
};
})();

(() => {
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,office,paper,dialog,output,esc,number}=ui;
const controls=s=>`<div class="lab-controls">${s}</div>`;
const chapters=[['第一章 信息技术','数据是信息的符号化表示。'],['第二章 操作系统','操作系统管理硬件和软件资源。']];
register(['merged-5'],'切换同一文档的视图，再让导航识别标题','点击文档标题后应用标题1，导航按真实结构生成；手工放大不产生标题层级。',{view:'print',tab:'view',nav:true,styled:[false,false],selected:0,collapsed:[],message:'两个标题只有大号粗体外观，导航暂时没有标题。'},s=>{
 const navigation=s.nav?`<aside style="padding:12px;background:#f5edf7"><b>导航 · 标题</b>${s.styled.some(Boolean)?chapters.map((p,i)=>s.styled[i]?btn(p[0],'select',i):'').join(''):'<p>此文档不包含标题。</p>'}</aside>`:'';
 let doc='';
 if(s.view==='outline')doc=`<div style="padding:16px;background:#fff">${chapters.map((p,i)=>`<div>${s.styled[i]?btn((s.collapsed.includes(i)?'＋':'−')+' '+p[0],'collapse',i):`<p>${p[0]}（正文级别）</p>`}${s.collapsed.includes(i)?'':`<p style="padding-left:24px">${p[1]}</p>`}</div>`).join('')}</div>`;
 else doc=chapters.map((p,i)=>s.view==='read'?`<section style="padding:18px;background:#fff"><h3>${p[0]}</h3><p>${p[1]}</p></section>`:paper(`<header style="font-size:12px">计算机学习文档</header>${btn(p[0],'select',i,`class="lab-heading-pick ${s.selected===i?'lab-selected':''}" style="font-size:20px;font-weight:700;display:block;width:100%;text-align:left"`)}<p>${p[1]}</p><footer>第 ${i+1} 页</footer>`)).join('');
 return controls(select('tab','功能区位置',s.tab,[['view','视图'],['home','开始']]))+office('Word',s.tab==='view'?'视图':'开始',s.tab==='view'?btn('打印布局','view','print')+btn('大纲','view','outline')+btn('阅读模式','view','read')+btn(s.nav?'隐藏导航窗格':'导航窗格','nav'):btn('标题 1','style')+btn('正文','plain'),`${navigation}<div>${doc}</div>`)+output(s.message||`当前${{print:'打印布局',outline:'大纲',read:'阅读模式'}[s.view]}；文档文字不变。`);
},(s,a,v)=>{if(a==='view'){s.view=v;s.message=`已切到${{print:'打印布局：显示分页及页眉页脚',outline:'大纲：按标题结构折叠正文',read:'阅读模式：集中显示供阅读的内容'}[v]}。`;}if(a==='nav')s.nav=!s.nav;if(a==='select'){s.selected=Number(v);s.message='当前选中：'+chapters[s.selected][0]+'。';}if(a==='style'){s.styled[s.selected]=true;s.message='所选段落应用标题1，导航新增对应标题。';}if(a==='plain'){s.styled[s.selected]=false;s.message='所选段落改回正文级别，导航移除对应标题。';}if(a==='collapse'){const i=Number(v);s.collapsed=s.collapsed.includes(i)?s.collapsed.filter(x=>x!==i):[...s.collapsed,i];}});

const listTexts=['信息技术基础','计算机发展','计算机系统'];
function listNumbers(levels){let one=0,two=0;return levels.map(level=>level===1?(two=0,String(++one)):`${Math.max(1,one)}.${++two}`);}
register(['merged-8'],'改变列表级别，观察编号与文本起点分别变化','光标在列表文字起始处；按Tab或Shift+Tab调整当前项级别，其他编号自动接续。',{levels:[1,1,1],selected:1,positions:[0,0,0],textPositions:[2,2,2],pane:false,draftNumber:0,draftText:2,message:'当前选中第2项。编号位置与文本缩进分开设置。'},s=>{
 const numbers=listNumbers(s.levels);
 return office('Word','开始',btn('多级列表 · 调整列表缩进…','open'),`${s.pane?dialog('调整列表缩进',field('draftNumber','编号位置（相对字符）',s.draftNumber,'number','min="0" max="6"')+field('draftText','文本缩进（相对字符）',s.draftText,'number','min="1" max="10"'),btn('确定','apply')+btn('取消','cancel')):''}${paper(listTexts.map((text,i)=>`<div style="position:relative;min-height:58px;padding-left:${s.textPositions[i]}em;background:${s.selected===i?'#f4e5f5':'transparent'}"><b style="position:absolute;left:${s.positions[i]}em;top:12px">${numbers[i]}</b>${btn(text,'select',i,`style="text-align:left;border:0;background:transparent;padding-block:12px"`)}</div>`).join(''))}`)+controls(btn('模拟键盘：Tab','demote')+btn('模拟键盘：Shift+Tab','promote'))+output(s.message+` 当前第${s.selected+1}项：级别${s.levels[s.selected]}；编号${numbers[s.selected]}；编号位置${s.positions[s.selected]}，文本位置${s.textPositions[s.selected]}。`);
},(s,a,v)=>{const i=s.selected;if(a==='select')s.selected=Number(v);if(a==='demote'&&i>0&&s.levels[i]===1){s.levels[i]=2;s.positions[i]=2;s.textPositions[i]=4;s.message='当前项降为第2级，编号重新计算。';}if(a==='promote'&&s.levels[i]===2){s.levels[i]=1;s.positions[i]=0;s.textPositions[i]=2;s.message='当前项升为第1级，后续编号重新计算。';}if(a==='open'){s.pane=true;s.draftNumber=s.positions[i];s.draftText=s.textPositions[i];}if(a==='cancel')s.pane=false;if(a==='apply'){s.positions[i]=number(s.draftNumber,0,6);s.textPositions[i]=number(s.draftText,s.positions[i]+1,10);s.pane=false;s.message='只改变编号与文字的位置，列表级别保持不变。';}});

register(['y2025q47'],'让文字真正围绕图片重排','同一张透明圆形图，用四周型和紧密型比较包围矩形与轮廓边界。',{wrap:'inline',selected:false,menu:false,message:'嵌入型图片作为行内对象参加排版。'},s=>{
 const image=`<button data-lab-act="select" class="lab-wrap-object" style="width:112px;height:112px;padding:0;border:${s.selected?'2px solid #905b9b':'0'};border-radius:50%;background:radial-gradient(circle at 35% 35%,#f6cadf 0%,#cfb7e9 65%,#9876b7 100%);${s.wrap==='inline'?'display:inline-block;vertical-align:baseline;':`float:left;margin:0 14px 12px 0;${s.wrap==='tight'?'shape-outside:circle(50%);':''}`}" aria-label="选择圆形图片">学习图</button>`;
 const text='图片和文字共同构成文档内容。嵌入型把图片作为一枚大字符；四周型按图片外接矩形留出区域；紧密型允许文字贴近透明图片的可见轮廓。改变环绕方式会重新计算文字行的位置，文字本身保持不变。这里使用圆形图片，便于观察矩形边界与曲线边界的区别。';
 return office('Word',s.selected?'图片工具 · 格式':'开始',btn('环绕文字 ▾','menu','',s.selected?'':'disabled'),`${s.menu?dialog('环绕文字',btn('嵌入型','wrap','inline')+btn('四周型','wrap','square')+btn('紧密型','wrap','tight'),btn('关闭','close')):''}${paper(`<div style="display:flow-root;font-size:16px;line-height:1.85"><p style="margin:0">${image}${text}</p></div>`)}`)+output(s.message);
},(s,a,v)=>{if(a==='select')s.selected=true;if(a==='menu'&&s.selected)s.menu=true;if(a==='close')s.menu=false;if(a==='wrap'){s.wrap=v;s.menu=false;s.message={inline:'图片已回到文字行内。',square:'文字绕开图片的外接矩形，四角仍留白。',tight:'文字按圆形轮廓重排，可进入外接矩形四角的空白。'}[v];}});

register(['y2024q8'],'先改变选择范围，再比较删除内容与删除表格','点击表格移动控点选择整表；点击单元格只把插入位置放在该格。',{values:[['姓名','日期'],['王宁','9月4日'],['李悦','9月5日']],selection:'all',cell:[1,0],removed:false,message:'初始已选中整表，包括标题行。'},s=>
 office('Word','表格工具 · 布局',btn('删除 → 删除表格','remove','',s.removed?'disabled':''),paper(s.removed?'<p>表格结构已删除；后续正文回流到这里。</p>':`${btn('✥','all','',`aria-label="选择整张表格"`)}<table style="width:100%;border-collapse:collapse">${s.values.map((r,i)=>`<tr>${r.map((v,j)=>`<${i===0?'th':'td'} style="border:1px solid #9778a1;padding:9px;background:${s.selection==='all'||s.cell[0]===i&&s.cell[1]===j?'#f4e6f3':'#fff'}">${btn(esc(v)||'　','cell',i+','+j,`style="border:0;background:transparent;min-width:30px;min-height:34px"`)}</${i===0?'th':'td'}>`).join('')}</tr>`).join('')}</table>`))+controls(btn('模拟键盘：Delete','delete','',s.removed?'disabled':'')+btn('模拟键盘：Backspace','backspace','',s.removed?'disabled':''))+output(s.message),
 (s,a,v)=>{if(a==='all')s.selection='all';if(a==='cell'){s.selection='cell';s.cell=v.split(',').map(Number);s.message='插入位置在当前单元格文字末尾，未选中整表。';}if(a==='remove'||a==='backspace'&&s.selection==='all'){s.removed=true;s.message='表格及其内容已删除。';}if(a==='delete'){if(s.selection==='all'){s.values=s.values.map(r=>r.map(()=>''));s.message='包括标题行在内的全部内容清空，表格网格保留。';}else s.message='当前插入位置在格内文字末尾，Delete不会删除表格结构。';}if(a==='backspace'&&s.selection==='cell'){const [i,j]=s.cell;s.values[i][j]=[...s.values[i][j]].slice(0,-1).join('');s.message='只删除插入点前的一个字符，表格结构保留。';}});
})();

/* Review proposal. Load after note-labs-audit.js and before notes-app.js. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,table,coach,output,office,dialog,esc,money}=ui;
  const controls=body=>`<div class="lab-controls">${body}</div>`;
  const clone=value=>structuredClone(value);

  register(['y2020q49'],'按选定列组合判重，保留每组第一条','勾选学号或多列组合，再确认哪些整行会被移除。',{
    rows:[['20260018','王宁','13000000001'],['20260018','王宁','13000000002'],['20260019','李悦','13000000003']],
    selected:false,pane:false,keys:[true,false,false],draft:[true,false,false],before:null,message:'先点一个数据单元格，确定要处理的数据区域。'
  },s=>office('Excel','数据',btn('删除重复项','open'),table(['学号','姓名','虚构示例号码'],s.rows.map(r=>r.map((v,i)=>i===0?btn(esc(v),'select','',`class="${s.selected?'lab-selected':''}"`):esc(v))))+
    (s.pane?dialog('删除重复项','<p>根据勾选列的组合判断重复；删除时移除整行，保留首次出现的记录。</p>'+['学号','姓名','电话'].map((name,i)=>`<label><input type="checkbox" data-field="key${i}" ${s.draft[i]?'checked':''}>${name}</label>`).join(''),btn('确定','apply')+btn('取消','cancel')):''))+
    controls(btn('撤销本次删除','undo','',s.before?'':'disabled'))+output(s.message)+coach('两条同学号记录的电话不同：只按学号会判重；同时按学号和电话，两条都保留。'),
    (s,a)=>{
      if(a==='select'){s.selected=true;s.message='已识别连续区域 A1:C'+(s.rows.length+1)+'，包括三列完整记录。';}
      if(a==='open'){if(!s.selected){s.message='先选中数据区域中的单元格。';return;}s.draft=[...s.keys];s.pane=true;}
      if(a==='cancel')s.pane=false;
      if(a==='apply'){
        const indexes=s.draft.flatMap((v,i)=>v?[i]:[]);if(!indexes.length){s.message='至少选择一列作为判重依据。';return;}
        const seen=new Set(),before=clone(s.rows);s.rows=s.rows.filter(row=>{const key=JSON.stringify(indexes.map(i=>row[i]));if(seen.has(key))return false;seen.add(key);return true;});
        s.before=before;s.keys=[...s.draft];s.pane=false;s.message=`移除 ${before.length-s.rows.length} 条重复记录，保留 ${s.rows.length} 条。判重列：${indexes.map(i=>['学号','姓名','电话'][i]).join('＋')}。`;
      }
      if(a==='undo'&&s.before){s.rows=clone(s.before);s.before=null;s.message='已恢复删除前的所有记录。';}
    },(s,k,v)=>{if(k.startsWith('key'))s.draft[Number(k.slice(3))]=v;});

  const grades=[['一班',80,70,90],['二班',90,60,80],['一班',100,90,70],['二班',70,80,90]];
  const defaults={aggregate:'average',math:true,english:true,computer:true};
  register(['y2020q58'],'相邻记录分组，再汇总三门课','先看未排序的小计，再移除汇总并按班级排序，对照分组结果。',{
    sorted:false,pane:false,applied:null,draft:defaults,level:3,message:'先排序可使同班记录连续。也可以直接汇总，观察相邻分组产生的多个同名小计。'
  },s=>{
    const source=s.sorted?[...grades].sort((a,b)=>a[0].localeCompare(b[0])):grades;
    let display=source;
    if(s.applied){
      const groups=[];for(const row of source){if(!groups.length||groups.at(-1)[0][0]!==row[0])groups.push([]);groups.at(-1).push(row);}
      const agg=rows=>[1,2,3].map((col,i)=>!s.applied[['math','english','computer'][i]]?'':s.applied.aggregate==='count'?rows.length:money(rows.reduce((sum,r)=>sum+r[col],0)/(s.applied.aggregate==='average'?rows.length:1)));
      display=groups.flatMap(rows=>[...(s.level===3?rows:[]),...(s.level>=2?[[rows[0][0]+' 小计',...agg(rows)]]:[])]);
      display.push(['总计',...agg(source)]);
    }
    return office('Excel','数据',btn('按班级排序','sort','',s.applied?'disabled':'')+btn('分类汇总…','open'),
      (s.pane?dialog('分类汇总','<p>分类字段：班级</p>'+select('aggregate','汇总方式',s.draft.aggregate,[['average','平均值'],['sum','求和'],['count','计数']])+['math','english','computer'].map((k,i)=>`<label><input type="checkbox" data-field="${k}" ${s.draft[k]?'checked':''}>${['数学','英语','计算机'][i]}</label>`).join(''),btn('确定','apply')+btn('取消','cancel')+btn('全部删除汇总','remove','',s.applied?'':'disabled')):'')+
      (s.applied?controls([1,2,3].map(n=>btn(String(n),'level',n,`aria-label="大纲层级${n}"`)).join('')):'')+table(['班级','数学','英语','计算机'],display))+output(s.message);
  },(s,a,v)=>{
    if(a==='sort'&&!s.applied){s.sorted=true;s.message='同班记录已连续排列，可以重新建立分类汇总。';}
    if(a==='open'){s.draft=clone(s.applied||defaults);s.pane=true;}
    if(a==='cancel')s.pane=false;
    if(a==='apply'){
      if(!['math','english','computer'].some(k=>s.draft[k])){s.message='至少选择一个汇总列。';return;}
      s.applied=clone(s.draft);s.pane=false;s.level=3;
      s.message=s.sorted?'每班一个小计；层级1显示总计，2显示小计，3显示明细。总平均由全部原始记录计算。':'未排序时按相邻记录分组，出现多个同名小计。可在分类汇总中全部删除汇总，排序后重做。';
    }
    if(a==='remove'){s.applied=null;s.pane=false;s.message='已移除小计与大纲，原始数据完整保留。';}
    if(a==='level')s.level=Number(v);
  },(s,k,v)=>{s.draft[k]=v;});

  register(['y2026q49'],'区分文本、空白和0，再看实际平均值','转换所选源单元格，或在E列写VALUE公式；三种数据不会按同一种方式统计。',{
    mode:'average',team:'示例一组',rows:[['示例一组','18',true],['示例二组','14',false],['示例一组','25',false],['示例一组','15',true],['示例二组','11',false]],selected:0,method:'error',valueRows:[],message:'选一行再转换。清空单元格代表空白，输入0代表数值零。'
  },s=>{
    const eligible=s.rows.filter(r=>!r[2]&&r[1].trim()!==''&&Number.isFinite(Number(r[1]))),matched=eligible.filter(r=>r[0]===s.team);
    const result=s.mode==='sum'?eligible.reduce((sum,r)=>sum+Number(r[1]),0):matched.length?matched.reduce((sum,r)=>sum+Number(r[1]),0)/matched.length:'#DIV/0!';
    const valueResult=r=>r[1].trim()===''?'0':Number.isFinite(Number(r[1]))?money(Number(r[1])):'#VALUE!';
    return controls(select('mode','计算任务',s.mode,[['average','按团队求平均'],['sum','求销售额总和']])+select('team','H5 条件',s.team,[['示例一组','示例一组'],['示例二组','示例二组'],['不存在的组','不存在的组']])+select('method','处理方式',s.method,[['error','单元格错误提示'],['columns','数据→分列'],['value','另列VALUE公式']]))+
      office('Excel',s.method==='columns'?'数据':'公式',s.method==='columns'?btn('分列 → 常规 → 完成','convert'):s.method==='value'?btn('在所选行E列输入VALUE公式','convert'):'',
        table(['行','C 团队','D 销售额','类型','E VALUE公式结果'],s.rows.map((r,i)=>[btn(String(i+3),'select',i,`aria-pressed="${s.selected===i}"`),esc(r[0]),field('amount'+i,'第'+(i+3)+'行金额',r[1]),r[1]===''?'空白':r[2]?'文本':'数值',s.valueRows.includes(i)?`${valueResult(r)}<small>=VALUE(D${i+3})</small>`:'—']))+
        (s.method==='error'?btn('⚠ 所选单元格 → 转换为数字','convert'):'')+`<code>${s.mode==='sum'?'=SUM(D3:D7)':'=AVERAGEIF(C3:C7,H5,D3:D7)'}</code>`+output(`结果：${typeof result==='number'?money(result):result}。空白与文本不进入平均分母；数值0会进入。`))+output(s.message);
  },(s,a,v)=>{
    if(a==='select')s.selected=Number(v);
    if(a==='convert'){
      const row=s.rows[s.selected];
      if(s.method==='value'){if(!s.valueRows.includes(s.selected))s.valueRows.push(s.selected);s.message='E列保存VALUE公式，源D列不变；改动D列后E列跟着重算，D列原平均值仍按源数据类型计算。';return;}
      if(row[1].trim()===''||!Number.isFinite(Number(row[1]))){s.message='当前单元格为空白或不是可转换的数字文本；未改动源值。';return;}
      row[1]=String(Number(row[1]));row[2]=false;s.message='D列所选源格已成为数值，求和与平均值重新计算。';
    }
  },(s,k,v)=>{if(k.startsWith('amount')){const row=s.rows[Number(k.slice(6))];row[1]=v;if(!row[2]&&v.trim()!==''&&!Number.isFinite(Number(v)))row[2]=true;}else s[k]=v;});
})();

/* Read-only review suggestion: load after proposed-word-models.js. */
(() => {
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,office,paper,dialog,output,table,esc,number}=ui;
const controls=s=>`<div class="lab-controls">${s}</div>`;

const old=registry.y2024q8,original={render:old.render,action:old.action,change:old.change};
Object.assign(old.initial,{scenario:'delete',raw:'姓名\t成绩\n王宁\t80\n李明\t95',separator:'tab',converted:null,convertPane:false,sortRows:[['王宁',9],['李明',80],['张宁',100]],sortPane:false,sortType:'number',sortOrder:'asc',draftType:'number',draftOrder:'asc',formulaValues:[80,95],formula:'=SUM(ABOVE)',draftFormula:'=SUM(ABOVE)',formulaPane:false,formulaInserted:false,formulaResult:null,fieldSelected:true,extraMessage:''});
function parseText(s){const splitter=s.separator==='tab'?'\t':s.separator==='comma'?',':' ';return s.raw.split(/\r?\n/).map(line=>line.split(splitter));}
function sumFormula(s){const m=/^=(SUM|AVERAGE|MAX|MIN)\(ABOVE\)$/i.exec(s.formula.trim());if(!m)return null;const nums=s.formulaValues.map(Number);if(nums.some(x=>!Number.isFinite(x)))return null;return{SUM:()=>nums.reduce((a,b)=>a+b,0),AVERAGE:()=>nums.reduce((a,b)=>a+b,0)/nums.length,MAX:()=>Math.max(...nums),MIN:()=>Math.min(...nums)}[m[1].toUpperCase()]();}
old.render=s=>{
 const picker=controls(select('scenario','同一知识点的操作',s.scenario,[['delete','选择范围与删除'],['convert','文本转换为表格'],['formula','表格公式与F9更新'],['sort','按数值排序']]));
 if(s.scenario==='delete')return picker+original.render(s);
 if(s.scenario==='convert')return picker+office('Word','插入',btn('表格 → 将文本转换成表格…','convertOpen'),`${s.convertPane?dialog('将文本转换成表格',select('separator','文字分隔位置',s.separator,[['tab','制表符'],['comma','逗号'],['space','空格']])+`<p>按所选分隔符预览：${parseText(s).length}行，最多${Math.max(...parseText(s).map(r=>r.length))}列。</p>`,btn('确定','convertApply')+btn('取消','convertCancel')):''}${paper(s.converted?table(s.converted[0].map(esc),s.converted.slice(1).map(r=>r.map(esc))):`<label>待转换文本（当前整段已选中）<textarea data-field="raw" rows="5">${esc(s.raw)}</textarea></label>`)}`)+output(s.extraMessage||'每个段落形成一行；段内分隔符决定拆成几列。当前文本用Tab分隔姓名和成绩。');
 if(s.scenario==='formula')return picker+office('Word','表格工具 · 布局',btn('公式…','formulaOpen'),`${s.formulaPane?dialog('公式',field('draftFormula','公式',s.draftFormula)+'<p>ABOVE表示同列上方单元格。本演示支持SUM、AVERAGE、MAX、MIN。</p>',btn('确定','formulaApply')+btn('取消','formulaCancel')):''}${paper(table(['姓名','成绩'],[['王宁',field('score0','王宁成绩',s.formulaValues[0],'number')],['李明',field('score1','李明成绩',s.formulaValues[1],'number')],['汇总',btn(s.formulaInserted?String(s.formulaResult):'单击选中汇总格','fieldSelect','',`class="${s.fieldSelected?'lab-selected':''}"`)]]))}`)+controls(btn('模拟键盘：F9 更新所选域','formulaUpdate'))+output(s.extraMessage||'汇总格已预留在数据下方。插入公式后改动成绩，显示的域结果不会实时重算；选中域再按F9。');
 return picker+office('Word','表格工具 · 布局',btn('排序…','sortOpen'),`${s.sortPane?dialog('排序','<p>主要关键字：成绩；有标题行。</p>'+select('draftType','类型',s.draftType,[['number','数字'],['text','文本']])+select('draftOrder','次序',s.draftOrder,[['asc','升序'],['desc','降序']]),btn('确定','sortApply')+btn('取消','sortCancel')):''}${paper(table(['姓名','成绩'],s.sortRows.map(([name,score])=>[esc(name),score])))}`)+output(s.extraMessage||'成绩排序要用数字类型。将同一列当文本排序时，比较的是字符顺序。');
};
old.action=(s,a,v)=>{
 if(s.scenario==='delete')return original.action(s,a,v);
 if(a==='convertOpen')s.convertPane=true;
 if(a==='convertCancel')s.convertPane=false;
 if(a==='convertApply'){s.converted=parseText(s);s.convertPane=false;s.extraMessage=`已按${{tab:'制表符',comma:'逗号',space:'空格'}[s.separator]}转换，实际得到${s.converted.length}行、最多${Math.max(...s.converted.map(r=>r.length))}列。`;}
 if(a==='formulaOpen'){s.formulaPane=true;s.draftFormula=s.formula;}
 if(a==='formulaCancel')s.formulaPane=false;
 if(a==='formulaApply'){const before=s.formula;s.formula=s.draftFormula;const result=sumFormula(s);if(result===null){s.formula=before;s.extraMessage='本演示支持 =SUM(ABOVE)、=AVERAGE(ABOVE)、=MAX(ABOVE)、=MIN(ABOVE)。';return;}s.formulaResult=result;s.formulaInserted=true;s.fieldSelected=true;s.formulaPane=false;s.extraMessage='已插入公式域并显示计算结果。试着修改上方成绩。';}
 if(a==='fieldSelect')s.fieldSelected=true;
 if(a==='formulaUpdate'){if(!s.formulaInserted||!s.fieldSelected){s.extraMessage='先插入公式，然后选择汇总格里的公式域。';return;}s.formulaResult=sumFormula(s);s.extraMessage='F9已更新所选公式域：'+s.formula+' → '+s.formulaResult+'。';}
 if(a==='sortOpen'){s.sortPane=true;s.draftType=s.sortType;s.draftOrder=s.sortOrder;}
 if(a==='sortCancel')s.sortPane=false;
 if(a==='sortApply'){s.sortType=s.draftType;s.sortOrder=s.draftOrder;s.sortRows.sort((a,b)=>(s.sortType==='number'?Number(a[1])-Number(b[1]):String(a[1])<String(b[1])?-1:String(a[1])>String(b[1])?1:0)*(s.sortOrder==='asc'?1:-1));s.sortPane=false;s.extraMessage=`已按${s.sortType==='number'?'数字大小':'文本字符顺序'}${s.sortOrder==='asc'?'升序':'降序'}排序，姓名随其成绩整行移动。`;}
};
old.change=(s,k,v)=>{if(k==='scenario'){s.scenario=v;s.extraMessage='';}else if(k.startsWith('score')){s.formulaValues[Number(k.slice(5))]=v;s.fieldSelected=false;s.extraMessage='成绩已修改。旧公式结果暂时保留；选中公式域再按F9更新。';}else if(k==='raw'){s.raw=v;s.converted=null;}else if(original.change)original.change(s,k,v);else s[k]=v;};

register(['merged-5'],'标题结构决定导航与目录，视图决定如何查看','切换五种视图；应用标题样式后插入自动目录，再比较更新页码和更新整个目录。',{view:'print',tab:'view',nav:true,headings:[{title:'第一章 信息技术',body:'数据是信息的符号化表示。',styled:false},{title:'第二章 操作系统',body:'操作系统管理硬件和软件资源。',styled:false}],selected:0,collapsed:[],cover:false,toc:null,tocPane:false,tocMode:'all',message:'标题只有大号粗体外观。先选标题，再在开始中应用标题1。'},s=>{
 const h=s.headings,viewNames={print:'打印布局',outline:'大纲',read:'阅读模式',draft:'草稿',web:'Web版式'};
 const navigation=s.nav?`<aside style="padding:12px;background:#f5edf7"><b>导航 · 标题</b>${h.some(x=>x.styled)?h.map((p,i)=>p.styled?btn(esc(p.title),'select',i):'').join(''):'<p>此文档不包含标题。</p>'}</aside>`:'';
 const toc=s.toc?`<section class="lab-auto-toc" style="padding:16px;background:#fff"><h4>目录</h4>${s.toc.length?s.toc.map(e=>`<p style="display:flex;justify-content:space-between;gap:12px"><span>${esc(e.title)}</span><b>${e.page}</b></p>`).join(''):'<p>未找到目录项。为正文标题应用标题样式后，更新整个目录。</p>'}</section>`:'';
 const title=(p,i)=>btn(esc(p.title),'select',i,`class="${s.selected===i?'lab-selected':''}" style="font-weight:700;font-size:20px;text-align:left;border:0;background:transparent"`);
 let doc='';
 if(s.view==='outline')doc=`<div style="padding:16px;background:#fff">${h.map((p,i)=>`<div>${p.styled?btn((s.collapsed.includes(i)?'＋ ':'− ')+esc(p.title),'collapse',i):`<p>${esc(p.title)}（正文级别）</p>`}${s.collapsed.includes(i)?'':`<p style="padding-left:24px">${esc(p.body)}</p>`}</div>`).join('')}</div>`;
 else if(s.view==='read')doc=h.map(p=>`<section style="padding:18px;background:#fff"><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></section>`).join('');
 else if(s.view==='draft'||s.view==='web')doc=`<div style="padding:${s.view==='web'?'10px':'20px'};background:#fff">${h.map((p,i)=>`${title(p,i)}<p>${esc(p.body)}</p>`).join(s.view==='draft'?'<hr style="border:0;border-top:1px dotted #aaa">':'')}</div>`;
 else doc=(s.cover?paper('<h3>封面</h3><p>计算机学习文档</p>'):'')+h.map((p,i)=>paper(`<header style="font-size:12px">计算机学习文档</header>${title(p,i)}<p>${esc(p.body)}</p><footer>第 ${i+1+(s.cover?1:0)} 页</footer>`)).join('');
 const commands=s.tab==='view'?Object.entries(viewNames).map(([key,name])=>btn(name,'view',key)).join('')+btn(s.nav?'隐藏导航窗格':'导航窗格','nav'):s.tab==='home'?btn('标题 1','style')+btn('正文','plain'):btn('目录 → 自动目录1','tocInsert')+btn('更新目录…','tocOpen','',s.toc?'':'disabled');
 return controls(select('tab','功能区位置',s.tab,[['view','视图'],['home','开始'],['references','引用']]))+office('Word',{view:'视图',home:'开始',references:'引用'}[s.tab],commands,`${navigation}${s.tocPane?dialog('更新目录',select('tocMode','更新方式',s.tocMode,[['pages','只更新页码'],['all','更新整个目录']]),btn('确定','tocApply')+btn('取消','tocCancel')):''}${toc}${doc}`)+controls(field('title','学习编辑器：修改所选标题',h[s.selected].title)+btn(s.cover?'移除前置封面':'在文档前增加一页封面','cover'))+output(s.message);
},(s,a,v)=>{
 if(a==='view'){s.view=v;s.message={print:'显示打印分页与页眉页脚。',outline:'按标题结构显示层级；展开/折叠不删除正文。',read:'简化界面，集中阅读文档。',draft:'草稿简化页面装饰，侧重连续文字编辑。',web:'Web版式适应显示区宽度，不以打印纸张分页。'}[v];}
 if(a==='nav')s.nav=!s.nav;
 if(a==='select'){s.selected=Number(v);s.message='当前所选标题：'+s.headings[s.selected].title+'。';}
 if(a==='style'){s.headings[s.selected].styled=true;s.message='所选段落应用标题1，导航立即识别。已有目录需要更新。';}
 if(a==='plain'){s.headings[s.selected].styled=false;s.message='所选段落改为正文级别；已有目录需要更新整个目录。';}
 if(a==='collapse'){const i=Number(v);s.collapsed=s.collapsed.includes(i)?s.collapsed.filter(x=>x!==i):[...s.collapsed,i];}
 if(a==='cover'){s.cover=!s.cover;s.message='前置页面数变化，标题页码已改变，旧目录保持原结果，需更新。';}
 const entries=()=>s.headings.flatMap((h,i)=>h.styled?[{id:i,title:h.title,page:i+1+(s.cover?1:0)}]:[]);
 if(a==='tocInsert'){s.toc=entries();s.message='在预留目录位置插入自动目录，条目来自标题结构。此局部模型把目录区单独显示，不计入示例正文页码。';}
 if(a==='tocOpen')s.tocPane=true;
 if(a==='tocCancel')s.tocPane=false;
 if(a==='tocApply'){s.toc=s.tocMode==='all'?entries():s.toc.map(e=>({...e,page:e.id+1+(s.cover?1:0)}));s.tocPane=false;s.message=s.tocMode==='all'?'目录标题、条目与页码一起更新。':'仅页码更新；标题文字和已有条目保持原样。';}
},(s,k,v)=>{if(k==='title'){s.headings[s.selected].title=v;s.message='标题已修改；导航读取新标题，已有目录保留上次生成结果。';}else s[k]=v;});
})();

/* Three bounded repair suggestions; load after note-labs-audit.js. No shared engine changes. */
(() => {
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,office,paper,dialog,output,esc,number}=ui;
const controls=s=>`<div class="lab-controls">${s}</div>`;
const alignName={left:'左对齐',center:'居中',right:'右对齐'};

register(['merged-7'],'字号、下划线、对齐与显示比例分别保存','选中标题或正文后设置格式，再放大屏幕观察；放大不会修改文档字号。',{selected:0,size:[16,12],underline:['none','none'],align:['left','left'],zoom:100,message:'初始选中标题；字号、下划线与段落对齐是独立设置。'},s=>
 office('Word','开始',select('size','字号（磅）',s.size[s.selected],[[12,'12'],[16,'16'],[18,'18'],[22,'22']])+select('underline','下划线',s.underline[s.selected],[['none','无'],['single','单下划线'],['double','双下划线']])+select('alignment','段落对齐',s.align[s.selected],[['left','左对齐'],['center','居中'],['right','右对齐']]),`<div class="lab-format-viewport" style="overflow:auto;max-height:460px;width:100%"><div style="zoom:${s.zoom/100}">${paper(['计算机技能竞赛通知','为提高同学们的计算机应用能力，现组织技能竞赛。欢迎各班同学参加。'].map((t,i)=>`<p style="text-align:${s.align[i]};margin-block:18px">${btn(esc(t),'select',i,`class="${s.selected===i?'lab-selected':''}" style="display:inline;white-space:normal;font-size:${s.size[i]}pt;text-decoration-line:${s.underline[i]==='none'?'none':'underline'};text-decoration-style:${s.underline[i]==='double'?'double':'solid'};line-height:1.9;border:0;background:${s.selected===i?'#f6e7f2':'transparent'};padding:0;text-align:inherit"`)}</p>`).join(''))}</div></div>`)+controls(select('zoom','显示比例（对应Word状态栏缩放）',s.zoom,[[100,'100%'],[125,'125%'],[150,'150%']]))+output(`${s.message} 当前${s.selected===0?'标题':'正文'}：${s.size[s.selected]}磅，${{none:'无下划线',single:'单下划线',double:'双下划线'}[s.underline[s.selected]]}，${alignName[s.align[s.selected]]}；屏幕显示${s.zoom}%。`),
 (s,a,v)=>{if(a==='select'){s.selected=Number(v);s.message='已选择'+(s.selected===0?'标题':'正文')+'文字及其所在段落。';}},
 (s,k,v)=>{if(k==='size'){s.size[s.selected]=Number(v);s.message='只修改所选文字的字号，原下划线与对齐保持。';}if(k==='underline'){s.underline[s.selected]=v;s.message='只修改所选文字的下划线，原字号与对齐保持。';}if(k==='alignment'){s.align[s.selected]=v;s.message='只修改所在段落的对齐，字符格式保持。';}if(k==='zoom'){s.zoom=Number(v);s.message='只改变屏幕放大比例；保存和打印仍使用原字号与排版。';}});

register(['y2020q63'],'先移动整张表，再调整格内文字','表格属性决定整表在页面的位置；单元格对齐只决定文字在格内的位置。',{tableAlign:'left',cellH:'left',cellV:'top',pane:false,draftAlign:'left',message:'本例预先选中整张表，各单元格的内容对齐统一设置。'},s=>
 office('Word','表格工具 · 布局',btn('属性…','properties','',s.pane?'disabled':'')+btn('单元格：水平居中','cellCenter','',s.pane?'disabled':'')+btn('单元格：水平垂直居中','cellMiddle','',s.pane?'disabled':'')+btn('单元格：左上对齐','cellReset','',s.pane?'disabled':''),`${s.pane?dialog('表格属性 · 表格',select('draftAlign','对齐方式',s.draftAlign,[['left','左对齐'],['center','居中'],['right','右对齐']]),btn('确定','apply')+btn('取消','cancel')):''}${paper(`<div style="position:relative;width:100%;min-height:235px"><div aria-hidden="true" style="position:absolute;inset:0 50% 0 auto;border-left:1px dashed #dfcbe0"></div><table style="position:relative;border-collapse:collapse;width:72%;margin-left:${s.tableAlign==='left'?'0':'auto'};margin-right:${s.tableAlign==='right'?'0':'auto'}">${[['姓名','成绩'],['王宁','92']].map(r=>`<tr>${r.map(v=>`<td style="height:82px;padding:8px;border:1px solid #977aa1;text-align:${s.cellH};vertical-align:${s.cellV}">${v}</td>`).join('')}</tr>`).join('')}</table></div>`)}`)+output(`${s.message} 整表：${alignName[s.tableAlign]}；格内文字：${s.cellH==='center'?'水平居中':'靠左'}、${s.cellV==='middle'?'垂直居中':'靠上'}。`),
 (s,a)=>{if(a==='properties'){s.pane=true;s.draftAlign=s.tableAlign;}if(a==='cancel'){s.pane=false;s.message='取消表格属性草稿，已应用的位置保持。';}if(a==='apply'){s.tableAlign=s.draftAlign;s.pane=false;s.message='只改变整表位置，格内文字对齐保持。';}if(a==='cellCenter'){s.cellH='center';s.message='只改变格内的水平对齐，整表位置与垂直对齐保持。';}if(a==='cellMiddle'){s.cellH='center';s.cellV='middle';s.message='格内文字水平与垂直居中，整表位置保持。';}if(a==='cellReset'){s.cellH='left';s.cellV='top';s.message='格内文字回到左上，整表位置保持。';}});

// Preserve the existing header-text task; replace only its page-number task.
const header=registry.y2020q41,base={render:header.render,action:header.action,change:header.change};
Object.assign(header.initial,{numModes:['restart','continue'],numStarts:[1,1],numDraftMode:'continue',numDraftStart:1,numDialogSection:0});
const secIndex=s=>s.split&&s.physical>=3?1:0;
function pageNumber(s){const section=secIndex(s);if(section===0)return Number(s.numStarts[0])+s.physical-1;if(s.numModes[1]==='continue')return Number(s.numStarts[0])+s.physical-1;return Number(s.numStarts[1])+s.physical-3;}
header.render=s=>{
 if(s.scenario==='headers')return base.render(s);
 const section=secIndex(s);
 return controls(select('scenario','操作任务',s.scenario,[['headers','页眉文字与前节链接'],['numbers','封面目录无页码，正文从1开始']]))+office('Word',s.nEditing?'页眉和页脚工具 · 设计':'布局',s.nEditing?btn(s.nLinked?'链接到前一节：开':'链接到前一节：关','num_link','',s.split&&section===1&&!s.nDialog?'':'disabled')+btn('页码 → 当前位置','num_insert','',s.nDialog?'disabled':'')+btn('设置页码格式…','num_format','',s.nDialog?'disabled':'')+btn('删除页码','num_remove','',s.nDialog?'disabled':'')+btn('关闭页脚编辑','num_close','',s.nDialog?'disabled':''):btn('分隔符 → 下一页','num_break','',s.split?'disabled':'')+btn('插入 → 页脚 → 编辑页脚','num_edit'),`${s.nDialog?dialog('页码格式',select('numDraftMode','页码编号',s.numDraftMode,s.numDialogSection===0?[['restart','起始页码']]:[['continue','续前节'],['restart','起始页码']])+field('numDraftStart','起始页码',s.numDraftStart,'number',`min="1" max="99" ${s.numDraftMode==='continue'?'disabled':''}`),btn('确定','num_apply')+btn('取消','num_cancel')):''}${paper(`<h4>${['封面','目录','正文第一章','正文第二页'][s.physical-1]}</h4><p>第${s.physical}个物理页面 · 第${section+1}节</p><div class="lab-page-footer">${s.numbers[section]?pageNumber(s):'未插入页码'}</div>`)}`)+controls([1,2,3,4].map(i=>btn(['封面','目录','正文首页','正文后页'][i-1],'num_page',i,s.nDialog?'disabled':'')).join(''))+output(s.nMessage||'分节后默认续前节。断开页脚链接只改变共享内容，不会自动把正文页码重置为1。');
};
header.action=(s,a,v)=>{
 if(!a.startsWith('num_'))return base.action(s,a,v);
 const section=secIndex(s);
 if(a==='num_page'&&!s.nDialog)s.physical=Number(v);
 if(a==='num_break'){
  if(s.physical!==2){s.nMessage='在目录末尾插入下一页分节符，才能隔开前置页与正文。';return;}
  s.split=true;s.physical=3;s.numbers[1]=s.numbers[0];s.numModes[1]='continue';s.nMessage='正文进入第2节；新节默认续前节编号，页脚仍链接到前一节。';
 }
 if(a==='num_edit')s.nEditing=true;
 if(a==='num_close')s.nEditing=false;
 if(a==='num_link'&&s.split&&section===1){if(s.nLinked)s.numbers[1]=s.numbers[0];else s.numbers[1]=s.numbers[0];s.nLinked=!s.nLinked;s.nMessage=s.nLinked?'页脚重新链接，正文采用前节页脚内容；编号方式仍由本节页码格式决定。':'取消页脚链接，保留原页脚内容；编号方式仍为本节现有设置。';}
 if(a==='num_insert'||a==='num_remove'){
  const present=a==='num_insert';if(!s.split||s.nLinked)s.numbers=[present,present];else s.numbers[section]=present;
  s.nMessage=(present?'已插入页码。':'已删除页码。')+(s.nLinked?'页脚链接有效，相关各节共享此页脚内容。':'只影响当前独立节的页脚。');
 }
 if(a==='num_format'){s.numDialogSection=section;s.numDraftMode=s.numModes[section];s.numDraftStart=s.numStarts[section];s.nDialog=true;}
 if(a==='num_cancel'){s.nDialog=false;s.nMessage='已取消页码格式草稿；原有页码仍按之前的设置显示。';}
 if(a==='num_apply'){
  if(s.numDraftMode==='restart'&&(!/^\d+$/.test(String(s.numDraftStart))||Number(s.numDraftStart)<1||Number(s.numDraftStart)>99)){s.nMessage='本例起始页码请输入1至99的整数。';return;}
  const target=s.numDialogSection;s.numModes[target]=s.numDraftMode;s.numStarts[target]=number(s.numDraftStart,1,99);s.nDialog=false;s.nMessage=`第${target+1}节编号已设为`+(s.numModes[target]==='continue'?'续前节。':`从${s.numStarts[target]}开始。`);
 }
};
header.change=(s,k,v)=>{if(k==='numDraftMode')s.numDraftMode=v;else if(k==='numDraftStart')s.numDraftStart=v;else base.change(s,k,v);};
header.pageNumber=pageNumber;
})();

/* Three suggested Excel 2016 models. Load after existing labs, before notes-app.js. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,table,coach,output,office,dialog,esc,money}=ui;
  const controls=body=>`<div class="lab-controls">${body}</div>`;
  const clone=value=>structuredClone(value);

  register(['y2023q11'],'在两个工作簿之间移动或复制整张表','打开目标工作簿，设置建立副本，再分别切回源和目标检查。',{
    books:[{name:'成绩汇总.xlsx',open:true,sheets:[{id:'source',name:'总表',rows:[['王宁','86'],['李悦','91']],memo:'成绩汇总源表'},{id:'blank',name:'Sheet1',rows:[],memo:'源工作簿的另一张可见表'}]},{name:'归档.xlsx',open:false,sheets:[{id:'archive',name:'Sheet1',rows:[],memo:'归档工作簿原有工作表'}]}],
    book:0,sheet:'source',pane:false,filePane:false,fileChoice:'1',fromBook:0,fromSheet:'source',target:'1',before:'end',copy:false,serial:1,message:'归档.xlsx尚未打开，因此还不能选为跨工作簿目标。'
  },s=>{
    const book=s.books[s.book],sheet=book.sheets.find(x=>x.id===s.sheet)||book.sheets[0],blocked=s.pane||s.filePane;
    const destination=s.target==='new'?{sheets:[]}:s.books[Number(s.target)],targets=[['new','（新工作簿）'],...s.books.flatMap((b,i)=>b.open?[[String(i),b.name]]:[])];
    const content=`<div ${blocked?'inert':''}><h4>${esc(book.name)} / ${esc(sheet.name)}</h4>${sheet.rows.length?table(['姓名','成绩'],sheet.rows.map((r,i)=>[esc(r[0]),field('score'+i,r[0]+'成绩',r[1],'number')])):field('memo','当前表内容',sheet.memo)}<div class="lab-tabs" aria-label="工作表标签">${book.sheets.map(x=>btn(esc(x.name),'sheet',x.id,`aria-pressed="${x.id===sheet.id}"`)).join('')}</div></div>`;
    return controls(`<b>打开的工作簿</b>${s.books.flatMap((b,i)=>b.open?[btn(esc(b.name),'book',i,`aria-pressed="${s.book===i}" ${blocked?'disabled':''}`)]:[]).join('')}`)+
      office('Excel',s.filePane?'文件':'开始',btn('文件 → 打开…','file','',blocked?'disabled':'')+btn('格式 → 移动或复制工作表…','open','',blocked?'disabled':''),content+
        (s.filePane?dialog('打开工作簿',select('fileChoice','示例文件',s.fileChoice,s.books.map((b,i)=>[String(i),b.name])),btn('打开','fileOpen')+btn('取消','fileCancel')):'')+
        (s.pane?dialog('移动或复制',`<p>当前表：${esc(s.books[s.fromBook].sheets.find(x=>x.id===s.fromSheet)?.name||'')}</p>`+select('target','工作簿',s.target,targets)+select('before','下列选定工作表之前',s.before,[...destination.sheets.map(x=>[x.id,x.name]),['end','移至最后']])+`<label><input type="checkbox" data-field="copy" ${s.copy?'checked':''}>建立副本</label>`,btn('确定','apply')+btn('取消','cancel')):''))+
      output(s.message)+coach('上方工作簿按钮用于切换示例窗口。复制后两边可分别修改；移动后源标签消失。取消窗口不会改变任何工作表。');
  },(s,a,v)=>{
    if(a==='book'&&!s.pane&&!s.filePane&&s.books[Number(v)]?.open){s.book=Number(v);s.sheet=s.books[s.book].sheets[0].id;}
    if(a==='sheet'&&!s.pane&&!s.filePane)s.sheet=v;
    if(a==='file'){s.filePane=true;s.fileChoice=String(s.books.findIndex(x=>!x.open));if(s.fileChoice==='-1')s.fileChoice='1';}
    if(a==='fileCancel')s.filePane=false;
    if(a==='fileOpen'){const n=Number(s.fileChoice);s.books[n].open=true;s.book=n;s.sheet=s.books[n].sheets[0].id;s.filePane=false;s.message='已打开'+s.books[n].name+'；从上方切回源工作簿后操作总表。';}
    if(a==='open'){
      s.fromBook=s.book;s.fromSheet=s.sheet;s.target=String(s.books.findIndex((b,i)=>b.open&&i!==s.book));if(s.target==='-1')s.target=String(s.book);
      s.before='end';s.copy=false;s.pane=true;
    }
    if(a==='cancel')s.pane=false;
    if(a==='apply'){
      if(s.target==='new'&&!s.copy&&s.books[s.fromBook].sheets.length===1){s.message='源工作簿需保留可见工作表，本例请选择建立副本。';return;}
      if(s.target==='new'){s.books.push({name:'工作簿'+s.serial+++'.xlsx',open:true,sheets:[]});s.target=String(s.books.length-1);}
      const from=s.books[s.fromBook],to=s.books[Number(s.target)],index=from.sheets.findIndex(x=>x.id===s.fromSheet),source=from.sheets[index];
      if(!to?.open||!source){s.message='请选择已打开的目标工作簿。';return;}
      if(!s.copy&&from!==to&&from.sheets.length===1){s.message='源工作簿必须保留至少一张可见工作表；请先新建另一张表或选择建立副本。';return;}
      if(!s.copy&&from===to&&s.before===source.id){s.pane=false;s.message='目标位置就是原表之前，顺序保持不变。';return;}
      let item;
      if(s.copy){item=clone(source);item.id='copy-'+s.serial++;}else item=from.sheets.splice(index,1)[0];
      const existing=new Set(to.sheets.map(x=>x.name));let name=item.name,n=2;while(existing.has(name))name=item.name+' ('+(n++)+')';item.name=name;
      const pos=s.before==='end'?to.sheets.length:to.sheets.findIndex(x=>x.id===s.before);to.sheets.splice(pos<0?to.sheets.length:pos,0,item);
      s.book=Number(s.target);s.sheet=item.id;s.pane=false;
      s.message=s.copy?'已复制整张表，源表仍保留。分别修改两边的成绩，可验证两份数据独立。':'已移动整张表，源工作簿的原标签已移除，目标工作簿保留完整数据。';
    }
  },(s,k,v)=>{
    if(k.startsWith('score')){if(s.pane||s.filePane)return;const sheet=s.books[s.book].sheets.find(x=>x.id===s.sheet);sheet.rows[Number(k.slice(5))][1]=v;}
    else if(k==='memo'){if(!s.pane&&!s.filePane)s.books[s.book].sheets.find(x=>x.id===s.sheet).memo=v;}
    else{s[k]=v;if(k==='target')s.before='end';}
  });

  const freezeRows=Array.from({length:40},(_,i)=>i===0?['订单号','日期','经办人','部门','数量','金额']:i===1?['筛选条件','全部','全部','全部','全部','全部']:[String(i-1).padStart(3,'0'),'2024/03/'+String((i-2)%28+1).padStart(2,'0'),['王宁','李悦','张琳'][(i-2)%3],['一部','二部'][(i-2)%2],String((i-2)%8+1),String(120+(i-2)*15)]);
  register(['y2024q58'],'冻结后亲手滚动，观察哪几行列留在原处','点A3或C3，再冻结窗格；上下、左右滚动这张工作表。',{
    selected:{row:3,col:1},frozen:{rows:0,cols:0},menu:false,message:'当前选中A3。冻结窗格固定活动格上方的行、左侧的列。'
  },s=>{
    const name=String.fromCharCode(64+s.selected.col)+s.selected.row;
    const cellStyle=(row,col)=>{
      const top=row<=s.frozen.rows,left=col<=s.frozen.cols;
      return `${top||left?'position:sticky;':''}${top?'top:'+(32+(row-1)*38)+'px;':''}${left?'left:'+(48+(col-1)*108)+'px;':''}z-index:${top&&left?4:top||left?3:1};${top||left?'background:#f6edf8;':''}${row===s.frozen.rows?'border-bottom:2px solid #945ba0;':''}${col===s.frozen.cols?'border-right:2px solid #945ba0;':''}`;
    };
    return office('Excel','视图',btn('冻结窗格 ▾','menu')+(s.menu?(s.frozen.rows||s.frozen.cols?btn('取消冻结窗格','unfreeze'):btn('冻结窗格','freeze'))+btn('冻结首行','firstRow')+btn('冻结首列','firstCol')+btn('关闭菜单','close'):''),
      `<p>活动单元格：<b>${name}</b>　已冻结：前${s.frozen.rows}行 / 前${s.frozen.cols}列</p><div class="lab-freeze-scroll" tabindex="0" aria-label="可真实上下左右滚动的工作表"><table class="lab-freeze-grid"><colgroup><col style="width:48px">${'<col style="width:108px">'.repeat(6)}</colgroup><thead><tr><th style="left:0;z-index:7"></th>${['A','B','C','D','E','F'].map((c,i)=>`<th style="${i<s.frozen.cols?'left:'+(48+i*108)+'px;z-index:6;':''}">${c}</th>`).join('')}</tr></thead><tbody>${freezeRows.map((row,i)=>`<tr><th scope="row" style="left:0;${i<s.frozen.rows?'top:'+(32+i*38)+'px;z-index:5;':''}">${i+1}</th>${row.map((text,j)=>`<td style="${cellStyle(i+1,j+1)}">${btn(esc(text),'cell',`${i+1}:${j+1}`,`aria-label="${String.fromCharCode(65+j)}${i+1} ${esc(text)}" aria-pressed="${s.selected.row===i+1&&s.selected.col===j+1}"`)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)+
      controls(btn('定位A3','locate','3:1')+btn('定位C3','locate','3:3'))+output(s.message)+coach('直接在表格内滑动。紫色边界区分冻结部分；下方定位按钮是学习辅助。取消冻结后，数据行列会一起滚动，行号和列标仍是工作表外框。');
  },(s,a,v)=>{
    if(a==='cell'||a==='locate'){const [row,col]=v.split(':').map(Number);s.selected={row,col};s.message='当前活动格为'+String.fromCharCode(64+col)+row+'，尚未改变既有冻结设置。';}
    if(a==='menu')s.menu=!s.menu;if(a==='close')s.menu=false;
    if(['freeze','firstRow','firstCol','unfreeze'].includes(a)){
      s.frozen=a==='freeze'?{rows:s.selected.row-1,cols:s.selected.col-1}:a==='firstRow'?{rows:1,cols:0}:a==='firstCol'?{rows:0,cols:1}:{rows:0,cols:0};s.menu=false;
      s.message=a==='unfreeze'?'已取消冻结，请再次上下、左右滚动验证。':`已冻结前${s.frozen.rows}行和前${s.frozen.cols}列；现在在表格里滚动查看。`;
    }
  });

  const printRows=[['编号','项目','负责人','金额'],...Array.from({length:8},(_,i)=>[String(i+1).padStart(3,'0'),['设备维护','资料印刷','实验耗材','系统升级'][i%4],['王宁','李悦'][i%2],String(680+i*125)])];
  const printWidths=[55,65,60,50],rowHeight=12,printDefaults={horizontal:false,vertical:false,orientation:'portrait',scaleMode:'percent',percent:100};
  function printLayout(settings){
    const width=settings.orientation==='portrait'?210:297,height=settings.orientation==='portrait'?297:210,margin=20,usableWidth=width-margin*2,usableHeight=height-margin*2;
    const factor=settings.scaleMode==='percent'?settings.percent/100:Math.min(1,usableWidth/230,settings.scaleMode==='page'?usableHeight/(printRows.length*rowHeight):1);
    const columns=[];let group=[],size=0;printWidths.forEach((v,i)=>{if(group.length&&size+v*factor>usableWidth+.001){columns.push(group);group=[];size=0;}group.push(i);size+=v*factor;});columns.push(group);
    const rowsPerPage=Math.max(1,Math.floor(usableHeight/(rowHeight*factor))),rowGroups=[];for(let i=0;i<printRows.length;i+=rowsPerPage)rowGroups.push(Array.from({length:Math.min(rowsPerPage,printRows.length-i)},(_,n)=>i+n));
    const pages=rowGroups.flatMap(rows=>columns.map(cols=>({rows,cols})));
    return {width,height,margin,usableWidth,usableHeight,factor,pages};
  }
  function printPage(s){
    const layout=printLayout(s.applied),page=layout.pages[Math.min(s.page,layout.pages.length-1)],width=page.cols.reduce((sum,c)=>sum+printWidths[c]*layout.factor,0),height=page.rows.length*rowHeight*layout.factor;
    const x=layout.margin+(s.applied.horizontal?(layout.usableWidth-width)/2:0),y=layout.margin+(s.applied.vertical?(layout.usableHeight-height)/2:0);
    let grid='';page.rows.forEach((r,ri)=>{let left=x;page.cols.forEach(c=>{const cw=printWidths[c]*layout.factor,rh=rowHeight*layout.factor;grid+=`<rect x="${left}" y="${y+ri*rh}" width="${cw}" height="${rh}" fill="${r===0?'#f1e8f8':'white'}" stroke="#776c80" stroke-width=".35"/><text x="${left+2*layout.factor}" y="${y+ri*rh+7.8*layout.factor}" font-size="${4.7*layout.factor}" fill="#332a3b">${esc(printRows[r][c])}</text>`;left+=cw;});});
    return `<div class="lab-print-scroll" tabindex="0" aria-label="打印预览，可放大后滚动"><svg class="lab-print-page ${s.zoom?'zoomed':''}" viewBox="0 0 ${layout.width} ${layout.height}" role="img" aria-label="${s.applied.orientation==='portrait'?'纵向':'横向'}纸张，第${s.page+1}页，共${layout.pages.length}页"><rect x=".5" y=".5" width="${layout.width-1}" height="${layout.height-1}" fill="white" stroke="#b5a9bf"/><rect x="20" y="20" width="${layout.usableWidth}" height="${layout.usableHeight}" fill="none" stroke="#bba4c5" stroke-dasharray="2 2" stroke-width=".4"/>${grid}</svg></div><p>第 ${s.page+1} / ${layout.pages.length} 页 · A4 ${s.applied.orientation==='portrait'?'纵向':'横向'} · 实际缩放 ${Math.round(layout.factor*100)}%</p>`;
  }
  register(['y2023q10'],'调整纸张布局，再切到真正的打印预览','分别设置水平、垂直居中与方向、缩放；预览按实际列宽分页。',{
    applied:printDefaults,draft:printDefaults,pane:false,tab:'margins',preview:false,page:0,zoom:false,message:'工作表中的数据位置固定。页面设置只影响纸张上的排版。'
  },s=>{
    const layout=printLayout(s.applied);
    return office('Excel',s.preview?'文件 · 打印':'页面布局',btn('页面设置 ↘','open','',s.pane?'disabled':'')+btn(s.preview?'返回工作表':'文件 → 打印预览','preview','',s.pane?'disabled':''),
      `<div ${s.pane?'inert':''}>${s.preview?printPage(s):table(printRows[0],printRows.slice(1))}</div>`+
      (s.pane?dialog('页面设置',`<div class="lab-tabs">${btn('页面','tab','page',`aria-pressed="${s.tab==='page'}"`)}${btn('页边距','tab','margins',`aria-pressed="${s.tab==='margins'}"`)}</div>`+
        (s.tab==='margins'?'<p>本例上、下、左、右页边距均为20 mm。</p>'+`<label><input type="checkbox" data-field="horizontal" ${s.draft.horizontal?'checked':''}>水平居中</label><label><input type="checkbox" data-field="vertical" ${s.draft.vertical?'checked':''}>垂直居中</label>`:
          select('orientation','方向',s.draft.orientation,[['portrait','纵向'],['landscape','横向']])+select('scaleMode','缩放',s.draft.scaleMode,[['percent','缩放比例'],['width','调整为1页宽，高度自动'],['page','调整为1页宽、1页高']])+(s.draft.scaleMode==='percent'?field('percent','缩放比例（%）',s.draft.percent,'number','min="50" max="150" step="10"'):'')),btn('确定','apply')+btn('取消','cancel')):''))+
      (s.preview?controls(btn('上一页','previous','',s.page===0||s.pane?'disabled':'')+btn('下一页','next','',s.page>=layout.pages.length-1||s.pane?'disabled':'')+btn(s.zoom?'适合屏幕':'放大预览','zoom','',s.pane?'disabled':'')):'')+output(s.message)+coach('纸张虚线表示页边距；预览分页不切断单元格。预览下方的翻页和放大按钮是学习辅助，不会改动工作表数据。');
  },(s,a,v)=>{
    if(a==='open'){s.draft=clone(s.applied);s.pane=true;s.tab='margins';}
    if(a==='tab')s.tab=v;
    if(a==='cancel'){s.pane=false;s.message='已取消本次设置，纸张方向、居中与缩放保持原值。';}
    if(a==='apply'){
      if(s.draft.scaleMode==='percent'&&(!Number.isFinite(Number(s.draft.percent))||Number(s.draft.percent)<50||Number(s.draft.percent)>150)){s.message='本例缩放比例可输入50—150。';return;}
      s.applied=clone(s.draft);s.applied.percent=Number(s.applied.percent);s.pane=false;s.page=0;
      s.message=`已应用：水平居中${s.applied.horizontal?'开':'关'}，垂直居中${s.applied.vertical?'开':'关'}。切换打印预览检查纸张；工作表数据没有移动。`;
    }
    if(a==='preview'&&!s.pane){s.preview=!s.preview;s.page=0;}
    if(a==='previous')s.page=Math.max(0,s.page-1);if(a==='next')s.page=Math.min(printLayout(s.applied).pages.length-1,s.page+1);if(a==='zoom')s.zoom=!s.zoom;
  },(s,k,v)=>{s.draft[k]=v;});
})();

window.NOTE_LABS.registry.y2024q8.keydown=(s,e)=>{if(s.scenario==='formula'&&e.key==='F9'){e.preventDefault();window.NOTE_LABS.registry.y2024q8.action(s,'formulaUpdate');return true;}};

/* Suggested registry overrides. Root owner reviews and integrates. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,office,dialog,table,output,coach,esc,money}=ui;
  const controls=body=>`<div class="lab-controls">${body}</div>`;
  const clone=value=>structuredClone(value);
  const series=[20,26,24,34,35,41];
  function leastSquares(values){
    const n=values.length,xMean=(n+1)/2,yMean=values.reduce((a,b)=>a+b,0)/n;
    let numerator=0,denominator=0;
    values.forEach((y,i)=>{numerator+=(i+1-xMean)*(y-yMean);denominator+=(i+1-xMean)**2;});
    const slope=numerator/denominator,intercept=yMean-slope*xMean;
    return {slope,intercept,predict:x=>slope*x+intercept};
  }
  register(['y2024q68'],'沿同一条趋势线，向未来延长几个周期','改变预测期数，观察末端月份与预测值一起变化；已有数据点不移动。',{
    values:series,applied:null,pane:false,draft:0,message:'蓝点是1—6月的原始观测；横轴固定为1—9月，每格代表一个月。'
  },s=>{
    const fit=leastSquares(s.values),forward=s.applied??0,endMonth=6+forward;
    const x=month=>40+(month-1)*40,y=value=>238-value*3.6;
    const plot=`<svg viewBox="0 0 400 276" style="width:100%;height:auto;display:block;background:white" role="img" aria-label="1至9月坐标图，实测数据位于1至6月${s.applied===null?'':`，线性趋势线延伸到第${endMonth}月`}">
      ${[0,20,40,60].map(value=>`<line x1="40" y1="${y(value)}" x2="360" y2="${y(value)}" stroke="#e5dfe9"/><text x="32" y="${y(value)+5}" text-anchor="end" font-size="24" fill="#605965">${value}</text>`).join('')}
      <line x1="40" y1="238" x2="360" y2="238" stroke="#918698"/>
      ${Array.from({length:9},(_,i)=>`<text x="${x(i+1)}" y="263" text-anchor="middle" font-size="24" fill="#605965">${i+1}</text>`).join('')}
      <polyline points="${s.values.map((value,i)=>`${x(i+1)},${y(value)}`).join(' ')}" fill="none" stroke="#5490aa" stroke-width="2"/>
      ${s.values.map((value,i)=>`<circle cx="${x(i+1)}" cy="${y(value)}" r="5" fill="#39798f"/>`).join('')}
      ${s.applied===null?'':`<line data-trend-line x1="${x(1)}" y1="${y(fit.predict(1))}" x2="${x(endMonth)}" y2="${y(fit.predict(endMonth))}" stroke="#a05a94" stroke-width="3" stroke-dasharray="8 5"/><circle cx="${x(endMonth)}" cy="${y(fit.predict(endMonth))}" r="5" fill="#a05a94"/>`}
    </svg>`;
    return office('Excel','图表工具 · 设计',btn('添加图表元素 → 趋势线','open'),
      `${s.pane?dialog('设置趋势线格式','<p>趋势线类型：线性</p>'+select('draft','预测 · 向前（周期）',s.draft,[[0,'0'],[1,'1'],[3,'3']]),''):''}${plot}<p style="text-align:center;margin:0">月份（1格＝1个月）</p>`)+
      (s.pane?controls('<span>学习控制：参数暂存</span>'+btn('应用参数','apply')+btn('取消本次修改','cancel')):'')+
      output(s.message)+
      (s.applied===null?'':output(`拟合公式：y = ${fit.slope.toFixed(4)}x + ${fit.intercept.toFixed(4)}。第${endMonth}月的趋势值为 ${money(fit.predict(endMonth))}；该值来自原始6点的最小二乘拟合。`))+
      coach('蓝色折线连接实测点；紫色虚线表示拟合趋势。向前预测只延长既有趋势线，不改变原始观测值，也不重新改变斜率。参数暂存及应用按钮是卡片的学习控制；真实Excel格式窗格按修改即时更新。');
  },(s,a)=>{
    if(a==='open'){s.draft=s.applied??0;s.pane=true;}
    if(a==='apply'){if(![0,1,3].includes(Number(s.draft)))return;s.applied=Number(s.draft);s.pane=false;s.message=s.applied?`向前${s.applied}个周期：从第6月延伸到第${6+s.applied}月。原有点与坐标尺度保持不变。`:'已添加线性趋势线，终点为第6月，没有预测未来月份。';}
    if(a==='cancel'){s.draft=s.applied??0;s.pane=false;s.message='未应用的参数已丢弃，图表保持上一次应用后的状态。';}
  },(s,k,v)=>{if(k==='draft')s.draft=Number(v);});
  registry.y2024q68.leastSquares=leastSquares;

  function tableGrid(s){
    const busy=s.pane||s.filterPane||s.convertPane;
    const rows=s.rows.map((row,i)=>{
      const hidden=i>0&&s.filter!=='all'&&String(row[0])!==s.filter;
      return `<tr ${hidden?'hidden':''}>${row.map((value,j)=>{
        const isHead=s.styled&&i===0,tag=isHead?'th':'td';
        const color=isHead?'#e7d1e6':s.styled&&i<s.styledRows?(i%2?'#faf0f7':'#fff'):'#fff';
        return `<${tag} style="border:1px solid #d9cddb;padding:10px;background:${color};word-break:break-word">${s.created&&i===0&&j===0?btn(esc(value)+' ▾','filter','',`aria-label="筛选${esc(value)}" ${busy?'disabled':''}`):esc(value)||'&nbsp;'}</${tag}>`;
      }).join('')}</tr>`;
    }).join('');
    return `<div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;table-layout:fixed"><thead><tr><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody>${rows}<tr>${['a','b'].map((key,j)=>`<td style="border:1px solid #d9cddb;padding:6px;vertical-align:top">${field('new'+key,String.fromCharCode(65+j)+(s.rows.length+1),s['new'+key],'text',`style="min-width:0;width:100%;box-sizing:border-box;font-size:16px" ${busy?'disabled':''}`)}</td>`).join('')}</tr></tbody></table></div>`;
  }
  register(['y2024q59'],'从普通区域创建表，再观察新增行与表头','切换“表包含标题”，再在紧邻的下一行输入数据；转换为区域后比较功能与外观。',{
    rows:[['姓名','成绩'],['王宁','80'],['李悦','95']],created:false,styled:false,styledRows:0,hasHeader:true,draftHeader:true,pane:false,filterPane:false,filter:'all',draftFilter:'all',convertPane:false,newa:'',newb:'',message:'当前 A1:B3 是普通单元格区域。第一行已有“姓名、成绩”。'
  },s=>office('Excel',s.created?'表格工具 · 设计':'开始',s.created?btn('转换为区域','convert'):btn('套用表格格式','open'),
    `${s.pane?dialog('套用表格式','<p>表数据的来源：=$A$1:$B$'+s.rows.length+'</p>'+`<label><input type="checkbox" data-field="draftHeader" ${s.draftHeader?'checked':''}>表包含标题</label>`,btn('确定','apply')+btn('取消','cancel')):''}
    ${s.filterPane?dialog('筛选 '+esc(s.rows[0][0]),select('draftFilter','显示项目',s.draftFilter,[['all','全选'],...[...new Set(s.rows.slice(1).map(row=>String(row[0])))].map(value=>[value,value||'（空白）'])]),btn('确定','filterApply')+btn('取消','filterCancel')):''}
    ${s.convertPane?dialog('Microsoft Excel','<p>是否将表转换为普通区域？</p>',btn('是','convertApply')+btn('否','convertCancel')):''}
    ${tableGrid(s)}`)+
    controls(btn('模拟键盘：Enter（确认新增行）','append')+`<span>${s.created?'表1 范围：A1:B'+s.rows.length:s.styled?'已转换为普通区域，原有样式保留':'普通区域'}</span>`)+output(s.message)+
    coach('新增行的输入格就是表格正下方的工作表单元格，按Enter确认。表对象会自动扩展；普通区域没有表对象的自动扩展功能。'),
    (s,a)=>{
      if(a==='open'){s.draftHeader=true;s.pane=true;}
      if(a==='cancel'){s.pane=false;s.message='取消创建，原数据与格式未改变。';}
      if(a==='apply'){
        if(!s.draftHeader)s.rows.unshift(['列1','列2']);
        s.created=true;s.styled=true;s.styledRows=s.rows.length;s.hasHeader=s.draftHeader;s.pane=false;s.filter='all';
        s.message=s.hasHeader?'第一行“姓名、成绩”成为表头，2条数据记录保留。':'Excel在原数据上方加入“列1、列2”表头；原“姓名、成绩”仍作为一条数据记录。';
      }
      if(a==='append'){
        if(s.pane||s.filterPane||s.convertPane)return;
        if(!s.newa&&!s.newb){s.message='先在表格正下方输入至少一个值，再按Enter确认。';return;}
        s.rows.push([s.newa,s.newb]);s.newa='';s.newb='';
        if(s.created){s.styledRows=s.rows.length;s.message='新记录已经加入表1，表范围扩展到 A1:B'+s.rows.length+'，新增行应用表样式。';}
        else s.message='新数据已写入下一行；没有表对象可自动扩展，原有区域格式保留。';
      }
      if(a==='filter'&&s.created){s.draftFilter=s.filter;s.filterPane=true;}
      if(a==='filterApply'){s.filter=s.draftFilter;s.filterPane=false;s.message=s.filter==='all'?'显示全部记录。':'仅显示所选项目；原始数据没有删除。';}
      if(a==='filterCancel')s.filterPane=false;
      if(a==='convert'&&s.created)s.convertPane=true;
      if(a==='convertCancel')s.convertPane=false;
      if(a==='convertApply'){s.created=false;s.convertPane=false;s.message='已转换为普通区域。表头颜色、条纹与现有数据保留；筛选箭头及表格工具消失。';}
    },(s,k,v)=>{s[k]=v;});
  registry.y2024q59.keydown=(s,e)=>{if(e.key==='Enter'&&e.target?.matches('[data-field="newa"],[data-field="newb"]')){e.preventDefault();registry.y2024q59.action(s,'append');return true;}return false;};

  register(['y2023q60'],'限定成绩区域，只替换真正的空单元格','从 B2 拖到 B6 选择范围，再把查找内容留空；含一个空格的单元格不会被误当成空白。',{
    values:['88','',' ','95',''],start:-1,end:-1,pane:false,find:'',replacement:'缺考',previous:null,message:'B3与B6没有内容；B4含一个空格。选中单元格后，可在卡片下方查看其内容。'
  },s=>{
    const first=Math.min(s.start,s.end),last=Math.max(s.start,s.end),range=s.start<0?'未选中':first===last?'B'+(first+2):'B'+(first+2)+':B'+(last+2);
    const cells=table(['行','A 姓名','B 成绩'],s.values.map((value,i)=>[i+2,['王宁','李悦','赵敏','周林','陈晨'][i],`<button type="button" ${s.pane?'disabled':'data-lab-drag="range"'} data-row="${i}" data-lab-act="cell" data-value="${i}" class="lab-cell ${s.start>=0&&i>=first&&i<=last?'lab-selected':''}" style="width:100%;min-height:44px;touch-action:none;white-space:pre-wrap" aria-label="B${i+2}">${esc(value)||'&nbsp;'}</button>`]));
    const detail=s.start<0?'':s.values[s.start]===''?'真正空白（无内容）':s.values[s.start]===' '?'一个空格（文本）':'内容：'+esc(s.values[s.start]);
    return office('Excel','开始',btn('查找和选择 → 替换','open'),
      `<p>选区：${range}</p>${s.pane?dialog('查找和替换',field('find','查找内容',s.find)+field('replacement','替换为',s.replacement)+'<label><input type="checkbox" checked disabled>单元格匹配</label><p>搜索范围：'+range+'</p>',btn('全部替换','apply')+btn('关闭','cancel')):''}${cells}`)+
      controls(btn('触屏辅助：选中 B2:B6','all')+btn('撤销本次替换','undo','',s.previous?'':'disabled'))+
      output(s.message)+(detail?output(`选中起点 B${s.start+2}：${detail}。`):'')+
      coach('辅助选区按钮与撤销按钮属于本卡片。真正的空白没有字符；空格是字符。这里演示选区内的完整单元格匹配，不包含通配符、格式查找或公式。');
  },(s,a,v)=>{
    if(a==='cell'&&!s.pane){s.start=s.end=Number(v);s.message='已选中 B'+(s.start+2)+'。可从该格拖到末格扩展选区。';}
    if(a==='all'&&!s.pane){s.start=0;s.end=4;s.message='已选中 B2:B6，姓名列不参与替换。';}
    if(a==='open'){
      if(s.start<0||s.start===s.end){s.message='先选择多格区域。本例要求选中成绩区域，避免在整个工作表中替换。';return;}
      s.pane=true;
    }
    if(a==='cancel'){s.pane=false;s.message='替换窗口已关闭；尚未执行的输入不改变表格。已经执行的替换需用撤销恢复。';}
    if(a==='apply'){
      if(!s.pane)return;
      const first=Math.min(s.start,s.end),last=Math.max(s.start,s.end);let count=0;
      const before=clone(s.values);
      s.values=s.values.map((value,i)=>{if(i>=first&&i<=last&&value===s.find){count++;return s.replacement;}return value;});
      if(count)s.previous=before;
      s.message=`在成绩选区内替换了 ${count} 处。`+(s.find===''?'空格单元格不符合“无内容”，保持原样。':'仅完整内容相同的单元格被替换。');
    }
    if(a==='undo'&&s.previous){s.values=clone(s.previous);s.previous=null;s.message='已恢复上一次替换前的单元格内容。';}
  },(s,k,v)=>{s[k]=v;});
})();

/* Suggested Excel models; root integrates after note-labs-study.js.
   Engine: pointermove should call model.preview?.(state,g,root).
   Sources: Microsoft Support MID; How to correct a ##### error;
   Clear cells of contents or formats; Enter a series of numbers, dates, or other items.
*/
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,office,dialog,output,esc}=ui;
  const controls=html=>`<div class="lab-controls">${html}</div>`;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const clone=x=>structuredClone(x);
  const simpleTable=(headers,rows)=>`<div style="overflow:auto;max-width:100%;background:white" tabindex="0" aria-label="工作表，可横向滚动"><table style="width:100%;min-width:0;table-layout:fixed;border-collapse:collapse">${headers[0]==='行'?`<colgroup><col style="width:42px">${headers.slice(1).map(()=>'<col>').join('')}</colgroup>`:''}<thead><tr>${headers.map(h=>`<th scope="col" style="padding:9px 6px">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td style="padding:9px 6px;overflow-wrap:anywhere">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  function extract(s){
    const text=String(s.text),rawCount=String(s.count).trim(),rawStart=String(s.start).trim();
    const count=Number(rawCount),start=Number(rawStart);
    // The exposed fields represent numeric function arguments; missing arguments are not silently supplied.
    if(rawCount===''||(s.fn==='MID'&&rawStart===''))return{pending:true,value:'',indices:[]};
    if(!Number.isFinite(count)||count<0||(s.fn==='MID'&&(!Number.isFinite(start)||start<1)))return{error:true,value:'#VALUE!',indices:[]};
    const n=Math.floor(count),from=s.fn==='MID'?Math.floor(start)-1:s.fn==='RIGHT'?Math.max(0,text.length-n):0;
    return{value:text.slice(from,from+n),indices:Array.from({length:text.length},(_,i)=>i).filter(i=>i>=from&&i<from+n)};
  }
  register(['y2020q56'],'改动参数，观察真正被提取的字符','从1开始数位置；函数结果和下方字符尺同步变化。',
    {text:'20210103',fn:'MID',start:'7',count:'2'},s=>{
      const result=extract(s),formula=`=${s.fn}(A2,${s.fn==='MID'?s.start+',':''}${s.count})`;
      return controls(field('text','A2 源文本',s.text,'text','maxlength="48"')+select('fn','提取函数',s.fn,[['MID','MID：从指定位置取'],['LEFT','LEFT：从左端取'],['RIGHT','RIGHT：从右端取']])+(s.fn==='MID'?field('start','起始位置 start_num',s.start,'number','step="1"'):'')+field('count','字符数量 num_chars',s.count,'number','step="1"'))+
        office('Excel','公式',`<code class="lab-formula">${esc(formula)}</code>`,simpleTable(['A 源文本','B 提取结果'],[[esc(s.text),`<strong data-extract-result style="font-size:20px;color:${result.error?'#ad345f':'#5d4678'}">${result.pending?'待输入':result.value===''?'&nbsp;':esc(result.value)}</strong>`]]))+
        `<div style="margin-top:14px"><b>字符位置尺</b><div aria-label="源文本字符及位置" style="display:flex;flex-wrap:wrap;gap:5px;margin-top:9px">${s.text.split('').map((ch,i)=>`<span data-character-index="${i+1}" style="display:grid;min-width:30px;padding:4px 3px;text-align:center;border-radius:5px;background:${result.indices.includes(i)?'#ead6f0':'#f2eff5'};border:1px solid ${result.indices.includes(i)?'#9d6ba8':'transparent'}"><small>${i+1}</small><b style="font-size:18px">${ch===' '?'␠':esc(ch)}</b></span>`).join('')||'<span>源文本为空</span>'}</div></div>`+
        output(result.pending?'补齐参数后计算；起点和数量可以试填0或负数，观察边界。':result.error?'#VALUE!：MID起点必须至少为1；MID、LEFT、RIGHT的字符数量不能为负。':result.value===''?'结果为空字符串 ""，没有取到字符。它不是数值0。':`结果为文本“${esc(result.value)}”，共取出 ${result.value.length} 个字符。${/^0\d/.test(result.value)?'前导0仍然保留。':''}`);
    },()=>{},(s,k,v)=>{s[k]=String(v);});
  registry.y2020q56.extract=extract;

  const dateSerial=(Date.UTC(2026,8,5)-Date.UTC(1899,11,30))/86400000+14.5/24;
  const dateText=s=>s.format==='general'?String(Math.round((s.negative?-1:dateSerial)*100000)/100000):s.negative?'':s.format==='short'?'2026/9/5':'2026/9/5 14:30';
  const neededWidth=s=>Math.ceil(dateText(s).length*s.font*.62+20);
  const displayDate=(s,width=s.width)=>s.negative&&s.format!=='general'||neededWidth(s)>width?'#'.repeat(Math.max(3,Math.floor((width-20)/(s.font*.62)))):dateText(s);
  function resizePreview(s,g,root){
    if(g.kind!=='column')return;
    const width=clamp(Math.round(s.width+g.dx),70,300),grid=root.querySelector('[data-width-grid]');
    if(!grid)return;
    grid.style.gridTemplateColumns=`42px ${width}px 62px`;
    grid.style.width=(width+104)+'px';
    root.querySelector('[data-hash-date]').textContent=displayDate(s,width);
    const boundary=root.querySelector('[data-lab-drag="column"]');
    boundary?.setAttribute('aria-valuenow',String(width));
    const readout=root.querySelector('[data-width-readout]');if(readout)readout.textContent=width+' px';
  }
  register(['y2020q7'],'拉宽列边界，找回被井号遮住的日期','拖动B列标题右边界；也可减小字号、改短日期，比较显示和原值。',
    {width:130,font:16,format:'full',negative:false,message:'B2中的日期时间过长，当前列宽显示为井号。'},s=>
      office('Excel','开始',select('font','字号',s.font,[[16,'16'],[14,'14'],[12,'12']])+select('format','数字格式',s.format,[['full','日期和时间'],['short','短日期'],['general','常规']])+btn('格式 → 自动调整列宽','autofit'),
        `<p style="margin:0 0 10px"><b>名称框：B2</b>　<span>fx ${s.negative?'-1':'2026/9/5 14:30'}</span></p><div style="max-width:100%;overflow:auto;padding-right:2px" tabindex="0" aria-label="工作表，可横向滚动"><div data-width-grid role="table" aria-label="日期显示工作表" style="display:grid;grid-template-columns:42px ${s.width}px 62px;width:${s.width+104}px;border:1px solid #bcccbc;background:white;font-size:16px"><div style="padding:9px;background:#eef3ef"></div><div role="columnheader" style="position:relative;padding:9px;text-align:center;background:#e7f0e9;border-inline:1px solid #bcccbc">B${btn('','boundary','',`data-lab-drag="column" role="slider" aria-label="B列右边界：拖动或按左右方向键调整列宽" aria-valuemin="70" aria-valuemax="300" aria-valuenow="${s.width}" tabindex="0" style="position:absolute;right:-12px;top:0;z-index:2;height:100%;width:24px;min-height:40px;padding:0;border:0;border-radius:0;background:linear-gradient(to right,transparent 10px,#549669 10px,#549669 13px,transparent 13px);cursor:col-resize;touch-action:none"`)}</div><div role="columnheader" style="padding:9px;text-align:center;background:#eef3ef">C</div><div role="rowheader" style="padding:12px 9px;background:#eef3ef">2</div><div role="cell" data-hash-date style="overflow:hidden;white-space:nowrap;padding:12px 9px;text-align:right;border:2px solid #428563;font:${s.font}px/1.6 ui-monospace,monospace">${esc(displayDate(s))}</div><div role="cell" style="padding:12px 9px">备注</div></div></div>`)+
      controls(btn(s.negative?'恢复正常日期':'模拟负日期结果','negative'))+
      output(`${s.message} 当前列宽 <b data-width-readout>${s.width} px</b>。底层值：<code>${s.negative?-1:dateSerial}</code>。${s.negative&&s.format!=='general'?'负日期在本例1900日期系统中无法显示；加宽列也不能修复。':'改变列宽、字号或显示格式都不会改动底层数值。'}`),
      (s,a)=>{if(a==='autofit'){s.width=clamp(neededWidth(s),70,300);s.message=s.negative&&s.format!=='general'?'已自动调整宽度，但负日期仍无法显示。':'列宽已适应当前文字和字号。';}if(a==='negative'){s.negative=!s.negative;s.message=s.negative?'现在把底层计算结果改为−1，以观察另一种井号原因。':'恢复原来的正日期时间值。';}},
      (s,k,v)=>{s[k]=k==='font'?Number(v):v;s.message=k==='font'?'只调整字号，日期时间仍是同一值。':'只调整显示格式，底层值不变。';});
  registry.y2020q7.preview=resizePreview;
  registry.y2020q7.gesture=(s,g)=>{if(g.kind==='column'){s.width=clamp(Math.round(s.width+g.dx),70,300);s.message='已按拖动距离改变B列宽度。';}};
  registry.y2020q7.keydown=(s,e)=>{if(!e.target.closest('[data-lab-drag="column"]')||!['ArrowLeft','ArrowRight'].includes(e.key))return false;e.preventDefault();s.width=clamp(s.width+(e.key==='ArrowRight'?10:-10),70,300);s.message='已用方向键调整列宽。';return true;};
  registry.y2020q7.displayDate=displayDate;

  function fillValue(s,index){
    if(index>s.filled)return'';
    if(s.mode==='copy'||index===0)return s.source;
    const match=s.source.match(/^(.*?)(\d+)$/);
    return match?match[1]+String(BigInt(match[2])+BigInt(index)).padStart(match[2].length,'0'):s.source;
  }
  register(['y2020q48'],'亲手把编号填充到指定的最后一行','拖动A2右下角的填充柄，在想要的行松手；填充选项决定复制还是递增。',
    {source:'002024000001',filled:0,mode:'copy',end:'4',message:'A2已按文本保存。拖动填充柄到A3—A7中的任意一行。'},s=>{
      const rows=Array.from({length:6},(_,i)=>[i+2,`<div class="lab-lookup-cell" data-fill-index="${i}" style="position:relative;min-height:38px;padding:8px 6px;border:${i<=s.filled?'2px solid #388b62':'1px solid transparent'};font:16px/1.5 ui-monospace,monospace;overflow-wrap:anywhere">${esc(fillValue(s,i))||'&nbsp;'}${i===0?'<button type="button" data-lab-drag="fill" class="lab-fill-handle" aria-label="拖动A2填充柄到目标行" style="width:28px;height:28px;border-width:8px"></button>':''}</div>`]);
      return controls(field('source','A2源编号（文本）',s.source,'text','maxlength="30"'))+
        office('Excel','开始','<span>数字格式：文本</span>',simpleTable(['行','A 编号'],rows)+(s.filled>0?`<div style="padding:12px 0">${select('mode','自动填充选项',s.mode,[['copy','复制单元格'],['series','填充序列']])}</div>`:''))+
        `<details class="lab-assist"><summary>键盘辅助操作</summary>${select('end','填充到',s.end,[[1,'A3'],[2,'A4'],[3,'A5'],[4,'A6'],[5,'A7']])}${btn('执行向下填充','fill')}</details>`+
        output(`${s.message}${s.filled>0?` 实际区域：A2:A${s.filled+2}；${s.mode==='copy'||!/\d+$/.test(s.source)?'每格复制原编号':'末尾数字每行加1，位数不足保留前导0'}。`:' 下方尚未填充。'}`);
    },(s,a)=>{if(a==='fill'){s.filled=clamp(Number(s.end),1,5);s.message='已按指定终点填充。';}},
    (s,k,v)=>{s[k]=String(v);if(k==='source'){s.filled=0;s.mode='copy';s.message='源编号已改变，重新拖动确定填充区域。';}if(k==='mode')s.message=v==='series'&& !/\d+$/.test(s.source)?'源文本没有末尾数字，本例按原文本复制。':'已将当前填充区域改为'+(v==='series'?'递增序列。':'复制原编号。');});
  registry.y2020q48.gesture=(s,g)=>{if(g.kind==='fill'){s.filled=clamp(s.filled,0,5);s.message=s.filled?'已在实际松手的行结束填充。':'尚未拖到下一行。';}};
  registry.y2020q48.fillValue=fillValue;

  const initialCells=[{value:.128,format:'percent',fill:true},{value:.25,format:'percent',fill:true},{value:.42,format:'percent',fill:true}];
  const cellText=c=>c.value===null?'':c.format==='percent'?(Math.round(c.value*1000)/10)+'%':String(c.value);
  register(['y2024q10'],'看清除保留了什么，看删除移动了什么','选中B列单元格，再分别清除内容、格式，或删除并上移；撤销后可以重新比较。',
    {cells:initialCells,selected:0,menu:false,pane:false,history:[],message:'当前选中B2。显示12.8%，底层值是0.128，填充色和数字格式独立保存。'},s=>{
      const c=s.cells[s.selected];
      const rows=s.cells.map((cell,i)=>[i+2,['甲','乙','丙'][i],btn(esc(cellText(cell))||'&nbsp;','cell',i,`aria-label="选择B${i+2}，${cellText(cell)||'空白'}" aria-pressed="${s.selected===i}" style="width:100%;min-height:44px;border:2px solid ${s.selected===i?'#388b62':'transparent'};border-radius:0;background:${cell.fill?'#f3dce8':'#fff'};font-size:16px;text-align:right"`)]);
      return office('Excel','开始',btn('清除 ▾','menu','',s.pane?'disabled':'')+btn('删除 → 删除单元格…','deleteDialog','',s.pane?'disabled':''),
        `<p style="font-size:16px;margin:0 0 10px"><b>名称框：B${s.selected+2}</b>　<span>fx ${c.value===null?'（空白）':c.value}</span></p>${s.menu?dialog('清除',btn('清除内容','clear','contents')+btn('清除格式','clear','formats')+btn('全部清除','clear','all'),btn('关闭','close')):''}${s.pane?dialog('删除',`<p>选中区域：B${s.selected+2}</p><p><label><input type="radio" checked name="${s.uid||'clear'}-direction">下方单元格上移</label></p>`,btn('确定','delete')+btn('取消','cancel')):''}<fieldset ${s.pane?'disabled':''} style="border:0;padding:0;margin:0;min-width:0">${simpleTable(['行','A 标识','B 比例'],rows)}</fieldset>`)+
        controls(btn('模拟键盘：Delete','clear','contents',s.pane?'disabled':'')+btn('撤销上一步','undo','',s.history.length&&!s.pane?'':'disabled'))+
        output(`${s.message} 当前B${s.selected+2}：${c.value===null?'内容为空':'底层值 '+c.value}；${c.format==='percent'?'百分比格式':'常规格式'}；${c.fill?'有填充色':'无填充色'}。`);
    },(s,a,v)=>{
      if(a==='cell'){s.selected=Number(v);s.message='已选中B'+(s.selected+2)+'。';}
      if(a==='menu'){s.menu=!s.menu;s.pane=false;}
      if(a==='close')s.menu=false;
      if(a==='deleteDialog'){s.pane=true;s.menu=false;}
      if(a==='cancel'){s.pane=false;s.message='已取消删除，原单元格完整保留。';}
      if(a==='clear'&&!s.pane){
        s.history.push(clone(s.cells));const c=s.cells[s.selected];
        if(v==='contents'||v==='all')c.value=null;
        if(v==='formats'||v==='all'){c.format='general';c.fill=false;}
        s.menu=false;s.message={contents:'内容已清空，原有格式与填充设置保留。',formats:'已移除数字格式和填充色，底层数值没有改变。',all:'内容和格式都已清除，周围单元格位置保持不变。'}[v];
      }
      if(a==='delete'&&s.pane){s.history.push(clone(s.cells));s.cells.splice(s.selected,1);s.cells.push({value:null,format:'general',fill:false});s.pane=false;s.message='仅B列下方单元格连同内容和格式上移；A列标识及行号保持原位。';}
      if(a==='undo'&&s.history.length){s.cells=s.history.pop();s.menu=false;s.pane=false;s.message='已撤销上一步，恢复当时的内容、格式及单元格位置。';}
    });
  registry.y2024q10.keydown=(s,e)=>{if(e.key!=='Delete'||e.target.closest('input,textarea,select'))return false;e.preventDefault();registry.y2024q10.action(s,'clear','contents');return true;};
})();

/* Suggested models. Root integrates after review. */
(() => {
  'use strict';
  const {register, registry, ui} = window.NOTE_LABS;
  const {btn, field, select, table, coach, output, office, dialog, esc} = ui;
  const copy = value => structuredClone(value);
  const courses = ['计算机','英语','高数'];
  const sourceRows = [
    [['王宁','86'],['李明','91'],['张琳','74']],
    [['张琳','82'],['王宁','79'],['李明','84']],
    [['李明','88'],['张琳','76'],['王宁','92']]
  ];
  const presets={
    both:{name:'姓名和科目都匹配',range:'A1:B4',top:true,left:true},
    left:{name:'只匹配姓名',range:'A2:B4',top:false,left:true},
    top:{name:'只匹配科目',range:'B1:B4',top:true,left:false},
    position:{name:'只按位置相加',range:'B2:B4',top:false,left:false}
  };
  const sourceAddress=(id,config)=>`${courses[id]}!${presets[config.preset].range.replace(/([A-Z])(\d)/g,'$$$1$$$2')}`;
  function sourceTable(s,id,editing=false,config=null){
    const firstCol=config&&!config.left?1:0;
    const header=['',...['A','B'].slice(firstCol)];
    const rows=[];
    if(!config||config.top)rows.push(['1',...['姓名',courses[id]].slice(firstCol)]);
    s.sources[id].forEach((row,i)=>rows.push([String(i+2),...(firstCol===0?[esc(row[0])]:[]),editing
      ?`<input data-field="score-${id}-${i}" aria-label="${esc(courses[id]+' '+row[0]+' 成绩')}" type="number" min="0" max="100" step="1" value="${esc(row[1])}" style="width:100%;min-width:3.8em;box-sizing:border-box">`
      :esc(row[1])]));
    return table(header,rows);
  }
  function consolidate(s,config){
    const rowKeys=[],colKeys=[],totals=new Map();
    const addKey=(list,key)=>{if(!list.includes(key))list.push(key);};
    config.refs.forEach(id=>s.sources[id].forEach((row,i)=>{
      const rowKey=config.left?row[0]:String(i),colKey=config.top?courses[id]:'0';
      addKey(rowKeys,rowKey);addKey(colKeys,colKey);
      const key=JSON.stringify([rowKey,colKey]);
      if(!totals.has(key))totals.set(key,0);
      const raw=String(row[1]).trim(),n=Number(raw);
      if(raw!==''&&Number.isFinite(n))totals.set(key,totals.get(key)+n);
    }));
    const grid=[];
    if(config.top)grid.push([...(config.left?['']:[]),...colKeys]);
    rowKeys.forEach(row=>grid.push([...(config.left?[row]:[]),...colKeys.map(col=>String(totals.get(JSON.stringify([row,col]))??0))]));
    return {grid,rows:rowKeys,cols:colKeys,top:config.top,left:config.left,preset:config.preset,refs:[...config.refs]};
  }
  function resultTable(result){
    if(!result)return table(['','A','B','C','D'],[['1','','','',''],['2','','','',''],['3','','','',''],['4','','','','']]);
    const width=Math.max(...result.grid.map(row=>row.length));
    return table(['',...Array.from({length:width},(_,i)=>String.fromCharCode(65+i))],result.grid.map((row,i)=>[String(i+1),...row.map(esc)]));
  }
  register(['y2023q57'],'把三门课程按姓名和科目汇总','看看三张源表的姓名顺序，选择一种示例配置，再逐个添加引用并比较实际汇总值。',{
    sources:sourceRows,sheet:'result',pane:false,preset:'both',
    applied:{refs:[],top:true,left:true,preset:'both'},draft:null,reference:0,selectedReference:0,
    result:null,message:'示例包含 3 门课程。源表的姓名顺序不同；结果从汇总表 A1 开始。'
  },s=>{
    const config=s.draft,pre=presets[s.preset];
    const helper=`<div class="lab-coach"><b>准备本次示例</b><p>本卡片预先配好源范围和标签位置。真实 Excel 中需自己核对这两项；改变复选框不会自动改写引用范围。</p><label>比较方式<select data-field="preset" ${s.pane?'disabled':''}>${Object.entries(presets).map(([key,p])=>`<option value="${key}" ${key===s.preset?'selected':''}>${p.name} · ${p.range}</option>`).join('')}</select></label><p>本次每个源区域：<strong>${pre.range}</strong>；首行${pre.top?'勾选':'不勾选'}，最左列${pre.left?'勾选':'不勾选'}。先切换下方工作表查看或修改源成绩，再打开合并计算。</p>${s.result?`<p>当前汇总表保留上次结果：${presets[s.result.preset].name} · ${presets[s.result.preset].range}。新配置只有“确定”后才替换结果。</p>`:''}</div>`;
    const tabs=`<div class="lab-controls" role="group" aria-label="工作表">${btn('汇总','sheet','result',`${s.sheet==='result'?'aria-pressed="true"':''} ${s.pane?'disabled':''}`)}${courses.map((name,i)=>btn(name,'sheet',String(i),`${s.sheet===String(i)?'aria-pressed="true"':''} ${s.pane?'disabled':''}`)).join('')}</div>`;
    const body=s.sheet==='result'?resultTable(s.result):sourceTable(s,Number(s.sheet),true);
    const pane=s.pane?dialog('合并计算',
      `<p>函数：<strong>求和</strong></p>${select('reference','引用位置',s.reference,courses.map((_,i)=>[i,sourceAddress(i,config)]))}<div class="lab-controls">${btn('添加','add-reference')}</div><label>所有引用位置<select data-field="selectedReference" size="3" aria-label="所有引用位置" style="width:100%;max-width:100%">${config.refs.map(id=>`<option value="${id}" ${Number(s.selectedReference)===id?'selected':''}>${esc(sourceAddress(id,config))}</option>`).join('')}</select></label><div class="lab-controls">${btn('删除','remove-reference','',config.refs.length?'':'disabled')}</div><fieldset><legend>标签位置（按本次示例预设）</legend><label><input type="checkbox" disabled ${config.top?'checked':''}> 首行</label><label><input type="checkbox" disabled ${config.left?'checked':''}> 最左列</label></fieldset><p>当前引用的源区域预览：${esc(sourceAddress(Number(s.reference),config))}</p>${sourceTable(s,Number(s.reference),false,config)}<p>未创建指向源数据的链接；确定时生成本次汇总值。</p>`,
      btn('确定','apply')+btn('取消','cancel')):'';
    return helper+office('Excel','数据',btn('合并计算','open','',s.pane?'disabled':''),body+tabs+pane)+output(esc(s.message));
  },(s,a,v)=>{
    if(a==='sheet'&&!s.pane){s.sheet=v;return;}
    if(a==='open'){
      s.sheet='result';s.draft={refs:[...s.applied.refs],top:presets[s.preset].top,left:presets[s.preset].left,preset:s.preset};s.pane=true;
      s.selectedReference=s.draft.refs[0]??0;
      s.message=`本次使用 ${presets[s.preset].range}。逐个添加源区域；引用列表和预设尚未应用。`;
    }
    if(a==='add-reference'&&s.pane){
      const id=Number(s.reference);
      if(!s.draft.refs.includes(id)){s.draft.refs.push(id);s.selectedReference=id;s.message=`已添加 ${sourceAddress(id,s.draft)}，当前 ${s.draft.refs.length} 个引用。`;}
      else s.message='该源区域已经在引用列表中。';
    }
    if(a==='remove-reference'&&s.pane){
      s.draft.refs=s.draft.refs.filter(id=>id!==Number(s.selectedReference));s.selectedReference=s.draft.refs[0]??0;
      s.message='已从待应用列表移除引用，现有汇总值仍保留。';
    }
    if(a==='cancel'){s.pane=false;s.draft=null;s.message='已取消本次设置；原有汇总值和已应用的引用列表保持不变。';}
    if(a==='apply'&&s.pane){
      if(!s.draft.refs.length){s.message='请先添加至少一个引用区域。';return;}
      if(s.draft.refs.some(id=>s.sources[id].some(row=>row[1].trim()!==''&&!Number.isFinite(Number(row[1]))))){s.message='示例成绩需为数值或空白，请先返回源工作表检查。';return;}
      s.applied=copy(s.draft);s.result=consolidate(s,s.applied);s.pane=false;s.draft=null;
      s.message=s.applied.top&&s.applied.left
        ?`已按姓名和课程标签汇总 ${s.applied.refs.length} 个区域。姓名顺序不同仍能匹配；不同课程各占一列。`
        :s.applied.left
          ?'只按最左列匹配姓名：A2:B4 不含课程标题，同一人的各科成绩相加到一列。'
          :s.applied.top
            ?'只按首行匹配科目：B1:B4 不含姓名，各科成绩仍按原来的行位置排列。姓名顺序不同，同行不一定是同一人。'
            :'B2:B4 只有数值：各表同一行位置相加。源表姓名顺序不同，这些合计不能作为个人总分。';
    }
  },(s,k,v)=>{
    const m=k.match(/^score-(\d)-(\d)$/);
    if(m&&!s.pane){s.sources[Number(m[1])][Number(m[2])][1]=String(v);s.message='源成绩已修改；未创建源链接，汇总表仍保留上次计算值。重新合并才会更新。';return;}
    if(k==='reference'||k==='selectedReference')s[k]=Number(v);
    if(k==='preset'&&!s.pane&&presets[v]){s.preset=v;s.message=`已准备 ${presets[v].name}，每个源范围为 ${presets[v].range}。打开合并计算并确定后才会更新汇总表。`;}
  });
  registry.y2023q57.consolidate=consolidate;

  const centerInitial={mode:'general',draft:'general',pane:false,range:false,active:0,title:'2026 年成绩分析',message:'标题位于 A1，其余三格为空。先选中完整标题区域 A1:D1。'};
  function centerSheet(s){
    const selected=s.range?'A1:D1':s.mode==='merge'?'A1':`${String.fromCharCode(65+s.active)}1`;
    const value=s.range||s.mode==='merge'||s.active===0?s.title:'';
    const cellStyle='height:56px;padding:0;position:relative;width:25%';
    const nativeButton=(index,text='')=>`<button type="button" data-lab-act="cell" data-value="${index}" aria-label="${String.fromCharCode(65+index)}1 ${index===0?esc(s.title):'空白'}" ${s.pane?'disabled':''} style="width:100%;height:56px;min-height:56px;display:block;padding:5px;background:transparent;border:0;border-radius:0;overflow:hidden;text-align:left;${s.range||s.active===index?'outline:2px solid #27815e;outline-offset:-2px':''}">${esc(text)}</button>`;
    const cells=s.mode==='merge'
      ? `<td colspan="4" style="height:56px;padding:0"><button type="button" data-lab-act="cell" data-value="0" aria-label="A1 合并单元格 ${esc(s.title)}" ${s.pane?'disabled':''} style="display:block;width:100%;height:56px;padding:5px;border-radius:0;text-align:center;outline:2px solid #27815e;outline-offset:-2px">${esc(s.title)}</button></td>`
      : Array.from({length:4},(_,i)=>`<td style="${cellStyle}">${nativeButton(i,'')}${i===0?`<div data-cross-center-title style="position:absolute;left:0;top:0;width:${s.mode==='center'?'100%':'400%'};height:56px;display:flex;align-items:center;justify-content:${s.mode==='across'||s.mode==='center'?'center':'flex-start'};padding:0 5px;pointer-events:none;overflow:hidden;box-sizing:border-box;white-space:nowrap;z-index:1">${esc(s.title)}</div>`:''}</td>`).join('');
    return `<div class="lab-controls"><label>名称框<input aria-label="名称框" readonly value="${selected}" style="width:7em"></label><label style="flex:1">编辑栏<input aria-label="编辑栏" readonly value="${esc(value)}" style="width:100%;min-width:0"></label></div><div class="lab-table-scroll" style="position:relative" tabindex="0" aria-label="标题工作表"><table style="width:100%;table-layout:fixed;min-width:0;margin:0"><thead><tr>${['A','B','C','D'].map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody><tr>${cells}</tr><tr>${['姓名','计算机','英语','高数'].map(c=>`<td>${c}</td>`).join('')}</tr><tr><td>王宁</td><td>86</td><td>79</td><td>92</td></tr></tbody></table></div>`;
  }
  register(['y2020q47'],'居中的标题下面，到底还有几个单元格','对同一段标题分别使用跨列居中和合并后居中，再点击 B1，检查名称框和编辑栏。',centerInitial,s=>
    `<div class="lab-coach"><b>演示操作</b><p>本例使用 A1:D1，规则与笔记中的 A1:G1 相同。点击选区按钮准备范围；点击工作表单元格可查看其地址。</p><div class="lab-controls">${btn('选中 A1:D1','range','',s.pane?'disabled':'')}${field('title','标题文字',s.title,'text',`maxlength="40" ${s.pane?'disabled':''}`)}</div></div>`+
    office('Excel','开始',btn('设置单元格格式','format','',s.pane?'disabled':'')+btn(s.mode==='merge'?'取消合并单元格':'合并后居中','merge','',s.pane?'disabled':''),centerSheet(s)+
      (s.pane?dialog('设置单元格格式',`<p>对齐</p>${select('draft','水平对齐',s.draft,[['general','常规'],['center','居中'],['across','跨列居中']])}<p>选定区域：${s.range?'A1:D1':String.fromCharCode(65+s.active)+'1'}</p>`,btn('确定','apply')+btn('取消','cancel')):''))+
    output(esc(s.message)),(s,a,v)=>{
      if(a==='range'&&!s.pane){s.range=true;s.active=0;s.message='已选中 A1:D1，可以设置整个标题范围的对齐方式。';}
      if(a==='cell'&&!s.pane){s.range=false;s.active=s.mode==='merge'?0:Number(v);s.message=s.mode==='merge'?'A1:D1 已合为一个单元格，单击任何位置都选中 A1。':s.active===0?'A1 保存标题文字。':`${String.fromCharCode(65+s.active)}1 仍是独立的空白单元格；标题只保存在 A1。`;}
      if(a==='format'){
        if(s.mode==='merge'){s.message='当前是合并单元格。先取消合并，再选择 A1:D1 比较跨列居中。';return;}
        s.pane=true;s.draft=s.mode;s.message='水平对齐设置尚未应用，点击取消会保留原来的外观。';
      }
      if(a==='cancel'){s.pane=false;s.draft=s.mode;s.message='已取消，对齐方式和单元格结构均未改变。';}
      if(a==='apply'){
        if(s.draft==='across'&&!s.range){s.pane=false;s.message='只选中了一个单元格，没有可跨的范围。请先选中 A1:D1 再设置跨列居中。';return;}
        if(s.range||s.active===0){s.mode=s.draft;}s.pane=false;
        s.message=s.mode==='across'?'跨列居中已应用：标题横跨 A1:D1 显示，四格地址与结构保留。点击 B1 验证。':s.mode==='center'?'已设为单元格内居中。A1 保存标题，其余三格仍独立且为空。':'已恢复常规对齐，标题仍保存在 A1。';
      }
      if(a==='merge'){
        if(s.mode==='merge'){s.mode='center';s.active=0;s.range=true;s.message='已取消合并，A1:D1 恢复为四个单元格，标题留在 A1；单元格内的居中格式仍保留。';return;}
        if(!s.range){s.message='先选中 A1:D1，再使用合并后居中。';return;}
        s.mode='merge';s.active=0;s.range=false;s.message='A1:D1 已合成一个单元格。原 B1、C1、D1 不能再单独选中。';
      }
    },(s,k,v)=>{if(k==='title'&&!s.pane)s.title=String(v);if(k==='draft')s.draft=v;});
})();

/* Suggested Word overrides. Shared engine: invoke model.afterRender?.(state, root)
   after render's existing focus/selection restoration. No other engine changes. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,office,paper,dialog,output,esc}=ui;
  const controls=body=>`<div class="lab-controls">${body}</div>`;
  const doc='计算机学习笔记\n先确认选区，再设置格式。\n这一行练习光标移动。\n最后一行：复习完成。';
  const initialCaret=doc.indexOf('这一行')+3;
  const clamp=(n,length)=>Math.min(length,Math.max(0,n));
  const caretFocus=s=>s.direction==='backward'?s.start:s.end;
  const selectionAnchor=s=>s.direction==='backward'?s.end:s.start;
  function rangeDescription(s){
    const focus=caretFocus(s),prefix=s.doc.slice(0,focus),line=prefix.split('\n').length,column=focus-(prefix.lastIndexOf('\n')+1)+1;
    return s.start===s.end?`插入点：第${line}行，第${column}列；未选择文字。`:`选择了${s.end-s.start}个字符（含换行）；活动端位于第${line}行，第${column}列。`;
  }
  function selectedText(s){return s.start===s.end?'当前没有选中文字。':s.doc.slice(s.start,s.end).replace(/\n/g,'↵\n');}
  function moveSelection(s,key){
    const focus=caretFocus(s),anchor=selectionAnchor(s);let next=focus,extend=false;
    if(key==='ctrlHome')next=0;
    if(key==='ctrlEnd')next=s.doc.length;
    if(key==='shiftEnd'){const end=s.doc.indexOf('\n',focus);next=end<0?s.doc.length:end;extend=true;}
    if(key==='ctrlShiftHome'){next=0;extend=true;}
    if(key==='ctrlShiftEnd'){next=s.doc.length;extend=true;}
    const fixed=extend?anchor:next;s.start=Math.min(fixed,next);s.end=Math.max(fixed,next);s.direction=next<fixed?'backward':'forward';s.focusEditor=true;
    s.message={ctrlHome:'Ctrl+Home把插入点移到全文开头。',ctrlEnd:'Ctrl+End把插入点移到全文末尾。',shiftEnd:'Shift+End保留选区锚点，把活动端扩展到当前行末。',ctrlShiftHome:'Ctrl+Shift+Home保留选区锚点，把活动端扩展到全文开头。',ctrlShiftEnd:'Ctrl+Shift+End保留选区锚点，把活动端扩展到全文末尾。'}[key];
  }
  register(['y2024q7'],'亲手放置插入点，再用键盘改变选区','在正文中单击、拖动选择或修改文字；下方键盘按钮操作的是真实文本选区。',{
    doc,start:initialCaret,end:initialCaret,direction:'forward',focusEditor:false,message:'初始插入点在第3行。“行末”和“文末”是两个不同的位置。'
  },s=>office('Word','开始','<span>正文编辑区 · 可单击定位、拖动选择</span>',paper(`<label style="display:block">文档正文<textarea data-field="doc" data-selection-editor wrap="off" spellcheck="false" rows="7" aria-label="可编辑的Word示例正文" style="display:block;box-sizing:border-box;width:100%;max-width:100%;resize:vertical;overflow:auto;white-space:pre;font:16px/1.9 system-ui,sans-serif;padding:12px;border:1px solid #d0bbd7;border-radius:5px;caret-color:#714787;tab-size:4">${esc(s.doc)}</textarea></label>`))+
      controls(btn('Ctrl+Home','key','ctrlHome')+btn('Ctrl+End','key','ctrlEnd')+btn('Shift+End','key','shiftEnd')+btn('Ctrl+Shift+Home','key','ctrlShiftHome')+btn('Ctrl+Shift+End','key','ctrlShiftEnd'))+
      `<p data-selection-position>${rangeDescription(s)}</p><div style="padding:12px;background:#f5edf8;border-left:3px solid #b187bd"><b>当前选中的实际内容</b><pre data-selection-text style="white-space:pre-wrap;overflow-wrap:anywhere;font:16px/1.8 system-ui,sans-serif;margin:8px 0 0">${esc(selectedText(s))}</pre></div>`+
      `<output class="lab-output" data-selection-message aria-live="polite">${s.message}</output><p style="font-size:14px">本例正文不自动折行；每个回车建立一行。长行可在编辑区横向滚动。下方按键是独立模拟键盘，也支持直接使用这些实体键。</p>`,
    (s,a,v)=>{if(a==='key')moveSelection(s,v);},
    (s,k,v)=>{if(k==='doc'){s.doc=v;s.start=clamp(s.start,v.length);s.end=clamp(s.end,v.length);}});
  const keyboard=registry.y2024q7;
  keyboard.moveSelection=moveSelection;
  keyboard.afterRender=(s,root)=>{
    const editor=root.querySelector('[data-selection-editor]');if(!editor)return;
    const paint=()=>{root.querySelector('[data-selection-position]').textContent=rangeDescription(s);root.querySelector('[data-selection-text]').textContent=selectedText(s);root.querySelector('[data-selection-message]').textContent=s.message;};
    const capture=()=>{s.doc=editor.value;s.start=editor.selectionStart;s.end=editor.selectionEnd;s.direction=editor.selectionDirection==='backward'?'backward':'forward';paint();};
    editor.setSelectionRange(s.start,s.end,s.direction);
    if(s.focusEditor){s.focusEditor=false;editor.focus({preventScroll:true});}
    for(const event of ['select','selectionchange','pointerup','keyup','input'])editor.addEventListener(event,capture);
    // Pointer-down on an external keyboard button captures the range before blur.
    root.querySelectorAll('[data-lab-act="key"]').forEach(button=>button.addEventListener('pointerdown',capture));
    paint();
  };
  keyboard.keydown=(s,e)=>{
    if(!e.target.matches('[data-selection-editor]'))return;
    s.doc=e.target.value;s.start=e.target.selectionStart;s.end=e.target.selectionEnd;s.direction=e.target.selectionDirection==='backward'?'backward':'forward';
    let key=null;if(e.ctrlKey&&!e.altKey&&e.key==='Home')key=e.shiftKey?'ctrlShiftHome':'ctrlHome';
    if(e.ctrlKey&&!e.altKey&&e.key==='End')key=e.shiftKey?'ctrlShiftEnd':'ctrlEnd';
    if(!e.ctrlKey&&!e.altKey&&e.shiftKey&&e.key==='End')key='shiftEnd';
    if(!key)return;e.preventDefault();moveSelection(s,key);return true;
  };

  const figureArt=(kind)=>kind==='network'?`<svg viewBox="0 0 300 100" role="img" aria-label="终端通过交换机连接服务器" style="display:block;width:100%;max-width:300px;margin:auto"><path d="M75 50H115M185 50H225" stroke="#9c75aa" stroke-width="3"/><rect x="0" y="25" width="75" height="50" rx="8" fill="#eeddf5"/><rect x="115" y="25" width="70" height="50" rx="8" fill="#ead3e9"/><rect x="225" y="25" width="75" height="50" rx="8" fill="#e4d8f1"/><g text-anchor="middle" font-size="17" fill="#44304f"><text x="37.5" y="56">终端</text><text x="150" y="56">交换机</text><text x="262.5" y="56">服务器</text></g></svg>`:`<svg viewBox="0 0 300 100" role="img" aria-label="处理器、内存、外存三个不同部件" style="display:block;width:100%;max-width:300px;margin:auto"><rect x="45" y="8" width="210" height="24" rx="5" fill="#dac5e9"/><rect x="28" y="38" width="244" height="24" rx="5" fill="#ead5ef"/><rect x="10" y="68" width="280" height="24" rx="5" fill="#f4dfe9"/><g text-anchor="middle" font-size="17" fill="#44304f"><text x="150" y="27">处理器</text><text x="150" y="57">内存</text><text x="150" y="87">外存</text></g></svg>`;
  const captioned=s=>s.figures.filter(f=>f.caption!==null);
  const currentNumber=(s,id)=>captioned(s).findIndex(f=>f.id===id)+1;
  const findFigure=(s,id)=>s.figures.find(f=>f.id===id);
  const fieldSelected=(s,kind,id)=>s.selectedField?.kind==='all'||s.selectedField?.kind===kind&&(kind==='reference'||s.selectedField.id===id);
  const fieldStyle=selected=>`style="font:inherit;border:0;border-radius:3px;padding:3px 5px;background:${selected?'#eeddf5':'transparent'};text-align:left;white-space:normal" aria-pressed="${selected}"`;
  function updateReference(s){
    if(!s.reference)return;
    const target=findFigure(s,s.reference.target);
    s.reference.cached=target?.caption?`图 ${target.caption.number}`:'错误！未找到引用源。';
  }
  function updateFields(s,all=false){
    if(all||s.selectedField?.kind==='all'){
      for(const f of captioned(s))f.caption.number=currentNumber(s,f.id);
      updateReference(s);s.message='已更新全文题注编号，再更新交叉引用；引用仍指向原来的那幅图。';return;
    }
    if(s.selectedField?.kind==='caption'){
      const figure=findFigure(s,s.selectedField.id);if(figure?.caption){figure.caption.number=currentNumber(s,figure.id);s.message='仅更新所选题注编号；正文中的交叉引用仍保留旧结果，需要另行更新。';}return;
    }
    if(s.selectedField?.kind==='reference'&&s.reference){updateReference(s);s.message='已更新所选交叉引用，读取原目标题注当前的显示结果。';return;}
    s.message='先单击题注编号或正文中的交叉引用，选择需要更新的域。';
  }
  register(['merged-6'],'插入题注和交叉引用，再让编号经历增删与更新','先给第二幅图插入题注并引用它，再增加前图；比较只更新一个域与更新全文。',{
    figures:[{id:'network',kind:'network',caption:{text:'网络结构',number:1}},{id:'storage',kind:'storage',caption:null}],selectedFigure:'storage',selectedField:null,
    reference:null,pane:null,captionText:'存储层次',referenceTarget:'network',serial:1,message:'首图已带自动题注，第二幅图尚无题注。当前选中第二幅图；可从引用中插入题注。'
  },s=>{
    const selected=findFigure(s,s.selectedFigure),blocked=!!s.pane;
    const figureCards=s.figures.map(f=>`<figure style="margin:16px 0;padding:12px;border:2px solid ${s.selectedFigure===f.id?'#b786bd':'#ece1ef'};border-radius:8px">${btn(figureArt(f.kind),'figure',f.id,`style="display:block;width:100%;padding:0;border:0;background:transparent" aria-label="选择${esc(f.caption?.text||'无题注的图')}" ${blocked?'disabled':''}`)}${f.caption?`<figcaption style="text-align:center;margin-top:6px">${btn(`图 ${f.caption.number}　${esc(f.caption.text)}`,'field','caption:'+f.id,fieldStyle(fieldSelected(s,'caption',f.id))+(blocked?' disabled':''))}</figcaption>`:'<p style="text-align:center;color:#756a7d">尚未插入题注</p>'}</figure>`).join('');
    const reference=s.reference?btn(esc(s.reference.cached),'field','reference',fieldStyle(fieldSelected(s,'reference'))+(blocked?' disabled':'')):'（此处预留交叉引用位置）';
    const panel=s.pane==='caption'?dialog('题注','<p>标签：图；位置：所选项目下方。</p>'+field('captionText','题注说明',s.captionText),btn('确定','captionApply')+btn('取消','cancel')):s.pane==='reference'?dialog('交叉引用','<p>引用类型：图；引用内容：仅标签和编号。</p>'+select('referenceTarget','引用哪一个题注',s.referenceTarget,captioned(s).map(f=>[f.id,`图 ${f.caption.number} ${f.caption.text}`])),btn('插入','referenceApply')+btn('关闭','cancel')):'';
    return office('Word','引用',btn('插入题注…','captionOpen','',!selected||selected.caption||blocked?'disabled':'')+btn('交叉引用…','referenceOpen','',!captioned(s).length||blocked?'disabled':''),panel+paper(`<div ${blocked?'inert':''}><p>结构说明见 ${reference}。正文中的引用应始终指向选定的图。</p>${figureCards||'<p>文档中已没有图，正文引用仍暂时保留旧显示结果。</p>'}</div>`))+
      controls(btn('在首图前增加一幅带题注的图','prepend','',blocked||s.figures.length>=5?'disabled':'')+btn('删除当前首图及题注','deleteFirst','',blocked||!s.figures.length?'disabled':'')+btn('模拟键盘：F9 更新所选域','updateSelected','',blocked?'disabled':'')+btn('模拟键盘：Ctrl+A → F9 更新全文','updateAll','',blocked?'disabled':''))+
      output(s.message)+`<p style="font-size:14px">单击题注或正文图号可选择域。下方增删图和模拟键盘是学习辅助；修改结构后，旧域结果在本演示中保留到手动更新。</p>`;
  },(s,a,v)=>{
    if(a==='figure'){s.selectedFigure=v;s.selectedField=null;s.message='已选择这幅图。插入题注时，编号按带题注的图在正文中的顺序计算。';}
    if(a==='field'){s.selectedField=v==='reference'?{kind:'reference'}:{kind:'caption',id:v.slice(8)};s.message='已选择'+(v==='reference'?'正文交叉引用域。':'这幅图的题注编号域。');}
    if(a==='captionOpen'){const figure=findFigure(s,s.selectedFigure);if(!figure||figure.caption)return;s.captionText=figure.kind==='network'?'网络结构':'存储层次';s.pane='caption';}
    if(a==='captionApply'){const figure=findFigure(s,s.selectedFigure);if(!figure)return;figure.caption={text:s.captionText,number:0};figure.caption.number=currentNumber(s,figure.id);s.pane=null;s.selectedField={kind:'caption',id:figure.id};s.message='已在所选图下插入自动题注。现在可用交叉引用把该图号插入正文。';}
    if(a==='referenceOpen'){s.referenceTarget=findFigure(s,s.selectedFigure)?.caption?s.selectedFigure:captioned(s)[0]?.id;s.pane='reference';}
    if(a==='referenceApply'){const target=findFigure(s,s.referenceTarget);if(!target?.caption)return;s.reference={target:target.id,cached:`图 ${target.caption.number}`};s.pane=null;s.selectedField={kind:'reference'};s.message='正文引用已指向“'+esc(target.caption.text)+'”。之后改变其他图的数量不会更换引用目标。';}
    if(a==='cancel')s.pane=null;
    if(a==='prepend'&&s.figures.length<5){const id='inserted-'+s.serial++;s.figures.unshift({id,kind:'network',caption:{text:'新增网络示意',number:1}});s.selectedFigure=id;s.selectedField=null;s.message='已在最前面新增图及自动题注。后面的旧题注和正文引用暂时保留原结果；请更新域。';}
    if(a==='deleteFirst'&&s.figures.length){const removed=s.figures.shift();s.selectedFigure=s.figures[0]?.id||null;s.selectedField=null;s.message=s.reference?.target===removed.id?'引用目标已删除；正文暂时保留旧显示。更新引用后将显示找不到引用源。':'首图及题注已删除；后续编号和正文引用需要更新域。';}
    if(a==='updateSelected')updateFields(s);
    if(a==='updateAll'){s.selectedField={kind:'all'};updateFields(s,true);}
  });
  const captions=registry['merged-6'];captions.updateFields=updateFields;
  captions.keydown=(s,e)=>{
    if(s.pane||e.target.closest('input,textarea,select'))return;
    if(e.ctrlKey&&!e.altKey&&e.key.toLowerCase()==='a'){e.preventDefault();s.selectedField={kind:'all'};s.message='已选择全文中的题注与引用域。按F9更新。';return true;}
    if(e.key==='F9'){e.preventDefault();updateFields(s);return true;}
  };
})();

/* Suggested Word layout models; root integrates. No new engine dependency except
   the shared optional preview(state, gesture, root) pointermove hook already used by column resizing.
   Official references: https://support.microsoft.com/en-us/word/insert-a-section-break
   https://support.microsoft.com/en-us/word/use-section-breaks-to-change-the-layout-or-formatting-in-one-section-of-your-word-document
   https://support.microsoft.com/en-us/powerpoint/use-the-selection-pane-to-manage-objects-in-documents
*/
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,select,office,dialog,output,esc}=ui;
  const controls=body=>`<div class="lab-controls">${body}</div>`;
  const clone=x=>structuredClone(x);
  const sectionNumber=(s,id)=>[...new Set(s.pages.map(p=>p.section))].indexOf(id)+1;
  const initialPages=[
    {section:1,lines:[{text:'学习报告',heading:true},{text:'第一部分：概述。'},{text:'这一页应保持纵向。'}]},
    {section:1,lines:[{text:'统计资料',heading:true},{text:'这里是需要横向放置的资料。'},{text:'目标：只改变本页方向。'}]},
    {section:1,lines:[{text:'正文继续',heading:true},{text:'这是目标页之后的正文。'},{text:'后文仍应保持纵向。'}]}
  ];
  function snapshot(s){s.history.push(clone({pages:s.pages,orientations:s.orientations,nextSection:s.nextSection,page:s.page,point:s.point}));}
  function insertNextPage(s){
    snapshot(s);
    const current=s.pages[s.page],old=current.section,newSection=s.nextSection++,index=s.page+1;
    s.orientations[newSection]=s.orientations[old];
    if(s.point==='first'||s.point==='start'){
      // Split at the visible insertion point after the first paragraph, preserving paragraph formatting.
      const tail=current.lines.splice(s.point==='start'?0:Math.min(1,current.lines.length));
      s.pages.splice(index,0,{section:newSection,lines:tail});
      for(let i=index+1;i<s.pages.length&&s.pages[i].section===old;i++)s.pages[i].section=newSection;
    }else if(index===s.pages.length||s.pages[index].section!==old){
      // At the end of a section, an additional Next Page break creates an empty new section/page.
      s.pages.splice(index,0,{section:newSection,lines:[]});
    }else{
      for(let i=index;i<s.pages.length&&s.pages[i].section===old;i++)s.pages[i].section=newSection;
    }
    s.page=index;s.point='start';s.menu='';
    s.message=`已插入“下一页”分节符，插入点移到第${index+1}页的新节。新节先继承原方向；原有其他节保持不变。`;
  }
  function setDirection(s,direction,scope='section'){
    snapshot(s);
    if(scope==='all')Object.keys(s.orientations).forEach(k=>s.orientations[k]=direction);
    else s.orientations[s.pages[s.page].section]=direction;
    const section=s.pages[s.page].section,affected=s.pages.flatMap((p,i)=>scope==='all'||p.section===section?[i+1]:[]);
    s.message=`${scope==='all'?'整篇文档':'当前第'+sectionNumber(s,section)+'节'}改为${direction==='landscape'?'横向':'纵向'}；受影响页：${affected.join('、')}。`;
    s.menu='';s.pane=false;
  }
  register(['y2020q61'],'先隔离节，再让中间一页横向','在卡片外定位光标，再使用“布局→分隔符→下一页”。任意时刻都可改变方向并检查受影响的页。',
    {pages:initialPages,orientations:{1:'portrait'},nextSection:2,page:0,point:'end',menu:'',pane:false,draftDirection:'portrait',draftScope:'section',history:[],message:'初始三页属于同一节。此时改变任意一页所在节的方向，三页都会改变。'},s=>{
      const page=s.pages[s.page],section=sectionNumber(s,page.section),direction=s.orientations[page.section],landscape=direction==='landscape';
      const commands=btn('分隔符 ▾','breakMenu','',s.pane?'disabled':'')+btn('纸张方向 ▾','directionMenu','',s.pane?'disabled':'')+btn('页面设置…','setup','',s.pane?'disabled':'');
      const menu=s.menu==='break'?dialog('分隔符','<b>分节符</b>'+btn('下一页','nextPage'),btn('关闭','close')):s.menu==='direction'?dialog('纸张方向',btn('纵向','direction','portrait')+btn('横向','direction','landscape'),btn('关闭','close')):'';
      const setup=s.pane?dialog('页面设置',select('draftDirection','纸张方向',s.draftDirection,[['portrait','纵向'],['landscape','横向']])+select('draftScope','应用于',s.draftScope,[['section','本节'],['all','整篇文档']]),btn('确定','apply')+btn('取消','cancel')):'';
      const cursor='<span aria-label="插入点" style="display:inline-block;height:1.2em;border-left:2px solid #86539b;vertical-align:middle"></span>';
      const lines=page.lines.map((line,i)=>`<${line.heading?'h4':'p'} style="font-size:${line.heading?'19':'16'}px;line-height:1.7;margin:0 0 12px">${esc(line.text)}${s.point==='first'&&i===0?cursor:''}</${line.heading?'h4':'p'}>`).join('');
      return controls(`<fieldset ${s.pane?'disabled':''} style="display:contents">${select('page','查看并定位到',s.page,s.pages.map((p,i)=>[i,`第${i+1}页 · 第${sectionNumber(s,p.section)}节`]))+select('point','光标位置（辅助定位）',s.point,[['start','当前页开头'],['end','当前页内容末尾'],['first','当前页第一段末尾']])}</fieldset>`)+
        office('Word','布局',commands,`${menu}${setup}<div style="padding:12px 0;background:#e9e6ec"><div data-layout-page data-direction="${direction}" data-section="${section}" style="box-sizing:border-box;width:${landscape?'100%':'74%'};max-width:${landscape?'450':'320'}px;aspect-ratio:${landscape?'297 / 210':'210 / 297'};min-height:${landscape?'190':'285'}px;margin:0 auto;background:white;border:1px solid #d4ccd7;padding:18px 14px;box-shadow:0 2px 4px #30203310">${s.point==='start'?cursor:''}${lines||'<p style="color:#958898;font-size:16px">（空白页）</p>'}${s.point==='end'||s.point==='first'&&!page.lines.length?cursor:''}</div></div><p style="font-size:14px;margin-bottom:0">第 ${s.page+1} / ${s.pages.length} 页　·　第 ${section} 节　·　${landscape?'横向':'纵向'}</p>`)+
        `<div style="margin-top:14px"><b>逐页检查方向</b><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:8px;margin-top:8px">${s.pages.map((p,i)=>{const land=s.orientations[p.section]==='landscape';return btn(`<span aria-hidden="true" style="display:block;width:${land?'54':'36'}px;height:${land?'36':'51'}px;margin:0 auto 8px;background:${s.page===i?'#ead7ef':'#fff'};border:1px solid #a78aac"></span>第${i+1}页<small style="display:block">第${sectionNumber(s,p.section)}节 · ${land?'横向':'纵向'}</small>`,'view',i,`aria-pressed="${s.page===i}" style="padding:12px 5px;min-height:106px" ${s.pane?'disabled':''}`);}).join('')}</div></div>`+
        controls(btn('撤销上一步','undo','',s.history.length&&!s.pane?'':'disabled'))+output(s.message);
    },(s,a,v)=>{
      if(a==='breakMenu')s.menu=s.menu==='break'?'':'break';
      if(a==='directionMenu')s.menu=s.menu==='direction'?'':'direction';
      if(a==='close')s.menu='';
      if(a==='view'){s.page=Number(v);s.menu='';s.message='已切换到第'+(s.page+1)+'页；该页属于第'+sectionNumber(s,s.pages[s.page].section)+'节。';}
      if(a==='nextPage')insertNextPage(s);
      if(a==='direction')setDirection(s,v);
      if(a==='setup'){s.pane=true;s.menu='';s.draftDirection=s.orientations[s.pages[s.page].section];s.draftScope='section';}
      if(a==='cancel'){s.pane=false;s.message='页面设置已取消，各节原有方向保持不变。';}
      if(a==='apply')setDirection(s,s.draftDirection,s.draftScope);
      if(a==='undo'&&s.history.length){Object.assign(s,s.history.pop());s.menu='';s.pane=false;s.message='已撤销上一步，恢复原来的分节边界、方向和正文。';}
    },(s,k,v)=>{if(k==='page'){if(s.pane)return;s.page=Number(v);s.menu='';s.message='已定位到第'+(s.page+1)+'页。';}else if(k==='point'){if(s.pane)return;s.point=v;s.message='插入点已移至'+{start:'本页开头。',end:'本页内容末尾。',first:'第一段末尾。'}[v];}else s[k]=v;});
  registry.y2020q61.insertNextPage=insertNextPage;
  registry.y2020q61.setDirection=setDirection;

  const objectInfo={
    right:{name:'右箭头',x:7,y:43,w:85,h:17,color:'#c06495',clip:'polygon(0 25%,75% 25%,75% 0,100% 50%,75% 100%,75% 75%,0 75%)'},
    down:{name:'下箭头',x:40,y:6,w:21,h:89,color:'#9373b5',clip:'polygon(25% 0,75% 0,75% 73%,100% 73%,50% 100%,0 73%,25% 73%)'},
    box:{name:'圆角矩形',x:24,y:28,w:54,h:44,color:'#dcebdc'}
  };
  function moveLayer(s,action){
    if(!s.selected)return;
    const old=s.order.indexOf(s.selected),next=action==='front'?s.order.length-1:action==='back'?0:Math.max(0,Math.min(s.order.length-1,old+(action==='forward'?1:-1)));
    if(next===old){s.message=objectInfo[s.selected].name+'已经位于'+(next===0?'最底层。':'最顶层。');s.menu='';return;}
    s.history.push([...s.order]);s.order.splice(old,1);s.order.splice(next,0,s.selected);s.menu='';
    s.message=`${objectInfo[s.selected].name}${{front:'置于顶层',back:'置于底层',forward:'上移一层',backward:'下移一层'}[action]}；对象的位置和尺寸都保持不变。`;
  }
  register(['y2025q56'],'找到被挡住的对象，改变实际叠放顺序','任意选中画面对象或选择窗格条目；比较只移动一层与直接置于顶层。',
    {order:['right','down','box'],selected:null,pane:false,menu:'',history:[],message:'矩形处于最上层，遮挡两条箭头的中段。先打开选择窗格，可直接选中被遮挡的对象。'},s=>{
      const position=s.order.indexOf(s.selected),canUp=position>=0&&position<s.order.length-1,canDown=position>0;
      const shapes=s.order.map((id,z)=>{const o=objectInfo[id];return btn(id==='box'?'数据处理':'','select',id,`aria-label="选择${o.name}" aria-pressed="${s.selected===id}" data-layer-object="${id}" style="position:absolute;z-index:${z+1};left:${o.x}%;top:${o.y}%;width:${o.w}%;height:${o.h}%;padding:0;background:${o.color};border:${s.selected===id?'3px solid #693783':'1px solid #b3c6b3'};border-radius:${id==='box'?'18':'0'}px;${o.clip?'clip-path:'+o.clip+';':''}font-size:16px;color:#355a40"`);}).join('');
      const pane=s.pane?`<aside role="group" aria-label="选择窗格" style="padding:14px;background:#f4eff7;border:1px solid #e2d8e7;border-radius:8px"><header style="display:flex;align-items:center;justify-content:space-between"><b>选择窗格</b>${btn('×','pane','',`aria-label="关闭选择窗格" style="min-width:36px;padding:6px"`)}</header><p style="font-size:14px;margin:8px 0">最上方条目位于最前层。</p><div>${[...s.order].reverse().map((id,i)=>btn(esc(objectInfo[id].name),'select',id,`data-lab-drag="layer" data-key="${id}" data-layer-row="${id}" aria-pressed="${s.selected===id}" style="display:block;width:100%;min-height:46px;padding:10px;margin:5px 0;text-align:left;touch-action:none;cursor:grab;border:1px solid ${s.selected===id?'#a274ae':'#e0d7e5'};background:${s.selected===id?'#eadbf1':'#fff'};font-size:16px"`)).join('')}</div><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:9px">${btn('↑','layer','forward',`aria-label="所选对象上移一层" ${canUp?'':'disabled'}`)}${btn('↓','layer','backward',`aria-label="所选对象下移一层" ${canDown?'':'disabled'}`)}</div></aside>`:'';
      const menu=s.menu?dialog(s.menu==='front'?'上移对象':'下移对象',s.menu==='front'?btn('上移一层','layer','forward',canUp?'':'disabled')+btn('置于顶层','layer','front',canUp?'':'disabled'):btn('下移一层','layer','backward',canDown?'':'disabled')+btn('置于底层','layer','back',canDown?'':'disabled'),btn('关闭','close')):'';
      return office('Word',s.selected?'绘图工具 · 格式':'布局',btn('选择窗格','pane')+btn('上移一层 ▾','frontMenu','',s.selected?'':'disabled')+btn('下移一层 ▾','backMenu','',s.selected?'':'disabled'),`${menu}<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:12px"><div data-layer-canvas style="position:relative;min-height:270px;background:white;border:1px solid #dcd3e0;isolation:isolate;overflow:hidden">${shapes}</div>${pane}</div>`)+controls(btn('撤销层级调整','undo','',s.history.length?'':'disabled'))+
        output(`${s.message}${s.selected?` 当前选中：<b>${objectInfo[s.selected].name}</b>，从底向上第${position+1}层。`:''}`);
    },(s,a,v)=>{
      if(a==='pane')s.pane=!s.pane;
      if(a==='select'){s.selected=v;s.menu='';s.message='已选中'+objectInfo[v].name+'。选择对象本身不改变层级。';}
      if(a==='frontMenu')s.menu=s.menu==='front'?'':'front';
      if(a==='backMenu')s.menu=s.menu==='back'?'':'back';
      if(a==='close')s.menu='';
      if(a==='layer')moveLayer(s,v);
      if(a==='undo'&&s.history.length){s.order=s.history.pop();s.menu='';s.message='已恢复上一步的叠放顺序。';}
    });
  registry.y2025q56.moveLayer=moveLayer;
  registry.y2025q56.preview=(s,g,root)=>{if(g.kind==='layer'){g.el.style.transform=`translateY(${g.dy}px)`;g.el.style.position='relative';g.el.style.zIndex='3';root.querySelectorAll('[data-layer-row]').forEach(el=>{if(el===g.el)return;const r=el.getBoundingClientRect();el.style.borderTopColor=g.y+g.dy<r.top+r.height/2?'#9770a5':'';});}};
  registry.y2025q56.gesture=(s,g,root)=>{
    if(g.kind!=='layer'||!s.order.includes(g.key))return;
    const pane=root.querySelector('[aria-label="选择窗格"]'),bounds=pane?.getBoundingClientRect();
    if(!bounds||g.endX<bounds.left||g.endX>bounds.right||g.endY<bounds.top||g.endY>bounds.bottom){s.message='没有落入选择窗格，原来的层级保持不变。';return;}
    const topOrder=[...s.order].reverse().filter(id=>id!==g.key);
    let index=topOrder.findIndex(id=>{const r=root.querySelector(`[data-layer-row="${id}"]`).getBoundingClientRect();return g.endY<r.top+r.height/2;});
    if(index<0)index=topOrder.length;topOrder.splice(index,0,g.key);const next=topOrder.reverse();
    if(next.join()!==s.order.join()){s.history.push([...s.order]);s.order=next;}
    s.selected=g.key;s.message='已按实际松手位置调整选择窗格顺序，文档中的遮挡关系同步改变。';
  };
  registry.y2025q56.keydown=(s,e)=>{if(e.altKey&&e.key==='F10'){e.preventDefault();s.pane=!s.pane;return true;}return false;};
})();
