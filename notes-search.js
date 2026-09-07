/* Search canonical text only; simulation state never changes the index. */
(() => {
  'use strict';
  const normalize = value => String(value).normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const indexes = new WeakMap();
  // Each caller supplies an immutable content array; normalize it once per page.
  const prepare = entries => {
    if(!indexes.has(entries)) indexes.set(entries,entries.map(entry=>({
      entry,title:normalize(entry.title),
      text:normalize([entry.title,...(entry.aliases||[]),...entry.fields.map(f=>f.text)].join(' ')),
      fields:entry.fields.map((field,order)=>({field,order,text:normalize(field.text)}))
    })));
    return indexes.get(entries);
  };
  const search = (entries, query) => {
    const terms=[...new Set(normalize(query).split(' ').filter(Boolean))];
    if(!terms.length)return [];
    return prepare(entries).flatMap(({entry,title,text,fields})=>{
      if(!terms.every(term=>text.includes(term)))return [];
      const ranked=fields.map(({field,order,text})=>({...field,order,score:terms.filter(term=>text.includes(term)).length})).sort((a,b)=>b.score-a.score||a.order-b.order);
      const field=ranked[0];if(!field)return [];
      const score=terms.reduce((n,term)=>n+(title.includes(term)?5:0),0)+field.score;
      return [{...entry,field,matches:ranked.filter(f=>f.score>0),score}];
    }).sort((a,b)=>b.score-a.score||(a.chapter||99)-(b.chapter||99));
  };
  const snippet = (text, query, length = 150) => {
    const terms = normalize(query).split(' ').filter(Boolean), normalized = normalize(text);
    const first = terms.map(t => normalized.indexOf(t)).filter(i => i >= 0).sort((a,b) => a-b)[0] || 0;
    const start = Math.max(0, first-35);
    return (start ? '…' : '') + text.slice(start, start+length) + (text.length > start+length ? '…' : '');
  };
  window.NOTE_SEARCH = {normalize, escape, search, snippet};
})();
