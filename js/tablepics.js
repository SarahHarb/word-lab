/* ================= Tables: learn by re-designing a picture =================
   The student sees a clear picture of a table and rebuilds it in Word.
   Hovering any ribbon command explains what it is for (TABLE_TIPS). */
const TABLE_TIPS={
 table:{n:'جدول',d:'يُدرج جدولًا جديدًا: مرّر الفأرة فوق المربعات لتختار عدد الأعمدة والصفوف، أو «إدراج جدول...» لتكتب العدد.',u:'عندما تريد ترتيب معلومات في صفوف وأعمدة.'},
 tselect:{n:'تحديد',d:'يحدّد الخلية أو الصف أو العمود أو الجدول كله.',u:'قبل تطبيق أمر على عدة خلايا. (وبالماوس أيضًا: اسحب فوق الخلايا، أو فوق العمود ⬇، أو يمين الصف ➜، أو المربع ⊞ للجدول كله)'},
 viewGrid:{n:'عرض خطوط الشبكة',d:'يُظهر خطوطًا منقّطة مكان الحدود المخفية — لا تُطبع.',u:'بعد إزالة الحدود لترى أين تبدأ الخلايا.'},
 tprops:{n:'خصائص الجدول',d:'نافذة فيها عرض الجدول ومحاذاته وإعدادات الصفوف والأعمدة.'},
 drawTable:{n:'رسم جدول',d:'ارسم خطوط الجدول بالقلم بنفسك.',u:'لجداول غير منتظمة.'},
 eraser:{n:'ممحاة',d:'امسح الخط بين خليتين فتصبحان خلية واحدة.'},
 tdelete:{n:'حذف',d:'يحذف الخلايا أو الصفوف أو الأعمدة أو الجدول كله.',u:'زر Delete يمسح الكتابة فقط — لحذف الصف أو العمود نفسه استخدم هذا الأمر.'},
 insAbove:{n:'إدراج أعلى',d:'يضيف صفًّا فوق الصف الذي فيه المؤشر.',u:'مثلًا لإضافة صف عنوان فوق الجدول.'},
 insBelow:{n:'إدراج أسفل',d:'يضيف صفًّا تحت الصف الحالي.',u:'لإضافة بيانات جديدة. (Tab في آخر خلية يضيف صفًّا أيضًا)'},
 insRight:{n:'إدراج إلى اليمين',d:'يضيف عمودًا على يمين العمود الحالي.'},
 insLeft:{n:'إدراج إلى اليسار',d:'يضيف عمودًا على يسار العمود الحالي.'},
 merge:{n:'دمج الخلايا',d:'يجعل الخلايا المحدّدة خلية واحدة.',u:'لعنوان يمتد فوق كل الأعمدة، أو خلية تغطي عدة صفوف. (حدّد الخلايا بسحب الماوس أولًا — أو استخدم الممحاة)'},
 splitCells:{n:'تقسيم الخلايا',d:'يقسم الخلية إلى عدد الأعمدة والصفوف الذي تكتبه.',u:'عكس الدمج.'},
 splitTable:{n:'تقسيم الجدول',d:'يقسم الجدول إلى جدولين بدءًا من الصف الحالي.'},
 autofit:{n:'احتواء تلقائي',d:'يضبط عرض الأعمدة على قدر الكتابة، أو على عرض الصفحة.',u:'حين يكون الجدول أعرض أو أضيق من اللازم.'},
 rowH:{n:'ارتفاع الصف',d:'اكتب ارتفاع الصف بالسنتيمتر ثم Enter.',u:'لصف عنوان أعلى من باقي الصفوف. (أو بالماوس: اسحب الخط تحت الصف)'},
 colW:{n:'عرض العمود',d:'اكتب عرض العمود بالسنتيمتر ثم Enter.',u:'لعمود ضيّق مثل الأرقام أو الأيام. (أو بالماوس: اسحب الخط بين العمودين)'},
 distRows:{n:'توزيع الصفوف',d:'يجعل ارتفاع الصفوف المحدّدة متساويًا.'},
 distCols:{n:'توزيع الأعمدة',d:'يجعل عرض الأعمدة المحدّدة متساويًا.'},
 textDir:{n:'اتجاه النص',d:'يدير الكتابة داخل الخلية فتصبح عمودية.',u:'للخلايا الطويلة الضيّقة (مثل «صباحًا» بجانب عدة صفوف).'},
 cellMargins:{n:'هوامش الخلايا',d:'المسافة بين الكتابة وحدود الخلية.'},
 tsort:{n:'فرز',d:'يرتّب الصفوف أبجديًا أو رقميًا حسب العمود الذي فيه المؤشر.',u:'لترتيب الأسماء أو الأوقات أو العلامات.'},
 repeatHeader:{n:'تكرار صفوف الرأس',d:'يكرّر صف العناوين أعلى كل صفحة إذا امتد الجدول.'},
 convertText:{n:'تحويل إلى نص',d:'يزيل الجدول ويُبقي الكتابة فقرات عادية.'},
 formula:{n:'صيغة',d:'يحسب داخل الخلية مجموعًا أو معدّلًا (مثل =SUM(ABOVE)).'},
 optHeader:{n:'صف الرأس',d:'يميّز الصف الأول بتنسيق خاص من النمط.'},
 optTotal:{n:'صف الإجمالي',d:'يميّز الصف الأخير (مثلًا للمجموع).'},
 optBanded:{n:'صفوف ذات نطاقات',d:'يلوّن صفًّا ويترك صفًّا لتسهل القراءة.',u:'أزل الإشارة إذا أردت خلفية موحّدة.'},
 optFirstCol:{n:'العمود الأول',d:'يميّز العمود الأول (غامق).'},
 optLastCol:{n:'العمود الأخير',d:'يميّز العمود الأخير.'},
 optBandCols:{n:'أعمدة ذات نطاقات',d:'يلوّن عمودًا ويترك عمودًا.'},
 tstyles:{n:'أنماط الجداول',d:'تصاميم جاهزة: ألوان وحدود بنقرة واحدة.'},
 shading:{n:'تظليل',d:'لون خلفية الخلايا المحدّدة. (النقوش مثل الخطوط المائلة: «حدود ← حدود وتظليل... ← التظليل»)',u:'لتمييز صف العناوين أو خلية مهمة.'},
 penStyle:{n:'نمط الخط',d:'شكل الحد: متصل، متقطع، مزدوج…',u:'اختره أولًا، ثم طبّقه من «حدود».'},
 penWeight:{n:'سُمك القلم',d:'سُمك الحد الذي ستطبّقه.'},
 penColor:{n:'لون القلم',d:'لون الحد الذي ستطبّقه.'},
 tborders:{n:'حدود',d:'يطبّق الحد (بالنمط والسُّمك واللون المختارة) على الخلايا المحدّدة: كل الحدود، خارجية، حد سفلي…'},
 borderPainter:{n:'نسخ تنسيق الحدود',d:'انقر على خطوط الجدول لترسم عليها الحد المختار.'},
};
function applyTableTips(){Object.assign(TIPS,TABLE_TIPS);
  $$('#ribbon [data-hid^="tstyle-"]').forEach(e=>{TIPS[e.dataset.hid]={n:e.dataset.tip||'نمط جدول',d:'نمط جاهز: ألوان وحدود بنقرة واحدة.'}});
  $$('#ribbon [data-hid^="calign-"]').forEach(e=>{TIPS[e.dataset.hid]={n:e.dataset.tip||'محاذاة',d:'مكان الكتابة داخل الخلية: أعلى/وسط/أسفل، ويمين/وسط/يسار.',u:'«توسيط» شائع في الجداول.'}})}

