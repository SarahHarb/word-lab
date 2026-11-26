/* ================= Learning layer: units, coach, quizzes ================= */
const PKEY='wordlab-guide-v2';
let P={};try{P=JSON.parse(localStorage.getItem(PKEY)||'{}')}catch(e){}
const saveP=(noCloud)=>{try{localStorage.setItem(PKEY,JSON.stringify(P))}catch(e){};if(!noCloud&&window.cloudSave)cloudSave()};
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
const E=(el,say,done=no,act,pre)=>{const f=typeof el==='string'?()=>$$(el).find(vis)||$(el):el;return {el:f,say,done,act:act||(()=>{const e=f();if(e)e.click()}),pre}};
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
  S.selCells=[];S.curCell=null;S.obj=null;S.pen=null;
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
function gMark(el){const o=window.__gEl;if(o&&o!==el)o.classList.remove('g-tgt');window.__gEl=el;if(el)el.classList.add('g-tgt')}
function hideCoach(){gMark(null);$('#ring').style.display='none';$('#bubble').style.display='none'}
/* visible area in page px (works with pinch-zoom on phones) */
document.addEventListener('scroll',e=>{const t=e.target;if(!t||t.nodeType!==1){const vv=window.visualViewport;if((!vv||vv.scale<=1.01)&&(scrollX||scrollY))scrollTo(0,0);return}
  if(t.closest&&t.closest('#doc'))return;const c=getComputedStyle(t);if(c.overflowX==='hidden'&&t.scrollLeft)t.scrollLeft=0;if(c.overflowY==='hidden'&&t.scrollTop)t.scrollTop=0},true);
function OX(){const h=document.getElementById('ovl');const o=h?h.getBoundingClientRect():{left:-scrollX,top:-scrollY};return{x:-o.left,y:-o.top}}
function VP(){const O=OX(),v=window.visualViewport;if(v)return{l:v.offsetLeft+O.x,t:v.offsetTop+O.y,w:v.width,h:v.height,s:v.scale||1};return{l:O.x,t:O.y,w:LW(),h:LH(),s:1}}
/* rect that really lies under the element (self-check with hit-testing; fixes browser zoom quirks) */
function realRect(el){const R=el.getBoundingClientRect();if(typeof doc==="undefined"||!doc||!doc.contains(el))return R;
  const hits=r=>{const x=r.left+r.width/2,y=r.top+r.height/2;if(x<0||y<0||x>LW()||y>LH())return null;const h=document.elementFromPoint(x,y);return !!h&&(h===el||el.contains(h))};
  const h0=hits(R);if(h0!==false)return R;const z=parseFloat(doc.style.zoom)||1;if(z===1)return R;
  for(const [p,q] of [[z,1],[z,z],[1,z],[1/z,1],[1/z,1/z]]){const c=new DOMRect(R.left*p,R.top*p,R.width*q,R.height*q);if(hits(c))return c}return R}
/* زر في الشريط خارج الشاشة (الجوال): مرّر الشريط إليه أولًا، فلا تخرج الحلقة/الفقاعة خارج الصفحة */
function revealInStrip(el){if(!el||!el.closest||!el.closest('#ribbon,#wtabs')||el.closest('.dd'))return;let p=el.parentElement;
  while(p&&p!==document.body&&!p.contains(doc)){const c=getComputedStyle(p);if(/(auto|scroll)/.test(c.overflowX)&&p.scrollWidth>p.clientWidth+4){const r=el.getBoundingClientRect(),pr=p.getBoundingClientRect();if(r.left<pr.left+6||r.right>pr.right-6)p.scrollLeft+=(r.left+r.width/2)-(pr.left+pr.width/2)}p=p.parentElement}}
function placeCoach(el,html,num){try{revealInStrip(el)}catch(e){}
  const R=realRect(el),ring=$('#ring'),b=$('#bubble'),V=VP(),O=OX();
  const r={left:R.left+O.x,top:R.top+O.y,width:R.width,height:R.height,right:R.right+O.x,bottom:R.bottom+O.y};
  gMark(el);const pz=V.s>1.04;
  ring.style.display=pz?'none':'block';Object.assign(ring.style,{left:(r.left-4)+'px',top:(r.top-4)+'px',width:(r.width+8)+'px',height:(r.height+8)+'px'});
  const h=(num!=null?`<b>${num}</b>`:'')+html;if(b.dataset.h!==h){b.innerHTML=h;b.dataset.h=h}b.style.display='block';
  const k=1/Math.max(1,V.s);b.style.transform=k<1?`scale(${k})`:'';b.dataset.k=k;
  const bw=b.offsetWidth*k,bh=b.offsetHeight*k;const inV=r.right>V.l&&r.left<V.l+V.w&&r.bottom>V.t&&r.top<V.t+V.h;if(!inV){V.l=O.x;V.t=O.y;V.w=LW();V.h=LH()}const vb=V.t+V.h,vr=V.l+V.w;
  const below=r.bottom+bh+20<vb||r.top-bh-12<V.t;let x=r.left+r.width/2-bw/2;x=Math.max(V.l+6,Math.min(vr-bw-6,x));
  b.style.left=x+'px';b.style.top=(below?r.bottom+12*k:Math.max(V.t+6,r.top-bh-12*k))+'px';b.className=pz?'free':below?'down':'up';b.style.setProperty('--ax',Math.max(14,Math.min(bw/k-14,(r.left+r.width/2-x)/k))+'px');
}
const cur=()=>$('#cursor');
function moveCursorTo(el,ms=650){if(!el)return wait(0);const r=el.getBoundingClientRect();const c=cur();c.style.display='block';c.style.transitionDuration=ms+'ms';c.style.left=(r.left+r.width/2)+'px';c.style.top=(r.top+r.height/2)+'px';return wait(ms)}
async function clickFx(){const c=cur();c.classList.add('click');await wait(200);c.classList.remove('click')}
function stepIdx(it){const st=it.steps;for(let i=0;i<st.length;i++){let d=false;try{d=st[i].done()}catch(e){}if(!d)return i}return st.length-1}
setInterval(()=>{
  if(CO.mode==='do'&&CO.item){renderReqs();const all=CO.item.reqs.every(r=>{try{return r.check()}catch(e){return false}});if(all)checkItem();return}
  if(CO.mode==='try'&&CO.item){
    if(checkItem())return;
    const i=stepIdx(CO.item),s=CO.item.steps[i];CO.idx=i;renderDots(i);let el=null;try{el=s.el()}catch(e){}
    if(!el||!vis(el)){hideCoach();return}if(CO.lastI!==i){CO.lastI=i;if(canvas.contains(el)){const cr=canvas.getBoundingClientRect(),er=el.getBoundingClientRect();if(er.bottom<cr.top||er.top>cr.bottom)el.scrollIntoView({block:'center'})}}placeCoach(el,s.say,i+1);
  }else if(CO.mode==='explore'&&CO.exEl){if(vis(CO.exEl))placeCoach(CO.exEl,CO.exHtml);else{hideCoach();CO.exEl=null}}
},180);
function checkItem(){if(window.PLAY&&PLAY.on)return false;let ok=false;try{ok=!!CO.item.check()}catch(e){}if(!ok)return false;
  CO.mode='won';hideCoach();clearHints();const u=UP(CO.unit.id);u.p[CO.item.key]=true;saveP();renderDots(99);confetti();renderNav2();renderHead();okToast();return true}
