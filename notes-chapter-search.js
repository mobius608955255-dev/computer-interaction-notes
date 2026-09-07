/* Chapter filtering, temporary disclosure and URL restoration share the site search rules. */
(() => {
  'use strict';
  function init({notes,simulation,homeUrl,onLayout}) {
    const input=document.getElementById('search-input'),articles=[...document.querySelectorAll('.note-item')];
    const sections=[...document.querySelectorAll('.section-block')],autoOpened=new Set();
    const entries=notes.map(note=>{
      const article=document.getElementById(note.id),demo=simulation.demos[note.id];
      return {id:note.id,title:note.title,chapter:note.chapter,
        aliases:[...(note.searchAliases||[]),...(note.pointGroups||[]).map(g=>g.title),demo?.title||'',demo?.task||''],
        fields:[...article.querySelectorAll('.conclusion,.points li,.boundary,.note-comparison,.note-worked,.note-provenance')].map(el=>({anchor:el.id||el.parentElement.id,text:el.textContent}))};
    });
    function restoreDisclosures(){
      for(const detail of autoOpened)detail.open=false;
      autoOpened.clear();
    }
    function apply(syncURL=true){
      restoreDisclosures();
      document.querySelectorAll('.note-search-match').forEach(el=>el.classList.remove('note-search-match'));
      const query=input.value.trim(),results=window.NOTE_SEARCH.search(entries,query),matches=new Map(results.map(r=>[r.id,r]));
      for(const article of articles){
        article.classList.toggle('hidden',!!query&&!matches.has(article.id));
        for(const field of matches.get(article.id)?.matches||[]){
          const target=document.getElementById(field.anchor);if(!target)continue;
          target.classList.add('note-search-match');
          const detail=target.matches('details')?target:target.closest('details');
          if(detail&&!detail.open){detail.open=true;autoOpened.add(detail);}
        }
      }
      sections.forEach(section=>section.classList.toggle('hidden',!section.querySelector('.note-item:not(.hidden)')));
      const shown=query?results.length:notes.length;
      document.getElementById('result-count').textContent=query?`${shown} / ${notes.length}条`:`${shown}条笔记`;
      document.getElementById('clear-search').hidden=!input.value;
      document.getElementById('search-empty').hidden=shown!==0;
      document.getElementById('search-all').href=homeUrl+(query?'&q='+encodeURIComponent(query):'');
      if(syncURL){
        const url=new URL(location.href),previous=url.searchParams.get('q')||'';
        query?url.searchParams.set('q',query):url.searchParams.delete('q');
        if(query&&query!==previous)url.hash='';
        history.replaceState(history.state,'',url);
      }
      requestAnimationFrame(onLayout);
    }
    function clear(focus=true){input.value='';apply();if(focus)input.focus();}
    input.addEventListener('input',event=>{if(!event.isComposing)apply();});
    input.addEventListener('compositionend',()=>apply());
    input.addEventListener('search',()=>apply());
    document.getElementById('clear-search').addEventListener('click',()=>clear());
    document.getElementById('restore-notes').addEventListener('click',()=>clear());
    // A learner's explicit disclosure choice takes over from automatic search expansion.
    document.getElementById('notes-root').addEventListener('click',event=>{
      const summary=event.target.closest('summary');if(summary)autoOpened.delete(summary.parentElement);
    });
    const restore=()=>{input.value=new URLSearchParams(location.search).get('q')||'';apply(false);};
    addEventListener('popstate',restore);
    restore();
    return {clear,claim:target=>{
      for(let el=target;el;el=el.parentElement)if(el.matches?.('details'))autoOpened.delete(el);
    }};
  }
  window.NOTE_CHAPTER_SEARCH={init};
})();
