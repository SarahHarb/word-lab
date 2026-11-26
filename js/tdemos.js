/* «▶ شاهد الحل» لتمارين الجداول */
/* تمرين له أكثر من طريقة حل: اختيار الطريقة بتبويبات قبل التشغيل */
(function(){const prev=window.playSolution;if(!prev)return;
 window.playSolution=function(i){const it=(typeof CO!=="undefined")&&CO.item;if(i!=null||!it||!it.demoMethods)return prev.apply(this,arguments);
  let k=0;const tabs=()=>`<div class="mtabs">${it.demoMethods.map((m,j)=>`<button type="button" class="mtab ${j===k?'on':''}" data-m="${j}">${m.name}</button>`).join('')}</div><p class="mdesc">${it.demoMethods[k].d}</p>`;
  dialog({title:'▶ شاهد الحل — اختيار الطريقة',w:520,body:`<div id="mbox">${tabs()}</div><p class="muted" style="font-size:12.5px;margin:6px 0 0">كل الطرق توصلك لنفس الجدول. تجربة الطريقة التي تناسبك.</p>`,
   buttons:[{label:'▶ تشغيل هذه الطريقة',pri:1,act:()=>{it.demoAll=it.demoMethods[k].list;setTimeout(()=>prev(),60)}},{label:'إلغاء'}]});
  const bind=()=>document.querySelectorAll('#mbox .mtab').forEach(b=>b.onclick=()=>{k=+b.dataset.m;document.getElementById('mbox').innerHTML=tabs();bind()});setTimeout(bind,0)}})();
