/* Network models calculate from the learner's inputs; no network requests. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,table,coach,output,esc}=ui;
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const fmt=n=>Number(n).toLocaleString('zh-CN',{maximumFractionDigits:3});
  const finite=(v,min,max)=>String(v).trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max;
  function transfer(s){
    if(!finite(s.size,0.001,1000)||!finite(s.first,0.1,10000)||!finite(s.second,0.1,10000)||!finite(s.efficiency,1,100)||!finite(s.delay,0,10000))return null;
    const bits=Number(s.size)*1048576*8,capacity=Math.min(Number(s.first),Number(s.second)),goodput=capacity*Number(s.efficiency)/100;
    return {bits,capacity,goodput,seconds:bits/(goodput*1e6),wait:Number(s.delay)/1000};
  }
  register(['y2020q26'],'改链路、改文件：实际传输进度由谁决定','比较瓶颈容量、有效载荷速率与启动等待；开始后进度按计时推进。',{
    size:'2',first:'100',second:'20',efficiency:'80',delay:'300',running:false,elapsed:0,stamp:0
  },s=>{
    const x=transfer(s),disabled=s.running?'disabled':'',fraction=x?Math.min(1,Math.max(0,s.elapsed-x.wait)/x.seconds):0;
    return controls(field('size','文件大小（MiB）',s.size,'number',`min="0.001" max="1000" ${disabled}`)+field('first','链路 A 容量（Mbit/s）',s.first,'number',`min="0.1" max="10000" ${disabled}`)+field('second','链路 B 容量（Mbit/s）',s.second,'number',`min="0.1" max="10000" ${disabled}`)+field('efficiency','有效载荷比例（%）',s.efficiency,'number',`min="1" max="100" ${disabled}`)+field('delay','启动等待（ms）',s.delay,'number',`min="0" max="10000" ${disabled}`))+
      (x?`<div class="ext-route"><span>发送端</span><span>A · ${esc(s.first)} Mbit/s</span><span>B · ${esc(s.second)} Mbit/s</span><span>接收端</span></div><div class="ext-transfer"><div role="progressbar" aria-label="已接收文件比例" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(fraction*100)}"><i style="width:${fraction*100}%"></i></div><strong>${fmt(fraction*100)}%</strong><p>已接收 ${fmt(fraction*Number(s.size))} / ${esc(s.size)} MiB</p></div>`+table(['计算环节','本次结果'],[['容量上限',`min(${s.first}, ${s.second}) = ${fmt(x.capacity)} Mbit/s`],['有效载荷速率',`${fmt(x.capacity)} × ${s.efficiency}% = ${fmt(x.goodput)} Mbit/s`],['文件数据量',`${s.size} × 1,048,576 × 8 = ${fmt(x.bits)} bit`],['本例完成时间',`${fmt(x.wait)} + ${fmt(x.seconds)} = ${fmt(x.wait+x.seconds)} 秒`]]):output('请输入规定范围内的数值，文件和链路容量必须大于0。'))+
      controls(btn(s.running?'传输中…':'开始传输','start','',s.running||!x?'disabled':'')+btn('停止并重置','reset'))+output(!x?'参数尚不完整。':fraction===1?'文件已到达。提高非瓶颈链路容量不一定更快；启动等待不改变文件的字节数。':s.running?`已用 ${fmt(s.elapsed)} 秒 · ${s.elapsed<x.wait?'等待启动':'正在接收有效载荷'}`:'修改参数会清空上一轮结果。这里的进度使用实际时间。')+coach('简化模型假定速率稳定、不丢包、无其他流量；只计一次启动等待，不复刻TCP握手或完整端到端流水过程。Mbit/s按百万位计，MiB按2²⁰字节计；有效载荷速率（goodput）扣除了本例开销。');
  },(s,a)=>{if(a==='reset'){s.running=false;s.elapsed=0;}if(a==='start'&&transfer(s)&&!s.running){s.running=true;s.elapsed=0;s.stamp=Date.now();}},(s,k,v)=>{if(!s.running){s[k]=v;s.elapsed=0;}});
  registry.y2020q26.tick=s=>{if(!s.running)return false;const x=transfer(s);s.elapsed=Math.min((Date.now()-s.stamp)/1000,x.wait+x.seconds);if(s.elapsed>=x.wait+x.seconds)s.running=false;return true;};
  registry.y2020q26.tickInterval=100;

  function parseURL(s){try{const base=new URL(s.base);if(!['http:','https:'].includes(base.protocol))return null;const resolved=new URL(s.target,base);if(!['http:','https:'].includes(resolved.protocol))return null;return {base,resolved};}catch{return null;}}
  register(['y2026q14'],'把相对地址放回当前网页，计算真正目标','编辑基准网页与href；路径、查询和片段会分别显示。',{
    base:'https://notes.example/course/chapter1.html',target:'../media/audio.html?mode=pcm#sample'
  },s=>{const x=parseURL(s),u=x?.resolved;return controls(field('base','当前网页的绝对URL',s.base)+field('target','链接的href（相对或绝对地址）',s.target))+
    (u?`<div class="ext-address"><b>解析后的完整地址</b><code>${esc(u.href)}</code></div>`+table(['组成','解析结果'],[['协议',esc(u.protocol)],['主机名',esc(u.hostname)],['端口',u.port||'未单独保留；HTTP默认80，HTTPS默认443'],['路径',esc(u.pathname)],['查询',esc(u.search||'无')],['片段',esc(u.hash||'无')]])+table(['链接写法','基于当前网页的结果'],['summary.html','../summary.html','/summary.html','?view=compact','#part2'].map(v=>[esc(v),esc(new URL(v,x.base).href)])):output('请输入有效的HTTP或HTTPS基准地址，目标也须解析为HTTP或HTTPS地址。'))+
    coach('相对路径按当前文档所在目录解析；以 / 开头则从主机根目录解析。? 后是查询；# 后是片段，通常由浏览器在客户端处理，不作为HTTP请求目标的一部分。默认端口可能被URL标准化省略。');},
    ()=>{});

  function ipv6(raw){
    const text=String(raw).trim();if(!text||/[^0-9a-f:]/i.test(text)||text.split('::').length>2)return null;
    let groups;if(text.includes('::')){const [l,r]=text.split('::'),left=l?l.split(':'):[],right=r?r.split(':'):[];if(left.length+right.length>=8)return null;groups=[...left,...Array(8-left.length-right.length).fill('0'),...right];}else{groups=text.split(':');if(groups.length!==8)return null;}
    if(groups.some(v=>! /^[0-9a-f]{1,4}$/i.test(v)))return null;
    const values=groups.map(v=>parseInt(v,16)),short=values.map(v=>v.toString(16));let best=-1,length=0;
    for(let i=0;i<8;){if(values[i]!==0){i++;continue;}let j=i;while(j<8&&values[j]===0)j++;if(j-i>=2&&j-i>length){best=i;length=j-i;}i=j;}
    const canonical=best<0?short.join(':'):short.slice(0,best).join(':')+'::'+short.slice(best+length).join(':');
    return {values,full:values.map(v=>v.toString(16).padStart(4,'0')).join(':'),canonical};
  }
  register(['y2023q47'],'自己压缩IPv6，再展开核对128位','输入完整或缩写地址，观察被省略的零组；试试全零与两个同长零段。',{raw:'2001:0db8:0000:0000:0001:0000:0000:0001'},s=>{
    const x=ipv6(s.raw);return controls(field('raw','IPv6地址（纯十六进制写法）',s.raw)+btn('文档示例','sample','2001:db8::1')+btn('两个同长零段','sample','2001:0:0:1:0:0:1:1')+btn('全零地址','sample','::'))+(x?`<div class="ext-ipv6">${x.values.map((n,i)=>`<div><small>第${i+1}组 · 16 bit</small><code>${n.toString(16).padStart(4,'0')}</code><span>${n.toString(2).padStart(16,'0')}</span></div>`).join('')}</div>`+table(['表示','结果'],[['完整8组',`<code>${x.full}</code>`],['推荐缩写',`<code>${x.canonical}</code>`],['存储长度','8 × 16 = 128 bit = 16 B']]):output('地址应展开为8组，每组1—4个十六进制数字；::只能出现一次且必须省略至少一组。此卡不接收IPv4混合写法、前缀长度或区域标识。'))+coach('前导零可以省略；规范推荐压缩最长的连续全零段，同长取最左段，单个零组不压缩。缩短的是文字写法，不是128位地址长度。');},(s,a,v)=>{if(a==='sample')s.raw=v;});
  window.NOTE_LABS.networkMath={transfer,ipv6};
})();
