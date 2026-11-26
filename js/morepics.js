/* ================= صمّم مثل الصورة — الصور، الأشكال، WordArt، الرأس والتذييل، الرموز والتاريخ والمعادلات، الأعمدة =================
   نفس أسلوب الجداول: صورة واضحة للنتيجة + مهارات + قائمة تحقّق ذكية + «أرني أين». */
const Q=(t,check,where,fix,cmd,x)=>Object.assign(R(t,check,where,fix,cmd),x||{});
const hex6=c=>{if(!c||c[0]!=='#')return c;return c.length===4?'#'+[...c.slice(1)].map(x=>x+x).join(''):c};
const isCol=(c,F)=>{if(!c||c==='none')return false;try{return F(c[0]==='#'?rgb(hex6(c)):c)}catch(e){return false}};
const C_ORG=FAM(x=>x.s>.3&&x.h>=15&&x.h<45);
const C_WHITE=FAM(x=>x.l>.93);
const objs=()=>[...doc.querySelectorAll('.pg-body .obj')];
const picsAll=()=>objs().filter(o=>o.classList.contains('pic'));
const pic0=()=>picsAll()[0]||null;
const imgIdx=o=>o?SAMPLE_IMGS.indexOf(o.dataset.src):-1;
const cmOf=v=>(+v||0)/CM;
const shapes=k=>objs().filter(o=>o.classList.contains('shp')&&!o.classList.contains('wordart')&&!o.classList.contains('textbox')&&(!k||[].concat(k).includes(o.dataset.kind)));
const tbox=()=>objs().find(o=>o.classList.contains('textbox'))||null;
const wart=()=>objs().find(o=>o.classList.contains('wordart'))||null;
const otext=o=>(o?.querySelector('.stxt')?.textContent||'').replace(/ /g,' ').trim();
const bodyText=()=>[...doc.querySelectorAll('.pg-body')].map(b=>b.textContent).join('\n').replace(/ /g,' ');
const paras=()=>[...firstBody().querySelectorAll(':scope > p')];
const paraHas=t=>paras().find(p=>fuzzyHas(p.textContent,t))||null;
const DOCP=(html,caret)=>({html,caret:caret||'.pg-body > p:last-child'});
const PLONG='البحر الميت أخفض بقعة على سطح الأرض، ومياهه شديدة الملوحة حتى إن الإنسان يطفو فوقها دون أن يغرق. يزوره الناس من كل العالم للاستشفاء بطينه ومياهه، ويقع بين فلسطين والأردن.';
const PLONG2='تشتهر أريحا بأنها من أقدم مدن العالم، وفيها قصر هشام وتل السلطان وشجر النخيل والموز. جوّها دافئ في الشتاء، فيقصدها الزوّار من كل المدن الفلسطينية.';
const PIC_IN=(i,w,ex='')=>picHTML(SAMPLE_IMGS[i],w||360,null,ex);
const SHP_IN=(k,w,h,o)=>shapeHTML(k,w,h,o);
const intoP=(sel,html)=>()=>{const p=firstBody().querySelector(sel);if(!p)return;const t=document.createElement('div');t.innerHTML=html;p.innerHTML='';const o=t.firstChild;p.appendChild(o);applyObj(o)};
const objHint=(o,what)=>o?null:`لم أجد ${what} بعد.`;
/* ---------- tips for the new commands (hover = explanation + when to use) ---------- */
const MORE_TIPS={
 pictures:{n:'صور',d:'يُدرج صورة من جهازك أو من الصور الجاهزة.',u:'لتوضيح الكلام بصورة: رحلة، تجربة، مكان.'},
 shapes:{n:'أشكال',d:'اختر شكلًا ثم انقر أو اسحب على الصفحة لترسمه.',u:'للمخططات والأسهم والبطاقات. (Shift أثناء السحب يجعله متناسقًا: دائرة أو مربع)'},
 textbox:{n:'مربع نص',d:'مربع تكتب فيه وتضعه في أي مكان من الصفحة.',u:'لملاحظة جانبية أو اقتباس بارز.'},
 wordart:{n:'WordArt',d:'كتابة فنية ملوّنة بتأثيرات جاهزة.',u:'للعناوين اللافتة في الإعلانات والبطاقات.'},
 objW:{n:'العرض',d:'اكتب عرض الصورة أو الشكل بالسنتيمتر ثم Enter.',u:'لحجم دقيق. (أو بالماوس: اسحب المقبض الدائري في الزاوية)'},
 objH:{n:'الارتفاع',d:'اكتب الارتفاع بالسنتيمتر ثم Enter.'},
 wrap:{n:'التفاف النص',d:'كيف يجري الكلام حول الصورة: مع النص، مربع، خلف النص، أمام النص…',u:'«مربع» ليكون الكلام بجانب الصورة، و«خلف النص» لصورة خلفية.'},
 position:{n:'الموضع',d:'يضع الصورة في مكان جاهز من الصفحة (أعلى يمين، وسط…) والكلام يلتف حولها.'},
 alignObj:{n:'محاذاة',d:'يحاذي الصورة أو الشكل: يمين، وسط، يسار.'},
 rotate:{n:'تدوير',d:'يدوّر الصورة 90° أو يقلبها أفقيًا/رأسيًا.',u:'(أو بالماوس: اسحب السهم الدائري فوق الصورة)'},
 crop:{n:'اقتصاص',d:'يقصّ أطراف الصورة: اسحب المقابض السوداء إلى الداخل ثم انقر خارجها.',u:'لإظهار الجزء المهم فقط.'},
 pstyles:{n:'أنماط الصورة',d:'إطارات وظلال جاهزة للصورة بنقرة واحدة.'},
 picBorder:{n:'حد الصورة',d:'لون الإطار حول الصورة.'},
 picEffects:{n:'تأثيرات الصورة',d:'ظل، انعكاس، توهّج، حواف ناعمة.'},
 picColor:{n:'لون',d:'يعيد تلوين الصورة: رمادي، بنّي، أزرق…',u:'لصورة قديمة الطراز أو للطباعة بالأبيض والأسود.'},
 removeBg:{n:'إزالة الخلفية',d:'يحذف خلفية الصورة ويُبقي الشيء المهم.'},
 artistic:{n:'تأثيرات فنية',d:'تجعل الصورة كأنها مرسومة أو ضبابية.'},
 sstyles:{n:'أنماط الأشكال',d:'ألوان جاهزة للتعبئة والحد معًا.'},
 shapeFill:{n:'تعبئة الشكل',d:'لون داخل الشكل.'},
 shapeOutline:{n:'مخطط الشكل',d:'لون الحد حول الشكل وسُمكه ونوعه. «بلا مخطط» يخفي الحد.'},
 shapeEffects:{n:'تأثيرات الشكل',d:'ظل، توهّج، انعكاس للشكل.'},
 textFill:{n:'تعبئة النص',d:'لون حروف WordArt.'},
 textOutline:{n:'مخطط النص',d:'حد ملوّن حول الحروف.'},
 textEffects:{n:'تأثيرات النص',d:'ظل، توهّج، انعكاس، أو تحويل الكلمة إلى قوس.'},
 forward:{n:'إحضار للأمام',d:'يضع الشكل فوق غيره.'},backward:{n:'إرسال للخلف',d:'يضع الشكل خلف غيره (أو خلف النص).'},
 header:{n:'رأس الصفحة',d:'ما تكتبه هنا يظهر أعلى كل صفحة تلقائيًا.',u:'لاسم المدرسة أو عنوان التقرير.'},
 footer:{n:'تذييل الصفحة',d:'ما تكتبه هنا يظهر أسفل كل صفحة.',u:'لاسمك أو الصف أو التاريخ.'},
 pagenum:{n:'رقم الصفحة',d:'يضيف رقمًا يتغيّر تلقائيًا في كل صفحة.',u:'«أسفل الصفحة ← رقم عادي 2» يضعه في الوسط.'},
 firstDiff:{n:'صفحة أولى مختلفة',d:'الصفحة الأولى بلا رأس وتذييل (أو بغيرها).',u:'لصفحة الغلاف.'},
 closeHF:{n:'إغلاق رأس وتذييل',d:'يرجعك إلى الكتابة في الصفحة. (أو انقر نقرًا مزدوجًا على الصفحة)'},
 datetime:{n:'التاريخ والوقت',d:'يكتب تاريخ اليوم بالشكل الذي تختاره، بالعربية أو الإنجليزية.',u:'للرسائل والتقارير. ألغِ «تحديث تلقائي» ليبقى التاريخ ثابتًا.'},
 symbol:{n:'رمز',d:'رموز غير موجودة على لوحة المفاتيح: ° ÷ × © ☎ ✓…',u:'«رموز إضافية...» يفتح كل الرموز.'},
 equation:{n:'معادلة',d:'يكتب معادلة رياضية بكسور وأسس وجذور. (Alt + =)',u:'لدروس الرياضيات والعلوم.'},
 eqFrac:{n:'كسر',d:'كسر: البسط فوق والمقام تحت. Tab ينقلك بين الخانات.'},
 eqScript:{n:'نص مرتفع',d:'الأس مثل x²: اكتب الأساس ثم الأس في الخانة الصغيرة.'},
 eqRad:{n:'جذر',d:'جذر تربيعي: اكتب الرقم داخل الخانة.'},
 columns:{n:'أعمدة',d:'يقسم الكلام إلى عمودين أو ثلاثة كالجريدة.',u:'«المزيد من الأعمدة...» لخط فاصل بين الأعمدة.'},
 breaks:{n:'فواصل',d:'فاصل صفحة: ابدأ صفحة جديدة. فاصل عمود: ما بعده يبدأ في العمود التالي.'},
};
function applyMoreTips(){Object.assign(TIPS,MORE_TIPS)}

/* ======================= الصور ======================= */
const IM1=PIC({t:'إدراج صورة',goalImg:'img/m-pic1.png',skills:['إدراج ← صور','اختيار الصورة المناسبة'],
 intro:'أدرج صورة البحر تحت العنوان مباشرة، في السطر الفارغ.',
 setup:DOCP(`<p class="wtitle">رحلتي إلى البحر</p><p><br></p><p>${PLONG}</p>`,'.pg-body > p:nth-of-type(2)'),
 reqs:[Q('صورة البحر (الغروب)',()=>picsAll().some(o=>imgIdx(o)===2),()=>pic0()||firstBody().children[1],'إدراج ← صور ← اختر صورة الغروب على البحر','pictures',{mi:['insPic','2','صورة البحر']}),
  Q('الصورة تحت العنوان وفوق الفقرة',()=>{const o=picsAll().find(x=>imgIdx(x)===2);if(!o)return false;const ps=paras();const t=ps.findIndex(p=>p.classList.contains('wtitle')),k=ps.findIndex(p=>p.contains(o)),f=ps.findIndex(p=>fuzzyHas(p.textContent,'البحر الميت'));return t>=0&&k>t&&k<f},()=>pic0()||firstBody().children[1],'انقر في السطر الفارغ تحت العنوان أولًا، ثم أدرج الصورة'),
  Q('صورة واحدة فقط',()=>picsAll().length===1,()=>picsAll()[1]||pic0(),'احذف الصورة الزائدة: انقر عليها ثم «🗑 حذف» (أو زر Delete)')]});
IM1.reqs[0].fixFn=()=>{const o=pic0();return o&&imgIdx(o)!==2?'هذه صورة أخرى. احذفها (انقر عليها ثم «🗑 حذف») وأدرج صورة البحر.':null};

const IM2=PIC({t:'حجم الصورة ومكانها',goalImg:'img/m-pic2.png',skills:['تحديد الصورة','العرض بالسنتيمتر','توسيط الصورة'],
 intro:'صغّر الصورة حتى يصير عرضها 6 سم تقريبًا، ثم ضعها في وسط السطر. (بالماوس: اسحب المقبض الدائري في الزاوية)',
 setup:DOCP(`<p class="wtitle">جبال فلسطين</p><p>${PIC_IN(0,420)}</p><p>${PLONG2}</p>`),
 reqs:[Q('عرض الصورة 6 سم تقريبًا',()=>{const o=pic0();return !!o&&Math.abs(cmOf(o.dataset.w)-6)<=.6},pic0,'انقر على الصورة ← تنسيق الصورة ← العرض: اكتب 6 ثم Enter','objW',{tab:'pformat'}),
  Q('الصورة غير مشوّهة',()=>{const o=pic0();return !!o&&!o.dataset.distorted},pic0,'لا تسحب المقابض الجانبية — استخدم مقبض الزاوية أو مربع «العرض»'),
  Q('الصورة في الوسط',()=>{const o=pic0();if(!o)return false;if(o.dataset.align==='center')return true;const p=o.closest('p');return !!p&&getComputedStyle(p).textAlign==='center'&&o.dataset.wrap==='inline'},pic0,'انقر على الصورة ← الصفحة الرئيسية ← توسيط (Ctrl + E)','alignC')]});
IM2.reqs[0].fixFn=()=>{const o=pic0();if(!o)return null;const w=cmOf(o.dataset.w);return Math.abs(w-6)>.6?`عرضها الآن ${w.toFixed(1)} سم — المطلوب 6 سم.`:null};

const IM3=PIC({t:'التفاف النص حول الصورة',goalImg:'img/m-pic3.png',skills:['التفاف النص: مربع','موضع الصورة'],
 intro:'اجعل الكلام يجري بجانب الشجرة، والشجرة على يسار الصفحة كما في الصورة.',
 setup:DOCP(`<p class="wtitle">شجرة الزيتون</p><p>${PIC_IN(1,190)}${PLONG2} ${PLONG}</p><p>${PLONG2}</p>`),
 reqs:[Q('الكلام يلتف حول الصورة (مربع)',()=>['square','tight','through'].includes(pic0()?.dataset.wrap),pic0,'انقر على الصورة ← تنسيق الصورة ← التفاف النص ← مربع','wrap',{tab:'pformat',mi:['wrap','square','مربع']}),
  N(Q('الصورة على اليسار',()=>{const o=pic0();return !!o&&['square','tight','through'].includes(o.dataset.wrap)&&o.dataset.side==='left'},pic0,'تنسيق الصورة ← محاذاة ← محاذاة لليسار (أو اسحبها إلى اليسار)','alignObj',{tab:'pformat',mi:['alignObj','left','محاذاة لليسار']}),0)]});

const IM4=PIC({t:'أنماط الصورة وحدودها',goalImg:'img/m-pic4.png',skills:['أنماط الصورة','حد الصورة'],
 intro:'أعطِ الوردة نمط «مستطيل مستدير مظلل»، ثم حدًّا أخضر.',
 setup:DOCP(`<p class="wtitle">زهرة الربيع</p><p style="text-align:center">${PIC_IN(3,260)}</p><p><br></p>`),
 reqs:[Q('نمط «مستطيل مستدير مظلل»',()=>pic0()?.dataset.ps==='rounded',pic0,'انقر على الصورة ← تنسيق الصورة ← أنماط الصورة ← الرابع (مستطيل مستدير مظلل)','pstyles',{tab:'pformat',gal:['[data-arg="rounded"]','اختر «مستطيل مستدير مظلل»']}),
  Q('حدّ أخضر',()=>isCol(pic0()?.dataset.border,C_GRN),pic0,'تنسيق الصورة ← حد الصورة ← أخضر','picBorder',{tab:'pformat'})]});
IM4.reqs[0].fixFn=()=>{const p=pic0()?.dataset.ps;const n=PSTYLES.find(x=>x.id===p);return p&&p!=='none'&&p!=='rounded'?`اخترتَ «${n?.name}» — المطلوب «مستطيل مستدير مظلل».`:null};

const IM5=PIC({t:'التدوير والقلب',goalImg:'img/m-pic5.png',skills:['ترتيب ← تدوير','قلب أفقي'],
 intro:'اقلب الصورة أفقيًّا (مثل المرآة) فتصير الشمس على اليسار. (مجموعة «ترتيب» ← تدوير)',
 setup:DOCP(`<p class="wtitle">صورة في المرآة</p><p style="text-align:center">${PIC_IN(0,320)}</p><p><br></p>`),
 reqs:[Q('مقلوبة أفقيًّا (الشمس على اليسار)',()=>{const d=pic0()?.dataset;return !!d&&!!d.flipH&&!d.flipV&&(+d.rot||0)%360===0},pic0,'انقر على الصورة ← تنسيق الصورة ← تدوير ← قلب أفقي','rotate',{tab:'pformat',mi:['rotate','flipH','قلب أفقي']})]});
IM5.reqs[0].fixFn=()=>{const d=pic0()?.dataset;if(!d)return null;if(+d.rot)return 'هذا تدوير وليس قلبًا. اختر «تدوير» ← «إعادة التعيين» ثم «قلب أفقي».';if(d.flipV)return 'هذا قلب رأسي (رأسًا على عقب). المطلوب «قلب أفقي».';return null};
const IM7=PIC({t:'تأثيرات الصورة',goalImg:'img/m-pic7.png',skills:['أنماط الصورة ← تأثيرات الصورة','انعكاس'],
 intro:'أعطِ الصورة تأثير «انعكاس» كأنها فوق الماء.',
 setup:DOCP(`<p class="wtitle">صورة على الماء</p><p style="text-align:center">${PIC_IN(2,300)}</p><p><br></p><p><br></p>`),
 reqs:[Q('تأثير «انعكاس»',()=>pic0()?.dataset.fx==='reflection',pic0,'انقر على الصورة ← تنسيق الصورة ← تأثيرات الصورة ← انعكاس','picEffects',{tab:'pformat',mi:['picEffects','reflection','انعكاس']})]});
