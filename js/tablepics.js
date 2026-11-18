/* ================= Tables: learn by re-designing a picture =================
   The student sees a clear picture of a table and rebuilds it in Word.
   Hovering any ribbon command explains what it is for (TABLE_TIPS). */
const TABLE_TIPS={
 table:{n:'جدول',d:'يُدرج جدولًا جديدًا: مرّر الفأرة فوق المربعات لتختار عدد الأعمدة والصفوف، أو «إدراج جدول...» لتكتب العدد.',u:'عندما تريد ترتيب معلومات في صفوف وأعمدة.'},
 tselect:{n:'تحديد',d:'يحدّد الخلية أو الصف أو العمود أو الجدول كله.',u:'قبل تطبيق أمر على عدة خلايا: تظليل، محاذاة، دمج… (أو اسحب الفأرة فوق الخلايا).'},
 viewGrid:{n:'عرض خطوط الشبكة',d:'يُظهر خطوطًا منقّطة مكان الحدود المخفية — لا تُطبع.',u:'بعد إزالة الحدود لترى أين تبدأ الخلايا.'},
 tprops:{n:'خصائص الجدول',d:'نافذة فيها عرض الجدول ومحاذاته وإعدادات الصفوف والأعمدة.'},
 drawTable:{n:'رسم جدول',d:'ارسم خطوط الجدول بالقلم بنفسك.',u:'لجداول غير منتظمة.'},
 eraser:{n:'ممحاة',d:'امسح الخط بين خليتين فتصبحان خلية واحدة.'},
 tdelete:{n:'حذف',d:'يحذف الخلايا أو الصفوف أو الأعمدة أو الجدول كله.',u:'زر Delete يمسح الكتابة فقط — لحذف الصف أو العمود نفسه استخدم هذا الأمر.'},
 insAbove:{n:'إدراج أعلى',d:'يضيف صفًّا فوق الصف الذي فيه المؤشر.',u:'مثلًا لإضافة صف عنوان فوق الجدول.'},
 insBelow:{n:'إدراج أسفل',d:'يضيف صفًّا تحت الصف الحالي.',u:'لإضافة بيانات جديدة. (Tab في آخر خلية يضيف صفًّا أيضًا)'},
 insRight:{n:'إدراج إلى اليمين',d:'يضيف عمودًا على يمين العمود الحالي.'},
 insLeft:{n:'إدراج إلى اليسار',d:'يضيف عمودًا على يسار العمود الحالي.'},
 merge:{n:'دمج الخلايا',d:'يجعل الخلايا المحدّدة خلية واحدة.',u:'لعنوان يمتد فوق كل الأعمدة، أو خلية تغطي عدة صفوف.'},
 splitCells:{n:'تقسيم الخلايا',d:'يقسم الخلية إلى عدد الأعمدة والصفوف الذي تكتبه.',u:'عكس الدمج.'},
 splitTable:{n:'تقسيم الجدول',d:'يقسم الجدول إلى جدولين بدءًا من الصف الحالي.'},
 autofit:{n:'احتواء تلقائي',d:'يضبط عرض الأعمدة على قدر الكتابة، أو على عرض الصفحة.',u:'حين يكون الجدول أعرض أو أضيق من اللازم.'},
 rowH:{n:'ارتفاع الصف',d:'اكتب ارتفاع الصف بالسنتيمتر ثم Enter.',u:'لصف عنوان أعلى من باقي الصفوف.'},
 colW:{n:'عرض العمود',d:'اكتب عرض العمود بالسنتيمتر ثم Enter.',u:'لعمود ضيّق مثل الأرقام أو الأيام.'},
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
 shading:{n:'تظليل',d:'لون خلفية الخلايا المحدّدة — وفيه «نقش مائل».',u:'لتمييز صف العناوين أو خلية مهمة.'},
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
const hasRowSeq=seq=>prows().some(tr=>{const t=rowT(tr);for(let i=0;i+seq.length<=t.length;i++)if(seq.every((v,j)=>t[i+j]===v))return true;return false});
const isBold=el=>{if(!el)return false;const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,any=false;while(n=w.nextNode()){if(!n.nodeValue.trim())continue;any=true;const f=getComputedStyle(n.parentElement).fontWeight;if(!(+f>=600||f==='bold'))return false}return any};
const findCell=txt=>pcells().find(td=>ctext(td)===txt);

/* ---------- 1) easy: packing list ---------- */
const PACK=[['الرقم','الغرض','العدد'],['1','ماء','2'],['2','قبعة','1'],['3','وجبة خفيفة','3'],['4','واقي شمس','1']];
const PIC_PACK={t:'صمّم: قائمة ما نحمله',kind:'do',level:'سهل',goalImg:'img/pic-pack.png',
 intro:'أعد رسم هذا الجدول في Word. مرّر الفأرة فوق أي أمر لتعرف لماذا يُستخدم.',
 setup:{html:'<p class="wtitle">قائمة ما نحمله</p><p><br></p>',caret:'.pg-body > p:last-child'},steps:[],
 reqs:[
  R('أدرج جدولًا: 3 أعمدة × 5 صفوف',()=>!!PT_()&&cols(PT_())===3&&prows().length===5,()=>firstBody().lastElementChild,'إدراج ← جدول ← مرّر حتى 3×5 وانقر','table'),
  R('اكتب صف العناوين',()=>hasRowSeq(PACK[0]),()=>PT_()?.rows[0],'انقر في الخلية الأولى واكتب، وانتقل بـ Tab'),
  R('اكتب البيانات',()=>PACK.slice(1).every(r=>hasRowSeq(r)),()=>PT_()?.rows[1],'اكتب كل صف كما في الصورة، وTab للانتقال'),
  R('ظلّل صف العناوين بالأزرق الفاتح',()=>{const tr=prows().find(tr=>rowT(tr).join()===PACK[0].join());return !!tr&&[...tr.cells].every(td=>inSet(td,C_LIGHT))},()=>PT_()?.rows[0],'حدّد صف العناوين ← تصميم الجدول ← تظليل ← أزرق فاتح','shading'),
  R('وسّط الكتابة في كل الخلايا',()=>pcells().length>0&&pcells().every(td=>td.style.textAlign==='center'),()=>PT_(),'تخطيط ← تحديد ← تحديد الجدول ← «توسيط»','calign-middle-center'),
  R('الجدول على قدر كتابته',()=>PT_()?.style.width==='auto',()=>PT_(),'تخطيط ← احتواء تلقائي ← احتواء تلقائي للمحتويات','autofit'),
 ]};

/* ---------- 2) medium: trip programme ---------- */
const TRIP_H=['الفترة','الوقت','النشاط','المكان'],TRIP_T='برنامج رحلة أريحا';
const TRIP_D=[['8:00','التجمّع والانطلاق','ساحة المدرسة'],['9:30','زيارة قصر هشام','قصر هشام'],['13:00','الغداء','استراحة الواحة'],['15:00','العودة','ساحة المدرسة']];
const PIC_TRIP={t:'صمّم: برنامج رحلة أريحا',kind:'do',level:'متوسط',goalImg:'img/pic-trip.png',
 intro:'أعد رسم هذا الجدول في Word: دمج، نمط جاهز، تظليل، حدود، محاذاة واتجاه نص. مرّر الفأرة فوق أي أمر لتعرف استخدامه.',
 setup:{html:'<p class="wtitle">رحلتنا المدرسية</p><p><br></p>',caret:'.pg-body > p:last-child'},steps:[],
 reqs:[
  R('أدرج جدولًا: 4 أعمدة × 6 صفوف',()=>!!PT_()&&cols(PT_())===4&&prows().length===6,()=>firstBody().lastElementChild,'إدراج ← جدول ← 4×6','table'),
  R('اكتب صف العناوين',()=>hasRowSeq(TRIP_H),()=>PT_()?.rows[1],'اكتب «الفترة، الوقت، النشاط، المكان» في الصف الثاني'),
  R('اكتب الأنشطة',()=>TRIP_D.every(r=>hasRowSeq(r)),()=>PT_()?.rows[2],'اكتب الوقت والنشاط والمكان لكل صف'),
  R('صف العنوان خلية واحدة',()=>{const tr=PT_()?.rows[0];return !!tr&&tr.cells.length===1&&ctext(tr.cells[0])===TRIP_T},()=>PT_()?.rows[0],'حدّد الصف الأول ← تخطيط ← دمج الخلايا، ثم اكتب العنوان','merge'),
  R('«صباحًا» و«ظهرًا» مدموجتان',()=>findCell('صباحًا')?.rowSpan===2&&findCell('ظهرًا')?.rowSpan===2,()=>PT_()?.rows[2]?.cells[0],'حدّد خليتين فوق بعض في عمود الفترة ← دمج الخلايا، واكتب','merge'),
  R('«صباحًا» و«ظهرًا» عموديتان',()=>!!findCell('صباحًا')?.style.writingMode&&!!findCell('ظهرًا')?.style.writingMode,()=>findCell('صباحًا')||PT_(),'انقر في الخلية ← تخطيط ← اتجاه النص','textDir'),
  R('النمط الأزرق',()=>/\bts1\b/.test(PT_()?.className||''),()=>PT_(),'تصميم الجدول ← أنماط الجداول ← «جدول شبكة 4 - تمييز 1»','tstyle-1'),
  R('بلا صفوف ذات نطاقات',()=>!!PT_()?.classList.contains('noband'),()=>PT_(),'تصميم الجدول ← أزل ✓ عن «صفوف ذات نطاقات»','optBanded'),
  R('صف العناوين ذهبي',()=>{const tr=prows().find(tr=>rowT(tr).join()===TRIP_H.join());return !!tr&&[...tr.cells].every(td=>td.style.backgroundColor===rgb('#ffc000'))},()=>PT_()?.rows[1],'حدّد صف العناوين ← تظليل ← الذهبي','shading'),
  R('الحدود زرقاء',()=>pcells().length>0&&pcells().every(td=>td.style.border.includes(rgb('#0070c0'))),()=>PT_(),'لون القلم ← أزرق، ثم حدود ← كل الحدود','tborders'),
  R('الكتابة في الوسط',()=>pcells().length>0&&pcells().every(td=>td.style.textAlign==='center'),()=>PT_(),'تحديد ← تحديد الجدول ← توسيط','calign-middle-center'),
  R('صف العنوان أعلى (1.2 سم)',()=>parseFloat(PT_()?.rows[0]?.cells[0]?.style.height)>=1.1*CM,()=>PT_()?.rows[0],'انقر في صف العنوان ← تخطيط ← الارتفاع: 1.2','rowH'),
  R('عمود الفترة ضيّق (1.5 سم)',()=>{const w=parseFloat(findCell('الفترة')?.style.width);return w>0&&w<=2*CM},()=>findCell('الفترة')||PT_(),'انقر في عمود الفترة ← تخطيط ← العرض: 1.5','colW'),
 ]};
[PIC_PACK,PIC_TRIP].forEach(T=>T.check=()=>T.reqs.every(q=>{try{return !!q.check()}catch(e){return false}}));
HOUSE_TASK.t='صمّم: جدول المبنى';HOUSE_TASK.level='متقدّم';HOUSE_TASK.intro=HOUSE_TASK.intro.replace('ابدأ من الصفر: ','');

/* text formatting on a cell selection (drag over cells, then Bold / colour …) — like Word */
(function(){const TOG={bold:'bold',italic:'italic',underline:'underline',strike:'strikeThrough'};
 ['bold','italic','underline','strike','fontcolor','highlight','fontName','fontSize','grow','shrink','clearfmt'].forEach(k=>{const orig=OPS[k];if(!orig)return;
  OPS[k]=function(...a){const cs=(S.selCells||[]).filter(c=>c.isConnected&&ctext(c));if(cs.length<2||(k==='underline'&&a[0]&&a[0]!=='single'&&false))return orig.apply(this,a);
   const keep=[...S.selCells],cur=S.curCell;const sel=getSelection();
   const pick=c=>{const r=document.createRange();r.selectNodeContents(c);sel.removeAllRanges();sel.addRange(r);S.range=r.cloneRange()};
   let allOn=false;if(TOG[k]){allOn=cs.every(c=>{pick(c);return document.queryCommandState(TOG[k])})}
   cs.forEach(c=>{pick(c);if(TOG[k]&&!allOn&&document.queryCommandState(TOG[k]))return;orig.apply(this,a)});
   setTimeout(()=>{S.curCell=cur;setCells(keep);updateCtx()},0)}})})();