function okToast(){let t=$('#oktoast');if(!t){t=document.createElement('div');t.id='oktoast';document.body.appendChild(t)}t.innerHTML='✓ أحسنت — حلّك صحيح';t.classList.remove('show');void t.offsetWidth;t.classList.add('show');clearTimeout(okToast.tm);okToast.tm=setTimeout(()=>t.classList.remove('show'),1800)}
function showWonBar(){let b=$('#wonbar');const w=$('.simwrap');if(!w)return;if(!b){b=document.createElement('div');b.id='wonbar';w.appendChild(b)}
  b.innerHTML=`<span class="wb-s">⭐</span><span><b>أحسنت! جدولك مطابق للصورة</b><small>${CO.item.t} ✓ — قارن جدولك بالصورة، وتابع متى شئت.</small></span><button class="wb-n">التالي ←</button><button class="wb-x" aria-label="إغلاق">✕</button>`;
  b.querySelector('.wb-n').onclick=()=>{b.remove();nextLesson()};b.querySelector('.wb-x').onclick=()=>b.remove()}

/* ---------- confetti ---------- */
function confetti(){const C=['#2b579a','#1e8e3e','#f4b400','#d32f2f','#7b3fa6','#00a3d9'];const r=$('#sim').getBoundingClientRect();
  for(let i=0;i<70;i++){const e=document.createElement('i');e.className='cf';e.style.left=(r.left+Math.random()*r.width)+'px';e.style.top=(r.top-10)+'px';e.style.background=C[i%C.length];e.style.animationDelay=(Math.random()*.4)+'s';e.style.setProperty('--dx',(Math.random()*160-80)+'px');e.style.setProperty('--rot',(Math.random()*720)+'deg');document.body.appendChild(e);setTimeout(()=>e.remove(),2600)}}

/* ================= app shell ================= */
function allUnits(){return TOPICS}
const L=u=>buildTopic(u);
const isDone=(u,l)=>!!UP(u.id).p[l.key];
const ORDER_E1=['c:rand','c:fontName','c:fontSize','c:grow','c:bold','c:strike','c:sup','c:textfx','c:fontcolor','c:highlight','c:clearfmt','c:alignR','c:alignC','c:alignL','c:justify','c:bullets','c:numbering','c:multilevel','c:indentInc','c:linespacing','c:pshading','c:sort','c:style-title','c:style-h1','c:style-h2','c:style-normal','c:copy','c:cut','c:paste','c:painter','c:find','c:replace','c:select','c:marks'];
const TIPS={};
function buildTips(){UNITS.flatMap(s=>s.units||[s]).forEach(u=>(u.explore||[]).forEach(c=>{if(c.t&&!TIPS[c.t])TIPS[c.t]={n:c.n,d:c.d,k:c.key}}));$$('#ribbon [title]').forEach(e=>{e.dataset.tip=e.getAttribute('title');e.removeAttribute('title')})}
/* screen tips (like Word) */
let tipT;
function showTip(el){const t=$('#rtip');const hid=el.dataset.hid||el.closest('[data-hid]')?.dataset.hid;const info=TIPS[hid]||{};const lab=info.n||el.dataset.tip||el.querySelector('span')?.textContent||'';if(!lab)return;
  t.innerHTML=`<b>${lab.replace(/▾/g,'')}</b>${info.d||el.dataset.tip&&el.dataset.tip!==lab?`<p>${info.d||el.dataset.tip}</p>`:''}${info.u?`<p class="tu">🧭 متى نستخدمه؟ ${info.u}</p>`:''}${info.k?`<kbd>${info.k}</kbd>`:''}`;t.style.display='block';const r=el.getBoundingClientRect(),V=VP(),O=OX();let x=r.left+O.x+r.width/2-t.offsetWidth/2;x=Math.max(V.l+6,Math.min(V.l+V.w-t.offsetWidth-6,x));t.style.left=x+'px';t.style.top=(r.bottom+O.y+6)+'px'}