IM7.reqs[0].fixFn=()=>{const f=pic0()?.dataset.fx;return f&&f!=='none'&&f!=='reflection'?'هذا تأثير آخر — اختر «انعكاس».':null};
const zOf=o=>!o?0:o.dataset.wrap==='behind'?-100:(+o.dataset.z||0);
const IM8=PIC({t:'إحضار للأمام وإرسال للخلف',goalImg:'img/m-pic8.png',skills:['ترتيب ← إحضار للأمام','إرسال للخلف'],
 intro:'الوردة مختفية خلف صورة الجبال. أحضرها للأمام حتى تظهر فوق الجبال كما في الصورة.',
 setup:{html:`<p class="wtitle">من في الأمام؟</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>`,after:()=>{const b=firstBody();const t=document.createElement('div');t.innerHTML=picHTML(SAMPLE_IMGS[0],340,null,'')+picHTML(SAMPLE_IMGS[3],180,null,'');const [m,f]=[...t.children];[[m,40,60,1],[f,250,110,0]].forEach(([o,x,y,z])=>{o.dataset.wrap='front';o.dataset.z=z;placeFloat(o,b,x,y);applyObj(o)})}},
 reqs:[Q('الوردة فوق الجبال',()=>{const ps=picsAll();const f=ps.find(o=>imgIdx(o)===3),m=ps.find(o=>imgIdx(o)===0);return !!f&&!!m&&zOf(f)>zOf(m)},()=>picsAll().find(o=>imgIdx(o)===3),'انقر على الوردة ← تنسيق الصورة ← إحضار للأمام (أو انقر على الجبال ← إرسال للخلف)','forward',{tab:'pformat'}),
  N(Q('الصورتان في مكانهما',()=>picsAll().length===2,()=>pic0(),'لا تحذف أيًّا من الصورتين'),0)]});
const IM6=PIC({t:'اقتصاص الصورة',goalImg:'img/m-pic6.png',skills:['اقتصاص','المقابض السوداء'],
 intro:'أظهِر الوردة فقط: قصّ الأطراف الفارغة من اليمين واليسار والأعلى. (اقتصاص ← اسحب المقابض السوداء إلى الداخل ← انقر خارج الصورة)',
 setup:DOCP(`<p class="wtitle">الوردة فقط</p><p style="text-align:center">${PIC_IN(3,360)}</p><p><br></p>`),
 reqs:[Q('قُصّت الأطراف (أصغر من الأصل بوضوح)',()=>{const d=pic0()?.dataset;return !!d&&+d.w<=+d.iw*.8},pic0,'انقر على الصورة ← تنسيق الصورة ← اقتصاص ← اسحب المقبض الأسود في الجانب إلى الداخل','crop',{tab:'pformat'}),
  Q('الوردة ما زالت ظاهرة كاملة',()=>{const d=pic0()?.dataset;if(!d)return false;const iw=+d.iw,ih=+d.ih,x0=-(+d.ix||0),y0=-(+d.iy||0),w=+d.w,h=+d.h;const fx=[.36,.64],fy=[.2,.72];return x0<=iw*fx[0]&&x0+w>=iw*fx[1]&&y0<=ih*fy[0]&&y0+h>=ih*fy[1]},pic0,'قصصتَ من الوردة نفسها — تراجع (Ctrl+Z) وقصّ الأطراف الفارغة فقط','crop',{tab:'pformat'})]});

/* ======================= الأشكال ======================= */
const SH1=PIC({t:'رسم الأشكال',goalImg:'img/m-shp1.png',skills:['إدراج ← أشكال','الرسم بالسحب (أو النقر)'],
 intro:'ارسم ثلاثة أشكال: مستطيلًا ودائرة ومثلثًا. اختر الشكل ثم اسحب على الصفحة (أو انقر عليها).',
 setup:DOCP(`<p class="wtitle">أشكالي الأولى</p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>`),
 reqs:[Q('مستطيل',()=>shapes(['rect','roundRect']).length>=1,()=>shapes('rect')[0]||firstBody(),'إدراج ← أشكال ← مستطيل ← اسحب على الصفحة','shapes',{mi:['insShape','rect','مستطيل']}),
  Q('دائرة',()=>shapes('oval').length>=1,()=>shapes('oval')[0]||firstBody(),'إدراج ← أشكال ← شكل بيضاوي (مع Shift تصير دائرة تامة)','shapes',{mi:['insShape','oval','شكل بيضاوي']}),
  Q('مثلث',()=>shapes('tri').length>=1,()=>shapes('tri')[0]||firstBody(),'إدراج ← أشكال ← مثلث','shapes',{mi:['insShape','tri','مثلث']})]});

const SH2=PIC({t:'تعبئة الشكل وحدوده',goalImg:'img/m-shp2.png',skills:['تعبئة الشكل','مخطط الشكل: اللون والسُّمك'],
 intro:'لوّن النجمة بالأصفر، واجعل حدّها أحمر سميكًا (3 نقاط).',
 setup:{...DOCP(`<p class="wtitle">نجمة الأسبوع</p><p style="text-align:center" id="op"><br></p><p><br></p>`),after:intoP('#op',SHP_IN('star',170,160,{wrap:'inline'}))},
 reqs:[Q('النجمة صفراء',()=>isCol(shapes('star')[0]?.dataset.fill,C_YEL)||isCol(shapes('star')[0]?.dataset.fill,C_GOLD),()=>shapes('star')[0],'انقر على النجمة ← تنسيق الشكل ← تعبئة الشكل ← أصفر','shapeFill',{tab:'sformat'}),
  Q('الحد أحمر',()=>isCol(shapes('star')[0]?.dataset.line,C_RED),()=>shapes('star')[0],'تنسيق الشكل ← مخطط الشكل ← أحمر','shapeOutline',{tab:'sformat'}),
  N(Q('الحد سميك (3 نقاط أو أكثر)',()=>(+shapes('star')[0]?.dataset.lw||0)>=3,()=>shapes('star')[0],'مخطط الشكل ← السُّمك ← 3 نقاط','shapeOutline',{tab:'sformat',sub:['ow','السُّمك'],mi:['outlineW','3','3 نقطة']}),1)]});

const SH3=PIC({t:'كتابة داخل الشكل',goalImg:'img/m-shp3.png',skills:['أنماط الأشكال','إضافة نص داخل الشكل'],
 intro:'اجعل المستطيل أخضر من «أنماط الأشكال»، واكتب داخله «اضغط هنا». (زر الفأرة الأيمن على الشكل ← إضافة نص — أو انقر عليه نقرًا مزدوجًا)',
 setup:{...DOCP(`<p class="wtitle">زر البداية</p><p style="text-align:center" id="op"><br></p><p><br></p>`),after:intoP('#op',SHP_IN('roundRect',230,90,{wrap:'inline'}))},
 reqs:[Q('المستطيل أخضر',()=>isCol(shapes(['roundRect','rect'])[0]?.dataset.fill,C_GRN),()=>shapes(['roundRect','rect'])[0],'انقر على الشكل ← تنسيق الشكل ← أنماط الأشكال ← الأخضر','sstyles',{tab:'sformat',gal:['[data-cmd="sstyle"][data-arg="4"]','اختر النمط الأخضر']}),
  Q('مكتوب داخله «اضغط هنا»',()=>fuzzyHas(otext(shapes(['roundRect','rect'])[0]),'اضغط هنا'),()=>shapes(['roundRect','rect'])[0],'زر الفأرة الأيمن على الشكل ← إضافة نص ← اكتب «اضغط هنا»')]});

const SH4=PIC({t:'الأسهم والتدوير',goalImg:'img/m-shp4.png',skills:['تدوير الشكل 90°','تعبئة الشكل'],
 intro:'السهم يشير إلى اليمين. دوّره ليشير إلى الأسفل، ولوّنه بالبرتقالي.',
 setup:{...DOCP(`<p class="wtitle">إلى الأسفل!</p><p style="text-align:center" id="op"><br></p><p><br></p>`),after:intoP('#op',SHP_IN('arrowR',180,90,{wrap:'inline'}))},
 reqs:[Q('السهم يشير إلى الأسفل',()=>{const o=shapes(['arrowR','arrowL','arrowD','arrowU'])[0];if(!o)return false;const r=(((+o.dataset.rot||0)%360)+360)%360,k=o.dataset.kind,fh=!!o.dataset.flipH,fv=!!o.dataset.flipV;
   const dir={arrowR:0,arrowD:90,arrowL:180,arrowU:270}[k];let a=dir;if(fh)a=(540-a)%360;if(fv)a=(360-a)%360;a=(a+r)%360;return Math.abs(a-90)<=15},()=>shapes(['arrowR','arrowL','arrowD','arrowU'])[0],'انقر على السهم ← تنسيق الشكل ← تدوير ← تدوير لليمين 90°','rotate',{tab:'sformat',mi:['rotate','90','تدوير لليمين 90°']}),
  Q('السهم برتقالي',()=>isCol(shapes(['arrowR','arrowL','arrowD','arrowU'])[0]?.dataset.fill,C_ORG),()=>shapes(['arrowR','arrowL','arrowD','arrowU'])[0],'تنسيق الشكل ← تعبئة الشكل ← برتقالي','shapeFill',{tab:'sformat'})]});

const SH5=PIC({t:'مربع نص',goalImg:'img/m-shp5.png',skills:['إدراج ← مربع نص','بلا مخطط','تعبئة'],
 intro:'أضف مربع نص فيه «ملاحظة: الامتحان يوم الأحد»، بلا حدود، وخلفيته صفراء.',
 setup:DOCP(`<p class="wtitle">لوحة الإعلانات</p><p>${PLONG2}</p><p><br></p>`),
 reqs:[Q('مربع نص فيه الملاحظة',()=>fuzzyHas(otext(tbox()),'الامتحان يوم الأحد'),()=>tbox()||firstBody(),'إدراج ← مربع نص ← مربع نص بسيط ← امسح الكتابة واكتب الملاحظة','textbox',{mi:['insTextbox','simple','مربع نص بسيط']}),
  Q('بلا حدود',()=>tbox()?.dataset.line==='none',tbox,'انقر على حدّ المربع ← تنسيق الشكل ← مخطط الشكل ← بلا مخطط','shapeOutline',{tab:'sformat',mi:['shapeOutline','none','بلا مخطط']}),
  Q('الخلفية صفراء',()=>isCol(tbox()?.dataset.fill,C_YEL),tbox,'تنسيق الشكل ← تعبئة الشكل ← أصفر','shapeFill',{tab:'sformat'})]});
