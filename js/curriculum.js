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
 {id:'t5',num:'5',title:'الجداول',sub:'إدراج، تنقّل، تصميم، دمج',icon:'table',
  learn:[['P','e7',0],['P','e7',1],['P','e7',2],['P','e7',3],['P','e7',4],['P','e7',5]],
  tasks:[['PR','e7',0],['X','e7']]},
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
function buildTopic(t){
  if(t.lessons)return t.lessons;
  const mk=(r,kind)=>{const [k,a,b,c]=r;let l=null;
    if(k==='P')l={...UF[a].practice[b]};
    if(k==='PR')l={...PROBLEMS[a][b],problem:1};
    if(k==='X'){const X=EXAMS[a];l={...X,kind:'do',steps:[],check:()=>X.reqs.every(q=>{try{return !!q.check()}catch(e){return false}})}}
    if(k==='FONT')l=FONT_LESSON();
    if(k==='C'){const card=UF[a].explore.find(x=>x.t===b);l=cmdLesson(UF[a],card);if(c)l.t=c}
    if(!l)return null;if(!l.kind||l.kind==='cmd')l.kind=kind==='learn'?'learn':(l.kind||'task');if(l.kind!=='do')l.kind=kind==='learn'?'learn':'task';return l};
  t.lessons=[...t.learn.map((r,i)=>({...mk(r,'learn'),key:'l'+i})),...t.tasks.map((r,i)=>({...mk(r,'task'),key:'t'+i}))].filter(l=>l.t);
  return t.lessons;
}
