const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const CM=37.8; // px per cm at 100% (96dpi)

/* sample pictures (drawn SVG) — each has a version without background for "remove background" */
const _svg=(bg,fg)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">${bg}${fg}</svg>`;
const IMG_PARTS=[
 [`<defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ec8f2"/><stop offset="1" stop-color="#d8f0fb"/></linearGradient></defs><rect width="600" height="400" fill="url(#a)"/><circle cx="460" cy="95" r="48" fill="#ffd34d"/>`,`<path d="M0 300L120 170L230 280L330 150L470 300L600 210V400H0Z" fill="#5f8f6b"/><path d="M0 340Q150 290 300 335T600 320V400H0Z" fill="#87b56b"/>`],
 [`<rect width="600" height="400" fill="#fdf1d6"/><path d="M0 310Q300 250 600 310V400H0Z" fill="#c9a66b"/>`,`<rect x="285" y="190" width="30" height="140" fill="#7a5230"/><g fill="#6d8b3a"><circle cx="300" cy="160" r="70"/><circle cx="240" cy="190" r="50"/><circle cx="360" cy="190" r="50"/><circle cx="300" cy="110" r="45"/></g><g fill="#3e4a1f"><circle cx="270" cy="150" r="6"/><circle cx="330" cy="175" r="6"/><circle cx="300" cy="125" r="6"/><circle cx="250" cy="200" r="6"/><circle cx="355" cy="140" r="6"/></g>`],
 [`<rect width="600" height="400" fill="#ffb877"/><circle cx="300" cy="230" r="80" fill="#ff7b39"/><rect y="230" width="600" height="170" fill="#2d6fa3"/>`,`<g stroke="#9fd0f2" stroke-width="5" fill="none" stroke-linecap="round"><path d="M60 280q30-15 60 0t60 0"/><path d="M330 300q30-15 60 0t60 0"/><path d="M160 340q30-15 60 0t60 0"/><path d="M420 360q30-15 60 0"/></g>`],
 [`<rect width="600" height="400" fill="#e9f3e1"/>`,`<g transform="translate(300 210)"><g fill="#f06292">${Array.from({length:8},(_,i)=>`<ellipse rx="34" ry="78" transform="rotate(${i*45}) translate(0 -70)"/>`).join('')}</g><circle r="44" fill="#ffca28"/></g><rect x="295" y="300" width="10" height="100" fill="#4caf50"/>`],
];
const enc=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
const SAMPLE_IMGS=IMG_PARTS.map(p=>enc(_svg(p[0],p[1])));
const SAMPLE_NOBG=IMG_PARTS.map(p=>enc(_svg('',p[1])));

