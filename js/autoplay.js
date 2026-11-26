/* ================= «▶ شاهد الحل» — يعرض الحل تلقائيًّا كأنه فيديو: الفأرة تتحرك وتنقر وحدها ================= */
(function(){
const PL={on:false,stop:false,k:1};
const W=ms=>new Promise(r=>setTimeout(r,ms*PL.k));
const rectOf=el=>typeof realRect==='function'?realRect(el):el.getBoundingClientRect();
async function ensureVis(el){if(!el||!el.getBoundingClientRect)return;const cv=$('#canvas');if(!cv||!cv.contains(el))return;const r=rectOf(el),c=cv.getBoundingClientRect();if(r.top>=c.top+20&&r.bottom<=c.bottom-20)return;
  if(PL.k<.05){el.scrollIntoView({block:'center'});return}el.scrollIntoView({block:'center',behavior:'smooth'});await W(450)}
window.ensureVis=ensureVis;
/* الصفحة نفسها لا تتمرّر أبدًا (التطبيق بملء الشاشة): أي scrollIntoView حرّك النافذة أفقيًا ← أرجعها */
window.addEventListener('scroll',()=>{const vv=window.visualViewport;if(vv&&vv.scale>1.01)return;if(window.scrollX||window.scrollY)window.scrollTo(0,0)},{passive:true});
/* على الجوال: الشريط والتبويبات تُسحب أفقيًا — أرِ السحبة بالماوس ثم اسحب حتى يظهر الأمر */
async function ensureHVis(el){if(!el||!el.getBoundingClientRect||el.closest('.dd,.menu,#dlgs,.dlg,.gal-pop'))return;let p=el.parentElement;
  while(p&&p!==document.body&&!p.contains(doc)){const cs=getComputedStyle(p);if(/(auto|scroll)/.test(cs.overflowX)&&p.scrollWidth>p.clientWidth+4){const r=el.getBoundingClientRect(),c=p.getBoundingClientRect();
      if(r.left<c.left+8||r.right>c.right-8){const want=(r.left+r.width/2)-(c.left+c.width/2);const max=p.scrollWidth-p.clientWidth;
        if(PL.k<.05){p.scrollLeft+=want}else{const cur=$('#cursor');const y=Math.min(c.bottom-14,Math.max(c.top+14,r.top+r.height/2));const x0=c.left+c.width/2;
          cur.style.display='block';cur.style.transitionDuration=(500*PL.k)+'ms';cur.style.left=x0+'px';cur.style.top=y+'px';await W(550);cur.classList.add('clk');
          const dx=Math.max(-c.width*.4,Math.min(c.width*.4,-want));cur.style.transitionDuration=(700*PL.k)+'ms';cur.style.left=(x0+dx)+'px';
          const st=p.scrollLeft,t0=performance.now(),D=Math.max(200,700*PL.k);await new Promise(res=>{const f=t=>{const k=Math.min(1,(t-t0)/D),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;p.scrollLeft=st+want*e;k<1?requestAnimationFrame(f):res()};requestAnimationFrame(f)});
          cur.classList.remove('clk');await W(250)}}}
    p=p.parentElement}}
window.ensureHVis=ensureHVis;
async function moveTo(el,ms=700){await ensureVis(el);await ensureHVis(el);const r=rectOf(el);const c=$('#cursor');c.style.display='block';c.style.transitionDuration=(ms*PL.k)+'ms';c.style.left=(r.left+Math.min(r.width/2,60))+'px';c.style.top=(r.top+Math.min(r.height/2,18))+'px';await W(ms)}
function clickFx(){const c=$('#cursor');c.classList.remove('clk');void c.offsetWidth;c.classList.add('clk')}
function realClick(el){const r=el.getBoundingClientRect();const o={bubbles:true,cancelable:true,clientX:r.left+r.width/2,clientY:r.top+r.height/2,button:0};
  try{el.dispatchEvent(new PointerEvent('pointerdown',o))}catch(e){}el.dispatchEvent(new MouseEvent('mousedown',o));el.dispatchEvent(new MouseEvent('mouseup',o));el.dispatchEvent(new MouseEvent('click',o))}
function selectIn(el,text){const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=tw.nextNode()){const i=n.data.indexOf(text);if(i>=0){const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+text.length);const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange();return true}}
  const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange();return true}
