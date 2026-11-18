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
 reqs:[R('«رياضة» و«فن» متجاورتان',()=>hasRowSeq(['رياضة','فن'])||hasRowSeq(['فن','رياضة']),()=>findCell('رياضة')||PT_(),'انقر في «رياضة» ← تخطيط ← تقسيم الخلايا (عمودان)، أو ارسم خطًّا عموديًا بالقلم، ثم اكتب «فن»','splitCells')]});

/* ===== 8. الحجم ===== */
const TRIPROWS=(st={})=>[[{t:'برنامج رحلة أريحا',cs:4,st:st.title||''}],[{t:'الفترة',st:st.col||''},'الوقت','النشاط','المكان'],[{t:'صباحًا',rs:2,st:st.v||''},'8:00','التجمّع والانطلاق','ساحة المدرسة'],['9:30','زيارة قصر هشام','قصر هشام'],[{t:'ظهرًا',rs:2,st:st.v||''},'13:00','الغداء','استراحة الواحة'],['15:00','العودة','ساحة المدرسة']];
const PIC_SIZE=PIC({t:'حجم الصفوف والأعمدة',goalImg:'img/p8-size.png',skills:['ارتفاع الصف','عرض العمود','توزيع الصفوف والأعمدة'],
 intro:'اجعل صف العنوان أعلى (1.2 سم)، وعمود «الفترة» أضيق (1.5 سم).',
 setup:DOCT('رحلتنا المدرسية',mkT(TRIPROWS(),'ts0')),
 reqs:[R('صف العنوان أعلى (1.2 سم)',()=>parseFloat(PT_()?.rows[0]?.cells[0]?.style.height)>=1.1*CM,()=>PT_()?.rows[0],'انقر في صف العنوان ← تخطيط ← الارتفاع: 1.2 ثم Enter','rowH'),
  R('عمود «الفترة» ضيّق (1.5 سم)',()=>{const w=parseFloat(findCell('الفترة')?.style.width);return w>0&&w<=2*CM},()=>findCell('الفترة')||PT_(),'انقر في عمود «الفترة» ← تخطيط ← العرض: 1.5 ثم Enter','colW')]});

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

/* ===== 12. تقسيم الجدول وتحويله وحذفه ===== */
const ITEMS=[['الغرض','العدد'],['ماء','2'],['قبعة','1']];
const PIC_SPLITT=PIC({t:'تقسيم الجدول وتحويله وحذفه',goalImg:'img/p12-tables.png',skills:['تقسيم الجدول','تحويل إلى نص','حذف جدول'],
 intro:'قسّم البرنامج إلى جدولين (صباح وظهر)، وحوّل جدول «ما نحمله» إلى نص، واحذف الجدول القديم.',
 setup:DOCT('رحلتنا المدرسية',mkT(TRIPROWS(),'ts0')+'<p>ما نحمله:</p>'+mkT(ITEMS,'ts0')+'<p><br></p>'+mkT([['جدول قديم','لا نحتاجه'],['—','—']],'ts0')),
 reqs:[R('البرنامج في جدولين',()=>{const ts=[...doc.querySelectorAll('table.wt:not(.prev)')];const a=ts.find(t=>fuzzyHas(t.textContent,'8:00')),b=ts.find(t=>t.rows[0]&&fuzzyHas(rowT(t.rows[0]).join(' '),'13:00'));return !!a&&!!b&&a!==b},()=>pcells().find(td=>ctext(td)==='13:00')||PT_(),'انقر في صف «13:00» ← تخطيط ← تقسيم الجدول','splitTable'),
  R('«ما نحمله» صار نصًّا',()=>![...doc.querySelectorAll('table.wt:not(.prev) td')].some(td=>txtEq(ctext(td),'ماء'))&&[...firstBody().querySelectorAll(':scope > p')].some(p=>fuzzyHas(p.textContent,'ماء')),()=>[...doc.querySelectorAll('table.wt:not(.prev)')].find(t=>/ماء/.test(t.textContent))||PT_(),'انقر في جدول «ما نحمله» ← تخطيط ← تحويل إلى نص','convertText'),
  R('حُذف الجدول القديم',()=>![...doc.querySelectorAll('table.wt:not(.prev)')].some(t=>/قديم/.test(t.textContent)),()=>[...doc.querySelectorAll('table.wt:not(.prev)')].find(t=>/قديم/.test(t.textContent)),'انقر في الجدول القديم ← تخطيط ← حذف ← حذف جدول','tdelete')]});

const TABLE_PICS=[PIC_INS,PIC_TYPE,PIC_ADD,PIC_DEL,PIC_SORT,PIC_MERGE,PIC_SPLIT,PIC_SIZE,PIC_ALIGN,PIC_STYLE,PIC_BORDER,PIC_SPLITT];
TABLE_PICS.forEach((p,i)=>p.t=`${i+1}. ${p.t}`);
/* the hard one: every skill, as a challenge */
HOUSE_TASK.t='تحدٍّ: أعد رسم جدول المبنى';HOUSE_TASK.level='صعب';HOUSE_TASK.skills=['كل مهارات الجداول'];delete HOUSE_TASK.g;HOUSE_TASK.intro=HOUSE_TASK.intro.replace('ابدأ من الصفر: ','');
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
