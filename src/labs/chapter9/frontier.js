/* Bounded teaching models: resource allocation vs parallel work, and IoT event snapshots.
 * No cloud/device connection, real-time simulation, benchmark or process control. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {btn,field,select,table,output,coach,esc}=ui;
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const number=(v,min,max,integer=false)=>{if(String(v).trim()==='')return null;const n=Number(v);return Number.isFinite(n)&&n>=min&&n<=max&&(!integer||Number.isInteger(n))?n:null;};
  const fmt=n=>Number(n.toFixed(3)).toString();
  register(['y2026q39'],'先取得资源，再看任务能并行多少','改变节点数、串行比例和协调开销，观察已分配资源、任务进度与估算耗时。',{
    instance:{released:false,cpu:2,memory:4},service:'IaaS',supply:'local',nodes:'4',allocated:1,time:'100',serial:'20',overhead:'0',run:null,last:null,message:'初始有1个节点可用。修改申请数后要先分配资源，任务才会使用新节点数。'
  },s=>{
    const run=s.run,show=run||s.last;
    let result='';
    if(show){
      const parallelDone=show.parallelTime>0?Math.min(1,Math.max(0,(show.elapsed-show.serialTime)/show.parallelTime)):null;
      const stage=show.elapsed>=show.total?'已完成':show.elapsed<show.serialTime?'串行部分':show.elapsed<show.serialTime+show.parallelTime?'并行部分':'协调开销';
      result=`<section class="ext-dataset" data-hpc-result data-seconds="${show.total}" data-speedup="${show.time/show.total}" data-nodes="${show.nodes}" data-elapsed="${show.elapsed}"><h4>${run?'本次任务':'上次已完成任务'}：${stage}</h4>`+
        table(['任务快照','值'],[['使用节点',String(show.nodes)],['串行部分',fmt(show.serialTime)+'秒'],['均分后的并行部分',fmt(show.parallelTime)+'秒'],['本例协调开销',fmt(show.extra)+'秒'],['总耗时估算',fmt(show.total)+'秒'],['相对单节点基准的加速比',fmt(show.time/show.total)+'倍'],['教学时钟',fmt(show.elapsed)+' / '+fmt(show.total)+'秒']])+
        (parallelDone===null?'<p data-hpc-no-parallel>本任务没有可并行部分；新增节点没有分到并行工作。</p>':table(['并行工作分配','完成比例'],Array.from({length:show.nodes},(_,i)=>['节点'+(i+1)+`：原并行工作量的1/${show.nodes}`,`<progress max="1" value="${parallelDone}" aria-label="节点${i+1}并行进度"></progress> ${fmt(parallelDone*100)}%`])))+'</section>';
    }
    return `<section class="ext-dataset"><h4>云实例：扩容、计量与释放</h4>`+
      table(['实例状态','计算资源','内存','假设计费率'],[[`<span data-instance-state>${s.instance.released?'已释放':'运行中'}</span>`,`<span data-vcpu>${s.instance.released?'—':s.instance.cpu}</span> vCPU`,`<span data-vram>${s.instance.released?'—':s.instance.memory+' GB'}</span>`,`<span data-bill>¥${(s.instance.released?0:s.instance.cpu*0.16).toFixed(2)}/h</span>`]])+
      controls(btn('临时扩到8核16GB','cloudResize','',s.instance.released?'disabled':'')+btn('业务结束释放实例','cloudRelease','',s.instance.released?'disabled':'')+select('service','对照服务层级',s.service,[['IaaS','IaaS：管理系统和应用'],['PaaS','PaaS：部署自己的应用'],['SaaS','SaaS：使用现成应用']]))+
      `<p data-cloud-responsibility>${{IaaS:'基础计算、存储与网络由提供方交付；使用者管理操作系统与应用。',PaaS:'提供方管理运行平台；使用者部署并管理自己的应用。',SaaS:'提供方提供现成应用；使用者使用并作权限范围内的配置。'}[s.service]}</p>`+
      '<p class="core-caption">这是独立的实例规格示例：假设按每vCPU每小时0.16元线性估算，只演示计量，不是任何厂商报价。释放只停止本例实例费用，不说明真实账户的存储等费用全部停止。服务层对照不把当前实例转换成另一产品；仅远程访问固定电脑也不足以证明是云。</p></section><h4>计算任务：取得节点与并行求解</h4><p>下方节点是另一组同速计算资源；不能把上方8个vCPU直接当成下方8个节点。</p>'+
      controls(select('supply','资源提供方式',s.supply,[['local','自建资源池'],['cloud','按需云资源']])+field('nodes','申请节点数（1—16）',s.nodes,'number','min="1" max="16" step="1"')+btn('分配资源','allocate')+btn('释放资源','release'))+
      `<p data-hpc-allocation data-nodes="${s.allocated}">已分配：<b>${s.allocated}个节点</b>。${s.supply==='cloud'?'云方式按需申请与释放；这里不模拟真实供应商、计费或所有云特征。':'自建方式从本地可用资源池分配；不因此排除并行求解。'}</p>`+
      controls(field('time','单节点基准（1—3600秒）',s.time,'number','min="1" max="3600"')+field('serial','不可并行比例（0—100%）',s.serial,'number','min="0" max="100"')+field('overhead','每多1节点的协调开销（0—30秒）',s.overhead,'number','min="0" max="30"'))+
      controls(btn('用当前资源开始估算','start')+btn('推进10个教学秒','step','',run?'':'disabled')+btn('取消本次任务','cancel','',run?'':'disabled'))+result+output(esc(s.message))+
      coach('固定工作量、同速节点、并行部分均分、各阶段不重叠。耗时＝基准×串行比例＋基准×可并行比例÷节点数＋自定协调开销×(节点数−1)。前两项解释Amdahl限制；最后一项只是本例选择的教学假设。不是实际性能预测；云和HPC不是速度排名。输入修改不改变已启动任务的快照，取消不留下新的完成结果。');
  },(s,a)=>{
    if(a==='cloudResize'){if(s.instance.released){s.message='实例已释放，扩容不能恢复它或恢复计费；重置可重新演示。';return;}s.instance.cpu=8;s.instance.memory=16;s.message='实例已扩容，假设计费率随资源变化；下方并行任务与节点未改变。';}
    if(a==='cloudRelease'){s.instance.released=true;s.message='示例实例已释放，扩容锁定且该实例假设计费率为0；不改变下方独立任务资源。';}
    if(a==='allocate'){
      const n=number(s.nodes,1,16,true);if(n===null){s.message='节点数须为1—16的整数；已分配资源保持。';return;}
      if(s.run){s.message='先完成或取消当前任务，再重新分配资源。';return;}s.allocated=n;s.message=`已分配${n}个同速教学节点；还没有启动新任务。`;
    }
    if(a==='release'){if(s.run){s.message='当前任务仍在运行，先完成或取消；资源未释放。';return;}s.allocated=0;s.message='资源已释放，上次完成结果仅作为历史快照保留。';}
    if(a==='start'){
      if(s.run){s.message='当前任务尚未结束；不会用草稿覆盖它。';return;}
      const time=number(s.time,1,3600),serial=number(s.serial,0,100),overhead=number(s.overhead,0,30);
      if(time===null||serial===null||overhead===null){s.message='请输入范围内的有限数值，空输入不是0；未启动任务。';return;}
      if(s.allocated<1){s.message='没有已分配资源，请先分配节点。';return;}
      const serialTime=time*serial/100,parallelTime=time*(1-serial/100)/s.allocated,extra=overhead*(s.allocated-1);
      s.run={time,nodes:s.allocated,serialTime,parallelTime,extra,total:serialTime+parallelTime+extra,elapsed:0};s.message='任务已按当前已分配节点及参数快照启动；推进教学时钟观察各部分。';
    }
    if(a==='step'&&s.run){s.run.elapsed=Math.min(s.run.total,s.run.elapsed+10);if(s.run.elapsed>=s.run.total){s.last={...s.run};s.run=null;s.message='本次估算完成。增加节点也无法消除串行部分，协调开销还可能使结果变慢。';}else s.message='教学时钟已前进，现实时间和真实电脑速度未被模拟。';}
    if(a==='cancel'){s.run=null;s.message='本次任务已取消；上次已完成结果与已分配资源保持。';}
  },(s,k,v)=>{
    if(k==='service'){if(!['IaaS','PaaS','SaaS'].includes(v)){s.message='不支持的服务层级；实例保持。';return;}s.service=v;s.message='只切换服务责任对照，不改变实例资源或释放状态。';}
    if(k==='supply'){if(!['local','cloud'].includes(v)){s.message='不支持的资源提供方式；状态保持。';return;}s.supply=v;s.message='仅改变资源提供语境；节点数、任务快照和算法不因标签而变化。';}
    if(['nodes','time','serial','overhead'].includes(k)){s[k]=String(v);s.message='仅修改输入草稿，已分配资源与已启动任务快照保持。';}
  });

  const sampleText=x=>x?`${fmt(x.value)}℃（采样#${x.id}）`:'尚无样本';
  register(['merged-19'],'同一个温室：采到、传到、判定、执行','逐步比较当前温度、本地样本、平台样本和风扇状态；断网不会让旧数据自动更新。',{
    temperature:'32',threshold:'30',online:true,mode:'remote',serial:0,sample:null,received:null,command:null,fan:false,message:'风扇初始关闭。本例仅用于分清数据与命令，不提供农业控制建议。'
  },s=>controls(field('temperature','当前环境温度（−50—100℃）',s.temperature,'number','min="-50" max="100"')+field('threshold','规则阈值（−50—100℃）',s.threshold,'number','min="-50" max="100"')+select('mode','控制路径',s.mode,[['remote','平台根据收到的样本判断'],['local','本地控制器根据采样判断']])+btn(s.online?'断开平台网络':'恢复平台网络','network'))+
    table(['对象','可观察状态'],[['网络',s.online?'平台链路连通':'平台链路断开；本地连接保留'],['本地传感器样本',`<span data-iot-sample>${esc(sampleText(s.sample))}</span>`],['平台最后收到',`<span data-iot-received>${esc(sampleText(s.received))}</span>`],['待执行命令',`<span data-iot-command>${s.command?`${s.command.on?'开':'关'}风扇；依据${esc(sampleText(s.command.sample))}，阈值${s.command.threshold}℃`:'无'}</span>`],['执行器实际状态',`<b data-iot-fan data-on="${s.fan}">${s.fan?'风扇已开启':'风扇已关闭'}</b>`]])+
    controls(btn('1 采样','sample')+btn('2 上传本次样本','upload')+btn('3 按规则生成命令','decide')+btn('4 送达并执行命令','execute')+btn('取消待执行命令','cancel'))+
    output(esc(s.message))+coach('规则为“样本温度严格大于阈值则开，否则关”，不是AI模型。平台路径的上传和下发需要平台网络；本地路径假定控制器到传感器/执行器仍连通。各按钮表示独立事件，真实系统可自动调度。本例不模拟可靠消息队列、安全联锁、传感器误差或真实设备；采样与阈值修改会撤销尚未执行的旧命令。'),
  (s,a)=>{
    if(a==='network'){s.online=!s.online;s.message=s.online?'平台链路恢复；未自动补传样本或执行命令。':'平台链路断开；平台缓存和风扇保持原状态。';}
    if(a==='sample'){
      const value=number(s.temperature,-50,100);if(value===null){s.message='温度须为−50—100℃的有限数值，空值无效；旧样本保持。';return;}
      s.sample={value,id:++s.serial};s.command=null;s.message='已取得新的本地样本；平台仍保留最后收到的值。';
    }
    if(a==='upload'){
      if(!s.sample){s.message='尚无本地样本，不能上传。';return;}if(!s.online){s.message='上传失败：平台网络断开；平台旧样本保持。';return;}
      s.received={...s.sample};if(s.command?.mode==='remote')s.command=null;s.message='平台已收到该样本；本次上传未生成新命令，也未改变风扇。';
    }
    if(a==='decide'){
      const threshold=number(s.threshold,-50,100),sample=s.mode==='remote'?s.received:s.sample;
      if(threshold===null){s.message='阈值须为−50—100℃的有限数值；未生成命令。';return;}
      if(!sample){s.message=s.mode==='remote'?'平台尚无已收到的样本，不能判断。':'本地尚无样本，不能判断。';return;}
      s.command={mode:s.mode,sample:{...sample},threshold,on:sample.value>threshold};s.message=`已用${s.mode==='remote'?'平台缓存':'本地采样'}生成命令，风扇尚未改变；缓存可能并非当前环境。`;
    }
    if(a==='execute'){
      if(!s.command){s.message='没有待执行命令；风扇保持。';return;}
      if(s.command.mode==='remote'&&!s.online){s.message='命令未送达：平台网络断开，风扇保持；恢复网络后仍须明确执行。';return;}
      s.fan=s.command.on;s.command=null;s.message='本例已确认命令送达并执行，风扇状态改变；环境温度不会因此在网页里自动变化。';
    }
    if(a==='cancel'){s.command=null;s.message='待执行命令已取消，样本和风扇实际状态保持。';}
  },(s,k,v)=>{
    if(k==='mode'){if(!['remote','local'].includes(v)){s.message='不支持的控制路径；当前状态保持。';return;}s.mode=v;s.command=null;s.message='已切换控制路径并取消旧命令；风扇不变。';}
    if(k==='temperature'){s.temperature=String(v);s.message='仅改变当前环境输入，传感器和平台尚未取得新样本。';}
    if(k==='threshold'){s.threshold=String(v);s.command=null;s.message='阈值草稿已变，旧命令取消；重新判断后才能执行。';}
  });
})();
