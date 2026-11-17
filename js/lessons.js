/* ================= Lesson builders: «تعلّم الأوامر» + «مهام» (شاهد وجرّب / نفّذ) ================= */
/* per-command extras: val (select/number), pick (menu/gallery item selector), sel (what to select first), custom steps */
const PK=(cmd,arg)=>`.ddw.open [data-cmd="${cmd}"]${arg!=null?`[data-arg="${arg}"]`:''}`;
const SUBPK=(cmd,arg)=>`.subm.open [data-cmd="${cmd}"][data-arg="${arg}"]`;
const CX={
 e1:{_sel:'word:أريحا',_in:'.pg-body p:nth-of-type(2)',
   fontName:{val:'Simplified Arabic'},fontSize:{val:'20'},grow:{},clearfmt:{},bold:{},strike:{},sup:{sel:'word:2'},textfx:{pick:'.ddw.open .fxgal [data-arg="0"]'},fontcolor:{},highlight:{},
   alignR:{sel:'caret'},alignC:{sel:'caret'},alignL:{sel:'caret'},justify:{sel:'caret'},bullets:{sel:'caret'},numbering:{sel:'caret'},multilevel:{sel:'caret',pick:'.ddw.open [data-cmd="multilevel"][data-arg="1"]'},indentInc:{sel:'caret'},linespacing:{sel:'caret',pick:PK('linespacing','2.0')},pshading:{sel:'caret'},sort:{sel:'list'},
   'style-title':{sel:'caret',in:'.pg-body p:first-child'},'style-h1':{sel:'caret',in:'.pg-body p:first-child'},'style-h2':{sel:'caret',in:'.pg-body p:first-child'},'style-normal':{sel:'caret',in:'.pg-body p:first-child'},
   copy:{},cut:{},painter:{},paste:{custom:'paste'},find:{sel:'none'},replace:{sel:'none'},select:{sel:'none',pick:PK('selectAll')},marks:{sel:'none'}},
 e2:{toc:{pick:PK('tocIns','auto1'),sel:'caret0'},updateToc:{setupTOC:1},'style-h1':{sel:'caret',in:'#k0'}},
 e3:{pictures:{pick:PK('insPic','1')},corrections:{pick:'.ddw.open [data-cmd="corrections"]:nth-child(3)'},picColor:{pick:'.ddw.open [data-cmd="picColor"]:nth-child(2)'},artistic:{pick:'.ddw.open [data-cmd="artistic"]:nth-child(3)'},pstyles:{pick:'[data-panel="pformat"] [data-hid="pstyle-shadow"]'},picBorder:{pick:'.ddw.open .sw[data-arg="#ff0000"]'},picEffects:{pick:PK('picEffects','shadow')},wrap:{pick:PK('wrap','square')},position:{pick:PK('position','tr')},rotate:{pick:PK('rotate','90')},objH:{val:'3'}},
 e4:{shapes:{custom:'shape'},sstyles:{pick:'[data-panel="sformat"] [data-cmd="sstyle"][data-arg="1"]'},shapeFill:{pick:'.ddw.open .sw[data-arg="#ffc000"]'},shapeOutline:{pick:'.ddw.open .sw[data-arg="#c00000"]'},shapeEffects:{pick:PK('shapeEffects','shadow')},wrap:{pick:PK('wrap','square')},objH:{val:'4'}},
 e5:{textbox:{custom:'textbox'},shapeFill:{pick:'.ddw.open .sw[data-arg="#fff2cc"]'},shapeOutline:{pick:PK('shapeOutline','none')},position:{pick:PK('position','tr')}},
 e6:{wordart:{custom:'wordart'},textFill:{pick:'.ddw.open .sw[data-arg="#ff0000"]'},textOutline:{pick:'.ddw.open .sw[data-arg="#000000"]'},textEffects:{pick:PK('textEffects','glow')},wrap:{pick:PK('wrap','square')}},
 e7:{table:{custom:'table'},tstyles:{pick:'[data-panel="tdesign"] [data-hid="tstyle-1"]'},shading:{row:1,pick:'.ddw.open .sw[data-arg="#ffff00"]'},tborders:{pick:PK('tborders','outside')},penColor:{pick:'.ddw.open .sw[data-arg="#ff0000"]'},tdelete:{pick:PK('tdel','row'),cell:[2,0]},merge:{row:0},splitCells:{},rowH:{val:'1.5'},insBelow:{cell:[2,0]},insLeft:{cell:[0,2]}},
 e8:{header:{pick:PK('header','0')},footer:{pick:PK('footer','0')}},
 e9:{pagenum:{custom:'pagenum'}},
 e10:{insComment:{sel:'word:ومفيدة'},newComment:{sel:'word:ومفيدة'},nextComment:{},delComment:{sel:'cmt'}},
 e11:{footnote:{sel:'caretEnd'},endnote:{sel:'caretEnd'},nextNote:{pick:PK('nextNote','fn')}},
 e12:{datetime:{sel:'caretEnd'}},
 e13:{symbol:{pick:PK('insSymbol','©'),sel:'caretEnd'}},
 e14:{equation:{sel:'caretEnd'},eqsym:{pick:'[data-panel="eqdesign"] .eqs [data-arg="π"]'},eqFrac:{pick:PK('eqFrac','stack')},eqScript:{pick:PK('eqScript','sup')},eqRad:{pick:PK('eqRad','sq')}},
 u4:{cover:{pick:PK('cover','0')},margins:{pick:PK('margins','narrow')},orient:{pick:PK('orient','landscape')},psize:{pick:PK('psize','A5')},columns:{pick:PK('columns','2')},breaks:{pick:PK('pageBreak'),sel:'caretEnd'},lineNums:{pick:PK('lineNums','cont')},watermark:{pick:PK('watermark','مسودة')},pageColor:{pick:'.ddw.open .sw[data-arg="#deebf6"]'},blankPage:{sel:'caretEnd'},pageBreak:{sel:'caretEnd'}},
 u3:{themes:{pick:PK('theme','3')}},
};
const CUSTOM={
 paste:()=>[SELW('.pg-body p:nth-of-type(2)','أريحا'),B('home','copy','انقر «نسخ»  (Ctrl + C)',()=>logHas('copy')),CARET('.pg-body p:last-child','انقر آخر الفقرة الأخيرة'),{...B('home','paste','<span class="bt">لصق</span>تظهر الكلمة مكان المؤشر  (Ctrl + V)'),done:()=>CO.hit}],
 shape:()=>[TAB('insert'),M('insert','shapes','<span class="bt">أشكال</span>نختار الشكل ونرسمه بالسحب'),I(PK('insShape','star'),'اختر النجمة',()=>S.drawKind==='star'||!!shp()),{...DRAW('اسحب على الصفحة — مع Shift يبقى متناسقًا'),done:()=>CO.hit||!!shp('star')}],
 textbox:()=>[TAB('insert'),M('insert','textbox','<span class="bt">مربع نص</span>نرسم المربع ونكتب داخله'),I(PK('drawTextbox'),'اختر «رسم مربع نص»',()=>S.drawKind==='textbox'||!!doc.querySelector('.obj.textbox')),{...DRAW('اسحب على الصفحة لرسم المربع'),done:()=>!!doc.querySelector('.obj.textbox')}],
 wordart:()=>[TAB('insert'),M('insert','wordart','<span class="bt">WordArt</span>نختار نمطًا ونكتب النص'),{...I(PK('insWordArt','1'),'اختر نمطًا'),done:()=>!!doc.querySelector('.obj.wordart')}],
 table:()=>[TAB('insert'),M('insert','table','<span class="bt">جدول</span>نحدّد عدد الصفوف والأعمدة'),{...I('#tgrid span[data-r="3"][data-c="4"]','مرّر الفأرة على المربعات ثم انقر',()=>!!doc.querySelectorAll('table.wt:not(.prev)')[1],()=>{closeMenus();insertTable(3,4)}),pre:()=>$('#tgrid span[data-r="3"][data-c="4"]').dispatchEvent(new MouseEvent('mouseover',{bubbles:true}))}],
 pagenum:()=>[TAB('insert'),M('insert','pagenum','<span class="bt">رقم الصفحة</span>أعلى الصفحة أو أسفلها، يمين أو وسط أو يسار'),SUB('pnBot','اختر «أسفل الصفحة»'),{...I(SUBPK('pagenumIns','bottom-center'),'اختر «رقم عادي 2»'),done:()=>/pnum/.test(S.hf.ftr)}],
};
const PARTS_SET=new Set(['qat-save','titlebar','winbtns','tabsbar','ribbonbar','page-el','statusbar','st-zoom','tab-file']);
function swPick(dd){const red=dd.querySelector('.sw[data-arg="#ff0000"]');if(red)return '.ddw.open .sw[data-arg="#ff0000"]';const c=[...dd.querySelectorAll('[data-cmd]')].filter(x=>!x.closest('.subm'));const x=c[Math.min(1,c.length-1)];if(!x)return null;return `.ddw.open [data-cmd="${x.dataset.cmd}"]`+(x.dataset.arg!=null?`[data-arg="${x.dataset.arg}"]`:'')}
function selSteps(u,c,x){
  const s=x.sel!==undefined?x.sel:(CX[u.id]||{})._sel;const inSel=x.in||(CX[u.id]||{})._in||'.pg-body p';const st=[];
  if(!s||s==='none')return st;
  if(s.startsWith('word:')){st.push(SELW(inSel,s.slice(5),`حدِّد كلمة «${s.slice(5)}» أولًا`))}
  else if(s==='caret')st.push(CARET(inSel,'انقر داخل الفقرة'));
  else if(s==='caret0')st.push(CARET('.pg-body p:first-child','انقر في أول المستند',false));
  else if(s==='caretEnd')st.push(CARET('.pg-body p','ضع المؤشر في آخر السطر'));
  else if(s==='list')st.push(E('.pg-body','حدِّد عناصر القائمة',()=>selText().includes('قلم')&&selText().includes('مسطرة'),()=>{const b=firstBody();const L=b.querySelector('ul,ol')||b;const r=document.createRange();r.selectNodeContents(L);b.focus();const g=getSelection();g.removeAllRanges();g.addRange(r);S.range=r.cloneRange()}));
  else if(s==='cmt')st.push(E('#doc .cmt','انقر على الكلمة المعلَّق عليها',()=>!!S.activeC,()=>{S.activeC=+doc.querySelector('.cmt').dataset.c;renderComments()}));
  return st;
}
function cmdLesson(u,c){
  const x=(CX[u.id]||{})[c.t]||{};const key='c:'+c.t+(c.ctx&&c.ctx!=='doc'?':'+c.ctx:'');
  let setup=u.cmdSetup||u.exploreSetup||{};
  if(c.t==='sort')setup={html:'<p>رتّب الأدوات أبجديًا:</p><ul><li>مسطرة</li><li>قلم</li><li>دفتر</li></ul>'};
  if(c.ctx==='hf')setup={...setup,hfMode:'hdr',hf:{hdr:'<p>سارة حرب</p>'}};
  if(c.ctx==='eq'){const b=setup;setup={...b,after:()=>{if(b.after)b.after();placeCaretIn(firstBody().lastElementChild,false);OPS.insEq();setTab('home')}}}
  if(x.setupTOC){const b=setup;setup={...b,after:()=>{if(b.after)b.after();placeCaretIn(firstBody().querySelector('p'));OPS.tocIns('auto1');const h=$('#k1');if(h)h.textContent='المقدمة والأهداف'}}}
  const title=`<span class="bt">${c.n}</span>${c.d}`;
  const steps=[];let final=null;
  if(x.custom){steps.push(...CUSTOM[x.custom]());return {key,kind:'cmd',t:c.n,d:c.d,ic:c.ic,setup,steps,check:()=>CO.hit||steps.at(-1).done(),after:c.d,hint:c.key?'الاختصار: '+c.key:null}}
  // context
  if(c.ctx==='pic')steps.push(PICK('.obj.pic'));
  if(c.ctx==='shape')steps.push(PICK('.obj.shp','انقر على الشكل لتحديده'));
  if(c.ctx==='textbox')steps.push(PICK('.obj.textbox','انقر على حدّ مربع النص'));
  if(c.ctx==='wordart')steps.push(PICK('.obj.wordart','انقر على WordArt'));
  if(c.ctx==='table'){if(x.row!=null)steps.push(ROWSEL(x.row,'حدِّد خلايا الصف بالسحب'));else{const [r,cc]=x.cell||[1,1];steps.push(CELL(r,cc))}}
  if(c.ctx==='eq')steps.push(E('#doc .eq','انقر داخل مربع المعادلة',()=>!!curEq(),()=>{const e=doc.querySelector('.eq');const r=document.createRange();r.selectNodeContents(e);r.collapse(false);editHost(e).focus();const g=getSelection();g.removeAllRanges();g.addRange(r);S.range=r.cloneRange();updateCtx()}));
  steps.push(...selSteps(u,c,x));
  if(c.ctx==='bs'||String(c.t).startsWith('bs-')){steps.push(TAB('file'));final=`#backstage [data-hid="${c.t}"]`;steps.push({el:()=>$(final),say:title,done:()=>CO.hit,act:()=>$(final).click()});return mk()}
  if(PARTS_SET.has(c.t)||(!c.tab&&!tabOfCmd(c.t))){final=`#sim [data-hid="${c.t}"]`;steps.push({el:()=>$$(final).find(vis),say:title+'<em class="tapme">انقر عليه</em>',done:()=>CO.hit,act:()=>{const e=$$(final).find(vis);e&&e.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});return mk()}
  const tab=c.tab||tabOfCmd(c.t);steps.push(TAB(tab));
  const sel=`#ribbon [data-panel="${tab}"] [data-hid="${c.t}"]`;const el=$(sel);
  if(!el){final=sel;steps.push({el:()=>$(sel),say:title,done:()=>CO.hit,act:()=>{}});return mk()}
  if(el.tagName==='SELECT'){final=sel;steps.push({el:()=>$(sel),say:title+` — اختر <b>${x.val}</b>`,done:()=>CO.hit,act:()=>{const s=$(sel);s.value=x.val;s.dispatchEvent(new Event('change',{bubbles:true}))}})}
  else if(el.classList.contains('rck')){final=sel+' input';steps.push({el:()=>$(sel),say:title+' — ضع إشارة ✓',done:()=>CO.hit,act:()=>{const i=$(sel).querySelector('input');i.checked=!i.checked;i.dispatchEvent(new Event('change',{bubbles:true}))}})}
  else if(el.classList.contains('rnum')){final=sel+' input';steps.push({el:()=>$(sel),say:title+` — اكتب <b>${x.val}</b>`,done:()=>CO.hit,act:()=>{const i=$(sel).querySelector('input');i.value=x.val;i.dispatchEvent(new Event('change',{bubbles:true}))}})}
  else if(el.classList.contains('rgal')){final=x.pick||`${sel} [data-cmd]:nth-child(2)`;steps.push({el:()=>$(final),say:title+' — اختر واحدًا',done:()=>CO.hit,act:()=>$(final).click()})}
  else if(el.hasAttribute('data-dd')&&!(el.closest('.split')&&!x.pick)){steps.push(M(tab,c.t,title));final=x.pick||swPick(el.closest('.ddw').querySelector('.dd'));steps.push({el:()=>$$(final).find(vis),say:'اختر من القائمة',done:()=>CO.hit,act:()=>($$(final).find(vis)||$(final)).click()})}
  else{final=sel;steps.push({el:()=>$(sel),say:title,done:()=>CO.hit,act:()=>$(sel).click()})}
  return mk();
  function mk(){return {key,kind:'cmd',t:c.n,d:c.d,ic:c.ic,setup,steps,final,check:()=>CO.hit,after:c.d,hint:c.key?'الاختصار: '+c.key:null}}
}
/* «نفّذ» tasks — the guide's on-device tasks, checked with feedback */
const R=(t,check,where,fix,cmd)=>({t,check,where,fix,cmd});
const firstPara=()=>firstBody().querySelectorAll('p')[1];
const EXAMS={
 u1:{t:'نفّذ: من الحاسوب إلى أول مستند',setup:{app:'desktop'},reqs:[R('افتح برنامج وورد',()=>S.app!=='desktop',()=>$('#startbtn'),'انقر «ابدأ» ← اكتب Word ← Enter'),R('أنشئ مستندًا فارغًا',()=>logHas('newdoc'),()=>$('[data-hid="bs-blank"]'),'في شاشة البداية انقر «مستند فارغ»'),R('أضف صفحة جديدة',()=>S.app==='doc'&&pages().length>=2,()=>firstBody(),'إدراج ← صفحة فارغة','blankPage'),R('اكتب نصًّا',()=>S.app==='doc'&&[...doc.querySelectorAll('.pg-body')].some(b=>b.textContent.trim().length>2),()=>firstBody(),'انقر على الصفحة واكتب بلوحة المفاتيح'),R('أضف صورة',()=>!!doc.querySelector('.obj.pic'),()=>firstBody(),'إدراج ← صور','pictures')]},
 u2:{t:'نفّذ: تجوّل في الواجهة',setup:{html:TRIP},reqs:[R('افتح قائمة «صور»',()=>logHas('menu:pictures'),()=>$('#wtabs'),'«صور» في تبويب إدراج ← رسومات توضيحية','pictures'),R('افتح قائمة «الهوامش»',()=>logHas('menu:margins'),()=>$('#wtabs'),'«الهوامش» في تبويب تخطيط ← إعداد الصفحة','margins'),R('صغّر النافذة ثم أعِدها',()=>logHas('minimize')&&logHas('restore'),()=>$('[data-hid="winbtns"]'),'زر التصغير — ثم أيقونة Word في شريط المهام')]},
 u3:{t:'نفّذ: مستند جديد ومحفوظ',setup:{html:TRIP,file:'رحلتي',where:'المستندات'},reqs:[R('أنشئ مستندًا جديدًا',()=>logHas('newdoc'),()=>$('[data-hid="tab-file"]'),'ملف ← جديد ← مستند فارغ'),R('اكتب اسمك فيه',()=>logHas('newdoc')&&firstBody().textContent.trim().length>1,()=>firstBody(),'انقر على الصفحة واكتب اسمك'),R('احفظه على سطح المكتب',()=>logHas(/^save:.*@سطح المكتب$/),()=>$('[data-hid="tab-file"]'),'ملف ← حفظ باسم ← سطح المكتب ← اكتب الاسم ← حفظ'),R('احفظ نسخة باسم «نسخة 2»',()=>logHas('save:نسخة 2'),()=>$('[data-hid="tab-file"]'),'ملف ← حفظ باسم ← اكتب «نسخة 2» ← حفظ')]},
 u4:{t:'نفّذ: جهّز الصفحة',setup:{html:TRIP},reqs:[R('أضف صفحة جديدة',()=>pages().length>=2,()=>firstBody(),'Ctrl + Enter أو إدراج ← صفحة فارغة','pageBreak'),R('اجعل الهوامش ضيّقة',()=>S.page.margin==='narrow',()=>$('#hruler'),'تخطيط ← الهوامش ← ضيقة','margins'),R('اجعل الاتجاه أفقيًّا',()=>S.page.orient==='landscape',()=>pages()[0],'تخطيط ← الاتجاه ← أفقي','orient'),R('غيّر لون الصفحة',()=>!!S.page.color,()=>pages()[0],'تصميم ← لون الصفحة','pageColor')]},
 e1:{t:'نفّذ: نسّق تقرير الرحلة',setup:{html:'<p>رحلتي إلى أريحا</p><p style="font-family:Times New Roman">ذهبت المدرسة إلى أريحا، وزرنا قصر هشام وتل السلطان. كانت المدرسة منظّمة جدًا.</p><p>شكرًا لإدارة المدرسة على هذا اليوم.</p>'},reqs:[
   R('السطر الأول بنمط «العنوان»',()=>!!firstBody().querySelector('.wtitle'),()=>firstBody().firstElementChild,'انقر في السطر ← أنماط ← العنوان','style-title'),
   R('الفقرة الثانية بخط Arial',()=>{const p=firstPara();return !!p&&[...p.querySelectorAll('span')].some(s=>/Arial/.test(s.style.fontFamily))},firstPara,'ثلاث نقرات على الفقرة ← نوع الخط: Arial','fontName'),
   R('الفقرة الثانية بحجم 16',()=>{const p=firstPara();return !!p&&[...p.querySelectorAll('span')].some(s=>s.style.fontSize==='16pt')},firstPara,'حدّد الفقرة ← حجم الخط: 16','fontSize'),
   R('الفقرة الثانية بمحاذاة «ضبط»',()=>{const p=firstPara();return !!p&&getComputedStyle(p).textAlign==='justify'},firstPara,'انقر في الفقرة ← ضبط (Ctrl + J)','justify'),
   R('استبدل «المدرسة» بـ «الرحلة» في كل المستند',()=>!firstBody().textContent.includes('المدرسة'),()=>[...firstBody().querySelectorAll('p')].find(p=>p.textContent.includes('المدرسة')),'تحرير ← استبدال ← استبدال الكل','replace')]},
 e2:{t:'نفّذ: جدول محتويات صحيح',setup:{pages:['<p><br></p><p id="k1">المقدمة</p><p>'+P1+'</p>','<p id="k2">الأشجار</p><p>'+P2+'</p>','<p id="k3">الخاتمة</p><p>'+P1+'</p>']},reqs:[
   R('نسّق العناوين الثلاثة بنمط «عنوان 1»',()=>['k1','k2','k3'].every(k=>$('#'+k)?.tagName==='H1'),()=>['k1','k2','k3'].map(k=>$('#'+k)).find(e=>e&&e.tagName!=='H1'),'انقر في العنوان ← أنماط ← عنوان 1','style-h1'),
   R('أضف جدول محتويات في أول المستند',()=>!!doc.querySelector('.toc'),()=>firstBody().firstElementChild,'ضع المؤشر في أول سطر ← مراجع ← جدول المحتويات ← تلقائي 1','toc'),
   R('الجدول يعرض العناوين الثلاثة',()=>doc.querySelectorAll('.toc .te').length>=3,()=>doc.querySelector('.toc'),'مراجع ← تحديث الجدول ← بأكمله','updateToc')]},
 e3:{t:'نفّذ: صورة في التقرير',setup:{html:'<p class="wtitle">رحلتي إلى أريحا</p><p><br></p><p>'+P1+' '+P2+'</p><p>'+P2+'</p>',caret:'.pg-body p:nth-of-type(2)'},reqs:[
   R('أدرج صورة',()=>!!pics(),()=>firstBody().children[1],'إدراج ← صور','pictures'),R('اجعل النص يلتف حولها (مربع)',()=>pics()?.dataset.wrap==='square',pics,'انقر على الصورة ← تنسيق الصورة ← التفاف النص ← مربع','wrap'),
   R('أضف لها نمطًا جاهزًا',()=>!!pics()?.dataset.ps&&pics().dataset.ps!=='none',pics,'تنسيق الصورة ← أنماط الصورة','pstyles'),R('اقتصّ جزءًا منها',()=>{const o=pics();return !!o&&+o.dataset.w<+o.dataset.iw-5},pics,'تنسيق الصورة ← اقتصاص ← اسحب المقابض السوداء','crop')]},
 e4:{t:'نفّذ: نجمة «ابدأ»',setup:{html:'<p>'+P1+'</p>'},reqs:[R('ارسم نجمة',()=>!!shp('star'),()=>firstBody(),'إدراج ← أشكال ← نجمة ← اسحب على الصفحة','shapes'),R('غيّر لون تعبئتها',()=>!!shp('star')&&shp('star').dataset.fill!=='#4472c4',()=>shp('star'),'انقر على النجمة ← تعبئة الشكل','shapeFill'),R('غيّر لون حدودها',()=>!!shp('star')&&shp('star').dataset.line!=='#2f528f',()=>shp('star'),'مخطط الشكل ← اختر لونًا','shapeOutline'),R('اكتب داخلها «ابدأ»',()=>!!shp('star')&&shp('star').querySelector('.stxt').textContent.includes('ابدأ'),()=>shp('star'),'زر الفأرة الأيمن على النجمة ← إضافة نص')]},
 e5:{t:'نفّذ: بطاقة اسمي',setup:{html:'<p>'+P1+'</p><p>'+P2+'</p>'},reqs:[R('أضف مربع نص فيه اسمك',()=>{const t=doc.querySelector('.obj.textbox .stxt');return !!t&&t.textContent.trim().length>1},()=>firstBody(),'إدراج ← مربع نص ← رسم مربع نص','textbox'),R('أخفِ إطاره',()=>doc.querySelector('.obj.textbox')?.dataset.line==='none',()=>doc.querySelector('.obj.textbox'),'تنسيق الشكل ← مخطط الشكل ← بلا مخطط','shapeOutline'),R('لوّن خلفيته',()=>{const o=doc.querySelector('.obj.textbox');return !!o&&o.dataset.fill!=='#ffffff'},()=>doc.querySelector('.obj.textbox'),'تنسيق الشكل ← تعبئة الشكل','shapeFill'),R('انقله إلى أعلى الصفحة',()=>{const o=doc.querySelector('.obj.textbox');return !!o&&+o.dataset.y<90},()=>doc.querySelector('.obj.textbox'),'اسحبه من حدّه عند ظهور ✥')]},
 e6:{t:'نفّذ: عنوان فنّي',setup:{html:'<p><br></p><p>'+P1+'</p>',caret:'.pg-body p',caretStart:true},reqs:[R('أضف عنوانًا بـ WordArt',()=>{const t=doc.querySelector('.obj.wordart .stxt');return !!t&&t.textContent.trim()&&t.textContent.trim()!=='النص هنا'},()=>firstBody(),'إدراج ← WordArt ← اختر نمطًا ← اكتب','wordart'),R('غيّر لون الحروف',()=>{const o=doc.querySelector('.obj.wordart');return !!o&&!WA_STYLES.some(w=>w.fill===o.dataset.tfill)},()=>doc.querySelector('.obj.wordart'),'تنسيق الشكل ← تعبئة النص','textFill'),R('أضف توهّجًا',()=>doc.querySelector('.obj.wordart')?.dataset.tfx==='glow',()=>doc.querySelector('.obj.wordart'),'تنسيق الشكل ← تأثيرات النص ← توهّج','textEffects')]},
 e7:{t:'نفّذ: جدول برنامج الرحلة',setup:{html:'<p class="wtitle">برنامج الرحلة</p><p><br></p>',caret:'.pg-body p:last-child'},reqs:[
   R('أدرج جدولًا من 3 أعمدة',()=>{const t=doc.querySelector('table.wt:not(.prev)');return !!t&&cols(t)===3&&t.rows.length>=4},()=>firstBody().lastElementChild,'إدراج ← جدول ← حدّد 3 × 4','table'),
   R('طبّق نمطًا جاهزًا',()=>/\bts[1-9]\b/.test(doc.querySelector('table.wt')?.className||''),()=>doc.querySelector('table.wt'),'انقر داخل الجدول ← تصميم الجدول ← أنماط الجداول','tstyles'),
   R('أضف صفًّا في الأسفل (5 صفوف)',()=>(doc.querySelector('table.wt')?.rows.length||0)>=5,()=>doc.querySelector('table.wt'),'انقر في الصف الأخير ← تخطيط ← إدراج أسفل','insBelow'),
   R('ادمج خلايا الصف الأول',()=>{const r=doc.querySelector('table.wt')?.rows[0];return !!r&&r.cells.length===1},()=>doc.querySelector('table.wt')?.rows[0],'حدّد الصف الأول ← تخطيط ← دمج الخلايا','merge')]},
 e8:{t:'نفّذ: رأس وتذييل التقرير',setup:{pages:['<p class="wtitle">الغلاف</p>','<p>'+P1+'</p>','<p>'+P2+'</p>']},reqs:[R('رأس فيه اسمك',()=>hfText('hdr').length>1||(S.hf.firstHdr&&false),()=>pages()[1]?.querySelector('.pg-hdr'),'إدراج ← رأس الصفحة ← فارغ ← اكتب اسمك','header'),R('تذييل فيه اسم مدرستك',()=>hfText('ftr').length>1,()=>pages()[1]?.querySelector('.pg-ftr'),'إدراج ← تذييل الصفحة ← فارغ','footer'),R('التاريخ في الرأس',()=>/dtf|dtx/.test(S.hf.hdr),()=>pages()[1]?.querySelector('.pg-hdr'),'رأس وتذييل ← التاريخ والوقت','datetime'),R('الصفحة الأولى بلا رأس',()=>S.hf.first,()=>pages()[0]?.querySelector('.pg-hdr'),'رأس وتذييل ← صفحة أولى مختلفة','firstDiff')]},
 e9:{t:'نفّذ: ترقيم الصفحات',setup:{html:TRIP},reqs:[R('رقم أسفل الصفحة في الوسط',()=>/pnum/.test(S.hf.ftr)&&/center/.test(S.hf.ftr),()=>pages()[0].querySelector('.pg-ftr'),'إدراج ← رقم الصفحة ← أسفل الصفحة ← رقم عادي 2','pagenum'),R('صفحة ثانية برقمها',()=>pages().length>=2,()=>firstBody(),'Ctrl + Enter','pageBreak'),R('الأرقام بالحروف: أ، ب، ج',()=>S.hf.pnFmt==='abjad',()=>pages()[0].querySelector('.pg-ftr'),'رقم الصفحة ← تنسيق أرقام الصفحات','pagenum')]},
 e10:{t:'نفّذ: راجع ملاحظات المعلّمة',setup:{html:'<p>كانت الرحلة <span class="cmt" data-c="900">رائعة</span> ومفيدة جدًا.</p><p>'+P2+'</p>',comments:[{id:900,author:'المعلّمة',text:'أحسنتِ، أضيفي مثالًا.',posted:true,replies:[]}]},reqs:[R('ردّ على تعليق المعلّمة',()=>S.comments.some(c=>c.id==900&&c.replies.length),()=>$('#cmtpane'),'اكتب في مربع «رد» داخل التعليق ← إرسال'),R('أضف تعليقك على كلمة «قصر»',()=>S.comments.some(c=>c.author==='سارة حرب'&&c.posted&&doc.querySelector(`.cmt[data-c="${c.id}"]`)?.textContent.includes('قصر')),()=>firstBody().children[1],'حدّد الكلمة ← مراجعة ← تعليق جديد ← نشر','newComment')]},
 e11:{t:'نفّذ: حواشي التقرير',setup:{html:'<p>زرنا مدينة أريحا وقصر هشام في الربيع.</p>'},reqs:[R('حاشية سفلية بعد «أريحا» مع شرحها',()=>{const f=doc.querySelector('.fnr');return !!f&&f.previousSibling?.nodeValue?.trim().endsWith('أريحا')&&doc.querySelector('.fn .fnt').textContent.trim().length>1},()=>firstP(),'ضع المؤشر بعد الكلمة ← مراجع ← إدراج حاشية سفلية ← اكتب الشرح','footnote'),R('حاشية ثانية بعد «هشام»',()=>doc.querySelectorAll('.fnr').length>=2,()=>firstP(),'ضع المؤشر بعد «هشام» ← إدراج حاشية سفلية','footnote')]},
 e12:{t:'نفّذ: تاريخ الرسالة',setup:{html:'<p>التاريخ: </p><p>حضرة مدير المدرسة المحترم،</p>',caret:'.pg-body p'},reqs:[R('أدرج التاريخ بالعربية',()=>logHas(/^date:ar/),()=>firstP(),'إدراج ← التاريخ والوقت ← اللغة: العربية','datetime'),R('بالشكل الكامل باسم اليوم',()=>logHas(/^date:ar:2/),()=>firstP(),'اختر الشكل الثالث (الأحد، 18 …)','datetime'),R('ثابت (بلا تحديث تلقائي)',()=>logHas(/^date:ar:\d+:fixed/),()=>firstP(),'ألغِ «تحديث تلقائي» قبل «موافق»','datetime')]},
 e13:{t:'نفّذ: رموز صحيحة',setup:{html:'<p>درجة الحرارة 30</p><p>12  4 = 3</p><p>مدرسة الأمل</p>'},reqs:[R('30° برمز الدرجة',()=>firstBody().textContent.includes('30°'),()=>firstP(),'إدراج ← رمز ← رموز إضافية ← °','symbol'),R('12 ÷ 4 = 3 بعلامة القسمة',()=>/12\s*÷\s*4/.test(firstBody().textContent),()=>firstBody().children[1],'ضع المؤشر بين 12 و 4 ← إدراج ← رمز ← ÷','symbol'),R('© قبل اسم المدرسة',()=>/©\s*مدرسة/.test(firstBody().textContent),()=>firstBody().children[2],'ضع المؤشر قبل «مدرسة» ← إدراج ← رمز ← ©','symbol')]},
 e14:{t:'نفّذ: معادلات الرياضيات',setup:{html:'<p>المعادلات:</p><p><br></p>',caret:'.pg-body p:last-child'},reqs:[R('أدرج معادلة',()=>!!doc.querySelector('.eq'),()=>firstBody().lastElementChild,'إدراج ← معادلة (Alt + =)','equation'),R('كسر مكدّس فيه ½',()=>[...doc.querySelectorAll('.eq .fr')].some(f=>{const s=f.querySelectorAll('.slot');return s[0]?.textContent.includes('1')&&s[1]?.textContent.includes('2')}),()=>doc.querySelector('.eq')||firstBody(),'معادلة ← بنيات ← كسر ← كسر مكدّس','eqFrac'),R('أُس: x²',()=>[...doc.querySelectorAll('.eq sup')].some(s=>s.textContent.includes('2')),()=>doc.querySelector('.eq')||firstBody(),'اكتب x ← معادلة ← نص مرتفع ← 2','eqScript')]},
};
/* extra «مشاكل الطلاب» tasks */
const PROBLEMS={
 e1:[
  {t:'مشكلة: كلمة إنجليزية قلبت الجملة',hint:'النقطة قفزت لأول السطر والكلمات مقلوبة؟ المشكلة في اتجاه الفقرة.',setup:{html:'<p dir="ltr" style="text-align:left">أحب برنامج Word كثيرًا.</p><p>'+P1+'</p>'},steps:[CARET('.pg-body p:first-child','انقر في السطر المقلوب'),B('home','rtl','انقر «اتجاه النص من اليمين لليسار»',()=>firstBody().firstElementChild.dir==='rtl'),B('home','alignR','انقر «محاذاة لليمين»')],check:()=>{const p=firstBody().firstElementChild;return p.dir==='rtl'&&/right|start/.test(getComputedStyle(p).textAlign)},after:'اتجاه الفقرة: Ctrl + Shift الأيمن للعربية.'},
  {t:'مشكلة: ظهر «=قشىي()» بدل النص',hint:'لوحة المفاتيح كانت بالعربية. بدّل إلى الإنجليزية بـ Alt + Shift ثم اكتب من جديد.',setup:{html:'<p>=قشىي(3،4)</p>'},steps:[E('.pg-body p','امسح السطر واكتب ‎=rand(3,4)‎ بالإنجليزية',()=>firstBody().textContent.trim()==='=rand(3,4)'||logHas('rand:'),()=>{const p=firstP();p.textContent='=rand(3,4)';placeCaretIn(p,false)}),E('.pg-body p','اضغط Enter',no,()=>{tryRand()})],check:()=>logHas('rand:3,4')},
  {t:'مشكلة: العنوان موسّط بالمسافات',hint:'المسافات الكثيرة تختلّ عند أي تعديل. استخدم زر التوسيط.',setup:{html:'<p>               رحلتي إلى أريحا</p><p>'+P1+'</p>'},steps:[E('.pg-body p','امسح المسافات قبل العنوان',()=>!/^\s{3,}/.test(firstP().textContent.replace(/ /g,' ')),()=>{const p=firstP();p.textContent=p.textContent.trim();placeCaretIn(p,false)}),B('home','alignC','انقر «توسيط»  (Ctrl + E)')],check:()=>{const p=firstP();return getComputedStyle(p).textAlign==='center'&&!/^\s{3,}/.test(p.textContent.replace(/ /g,' '))}},
  {t:'مشكلة: ضغطت التنسيق ولم يتغيّر شيء',hint:'لازم تحدّد النص أولًا، ثم تنسّق.',setup:{html:'<p>تذكير مهم: الامتحان يوم الأحد.</p>'},steps:[SELW('.pg-body p','مهم','حدِّد كلمة «مهم» أولًا (نقر مزدوج)'),B('home','bold','الآن انقر «B»')],check:()=>{const e=elText(firstBody(),'مهم');return !!e&&+getComputedStyle(e).fontWeight>=600}},
 ],
 e3:[{t:'مشكلة: الصورة لا تتحرّك',hint:'الصورة «مع النص» تتحرّك كحرف فقط. غيّر التفاف النص إلى «مربع».',setup:DOCX('<p><br></p><p>'+P1+' '+P2+'</p>',{after:()=>{placeCaretIn(firstBody().children[0]);insertPicture(SAMPLE_IMGS[1]);scaleObj(pics(),.6);clearObjSel();setTab('home')}}),steps:[PICK('.obj.pic'),TAB('pformat'),M('pformat','wrap','انقر «التفاف النص»'),I(PK('wrap','square'),'اختر «مربع»')],check:()=>pics()?.dataset.wrap==='square'}],
 e7:[{t:'مشكلة: Delete لم يحذف الجدول',hint:'Delete يمسح الكتابة فقط. الحذف من تبويب «تخطيط».',setup:DOCX('<table class="wt ts0"><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table><p>بعد الجدول</p>'),steps:[CELL(0,0),TAB('tlayout'),M('tlayout','tdelete','انقر «حذف»'),I(PK('tdel','table'),'اختر «حذف جدول»')],check:()=>!doc.querySelector('table.wt')}],
};
function buildLessons(u){
  if(u.lessons)return u.lessons;
  const cmds=(u.explore||[]).filter(c=>c.t).map(c=>{try{return cmdLesson(u,c)}catch(e){console.warn(u.id,c.t,e);return null}}).filter(Boolean);
  const seen=new Set();const uniq=cmds.filter(l=>{if(seen.has(l.key))return false;seen.add(l.key);return true});
  if(u.id==='e1')uniq.unshift({...u.practice[0],key:'c:rand',kind:'cmd',t:'نص تجريبي',d:'اكتب =rand(3,4) ثم Enter',ic:'fonts'});
  const tasks=(u.practice||[]).filter((p,i)=>!(u.id==='e1'&&i===0)).map((p,i)=>({...p,key:'t:'+i,kind:'task'}));
  const probs=(PROBLEMS[u.id]||[]).map((p,i)=>({...p,key:'p:'+i,kind:'task',problem:1}));
  const X=EXAMS[u.id];const ex=X?[{...X,key:'x',kind:'do',steps:[],check:()=>X.reqs.every(r=>{try{return !!r.check()}catch(e){return false}})}]:[];
  u.lessons=[...uniq,...tasks,...probs,...ex];return u.lessons;
}