SH5.reqs[0].fixFn=()=>{const t=otext(tbox());return t&&/\[/.test(t)?'امسح الكتابة الرمادية داخل المربع واكتب الملاحظة.':null};

const SH6=PIC({t:'شكل خلف النص',goalImg:'img/m-shp6.png',skills:['التفاف النص: خلف النص','ترتيب الكائنات'],
 intro:'الشكل الأزرق يغطّي الكلام! اجعله خلف النص، وفاتح اللون حتى يُقرأ الكلام.',
 setup:{html:`<p class="wtitle">تحت السحابة</p><p>${PLONG}</p><p>${PLONG2}</p>${SHP_IN('cloud',300,170,{x:150,y:40})}`,caret:'.pg-body > p:last-child'},
 reqs:[Q('الشكل خلف النص',()=>shapes('cloud')[0]?.dataset.wrap==='behind',()=>shapes('cloud')[0],'انقر على حدّ الشكل ← تنسيق الشكل ← التفاف النص ← خلف النص (أو «إرسال للخلف»)','wrap',{tab:'sformat',mi:['wrap','behind','خلف النص']}),
  Q('لونه فاتح',()=>{const f=shapes('cloud')[0]?.dataset.fill;const x=f&&f!=='none'&&hsl(rgb(hex6(f)));return f==='none'||(!!x&&x.l>=.7)},()=>shapes('cloud')[0],'تنسيق الشكل ← تعبئة الشكل ← لون فاتح (من الصف العلوي)','shapeFill',{tab:'sformat'})]});

/* ======================= التفاف النص والموضع (الأشكال) ======================= */
const sid=k=>doc.querySelector(`.pg-body .obj.shp[data-sid="${k}"]`);
const putShp=(sel,k,w,h,o,id,mode)=>{const p=firstBody().querySelector(sel);if(!p)return;const t=document.createElement('div');t.innerHTML=SHP_IN(k,w,h,o);const x=t.firstChild;x.dataset.sid=id;if(o.side)x.dataset.side=o.side;
  if(mode==='float'){placeFloat(x,firstBody(),o.x||0,o.y||0)}else{if(mode==='only')p.innerHTML='';p.prepend(x)}applyObj(x)};
const SQ=['square','tight','through'];
const SW1=PIC({t:'مربع أم ضيق؟',goalImg:'img/m-sw1.png',skills:['التفاف النص: مربع','التفاف النص: ضيق','خلال'],
 intro:'الشكلان الآن «مع النص» — كل واحد مثل حرف كبير داخل السطر.\n• «مربع»: الكلام يقف عند مربع وهمي حول الشكل (حافة مستقيمة).\n• «ضيق»: الكلام يلتصق بحدود الشكل نفسه ويدخل في زواياه.\n• «خلال»: مثل «ضيق»، ويدخل الكلام أيضًا في الفراغات المفتوحة داخل الشكل.\nاجعل الدائرة «مربع» والنجمة «ضيق» كما في الصورة، ولاحظ الفرق.',
 setup:{html:`<p class="wtitle">الشمس والنجوم</p><p id="pa">${PLONG} ${PLONG2}</p><p id="pb" style="text-align:left">${PLONG2} ${PLONG}</p><p>${PLONG2}</p>`,
  after:()=>{putShp('#pa','oval',150,150,{wrap:'inline',fill:'#ffc000',line:'#bf9000'},'sun');putShp('#pb','star',170,170,{wrap:'inline',fill:'#ffd966',line:'#bf9000'},'star')}},
 reqs:[Q('الدائرة: مربع',()=>sid('sun')?.dataset.wrap==='square',()=>sid('sun'),'انقر على الدائرة ← تنسيق الشكل ← التفاف النص ← مربع','wrap',{tab:'sformat',mi:['wrap','square','مربع']}),
  Q('النجمة: ضيق',()=>['tight','through'].includes(sid('star')?.dataset.wrap),()=>sid('star'),'انقر على النجمة ← تنسيق الشكل ← التفاف النص ← ضيق','wrap',{tab:'sformat',mi:['wrap','tight','ضيق']})]});
SW1.reqs[0].fixFn=()=>{const w=sid('sun')?.dataset.wrap;return ['tight','through'].includes(w)?'هذا «ضيق»: الكلام يلتصق بالدائرة. المطلوب حافة مستقيمة: «مربع».':w&&!SQ.includes(w)&&w!=='inline'?'المطلوب أن يكون الكلام بجانب الدائرة: «مربع».':null};
SW1.reqs[1].fixFn=()=>sid('star')?.dataset.wrap==='square'?'هذا «مربع»: انظر كيف يقف الكلام بعيدًا عن رؤوس النجمة. المطلوب أن يدخل بين رؤوسها: «ضيق».':null;
const SW2=PIC({t:'أعلى وأسفل، أمام النص، مع النص',goalImg:'img/m-sw2.png',skills:['أعلى وأسفل','أمام النص','مع النص'],
 intro:'• «أعلى وأسفل»: الشكل وحده في سطوره، لا كلام بجانبه.\n• «أمام النص»: الشكل يطفو فوق الكلام ويغطيه، ويمكن وضعه في أي مكان.\n• «مع النص»: الشكل يصبح جزءًا من السطر مثل حرف، ويتحرك مع الكتابة.\nطبّق على كل شكل الالتفاف المطلوب كما في الصورة.',
 setup:{html:`<p class="wtitle">لوحة الصف</p><p id="pa">${PLONG} ${PLONG2}</p><p id="pb" style="text-align:left">${PLONG2} ${PLONG}</p><p id="pc">${PLONG2}</p>`,
  after:()=>{putShp('#pa','ribbon',260,90,{wrap:'square',side:'right',fill:'#70ad47',line:'#507e32'},'rib');putShp('#pb','smiley',120,120,{wrap:'square',side:'left',fill:'#ffc000',line:'#bf9000'},'sm');
   const pc=firstBody().querySelector('#pc');putShp('#pc','heart',70,64,{wrap:'front',fill:'#e83e8c',line:'#a52a64',x:20,y:Math.round(pc.offsetTop-10)},'ht','float')}},
 reqs:[Q('الشريط: أعلى وأسفل',()=>sid('rib')?.dataset.wrap==='topbottom',()=>sid('rib'),'انقر على الشريط الأخضر ← تنسيق الشكل ← التفاف النص ← أعلى وأسفل','wrap',{tab:'sformat',mi:['wrap','topbottom','أعلى وأسفل']}),
  Q('الوجه الضاحك: أمام النص',()=>sid('sm')?.dataset.wrap==='front',()=>sid('sm'),'انقر على الوجه الضاحك ← التفاف النص ← أمام النص','wrap',{tab:'sformat',mi:['wrap','front','أمام النص']}),
  Q('القلب: مع النص',()=>sid('ht')?.dataset.wrap==='inline',()=>sid('ht'),'انقر على القلب ← التفاف النص ← مع النص','wrap',{tab:'sformat',mi:['wrap','inline','مع النص']})]});
SW2.reqs[0].fixFn=()=>SQ.includes(sid('rib')?.dataset.wrap)?'ما زال الكلام بجانب الشريط. المطلوب لا كلام بجانبه: «أعلى وأسفل».':null;
SW2.reqs[1].fixFn=()=>sid('sm')?.dataset.wrap==='behind'?'هذا «خلف النص»: الكلام فوق الوجه. المطلوب أن يغطي الوجهُ الكلام: «أمام النص».':null;
const SW3=PIC({t:'الموضع',goalImg:'img/m-sw3.png',skills:['الموضع','التفاف النص: مربع'],
 intro:'زر «الموضع» يضع الشكل بضغطة واحدة في مكان جاهز من الصفحة (9 أماكن: أعلى/منتصف/أسفل × يمين/وسط/يسار) ويجعل الالتفاف «مربع» تلقائيًا.\nضع الشمس في الأعلى إلى اليسار، والقمر في الأسفل إلى اليمين.',
 setup:{html:`<p class="wtitle">الليل والنهار</p><p id="pa">${PLONG} ${PLONG2}</p><p>${PLONG2} ${PLONG}</p><p id="pc">${PLONG} ${PLONG2}</p>`,
  after:()=>{putShp('#pa','oval',120,120,{wrap:'inline',fill:'#ffc000',line:'#bf9000'},'sun');putShp('#pc','moon',90,120,{wrap:'inline',fill:'#8faadc',line:'#2f528f'},'moon')}},
 reqs:[Q('الشمس: في الأعلى إلى اليسار',()=>{const o=sid('sun');return !!o&&o.dataset.pos==='tl'&&SQ.includes(o.dataset.wrap)},()=>sid('sun'),'انقر على الشمس ← تنسيق الشكل ← الموضع ← المربع العلوي الأيسر','position',{tab:'sformat',mi:['position','tl','في الأعلى إلى اليسار']}),
  Q('القمر: في الأسفل إلى اليمين',()=>{const o=sid('moon');return !!o&&o.dataset.pos==='br'&&SQ.includes(o.dataset.wrap)},()=>sid('moon'),'انقر على القمر ← تنسيق الشكل ← الموضع ← المربع السفلي الأيمن','position',{tab:'sformat',mi:['position','br','في الأسفل إلى اليمين']})]});
const posFix=(k,want)=>()=>{const p=sid(k)?.dataset.pos;if(!p||p===want)return null;return 'اخترت «'+POSN(p).replace(' مع التفاف نص مربع','')+'». المطلوب «'+POSN(want).replace(' مع التفاف نص مربع','')+'» — مرّر الماوس على المربعات لترى اسم كل موضع.'};
SW3.reqs[0].fixFn=posFix('sun','tl');SW3.reqs[1].fixFn=posFix('moon','br');

/* ======================= WordArt ======================= */
const WA1=PIC({t:'إدراج WordArt',goalImg:'img/m-wa1.png',skills:['إدراج ← WordArt','الكتابة داخل WordArt'],
 intro:'في السطر الأول الفارغ أضف WordArt أزرق، واكتب فيه «يوم العلوم».',
 setup:{html:`<p><br></p><p>${PLONG2}</p>`,caret:'.pg-body > p',caretStart:true},
 reqs:[Q('WordArt مكتوب فيه «يوم العلوم»',()=>fuzzyHas(otext(wart()),'يوم العلوم'),()=>wart()||firstBody().firstElementChild,'إدراج ← WordArt ← اختر النمط ← اكتب «يوم العلوم»','wordart',{mi:['insWordArt','1','الأزرق (الثاني)']}),
  Q('الحروف زرقاء',()=>isCol(wart()?.dataset.tfill,C_BLUE),wart,'اختر النمط الأزرق، أو: تنسيق الشكل ← تعبئة النص ← أزرق','textFill',{tab:'sformat'}),
  Q('في أعلى الصفحة',()=>{const o=wart();if(!o)return false;const b=firstBody();const first=[...b.children].find(c=>c.textContent.trim()||c.querySelector('.obj'));return !!first&&first.contains(o)},wart,'ضع المؤشر في السطر الأول الفارغ قبل إدراج WordArt')]});
WA1.reqs[0].fixFn=()=>otext(wart())==='النص هنا'?'امسح «النص هنا» واكتب «يوم العلوم».':null;

const WA2=PIC({t:'تلوين WordArt',goalImg:'img/m-wa2.png',skills:['تعبئة النص','مخطط النص','تأثيرات النص: توهّج'],
 intro:'اجعل حروف «مهرجان الربيع» خضراء، بلا مخطط، مع توهّج.',
 setup:{html:`<p style="text-align:center" id="op"><br></p><p>${PLONG2}</p>`,after:intoP('#op',SHP_IN('wordart',300,70,{text:'مهرجان الربيع',tfill:'#000000',tout:'#ffffff',tfx:'shadow',wrap:'inline'}))},
 reqs:[Q('الحروف خضراء',()=>isCol(wart()?.dataset.tfill,C_GRN),wart,'انقر على WordArt ← تنسيق الشكل ← تعبئة النص ← أخضر','textFill',{tab:'sformat'}),
  Q('بلا مخطط حول الحروف',()=>{const t=wart()?.dataset.tout;return !t||t==='none'},wart,'تنسيق الشكل ← مخطط النص ← بلا مخطط','textOutline',{tab:'sformat',mi:['textOutline','none','بلا مخطط']}),
  Q('توهّج',()=>wart()?.dataset.tfx==='glow',wart,'تنسيق الشكل ← تأثيرات النص ← توهّج','textEffects',{tab:'sformat',mi:['textEffects','glow','توهّج']})]});

const WA3=PIC({t:'تحويل WordArt إلى قوس',goalImg:'img/m-wa3.png',skills:['تأثيرات النص: تحويل','تعبئة النص'],
 intro:'اجعل «أهلًا بكم» على شكل قوس، وحروفها بنفسجية.',
 setup:{html:`<p style="text-align:center" id="op"><br></p><p>${PLONG}</p>`,after:intoP('#op',SHP_IN('wordart',300,70,{text:'أهلًا بكم',tfill:'#4472c4',tfx:'shadow',wrap:'inline'}))},
 reqs:[Q('على شكل قوس',()=>wart()?.dataset.tfx==='arch',wart,'انقر على WordArt ← تنسيق الشكل ← تأثيرات النص ← تحويل: قوس','textEffects',{tab:'sformat',mi:['textEffects','arch','تحويل: قوس']}),
  Q('الحروف بنفسجية',()=>isCol(wart()?.dataset.tfill,C_PUR),wart,'تنسيق الشكل ← تعبئة النص ← بنفسجي','textFill',{tab:'sformat'})]});

/* ======================= الرأس والتذييل والترقيم ======================= */
const P3=['<p class="wtitle">تقرير العلوم</p><p>'+PLONG+'</p>','<p>'+PLONG2+'</p><p>'+PLONG+'</p>','<p>'+PLONG+'</p><p>'+PLONG2+'</p>'];
const hfSpans=k=>{const d=document.createElement('div');d.innerHTML=S.hf[k]||'';return [...d.querySelectorAll('p > span:not(.pnum)')].map(s=>s.classList.contains('ph')?'':s.textContent.trim())};
const HF1=PIC({t:'رأس الصفحة',goalImg:'img/m-hf1.png',skills:['إدراج ← رأس الصفحة','الكتابة في الرأس','إغلاق رأس وتذييل'],
 intro:'اكتب «مدرسة الأمل» في رأس الصفحة، فيظهر أعلى كل الصفحات تلقائيًا.',
 setup:{pages:P3.slice(0,2),print:1},
 reqs:[Q('«مدرسة الأمل» في الرأس',()=>fuzzyHas(hfText('hdr'),'مدرسة الأمل'),()=>pages()[0]?.querySelector('.pg-hdr'),'إدراج ← رأس الصفحة ← فارغ ← اكتب «مدرسة الأمل»','header',{mi:['header','0','فارغ']}),
  Q('رجعتَ إلى الكتابة في الصفحة',()=>fuzzyHas(hfText('hdr'),'مدرسة الأمل')&&!S.hfMode,()=>$('#ribbon [data-hid="closeHF"]')||firstBody(),'رأس وتذييل ← إغلاق رأس وتذييل (أو انقر نقرًا مزدوجًا على الصفحة)','closeHF',{tab:'hfdesign'})]});

const HF2=PIC({t:'تذييل من ثلاثة أجزاء',goalImg:'img/m-hf2.png',skills:['تذييل الصفحة','النمط «فارغ (ثلاثة أعمدة)»'],
 intro:'أضف تذييلًا من ثلاثة أجزاء: يمين «الصف السابع»، وسط «تقرير العلوم»، يسار «2026».',
 setup:{pages:P3.slice(0,2),print:1},
 reqs:[Q('تذييل بثلاثة أجزاء',()=>hfSpans('ftr').length===3,()=>pages()[0]?.querySelector('.pg-ftr'),'إدراج ← تذييل الصفحة ← فارغ (ثلاثة أعمدة)','footer',{mi:['footer','1','فارغ (ثلاثة أعمدة)']}),
  N(Q('يمين: «الصف السابع»',()=>txtEq(hfSpans('ftr')[0]||'','الصف السابع'),()=>pages()[0]?.querySelector('.pg-ftr .ph, .pg-ftr span'),'انقر على [اكتب هنا] الأيمن واكتب'),0),
  N(Q('الوسط: «تقرير العلوم»',()=>txtEq(hfSpans('ftr')[1]||'','تقرير العلوم'),()=>pages()[0]?.querySelectorAll('.pg-ftr span')[1],'انقر على [اكتب هنا] في الوسط واكتب'),0),
  N(Q('يسار: «2026»',()=>txtEq(hfSpans('ftr')[2]||'','2026'),()=>pages()[0]?.querySelectorAll('.pg-ftr span')[2],'انقر على [اكتب هنا] الأيسر واكتب 2026'),0)]});

const HF3=PIC({t:'ترقيم الصفحات',goalImg:'img/m-hf3.png',skills:['إدراج ← رقم الصفحة','أسفل الصفحة: الوسط'],
 intro:'أضف رقم الصفحة أسفل كل صفحة في الوسط. لا تكتب الرقم بنفسك — Word يكتبه ويغيّره تلقائيًا.',
 setup:{pages:P3,print:1},
 reqs:[Q('رقم أسفل الصفحة في الوسط',()=>/pnum/.test(S.hf.ftr)&&/text-align:\s*center/.test(S.hf.ftr),()=>pages()[0]?.querySelector('.pg-ftr'),'إدراج ← رقم الصفحة ← أسفل الصفحة ← رقم عادي 2 (الوسط)','pagenum',{sub:['pnBot','أسفل الصفحة'],mi:['pagenumIns','bottom-center','رقم عادي 2']}),
  Q('لا أرقام في أعلى الصفحة',()=>!/pnum/.test(S.hf.hdr),()=>pages()[0]?.querySelector('.pg-hdr'),'رقم الصفحة ← إزالة أرقام الصفحات، ثم أضفه أسفل الصفحة','pagenum',{mi:['pnRemove','null','إزالة أرقام الصفحات']})]});
HF3.reqs[0].fixFn=()=>{if(/pnum/.test(S.hf.ftr)&&!/center/.test(S.hf.ftr))return 'الرقم ليس في الوسط: اختر «رقم عادي 2».';if(/pnum/.test(S.hf.hdr))return 'وضعتَه أعلى الصفحة — المطلوب أسفلها.';if(/\d/.test(hfText('ftr')))return 'لا تكتب الرقم بيدك: استخدم «رقم الصفحة».';return null};

const HF4=PIC({t:'تنسيق أرقام الصفحات',goalImg:'img/m-hf4.png',skills:['تنسيق أرقام الصفحات','أ، ب، ج'],
 intro:'الصفحات مرقّمة 1، 2، 3. اجعل الترقيم بالحروف: أ، ب، ج.',
 setup:{pages:P3,print:1,hf:{ftr:'<p class="pnp" style="text-align:center"><span class="pnum" contenteditable="false">#</span></p>'}},
 reqs:[Q('الأرقام: أ، ب، ج',()=>S.hf.pnFmt==='abjad'&&/pnum/.test(S.hf.ftr),()=>pages()[0]?.querySelector('.pg-ftr'),'إدراج ← رقم الصفحة ← تنسيق أرقام الصفحات... ← أ، ب، ج ← موافق','pagenum',{mi:['pnFormat','null','تنسيق أرقام الصفحات...']}),
  Q('تبدأ من «أ»',()=>+S.hf.pnStart===1,()=>pages()[0]?.querySelector('.pg-ftr'),'في نافذة التنسيق اختر «متابعة من المقطع السابق»','pagenum',{mi:['pnFormat','null','تنسيق أرقام الصفحات...']})]});

const HF5=PIC({t:'صفحة أولى مختلفة',goalImg:'img/m-hf5.png',skills:['صفحة أولى مختلفة','الغلاف بلا رأس'],
 intro:'الصفحة الأولى غلاف — يجب ألّا يظهر عليها الرأس. باقي الصفحات يبقى رأسها كما هو.',
 setup:{pages:['<p><br></p><p><br></p><p class="wtitle" style="text-align:center">تقرير الرحلة</p><p style="text-align:center">إعداد: طلاب الصف السابع</p>',P3[1],P3[2]],hf:{hdr:'<p>تقرير الرحلة — مدرسة الأمل</p>'},print:1},
 reqs:[Q('الغلاف بلا رأس',()=>S.hf.first&&!(S.hf.firstHdr||'').replace(/<[^>]+>/g,'').trim(),()=>pages()[0]?.querySelector('.pg-hdr'),'انقر نقرًا مزدوجًا على الرأس ← رأس وتذييل ← ضع ✓ على «صفحة أولى مختلفة»','firstDiff',{tab:'hfdesign',hfFirst:'hdr'}),
  Q('الرأس باقٍ في الصفحات الأخرى',()=>fuzzyHas(hfText('hdr'),'تقرير الرحلة'),()=>pages()[1]?.querySelector('.pg-hdr'),'لا تحذف الرأس — فقط «صفحة أولى مختلفة»')]});

const HF6=PIC({t:'رأس بخط فاصل',goalImg:'img/m-hf6.png',skills:['أنماط الرأس الجاهزة','خط تحت الرأس'],
 intro:'اختر رأسًا بنمط «خط الفاصل» واكتب فيه «مشروع الطاقة الشمسية».',
 setup:{pages:P3.slice(0,2),print:1},
 reqs:[Q('رأس بنمط «خط الفاصل»',()=>/border-bottom:\s*1px solid/.test(S.hf.hdr),()=>pages()[0]?.querySelector('.pg-hdr'),'إدراج ← رأس الصفحة ← خط الفاصل','header',{mi:['header','3','خط الفاصل']}),
  Q('مكتوب فيه «مشروع الطاقة الشمسية»',()=>fuzzyHas(hfText('hdr'),'مشروع الطاقة الشمسية'),()=>pages()[0]?.querySelector('.pg-hdr'),'انقر على [اكتب هنا] في الرأس واكتب')]});

/* ======================= الرموز ======================= */
const SY1=PIC({t:'رموز الرياضيات والدرجة',goalImg:'img/m-sym1.png',skills:['إدراج ← رمز','رموز إضافية','° ÷ ×'],
 intro:'أكمل الرموز الناقصة: ° بعد 30، و ÷ بين 12 و 4، و × بين 5 و 3. ضع المؤشر مكان الرمز أولًا.',
 setup:{html:'<p>درجة الحرارة اليوم 30</p><p>12  4 = 3</p><p>5  3 = 15</p>',caret:'.pg-body > p'},
 reqs:[Q('30°',()=>/30\s*°/.test(bodyText()),()=>paraHas('درجة الحرارة')||firstBody(),'انقر بعد 30 ← إدراج ← رمز ← رموز إضافية ← ° ← إدراج','symbol',{mi:['symbolDlg','null','رموز إضافية...']}),
  Q('12 ÷ 4 = 3',()=>/12\s*÷\s*4\s*=\s*3/.test(bodyText()),()=>paras()[1]||firstBody(),'انقر بين 12 و 4 ← إدراج ← رمز ← ÷','symbol'),
  Q('5 × 3 = 15',()=>/5\s*×\s*3\s*=\s*15/.test(bodyText()),()=>paras()[2]||firstBody(),'انقر بين 5 و 3 ← إدراج ← رمز ← ×','symbol')]});
SY1.reqs[1].fixFn=()=>/12\s*\/\s*4/.test(bodyText())?'الشرطة / ليست رمز القسمة — احذفها وأدرج ÷.':null;
SY1.reqs[2].fixFn=()=>/5\s*[xX*]\s*3/.test(bodyText())?'حرف x أو * ليس رمز الضرب — احذفه وأدرج ×.':null;

const SY2=PIC({t:'رموز في مكانها',goalImg:'img/m-sym2.png',skills:['رموز إضافية','© ☎ ✓'],
 intro:'أضف الرموز كما في الصورة: © قبل «جميع الحقوق»، و ☎ قبل «الهاتف»، و ✓ بعد «تمّت المهمة».',
 setup:{html:'<p>جميع الحقوق محفوظة لمدرسة الأمل</p><p>الهاتف: 022223333</p><p>تمّت المهمة</p>',caret:'.pg-body > p',caretStart:true},
 reqs:[Q('© قبل «جميع الحقوق»',()=>/^\s*©\s*جميع/.test(paraHas('الحقوق')?.textContent||''),()=>paraHas('الحقوق')||firstBody(),'انقر في أول السطر ← إدراج ← رمز ← ©','symbol',{mi:['insSymbol','©','©']}),
  Q('☎ قبل «الهاتف»',()=>/^\s*☎\s*الهاتف/.test(paraHas('الهاتف')?.textContent||''),()=>paraHas('الهاتف')||firstBody(),'انقر في أول السطر ← إدراج ← رمز ← رموز إضافية ← ☎','symbol',{mi:['symbolDlg','null','رموز إضافية...']}),
  Q('✓ بعد «تمّت المهمة»',()=>/المهمة\s*[✓✔]\s*$/.test(paraHas('المهمة')?.textContent||''),()=>paraHas('المهمة')||firstBody(),'انقر في آخر السطر ← رمز ← رموز إضافية ← ✓','symbol',{mi:['symbolDlg','null','رموز إضافية...']})]});

/* ======================= التاريخ ======================= */
const dateEl=()=>doc.querySelector('.pg-body .dtf,.pg-body .dtx');
const DT1=PIC({t:'تاريخ الرسالة بالعربية',goalImg:'img/m-date1.png',skills:['إدراج ← التاريخ والوقت','اللغة: العربية','تاريخ ثابت'],
 intro:'أدرج تاريخ اليوم بعد «التاريخ:» بالعربية وباسم اليوم كما في الصورة (سيظهر عندك تاريخ اليوم). اجعله ثابتًا: ألغِ «تحديث تلقائي».',
 setup:{html:'<p>التاريخ: </p><p>حضرة مدير المدرسة المحترم،</p><p>تحية طيبة وبعد،</p>',caret:'.pg-body > p'},
 reqs:[Q('التاريخ بعد «التاريخ:»',()=>{const e=dateEl();return !!e&&!!e.closest('p')&&fuzzyHas(e.closest('p').textContent,'التاريخ')},()=>paras()[0],'انقر بعد «التاريخ:» ← إدراج ← التاريخ والوقت','datetime',{path:()=>DATE_PATH(2)}),
  Q('بالعربية وباسم اليوم',()=>{const e=dateEl();return !!e&&e.dataset.lang==='ar'&&AR_DAYS.some(d=>e.textContent.includes(d))},()=>dateEl()||paras()[0],'في النافذة: اللغة ← العربية، ثم اختر الشكل الثالث (اسم اليوم، الشهر)','datetime',{path:()=>DATE_PATH(2)}),
  Q('ثابت (لا يتحدّث تلقائيًا)',()=>dateEl()?.classList.contains('dtx'),()=>dateEl()||paras()[0],'احذف التاريخ وأدرجه من جديد بعد إلغاء ✓ «تحديث تلقائي»','datetime',{path:()=>DATE_PATH(2)})]});
DT1.reqs[1].fixFn=()=>{const e=dateEl();if(!e)return null;if(e.dataset.lang!=='ar')return 'التاريخ بالإنجليزية — احذفه، واختر اللغة «العربية» في النافذة.';return null};

const DT2=PIC({t:'التاريخ بالإنجليزية',goalImg:'img/m-date2.png',skills:['التاريخ والوقت','اللغة: الإنجليزية'],
 intro:'في الرسالة الإنجليزية أدرج التاريخ بعد «Date:» بالشكل: الشهر/اليوم/السنة (مثل 11/20/2026).',
 setup:{html:'<p dir="ltr" style="text-align:left">Date: </p><p dir="ltr" style="text-align:left">Dear Teacher,</p>',caret:'.pg-body > p'},
 reqs:[Q('تاريخ إنجليزي بعد «Date:»',()=>{const e=dateEl();return !!e&&e.dataset.lang==='en'&&/Date/.test(e.closest('p')?.textContent||'')},()=>paras()[0],'انقر بعد «Date:» ← إدراج ← التاريخ والوقت ← اللغة: الإنجليزية','datetime',{path:()=>DATE_PATH(0,'en')}),
  Q('بالشكل 11/20/2026',()=>/^\d{1,2}\/\d{1,2}\/\d{4}$/.test((dateEl()?.textContent||'').trim()),()=>dateEl()||paras()[0],'اختر الشكل الأول في القائمة (أرقام بشرطات /)','datetime',{path:()=>DATE_PATH(0,'en')})]});

/* ======================= المعادلات ======================= */
const eqs=()=>[...doc.querySelectorAll('.pg-body .eq')];
const eqTxt=e=>(e?.textContent||'').replace(/[​\s]/g,'');
const EQ1=PIC({t:'الأس والكسر',goalImg:'img/m-eq1.png',skills:['إدراج ← معادلة','نص مرتفع (أس)','كسر مكدّس','Tab بين الخانات'],
 intro:'اكتب المعادلة: x² + ½ . (معادلة ← نص مرتفع لـ x²، وكسر مكدّس لـ ½)',
 setup:{html:'<p>المعادلة:</p><p><br></p>',caret:'.pg-body > p:last-child'},
 reqs:[Q('معادلة',()=>eqs().length>0,()=>eqs()[0]||paras()[1],'انقر في السطر الفارغ ← إدراج ← معادلة (Alt + =)','equation'),
  Q('x²',()=>eqs().some(e=>[...e.querySelectorAll('sup')].some(s=>s.textContent.includes('2')&&/x/i.test((s.previousElementSibling?.textContent||'')+(s.previousSibling?.textContent||'')))),()=>eqs()[0]||paras()[1],'اكتب x ← معادلة ← نص مرتفع ← مرتفع ← اكتب 2 ← اضغط → للخروج','eqScript',{tab:'eqdesign',mi:['eqScript','sup','مرتفع']}),
  Q('½ كسر مكدّس',()=>eqs().some(e=>[...e.querySelectorAll('.fr')].some(f=>{const s=f.querySelectorAll('.slot');return /^1$/.test(eqTxt(s[0]))&&/^2$/.test(eqTxt(s[1]))})),()=>eqs()[0]||paras()[1],'اكتب + ← معادلة ← كسر ← كسر مكدّس ← 1 ثم Tab ثم 2','eqFrac',{tab:'eqdesign',mi:['eqFrac','stack','كسر مكدّس']}),
  N(Q('الترتيب: x² ثم + ثم ½',()=>eqs().some(e=>/x2\+12/i.test(eqTxt(e).replace(/[()]/g,''))),()=>eqs()[0]||paras()[1],'تأكّد من الترتيب: x² + ½'),1,2)]});

const EQ2=PIC({t:'الجذر وπ',goalImg:'img/m-eq2.png',skills:['جذر تربيعي','رموز المعادلات: π و ≈'],
 intro:'اكتب معادلتين في سطرين: √16 = 4 ثم π ≈ 3.14',
 setup:{html:'<p>الجذر وباي:</p><p><br></p><p><br></p>',caret:'.pg-body > p:nth-of-type(2)'},
 reqs:[Q('√16 = 4',()=>eqs().some(e=>[...e.querySelectorAll('.rad')].some(r=>eqTxt(r.querySelector('.rb'))==='16')&&/=4/.test(eqTxt(e))),()=>eqs()[0]||paras()[1],'معادلة ← جذر ← جذر تربيعي ← 16 ← → ← =4','eqRad',{tab:'eqdesign',mi:['eqRad','sq','جذر تربيعي']}),
  Q('π ≈ 3.14',()=>eqs().some(e=>/π≈3[.,٫]14/.test(eqTxt(e))),()=>eqs()[1]||paras()[2],'معادلة جديدة في السطر الثاني ← من «رموز» اختر π ثم ≈ ثم اكتب 3.14','equation',{gal:['.eqs [data-arg="π"]','اختر π من الرموز'],tab:'eqdesign'})]});

const EQ3=PIC({t:'معادلة جاهزة',goalImg:'img/m-eq3.png',skills:['معادلة ← المعادلات الجاهزة'],
 intro:'لا تكتبها بيدك: أدرج «نظرية فيثاغورس» من المعادلات الجاهزة.',
 setup:{html:'<p>نظرية فيثاغورس:</p><p><br></p>',caret:'.pg-body > p:last-child'},
 reqs:[Q('a² + b² = c²',()=>eqs().some(e=>/a2\+b2=c2/.test(eqTxt(e))),()=>eqs()[0]||paras()[1],'انقر في السطر الفارغ ← إدراج ← سهم «معادلة» ▾ ← نظرية فيثاغورس','equation',{mi:['insEqReady','1','نظرية فيثاغورس']})]});

/* ======================= الأعمدة ======================= */
const COLTXT=`<p class="wtitle">أخبار المدرسة</p><p>${PLONG} ${PLONG2}</p><p>${PLONG2} ${PLONG}</p><p>${PLONG}</p>`;
const CO1=PIC({t:'عمودان كالجريدة',goalImg:'img/m-col1.png',skills:['تخطيط ← أعمدة'],
 intro:'اجعل الكلام في عمودين كالجريدة.',setup:{html:COLTXT},
 reqs:[Q('عمودان',()=>S.page.cols==='2',()=>firstBody(),'تخطيط ← أعمدة ← اثنان','columns',{mi:['columns','2','اثنان']})]});
CO1.reqs[0].fixFn=()=>S.page.cols!=='1'&&S.page.cols!=='2'?'هذه ليست عمودين متساويين — اختر «اثنان».':null;

const CO2=PIC({t:'ثلاثة أعمدة بخط فاصل',goalImg:'img/m-col2.png',skills:['المزيد من الأعمدة...','خط فاصل بين الأعمدة'],
 intro:'ثلاثة أعمدة بينها خطوط فاصلة.',setup:{html:COLTXT},
 reqs:[Q('ثلاثة أعمدة',()=>S.page.cols==='3',()=>firstBody(),'تخطيط ← أعمدة ← ثلاثة (أو «المزيد من الأعمدة...»)','columns',{mi:['colMore','null','المزيد من الأعمدة...']}),
  Q('خط فاصل بين الأعمدة',()=>!!S.page.colLine&&S.page.cols!=='1',()=>firstBody(),'أعمدة ← المزيد من الأعمدة... ← ضع ✓ على «خط فاصل بين الأعمدة» ← موافق','columns',{mi:['colMore','null','المزيد من الأعمدة...']})]});

const brk=b=>!!b&&(b.style.breakBefore==='column'||b.style.columnBreakBefore==='always');
const CO3=PIC({t:'فاصل العمود',goalImg:'img/m-col3.png',skills:['فواصل ← عمود'],
 intro:'«الخبر الثاني» يجب أن يبدأ في أعلى العمود الثاني. لا تضغط Enter كثيرًا — استخدم «فاصل عمود».',
 setup:{html:`<p class="wtitle">نشرة الصف</p><h2>الخبر الأول</h2><p>${PLONG2}</p><h2>الخبر الثاني</h2><p>${PLONG}</p>`,page:{cols:'2'},caret:'.pg-body > h2:nth-of-type(2)',caretStart:true},
 reqs:[Q('«الخبر الثاني» يبدأ العمود الثاني',()=>{const h=[...firstBody().children].find(b=>b.textContent.includes('الخبر الثاني'));return brk(h)},()=>[...firstBody().children].find(b=>b.textContent.includes('الخبر الثاني'))||firstBody(),'انقر في أول «الخبر الثاني» ← تخطيط ← فواصل ← عمود','breaks',{mi:['colBreak','null','عمود']}),
  Q('بلا أسطر فارغة زائدة',()=>!paras().some(p=>!p.textContent.trim()&&!p.querySelector('.obj,img')),()=>paras().find(p=>!p.textContent.trim())||firstBody(),'احذف الأسطر الفارغة التي أضفتها بـ Enter'),
  Q('ما زال في عمودين',()=>S.page.cols==='2',()=>firstBody(),'تخطيط ← أعمدة ← اثنان','columns',{mi:['columns','2','اثنان']})]});

/* «أرني أين» لنافذة التاريخ */
function DATE_PATH(fmt,lang='ar'){const opn=()=>!!$('#dlgs.show #dtlang');return [
 {el:()=>paras()[0],say:'انقر في آخر سطر التاريخ',done:()=>{const r=S.range;return !!r&&paras()[0]?.contains(r.startContainer)||opn()}},
 {el:()=>$('#wtabs [data-tab="insert"]'),say:'افتح تبويب «إدراج»',done:()=>$('#wtabs [data-tab="insert"]')?.classList.contains('on')||opn()},
 {el:()=>$('#ribbon [data-panel="insert"] [data-hid="datetime"]'),say:'انقر «التاريخ والوقت»',done:opn},
 {el:()=>$('#dtlang'),say:`اللغة: اختر «${lang==='ar'?'العربية':'الإنجليزية'}»`,done:()=>$('#dtlang')?.value===lang},
 {el:()=>$(`#dtl button[data-i="${fmt}"]`),say:'اختر هذا الشكل',done:()=>!!$(`#dtl button[data-i="${fmt}"].on`)},
 ...(lang==='ar'?[{el:()=>$('#dtauto'),say:'أزل ✓ «تحديث تلقائي» ليبقى التاريخ ثابتًا',done:()=>$('#dtauto')&&!$('#dtauto').checked}]:[]),
 {el:()=>$('#dlgs .df .pri'),say:'اضغط «موافق»',click:1}]}

/* ======================= الأساسيات: فتح البرنامج، مستند جديد، الواجهة، الحفظ ======================= */
const ST=(el,say,done,click)=>({el:typeof el==='string'?()=>$(el):el,say,done,click:click?1:0});
const FTAB=()=>ST('#wtabs [data-tab="file"]','افتح «ملف»',()=>!$('#backstage').hidden);
const SAVEAS_PATH=(place,name)=>[FTAB(),ST('[data-hid="bs-saveas"]','انقر «حفظ باسم»',()=>!!$('#backstage [data-bs="saveas"].on')||!!$('#saveName')),
 ST(`#bsMain [data-browse="${place}"]`,`اختر «${place}»`,()=>!!$('#saveName')),ST(`#dlgs .fsl [data-pl="${place}"]`,`تأكّد أن المكان «${place}»`,()=>!!$(`#dlgs .fsl [data-pl="${place}"].on`)),
 ST('#saveName',`امسح الاسم القديم واكتب: ${name}`,()=>txtEq(($('#saveName')?.value||'').trim(),name)),ST('#dlgs .df .pri','انقر «حفظ»',null,1)];
const savedAs=(nm,where)=>SIM.log.some(a=>{const m=a.match(/^save:(.*)@(.*)$/);return !!m&&txtEq(m[1].trim(),nm)&&(!where||m[2]===where)});
const BA1=PIC({t:'افتح برنامج Word',goalImg:'img/m-b1.png',skills:['زر «ابدأ»','البحث عن البرنامج','فتح Word'],
 intro:'أمامك سطح المكتب. افتح Word حتى تظهر شاشة البداية كما في الصورة. (أو انقر أيقونة Word على سطح المكتب أو شريط المهام)',
 setup:{app:'desktop'},
 reqs:[Q('Word مفتوح',()=>S.app==='start'||S.app==='doc',()=>$('#startbtn'),'انقر «ابدأ» ← اكتب Word ← انقر «Word»',null,{path:[ST('#startbtn','انقر زر «ابدأ»',()=>$('#startmenu').classList.contains('open')||S.app!=='desktop'),ST('#startq','اكتب: Word',()=>/^w/i.test($('#startq').value.trim())||S.app!=='desktop'),ST('#startres .best','انقر «Word»',null,1)]})]});
const BA2=PIC({t:'مستند جديد فارغ',goalImg:'img/m-b2.png',skills:['شاشة البداية','مستند فارغ','الكتابة'],
 intro:'من شاشة البداية أنشئ مستندًا فارغًا، واكتب فيه: هذا أول مستند لي',
 setup:{app:'start'},
 reqs:[Q('مستند فارغ جديد',()=>S.app==='doc'&&logHas('newdoc'),()=>$('[data-hid="bs-blank"]'),'انقر «مستند فارغ»',null,{path:[ST('[data-hid="bs-blank"]','انقر «مستند فارغ»',null,1)]}),
  Q('مكتوب فيه «هذا أول مستند لي»',()=>S.app==='doc'&&fuzzyHas(firstBody().textContent,'هذا أول مستند لي'),()=>S.app==='doc'?firstBody():$('[data-hid="bs-blank"]'),'انقر على الصفحة البيضاء واكتب')]});
const BA3=PIC({t:'مستند جديد من «ملف»',goalImg:'img/m-b3.png',skills:['ملف ← جديد','مستند فارغ وأنت تعمل على مستند آخر'],
 intro:'أنت تعمل على «رحلتي». افتح مستندًا جديدًا فارغًا (دون أن تحذف «رحلتي») واكتب فيه اسمك.',
 setup:DOCX(TRIP,{file:'رحلتي',where:'المستندات'}),
 reqs:[Q('مستند جديد فارغ',()=>logHas('newdoc')&&S.file.name!=='رحلتي',()=>$('#wtabs [data-tab="file"]'),'ملف ← جديد ← مستند فارغ',null,{path:[FTAB(),ST('[data-hid="bs-new"]','انقر «جديد»',()=>!!$('#backstage [data-bs="new"].on')||logHas('newdoc')),ST('#bsMain [data-hid="bs-blank"]','انقر «مستند فارغ»',null,1)]}),
  Q('اكتب اسمك فيه',()=>logHas('newdoc')&&S.file.name!=='رحلتي'&&firstBody().textContent.trim().length>=2,()=>firstBody(),'انقر على الصفحة واكتب اسمك')]});
const BA4=PIC({t:'تجوّل في الواجهة',goalImg:'img/m-b4.png',skills:['التبويبات والشريط','شريط الحالة: التكبير','المسطرة'],
 intro:'تجوّل في الواجهة: افتح التبويبات «إدراج» ثم «تخطيط» ثم «عرض». كبّر العرض إلى 150% من شريط الحالة (أسفل يسار النافذة)، وأخفِ المسطرة من تبويب «عرض». (مرّر الفأرة على أي زر لتعرف عمله)',
 setup:DOCX(TRIP),
 reqs:[Q('فتحتَ تبويب «إدراج»',()=>logHas('tab:insert'),()=>$('#wtabs [data-tab="insert"]'),'انقر على كلمة «إدراج» في الأعلى',null,{path:[ST('#wtabs [data-tab="insert"]','انقر «إدراج»',()=>logHas('tab:insert'))]}),
  Q('فتحتَ تبويب «تخطيط»',()=>logHas('tab:layout'),()=>$('#wtabs [data-tab="layout"]'),'انقر على «تخطيط»',null,{path:[ST('#wtabs [data-tab="layout"]','انقر «تخطيط»',()=>logHas('tab:layout'))]}),
  Q('فتحتَ تبويب «عرض»',()=>logHas('tab:view'),()=>$('#wtabs [data-tab="view"]'),'انقر على «عرض»',null,{path:[ST('#wtabs [data-tab="view"]','انقر «عرض»',()=>logHas('tab:view'))]}),
  Q('التكبير 150%',()=>Math.abs(S.zoom-150)<=5,()=>$('[data-hid="st-zoom"]'),'شريط الحالة ← اضغط + حتى 150% (أو اسحب المؤشر)',null,{path:[ST('[data-hid="st-zoom"] button:last-of-type','اضغط + حتى يصير 150%',()=>Math.abs(S.zoom-150)<=5)]}),
  Q('المسطرة مخفية',()=>!S.ruler,()=>$('#ribbon [data-panel="view"] [data-hid="ruler"]')||$('#wtabs [data-tab="view"]'),'عرض ← أزل ✓ عن «مسطرة»','ruler',{tab:'view'})]});
BA4.reqs[3].fixFn=()=>`التكبير الآن ${S.zoom}% — المطلوب 150%.`;
const BA5=PIC({t:'الحفظ أول مرة',goalImg:'img/m-b5.png',skills:['حفظ (Ctrl + S)','أول حفظ يسألك: أين؟ وبأي اسم؟'],
 intro:'المستند جديد لم يُحفظ بعد (اسمه «مستند1»). احفظه باسم «رحلتي» في «المستندات». أول حفظ يفتح نافذة «حفظ باسم» تلقائيًا.',
 setup:DOCX(TRIP),
 reqs:[Q('محفوظ باسم «رحلتي» في «المستندات»',()=>savedAs('رحلتي','المستندات'),()=>$('[data-hid="qat-save"]'),'انقر زر الحفظ 💾 (أو Ctrl + S) ← المستندات ← اكتب «رحلتي» ← حفظ',null,{path:()=>[ST('[data-hid="qat-save"]','انقر زر الحفظ 💾',()=>!$('#backstage').hidden||!!$('#saveName')),...SAVEAS_PATH('المستندات','رحلتي').slice(2)]}),
  Q('اسم الملف ظاهر في شريط العنوان',()=>txtEq(S.file.name,'رحلتي')&&!S.dirty,()=>$('#fname'),'احفظ الملف أولًا')]});
BA5.reqs[0].fixFn=()=>{const m=SIM.log.map(a=>a.match(/^save:(.*)@(.*)$/)).filter(Boolean).pop();if(!m)return null;if(!txtEq(m[1],'رحلتي'))return `حفظتَه باسم «${m[1]}» — المطلوب «رحلتي». احفظه مرة أخرى بالاسم الصحيح.`;if(m[2]!=='المستندات')return `حفظتَه في «${m[2]}» — المطلوب «المستندات».`;return null};
const BA6=PIC({t:'حفظ التعديلات',goalImg:'img/m-b6.png',skills:['حفظ = يحدّث الملف نفسه','لا يسأل عن الاسم مرة ثانية'],
 intro:'الملف «واجبي» محفوظ من قبل. أضف في آخره سطرًا: تمّ الحل. ثم احفظ التعديل. لاحظ: الحفظ لا يسألك عن الاسم مرة ثانية — يحدّث الملف نفسه.',
 setup:DOCX('<p class="wtitle">واجبي</p><p>'+P1+'</p><p><br></p>',{file:'واجبي',where:'المستندات',fs:[{name:'واجبي',where:'المستندات',time:'أمس'}],caret:'.pg-body > p:last-child'}),
 reqs:[Q('أضفتَ «تمّ الحل»',()=>fuzzyHas(firstBody().textContent,'تم الحل'),()=>firstBody().lastElementChild,'انقر في السطر الأخير واكتب «تمّ الحل»'),
  Q('حُفظ التعديل في «واجبي» نفسه',()=>fuzzyHas(firstBody().textContent,'تم الحل')&&savedAs('واجبي','المستندات')&&!S.dirty&&txtEq(S.file.name,'واجبي'),()=>$('[data-hid="qat-save"]'),'انقر زر الحفظ 💾 أو Ctrl + S',null,{path:[ST('[data-hid="qat-save"]','انقر زر الحفظ 💾',null,1)]}),
  Q('لم تُنشئ ملفًّا آخر',()=>!SIM.log.some(a=>/^save:/.test(a)&&!/^save:واجبي@المستندات$/.test(a)),()=>$('#fname'),'استخدم «حفظ» وليس «حفظ باسم» — «حفظ باسم» يصنع ملفًّا جديدًا')]});
BA6.reqs[1].fixFn=()=>S.dirty&&savedAs('واجبي','المستندات')?'عدّلتَ بعد الحفظ — احفظ مرة أخرى.':null;
const BA7=PIC({t:'حفظ باسم: نسخة جديدة',goalImg:'img/m-b7.png',skills:['حفظ باسم','الفرق بين «حفظ» و«حفظ باسم»'],
 intro:'«حفظ باسم» يصنع ملفًّا جديدًا ويبقى القديم كما هو. احفظ «التقرير» نسخةً جديدة باسم «التقرير - نسخة 2» على «سطح المكتب».',
 setup:DOCX('<p class="wtitle">التقرير</p><p>'+P2+'</p>',{file:'التقرير',where:'المستندات',fs:[{name:'التقرير',where:'المستندات',time:'أمس'}]}),
 reqs:[Q('نسخة باسم «التقرير - نسخة 2»',()=>SIM.log.some(a=>{const m=a.match(/^save:(.*)@/);return !!m&&fuzzyHas(m[1],'نسخة 2')&&fuzzyHas(m[1],'التقرير')}),()=>$('#wtabs [data-tab="file"]'),'ملف ← حفظ باسم ← اكتب «التقرير - نسخة 2» ← حفظ',null,{path:()=>SAVEAS_PATH('سطح المكتب','التقرير - نسخة 2')}),
  Q('على «سطح المكتب»',()=>SIM.log.some(a=>/^save:.*نسخة.*@سطح المكتب$/.test(a)),()=>$('#wtabs [data-tab="file"]'),'في نافذة «حفظ باسم» اختر «سطح المكتب» قبل «حفظ»',null,{path:()=>SAVEAS_PATH('سطح المكتب','التقرير - نسخة 2')}),
  Q('الملف القديم «التقرير» ما زال موجودًا',()=>FS.some(f=>f.name==='التقرير'&&f.where==='المستندات'),()=>$('#fname'),'لا تحذف الملف القديم')]});

/* ---- أجزاء الواجهة: انقر على كل جزء لتتعرّف عليه ---- */
const UI_PARTS=[
 {k:'title',n:'شريط العنوان',sel:'#wwin .fname',d:'في أعلى النافذة: يعرض اسم الملف (مستند1) واسم البرنامج Word.'},
 {k:'qat',n:'شريط أدوات الوصول السريع',sel:'#wwin .qat',d:'أزرار نستعملها كثيرًا: حفظ، تراجع، إعادة.'},
 {k:'win',n:'أزرار النافذة',sel:'#wwin .wbtns',d:'تصغير النافذة، تكبيرها، وإغلاقها.'},
 {k:'tabs',n:'التبويبات',sel:'#wtabs',d:'ملف، الصفحة الرئيسية، إدراج، تصميم… كل تبويب يعرض أوامر مختلفة.'},
 {k:'cmd',n:'الأوامر',sel:'#ribbon [data-panel="home"] [data-hid="bold"]',d:'الأزرار التي ننفّذ بها العمل، مثل غامق B أو لون الخط.'},
 {k:'group',n:'المجموعات',sel:'#ribbon [data-panel="home"] .gl',d:'أسماء صغيرة تحت الأوامر (الحافظة، خط، فقرة…) تجمع الأوامر المتشابهة.'},
 {k:'ruler',n:'المسطرة',sel:'#hruler',d:'تبيّن هوامش الصفحة وأماكن الكتابة.'},
 {k:'page',n:'الصفحة (منطقة الكتابة)',sel:'#doc .page',d:'الورقة البيضاء التي نكتب فيها.'},
 {k:'status',n:'شريط الحالة',sel:'#wwin .wstatus',d:'في أسفل النافذة: رقم الصفحة، عدد الكلمات، اللغة.'},
 {k:'views',n:'طرق العرض',sel:'#wwin .wstatus .vb',d:'تغيّر شكل عرض المستند: قراءة، طباعة، ويب.'},
 {k:'zoom',n:'التكبير والتصغير',sel:'#wwin .wstatus .zm',d:'يكبّر الصفحة على الشاشة فقط، ولا يغيّر حجم الخط في الطباعة.'},
];
const partOf=t=>{if(!t||!t.closest)return null;
 if(t.closest('#wwin .wbtns'))return 'win';if(t.closest('#wwin .qat'))return 'qat';if(t.closest('#wwin .wtbar'))return 'title';
 if(t.closest('#wtabs'))return 'tabs';if(t.closest('#ribbon .gl'))return 'group';if(t.closest('#ribbon'))return t.closest('[data-cmd],[data-hid],button,select,input,label')?'cmd':'group';
 if(t.closest('#hruler'))return 'ruler';if(t.closest('.wstatus .vb'))return 'views';if(t.closest('.wstatus .zm'))return 'zoom';if(t.closest('.wstatus'))return 'status';
 if(t.closest('#doc .page'))return 'page';return null};
window.PARTS_SEEN=new Set();
const BA0=PIC({t:'أجزاء البرنامج',goalImg:'img/m-b0.png',skills:UI_PARTS.map(x=>x.n),
 intro:'انظر إلى الصورة: هذه أجزاء نافذة Word. انقر على كل جزء في Word لتتعرّف عليه — يظهر لك اسمه وعمله. (في هذا التمرين النقر يعرّفك بالجزء فقط ولا ينفّذ الأمر)',
 setup:{...DOCX(TRIP),after:()=>{PARTS_SEEN=new Set()}},parts:1,
 reqs:UI_PARTS.map(x=>Q(x.n,()=>PARTS_SEEN.has(x.k)||(x.k==='ruler'&&(S.view==='web'||!S.ruler)),()=>$(x.sel),`انقر على ${x.n} — ${x.d}`,null,{path:[ST(x.sel,`هذا ${x.n}: انقر عليه`,()=>PARTS_SEEN.has(x.k))]}))});
['pointerdown','touchstart'].forEach(ev=>document.addEventListener(ev,e=>{if(!CO.item||!CO.item.parts||CO.mode==='won'&&false)return;const k=partOf(e.target);if(!k)return;
  const P=UI_PARTS.find(x=>x.k===k);const fresh=!PARTS_SEEN.has(k);PARTS_SEEN.add(k);simToast(`${fresh?'✓ ':''}${P.n}: ${P.d}`);
  if(PART_BLOCK.includes(k)){e.preventDefault();e.stopPropagation()}},{capture:true,passive:false}));
const PART_BLOCK=['win','qat','cmd','group','views','title','status'];
['mousedown','click','dblclick'].forEach(ev=>document.addEventListener(ev,e=>{if(!CO.item||!CO.item.parts)return;const k=partOf(e.target);if(k&&PART_BLOCK.includes(k)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}},true));

/* ======================= الكتابة والتنسيق (النص) ======================= */
const charMap=()=>{const out=[];doc.querySelectorAll('.pg-body').forEach(b=>{const w=document.createTreeWalker(b,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('.obj,.eq')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});let n;while(n=w.nextNode())for(const ch of n.data)out.push([ch,n.parentElement]);out.push(['\n',b])});return out};
const fmtOf=(word,pred,nth)=>{const M=charMap(),T=M.map(x=>x[0]).join('').replace(/ /g,' ');let i=-1,k=0;do{i=T.indexOf(word,i+1);k++}while(i>=0&&k<=(nth||0));if(i<0)return false;for(let j=i;j<i+word.length;j++){if(/\s/.test(M[j][0]))continue;if(!pred(M[j][1]))return false}return true};
const anc=(e,f)=>{for(let x=e;x&&!(x.classList&&x.classList.contains('pg-body'));x=x.parentElement){const v=f(x);if(v)return v}return null};
const isB=e=>+getComputedStyle(e).fontWeight>=600, isI=e=>getComputedStyle(e).fontStyle==='italic';
const isU=e=>!!anc(e,x=>/underline/.test(getComputedStyle(x).textDecorationLine));
const hiOf=e=>anc(e,x=>{const b=getComputedStyle(x).backgroundColor;return b&&!/rgba\(0, 0, 0, 0\)|transparent/.test(b)&&!x.matches('p,h1,h2,h3,li,ul,ol')?b:null});
const ptOf=e=>parseFloat(getComputedStyle(e).fontSize)*.75;
const isSup=e=>!!e.closest('sup')||getComputedStyle(e).verticalAlign==='super', isSub=e=>!!e.closest('sub')||getComputedStyle(e).verticalAlign==='sub';
const blk=t=>[...firstBody().querySelectorAll('p,h1,h2,h3,li')].find(b=>b.textContent.includes(t))||null;
const TSEL=(t)=>({selText:t});
const TX1=PIC({t:'اكتب كما في الصورة',goalImg:'img/m-tx1.png',skills:['الكتابة بالعربية','Enter لسطر جديد'],
 intro:'اكتب العنوان في السطر الأول، ثم اضغط Enter واكتب الجملة في السطر الثاني. الأخطاء الصغيرة مقبولة.',
 setup:{html:'<p><br></p>',caret:'.pg-body > p'},
 reqs:[Q('السطر الأول: رحلتي إلى أريحا',()=>{const ps=paras().filter(p=>p.textContent.trim());return !!ps[0]&&txtEq(ps[0].textContent.trim(),'رحلتي إلى أريحا')},()=>paras()[0],'انقر في الصفحة واكتب: رحلتي إلى أريحا'),
  Q('السطر الثاني: الجملة',()=>{const ps=paras().filter(p=>p.textContent.trim());return !!ps[1]&&fuzzyHas(ps[1].textContent,'زرنا أريحا يوم الخميس مع معلمتنا')},()=>paras()[1]||paras()[0],'اضغط Enter ثم اكتب: زرنا أريحا يوم الخميس مع معلمتنا، وشاهدنا قصر هشام.'),
  N(Q('كل جملة في سطر',()=>paras().filter(p=>p.textContent.trim()).length>=2,()=>paras()[0],'اضغط Enter بعد العنوان لتنزل سطرًا'),0)]});