function bar(msg){let b=$('#playbar');if(!b){b=document.createElement('div');b.id='playbar';b.innerHTML='<span class="pb-dot"></span><span class="pb-txt"><b>▶ شاهد الحل</b><span class="pb-msg"></span></span><button type="button">⏹ إيقاف</button>';document.body.appendChild(b);b.querySelector('button').onclick=()=>{PL.stop=true}}
  b.querySelector('.pb-msg').textContent=msg||'';b.style.display='flex'}
function shield(on){let s=$('#playshield');if(!s){s=document.createElement('div');s.id='playshield';document.body.appendChild(s)}s.style.display=on?'block':'none'}
function snapState(){return {pen:JSON.stringify(S.pen||null),grid:S.gridOn,vg:doc.classList.contains('vgrid'),ruler:S.ruler,html:doc.innerHTML,page:JSON.stringify(S.page),hf:JSON.stringify(S.hf),marks:S.marks,view:S.view,zoom:S.zoom,app:S.app,log:SIM.log.slice()}}
function restore(st){try{if(window.SELSEEN)SELSEEN.clear();if(window.PARTS_SEEN)PARTS_SEEN.clear()}catch(e){}if(S.app!==st.app){/* تمارين الأساسيات: أعِد التمرين من بدايته */try{applySetup(CO.item.setup)}catch(e){}return}
  try{closeDialog();closeMenus();clearObjSel();if(S.hfMode)exitHF()}catch(e){}doc.innerHTML=st.html;S.page=JSON.parse(st.page);S.hf=JSON.parse(st.hf);S.marks=st.marks;
  try{applyPage();renderHF&&renderHF();doc.querySelectorAll('.obj').forEach(applyObj);if(window.markSpaces)markSpaces(S.marks)}catch(e){}SIM.log=st.log;S.range=null;try{S.pen=JSON.parse(st.pen);S.gridOn=st.grid;doc.classList.toggle('vgrid',st.vg);clearCells&&clearCells();S.curCell=null;typeof syncRibbon==='function'&&syncRibbon()}catch(e){}try{if(S.zoom!==st.zoom)setZoom(st.zoom);if(S.ruler!==st.ruler){S.ruler=st.ruler;applyPage();typeof syncRibbon==='function'&&syncRibbon()}const fb=$('#backstage');if(fb&&!fb.hidden&&S.app==='doc')closeBackstage()}catch(e){}try{SIM.emit('change')}catch(e){}}
async function doStep(st,r,k){let el=null;try{el=st.el()}catch(e){}if(!el)return false;
  if(st.done&&(()=>{try{return st.done()}catch(e){return false}})())return true;
  bar(st.say.replace(/<[^>]+>/g,''));await ensureHVis(el);try{placeCoach(el,st.say,k+1)}catch(e){}await moveTo(el);if(PL.stop)return false;clickFx();await W(250);
  const inDoc=doc.contains(el);
  if(inDoc&&el.classList&&el.classList.contains('obj')){selectObj(el);try{updateCtx()}catch(e){}}
  else if(inDoc&&/حدّد/.test(st.say)&&r.selText){selectIn(el,r.selText)}
  else if(inDoc){if(el.matches('.pg-hdr,.pg-ftr')){el.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}))}else{try{placeCaretIn(el,true);S.range=curRange()}catch(e){}}}
  else if(el.tagName==='SELECT'){const m=(st.say.match(/«([^»]+)»/)||[])[1];const o=[...el.options].find(x=>m&&x.textContent.includes(m));if(o){el.value=o.value;el.dispatchEvent(new Event('change',{bubbles:true}))}}
  else if(el.tagName==='INPUT'&&el.type==='text'){const m=(st.say.match(/:\s*(.+)$/)||[])[1];if(m){el.value=m.trim();el.dispatchEvent(new Event('input',{bubbles:true}))}}
  else if(el.matches&&el.matches('.has-sub,[data-sub]')){el.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));el.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));realClick(el)}
  else realClick(el);
  await W(650);return true}

