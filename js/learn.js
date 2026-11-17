/* ================= Learning layer: units, coach, quizzes ================= */
const PKEY='wordlab-guide-v2';
let P={};try{P=JSON.parse(localStorage.getItem(PKEY)||'{}')}catch(e){}
const saveP=()=>{try{localStorage.setItem(PKEY,JSON.stringify(P))}catch(e){}};
const UP=id=>P[id]=P[id]||{p:{},cmp:{},mis:{},task:{}};

/* ---------- step builders (used by content.js) ---------- */
const vis=el=>!!(el&&el.getClientRects().length);
const no=()=>false;
const logHas=s=>SIM.log.some(a=>typeof s==='string'?a===s||a.startsWith(s):s.test(a));
const TAB=(t,say)=>({el:()=>$(`#wtabs [data-tab="${t}"]`),say:say||(t==='file'?'انقر تبويب «ملف»':`افتح تبويب «${RIBBON[t].label}»`),done:()=>t==='file'?!$('#backstage').hidden:activeTab===t,act:()=>$(`#wtabs [data-tab="${t}"]`).click()});
const rb=(tab,hid)=>()=>$(`#ribbon [data-panel="${tab}"] [data-hid="${hid}"]`);
const B=(tab,hid,say,done=no,act)=>({el:rb(tab,hid),say,done,act:act||(()=>{const e=rb(tab,hid)();if(e.tagName==='LABEL')e.querySelector('input').click();else e.click()})});
const M=(tab,hid,say)=>({el:rb(tab,hid),say,done:()=>!!rb(tab,hid)()?.closest('.ddw')?.classList.contains('open'),act:()=>openMenu(rb(tab,hid)().closest('.ddw'))});
const I=(sel,say,done=no,act)=>({el:()=>$$(sel).find(vis)||null,say,done,act:act||(()=>($$(sel).find(vis)||$(sel)).click())});
const E=(el,say,done=no,act,pre)=>({el:typeof el==='string'?()=>$$(el).find(vis)||$(el):el,say,done,act,pre});
const SUB=(sub,say)=>({el:()=>$(`.ddw.open [data-sub="${sub}"]`),say,done:()=>!!$(`.subm.open[data-subm="${sub}"]`),act:()=>{const b=$(`.ddw.open [data-sub="${sub}"]`);openSub(b,b.parentElement.querySelector('.subm'))}});
async function typeInto(el,text,end=true){if(!el)return;if(!(S.range&&el.contains(S.range.startContainer)))placeCaretIn(el,!end);restoreSel();for(const ch of text){ex('insertText',ch);await wait(60)}S.range=curRange()?.cloneRange()||S.range}
const TY=(sel,text,say,done)=>({el:typeof sel==='string'?()=>$(sel):sel,say,done:done||(()=>{const e=typeof sel==='string'?$(sel):sel();return !!e&&e.textContent.includes(text)}),act:async()=>{const e=typeof sel==='string'?$(sel):sel();const ph=e.querySelector('.ph');if(ph)selectNode(ph);else if(e.dataset.selall)selectNode(e);else placeCaretIn(e,false);await typeInto(e,text)}});
function selectWord(el,word){if(!el)return;const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const i=n.nodeValue.indexOf(word);if(i>=0){const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+word.length);editHost(n).focus();const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange();return}}}
const SELW=(sel,word,say)=>({el:()=>{const e=$(sel);if(!e)return null;return e},say:say||`حدِّد كلمة «${word}» (نقر مزدوج)`,done:()=>selText().trim()===word||selText().includes(word)&&selText().length<word.length+4,act:()=>selectWord($(sel),word)});
const SELP=(sel,say)=>({el:()=>$(sel),say:say||'حدِّد الفقرة (ثلاث نقرات)',done:()=>{const e=$(sel);const t=selText().trim();return !!e&&t.length>5&&e.textContent.trim().startsWith(t.slice(0,8))},act:()=>selectNode($(sel))});
const CARET=(sel,say,atEnd=true)=>({el:()=>$(sel),say,done:()=>{const e=$(sel);return !!e&&!!S.range&&e.contains(S.range.startContainer)},act:()=>placeCaretIn($(sel),!atEnd)});
const PICK=(sel,say)=>({el:()=>$(sel),say:say||'انقر على الصورة لتحديدها',done:()=>!!S.obj&&S.obj===$(sel),act:()=>selectObj($(sel))});
const CELL=(r,c,say)=>({el:()=>doc.querySelector('table.wt')?.rows[r]?.cells[c],say:say||'انقر داخل الجدول',done:()=>!!S.curCell&&S.curCell.closest('table')===doc.querySelector('table.wt'),act:()=>{const td=doc.querySelector('table.wt').rows[r].cells[c];placeCaretIn(td,false);S.curCell=td;updateCtx()}});
const ROWSEL=(r,say)=>({el:()=>doc.querySelector('table.wt')?.rows[r],say:say||'اسحب الفأرة فوق خلايا الصف الأول لتحديدها',done:()=>{const row=doc.querySelector('table.wt')?.rows[r];return !!row&&[...row.cells].every(c=>c.classList.contains('sel'))},act:()=>{const row=doc.querySelector('table.wt').rows[r];placeCaretIn(row.cells[0]);S.curCell=row.cells[0];setCells([...row.cells]);updateCtx()}});
const DLG=(sel,say,done=no,act)=>({el:()=>$(`#dlgs ${sel}`),say,done,act:act||(()=>$(`#dlgs ${sel}`).click())});
const DRAW=(say)=>({el:()=>pages()[0]?.querySelector('.pg-body'),say:say||'اسحب على الصفحة لرسم الشكل',done:no,act:async()=>{const body=pages()[0].querySelector('.pg-body');const k=S.drawKind;S.drawKind=null;doc.classList.remove('drawing');snap();const w=k==='textbox'?220:130,h=k==='textbox'?70:130;const tmp=document.createElement('div');tmp.innerHTML=shapeHTML(k,w,h,{x:150,y:120});const o=tmp.firstChild;placeFloat(o,body,150,120);selectObj(o);showCtxTab('sformat');logAct('shape:'+k);SIM.emit('change')}});