/* ---------- helpers for structure-independent checks ---------- */
const PT_=()=>doc.querySelector('table.wt:not(.prev)');
const pcells=()=>PT_()?[...PT_().querySelectorAll('td')]:[];
const ctext=td=>(td?.textContent||'').replace(/ /g,' ').trim();
const rowT=tr=>[...tr.cells].map(ctext);
const prows=()=>PT_()?[...PT_().rows]:[];
const hasRowSeq=seq=>prows().some(tr=>{const t=rowT(tr);for(let i=0;i+seq.length<=t.length;i++)if(seq.every((v,j)=>txtEq(t[i+j],v)))return true;return false});
const isBold=el=>{if(!el)return false;const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,any=false;while(n=w.nextNode()){if(!n.nodeValue.trim())continue;any=true;const f=getComputedStyle(n.parentElement).fontWeight;if(!(+f>=600||f==='bold'))return false}return any};
const findCell=txt=>pcells().find(td=>txtEq(ctext(td),txt));
const rowIs=(tr,arr)=>{const t=rowT(tr);return t.length===arr.length&&arr.every((v,j)=>txtEq(t[j],v))};

/* ---------- building blocks ---------- */
/* mkT(rows): each cell is 'text' or {t,rs,cs,st}; returns table HTML */
function mkT(rows,cls='ts0',tst=''){return `<table class="wt ${cls}"${tst?` style="${tst}"`:''}><tbody>`+rows.map(r=>'<tr>'+r.map(c=>{const o=typeof c==='object'?c:{t:c};return `<td${o.rs>1?` rowspan="${o.rs}"`:''}${o.cs>1?` colspan="${o.cs}"`:''}${o.st?` style="${o.st}"`:''}>${o.t||'<br>'}</td>`}).join('')+'</tr>').join('')+'</tbody></table>'}
const DOCT=(title,html)=>({html:`<p class="wtitle">${title}</p>${html||''}<p><br></p>`,caret:'.pg-body > p:last-child'});
const N=(r,...need)=>{r.need=need;return r};
const tblN=()=>doc.querySelectorAll('table.wt:not(.prev)').length;
const rowsOf=()=>prows().map(rowT);
const dataOrder=col=>prows().slice(1).map(tr=>ctext(tr.cells[col]));
const ordEq=(a,b)=>a.length===b.length&&a.every((x,i)=>txtEq(x,b[i]));
const hasRow=arr=>prows().some(tr=>rowIs(tr,arr));
const rowOf=txt=>prows().find(tr=>[...tr.cells].some(td=>txtEq(ctext(td),txt)))||null;
function PIC(o){o.kind='do';o.steps=[];o.check=()=>o.reqs.every(q=>{try{return !!q.check()}catch(e){return false}});return o}

/* ===== 1. إدراج جدول ===== */
const PIC_INS=PIC({t:'إدراج جدول',goalImg:'img/p1-insert.png',skills:['إدراج جدول من «إدراج ← جدول»'],
 intro:'المطلوب جدول فارغ فقط: 4 أعمدة و3 صفوف.',setup:DOCT('جدولي الأول'),
 reqs:[R('جدول من 4 أعمدة و3 صفوف',()=>!!PT_()&&cols(PT_())===4&&prows().length===3,()=>firstBody().lastElementChild,'إدراج ← جدول ← مرّر الفأرة حتى «جدول 4×3» ثم انقر','table')]});

/* ===== 2. الكتابة والتنقّل ===== */
const FR=[['الاسم','الصف','الهواية'],['ليلى','السابع','الرسم'],['أحمد','الثامن','كرة القدم'],['سارة','السابع','القراءة']];
const PIC_TYPE=PIC({t:'الكتابة في الجدول',goalImg:'img/p2-type.png',skills:['إدراج جدول','الكتابة في الخلايا','Tab للانتقال إلى الخلية التالية'],
 intro:'أدرج الجدول واكتب فيه. Tab ينقلك إلى الخلية التالية، وTab في آخر خلية يضيف صفًّا.',setup:DOCT('هوايات أصدقائي'),
 reqs:[R('جدول من 3 أعمدة و4 صفوف',()=>!!PT_()&&cols(PT_())===3&&prows().length===4,()=>firstBody().lastElementChild,'إدراج ← جدول ← 3×4','table'),
  N(R('صف العناوين',()=>hasRow(FR[0]),()=>PT_()?.rows[0],'انقر في الخلية الأولى، اكتب، ثم Tab'),0),
  N(R('صف «ليلى»',()=>hasRow(FR[1]),()=>PT_()?.rows[1],'اكتب في الصف الثاني، وTab بين الخلايا'),0),
  N(R('صف «أحمد»',()=>hasRow(FR[2]),()=>PT_()?.rows[2],'اكتب في الصف الثالث'),0),
  N(R('صف «سارة»',()=>hasRow(FR[3]),()=>PT_()?.rows[3],'اكتب في الصف الأخير'),0)]});


