/* ================= Simulator core ================= */
const S={
  app:'doc', page:{size:'A4',orient:'portrait',margin:'normal',cols:'1',lineNums:'none',color:'',border:null,wm:'',paraSp:8},
  hf:{hdr:'',ftr:'',firstHdr:'',firstFtr:'',first:false,pnFmt:'decimal',pnStart:1},
  view:'print',zoom:100,ruler:true,grid:false,nav:false,multi:false,marks:false,cmts:true,theme:0,
  file:{name:'مستند1',where:null},dirty:false,hfMode:false,
  range:null,host:null,curCell:null,selCells:[],obj:null,
  comments:[],cid:1,tabsSeen:{},
};
let doc,canvas;
const FS=[{name:'تقرير الرحلة',where:'المستندات',time:'أمس',data:null},{name:'واجب العلوم',where:'سطح المكتب',time:'منذ 3 أيام',data:null}];
const SIM={listeners:{},on(e,f){(this.listeners[e]=this.listeners[e]||[]).push(f)},emit(e,d){(this.listeners[e]||[]).forEach(f=>{try{f(d)}catch(err){console.error(err)}})},log:[]};
function logAct(a){SIM.log.push(a);if(SIM.log.length>200)SIM.log.shift();SIM.emit('act',a)}

/* ---------------- build DOM ---------------- */
function buildSim(){
  $('#sim').innerHTML=`
  <div id="desktop">
    <div class="dicons"><button class="dicon" data-dt="bin"><span class="applogo bin">🗑️</span>سلة المحذوفات</button><button class="dicon" data-dt="explorer"><span class="applogo f">📁</span>هذا الكمبيوتر</button></div>
    <div id="startmenu"><div class="ssearch">🔍<input id="startq" placeholder="اكتب هنا للبحث" autocomplete="off"></div><div id="startres"></div></div>
    <div id="taskbar"><div class="clock" id="clock"></div>
      <button class="tb" id="startbtn" title="ابدأ"><span class="win"><i></i><i></i><i></i><i></i></span></button>
      <div class="tsearch" id="tsearch">🔍 بحث</div>
      <button class="tb" title="مستكشف الملفات"><span class="applogo f">📁</span></button>
      <button class="tb" title="Microsoft Edge"><span class="applogo e"></span></button>
      <button class="tb" id="tbword" title="Word" hidden><span class="applogo w">W</span></button>
    </div>
  </div>
  <div id="splash"><div class="sp"><span class="applogo w">W</span><div style="font-size:22px">Word</div><div class="dots"><i></i><i></i><i></i></div></div></div>
  <div id="wwin">
    <div class="wtbar">
      <div class="qat"><span class="autosave">حفظ تلقائي <i></i></span><button data-cmd="save" title="حفظ (Ctrl+S)" data-hid="qat-save">${icon('save',16)}</button><button data-cmd="undo" title="تراجع (Ctrl+Z)" data-hid="qat-undo">↶</button><button data-cmd="redo" title="إعادة (Ctrl+Y)" data-hid="qat-redo">↷</button><button title="تخصيص شريط أدوات الوصول السريع">▾</button></div>
      <div class="fname" data-hid="titlebar"><b id="fname">مستند1 - Word</b><div class="wsearch">🔍 بحث</div></div>
      <div class="user"><span>سارة حرب</span><i>س ح</i></div>
      <div class="wbtns" data-hid="winbtns"><button class="x" data-cmd="closeWin" title="إغلاق" data-hid="win-close">✕</button><button data-cmd="maxWin" title="تكبير" data-hid="win-max">☐</button><button data-cmd="minWin" title="تصغير" data-hid="win-min">—</button></div>
    </div>
    <div class="wtabs" id="wtabs" data-hid="tabsbar"></div>
    <div id="ribbon" data-hid="ribbonbar"></div>
    <div class="wbody">
      <div id="navpane" hidden data-hid="navpane-el"></div>
      <div class="wmain"><div id="hruler" data-hid="ruler-el"><div class="rl"></div></div><div class="canvas" id="canvas"><div id="doc" data-hid="page-el"></div></div><div id="wempty"></div></div>
      <div id="cmtpane" hidden></div>
    </div>
    <div class="wstatus" data-hid="statusbar">
      <span id="stPage" data-hid="st-page">الصفحة 1 من 1</span><span id="stWords">0 كلمة</span><span title="التدقيق">📖</span><span>العربية (فلسطين)</span><span class="sp"></span>
      <span title="التركيز">🎯 التركيز</span>
      <div class="vb" data-hid="st-views"><button data-cmd="readMode" title="وضع القراءة">${icon('readmode',16)}</button><button data-cmd="printLayout" class="on" title="تخطيط الطباعة">${icon('printlayout',16)}</button><button data-cmd="webLayout" title="تخطيط ويب">${icon('weblayout',16)}</button></div>
      <div class="zm" data-hid="st-zoom"><button data-cmd="zoomStep" data-arg="-10">−</button><input type="range" id="zoomR" min="10" max="500" value="100"><button data-cmd="zoomStep" data-arg="10">+</button><span id="zoomT">100%</span></div>
    </div>
    <div id="backstage" hidden></div>
    <div id="readmode" hidden></div>
  </div>
  <div id="dlgs"></div>
  <div id="ctxmenu"></div>
  <div id="simtoast"></div>`;
  doc=$('#doc');canvas=$('#canvas');
  renderRibbon();
  wireDesktop();wireRibbon();wireDoc();wireStatus();
  setInterval(()=>{const d=new Date();$('#clock').innerHTML=d.toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'})+'<br>'+d.toLocaleDateString('ar')},1000);
}

/* ---------------- toast / dialogs / context menu ---------------- */
let stT;function simToast(m){const t=$('#simtoast');t.textContent=m;t.classList.add('show');clearTimeout(stT);stT=setTimeout(()=>t.classList.remove('show'),2400)}
function dialog({title,body,buttons=[{label:'موافق',pri:1}],onOpen,w}){
  const d=$('#dlgs');d.innerHTML=`<div class="dlg" style="${w?'width:'+w+'px':''}"><div class="dh"><b>${title}</b><button data-x>✕</button></div><div class="db">${body}</div><div class="df">${buttons.map((b,i)=>`<button data-b="${i}" class="${b.pri?'pri':''}">${b.label}</button>`).join('')}</div></div>`;
  d.classList.add('show');
  const close=()=>{d.classList.remove('show');d.innerHTML=''};
  d.querySelector('[data-x]').onclick=close;
  d.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const bt=buttons[+b.dataset.b];const r=bt.act?bt.act(d):undefined;if(r!==false)close()});
  if(onOpen)onOpen(d);
  return d;
}
function closeDialog(){$('#dlgs').classList.remove('show');$('#dlgs').innerHTML=''}
function showCtx(x,y,items){const m=$('#ctxmenu');m.innerHTML=items.map(i=>i==='-'?'<div class="msep"></div>':mi(i[0],i[1],i[2],i[3])).join('');m.classList.add('show');
  const sc=window.SIMSCALE||1;placeAt(m,Math.min(x,LW()-m.offsetWidth*sc-6),Math.min(y,LH()-m.offsetHeight*sc-10))}
