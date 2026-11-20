/* إحصاءات المتابعة لكل مهمة: الوقت، الخطوات المنجزة، مرات التحقق، أرني أين، شاهد الحل */
(function(){
  const now=()=>Date.now();let dirty=false,lastSave=0;
  function cur(){if(typeof CO==='undefined'||!CO.item||!CO.unit||CO.ws)return null;const u=UP(CO.unit.id);u.s=u.s||{};const k=CO.item.key;const s=u.s[k]=u.s[k]||{f:now()};return s}
  function prog(){const it=CO.item;if(it.reqs){let n=0;it.reqs.forEach(r=>{try{if(r.check())n++}catch(e){}});return [n,it.reqs.length]}
    if(it.steps&&it.steps.length&&CO.mode==='try'){let n=0;for(const st of it.steps){let d=false;try{d=st.done()}catch(e){}if(!d)break;n++}return [n,it.steps.length]}return null}
  function ev(t){const s=cur();if(!s)return;s[t]=(s[t]||0)+1;s.l=now();dirty=true;flush(true)}
  function flush(force){if(!dirty)return;if(!force&&now()-lastSave<30000)return;dirty=false;lastSave=now();try{saveP()}catch(e){}}
  window.STATS={ev};
  setInterval(()=>{if(document.hidden||(window.PLAY&&PLAY.on))return;const s=cur();if(!s)return;
    if(!['idle','won'].includes(CO.mode)||CO.item.reqs){s.t=(s.t||0)+5;s.l=now();dirty=true}
    if(CO.mode!=='won'){const p=prog();if(p){s.n=p[1];if(p[0]>(s.r||0))s.r=p[0]}}flush(false)},5000);
  const wrap=(name,fn)=>{const o=window[name];if(typeof o!=='function')return;window[name]=function(...a){try{fn(...a)}catch(e){}return o.apply(this,a)}};
  let inV=false;{const o=window.verify;if(typeof o==='function')window.verify=function(...a){ev('a');inV=true;try{return o.apply(this,a)}finally{inV=false}}}wrap('showReqHint',()=>{if(!inV)ev('h')});wrap('watchItem',()=>ev('w'));
  wrap('playSolution',i=>ev(i==null?'w':'ws'));
  const oc=window.checkItem;if(typeof oc==='function')window.checkItem=function(){const r=oc.apply(this,arguments);if(r){const s=cur();if(s){if(!s.d)s.d=now();const p=prog();if(p){s.n=p[1];s.r=p[1]}dirty=true;flush(true)}}return r};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)flush(true)});
})();
