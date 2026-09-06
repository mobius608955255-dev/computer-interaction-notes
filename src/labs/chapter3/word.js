/* Chapter 3: word. Maintained source; edit this domain directly. */
/* Source provenance: note-labs.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
register(['y2022q10'],'选中样式实例，再删除文字','区别“选择所有实例”“清除格式”和“删除内容”。',{selected:false,deleted:false,plain:false},s=>
    office('Word','开始',btn('标题 1 ▾','menu')+(s.menu?btn('选择所有 3 个实例','select')+btn('清除格式','clear'):''),paper([1,2,3].map((n)=>`${s.deleted?'':`<h4 class="${s.selected?'lab-selected':''} ${s.plain?'lab-plain':''}">第${n}章　${['信息技术','操作系统','文字处理'][n-1]}</h4>`}<p>这一章的正文内容仍然保留。</p>`).join('')))+`<div class="lab-keyboard" aria-label="模拟键盘">${btn('Delete','delete')}</div>${coach('样式菜单属于Word功能区；下方是独立模拟键盘。先选择实例，再按Delete。')}${output(s.deleted?'3个标题文字已删除，正文没有被删除。':s.plain?'文字仍在，只移除了标题格式。':s.selected?'已选中3个标题段落。':'当前没有批量选择。')}`,
    (s,a)=>{if(a==='menu')s.menu=!s.menu;if(a==='select')s.selected=true;if(a==='clear'&&s.selected){s.plain=true;s.selected=false;}if(a==='delete'&&s.selected){s.deleted=true;s.selected=false;}});
register(['y2022q54'],'把邀请语变成弧形艺术字','修改文字、弯曲程度和填充，查看路径上的实时文字。',{text:'诚挚邀请，敬候光临！',curve:40,color:'#b95729'},s=>
    office('Word','绘图工具 · 格式',select('color','文字填充',s.color,[['#b95729','赭橙'],['#2563a0','蓝色'],['#21443d','墨绿']]),paper(`<svg class="lab-art" viewBox="0 0 400 150" role="img" aria-label="弧形艺术字预览"><defs><path id="${s.uid}-arc" d="M20 100 Q200 ${100-s.curve*2} 380 100"/></defs><text fill="${s.color}" font-size="24"><textPath href="#${s.uid}-arc" startOffset="50%" text-anchor="middle">${esc(s.text)}</textPath></text></svg>`))+`<div class="lab-controls">${field('text','艺术字内容',s.text)}${field('curve','学习调节器：路径弧度',s.curve,'range','min="0" max="80"')}</div>${coach('弧度控件是学习调节器；Word实际从“文字效果→转换”选择路径样式。')}`,()=>{},(s,k,v)=>{s[k]=k==='curve'?number(v,0,80):v;});
register(['y2022q55'],'插入脚注，看引用标记与说明对应','选择正文位置插入脚注，删引用标记后观察自动重编号。',{active:0,refs:[],selectedRef:null},s=>
    office('Word','引用',btn('插入脚注','insert'),paper([0,1,2].map(n=>`<p>${btn(['数字化将信息编码。','压缩可减少数据量。','传输需要考虑时序。'][n],'select',n,`class="lab-text-select ${s.active===n?'lab-selected':''}"`)}${s.refs.includes(n)?`<sup>${btn(String(s.refs.indexOf(n)+1),'selectRef',n,`aria-label="选择脚注引用标记${s.refs.indexOf(n)+1}" aria-pressed="${s.selectedRef===n}"`)}</sup>`:''}</p>`).join('')+`<div class="lab-footnotes">${s.refs.map((n,i)=>`<p>${i+1}　${['信息表示为离散的编码数据。','无损可精确恢复，有损不保证。','实时媒体需要控制时延与抖动。'][n]}</p>`).join('')||'页底说明区'}</div>`))+`<div class="lab-controls">${btn('模拟键盘：Delete 删除所选引用','deleteRef','',s.selectedRef===null?'disabled':'')}</div>`+coach('先点正文确定插入位置。单击上标只选择引用标记，再按Delete删除对应脚注，其余编号重新排列。'),
    (s,a,v)=>{if(a==='select')s.active=Number(v);if(a==='insert'&&!s.refs.includes(s.active))s.refs.push(s.active);if(a==='selectRef')s.selectedRef=Number(v);if(a==='deleteRef'&&s.selectedRef!==null){s.refs=s.refs.filter(n=>n!==s.selectedRef);s.selectedRef=null;}s.refs.sort((a,b)=>a-b);});
register(['y2022q69'],'源表改了，Word会不会跟着变','切换链接与嵌入，修改Excel源值后刷新Word中的数据。',{source:898,word:898,mode:'link',path:true},s=>
    `<div class="lab-linked-apps">${office('Excel','数据','<span>销售汇总.xlsx</span>',field('source','产品1 · 总销量',s.source,'number','min="0" max="99999"'))}${office('Word','链接的Excel对象','<span>年度销售报告</span>',paper(`<h4>年度销售报告</h4>${table(['产品','销量'],[['产品1',s.word]])}<small>${s.mode==='link'?'链接对象':'嵌入副本'}</small>`))}</div><div class="lab-controls">${btn('模拟对象右键：更新链接','refresh')}${select('mode','粘贴方式',s.mode,[['link','粘贴链接'],['embed','嵌入副本']])}${btn(s.path?'模拟源文件移走':'恢复源文件','path')}</div>${output(!s.path&&s.mode==='link'?'源路径失效，无法取得新数据。':s.mode==='embed'?'这是独立副本；修改源表不会同步。':'链接已建立。修改源值后点“更新链接”；真实Word也可能提示允许更新。')}`,
    (s,a)=>{if(a==='path')s.path=!s.path;if(a==='refresh'&&s.path&&s.mode==='link')s.word=s.source;},(s,k,v)=>{s[k]=k==='source'?number(v,0,99999):v;if(k==='mode')s.word=s.source;});
register(['y2022q70'],'给报告加淡化Logo背景','比较图片水印、普通衬底图片和页面边框的实际范围。',{mode:'none',page:1},s=>
    `<div class="lab-controls">${select('mode','比较不同设置',s.mode,[['none','无'],['watermark','图片水印'],['behind','普通图片：衬于文字下方'],['border','页面边框']])}</div>`+office('Word',s.mode==='behind'?'图片工具 · 格式':'设计',`<span>${s.mode==='behind'?'环绕文字 → 衬于文字下方':s.mode==='watermark'?'水印 → 自定义水印 → 图片水印':s.mode==='border'?'页面边框':'页面背景'}</span>`,paper(`<div class="lab-bg-page ${s.mode==='border'?'bordered':''}">${s.mode==='watermark'||s.mode==='behind'&&s.page===1?'<div class="lab-watermark" aria-label="背景Logo">M<br><small>研究中心</small></div>':''}<h4>年度报告 · 第${s.page}页</h4><p>背景应辅助辨认，不妨碍阅读。</p><p>正文与数据保持清晰。</p></div>`))+`<div class="lab-controls">${btn('上一页','page',1)}${btn('下一页','page',2)}</div>${output(s.mode==='behind'?'本例普通图片只放在第1页；切到第2页不会自动复制。':s.mode==='watermark'?'图片水印通过页眉层重复显示。':s.mode==='border'?'边框只改变页面边缘，不添加Logo。':'尚未设置背景。')}`,(s,a,v)=>{s.page=Number(v);});
register(['y2022q71'],'保护表格，仍允许改正文','给正文设置编辑例外，再启动强制保护，并分别尝试输入。',{protected:false,exception:false,body:'本年度销售情况如下。',cell:'898',message:''},s=>
    office('Word','审阅',btn('限制编辑','pane'),`<div class="lab-protect-layout">${paper(`<label>正文<textarea data-field="body" ${s.protected&&!s.exception?'readonly':''}>${esc(s.body)}</textarea></label>${field('cell','表格：总销量',s.cell,'text',s.protected?'readonly':'')}`)}${s.pane?dialog('限制编辑',`<p>编辑限制：不允许任何更改（只读）</p><label><input type="checkbox" data-field="exception" ${s.exception?'checked':''} ${s.protected?'disabled':''}>正文允许“每个人”编辑</label>`,btn(s.protected?'停止保护':'是，启动强制保护','protect')):''}</div>`)+output(s.protected?`表格已只读；正文${s.exception?'作为例外仍可编辑':'也被锁定'}。`:'尚未保护，正文和表格都可输入。')+coach('这里省略真实密码输入；实际文档启动保护时按需要设置密码。学习按钮不放在文档正文里。'),
    (s,a)=>{if(a==='pane')s.pane=!s.pane;if(a==='protect')s.protected=!s.protected;});
register(['y2025q36'],'为不同收件人生成不同称谓','连接Excel名单，插入姓名域，再设置IF规则并切换预览记录。',{connected:false,name:false,rule:false,preview:false,record:0,pane:false,ifValue:'女',then:'女士',otherwise:'先生'},s=>{
    const people=[['王宁','女'],['李明','男'],['赵敏','女']];const person=people[s.record];const salutation=s.preview&&s.rule?(person[1]===s.ifValue?s.then:s.otherwise):s.rule?'«IF 称谓»':'';
    return office('Word','邮件',btn('选择收件人','connect')+btn('插入合并域：姓名','name','',s.connected?'':'disabled')+btn('规则 → 如果…那么…否则','rule','',s.connected?'':'disabled')+btn('预览结果','preview','',s.connected?'':'disabled'),`${s.pane?dialog('插入Word域：IF',`<p>域名：性别　比较：等于</p>${select('ifValue','比较值',s.ifValue,[['女','女'],['男','男']])}${field('then','则插入此文字',s.then)}${field('otherwise','否则插入此文字',s.otherwise)}`,btn('确定','apply')):''}${paper(`<h4>邀请函</h4><p>尊敬的${s.name?(s.preview?person[0]:'«姓名»'):'＿＿'}${esc(salutation)}：</p><p>诚邀您参加计算机基础教学交流。</p>`)}${s.preview?`<div class="lab-record-nav">${btn('上一条','previous')}<b>记录 ${s.record+1}/3</b>${btn('下一条','next')}</div>`:''}`)+output(s.connected?'已连接专家名单.xlsx。字段取自当前记录，条件规则只改变输出文字。':'先选择收件人，加载Excel名单。')+`<details class="lab-assist"><summary>收件人名单</summary>${table(['姓名','性别'],people)}</details>`;
  },(s,a)=>{if(a==='connect')s.connected=true;if(a==='name'&&s.connected)s.name=true;if(a==='rule'&&s.connected)s.pane=true;if(a==='apply'){s.rule=true;s.pane=false;}if(a==='preview'&&s.connected)s.preview=!s.preview;if(a==='next')s.record=Math.min(2,s.record+1);if(a==='previous')s.record=Math.max(0,s.record-1);});
register(['y2023q56'],'修改文稿，再接受或拒绝修订','编辑文字产生修订；接受和拒绝真正改变最终文稿。',{tracking:false,old:'可能产生改善',draft:'可能产生改善',decided:false},s=>
    office('Word','审阅',btn(s.tracking?'修订：开':'修订：关','track')+btn('接受修订','accept')+btn('拒绝修订','reject'),paper(`<h4>研究结果</h4><p>该方法${s.pending&&s.draft!==s.old?`<del>${esc(s.old)}</del><ins>${esc(s.draft)}</ins>`:esc(s.draft)}。</p>`))+`<div class="lab-keyboard">${field('draft','模拟键盘输入：替换选中的短语',s.draft)}</div>${output(s.tracking?'修订已开启，旧文字显示删除线，新文字带下划线。':s.pending?'修订已关闭，已有修订仍待接受或拒绝。':'未开启修订；编辑直接改变当前文稿。')}`,
    (s,a)=>{if(a==='track')s.tracking=!s.tracking;if(a==='accept'){s.old=s.draft;s.pending=false;}if(a==='reject'&&s.pending){s.draft=s.old;s.pending=false;}},(s,k,v)=>{if(s.tracking&&v!==s.draft)s.pending=true;s.draft=v;if(!s.tracking&&!s.pending)s.old=v;});
register(['y2023q55'],'校对提示与真正的下划线，打印时有何不同','进入打印预览，观察波浪线消失而格式下划线保留。',{printing:false,corrected:false},s=>
    office('Word',s.printing?'文件 · 打印':'审阅',btn(s.printing?'返回编辑':'打印预览','print')+btn('更正 ChatGTP → ChatGPT','correct'),paper(`<h4>${s.printing?'打印预览':'编辑页面'}</h4><p>本研究使用<span class="${!s.printing&&!s.corrected?'lab-spell':''}">${s.corrected?'ChatGPT':'ChatGTP'}</span>辅助整理。</p><p>这一段带有<span style="text-decoration:underline">真实下划线格式</span>。</p>`))+output(s.printing?'打印内容不包含校对波浪提示，字体下划线保留。':'红色波浪线是校对提示，不是字符下划线。'),
    (s,a)=>{if(a==='print')s.printing=!s.printing;if(a==='correct')s.corrected=true;});
register(['y2023q52'],'修改一次样式，三个标题同步更新','在修改样式窗口设置段前间距，确定后全部同级标题继承。',{before:0,pending:20,pane:false,menu:false},s=>
    office('Word','开始 · 样式',btn('标题 1 ▾','menu')+(s.menu?btn('修改…','modify'):''),`${s.pane?dialog('修改样式：标题1 → 格式 → 段落',field('pending','段前（磅）',s.pending,'number','min="0" max="48"')+'<p>设置作用于所有使用标题1的段落。</p>',btn('确定','apply')+btn('取消','cancel')):''}${paper([1,2,3].map(n=>`<h4 style="margin-top:${s.before}pt">第${n}章　学习主题</h4><p>正文格式不随标题样式改变。</p>`).join(''))}`)+output(`当前标题1段前 ${s.before} 磅；三个实例保持同步。`),
    (s,a)=>{if(a==='menu')s.menu=!s.menu;if(a==='modify'){s.pane=true;s.menu=false;s.pending=s.before;}if(a==='apply'){s.before=number(s.pending,0,48);s.pane=false;}if(a==='cancel')s.pane=false;},(s,k,v)=>{s.pending=number(v,0,48);});
})();

/* Source provenance: note-labs-2021.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui} = window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money} = ui;
const area=(name,label,value,extra='')=>`<label>${label}<textarea data-field="${name}" ${extra}>${esc(value)}</textarea></label>`;
register(['y2021q56'],'保存一套规范，再新建两份独立论文','先设置样式并保存模板，再切换两份文档编辑正文。',{size:20,saved:null,docs:[],active:0,content:'',message:'尚未保存模板。'},s=>
    `<div class="lab-controls">${field('size','模板中标题字号（磅）',s.size,'number','min="12" max="32"')}${btn('保存为论文规范.dotx','save')}${btn('基于模板新建文档','new','',s.saved?'':'disabled')}</div><div class="lab-tabs">${s.docs.map((d,i)=>btn(`论文${i+1}.docx`,'switch',i,`aria-pressed="${s.active===i}"`)).join('')}</div>`+office('Word','开始 · 样式',s.docs.length?`<span>当前文档标题样式 ${s.docs[s.active].size} 磅</span>`:'',s.docs.length?paper(`<h4 style="font-size:${s.docs[s.active].size}pt">论文${s.active+1}</h4>${area('content','正文',s.docs[s.active].content)}`):'<p class="lab-empty">从模板新建后显示文档。</p>')+output(s.message),
    (s,a,v)=>{if(a==='save'){s.saved={size:Number(s.size)};s.message='模板已保存。已创建文档不会因此自动覆盖。';}if(a==='new'&&s.saved&&s.docs.length<4){s.docs.push({size:s.saved.size,content:'在此撰写这份论文的正文。'});s.active=s.docs.length-1;s.content=s.docs[s.active].content;s.message='新文档复制模板样式，正文独立保存。';}if(a==='switch'){s.active=Number(v);s.content=s.docs[s.active].content;s.message='已切换到另一份文档，其他文档正文未改变。';}},(s,k,v)=>{if(k==='content'){s.content=v;if(s.docs[s.active])s.docs[s.active].content=v;}else s.size=number(v,12,32);});
})();

/* Source provenance: note-labs-audit.js:2. Preserve this closure. */
(() => {
'use strict';
const {register,registry,ui,clusteredChart,daysBetween}=window.NOTE_LABS;
const {btn,field,select,table,coach,output,office,dialog,paper,esc,number,money}=ui;
const controls=x=>`<div class="lab-controls">${x}</div>`;
register(['y2022q24'],'拖标尺，区分首行、悬挂、左右缩进','抓住不同标记拖动；方块连同两个左侧标记一起移动。',{first:12,rest:0,right:100,margin:8},s=>{
 const handle=(k,label,pos,shape)=>`<button class="lab-ruler-handle ${shape}" data-lab-drag="ruler" data-key="${k}" style="left:${pos}%" role="slider" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pos}">${shape==='square'?'■':'▼'}</button>`;
 return controls(field('margin','学习调节器：左右页边距（相对单位）',s.margin,'range','min="4" max="16"'))+office('Word','视图','<span>☑ 标尺</span>',`<div class="lab-ruler-page" style="padding-inline:${s.margin}%"><div class="lab-ruler" data-ruler>${Array.from({length:11},(_,i)=>`<span>${i}</span>`).join('')}${handle('first','首行缩进',s.first,'upper')}${handle('rest','悬挂缩进',s.rest,'lower')}${handle('both','左缩进',s.rest,'square')}${handle('right','右缩进边界',s.right,'upper')}</div><div class="lab-indent-area"><p style="margin-left:${s.rest}%;margin-right:${100-s.right}%;text-indent:${s.first-s.rest}cqw">首行缩进控制第一行起点。悬挂缩进控制其余行起点。拖动方块会把两个左侧标记一起移动，保持两者之间的距离。右侧标记限制段落右边界，页边距则限定整页可排版区域。</p></div></div>`)+output(`第一行起点 ${s.first.toFixed(0)}；其余行起点 ${s.rest.toFixed(0)}；右边界 ${s.right.toFixed(0)}。刻度为比例示意。`);
},()=>{});
register(['y2026q47'],'只改一种间距，观察对应字符边界','数字和西文字母分别受两个选项控制；实际换行由当前版面计算。',{numbers:true,latin:true,pn:true,pl:true,pane:false},s=>{
 const text='泰山石经历10亿年到20亿年的形成过程，其中约13亿年的地质变化留下了记录。这里另加Word示例用于对照。';
 const html=[...text].map((c,i,a)=>{const han=x=>/[\u4e00-\u9fff]/.test(x||''),num=x=>/[0-9]/.test(x||''),latin=x=>/[A-Za-z]/.test(x||'');const gap=(s.numbers&&(han(a[i-1])&&num(c)||num(a[i-1])&&han(c)))||(s.latin&&(han(a[i-1])&&latin(c)||latin(a[i-1])&&han(c)));return `<span style="${gap?'margin-left:.24em':''}">${esc(c)}</span>`;}).join('');
 return office('Word','开始 · 段落',btn('段落对话框 ↘','open'),`${s.pane?dialog('段落 · 中文版式',`<label><input data-field="pn" type="checkbox" ${s.pn?'checked':''}>自动调整中文与数字的间距</label><label><input data-field="pl" type="checkbox" ${s.pl?'checked':''}>自动调整中文与西文的间距</label>`,btn('确定','apply')+btn('取消','cancel')):''}${paper(`<p class="lab-cjk-text">${html}</p>`)}`)+output(`中文与数字：${s.numbers?'开':'关'}；中文与西文：${s.latin?'开':'关'}。改变数字选项不会改变“Word”的两侧自动间距。`);
},(s,a)=>{if(a==='open'){s.pane=true;s.pn=s.numbers;s.pl=s.latin;}if(a==='apply'){s.numbers=s.pn;s.latin=s.pl;s.pane=false;}if(a==='cancel')s.pane=false;});
register(['y2024q54'],'设置页眉段落的下边框','进入页眉后调整颜色、线宽和应用范围，比较段落边框与文字边框。',{
 editing:false,border:true,menu:false,color:'#555555',width:1,style:'solid',scope:'paragraph',draft:null
},s=>{
 const settings=s.draft||s;
 const border=s.border?`${s.width}pt ${s.style} ${s.color}`:'none';
 return office('Word',s.editing?'开始':'插入',s.editing?btn('段落 · 边框和底纹…','menu'):btn('页眉 → 编辑页眉','edit'),
  (s.menu?dialog('边框和底纹 · 边框',select('color','颜色',settings.color,[['#555555','灰黑'],['#2563a0','蓝色'],['#c03535','红色']])+select('width','宽度（磅）',settings.width,[[.5,'0.5'],[1,'1'],[2.25,'2.25'],[3,'3']])+select('style','线型',settings.style,[['solid','实线'],['dashed','虚线'],['double','双线']])+select('scope','应用于',settings.scope,[['paragraph','段落'],['text','文字']])+btn('无框线','none')+btn('下框线','bottom'),btn('确定','apply')+btn('取消','close')):'')+
  paper(`<div class="lab-page-header" style="border-bottom:${s.scope==='paragraph'?border:'none'};padding-bottom:8px"><span style="border-bottom:${s.scope==='text'?border:'none'}">资料汇编 · 页眉</span></div><p>正文与页眉分开编辑。段落边框铺到段落边界，文字边框只围住所选文字。</p>`))+
  output(s.editing?'原题要求改变页眉横线，应设置段落下边框的颜色和宽度。删除页眉文字不必然删除这条线。':'先进入页眉编辑状态。');
},(s,a)=>{
 if(a==='edit')s.editing=true;
 if(a==='menu'&&s.editing){s.draft={color:s.color,width:s.width,style:s.style,scope:s.scope,border:s.border};s.menu=true;}
 if(a==='none'&&s.draft)s.draft.border=false;
 if(a==='bottom'&&s.draft)s.draft.border=true;
 if(a==='apply'&&s.draft){Object.assign(s,s.draft);s.menu=false;s.draft=null;}
 if(a==='close'){s.menu=false;s.draft=null;}
},(s,k,v)=>{if(s.draft)s.draft[k]=k==='width'?Number(v):v;});
register(['y2023q7'],'插入有结构的公式对象','编辑分数或根式，再切换专业显示、线性显示和内嵌位置。',{
 exists:false,kind:'fraction',numerator:'a+b',denominator:'c',radicand:'x+1',display:'professional',position:'inline',saved:null
},s=>{
 const structure=s.kind==='fraction'?`<mfrac><mtext>${esc(s.numerator)}</mtext><mtext>${esc(s.denominator)}</mtext></mfrac>`:`<msqrt><mtext>${esc(s.radicand)}</mtext></msqrt>`;
 const linear=s.kind==='fraction'?`(${s.numerator})/(${s.denominator})`:`sqrt(${s.radicand})`;
 const equation=`<span class="lab-equation" style="display:${s.position==='display'?'block':'inline-block'};text-align:center;padding:14px;border:1px solid #af92bb">${s.display==='professional'?`<math xmlns="http://www.w3.org/1998/Math/MathML" display="${s.position==='display'?'block':'inline'}">${structure}</math>`:esc(linear)}</span>`;
 return office('Word',s.exists?'公式工具 · 设计':'插入',btn('公式 → 插入新公式','insert')+(s.exists?select('kind','结构',s.kind,[['fraction','分数'],['root','根式']])+select('display','显示形式',s.display,[['professional','专业'],['linear','线性']])+select('position','公式位置',s.position,[['inline','内嵌'],['display','独立显示']])+btn('保存到公式库','save')+btn('删除公式','delete'):'')+(s.saved?btn('插入已保存公式','restore'):''),paper(`<p>公式示例：${s.exists?equation:'光标位于正文。'} 后续说明文字。</p>`))+
  (s.exists?controls(s.kind==='fraction'?field('numerator','分子',s.numerator)+field('denominator','分母',s.denominator):field('radicand','被开方项',s.radicand)):'')+
  output('这里的分子、分母和根式是独立结构；专业与线性形式保存同一内容。内嵌公式随正文行排列，独立显示公式单占一行。');
},(s,a)=>{
 if(a==='insert')s.exists=true;
 if(a==='delete')s.exists=false;
 if(a==='save'&&s.exists)s.saved={kind:s.kind,numerator:s.numerator,denominator:s.denominator,radicand:s.radicand,display:s.display,position:s.position};
 if(a==='restore'&&s.saved){Object.assign(s,s.saved);s.exists=true;}
});
register(['y2020q41'],'进入页眉后，再决定各节是否共享','第一页和正文属于不同节，取消链接后可分别编辑页眉。',{section:1,editing:false,linked:true,headers:['',''],text:''},s=>
 office('Word',s.editing?'页眉和页脚工具 · 设计':'插入',s.editing?btn(s.linked?'链接到前一节：开':'链接到前一节：关','link','',s.section===2?'':'disabled')+btn('关闭页眉和页脚','close'):btn('页眉 → 编辑页眉','edit'),paper(`<div class="lab-page-header">${s.editing?field('text',`第${s.section}节页眉${s.section===2&&s.linked?' · 与上一节相同':''}`,s.section===2&&s.linked?s.headers[0]:s.headers[s.section-1]):esc(s.section===2&&s.linked?s.headers[0]:s.headers[s.section-1])||'页眉区域（双击可编辑）'}</div><h4>${s.section===1?'封面与目录':'正文第一章'}</h4><p>正文区域与页眉区域分开编辑。</p>`))+controls(btn('查看前置页（第1节）','page',1)+btn('查看正文（第2节）','page',2))+output('第2节链接开启时继承前节；取消链接后再修改，才能形成独立页眉。此示例已预置下一页分节符。'),
 (s,a,v)=>{if(a==='edit')s.editing=true;if(a==='close')s.editing=false;if(a==='page'){s.section=Number(v);s.text=s.section===2&&s.linked?s.headers[0]:s.headers[s.section-1];}if(a==='link'&&s.section===2){if(s.linked)s.headers[1]=s.headers[0];s.linked=!s.linked;}},(s,k,v)=>{s.text=v;if(s.section===2&&s.linked)s.headers[0]=v;else s.headers[s.section-1]=v;});
register(['y2020q43'],'先设首行缩进，再比较两种换行','Enter建立新段落，Shift+Enter只在同段换行。',{special:'first',amount:2,break:'paragraph'},s=>
 office('Word','开始 · 段落',select('special','特殊格式',s.special,[['first','首行缩进'],['hanging','悬挂缩进'],['none','无']])+field('amount','字符数',s.amount,'number','min="0" max="4"'),paper(`<div class="lab-paragraph-demo" style="${s.special==='hanging'?`padding-left:${s.amount}em;`:''}"><p style="text-indent:${s.special==='first'?s.amount:s.special==='hanging'?-s.amount:0}em">第一行按段落格式缩进，自动换行的后续行使用同一段落规则。${s.break==='line'?'<span class="lab-mark">↵</span><br>':'<span class="lab-mark">¶</span></p><p style="text-indent:'+(s.special==='first'?s.amount:s.special==='hanging'?-s.amount:0)+'em">'}第二段内容从这里开始，观察这一行是否重新应用首行缩进。</p></div>`))+controls(btn('模拟键盘：Enter','break','paragraph')+btn('模拟键盘：Shift+Enter','break','line'))+output(s.break==='line'?'这里只有一个段落，手动换行后的新行不是新的首行。':'这里有两个段落，第二段重新应用首行缩进。'),
 (s,a,v)=>{s.break=v;},(s,k,v)=>{s[k]=k==='amount'?number(v,0,4):v;});
registry.y2020q41.dblclick=(s,e)=>{if(e.target.closest('.lab-page-header')){s.editing=true;return true;}};
const headerModel=registry.y2020q41;
const headerRender=headerModel.render;
const headerAction=headerModel.action;
const headerChange=headerModel.change;
Object.assign(headerModel.initial,{scenario:'headers',physical:3,split:false,nEditing:false,nLinked:true,numbers:[false,false],nStart:1,nDialog:false,nMessage:''});
headerModel.render=s=>controls(select('scenario','操作任务',s.scenario,[['headers','页眉文字与前节链接'],['numbers','封面目录无页码，正文从1开始']]))+(s.scenario==='headers'?headerRender(s):office('Word',s.nEditing?'页眉和页脚工具 · 设计':'布局',s.nEditing?btn(s.nLinked?'链接到前一节：开':'链接到前一节：关','num_link','',s.split&&s.physical>=3?'':'disabled')+btn('插入页码','num_insert')+btn('设置页码格式…','num_format')+btn('关闭页脚编辑','num_close'):btn('分隔符 → 下一页','num_break')+btn('编辑页脚','num_edit'),`${s.nDialog?dialog('页码格式',field('nStart','起始页码',s.nStart,'number','min="1" max="99"'),btn('确定','num_apply')):''}${paper(`<h4>${['封面','目录','正文第一章','正文第二页'][s.physical-1]}</h4><p>第${s.physical}个物理页面 · 第${s.split&&s.physical>=3?2:1}节</p><div class="lab-page-footer">${s.numbers[s.split&&s.physical>=3?1:0]?(s.split&&s.physical>=3?s.physical-3+Number(s.nStart):s.physical):'未插入页码'}</div>`)}`)+controls([1,2,3,4].map(i=>btn(['封面','目录','正文首页','正文后页'][i-1],'num_page',i)).join(''))+output(s.nMessage||'在目录末尾插入下一页分节符；到正文页脚取消前节链接，再插入页码并设起始页码1。'));
headerModel.action=(s,a,v)=>{if(!a.startsWith('num_'))return headerAction(s,a,v);if(a==='num_page')s.physical=Number(v);if(a==='num_break'){if(s.physical!==2){s.nMessage='先选择目录页，在目录末尾建立正文新节。';return;}s.split=true;s.physical=3;s.nMessage='正文已从第2节开始；分页和分节不是同一个操作。';}if(a==='num_edit')s.nEditing=true;if(a==='num_close')s.nEditing=false;if(a==='num_link'&&s.split&&s.physical>=3)s.nLinked=!s.nLinked;if(a==='num_insert'){if(!s.split||s.nLinked)s.numbers=[true,true];else s.numbers[s.physical>=3?1:0]=true;s.nMessage=s.nLinked?'链接未断开，前置页也出现页码。可重置后按正确顺序操作。':'正文页脚已独立插入页码。';}if(a==='num_format')s.nDialog=true;if(a==='num_apply'){s.nStart=number(s.nStart,1,99);s.nDialog=false;}};
headerModel.change=(s,k,v)=>{if(k==='scenario')s.scenario=v;else if(k==='nStart')s.nStart=v;else headerChange(s,k,v);};
})();