function hideTip(){clearTimeout(tipT);$('#rtip').style.display='none'}
document.addEventListener('mouseover',e=>{const el=e.target.closest&&e.target.closest('#ribbon .rb,#ribbon .rck,#ribbon .rnum,#ribbon .rsel,#ribbon .gi');if(!el||$('.ddw.open')){if(!e.target.closest||!e.target.closest('#ribbon'))hideTip();return}clearTimeout(tipT);tipT=setTimeout(()=>showTip(el),350)});
document.addEventListener('mousedown',hideTip,true);
/* hit detection for command lessons */
['click','change'].forEach(ev=>document.addEventListener(ev,e=>{const f=CO.item&&CO.item.final;if(!f||!e.target.closest)return;if(e.target.closest(f))setTimeout(()=>{if(CO.mode==='try'||CO.mode==='free'||CO.mode==='demo')CO.hit=true},40)},true));
/* nav */
let openTopic=null;const secOpen={},grpOpen={};
const TOPIC_FILES={t5:[['files/tables-exercises.docx','تمارين الجداول.docx']],t10:[['files/pictures-exercises.docx','تمارين الصور.docx']],t4:[['files/shapes-exercises.docx','تمارين الأشكال.docx']],t11:[['files/wordart-exercises.docx','تمارين WordArt.docx']]};
function renderNav2(){
  const all=allUnits();let d=0,t=0;all.forEach(u=>L(u).forEach(l=>{t++;if(isDone(u,l))d++}));
  $('#sprog').innerHTML=`<div class="pt"><span>تقدّمك</span><b>${d} / ${t}</b></div><div class="bar"><i style="width:${t?d/t*100:0}%"></i></div>`;
  const tag=l=>l.level?`<em class="tag lv">${l.level}</em>`:l.kind==='do'?'<em class="tag do">نفّذ</em>':l.problem?'<em class="tag pr">مشكلة</em>':'';
  const wsBtn=`<button class="wsbtn ${CO.ws?'on':''}" id="wsBtn"><span class="tic">${icon('pen',22)}</span><span class="tt"><b>مساحتي الحرة</b><small>جرّب أي شيء على Word بحرية</small></span></button>`;
  $('#topics').innerHTML=wsBtn+all.map(u=>{if(!isUnlocked(u))return `<div class="topic locked"><div class="th"><span class="tic">${icon(u.icon,22)}</span><span class="tt"><b>${u.title}</b><small>لم يُفتح بعد</small></span><span class="lock">🔒</span></div></div>`;const ls=L(u),dn=ls.filter(l=>isDone(u,l)).length,op=u===openTopic;
    const sec=(k,title,arr)=>{if(!arr.length)return '';const id=u.id+k;const has=arr.includes(CO.item)&&CO.unit===u;if(secOpen[id]==null)secOpen[id]=has||k==='l';const o=secOpen[id];const sd=arr.filter(l=>isDone(u,l)).length;
      return `<div class="sec ${o?'open':''}"><button class="sh" data-s="${id}"><span class="chev">‹</span>${title}<small>${sd}/${arr.length}</small></button>${o?`<div class="sl">${arr.map((l,k)=>{const i=ls.indexOf(l);let gh='';if(l.g&&(k===0||arr[k-1].g!==l.g)){const gid=u.id+'|'+l.g;const ga=arr.filter(x=>x.g===l.g);const gdn=ga.filter(x=>isDone(u,x)).length;if(grpOpen[gid]==null)grpOpen[gid]=(CO.unit===u&&ga.includes(CO.item))||(CO.unit!==u&&ga.some(x=>!isDone(u,x))&&!arr.slice(0,k).some(x=>!isDone(u,x)));gh=`<button class="lg lgb ${grpOpen[gid]?'open':''}" data-g="${gid}"><span class="chev">‹</span><span class="lgt">${l.g}</span><small>${gdn}/${ga.length}</small></button>${grpOpen[gid]&&l.gd?`<div class="lgd">${l.gd}</div>`:''}`}if(l.g&&!grpOpen[u.id+'|'+l.g])return gh;return gh+`<button class="lrow ${CO.unit===u&&CO.item===l?'on':''} ${isDone(u,l)?'done':''}" data-u="${u.id}" data-i="${i}"><span class="st">${isDone(u,l)?'✓':''}</span><span class="lt">${l.t}</span>${tag(l)}</button>`}).join('')}</div>`:''}</div>`};
    return `<div class="topic ${op?'open':''} ${CO.unit===u?'cur':''}"><button class="th" data-t="${u.id}"><span class="tic">${icon(u.icon,22)}</span><span class="tt"><b>${u.title}</b><small>${u.sub}</small></span><span class="tc">${dn}/${ls.length}</span><span class="chev">‹</span></button>
      ${op?`<div class="tbody">${(TOPIC_FILES[u.id]||[]).map(f=>`<a class="tfile" href="${f[0]}" download="${f[1]}"><span class="fi">W</span><span><b>${f[1].replace('.docx','')}</b><small>ملف Word للتحميل</small></span><span class="dl">⬇</span></a>`).join('')}${sec('l',u.learnTitle||'تعلّم',ls.filter(l=>l.key[0]==='l'&&!l.proj))}${sec('t','تحدَّ نفسك',ls.filter(l=>l.key[0]!=='l'))}</div>`:''}</div>`}).join('');
  $('#wsBtn').onclick=()=>{openWorkspace();document.body.classList.remove('drawer')};
  $$('#topics [data-t]').forEach(b=>b.onclick=()=>{const u=all.find(x=>x.id===b.dataset.t);openTopic=openTopic===u?null:u;renderNav2()});
  $$('#topics [data-s]').forEach(b=>b.onclick=()=>{secOpen[b.dataset.s]=!secOpen[b.dataset.s];renderNav2()});
  $$('#topics [data-g]').forEach(b=>b.onclick=()=>{grpOpen[b.dataset.g]=!grpOpen[b.dataset.g];renderNav2()});
  $$('#topics [data-i]').forEach(b=>b.onclick=()=>{const u=all.find(x=>x.id===b.dataset.u);openLesson(u,+b.dataset.i);document.body.classList.remove('drawer')});
  const on=$('#topics .lrow.on');if(on)on.scrollIntoView({block:'nearest'});
}
function wsDownload(){const last=localStorage.getItem(PKEY+'-wsname')||'';dialog({title:'تنزيل ملف Word',w:440,body:`<p style="margin:0 0 10px">سيُحفظ عملك كملف Word حقيقي (.docx) على جهازك، وتستطيع فتحه في Word على اللابتوب أو الجوال.</p><label class="row">اسم الملف: <input type="text" id="dlName" value="${last||'مستندي'}" style="flex:1"></label>`,
  buttons:[{label:'⬇ تنزيل',pri:1,act:()=>{const n=$('#dlName').value.trim()||'مستندي';try{localStorage.setItem(PKEY+'-wsname',n)}catch(e){}setTimeout(()=>exportDocx(n),50)}},{label:'إلغاء'}]})}
