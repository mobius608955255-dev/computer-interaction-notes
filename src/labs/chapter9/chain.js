/* A local hash-chain experiment; consensus and access policy remain separate concepts. */
(() => {
  'use strict';
  const {register,registry,ui}=window.NOTE_LABS;
  const {btn,field,select,table,output,esc}=ui;
  // Intentionally a small teaching checksum, never presented as a cryptographic hash.
  const digest=(text,previous)=>{let h=2166136261;for(const char of previous+'|'+text)h=Math.imul(h^char.charCodeAt(0),16777619);return (h>>>0).toString(16).padStart(8,'0');};
  const seed=()=>{let previous='00000000';return ['甲向乙转账10','乙向丙转账4','丙向丁转账2'].map(text=>{const block={text,previous,hash:digest(text,previous)};previous=block.hash;return block;});};
  register(['merged-17'],'修改历史记录，逐块检查关联','编辑任意区块的交易文字，比较当前摘要与保存摘要；切换准入方式不会修复数据。',{
    blocks:seed(),mode:'public',message:'每块保存交易、前块摘要与自身摘要。'
  },s=>{
    const valid=s.blocks.map((b,i)=>b.hash===digest(b.text,b.previous)&&b.previous===(i?s.blocks[i-1].hash:'00000000'));
    return `<div class="lab-controls">${select('mode','准入方式',s.mode,[['public','公有链：开放参与'],['permissioned','许可链：按授权参与']])}</div>`+
      table(['区块 / 可编辑交易','保存的前块摘要','保存摘要 / 当前计算','检查'],s.blocks.map((b,i)=>[field('block'+i,'区块'+(i+1),b.text,'text','maxlength="60"'),b.previous,`${b.hash}<br>${digest(b.text,b.previous)}`,valid[i]?'一致':'不一致']))+
      `<div class="lab-controls">${btn('只重算第1块摘要','rehash')}${btn('检查整条链','verify')}</div>`+
      output(esc(s.message))+`<p>当前链：<b>${valid.every(Boolean)?'本地关联完整':'发现被改动的记录或断开的关联'}</b></p>`+
      '<p class="core-caption">8位示例校验值仅用于看清关联，不具备密码学安全性。重算本地摘要不代表网络认可修改；真实区块链还需要密码学哈希、共识和对应准入规则。</p>';
  },(s,a)=>{if(a==='rehash'){const b=s.blocks[0];b.hash=digest(b.text,b.previous);s.message='第1块摘要已更新。后续区块仍保存旧摘要时，关联检查将失败。';}if(a==='verify'){const broken=s.blocks.flatMap((b,i)=>b.hash!==digest(b.text,b.previous)||b.previous!==(i?s.blocks[i-1].hash:'00000000')?[i+1]:[]);s.message=broken.length?'不一致区块：'+broken.join('、')+'。':'本地各块摘要与链接一致；这不替代网络共识。';}},
    (s,k,v)=>{if(k==='mode'){s.mode=v;s.message='只改变参与规则，已修改的交易和摘要保持原状。';}else if(/^block[0-2]$/.test(k)){s.blocks[Number(k.slice(5))].text=v;s.message='交易已修改，保存摘要尚未重算。';}});
})();
