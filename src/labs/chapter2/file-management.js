/* Bounded Windows 10 file-management exercises. No host filesystem access. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,table,output,coach,esc}=ui;
  const controls=html=>`<div class="lab-controls">${html}</div>`;
  const shell=(title,body)=>`<div class="lab-explorer lab-file-management"><header>${title}</header>${body}</div>`;
  const validName=name=>!!name.trim()&&name.length<=255&&!/[\\/:*?"<>|\u0000-\u001f]/.test(name)&&!/[ .]$/.test(name)&&!/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(name);
  const nameTaken=(files,name,except)=>files.some(f=>f.id!==except&&f.name.toLowerCase()===name.toLowerCase());

  const folders={
    'C:\\':{parent:null,children:['C:\\课程']},
    'C:\\课程':{parent:'C:\\',children:['C:\\课程\\Windows'],files:['笔记.txt']},
    'C:\\课程\\Windows':{parent:'C:\\课程',children:[],files:['笔记.txt','复习.txt']},
    'D:\\资料':{parent:'D:\\',children:[],files:['笔记.txt']},
    'D:\\':{parent:null,children:['D:\\资料']}
  };
  register(['syllabus-windows-paths'],'上一级与后退，去的是同一个位置吗','先从 D 盘跳到 C 盘的课程文件夹，再分别比较上一级与后退。',{
    path:'D:\\资料',history:[],address:'D:\\资料',message:'当前在 D:\\资料；同名文件可以位于不同目录。'
  },s=>shell('目录导航 · 有限样本',
    controls(field('address','地址栏（示例路径）',s.address)+btn('进入路径','address'))+
    controls(btn('上一级','up','',folders[s.path].parent?'':'disabled')+btn('后退','back','',s.history.length?'':'disabled')+btn('跳到 C:\\课程','go','C:\\课程'))+
    `<p class="lab-path" data-current-path>${esc(s.path)}</p><div class="lab-file-list">${folders[s.path].children.map(p=>btn('进入文件夹：'+esc(p.split('\\').pop()),'go',p)).join('')}${(folders[s.path].files||[]).map(f=>`<p>${esc(f)}<small>完整路径：${esc(s.path+'\\'+f)}</small></p>`).join('')}</div>`)+output(esc(s.message))+coach('“进入文件夹”按钮是学习用导航入口；本卡不模拟所有系统对象、盘符和真实磁盘。地址输入仅接受本卡列出的示例路径。'),
    (s,a,v)=>{
      let target=a==='go'?v:a==='up'?folders[s.path].parent:a==='address'?s.address:null;
      if(a==='back'&&s.history.length){s.path=s.history.pop();s.address=s.path;s.message='后退回到刚访问过的 '+s.path;return;}
      if(target&&!folders[target]){s.message='此路径不在教学样本中；当前目录未改变。';return;}
      if(target&&target!==s.path){s.history.push(s.path);s.path=target;s.address=target;s.message=(a==='up'?'按目录层级进入上一级：':'已进入：')+target;}
    });

  const selectionId='syllabus-windows-selection';
  const chosen=s=>s.files.filter(f=>s.selected.includes(f.id));
  register([selectionId],'连续、不连续与混合选择','点击项目选择；同时按住或点亮 Ctrl、Shift，再观察选区。新建和单项改名会更新同一份文件列表。',{
    files:[{id:1,name:'01 笔记.txt',folder:false},{id:2,name:'02 练习.txt',folder:false},{id:3,name:'03 答案.txt',folder:false},{id:4,name:'04 图片',folder:true},{id:5,name:'05 作业.docx',folder:false}],
    nextId:6,selected:[],anchor:null,ctrl:false,shift:false,name:'复习资料',message:'尚未选中项目。'
  },s=>shell('C:\\课程 · 选择和命名',
    controls(`<div role="group" aria-label="选择组合键（触屏辅助）">${['ctrl','shift'].map(k=>btn(k==='ctrl'?'Ctrl':'Shift','modifier',k,`aria-pressed="${s[k]}"`)).join('')}</div>`+btn('全选','all')+btn('反向选择','invert')+btn('取消选择','clear'))+
    `<div class="lab-file-list lab-selection-list" role="group" aria-label="可选择项目">${s.files.map(f=>btn(`${f.folder?'📁':'▤'} ${esc(f.name)}`,'choose',f.id,`aria-pressed="${s.selected.includes(f.id)}"`)).join('')}</div><p data-selection-summary>已选 ${s.selected.length} 项：${esc(chosen(s).map(f=>f.name).join('、')||'无')}</p>`+
    controls(field('name','新名称（单项改名时含扩展名）',s.name,'text','maxlength="255"')+btn('新建文件夹','new')+btn('给选中项目改名','rename','',s.selected.length===1?'':'disabled')))+output(esc(s.message))+coach('普通点击替换选区，Ctrl 增减单项，Shift 从锚点选到当前项，Ctrl+Shift 把新范围加入原选区。电脑可使用实际 Ctrl/Shift 单击；Ctrl+A 全选，F2 把选中名称送入输入框。此练习不实现框选、批量编号或长按多选。'),
    (s,a,v)=>{
      if(a==='modifier'&&['ctrl','shift'].includes(v)){s[v]=!s[v];return;}
      if(a==='choose'){
        const id=Number(v),keys=s.pointerKeys||{};delete s.pointerKeys;
        if(!s.files.some(f=>f.id===id))return;
        const ctrl=s.ctrl||keys.ctrl,shift=s.shift||keys.shift;
        if(shift&&s.anchor!==null){
          const first=s.files.findIndex(f=>f.id===s.anchor),last=s.files.findIndex(f=>f.id===id);
          const range=s.files.slice(Math.min(first,last),Math.max(first,last)+1).map(f=>f.id);
          s.selected=ctrl?[...new Set([...s.selected,...range])]:range;
        }else{s.selected=ctrl?(s.selected.includes(id)?s.selected.filter(x=>x!==id):[...s.selected,id]):[id];s.anchor=id;}
        s.message='选区已改变；文件的位置和内容没有变化。';return;
      }
      if(a==='all')s.selected=s.files.map(f=>f.id);
      if(a==='invert')s.selected=s.files.filter(f=>!s.selected.includes(f.id)).map(f=>f.id);
      if(a==='clear'){s.selected=[];s.anchor=null;}
      if(['all','invert','clear'].includes(a)){s.message='已更新选择，共 '+s.selected.length+' 项。';return;}
      if(a==='rename'||a==='new'){
        const target=chosen(s)[0];if(a==='rename'&&s.selected.length!==1)return;
        if(!validName(s.name)){s.message='名称无效：检查空名称、禁用字符、保留名、末尾空格/句点与长度。';return;}
        if(nameTaken(s.files,s.name,a==='rename'?target.id:null)){s.message='当前目录已有同名项目；原列表未改变。';return;}
        if(a==='new'){const id=s.nextId++;s.files.push({id,name:s.name,folder:true});s.selected=[id];s.anchor=id;s.message='已在 C:\\课程 新建文件夹，未创建文档。';}
        else{target.name=s.name;s.message='已改变选中项目的名称；其类型和内容未转换。';}
      }
    });
  registry[selectionId].afterRender=(s,root)=>{
    root.querySelectorAll('[data-lab-act="choose"]').forEach(b=>b.addEventListener('click',e=>{s.pointerKeys={ctrl:e.ctrlKey||e.metaKey,shift:e.shiftKey};},{capture:true}));
    if(s.focusName){delete s.focusName;const input=root.querySelector('[data-field="name"]');input.focus({preventScroll:true});input.select();}
  };
  registry[selectionId].keydown=(s,e)=>{
    if(e.target.matches('input,textarea,select'))return false;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='a'){e.preventDefault();registry[selectionId].action(s,'all');return true;}
    if(e.key==='F2'&&s.selected.length===1){e.preventDefault();s.name=chosen(s)[0].name;s.focusName=true;return true;}
    return false;
  };

  const samples=[
    {name:'笔记.txt',path:'C:\\课程'},{name:'笔记1.txt',path:'C:\\课程'},{name:'笔记12.txt',path:'C:\\课程'},
    {name:'期末复习.txt',path:'C:\\课程\\Windows'},{name:'笔记2.docx',path:'C:\\课程\\Windows'},
    {name:'笔记3.txt',path:'D:\\资料'}
  ];
  const matches=s=>{const re=new RegExp('^'+s.pattern.replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*').replace(/\?/g,'.')+'$','iu');return samples.filter(f=>(s.scope==='all'||f.path==='C:\\课程'||s.scope==='tree'&&f.path.startsWith('C:\\课程\\'))&&re.test(f.name));};
  register(['syllabus-windows-search'],'同一个模式，搜索范围会改变结果','修改文件名模式与目录范围，再核对命中项的完整位置。',{
    pattern:'笔记?.txt',scope:'current'
  },s=>shell('文件名模式练习 · 6 个固定样本',
    controls(field('pattern','文件名模式',s.pattern,'text','maxlength="120"')+select('scope','搜索范围',s.scope,[['current','C:\\课程 · 仅当前文件夹'],['tree','C:\\课程 · 含子文件夹'],['all','全部教学位置（含 D 盘）']]))+
    table(['命中文件','所在位置'],matches(s).map(f=>[esc(f.name),esc(f.path)]))+
    `<details><summary>查看全部 6 个样本</summary>${table(['文件','所在位置'],samples.map(f=>[esc(f.name),esc(f.path)]))}</details>`)+output(`匹配 ${matches(s).length} 项。* 可匹配零个或多个字符，? 匹配一个字符。`)+coach('只进行整段文件名模式匹配，不模拟 Windows 索引、正文检索或完整 AQS。输入笔记*.txt与笔记?.txt比较，再切换范围；这些结果不能用来声称已实测原生 Windows 搜索。'),()=>{});

  register(['merged-4'],'名称显示、默认应用和属性分别改变什么','连续切换设置，再尝试在示例文件夹中新建项目；同一张卡片保留实际状态。',{
    extension:true,app:'Word',readonly:false,hidden:false,showHidden:false,writable:true,children:[],message:'report.docx 的真实内容是 Word 文档。'
  },s=>shell('属性与显示 · 局部教学模型',
    controls(btn(s.extension?'隐藏扩展名':'显示扩展名','extension')+btn(s.showHidden?'不显示隐藏项':'显示隐藏项','showHidden'))+
    (s.hidden&&!s.showHidden?'<p data-property-file>文件列表不显示隐藏的 report.docx。</p>':`<p data-property-file class="${s.hidden?'lab-hidden-file':''}"><b>${s.extension?'report.docx':'report'}</b><br>真实类型：Word 文档；默认应用：${esc(s.app)}；文件属性：${s.readonly?'只读':'可写'}${s.hidden?'、隐藏':''}</p>`)+
    controls(select('app','默认打开应用（已安装的教学选项）',s.app,[['Word','Word'],['WordPad','写字板']])+btn(s.readonly?'取消文件只读':'给文件设只读','readonly')+btn(s.hidden?'取消文件隐藏':'给文件设隐藏','hidden')+btn('尝试保存文件修改','save'))+
    `<section><h4>课程资料 · 文件夹</h4><p>只读标记 ◼；写入权限：${s.writable?'允许':'拒绝（示例条件）'}</p>${controls(btn(s.writable?'教学条件：拒绝写入':'教学条件：允许写入','permission')+btn('在文件夹中新建','new'))}${s.children.map(x=>`<p>📁 ${esc(x)}</p>`).join('')}</section>`)+output(esc(s.message))+coach('这是属性区别的有限模型。只读操作作用于 report.docx；隐藏项显示与隐藏属性分别保存。默认应用只改关联；本卡不模拟安全权限编辑器、格式兼容性或所有删除接口。'),
    (s,a)=>{
      if(['extension','showHidden','readonly','hidden'].includes(a)){s[a]=!s[a];s.message=a==='extension'?'只改变名称显示，真实扩展名和内容保留。':a==='showHidden'?'只改变隐藏项是否显示，文件隐藏属性保留。':'已改变文件属性，目录写入权限未改变。';}
      if(a==='permission'){s.writable=!s.writable;s.message='只改变教学文件夹的写入权限条件；文件只读属性未改变。';}
      if(a==='save')s.message=s.readonly?'示例应用拒绝覆盖只读文件；请先处理属性或另存为。':'示例应用完成保存；文件格式仍为 Word 文档。';
      if(a==='new'){if(!s.writable){s.message='拒绝访问：没有文件夹写入权限，未新建。';return;}s.children.push('新建文件夹'+(s.children.length?' ('+s.children.length+')':''));s.message='已在文件夹中新建；只读方块并不等于禁止创建子项。';}
    },(s,k,v)=>{if(k==='app'&&['Word','WordPad'].includes(v)){s.app=v;s.message='默认打开程序已改变，report.docx 的内容和格式未转换。';}});
})();