/* ---------- setup ---------- */
function fitZoom(){const {w}=pageDims();return Math.min(100,Math.floor((canvas.clientWidth-60)/(w*CM)*100))}
function applySetup(su={}){
  try{closeDialog();closeMenus();hideCtx();clearObjSel();cancelDraw()}catch(e){}
  $('#readmode').hidden=true;Object.assign(S,{view:'print',multi:false,nav:false,marks:false,ruler:true,grid:false,theme:0,themeColor:null,themeFont:null,cmts:true,activeC:null,painter:null,clip:null,hfMode:false});doc.classList.remove('hfmode','selobj','vgrid','drawing');doc.style.cursor='';renderNav();
  S.page={size:'A4',orient:'portrait',margin:'normal',cols:'1',lineNums:'none',color:'',border:null,wm:'',paraSp:8};
  $('#startmenu').classList.remove('open');$('#splash').classList.remove('show');$('#ribbon').classList.remove('collapsed');
  if(su.fs)su.fs.forEach(f=>{if(!FS.find(x=>x.name===f.name&&x.where===f.where))FS.unshift({time:'أمس',data:null,...f})});
  if(su.app==='desktop'){setDocHTML(['<p><br></p>']);S.app='desktop';$('#wwin').classList.add('hide');$('#tbword').hidden=true;closeBackstage();SIM.log=[];return}
  $('#wwin').classList.remove('hide','min');$('#tbword').hidden=false;$('#tbword').classList.add('running','active');
  if(su.app==='start'){setDocHTML(['<p><br></p>']);S.app='start';showWordStart();SIM.log=[];return}
  S.app='doc';$('#wwin').classList.remove('nodoc');closeBackstage();
  setDocHTML(su.pages||[su.html||'<p><br></p>']);
  if(su.hf)Object.assign(S.hf,su.hf);if(su.page)Object.assign(S.page,su.page);
  if(su.comments)S.comments=JSON.parse(JSON.stringify(su.comments));
  S.file={name:su.file||'مستند1',where:su.where||null};
  afterLoad();renderComments();updateTitle();setTab(su.tab||'home');setZoom(su.zoom||fitZoom());
  doc.querySelectorAll('.obj').forEach(applyObj);
  if(su.caret){const el=doc.querySelector(su.caret);if(el)placeCaretIn(el,!!su.caretStart)}else placeCaretIn(firstBody(),false);
  if(su.obj){const o=doc.querySelector(su.obj);if(o)selectObj(o)}
  if(su.hfMode)enterHF(su.hfMode);
  if(su.after)su.after();canvas.scrollTop=0;setTimeout(()=>{SIM.log=[];S.tabsSeen={};S.dirty=!!su.dirty;updateTitle()},60);
}
SIM.on('tab',t=>S.tabsSeen[t]=1);

