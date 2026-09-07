/* One column at a time: each borrowed unit changes the donor column. */
(() => {
  'use strict';
  const {register,ui}=window.NOTE_LABS;
  const {field,btn,table,output,esc}=ui;
  register(['y2020q31'],'逐位借位完成二进制减法','输入两个二进制整数，从右侧逐位相减，观察借位怎样经过中间的0。',{
    a:'10000',b:'00001',top:null,bottom:[],result:[],index:-1,rows:[],message:'本例处理不超过12位且被减数不小于减数的非负整数。'
  },s=>`<div class="lab-controls">${field('a','被减数（二进制）',s.a,'text','maxlength="12" inputmode="numeric"')}${field('b','减数（二进制）',s.b,'text','maxlength="12" inputmode="numeric"')}${btn('载入算式','load')}${btn('计算当前位','step','',s.index<0?'disabled':'')}</div>`+
    (s.top?table(['位权',...s.top.map((_,i)=>'2^'+(s.top.length-1-i))],[['被减数当前各位',...s.top.map((v,i)=>i===s.index?`<b class="lab-highlight">${v}</b>`:v)],['减数',...s.bottom],['已求出的差',...s.result.map(v=>v??'·')]]):'')+output(esc(s.message))+(s.rows.length?`<ol class="lab-borrow-log">${s.rows.map(row=>`<li>${esc(row)}</li>`).join('')}</ol>`:''),
  (s,a)=>{
    if(a==='load'){
      if(!/^[01]{1,12}$/.test(s.a)||!/^[01]{1,12}$/.test(s.b)||parseInt(s.a,2)<parseInt(s.b,2)){s.top=null;s.index=-1;s.rows=[];s.message='请使用1—12位的0和1，且被减数不能小于减数。';return;}
      const length=Math.max(s.a.length,s.b.length);s.top=[...s.a.padStart(length,'0')].map(Number);s.bottom=[...s.b.padStart(length,'0')].map(Number);s.result=Array(length).fill(null);s.index=length-1;s.rows=[];s.message='从最右一位开始；若不够减，向左侧有1的位借。';
    }
    if(a==='step'&&s.index>=0){
      const i=s.index,power=s.top.length-1-i;let text=`2^${power}位：`;
      if(s.top[i]<s.bottom[i]){
        let donor=i-1;while(donor>=0&&!s.top[donor])donor--;
        s.top[donor]--;const chain=[];
        for(let j=donor+1;j<i;j++){s.top[j]=1;chain.push('2^'+(s.top.length-1-j));}
        s.top[i]+=2;text+=`向2^${s.top.length-1-donor}位借1，该位减1；${chain.length?chain.join('、')+'经过借位后各剩1；':''}本位得到2。`;
      }
      s.result[i]=s.top[i]-s.bottom[i];text+=`${s.top[i]}−${s.bottom[i]}=${s.result[i]}。`;s.rows.push(text);s.index--;
      s.message=s.index<0?`完成：${s.a}₂ − ${s.b}₂ = ${s.result.join('')}₂；十进制核验 ${parseInt(s.a,2)}−${parseInt(s.b,2)}=${parseInt(s.result.join(''),2)}。`:text;
    }
  },(s,k,v)=>{s[k]=v;s.top=null;s.index=-1;s.rows=[];s.message='算式已改变，请重新载入。';});
})();