/* Source provenance: note-labs-study.js:6. Preserve this closure. */
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

/* Source provenance: note-labs-study.js:71. Preserve this closure. */
(() => {

const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,office,paper,dialog,output,esc,number}=ui;
const controls=s=>`<div class="lab-controls">${s}</div>`;
const listTexts=['信息技术基础','计算机发展','计算机系统'];
function listNumbers(levels){let one=0,two=0;return levels.map(level=>level===1?(two=0,String(++one)):`${Math.max(1,one)}.${++two}`);}
register(['merged-8'],'改变列表级别，观察编号与文本起点分别变化','光标在列表文字起始处；按Tab或Shift+Tab调整当前项级别，其他编号自动接续。',{levels:[1,1,1],selected:1,positions:[0,0,0],textPositions:[2,2,2],pane:false,draftNumber:0,draftText:2,message:'当前选中第2项。编号位置与文本缩进分开设置。'},s=>{
 const numbers=listNumbers(s.levels);
 return office('Word','开始',btn('多级列表 · 调整列表缩进…','open'),`${s.pane?dialog('调整列表缩进',field('draftNumber','编号位置（相对字符）',s.draftNumber,'number','min="0" max="6"')+field('draftText','文本缩进（相对字符）',s.draftText,'number','min="1" max="10"'),btn('确定','apply')+btn('取消','cancel')):''}${paper(listTexts.map((text,i)=>`<div style="position:relative;min-height:58px;padding-left:${s.textPositions[i]}em;background:${s.selected===i?'#f4e5f5':'transparent'}"><b style="position:absolute;left:${s.positions[i]}em;top:12px">${numbers[i]}</b>${btn(text,'select',i,`style="text-align:left;border:0;background:transparent;padding-block:12px"`)}</div>`).join(''))}`)+controls(btn('模拟键盘：Tab','demote')+btn('模拟键盘：Shift+Tab','promote'))+output(s.message+` 当前第${s.selected+1}项：级别${s.levels[s.selected]}；编号${numbers[s.selected]}；编号位置${s.positions[s.selected]}，文本位置${s.textPositions[s.selected]}。`);
},(s,a,v)=>{const i=s.selected;if(a==='select')s.selected=Number(v);if(a==='demote'&&i>0&&s.levels[i]===1){s.levels[i]=2;s.positions[i]=2;s.textPositions[i]=4;s.message='当前项降为第2级，编号重新计算。';}if(a==='promote'&&s.levels[i]===2){s.levels[i]=1;s.positions[i]=0;s.textPositions[i]=2;s.message='当前项升为第1级，后续编号重新计算。';}if(a==='open'){s.pane=true;s.draftNumber=s.positions[i];s.draftText=s.textPositions[i];}if(a==='cancel')s.pane=false;if(a==='apply'){s.positions[i]=number(s.draftNumber,0,6);s.textPositions[i]=number(s.draftText,s.positions[i]+1,10);s.pane=false;s.message='只改变编号与文字的位置，列表级别保持不变。';}});
register(['y2025q47'],'让文字真正围绕图片重排','同一张透明圆形图，用四周型和紧密型比较包围矩形与轮廓边界。',{wrap:'inline',selected:false,menu:false,message:'嵌入型图片作为行内对象参加排版。'},s=>{
 const image=`<button data-lab-act="select" class="lab-wrap-object" style="width:112px;height:112px;padding:0;border:${s.selected?'2px solid #905b9b':'0'};border-radius:50%;background:radial-gradient(circle at 35% 35%,#f6cadf 0%,#cfb7e9 65%,#9876b7 100%);${s.wrap==='topbottom'?'display:block;float:none;margin:14px 0;':s.wrap==='inline'?'display:inline-block;vertical-align:baseline;':`float:left;margin:0 14px 12px 0;${s.wrap==='tight'?'shape-outside:circle(50%);':''}`}" aria-label="选择圆形图片">学习图</button>`;
 const text='图片和文字共同构成文档内容。嵌入型把图片作为一枚大字符；四周型按图片外接矩形留出区域；紧密型允许文字贴近透明图片的可见轮廓。改变环绕方式会重新计算文字行的位置，文字本身保持不变。这里使用圆形图片，便于观察矩形边界与曲线边界的区别。';
 return office('Word',s.selected?'图片工具 · 格式':'开始',btn('环绕文字 ▾','menu','',s.selected?'':'disabled'),`${s.menu?dialog('环绕文字',btn('嵌入型','wrap','inline')+btn('四周型','wrap','square')+btn('紧密型','wrap','tight')+btn('上下型','wrap','topbottom'),btn('关闭','close')):''}${paper(`<div style="display:flow-root;font-size:16px;line-height:1.85"><p style="margin:0">${s.wrap==='topbottom'?text.slice(0,27)+image+text.slice(27):image+text}</p></div>`)}`)+output(s.message);
},(s,a,v)=>{if(a==='select')s.selected=true;if(a==='menu'&&s.selected)s.menu=true;if(a==='close')s.menu=false;if(a==='wrap'){s.wrap=v;s.menu=false;s.message={topbottom:'文字只排在图片上方和下方，图片左右不排文字。',inline:'图片已回到文字行内。',square:'文字绕开图片的外接矩形，四角仍留白。',tight:'文字按圆形轮廓重排，可进入外接矩形四角的空白。'}[v];}});
register(['y2024q8'],'先改变选择范围，再比较删除内容与删除表格','点击表格移动控点选择整表；点击单元格只把插入位置放在该格。',{values:[['姓名','日期'],['王宁','9月4日'],['李悦','9月5日']],selection:'all',cell:[1,0],removed:false,message:'初始已选中整表，包括标题行。'},s=>
 office('Word','表格工具 · 布局',btn('删除 → 删除表格','remove','',s.removed?'disabled':''),paper(s.removed?'<p>表格结构已删除；后续正文回流到这里。</p>':`${btn('✥','all','',`aria-label="选择整张表格"`)}<table style="width:100%;border-collapse:collapse">${s.values.map((r,i)=>`<tr>${r.map((v,j)=>`<${i===0?'th':'td'} style="border:1px solid #9778a1;padding:9px;background:${s.selection==='all'||s.cell[0]===i&&s.cell[1]===j?'#f4e6f3':'#fff'}">${btn(esc(v)||'　','cell',i+','+j,`style="border:0;background:transparent;min-width:30px;min-height:34px"`)}</${i===0?'th':'td'}>`).join('')}</tr>`).join('')}</table>`))+controls(btn('模拟键盘：Delete','delete','',s.removed?'disabled':'')+btn('模拟键盘：Backspace','backspace','',s.removed?'disabled':''))+output(s.message),
 (s,a,v)=>{if(a==='all')s.selection='all';if(a==='cell'){s.selection='cell';s.cell=v.split(',').map(Number);s.message='插入位置在当前单元格文字末尾，未选中整表。';}if(a==='remove'||a==='backspace'&&s.selection==='all'){s.removed=true;s.message='表格及其内容已删除。';}if(a==='delete'){if(s.selection==='all'){s.values=s.values.map(r=>r.map(()=>''));s.message='包括标题行在内的全部内容清空，表格网格保留。';}else s.message='当前插入位置在格内文字末尾，Delete不会删除表格结构。';}if(a==='backspace'&&s.selection==='cell'){const [i,j]=s.cell;s.values[i][j]=[...s.values[i][j]].slice(0,-1).join('');s.message='只删除插入点前的一个字符，表格结构保留。';}});
})();