/* ---------- coach overlay ---------- */
const CO={mode:'idle',unit:null,item:null,idx:0};
function hideCoach(){$('#ring').style.display='none';$('#bubble').style.display='none'}
function placeCoach(el,html,num){
  const r=el.getBoundingClientRect(),ring=$('#ring'),b=$('#bubble');
  ring.style.display='block';Object.assign(ring.style,{left:(r.left-4)+'px',top:(r.top-4)+'px',width:(r.width+8)+'px',height:(r.height+8)+'px'});
  b.style.display='block';b.innerHTML=(num!=null?`<b>${num}</b>`:'')+html;
  const bw=b.offsetWidth,bh=b.offsetHeight,below=r.bottom+bh+20<innerHeight;let x=r.left+r.width/2-bw/2;x=Math.max(8,Math.min(innerWidth-bw-8,x));
  b.style.left=x+'px';b.style.top=(below?r.bottom+12:Math.max(6,r.top-bh-12))+'px';b.className=below?'down':'up';b.style.setProperty('--ax',Math.max(14,Math.min(bw-14,r.left+r.width/2-x))+'px');
}
const cur=()=>$('#cursor');
function moveCursorTo(el,ms=650){if(!el)return wait(0);const r=el.getBoundingClientRect();const c=cur();c.style.display='block';c.style.transitionDuration=ms+'ms';c.style.left=(r.left+r.width/2)+'px';c.style.top=(r.top+r.height/2)+'px';return wait(ms)}
async function clickFx(){const c=cur();c.classList.add('click');await wait(200);c.classList.remove('click')}
function stepIdx(it){const st=it.steps;for(let i=0;i<st.length;i++){let d=false;try{d=st[i].done()}catch(e){}if(!d)return i}return st.length-1}
setInterval(()=>{
  if(CO.mode==='try'&&CO.item){
    if(checkItem())return;
    const i=stepIdx(CO.item),s=CO.item.steps[i];CO.idx=i;renderDots(i);let el=null;try{el=s.el()}catch(e){}
    if(!el||!vis(el)){hideCoach();return}if(CO.lastI!==i){CO.lastI=i;if(canvas.contains(el)){const cr=canvas.getBoundingClientRect(),er=el.getBoundingClientRect();if(er.bottom<cr.top||er.top>cr.bottom)el.scrollIntoView({block:'center'})}}placeCoach(el,s.say,i+1);
  }else if(CO.mode==='explore'&&CO.exEl){if(vis(CO.exEl))placeCoach(CO.exEl,CO.exHtml);else{hideCoach();CO.exEl=null}}
},180);
function checkItem(){let ok=false;try{ok=!!CO.item.check()}catch(e){}if(!ok)return false;
  CO.mode='won';hideCoach();const u=UP(CO.unit.id);u.p[CO.itemI]=true;saveP();renderDots(99);confetti();renderPractice(true);setTimeout(()=>showSimCard('won'),450);renderHome();return true}

/* ---------- confetti ---------- */
function confetti(){const C=['#2b579a','#1e8e3e','#f4b400','#d32f2f','#7b3fa6','#00a3d9'];const r=$('#sim').getBoundingClientRect();
  for(let i=0;i<70;i++){const e=document.createElement('i');e.className='cf';e.style.left=(r.left+Math.random()*r.width)+'px';e.style.top=(r.top-10)+'px';e.style.background=C[i%C.length];e.style.animationDelay=(Math.random()*.4)+'s';e.style.setProperty('--dx',(Math.random()*160-80)+'px');e.style.setProperty('--rot',(Math.random()*720)+'deg');document.body.appendChild(e);setTimeout(()=>e.remove(),2600)}}

