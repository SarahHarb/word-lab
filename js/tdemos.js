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
/* تحدٍّ: جدول المبنى — عدّة طرق للحل.
   أعمدة الصورة من اليسار (7): a b | c | d=الباب | g=عمود رفيع بجانب الباب | e f
   ترتيب الخلايا في كل صف بالـDOM يبدأ من اليمين:
   0: [ef][cdg][ab]   1,2: [ef][g][d][c][ab]   3: [EF كبير][g][d][c][b][a]  4: [b][a]   5: أخضر   6: [f][eg][d][c][ab] */
(()=>{const it=g('HOUSE_TASK');if(!it)return;
 const T_=()=>HT();
 const GL=(r,c)=>{const t=T_();if(!t)return null;let hit=null;gridMap(t).forEach((v,td)=>{if(!hit&&v.r1<=r&&r<=v.r2&&v.c1<=c&&c<=v.c2)hit=td});return hit};
 const NC=()=>{const t=T_();let n=0;if(t)gridMap(t).forEach(v=>{n=Math.max(n,v.c2+1)});return n};
 const LC=pc=>{const t=T_();return t&&isRTLt(t)?NC()-1-pc:pc};
 const P=(r,pc)=>GL(r,LC(pc));
 const D=(r,i)=>{const t=T_();return t&&t.rows[r]?t.rows[r].cells[i]:null};
 const LD=r=>{const t=T_();return t&&t.rows[r]?t.rows[r].cells[t.rows[r].cells.length-1]:null};
 const sel=(a,b,say)=>cells(()=>P(...a),()=>P(...b),say);
 const M=(a,b,say)=>[sel(a,b,say||'تحديد الخلايا بالسحب'),{cmd:'merge',say:'تخطيط ← دمج الخلايا'}];
 const MD=(ga,gb,say)=>[cells(ga,gb,say||'تحديد الخلايا بالسحب'),{cmd:'merge',say:'تخطيط ← دمج الخلايا'}];
 const ROW=(r,say)=>cells(()=>D(r,0),()=>LD(r),say);const ONE=(get,say)=>cells(get,get,say);
 const cur=()=>document.getElementById('cursor');
 async function goPt(x,y,ms=650){const c=cur();c.style.display='block';c.style.transitionDuration=(ms*PLAY.k)+'ms';c.style.left=x+'px';c.style.top=y+'px';await A().W(ms+50)}
 const ev=(el,type,x,y)=>el.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,button:0}));
 async function clickPt(el,x,y){await goPt(x,y);const c=cur();c.classList.add('clk');ev(el,'mousedown',x,y);ev(el,'mouseup',x,y);await A().W(300);c.classList.remove('clk')}
 async function dragPt(el,x1,y1,x2,y2){await goPt(x1,y1);const c=cur();c.classList.add('clk');ev(el,'mousedown',x1,y1);const n=10;for(let i=1;i<=n;i++){const x=x1+(x2-x1)*i/n,y=y1+(y2-y1)*i/n;c.style.transitionDuration='0ms';c.style.left=x+'px';c.style.top=y+'px';ev(document,'mousemove',x,y);await A().W(45)}ev(document,'mouseup',x2,y2);await A().W(250);c.classList.remove('clk')}
 const tool=(t,say)=>({cmd:t==='eraser'?'eraser':'drawTable',say});
 const toolOff=()=>js('',()=>{setTool(null)});
 /* الممحاة: نقرة على الخط الفاصل نفسه فقط (مثل Word). EH = الخط على يمين خلية الصورة (r,pc) · EV = الخط تحتها */
 const ER=(r,pc,side,say)=>js(say||'',async()=>{const td=P(r,pc);if(!td)return;await A().showAt(td);const R=td.getBoundingClientRect();
   const row=T_().rows[r].getBoundingClientRect();const ym=(row.top+row.bottom)/2;let x,y;
   if(side==='right'){x=R.right-2;y=ym}else{x=(R.left+R.right)/2;y=R.bottom-2}
   S.tool!=='eraser'&&setTool('eraser');await clickPt(td,x,y)});
 const EH=(r,pc,say)=>ER(r,pc,'right',say);const EV=(r,pc,say)=>ER(r,pc,'bottom',say);
 /* القلم: keep رقم = يُرسم الخط على حدّ موجود بعد keep أعمدة من اليمين؛ keep دالة = موضع الخط */
 const PEN=(get,dir,say,keep)=>js(say||'',async()=>{const td=get();if(!td)return;await A().showAt(td);const R=td.getBoundingClientRect();S.tool!=='draw'&&setTool('draw');
   if(dir==='v'){let x=(R.left+R.right)/2;if(typeof keep==='function')x=keep(td);else if(keep&&td.colSpan>1){const v=gridMap(td.closest('table')).get(td),m=colEdges(td.closest('table'));if(m[v.c1+keep]!=null)x=m[v.c1+keep]}await dragPt(td,x,R.top+6,x,R.bottom-6)}
   else{const y=(R.top+R.bottom)/2;await dragPt(td,R.left+6,y,R.right-6,y)}});
 const SPL=(get,n,rr,say)=>[cell(get,say||'النقر في الخلية'),{cmd:'splitCells',say:`تخطيط ← تقسيم الخلايا: ${n} ${n===1?'عمود':'أعمدة'} × ${rr} ${rr===1?'صف':'صفوف'}`},{fill:'#sc',value:String(n)},{fill:'#sr',value:String(rr)},{click:'#dlgs .df button.pri',say:'موافق'}];
 const START=(r,c)=>[endP(),{show:'table',say:`إدراج ← جدول ← ${c} ${c===1?'عمود':'أعمدة'} × ${r} صفوف`},js('',()=>insertTable(r,c))];
 /* النقش: «حدود وتظليل» ← تبويب «التظليل» ← النمط: قطري لأسفل داكن */
 const PAT=()=>[cell(()=>D(1,0),'الخلية فوق المربع الكبير'),{cmd:'tborders',arg:'more',say:'حدود ← حدود وتظليل...'},
   js('تبويب «التظليل»',async()=>{const b=$('#dlgs .bdtabs button[data-t="shade"]');if(!b)return;await A().moveTo(b,600);A().clickFx();b.click();await A().W(400)}),
   js('النقش ← النمط: قطري لأسفل داكن',async()=>{const x=$('#dlgs .bdP');if(!x)return;await A().moveTo(x,600);A().clickFx();x.value='dkD';x.dispatchEvent(new Event('change'));x.style.outline='3px solid #f0a020';await A().W(800);x.style.outline=''}),
   {click:'#dlgs .df button.pri',say:'موافق'}];
 const DOOR=(get,say,top)=>[ONE(get,say),{cmd:'tborders',arg:'right',say:'حدود ← حد أيمن'},{cmd:'tborders',arg:'left',say:'حدود ← حد أيسر'},...(top?[{cmd:'tborders',arg:'top',say:'حدود ← حد علوي'}]:[])];
 /* التنسيق نفسه في كل الطرق — بترتيب الخلايا في كل صف (الأولى = اليمنى) */
 const FMT=(dist=true)=>[...(dist?[cell(()=>D(0,0),'توزيع الأعمدة بالتساوي'),{cmd:'tselect',arg:'table',say:'تحديد ← الجدول'},{cmd:'distCols',say:'تخطيط ← توزيع الأعمدة'},
     cells(()=>D(1,1),()=>D(2,1),'العمود الرفيع بجانب الباب'),{cmd:'colW',arg:'0.6',say:'تخطيط ← العرض 0.6 سم'}]:[]),
  cell(()=>D(0,0),'الجدول كله'),{cmd:'tselect',arg:'table',say:'تحديد ← الجدول'},{cmd:'shading',arg:'#deedf2',say:'تظليل ← ألوان أخرى ← أزرق فاتح'},
  {cmd:'penStyle',arg:'solid',say:'نمط الخط ← مفرد'},{cmd:'penColor',arg:'#7dabba',say:'لون القلم ← ألوان أخرى ← أزرق فاتح'},{cmd:'tborders',arg:'all',say:'حدود ← كل الحدود (أزرق فاتح)'},
  ROW(0,'الصف الأول'),{cmd:'shading',arg:'#4a8098',say:'تظليل ← ألوان أخرى ← أزرق مخضرّ داكن'},ROW(2,'الصف الثالث'),{cmd:'shading',arg:'#7030a0',say:'تظليل ← بنفسجي'},
  cell(()=>D(5,0),'الصف الطويل'),{cmd:'shading',arg:'#7b9148',say:'تظليل ← ألوان أخرى ← أخضر زيتي'},ROW(6,'الصف الأخير'),{cmd:'shading',arg:'#893b37',say:'تظليل ← ألوان أخرى ← أحمر غامق'},
  ...PAT(),
  {cmd:'penStyle',arg:'double',say:'نمط الخط ← مزدوج'},{cmd:'penColor',arg:'#000000',say:'لون القلم ← أسود'},
  ...DOOR(()=>D(1,2),'الباب: الخلية الأولى',true),...DOOR(()=>D(2,2),'الباب: الخلية الثانية'),...DOOR(()=>D(3,2),'الباب: الخلية الطويلة'),...DOOR(()=>D(6,2),'الباب في الصف الأخير'),
  ROW(6,'أسفل الجدول'),{cmd:'tborders',arg:'bottom',say:'حدود ← حد سفلي'},{cmd:'penStyle',arg:'solid',say:'نمط الخط ← مفرد'},
  cells(()=>D(3,0),()=>LD(4),'صفّا المربع الكبير'),{cmd:'rowH',arg:'1.3',say:'تخطيط ← الارتفاع 1.3 سم (ليظهر مكان الكتابة)'},
  typeIn(()=>D(3,0),'Bottom center alignment'),cell(()=>D(3,0),'النقر في المربع الكبير'),{cmd:'calign',arg:'bottom-center',say:'تخطيط ← محاذاة لأسفل الوسط'},
  typeIn(()=>D(5,0),'Hebron'),cell(()=>D(5,0),'الصف الأخضر'),{cmd:'rowH',arg:'1.8',say:'تخطيط ← الارتفاع 1.8 سم'},
  {sel:'Hebron',say:'تحديد كلمة Hebron'},{cmd:'bold',say:'الصفحة الرئيسية ← غامق'},{sel:'Hebron'},{cmd:'fontcolor',arg:'#ffff00',say:'لون الخط ← أصفر'},
  cell(()=>D(5,0),'النقر في خلية Hebron'),{cmd:'textDir',say:'اتجاه النص (1): من الأعلى للأسفل'},{cmd:'textDir',say:'اتجاه النص (2): من الأسفل للأعلى — مثل الصورة'},{cmd:'calign',arg:'middle-center',say:'تخطيط ← محاذاة للوسط'}];
 /* 7 أعمدة × 7 صفوف: الدمج */
 const MERGES=()=>[...M([0,0],[0,1],'الصف الأول: دمج كل جزء'),...M([0,2],[0,4]),...M([0,5],[0,6]),...[1,2].flatMap(r=>[...M([r,0],[r,1]),...M([r,5],[r,6])]),
   ...M([3,2],[4,2],'الأعمدة الطويلة: دمج عموديًّا'),...M([3,3],[4,3]),...M([3,4],[4,4]),...M([3,5],[4,6],'المربع الكبير: 2×2'),...M([5,0],[5,6],'الصف الأخضر كله خلية واحدة'),...M([6,0],[6,1],'الصف الأخير'),...M([6,4],[6,5])];
 const ERASE=()=>[tool('eraser','تصميم الجدول ← الممحاة'),EH(0,0,'النقر على الخط بين الخليتين يمسحه فقط'),EH(0,2),EH(0,2),EH(0,5),...[1,2].flatMap(r=>[EH(r,0),EH(r,5)]),
   EV(3,2,'مسح الخطوط الأفقية في الأعمدة الطويلة'),EV(3,3),EV(3,4),EH(3,5,'المربع الكبير'),EH(4,5),EV(3,5),
   EH(5,0,'الصف الأخضر: مسح كل الخطوط'),EH(5,0),EH(5,0),EH(5,0),EH(5,0),EH(5,0),EH(6,0,'الصف الأخير'),EH(6,4),toolOff()];
 const efRight=td=>{const R=td.getBoundingClientRect(),m=colEdges(td.closest('table')),v=gridMap(td.closest('table')).get(td);const a=m[v.c1],b=m[v.c1+1];return a!=null&&b!=null?a+(b-a)*0.5:(R.left+R.right)/2};
 it.demoMethods=[
  {name:'1. الدمج فقط',d:'إدراج جدول 7 أعمدة × 7 صفوف (كل خطوط الصورة، ومنها العمود الرفيع بجانب الباب)، ثم تحديد الخلايا التي تصبح خلية واحدة ← «دمج الخلايا».',
   list:()=>[...START(7,7),...MERGES(),...FMT()]},
  {name:'2. الممحاة',d:'نفس الجدول 7 × 7، لكن بدل «دمج الخلايا»: تصميم الجدول ← الممحاة، ثم النقر على الخط الفاصل نفسه؛ يُمسح ذلك الخط فقط.',
   list:()=>[...START(7,7),...ERASE(),...FMT()]},
  {name:'3. تقسيم الخلايا فقط',d:'إدراج جدول من عمود واحد × 5 صفوف، ثم تقسيم كل صف من «تقسيم الخلايا» حسب عدد أجزائه — بدون أي دمج.',
   list:()=>[...START(5,1),...SPL(()=>D(0,0),3,1,'الصف الأول: 3 أجزاء'),...SPL(()=>D(1,0),5,2,'صفّا الباب: 5 أجزاء × صفّين'),
     ...SPL(()=>D(3,0),5,1,'صف المربع الكبير: 5 أجزاء'),...SPL(()=>D(3,4),2,2,'المربعات الأربعة الصغيرة: 2×2'),...SPL(()=>D(6,0),5,1,'الصف الأخير: 5 أجزاء'),...FMT(false)]},
  {name:'4. التقسيم بالقلم',d:'إدراج جدول من عمود واحد × 5 صفوف، ثم تصميم الجدول ← رسم جدول (القلم): خط عمودي داخل الخلية = عمودان، خط أفقي = صفّان. الخط المرسوم على امتداد خط موجود يلتصق به.',
   list:()=>[...START(5,1),tool('draw','تصميم الجدول ← رسم جدول (القلم)'),PEN(()=>D(0,0),'v','الصف الأول: خط عمودي'),PEN(()=>D(0,0),'v','وخط آخر ← 3 خلايا'),
     PEN(()=>D(1,0),'h','الصف الثاني: خط أفقي ليصبح صفّين'),
     PEN(()=>D(1,0),'v','على امتداد خطوط الصف الأول',1),PEN(()=>D(1,1),'v','',1),PEN(()=>D(1,1),'v','خطّان جديدان: الباب والعمود الرفيع'),PEN(()=>D(1,1),'v'),
     ...[2,3].flatMap(r=>[PEN(()=>D(r,0),'v',r===2?'الصف التالي: نفس الخطوط':'صف المربع الكبير',1),PEN(()=>D(r,1),'v','',1),PEN(()=>D(r,2),'v','',1),PEN(()=>D(r,3),'v','',1)]),
     PEN(()=>D(3,4),'v','المربعات الصغيرة: خط عمودي'),PEN(()=>D(3,4),'h','ثم خط أفقي في كل مربع'),PEN(()=>D(3,5),'h'),
     PEN(()=>D(6,0),'v','الصف الأخير',2),PEN(()=>D(6,1),'v','',1),PEN(()=>D(6,2),'v','',1),PEN(()=>D(6,0),'v','خط جديد داخل الجزء الأيمن',efRight),toolOff(),...FMT()]},
  {name:'5-أ. 5 أعمدة: تقسيم ودمج',d:'إدراج 5 أعمدة × 6 صفوف (أجزاء صفّ الباب). تقسيم المربعات الصغيرة 2×2 وآخر خلية يمنى في الصف الأخير، ثم دمج وسط الصف الأول، والصف الأخضر، وخليتين في الصف الأخير.',
   list:()=>[...START(6,5),...SPL(()=>D(3,4),2,2,'المربعات الأربعة الصغيرة: 2×2'),...SPL(()=>D(6,0),2,1,'الصف الأخير: الخلية اليمنى عمودان'),
     ...MD(()=>D(0,1),()=>D(0,3),'الصف الأول: تحديد الخلايا الثلاث في الوسط'),...MD(()=>D(5,0),()=>LD(5),'الصف الأخضر كله'),...MD(()=>D(6,1),()=>D(6,2),'الصف الأخير: دمج خليتين'),...FMT()]},
  {name:'5-ب. 3 أعمدة: تقسيم ودمج',d:'إدراج 3 أعمدة × 6 صفوف (أجزاء الصف الأول). تقسيم الخلية الوسطى في صفوف الباب إلى 3، وتقسيم المربعات الصغيرة 2×2، ثم دمج الصف الأخضر وخليتين في الصف الأخير.',
   list:()=>[...START(6,3),...[1,2,3].flatMap(r=>SPL(()=>D(r,1),3,1,r===1?'الخلية الوسطى ← 3 أعمدة':'')),...SPL(()=>D(3,4),2,2,'المربعات الأربعة الصغيرة: 2×2'),
     ...SPL(()=>D(6,1),3,1,'الصف الأخير: الوسط 3 أعمدة'),...SPL(()=>D(6,0),2,1,'والخلية اليمنى عمودان'),...MD(()=>D(6,1),()=>D(6,2),'دمج خليتين'),...MD(()=>D(5,0),()=>LD(5),'الصف الأخضر كله'),...FMT()]},
  {name:'5-ج. دمج + ممحاة',d:'إدراج 7 أعمدة × 7 صفوف: دمج بعض الخلايا من «دمج الخلايا»، ومسح خطوط أخرى بالممحاة.',
   list:()=>[...START(7,7),...M([0,0],[0,1],'الصف الأول بالدمج'),...M([0,2],[0,4]),...M([0,5],[0,6]),...M([5,0],[5,6],'الصف الأخضر بالدمج'),
     tool('eraser','الباقي بالممحاة'),...[1,2].flatMap(r=>[EH(r,0),EH(r,5)]),EV(3,2),EV(3,3),EV(3,4),EH(3,5),EH(4,5),EV(3,5),EH(6,0),EH(6,4),toolOff(),...FMT()]}];
 it.demoAll=it.demoMethods[0].list})();
})();