/* ---- لغة صغيرة لعروض الحل: كتابة، تحديد، مفاتيح، أوامر الشريط ---- */
const findText=(t,root)=>{const R=root||firstBody();const tw=document.createTreeWalker(R,NodeFilter.SHOW_TEXT);let n;const ns=[];let all='';while(n=tw.nextNode()){ns.push([n,all.length]);all+=n.data}
  const i=all.indexOf(t);if(i<0)return null;let k=ns.length-1;while(k>0&&ns[k][1]>i)k--;return [ns[k][0],i-ns[k][1]]};
window.findTextIn=findText;
const endPos=t=>{const R=firstBody();const tw=document.createTreeWalker(R,NodeFilter.SHOW_TEXT);let n;const ns=[];let all='';while(n=tw.nextNode()){ns.push([n,all.length]);all+=n.data}const i=all.indexOf(t);if(i<0)return null;const e=i+t.length;let k=ns.length-1;while(k>0&&ns[k][1]>=e)k--;return [ns[k][0],e-ns[k][1]]};
const blkOf=n=>(n.nodeType===1?n:n.parentElement).closest('p,h1,h2,h3,li,td,.stxt')||firstBody();
function setSel(r){const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange()}
async function showAt(el){if(!el)return;await moveTo(el,600);clickFx();await W(200)}
async function typeText(t){for(const ch of t){document.execCommand('insertText',false,ch);await W(t.length>40?15:55)}S.range=curRange()||S.range;try{SIM.emit('change')}catch(e){}}
async function ribbonCmd(cmd,arg,say){bar(say||'');const tab=tabOfCmd(cmd);if(tab){const t=$(`#wtabs [data-tab="${tab}"]`);if(t&&!t.classList.contains('on')){await showAt(t);realClick(t);await W(300)}}
  const b=tab&&$(`#ribbon [data-panel="${tab}"] [data-hid="${cmd}"]`);if(b){await ensureHVis(b);try{placeCoach(b,say||'')}catch(e){}await showAt(b)}
  const r0=S.range;
  /* أمر له قائمة منسدلة: افتح القائمة وأرِ الخيار ثم اختره (مثل Word) */
  const w=b&&b.dataset.dd&&b.closest('.ddw');if(w&&arg!=null&&!PL.stop){try{hideCoach()}catch(e){}try{openMenu(w)}catch(e){}await W(450);
    const A=String(arg).toLowerCase();const it=[...w.querySelectorAll('.dd [data-arg]')].find(x=>String(x.dataset.arg).toLowerCase()===A&&(!x.dataset.cmd||x.dataset.cmd===cmd||!w.querySelector(`.dd [data-cmd="${cmd}"]`)));
    if(it&&it.offsetParent){await W(500);await moveTo(it,650);it.classList.add('hov');clickFx();await W(350)}else await W(500);
    it&&it.classList.remove('hov');try{closeMenus()}catch(e){}}
  if(r0){setSel(r0)}run(cmd,arg);await W(500);try{hideCoach()}catch(e){}}
