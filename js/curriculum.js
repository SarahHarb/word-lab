/* ================= Curated course: 8 topics, short practical lessons ================= */
const UF={};UNITS.forEach(s=>(s.units||[s]).forEach(u=>UF[u.id]=u));
const TOPICS=[
 {id:'t1',num:'1',title:'ابدأ مع Word',sub:'افتح البرنامج، اكتب، واحفظ',icon:'blankdoc',
  learn:[['P','u1',0],['P','u1',1],['P','u1',3],['P','u2',0],['P','u3',1],['P','u3',2]],
  tasks:[['P','u2',3],['X','u1']]},
 {id:'t2',num:'2',title:'الكتابة والتنسيق',sub:'الخط، الألوان، المحاذاة، القوائم',icon:'fonts',
  learn:[['P','e1',0],['FONT'],['P','e1',5],['P','e1',3],['P','e1',6],['C','e1','alignC','وسّط العنوان'],['P','e1',7],['P','e1',2],['P','e1',4]],
  tasks:[['PR','e1',0],['PR','e1',1],['PR','e1',2],['X','e1']]},
 {id:'t3',num:'3',title:'تنسيق الصفحة',sub:'صفحة جديدة، الهوامش، الاتجاه، الخلفية',icon:'margins',
  learn:[['P','u4',0],['P','u4',1],['P','u4',2],['P','u4',3],['P','u4',4],['P','u4',5],['P','u4',6]],
  tasks:[['X','u4']]},
 {id:'t4',num:'4',title:'الصور والأشكال',sub:'صورة، شكل، مربع نص، WordArt',icon:'pictures',
  learn:[['P','e3',0],['P','e3',1],['P','e3',2],['P','e3',3],['P','e4',0],['P','e4',1],['P','e4',2],['P','e5',0],['P','e6',0]],
  tasks:[['PR','e3',0],['X','e3'],['X','e4']]},
 {id:'t5',num:'5',title:'الجداول',sub:'كل شيء عن الجدول: إدراج، تصميم، تخطيط',icon:'table',
  learn:()=>TABLE_PROJECT(),
  tasks:()=>[['PR','e7',0],['S',{t:'مشكلة: عنوان الجدول في الخلية الأولى فقط',problem:1,hint:'العنوان يجب أن يمتدّ فوق كل الأعمدة: ادمج خلايا الصف الأول.',setup:DOCX('<table class="wt ts1"><tbody><tr><td>برنامج الرحلة</td><td><br></td><td><br></td></tr><tr><td>الوقت</td><td>النشاط</td><td>المكان</td></tr><tr><td>8:00</td><td>التجمّع</td><td>المدرسة</td></tr></tbody></table><p><br></p>',{caret:'.pg-body p:last-child'}),steps:[ROWSEL(0),TAB('tlayout'),B('tlayout','merge','انقر «دمج الخلايا»')],check:()=>doc.querySelector('table.wt').rows[0].cells.length===1}],['S',{t:'مشكلة: Enter لم ينقلني للخلية التالية',problem:1,hint:'Enter يبدأ سطرًا جديدًا داخل الخلية نفسها. للانتقال إلى الخلية التالية استخدم Tab.',setup:DOCX('<table class="wt ts0"><tbody><tr><td>الوقت</td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p><br></p>'),steps:[{...CELL(0,0,'انقر في آخر خلية «الوقت»'),act:()=>{const c=doc.querySelector('table.wt').rows[0].cells[0];placeCaretIn(c,false);S.curCell=c;updateCtx()}},{el:()=>doc.querySelector('table.wt').rows[0].cells[1],say:'اضغط Tab واكتب «النشاط»',done:no,act:async()=>{const c=doc.querySelector('table.wt').rows[0].cells[1];placeCaretIn(c);logAct('tab');await typeInto(c,'النشاط')}}],check:()=>doc.querySelector('table.wt').rows[0].cells[1].textContent.trim().length>1}],['X','e7'],['S',TABLE_EXAM2]]},
 {id:'t6',num:'6',title:'الرأس والتذييل والترقيم',sub:'اسمك أعلى كل صفحة، وأرقام تلقائية',icon:'header',
  learn:[['P','e8',0],['P','e8',1],['P','e9',0],['P','e9',1],['P','e8',3]],
  tasks:[['P','e9',2],['X','e8']]},
 {id:'t7',num:'7',title:'المحتويات والحواشي والتعليقات',sub:'تقرير مرتّب ومراجَع',icon:'toc',
  learn:[['P','e2',0],['P','e2',1],['P','e2',2],['P','e11',0],['P','e10',0],['P','e10',1]],
  tasks:[['X','e2'],['X','e11']]},
 {id:'t8',num:'8',title:'الرموز والتاريخ والمعادلات',sub:'° ÷ © والتاريخ والكسور',icon:'equation',
  learn:[['P','e13',0],['P','e13',1],['P','e12',1],['P','e14',0],['P','e14',2]],
  tasks:[['X','e13'],['X','e14']]},
];
const FONT_LESSON=()=>({t:'كبّر العنوان وغيّر خطّه',hint:'حدِّد النص أولًا، ثم اختر من مجموعة «خط».',setup:{html:`<p style="font-family:Times New Roman">رحلتي إلى أريحا</p><p>${P1}</p>`},
  steps:[SELP('.pg-body p','حدِّد سطر العنوان (ثلاث نقرات)'),{el:rb('home','fontName'),say:'<span class="bt">نوع الخط</span>شكل الحروف — اختر Arial',done:()=>logHas('cmd:fontName:'),act:()=>{const s=$('#ribbon select[data-cmd="fontName"]');s.value='Arial';s.dispatchEvent(new Event('change',{bubbles:true}))}},{el:rb('home','fontSize'),say:'<span class="bt">حجم الخط</span>رقم أكبر = حروف أكبر — اختر 24',done:no,act:()=>{const s=$('#ribbon select[data-cmd="fontSize"]');s.value='24';s.dispatchEvent(new Event('change',{bubbles:true}))}}],
  check:()=>{const p=firstP();return [...p.querySelectorAll('span')].some(s=>parseFloat(s.style.fontSize)>=20)},after:'حجم الخط يغيّر الطباعة، أما التكبير من شريط الحالة فللشاشة فقط.'});