/* Source provenance: note-labs-study.js:226. Preserve this closure. */
(() => {

const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,office,paper,dialog,output,table,esc,number}=ui;
const controls=s=>`<div class="lab-controls">${s}</div>`;
const old=registry.y2024q8;
const original={render:old.render,action:old.action,change:old.change};
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
register(['merged-5'],'标题结构决定导航与目录，视图决定如何查看','切换五种视图；应用标题样式后插入自动目录，再比较更新页码和更新整个目录。',{view:'print',tab:'view',nav:true,headings:[{id:0,level:1,title:'第一章 信息技术',body:'数据是信息的符号化表示。',styled:false},{id:1,level:1,title:'第二章 操作系统',body:'操作系统管理硬件和软件资源。',styled:false}],selected:0,collapsed:[],cover:false,toc:null,tocPane:false,tocMode:'all',message:'标题只有大号粗体外观。先选标题，再在开始中应用标题1。'},s=>{
 const h=s.headings,viewNames={print:'打印布局',outline:'大纲',read:'阅读模式',draft:'草稿',web:'Web版式'};
 const navigation=s.nav?`<aside style="padding:12px;background:#f5edf7"><b>导航 · 标题</b>${h.some(x=>x.styled)?h.map((p,i)=>p.styled?btn(esc(p.title),'select',i):'').join(''):'<p>此文档不包含标题。</p>'}</aside>`:'';
 const toc=s.toc?`<section class="lab-auto-toc" style="padding:16px;background:#fff"><h4>目录</h4>${s.toc.length?s.toc.map(e=>`<p style="display:flex;justify-content:space-between;gap:12px"><span>${esc(e.title)}</span><b>${e.page}</b></p>`).join(''):'<p>未找到目录项。为正文标题应用标题样式后，更新整个目录。</p>'}</section>`:'';
 const title=(p,i)=>btn(esc(p.title),'select',i,`class="${s.selected===i?'lab-selected':''}" style="font-weight:700;font-size:20px;text-align:left;border:0;background:transparent"`);
 const illustration='<figure data-document-image style="margin:12px 0;padding:12px;background:#e8f1ec"><svg role="img" aria-label="文档中的计算机示意图" viewBox="0 0 240 100" style="width:100%;max-height:110px"><rect x="60" y="10" width="120" height="65" rx="5" fill="#589879"/><path d="M120 75V90M90 92H150" stroke="#3d6552" stroke-width="6"/></svg><figcaption>文档中的图片</figcaption></figure>';
 let doc='';
 if(s.view==='outline')doc=`<div style="padding:16px;background:#fff">${h.map((p,i)=>`<div>${title(p,i)}${p.styled?btn(s.collapsed.includes(p.id)?'展开正文':'折叠正文','collapse',i):'（正文级别）'}<small> ${p.styled?'标题'+p.level:'正文'}</small>${s.collapsed.includes(p.id)?'':`<p style="padding-left:24px">${esc(p.body)}</p>`}</div>`).join('')}</div>`;
 else if(s.view==='read')doc=h.map(p=>`<section style="padding:18px;background:#fff"><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p>${illustration}</section>`).join('');
 else if(s.view==='draft'||s.view==='web')doc=`<div style="padding:${s.view==='web'?'10px':'20px'};background:#fff">${h.map((p,i)=>`${title(p,i)}<p>${esc(p.body)}</p>${s.view==='web'?illustration:''}`).join(s.view==='draft'?'<hr style="border:0;border-top:1px dotted #aaa">':'')}</div>`;
 else doc=(s.cover?paper('<h3>封面</h3><p>计算机学习文档</p>'):'')+h.map((p,i)=>paper(`<header style="font-size:12px">计算机学习文档</header>${title(p,i)}<p>${esc(p.body)}</p>${illustration}<footer>第 ${i+1+(s.cover?1:0)} 页</footer>`)).join('');
 const commands=s.tab==='view'?Object.entries(viewNames).map(([key,name])=>btn(name,'view',key)).join('')+btn(s.nav?'隐藏导航窗格':'导航窗格','nav'):s.tab==='home'?btn('标题 1','style')+btn('正文','plain'):btn('目录 → 自动目录1','tocInsert')+btn('更新目录…','tocOpen','',s.toc?'':'disabled');
 return controls(select('tab','功能区位置',s.tab,[['view','视图'],['home','开始'],['references','引用']]))+office('Word',{view:'视图',home:'开始',references:'引用'}[s.tab],commands,`${navigation}${s.tocPane?dialog('更新目录',select('tocMode','更新方式',s.tocMode,[['pages','只更新页码'],['all','更新整个目录']]),btn('确定','tocApply')+btn('取消','tocCancel')):''}${toc}${doc}`)+(s.view==='outline'?controls(btn('上移标题及正文','move','up',s.selected===0?'disabled':'')+btn('下移标题及正文','move','down',s.selected===h.length-1?'disabled':'')):'')+controls(field('title','学习编辑器：修改所选标题',h[s.selected].title,'text',s.view==='read'?'disabled':'')+btn(s.cover?'移除前置封面':'在文档前增加一页封面','cover'))+output(s.message);
},(s,a,v)=>{
 if(a==='view'){s.view=v;s.message={print:'显示打印分页与页眉页脚。',outline:'按标题结构显示层级；展开/折叠不删除正文。',read:'简化界面，集中阅读文档。',draft:'草稿不显示图片、页眉页脚，侧重连续文字编辑；切回打印布局可恢复查看。',web:'Web版式仍可编辑并显示图片，适应显示区宽度，不以打印纸张分页。'}[v];}
 if(a==='nav')s.nav=!s.nav;
 if(a==='select'){s.selected=Number(v);s.message='当前所选标题：'+s.headings[s.selected].title+'。';}
 if(a==='style'){s.headings[s.selected].styled=true;s.headings[s.selected].level=1;s.message='所选段落应用标题1，导航立即识别。已有目录需要更新。';}
 if(a==='plain'){s.headings[s.selected].styled=false;s.message='所选段落改为正文级别；已有目录需要更新整个目录。';}
 if(a==='move'){const to=s.selected+(v==='up'?-1:1);if(to>=0&&to<s.headings.length){const block=s.headings.splice(s.selected,1)[0];s.headings.splice(to,0,block);s.selected=to;s.message='标题和所属正文一起移动；内容不删除，目录需更新。';}}
 if(a==='collapse'){const i=s.headings[Number(v)].id;s.collapsed=s.collapsed.includes(i)?s.collapsed.filter(x=>x!==i):[...s.collapsed,i];}
 if(a==='cover'){s.cover=!s.cover;s.message='前置页面数变化，标题页码已改变，旧目录保持原结果，需更新。';}
 const entries=()=>s.headings.flatMap((h,i)=>h.styled?[{id:h.id,title:h.title,page:i+1+(s.cover?1:0)}]:[]);
 if(a==='tocInsert'){s.toc=entries();s.message='在预留目录位置插入自动目录，条目来自标题结构。此局部模型把目录区单独显示，不计入示例正文页码。';}
 if(a==='tocOpen')s.tocPane=true;
 if(a==='tocCancel')s.tocPane=false;
 if(a==='tocApply'){s.toc=s.tocMode==='all'?entries():s.toc.map(e=>({...e,page:s.headings.findIndex(h=>h.id===e.id)+1+(s.cover?1:0)}));s.tocPane=false;s.message=s.tocMode==='all'?'目录标题、条目与页码一起更新。':'仅页码更新；标题文字和已有条目保持原样。';}
},(s,k,v)=>{if(k==='title'){s.headings[s.selected].title=v;s.message='标题已修改；导航读取新标题，已有目录保留上次生成结果。';}else s[k]=v;});
})();