/* shapes */
const SHAPE_NAMES={rect:'مستطيل',roundRect:'مستطيل مستدير الزوايا',oval:'شكل بيضاوي',tri:'مثلث متساوي الساقين',star:'نجمة: 5 نقاط',star6:'نجمة: 6 نقاط',arrowR:'سهم: لليمين',arrowL:'سهم: لليسار',arrowU:'سهم: لأعلى',arrowD:'سهم: لأسفل',line:'خط',arrowLine:'رابط سهم مستقيم',diamond:'معين',hexagon:'سداسي',heart:'قلب',smiley:'وجه ضاحك',cloud:'سحابة',moon:'قمر',burst:'انفجار',ribbon:'شريط',callout:'وسيلة شرح: مستطيل',textbox:'مربع نص'};
function shapePath(k,w,h){
  const s=(x)=>x*w, t=(y)=>y*h; const P=(pts)=>'M'+pts.map(p=>`${s(p[0]).toFixed(1)} ${t(p[1]).toFixed(1)}`).join('L')+'Z';
  const star=(n,ri)=>{const pts=[];for(let i=0;i<n*2;i++){const a=-Math.PI/2+i*Math.PI/n, r=i%2?ri:.5;pts.push([.5+r*Math.cos(a),.5+r*Math.sin(a)])}return P(pts)};
  switch(k){
    case 'rect':case 'textbox':case 'wordart':return `M0 0H${w}V${h}H0Z`;
    case 'roundRect':{const r=Math.min(w,h)*.18;return `M${r} 0H${w-r}Q${w} 0 ${w} ${r}V${h-r}Q${w} ${h} ${w-r} ${h}H${r}Q0 ${h} 0 ${h-r}V${r}Q0 0 ${r} 0Z`}
    case 'oval':return `M0 ${h/2}A${w/2} ${h/2} 0 1 0 ${w} ${h/2}A${w/2} ${h/2} 0 1 0 0 ${h/2}Z`;
    case 'tri':return P([[.5,0],[1,1],[0,1]]);
    case 'diamond':return P([[.5,0],[1,.5],[.5,1],[0,.5]]);
    case 'hexagon':return P([[.25,0],[.75,0],[1,.5],[.75,1],[.25,1],[0,.5]]);
    case 'star':return star(5,.2);
    case 'star6':return star(6,.3);
    case 'burst':return star(12,.36);
    case 'arrowR':return P([[0,.3],[.6,.3],[.6,0],[1,.5],[.6,1],[.6,.7],[0,.7]]);
    case 'arrowL':return P([[1,.3],[.4,.3],[.4,0],[0,.5],[.4,1],[.4,.7],[1,.7]]);
    case 'arrowU':return P([[.3,1],[.3,.4],[0,.4],[.5,0],[1,.4],[.7,.4],[.7,1]]);
    case 'arrowD':return P([[.3,0],[.3,.6],[0,.6],[.5,1],[1,.6],[.7,.6],[.7,0]]);
    case 'heart':return `M${w/2} ${h*.95}C${-w*.25} ${h*.45} ${w*.15} ${-h*.15} ${w/2} ${h*.25}C${w*.85} ${-h*.15} ${w*1.25} ${h*.45} ${w/2} ${h*.95}Z`;
    case 'cloud':return `M${s(.25)} ${t(.85)}A${s(.2)} ${t(.2)} 0 0 1 ${s(.2)} ${t(.45)}A${s(.2)} ${t(.25)} 0 0 1 ${s(.5)} ${t(.2)}A${s(.2)} ${t(.2)} 0 0 1 ${s(.85)} ${t(.4)}A${s(.17)} ${t(.22)} 0 0 1 ${s(.8)} ${t(.85)}Z`;
    case 'moon':return `M${s(.7)} ${t(.05)}A${s(.48)} ${t(.48)} 0 1 0 ${s(.7)} ${t(.95)}A${s(.38)} ${t(.45)} 0 1 1 ${s(.7)} ${t(.05)}Z`;
    case 'smiley':return `M0 ${h/2}A${w/2} ${h/2} 0 1 0 ${w} ${h/2}A${w/2} ${h/2} 0 1 0 0 ${h/2}Z`;
    case 'ribbon':return P([[0,.2],[.15,.2],[.15,0],[.85,0],[.85,.2],[1,.2],[.9,.5],[1,.8],[.85,.8],[.85,1],[.15,1],[.15,.8],[0,.8],[.1,.5]]);
    case 'callout':return P([[0,0],[1,0],[1,.7],[.45,.7],[.25,1],[.3,.7],[0,.7]]);
    case 'line':case 'arrowLine':return `M0 ${h/2}H${w}`;
  }
  return `M0 0H${w}V${h}H0Z`;
}
function shapeExtra(k,w,h){if(k==='smiley')return `<circle cx="${w*.35}" cy="${h*.38}" r="${Math.min(w,h)*.05}" fill="currentColor"/><circle cx="${w*.65}" cy="${h*.38}" r="${Math.min(w,h)*.05}" fill="currentColor"/><path d="M${w*.3} ${h*.62}Q${w*.5} ${h*.8} ${w*.7} ${h*.62}" fill="none" stroke="currentColor" stroke-width="2"/>`;if(k==='arrowLine')return `<path d="M${w-10} ${h/2-6}L${w} ${h/2}L${w-10} ${h/2+6}" fill="none" stroke="currentColor" stroke-width="2"/>`;return ''}
function shapeIcon(k){const isL=k==='line'||k==='arrowLine';return `<svg viewBox="-2 -2 28 28" width="22" height="22"><path d="${shapePath(k,24,isL?24:24)}" fill="${isL?'none':'#dbe8f7'}" stroke="#2b579a" stroke-width="1.5"/>${k==='arrowLine'?'<path d="M18 7L24 12L18 17" fill="none" stroke="#2b579a" stroke-width="1.5"/>':''}</svg>`}
function wrapIcon(w){const tl=`<path d="M3 5h26M3 27h26" stroke="#444" stroke-width="1.6"/>`;const m={inline:`${tl}<rect x="12" y="11" width="9" height="9" fill="#9cc3e6" stroke="#2b579a"/><path d="M3 20h8M22 20h7" stroke="#444" stroke-width="1.6"/>`,square:`${tl}<rect x="11" y="10" width="10" height="11" fill="#9cc3e6" stroke="#2b579a"/><path d="M3 12h6M3 16h6M3 20h6M23 12h6M23 16h6M23 20h6" stroke="#444" stroke-width="1.6"/>`,tight:`${tl}<circle cx="16" cy="16" r="6" fill="#9cc3e6" stroke="#2b579a"/><path d="M3 12h7M3 16h6M3 20h7M22 12h7M23 16h6M22 20h7" stroke="#444" stroke-width="1.6"/>`,through:`${tl}<circle cx="16" cy="16" r="6" fill="#9cc3e6" stroke="#2b579a"/><path d="M3 16h26" stroke="#444" stroke-width="1.6"/>`,topbottom:`${tl}<rect x="11" y="10" width="10" height="11" fill="#9cc3e6" stroke="#2b579a"/>`,behind:`<rect x="10" y="8" width="12" height="16" fill="#9cc3e6" stroke="#2b579a"/><path d="M3 10h26M3 16h26M3 22h26" stroke="#444" stroke-width="1.6"/>`,front:`<path d="M3 10h26M3 16h26M3 22h26" stroke="#444" stroke-width="1.6"/><rect x="10" y="8" width="12" height="16" fill="#9cc3e6" stroke="#2b579a"/>`};return `<svg class="ic" viewBox="0 0 32 32" width="20" height="20">${m[w]||''}</svg>`}

