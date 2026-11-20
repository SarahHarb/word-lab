/* «▶ شاهد الحل» لتمارين الجداول */
(function(){
const T=()=>PT_(),c=(r,i)=>T()&&T().rows[r]&&T().rows[r].cells[i];
const A=()=>window.APL;
const cell=(f,say)=>({say,js:async()=>{const a=f();if(!a)return;await A().showAt(a);clearCells();S.curCell=a;setCur(a)}});
const cells=(fa,fb,say)=>({say,js:async()=>{const a=fa(),b=fb();if(!a||!b)return;await A().showAt(a);S.curCell=a;setCells(rectCells(a,b));await A().showAt(b)}});
const typeIn=(f,text)=>({js:async()=>{const a=f();if(!a)return;await A().showAt(a);clearCells();S.curCell=a;setCur(a);placeCaretIn(a,false);S.range=curRange();await A().typeText(text)}});
const js=(say,fn)=>({say,js:fn});
const endP=()=>({js:()=>{placeCaretIn(document.querySelector('#doc .pg-body > p:last-child'));S.range=curRange()}});
const ins=(r,c2)=>[endP(),{show:'table',say:`إدراج ← جدول ← اسحب على ${c2}×${r}`},js('',()=>insertTable(r,c2))];
const g=n=>{try{return eval(n)}catch(e){return null}};
const DA=(n,list)=>{const it=g(n);if(it)it.demoAll=list};
DA('PIC_INS',()=>ins(3,4));
DA('PIC_TYPE',()=>[...ins(4,3),...FR.flatMap((r,i)=>r.map((v,j)=>typeIn(()=>c(i,j),v)))]);
DA('PIC_SELECT',()=>[cell(()=>findCell('90'),'انقر في الخلية'),{cmd:'shading',arg:'#ffff00',say:'تظليل أصفر'},cell(()=>findCell('الملاحظة')),{cmd:'tselect',arg:'col',say:'تحديد ← العمود'},{cmd:'shading',arg:'#deebf6',say:'تظليل أزرق فاتح'},cell(()=>c(0,0)),{cmd:'tselect',arg:'row',say:'تحديد ← الصف'},{cmd:'shading',arg:'#92d050',say:'تظليل أخضر'},cell(()=>c(1,1)),{cmd:'tselect',arg:'table',say:'تحديد ← الجدول'},{cmd:'calign',arg:'middle-center',say:'محاذاة للوسط'}]);
DA('PIC_ADD',()=>[cell(()=>c(0,0)),{cmd:'insLeft',say:'إدراج عمود لليسار'},typeIn(()=>c(0,1),'الصف'),typeIn(()=>c(1,1),'السابع'),typeIn(()=>c(2,1),'الثامن'),cell(()=>c(1,0)),{cmd:'insAbove',say:'إدراج صف لأعلى'},...['رنا','السادس','السباحة'].map((v,j)=>typeIn(()=>c(1,j),v)),cell(()=>c(3,0)),{cmd:'insBelow',say:'إدراج صف لأسفل'},...['سارة','السابع','القراءة'].map((v,j)=>typeIn(()=>c(4,j),v))]);
DA('PIC_DEL',()=>[cell(()=>c(0,1)),{cmd:'tdel',arg:'col',say:'حذف ← حذف الأعمدة'},cell(()=>c(2,0)),{cmd:'tdel',arg:'row',say:'حذف ← حذف الصفوف'},cell(()=>c(3,0)),{cmd:'tdel',arg:'row',say:'حذف ← حذف الصفوف'}]);
DA('PIC_SORT',()=>[cell(()=>c(1,0)),{cmd:'tsort',say:'فرز'}]);
DA('PIC_MERGE',()=>[cells(()=>c(0,0),()=>c(0,3),'حدّد خلايا الصف الأول'),{cmd:'merge',say:'دمج الخلايا'},cell(()=>c(2,2)),js('الممحاة: امسح الخط بين الخليتين',async()=>{setTool('eraser');await A().W(500);eraseEdge(c(2,2),'bottom');eraseEdge(c(2,2),'bottom');setTool(null)})]);
DA('PIC_SPLIT',()=>[cell(()=>findCell('رياضة'),'انقر في «رياضة»'),{show:'splitCells',say:'تقسيم الخلايا ← عمودان'},js('',()=>splitByLine(findCell('رياضة'),'v')),typeIn(()=>findCell('رياضة')?.nextElementSibling,'فن')]);
DA('PIC_SIZE',()=>[cell(()=>c(0,0)),{cmd:'rowH',arg:'1.2',say:'الارتفاع: 1.2 سم'},cell(()=>findCell('الفترة')),{cmd:'colW',arg:'1.5',say:'العرض: 1.5 سم'}]);
DA('PIC_ALIGN',()=>[cell(()=>c(1,1)),{cmd:'tselect',arg:'table',say:'تحديد الجدول'},{cmd:'calign',arg:'middle-center',say:'محاذاة للوسط'},cell(()=>findCell('صباحًا')),{cmd:'textDir',say:'اتجاه النص'},cell(()=>findCell('ظهرًا')),{cmd:'textDir',say:'اتجاه النص'}]);
DA('PIC_STYLE',()=>[cell(()=>c(1,0)),{cmd:'tstyle',arg:1,say:'أنماط الجداول'},{cmd:'optTotal',arg:true,say:'✓ صف الإجمالي'},{cmd:'optFirstCol',arg:true,say:'✓ العمود الأول'}]);
DA('PIC_SHADE',()=>[cell(()=>c(0,0)),{cmd:'tselect',arg:'row',say:'تحديد الصف'},{cmd:'shading',arg:'#92d050',say:'تظليل أخضر'},cell(()=>findCell('المجموع')),{cmd:'tselect',arg:'row',say:'تحديد الصف'},{cmd:'shading',arg:'#ffff00',say:'تظليل أصفر'},cell(()=>findCell('كعك'),'انقر في «كعك»'),{show:'tborders',say:'حدود ← حدود وتظليل ← التظليل ← النقش: قطري لأسفل'},js('',()=>{findCell('كعك').style.backgroundImage=patCSS('dkD','#000000');SIM.emit('change')})]);
DA('PIC_NOB',()=>[cell(()=>c(1,0)),{cmd:'tborders',arg:'none',say:'حدود ← بلا حدود'},{cmd:'viewGrid',say:'عرض خطوط الشبكة'}]);
DA('PIC_ALLB',()=>[cell(()=>c(1,0)),{cmd:'penColor',arg:'#0070c0',say:'لون القلم: أزرق'},{cmd:'penWeight',arg:'2',say:'السُّمك: 1½'},{cmd:'tborders',arg:'all',say:'حدود ← كل الحدود'}]);
DA('PIC_OUTER',()=>[cell(()=>c(1,0)),{cmd:'penColor',arg:'#c00000',say:'لون القلم: أحمر'},{cmd:'penWeight',arg:'3',say:'السُّمك: 2¼'},{cmd:'tborders',arg:'outside',say:'حدود ← حدود خارجية'}]);
DA('PIC_DBL',()=>[cell(()=>c(0,0)),{cmd:'penStyle',arg:'double',say:'نمط الحد: مزدوج'},{cmd:'penColor',arg:'#c00000',say:'لون القلم: أحمر'},{cmd:'tselect',arg:'row',say:'تحديد الصف'},{cmd:'tborders',arg:'bottom',say:'حدود ← حد سفلي'}]);
DA('PIC_DASH',()=>[cell(()=>c(1,0)),{cmd:'penStyle',arg:'dashed',say:'نمط الحد: متقطع'},{cmd:'tborders',arg:'inside',say:'حدود ← حدود داخلية'},{cmd:'penStyle',arg:'solid',say:'نمط الحد: متصل'},{cmd:'penWeight',arg:'3',say:'السُّمك: 2¼'},{cmd:'tborders',arg:'outside',say:'حدود ← حدود خارجية'}]);
DA('PIC_PAINT',()=>[cell(()=>c(0,0)),{cmd:'penColor',arg:'#00b050',say:'لون القلم: أخضر'},{cmd:'penWeight',arg:'3',say:'السُّمك: 2¼'},{cmd:'tselect',arg:'col',say:'تحديد العمود'},js('حدود ← الحد الأيسر للعمود',()=>OPS.tborders(isRTLt(T())?'left':'right'))]);
DA('PIC_SPLITT',()=>[cell(()=>findCell('13:00'),'انقر في صف «13:00»'),{cmd:'splitTable',say:'تقسيم الجدول'},cell(()=>{const t=[...document.querySelectorAll('#doc table.wt')].find(x=>/ماء/.test(x.textContent));return t&&t.rows[1].cells[0]}),{cmd:'convertText',say:'تحويل إلى نص'},cell(()=>{const t=[...document.querySelectorAll('#doc table.wt')].find(x=>/قديم/.test(x.textContent));return t&&t.rows[0].cells[0]}),{cmd:'tdel',arg:'table',say:'حذف ← حذف الجدول'}]);
/* تحدٍّ: جدول المبنى */
DA('HOUSE_TASK',()=>{const t=()=>HT(),hc=(r,i)=>t()&&t().rows[r]&&t().rows[r].cells[i];const sel2=(a,b,say)=>cells(()=>hc(...a),()=>hc(...b),say);const M={cmd:'merge',say:'دمج الخلايا'};
 return [endP(),{show:'table',say:'إدراج ← جدول 7×7'},js('',()=>insertTable(7,7)),cell(()=>hc(0,0)),{cmd:'tselect',arg:'table',say:'تحديد الجدول'},{cmd:'shading',arg:'#deebf6',say:'تظليل أزرق فاتح'},
  sel2([0,0],[0,1]),M,sel2([0,1],[0,3]),M,sel2([0,2],[0,3]),M,...[1,2].flatMap(r=>[sel2([r,0],[r,1]),M,sel2([r,4],[r,5]),M]),sel2([6,0],[6,1]),M,sel2([6,3],[6,4]),M,sel2([3,5],[4,6]),M,...[4,3,2].flatMap(i=>[sel2([3,i],[4,i]),M]),sel2([5,0],[5,6]),M,
  sel2([0,0],[0,2]),{cmd:'shading',arg:'#44546a',say:'تظليل كحلي'},sel2([2,0],[2,4]),{cmd:'shading',arg:'#7030a0',say:'تظليل بنفسجي'},cell(()=>hc(5,0)),{cmd:'shading',arg:'#70ad47',say:'تظليل أخضر'},sel2([6,0],[6,4]),{cmd:'shading',arg:'#c00000',say:'تظليل أحمر'},
  cell(()=>hc(1,4)),{cmd:'shading',arg:'pattern',say:'نقش'},{cmd:'penStyle',arg:'double',say:'نمط الحد: مزدوج'},sel2([1,2],[3,3],'حدّد الباب'),{cmd:'tborders',arg:'outside',say:'حدود خارجية'},sel2([6,2],[6,2]),{cmd:'tborders',arg:'right',say:'حد أيمن'},{cmd:'tborders',arg:'left',say:'حد أيسر'},sel2([6,0],[6,4]),{cmd:'tborders',arg:'bottom',say:'حد سفلي'},
  typeIn(()=>hc(3,5),'Bottom center alignment'),cell(()=>hc(3,5)),{cmd:'calign',arg:'bottom-center',say:'محاذاة أسفل الوسط'},typeIn(()=>hc(5,0),'Hebron'),cell(()=>hc(5,0)),{cmd:'textDir',say:'اتجاه النص'},{cmd:'calign',arg:'middle-center',say:'محاذاة للوسط'},{cmd:'rowH',arg:'1.8',say:'الارتفاع 1.8 سم'},
  js('حدّد «Hebron» ← غامق ← لون أصفر',async()=>{const gg=hc(5,0);selectWord(gg,'Hebron');OPS.bold();selectWord(gg,'Hebron');OPS.fontcolor('#ffff00');clearCells()})]});
})();