const STEPS=['أولًا نغلي الماء.','ثم نضع الشاي في الكوب.','أخيرًا نضيف السكر.'];
const TX2=PIC({t:'قص ولصق: رتّب الجمل',goalImg:'img/m-tx2.png',skills:['تحديد سطر','قص (Ctrl + X)','لصق (Ctrl + V)'],
 intro:'الجمل غير مرتبة. انقلها بالقص واللصق حتى تصير كما في الصورة: أولًا ← ثم ← أخيرًا.',
 setup:{html:`<p class="wtitle">تحضير الشاي</p><p>${STEPS[1]}</p><p>${STEPS[2]}</p><p>${STEPS[0]}</p>`},
 reqs:[Q('الترتيب: أولًا ← ثم ← أخيرًا',()=>{const T=firstBody().textContent;const ix=STEPS.map(x=>T.indexOf(x.slice(0,8)));return ix.every(i=>i>=0)&&ix[0]<ix[1]&&ix[1]<ix[2]},()=>blk('أولًا'),'حدّد سطر «أولًا…» ← الصفحة الرئيسية ← قص ← انقر في أول سطر «ثم…» ← لصق','cut',{selText:'أولًا نغلي الماء.'}),
  Q('كل جملة مرة واحدة فقط',()=>{const T=firstBody().textContent;return STEPS.every(x=>T.split(x.slice(0,8)).length===2)},()=>firstBody(),'استخدم «قص» وليس «نسخ» — احذف الجملة المكررة')]});
