/* Move the existing operation surface into a dialog; preserve its nodes and lab state. */
(() => {
  'use strict';
  let active=null;
  const open=(card,opener)=>{
    if(active)return;
    const body=card.querySelector('.simulation-body');
    if(!body||body.hidden)return;
    const placeholder=document.createComment('operation surface');
    body.before(placeholder);
    const dialog=document.createElement('dialog');dialog.className='notes-demo-dialog';
    const heading=document.createElement('header'),title=document.createElement('strong'),close=document.createElement('button');
    title.id='expanded-demo-title';title.textContent=card.querySelector('.simulation-heading b').textContent;
    dialog.setAttribute('aria-labelledby',title.id);
    close.type='button';close.textContent='返回笔记';close.dataset.demoClose='';
    heading.append(title,close);dialog.append(heading,body);card.append(dialog);
    const cleanup=()=>{placeholder.replaceWith(body);dialog.remove();active=null;opener.hidden=false;opener.focus({preventScroll:true});};
    dialog.addEventListener('close',cleanup,{once:true});
    close.addEventListener('click',()=>dialog.close());
    opener.hidden=true;active={dialog,card};dialog.showModal();close.focus();
  };
  document.addEventListener('click',event=>{const opener=event.target.closest('[data-sim-expand]');if(opener)open(opener.closest('[data-sim-id]'),opener);});
  window.NOTE_DEMO_VIEW={close:()=>active?.dialog.close()};
})();