/* ===== التحديد: خلية، صف، عمود، جدول ===== */
const SELT=[['الاسم','العلامة','الملاحظة'],['ليلى','90','ممتاز'],['أحمد','85','جيد جدًا'],['سامي','70','جيد']];
const colCells=h=>{const t=PT_();if(!t)return [];const g=gridMap(t),hd=findCell(h);if(!hd)return [];const v=g.get(hd);const o=[];g.forEach((w,td)=>{if(w.c1===v.c1&&w.c2===v.c2&&td!==hd)o.push(td)});return o};
const PIC_SELECT=PIC({t:'التحديد: خلية، صف، عمود، جدول',goalImg:'img/p2b-select.png',skills:['تحديد خلية','تحديد صف','تحديد عمود','تحديد الجدول كله','التحديد بالماوس'],
 intro:'قبل أي تنسيق نحدّد. لوّن كما في الصورة: خلية واحدة، عمودًا، صفًّا، ثم وسّط الجدول كله. (التحديد بالأمر «تخطيط ← تحديد»، أو بالماوس كما في كل خطوة)',
 setup:DOCT('علامات الصف',mkT(SELT,'ts0')),
 reqs:[R('خلية «90» صفراء — وحدها',()=>{const c=findCell('90');return !!c&&inSet(c,C_YEL)&&pcells().filter(td=>inSet(td,C_YEL)).length===1},()=>findCell('90')||PT_(),'انقر في «90» ← تصميم الجدول ← تظليل ← أصفر. (بالماوس: ضع المؤشر داخل حافة الخلية اليمنى حتى يصير سهمًا مائلًا ↗ ثم انقر)','shading'),
  R('عمود «الملاحظة» أزرق فاتح',()=>{const cs=colCells('الملاحظة');return cs.length===3&&cs.every(td=>inSet(td,C_LIGHT)||inSet(td,C_BLUE))},()=>findCell('الملاحظة')||PT_(),'تخطيط ← تحديد ← تحديد عمود، ثم تظليل ← أزرق فاتح. (بالماوس: ضع المؤشر فوق العمود تمامًا حتى يصير سهمًا أسود ⬇ ثم انقر، أو اسحب فوق خلاياه)','tselect'),
  R('صف العناوين أخضر',()=>{const tr=PT_()?.rows[0];return !!tr&&[...tr.cells].every(td=>inSet(td,C_GRN))},()=>PT_()?.rows[0],'تخطيط ← تحديد ← تحديد صف، ثم تظليل ← أخضر. (بالماوس: ضع المؤشر يمين الصف خارج الجدول حتى يصير سهمًا ➜ ثم انقر، أو اسحب فوق خلاياه)','tselect'),
  R('كل الجدول في الوسط',()=>pcells().length>0&&pcells().every(td=>td.style.textAlign==='center'),()=>PT_(),'تخطيط ← تحديد ← تحديد الجدول، ثم «توسيط». (بالماوس: انقر المربع ⊞ عند زاوية الجدول العليا)','calign-middle-center')]});

/* ===== 3. إضافة صفوف وأعمدة ===== */
const PIC_ADD=PIC({t:'إضافة صفوف وأعمدة',goalImg:'img/p3-add.png',skills:['إدراج إلى اليمين / اليسار','إدراج أعلى / أسفل'],
 intro:'الجدول ناقص: أضف العمود والصفّين الناقصين ليصبح مثل الصورة.',
 setup:DOCT('هوايات أصدقائي',mkT([['الاسم','الهواية'],['ليلى','الرسم'],['أحمد','كرة القدم']])),
 reqs:[R('عمود «الصف» بين الاسم والهواية',()=>hasRowSeq(['الاسم','الصف','الهواية']),()=>PT_()?.rows[0]?.cells[0],'انقر في عمود «الاسم» ← تخطيط ← إدراج إلى اليسار، واكتب «الصف»','insLeft'),
  R('صف «رنا» فوق «ليلى»',()=>{const o=dataOrder(0);const i=o.findIndex(x=>txtEq(x,'رنا')),j=o.findIndex(x=>txtEq(x,'ليلى'));return i>=0&&j===i+1},()=>PT_()?.rows[1],'انقر في صف «ليلى» ← تخطيط ← إدراج أعلى، واكتب','insAbove'),
  R('صف «سارة» في الأسفل',()=>txtEq(dataOrder(0).at(-1)||'','سارة'),()=>PT_()?.rows[PT_().rows.length-1],'انقر في الصف الأخير ← إدراج أسفل (أو Tab في آخر خلية)','insBelow'),
  N(R('كل الصفوف مكتملة',()=>[['رنا','السادس','السباحة'],['ليلى','السابع','الرسم'],['أحمد','الثامن','كرة القدم'],['سارة','السابع','القراءة']].every(hasRow),()=>PT_(),'اكتب «الصف» لكل شخص كما في الصورة'),0,1,2)]});

/* ===== 4. حذف صفوف وأعمدة ===== */
const PIC_DEL=PIC({t:'حذف صفوف وأعمدة',goalImg:'img/p4-del.png',skills:['حذف عمود','حذف صف','الفرق بين Delete وأمر «حذف»'],
 intro:'في الجدول أشياء زائدة. احذفها ليصبح مثل الصورة. (زر Delete يمسح الكتابة فقط!)',
 setup:DOCT('علامات الاختبار',mkT([['الاسم','رقم الهاتف','العلامة'],['ليلى','0599123456','90'],['','',''],['أحمد','0598765432','85'],['سامي (انتقل)','0597654321','77']])),
 reqs:[R('حُذف عمود «رقم الهاتف»',()=>!!PT_()&&cols(PT_())===2&&!pcells().some(td=>/059/.test(td.textContent)),()=>PT_()?.rows[0]?.cells[1],'انقر في العمود ← تخطيط ← حذف ← حذف أعمدة','tdelete'),
  R('حُذف الصف الفارغ',()=>!!PT_()&&prows().every(tr=>rowT(tr).some(x=>x)),()=>PT_()?.rows[2],'انقر في الصف الفارغ ← حذف ← حذف صفوف','tdelete'),
  R('حُذف صف «سامي»',()=>!!PT_()&&!pcells().some(td=>/سامي/.test(td.textContent))&&prows().length<=4,()=>pcells().find(td=>/سامي/.test(td.textContent))||PT_(),'انقر في صف «سامي» ← حذف ← حذف صفوف','tdelete'),
  R('بقي «ليلى» و«أحمد»',()=>hasRowSeq(['ليلى'])&&hasRowSeq(['أحمد']),()=>PT_(),'لا تحذف صفوف ليلى وأحمد')]});

/* ===== 5. الفرز ===== */
const PIC_SORT=PIC({t:'فرز الجدول',goalImg:'img/p5-sort.png',skills:['فرز حسب عمود'],
 intro:'رتّب الأسماء أبجديًا بأمر «فرز» — لا تُعِد كتابتها.',
 setup:DOCT('علامات الاختبار',mkT([['الاسم','العلامة'],['سامي','77'],['ليلى','90'],['أحمد','85'],['هبة','95']])),
 reqs:[R('الأسماء مرتّبة أبجديًا',()=>ordEq(dataOrder(0),['أحمد','سامي','ليلى','هبة'])&&hasRow(['أحمد','85'])&&hasRow(['هبة','95']),()=>PT_()?.rows[1]?.cells[0],'انقر في عمود «الاسم» ← تخطيط ← فرز','tsort')]});

