/* عروض «▶ شاهد الحل» للمطلوبات التي تحتاج كتابة أو تحديدًا خاصًّا أو مفاتيح */
(function(){
const D=(q,list)=>{if(q)q.demo=list};
const cp=f=>({js:()=>{const p=f();if(p){placeCaretIn(p,true);S.range=curRange()}}});
const cpEnd=f=>({js:()=>{const p=f();if(p){placeCaretIn(p,false);S.range=curRange()}}});
const intoText=o=>({js:()=>{const t=o()?.querySelector('.stxt');if(!t)return;t.contentEditable='true';const r=document.createRange();r.selectNodeContents(t);const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange()}});
const drawShape=(kind,x,y,w,h)=>[{cmd:'insShape',arg:kind,say:'اختيار الشكل ثم سحب على الصفحة'},{js:async()=>{const pg=$('#doc .page'),b=firstBody().getBoundingClientRect();const X=b.right-x-w,Y=b.top+y;const c=$('#cursor');c.style.display='block';c.style.left=X+'px';c.style.top=Y+'px';
  const o=(t,xx,yy)=>pg.dispatchEvent(new MouseEvent(t,{bubbles:true,clientX:xx,clientY:yy,button:0}));o('mousedown',X,Y);for(let k=1;k<=8;k++){await new Promise(r=>setTimeout(r,60*PLAY.k));c.style.left=(X+w*k/8)+'px';c.style.top=(Y+h*k/8)+'px';document.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:X+w*k/8,clientY:Y+h*k/8}))}document.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:X+w,clientY:Y+h}))}}];