function hideCtx(){$('#ctxmenu').classList.remove('show')}

/* ---------------- desktop ---------------- */
function wireDesktop(){
  $('#startbtn').onclick=()=>toggleStart();
  $('#tsearch').onclick=()=>toggleStart(true);
  $('#tbword').onclick=()=>{if($('#wwin').classList.contains('min'))restoreWin();else minimizeWin()};
  $('#startq').addEventListener('input',renderStartRes);
  $('#startq').addEventListener('keydown',e=>{if(e.key==='Enter'){const b=$('#startres .best');if(b)b.click()}if(e.key==='Escape')toggleStart(false)});
  $('#desktop').addEventListener('mousedown',e=>{if(!e.target.closest('#startmenu,#startbtn,#tsearch'))toggleStart(false)});
  $('#desktop').addEventListener('dblclick',e=>{const d=e.target.closest('.dicon');if(d)simToast('هذا الاختصار للعرض فقط')});
}
function toggleStart(force){const m=$('#startmenu');const o=force!=null?force:!m.classList.contains('open');m.classList.toggle('open',o);if(o){$('#startq').value='';renderStartRes();setTimeout(()=>$('#startq').focus(),50);logAct('startOpen')}}
function renderStartRes(){
  const q=$('#startq').value.trim().toLowerCase();const r=$('#startres');
  if(!q){r.innerHTML=`<h5>مثبّت</h5><div class="pins">${[['w','W','Word'],['x','X','Excel'],['p','P','PowerPoint'],['e','','Edge'],['f','📁','مستكشف الملفات'],['f','⚙️','الإعدادات']].map(a=>`<button class="pin" data-app="${a[2]}"><span class="applogo ${a[0]}">${a[1]}</span>${a[2]}</button>`).join('')}</div>`;}
  else if('word'.startsWith(q)||'وورد'.startsWith(q)||q.startsWith('word')||'ورد'.startsWith(q)){r.innerHTML=`<h5>أفضل تطابق</h5><button class="best" data-app="Word"><span class="applogo w">W</span><span><b>Word</b>تطبيق</span></button>`}
  else r.innerHTML=`<div class="noresult">لا توجد نتائج لـ «${q}» — جرّب كتابة Word</div>`;
  r.querySelectorAll('[data-app]').forEach(b=>b.onclick=()=>{if(b.dataset.app==='Word')launchWord();else simToast('هذا التطبيق للعرض فقط')});
}
async function launchWord(){
  toggleStart(false);logAct('launch');
  $('#splash').classList.add('show');await wait(900);$('#splash').classList.remove('show');
  S.app='start';$('#wwin').classList.remove('hide','min');$('#tbword').hidden=false;$('#tbword').classList.add('running','active');
  showWordStart();SIM.emit('change');
}
function showDesktop(){S.app='desktop';$('#wwin').classList.add('hide');$('#tbword').hidden=true;closeBackstage();SIM.emit('change')}
function minimizeWin(){$('#wwin').classList.add('min');$('#tbword').classList.remove('active');logAct('minimize');SIM.emit('change')}
function restoreWin(){$('#wwin').classList.remove('min');$('#tbword').classList.add('active');logAct('restore');SIM.emit('change')}

