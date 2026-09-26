/* Windows 10 teaching model: authorization request and a committed setting.
 * No OS access, credential collection, malware or native secure-desktop emulation. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {select,field,btn,table,output,coach,esc}=ui;
  const controls=x=>`<div class="lab-controls">${x}</div>`;
  const idle=s=>{s.stage='idle';s.pending=null;s.credential='invalid';s.draft='';};
  register(['syllabus-windows-security'],'同一个系统设置：先取得权限，再确认修改','比较普通编辑与系统时间更改；取消提升或取消草稿都不会提交设置。',{
    account:'standard',operation:'clock',stage:'idle',pending:null,credential:'invalid',draft:'',clock:'09:00',memo:'今天复习信息安全',message:'当前是标准账户。先选择任务；本例不收集任何真实密码。'
  },s=>{
    const account=s.account==='admin'?'管理员账户（管理员批准模式）':'标准账户';
    let panel='';
    if(s.stage==='prompt')panel=`<section class="ext-dataset" data-uac-prompt><h4>请求提升：更改系统时间</h4><p>示例系统设置程序；请先核对任务是否由自己发起。当前设置仍未改变。</p>`+
      (s.pending.account==='standard'?controls(select('credential','示例管理员凭据校验结果',s.credential,[['invalid','无效凭据（失败路径）'],['valid','有效凭据（教学情景）']])):'<p>本例管理员账户需要确认；不会因为账户类型就自动提交。</p>')+
      controls(btn(s.pending.account==='standard'?'验证示例凭据':'允许这次提升','approve')+btn('拒绝 / 取消提升','deny'))+'</section>';
    if(s.stage==='editor')panel=`<section class="ext-dataset" data-security-editor data-privilege="${s.pending.operation==='clock'?'elevated':'ordinary'}"><h4>${s.pending.operation==='clock'?'获准的系统设置任务':'普通笔记编辑'}</h4>`+
      (s.pending.operation==='clock'?'<p>提升已经获准，但草稿尚未写入。此任务结束后不保留通用“已提权”开关。</p>':'<p>本例笔记属于当前用户，可用普通权限编辑，无需UAC。</p>')+
      controls(field('draft',s.pending.operation==='clock'?'系统时间草稿（HH:MM）':'笔记草稿',s.draft,'text',s.pending.operation==='clock'?'maxlength="5"':'maxlength="2000"')+btn('保存本次修改','save')+btn('取消草稿','cancel'))+'</section>';
    return controls(select('account','当前账户',s.account,[['standard','标准账户'],['admin','管理员账户']])+select('operation','准备执行的任务',s.operation,[['memo','编辑自己的笔记'],['clock','更改系统时间']])+btn('开始操作','request'))+
      table(['已确认对象','当前状态'],[['登录账户',account],['系统时间',`<span data-security-clock>${esc(s.clock)}</span>`],['个人笔记',`<span data-security-note>${esc(s.memo)}</span>`]])+
      panel+output(esc(s.message))+
      coach('按Windows 10启用UAC、管理员批准模式及常见默认提示策略演示。标准用户提供有效管理员凭据只授权本次任务，不更改其账户类型；管理员确认也不证明程序安全。网页选择“有效凭据”只是预设情景，不验证密码、不修改电脑，不模拟完整安全桌面、进程继承或组织策略。');
  },(s,a)=>{
    if(a==='request'){
      s.pending={account:s.account,operation:s.operation};s.credential='invalid';s.draft=s.operation==='clock'?s.clock:s.memo;
      s.stage=s.operation==='clock'?'prompt':'editor';s.message=s.stage==='prompt'?'等待提升决定；已确认的系统时间保持。':'已进入普通编辑；保存后才改变笔记。';
    }
    if(a==='approve'){
      if(s.stage!=='prompt'||!s.pending){s.message='没有待处理的提升请求，已确认设置保持。';return;}
      if(s.pending.account==='standard'&&s.credential!=='valid'){s.message='示例凭据验证失败：未授予提升，系统时间保持。';return;}
      s.stage='editor';s.message='本次任务已获准，登录账户类型不变；修改草稿后仍须保存。';
    }
    if(a==='deny'||a==='cancel'){idle(s);s.message='本次请求或草稿已取消，已确认内容保持不变。';}
    if(a==='save'){
      if(s.stage!=='editor'||!s.pending){s.message='尚未进入获准的编辑任务，不能提交修改。';return;}
      if(s.pending.operation==='clock'){
        if(!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(s.draft)){s.message='请输入00:00—23:59范围内的HH:MM；无效草稿不修改时间。';return;}
        s.clock=s.draft;
      }else{
        if(s.draft.length>2000){s.message='本例笔记限2000字符，已确认内容保持。';return;}
        s.memo=s.draft;
      }
      idle(s);s.message='本次内容已保存，任务结束；另一次系统设置请求须重新判断权限。';
    }
  },(s,k,v)=>{
    if(k==='account'||k==='operation'){
      const allowed=k==='account'?['standard','admin']:['clock','memo'];
      if(!allowed.includes(v)){s.message='本演示不支持该账户或任务值；当前状态保持。';return;}
      s[k]=v;idle(s);s.message='已切换情景，未保存草稿与旧提升请求已取消。已确认内容保持。';
    }
    if(k==='credential'&&s.stage==='prompt'&&s.pending?.account==='standard'){
      if(!['valid','invalid'].includes(v)){s.credential='invalid';s.message='仅支持预设的有效/无效凭据情景。';return;}
      s.credential=v;s.message='已选择示例校验情景，尚未执行验证。';
    }
    if(k==='draft'&&s.stage==='editor'){s.draft=String(v);s.message='仅改变草稿，已确认内容保持。';}
  });
})();