function renderHead(){
  if(CO.ws){$('#lhead').innerHTML=`<button class="menu" id="menuBtn" aria-label="الدروس">☰</button><div class="lt"><div class="crumb">مساحتي الحرة</div><h1>اعمل ما تريد على Word</h1><p>بلا قيود ولا تقييم — يُحفظ عملك تلقائيًا على هذا الجهاز.</p></div><div class="la"><button class="b pri" id="wsDl" title="تنزيل ما كتبته كملف Word على جهازك">⬇ تنزيل ملف Word</button><button class="b" id="wsNew">📄 مستند جديد</button></div>`;$('#menuBtn').onclick=()=>document.body.classList.toggle('drawer');$('#wsDl').onclick=wsDownload;$('#wsNew').onclick=()=>{if(confirmWs()){localStorage.removeItem(PKEY+'-ws');openWorkspace()}};fitSim();return}
  const u=CO.unit,l=CO.item;if(!u||!l)return;const ls=L(u),i=ls.indexOf(l);
  const sec=l.goalImg?'صمّم مثل الصورة':l.kind==='learn'?'تعلّم':'تحدَّ نفسك';
  $('#lhead').innerHTML=`<button class="menu" id="menuBtn" aria-label="الدروس">☰</button>
   <div class="lt"><div class="crumb">${u.num} ${u.title} <i>›</i> ${sec}${l.level?` <em class="tag lv">${l.level}</em>`:l.kind==='do'?' <em class="tag do">نفّذ</em>':l.problem?' <em class="tag pr">مشكلة</em>':''}</div><h1>${l.t}</h1>${l.hint?`<p>💡 ${l.hint}</p>`:''}${l.proj?projBar(l):''}${l.kind==='do'&&!l.goalImg&&l.reqs.length>6?'<div class="reqs many" id="reqs"></div>':''}</div>
   <div class="la">${l.kind==='do'?`${l.reqs.length>6||l.goalImg?'':'<div class="reqs" id="reqs"></div>'}<button class="b pri" id="verify">✔ تحقّق</button><button class="b" id="solBtn" title="يعرض الحل وحده كأنه فيديو، ثم يعيد التمرين كما كان">▶ شاهد الحل</button>`:`<span class="dots" id="dots"></span><button class="b ${CO.mode==='demo'?'red':'blue'}" id="hw">${CO.mode==='demo'?'⏹ إيقاف المشاهدة':'▶ شاهد الحل'}</button>`}<button class="b" id="hr" title="من جديد">↺</button><button class="b" id="hn" title="التالي">التالي ‹</button></div>`;
  $('#menuBtn').onclick=()=>document.body.classList.toggle('drawer');
  $('#hr').onclick=()=>startItem();$('#hn').onclick=()=>nextLesson();
  if(l.kind==='do'){$('#verify').onclick=verify;$('#solBtn').onclick=()=>playSolution();renderReqs()}else{$('#hw').onclick=()=>CO.mode==='demo'?stopDemo():watchItem();renderDots(CO.mode==='won'?99:-1)}
  fitSim();
}
function renderReqs(){renderRefList();const b=$('#reqs');if(!b||!CO.item.reqs)return;const h=CO.item.reqs.map((r,i)=>{let ok=false;try{ok=!!r.check()}catch(e){}return `<span class="rq ${ok?'ok':CO.bad===i?'bad':''}" data-r="${i}">${ok?'✓':CO.bad===i?'✗':i+1} ${r.t}</span>`}).join('');if(b.innerHTML!==h){b.innerHTML=h;b.querySelectorAll('[data-r]').forEach(x=>x.onclick=()=>showReqHint(+x.dataset.r))}}
function clearHints(){$$('.hintpulse').forEach(e=>e.classList.remove('hintpulse'))}
function showReqHint(i){const r=CO.item.reqs[i];CO.bad=i;renderReqs();clearHints();let el=null;try{el=r.where&&r.where()}catch(e){}
  if(r.cmd){const tab=tabOfCmd(r.cmd);const b=tab&&$(`#ribbon [data-panel="${tab}"] [data-hid="${r.cmd}"]`);const tb=tab&&$(`#wtabs [data-tab="${tab}"]`);if(tb)tb.classList.add('hintpulse');if(b)b.classList.add('hintpulse')}
  const html=`<span class="bt">✗ ${r.t}</span>${fixOf(r)}`;if(el&&vis(el)){if(canvas.contains(el))el.scrollIntoView({block:'center'});CO.exEl=el;CO.exHtml=html;CO.mode='do';placeCoach(el,html)}else{simToast(fixOf(r))}}