/* ---- الأساسيات ---- */
D(BA1.reqs[0],[{say:'النقر على «ابدأ»',click:'#startbtn'},{say:'كتابة: Word',fill:'#startq',value:'Word'},{say:'النقر على «Word»',click:'#startres .best'},{js:async()=>{for(let i=0;i<60&&S.app==='desktop';i++)await new Promise(r=>setTimeout(r,100));await new Promise(r=>setTimeout(r,1200))}}]);
D(BA2.reqs[1],[cp(()=>firstBody().firstElementChild),{type:'هذا أول مستند لي'}]);
D(BA3.reqs[1],[cp(()=>firstBody().firstElementChild),{type:'سارة حرب'}]);
UI_PARTS.forEach((x,i)=>D(BA0.reqs[i],[{say:x.n+': '+x.d,click:x.sel},{wait:900}]));
D(BA4.reqs[3],[{say:'شريط الحالة ← + حتى 150%',click:'#wwin .wstatus .zm'},{js:()=>setZoom(150)}]);
D(BA6.reqs[0],[cpEnd(()=>firstBody().lastElementChild),{type:'تمّ الحل'}]);
D(BA6.reqs[1],[{say:'زر الحفظ 💾',click:'[data-hid="qat-save"]'}]);
/* ---- الكتابة ---- */
D(TX1.reqs[0],[cp(()=>firstBody().firstElementChild),{type:'رحلتي إلى أريحا'}]);
D(TX1.reqs[1],[cpEnd(()=>firstBody().firstElementChild),{key:'Enter'},{type:'زرنا أريحا يوم الخميس مع معلمتنا، وشاهدنا قصر هشام.'}]);
D(MK1.reqs[1],[{caret:'الصف'},{key:'Tab'}]);D(MK1.reqs[2],[{caret:'شارع القدس'},{key:'ShiftEnter'}]);D(MK1.reqs[3],[{caret:'الفقرة الثانية'},{key:'Enter'}]);
D(RD1.reqs[0],[cp(()=>firstBody().firstElementChild),{type:'=rand(2,3)'},{key:'Enter'}]);
D(RD1.reqs[1],[cp(()=>[...firstBody().children].at(-1)),{type:'=lorem(1,2)'},{key:'Enter'}]);
D(TX2.reqs[0],[{selFrom:'أولًا نغلي الماء.',lines:true,say:'تحديد السطر (3 نقرات)'},{cmd:'cut',say:'قص (Ctrl + X)'},{caret:'ثم نضع',say:'النقر في أول «ثم…»'},{cmd:'paste',say:'لصق (Ctrl + V)'}]);
/* ---- التحديد ---- */
D(SL1.reqs[0],[{sel:'الملوحة',say:'نقرتان على الكلمة'},{wait:500}]);
D(SL1.reqs[1],[{say:'نقرة في الهامش الأيمن بجانب السطر',js:async()=>{const p=firstBody().firstElementChild;placeCaretIn(p,true);const s=getSelection();s.modify('move','backward','lineboundary');s.modify('extend','forward','lineboundary')}},{wait:700}]);
D(SL1.reqs[2],[{selFrom:'تشتهر',lines:true,say:'3 نقرات داخل الفقرة'},{wait:500}]);
D(SL1.reqs[3],[{key:'CtrlA'},{wait:500}]);
/* ---- الخط ---- */
D(TX4.reqs[0],[{sel:'يوم العلوم'},{cmd:'fontName',arg:'Times New Roman',say:'نوع الخط ← Times New Roman'}]);
D(TX4.reqs[1],[{sel:'يوم العلوم'},{cmd:'fontSize',arg:'28',say:'حجم الخط ← 28'}]);
D(TX4.reqs[2],[{selFrom:'تشتهر أريحا',lines:true},{cmd:'fontSize',arg:'14',say:'حجم الخط ← 14'}]);
D(TX6.reqs[0],[{selPart:['H2O',1,1],say:'تحديد 2'},{cmd:'sub',say:'منخفض x₂'}]);
D(TX6.reqs[1],[{selPart:['م2',1,1],say:'تحديد 2'},{cmd:'sup',say:'مرتفع x²'}]);
D(TX6.reqs[2],[{selPart:['x2',1,1]},{cmd:'sup',say:'مرتفع x²'},{selPart:['y2',1,1]},{cmd:'sup',say:'مرتفع x²'}]);
['القمر','النجوم'].forEach((w,i)=>D(TX11.reqs[i],[{caretIn:'الشمس',say:'النقر في «الشمس»'},{js:()=>{const f=findT('الشمس');if(f){const r=document.createRange();r.setStart(f[0],1);r.collapse(true);const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange()}}},{cmd:'painter',say:'نسخ التنسيق 🖌'},{sel:w,say:'تحديد «'+w+'»'},{js:()=>firstBody().dispatchEvent(new MouseEvent('mouseup',{bubbles:true}))},{wait:500}]));
function findT(t){return window.findTextIn?findTextIn(t):null}
/* ---- التعداد ---- */
D(LS1.reqs[0],[{selFrom:'قبعة',selTo:'كاميرا',lines:true},{cmd:'bullets',say:'تعداد نقطي'}]);
D(LS2.reqs[0],[{selFrom:'املأ',selTo:'حرّك',lines:true},{cmd:'numbering',say:'ترقيم'}]);
D(LS5.reqs[0],[{selFrom:'الوحدة الأولى',selTo:'قص الصورة',lines:true},{cmd:'multilevel',arg:'1',say:'قائمة متعددة المستويات'}]);
['إدراج جدول','تنسيق جدول','إدراج صورة','قص الصورة'].forEach((w,i)=>D(LS5.reqs[i+1],[{caretIn:w},{key:'Tab'}]));
/* ---- الواجب الكبير ---- */
const H=TXT_HW.reqs;
D(H[0],[{caretIn:'نشرة العلوم'},{cmd:'style',arg:'title',say:'الأنماط ← العنوان'},{caretIn:'نشرة العلوم'},{cmd:'alignC',say:'توسيط'}]);
D(H[1],[{caretIn:'مدرسة الأمل'},{cmd:'alignC',say:'توسيط'},{selFrom:'مدرسة الأمل',lines:true},{cmd:'italic',say:'مائل'}]);
D(H[2],[{caretIn:'الماء سرّ الحياة'},{cmd:'style',arg:'h1',say:'عنوان 1'},{caretIn:'خطة البحث'},{cmd:'style',arg:'h1',say:'عنوان 1'}]);
D(H[5],[{selPart:['H2O',1,1]},{cmd:'sub',say:'منخفض'}]);
D(H[6],[{sel:'71%'},{cmd:'bold',say:'غامق'},{sel:'71%'},{cmd:'fontcolor',arg:'#ff0000',say:'أحمر'}]);
D(H[7],[{caretIn:'معلومة مهمة'},{cmd:'pborders',arg:'box',say:'حدود خارجية'},{caretIn:'معلومة مهمة'},{cmd:'pshading',arg:'#fff2cc',say:'تظليل أصفر فاتح'}]);
D(H[8],[{sel:'معلومة مهمة:'},{cmd:'bold',say:'غامق'}]);
D(H[9],['فوائد الماء:','خطوات تجربة التبخّر:'].flatMap(w=>[{sel:w},{cmd:'bold',say:'غامق'},{sel:w},{cmd:'underline',say:'تسطير'}]));
D(H[10],[{selFrom:'ينظّم',selTo:'السموم',lines:true},{cmd:'bullets',arg:'✓',say:'تعداد ✓'}]);
D(H[11],[{selFrom:'ضع الماء',selTo:'راقب',lines:true},{cmd:'numbering',arg:'arabic-abjad',say:'ترقيم أ. ب. ج.'}]);
D(H[12],[{selFrom:'الماء في الطبيعة',selTo:'الدم',lines:true},{cmd:'multilevel',arg:'1',say:'قائمة متعددة المستويات'},...['الأنهار','البحار','الدم'].flatMap(w=>[{caretIn:w},{key:'Tab'}])]);
D(H[13],[{caretIn:'Water is life'},{cmd:'ltr',say:'من اليسار إلى اليمين'},{sel:'Water is life.'},{cmd:'italic',say:'مائل'}]);
D(H[14],[{caretIn:'أساس كل شيء'},{cmd:'indentInc',say:'زيادة المسافة البادئة'},{sel:'«الماء أساس كل شيء حي»'},{cmd:'highlight',arg:'#ffff00',say:'تمييز أصفر'}]);
D(H[15],[{caret:'التاريخ: 2026'},{key:'ShiftEnter'},{caretIn:'إعداد'},{cmd:'alignL',say:'محاذاة لليسار'}]);
/* ---- الأشكال ---- */
D(SH1.reqs[0],drawShape('rect',20,60,150,100));D(SH1.reqs[1],drawShape('oval',215,60,120,120));D(SH1.reqs[2],drawShape('tri',380,60,130,115));
D(SH3.reqs[1],[{obj:()=>shapes(['roundRect','rect'])[0]},intoText(()=>shapes(['roundRect','rect'])[0]),{type:'اضغط هنا'}]);
D(SH5.reqs[0],[cpEnd(()=>paras()[1]),{cmd:'insTextbox',arg:'simple',say:'مربع نص بسيط'},intoText(tbox),{type:'ملاحظة: الامتحان يوم الأحد'}]);
D(SH5.reqs[1],[{obj:tbox},{cmd:'shapeOutline',arg:'none',say:'بلا مخطط'}]);D(SH5.reqs[2],[{obj:tbox},{cmd:'shapeFill',arg:'#ffff00',say:'تعبئة صفراء'}]);
/* ---- الصور ---- */
D(IM1.reqs[0],[cp(()=>firstBody().children[1]),{cmd:'insPic',arg:'2',say:'إدراج ← صور ← صورة البحر'}]);
D(IM2.reqs[0],[{obj:pic0},{cmd:'objW',arg:'6',say:'العرض: 6 سم'}]);D(IM2.reqs[2],[{obj:pic0},{cmd:'alignObj',arg:'center',say:'توسيط'}]);
D(IM6.reqs[0],[{obj:pic0},{cmd:'crop',say:'اقتصاص ← سحب المقابض للداخل'},{js:()=>{const o=pic0(),d=o.dataset;d.ix=-Math.round(+d.iw*.22);d.iy=-Math.round(+d.ih*.06);d.w=Math.round(+d.iw*.56);d.h=Math.round(+d.ih*.84);applyObj(o)}},{wait:600},{js:()=>{try{clearObjSel()}catch(e){}}}]);
D(IM3.reqs[1],[{obj:pic0},{cmd:'alignObj',arg:'left',say:'محاذاة لليسار'}]);
D(IM8.reqs[0],[{obj:()=>picsAll().find(o=>imgIdx(o)===3)},{cmd:'forward',say:'إحضار للأمام'},{cmd:'forward',say:'إحضار للأمام'}]);
/* ---- WordArt ---- */
D(WA1.reqs[0],[cp(()=>firstBody().firstElementChild),{cmd:'insWordArt',arg:'1',say:'إدراج ← WordArt'},intoText(wart),{type:'يوم العلوم'}]);