/* ===== 6. الدمج ===== */
const SCH0=[['جدول الحصص — الصف السابع','','',''],['اليوم','الحصة الأولى','الاستراحة','الحصة الثانية'],['الأحد','عربي','استراحة','رياضيات'],['الاثنين','علوم','','إنجليزي'],['الثلاثاء','رياضة','','تكنولوجيا']];
const PIC_MERGE=PIC({t:'دمج الخلايا',goalImg:'img/p6-merge.png',skills:['دمج أفقي','دمج عمودي','الممحاة (بديل الدمج)'],
 intro:'ادمج خلايا العنوان أفقيًا، وخلايا «استراحة» عموديًا. جرّب «دمج الخلايا» أو الممحاة.',
 setup:DOCT('جدول الحصص',mkT(SCH0,'ts0')),
 reqs:[R('العنوان في خلية واحدة',()=>{const tr=PT_()?.rows[0];return !!tr&&tr.cells.length===1&&fuzzyHas(ctext(tr.cells[0]),'جدول الحصص')},()=>PT_()?.rows[0],'حدّد خلايا الصف الأول بالسحب ← تخطيط ← دمج الخلايا','merge'),
  R('«استراحة» تمتد على 3 صفوف',()=>(findCell('استراحة')?.rowSpan||1)>=3,()=>findCell('استراحة')||PT_(),'حدّد «استراحة» والخليتين تحتها ← دمج الخلايا (أو امسح الخطوط بالممحاة)','merge')]});

/* ===== 7. التقسيم ===== */
const SCH1=[[{t:'جدول الحصص — الصف السابع',cs:4}],['اليوم','الحصة الأولى','الاستراحة','الحصة الثانية'],['الأحد','عربي',{t:'استراحة',rs:3},'رياضيات'],['الاثنين','علوم','إنجليزي'],['الثلاثاء','رياضة','تكنولوجيا']];
const PIC_SPLIT=PIC({t:'تقسيم الخلايا',goalImg:'img/p7-split.png',skills:['تقسيم الخلايا','القلم (رسم جدول)'],
 intro:'يوم الثلاثاء فيه حصتان في الوقت نفسه: قسّم خلية «رياضة» إلى خليتين واكتب «فن».',
 setup:DOCT('جدول الحصص',mkT(SCH1,'ts0')),
 reqs:[R('خلية «رياضة» مقسومة إلى خليتين',()=>{const tr=rowOf('رياضة')||rowOf('فن');return !!tr&&tr.cells.length===4},()=>findCell('رياضة')||PT_(),'انقر في «رياضة» ← تخطيط ← تقسيم الخلايا (عدد الأعمدة 2)، أو ارسم خطًّا عموديًا بالقلم داخلها','splitCells'),
  N(R('«فن» في الخلية الجديدة',()=>hasRowSeq(['رياضة','فن'])||hasRowSeq(['فن','رياضة']),()=>{const c=findCell('رياضة');return c&&(c.nextElementSibling||c.previousElementSibling)||PT_()},'انقر في الخلية الجديدة بجانب «رياضة» واكتب «فن»'),0)]});
PIC_SPLIT.reqs[0].fixFn=()=>{const tr=rowOf('رياضة')||rowOf('فن');if(!tr)return null;const n=tr.cells.length-3;if(n<=0)return null;if(n===1)return null;
  PIC_SPLIT.reqs[0].cmd='merge';return `قسمتَ «رياضة» إلى ${n+1} خلايا، والمطلوب خليتان فقط. تراجع (Ctrl+Z)، أو حدّد الخلايا الفارغة الزائدة مع جارتها ← «دمج الخلايا» (أو امسح الخط بينها بالممحاة).`};
PIC_SPLIT.reqs[1].fixFn=()=>{const c=findCell('رياضة');if(!c)return null;const nb=[c.nextElementSibling,c.previousElementSibling].filter(Boolean).find(x=>ctext(x)&&!txtEq(ctext(x),'تكنولوجيا')&&!txtEq(ctext(x),'الثلاثاء'));return nb?`اكتب «فن» بدل «${ctext(nb)}»`:null};

/* ===== 8. الحجم ===== */
const TRIPROWS=(st={})=>[[{t:'برنامج رحلة أريحا',cs:4,st:st.title||''}],[{t:'الفترة',st:st.col||''},'الوقت','النشاط','المكان'],[{t:'صباحًا',rs:2,st:st.v||''},'8:00','التجمّع والانطلاق','ساحة المدرسة'],['9:30','زيارة قصر هشام','قصر هشام'],[{t:'ظهرًا',rs:2,st:st.v||''},'13:00','الغداء','استراحة الواحة'],['15:00','العودة','ساحة المدرسة']];
const PIC_SIZE=PIC({t:'حجم الصفوف والأعمدة',goalImg:'img/p8-size.png',skills:['ارتفاع الصف','عرض العمود','توزيع الصفوف والأعمدة'],
 intro:'اجعل صف العنوان أعلى (حوالي 1.2 سم)، وعمود «الفترة» أضيق (حوالي 1.5 سم). بالأرقام من «تخطيط ← حجم الخلية»، أو بالماوس: اسحب الخطوط نفسها.',
 setup:DOCT('رحلتنا المدرسية',mkT(TRIPROWS(),'ts0')),
 reqs:[R('صف العنوان أعلى (1.2 سم)',()=>parseFloat(PT_()?.rows[0]?.cells[0]?.style.height)>=1.0*CM,()=>PT_()?.rows[0],'انقر في صف العنوان ← تخطيط ← الارتفاع: 1.2 ثم Enter. (أو بالماوس: اسحب الخط تحت صف العنوان إلى الأسفل)','rowH'),
  R('عمود «الفترة» ضيّق (1.5 سم)',()=>{const w=parseFloat(findCell('الفترة')?.style.width);return w>0&&w<=2.2*CM},()=>findCell('الفترة')||PT_(),'انقر في عمود «الفترة» ← تخطيط ← العرض: 1.5 ثم Enter. (أو بالماوس: اسحب الخط بين «الفترة» و«الوقت»)','colW')]});

