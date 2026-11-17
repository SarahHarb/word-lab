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
async function typeInto(el,text,end=true){if(!el)return;if(!doc.contains(el)){const r=document.createRange();r.selectNodeContents(el);r.collapse(false);el.focus();const s=getSelection();s.removeAllRanges();s.addRange(r);for(const ch of text){ex('insertText',ch);await wait(60)}el.dispatchEvent(new Event('input',{bubbles:true}));return}if(!(S.range&&el.contains(S.range.startContainer)))placeCaretIn(el,!end);restoreSel();for(const ch of text){ex('insertText',ch);await wait(60)}S.range=curRange()?.cloneRange()||S.range}
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
  CO.mode='won';hideCoach();const u=UP(CO.unit.id);u.p[CO.itemI]=true;saveP();renderDots(99);confetti();renderBars();setTimeout(()=>showSimCard('won'),450);return true}

/* ---------- confetti ---------- */
function confetti(){const C=['#2b579a','#1e8e3e','#f4b400','#d32f2f','#7b3fa6','#00a3d9'];const r=$('#sim').getBoundingClientRect();
  for(let i=0;i<70;i++){const e=document.createElement('i');e.className='cf';e.style.left=(r.left+Math.random()*r.width)+'px';e.style.top=(r.top-10)+'px';e.style.background=C[i%C.length];e.style.animationDelay=(Math.random()*.4)+'s';e.style.setProperty('--dx',(Math.random()*160-80)+'px');e.style.setProperty('--rot',(Math.random()*720)+'deg');document.body.appendChild(e);setTimeout(()=>e.remove(),2600)}}

/* ---------- app shell: sections bar + lesson strip + goal + simulator ---------- */
function allUnits(){return UNITS.flatMap(s=>s.units||[s])}
const isDone=(u,i)=>!!UP(u.id).p[i];
const unitDone=u=>(u.practice||[]).every((_,i)=>isDone(u,i));
function renderBars(){
  const all=allUnits();let d=0,t=0;all.forEach(u=>(u.practice||[]).forEach((_,i)=>{t++;if(isDone(u,i))d++}));
  $('#gprog').innerHTML=`<span>⭐ ${d} / ${t}</span><div class="bar"><i style="width:${t?d/t*100:0}%"></i></div>`;
  $('#secbar').innerHTML=all.map(u=>`<button data-u="${u.id}" class="${u===CO.unit?'on':''} ${unitDone(u)?'done':''}"><small>${u.num}</small><bdi>${u.title}</bdi>${unitDone(u)?' ✓':''}</button>`).join('');
  $$('#secbar [data-u]').forEach(b=>b.onclick=()=>{const u=all.find(x=>x.id===b.dataset.u);const i=u.practice.findIndex((_,k)=>!isDone(u,k));openLesson(u,i<0?0:i)});
  const u=CO.unit;if(!u)return;
  $('#strip').innerHTML=u.practice.map((it,i)=>`<button data-l="${i}" class="ls ${i===CO.itemI?'on':''} ${isDone(u,i)?'done':''}"><span class="li">${isDone(u,i)?'✓':i+1}</span><span class="lt">${it.t}</span></button>`).join('');
  $$('#strip [data-l]').forEach(b=>b.onclick=()=>openLesson(u,+b.dataset.l));
  $('#goal').textContent=CO.item?CO.item.t:'';
  const on=$('#secbar .on');if(on)on.scrollIntoView({block:'nearest',inline:'nearest'});const ls=$('#strip .on');if(ls)ls.scrollIntoView({block:'nearest',inline:'nearest'});
}
function renderDots(i){const d=$('#dots');if(!d||!CO.item)return;d.innerHTML=CO.item.steps.map((_,k)=>`<i class="${k<i||i===99?'d':k===i?'c':''}"></i>`).join('')}
function openLesson(u,i){CO.mode='idle';hideCoach();cur().style.display='none';CO.unit=u;CO.itemI=i;CO.item=u.practice[i];CO.lastI=null;
  try{localStorage.setItem(PKEY+'-last',u.id+':'+i)}catch(e){}
  applySetup(CO.item.setup||{});renderBars();renderDots(-1);showSimCard('start')}