function verify(){const rs=CO.item.reqs;const ok=rs.map(r=>{try{return !!r.check()}catch(e){return false}});let bad=CO.focus!=null&&!ok[CO.focus]?CO.focus:rs.findIndex((r,i)=>!ok[i]&&(r.need||[]).every(k=>ok[k]));if(bad<0)bad=ok.indexOf(false);if(bad<0){checkItem();return}showReqHint(bad)}
setInterval(()=>{if(CO.mode==='do'&&CO.exEl){if(vis(CO.exEl))placeCoach(CO.exEl,CO.exHtml);else hideCoach()}},250);
document.addEventListener('mousedown',e=>{if(CO.mode==='do'&&CO.exEl&&!e.target.closest('#reqs,#verify')){CO.exEl=null;hideCoach()}},true);
function renderDots(i){const d=$('#dots');if(!d||!CO.item||!CO.item.steps)return;d.innerHTML=CO.item.steps.map((_,k)=>`<i class="${k<i||i===99?'d':k===i?'c':''}"></i>`).join('')}
function openLesson(u,i){CO.ws=false;CO.mode='idle';CO.exEl=null;hideCoach();clearHints();hideTip();cur().style.display='none';const ls=L(u);CO.unit=u;CO.itemI=i;CO.item=ls[i]||ls[0];CO.lastI=null;CO.hit=false;CO.bad=null;openTopic=u;
  try{localStorage.setItem(PKEY+'-last',u.id+':'+CO.item.key)}catch(e){}
  applySetup(CO.item.setup||{});renderNav2();renderHead();hideSimCard();closeGoal();$('#wonbar')?.remove();CO.focus=null;if(CO.item.goalImg)showRef(CO.item.goalImg);else if(CO.item.proj)showRef(projGoalHTML(),'الشكل النهائي للجدول');else hideRef();renderRefList();if(CO.item.proj&&CO.item.proj.i===0&&!isDone(u,CO.item)){showSimCard('proj');return}if(CO.item.goalImg){tryItem();return}setTimeout(()=>{if(CO.mode==='idle'){CO.hit=false;CO.mode=CO.item.kind==='do'?'do':'try';renderHead()}},120)}
function startItem(){openLesson(CO.unit,L(CO.unit).indexOf(CO.item))}
function tryItem(){hideSimCard();applySetup(CO.item.setup||{});CO.lastI=null;CO.hit=false;setTimeout(()=>{CO.hit=false;CO.mode=CO.item.kind==='do'?'do':'try'},90)}
function stopDemo(){if(CO.mode!=='demo')return;CO.mode='idle';hideCoach();hideTip();cur().style.display='none';$('#blocker').style.display='none';$('#stopDemo').style.display='none';document.body.classList.remove('demo');tryItem();renderHead()}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&CO.mode==='demo')stopDemo()},true);
async function watchItem(){
  hideSimCard();applySetup(CO.item.setup||{});await wait(120);CO.hit=false;CO.mode='demo';$('#blocker').style.display='block';$('#stopDemo').style.display='flex';document.body.classList.add('demo');renderHead();
  const c=cur();c.style.display='block';c.style.transitionDuration='0ms';const r=$('#sim').getBoundingClientRect();c.style.left=(r.left+r.width/2)+'px';c.style.top=(r.top+r.height/2)+'px';await wait(250);
  const st=CO.item.steps;
  for(let i=0;i<st.length;i++){if(CO.mode!=='demo')break;const s=st[i];let el=null;try{el=s.el()}catch(e){}
    if(!el){await wait(350);try{el=s.el()}catch(e){}}if(!el)break;if(canvas.contains(el))el.scrollIntoView({block:'nearest',inline:'nearest'});else if(el.closest('#ribbon,#wtabs')&&window.ensureHVis)await ensureHVis(el);await wait(60);
    renderDots(i);placeCoach(el,s.say,i+1);await moveCursorTo(el);if(el.closest('#ribbon')&&!el.closest('.dd')){showTip(el.closest('.rb,.rck,.rnum,.rsel,.gi')||el);await wait(1100);hideTip()}if(s.pre){s.pre();await wait(400)}await clickFx();
    try{await (s.act&&s.act())}catch(e){console.error(e)}await wait(900);}
  hideCoach();c.style.display='none';$('#blocker').style.display='none';$('#stopDemo').style.display='none';document.body.classList.remove('demo');
  if(CO.mode==='demo'){CO.mode='idle';tryItem();setTimeout(renderHead,120);simToast('الآن دورك! ✋')}
}
function nextLesson(){const all=allUnits().filter(isUnlocked);let u=CO.unit,ls=L(u),i=ls.indexOf(CO.item)+1;if(i>=ls.length){u=all[(all.indexOf(u)+1)%all.length];i=0}openLesson(u,i)}
function showSimCard(kind){const it=CO.item,o=$('#simcard');if(!it)return;const u=CO.unit;const doT=it.kind==='do';
  if(kind==='start')o.innerHTML=`<div class="ocard"><div class="big">${icon(it.ic||u.icon,40)}</div><small class="sec">${u.title} · ${it.kind==='learn'?'تعلّم':'تحدَّ نفسك'}</small><h2>${it.t}</h2>${it.hint?`<div class="after">💡 ${it.hint}</div>`:''}
    ${doT?`<ul class="rl">${it.reqs.map(r=>`<li>${r.t}</li>`).join('')}</ul><p class="sm">نفّذ بنفسك بلا إرشاد، ثم اضغط <b>«✔ تحقّق»</b>.</p><div class="cbtns"><button class="try" data-a="try">✍️ ابدأ التنفيذ</button></div>`:`<div class="cbtns"><button class="watch" data-a="watch">▶ شاهد كيف</button><button class="try" data-a="try">✋ جرّب بنفسك</button></div>`}</div>`;
  if(kind==='proj')o.innerHTML=`<div class="ocard proj"><small class="sec">مشروع الجداول</small><h2>🎯 سنبني هذا الجدول معًا</h2><p>في كل درس تتعلّم أمرًا واحدًا وتضيفه إلى الجدول نفسه، حتى يكتمل.</p><div class="goalbox">${projGoalHTML()}</div><div class="cbtns"><button class="try" data-a="try">✋ ابدأ الخطوة الأولى</button></div></div>`;
  if(kind==='goal')o.innerHTML=`<div class="ocard proj"><small class="sec">صمّم مثل الصورة${it.level?' · '+it.level:''}</small><h2>🖼️ ${it.t.replace(/^\d+\.\s*/,'')}</h2>${it.skills?`<div class="skl">${it.skills.map(k=>`<span>${k}</span>`).join('')}</div>`:''}<p>${it.intro||''}</p><div class="goalbox"><img src="${it.goalImg}" alt=""></div><p class="sm">نفّذ بنفسك، وكل شرط يتحقّق يصبح أخضر.</p><div class="cbtns"><button class="try" data-a="try">✍️ ابدأ التنفيذ</button></div></div>`;
  if(kind==='welcome')o.innerHTML=`<div class="ocard welcome"><div class="big"><span class="wl">W</span></div><h2>أهلًا بك 👋</h2><p>تعلّم Word خطوة بخطوة على نسخة تشبه البرنامج الحقيقي.<br>مرّر الفأرة فوق أي أمر لتعرف لماذا يُستخدم.</p><div class="cbtns"><button class="try" data-a="start">ابدأ الدرس الأول ←</button></div></div>`;
  if(kind==='turn')o.innerHTML=`<div class="ocard"><div class="big">👏</div><h2>الآن دورك!</h2><p>${it.t}</p><div class="cbtns"><button class="try" data-a="try">✋ ابدأ</button><button class="ghost" data-a="watch">▶ شاهد مرة أخرى</button></div></div>`;
  if(kind==='won'){o.innerHTML=`<div class="ocard"><div class="stars"><span>⭐</span><span>⭐</span><span>⭐</span></div><h2>أحسنت!</h2><p>${it.t} ✓</p>${it.proj?projWon(it):''}${it.after?`<div class="after">💡 ${it.after}</div>`:''}<div class="cbtns"><button class="try" data-a="next">التالي ←</button><button class="ghost" data-a="again">↺ أعد</button><button class="ghost" data-a="free">✏️ تابع على المحاكي</button></div></div>`}
  o.className='simcard show '+kind;
  o.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='watch')watchItem();if(a==='try')tryItem();if(a==='again')startItem();if(a==='free'){hideSimCard();CO.mode='free'}if(a==='next')nextLesson();if(a==='start')tryItem()});
}
function hideSimCard(){$('#simcard').className='simcard'}
/* fit simulator to any screen */
window.SIMSCALE=1;
function fitSim(){const wrap=$('.simwrap'),sim=$('#sim');if(!wrap||!sim)return;const cs=getComputedStyle(wrap);const W=wrap.clientWidth-(parseFloat(cs.paddingLeft)||0)-(parseFloat(cs.paddingRight)||0),H=wrap.clientHeight-(parseFloat(cs.paddingBottom)||0)-(parseFloat(cs.paddingTop)||0);const base=W<700?Math.max(W,560):W<900?Math.max(W,880):(W<1180?1180:0);
  if(base&&base>W){const s=W/base;SIMSCALE=s;Object.assign(sim.style,{position:'absolute',top:'0',right:'0',width:base+'px',height:(H/s)+'px',transform:`scale(${s})`,transformOrigin:'top right',flex:'none'})}
  else{SIMSCALE=1;Object.assign(sim.style,{position:'',top:'',right:'',width:'',height:'',transform:'',transformOrigin:'',flex:''})}}