/* ===== 9. المحاذاة واتجاه النص ===== */
const SIZED={title:`height:${Math.round(1.2*CM)}px`,col:`width:${Math.round(1.5*CM)}px`};
const PIC_ALIGN=PIC({t:'المحاذاة واتجاه النص',goalImg:'img/p9-align.png',skills:['محاذاة داخل الخلية','اتجاه النص'],
 intro:'وسّط الكتابة في كل الخلايا، واجعل «صباحًا» و«ظهرًا» عموديتين.',
 setup:DOCT('رحلتنا المدرسية',mkT(TRIPROWS(SIZED),'ts0')),
 reqs:[R('الكتابة في الوسط',()=>pcells().length>0&&pcells().every(td=>td.style.textAlign==='center'),()=>PT_(),'تخطيط ← تحديد ← تحديد الجدول ← «توسيط»','calign-middle-center'),
  R('«صباحًا» عمودية',()=>!!findCell('صباحًا')?.style.writingMode,()=>findCell('صباحًا')||PT_(),'انقر في «صباحًا» ← تخطيط ← اتجاه النص','textDir'),
  R('«ظهرًا» عمودية',()=>!!findCell('ظهرًا')?.style.writingMode,()=>findCell('ظهرًا')||PT_(),'انقر في «ظهرًا» ← تخطيط ← اتجاه النص','textDir')]});

/* ===== 10. أنماط الجداول ===== */
const CANT=[['الصنف','السعر (شيكل)'],['سندويش','5'],['عصير','3'],['كعك','2'],['المجموع','10']];
const PIC_STYLE=PIC({t:'أنماط الجداول',goalImg:'img/p10-style.png',skills:['نمط جاهز','خيارات الأنماط: صف الإجمالي، العمود الأول، النطاقات'],
 intro:'طبّق نمطًا جاهزًا، ثم فعّل «صف الإجمالي» و«العمود الأول».',
 setup:DOCT('مقصف المدرسة',mkT(CANT,'ts0')),
 reqs:[R('نمط جاهز',()=>/\bts[1-6]\b/.test(PT_()?.className||''),()=>PT_(),'تصميم الجدول ← أنماط الجداول ← اختر نمطًا (الأقرب: «جدول شبكة 4 - تمييز 1»)','tstyle-1'),
  N(R('صف الإجمالي مميّز',()=>!!PT_()?.classList.contains('tot'),()=>PT_(),'تصميم الجدول ← ✓ «صف الإجمالي»','optTotal'),0),
  N(R('العمود الأول مميّز',()=>!!PT_()?.classList.contains('fcol'),()=>PT_(),'تصميم الجدول ← ✓ «العمود الأول»','optFirstCol'),0)]});

/* ===== 11. التظليل والحدود ===== */
function outerOK(t,colTest,minW){if(!t)return false;const g=gridMap(t),nr=t.rows.length,nc=cols(t),rtl=isRTLt(t);let ok=true,n=0;
  g.forEach((v,td)=>{const S2=[];if(v.r1===0)S2.push('Top');if(v.r2===nr-1)S2.push('Bottom');if(v.c1===0)S2.push(rtl?'Right':'Left');if(v.c2===nc-1)S2.push(rtl?'Left':'Right');
    S2.forEach(s=>{n++;const w=parseFloat(td.style['border'+s+'Width']),st=td.style['border'+s+'Style'],c=td.style['border'+s+'Color'];if(!(w>=minW&&st&&st!=='none'&&colTest(c)))ok=false})});return ok&&n>0}
const PIC_BORDER=PIC({t:'التظليل والحدود',goalImg:'img/p11-border.png',skills:['تظليل','نمط الخط ولونه وسُمكه','حدود: مربع / مخصّص','الريشة (نسخ تنسيق الحدود)'],
 intro:'ظلّل صف العناوين بالأخضر وصف المجموع بالأصفر، واجعل إطار الجدول الخارجي أزرق سميكًا.',
 setup:DOCT('مقصف المدرسة',mkT(CANT,'ts0')),
 reqs:[R('صف العناوين أخضر',()=>{const tr=PT_()?.rows[0];return !!tr&&[...tr.cells].every(td=>inSet(td,C_GRN))},()=>PT_()?.rows[0],'حدّد الصف الأول ← تصميم الجدول ← تظليل ← أخضر','shading'),
  R('صف المجموع أصفر',()=>{const tr=prows().find(tr=>fuzzyHas(rowT(tr).join(' '),'المجموع'));return !!tr&&[...tr.cells].every(td=>inSet(td,C_GOLD))},()=>PT_()?.rows[PT_().rows.length-1],'حدّد الصف الأخير ← تظليل ← أصفر','shading'),
  R('إطار خارجي أزرق سميك',()=>outerOK(PT_(),C_BLUE,2),()=>PT_(),'لون القلم أزرق + سُمك 2¼، ثم حدود ← حدود خارجية (أو «حدود وتظليل...» ← مربع، أو الريشة على الخطوط الخارجية)','tborders')]});


/* ===== سلسلة الحدود والتظليل (من الأسهل للأصعب) ===== */
const bInfo=(td,S2)=>{const cs=getComputedStyle(td);return {s:cs['border'+S2+'Style'],w:parseFloat(cs['border'+S2+'Width'])||0,c:cs['border'+S2+'Color']}};
const bVis=i=>i.s!=='none'&&i.s!=='hidden'&&i.w>0&&!/rgba\(0, 0, 0, 0\)|transparent/.test(i.c);
function tEdges(t){if(!t)return [];const g=gridMap(t),nr=t.rows.length,nc=cols(t),rtl=isRTLt(t),out=[];
  g.forEach((v,td)=>{[['Top',v.r1===0,'h'],['Bottom',v.r2===nr-1,'h'],['Right',rtl?v.c1===0:v.c2===nc-1,'v'],['Left',rtl?v.c2===nc-1:v.c1===0,'v']].forEach(([S2,outer,k])=>out.push({td,S2,outer,k,r1:v.r1,r2:v.r2}))});return out}
const OPPC={Top:'Bottom',Bottom:'Top',Left:'Right',Right:'Left'};
function edgeOK(e,pred){if(pred(bInfo(e.td,e.S2)))return true;if(e.outer)return false;const n=neighbour(e.td,e.S2.toLowerCase());return !!n&&pred(bInfo(n,OPPC[e.S2]))}
const allEdges=(pred,f=()=>true)=>{const es=tEdges(PT_()).filter(f);return es.length>0&&es.every(e=>edgeOK(e,pred))};
const CANT_T=()=>DOCT('مقصف المدرسة',mkT(CANT,'ts0'));
const B_PEN='لون القلم وسُمك القلم ونمط الخط في «تصميم الجدول ← حدود» — اخترها أولًا، ثم طبّق من «حدود».';