const TX3=PIC({t:'غامق ومائل وتحته خط',goalImg:'img/m-tx3.png',skills:['تحديد كلمة','غامق B','مائل I','تسطير U'],
 intro:'حدّد الكلمة أولًا (انقر عليها نقرًا مزدوجًا)، ثم اختر الأمر. اجعل «نور» غامقة، و«مفتاح» مائلة، و«الإيمان» تحتها خط.',
 setup:{html:'<p>العلم نور</p><p>الصبر مفتاح الفرج</p><p>النظافة من الإيمان</p>'},
 reqs:[Q('«نور» غامقة',()=>fmtOf('نور',isB),()=>blk('نور'),'حدّد «نور» ← الصفحة الرئيسية ← B (Ctrl + B)','bold',TSEL('نور')),
  Q('«مفتاح» مائلة',()=>fmtOf('مفتاح',isI),()=>blk('مفتاح'),'حدّد «مفتاح» ← I (Ctrl + I)','italic',TSEL('مفتاح')),
  Q('«الإيمان» تحتها خط',()=>fmtOf('الإيمان',isU),()=>blk('الإيمان'),'حدّد «الإيمان» ← U (Ctrl + U)','underline',TSEL('الإيمان')),
  N(Q('باقي الكلمات عادية',()=>!fmtOf('العلم',isB)&&!fmtOf('الصبر',isI)&&!fmtOf('الفرج',isI)&&!fmtOf('النظافة',isU),()=>firstBody(),'نسّقتَ كلمات زائدة — حدّدها واضغط الأمر مرة ثانية لإلغائه'),1)]});
const TX4=PIC({t:'نوع الخط وحجمه',goalImg:'img/m-tx4.png',skills:['نوع الخط','حجم الخط'],
 intro:'حدّد العنوان «يوم العلوم» واجعل خطه Times New Roman وحجمه 28. ثم اجعل الفقرة بحجم 14.',
 setup:{html:`<p>يوم العلوم</p><p>${PLONG2}</p>`},
 reqs:[Q('العنوان: Times New Roman',()=>fmtOf('يوم العلوم',e=>/times/i.test(getComputedStyle(e).fontFamily)),()=>blk('يوم العلوم'),'حدّد العنوان ← الصفحة الرئيسية ← مربع الخط ← Times New Roman','fontName',TSEL('يوم العلوم')),
  Q('العنوان: حجم 28',()=>fmtOf('يوم العلوم',e=>Math.abs(ptOf(e)-28)<=1),()=>blk('يوم العلوم'),'حدّد العنوان ← حجم الخط ← 28','fontSize',TSEL('يوم العلوم')),
  Q('الفقرة: حجم 14',()=>fmtOf('تشتهر أريحا',e=>Math.abs(ptOf(e)-14)<=.6)&&fmtOf('المدن الفلسطينية',e=>Math.abs(ptOf(e)-14)<=.6),()=>blk('تشتهر'),'حدّد الفقرة كلها (انقر 3 مرات عليها) ← حجم الخط ← 14','fontSize',TSEL('تشتهر أريحا'))]});
