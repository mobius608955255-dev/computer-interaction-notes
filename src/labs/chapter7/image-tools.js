/* Focused image models: raw pixels and editing scope, not a file encoder or Photoshop. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {field,select,btn,table,output,coach,esc}=ui;
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const integer=(value,max)=>String(value).trim()!==''&&Number.isInteger(Number(value))&&Number(value)>=1&&Number(value)<=max;
  const formats={mono:{bits:1,label:'1位黑白',colors:'2种黑白状态'},gray:{bits:8,label:'8位灰度',colors:'256个灰度值'},rgb:{bits:24,label:'RGB：3 × 8位',colors:'16777216种RGB组合'},rgba:{bits:32,label:'RGBA：4 × 8位',colors:'16777216种RGB组合；另有256级Alpha'}};
  function size(s){
    if(!integer(s.width,16384)||!integer(s.height,16384)||!integer(s.ppi,2400)||!formats[s.mode])return {error:'本演示仅接受1—16384的整数像素宽高与1—2400的整数PPI；请输入范围内数值。整数PPI是演示输入限制，不是实际图像格式规则。'};
    const width=Number(s.width),height=Number(s.height),ppi=Number(s.ppi),format=formats[s.mode],pixels=width*height,bits=pixels*format.bits;
    return {width,height,ppi,format,pixels,bits,bytes:bits/8,minimumBytes:Math.ceil(bits/8),cmWidth:width/ppi*2.54,cmHeight:height/ppi*2.54};
  }
  register(['y2020q27'],'改变像素、位深与PPI，分别看容量和打印尺寸','像素数据量按宽×高×位数计算；只改PPI时像素数保持。',{
    width:'800',height:'600',mode:'rgb',ppi:'300'
  },s=>{
    const v=size(s),inputs=controls(field('width','宽（像素）',s.width,'number','min="1" max="16384" step="1"')+field('height','高（像素）',s.height,'number','min="1" max="16384" step="1"')+select('mode','像素表示',s.mode,Object.entries(formats).map(([k,f])=>[k,f.label]))+field('ppi','打印PPI（不重新采样）',s.ppi,'number','min="1" max="2400" step="1"'));
    return inputs+(v.error?output(esc(v.error)):
      `<div data-image-size data-pixels="${v.pixels}" data-bits="${v.bits}" data-bytes="${v.bytes}" data-minimum-bytes="${v.minimumBytes}">`+
      table(['量','计算与结果'],[['像素数',`${v.width} × ${v.height} = ${v.pixels.toLocaleString('zh-CN')}`],['未压缩像素位数',`${v.pixels.toLocaleString('zh-CN')} × ${v.format.bits} = ${v.bits.toLocaleString('zh-CN')} bit`],['换成Byte',`${v.bits.toLocaleString('zh-CN')} ÷ 8 = ${v.bytes.toLocaleString('zh-CN')} B`],['容量前缀',`${(v.bytes/1e6).toFixed(6)} MB；${(v.bytes/1048576).toFixed(6)} MiB`],['颜色与Alpha',v.format.colors],['打印宽 × 高',`${v.cmWidth.toFixed(3)} × ${v.cmHeight.toFixed(3)} cm（${v.ppi} PPI）`]])+'</div>'+
      output(Number.isInteger(v.bytes)?'仅计像素数据。PPI改变纸面尺寸；像素数与位数不变时，上面的bit和B保持。':`公式得到${v.bytes} B是理论位数换算；按整字节装入至少需${v.minimumBytes} B。不能把零碎字节当成真实文件大小。`))+
      coach('本例不生成图片文件，不计调色板、文件头、每行填充或压缩。真实格式可能有额外开销；RGBA32中的8位Alpha表示透明度，不是额外的RGB颜色。PPI不等于打印机DPI。');
  },()=>{});

  const initialImage=()=>({width:8,height:6,pixels:Array.from({length:48},(_,i)=>{
    const x=i%8,y=Math.floor(i/8);return x>=2&&x<=5&&y>=1&&y<=4?(x===2||y===1?'#b64637':'#25658b'):null;
  })});
  function edit(image,width,height,operation){
    if(!integer(width,16)||!integer(height,16))return {error:'本演示宽高须为1—16整数像素；无效输入不修改已确认图像。'};
    if(!['resample','canvas'].includes(operation))return {error:'本演示只支持重新采样与画布裁扩。'};
    width=Number(width);height=Number(height);
    const pixels=Array.from({length:width*height},(_,i)=>{
      const x=i%width,y=Math.floor(i/width);
      if(operation==='canvas')return x<image.width&&y<image.height?image.pixels[y*image.width+x]:null;
      const sx=Math.min(image.width-1,Math.floor((x+.5)*image.width/width)),sy=Math.min(image.height-1,Math.floor((y+.5)*image.height/height));
      return image.pixels[sy*image.width+sx];
    });
    return {width,height,pixels};
  }
  function grid(image,label,role){
    const colored=image.pixels.filter(x=>x!==null).length;
    return `<div data-image-${role} data-width="${image.width}" data-height="${image.height}" data-colored="${colored}"><h4>${label}：${image.width} × ${image.height}</h4>`+
      `<svg role="img" aria-label="${label}像素网格，${colored}个有色像素；灰白格为透明" viewBox="0 0 ${image.width*20} ${image.height*20}" style="width:100%;max-width:480px;height:auto;display:block">`+
      image.pixels.map((color,i)=>{const x=i%image.width,y=Math.floor(i/image.width);return `<rect data-pixel="${x},${y}" data-color="${color||'transparent'}" x="${x*20}" y="${y*20}" width="20" height="20" fill="${color||((x+y)%2?'#e3e7eb':'#f7f8fa')}" stroke="#b4bec8" stroke-width="0.4"/>`;}).join('')+'</svg></div>';
  }
  register(['syllabus-image-editing'],'相同目标尺寸：缩放像素，还是改变画布？','先预览；取消保留已确认图像，应用后才改变像素阵列。',{
    image:initialImage(),width:'12',height:'9',operation:'resample',preview:null,message:'初始8×6像素；灰白格表示透明，彩色主体位于中间。'
  },s=>controls(select('operation','操作',s.operation,[['resample','图像大小：重新采样'],['canvas','画布大小：固定左上锚点']])+field('width','目标宽（像素）',s.width,'number','min="1" max="16" step="1"')+field('height','目标高（像素）',s.height,'number','min="1" max="16" step="1"'))+
    controls(btn('预览','preview')+btn('应用','apply')+btn('取消草稿','cancel'))+
    grid(s.image,'已确认图像','committed')+(s.preview?grid(s.preview,'待确认预览','preview'):'')+
    output(esc(s.message))+
    coach('只模拟小像素图：重新采样用最近邻方法；画布锚点固定左上，新增区透明，缩小时丢弃右侧/下侧越界像素。真实软件可换锚点、背景和插值方法；本例没有完整图层、撤销历史或文件保存。重复操作以上次已应用结果为起点，重置可回到原图。'),
  (s,a)=>{
    if(a==='preview'){
      const next=edit(s.image,s.width,s.height,s.operation);
      if(next.error){s.preview=null;s.message=next.error;return;}
      s.preview=next;s.message=s.operation==='resample'?'待确认：整幅图像重新取样，主体随网格变化；还没有修改已确认图像。':'待确认：左上锚点不动，原像素不等比缩放；裁去的部分不会因稍后扩大画布而自动恢复。';
    }
    if(a==='apply'){
      if(!s.preview){s.message='请先生成有效预览；已确认图像保持不变。';return;}
      s.image=structuredClone(s.preview);s.preview=null;s.message='已应用：下次操作从当前像素阵列开始。可比较有色区域的位置、大小及透明边缘。';
    }
    if(a==='cancel'){s.preview=null;s.width=String(s.image.width);s.height=String(s.image.height);s.message='草稿已取消，已确认图像保持不变。';}
  },(s,k,v)=>{s[k]=v;s.preview=null;s.message='参数已改变，请重新预览；旧预览不会被误应用。';});
  window.NOTE_LABS.imageMath={size,edit};
})();