const isDiag=td=>/repeating-linear-gradient\((45|135)deg/.test(td?.style.backgroundImage||'');
const hasPat=td=>!!(td?.style.backgroundImage);
const PAT_HOW='انقر في الخلية ← تصميم الجدول ← حدود ▾ ← «حدود وتظليل...» ← تبويب «التظليل» ← النقش، النمط: «قطري لأسفل داكن» ← تطبيق على: الخلية ← موافق';
const PIC_SHADE=PIC({t:'التظليل والنقش',goalImg:'img/b1-shade.png',skills:['تظليل خلية/صف','نافذة «حدود وتظليل» ← التظليل','النقش','تطبيق على: الخلية أو الجدول'],
 intro:'لوّن الخلفيات كما في الصورة. لون الخلفية من زر «تظليل»، أما النقش (الخطوط المائلة) فمن نافذة «حدود وتظليل» ← تبويب «التظليل». انتبه إلى «تطبيق على»: الخلية أم الجدول.',setup:CANT_T(),
 reqs:[R('صف العناوين أخضر',()=>{const tr=PT_()?.rows[0];return !!tr&&[...tr.cells].every(td=>inSet(td,C_GRN)&&!hasPat(td))},()=>PT_()?.rows[0],'حدّد الصف الأول (بالسحب أو السهم ➜ يمين الصف) ← تصميم الجدول ← تظليل ← أخضر','shading'),
  R('صف «المجموع» أصفر',()=>{const tr=rowOf('المجموع');return !!tr&&[...tr.cells].every(td=>(inSet(td,C_GOLD)||inSet(td,C_YEL))&&!hasPat(td))},()=>rowOf('المجموع')||PT_(),'حدّد صف المجموع ← تظليل ← أصفر','shading'),
  R('خلية «كعك» بنقش قطري',()=>isDiag(findCell('كعك')),()=>findCell('كعك')||PT_(),PAT_HOW,'tborders'),
  R('النقش في «كعك» فقط',()=>pcells().filter(hasPat).length===1&&isDiag(findCell('كعك')),()=>pcells().find(td=>hasPat(td)&&td!==findCell('كعك'))||PT_(),'النقش وصل لخلايا أخرى: Ctrl+Z، ثم في النافذة اختر «تطبيق على: الخلية» (وليس الجدول) — أو أزل النقش منها: النمط «واضح»','tborders'),
  R('باقي الخلايا بلا تظليل',()=>{const ex=new Set([...(PT_()?.rows[0]?.cells||[]),...(rowOf('المجموع')?.cells||[]),findCell('كعك')]);return pcells().filter(td=>!ex.has(td)).every(td=>!td.style.backgroundColor||td.style.backgroundColor==='transparent'||inSet(td,FAM(x=>x.l>.97)))},()=>PT_()?.rows[1],'إذا تلوّنت خلايا أخرى: حدّدها ← تظليل ← «بلا لون»','shading')]});

const PIC_NOB=PIC({t:'إزالة الحدود وخطوط الشبكة',goalImg:'img/b2-none.png',skills:['بلا حدود','خطوط الشبكة: تظهر ولا تُطبع','معاينة الطباعة'],
 intro:'أزل كل حدود الجدول. ستبقى خطوط زرقاء منقّطة: هذه «خطوط الشبكة» يُظهرها Word لتعرف أين الخلايا، ولا تُطبع. الصورة تُظهر الجدول كما سيُطبع.',setup:CANT_T(),
 reqs:[R('الجدول بلا حدود',()=>allEdges(i=>!bVis(i)),()=>PT_(),'انقر في الجدول ← تصميم الجدول ← حدود ← بلا حدود (بدون تحديد = الجدول كله)','tborders'),
  N(R('شاهد الشكل المطبوع',()=>!doc.classList.contains('vgrid')||!!window.__printSeen,()=>PT_(),'الخطوط المنقّطة لا تُطبع. لترى الشكل الحقيقي: تخطيط ← «عرض خطوط الشبكة» لإخفائها (وأعدها متى أردت)، أو ملف ← طباعة','viewGrid'),0)]});

const PIC_ALLB=PIC({t:'كل الحدود بلون وسُمك',goalImg:'img/b3-all.png',skills:['لون القلم','سُمك القلم','كل الحدود'],
 intro:'اجعل كل خطوط الجدول زرقاء وأسمك قليلًا. القاعدة: اختر شكل القلم أولًا، ثم طبّقه.',setup:CANT_T(),
 reqs:[R('كل الخطوط زرقاء',()=>allEdges(i=>bVis(i)&&C_BLUE(i.c)),()=>PT_(),'لون القلم ← أزرق، ثم حدود ← كل الحدود','penColor'),
  R('كل الخطوط بسُمك 1½ أو أكثر',()=>allEdges(i=>bVis(i)&&i.w>=2),()=>PT_(),'سُمك القلم ← 1½ نقطة، ثم حدود ← كل الحدود مرة أخرى','penWeight')]});

const PIC_OUTER=PIC({t:'الإطار الخارجي فقط',goalImg:'img/b4-outer.png',skills:['حدود خارجية','الفرق بين «مربع» و«حدود خارجية»'],
 intro:'غيّر الإطار الخارجي فقط إلى أحمر سميك، وأبقِ الخطوط الداخلية كما هي. انتبه: «مربع» في نافذة «حدود وتظليل» يزيل الخطوط الداخلية!',setup:CANT_T(),
 reqs:[R('الإطار الخارجي أحمر سميك',()=>allEdges(i=>bVis(i)&&C_RED(i.c)&&i.w>=3,e=>e.outer),()=>PT_(),'لون القلم ← أحمر، سُمك ← 2¼، ثم حدود ← حدود خارجية','tborders'),
  R('الخطوط الداخلية باقية (سوداء رفيعة)',()=>allEdges(i=>bVis(i)&&!C_RED(i.c)&&i.w<=1.5,e=>!e.outer),()=>PT_()?.rows[1],'إذا اختفت: Ctrl+Z، أو حدّد الجدول ← قلم أسود ½ ← حدود ← حدود داخلية. («مربع» يزيلها — استخدم «حدود خارجية» أو «مخصّص»)','tborders')]});

const PIC_DBL=PIC({t:'خط مزدوج تحت العناوين',goalImg:'img/b5-double.png',skills:['نمط الخط','حد سفلي لصف محدّد'],
 intro:'ضع خطًّا مزدوجًا أحمر تحت صف العناوين فقط.',setup:CANT_T(),
 reqs:[R('تحت العناوين خط مزدوج',()=>{const tr=PT_()?.rows[0];return !!tr&&[...tr.cells].every(td=>{const e={td,S2:'Bottom',outer:false};return edgeOK(e,i=>i.s==='double')})},()=>PT_()?.rows[0],'نمط الخط ← مزدوج، لون ← أحمر، ثم حدّد صف العناوين ← حدود ← حد سفلي','penStyle'),
  R('الخط المزدوج أحمر',()=>{const tr=PT_()?.rows[0];return !!tr&&[...tr.cells].every(td=>edgeOK({td,S2:'Bottom',outer:false},i=>i.s==='double'&&C_RED(i.c)))},()=>PT_()?.rows[0],'لون القلم ← أحمر، ثم طبّق الحد السفلي مرة أخرى','penColor'),
  R('باقي الخطوط عادية',()=>tEdges(PT_()).filter(e=>!(e.r2===0&&e.S2==='Bottom')&&!(e.r1===1&&e.S2==='Top')).every(e=>bInfo(e.td,e.S2).s!=='double'),()=>PT_(),'لا تحدّد الجدول كله — حدّد صف العناوين فقط. للتراجع: Ctrl+Z','tborders')]});

const PIC_DASH=PIC({t:'خطوط داخلية متقطعة',goalImg:'img/b6-dash.png',skills:['حدود داخلية','نمط الخط متقطع','حدود وتظليل ← مخصّص'],
 intro:'اجعل الخطوط الداخلية متقطعة، والإطار الخارجي متصلًا وسميكًا. جرّب «حدود وتظليل... ← مخصّص»: انقر في المعاينة على الخطوط التي تريد تغييرها فقط.',setup:CANT_T(),
 reqs:[R('الخطوط الداخلية متقطعة',()=>allEdges(i=>i.s==='dashed',e=>!e.outer),()=>PT_()?.rows[1],'نمط الخط ← متقطع، ثم حدود ← حدود داخلية (أو «حدود وتظليل» ← مخصّص ← انقر الخطين الداخليين)','tborders'),
  R('الإطار الخارجي متصل وسميك',()=>allEdges(i=>i.s==='solid'&&i.w>=3,e=>e.outer),()=>PT_(),'نمط الخط ← متصل، سُمك ← 2¼، ثم حدود ← حدود خارجية','tborders')]});

const PIC_PAINT=PIC({t:'الريشة: ارسم خطًّا بعينه',goalImg:'img/b7-painter.png',skills:['الريشة (نسخ تنسيق الحدود)','حد أيسر / أيمن'],
 intro:'لوّن الخط الفاصل بين العمودين فقط بالأخضر السميك. الطريقة السريعة: اختر القلم، شغّل «الريشة»، ثم انقر على الخط في كل صف.',setup:CANT_T(),
 reqs:[R('الخط بين العمودين أخضر سميك',()=>allEdges(i=>bVis(i)&&C_GRN(i.c)&&i.w>=3,e=>!e.outer&&e.k==='v'),()=>PT_()?.rows[1],'لون القلم ← أخضر، سُمك ← 2¼، ثم «نسخ تنسيق الحدود» (الريشة) وانقر على الخط في كل صف. (أو حدّد العمود الأول ← حدود ← حد أيسر)','borderPainter'),
  R('باقي الخطوط سوداء رفيعة',()=>allEdges(i=>bVis(i)&&!C_GRN(i.c)&&i.w<=1.5,e=>e.outer||e.k==='h'),()=>PT_(),'إذا تلوّن خط آخر: Ctrl+Z، أو أوقف الريشة (Esc) وانتبه أين تنقر','borderPainter')]});

/* ===== 12. تقسيم الجدول وتحويله وحذفه ===== */
const ITEMS=[['الغرض','العدد'],['ماء','2'],['قبعة','1']];
const PIC_SPLITT=PIC({t:'تقسيم الجدول وتحويله وحذفه',goalImg:'img/p12-tables.png',skills:['تقسيم الجدول','تحويل إلى نص','حذف جدول'],
 intro:'قسّم البرنامج إلى جدولين (صباح وظهر)، وحوّل جدول «ما نحمله» إلى نص، واحذف الجدول القديم.',
 setup:DOCT('رحلتنا المدرسية',mkT(TRIPROWS(),'ts0')+'<p>ما نحمله:</p>'+mkT(ITEMS,'ts0')+'<p><br></p>'+mkT([['جدول قديم','لا نحتاجه'],['—','—']],'ts0')),
 reqs:[R('البرنامج في جدولين',()=>{const ts=[...doc.querySelectorAll('table.wt:not(.prev)')];const a=ts.find(t=>fuzzyHas(t.textContent,'8:00')),b=ts.find(t=>t.rows[0]&&fuzzyHas(rowT(t.rows[0]).join(' '),'13:00'));return !!a&&!!b&&a!==b},()=>pcells().find(td=>ctext(td)==='13:00')||PT_(),'انقر في صف «13:00» ← تخطيط ← تقسيم الجدول','splitTable'),
  R('«ما نحمله» صار نصًّا',()=>![...doc.querySelectorAll('table.wt:not(.prev) td')].some(td=>txtEq(ctext(td),'ماء'))&&[...firstBody().querySelectorAll(':scope > p')].some(p=>fuzzyHas(p.textContent,'ماء')),()=>[...doc.querySelectorAll('table.wt:not(.prev)')].find(t=>/ماء/.test(t.textContent))||PT_(),'انقر في جدول «ما نحمله» ← تخطيط ← تحويل إلى نص','convertText'),
  R('حُذف الجدول القديم',()=>{const ts=[...doc.querySelectorAll('table.wt:not(.prev)')];return ts.length>0&&ts.every(t=>fuzzyHas(t.textContent,'8:00')||fuzzyHas(t.textContent,'13:00')||fuzzyHas(t.textContent,'ماء'))},()=>[...doc.querySelectorAll('table.wt:not(.prev)')].find(t=>!(fuzzyHas(t.textContent,'8:00')||fuzzyHas(t.textContent,'13:00')||fuzzyHas(t.textContent,'ماء'))),'انقر في الجدول القديم ← تخطيط ← حذف ← حذف جدول','tdelete')]});

const TABLE_PICS=[PIC_INS,PIC_TYPE,PIC_SELECT,PIC_ADD,PIC_DEL,PIC_SORT,PIC_MERGE,PIC_SPLIT,PIC_SIZE,PIC_ALIGN,PIC_STYLE,PIC_SHADE,PIC_NOB,PIC_ALLB,PIC_OUTER,PIC_DBL,PIC_DASH,PIC_PAINT,PIC_SPLITT];
TABLE_PICS.forEach((p,i)=>p.t=`${i+1}. ${p.t}`);
/* the hard one: every skill, as a challenge */
HOUSE_TASK.t='تحدٍّ: أعد رسم جدول المبنى';delete HOUSE_TASK.level;HOUSE_TASK.skills=['كل مهارات الجداول'];delete HOUSE_TASK.g;HOUSE_TASK.intro='أعد رسم جدول المبنى كما في الصورة. لك أن تختار الطريقة:<br>• <b>الدمج:</b> أدرج 6 أعمدة × 7 صفوف ثم ادمج.<br>• <b>الممحاة:</b> نفس الجدول، وامسح الخطوط بدل الدمج.<br>• <b>التقسيم والدمج معًا:</b> أدرج 4 أعمدة × 6 صفوف، ثم قسّم وادمج.<br><small>«▶ شاهد الحل» يعرض كل طريقة. وفي Word العربي يبدأ الجدول من اليمين، فقد يظهر معكوسًا عن الصورة — هذا طبيعي.</small>';
(()=>{const r=HOUSE_TASK.reqs;const set=(i,...n)=>{if(r[i])r[i].need=n};for(let i=1;i<r.length;i++)set(i,0);set(2,0,3,5);set(6,3);set(8,3,5);set(9,2);set(10,5);set(12,2);set(13,3);set(14,3);set(15,3)})();

/* text formatting on a cell selection (drag over cells, then Bold / colour …) — like Word */
(function(){const TOG={bold:'bold',italic:'italic',underline:'underline',strike:'strikeThrough'};
 ['bold','italic','underline','strike','fontcolor','highlight','fontName','fontSize','grow','shrink','clearfmt'].forEach(k=>{const orig=OPS[k];if(!orig)return;
  OPS[k]=function(...a){const cs=(S.selCells||[]).filter(c=>c.isConnected&&ctext(c));if(cs.length<2||(k==='underline'&&a[0]&&a[0]!=='single'&&false))return orig.apply(this,a);
   const keep=[...S.selCells],cur=S.curCell;const sel=getSelection();
   const pick=c=>{const r=document.createRange();r.selectNodeContents(c);sel.removeAllRanges();sel.addRange(r);S.range=r.cloneRange()};
   let allOn=false;if(TOG[k]){allOn=cs.every(c=>{pick(c);return document.queryCommandState(TOG[k])})}
   cs.forEach(c=>{pick(c);if(TOG[k]&&!allOn&&document.queryCommandState(TOG[k]))return;orig.apply(this,a)});
   setTimeout(()=>{S.curCell=cur;setCells(keep);updateCtx()},0)}})})();

/* ---------- smart hints: say exactly what is wrong and how to fix it ---------- */
const ar=(n,one,two,many)=>n===1?one:n===2?two:`${n} ${many}`;
function dimFix(r,C,R){const t=PT_();if(!t){r.cmd='table';return `لم تُدرج جدولًا بعد. إدراج ← جدول ← مرّر على المربعات حتى ${C}×${R} وانقر.`}
  const c=cols(t),n=t.rows.length,out=[];let cmd=null;
  if(n<R){out.push(`جدولك فيه ${n} صفوف والمطلوب ${R}: ينقصه ${ar(R-n,'صف واحد','صفّان','صفوف')}. لا داعي لإعادة الجدول — انقر في آخر خلية واضغط Tab، أو «تخطيط ← إدراج أسفل».`);cmd='insBelow'}
  if(n>R){out.push(`في جدولك ${ar(n-R,'صف زائد','صفّان زائدان','صفوف زائدة')}: انقر في الصف الزائد ← «تخطيط ← حذف ← حذف صفوف».`);cmd='tdelete'}
  if(c<C){out.push(`جدولك فيه ${c} أعمدة والمطلوب ${C}: ينقصه ${ar(C-c,'عمود واحد','عمودان','أعمدة')} — «تخطيط ← إدراج إلى اليسار».`);cmd=cmd||'insLeft'}
  if(c>C){out.push(`في جدولك ${ar(c-C,'عمود زائد','عمودان زائدان','أعمدة زائدة')}: انقر فيه ← «تخطيط ← حذف ← حذف أعمدة».`);cmd=cmd||'tdelete'}
  if(cmd)r.cmd=cmd;return out.join('<br>')||null}
function rowHint(arr){const t=PT_();if(!t)return null;let best=null,bs=-1;prows().forEach(tr=>{const x=rowT(tr);const sc=arr.filter((v,j)=>txtEq(x[j]||'',v)).length;if(sc>bs){bs=sc;best=x}});
  if(!best)return null;const msgs=[];arr.forEach((v,j)=>{const got=best[j]||'';if(txtEq(got,v))return;msgs.push(got?`اكتب «${v}» بدل «${got}»`:`الخلية ${j+1} فارغة: اكتب «${v}»`)});
  return msgs.length?msgs.slice(0,2).join('، ')+(msgs.length>2?'…':''):null}
(()=>{const dimReq=(task,i,C,R)=>{const r=task.reqs[i];if(!r)return;r.fixFn=()=>dimFix(r,C,R);const w0=r.where;r.where=()=>{const t=PT_();if(!t)return w0();const lr=t.rows[t.rows.length-1];return lr.cells[lr.cells.length-1]}};
 dimReq(PIC_INS,0,4,3);dimReq(PIC_TYPE,0,3,4);
 FR.forEach((row,k)=>{const r=PIC_TYPE.reqs[k+1];if(r)r.fixFn=()=>rowHint(row)});
 if(HOUSE_TASK.reqs[0])HOUSE_TASK.reqs[0].fixFn=()=>PT_()?null:'إدراج ← جدول ← 6 أعمدة × 7 صفوف (للدمج)، أو 4 × 6 (للتقسيم والدمج معًا).'})();

PIC_SPLITT.reqs[2].fixFn=()=>{const t=[...doc.querySelectorAll('table.wt:not(.prev)')].find(t=>!(fuzzyHas(t.textContent,'8:00')||fuzzyHas(t.textContent,'13:00')||fuzzyHas(t.textContent,'ماء')));if(!t)return null;
  if(!t.textContent.trim())return 'بقي جدول فارغ: «حذف خلايا» أو Delete يمسح المحتوى فقط والجدول باقٍ. انقر فيه ← تخطيط ← حذف ← «حذف جدول».';return null};