/* ---------------- backstage / start screen ---------------- */
const BS_ITEMS=[['home','الصفحة الرئيسية','home'],['new','جديد','newdoc'],['open','فتح','open'],'-',['info','معلومات','info'],['save','حفظ','savedoc'],['saveas','حفظ باسم','saveas'],['print','طباعة','print'],['share','مشاركة','share'],['export','تصدير','export'],['close','إغلاق','closefile']];
function openBackstage(pane='home',start){
  const b=$('#backstage');b.hidden=false;S.bsStart=!!start;
  b.innerHTML=`<div class="bs-nav">${start?'<div style="padding:16px 20px 18px;font-size:20px">Word</div>':`<button class="back" data-bs="back" title="رجوع">→</button>`}${BS_ITEMS.filter(i=>!start||i==='-'||['home','new','open'].includes(i[0])).map(i=>i==='-'?'<hr>':`<button data-bs="${i[0]}" data-hid="bs-${i[0]}">${icon(i[2],18)}${i[1]}</button>`).join('')}<div class="sp"></div><button data-bs="account">الحساب</button><button data-bs="options" data-hid="bs-options">خيارات</button></div><div class="bs-main" id="bsMain"></div>`;
  b.querySelectorAll('[data-bs]').forEach(x=>x.onclick=()=>bsPane(x.dataset.bs));
  bsPane(pane);logAct('backstage');SIM.emit('change');
}
function closeBackstage(){$('#backstage').hidden=true;SIM.emit('change')}
function showWordStart(){$('#wwin').classList.add('nodoc');openBackstage('home',true)}
function bsPane(p){
  const m=$('#bsMain');if(!m)return;
  $$('#backstage [data-bs]').forEach(x=>x.classList.toggle('on',x.dataset.bs===p));
  if(p==='back'){if(S.app==='doc')closeBackstage();return}
  if(p==='save'){if(S.app!=='doc')return;if(S.file.where){saveFile();closeBackstage();return}p='saveas';$$('#backstage [data-bs]').forEach(x=>x.classList.toggle('on',x.dataset.bs==='saveas'))}
  if(p==='close'){closeDoc();return}
  const tiles=`<div class="bs-tiles"><button class="bs-tile" data-new="blank" data-hid="bs-blank"><div class="th blank">+</div>مستند فارغ</button><button class="bs-tile" data-new="tour"><div class="th"><b>مرحبًا بك في Word</b><i></i><i></i><i style="width:60%"></i></div>جولة سريعة</button><button class="bs-tile" data-new="report"><div class="th"><b>تقرير مدرسي</b><i></i><i></i><i></i><i style="width:50%"></i></div>تقرير الطالب</button><button class="bs-tile" data-new="letter"><div class="th"><b>رسالة</b><i style="width:40%"></i><i></i><i></i></div>رسالة رسمية</button></div>`;
  const recent=`<div class="bs-list">${FS.map((f,i)=>`<button class="bs-row" data-open="${i}">${icon('blankdoc',26)}<span>${f.name}<small>${f.where}</small></span><span class="t">${f.time}</span></button>`).join('')}</div>`;
  if(p==='home')m.innerHTML=`<h1>${greet()}</h1><h3>جديد</h3>${tiles}<h3>الأخيرة</h3>${recent}`;
  else if(p==='new')m.innerHTML=`<h1>جديد</h1>${tiles}`;
  else if(p==='open')m.innerHTML=`<h1>فتح</h1><div class="bs-cols"><div class="bs-places"><button class="bs-place on">${icon('open',22)} الأخيرة</button><button class="bs-place">${icon('desktop',22)} هذا الكمبيوتر</button><button class="bs-place" data-browse="1">${icon('folder',22)} استعراض</button></div><div style="flex:1"><h3 style="margin-top:0">المستندات الأخيرة</h3>${recent}</div></div>`;
  else if(p==='info')m.innerHTML=`<h1>معلومات</h1><h3>${S.file.name}</h3><p style="color:#605e5c">${S.file.where?('محفوظ في: '+S.file.where):'لم يتم حفظ المستند بعد'}</p><h3>الخصائص</h3><p>الصفحات: ${pages().length}<br>الكلمات: ${wordCount()}<br>المؤلف: سارة حرب</p>`;
  else if(p==='saveas')m.innerHTML=`<h1>حفظ باسم</h1><div class="bs-cols"><div class="bs-places"><button class="bs-place">${icon('open',22)} الأخيرة</button><button class="bs-place on">${icon('desktop',22)} هذا الكمبيوتر</button><button class="bs-place" data-browse="1" data-hid="bs-browse">${icon('folder',22)} استعراض</button></div><div style="flex:1"><h3 style="margin-top:0">هذا الكمبيوتر</h3><div class="bs-list"><button class="bs-row" data-browse="سطح المكتب">${icon('desktop',24)} سطح المكتب</button><button class="bs-row" data-browse="المستندات">${icon('folder',24)} المستندات</button><button class="bs-row" data-browse="التنزيلات">${icon('folder',24)} التنزيلات</button></div></div></div>`;
  else if(p==='print')m.innerHTML=`<h1>طباعة</h1><div class="bs-print"><div class="opts"><div style="display:flex;gap:12px;align-items:center"><button class="bigprint" data-print="1" data-hid="bs-printbtn">${icon('print',36)}طباعة</button><label class="bs-fld">النسخ<input type="number" value="1" min="1" style="width:60px"></label></div><label class="bs-fld">الطابعة<select><option>طابعة المدرسة</option><option>Microsoft Print to PDF</option></select></label><label class="bs-fld">الإعدادات<select><option>طباعة كل الصفحات</option><option>طباعة الصفحة الحالية</option></select></label><label class="bs-fld"><select><option>${S.page.orient==='landscape'?'اتجاه أفقي':'اتجاه عمودي'}</option></select></label><label class="bs-fld"><select><option>${S.page.size}</option></select></label></div><div class="prev"><div class="pv" id="pv"></div></div></div>`;
  else if(p==='share'||p==='export')m.innerHTML=`<h1>${p==='share'?'مشاركة':'تصدير'}</h1><button class="bs-btn">${p==='share'?'مشاركة مع أشخاص':'إنشاء مستند PDF/XPS'}</button>`;
  else if(p==='options'||p==='account')m.innerHTML=`<h1>${p==='options'?'خيارات Word':'الحساب'}</h1><p style="color:#605e5c">هذه الصفحة للعرض فقط في المحاكي.</p>`;
  if(p==='print'){window.__printSeen=true;const pv=$('#pv');const pg=pages()[0];if(pg){const c=pg.cloneNode(true);c.querySelectorAll('[contenteditable]').forEach(e=>e.removeAttribute('contenteditable'));pv.appendChild(c);pv.style.setProperty('--pw',getComputedStyle(doc).getPropertyValue('--pw'))}pv.setAttribute('style',doc.getAttribute('style')||'');}
  m.querySelectorAll('[data-new]').forEach(x=>x.onclick=()=>{newDocument(x.dataset.new)});
  m.querySelectorAll('[data-open]').forEach(x=>x.onclick=()=>openFile(+x.dataset.open));
  m.querySelectorAll('[data-browse]').forEach(x=>x.onclick=()=>p==='open'?openDialog():saveAsDialog(x.dataset.browse==='1'?'المستندات':x.dataset.browse));
  m.querySelectorAll('[data-print]').forEach(x=>x.onclick=()=>{logAct('print');simToast('تم إرسال المستند إلى الطابعة 🖨️');closeBackstage()});
}
function greet(){const h=new Date().getHours();return h<12?'صباح الخير':'مساء الخير'}
const TEMPLATES={
 blank:'<p><br></p>',
 tour:'<p class="wtitle">مرحبًا بك في Word</p><p>اكتب هنا أو احذف هذا النص وابدأ مستندك.</p>',
 report:'<p class="wtitle">تقرير عن رحلة مدرسية</p><p class="wsub">إعداد الطالب</p><h1>المقدمة</h1><p>'+LOREM+'</p>',
 letter:'<p>التاريخ:</p><p>حضرة مدير المدرسة المحترم،</p><p>تحية طيبة وبعد،</p><p><br></p>',
};
function newDocument(t='blank',name){
  setDocHTML([TEMPLATES[t]||TEMPLATES.blank]);S.file={name:name||nextName(),where:null};S.dirty=false;
  S.app='doc';$('#wwin').classList.remove('nodoc');closeBackstage();updateTitle();
  setTimeout(()=>placeCaretIn(firstBody(),true),20);logAct('newdoc');SIM.emit('change');
}
let docCounter=1;function nextName(){return 'مستند'+(docCounter++)}
function docData(){return {html:doc.innerHTML.replace(/ ?\bg-tgt\b/g,""),page:JSON.parse(JSON.stringify(S.page)),hf:JSON.parse(JSON.stringify(S.hf)),comments:JSON.parse(JSON.stringify(S.comments))}}
function loadData(d){doc.innerHTML=d.html;S.page=JSON.parse(JSON.stringify(d.page));S.hf=JSON.parse(JSON.stringify(d.hf));S.comments=JSON.parse(JSON.stringify(d.comments||[]));applyPage();renderHF();renderComments();updateStatus()}
function saveFile(){const f=FS.find(x=>x.name===S.file.name&&x.where===S.file.where);const d=docData();if(f){f.data=d;f.time='الآن'}else FS.unshift({name:S.file.name,where:S.file.where,time:'الآن',data:d});S.dirty=false;updateTitle();logAct('save:'+S.file.name+'@'+S.file.where);simToast('تم الحفظ ✓');SIM.emit('change')}
function saveAsDialog(where='المستندات'){
  const places=['سطح المكتب','المستندات','التنزيلات','الصور'];
  dialog({title:'حفظ باسم',w:560,body:`<div class="fs"><div class="fsl">${places.map(p=>`<button data-pl="${p}" class="${p===where?'on':''}">${icon(p==='سطح المكتب'?'desktop':'folder',18)} ${p}</button>`).join('')}</div><div class="fsr" id="fsr"></div></div><label class="row" style="margin-top:10px">اسم الملف: <input type="text" id="saveName" value="${S.file.name}" style="flex:1" data-hid="dlg-filename"></label><label class="row">حفظ بنوع: <select style="flex:1"><option>مستند Word (*.docx)</option><option>PDF (*.pdf)</option></select></label>`,
   buttons:[{label:'حفظ',pri:1,act:d=>{const n=$('#saveName').value.trim()||S.file.name;const w=d.querySelector('.fsl .on').dataset.pl;S.file={name:n,where:w};saveFile();closeBackstage();}},{label:'إلغاء'}],
   onOpen:d=>{const show=w=>{d.querySelectorAll('.fsl button').forEach(b=>b.classList.toggle('on',b.dataset.pl===w));$('#fsr').innerHTML=FS.filter(f=>f.where===w).map(f=>`<div class="f">${icon('blankdoc',18)} ${f.name}.docx</div>`).join('')||'<div class="f" style="color:#999">المجلد فارغ</div>'};show(where);d.querySelectorAll('.fsl button').forEach(b=>b.onclick=()=>show(b.dataset.pl));setTimeout(()=>{const i=$('#saveName');i.focus();i.select()},30)}});
}
function openDialog(){
  const places=['سطح المكتب','المستندات','التنزيلات'];
  dialog({title:'فتح',w:560,body:`<div class="fs"><div class="fsl">${places.map((p,i)=>`<button data-pl="${p}" class="${i===1?'on':''}">${icon(p==='سطح المكتب'?'desktop':'folder',18)} ${p}</button>`).join('')}</div><div class="fsr" id="fsr"></div></div>`,buttons:[{label:'إلغاء'}],
   onOpen:d=>{const show=w=>{d.querySelectorAll('.fsl button').forEach(b=>b.classList.toggle('on',b.dataset.pl===w));$('#fsr').innerHTML=FS.map((f,i)=>f.where===w?`<button class="bs-row" data-of="${i}">${icon('blankdoc',18)} ${f.name}.docx</button>`:'').join('')||'<div class="f" style="color:#999">لا توجد ملفات</div>';$('#fsr').querySelectorAll('[data-of]').forEach(b=>b.onclick=()=>{closeDialog();openFile(+b.dataset.of)})};show('المستندات');d.querySelectorAll('.fsl button').forEach(b=>b.onclick=()=>show(b.dataset.pl))}});
}
function openFile(i){const f=FS[i];if(!f)return;if(f.data)loadData(f.data);else setDocHTML(['<p class="wtitle">'+f.name+'</p><p>'+LOREM+'</p>']);S.file={name:f.name,where:f.where};S.dirty=false;S.app='doc';$('#wwin').classList.remove('nodoc');closeBackstage();updateTitle();logAct('open:'+f.name);SIM.emit('change')}
function confirmSave(then){
  if(!S.dirty||S.app!=='doc'){then();return}
  dialog({title:'Microsoft Word',body:`<div style="display:flex;gap:12px;align-items:center;font-size:14px">${icon('savedoc',32)}<span>هل تريد حفظ التغييرات على «${S.file.name}»؟</span></div>`,buttons:[{label:'حفظ',pri:1,act:()=>{if(S.file.where){saveFile();then()}else{setTimeout(()=>{openBackstage('saveas');S.afterSave=then},10)}}},{label:'عدم الحفظ',act:()=>{S.dirty=false;then()}},{label:'إلغاء'}]});
}
function closeDoc(){confirmSave(()=>{S.app='empty';doc.innerHTML='';$('#wwin').classList.add('nodoc');closeBackstage();S.file={name:'',where:null};updateTitle();logAct('closedoc');SIM.emit('change')})}
function updateTitle(){$('#fname').textContent=(S.file.name?S.file.name+(S.file.where?'':'')+' - ':'')+'Word'+(S.file.where&&!S.dirty?'  •  تم الحفظ':'')}