/* ---- الرأس والتذييل ---- */
const hfT=(which,idx,text)=>({js:async()=>{const box=pages()[0]?.querySelector(which==='ftr'?'.pg-ftr':'.pg-hdr');if(!box)return;const phs=box.querySelectorAll('.ph');const sp=box.querySelectorAll('p > span:not(.pnum)');const t=phs.length===sp.length?phs[idx]:(sp[idx]||phs[idx]);
  const c=$('#cursor');const r=(t||box).getBoundingClientRect();c.style.display='block';c.style.left=(r.left+r.width/2)+'px';c.style.top=(r.top+r.height/2)+'px';await new Promise(z=>setTimeout(z,500*PLAY.k));
  if(t){selectNode(t);await typeInto(t,text)}else{placeCaretIn(box,false);await typeInto(box,text)}}});
D(HF1.reqs[0],[{cmd:'header',arg:'0',say:'إدراج ← رأس الصفحة ← فارغ'},{wait:400},hfT('hdr',0,'مدرسة الأمل')]);
D(HF1.reqs[1],[{cmd:'closeHF',say:'إغلاق رأس وتذييل'}]);
D(HF2.reqs[1],[hfT('ftr',0,'الصف السابع')]);D(HF2.reqs[2],[hfT('ftr',1,'تقرير العلوم')]);D(HF2.reqs[3],[hfT('ftr',2,'2026')]);
D(HF6.reqs[1],[hfT('hdr',0,'مشروع الطاقة الشمسية')]);
D(HF4.reqs[0],[{cmd:'pnFormat',say:'رقم الصفحة ← تنسيق أرقام الصفحات...'},{wait:500},{say:'تنسيق الأرقام: أ، ب، ج',js:()=>{const s=$('#pnf');if(s){s.value='abjad';s.dispatchEvent(new Event('change',{bubbles:true}))}const c=$('#dlgs input[name="pns"][value="c"]');if(c)c.checked=true}},{wait:700},{say:'موافق',click:'#dlgs .df .pri'}]);
/* ---- الرموز ---- */
const symIns=(ch,name)=>[{cmd:'symbolDlg',say:'إدراج ← رمز ← رموز إضافية...'},{wait:400},{say:'اختيار '+(name||ch),click:()=>$(`#sgrid [data-s="${ch}"]`)},{say:'إدراج',click:'#dlgs .df .pri'},{wait:300},{js:()=>{try{closeDialog()}catch(e){}}}];
D(SY1.reqs[0],[{caret:'30',at:'end'},...symIns('°','°')]);
D(SY1.reqs[1],[{caret:'12  4',off:3},...symIns('÷')]);
D(SY1.reqs[2],[{caret:'5  3',off:2},...symIns('×')]);
D(SY2.reqs[0],[{caret:'جميع الحقوق'},{cmd:'insSymbol',arg:'©',say:'رمز ← ©'},{type:' '}]);
D(SY2.reqs[1],[{caret:'الهاتف'},...symIns('☎'),{type:' '}]);
D(SY2.reqs[2],[{caret:'تمّت المهمة',at:'end'},{type:' '},...symIns('✓')]);
/* ---- المعادلات ---- */
const setEq=(pi,html)=>({js:()=>{const p=paras()[pi];if(!p)return;let e=p.querySelector('.eq');if(!e){p.innerHTML='<span class="eq disp"></span>';e=p.querySelector('.eq')}e.innerHTML=html;try{SIM.emit('change')}catch(x){}}});
D(EQ1.reqs[0],[cp(()=>paras()[1]),{cmd:'insEq',say:'إدراج ← معادلة (Alt + =)'},{wait:300}]);
D(EQ1.reqs[1],[{say:'كتابة x ثم: معادلة ← نص مرتفع ← مرتفع ← 2',show:'eqScript'},setEq(1,'<i>x</i><sup class="slot">2</sup>')]);
D(EQ1.reqs[2],[{say:'كتابة + ثم: كسر ← كسر مكدّس ← 1 ثم Tab ثم 2',show:'eqFrac'},setEq(1,'<i>x</i><sup class="slot">2</sup>+<span class="fr"><span class="slot">1</span><span class="slot">2</span></span>')]);
D(EQ2.reqs[0],[cp(()=>paras()[1]),{cmd:'insEq',say:'إدراج ← معادلة'},{say:'جذر ← جذر تربيعي ← 16 ثم =4',show:'eqRad'},setEq(1,'<span class="rad"><span class="rs">√</span><span class="rb slot">16</span></span>=4')]);
D(EQ2.reqs[1],[cp(()=>paras()[2]),{cmd:'insEq',say:'إدراج ← معادلة'},{say:'من الرموز: π ثم ≈ ثم 3.14'},setEq(2,'<i>π</i>≈3.14')]);

})();