async function demoOp(o){if(PL.stop)return;
  if(o.say)bar(o.say);
  if(o.caret!=null){const f0=findText(o.caret);if(!f0)return;await ensureVis(f0[0].parentElement);const f=findText(o.caret);const [n,i]=f;const r=document.createRange();const pos=o.at==='end'?i+o.caret.length:i+(o.off||0);r.setStart(n,pos);r.collapse(true);
    const tmp=document.createRange();tmp.setStart(n,Math.max(0,pos-1));tmp.setEnd(n,Math.min(n.data.length,pos+1));const rc=tmp.getBoundingClientRect();const c=$('#cursor');c.style.display='block';c.style.transitionDuration=(600*PL.k)+'ms';c.style.left=rc.left+'px';c.style.top=(rc.top+rc.height/2)+'px';await W(600);clickFx();setSel(r);await W(250);return}
  if(o.caretIn){const f=findText(o.caretIn);if(!f)return;const b=blkOf(f[0]);await showAt(b);placeCaretIn(b,o.at!=='end');S.range=curRange();await W(250);return}
  if(o.sel||o.selFrom){const a0=findText(o.sel||o.selFrom);if(!a0)return;await ensureVis(a0[0].parentElement);const a=findText(o.sel||o.selFrom);let z=a,zl=(o.sel||o.selFrom).length;if(o.selTo){const f=findText(o.selTo);if(f){z=f;zl=o.selTo.length}}
    const r=document.createRange();if(o.lines){r.setStart(blkOf(a[0]),0);const bz=blkOf(z[0]);r.setEnd(bz,bz.childNodes.length)}else{r.setStart(a[0],a[1]);const e=endPos(o.selTo||o.sel||o.selFrom);if(e)r.setEnd(e[0],e[1]);else r.setEnd(z[0],z[1]+zl)}
    const rc=r.getClientRects();const c=$('#cursor');if(rc.length){c.style.display='block';c.style.transitionDuration=(500*PL.k)+'ms';c.style.left=rc[0].right+'px';c.style.top=(rc[0].top+rc[0].height/2)+'px';await W(500)}
    setSel(r);if(rc.length){const L=rc[rc.length-1];c.style.left=L.left+'px';c.style.top=(L.top+L.height/2)+'px'}await W(600);return}
  if(o.selPart){/* selPart:[text, from, len] */const f=findText(o.selPart[0]);if(!f)return;await ensureVis(f[0].parentElement);const r=document.createRange();r.setStart(f[0],f[1]+o.selPart[1]);r.setEnd(f[0],f[1]+o.selPart[1]+o.selPart[2]);setSel(r);const rc=r.getBoundingClientRect();const c=$('#cursor');c.style.display='block';c.style.left=rc.left+'px';c.style.top=(rc.top+rc.height/2)+'px';await W(600);return}
  if(o.obj){const el=o.obj();if(!el)return;await showAt(el);selectObj(el);try{updateCtx()}catch(e){}await W(300);return}
  if(o.type!=null){await typeText(o.type);return}
  if(o.key){const k=o.key;bar(o.say||('الضغط '+({Enter:'Enter',Tab:'Tab',ShiftEnter:'Shift + Enter',CtrlA:'Ctrl + A',Backspace:'Backspace',ShiftTab:'Shift + Tab'}[k]||k)));
    const t=(S.range&&S.range.startContainer)||document.activeElement||document.body;const tg=t.nodeType===1?t:t.parentElement;
    if(k==='Enter'){const ev=new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true});tg.dispatchEvent(ev);if(!ev.defaultPrevented)document.execCommand('insertParagraph')}else if(k==='Backspace'){document.execCommand('delete')}
    else if(k==='CtrlA'){run('selectAll')}else{tg.dispatchEvent(new KeyboardEvent('keydown',{key:k==='ShiftEnter'?'Enter':k==='ShiftTab'?'Tab':k,shiftKey:/Shift/.test(k),bubbles:true,cancelable:true}))}
    S.range=curRange()||S.range;try{SIM.emit('change')}catch(e){}await W(650);return}
  if(o.cmd){await ribbonCmd(o.cmd,o.arg,o.say);return}
  if(o.show){const tab=tabOfCmd(o.show);{const t=tab&&$(`#wtabs [data-tab="${tab}"]`);if(t&&!t.classList.contains('on')&&t.offsetParent){await showAt(t);realClick(t);await W(300)}}const b=tab&&$(`#ribbon [data-panel="${tab}"] [data-hid="${o.show}"]`);if(b&&b.offsetParent){await ensureHVis(b);try{placeCoach(b,o.say||'')}catch(e){}await showAt(b)}else await W(900);await W(400);try{hideCoach()}catch(e){}return}
  if(o.click){const el=typeof o.click==='function'?o.click():$(o.click);if(!el)return;await showAt(el);realClick(el);await W(450);return}
  if(o.dbl){const el=typeof o.dbl==='function'?o.dbl():$(o.dbl);if(!el)return;await showAt(el);el.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));await W(450);return}
  if(o.fill){const el=$(o.fill);if(!el)return;await showAt(el);el.focus();el.value='';for(const ch of o.value){el.value+=ch;el.dispatchEvent(new Event('input',{bubbles:true}));await W(50)}return}
  if(o.js){try{await o.js()}catch(e){console.warn(e)}await W(400);return}
  if(o.wait){await W(o.wait)}}
