/* Visible sampling and compression calculations, without format-name shortcuts. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,table,coach,output,esc}=ui;
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const fmt=n=>Number(n).toLocaleString('zh-CN',{maximumFractionDigits:3});
  const number=(v,min,max)=>String(v).trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=min&&Number(v)<=max;
  function pcm(s){if(!number(s.rate,1,192000)||!number(s.duration,0.001,86400))return null;const bits=Number(s.depth),channels=Number(s.channels);if(![8,16,24,32].includes(bits)||![1,2].includes(channels))return null;if(!Number.isInteger(Number(s.rate)*Number(s.duration)))return null;return {bitrate:Number(s.rate)*bits*channels,bytes:Number(s.rate)*bits*channels*Number(s.duration)/8};}
  function samples(s){const rate=Number(s.sample),depth=Number(s.quant),frequency=Number(s.frequency),levels=2**depth;return Array.from({length:rate+1},(_,i)=>{const t=i/rate,raw=Math.sin(2*Math.PI*frequency*t),q=Math.round((raw+1)/2*(levels-1))/(levels-1)*2-1;return {t,raw,q};});}
  register(['y2024q32'],'采样取时间点，量化分幅度档，再计算PCM大小','拖动采样率和位深，看同一条波形如何被记录；另页计算真题中的音频数据量。',{
    mode:'wave',frequency:'3',sample:'16',quant:'3',rate:'44100',depth:'16',channels:'1',duration:'120'
  },s=>{
    let body='';if(s.mode==='wave'){
      const dots=samples(s),line=Array.from({length:401},(_,i)=>`${20+i*1.5},${100-70*Math.sin(2*Math.PI*Number(s.frequency)*i/400)}`).join(' '),quant=dots.map(p=>`${20+p.t*600},${100-p.q*70}`).join(' ');
      body=controls(field('frequency',`原波频率：${s.frequency} Hz`,s.frequency,'range','min="1" max="12" step="1"')+select('sample','每秒采样点数',s.sample,[8,16,32,64].map(n=>[n,n+' 次/秒']))+select('quant','每个样本的量化位数',s.quant,[2,3,4,8].map(n=>[n,n+' bit：'+2**n+' 档'])))+
      `<svg class="ext-wave" viewBox="0 0 640 200" role="img" aria-label="1秒波形：平滑曲线是原波，圆点是量化样本，连线仅辅助观察"><path d="M20 100H620 M20 30V170" fill="none" stroke="#b8a9c0"/><polyline points="${line}" fill="none" stroke="#92759e" stroke-width="2"/><polyline points="${quant}" fill="none" stroke="#c34b91" stroke-width="2" stroke-dasharray="4 3"/>${dots.map(p=>`<circle cx="${20+p.t*600}" cy="${100-p.q*70}" r="3.5" fill="#a63877"/>`).join('')}</svg><p>横轴：0—1秒；纵轴：归一化幅度 −1—1。紫线为原波，粉点为样本，虚线仅连接样本帮助观察。</p>`+
      output(`每秒采样 ${s.sample} 次；每个样本 ${s.quant} bit，共 ${2**Number(s.quant)} 个量化档。${Number(s.sample)<=2*Number(s.frequency)?'本次采样率未高于信号最高频率的2倍，可能发生混叠，不能保证重建。':'对本例单频且带限的信号，采样率高于2倍信号频率；真实采集仍需抗混叠滤波等条件。'}`)+
      table(['前6个样本时刻（秒）','采样幅度','量化后幅度'],dots.slice(0,6).map(p=>[p.t.toFixed(3),p.raw.toFixed(3),p.q.toFixed(3)]))+coach('为了看清差别，图中使用教学低频、少量样本和简化均匀量化；不是声卡真实ADC。增加采样率主要改变时间取点密度，增加位深主要细化幅度档位。末端t=1点用于画图，不重复计入“每秒采样点数”。');
    }else{
      const x=pcm(s);body=controls(field('rate','采样率（Hz）',s.rate,'number','min="1" max="192000"')+select('depth','每样本位数',s.depth,[8,16,24,32].map(n=>[n,n+' bit']))+select('channels','声道数',s.channels,[[1,'单声道：1'],[2,'双声道：2']])+field('duration','时长（秒）',s.duration,'number','min="0.001" max="86400"'))+
      (x?`<div class="ext-metrics"><div><b>PCM数据码率</b><span>${fmt(x.bitrate)} bit/s</span></div><div><b>音频数据量</b><span>${fmt(x.bytes)} B</span></div><div><b>二进制容量</b><span>${fmt(x.bytes/1048576)} MiB</span></div></div>`+table(['计算步骤','本次代入'],[['每秒数据量',`${s.rate} × ${s.depth} × ${s.channels} = ${fmt(x.bitrate)} bit/s`],['乘以时间',`${fmt(x.bitrate)} × ${s.duration} = ${fmt(x.bytes*8)} bit`],['位换为字节',`${fmt(x.bytes*8)} ÷ 8 = ${fmt(x.bytes)} B`]]):output('请输入规定范围内的采样率与时长，时长应对应整数个采样点。'))+coach('计算固定样本宽度、未压缩PCM的音频数据，不计文件头等封装开销。kHz先乘1000换Hz，分钟先乘60换秒；不要直接用于MP3码率或MIDI事件文件。');
    }
    return controls(select('mode','观察内容',s.mode,[['wave','看采样与量化'],['pcm','计算PCM音频大小']]))+body;
  },()=>{});

  function parsePixels(raw){const tokens=String(raw).trim().split(/[,，\s]+/);if(!tokens.length||tokens.length>24||tokens.some(v=>!/^\d+$/.test(v)||Number(v)>255))return null;return tokens.map(Number);}
  const runLength=a=>a.reduce((out,n)=>{if(out.length&&out.at(-1)[0]===n)out.at(-1)[1]++;else out.push([n,1]);return out;},[]);
  const swatches=a=>`<div class="ext-swatch-row">${a.map(n=>`<div><i style="background:rgb(${n},${n},${n})"></i><b>${n}</b></div>`).join('')}</div>`;
  register(['merged-14'],'先改数据，再压缩：无损保证的是哪一步','编辑一行灰度像素，比较直接无损编码与先减色再编码；解码后逐项核对。',{
    raw:'30,30,30,31,31,31,120,120,120,121,121,121',mode:'lossless',step:'32'
  },s=>{const original=parsePixels(s.raw),valid=original&&number(s.step,1,128),input=valid?(s.mode==='lossless'?original:original.map(v=>Math.min(255,Math.round(v/Number(s.step))*Number(s.step)))):null,runs=input?runLength(input):[],decoded=runs.flatMap(([value,count])=>Array(count).fill(value));
    return controls(field('raw','灰度值（1—24个整数，0—255，逗号分隔）',s.raw)+select('mode','进入无损编码前',s.mode,[['lossless','直接保留原始像素'],['reduce','先减少灰度档位']])+(s.mode==='reduce'?select('step','灰度间隔',s.step,[8,16,32,64,128].map(n=>[n,String(n)])):''))+
      (valid?`<section class="ext-dataset"><h4>原始像素</h4>${swatches(original)}</section><section class="ext-dataset"><h4>进入编码器的像素</h4>${swatches(input)}<p>游程表示（数值 × 连续次数）</p><code class="ext-code">${runs.map(([value,count])=>`${value} × ${count}`).join('；')}</code></section><section class="ext-dataset"><h4>解码后的像素</h4>${swatches(decoded)}</section>`+table(['比较对象','是否完全一致'],[['解码结果 vs 编码器输入','是，游程可逐项还原'],['解码结果 vs 最初像素',decoded.every((n,i)=>n===original[i])?'是':'否，编码前已丢失灰度差别']])+output(`原始序列 ${original.length} 个值；游程 ${runs.length} 组。若值与次数各占1 B，本例原始 ${original.length} B、游程 ${runs.length*2} B。${runs.length*2>original.length?'这次反而变大；无损压缩并不保证每份数据都变小。':''}`):output('请输入1—24个0—255整数，不能夹入文字。'))+
      coach('这是可逆的游程编码教学例子，不是PNG、GIF或JPEG的真实文件编码器。它展示：无损编码能保住输入的数据，却不能恢复此前减色丢掉的信息；游程表示也不等于图像文件实际字节数。');
  },()=>{});
  window.NOTE_LABS.mediaMath={pcm,samples,parsePixels,runLength};
})();