let _lay=LW()+'x'+LH();addEventListener('resize',()=>{const k=LW()+'x'+LH();if(k===_lay)return;_lay=k;fitSim();closeMenus()});
function confirmWs(){return true}
let wsT;
function openWorkspace(){hideRef();CO.ws=true;CO.mode='free';CO.unit=null;CO.item=null;CO.exEl=null;hideCoach();clearHints();hideSimCard();cur().style.display='none';
  applySetup({html:'<p><br></p>',file:'مساحتي'});try{const d=JSON.parse(localStorage.getItem(PKEY+'-ws')||'null');if(d)loadData(d)}catch(e){}
  try{localStorage.setItem(PKEY+'-last','ws')}catch(e){}renderNav2();renderHead()}
SIM.on('change',()=>{if(!CO.ws||S.app!=='doc')return;clearTimeout(wsT);wsT=setTimeout(()=>{try{localStorage.setItem(PKEY+'-ws',JSON.stringify(docData()))}catch(e){}},800)});
function initApp(){
  if(window.ONLY_TOPICS){const keep=TOPICS.filter(t=>ONLY_TOPICS.includes(t.id));if(keep.length)TOPICS.splice(0,TOPICS.length,...keep)}
  TOPICS.forEach((t,i)=>{t.num=String(i+1)});
  /* الجداول: تجميع المهام حسب الفكرة (الحدود معًا…) */
  {const t5=TOPICS.find(t=>t.id==='t5');if(t5){const G=[['إنشاء الجدول والتحديد','',['l0','l1','l2']],['الصفوف والأعمدة والفرز','',['l3','l4','l5']],['دمج الخلايا وتقسيمها','',['l6','l7']],['حجم الصفوف والأعمدة','',['l8']],['النص داخل الجدول','محاذاة الكتابة داخل الخلية واتجاهها.',['l9']],['أنماط الجداول','',['l10']],['التظليل والنقش','',['l11']],
     ['🖊️ الحدود','نفس الفكرة بتطبيقات مختلفة: اختر القلم (النمط، السُّمك، اللون) ثم طبّقه على الحدود المطلوبة.',['l12','l13','l14','l15','l16','l17']],['تقسيم الجدول وتحويله','',['l18']]];
    try{L(t5).forEach(l=>{const g=G.find(x=>x[2].includes(l.key));if(g){l.g=g[0];l.gd=g[1]}})}catch(e){}}}
  buildTips();if(window.applyTableTips)applyTableTips();if(typeof applyMoreTips==='function')applyMoreTips();$('#stopDemo').onclick=stopDemo;$('#scrim').onclick=()=>document.body.classList.remove('drawer');
  const open=TOPICS.filter(isUnlocked);if(!open.length){openWorkspace();setTimeout(()=>{$('#simcard').innerHTML=`<div class="ocard"><div class="big">🔒</div><h2>لم تُفتح دروس بعد</h2><p>ستفتح المعلّمة الدروس بعد كل محاضرة.<br>حتى ذلك الحين جرّب Word بحرية في «مساحتي الحرة».</p><div class="cbtns"><button class="try" onclick="hideSimCard()">حسنًا</button></div></div>`;$('#simcard').className='simcard show'},200);return}
  if((localStorage.getItem(PKEY+'-last')||'')==='ws'){openWorkspace();return}
  let u=open[0],i=0,fresh=true;try{const l=(localStorage.getItem(PKEY+'-last')||'').split(':');const x=open.find(v=>v.id===l[0]);if(x){fresh=false;const j=L(x).findIndex(z=>z.key===l[1]);if(j>=0){u=x;i=j}}}catch(e){}
  fitSim();openLesson(u,i);if(fresh&&!CO.item.goalImg){setTimeout(()=>{CO.mode='idle';showSimCard('welcome')},150)}
}

