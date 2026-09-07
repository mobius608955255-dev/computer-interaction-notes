/* Display metadata slices canonical prose; it never rewrites or summarizes it. */
((root, factory) => {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NOTE_PRESENTATION = api;
})(typeof window === 'undefined' ? globalThis : window, () => {
  'use strict';
  function split(text, blocks) {
    if (!blocks?.length) return [{text}];
    let previous = -1;
    const starts = blocks.map((block, i) => {
      const start = i === 0 && !block.from ? 0 : text.indexOf(block.from, previous + 1);
      if (start < 0 || (i === 0 && start !== 0) || start <= previous) throw Error('Invalid prose slice: ' + block.from);
      previous = start;
      return start;
    });
    return blocks.map((block, i) => ({...block, text: text.slice(starts[i], starts[i + 1] ?? text.length)}));
  }
  const pointMeta = (note, i) => note.pointPresentation?.[i] || {};
  const fieldMeta = (note, field) => field.startsWith('point-') ? pointMeta(note, Number(field.slice(6))) : note.fieldPresentation?.[field] || {};
  const fieldText = (note, field) => field.startsWith('point-') ? note.points[Number(field.slice(6))] : note[field];
  const parts = (note, field) => split(fieldText(note, field), fieldMeta(note, field).blocks);
  const subtopics = note => Object.entries(note.pointPresentation || {}).filter(([,p]) => p.navigationLabel).map(([i,p]) => ({anchor: `${note.id}--point-${i}`, label: p.navigationLabel}));
  function validate(note) {
    for (const [i, meta] of Object.entries(note.pointPresentation || {})) {
      if (!/^(0|[1-9]\d*)$/.test(i) || !note.points[Number(i)] || !meta.title?.trim()) throw Error('Invalid point presentation: ' + note.id);
    }
    for (const field of [...Object.keys(note.pointPresentation || {}).map(i => 'point-' + i), ...Object.keys(note.fieldPresentation || {})]) {
      if (!field.startsWith('point-') && !['boundary','trigger'].includes(field)) throw Error('Invalid display field: ' + field);
      const text = fieldText(note, field);
      if (typeof text !== 'string') throw Error('Missing display source: ' + note.id + '/' + field);
      for (const part of parts(note, field)) {
        if (part.steps) split(part.text, part.steps.map(from => ({from})));
        if (part.role && part.role !== 'demo') throw Error('Invalid display role');
      }
    }
  }
  return {split, pointMeta, fieldMeta, fieldText, parts, subtopics, validate};
});
