(() => {
  'use strict';
  const {escape:esc, search, snippet}=window.NOTE_SEARCH;
  const data=window.NOTE_CATALOGUE, version=data.version;
  const $=selector=>document.querySelector(selector);
  $('#source-total').textContent=`${data.sourceCount}道真题来源`;
  $('#note-total').textContent=`${data.noteCount}条知识笔记`;
  $('#chapter-grid').innerHTML=data.chapters.map(c=>`<a class="home-chapter" href="./chapter${c.number}.html?v=${version}"><span class="home-number">${String(c.number).padStart(2,'0')}</span><span class="home-copy"><strong>${esc(c.title)}</strong><small>${esc(c.sections.map(s=>s.id+' '+s.title).join(' · '))}</small></span><span class="home-count">${c.noteCount}条 · ${c.sourceCount}题</span></a>`).join('');
  $('#comparison-grid').innerHTML=data.comparisons.map(topic=>`<details class="comparison-topic" id="compare-${topic.id}"><summary>${esc(topic.title)}<span>${topic.rows.length}项对照</span></summary><p>${esc(topic.intro)}</p><p class="table-hint">表格可左右滑动，点笔记名称回看原文。</p><div class="topic-table" tabindex="0" role="region" aria-label="${esc(topic.title)}，可横向滚动"><table><thead><tr>${topic.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}<th scope="col">回看笔记</th></tr></thead><tbody>${topic.rows.map(row=>`<tr>${row.cells.map((cell,i)=>`<${i?'td':'th scope="row"'}>${esc(cell)}</${i?'td':'th'}>`).join('')}<td>${row.notes.map(n=>`<a href="./chapter${n.chapter}.html?v=${version}#${n.id}">${esc(n.title)}</a>`).join('')}</td></tr>`).join('')}</tbody></table></div></details>`).join('');
  let entries, loading, results=[], limit=30, request=0;
  const loadIndex=()=>loading ||= fetch(data.searchIndex).then(r=>{if(!r.ok)throw Error('index');return r.json();}).then(value=>entries=value).catch(error=>{loading=null;throw error;});
  const renderResults=()=>{
    $('#global-results').innerHTML=results.slice(0,limit).map(result=>{
      const href=result.kind==='comparison'?`./index.html?v=${version}#compare-${result.id}`:`./chapter${result.chapter}.html?v=${version}#${result.field.anchor}`;
      return `<li><a class="search-result" href="${href}"><small>${result.kind==='comparison'?'易混知识对照':`第${result.chapter}章 · ${esc(result.chapterTitle)}`}</small><strong>${esc(result.title)}</strong><p>${esc(snippet(result.field.text,$('#global-search').value))}</p></a></li>`;
    }).join('');
    $('#search-more').hidden=results.length<=limit;
  };
  const apply=async()=>{
    const token=++request, query=$('#global-search').value.trim();limit=30;
    const url=new URL(location.href);query?url.searchParams.set('q',query):url.searchParams.delete('q');if(query)url.hash='';history.replaceState(null,'',url);
    $('#global-clear').hidden=!query;$('#global-search-results').hidden=!query;
    $('#browse-notes').hidden=!!query;$('#browse-comparisons').hidden=!!query;
    if(!query)return;
    $('#global-status').textContent='正在查找…';$('#global-results').replaceChildren();$('#search-more').hidden=true;$('#search-retry').hidden=true;
    try {
      await loadIndex();if(token!==request)return;
      results=search(entries,query);
      $('#global-status').textContent=results.length?`找到 ${results.length} 项，点击结果直达相关段落`:'没有找到相关内容。试试更短的词，或用空格组合关键词。';renderResults();
    } catch {if(token!==request)return;$('#global-status').textContent='搜索内容暂未载入，请重试；也可以清空搜索后按章节阅读。';$('#search-retry').hidden=false;}
  };
  $('#global-search').addEventListener('input',apply);
  $('#global-search').addEventListener('search',apply);
  $('#global-clear').addEventListener('click',()=>{$('#global-search').value='';apply();$('#global-search').focus();});
  $('#search-retry').addEventListener('click',apply);
  $('#search-more').addEventListener('click',()=>{limit+=30;renderResults();});
  function openTopic(){
    const id=location.hash.slice(1), topic=document.getElementById(id);
    if(!topic?.matches('.comparison-topic'))return;
    $('#global-search').value='';apply();topic.open=true;topic.scrollIntoView({block:'start'});
  }
  addEventListener('hashchange',openTopic);
  $('#global-search').value=new URLSearchParams(location.search).get('q')||'';
  apply();openTopic();
})();