/* ---------- table project UI ---------- */
function projBar(l){const p=l.proj;const pct=p.extra?100:Math.round(p.i/p.n*100);
  return `<div class="pbar"><span class="pb-t">🎯 مشروع: <b>برنامج رحلة أريحا</b></span><span class="pb-s">${p.extra?'أوامر إضافية':`الخطوة ${p.i+1} من ${p.n}`}</span><span class="pb-bar"><i style="width:${pct}%"></i></span></div>`}
function projWon(it){const p=it.proj;return `<div class="pwon">➕ أُضيف إلى المشروع: <b>${p.adds}</b>${!p.extra?`<span class="pb-bar"><i style="width:${Math.round((p.i+1)/p.n*100)}%"></i></span><small>${p.i+1} / ${p.n}</small>`:''}</div>`}
function toggleGoal(){let g=$('#goalPop');if(g){closeGoal();return}g=document.createElement('div');g.id='goalPop';const l=CO.item;
  g.innerHTML=`<div class="gp-h"><b>🎯 الشكل النهائي للجدول</b><button aria-label="إغلاق">✕</button></div><div class="goalbox">${l&&l.goalImg?`<img src="${l.goalImg}" alt="">`:projGoalHTML()}</div>${l&&l.proj&&!l.proj.extra?`<p>الآن نضيف: <b>${l.proj.adds}</b></p>`:''}`;
  document.body.appendChild(g);const r=$('#goalBtn').getBoundingClientRect();g.style.top=(r.bottom+8)+'px';g.style.left=Math.max(10,Math.min(LW()-g.offsetWidth-10,r.left))+'px';
  g.querySelector('button').onclick=closeGoal;setTimeout(()=>document.addEventListener('click',goalOut,true),0)}
function goalOut(e){if(!e.target.closest('#goalPop,#goalBtn'))closeGoal()}
function closeGoal(){const g=$('#goalPop');if(g)g.remove();document.removeEventListener('click',goalOut,true)}

/* ---------- reference picture that stays in front of the student ---------- */
function showRef(src,title){let p=$('#refpanel');const w=$('.simwrap');if(!w)return;if(!p){p=document.createElement('div');p.id='refpanel';w.appendChild(p)}
  const isH=src.trim().startsWith('<');p.className='refpanel';p.innerHTML=`<div class="rp-h"><b>${isH?'🎯 '+(title||''):'🖼️ صمّم مثل الصورة'}<small class="rp-mini" id="rpMini"></small></b><span><button data-r="big" title="تكبير">⤢</button><button data-r="min" title="إخفاء">–</button></span></div>${isH?`<div class="goalbox rp-goal">${src}</div>`:`<img src="${src}" alt="الصورة المطلوبة">`}${!isH&&CO.item&&(CO.item.intro||CO.item.skills)?`<div class="rp-intro">${CO.item.skills?`<div class="rp-sk">${CO.item.skills.map(k=>`<span>${k}</span>`).join('')}</div>`:''}${CO.item.intro?`<p>${CO.item.intro}</p>`:''}</div>`:''}<div class="rp-lh"><b>${isH?'خطوات المشروع':'للمطابقة'}</b><span id="rpCount"></span></div><ol class="rp-list" id="rplist"></ol><button class="rp-tab" data-r="min">🖼️ الصورة المطلوبة</button>`;CO.rpSig='';
  p.querySelectorAll('[data-r]').forEach(b=>b.onclick=e=>{e.stopPropagation();const r=b.dataset.r;if(r==='big'){p.classList.toggle('big');p.classList.remove('min')}else p.classList.toggle('min')});
  const im=p.querySelector('img,.rp-goal');if(im)im.onclick=()=>{p.classList.toggle('big')};
  const h=p.querySelector('.rp-h');if(isPhone()){p.classList.add('mcol');document.body.classList.add('hasref');setTimeout(padForSheet,30);h.onclick=e=>{if(e.target.closest('button'))return;p.classList.toggle('mcol')}}else document.body.classList.remove('hasref');h.onmousedown=e=>{if(isPhone()||e.target.closest('button'))return;const wr=w.getBoundingClientRect(),pr=p.getBoundingClientRect(),dx=e.clientX-pr.left,dy=e.clientY-pr.top;
    const mv=ev=>{p.style.left=Math.max(0,Math.min(wr.width-pr.width,ev.clientX-wr.left-dx))+'px';p.style.top=Math.max(0,Math.min(wr.height-40,ev.clientY-wr.top-dy))+'px';p.style.bottom='auto'};
    const up=()=>{removeEventListener('mousemove',mv);removeEventListener('mouseup',up)};addEventListener('mousemove',mv);addEventListener('mouseup',up);e.preventDefault()}}