/* Source provenance: note-labs-study.js:289. Preserve this closure. */
(() => {

const {register,registry,ui}=window.NOTE_LABS;
const {btn,field,select,office,paper,dialog,output,esc,number}=ui;
const controls=s=>`<div class="lab-controls">${s}</div>`;
const alignName={left:'左对齐',center:'居中',right:'右对齐'};
register(['merged-7'],'分别改变字符格式、段落对齐与显示比例','同一段文字比较全半角、字体色与突出显示；观察两端对齐和分散对齐的末行。',{
 selected:0,size:[16,12],underline:['none','none'],align:['left','left'],colors:['#262331','#262331'],highlight:['transparent','transparent'],texts:['２０２６年计算机技能竞赛通知','为提高同学们的计算机应用能力，现组织技能竞赛。请各班于９月２０日前报名，练习Word和Excel的基本操作。欢迎参加。'],zoom:100,message:'字号与颜色属于字符格式；对齐属于段落格式，缩放只改变屏幕显示。'
},s=>{
 const index=s.selected,alignOptions=[['left','左对齐'],['center','居中'],['right','右对齐'],['justify','两端对齐'],['distribute','分散对齐']];
 const paragraphs=s.texts.map((text,i)=>`<p style="text-align:${s.align[i]==='distribute'?'justify':s.align[i]};text-align-last:${s.align[i]==='distribute'?'justify':'auto'};margin-block:18px">${btn(esc(text),'select',i,`class="${index===i?'lab-selected':''}" style="display:block;width:100%;white-space:normal;font-size:${s.size[i]}pt;color:${s.colors[i]};text-decoration-line:${s.underline[i]==='none'?'none':'underline'};text-decoration-style:${s.underline[i]==='double'?'double':'solid'};line-height:1.9;border:0;outline:${index===i?'1px dashed #9875a0':'none'};background:transparent;padding:0;text-align:inherit;text-align-last:inherit"`).replace(esc(text),`<span style="background-color:${s.highlight[i]}">${esc(text)}</span>`)}</p>`).join('');
 return office('Word','开始',select('size','字号（磅）',s.size[index],[[12,'12'],[16,'16'],[18,'18'],[22,'22']])+select('underline','下划线',s.underline[index],[['none','无'],['single','单下划线'],['double','双下划线']])+select('alignment','段落对齐',s.align[index],alignOptions)+select('color','字体颜色',s.colors[index],[['#262331','黑色'],['#c03535','红色'],['#2563a0','蓝色']])+select('highlight','文本突出显示',s.highlight[index],[['transparent','无颜色'],['#fff29a','黄色'],['#bde9c7','绿色']])+btn('全角 → 半角','width','half')+btn('半角 → 全角','width','full'),`<div class="lab-format-viewport" style="overflow:auto;max-height:460px;width:100%"><div style="zoom:${s.zoom/100}">${paper(paragraphs)}</div></div>`)+controls(select('zoom','显示比例（对应Word状态栏缩放）',s.zoom,[[100,'100%'],[125,'125%'],[150,'150%']]))+output(`${s.message} 当前${index===0?'标题':'正文'}：${s.size[index]}磅，${alignOptions.find(x=>x[0]===s.align[index])[1]}；屏幕显示${s.zoom}%。`);
},(s,a,v)=>{
 if(a==='select'){s.selected=Number(v);s.message='已选择'+(s.selected===0?'标题':'正文')+'；另一段的格式保持。';}
 if(a==='width'){s.texts[s.selected]=s.texts[s.selected].replace(v==='half'?/[\uff01-\uff5e\u3000]/g:/[!-~ ]/g,c=>c==='　'?' ':c===' '?'　':String.fromCharCode(c.charCodeAt(0)+(v==='half'?-0xfee0:0xfee0)));s.message='转换全半角只影响相应字符，不把汉字改成半个汉字，也不修改字号。';}
},(s,k,v)=>{
 const fields={size:'size',underline:'underline',alignment:'align',color:'colors',highlight:'highlight'};
 if(fields[k])s[fields[k]][s.selected]=k==='size'?Number(v):v;
 if(k==='zoom'){s.zoom=Number(v);s.message='只改变屏幕比例；保存和打印仍使用原字号与排版。';}
 else s.message=k==='alignment'?'两端对齐通常不拉伸末行；分散对齐也把末行分散到左右边界。':'只修改所选格式；切换到另一段后，可检查原段的颜色和突出显示仍保留。';
});
register(['y2020q63'],'先移动整张表，再调整格内文字','表格属性决定整表在页面的位置；单元格对齐只决定文字在格内的位置。',{tableAlign:'left',cellH:'left',cellV:'top',pane:false,draftAlign:'left',message:'本例预先选中整张表，各单元格的内容对齐统一设置。'},s=>
 office('Word','表格工具 · 布局',btn('属性…','properties','',s.pane?'disabled':'')+btn('单元格：水平居中','cellCenter','',s.pane?'disabled':'')+btn('单元格：水平垂直居中','cellMiddle','',s.pane?'disabled':'')+btn('单元格：左上对齐','cellReset','',s.pane?'disabled':''),`${s.pane?dialog('表格属性 · 表格',select('draftAlign','对齐方式',s.draftAlign,[['left','左对齐'],['center','居中'],['right','右对齐']]),btn('确定','apply')+btn('取消','cancel')):''}${paper(`<div style="position:relative;width:100%;min-height:235px"><div aria-hidden="true" style="position:absolute;inset:0 50% 0 auto;border-left:1px dashed #dfcbe0"></div><table style="position:relative;border-collapse:collapse;width:72%;margin-left:${s.tableAlign==='left'?'0':'auto'};margin-right:${s.tableAlign==='right'?'0':'auto'}">${[['姓名','成绩'],['王宁','92']].map(r=>`<tr>${r.map(v=>`<td style="height:82px;padding:8px;border:1px solid #977aa1;text-align:${s.cellH};vertical-align:${s.cellV}">${v}</td>`).join('')}</tr>`).join('')}</table></div>`)}`)+output(`${s.message} 整表：${alignName[s.tableAlign]}；格内文字：${s.cellH==='center'?'水平居中':'靠左'}、${s.cellV==='middle'?'垂直居中':'靠上'}。`),
 (s,a)=>{if(a==='properties'){s.pane=true;s.draftAlign=s.tableAlign;}if(a==='cancel'){s.pane=false;s.message='取消表格属性草稿，已应用的位置保持。';}if(a==='apply'){s.tableAlign=s.draftAlign;s.pane=false;s.message='只改变整表位置，格内文字对齐保持。';}if(a==='cellCenter'){s.cellH='center';s.message='只改变格内的水平对齐，整表位置与垂直对齐保持。';}if(a==='cellMiddle'){s.cellH='center';s.cellV='middle';s.message='格内文字水平与垂直居中，整表位置保持。';}if(a==='cellReset'){s.cellH='left';s.cellV='top';s.message='格内文字回到左上，整表位置保持。';}});
const header=registry.y2020q41;
const base={render:header.render,action:header.action,change:header.change};
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

/* Source provenance: note-labs-study.js:473. Preserve this closure. */
window.NOTE_LABS.registry.y2024q8.keydown=(s,e)=>{if(s.scenario==='formula'&&e.key==='F9'){e.preventDefault();window.NOTE_LABS.registry.y2024q8.action(s,'formulaUpdate');return true;}};

/* Source provenance: note-labs-study.js:837. Preserve this closure. */
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
const captions=registry['merged-6'];
captions.updateFields=updateFields;
captions.keydown=(s,e)=>{
    if(s.pane||e.target.closest('input,textarea,select'))return;
    if(e.ctrlKey&&!e.altKey&&e.key.toLowerCase()==='a'){e.preventDefault();s.selectedField={kind:'all'};s.message='已选择全文中的题注与引用域。按F9更新。';return true;}
    if(e.key==='F9'){e.preventDefault();updateFields(s);return true;}
  };
})();