/* galleries data */
const STYLE_LIST=[
 {id:'normal',name:'عادي',css:''},{id:'nospace',name:'بلا تباعد',css:''},{id:'h1',name:'عنوان 1',css:'color:#2f5496;font-size:15px'},
 {id:'h2',name:'عنوان 2',css:'color:#2f5496;font-size:13px'},{id:'title',name:'العنوان',css:'font-size:17px;font-weight:300'},{id:'subtitle',name:'عنوان فرعي',css:'color:#5a5a5a;font-size:12px'},
 {id:'quote',name:'اقتباس',css:'font-style:italic;color:#404040'},{id:'strong',name:'قوي',css:'font-weight:700'}];
const TSTYLES=[
 {name:'شبكة جدول',h:'#fff',b1:'#fff',b2:'#fff',l:'#000'},{name:'جدول شبكة 4 - تمييز 1',h:'#4472c4',b1:'#d9e2f3',b2:'#fff',l:'#8eaadb'},
 {name:'جدول شبكة 4 - تمييز 2',h:'#ed7d31',b1:'#fbe4d5',b2:'#fff',l:'#f4b083'},{name:'جدول شبكة 4 - تمييز 6',h:'#70ad47',b1:'#e2efd9',b2:'#fff',l:'#a8d08d'},
 {name:'جدول قائمة 3',h:'#000',b1:'#fff',b2:'#fff',l:'#000'},{name:'جدول شبكة 5 داكن',h:'#7030a0',b1:'#d9c3e9',b2:'#e8dbf3',l:'#fff'},
 {name:'جدول عادي 4',h:'#fff',b1:'#f2f2f2',b2:'#fff',l:'#fff'}];
