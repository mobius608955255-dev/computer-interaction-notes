/* One directory for chapter navigation and grouped knowledge points. */
(() => {
  'use strict';
  function init({chapter,chapters,notes,chapterUrl,revealNote}) {
    const drawer=document.getElementById('drawer'),trigger=document.getElementById('open-drawer');
    const scrim=document.getElementById('scrim'),esc=window.NOTE_SEARCH.escape;
    const background=[...document.querySelectorAll('.site-header,#main-content,.site-footer,.skip-link')];
    drawer.innerHTML=`
      <div class="drawer-head"><div><strong>目录</strong><small>${notes.length}条知识笔记</small></div><button id="close-drawer" type="button" aria-label="关闭目录">×</button></div>
      <details class="directory-chapters">
        <summary><span><small>当前章节</small><strong>第${chapter.number}章 · ${esc(chapter.title)}</strong></span><span class="directory-switch">切换<span aria-hidden="true">⌄</span></span></summary>
        <nav aria-label="全部章节"><ol>${chapters.map(item=>`<li><a href="${item.number===chapter.number?'#chapter-top':chapterUrl(item.number)}"${item.number===chapter.number?' aria-current="page"':''}><span>${String(item.number).padStart(2,'0')}</span><b>${esc(item.title)}</b>${item.number===chapter.number?'<small>当前</small>':''}</a></li>`).join('')}</ol></nav>
      </details>
      <nav aria-label="本章知识点" id="note-list">${chapter.sections.map(section=>{
        const items=notes.filter(note=>note.section===section.id);if(!items.length)return '';
        return `<section class="directory-section"><h2><span>${esc(section.id)}</span>${esc(section.title)}</h2><ol class="note-list">${items.map(note=>`<li><a href="#${note.id}">${esc(note.title)}</a>${window.NOTE_PRESENTATION.subtopics(note).length?`<div class="directory-subtopics">${window.NOTE_PRESENTATION.subtopics(note).map(link=>`<a href="#${link.anchor}">${esc(link.label)}</a>`).join('')}</div>`:''}</li>`).join('')}</ol></section>`;
      }).join('')}</nav>`;
    const closeButton=document.getElementById('close-drawer'),chapterMenu=drawer.querySelector('.directory-chapters');
    let previousOverflow='';
    function markCurrent(){
      const noteId=location.hash.slice(1).split('--')[0];
      drawer.querySelectorAll('.note-list a').forEach(link=>{
        if(link.hash===location.hash||link.hash==='#'+noteId)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
      });
    }
    function open(){
      if(!drawer.hidden)return;
      previousOverflow=document.body.style.overflow;
      drawer.hidden=false;drawer.inert=false;drawer.setAttribute('aria-hidden','false');drawer.classList.add('open');
      scrim.classList.add('open');trigger.setAttribute('aria-expanded','true');background.forEach(el=>el.inert=true);
      document.body.style.overflow='hidden';markCurrent();closeButton.focus();
    }
    function close(restoreFocus=true){
      if(drawer.hidden)return;
      drawer.classList.remove('open');drawer.hidden=true;drawer.inert=true;drawer.setAttribute('aria-hidden','true');
      scrim.classList.remove('open');trigger.setAttribute('aria-expanded','false');background.forEach(el=>el.inert=false);
      document.body.style.overflow=previousOverflow;if(restoreFocus)trigger.focus();
    }
    trigger.addEventListener('click',open);closeButton.addEventListener('click',()=>close());scrim.addEventListener('click',()=>close());
    drawer.addEventListener('click',event=>{
      const link=event.target.closest('a[href^="#"]');
      if(!link||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      event.preventDefault();close(false);
      if(location.hash!==link.hash)history.pushState(null,'',link.hash);
      revealNote(link.hash,true);markCurrent();
    });
    drawer.addEventListener('keydown',event=>{
      if(event.key!=='Tab')return;
      const items=[...drawer.querySelectorAll('button,summary,a')].filter(el=>chapterMenu.open||!chapterMenu.contains(el)||el===chapterMenu.firstElementChild);
      const first=items[0],last=items.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    });
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&!event.defaultPrevented)close();
      if(event.key==='/'&&!event.isComposing&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.target.closest('input,textarea,select,[contenteditable]')&&drawer.hidden){
        event.preventDefault();document.getElementById('search-input').focus();
      }
    });
    addEventListener('hashchange',markCurrent);
    markCurrent();
  }
  window.NOTE_DIRECTORY={init};
})();