TX4.reqs[1].fixFn=()=>{const b=blk('يوم العلوم');if(!b)return null;const M=charMap();const i=M.map(x=>x[0]).join('').indexOf('يوم');return i>=0?`حجمه الآن ${Math.round(ptOf(M[i][1]))} — المطلوب 28.`:null};
const TX5=PIC({t:'لون الخط والتمييز',goalImg:'img/m-tx5.png',skills:['لون الخط','لون تمييز النص'],
 intro:'اجعل «تذكير:» باللون الأحمر، وميّز «يوم الأحد» بالأصفر، واجعل «أزرق» باللون الأزرق.',
 setup:{html:'<p>تذكير: الامتحان يوم الأحد، أحضر قلمًا أزرق.</p>'},
 reqs:[Q('«تذكير:» حمراء',()=>fmtOf('تذكير',e=>isCol(getComputedStyle(e).color,C_RED)),()=>blk('تذكير'),'حدّد «تذكير:» ← سهم «لون الخط» A ▾ ← أحمر','fontcolor',TSEL('تذكير')),
  Q('«يوم الأحد» مميّزة بالأصفر',()=>fmtOf('يوم الأحد',e=>isCol(hiOf(e),C_YEL)),()=>blk('يوم الأحد'),'حدّد «يوم الأحد» ← سهم «لون تمييز النص» ▾ ← أصفر','highlight',TSEL('يوم الأحد')),
  Q('«أزرق» زرقاء',()=>fmtOf('أزرق',e=>isCol(getComputedStyle(e).color,C_BLUE)),()=>blk('أزرق'),'حدّد «أزرق» ← لون الخط ← أزرق','fontcolor',TSEL('أزرق'))]});
TX5.reqs[1].fixFn=()=>fmtOf('يوم الأحد',e=>isCol(getComputedStyle(e).color,C_YEL))?'هذا لون الخط وليس التمييز — استخدم زر «لون تمييز النص» (القلم الأصفر).':null;
const TX6=PIC({t:'مرتفع ومنخفض',goalImg:'img/m-tx6.png',skills:['منخفض x₂','مرتفع x²'],
 intro:'حدّد الرقم 2 فقط واجعله صغيرًا: في H2O منخفض (تحت)، وفي م2 و x2 و y2 مرتفع (فوق).',
 setup:{html:'<p style="font-size:18pt">صيغة الماء: H2O</p><p style="font-size:18pt">مساحة الغرفة 20 م2</p><p style="font-size:18pt">المعادلة: <span dir="ltr">x2 + y2 = 25</span></p>'},
 reqs:[Q('H₂O: الرقم منخفض',()=>{const M=charMap(),T=M.map(x=>x[0]).join('');const i=T.indexOf('H2O');return i>=0&&isSub(M[i+1][1])&&!isSub(M[i][1])},()=>blk('H2O'),'حدّد 2 في H2O ← الصفحة الرئيسية ← x₂ منخفض (Ctrl + =)','sub',TSEL('2')),
  Q('م²: الرقم مرتفع',()=>{const M=charMap(),T=M.map(x=>x[0]).join('');const i=T.indexOf('م2');return i>=0&&isSup(M[i+1][1])},()=>blk('مساحة'),'حدّد 2 بعد م ← x² مرتفع (Ctrl + Shift + =)','sup'),
  Q('x² و y²: مرتفعان',()=>{const M=charMap(),T=M.map(x=>x[0]).join('');const a=T.indexOf('x2'),b=T.indexOf('y2');return a>=0&&b>=0&&isSup(M[a+1][1])&&isSup(M[b+1][1])&&!isSup(M[a][1])},()=>blk('25'),'حدّد 2 بعد x ← مرتفع، ثم 2 بعد y ← مرتفع','sup')]});
const TX7=PIC({t:'المحاذاة',goalImg:'img/m-tx7.png',skills:['توسيط','ضبط (محاذاة لليمين واليسار)','محاذاة لليسار'],
 intro:'العنوان في الوسط، والفقرة مضبوطة من الجهتين، والتوقيع على اليسار. (انقر في السطر ثم اختر المحاذاة — لا تحتاج تحديد)',
 setup:{html:`<p style="font-size:16pt">دعوة</p><p style="font-size:14pt">${PLONG2}</p><p style="font-size:14pt">إدارة المدرسة</p>`},
 reqs:[Q('العنوان في الوسط',()=>getComputedStyle(blk('دعوة')).textAlign==='center',()=>blk('دعوة'),'انقر في «دعوة» ← الصفحة الرئيسية ← توسيط (Ctrl + E)','alignC',{caretIn:1}),
  Q('الفقرة مضبوطة',()=>getComputedStyle(blk('تشتهر')).textAlign==='justify',()=>blk('تشتهر'),'انقر في الفقرة ← ضبط (Ctrl + J)','justify',{caretIn:1}),
  Q('التوقيع على اليسار',()=>['left','end'].includes(getComputedStyle(blk('إدارة المدرسة')).textAlign),()=>blk('إدارة المدرسة'),'انقر في «إدارة المدرسة» ← محاذاة لليسار (Ctrl + L)','alignL',{caretIn:1})]});
const TX8=PIC({t:'تباعد الأسطر',goalImg:'img/m-tx8.png',skills:['تباعد الأسطر والفقرات','2.0'],
 intro:'الأسطر متلاصقة. اجعل تباعد الأسطر 2.0 في الفقرتين.',
 setup:{html:`<p class="wtitle">البحر الميت</p><p>${PLONG}</p><p>${PLONG}</p>`},
 reqs:[Q('تباعد 2.0 في الفقرتين',()=>{const ps=paras().filter(p=>p.textContent.includes('البحر الميت أخفض'));return ps.length===2&&ps.every(p=>(+p.style.lineHeight||0)>=1.9*1.08-.05&&(+p.style.lineHeight||0)<=2.2*1.08)},()=>blk('أخفض'),'حدّد الفقرتين ← الصفحة الرئيسية ← تباعد الأسطر ← 2.0','linespacing',{selText:'البحر الميت أخفض',mi:['linespacing','2.0','2.0']})]});
TX8.reqs[0].fixFn=()=>{const ps=paras().filter(p=>p.textContent.includes('البحر الميت أخفض'));const n=ps.filter(p=>(+p.style.lineHeight||0)>=2).length;return n===1?'غيّرتَ فقرة واحدة فقط — حدّد الفقرتين معًا.':null};
const TX9=PIC({t:'التعداد النقطي والرقمي',goalImg:'img/m-tx9.png',skills:['تعداد نقطي','تعداد رقمي'],
 intro:'حوّل الأدوات إلى تعداد نقطي (•)، والخطوات إلى تعداد رقمي (1، 2، 3).',
 setup:{html:['<b>أدوات الرحلة:</b>','قبعة','ماء','طعام','كاميرا','<b>خطوات التجربة:</b>','املأ الكأس بالماء','ضع الملح','حرّك جيدًا'].map(t=>`<p style="font-size:14pt">${t}</p>`).join('')},
 reqs:[Q('الأدوات نقطية',()=>{const u=[...firstBody().querySelectorAll('ul')];return u.some(l=>['قبعة','ماء','طعام','كاميرا'].every(t=>[...l.children].some(li=>li.textContent.includes(t))))},()=>blk('قبعة'),'حدّد الأسطر الأربعة ← الصفحة الرئيسية ← تعداد نقطي','bullets',{selText:'قبعة'}),
  Q('الخطوات مرقّمة',()=>{const o=[...firstBody().querySelectorAll('ol')];return o.some(l=>['املأ','الملح','حرّك'].every(t=>[...l.children].some(li=>li.textContent.includes(t))))},()=>blk('املأ'),'حدّد الخطوات الثلاث ← تعداد رقمي','numbering',{selText:'املأ'}),
  N(Q('العنوانان خارج القائمة',()=>!(blk('أدوات الرحلة')?.closest('ul,ol'))&&!(blk('خطوات التجربة')?.closest('ul,ol')),()=>blk('أدوات الرحلة'),'لا تحدّد العنوان مع القائمة — انقر فيه واضغط زر التعداد لإلغائه'),1)]});
const TX10=PIC({t:'الأنماط',goalImg:'img/m-tx10.png',skills:['الأنماط: العنوان','عنوان 1'],
 intro:'استخدم الأنماط الجاهزة: «تقرير عن الماء» بنمط «العنوان»، و«المقدمة» و«الخاتمة» بنمط «عنوان 1».',
 setup:{html:`<p>تقرير عن الماء</p><p>المقدمة</p><p>${PLONG2}</p><p>الخاتمة</p><p>${PLONG}</p>`},
 reqs:[Q('«تقرير عن الماء»: نمط العنوان',()=>!!blk('تقرير عن الماء')?.classList.contains('wtitle'),()=>blk('تقرير عن الماء'),'انقر في السطر ← الصفحة الرئيسية ← الأنماط ← العنوان','styles',{caretIn:1,gal:['[data-cmd="style"][data-arg="title"]','اختر «العنوان»']}),
  Q('«المقدمة»: عنوان 1',()=>blk('المقدمة')?.tagName==='H1',()=>blk('المقدمة'),'انقر في «المقدمة» ← الأنماط ← عنوان 1','styles',{caretIn:1,gal:['[data-cmd="style"][data-arg="h1"]','اختر «عنوان 1»']}),
  Q('«الخاتمة»: عنوان 1',()=>blk('الخاتمة')?.tagName==='H1',()=>blk('الخاتمة'),'انقر في «الخاتمة» ← الأنماط ← عنوان 1','styles',{caretIn:1,gal:['[data-cmd="style"][data-arg="h1"]','اختر «عنوان 1»']})]});
const TX11=PIC({t:'نسخ التنسيق',goalImg:'img/m-tx11.png',skills:['نسخ التنسيق (الفرشاة)','نقرة مزدوجة لتكراره'],
 intro:'«الشمس» منسّقة (أحمر غامق كبير). انسخ تنسيقها إلى «القمر» و«النجوم» بالفرشاة: انقر في «الشمس» ← نسخ التنسيق ← حدّد «القمر». (نقرتان على الفرشاة تبقيها شغالة)',
 setup:{html:'<p><span style="color:#c00000;font-size:18pt;font-weight:bold">الشمس</span></p><p>القمر</p><p>النجوم</p>'},
 reqs:[...['القمر','النجوم'].map(w=>Q(`«${w}» بنفس التنسيق`,()=>fmtOf(w,e=>isB(e)&&isCol(getComputedStyle(e).color,C_RED)&&Math.abs(ptOf(e)-18)<=1),()=>blk(w),`انقر في «الشمس» ← الصفحة الرئيسية ← نسخ التنسيق 🖌 ← حدّد «${w}»`,'painter'))]});
const TX12=PIC({t:'بحث واستبدال',goalImg:'img/m-tx12.png',skills:['استبدال (Ctrl + H)','استبدال الكل'],
 intro:'الرحلة صارت إلى نابلس! استبدل كل «أريحا» بـ«نابلس» مرة واحدة — لا تعدّلها كلمة كلمة.',
 setup:{html:'<p class="wtitle">رحلة إلى أريحا</p><p>سنزور أريحا يوم السبت. نصل أريحا صباحًا، ونتناول الغداء في أريحا، ثم نعود من أريحا مساءً.</p>'},
 reqs:[Q('لا توجد «أريحا»',()=>!firstBody().textContent.includes('أريحا'),()=>blk('سنزور'),'الصفحة الرئيسية ← استبدال ← البحث عن: أريحا ← استبدال بـ: نابلس ← استبدال الكل','replace'),
  Q('«نابلس» في مكانها (5 مرات)',()=>firstBody().textContent.split('نابلس').length-1===5,()=>blk('سنزور'),'اكتب «نابلس» صحيحة في خانة «استبدال بـ»','replace')]});

/* ---- التعداد: نقطي، رقمي، متعدد المستويات ---- */
const liOf=t=>[...firstBody().querySelectorAll('li')].find(l=>{const c=l.cloneNode(true);c.querySelectorAll('ul,ol').forEach(x=>x.remove());return c.textContent.trim().includes(t)})||null;
const depth=t=>{const l=liOf(t);if(!l)return 0;let d=0;for(let x=l;x&&x!==firstBody();x=x.parentElement)if(/^(UL|OL)$/.test(x.tagName))d++;return d};
const topList=t=>{const l=liOf(t);if(!l)return null;let top=l.closest('ul,ol');while(top&&top.parentElement&&top.parentElement.closest('ul,ol')&&firstBody().contains(top.parentElement))top=top.parentElement.closest('ul,ol');return top};
const PL=(arr,tag)=>arr.map(t=>`<p style="font-size:14pt">${t}</p>`).join('');
const LS1=PIC({t:'التعداد النقطي',goalImg:'img/m-ls1.png',skills:['تحديد عدة أسطر','تعداد نقطي'],
 intro:'حوّل الأدوات الأربع إلى تعداد نقطي (•). لا تحدّد العنوان.',
 setup:{html:PL(['<b>أدوات الرحلة:</b>','قبعة','ماء','طعام','كاميرا'])},
 reqs:[Q('الأدوات الأربع بتعداد نقطي',()=>['قبعة','ماء','طعام','كاميرا'].every(t=>liOf(t)?.closest('ul')),()=>blk('قبعة'),'حدّد الأسطر الأربعة ← الصفحة الرئيسية ← تعداد نقطي','bullets',{selText:'قبعة'}),
  Q('العنوان بلا نقطة',()=>!blk('أدوات الرحلة')?.closest('ul,ol'),()=>blk('أدوات الرحلة'),'انقر في العنوان ← اضغط «تعداد نقطي» مرة ثانية لإلغائه')]});
const LS2=PIC({t:'التعداد الرقمي',goalImg:'img/m-ls2.png',skills:['ترقيم 1، 2، 3'],
 intro:'رقّم خطوات التجربة: 1، 2، 3.',
 setup:{html:PL(['<b>خطوات التجربة:</b>','املأ الكأس بالماء','ضع الملح','حرّك جيدًا'])},
 reqs:[Q('الخطوات مرقّمة 1، 2، 3',()=>['املأ','الملح','حرّك'].every(t=>{const o=liOf(t)?.closest('ol');return !!o&&!/abjad|roman|alpha|indic/.test(o.style.listStyleType)}),()=>blk('املأ'),'حدّد الخطوات الثلاث ← الصفحة الرئيسية ← ترقيم','numbering',{selText:'املأ'}),
  Q('العنوان بلا رقم',()=>!blk('خطوات التجربة')?.closest('ul,ol'),()=>blk('خطوات التجربة'),'انقر في العنوان ← اضغط «ترقيم» مرة ثانية لإلغائه')]});
LS2.reqs[0].fixFn=()=>['املأ','الملح','حرّك'].some(t=>liOf(t)?.closest('ul'))?'هذا تعداد نقطي — المطلوب ترقيم (أرقام).':null;
const LS3=PIC({t:'شكل النقطة ونوع الترقيم',goalImg:'img/m-ls3.png',skills:['مكتبة التعداد النقطي','مكتبة الترقيم: أ. ب. ج.'],
 intro:'غيّر شكل النقطة إلى ✓، واجعل الترقيم بالحروف: أ. ب. ج. (افتح السهم ▾ بجانب الزر)',
 setup:{html:'<p style="font-size:14pt"><b>المهام المنجزة:</b></p><ul style="font-size:14pt"><li>الواجب</li><li>القراءة</li><li>الرسم</li></ul><p style="font-size:14pt"><b>أسئلة الامتحان:</b></p><ol style="font-size:14pt"><li>عرّف الخلية</li><li>اذكر أجزاءها</li><li>ارسمها</li></ol>'},
 reqs:[Q('النقطة على شكل ✓',()=>/✓/.test(liOf('الواجب')?.closest('ul')?.style.listStyleType||''),()=>blk('الواجب'),'حدّد المهام ← سهم «تعداد نقطي» ▾ ← ✓','bullets',{selText:'الواجب',mi:['bullets','✓','✓']}),
  Q('الترقيم: أ. ب. ج.',()=>/abjad/.test(liOf('عرّف الخلية')?.closest('ol')?.style.listStyleType||''),()=>blk('عرّف'),'حدّد الأسئلة ← سهم «ترقيم» ▾ ← أ. ب. ج.','numbering',{selText:'عرّف الخلية',mi:['numbering','arabic-abjad','أ. ب. ج.']})]});
const LS4=PIC({t:'تعداد نقطي متعدد المستويات',goalImg:'img/m-ls4.png',skills:['Tab: مستوى أدنى','Shift + Tab: مستوى أعلى','زيادة المسافة البادئة'],
 intro:'اجعل «تفاح» و«موز» تحت «الفواكه»، و«جزر» و«بندورة» تحت «الخضار». انقر في أول السطر واضغط Tab (أو «زيادة المسافة البادئة»).',
 setup:{html:'<ul style="font-size:14pt"><li>الفواكه</li><li>تفاح</li><li>موز</li><li>الخضار</li><li>جزر</li><li>بندورة</li></ul>'},
 reqs:[...[['تفاح','الفواكه'],['موز','الفواكه'],['جزر','الخضار'],['بندورة','الخضار']].map(([w,par])=>Q(`«${w}» تحت «${par}»`,()=>depth(w)===2&&depth(par)===1&&(()=>{const T=firstBody().textContent;const iw=T.indexOf(w),ip=T.indexOf(par),io=T.indexOf(par==='الفواكه'?'الخضار':'\u0000');return iw>ip&&(par!=='الفواكه'||iw<io)})(),()=>liOf(w),`انقر في «${w}» ← اضغط Tab (أو الصفحة الرئيسية ← زيادة المسافة البادئة)`,'indentInc',{caretIn:1})),
  N(Q('«الفواكه» و«الخضار» في المستوى الأول',()=>depth('الفواكه')===1&&depth('الخضار')===1,()=>liOf('الخضار'),'أرجعه بـ Shift + Tab (أو إنقاص المسافة البادئة)','indentDec',{caretIn:1}),1)]});
const LS5=PIC({t:'ترقيم متعدد المستويات 1.1',goalImg:'img/m-ls5.png',skills:['قائمة متعددة المستويات','1. ثم 1.1.','Tab'],
 intro:'حدّد الأسطر ← قائمة متعددة المستويات (1. 1.1. 1.1.1.)، ثم اضغط Tab على الدروس لتصير 1.1 و 1.2.',
 setup:{html:PL(['الوحدة الأولى: الجداول','إدراج جدول','تنسيق جدول','الوحدة الثانية: الصور','إدراج صورة','قص الصورة'])},
 reqs:[Q('قائمة متعددة المستويات (1. 1.1.)',()=>{const t=topList('الوحدة الأولى');return !!t&&t.classList.contains('ml')&&['إدراج جدول','قص الصورة'].every(w=>topList(w)===t)},()=>blk('الوحدة الأولى'),'حدّد الأسطر الستة ← الصفحة الرئيسية ← قائمة متعددة المستويات ← 1. 1.1. 1.1.1.','multilevel',{selText:'الوحدة الأولى',mi:['multilevel','1','1. 1.1. 1.1.1.']}),
  ...['إدراج جدول','تنسيق جدول','إدراج صورة','قص الصورة'].map(w=>N(Q(`«${w}» في المستوى الثاني`,()=>depth(w)===2,()=>liOf(w)||blk(w),`انقر في «${w}» ← Tab`,'indentInc',{caretIn:1}),1)),
  Q('الوحدتان في المستوى الأول',()=>depth('الوحدة الأولى')===1&&depth('الوحدة الثانية')===1,()=>liOf('الوحدة الثانية')||blk('الوحدة الثانية'),'أرجعها بـ Shift + Tab','indentDec',{caretIn:1})]});