const PSTYLES=[{id:'none',name:'بلا'},{id:'simple',name:'إطار بسيط، أبيض'},{id:'shadow',name:'مستطيل مظلل'},{id:'rounded',name:'مستطيل مستدير مظلل'},{id:'oval',name:'بيضاوي ناعم الحواف'},{id:'thick',name:'إطار سميك، أسود'},{id:'reflect',name:'مستطيل ذو انعكاس'}];
const SSTYLES=[{name:'تعبئة ملونة - أزرق',fill:'#4472c4',line:'#2f528f',text:'#fff'},{name:'برتقالي',fill:'#ed7d31',line:'#ae5a21',text:'#fff'},{name:'رمادي',fill:'#a5a5a5',line:'#787878',text:'#fff'},{name:'ذهبي',fill:'#ffc000',line:'#bc8c00',text:'#000'},{name:'أخضر',fill:'#70ad47',line:'#507e32',text:'#fff'},{name:'مخطط فقط',fill:'#ffffff',line:'#4472c4',text:'#000'}];
const WA_STYLES=[
 {name:'تعبئة: أسود، مخطط: أبيض، ظل',css:'color:#000;text-shadow:2px 2px 3px rgba(0,0,0,.35)',fill:'#000',out:'',fx:'shadow'},
 {name:'تعبئة: أزرق، تمييز 1، ظل',css:'color:#4472c4;text-shadow:2px 2px 2px rgba(0,0,0,.3)',fill:'#4472c4',out:'',fx:'shadow'},
 {name:'تعبئة: برتقالي، تمييز 2، مخطط',css:'color:#ed7d31;-webkit-text-stroke:1px #843c0c',fill:'#ed7d31',out:'#843c0c',fx:''},
 {name:'تعبئة: أبيض، مخطط أزرق، توهج',css:'color:#fff;-webkit-text-stroke:1px #4472c4;text-shadow:0 0 6px #5b9bd5',fill:'#fff',out:'#4472c4',fx:'glow'},
 {name:'تعبئة: ذهبي، تمييز 4، انعكاس',css:'color:#ffc000;-webkit-text-stroke:1px #7f6000',fill:'#ffc000',out:'#7f6000',fx:'reflection'},
 {name:'تعبئة: أخضر، مخطط داكن',css:'color:#70ad47;-webkit-text-stroke:1px #375623',fill:'#70ad47',out:'#375623',fx:''},
 {name:'تعبئة: رمادي، ظل داخلي',css:'color:#7f7f7f;text-shadow:1px 1px 0 #fff,2px 2px 2px #000',fill:'#7f7f7f',out:'',fx:'shadow'},
 {name:'تعبئة: بنفسجي، توهج',css:'color:#7030a0;text-shadow:0 0 6px #c9a0dc',fill:'#7030a0',out:'',fx:'glow'},
];
const TEXT_FX=[{name:'تعبئة أزرق ظل',css:'color:#4472c4;text-shadow:2px 2px 2px rgba(0,0,0,.3)'},{name:'مخطط',css:'color:#fff;-webkit-text-stroke:1px #000'},{name:'توهج',css:'color:#c00000;text-shadow:0 0 6px #ffc000'},{name:'برتقالي',css:'color:#ed7d31;-webkit-text-stroke:1px #843c0c'},{name:'رمادي',css:'color:#7f7f7f;text-shadow:1px 1px 0 #fff,2px 2px 2px #000'}];
const COVERS=['أوستن','الشريط الجانبي','سيماك','فاصل'];
const HF_STYLES=['فارغ','فارغ (ثلاثة أعمدة)','أوستن','خط الفاصل'];
const PN_POS=[['right'],['center'],['left']];
const THEMES=[
 {name:'نسق Office',c:['#4472c4','#ed7d31','#70ad47'],f:'Arial'},{name:'شريط الأيونات',c:['#0f6fc6','#009dd9','#0bd0d9'],f:'Tahoma'},
 {name:'الشبكة',c:['#c00000','#ffc000','#7f7f7f'],f:'Times New Roman'},{name:'الشريحة',c:['#7030a0','#e84c22','#ffbd47'],f:'Traditional Arabic'},
 {name:'المقاطعة',c:['#2e7d32','#a1887f','#ffb300'],f:'Simplified Arabic'},{name:'المدار',c:['#00838f','#f06292','#9e9d24'],f:'Sakkal Majalla'}];