/* ---------- app shell ---------- */
let curUnit=null,curMode='explore';
function allUnits(){return UNITS.flatMap(s=>s.units||[s])}
function unitProg(u){const p=UP(u.id);const tot=(u.practice||[]).length+(u.compare?1:0)+(u.mistakes?1:0);const d=Object.keys(p.p).length+(p.cmpDone?1:0)+(p.misDone?1:0);return {d,tot,pct:tot?Math.round(d/tot*100):0}}
function ring(pct,sz=40){const r=sz/2-4,c=2*Math.PI*r;return `<svg class="pring" width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="#e3e7ee" stroke-width="4"/><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${pct>=100?'#1e8e3e':'#185abd'}" stroke-width="4" stroke-dasharray="${c*pct/100} ${c}" stroke-linecap="round" transform="rotate(-90 ${sz/2} ${sz/2})"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-size="${sz/3.6}" font-weight="700" fill="#333">${pct>=100?'✓':pct+'%'}</text></svg>`}
function renderHome(){
  const h=$('#home');if(!h)return;const all=allUnits();const tp=all.reduce((a,u)=>{const p=unitProg(u);return [a[0]+p.d,a[1]+p.tot]},[0,0]);
  $('#gprog').innerHTML=`<span>${tp[0]} / ${tp[1]}</span><div class="bar"><i style="width:${tp[1]?tp[0]/tp[1]*100:0}%"></i></div>`;
  h.innerHTML=`<div class="hero"><div><h1>برنامج وورد</h1><p>معالج النصوص — دليل التطبيق العملي</p><div class="hero-sub">اختر قسمًا، ثم تعلّم بالاستكشاف والتدريب على محاكي Word.</div></div><div class="hero-art"><span class="applogo w big">W</span></div></div>
   <h2 class="idx-h">محتويات الدليل · ماذا ستتعلّم؟</h2>
   <div class="idx">${UNITS.map((s,i)=>s.units?`<div class="sec5"><div class="sec-h"><span class="num">${s.num}</span><div><b>${s.title}</b><small>${s.sub}</small></div></div><div class="subgrid">${s.units.map(u=>unitCard(u,true)).join('')}</div></div>`:unitCard(s)).join('')}</div>`;
  h.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>openUnit(b.dataset.u));
}
function unitCard(u,small){const p=unitProg(u);return `<button class="ucard ${small?'sm':''}" data-u="${u.id}"><span class="uic">${icon(u.icon,small?26:34)}</span><span class="ut"><small>${u.num}</small><b>${u.title}</b>${u.sub&&!small?`<em>${u.sub}</em>`:''}</span>${ring(p.pct,small?34:42)}</button>`}
const MODES=[['explore','استكشف','🔎'],['practice','تدرّب','🖱️'],['compare','ما الفرق؟','⚖️'],['mistakes','أخطاء شائعة','⚠️'],['task','مهمة على جهازك','💻']];
function openUnit(id,mode){
  curUnit=allUnits().find(u=>u.id===id);if(!curUnit)return;const u=curUnit;
  document.body.classList.add('in-unit');$('#home').hidden=true;$('#unit').hidden=false;
  const modes=MODES.filter(m=>m[0]==='explore'?u.explore:m[0]==='practice'?u.practice:m[0]==='compare'?u.compare:m[0]==='mistakes'?u.mistakes:u.task);
  $('#uhead').innerHTML=`<button class="back" id="toIndex">⌂ الفهرس</button><div class="utitle"><span class="uic">${icon(u.icon,28)}</span><div><small>${u.num.length>2?'القسم 5 من 5 · العناصر':'القسم '+u.num+' من 5'}</small><b>${u.title}</b></div></div><nav class="modes">${modes.map(m=>`<button data-m="${m[0]}">${m[2]} ${m[1]}</button>`).join('')}</nav>`;
  $('#toIndex').onclick=goHome;$$('#uhead [data-m]').forEach(b=>b.onclick=()=>setMode(b.dataset.m));
  setMode(mode||modes[0][0]);
}
function goHome(){CO.mode='idle';hideCoach();cur().style.display='none';document.body.classList.remove('in-unit');$('#unit').hidden=true;$('#home').hidden=false;renderHome();scrollTo(0,0)}
function setMode(m){
  curMode=m;CO.mode='idle';CO.exEl=null;hideCoach();cur().style.display='none';hideSimCard();
  $$('#uhead [data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m===m));
  const wide=m==='compare'||m==='mistakes';$('#unit').classList.toggle('wide',wide);
  if(m==='explore')renderExplore();if(m==='practice')renderPractice();if(m==='compare')renderCompare();if(m==='mistakes')renderMistakes();if(m==='task')renderTask();
}
/* ---------- explore ---------- */
function renderExplore(){
  const u=curUnit;applySetup(u.exploreSetup||u.practice?.[0]?.setup||{});
  const groups={};u.explore.forEach((c,i)=>{(groups[c.g||'']=groups[c.g||'']||[]).push([c,i])});
  $('#panel').innerHTML=`<div class="phead"><h3>استكشف</h3><p>${u.intro||'انقر على أي بطاقة لنريك مكان الأمر في البرنامج.'}</p></div>${u.legend!==false?`<div class="legend"><span class="k add">إضافة</span> نُضيف شيئًا جديدًا <span class="k ctl">تحكّم</span> نغيّر شكل شيء موجود</div>`:''}
   ${Object.entries(groups).map(([g,cs])=>`${g?`<div class="xg">${g}</div>`:''}<div class="xcards">${cs.map(([c,i])=>`<button class="xcard ${c.t||c.ctx?'':'concept'}" data-x="${i}">${c.k?`<span class="k ${c.k}">${c.k==='add'?'إضافة':'تحكّم'}</span>`:''}${c.ic?`<span class="xic">${icon(c.ic,24)}</span>`:''}<b>${c.n}</b><small>${c.d}</small>${c.key?`<kbd>${c.key}</kbd>`:''}</button>`).join('')}</div>`).join('')}
   ${u.tip?`<div class="ptip">💡 ${u.tip}</div>`:''}`;
  $$('#panel [data-x]').forEach(b=>b.onclick=()=>{$$('#panel .xcard.on').forEach(x=>x.classList.remove('on'));b.classList.add('on');pointTo(u.explore[+b.dataset.x])});
}
async function prepCtx(ctx){
  if(!ctx)return;
  if(ctx==='doc'){if(S.app!=='doc')applySetup(curUnit.exploreSetup||{});return}
  if(ctx==='bs'){if($('#backstage').hidden)openBackstage('home');return}
  if(!$('#backstage').hidden&&S.app==='doc')closeBackstage();
  if(ctx==='desktop'){if(S.app!=='desktop')applySetup({app:'desktop'});return}
  if(ctx==='table'){let t=doc.querySelector('table.wt');if(!t){placeCaretIn(firstBody(),false);insertTable(3,3);t=doc.querySelector('table.wt')}if(!S.curCell){placeCaretIn(t.rows[0].cells[0]);S.curCell=t.rows[0].cells[0];updateCtx()}return}
  if(ctx==='pic'||ctx==='shape'||ctx==='wordart'||ctx==='textbox'){const sel=ctx==='pic'?'.obj.pic':ctx==='shape'?'.obj.shp:not(.textbox):not(.wordart)':'.obj.'+ctx;let o=doc.querySelector(sel);
    if(!o){if(ctx==='pic'){placeCaretIn(firstBody(),false);insertPicture(SAMPLE_IMGS[1])}else if(ctx==='wordart'){OPS.insWordArt(1)}else if(ctx==='textbox'){OPS.insTextbox('simple')}else{const body=firstBody();const tmp=document.createElement('div');tmp.innerHTML=shapeHTML('star',120,120,{x:200,y:80});placeFloat(tmp.firstChild,body,200,80)}o=doc.querySelector(sel)}
    if(S.obj!==o)selectObj(o);return}
  if(ctx==='hf'){if(!S.hfMode)enterHF('hdr');await wait(60);return}
  if(ctx==='eq'){let e=doc.querySelector('.eq');if(!e){placeCaretIn(firstBody(),false);OPS.insEq();await wait(40)}else if(!curEq()){const r=document.createRange();r.selectNodeContents(e);r.collapse(false);editHost(e).focus();const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange();updateCtx()}return}
  if(ctx==='cmt'){if(!S.comments.length){selectWord(firstBody().querySelector('p'),firstBody().querySelector('p').textContent.trim().split(/\s+/)[0]);addComment()}return}
}
async function pointTo(c){
  CO.mode='explore';CO.exEl=null;hideCoach();closeMenus();
  await prepCtx(c.ctx||(c.t?'doc':null));
  if(!c.t){CO.exEl=null;return}
  const tab=c.tab||(c.t.startsWith('bs-')||c.ctx==='desktop'?null:tabOfCmd(c.t));
  if(tab&&activeTab!==tab){const tb=$(`#wtabs [data-tab="${tab}"]`);if(tb&&!tb.hidden){await moveCursorTo(tb,450);await clickFx();setTab(tab);await wait(150)}}
  const el=tab?$(`#ribbon [data-panel="${tab}"] [data-hid="${c.t}"]`):$$(`#sim [data-hid="${c.t}"]`).find(vis);
  if(!el){cur().style.display='none';simToast('افتح '+c.n+' من المكان المناسب');return}
  el.scrollIntoView({block:'nearest',inline:'nearest'});await moveCursorTo(el,450);cur().style.display='none';
  CO.exEl=el;CO.exHtml=`<span class="bt">${c.n}</span>${c.d}${c.key?` <kbd>${c.key}</kbd>`:''}`;placeCoach(el,CO.exHtml);
}
document.addEventListener('mousedown',e=>{if(CO.mode==='explore'&&!e.target.closest('.xcard')){CO.exEl=null;hideCoach()}},true);

/* ---------- practice ---------- */
function renderPractice(keep){
  const u=curUnit,pr=UP(u.id).p;
  if(!keep){CO.itemI=CO.itemI&&curUnit===CO.unit?CO.itemI:(u.practice.findIndex((_,i)=>!pr[i]));if(CO.itemI<0||CO.itemI==null)CO.itemI=0}
  CO.unit=u;
  $('#panel').innerHTML=`<div class="phead"><h3>تدرّب على المحاكي</h3><p>اختر مهمة، ثم <b>شاهد</b> كيف تُنفَّذ، أو <b>جرّب بنفسك</b> وسنرشدك خطوة بخطوة.</p></div>
   <div class="plist">${u.practice.map((it,i)=>`<button class="pitem ${i===CO.itemI?'on':''} ${pr[i]?'done':''}" data-p="${i}"><span class="pn">${pr[i]?'✓':i+1}</span><span>${it.t}</span></button>`).join('')}</div>
   <div class="pnow"><div class="goal">🎯 <span>${u.practice[CO.itemI].t}</span></div><div class="dots" id="dots"></div><div class="pbtns"><button class="watch" id="pw">▶ شاهد</button><button class="try" id="pt">✋ جرّب</button><button id="pr">↺</button></div>${u.practice[CO.itemI].hint?`<div class="ptip">💡 ${u.practice[CO.itemI].hint}</div>`:''}</div>`;
  $$('#panel [data-p]').forEach(b=>b.onclick=()=>{CO.itemI=+b.dataset.p;startItem()});
  $('#pw').onclick=()=>watchItem();$('#pt').onclick=()=>tryItem();$('#pr').onclick=()=>startItem();
  if(!keep)startItem();else renderDots(CO.mode==='won'?99:CO.idx);
}
function renderDots(i){const d=$('#dots');if(!d||!CO.item)return;d.innerHTML=CO.item.steps.map((_,k)=>`<i class="${k<i||i===99?'d':k===i?'c':''}"></i>`).join('')}
function startItem(){CO.mode='idle';hideCoach();cur().style.display='none';const it=curUnit.practice[CO.itemI];CO.item=it;CO.unit=curUnit;applySetup(it.setup||{});renderPractice(true);renderDots(-1);showSimCard('start')}
function tryItem(){hideSimCard();applySetup(CO.item.setup||{});setTimeout(()=>{CO.mode='try'},80)}
async function watchItem(){
  hideSimCard();applySetup(CO.item.setup||{});await wait(120);CO.mode='demo';$('#blocker').style.display='block';
  const c=cur();c.style.display='block';c.style.transitionDuration='0ms';const r=$('#sim').getBoundingClientRect();c.style.left=(r.left+r.width/2)+'px';c.style.top=(r.top+r.height/2)+'px';await wait(250);
  const st=CO.item.steps;
  for(let i=0;i<st.length;i++){if(CO.mode!=='demo')break;const s=st[i];let el=null;try{el=s.el()}catch(e){}
    if(!el){await wait(300);try{el=s.el()}catch(e){}}if(!el)break;el.scrollIntoView({block:'nearest',inline:'nearest'});await wait(60);
    renderDots(i);placeCoach(el,s.say,i+1);await moveCursorTo(el);if(s.pre){s.pre();await wait(400)}await clickFx();
    try{await (s.act&&s.act())}catch(e){console.error(e)}await wait(900);}
  hideCoach();c.style.display='none';$('#blocker').style.display='none';
  if(CO.mode==='demo'){CO.mode='idle';showSimCard('turn')}
}
function showSimCard(kind){const it=CO.item,o=$('#simcard');if(!it)return;
  if(kind==='start')o.innerHTML=`<div class="ocard"><div class="big">${icon(curUnit.icon,46)}</div><h2>${it.t}</h2><p>شاهد الخطوات أولًا، أو جرّب بنفسك مباشرة.</p><div class="cbtns"><button class="watch" data-a="watch">▶ شاهد كيف</button><button class="try" data-a="try">✋ جرّب بنفسك</button></div></div>`;
  if(kind==='turn')o.innerHTML=`<div class="ocard"><div class="big">👏</div><h2>الآن دورك!</h2><p>🎯 ${it.t}</p><div class="cbtns"><button class="try" data-a="try">✋ ابدأ</button><button class="ghost" data-a="watch">▶ شاهد مرة أخرى</button></div></div>`;
  if(kind==='won'){const nx=curUnit.practice.findIndex((_,i)=>!UP(curUnit.id).p[i]);o.innerHTML=`<div class="ocard"><div class="stars"><span>⭐</span><span>⭐</span><span>⭐</span></div><h2>أحسنت!</h2><p>${it.t} ✓</p>${it.after?`<div class="after">💡 ${it.after}</div>`:''}<div class="cbtns">${nx>=0?`<button class="try" data-a="next">المهمة التالية ←</button>`:`<button class="try" data-a="mode">${curUnit.compare?'إلى «ما الفرق؟» ←':'إلى «مهمة على جهازك» ←'}</button>`}<button class="ghost" data-a="again">↺ أعد</button><button class="ghost" data-a="free">✏️ تابع على المحاكي</button></div></div>`}
  o.className='simcard show '+kind;
  o.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='watch')watchItem();if(a==='try')tryItem();if(a==='again')startItem();if(a==='free')hideSimCard();
    if(a==='next'){CO.itemI=curUnit.practice.findIndex((_,i)=>!UP(curUnit.id).p[i]);startItem()}if(a==='mode')setMode(curUnit.compare?'compare':'task')});
}
function hideSimCard(){$('#simcard').className='simcard'}