/* ---------------- pages ---------------- */
const pages=()=>[...doc.querySelectorAll(':scope>.page')];
const firstBody=()=>doc.querySelector('.pg-body');
function makePage(html){const p=document.createElement('div');p.className='page';p.innerHTML=`<div class="pg-wm"></div><div class="pg-border"></div><div class="pg-hdr" data-lbl="رأس الصفحة"></div><div class="pg-body" contenteditable="true" spellcheck="false">${html||'<p><br></p>'}</div><div class="pg-notes"></div><div class="pg-ftr" data-lbl="تذييل الصفحة"></div>`;return p}
function setDocHTML(arr){doc.innerHTML='';arr.forEach(h=>doc.appendChild(makePage(h)));S.comments=[];S.hf={hdr:'',ftr:'',firstHdr:'',firstFtr:'',first:false,pnFmt:'decimal',pnStart:1};S.hfMode=false;doc.classList.remove('hfmode');undoStack=[];redoStack=[];afterLoad()}
function afterLoad(){doc.querySelectorAll('.obj').forEach(o=>{if(window.applyObj)applyObj(o)});applyPage();renderHF();renderComments();syncNotes();updateStatus();updateCtx()}
function pageOf(el){return el&&el.closest?el.closest('.page'):null}
function bodyOf(el){return el&&el.closest?el.closest('.pg-body'):null}
function pageIndex(el){return pages().indexOf(pageOf(el))}

/* ---------------- page setup ---------------- */
function pageDims(){const s=PSIZES.find(x=>x.id===S.page.size)||PSIZES[0];let w=s.w,h=s.h;if(S.page.orient==='landscape')[w,h]=[h,w];return {w,h}}
function applyPage(){
  const {w,h}=pageDims(), m=MARGINS.find(x=>x.id===S.page.margin)||S.page.customM||MARGINS[0];
  const st=doc.style;st.setProperty('--pw',w*CM+'px');st.setProperty('--ph',h*CM+'px');st.setProperty('--mt',m.t*CM+'px');st.setProperty('--mb',m.b*CM+'px');st.setProperty('--mr',m.r*CM+'px');st.setProperty('--ml',m.l*CM+'px');
  const th=THEMES[S.theme]||THEMES[0];st.setProperty('--hc',S.themeColor||'#2f5496');st.setProperty('--df',S.themeFont||'Arial');
  doc.classList.toggle('colline',!!S.page.colLine&&S.page.cols!=='1');doc.classList.toggle('cols2',S.page.cols==='2');doc.classList.toggle('cols3',S.page.cols==='3');doc.classList.toggle('colsR',S.page.cols==='right');doc.classList.toggle('colsL',S.page.cols==='left');
  doc.classList.toggle('lnums',S.page.lineNums!=='none');doc.classList.toggle('grid',S.grid);doc.classList.toggle('marks',S.marks);doc.classList.toggle('multi',S.multi);doc.classList.toggle('web',S.view==='web');
  pages().forEach(p=>{p.style.background=S.page.color||'';p.querySelector('.pg-wm').innerHTML=S.page.wm?`<b>${S.page.wm}</b>`:'';const b=p.querySelector('.pg-border');b.style.border=S.page.border?`${S.page.border.w}px ${S.page.border.s} ${S.page.border.c}`:'';});
  doc.style.zoom=S.zoom/100;renderRuler();
}
function renderRuler(){const r=$('#hruler');r.classList.toggle('off',!S.ruler||S.view==='web');const rl=r.querySelector('.rl');const {w}=pageDims();const z=S.zoom/100;const m=MARGINS.find(x=>x.id===S.page.margin)||MARGINS[0];
  rl.style.width=w*CM*z+'px';let h=`<div class="mz" style="right:0;width:${m.r*CM*z}px"></div><div class="mz" style="left:0;width:${m.l*CM*z}px"></div>`;
  for(let c=0;c<=w;c+=.5){const x=c*CM*z;h+=Number.isInteger(c)&&c>0?`<span class="tk n" style="right:${x}px">${c}</span>`:`<span class="tk" style="right:${x}px"></span>`}rl.innerHTML=h}

