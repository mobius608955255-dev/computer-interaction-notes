/* Chapter 6: connectivity model; geographic scope and topology are independent. */
(() => {
 'use strict';
 const {register,ui}=window.NOTE_LABS;
 const {btn,select,table,output,coach,esc}=ui;
 const diagrams={
  star:{nodes:{A:[45,35],B:[315,35],S:[180,105],C:[45,180],D:[315,180]},edges:[['A','S'],['B','S'],['C','S'],['D','S']]},
  mesh:{nodes:{A:[65,40],B:[295,40],C:[65,175],D:[295,175]},edges:[['A','B'],['A','C'],['B','C'],['B','D'],['C','D']]}
 };
 const edgeKey=e=>e.join('-');
 function route(s,from,to){
  const g=diagrams[s.topology];if(!g?.nodes[from]||!g.nodes[to]||s.failedNodes.includes(from)||s.failedNodes.includes(to))return [];
  const queue=[[from]],seen=new Set([from]);
  while(queue.length){const p=queue.shift(),last=p[p.length-1];if(last===to)return p;
   for(const e of g.edges){if(s.cut.includes(edgeKey(e)))continue;const next=e[0]===last?e[1]:e[1]===last?e[0]:null;
    if(next&&!seen.has(next)&&!s.failedNodes.includes(next)){seen.add(next);queue.push([...p,next]);}}
  }return [];
 }
 register(['y2020q15'],'覆盖范围不变，断路影响会随拓扑改变','切断链路或关闭星型中心，比较A到B及B到D的真实可达路径。',{
  topology:'star',scope:'LAN',cut:[],failedNodes:[]
 },s=>{
  const g=diagrams[s.topology],paths=[['A','B'],['B','D']].map(([a,b])=>({a,b,path:route(s,a,b)}));
  const controls=`<div class="lab-controls">${select('scope','本例覆盖范围',s.scope,[['LAN','校园范围 · LAN'],['MAN','城市范围 · MAN'],['WAN','跨地区 · WAN']])}${select('topology','连接结构',s.topology,[['star','星型：中心S转发'],['mesh','网状：节点可中继']])}</div>`;
  const drawing=`<svg viewBox="0 0 360 215" role="img" aria-label="${s.topology==='star'?'星型':'网状'}链路状态" style="display:block;width:100%;max-width:520px;margin:auto">${g.edges.map(e=>{const [x,y]=g.nodes[e[0]],[u,v]=g.nodes[e[1]],bad=s.cut.includes(edgeKey(e))||e.some(n=>s.failedNodes.includes(n));return `<line x1="${x}" y1="${y}" x2="${u}" y2="${v}" stroke="${bad?'#a63434':'#28665c'}" stroke-width="4" ${bad?'stroke-dasharray="8 6"':''} data-link="${edgeKey(e)}" data-connected="${!bad}"/>`;}).join('')}${Object.entries(g.nodes).map(([n,[x,y]])=>`<g data-node="${n}"><circle cx="${x}" cy="${y}" r="22" fill="${s.failedNodes.includes(n)?'#fee2e2':'#e5f3ef'}" stroke="#28665c" stroke-width="2"/><text x="${x}" y="${y+6}" text-anchor="middle" font-size="18" fill="#183e36">${n}</text></g>`).join('')}</svg>`;
  return controls+drawing+`<div class="lab-controls">${g.edges.map(e=>{const k=edgeKey(e);return btn(`${s.cut.includes(k)?'接通':'切断'} ${k}`,'link',k,`aria-pressed="${s.cut.includes(k)}"`);}).join('')}${s.topology==='star'?btn(s.failedNodes.includes('S')?'恢复中心S':'关闭中心S','center'):''}</div>`+
   table(['通信任务','当前可达路径'],paths.map(r=>[`${r.a} → ${r.b}`,`<span data-route="${r.a}-${r.b}" data-reachable="${!!r.path.length}">${r.path.length?r.path.join(' → '):'不可达'}</span>`]))+
   output(`覆盖类型仍是${esc(s.scope)}。${s.topology==='star'?'单支线和中心故障的影响不同。':'有备用路径才可能绕行；继续切断链路也会隔离节点。'}`)+coach('仅计算无向连通路径；网状例子的各节点具备中继能力。未模拟交换协议、环路控制、容量、地址或真实网络设备。切换拓扑清除旧故障；右上重置恢复全部初始状态。','本演示的范围与限制');
 },(s,a,v)=>{if(a==='link'&&diagrams[s.topology].edges.some(e=>edgeKey(e)===v))s.cut=s.cut.includes(v)?s.cut.filter(x=>x!==v):[...s.cut,v];if(a==='center'&&s.topology==='star')s.failedNodes=s.failedNodes.includes('S')?[]:['S'];},(s,k,v)=>{if(k==='scope'&&['LAN','MAN','WAN'].includes(v))s.scope=v;if(k==='topology'&&diagrams[v]){s.topology=v;s.cut=[];s.failedNodes=[];}});
})();