const TD='<table class="wt ts0"><tbody><tr><td>الاسم</td><td>المادة</td><td>العلامة</td></tr><tr><td>سارة</td><td>علوم</td><td>95</td></tr><tr><td>أحمد</td><td>رياضيات</td><td>90</td></tr><tr><td>ليان</td><td>عربي</td><td>97</td></tr></tbody></table><p><br></p>';
const TSET=()=>DOCX('<p class="wtitle">علامات الطلاب</p>'+TD);
const tc=(t,n,d,x={},ttl)=>{const r=['C','e7',{n,d,t,ctx:'table'},ttl||n,{...x}];return r};
const G=(g,r)=>{r.g=g;return r};
function TABLE_LEARN(){const A='الإدراج والكتابة',Bd='تصميم الجدول',C='صفوف وأعمدة',D='دمج وتقسيم وحجم',E2='المحاذاة والبيانات';
 const L=[
  G(A,['P','e7',0]),
  G(A,['S',{t:'أدرج جدولًا من نافذة «إدراج جدول»',hint:'مفيدة للجداول الكبيرة: نكتب عدد الأعمدة والصفوف بأنفسنا.',setup:DOCX('<p class="wtitle">جدول كبير</p><p><br></p>',{caret:'.pg-body p:last-child'}),steps:[TAB('insert'),M('insert','table','انقر «جدول»'),I(PK('tableDlg'),'اختر «إدراج جدول...»',()=>!!$('#tc')||!!doc.querySelector('table.wt')),DLG('#tc','اكتب عدد الأعمدة: 4',()=>$('#tc')?.value==='4'||!!doc.querySelector('table.wt'),()=>{$('#tc').value='4'}),DLG('#tr','اكتب عدد الصفوف: 6',()=>$('#tr')?.value==='6'||!!doc.querySelector('table.wt'),()=>{$('#tr').value='6'}),DLG('.df .pri','انقر «موافق»')],check:()=>!!doc.querySelector('table.wt')}]),
  G(A,['P','e7',1]),
  G(A,['S',{t:'أضف صفًّا بـ Tab من آخر خلية',hint:'Tab في آخر خلية يُضيف صفًّا جديدًا تلقائيًا.',setup:TSET(),steps:[{...CELL(3,2,'انقر في آخر خلية «97»'),act:()=>{const c=doc.querySelector('table.wt').rows[3].cells[2];placeCaretIn(c,false);S.curCell=c;updateCtx()}},{el:()=>doc.querySelector('table.wt').rows[3].cells[2],say:'اضغط Tab',done:no,act:()=>{tableTab({preventDefault(){},shiftKey:false})}}],check:()=>logHas('tabNewRow')}]),
  G(A,tc('tselect','تحديد','حدّد خلية أو صفًّا أو عمودًا أو الجدول كله',{pick:PK('tselect','col')},'حدّد عمودًا كاملًا')),
  G(Bd,['P','e7',2]),
  G(Bd,tc('optFirstCol','خيارات الأنماط','صف الرأس، العمود الأول، الصفوف ذات النطاقات',{},'ميّز العمود الأول')),
  G(Bd,tc('shading','تظليل','لون خلفية للخلايا المحدّدة',{row:0,pick:'.ddw.open .sw[data-arg="#ffff00"]'},'ظلّل صف العناوين')),
  G(Bd,tc('tborders','حدود','كل الحدود، خارجية، بلا حدود',{pick:PK('tborders','none')},'أزل حدود الجدول')),
  G(Bd,['S',{t:'ارسم حدودًا بلون أحمر',hint:'اختر «لون القلم» أولًا، ثم «حدود».',setup:TSET(),steps:[CELL(1,1),TAB('tdesign'),M('tdesign','penColor','انقر «لون القلم»'),{...I('.ddw.open .sw[data-arg="#ff0000"]','اختر الأحمر'),done:()=>S.pen?.c==='#ff0000'},M('tdesign','tborders','انقر «حدود»'),I(PK('tborders','all'),'اختر «كل الحدود»')],check:()=>[...doc.querySelectorAll('table.wt td')].some(td=>/255, 0, 0|#ff0000/.test(td.style.border))}]),
  G(C,['P','e7',3]),
  G(C,tc('insAbove','إدراج أعلى','صف جديد فوق الصف الحالي',{cell:[1,0]},'أضف صفًّا فوق')),
  G(C,tc('insLeft','إدراج إلى اليسار','عمود جديد بعد العمود الحالي',{cell:[0,2]},'أضف عمودًا على اليسار')),
  G(C,tc('insRight','إدراج إلى اليمين','عمود جديد قبل العمود الحالي',{cell:[0,0]},'أضف عمودًا على اليمين')),
  G(C,tc('tdelete','حذف','خلايا، أعمدة، صفوف، جدول',{pick:PK('tdel','row'),cell:[2,0]},'احذف صفًّا')),
  G(C,tc('tdelete','حذف','خلايا، أعمدة، صفوف، جدول',{pick:PK('tdel','col'),cell:[0,1]},'احذف عمودًا')),
  G(C,['P','e7',5]),
  G(D,['P','e7',4]),
  G(D,['S',{t:'قسّم خلية إلى خليتين',hint:'التقسيم عكس الدمج: خلية واحدة تصبح عدة خلايا.',setup:DOCX('<table class="wt ts1"><tbody><tr><td colspan="3">برنامج الرحلة</td></tr><tr><td>الوقت</td><td>النشاط</td><td>المكان</td></tr></tbody></table><p><br></p>',{caret:'.pg-body p:last-child'}),steps:[CELL(0,0,'انقر في خلية العنوان'),TAB('tlayout'),B('tlayout','splitCells','انقر «تقسيم الخلايا»',()=>!!$('#sc')||logHas('splitCells')),DLG('#sc','عدد الأعمدة: 2',()=>$('#sc')?.value==='2'||logHas('splitCells'),()=>{$('#sc').value='2'}),DLG('.df .pri','انقر «موافق»')],check:()=>logHas('splitCells')}]),
  G(D,['S',{t:'قسّم الجدول إلى جدولين',setup:TSET(),steps:[CELL(2,0,'انقر في الصف الذي يبدأ منه الجدول الثاني'),TAB('tlayout'),B('tlayout','splitTable','انقر «تقسيم الجدول»')],check:()=>doc.querySelectorAll('table.wt').length>=2}]),
  G(D,tc('rowH','الارتفاع','ارتفاع الصف بالسنتيمتر',{val:'1.5'},'غيّر ارتفاع الصف')),
  G(D,tc('colW','العرض','عرض العمود بالسنتيمتر',{val:'2'},'غيّر عرض العمود')),
  G(D,tc('distCols','توزيع الأعمدة','كل الأعمدة بعرض متساوٍ',{},'وزّع الأعمدة بالتساوي')),
  G(D,tc('autofit','احتواء تلقائي','حجم الجدول على قدر الكتابة',{pick:PK('autofit','content')},'اجعل الجدول على قدر الكتابة')),
  G(E2,['S',{t:'وسّط الكتابة داخل كل الخلايا',hint:'حدّد الجدول كله أولًا، ثم اختر المحاذاة.',setup:TSET(),steps:[CELL(1,1),TAB('tlayout'),M('tlayout','tselect','انقر «تحديد»'),{...I(PK('tselect','table'),'اختر «تحديد الجدول»'),done:()=>S.selCells.length>=12},B('tlayout','calign-middle-center','انقر «توسيط»')],check:()=>[...doc.querySelectorAll('table.wt td')].every(td=>td.style.textAlign==='center')}]),
  G(E2,tc('textDir','اتجاه النص','الكتابة عمودية داخل الخلية',{cell:[0,0]},'اجعل الكتابة عمودية')),
  G(E2,tc('tsort','فرز','ترتيب الصفوف أبجديًا أو رقميًا',{cell:[1,0]},'افرز الأسماء أبجديًا')),
  G(E2,tc('convertText','تحويل إلى نص','الجدول يصبح أسطرًا عادية',{cell:[1,0]},'حوّل الجدول إلى نص')),
 ];return L}
const TABLE_EXAM2={t:'نفّذ: جدول العلامات',setup:DOCX('<p class="wtitle">علامات الطلاب</p><p><br></p>',{caret:'.pg-body p:last-child'}),reqs:[
  R('جدول من 3 أعمدة',()=>{const t=doc.querySelector('table.wt');return !!t&&cols(t)>=3},()=>firstBody().lastElementChild,'إدراج ← جدول','table'),
  R('صف العناوين مظلّل',()=>{const r=doc.querySelector('table.wt')?.rows[0];return !!r&&[...r.cells].every(c=>c.style.backgroundColor)},()=>doc.querySelector('table.wt')?.rows[0],'حدّد الصف الأول ← تصميم الجدول ← تظليل','shading'),
  R('أضف عمودًا رابعًا',()=>{const t=doc.querySelector('table.wt');return !!t&&cols(t)>=4},()=>doc.querySelector('table.wt'),'تخطيط ← إدراج إلى اليسار','insLeft'),
  R('الكتابة في الوسط داخل الخلايا',()=>{const t=doc.querySelector('table.wt');return !!t&&[...t.querySelectorAll('td')].every(td=>td.style.textAlign==='center')},()=>doc.querySelector('table.wt'),'تحديد ← تحديد الجدول ← توسيط','calign-middle-center')],kind:'do'};
TABLE_EXAM2.check=()=>TABLE_EXAM2.reqs.every(q=>{try{return !!q.check()}catch(e){return false}});
function buildTopic(t){
  if(t.lessons)return t.lessons;if(typeof t.learn==='function')t.learn=t.learn();if(typeof t.tasks==='function')t.tasks=t.tasks();
  const mk=(r,kind)=>{const [k,a,b,c]=r;let l=null;
    if(k==='P')l={...UF[a].practice[b]};
    if(k==='PR')l={...PROBLEMS[a][b],problem:1};
    if(k==='X'){const X=EXAMS[a];l={...X,kind:'do',steps:[],check:()=>X.reqs.every(q=>{try{return !!q.check()}catch(e){return false}})}}
    if(k==='FONT')l=FONT_LESSON();
    if(k==='C'){const card=typeof b==='object'?b:UF[a].explore.find(x=>x.t===b);l=cmdLesson(UF[a],card,r[4]);if(c)l.t=c}
    if(k==='S'){l={...a}}
    if(k==='C'&&l&&r.g)l.g=r.g;
    if(!l)return null;if(!l.kind||l.kind==='cmd')l.kind=kind==='learn'?'learn':(l.kind||'task');if(l.kind!=='do')l.kind=kind==='learn'?'learn':'task';return l};
  t.lessons=[...t.learn.map((r,i)=>({...mk(r,'learn'),key:'l'+i,g:r.g})),...t.tasks.map((r,i)=>({...mk(r,'task'),key:'t'+i}))].filter(l=>l.t);
  return t.lessons;
}