/* ---------------- header / footer / page numbers ---------------- */
const ABJAD=['أ','ب','ج','د','ه','و','ز','ح','ط','ي','ك','ل','م','ن','س','ع','ف','ص','ق','ر','ش','ت','ث','خ','ذ','ض','ظ','غ'];
function fmtNum(n,f){if(f==='arabic-indic')return String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);if(f==='abjad')return ABJAD[(n-1)%ABJAD.length];if(f==='roman'){const r=[[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let s='';for(const[v,t]of r)while(n>=v){s+=t;n-=v}return s}if(f==='lroman'){return fmtNum(n,'roman').toLowerCase()}return String(n)}
function renderHF(skip){
  const ps=pages();
  ps.forEach((p,i)=>{
    const first=S.hf.first&&i===0;
    ['hdr','ftr'].forEach(k=>{const el=p.querySelector('.pg-'+k);if(el===skip)return;
      let html=first?S.hf[k==='hdr'?'firstHdr':'firstFtr']:S.hf[k];
      el.innerHTML=html||(S.hfMode?'<p><br></p>':'');
      el.dataset.lbl=(k==='hdr'?'رأس الصفحة':'تذييل الصفحة')+(first?' الأولى':'')+' -القسم 1-';
      el.setAttribute('contenteditable',S.hfMode?'true':'false');});
    p.querySelector('.pg-body').setAttribute('contenteditable',S.hfMode?'false':'true');
  });
  fillPageNums();
}
function fillPageNums(){pages().forEach((p,i)=>p.querySelectorAll('.pnum').forEach(s=>{const t=fmtNum(i+(+S.hf.pnStart||1),S.hf.pnFmt);if(s.textContent!==t)s.textContent=t}));
  doc.querySelectorAll('.pg-body .pnum').forEach(s=>{const t=fmtNum(pageIndex(s)+(+S.hf.pnStart||1),S.hf.pnFmt);if(s.textContent!==t)s.textContent=t})}
function hfInput(el){const p=pageOf(el), i=pages().indexOf(p), k=el.classList.contains('pg-hdr')?'hdr':'ftr';const first=S.hf.first&&i===0;
  const c=el.cloneNode(true);c.querySelectorAll('.pnum').forEach(s=>s.textContent='#');let h=c.innerHTML;if(h==='<p><br></p>'||h==='<br>')h='';
  S.hf[first?(k==='hdr'?'firstHdr':'firstFtr'):k]=h;renderHF(el);}
function enterHF(which='hdr',pageI=0){
  if(S.app!=='doc')return;S.hfMode=true;doc.classList.add('hfmode');renderHF();
  const p=pages()[Math.max(0,pageI)]||pages()[0];const el=p.querySelector('.pg-'+which);
  setTimeout(()=>{placeCaretIn(el,false,true);updateCtx();setTab('hfdesign')},10);logAct('hfOpen');
}
function exitHF(){S.hfMode=false;doc.classList.remove('hfmode');renderHF();placeCaretIn(firstBody(),true);updateCtx();logAct('hfClose');SIM.emit('change')}

/* ---------------- footnotes & endnotes ---------------- */
let noteId=1;
function syncNotes(){
  let n=0;const ps=pages();
  ps.forEach(p=>{
    const box=p.querySelector('.pg-notes');const refs=[...p.querySelectorAll('.pg-body .fnr')];
    refs.forEach(r=>{n++;r.textContent=n;let note=doc.querySelector(`.fn[data-id="${r.dataset.id}"]`);
      if(!note){note=document.createElement('div');note.className='fn';note.dataset.id=r.dataset.id;note.innerHTML=`<sup></sup><span class="fnt" contenteditable="true"></span>`}
      note.querySelector('sup').textContent=n;if(note.parentElement!==box||box.lastElementChild!==note)box.appendChild(note)});
    [...box.querySelectorAll('.fn')].forEach(note=>{if(!refs.find(r=>r.dataset.id===note.dataset.id))note.remove()});
  });
  let e=0;const last=ps[ps.length-1];if(!last)return;
  let end=last.querySelector('.pg-end');if(!end){end=document.createElement('div');end.className='pg-end';last.querySelector('.pg-notes').after(end)}
  ps.forEach(p=>{if(p!==last){const x=p.querySelector('.pg-end');if(x&&x!==end)x.remove()}});
  const erefs=[...doc.querySelectorAll('.pg-body .enr')];
  erefs.forEach(r=>{e++;const t=fmtNum(e,'lroman');if(r.textContent!==t)r.textContent=t;let note=doc.querySelector(`.en[data-id="${r.dataset.id}"]`);
    if(!note){note=document.createElement('div');note.className='en';note.dataset.id=r.dataset.id;note.innerHTML=`<sup></sup><span class="fnt" contenteditable="true"></span>`}
    note.querySelector('sup').textContent=t;end.appendChild(note)});
  [...end.querySelectorAll('.en')].forEach(note=>{if(!erefs.find(r=>r.dataset.id===note.dataset.id))note.remove()});
}

/* ---------------- selection ---------------- */
function editHost(n){const el=n&&(n.nodeType===1?n:n.parentElement);return el?el.closest('[contenteditable="true"]'):null}
function curRange(){const s=getSelection();if(!s.rangeCount)return null;const r=s.getRangeAt(0);return doc.contains(r.commonAncestorContainer)?r:null}
function restoreSel(){const r=S.range;if(!r||!doc.contains(r.startContainer))return false;const h=editHost(r.startContainer);if(h)h.focus({preventScroll:true});const s=getSelection();s.removeAllRanges();s.addRange(r);return true}
function placeCaretIn(el,start=true,selectAll=false){if(!el)return;const r=document.createRange();r.selectNodeContents(el);if(!selectAll||!el.textContent.trim())r.collapse(start);const h=editHost(el)||el;h.focus({preventScroll:true});const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange()}
function selectNode(el){const r=document.createRange();r.selectNodeContents(el);const h=editHost(el);if(h)h.focus({preventScroll:true});const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange()}
function selText(){const r=S.range||curRange();return r?r.toString():''}
const BLOCKS='p,h1,h2,h3,li,div.wquote';
function selBlocks(){
  const r=S.range;if(!r)return [];const host=editHost(r.startContainer);if(!host)return [];
  let out=[...host.querySelectorAll(BLOCKS)].filter(b=>r.intersectsNode(b)&&!b.querySelector(BLOCKS));
  if(!out.length){let n=r.startContainer;n=n.nodeType===1?n:n.parentElement;const b=n.closest(BLOCKS);if(b&&host.contains(b))out=[b]}
  return out;
}
function topBlock(){const r=S.range;if(!r)return null;const host=editHost(r.startContainer);if(!host)return null;let n=r.startContainer;if(n===host)return host.childNodes[Math.min(r.startOffset,host.childNodes.length-1)]||null;n=n.nodeType===1?n:n.parentElement;while(n&&n.parentElement!==host)n=n.parentElement;return n}
function insertBlock(el){const host=S.range?editHost(S.range.startContainer):null;const b=topBlock();
  if(b&&b.parentElement===host){if(b.tagName==='P'&&!b.textContent.trim()&&!b.querySelector('.obj,.eq'))b.replaceWith(el);else b.after(el)}else (host&&host.classList.contains('pg-body')?host:firstBody()).appendChild(el);
  if(!el.nextElementSibling){const p=document.createElement('p');p.innerHTML='<br>';el.after(p)}}
function insertInline(node){if(!restoreSel()){placeCaretIn(firstBody(),false)}const s=getSelection();const r=s.getRangeAt(0);r.deleteContents();r.insertNode(node);r.setStartAfter(node);r.collapse(true);s.removeAllRanges();s.addRange(r);S.range=r.cloneRange();const hf=node.parentElement&&node.parentElement.closest('.pg-hdr,.pg-ftr');if(hf)hfInput(hf)}

/* ---------------- undo ---------------- */
let undoStack=[],redoStack=[],lastCmd=false;
function snap(){undoStack.push(docData());if(undoStack.length>60)undoStack.shift();redoStack=[];lastCmd=true;S.dirty=true}
function undo(){if(!undoStack.length||!lastCmd){document.execCommand('undo');return}redoStack.push(docData());loadData(undoStack.pop());clearObjSel();S.curCell=null;updateCtx();if(!undoStack.length)lastCmd=false;logAct('undo')}
function redo(){if(!redoStack.length){document.execCommand('redo');return}undoStack.push(docData());loadData(redoStack.pop());updateCtx()}

/* ---------------- ribbon wiring ---------------- */
let activeTab='home';
function setTab(t){
  if(t==='file'){if(S.app==='doc'||S.app==='empty')openBackstage('home');return}
  activeTab=t;$$('#wtabs .wtab').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));
  $$('#ribbon .panel').forEach(p=>p.classList.toggle('on',p.dataset.panel===t));closeMenus();syncRibbon();
  logAct('tab:'+t);SIM.emit('tab',t);
}
function closeMenus(){$$('.ddw.open').forEach(d=>d.classList.remove('open'));$$('.subm.open').forEach(s=>s.classList.remove('open'));hideCtx();if(window.removeTablePreview)removeTablePreview()}
function placeAt(el,vx,vy){const s=window.SIMSCALE||1;if(s!==1&&el.closest('#sim')){const r=$('#sim').getBoundingClientRect();el.style.left=((vx-r.left)/s)+'px';el.style.top=((vy-r.top)/s)+'px'}else{el.style.left=vx+'px';el.style.top=vy+'px'}el.style.right='auto'}
function openMenu(w){closeMenus();w.classList.add('open');const b=w.querySelector('[data-dd]').getBoundingClientRect(),dd=w.querySelector('.dd');const s=window.SIMSCALE||1;
  dd.style.maxHeight='';const ww=dd.offsetWidth*s,hh=dd.offsetHeight*s;let vx=b.right-ww;vx=Math.max(4,Math.min(LW()-ww-4,vx));let vy=b.bottom+1;
  if(vy+hh>LH()-6)dd.style.maxHeight=Math.max(120,(LH()-vy-10)/s)+'px';placeAt(dd,vx,vy);
  logAct('menu:'+w.querySelector('[data-dd]').dataset.cmd);SIM.emit('menu')}
