/* Print preview calculates a bounded teaching document; no real printer access. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,office,output,esc,number}=ui;
  const pages=raw=>{const chosen=[];for(const part of raw.split(/[,，]/)){const match=part.trim().match(/^(\d+)(?:-(\d+))?$/);if(!match)return null;const from=Number(match[1]),to=Number(match[2]||from);if(from<1||to>8||from>to)return null;for(let n=from;n<=to;n++)if(!chosen.includes(n))chosen.push(n);}return chosen;};
  register(['syllabus-word-print-controls'],'先设置打印范围，再核对每份需要几张纸','本例文档共8页；试试2,5-7、两份和双面打印，核对预览。',{
    range:'2-4',copies:2,duplex:false,markup:true,preview:null,message:'只生成卡片内的打印预览。'
  },s=>office('Word','文件 · 打印',field('range','页码范围',s.range,'text','maxlength="40"')+field('copies','份数',s.copies,'number','min="1" max="5"')+select('duplex','纸面',String(s.duplex),[['false','单面'],['true','双面（假定打印机支持）']])+select('markup','打印标记',String(s.markup),[['true','包含标记'],['false','不打印标记']])+btn('生成预览','preview'),
    s.preview?`<div class="lab-mini-deck">${s.preview.pages.map(n=>`<div><b>第${n}页</b><p>正文内容</p>${s.preview.markup?'<small>审阅标记</small>':''}</div>`).join('')}</div><p>每份${s.preview.pages.length}面、${s.preview.sheets}张纸；共${s.preview.copies}份，需要${s.preview.sheets*s.preview.copies}张纸。</p>`:'<p class="lab-empty">设置后生成预览</p>')+output(esc(s.message)),
    (s,a)=>{if(a!=='preview')return;const chosen=pages(s.range);if(!chosen?.length){s.preview=null;s.message='请输入1—8内的页码或升序范围，如2,5-7。';return;}s.preview={pages:chosen,copies:s.copies,markup:s.markup,sheets:Math.ceil(chosen.length/(s.duplex?2:1))};s.message='预览按当前设置生成。不打印标记只影响输出，并未接受或删除修订。';},
    (s,k,v)=>{s[k]=k==='copies'?Math.round(number(v,1,5)):['duplex','markup'].includes(k)?v==='true':v;s.preview=null;s.message='设置已改变，请重新生成预览。';});
})();
