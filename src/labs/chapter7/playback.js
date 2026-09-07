/* Media samples share a clock: changing sample frequency never changes motion speed. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,table,output,number,esc}=ui;
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const sample=s=>Math.min(2,Math.floor(s.time*s.fps)/s.fps);
  register(['y2020q38'],'保持运动时长，比较帧率与分辨率','拖动时间轴或播放；每次运动都用2秒完成，帧率只改变采样密度。',{
    fps:24,resolution:'320',time:0,playing:false
  },s=>{
    const width=Number(s.resolution),height=width*3/4,frames=2*s.fps,bytes=width*height*3*frames;
    return controls(select('fps','帧率',s.fps,[[8,'8 fps'],[24,'24 fps'],[60,'60 fps']])+select('resolution','每帧分辨率',s.resolution,[['320','320 × 240'],['640','640 × 480']]))+
      `<div class="lab-sample-track" aria-label="固定2秒运动轨迹"><span style="left:calc(${sample(s)/2*100}% - ${sample(s)/2*30}px)"></span></div>`+
      controls(field('time','时间轴（秒）',s.time,'range','min="0" max="2" step="0.01"')+btn(s.playing?'暂停':'播放','play')+btn('回到起点','start'))+
      table(['参数','本例数值'],[['当前时间 / 采样时刻',`${s.time.toFixed(2)} / ${sample(s).toFixed(3)} 秒`],['帧率 / 总帧数',`${s.fps} fps / ${frames} 帧`],['RGB 24位未压缩视频',`${width} × ${height} × 3 B × ${frames} = ${bytes.toLocaleString('zh-CN')} B`]])+
      output('提高帧率使相同轨迹的相邻画面更密；分辨率长宽各翻倍，每帧像素数变为4倍。这里不计音频、文件头和压缩，屏幕轨迹用于表示采样位置。');
  },(s,a)=>{if(a==='play'){if(s.time>=2)s.time=0;s.playing=!s.playing;if(s.playing)s.startedAt=performance.now()-s.time*1000;}if(a==='start'){s.time=0;s.playing=false;}},(s,k,v)=>{if(k==='time'){s.time=number(v,0,2);s.playing=false;}else s[k]=k==='fps'?Number(v):v;});
  registry.y2020q38.tickInterval=16;
  registry.y2020q38.tick=s=>{if(!s.playing)return false;s.time=Math.min(2,(performance.now()-s.startedAt)/1000);if(s.time===2)s.playing=false;return true;};
  registry.y2020q38.frameKey=s=>`${s.playing}:${s.fps}:${s.resolution}`;
  registry.y2020q38.patchFrame=(s,root)=>{const patched=ui.patchRegions(root,registry.y2020q38.render(s),['.lab-sample-track','.lab-table-scroll']);const slider=root.querySelector('[data-field="time"]');slider.value=slider.defaultValue=String(s.time);return patched;};

  register(['y2023q18'],'拖动播放头，观察下载与缓冲的关系','调整下载速度，启动播放后逐秒推进；拖到未下载的位置会等待数据。',{
    position:0,downloaded:12,rate:2,playing:false,message:'总长30秒；初始已顺序下载12秒。速度单位表示每秒下载多少秒的媒体数据。'
  },s=>{
    const buffer=Math.max(0,s.downloaded-s.position),waiting=s.playing&&s.position>=s.downloaded&&s.position<30;
    return controls(select('rate','示例下载速度',s.rate,[[0,'0：断网'],[.5,'0.5：慢于播放'],[1,'1：等于播放'],[2,'2：快于播放']]))+
      `<div class="lab-stream-track"><div style="width:${s.downloaded/30*100}%"></div><i style="left:${s.position/30*100}%"></i></div>`+
      controls(field('position','拖动播放头（秒）',s.position,'range','min="0" max="30" step="0.5"')+btn(s.playing?'暂停播放':'播放','play')+btn('推进1秒','tick'))+
      table(['状态','秒'],[['已下载到',s.downloaded.toFixed(1)],['播放到',s.position.toFixed(1)],['前方已缓冲',buffer.toFixed(1)]])+
      output(`${s.position===30?'播放完毕':waiting?'等待下载':s.playing?'正在播放':'已暂停'}。${esc(s.message)}`)+
      '<p class="core-caption">本例只模拟从开头顺序下载；真实流媒体还可分段请求、切换码率。HTTPS保护传输，不能保证带宽充足或消除卡顿。</p>';
  },(s,a)=>{if(a==='play'){if(s.position===30)s.position=0;s.playing=!s.playing;}if(a==='tick'){s.downloaded=Math.min(30,s.downloaded+s.rate);if(s.playing)s.position=Math.min(30,Math.max(s.position,Math.min(s.position+1,s.downloaded)));if(s.position===30)s.playing=false;s.message='位置、填充长度与缓冲均由同一时间状态计算。';}},
    (s,k,v)=>{s[k]=k==='position'?number(v,0,30):Number(v);if(k==='position')s.message='播放头已移动；超过已下载位置时，前方可播放缓冲为0。';});
})();