function startItem(){openLesson(CO.unit,CO.itemI)}
function tryItem(){hideSimCard();applySetup(CO.item.setup||{});CO.lastI=null;setTimeout(()=>{CO.mode='try'},80)}
async function watchItem(){
  hideSimCard();applySetup(CO.item.setup||{});await wait(120);CO.mode='demo';$('#blocker').style.display='block';
  const c=cur();c.style.display='block';c.style.transitionDuration='0ms';const r=$('#sim').getBoundingClientRect();c.style.left=(r.left+r.width/2)+'px';c.style.top=(r.top+r.height/2)+'px';await wait(250);
  const st=CO.item.steps;
  for(let i=0;i<st.length;i++){if(CO.mode!=='demo')break;const s=st[i];let el=null;try{el=s.el()}catch(e){}
    if(!el){await wait(350);try{el=s.el()}catch(e){}}if(!el)break;if(canvas.contains(el)||el.closest('#ribbon'))el.scrollIntoView({block:'nearest',inline:'nearest'});await wait(60);
    renderDots(i);placeCoach(el,s.say,i+1);await moveCursorTo(el);if(s.pre){s.pre();await wait(400)}await clickFx();
    try{await (s.act&&s.act())}catch(e){console.error(e)}await wait(900);}
  hideCoach();c.style.display='none';$('#blocker').style.display='none';
  if(CO.mode==='demo'){CO.mode='idle';showSimCard('turn')}
}
function nextLesson(){const all=allUnits();let u=CO.unit,i=CO.itemI+1;if(i>=u.practice.length){const k=all.indexOf(u);u=all[(k+1)%all.length];i=0}openLesson(u,i)}
function showSimCard(kind){const it=CO.item,o=$('#simcard');if(!it)return;const u=CO.unit;
  if(kind==='start')o.innerHTML=`<div class="ocard"><div class="big">${icon(u.icon,46)}</div><small class="sec">${u.num} · ${u.title}</small><h2>${it.t}</h2>${it.hint?`<div class="after">💡 ${it.hint}</div>`:''}<div class="cbtns"><button class="watch" data-a="watch">▶ شاهد كيف</button><button class="try" data-a="try">✋ جرّب بنفسك</button></div></div>`;
  if(kind==='turn')o.innerHTML=`<div class="ocard"><div class="big">👏</div><h2>الآن دورك!</h2><p>🎯 ${it.t}</p><div class="cbtns"><button class="try" data-a="try">✋ ابدأ</button><button class="ghost" data-a="watch">▶ شاهد مرة أخرى</button></div></div>`;
  if(kind==='won'){const last=CO.itemI===u.practice.length-1;o.innerHTML=`<div class="ocard"><div class="stars"><span>⭐</span><span>⭐</span><span>⭐</span></div><h2>أحسنت!</h2><p>${it.t} ✓</p>${it.after?`<div class="after">💡 ${it.after}</div>`:''}${last&&u.tip?`<div class="after">📌 ${u.tip}</div>`:''}<div class="cbtns"><button class="try" data-a="next">${last?'القسم التالي ←':'الدرس التالي ←'}</button><button class="ghost" data-a="again">↺ أعد</button><button class="ghost" data-a="free">✏️ تابع على المحاكي</button></div></div>`}
  o.className='simcard show '+kind;
  o.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='watch')watchItem();if(a==='try')tryItem();if(a==='again')startItem();if(a==='free')hideSimCard();if(a==='next')nextLesson()});
}
function hideSimCard(){$('#simcard').className='simcard'}
/* ---------- fit simulator to any screen ---------- */
window.SIMSCALE=1;
function fitSim(){
  const wrap=$('.simwrap'),sim=$('#sim');if(!wrap||!sim)return;
  const W=wrap.clientWidth,H=wrap.clientHeight;const base=W<900?Math.max(W,880):0;
  if(base&&base>W){const s=W/base;SIMSCALE=s;Object.assign(sim.style,{position:'absolute',top:'0',right:'0',width:base+'px',height:(H/s)+'px',transform:`scale(${s})`,transformOrigin:'top right',flex:'none'})}
  else{SIMSCALE=1;Object.assign(sim.style,{position:'',top:'',right:'',width:'',height:'',transform:'',transformOrigin:'',flex:''})}
}
addEventListener('resize',()=>{fitSim();closeMenus()});
function initApp(){
  fitSim();let u=allUnits()[0],i=0;try{const l=(localStorage.getItem(PKEY+'-last')||'').split(':');const x=allUnits().find(v=>v.id===l[0]);if(x&&x.practice[+l[1]]){u=x;i=+l[1]}}catch(e){}
  $('#watchBtn').onclick=()=>watchItem();$('#againBtn').onclick=()=>startItem();
  openLesson(u,i);
}