/* Source provenance: note-labs-study.js:952. Preserve this closure. */
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

/* Source provenance: note-labs-study.js:1062. Preserve this closure. */
(() => {
'use strict';
const {register,ui}=window.NOTE_LABS;
const {field,select,office,paper,output,number,table}=ui;
register(['merged-9'],'把高、宽和纵横比对应起来','原图高8.5 cm、宽6 cm；比较锁定比例、强制高宽与先裁剪三种结果。',{
    mode:'lock',width:6,height:8.5
  },s=>{
    const ratio=s.mode==='crop'?5/6:6/8.5;
    return office('Word','图片工具 · 格式',select('mode','尺寸方案',s.mode,[['lock','锁定原图纵横比'],['stretch','取消锁定，分别设置'],['crop','先裁剪为宽5∶高6']])+field('height','高度（cm）',s.height,'number','min="0.5" max="20" step="0.01"')+field('width','宽度（cm）',s.width,'number','min="0.5" max="20" step="0.01"'),paper(
      `<figure class="lab-image-size" style="margin:0;max-width:100%"><svg viewBox="${s.mode==='crop'?'0 65 600 720':'0 0 600 850'}" preserveAspectRatio="none" role="img" aria-label="尺寸预览：圆形被拉长表示失真" style="display:block;width:${s.width*25}px;height:${s.height*25}px;max-width:none;background:#e8e1f2"><rect x="0" y="0" width="600" height="850" fill="#e7f0ec"/><path d="M0 750 L190 400 L340 580 L470 300 L600 680 V850 H0" fill="#80a691"/><circle cx="230" cy="230" r="105" fill="#edc76a"/><rect x="8" y="8" width="584" height="834" fill="none" stroke="#927ca6" stroke-width="16"/></svg><figcaption>高 ${s.height.toFixed(2)} cm × 宽 ${s.width.toFixed(2)} cm</figcaption></figure>`))+
      table(['操作','联动结果'],[['锁定原比例，高改为6 cm','宽 = 6 × 6 ÷ 8.5 ≈ 4.24 cm'],['锁定原比例，宽改为5 cm','高 = 8.5 × 5 ÷ 6 ≈ 7.08 cm'],['目标高6 cm、宽5 cm','原比例不匹配；强制尺寸会变形，裁剪会舍弃部分画面']])+
      output(s.mode==='crop'?'已裁去原图上、下各一部分，再按5∶6缩放；圆形保持圆形，可见内容减少。':Math.abs(s.width/s.height-ratio)>.001?'当前宽高比与原图不同，圆形已被拉伸。':'宽高按原图比例联动，圆形保持圆形。');
  },()=>{},(s,k,v)=>{
    if(k==='mode'){s.mode=v;if(v==='crop'){s.width=5;s.height=6;}else if(v==='lock'){s.width=6;s.height=8.5;}else{s.width=5;s.height=6;}return;}
    const ratio=s.mode==='crop'?5/6:6/8.5;
    s[k]=s.mode==='stretch'?number(v,.5,20):number(v,k==='height'?.5/ratio:.5,k==='width'?20*ratio:20);
    if(s.mode!=='stretch'){if(k==='width')s.height=s.width/ratio;else s.width=s.height*ratio;}
  });
})();