LS5.reqs[0].fixFn=()=>{const t=topList('الوحدة الأولى');if(t&&!t.classList.contains('ml'))return 'هذا ترقيم عادي — اختر «قائمة متعددة المستويات» من زرّها (بجانب الترقيم).';return null};

const hasB=(b,k)=>!!b&&!!b.style[{top:'borderTop',bottom:'borderBottom',left:'borderLeft',right:'borderRight'}[k]]&&!/none/.test(b.style[{top:'borderTop',bottom:'borderBottom',left:'borderLeft',right:'borderRight'}[k]]);
const PG1=PIC({t:'حدود الفقرة وتظليلها',goalImg:'img/m-pg1.png',skills:['حدود: حد سفلي','حدود خارجية','تظليل الفقرة'],
 intro:'ضع خطًّا تحت العنوان فقط، وإطارًا حول القاعدة مع تظليل أصفر فاتح.',
 setup:{html:`<p style="font-size:16pt"><b>قاعدة مهمة</b></p><p style="font-size:14pt">نغسل أيدينا بالماء والصابون قبل الأكل وبعده.</p><p><br></p>`},
 reqs:[Q('خط تحت العنوان',()=>{const b=blk('قاعدة مهمة');return hasB(b,'bottom')&&!hasB(b,'top')&&!hasB(b,'left')},()=>blk('قاعدة مهمة'),'انقر في العنوان ← الصفحة الرئيسية ← سهم «حدود» ▾ ← حد سفلي','pborders',{caretIn:1,mi:['pborders','bottom','حد سفلي']}),
  Q('إطار حول القاعدة',()=>{const b=blk('نغسل');return ['top','bottom','left','right'].every(k=>hasB(b,k))},()=>blk('نغسل'),'انقر في القاعدة ← حدود ▾ ← حدود خارجية','pborders',{caretIn:1,mi:['pborders','box','حدود خارجية']}),
  Q('تظليل أصفر فاتح',()=>{const c=blk('نغسل')?.style.backgroundColor;return !!c&&isCol(c,FAM(x=>x.h>=35&&x.h<=65&&x.l>=.6))},()=>blk('نغسل'),'انقر في القاعدة ← سهم «تظليل» ▾ ← أصفر فاتح','pshading',{caretIn:1})]});
const PG2=PIC({t:'اتجاه النص والمسافة البادئة',goalImg:'img/m-pg2.png',skills:['اتجاه النص من اليسار إلى اليمين','زيادة المسافة البادئة'],
 intro:'الجملة الإنجليزية يجب أن تبدأ من اليسار (اتجاه من اليسار إلى اليمين). وأزِح الاقتباس إلى الداخل بزيادة المسافة البادئة.',
 setup:{html:`<p style="font-size:14pt">تعلّمنا اليوم جملة بالإنجليزية:</p><p style="font-size:14pt">My name is Sara.</p><p style="font-size:14pt">قال المعلّم:</p><p style="font-size:14pt">«العلم في الصغر كالنقش على الحجر»</p>`},
 reqs:[Q('الإنجليزية من اليسار إلى اليمين',()=>getComputedStyle(blk('My name')).direction==='ltr',()=>blk('My name'),'انقر في الجملة ← الصفحة الرئيسية ← اتجاه النص من اليسار إلى اليمين','ltr',{caretIn:1}),
  Q('الاقتباس مُزاح إلى الداخل',()=>(parseFloat(blk('العلم في الصغر')?.style.marginRight)||0)>=40,()=>blk('العلم في الصغر'),'انقر في الاقتباس ← زيادة المسافة البادئة','indentInc',{caretIn:1}),
  N(Q('باقي الأسطر في مكانها',()=>!(parseFloat(blk('قال المعلّم')?.style.marginRight)>0)&&getComputedStyle(blk('تعلّمنا')).direction==='rtl',()=>blk('قال المعلّم'),'أرجعه: إنقاص المسافة البادئة / اتجاه من اليمين إلى اليسار'),1)]});
PG2.reqs[0].fixFn=()=>{const b=blk('My name');return b&&getComputedStyle(b).textAlign==='left'&&getComputedStyle(b).direction!=='ltr'?'المحاذاة لليسار لا تكفي — النقطة ستبقى في مكان خاطئ. استخدم زر «اتجاه النص من اليسار إلى اليمين».':null};
const PG3=PIC({t:'علامات التنسيق',goalImg:'img/m-pg3.png',skills:['إظهار/إخفاء ¶','· = مسافة','حذف المسافات الزائدة'],
 intro:'أظهر علامات التنسيق ¶ لترى المسافات (كل · مسافة). احذف المسافات الزائدة حتى تكون بين كل كلمتين مسافة واحدة.',
 setup:{html:`<p style="font-size:16pt">الماء   سرّ  الحياة،  فلا    تسرف   فيه.</p>`},
 reqs:[Q('علامات التنسيق ظاهرة',()=>!!S.marks,()=>$('#ribbon [data-panel="home"] [data-hid="marks"]'),'الصفحة الرئيسية ← ¶ (إظهار/إخفاء)','marks'),
  Q('مسافة واحدة بين الكلمات',()=>{const t=(blk('الماء')?.textContent||'').replace(/ /g,' ');return /الماء سرّ الحياة، فلا تسرف فيه/.test(t)&&!/  /.test(t.trim())},()=>blk('الماء'),'انقر بعد كل · زائدة واضغط Backspace')]});

/* ---- علامات التنسيق ↵ ¶ → ---- */
const MK1=PIC({t:'Enter و Shift+Enter و Tab',goalImg:'img/m-mk1.png',skills:['¶ فقرة جديدة = Enter','↵ سطر جديد في نفس الفقرة = Shift + Enter','→ جدولة = Tab','· مسافة'],
 intro:'أظهر علامات التنسيق ¶ لترى ما يحدث: ¶ نهاية فقرة (Enter)، ↵ سطر جديد داخل الفقرة نفسها (Shift + Enter)، → جدولة (Tab)، · مسافة. ثم: ضع Tab قبل «الصف»، وانزل بـ Shift + Enter قبل «شارع القدس»، وافصل «الفقرة الثانية» بـ Enter.',
 setup:{html:'<p style="font-size:16pt">الاسم: سارة الصف: السابع</p><p style="font-size:16pt">مدرسة الأمل شارع القدس</p><p style="font-size:16pt">الفقرة الأولى الفقرة الثانية</p>'},
 reqs:[Q('علامات التنسيق ظاهرة',()=>!!S.marks,()=>$('#ribbon [data-panel="home"] [data-hid="marks"]'),'الصفحة الرئيسية ← ¶ إظهار/إخفاء','marks'),
  Q('→ Tab قبل «الصف»',()=>{const b=blk('الاسم');if(!b)return false;const t=b.querySelector('.tabc');if(!t)return false;const r=document.createRange();r.selectNodeContents(b);r.setEndBefore(t);const before=r.toString();return before.includes('سارة')&&!before.includes('الصف')},()=>blk('الاسم'),'انقر قبل «الصف» مباشرة ← اضغط Tab'),
  Q('↵ «شارع القدس» في سطر جديد من نفس الفقرة',()=>{const b=blk('مدرسة الأمل');return !!b&&b.textContent.includes('شارع القدس')&&!!b.querySelector('br')},()=>blk('مدرسة الأمل'),'انقر قبل «شارع» ← اضغط Shift + Enter (وليس Enter وحدها)'),
  Q('¶ «الفقرة الثانية» فقرة مستقلة',()=>{const a=blk('الفقرة الأولى'),b=blk('الفقرة الثانية');return !!a&&!!b&&a!==b},()=>blk('الفقرة الأولى'),'انقر قبل «الفقرة الثانية» ← اضغط Enter')]});
MK1.reqs[2].fixFn=()=>{const a=blk('مدرسة الأمل'),b=blk('شارع القدس');return a&&b&&a!==b?'هذه فقرة جديدة (Enter) — ترى ¶ بعد «الأمل». تراجع (Ctrl + Z) واستخدم Shift + Enter.':null};
/* ---- النص التجريبي =rand و =lorem ---- */
const RD1=PIC({t:'نص تجريبي: ‎=rand و ‎=lorem',goalImg:'img/m-rd1.png',skills:['‎=rand(فقرات، جمل)','‎=lorem(فقرات، جمل)','Enter لتنفيذها'],
 intro:'حيلة في Word لتجربة التنسيق دون كتابة طويلة: اكتب في سطر فارغ ‎=rand(2,3)‎ ثم Enter → فقرتان في كل منهما 3 جمل. و ‎=lorem(1,2)‎ ثم Enter → فقرة بنص لاتيني تجريبي («لوريم إيبسوم»). اكتبها بلوحة المفاتيح الإنجليزية.',
 setup:{html:'<p><br></p>',caret:'.pg-body > p'},
 reqs:[Q('‎=rand(2,3)‎: فقرتان × 3 جمل',()=>logHas('rand:2,3')&&paras().filter(p=>p.textContent.trim()&&p.dir!=='ltr').length>=2,()=>paras()[0],'في السطر الفارغ اكتب ‎=rand(2,3)‎ ثم Enter'),
  Q('‎=lorem(1,2)‎: فقرة لاتينية',()=>logHas('rand:1,2')&&paras().some(p=>p.dir==='ltr'&&p.textContent.trim()),()=>paras().at(-1),'في السطر الفارغ الأخير اكتب ‎=lorem(1,2)‎ ثم Enter')]});
RD1.reqs[0].fixFn=()=>paras().some(p=>/^=?\s*(rand|ق)/i.test(p.textContent.trim())&&!/\)$/.test(p.textContent.trim()))?'اكتبها كاملة بالأقواس: ‎=rand(2,3)‎ — بلوحة إنجليزية.':null;
/* ---- التحديد ---- */
const SL1=PIC({t:'التحديد: كلمة، سطر، فقرة، الكل',goalImg:'img/m-sl1.png',skills:['كلمة: نقرتان عليها','سطر: نقرة في الهامش الأيمن بجانبه','فقرة: 3 نقرات داخلها (أو نقرتان في الهامش)','الكل: Ctrl + A'],
 intro:'تدرّب على التحديد — كل تحديد صحيح يُشطب وحده:\n• كلمة: انقر عليها نقرتين.\n• سطر: حرّك الفأرة إلى الهامش الأيمن حتى يصير السهم مائلًا ↖ ثم انقر بجانب السطر.\n• فقرة: انقر داخلها 3 نقرات سريعة (أو نقرتين في الهامش).\n• المستند كله: Ctrl + A.',
 setup:{html:`<p style="font-size:14pt">${PLONG}</p><p style="font-size:14pt">${PLONG2}</p>`,after:()=>SELSEEN.clear()},selTask:1,
 reqs:[Q('كلمة «الملوحة»',()=>SELSEEN.has('text:الملوحة'),()=>blk('الملوحة'),'انقر نقرتين على كلمة «الملوحة»'),
  Q('السطر الأول من الفقرة الأولى',()=>[...SELSEEN].some(k=>k.startsWith('line1:البحر')),()=>blk('البحر الميت'),'حرّك الفأرة إلى الهامش الأيمن بجانب السطر الأول (يصير السهم مائلًا) ثم انقر مرة'),
  Q('الفقرة الثانية كاملة',()=>[...SELSEEN].some(k=>k.startsWith('para:تشتهر')),()=>blk('تشتهر'),'انقر داخل الفقرة الثانية 3 نقرات سريعة'),
  Q('المستند كله',()=>SELSEEN.has('all'),()=>firstBody(),'اضغط Ctrl + A','selectAll')]});
const SL2=PIC({t:'متى أحدّد؟ الخط أم الفقرة',goalImg:'img/m-sl2.png',skills:['أوامر الخط: على المحدَّد فقط','أوامر الفقرة: على الفقرة كلها — يكفي المؤشر داخلها'],
 intro:'قاعدة مهمة:\n• أوامر «الخط» (غامق، لون، حجم…) تعمل على ما تحدّده فقط ← حدّد الكلمة بالضبط.\n• أوامر «الفقرة» (محاذاة، تعداد، مسافة بادئة، حدود…) تعمل على الفقرة كلها ← يكفي أن تنقر داخل الفقرة دون تحديد.\nلوّن «مهم» فقط بالأحمر، ثم وسّط الفقرة كلها بنقرة داخلها.',
 setup:{html:'<p style="font-size:16pt">هذا الدرس مهم جدًّا للامتحان.</p><p style="font-size:16pt">اقرأه في البيت.</p>'},
 reqs:[Q('«مهم» فقط حمراء',()=>fmtOf('مهم',e=>isCol(getComputedStyle(e).color,C_RED))&&!fmtOf('الدرس',e=>isCol(getComputedStyle(e).color,C_RED))&&!fmtOf('جدًّا',e=>isCol(getComputedStyle(e).color,C_RED)),()=>blk('مهم'),'حدّد «مهم» فقط (نقرتان عليها) ← لون الخط ← أحمر','fontcolor',TSEL('مهم')),
  Q('الفقرة الأولى في الوسط',()=>getComputedStyle(blk('مهم')).textAlign==='center',()=>blk('مهم'),'انقر في أي مكان داخل الفقرة ← توسيط — بلا تحديد','alignC',{caretIn:1}),
  N(Q('الفقرة الثانية كما هي',()=>getComputedStyle(blk('اقرأه')).textAlign!=='center',()=>blk('اقرأه'),'الثانية لم تكن مطلوبة — انقر فيها واضغط «محاذاة لليمين»'),1)]});
SL2.reqs[0].fixFn=()=>fmtOf('الدرس',e=>isCol(getComputedStyle(e).color,C_RED))||fmtOf('جدًّا',e=>isCol(getComputedStyle(e).color,C_RED))?'لوّنتَ أكثر من «مهم» — أوامر الخط تعمل على ما حدّدتَه. أرجع الباقي للأسود وحدّد «مهم» فقط.':null;