async function runDemo(list){for(const o of list){if(PL.stop)break;await demoOp(o)}}
window.runDemo=runDemo;
window.APL={showAt,ribbonCmd,typeText,W,bar};
async function playReq(i,whole){const it=CO.item;const r=it&&it.reqs[i];if(!r)return;if(it.demoAll&&!r.demo){if(PL.didAll)return;PL.didAll=true;await runDemo(typeof it.demoAll==='function'?it.demoAll():it.demoAll);try{hideCoach()}catch(e){}return}let ok0=false;try{ok0=r.check()}catch(e){}if(ok0&&whole)return;
  if(r.demo){await runDemo(typeof r.demo==='function'?r.demo():r.demo);try{hideCoach()}catch(e){}return}
  if(!r.path&&(r.mi||r.cmd)){let w=null;try{w=r.where&&r.where()}catch(e){}const ops=[];
    if(r.selText)ops.push({sel:r.selText});else if(w&&w.classList&&w.classList.contains('obj'))ops.push({obj:()=>w});else if(w&&doc.contains(w)&&w!==firstBody()&&!r.cmd?.startsWith('ins'))ops.push({js:async()=>{await showAt(w);placeCaretIn(w,true);S.range=curRange()}});
    else if(w&&doc.contains(w)&&w.matches('p,h1,h2,li'))ops.push({js:async()=>{await showAt(w);placeCaretIn(w,true);S.range=curRange()}});
    if(r.mi)ops.push({cmd:r.mi[0],arg:r.mi[1]==='null'?undefined:r.mi[1],say:'«'+r.mi[2]+'»'});else ops.push({cmd:r.cmd,say:fixOf(r)});
    await runDemo(ops);try{hideCoach()}catch(e){}let ok=false;try{ok=r.check()}catch(e){}if(ok||PL.stop)return}
  let st=[];try{st=buildGuide(r)}catch(e){}
  if(!st.length){bar(fixOf(r));await W(2600);return}
  for(let k=0;k<st.length&&!PL.stop;k++){const s=st[k];const res=await doStep(s,r,k);if(!res&&!PL.stop){/* الخطوة تحتاج كتابة: اعرض الشرح */bar(fixOf(r));await W(2400);break}
    if(!s.done){/* زر نهائي */}}
  try{hideCoach()}catch(e){}
  let ok=false;try{ok=r.check()}catch(e){}if(!ok&&!PL.stop){bar('بقيت خطوة كتابة: '+fixOf(r));await W(2600)}}
async function play(list,pre){if(PL.on)return;if(typeof stopGuide==='function')try{stopGuide()}catch(e){}
  const it=CO.item;if(!it||!it.reqs)return;PL.on=true;PL.stop=false;PL.didAll=false;const st0=snapState();shield(true);
  try{if(isPhone&&isPhone()){const p=$('#refpanel');if(p)p.classList.add('mcol')}}catch(e){}
  try{if(pre&&pre.length){const k0=PL.k;PL.k=Math.min(PL.k,.02);bar('تجهيز الخطوات السابقة…');const c=$('#cursor');for(const j of pre){if(PL.stop)break;await playReq(j,true)}PL.k=k0;try{hideCoach()}catch(e){}const cv=$('#canvas');await W(300)}
    for(const i of list){if(PL.stop)break;await playReq(i,list.length>1);await W(400)}}catch(e){console.warn(e)}
  bar(PL.stop?'إيقاف العرض':'انتهى العرض — الآن تجربة أنت ✍️');await W(PL.stop?400:1600);
  try{hideCoach();closeMenus();closeDialog()}catch(e){}restore(st0);$('#cursor').style.display='none';shield(false);const b=$('#playbar');if(b)b.style.display='none';PL.on=false;
  try{CO.rpSig='';renderRefList()}catch(e){}simToast('شاهدتَ الحل ▶ — الآن تطبيقه بنفسك');logAct('watchSolution')}
window.playSolution=i=>{if(i==null)return play(CO.item.reqs.map((_,k)=>k));const it=CO.item;if(it.demoAll)return play([i]);
  const prev=[];for(let j=0;j<i;j++){let ok=false;try{ok=it.reqs[j].check()}catch(e){}if(!ok)prev.push(j)}return play([i],prev)};
window.PLAY=PL;
})();