function hideRef(){const p=$('#refpanel');if(p)p.remove();document.body.classList.remove('hasref');const w=$('.simwrap');if(w)w.style.paddingBottom='';fitSim()}
function padForSheet(){const p=$('#refpanel'),w=$('.simwrap');if(!p||!w||!isPhone())return;const was=p.classList.contains('mcol');if(!was)p.classList.add('mcol');const h=p.offsetHeight;if(!was)p.classList.remove('mcol');w.style.paddingBottom=(h+4)+'px';fitSim()}
function isPhone(){return LW()<=900}

function renderRefList(){const ul=$('#rplist');const it=CO.item;if(!ul||!it)return;
  if(it.proj){const ls=L(CO.unit).filter(l=>l.proj);const sig='p'+it.proj.i+ls.map(l=>isDone(CO.unit,l)?1:0).join('');if(CO.rpSig===sig)return;CO.rpSig=sig;
    ul.innerHTML=ls.map(l=>{const d=isDone(CO.unit,l),c=l===it;return `${l.g&&l.g!==(ls[ls.indexOf(l)-1]||{}).g?`<li class="grp">${l.g}</li>`:''}<li class="${d?'ok':''} ${c?'cur':''} pj" data-pi="${L(CO.unit).indexOf(l)}"><i>${d?'✓':l.proj.i+1}</i><div><span>${l.t}</span>${c?`<small>➕ ${l.proj.adds}</small>`:''}</div></li>`}).join('');
    const n=ls.filter(l=>isDone(CO.unit,l)).length;$('#rpCount').textContent=`${n} / ${ls.length}`;
    ul.querySelectorAll('[data-pi]').forEach(x=>x.onclick=()=>openLesson(CO.unit,+x.dataset.pi));const c=ul.querySelector('.cur');if(c)c.scrollIntoView({block:'nearest'});return}
  if(!it.reqs)return;const st=it.reqs.map(r=>{try{return !!r.check()}catch(e){return false}});const av=it.reqs.map((r,i)=>!st[i]&&(r.need||[]).every(k=>st[k]));
  if(CO.focus!=null&&(st[CO.focus]||!av[CO.focus]))CO.focus=null;const f=CO.focus;
  const sig=st.join()+'|'+av.join()+'|'+f;if(CO.rpSig===sig)return;CO.rpSig=sig;
  ul.innerHTML=it.reqs.map((r,i)=>{const cls=st[i]?'ok':av[i]?(i===f?'av cur':'av'):'lock';const nd=(r.need||[]).filter(k=>!st[k]).map(k=>k+1);
    return `<li class="${cls}" data-q="${i}"><i>${st[i]?'✓':av[i]?i+1:'🔒'}</i><div><span>${r.t}</span>${i===f?`<small>${fixOf(r)}</small>${r.cmd||r.where||r.path?`<span class="rq-btns"><button data-h="${i}">👆 أرني أين</button><button data-p="${i}" class="playb">▶ شاهد</button></span>`:''}`:!st[i]&&!av[i]&&nd.length?`<em>بعد ${nd.join('، ')}</em>`:''}</div></li>`}).join('');
  const n=st.filter(Boolean).length;$('#rpCount').textContent=`${n} / ${st.length}`;const mini=$('#rpMini');if(mini){const fi=f!=null?f:st.findIndex(x=>!x);mini.textContent=fi>=0?`${n}/${st.length} · ${it.reqs[fi].t} ▲`:'✓ تمّت المطابقة'}
  const lh=$('#refpanel .rp-lh b');if(lh)lh.textContent=n===st.length?'تمّت المطابقة 🎉':'المضيء جاهز — اختر أي واحد';
  ul.querySelectorAll('li.av').forEach(x=>x.onclick=()=>{CO.focus=+x.dataset.q;CO.rpSig='';renderRefList()});
  ul.querySelectorAll('[data-h]').forEach(b=>b.onclick=e=>{e.stopPropagation();showReqHint(+b.dataset.h)});
  ul.querySelectorAll('[data-p]').forEach(b=>b.onclick=e=>{e.stopPropagation();playSolution(+b.dataset.p)})}

function fixOf(r){let x=null;try{x=r.fixFn&&r.fixFn()}catch(e){}return x||r.fix}

/* «💡 الحل»: خطوات الحل كاملة بالترتيب، مع «أرني» لكل خطوة */
function showSolution(){const it=CO.item;if(!it||!it.reqs)return;const done=i=>{try{return !!it.reqs[i].check()}catch(e){return false}};
  const steps=it.reqs.map((r,i)=>`<li class="sol-i${done(i)?' ok':''}"><div><b>${done(i)?'✓ ':''}${r.t}</b><p>${(r.fix||'').replace(/</g,'&lt;')}</p></div>${r.where||r.cmd||r.path?`<span class="sol-bt"><button class="b sol-go" data-i="${i}">👆 أرني</button><button class="b sol-play" data-i="${i}">▶ شاهد</button></span>`:''}</li>`).join('');
  dialog({title:'💡 الحل خطوة بخطوة',w:isPhone()?510:620,body:`<div class="sol">${it.goalImg?`<img src="${it.goalImg}" alt="">`:''}${it.intro?`<p class="sol-in">${it.intro.replace(/</g,'&lt;')}</p>`:''}<button class="b sol-all">▶ شاهد الحل كاملًا</button><ol>${steps}</ol><p class="sm">«▶ شاهد»: يعرض الحل وحده كأنه فيديو ثم يعيد التمرين كما كان. «👆 أرني»: يمشي معك وأنت تنفّذ بنفسك.</p></div>`,
   buttons:[{label:'إغلاق',pri:1}],onOpen:d=>{d.querySelectorAll('.sol-go').forEach(b=>b.onclick=()=>{closeDialog();const i=+b.dataset.i;setTimeout(()=>{try{showReqHint(i)}catch(e){}},60)});d.querySelectorAll('.sol-play').forEach(b=>b.onclick=()=>{closeDialog();const i=+b.dataset.i;setTimeout(()=>playSolution(i),80)});d.querySelector('.sol-all').onclick=()=>{closeDialog();setTimeout(()=>playSolution(),80)}}});
  logAct('solution')}
