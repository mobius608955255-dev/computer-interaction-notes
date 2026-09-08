/* Print preview calculates a bounded teaching document; no real printer access. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,office,output,esc,number,coach}=ui;
  const pages=raw=>{const chosen=[];for(const part of raw.split(/[,，]/)){const match=part.trim().match(/^(\d+)(?:-(\d+))?$/);if(!match)return null;const from=Number(match[1]),to=Number(match[2]||from);if(from<1||to>8||from>to)return null;for(let n=from;n<=to;n++)if(!chosen.includes(n))chosen.push(n);}return chosen;};
  register(['syllabus-word-print-controls'],'选择当前页、选区或页码，再检查打印顺序','比较打印对象和纸张用量；生成卡片内预览后，改变设置会清除旧预览。',{
    scope:'custom',range:'2-4',copies:2,duplex:false,markup:true,collate:true,current:4,selection:false,preview:null,message:'教学文档共8页，页码连续；每面打印一页。'
  },s=>office('Word','文件 · 打印',
    select('scope','打印范围',s.scope,[['all','打印所有页'],['current','打印当前页'],['selection','打印所选内容'],['custom','自定义打印范围']])+field('range','页码范围',s.range,'text',`maxlength="40" ${s.scope==='custom'?'':'disabled'}`)+field('copies','份数',s.copies,'number','min="1" max="5"')+select('duplex','纸面',String(s.duplex),[['false','单面'],['true','双面（假定打印机支持）']])+select('collate','多份顺序',String(s.collate),[['true','逐份打印'],['false','不逐份打印']])+select('markup','打印标记',String(s.markup),[['true','包含标记'],['false','不打印标记']])+btn('生成预览','preview'),
    `<div class="lab-controls">${btn('预览上一页','previous','',s.current===1?'disabled':'')}<b>当前预览第${s.current}页</b>${btn('预览下一页','next','',s.current===8?'disabled':'')}${btn(s.selection?'清除正文选区':'模拟返回正文：选中第3页第二段','selectText')}</div><p>选区示例：第3页的${s.selection?'<mark>第二段项目说明</mark>':'第二段项目说明'}；选择的是这段文字，不是整页。</p>`+
    (s.preview?`<div class="lab-mini-deck">${s.preview.pages.map(n=>`<div><b>${s.preview.selection?'所选内容':`第${n}页`}</b><p>${s.preview.selection?'第二段项目说明':'正文内容'}</p>${s.preview.markup?'<small>审阅标记</small>':''}</div>`).join('')}</div><p>每份${s.preview.pages.length}面、${s.preview.sheets}张纸；共${s.preview.copies}份，需要${s.preview.sheets*s.preview.copies}张纸。</p><p data-print-order>输出顺序：${s.preview.order.map(n=>s.preview.selection?'选区':n).join(' → ')}。${s.preview.duplex?'本例双面按每份另起一张纸核算；顺序只列有内容的页，未列空白背面。':''}</p>`:'<p class="lab-empty">设置后生成预览</p>'))+output(esc(s.message))+coach('这里只模拟连续1—8页、一个短选区、每面一页和最多5份；同一页码重复输入时本模型去重。未模拟分节页码、每版多页、驱动或实际纸张输出。当前页按所示预览页演示；真实打印仍要核对预览及打印机设置。'),
    (s,a)=>{
      if(a==='previous'||a==='next'){s.current=number(s.current+(a==='next'?1:-1),1,8);s.preview=null;s.message='当前预览页已改变；选择“打印当前页”后生成预览，观察输出对象。';return;}
      if(a==='selectText'){s.selection=!s.selection;s.preview=null;s.message=s.selection?'已准备第3页的一个段落选区。':'正文选区已清除。';return;}
      if(a!=='preview')return;
      const chosen=s.scope==='all'?[1,2,3,4,5,6,7,8]:s.scope==='current'?[s.current]:s.scope==='selection'?(s.selection?[3]:null):pages(s.range);
      if(!chosen?.length){s.preview=null;s.message=s.scope==='selection'?'没有正文选区，请先选择示例段落。':'请输入1—8内的页码或升序范围，如2,5-7。';return;}
      if(s.duplex&&!s.collate&&s.copies>1){s.preview=null;s.message='本模型未覆盖双面且不逐份的驱动排纸方式；请改为逐份或单面后比较，不据此判定真实Word不能这样打印。';return;}
      const order=s.collate?Array.from({length:s.copies},()=>chosen).flat():chosen.flatMap(n=>Array(s.copies).fill(n));
      s.preview={pages:chosen,copies:s.copies,markup:s.markup,selection:s.scope==='selection',duplex:s.duplex,order,sheets:Math.ceil(chosen.length/(s.duplex?2:1))};
      s.message='预览按当前设置生成。不打印标记只影响输出，并未接受或删除修订。';
    },
    (s,k,v)=>{s[k]=k==='copies'?Math.round(number(v,1,5)):['duplex','markup','collate'].includes(k)?v==='true':v;s.preview=null;s.message='设置已改变，请重新生成预览。';});
})();