const MARGINS=[{id:'normal',name:'عادية',t:2.54,b:2.54,r:2.54,l:2.54},{id:'narrow',name:'ضيقة',t:1.27,b:1.27,r:1.27,l:1.27},{id:'moderate',name:'متوسطة',t:2.54,b:2.54,r:1.91,l:1.91},{id:'wide',name:'واسعة',t:2.54,b:2.54,r:5.08,l:5.08},{id:'mirrored',name:'معكوسة',t:2.54,b:2.54,r:3.18,l:2.54}];
const PSIZES=[{id:'A4',name:'A4',w:21,h:29.7},{id:'A5',name:'A5',w:14.8,h:21},{id:'Letter',name:'Letter',w:21.59,h:27.94},{id:'Legal',name:'Legal',w:21.59,h:35.56},{id:'A3',name:'A3',w:29.7,h:42}];
const PIC_COLORS=[{name:'بلا إعادة تلوين',f:'none'},{name:'تدرّج رمادي',f:'grayscale(1)'},{name:'بنّي داكن',f:'sepia(1)'},{name:'غسيل',f:'contrast(.45) brightness(1.4)'},{name:'أسود وأبيض',f:'grayscale(1) contrast(3)'},{name:'أزرق',f:'grayscale(1) sepia(1) hue-rotate(180deg) saturate(2)'},{name:'تشبّع عالٍ',f:'saturate(2.2)'}];
const ARTISTIC=[{name:'بلا',f:'none'},{name:'ضبابية',f:'blur(2px)'},{name:'رسم بالقلم',f:'grayscale(1) contrast(2.2) brightness(1.2)'},{name:'سالب',f:'invert(1)'},{name:'ألوان باهتة',f:'saturate(.4) brightness(1.1)'},{name:'متوهج',f:'saturate(1.8) contrast(1.3) brightness(1.1)'}];
const EQ_SYMS=['±','∞','=','≠','~','×','÷','!','∝','<','≪','>','≫','≤','≥','∓','≅','≈','≡','∀','∁','∂','√','∛','∜','∪','∩','∅','%','°','℉','℃','∆','∇','∃','∄','∈','∋','←','↑','→','↓','↔','∴','+','−','¬','α','β','γ','δ','ε','θ','λ','μ','π','ρ','σ','τ','φ','ω'];
const EQ_READY=[
 {name:'مساحة الدائرة',html:'<i>A</i>=<i>π</i><i>r</i><sup>2</sup>'},
 {name:'نظرية فيثاغورس',html:'<i>a</i><sup>2</sup>+<i>b</i><sup>2</sup>=<i>c</i><sup>2</sup>'},
 {name:'الصيغة التربيعية',html:'<i>x</i>=<span class="fr"><span>−<i>b</i>±√(<i>b</i><sup>2</sup>−4<i>ac</i>)</span><span>2<i>a</i></span></span>'},
];
const SYMBOLS_ALL=['©','®','™','°','±','×','÷','≠','≤','≥','≈','∞','√','π','€','£','¥','$','¢','§','¶','†','‡','•','…','‰','←','→','↑','↓','↔','½','¼','¾','⅓','²','³','µ','Ω','α','β','γ','Δ','θ','λ','Σ','φ','ψ','☺','☻','♥','♦','♣','♠','★','☆','✓','✗','✔','☎','✉','✈','☀','☁','☂','♪','♫','﷼','٪','؟','،','؛','٭'];
window.SYM_RECENT=['€','£','¥','©','®','™','±','≠','≤','≥','÷','×','∞','µ','α','β','π','Ω','∑','☺'];
const SYM_NAMES={'°':'علامة درجة','÷':'علامة القسمة','×':'علامة الضرب','©':'علامة حقوق النشر','®':'علامة مسجّلة','™':'علامة تجارية','±':'زائد أو ناقص','≠':'لا يساوي','π':'باي'};

/* Arabic sample text for =rand() */
const RAND_SENT=['يمكنك استخدام هذه الميزة لإدراج نص تجريبي في المستند بسرعة.','تساعدك الأنماط الجاهزة على تنسيق العناوين والفقرات بنقرة واحدة.','انقر على تبويب «إدراج» لإضافة صورة أو جدول أو شكل إلى صفحتك.','عند النقر على صورة يظهر تبويب «تنسيق الصورة» بأوامر خاصة بها.','لحفظ عملك اضغط Ctrl + S أو انقر زر الحفظ في شريط الوصول السريع.','يغيّر تبويب «تصميم» شكل المستند كله من خلال النُسُق والألوان.','لترتيب البيانات في صفوف وأعمدة أدرج جدولًا من تبويب «إدراج».','يمكنك معاينة المستند قبل طباعته من قائمة «ملف» ثم «طباعة».'];
const LOREM_SENT=['Lorem ipsum dolor sit amet, consectetur adipiscing elit.','Maecenas porttitor congue massa.','Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero.','Nunc viverra imperdiet enim.','Fusce est. Vivamus a tellus.','Pellentesque habitant morbi tristique senectus et netus.'];
const LOREM='تقع مدينة أريحا في غور الأردن، وهي من أقدم المدن المأهولة في العالم. تشتهر بمناخها الدافئ شتاءً وبأشجار النخيل والموز والحمضيات، ويزورها الناس للاستمتاع بالشمس والهواء النقي، ولزيارة قصر هشام وتل السلطان.';