/* ===== تحدَّ نفسك: واجب كبير صعب في كل مهارات النص ===== */
const HW_LINES=['نشرة العلوم','مدرسة الأمل – الصف السابع','الماء سرّ الحياة','يتكوّن الماء من ذرتين من الهيدروجين وذرة من الأكسجين، وصيغته H2O. يغلي الماء عند 100 درجة، ويغطّي 71% من سطح الأرض، لذلك نسمّيها الكوكب الأزرق.','معلومة مهمة: نحتاج إلى شرب 8 أكواب من الماء يوميًّا.','فوائد الماء:','ينظّم حرارة الجسم','يساعد على الهضم','ينظّف الجسم من السموم','خطوات تجربة التبخّر:','ضع الماء في كأس','ضع الكأس تحت الشمس','راقب الماء بعد يومين','خطة البحث','الماء في الطبيعة','الأنهار','البحار','الماء في جسم الإنسان','الدم','Water is life.','«الماء أساس كل شيء حي»','إعداد: الطالبة سارة التاريخ: 2026'];
const lh=b=>b?(+b.style.lineHeight||parseFloat(getComputedStyle(b).lineHeight)/parseFloat(getComputedStyle(b).fontSize)):0;
const TXT_HW=PIC({t:'الواجب الكبير: نشرة العلوم',goalImg:'img/m-hw.png',skills:['الأنماط','الخط والتنسيق','مرتفع/منخفض','المحاذاة والتباعد','الحدود والتظليل','التعداد بكل أنواعه','الاتجاه والمسافة البادئة','Shift + Enter'],
 intro:'الكلام كله مكتوب بلا تنسيق. اجعله مثل الصورة تمامًا — كل المهارات التي تعلّمتها في هذا الموضوع. انظر جيدًا إلى كل سطر: النمط، المحاذاة، اللون، القوائم، الحدود…',
 setup:{html:HW_LINES.map(t=>`<p>${t}</p>`).join('')},
 reqs:[Q('«نشرة العلوم»: نمط «العنوان» في الوسط',()=>{const b=blk('نشرة العلوم');return !!b&&b.classList.contains('wtitle')&&getComputedStyle(b).textAlign==='center'},()=>blk('نشرة العلوم'),'انقر في السطر ← الأنماط ← العنوان ← ثم توسيط','styles',{caretIn:1,gal:['[data-cmd="style"][data-arg="title"]','اختر «العنوان»']}),
  Q('سطر المدرسة: في الوسط ومائل',()=>{const b=blk('مدرسة الأمل');return !!b&&getComputedStyle(b).textAlign==='center'&&fmtOf('مدرسة الأمل',isI)},()=>blk('مدرسة الأمل'),'وسّط السطر، وحدّده كله ← مائل'),
  Q('«الماء سرّ الحياة» و«خطة البحث»: عنوان 1',()=>blk('الماء سرّ الحياة')?.tagName==='H1'&&blk('خطة البحث')?.tagName==='H1',()=>blk('الماء سرّ الحياة'),'انقر في كل منهما ← الأنماط ← عنوان 1','styles',{caretIn:1,gal:['[data-cmd="style"][data-arg="h1"]','اختر «عنوان 1»']}),
  Q('الفقرة مضبوطة من الجهتين',()=>getComputedStyle(blk('يتكوّن الماء')).textAlign==='justify',()=>blk('يتكوّن الماء'),'انقر في الفقرة ← ضبط (Ctrl + J)','justify',{caretIn:1}),
  Q('تباعد أسطر الفقرة 1.5',()=>{const v=+blk('يتكوّن الماء')?.style.lineHeight||0;return v>=1.5*1.08-.05&&v<=1.5*1.08+.05},()=>blk('يتكوّن الماء'),'انقر في الفقرة ← تباعد الأسطر ← 1.5','linespacing',{caretIn:1,mi:['linespacing','1.5','1.5']}),
  Q('H₂O: الرقم منخفض',()=>{const M=charMap(),T=M.map(x=>x[0]).join('');const i=T.indexOf('H2O');return i>=0&&isSub(M[i+1][1])&&!isSub(M[i][1])},()=>blk('يتكوّن الماء'),'حدّد 2 فقط ← منخفض x₂','sub'),
  Q('«71%» غامقة حمراء',()=>fmtOf('71%',e=>isB(e)&&isCol(getComputedStyle(e).color,C_RED)),()=>blk('يتكوّن الماء'),'حدّد 71% ← غامق ← لون الخط أحمر','bold',TSEL('71%')),
  Q('المعلومة المهمة: إطار وتظليل أصفر',()=>{const b=blk('معلومة مهمة');return !!b&&['top','bottom','left','right'].every(k=>hasB(b,k))&&isCol(b.style.backgroundColor,FAM(x=>x.h>=35&&x.h<=65&&x.l>=.6))},()=>blk('معلومة مهمة'),'انقر في الفقرة ← حدود ▾ ← حدود خارجية، ثم تظليل ▾ ← أصفر فاتح','pborders',{caretIn:1,mi:['pborders','box','حدود خارجية']}),
  Q('«معلومة مهمة:» غامقة',()=>fmtOf('معلومة مهمة',isB)&&!fmtOf('نحتاج',isB),()=>blk('معلومة مهمة'),'حدّد «معلومة مهمة:» فقط ← غامق','bold',TSEL('معلومة مهمة')),
  Q('«فوائد الماء:» و«خطوات تجربة التبخّر:» غامقان وتحتهما خط',()=>['فوائد الماء','خطوات تجربة التبخّر'].every(w=>fmtOf(w,e=>isB(e)&&isU(e))),()=>blk('فوائد الماء'),'حدّد كل سطر ← غامق + تسطير'),
  Q('الفوائد الثلاث: تعداد بعلامة ✓',()=>['ينظّم','الهضم','السموم'].every(t=>/✓/.test(liOf(t)?.closest('ul')?.style.listStyleType||'')),()=>blk('ينظّم'),'حدّد الفوائد الثلاث ← سهم «تعداد نقطي» ▾ ← ✓','bullets',{selText:'ينظّم حرارة الجسم',mi:['bullets','✓','✓']}),
  Q('خطوات التجربة: ترقيم أ. ب. ج.',()=>['ضع الماء','تحت الشمس','راقب'].every(t=>/abjad/.test(liOf(t)?.closest('ol')?.style.listStyleType||'')),()=>blk('ضع الماء'),'حدّد الخطوات ← سهم «ترقيم» ▾ ← أ. ب. ج.','numbering',{selText:'ضع الماء في كأس',mi:['numbering','arabic-abjad','أ. ب. ج.']}),
  Q('خطة البحث: قائمة متعددة المستويات 1. و 1.1.',()=>{const t=topList('الماء في الطبيعة');return !!t&&t.classList.contains('ml')&&[['الماء في الطبيعة',1],['الأنهار',2],['البحار',2],['جسم الإنسان',1],['الدم',2]].every(([w,d])=>topList(w)===t&&depth(w)===d)},()=>blk('الماء في الطبيعة'),'حدّد الأسطر الخمسة ← قائمة متعددة المستويات ← ثم Tab على الأنهار والبحار والدم','multilevel',{selText:'الماء في الطبيعة',mi:['multilevel','1','1. 1.1. 1.1.1.']}),
  Q('«Water is life.» من اليسار إلى اليمين ومائلة',()=>{const b=blk('Water is life');return !!b&&getComputedStyle(b).direction==='ltr'&&fmtOf('Water is life',isI)},()=>blk('Water is life'),'انقر فيها ← اتجاه النص من اليسار إلى اليمين، ثم حدّدها ← مائل','ltr',{caretIn:1}),
  Q('الاقتباس مُزاح إلى الداخل ومميّز بالأصفر',()=>{const b=blk('أساس كل شيء');return !!b&&(parseFloat(b.style.marginRight)||0)>=40&&fmtOf('الماء أساس كل شيء حي',e=>isCol(hiOf(e),C_YEL))},()=>blk('أساس كل شيء'),'انقر فيه ← زيادة المسافة البادئة، ثم حدّده ← لون تمييز النص أصفر','indentInc',{caretIn:1}),
  Q('التوقيع: سطران في فقرة واحدة على اليسار',()=>{const b=blk('إعداد: الطالبة');return !!b&&b.textContent.includes('التاريخ')&&!!b.querySelector('br')&&['left','end'].includes(getComputedStyle(b).textAlign)},()=>blk('إعداد: الطالبة'),'انقر قبل «التاريخ» ← Shift + Enter، ثم محاذاة لليسار','alignL',{caretIn:1})]});
TXT_HW.reqs[15].fixFn=()=>{const a=blk('إعداد: الطالبة'),b=blk('التاريخ: 2026');return a&&b&&a!==b?'صار «التاريخ» فقرة جديدة (Enter). تراجع (Ctrl + Z) واستخدم Shift + Enter.':null};
MORE_PICS_T2=[['الكتابة',[TX1,MK1,RD1,TX2]],['التحديد',[SL1,SL2]],['الخط',[TX3,TX4,TX5,TX6,TX11]],['الفقرة: التعداد',[LS1,LS2,LS3,LS4,LS5]],['الفقرة: المحاذاة والاتجاه والحدود',[TX7,PG2,PG1]]];


/* ألوان محدّدة لـ «أرني» و«شاهد الحل» */
{const MI=(q,cmd,arg,l)=>{if(q)q.mi=[cmd,arg,l]};
 MI(TX5.reqs[0],'fontcolor','#ff0000','أحمر');MI(TX5.reqs[1],'highlight','#ffff00','أصفر');MI(TX5.reqs[2],'fontcolor','#0070c0','أزرق');
 MI(SL2.reqs[0],'fontcolor','#ff0000','أحمر');MI(SH2.reqs[0],'shapeFill','#ffff00','أصفر');MI(SH2.reqs[1],'shapeOutline','#ff0000','أحمر');
 MI(SH4.reqs[1],'shapeFill','#ed7d31','برتقالي');MI(SH5.reqs[2],'shapeFill','#ffff00','أصفر');MI(SH6.reqs[1],'shapeFill','#deebf6','أزرق فاتح');
 MI(IM4.reqs[1],'picBorder','#00b050','أخضر');MI(WA1.reqs[1],'textFill','#0070c0','أزرق');MI(WA2.reqs[0],'textFill','#00b050','أخضر');MI(WA3.reqs[1],'textFill','#7030a0','بنفسجي');
 MI(PG1.reqs[2],'pshading','#fff2cc','أصفر فاتح');}


{const ST2=(el,say,done,click)=>({el:typeof el==='string'?()=>$(el):el,say,done,click:click?1:0});
 const COLP=(n,line)=>[ST2('#wtabs [data-tab="layout"]','افتح «تخطيط»',()=>$('#wtabs [data-tab="layout"]')?.classList.contains('on')||!!$('#colN')),
  ST2(()=>{const b=$('#ribbon [data-panel="layout"] [data-hid="columns"]');return b&&((b.closest('.split')||b).querySelector('.car')||b)},'افتح قائمة «أعمدة» ▾',()=>!!$('.ddw.open')||!!$('#colN')),
  ST2(()=>$('.ddw.open [data-cmd="colMore"]'),'اختر «المزيد من الأعمدة...»',()=>!!$('#colN'),1),
  ST2(()=>$(`#dlgs .colpre[data-n="${n}"]`),`اختر «${n==='3'?'ثلاثة':'اثنان'}»`,()=>$('#colN')?.value===n,1),
  ...(line?[ST2('#colLn','ضع ✓ على «خط فاصل بين الأعمدة»',()=>!!$('#colLn')?.checked,1)]:[]),
  ST2('#dlgs .df .pri','اضغط «موافق»',null,1)];
 CO2.reqs[0].path=()=>COLP('3',true);CO2.reqs[1].path=()=>COLP('3',true);}


const picBy=k=>doc.querySelector(`.pg-body .obj.pic[data-pid="${({1:'tree',2:'sea',0:'mount',3:'fs'})[k]??k}"]`);
const IM9=PIC({t:'أنواع التفاف النص',goalImg:'img/m-pic9.png',skills:['مع النص','مربع','أعلى وأسفل','خلف النص','أمام النص'],
 intro:'في الصفحة 5 صور، ولكل صورة التفاف مختلف. انظر جيدًا إلى الصورة:\n• الشجرة والكلام بجانبها ← مربع\n• الوردة الكبيرة وحدها في سطر، والكلام فوقها وتحتها فقط ← أعلى وأسفل\n• البحر تحت الكلام كخلفية ← خلف النص\n• الجبال فوق الكلام تغطيه ← أمام النص\n• الوردة الصغيرة بين الكلمات ← مع النص\n(انقر على الصورة ← تنسيق الصورة ← التفاف النص)',
 setup:{html:`<p class="wtitle">التفاف النص</p><p id="pa"><br></p><p>${PLONG2} ${PLONG}</p><p id="pe">${PLONG2}</p><p id="pb"><br></p><p>${PLONG} ${PLONG2}</p><p id="pc"><br></p><p>${PLONG2}</p><p id="pd">أحبّ الزهور كثيرًا لأنها جميلة.</p>`,
  after:()=>{const tag=(sel,html,pid)=>{intoP(sel,html)();const o=firstBody().querySelector(sel+' .obj');if(o)o.dataset.pid=pid};tag('#pa',PIC_IN(1,150),'tree');tag('#pb',PIC_IN(2,260),'sea');tag('#pc',PIC_IN(0,200),'mount');
   {const p=firstBody().querySelector('#pe');const t=document.createElement('div');t.innerHTML=PIC_IN(3,120);const o=t.firstChild;o.dataset.pid='fb';const tn=[...p.childNodes].find(n=>n.nodeType===3);const i=tn.data.indexOf('وفيها');const rest=tn.splitText(i);p.insertBefore(o,rest);applyObj(o)}
   {const p=firstBody().querySelector('#pd');const t=document.createElement('div');t.innerHTML=PIC_IN(3,36);const o=t.firstChild;o.dataset.pid='fs';const tn=[...p.childNodes].find(n=>n.nodeType===3);const i=tn.data.indexOf('كثيرًا');const rest=tn.splitText(i);p.insertBefore(o,rest);rest.data=' '+rest.data;applyObj(o)}}},
 reqs:[Q('الشجرة: مربع (الكلام بجانبها)',()=>['square','tight','through'].includes(picBy('tree')?.dataset.wrap),()=>picBy('tree'),'انقر على الشجرة ← تنسيق الصورة ← التفاف النص ← مربع','wrap',{tab:'pformat',mi:['wrap','square','مربع']}),
  Q('الوردة الكبيرة: أعلى وأسفل',()=>picBy('fb')?.dataset.wrap==='topbottom',()=>picBy('fb'),'انقر على الوردة الكبيرة ← التفاف النص ← أعلى وأسفل','wrap',{tab:'pformat',mi:['wrap','topbottom','أعلى وأسفل']}),
  Q('البحر: خلف النص',()=>picBy('sea')?.dataset.wrap==='behind',()=>picBy('sea'),'انقر على صورة البحر ← التفاف النص ← خلف النص','wrap',{tab:'pformat',mi:['wrap','behind','خلف النص']}),
  Q('الجبال: أمام النص',()=>picBy('mount')?.dataset.wrap==='front',()=>picBy('mount'),'انقر على الجبال ← التفاف النص ← أمام النص','wrap',{tab:'pformat',mi:['wrap','front','أمام النص']}),
  N(Q('الوردة الصغيرة: مع النص (بين الكلمات)',()=>picBy('fs')?.dataset.wrap==='inline'&&!!picBy('fs')?.closest('p')?.textContent.includes('الزهور'),()=>picBy('fs'),'الوردة الصغيرة يجب أن تبقى «مع النص» بين الكلمات'),3)]});
IM9.reqs[0].fixFn=()=>{const w=picBy('tree')?.dataset.wrap;return w==='topbottom'?'«أعلى وأسفل» يجعل الكلام فوق الصورة وتحتها فقط — المطلوب الكلام بجانبها: «مربع».':null};
IM9.reqs[1].fixFn=()=>{const w=picBy('fb')?.dataset.wrap;return ['square','tight','through'].includes(w)?'هذا «مربع»: الكلام بجانب الوردة. المطلوب لا كلام بجانبها — فوقها وتحتها فقط: «أعلى وأسفل».':w==='inline'?'هي الآن «مع النص» (جزء من السطر). المطلوب «أعلى وأسفل».':null};
IM9.reqs[2].fixFn=()=>picBy('sea')?.dataset.wrap==='front'?'هذا «أمام النص» (الصورة تغطي الكلام). المطلوب أن يظهر الكلام فوق الصورة: «خلف النص».':null;
IM9.reqs[3].fixFn=()=>picBy('mount')?.dataset.wrap==='behind'?'هذا «خلف النص». المطلوب أن تغطي الصورة الكلام: «أمام النص».':null;

/* ---------- topics ---------- */
const MORE_PICS={
 t4:[['الرسم',[SH1,SH2,SH3]],['الأسهم ومربع النص',[SH4,SH5]],['التفاف النص والموضع',[SW1,SW2,SW3,SH6]]],
 t10:[['الإدراج والحجم',[IM1,IM2,IM6]],['أنماط الصورة',[IM4,IM7]],['الترتيب',[IM3,IM9,IM5,IM8]]],
 t11:[['WordArt',[WA1,WA2,WA3]]],
 t6:[['الرأس والتذييل',[HF1,HF2,HF6,HF5]],['ترقيم الصفحات',[HF3,HF4]]],
 t8:[['الرموز',[SY1,SY2]],['التاريخ',[DT1,DT2]],['المعادلات',[EQ1,EQ2,EQ3]]],
 t9:[['الأعمدة',[CO1,CO2,CO3]]],
};
const MORE_IMG={IM1:'m-pic1',IM2:'m-pic2',IM3:'m-pic3',IM4:'m-pic4',IM5:'m-pic5',IM6:'m-pic6',IM7:'m-pic7',IM8:'m-pic8',IM9:'m-pic9',SH1:'m-shp1',SH2:'m-shp2',SH3:'m-shp3',SH4:'m-shp4',SH5:'m-shp5',SH6:'m-shp6',SW1:'m-sw1',SW2:'m-sw2',SW3:'m-sw3',WA1:'m-wa1',WA2:'m-wa2',WA3:'m-wa3',HF1:'m-hf1',HF2:'m-hf2',HF3:'m-hf3',HF4:'m-hf4',HF5:'m-hf5',HF6:'m-hf6',SY1:'m-sym1',SY2:'m-sym2',DT1:'m-date1',DT2:'m-date2',EQ1:'m-eq1',EQ2:'m-eq2',EQ3:'m-eq3',CO1:'m-col1',CO2:'m-col2',CO3:'m-col3'};
Object.assign(MORE_IMG,{TXT_HW:'m-hw',MK1:'m-mk1',RD1:'m-rd1',SL1:'m-sl1',SL2:'m-sl2',PG1:'m-pg1',PG2:'m-pg2',PG3:'m-pg3',LS1:'m-ls1',LS2:'m-ls2',LS3:'m-ls3',LS4:'m-ls4',LS5:'m-ls5',TX1:'m-tx1',TX2:'m-tx2',TX3:'m-tx3',TX4:'m-tx4',TX5:'m-tx5',TX6:'m-tx6',TX7:'m-tx7',TX8:'m-tx8',TX9:'m-tx9',TX10:'m-tx10',TX11:'m-tx11',TX12:'m-tx12',BA0:'m-b0',BA1:'m-b1',BA2:'m-b2',BA3:'m-b3',BA4:'m-b4',BA5:'m-b5',BA6:'m-b6',BA7:'m-b7'});
var MORE_PICS_T2;
(function(){
 if(MORE_PICS_T2)MORE_PICS.t2=MORE_PICS_T2;
 {const t2=TOPICS.find(t=>t.id==='t2');if(t2&&typeof TXT_HW!=='undefined')t2.tasks=[['S',TXT_HW]]}
 if(typeof BA1!=='undefined')MORE_PICS.t1=[['البرنامج والمستند',[BA1,BA2,BA3]],['الواجهة',[BA0,BA4]],['الحفظ',[BA5,BA6,BA7]]];
 const byId=id=>TOPICS.find(t=>t.id===id);
 {const i4=TOPICS.findIndex(t=>t.id==='t4');if(!byId('t10'))TOPICS.splice(i4+1,0,{id:'t10',num:'',title:'الصور',sub:'إدراج، حجم، أنماط، ترتيب',icon:'pictures',learn:()=>[],tasks:[]},{id:'t11',num:'',title:'WordArt',sub:'كتابة فنية ملوّنة بتأثيرات',icon:'wordart',learn:()=>[],tasks:[]})}
 if(!byId('t9'))TOPICS.push({id:'t9',num:'9',title:'الأعمدة',sub:'عمودان أو ثلاثة كالجريدة، وفاصل العمود',icon:'columns'});
 Object.entries(MORE_PICS).forEach(([id,groups])=>{const t=byId(id);if(!t)return;t.learnTitle='🖼️ صمّم مثل الصورة';
  t.learn=()=>groups.flatMap(([g,arr])=>arr.map(p=>{const r=['S',p];r.g=g;return r}));
  if(id==='t9'||id==='t10'||id==='t11')t.tasks=[];
 });
 const t4=byId('t4');if(t4){t4.title='الأشكال';t4.sub='شكل، تعبئة وحدود، أسهم، مربع نص';t4.icon='shapes';t4.tasks=[]}
 TOPICS.forEach((t,i)=>{t.num=String(i+1)})
})();