/* ---------- compare quiz ---------- */
function renderCompare(){
  const u=curUnit;const items=u.compare;let i=0,score=0;const order=items.map(()=>Math.random()<.5?'a':'b');
  const draw=()=>{const c=items[i];const ask=order[i];const q=c[ask];
    $('#panel').innerHTML=`<div class="qwrap"><div class="qtop"><h3>⚖️ ما الفرق؟</h3><div class="qprog">${items.map((_,k)=>`<i class="${k<i?'d':k===i?'c':''}"></i>`).join('')}</div></div>
      <div class="qh">${c.q}</div>
      <div class="pair"><div class="side a">${c.a.ex?`<div class="ex">${c.a.ex}</div>`:''}<b>${c.a.n}</b><p class="hid">${c.a.d}</p></div><div class="or">أم</div><div class="side b">${c.b.ex?`<div class="ex">${c.b.ex}</div>`:''}<b>${c.b.n}</b><p class="hid">${c.b.d}</p></div></div>
      <div class="qq">أيّهما: <span>«${q.d}»</span>؟</div>
      <div class="qopts"><button data-o="a">${c.a.n}</button><button data-o="b">${c.b.n}</button></div><div class="qfb" id="qfb"></div></div>`;
    $$('#panel [data-o]').forEach(b=>b.onclick=()=>{const ok=b.dataset.o===ask;if(ok)score++;$$('#panel [data-o]').forEach(x=>{x.disabled=true;if(x.dataset.o===ask)x.classList.add('ok');else if(x===b)x.classList.add('bad')});
      $$('#panel .side').forEach(s=>{s.querySelector('.hid').classList.remove('hid');if(s.classList.contains(ask))s.classList.add('hl')});
      $('#qfb').innerHTML=`<div class="${ok?'good':'nope'}">${ok?'✓ صحيح!':'✗ ليس تمامًا'} ${c.good?`<span>${c.good}</span>`:''}</div><button class="qnext">${i<items.length-1?'التالي ←':'النتيجة'}</button>`;
      $('#qfb .qnext').onclick=()=>{i++;if(i<items.length)draw();else done()}})};
  const done=()=>{const p=UP(u.id);p.cmpDone=1;p.cmpScore=score;saveP();renderHome();
    $('#panel').innerHTML=`<div class="qwrap res"><div class="stars big">${'⭐'.repeat(Math.max(1,Math.round(score/items.length*3)))}</div><h2>${score} من ${items.length}</h2><p>${score===items.length?'ممتاز! تعرف الفرق جيدًا.':'جيد! راجع البطاقات وحاول مرة أخرى.'}</p><div class="cbtns"><button class="try" id="qa">↺ أعد</button>${u.mistakes?`<button class="watch" id="qm">⚠️ أخطاء شائعة ←</button>`:`<button class="watch" id="qm">💻 مهمة على جهازك ←</button>`}</div></div>`;
    $('#qa').onclick=renderCompare;$('#qm').onclick=()=>setMode(u.mistakes?'mistakes':'task');confetti()};
  draw();
}
/* ---------- mistakes quiz ---------- */
const FIX_POOL=['استخدم Tab','اضغط Esc للعودة','انقر على الكائن أولًا','تراجع فورًا بـ Ctrl + Z','حدِّد النص أولًا، ثم نسِّق','استخدم فاصل الصفحات Ctrl + Enter','إدراج ← رمز','تخطيط ← الهوامش','التفاف النص ← مربع','مراجع ← تحديث الجدول'];
function renderMistakes(){
  const u=curUnit;const items=u.mistakes;let i=0,score=0;
  const draw=()=>{const m=items[i];const others=[...items.filter(x=>x!==m).map(x=>x.f),...FIX_POOL].filter((f,k,a)=>f!==m.f&&a.indexOf(f)===k);const opts=[m.f,...others.sort(()=>Math.random()-.5).slice(0,2)].sort(()=>Math.random()-.5);
    $('#panel').innerHTML=`<div class="qwrap"><div class="qtop"><h3>⚠️ أخطاء شائعة… وكيف نتجنّبها</h3><div class="qprog">${items.map((_,k)=>`<i class="${k<i?'d':k===i?'c':''}"></i>`).join('')}</div></div>
      <div class="mist"><span class="mx">✗</span><div><small>الخطأ</small><b>${m.m}</b></div></div><div class="qq">ما الحل الصحيح؟</div>
      <div class="qopts col">${opts.map(o=>`<button data-o="${o.replace(/"/g,'&quot;')}">✓ ${o}</button>`).join('')}</div><div class="qfb" id="qfb"></div></div>`;
    $$('#panel [data-o]').forEach(b=>b.onclick=()=>{const ok=b.dataset.o===m.f;if(ok)score++;$$('#panel [data-o]').forEach(x=>{x.disabled=true;if(x.dataset.o===m.f)x.classList.add('ok');else if(x===b)x.classList.add('bad')});
      $('#qfb').innerHTML=`<div class="${ok?'good':'nope'}">${ok?'✓ صحيح!':'✗ الحل الصحيح: '+m.f}</div><button class="qnext">${i<items.length-1?'التالي ←':'النتيجة'}</button>`;$('#qfb .qnext').onclick=()=>{i++;if(i<items.length)draw();else done()}})};
  const done=()=>{const p=UP(u.id);p.misDone=1;p.misScore=score;saveP();renderHome();
    $('#panel').innerHTML=`<div class="qwrap res"><div class="stars big">${'⭐'.repeat(Math.max(1,Math.round(score/items.length*3)))}</div><h2>${score} من ${items.length}</h2><p>${score===items.length?'رائع! لن تقع في هذه الأخطاء.':'تذكّر الحلول الصحيحة وحاول مرة أخرى.'}</p><div class="cbtns"><button class="try" id="qa">↺ أعد</button><button class="watch" id="qm">💻 مهمة على جهازك ←</button></div></div>`;
    $('#qa').onclick=renderMistakes;$('#qm').onclick=()=>setMode('task');confetti()};
  draw();
}
/* ---------- on-device task ---------- */
const chips=s=>s.split(/\s*←\s*/).map(x=>`<span class="chip">${x}</span>`).join('<i class="arr">←</i>');
function renderTask(){
  const u=curUnit,t=u.task,p=UP(u.id);
  if(!$('#panel').dataset.keepSim)applySetup(u.exploreSetup||u.practice?.[0]?.setup||{});
  $('#panel').innerHTML=`<div class="phead"><h3>💻 مهمة على جهازك</h3><span class="mins">${t.min} دقائق</span></div>
   <div class="tbox"><div class="th"><span class="tic">🖥️</span><div><b>المطلوب</b><small>نفّذ على جهازك، ثم ضع إشارة ✓</small></div></div>
   ${t.items.map((x,i)=>`<label class="titem ${p.task[i]?'done':''}"><span class="tn">${i+1}</span><span class="tt">${x.t}</span><input type="checkbox" data-t="${i}" ${p.task[i]?'checked':''}></label>`).join('')}</div>
   <div class="tbox sol" id="sol"><div class="th"><span class="tic g">✔</span><div><b>الحل</b><small>حاول أولًا، ثم قارن خطواتك</small></div></div>
   ${t.items.map((x,i)=>`<div class="sitem"><span class="tn">${i+1}</span><span class="sp">${chips(x.s)}</span></div>`).join('')}<button class="reveal" id="rev">اعرض الحل</button></div>
   <div class="ptip">💡 لا يوجد Word على جهازك الآن؟ جرّب الخطوات على المحاكي بجانبك.</div>`;
  $$('#panel [data-t]').forEach(c=>c.onchange=()=>{p.task[c.dataset.t]=c.checked;saveP();c.closest('.titem').classList.toggle('done',c.checked);if(Object.values(p.task).filter(Boolean).length===t.items.length)confetti()});
  $('#rev').onclick=()=>{$('#sol').classList.add('shown');$('#rev').remove()};
}