function wireRibbon(){
  const tabs=$('#wtabs'), rib=$('#ribbon');
  tabs.addEventListener('mousedown',e=>{if(e.target.closest('button'))e.preventDefault()});
  tabs.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)setTab(b.dataset.tab);const c=e.target.closest('[data-cmd]');if(c&&!b)run(c.dataset.cmd,c.dataset.arg)});
  tabs.addEventListener('dblclick',e=>{if(e.target.closest('[data-tab]')&&!e.target.closest('.file')){rib.classList.toggle('collapsed')}});
  $('.wtbar').addEventListener('mousedown',e=>{if(e.target.closest('button'))e.preventDefault()});
  $('.wtbar').addEventListener('click',e=>{const c=e.target.closest('[data-cmd]');if(c)run(c.dataset.cmd,c.dataset.arg)});
  const onDown=e=>{const b=e.target.closest('button');if(b&&!e.target.closest('input,select'))e.preventDefault()};
  rib.addEventListener('mousedown',onDown);
  document.addEventListener('mousedown',e=>{if(!e.target.closest('.ddw,.subm,#ctxmenu'))closeMenus();},true);
  document.body.addEventListener('click',e=>{
    if(!e.target.closest('#ribbon,#ctxmenu,.dd,.subm'))return;
    const sub=e.target.closest('.has-sub');if(sub){const m=sub.parentElement.querySelector('.subm');openSub(sub,m);return}
    const b=e.target.closest('[data-cmd]');if(!b||b.tagName==='INPUT'||b.tagName==='SELECT')return;
    const w=b.closest('.ddw');
    if(b.hasAttribute('data-dd')){const isSplit=w.classList.contains('split');const onCaret=e.target.closest('.car');
      if(!isSplit||onCaret||!hasDefault(b.dataset.cmd)){if(w.classList.contains('open'))closeMenus();else openMenu(w);return}}
    if(b.closest('.dd,.subm,#ctxmenu'))closeMenus();
    run(b.dataset.cmd,b.dataset.arg,b);
  });
  document.body.addEventListener('mouseover',e=>{const sub=e.target.closest('.has-sub');if(sub&&sub.closest('.dd')){openSub(sub,sub.parentElement.querySelector('.subm'))}});
  rib.addEventListener('change',e=>{const t=e.target;if(!t.dataset.cmd)return;if(t.type==='checkbox')run(t.dataset.cmd,t.checked);else run(t.dataset.cmd,t.value)});
  rib.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'&&e.key==='Enter'){e.preventDefault();e.target.blur()}});
}
function hasDefault(c){return ['paste','underline','highlight','fontcolor','bullets','numbering','pshading','pborders','find','equation','delComment'].includes(c)}
function openSub(btn,m){$$('.subm.open').forEach(x=>{if(x!==m)x.classList.remove('open')});m.classList.add('open');const r=btn.getBoundingClientRect();const s=window.SIMSCALE||1;const ww=m.offsetWidth*s,hh=m.offsetHeight*s;let vx=r.left-ww-2;if(vx<4)vx=r.right+2;let vy=r.top;if(vy+hh>LH()-6)vy=Math.max(4,LH()-hh-6);placeAt(m,vx,vy)}
const OPS={};
function run(cmd,arg,el){
  logAct('cmd:'+cmd+(arg!=null?':'+arg:''));
  if(OPS[cmd]){try{OPS[cmd](arg,el)}catch(err){console.error(cmd,err)}}
  else simToast('هذا الأمر للعرض فقط في المحاكي');
  setTimeout(()=>{syncRibbon();SIM.emit('change')},30);
}
/* reflect current state in ribbon controls */
function syncRibbon(){
  const set=(id,on)=>$$(`#ribbon [data-hid="${id}"]`).forEach(b=>b.classList.toggle('on',!!on));
  const qs=c=>{try{return document.queryCommandState(c)}catch(e){return false}};
  const r=S.range;const inText=r&&editHost(r.startContainer);
  set('bold',inText&&qs('bold'));set('italic',inText&&qs('italic'));set('underline',inText&&qs('underline'));set('strike',inText&&qs('strikeThrough'));set('sub',inText&&qs('subscript'));set('sup',inText&&qs('superscript'));
  set('marks',S.marks);set('printLayout',S.view==='print');set('webLayout',S.view==='web');
  $$('.wstatus .vb button').forEach(b=>b.classList.toggle('on',(b.dataset.cmd==='printLayout'&&S.view==='print')||(b.dataset.cmd==='webLayout'&&S.view==='web')));
  if(inText){const n=r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement;const cs=getComputedStyle(n);
    const fn=$('#ribbon select[data-cmd="fontName"]');if(fn&&document.activeElement!==fn){const f=cs.fontFamily.split(',')[0].replace(/["']/g,'');fn.value=[...fn.options].some(o=>o.value===f)?f:fn.options[0].value}
    const fz=$('#ribbon select[data-cmd="fontSize"]');if(fz&&document.activeElement!==fz){const pt=Math.round(parseFloat(cs.fontSize)*.75*2)/2;const v=String(pt);if(![...fz.options].some(o=>o.value===v)){const o=new Option(v,v);o.dataset.tmp=1;fz.add(o,0)}fz.value=v}
    const b=selBlocks()[0];const al=b?getComputedStyle(b).textAlign:'';set('alignR',al==='right'||al==='start');set('alignC',al==='center');set('alignL',al==='left');set('justify',al==='justify');}
  const chk=(id,v)=>$$(`#ribbon input[data-cmd="${id}"]`).forEach(i=>i.checked=!!v);
  chk('ruler',S.ruler);chk('gridlines',S.grid);chk('nav',S.nav);chk('firstDiff',S.hf.first);chk('showDocText',true);
  const t=S.curCell&&S.curCell.closest('table');if(t){chk('optHeader',!t.classList.contains('nohdr'));chk('optTotal',t.classList.contains('tot'));chk('optBanded',!t.classList.contains('noband'));chk('optFirstCol',t.classList.contains('fcol'));chk('optLastCol',t.classList.contains('lcol'));chk('optBandCols',t.classList.contains('bcols'));
    const rh=$('#ribbon input[data-cmd="rowH"]');if(rh&&document.activeElement!==rh)rh.value=(S.curCell.parentElement.offsetHeight/CM).toFixed(2);const cw=$('#ribbon input[data-cmd="colW"]');if(cw&&document.activeElement!==cw)cw.value=(S.curCell.offsetWidth/CM).toFixed(2)}
  if(S.obj){$$('#ribbon input[data-cmd="objH"]').forEach(i=>{if(document.activeElement!==i)i.value=(S.obj.offsetHeight/CM).toFixed(2)});$$('#ribbon input[data-cmd="objW"]').forEach(i=>{if(document.activeElement!==i)i.value=(S.obj.offsetWidth/CM).toFixed(2)})}
  const b0=selBlocks()[0];if(b0){const cs=getComputedStyle(b0);const ir=$('#ribbon input[data-cmd="indentRight"]');if(ir&&document.activeElement!==ir)ir.value=(parseFloat(cs.marginRight)/CM).toFixed(1);const il=$('#ribbon input[data-cmd="indentLeft"]');if(il&&document.activeElement!==il)il.value=(parseFloat(cs.marginLeft)/CM).toFixed(1);const sb=$('#ribbon input[data-cmd="spBefore"]');if(sb&&document.activeElement!==sb)sb.value=Math.round(parseFloat(cs.marginTop)*.75);const sa=$('#ribbon input[data-cmd="spAfter"]');if(sa&&document.activeElement!==sa)sa.value=Math.round(parseFloat(cs.marginBottom)*.75)}
}
/* contextual tabs */
function updateCtx(){
  if(S.curCell&&!doc.contains(S.curCell))S.curCell=null;if(S.obj&&!doc.contains(S.obj))S.obj=null;
  const r=S.range;const eq=r&&r.startContainer&&(r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement)?.closest?.('.eq');
  const on={table:!!S.curCell,pic:!!(S.obj&&S.obj.classList.contains('pic')),shape:!!(S.obj&&S.obj.classList.contains('shp')),hf:S.hfMode,eq:!!(eq&&doc.contains(eq))};
  $$('#wtabs .wtab.ctx').forEach(b=>b.hidden=!on[b.dataset.ctx]);
  const cur=$(`#wtabs [data-tab="${activeTab}"]`);if(cur&&cur.hidden)setTab('home');
  doc.querySelectorAll('.eq.act').forEach(e=>{if(e!==eq)e.classList.remove('act')});if(eq)eq.classList.add('act');
}
function showCtxTab(t){const b=$(`#wtabs [data-tab="${t}"]`);if(b){b.hidden=false;setTab(t)}}

/* ---------------- document events ---------------- */
let chgT;
function wireDoc(){
  document.addEventListener('selectionchange',()=>{
    const r=curRange();if(!r)return;S.range=r.cloneRange();
    const n=r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement;const td=n.closest&&n.closest('td');
    S.curCell=td&&doc.contains(td)&&td.closest('table.wt')?td:null;
    updateCtx();syncRibbonSoon();SIM.emit('sel');
  });
  new MutationObserver(muts=>{
    if(muts.every(m=>m.target.closest&&m.target.closest('.dd,.subm')))return;
    if(muts.some(m=>m.type!=='attributes'||m.attributeName!=='class'))S.dirty=true;clearTimeout(chgT);chgT=setTimeout(()=>{syncNotes();fillPageNums();updateStatus();updateTitle();SIM.emit('change')},120);
  }).observe(doc,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['style','class','colspan','rowspan','data-w','data-h','data-rot','data-wrap']});
  doc.addEventListener('input',e=>{lastCmd=false;const h=e.target.closest('.pg-hdr,.pg-ftr');if(h)hfInput(h);const b=e.target.closest('.pg-body');if(b&&!b.innerHTML.trim())b.innerHTML='<p><br></p>'});
  doc.addEventListener('dblclick',e=>{
    if(S.app!=='doc')return;const p=pageOf(e.target);if(!p)return;
    if(!S.hfMode){const y=e.clientY-p.getBoundingClientRect().top,ph=p.getBoundingClientRect().height,mt=parseFloat(getComputedStyle(p).paddingTop)*S.zoom/100*(window.SIMSCALE||1),mb=parseFloat(getComputedStyle(p).paddingBottom)*S.zoom/100*(window.SIMSCALE||1);
      if(y<mt){e.preventDefault();enterHF('hdr',pages().indexOf(p))}else if(y>ph-mb){e.preventDefault();enterHF('ftr',pages().indexOf(p))}}
    else if(e.target.closest('.pg-body')||(!e.target.closest('.pg-hdr,.pg-ftr'))){exitHF()}
  });
  doc.addEventListener('keydown',docKeys);
  document.addEventListener('keydown',globalKeys);
  doc.addEventListener('contextmenu',e=>{const o=e.target.closest('.obj');if(o){e.preventDefault();if(window.objContext)objContext(o,e.clientX,e.clientY);return}
    if(e.target.closest('.pg-body')){e.preventDefault();showCtx(e.clientX,e.clientY,[['cut',null,'قص','cut'],['copy',null,'نسخ','copy'],['paste',null,'لصق','paste'],'-',['fontDlg',null,'خط...','fonts'],['paraDlg',null,'فقرة...','linespacing'],'-',['newComment',null,'تعليق جديد','newcomment']])}});
  canvas.addEventListener('mousedown',e=>{if(e.target===canvas||e.target===doc){/* click on gray */}});
}
let srT;function syncRibbonSoon(){clearTimeout(srT);srT=setTimeout(syncRibbon,60)}
function docKeys(e){
  const k=e.key;
  if(k==='Enter'&&!e.shiftKey&&!e.ctrlKey){if(window.tryRand&&tryRand()){e.preventDefault();return}}
  if(k==='Enter'&&e.shiftKey&&!e.ctrlKey){e.preventDefault();document.execCommand('insertHTML',false,'<br class="brk">');return}
  if(k==='Enter'&&e.ctrlKey){e.preventDefault();OPS.pageBreak();return}
  if(k==='Tab'){if(window.tableTab&&tableTab(e))return;e.preventDefault();if(window.curEq&&curEq())return;document.execCommand('insertHTML',false,'<span class="tabc">&#9;</span>');}
}
function globalKeys(e){
  if(!$('#sim')||$('#sim').offsetParent===null)return;
  const k=e.key.toLowerCase(),c=e.ctrlKey||e.metaKey;
  if(k==='escape'){closeMenus();if(!$('#readmode').hidden){OPS.exitRead();return}if(window.cancelDraw)cancelDraw();if(!$('#backstage').hidden&&S.app==='doc'){closeBackstage();return}if(S.hfMode){exitHF();return}}
  if(e.target.closest&&e.target.closest('input,select,textarea')&&!e.target.closest('#sim .rnum'))return;
  if(c&&!e.altKey){
    const map={s:'save',z:'undo',y:'redo',e:'alignC',r:'alignR',l:'alignL',j:'justify',f:'find',h:'replace',p:'print',o:'openCmd',n:'newCmd'};
    if(k==='z'&&!lastCmd)return; // native undo for typing
    if(map[k]&&S.app!=='desktop'){e.preventDefault();run(map[k]);return}
    if(k==='enter'){return}
  }
  if(e.altKey&&k==='='&&!c){e.preventDefault();run('insEq');return}
  if(c&&e.altKey&&k==='f'){e.preventDefault();run('footnote');return}
  if((k==='delete'||k==='backspace')&&S.obj&&!e.target.closest('.stxt,.eq')){e.preventDefault();snap();S.obj.remove();clearObjSel();updateCtx();SIM.emit('change');return}
}

/* ---------------- status bar / zoom / views ---------------- */
function wireStatus(){
  const z=$('#zoomR');z.addEventListener('input',()=>{setZoom(+z.value)});
  $('.wstatus').addEventListener('mousedown',e=>{if(e.target.closest('button'))e.preventDefault()});
  $('.wstatus').addEventListener('click',e=>{const b=e.target.closest('[data-cmd]');if(b)run(b.dataset.cmd,b.dataset.arg)});
  canvas.addEventListener('scroll',()=>updateStatus(true));
}
function setZoom(v){S.zoom=Math.max(10,Math.min(500,Math.round(v)));doc.style.zoom=S.zoom/100;$('#zoomR').value=S.zoom;$('#zoomT').textContent=S.zoom+'%';renderRuler();logAct('zoom:'+S.zoom);SIM.emit('change')}
function wordCount(){let t='';doc.querySelectorAll('.pg-body').forEach(b=>t+=' '+b.innerText);return (t.trim().match(/\S+/g)||[]).length}
function updateStatus(scrollOnly){
  const ps=pages();let cur=0;const cr=canvas.getBoundingClientRect();ps.forEach((p,i)=>{const r=p.getBoundingClientRect();if(r.top<cr.top+cr.height/2)cur=i});
  if(S.range){const pi=pageIndex(S.range.startContainer.nodeType===1?S.range.startContainer:S.range.startContainer.parentElement);if(pi>=0&&!scrollOnly)cur=pi}
  $('#stPage').textContent=`الصفحة ${cur+1} من ${ps.length||1}`;if(!scrollOnly)$('#stWords').textContent=wordCount()+' كلمة';
  if(S.nav&&window.renderNav&&!scrollOnly)renderNav();
}