(function(){
const T=()=>PT_(),c=(r,i)=>T()&&T().rows[r]&&T().rows[r].cells[i];
const A=()=>window.APL;
const cell=(f,say)=>({say,js:async()=>{const a=f();if(!a)return;await A().showAt(a);clearCells();S.curCell=a;setCur(a)}});
const cells=(fa,fb,say)=>({say,js:async()=>{const a=fa(),b=fb();if(!a||!b)return;await A().showAt(a);S.curCell=a;setCells(rectCells(a,b));await A().showAt(b)}});
const typeIn=(f,text)=>({js:async()=>{const a=f();if(!a)return;await A().showAt(a);clearCells();S.curCell=a;setCur(a);placeCaretIn(a,false);S.range=curRange();await A().typeText(text)}});
const js=(say,fn)=>({say,js:fn});
const endP=()=>({js:()=>{placeCaretIn(document.querySelector('#doc .pg-body > p:last-child'));S.range=curRange()}});
const ins=(r,c2)=>[endP(),{show:'table',say:`إدراج ← جدول ← سحب على ${c2}×${r}`},js('',()=>insertTable(r,c2))];
const g=n=>{try{return eval(n)}catch(e){return null}};
const DA=(n,list)=>{const it=g(n);if(it)it.demoAll=list};
DA('PIC_INS',()=>ins(3,4));
DA('PIC_TYPE',()=>[...ins(4,3),...FR.flatMap((r,i)=>r.map((v,j)=>typeIn(()=>c(i,j),v)))]);
DA('PIC_SELECT',()=>[cell(()=>findCell('90'),'النقر في الخلية'),{cmd:'shading',arg:'#ffff00',say:'تظليل أصفر'},cell(()=>findCell('الملاحظة')),{cmd:'tselect',arg:'col',say:'تحديد ← العمود'},{cmd:'shading',arg:'#deebf6',say:'تظليل أزرق فاتح'},cell(()=>c(0,0)),{cmd:'tselect',arg:'row',say:'تحديد ← الصف'},{cmd:'shading',arg:'#92d050',say:'تظليل أخضر'},cell(()=>c(1,1)),{cmd:'tselect',arg:'table',say:'تحديد ← الجدول'},{cmd:'calign',arg:'middle-center',say:'محاذاة للوسط'}]);
DA('PIC_ADD',()=>[cell(()=>c(0,0)),{cmd:'insLeft',say:'إدراج عمود لليسار'},typeIn(()=>c(0,1),'الصف'),typeIn(()=>c(1,1),'السابع'),typeIn(()=>c(2,1),'الثامن'),cell(()=>c(1,0)),{cmd:'insAbove',say:'إدراج صف لأعلى'},...['رنا','السادس','السباحة'].map((v,j)=>typeIn(()=>c(1,j),v)),cell(()=>c(3,0)),{cmd:'insBelow',say:'إدراج صف لأسفل'},...['سارة','السابع','القراءة'].map((v,j)=>typeIn(()=>c(4,j),v))]);
DA('PIC_DEL',()=>[cell(()=>c(0,1)),{cmd:'tdel',arg:'col',say:'حذف ← حذف الأعمدة'},cell(()=>c(2,0)),{cmd:'tdel',arg:'row',say:'حذف ← حذف الصفوف'},cell(()=>c(3,0)),{cmd:'tdel',arg:'row',say:'حذف ← حذف الصفوف'}]);
DA('PIC_SORT',()=>[cell(()=>c(1,0)),{cmd:'tsort',say:'فرز'}]);
DA('PIC_MERGE',()=>[cells(()=>c(0,0),()=>c(0,3),'تحديد خلايا الصف الأول'),{cmd:'merge',say:'دمج الخلايا'},cell(()=>c(2,2)),js('الممحاة: مسح الخط بين الخليتين',async()=>{setTool('eraser');await A().W(500);eraseEdge(c(2,2),'bottom');eraseEdge(c(2,2),'bottom');setTool(null)})]);
DA('PIC_SPLIT',()=>[cell(()=>findCell('رياضة'),'النقر في «رياضة»'),{show:'splitCells',say:'تقسيم الخلايا ← عمودان'},js('',()=>splitByLine(findCell('رياضة'),'v')),typeIn(()=>findCell('رياضة')?.nextElementSibling,'فن')]);
DA('PIC_SIZE',()=>[cell(()=>c(0,0)),{cmd:'rowH',arg:'1.2',say:'الارتفاع: 1.2 سم'},cell(()=>findCell('الفترة')),{cmd:'colW',arg:'1.5',say:'العرض: 1.5 سم'}]);
DA('PIC_ALIGN',()=>[cell(()=>c(1,1)),{cmd:'tselect',arg:'table',say:'تحديد الجدول'},{cmd:'calign',arg:'middle-center',say:'محاذاة للوسط'},cell(()=>findCell('صباحًا')),{cmd:'textDir',say:'اتجاه النص'},cell(()=>findCell('ظهرًا')),{cmd:'textDir',say:'اتجاه النص'}]);
DA('PIC_STYLE',()=>[cell(()=>c(1,0)),{cmd:'tstyle',arg:1,say:'أنماط الجداول'},{cmd:'optTotal',arg:true,say:'✓ صف الإجمالي'},{cmd:'optFirstCol',arg:true,say:'✓ العمود الأول'}]);
DA('PIC_SHADE',()=>[cell(()=>c(0,0)),{cmd:'tselect',arg:'row',say:'تحديد الصف'},{cmd:'shading',arg:'#92d050',say:'تظليل أخضر'},cell(()=>findCell('المجموع')),{cmd:'tselect',arg:'row',say:'تحديد الصف'},{cmd:'shading',arg:'#ffff00',say:'تظليل أصفر'},cell(()=>findCell('كعك'),'النقر في «كعك»'),{show:'tborders',say:'حدود ← حدود وتظليل ← التظليل ← النقش: قطري لأسفل'},js('',()=>{findCell('كعك').style.backgroundImage=patCSS('dkD','#000000');SIM.emit('change')})]);
DA('PIC_NOB',()=>[cell(()=>c(1,0)),{cmd:'tborders',arg:'none',say:'حدود ← بلا حدود'},{cmd:'viewGrid',say:'عرض خطوط الشبكة'}]);
DA('PIC_ALLB',()=>[cell(()=>c(1,0)),{cmd:'penColor',arg:'#0070c0',say:'لون القلم: أزرق'},{cmd:'penWeight',arg:'2',say:'السُّمك: 1½'},{cmd:'tborders',arg:'all',say:'حدود ← كل الحدود'}]);
DA('PIC_OUTER',()=>[cell(()=>c(1,0)),{cmd:'penColor',arg:'#c00000',say:'لون القلم: أحمر'},{cmd:'penWeight',arg:'3',say:'السُّمك: 2¼'},{cmd:'tborders',arg:'outside',say:'حدود ← حدود خارجية'}]);
DA('PIC_DBL',()=>[cell(()=>c(0,0)),{cmd:'penStyle',arg:'double',say:'نمط الحد: مزدوج'},{cmd:'penColor',arg:'#c00000',say:'لون القلم: أحمر'},{cmd:'tselect',arg:'row',say:'تحديد الصف'},{cmd:'tborders',arg:'bottom',say:'حدود ← حد سفلي'}]);
DA('PIC_DASH',()=>[cell(()=>c(1,0)),{cmd:'penStyle',arg:'dashed',say:'نمط الحد: متقطع'},{cmd:'tborders',arg:'inside',say:'حدود ← حدود داخلية'},{cmd:'penStyle',arg:'solid',say:'نمط الحد: متصل'},{cmd:'penWeight',arg:'3',say:'السُّمك: 2¼'},{cmd:'tborders',arg:'outside',say:'حدود ← حدود خارجية'}]);
DA('PIC_PAINT',()=>[cell(()=>c(0,0)),{cmd:'penColor',arg:'#00b050',say:'لون القلم: أخضر'},{cmd:'penWeight',arg:'3',say:'السُّمك: 2¼'},{cmd:'tselect',arg:'col',say:'تحديد العمود'},js('حدود ← الحد الأيسر للعمود',()=>OPS.tborders(isRTLt(T())?'left':'right'))]);
DA('PIC_SPLITT',()=>[cell(()=>findCell('13:00'),'النقر في صف «13:00»'),{cmd:'splitTable',say:'تقسيم الجدول'},cell(()=>{const t=[...document.querySelectorAll('#doc table.wt')].find(x=>/ماء/.test(x.textContent));return t&&t.rows[1].cells[0]}),{cmd:'convertText',say:'تحويل إلى نص'},cell(()=>{const t=[...document.querySelectorAll('#doc table.wt')].find(x=>/قديم/.test(x.textContent));return t&&t.rows[0].cells[0]}),{cmd:'tdel',arg:'table',say:'حذف ← حذف الجدول'}]);
/* تحدٍّ: جدول المبنى — ثلاث طرق للحل */
(()=>{const it=g('HOUSE_TASK');if(!it)return;
 const HTb=()=>HT();const G=(r,c)=>{const t=HTb();if(!t)return null;let hit=null;gridMap(t).forEach((v,td)=>{if(!hit&&v.r1<=r&&r<=v.r2&&v.c1<=c&&c<=v.c2)hit=td});return hit};
 const sel=(a,b,say)=>cells(()=>G(...a),()=>G(...b),say);const one=(r,c,say)=>cell(()=>G(r,c),say);
 const M=(a,b,say)=>[sel(a,b,say||'تحديد الخلايا بالسحب'),{cmd:'merge',say:'تخطيط ← دمج الخلايا'}];
 const side=()=>isRTLt(HTb())?'left':'right';
 const E=(a,b,say)=>[one(a[0],a[1],say||'الممحاة: مسح الخطوط بين الخلايا'),js('',async()=>{setTool('eraser');await A().W(300);for(let r=a[0];r<=b[0];r++){for(let c=a[1];c<b[1];c++){eraseEdge(G(r,a[1]),side());await A().W(250)}}for(let r=a[0];r<b[0];r++){eraseEdge(G(a[0],a[1]),'bottom');await A().W(250)}setTool(null)})];
 const SPL=(r,c,n,rr,say)=>[one(r,c,say),{show:'splitCells',say:`تخطيط ← تقسيم الخلايا: ${n} ${n===1?'عمود':'أعمدة'} × ${rr} ${rr===1?'صف':'صفوف'}`},js('',()=>{splitCellNM(G(r,c),n,rr)})];
 /* التنسيق نفسه في الطرق الثلاث (الشبكة النهائية: 7 صفوف × 6 أعمدة) */
 const FMT=()=>[one(0,0,'التلوين'),{cmd:'tselect',arg:'table',say:'تحديد ← الجدول'},{cmd:'shading',arg:'#deebf6',say:'تظليل ← أزرق فاتح للجدول كله'},
  sel([0,0],[0,5]),{cmd:'shading',arg:'#44546a',say:'الصف الأول ← كحلي'},sel([2,0],[2,5]),{cmd:'shading',arg:'#7030a0',say:'الصف الثالث ← بنفسجي'},one(5,0),{cmd:'shading',arg:'#70ad47',say:'الصف الطويل ← أخضر'},sel([6,0],[6,5]),{cmd:'shading',arg:'#c00000',say:'الصف الأخير ← أحمر'},
  one(1,4,'خلية النقش فوق المربع الكبير'),{cmd:'shading',arg:'pattern',say:'حدود ← حدود وتظليل ← نقش قطري'},
  {cmd:'penStyle',arg:'double',say:'نمط الخط ← مزدوج'},sel([1,3],[4,3],'تحديد خلايا الباب'),{cmd:'tborders',arg:'outside',say:'حدود ← حدود خارجية'},sel([6,3],[6,3],'خلية الباب في الصف الأخير'),{cmd:'tborders',arg:'right',say:'حد أيمن'},{cmd:'tborders',arg:'left',say:'حد أيسر'},sel([6,0],[6,5]),{cmd:'tborders',arg:'bottom',say:'حد سفلي مزدوج'},{cmd:'penStyle',arg:'solid',say:'نمط الخط ← متصل'},
  typeIn(()=>G(3,4),'Bottom center alignment'),one(3,4),{cmd:'calign',arg:'bottom-center',say:'تخطيط ← محاذاة أسفل الوسط'},
  typeIn(()=>G(5,0),'Hebron'),one(5,0),{cmd:'textDir',say:'تخطيط ← اتجاه النص'},{cmd:'calign',arg:'middle-center',say:'محاذاة للوسط'},{cmd:'rowH',arg:'1.8',say:'الارتفاع 1.8 سم'},
  js('تحديد «Hebron» ← غامق ← لون الخط أصفر',async()=>{const c=G(5,0);selectWord(c,'Hebron');OPS.bold();selectWord(c,'Hebron');OPS.fontcolor('#ffff00');clearCells()})];
 const START=(r,c)=>[endP(),{show:'table',say:`إدراج ← جدول ← ${c} أعمدة × ${r} صفوف`},js('',()=>insertTable(r,c))];
 it.demoMethods=[
  {name:'الطريقة 1: الدمج',d:'إدراج جدول بعدد كل الأعمدة والصفوف التي تراها في الصورة: 6 أعمدة × 7 صفوف، ثم دمج الخلايا التي يجب أن تصبح خلية واحدة.',
   list:()=>[...START(7,6),...M([0,0],[0,1],'الصف الأول: دمج كل جزأين'),...M([0,2],[0,3]),...M([0,4],[0,5]),...[1,2].flatMap(r=>[...M([r,0],[r,1]),...M([r,4],[r,5])]),
     ...M([3,2],[4,2],'الأعمدة الطويلة: دمج عموديًّا'),...M([3,3],[4,3]),...M([3,4],[4,5],'المربع الكبير: 2×2'),...M([5,0],[5,5],'الصف الأخضر كله خلية واحدة'),...M([6,0],[6,1]),...FMT()]},
  {name:'الطريقة 2: الممحاة',d:'نفس الجدول 6 × 7، لكن بدل «دمج الخلايا» استخدام «الممحاة» من تصميم الجدول: مسح الخط بين الخليتين فتصيران خلية واحدة.',
   list:()=>[...START(7,6),...E([0,0],[0,1],'الممحاة: مسح الخط'),...E([0,2],[0,3]),...E([0,4],[0,5]),...[1,2].flatMap(r=>[...E([r,0],[r,1]),...E([r,4],[r,5])]),
     ...E([3,2],[4,2]),...E([3,3],[4,3]),...E([3,4],[4,5],'المربع الكبير'),...E([5,0],[5,5],'الصف الأخضر'),...E([6,0],[6,1]),...FMT()]},
  {name:'الطريقة 3: التقسيم والدمج معًا',d:'إدراج جدول أصغر: 4 أعمدة × 6 صفوف (أعمدة الصف البنفسجي). ثم تقسيم ما يحتاج خلايا أكثر، ودمج ما يحتاج خلايا أقل.',
   list:()=>[...START(6,4),...SPL(3,0,2,2,'المربعات الأربعة الصغيرة: قسّم الخلية 2×2'),...SPL(6,4,2,1,'الصف الأخير: قسّم الخلية الأخيرة إلى عمودين'),
     ...M([0,2],[0,3],'الصف الأول: دمج خليتي الوسط'),...M([5,0],[5,5],'الصف الأخضر: دمج الصف كله'),...FMT()]}];
 it.demoAll=it.demoMethods[0].list})();
})();
