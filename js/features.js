/* ================= Commands: text, page, design, layout, references, review, view ================= */
const ex=(c,v=null)=>{try{return document.execCommand(c,false,v)}catch(e){return false}};
function needDoc(){if(S.app!=='doc'){simToast('افتح مستندًا أولًا');return false}return true}
function inText(){return S.range&&editHost(S.range.startContainer)&&doc.contains(S.range.startContainer)}
function needSel(msg){if(!inText()){simToast(msg||'ضع المؤشر داخل النص أولًا');return false}restoreSel();return true}
/* wrap the current selection in spans with given css (uses the font-size 7 trick) */
function styleSel(css){
  if(!needSel())return;const r=S.range;
  if(r.collapsed){simToast('حدِّد النص أولًا، ثم نسِّق');return}
  ex('styleWithCSS',false);ex('fontSize','7');
  const host=editHost(r.startContainer)||doc;
  const made=[];host.querySelectorAll('font[size="7"]').forEach(f=>{const s=document.createElement('span');s.style.cssText=css;s.innerHTML=f.innerHTML;f.replaceWith(s);made.push(s)});
  host.querySelectorAll('span[style*="xxx-large"]').forEach(s=>{s.style.fontSize='';s.style.cssText+=';'+css;made.push(s)});
  if(made.length){const rr=document.createRange();rr.setStartBefore(made[0]);rr.setEndAfter(made[made.length-1]);const sl=getSelection();sl.removeAllRanges();sl.addRange(rr);S.range=rr.cloneRange()}
}
function curPt(){const r=S.range;if(!r)return 11;const n=r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement;return Math.round(parseFloat(getComputedStyle(n).fontSize)*.75*2)/2}
const SIZES=[8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];
let lastHilite='#ffff00',lastFore='#ff0000';
Object.assign(OPS,{
  /* window & file */
  save(){if(S.app!=='doc')return;if(S.file.where)saveFile();else openBackstage('saveas')},
  undo(){undo()},redo(){redo()},
  minWin(){minimizeWin()},maxWin(){simToast('النافذة مكبّرة بالفعل')},
  closeWin(){if(S.app==='desktop')return;confirmSave(()=>{showDesktop();S.app='desktop'})},
  share(){simToast('مشاركة: للعرض فقط')},openCmd(){openBackstage('open')},newCmd(){openBackstage('new')},print(){if(S.app==='doc')openBackstage('print')},
  /* clipboard */
  copy(){if(!needSel())return;const r=S.range;if(r.collapsed){simToast('حدِّد النص أولًا');return}const d=document.createElement('div');d.appendChild(r.cloneContents());S.clip={html:d.innerHTML,text:r.toString()};ex('copy');simToast('تم النسخ');logAct('copy')},
  cut(){if(!needSel())return;const r=S.range;if(r.collapsed){simToast('حدِّد النص أولًا');return}snap();const d=document.createElement('div');d.appendChild(r.cloneContents());S.clip={html:d.innerHTML,text:r.toString()};ex('delete');logAct('cut')},
  paste(arg){if(!S.clip){simToast('الحافظة فارغة — انسخ نصًّا أولًا');return}if(!needSel())return;snap();if(arg==='text')ex('insertText',S.clip.text);else ex('insertHTML',S.clip.html);logAct('paste:'+(arg||'keep'))},
  painter(){if(!needSel())return;const r=S.range;const n=r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement;const cs=getComputedStyle(n);
    const now=Date.now();const sticky=S.painter&&now-(S.painterT||0)<450;S.painterT=now;
    S.painter={css:`font-weight:${cs.fontWeight};font-style:${cs.fontStyle};text-decoration:${cs.textDecorationLine};color:${cs.color};font-size:${cs.fontSize};font-family:${cs.fontFamily};background-color:${cs.backgroundColor}`,sticky};
    doc.style.cursor='copy';simToast(sticky?'نسخ التنسيق: عدة مرات (Esc للإلغاء)':'حدّد النص لتطبيق التنسيق عليه');},
  /* font */
  fontName(v){styleSel(`font-family:${v}`)},
  fontSize(v){styleSel(`font-size:${v}pt`);const fz=$('#ribbon select[data-cmd="fontSize"]');fz&&[...fz.options].forEach(o=>{if(o.dataset.tmp&&o.value!==v)o.remove()})},
  grow(){const p=curPt();const n=SIZES.find(s=>s>p)||p+10;styleSel(`font-size:${n}pt`)},
  shrink(){const p=curPt();const n=[...SIZES].reverse().find(s=>s<p)||Math.max(1,p-1);styleSel(`font-size:${n}pt`)},
  clearfmt(){if(!needSel())return;snap();ex('removeFormat');const r=S.range;const host=editHost(r.startContainer);if(host)host.querySelectorAll('span[style],font').forEach(s=>{if(r.intersectsNode(s)){s.replaceWith(...s.childNodes)}});selBlocks().forEach(b=>{b.removeAttribute('style');if(/H1|H2/.test(b.tagName)||b.className)setBlock(b,'p','')});logAct('clearfmt')},
  bold(){if(needSel()){ex('styleWithCSS',false);ex('bold')}},italic(){if(needSel()){ex('styleWithCSS',false);ex('italic')}},
  underline(a){if(!needSel())return;if(!a||a==='single'){ex('underline');return}styleSel(`text-decoration:underline ${a}`)},
  strike(){if(needSel())ex('strikeThrough')},sub(){if(needSel())ex('subscript')},sup(){if(needSel())ex('superscript')},
  textfx(a){if(a==='none'){styleSel('text-shadow:none;-webkit-text-stroke:0')}else if(a==='outline')styleSel('color:#fff;-webkit-text-stroke:1px #000');else if(a==='shadow')styleSel('text-shadow:2px 2px 3px rgba(0,0,0,.45)');else if(a==='glow')styleSel('text-shadow:0 0 6px #ffc000,0 0 3px #ffc000');else if(a!=null)styleSel(TEXT_FX[+a].css)},
  highlight(c){if(!needSel())return;if(S.range.collapsed){simToast('حدِّد النص أولًا، ثم اختر لون التمييز');return}if(c==='none'){ex('styleWithCSS',true);ex('hiliteColor','transparent');return}c=c||lastHilite;lastHilite=c;ex('styleWithCSS',true);ex('hiliteColor',c);logAct('highlight')},
  fontcolor(c){if(c==='more'){colorDlg(v=>OPS.fontcolor(v));return}if(!needSel())return;if(S.range.collapsed){simToast('حدِّد النص أولًا، ثم اختر اللون');return}c=c==='auto'?'#000000':(c||lastFore);lastFore=c;ex('styleWithCSS',true);ex('foreColor',c);logAct('fontcolor')},
  fontDlg(){simToast('استخدم أوامر مجموعة «خط» في الصفحة الرئيسية')},
  /* paragraph */
  bullets(a){if(!needSel())return;snap();const inL=listOf()?.tagName==='UL';if(a==='none'){if(inL)ex('insertUnorderedList');return}if(!inL)ex('insertUnorderedList');const l=listOf();if(l&&a){l.style.listStyleType=['disc','circle','square'].includes(a)?a:`"${a}  "`}logAct('bullets')},
  numbering(a){if(!needSel())return;snap();const inL=listOf()?.tagName==='OL';if(a==='none'){if(inL)ex('insertOrderedList');return}if(!inL)ex('insertOrderedList');const l=listOf();if(l)l.style.listStyleType=a==='arabic-abjad'?'abjad':(a||'decimal');logAct('numbering')},
  multilevel(a){if(!needSel())return;snap();if(!listOf())ex('insertOrderedList');const l=listOf();if(l){l.classList.add('ml');l.style.listStyleType='decimal'}simToast('استخدم Tab لمستوى أدنى، و Shift+Tab لمستوى أعلى')},
  indentInc(){if(!needSel())return;snap();if(listOf()){ex('indent');return}selBlocks().forEach(b=>b.style.marginRight=((parseFloat(b.style.marginRight)||0)+48)+'px')},
  indentDec(){if(!needSel())return;snap();if(listOf()){ex('outdent');return}selBlocks().forEach(b=>b.style.marginRight=Math.max(0,(parseFloat(b.style.marginRight)||0)-48)+'px')},
  sort(){if(!needSel())return;const bs=selBlocks();if(bs.length<2){simToast('حدِّد عدة فقرات أو عناصر قائمة لفرزها');return}snap();const par=bs[0].parentElement;const sorted=[...bs].sort((a,b)=>a.textContent.localeCompare(b.textContent,'ar'));const anchor=document.createComment('');bs[0].before(anchor);sorted.forEach(b=>anchor.before(b));anchor.remove();simToast('تم الفرز تصاعديًا (أ ← ي)');logAct('sort')},
  marks(){S.marks=!S.marks;applyPage();logAct('marks:'+S.marks)},
  alignR(){if(needSel()){ex('justifyRight');logAct('align:right')}},alignC(){if(needSel()){ex('justifyCenter');logAct('align:center')}},alignL(){if(needSel()){ex('justifyLeft');logAct('align:left')}},justify(){if(needSel()){ex('justifyFull');logAct('align:justify')}},
  rtl(){if(needSel())selBlocks().forEach(b=>{b.dir='rtl';b.style.textAlign=''})},ltr(){if(needSel())selBlocks().forEach(b=>{b.dir='ltr'})},
  linespacing(v){if(!needSel())return;snap();selBlocks().forEach(b=>b.style.lineHeight=(+v*1.08).toFixed(2));logAct('linespacing:'+v)},
  spaceBefore(){if(needSel())selBlocks().forEach(b=>b.style.marginTop='12pt')},spaceAfter(){if(needSel())selBlocks().forEach(b=>b.style.marginBottom='0')},
  paraDlg(){if(!needSel())return;const b=selBlocks()[0];dialog({title:'فقرة',body:`<label class="row">تباعد الأسطر: <select id="pls"><option value="1">مفرد</option><option value="1.15">1.15</option><option value="1.5">1.5 سطر</option><option value="2">مزدوج</option></select></label><label class="row">المسافة البادئة (سم): <input type="number" id="pin" value="${((parseFloat(b?.style.marginRight)||0)/CM).toFixed(1)}" step=".1" style="width:70px"></label>`,buttons:[{label:'موافق',pri:1,act:()=>{restoreSel();OPS.linespacing($('#pls').value);selBlocks().forEach(x=>x.style.marginRight=(+$('#pin').value*CM)+'px')}},{label:'إلغاء'}]})},
  pshading(c){if(!needSel())return;snap();selBlocks().forEach(b=>b.style.backgroundColor=c==='none'?'':(c||'#d9e2f3'))},
  pborders(a){if(!needSel())return;snap();const bd='1px solid #000';selBlocks().forEach(b=>{b.style.padding='1px 4px';if(a==='none'){b.style.border='';b.style.padding=''}else if(a==='all'||a==='box'||!a)b.style.border=bd;else if(a==='hr'){const hr=document.createElement('hr');b.after(hr)}else b.style['border'+{top:'Top',bottom:'Bottom',right:'Right',left:'Left'}[a]]=bd})},
  /* styles */
  style(id){if(!needSel())return;snap();if(id==='strong'){ex('bold');return}
    const map={normal:['p',''],nospace:['p','nospace'],h1:['h1',''],h2:['h2',''],title:['p','wtitle'],subtitle:['p','wsub'],quote:['p','wquote']};const [tag,cls]=map[id];
    const bs=selBlocks();let last;bs.forEach(b=>last=setBlock(b,tag,cls));if(last)placeCaretIn(last,false);logAct('style:'+id)},
  /* editing */
  find(){if(S.app!=='doc')return;S.nav=true;S.navTab='res';renderNav();setTimeout(()=>{const i=$('#navq');if(i){i.focus();i.select()}},30);logAct('find')},
  replace(){if(S.app!=='doc')return;replaceDlg();logAct('replaceDlg')},
  selectAll(){const h=S.range?editHost(S.range.startContainer):firstBody();placeCaretIn(h||firstBody(),true,true);logAct('selectAll')},
  selectObjects(){doc.classList.toggle('selobj');simToast(doc.classList.contains('selobj')?'وضع تحديد الكائنات: انقر على الصورة أو الشكل (Esc للخروج)':'تم الخروج من وضع تحديد الكائنات')},
  selPane(){const os=[...doc.querySelectorAll('.obj')];dialog({title:'التحديد',body:os.length?os.map((o,i)=>`<button class="bs-row" data-o="${i}">${o.classList.contains('pic')?'صورة':SHAPE_NAMES[o.dataset.kind]||'شكل'} ${i+1}</button>`).join(''):'<p>لا توجد كائنات في المستند.</p>',buttons:[{label:'إغلاق'}],onOpen:d=>d.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{selectObj(os[+b.dataset.o]);closeDialog()})})},
  dictate(){simToast('الإملاء يحتاج ميكروفونًا — للعرض فقط')},editor(){simToast('المحرر: لم يتم العثور على أخطاء ✓')},
  /* pages */
  pageBreak(){if(!needDoc())return;if(!inText()||S.hfMode){placeCaretIn(firstBody(),false)}restoreSel();snap();const np=splitAtCaret();afterPages();placeCaretIn(np.querySelector('.pg-body'),true);np.scrollIntoView({block:'start'});logAct('pageBreak');simToast('فاصل صفحات: ما بعد المؤشر انتقل إلى صفحة جديدة')},
  blankPage(){if(!needDoc())return;if(!inText()){placeCaretIn(pages().at(-1).querySelector('.pg-body'),false)}restoreSel();snap();const np=splitAtCaret();const bp=makePage();np.before(bp);
    const nb=np.querySelector('.pg-body');if(!nb.textContent.trim()&&!nb.querySelector('.obj,table,.eq'))np.remove();
    afterPages();placeCaretIn(bp.querySelector('.pg-body'),true);bp.scrollIntoView({block:'start'});logAct('blankPage')},
  cover(i){if(!needDoc())return;snap();doc.querySelector('.page.cover')?.remove();const p=makePage(COVER_HTML(+i||0));p.classList.add('cover');doc.prepend(p);afterPages();p.scrollIntoView({block:'start'});logAct('cover');simToast('صفحة الغلاف تُضاف دائمًا في أول المستند')},
  removeCover(){const c=doc.querySelector('.page.cover');if(c){snap();c.remove();afterPages()}},
  colBreak(){if(!needSel())return;snap();const b=topBlock();if(b){b.style.breakBefore='column'}},
  sectionBreak(a){if(a==='next')OPS.pageBreak();else simToast('تم إدراج فاصل مقطع مستمر')},
  textWrapBreak(){if(needSel())ex('insertHTML','<br class="brk">')},
  /* design */
  theme(i){if(!needDoc())return;snap();S.theme=+i;S.themeColor=shade(THEMES[i].c[0]);S.themeFont=THEMES[i].f;applyPage();logAct('theme:'+i);simToast('نسق المستند: '+THEMES[i].name)},
  themeFont(i){S.themeFont=THEMES[i].f;applyPage()},
  paraspacing(v){doc.style.setProperty('--psp',v+'pt')},docEffects(){simToast('تأثيرات النسق: للعرض فقط')},setDefault(){simToast('تم التعيين كافتراضي')},
  watermark(w){if(!needDoc())return;snap();S.page.wm=w==='none'?'':w;applyPage();logAct('watermark:'+S.page.wm)},
  watermarkCustom(){dialog({title:'علامة مائية مطبوعة',body:`<label class="row">النص: <input type="text" id="wmT" value="سرّي" style="flex:1"></label>`,buttons:[{label:'موافق',pri:1,act:()=>OPS.watermark($('#wmT').value||'none')},{label:'إلغاء'}]})},
  pageColor(c){if(!needDoc())return;if(c==='more'){colorDlg(v=>OPS.pageColor(v));return}snap();S.page.color=c==='none'?'':c;applyPage();logAct('pageColor:'+S.page.color)},
  pageBorders(){if(!needDoc())return;const b=S.page.border||{s:'solid',c:'#000000',w:2};
    dialog({title:'حدود وتظليل — حدود الصفحة',body:`<label class="row">الإعداد: <select id="pbSet"><option value="none">بلا</option><option value="box" ${S.page.border?'selected':''}>مربع</option><option value="shadow">ظل</option></select></label><label class="row">النمط: <select id="pbS"><option value="solid">متصل ─────</option><option value="dashed">متقطع - - - -</option><option value="dotted">منقّط ·······</option><option value="double">مزدوج ═════</option></select></label><label class="row">اللون: <input type="color" id="pbC" value="${b.c}"></label><label class="row">العرض: <select id="pbW"><option value="1">½ نقطة</option><option value="2" selected>1½ نقطة</option><option value="4">3 نقاط</option><option value="6">4½ نقطة</option></select></label>`,
     buttons:[{label:'موافق',pri:1,act:()=>{snap();const set=$('#pbSet').value;S.page.border=set==='none'?null:{s:$('#pbS').value,c:$('#pbC').value,w:+$('#pbW').value};applyPage();logAct('pageBorder')}},{label:'إلغاء'}]})},
  /* layout */
  margins(id){if(!needDoc())return;snap();S.page.margin=id;S.page.customM=null;applyPage();logAct('margins:'+id)},
  marginsCustom(){const m=MARGINS.find(x=>x.id===S.page.margin)||MARGINS[0];dialog({title:'إعداد الصفحة — الهوامش',body:['t:أعلى','b:أسفل','r:يمين','l:يسار'].map(a=>{const[k,l]=a.split(':');return `<label class="row">${l}: <input type="number" step=".1" id="m_${k}" value="${m[k]}" style="width:80px"> سم</label>`}).join(''),buttons:[{label:'موافق',pri:1,act:()=>{snap();S.page.margin='custom';S.page.customM={t:+$('#m_t').value,b:+$('#m_b').value,r:+$('#m_r').value,l:+$('#m_l').value};applyPage()}},{label:'إلغاء'}]})},
  orient(o){if(!needDoc())return;snap();S.page.orient=o;applyPage();logAct('orient:'+o)},
  psize(s){if(!needDoc())return;snap();S.page.size=s;applyPage();logAct('psize:'+s)},
  columns(c){if(!needDoc())return;snap();S.page.cols=c;applyPage();logAct('columns:'+c)},
  lineNums(a){if(!needDoc())return;S.page.lineNums=a;applyPage();logAct('lineNums:'+a)},
  hyphen(){simToast('الواصلة: تم')},
  indentRight(v){if(needSel())selBlocks().forEach(b=>b.style.marginRight=(+v*CM)+'px')},indentLeft(v){if(needSel())selBlocks().forEach(b=>b.style.marginLeft=(+v*CM)+'px')},
  spBefore(v){if(needSel())selBlocks().forEach(b=>b.style.marginTop=v+'pt')},spAfter(v){if(needSel())selBlocks().forEach(b=>b.style.marginBottom=v+'pt')},
  /* references */
  tocIns(t){if(!needDoc())return;if(!inText())placeCaretIn(firstBody(),true);restoreSel();snap();const old=doc.querySelector('.toc');const el=buildToc(t||'auto1');if(old)old.replaceWith(el);else insertBlock(el);logAct('toc');if(!el.querySelector('.te'))simToast('لا عناوين! نسّق العناوين بنمط «عنوان 1» أولًا')},
  tocRemove(){const t=doc.querySelector('.toc');if(t){snap();t.remove()}},
  updateToc(){const t=doc.querySelector('.toc');if(!t){simToast('لا يوجد جدول محتويات في المستند');return}
    dialog({title:'تحديث جدول المحتويات',body:`<p>يقوم Word بتحديث جدول المحتويات. حدّد أحد الخيارات التالية:</p><label class="row"><input type="radio" name="tu" value="pages" checked> تحديث أرقام الصفحات فقط</label><label class="row"><input type="radio" name="tu" value="all" data-hid="dlg-toc-all"> تحديث الجدول بأكمله</label>`,buttons:[{label:'موافق',pri:1,act:d=>{snap();const all=d.querySelector('input[value="all"]').checked;updateTocEl(t,all);logAct('updateToc:'+(all?'all':'pages'))}},{label:'إلغاء'}]})},
  tocCustom(){OPS.tocIns('auto1')},
  addText(a){if(!needSel())return;snap();const bs=selBlocks();bs.forEach(b=>setBlock(b,a==='1'?'h1':a==='2'?'h2':'p',''))},
  footnote(){if(!needDoc())return;if(!inText()){simToast('ضع المؤشر بعد الكلمة أولًا');return}restoreSel();snap();const r=S.range;r.collapse(false);const s=document.createElement('sup');s.className='fnr';s.contentEditable='false';s.dataset.id='n'+(noteId++);insertInline(s);syncNotes();const t=doc.querySelector(`.fn[data-id="${s.dataset.id}"] .fnt`);if(t){placeCaretIn(t,false);t.scrollIntoView({block:'nearest'})}logAct('footnote')},
  endnote(){if(!needDoc())return;if(!inText()){simToast('ضع المؤشر بعد الكلمة أولًا');return}restoreSel();snap();const r=S.range;r.collapse(false);const s=document.createElement('sup');s.className='enr';s.contentEditable='false';s.dataset.id='e'+(noteId++);insertInline(s);syncNotes();const t=doc.querySelector(`.en[data-id="${s.dataset.id}"] .fnt`);if(t){placeCaretIn(t,false);t.scrollIntoView({block:'nearest'})}logAct('endnote')},
  nextNote(a){const refs=[...doc.querySelectorAll(a==='en'?'.enr':'.fnr')];if(!refs.length){simToast('لا توجد حواشٍ في المستند');return}S.noteI=((S.noteI??-1)+(a==='fnPrev'?-1:1)+refs.length)%refs.length;const r=refs[S.noteI];doc.querySelectorAll('.hl').forEach(x=>x.classList.remove('hl'));r.classList.add('hl');r.scrollIntoView({block:'center'});setTimeout(()=>r.classList.remove('hl'),1500)},
  showNotes(){const n=doc.querySelector('.fn,.en');if(n)n.scrollIntoView({block:'center'});else simToast('لا توجد حواشٍ')},
  citation(){simToast('إدراج اقتباس: للعرض فقط')},caption(){simToast('تسمية توضيحية: للعرض فقط')},
  /* review / comments */
  newComment(){addComment()},insComment(){addComment()},
  delComment(a){if(a==='all'){if(!S.comments.length){simToast('لا توجد تعليقات');return}snap();doc.querySelectorAll('.cmt').forEach(s=>s.replaceWith(...s.childNodes));S.comments=[];renderComments();logAct('delComment:all');return}
    const id=S.activeC||(()=>{const r=S.range;const n=r&&(r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement);return n&&n.closest&&n.closest('.cmt')?.dataset.c})();
    if(!id){simToast('انقر على تعليق أولًا');return}snap();doc.querySelectorAll(`.cmt[data-c="${id}"]`).forEach(s=>s.replaceWith(...s.childNodes));S.comments=S.comments.filter(c=>c.id!=id);S.activeC=null;renderComments();logAct('delComment')},
  prevComment(){stepComment(-1)},nextComment(){stepComment(1)},
  showComments(){S.cmts=!S.cmts;renderComments()},
  wordCount(){dialog({title:'عدد الكلمات',body:`<table style="width:240px"><tr><td>الصفحات</td><td>${pages().length}</td></tr><tr><td>الكلمات</td><td>${wordCount()}</td></tr><tr><td>الأحرف</td><td>${[...doc.querySelectorAll('.pg-body')].map(b=>b.innerText).join('').replace(/\s/g,'').length}</td></tr></table>`})},
  spelling(){simToast('اكتمل التدقيق الإملائي ✓')},thesaurus(){simToast('قاموس المرادفات: للعرض فقط')},
  /* view */
  readMode(){if(!needDoc())return;const rm=$('#readmode');rm.hidden=false;rm.innerHTML=`<div class="rmbar"><button>ملف</button><button>أدوات</button><button data-x>عرض ▾</button><span class="t">${S.file.name}</span><button data-x title="تحرير المستند">✎ تحرير</button></div><div class="rmc">${[...doc.querySelectorAll('.pg-body')].map(b=>b.innerHTML).join('')}</div><div class="rmhint">اضغط Esc للعودة</div>`;rm.querySelectorAll('[contenteditable]').forEach(e=>e.removeAttribute('contenteditable'));rm.querySelectorAll('[data-x]').forEach(b=>b.onclick=OPS.exitRead);S.view='read';logAct('view:read');SIM.emit('change')},
  exitRead(){$('#readmode').hidden=true;S.view='print';applyPage();logAct('view:print');SIM.emit('change')},
  printLayout(){if(!$('#readmode').hidden){OPS.exitRead();return}S.view='print';applyPage();logAct('view:print')},
  webLayout(){S.view='web';applyPage();logAct('view:web')},
  outlineView(){simToast('المخطط التفصيلي: للعرض فقط')},draftView(){simToast('المسودة: للعرض فقط')},
  ruler(v){S.ruler=!!v;renderRuler();logAct('ruler:'+S.ruler)},gridlines(v){S.grid=!!v;applyPage();logAct('grid:'+S.grid)},
  nav(v){S.nav=v==null||v==='on'?true:!!v;renderNav();logAct('nav:'+S.nav)},
  zoomStep(a){setZoom(S.zoom+(+a))},zoom100(){S.multi=false;applyPage();setZoom(100)},
  zoomDlg(){dialog({title:'تكبير/تصغير',body:`<div style="display:flex;gap:30px"><div>${[200,100,75].map(z=>`<label class="row"><input type="radio" name="zr" value="${z}" ${S.zoom==z?'checked':''}> ${z}%</label>`).join('')}<label class="row"><input type="radio" name="zr" value="pw"> عرض الصفحة</label><label class="row"><input type="radio" name="zr" value="wp"> الصفحة بأكملها</label></div><div><label class="row">النسبة المئوية: <input type="number" id="zp" value="${S.zoom}" style="width:70px">%</label></div></div>`,buttons:[{label:'موافق',pri:1,act:d=>{const c=d.querySelector('input[name=zr]:checked');if(c&&c.value==='pw')OPS.pageWidth();else if(c&&c.value==='wp')OPS.onePage();else setZoom(c?+c.value:+$('#zp').value)}},{label:'إلغاء'}]})},
  onePage(){S.multi=false;applyPage();const {h}=pageDims();setZoom((canvas.clientHeight-40)/(h*CM)*100)},
  multiPage(){S.multi=true;applyPage();const {w}=pageDims();setZoom((canvas.clientWidth-80)/(w*CM*2+20)*100);logAct('multi')},
  pageWidth(){S.multi=false;applyPage();const {w}=pageDims();setZoom((canvas.clientWidth-50)/(w*CM)*100)},
  newWindow(){simToast('نافذة جديدة: للعرض فقط')},
  /* header & footer */
  header(i){if(!needDoc())return;snap();S.hf.hdr=HF_HTML(+i||0);if(S.hf.first)S.hf.firstHdr='';enterHF('hdr',S.hf.first?1:0);setTimeout(selectPlaceholder,40);logAct('header')},
  footer(i){if(!needDoc())return;snap();S.hf.ftr=HF_HTML(+i||0);enterHF('ftr',S.hf.first?1:0);setTimeout(selectPlaceholder,40);logAct('footer')},
  editHeader(){enterHF('hdr')},editFooter(){enterHF('ftr')},
  removeHeader(){snap();S.hf.hdr='';S.hf.firstHdr='';renderHF()},removeFooter(){snap();S.hf.ftr='';S.hf.firstFtr='';renderHF()},
  closeHF(){exitHF()},gotoHeader(){enterHF('hdr')},gotoFooter(){enterHF('ftr')},
  firstDiff(v){S.hf.first=!!v;renderHF();if(S.hfMode)renderHF();logAct('firstDiff:'+S.hf.first)},
  oddEven(){simToast('صفحات فردية وزوجية مختلفة: للعرض فقط')},showDocText(){},
  docInfo(){if(needSel())ex('insertText',S.file.name)},
  pagenumIns(a){if(!needDoc())return;snap();
    if(a==='current'){if(!inText()){simToast('ضع المؤشر داخل النص');return}const s=document.createElement('span');s.className='pnum';s.contentEditable='false';insertInline(s);fillPageNums();return}
    let [pos,al]=a.split('-');if(pos==='margin'){pos='bottom';al='right'}const k=pos==='top'?'hdr':'ftr';
    const para=`<p class="pnp" style="text-align:${al}"><span class="pnum" contenteditable="false">#</span></p>`;
    const strip=h=>{const d=document.createElement('div');d.innerHTML=h||'';d.querySelectorAll('.pnp').forEach(x=>x.remove());return d.innerHTML.replace(/^<p><br><\/p>$/,'')};
    S.hf.hdr=strip(S.hf.hdr);S.hf.ftr=strip(S.hf.ftr);S.hf[k]=k==='hdr'?para+S.hf[k]:S.hf[k]+para;
    enterHF(k,S.hf.first?1:0);logAct('pagenum:'+pos+'-'+al)},
  pnFormat(){dialog({title:'تنسيق أرقام الصفحات',body:`<label class="row">تنسيق الأرقام: <select id="pnf"><option value="decimal">1، 2، 3، ...</option><option value="arabic-indic">١، ٢، ٣، ...</option><option value="abjad">أ، ب، ج، ...</option><option value="roman">I، II، III، ...</option></select></label><p style="margin:10px 0 4px">ترقيم الصفحات</p><label class="row"><input type="radio" name="pns" value="c" ${S.hf.pnStart==1?'checked':''}> متابعة من المقطع السابق</label><label class="row"><input type="radio" name="pns" value="s" ${S.hf.pnStart!=1?'checked':''}> البدء عند: <input type="number" id="pnst" value="${S.hf.pnStart}" min="0" style="width:60px"></label>`,
    onOpen:()=>{$('#pnf').value=S.hf.pnFmt},buttons:[{label:'موافق',pri:1,act:d=>{snap();S.hf.pnFmt=$('#pnf').value;S.hf.pnStart=d.querySelector('input[value=s]').checked?+$('#pnst').value:1;fillPageNums();logAct('pnFormat:'+S.hf.pnFmt+':'+S.hf.pnStart)}},{label:'إلغاء'}]})},
  pnRemove(){snap();const strip=h=>{const d=document.createElement('div');d.innerHTML=h||'';d.querySelectorAll('.pnp').forEach(x=>x.remove());return d.innerHTML};S.hf.hdr=strip(S.hf.hdr);S.hf.ftr=strip(S.hf.ftr);doc.querySelectorAll('.pg-body .pnum').forEach(x=>x.remove());renderHF()},
  /* date & time, symbols */
  datetime(){if(!needDoc())return;if(!inText()){simToast('ضع المؤشر حيث تريد التاريخ');return}dateDlg()},
  insSymbol(s){if(!inText()){simToast('ضع المؤشر داخل النص أولًا');return}restoreSel();snap();ex('insertText',s);pushRecent(s);logAct('symbol:'+s)},
  symbolDlg(){symbolDlg()},
  quickparts(){simToast('أجزاء سريعة: للعرض فقط')},sigline(){simToast('سطر التوقيع: للعرض فقط')},object(){simToast('كائن: للعرض فقط')},
  dropcap(a){if(!needSel())return;const b=selBlocks()[0];if(!b)return;snap();if(a==='none'){b.classList.remove('dropcap')}else b.classList.add('dropcap')},
  link(){if(!needSel())return;dialog({title:'إدراج ارتباط',body:`<label class="row">العنوان: <input type="text" id="lnk" value="https://" style="flex:1;direction:ltr"></label>`,buttons:[{label:'موافق',pri:1,act:()=>{restoreSel();ex('createLink',$('#lnk').value)}},{label:'إلغاء'}]})},
});
function shade(c){const n=parseInt(c.slice(1),16);const f=.75;return '#'+[n>>16,(n>>8)&255,n&255].map(v=>Math.round(v*f).toString(16).padStart(2,'0')).join('')}
function listOf(){const r=S.range;if(!r)return null;let n=r.startContainer;n=n.nodeType===1?n:n.parentElement;return n.closest('ul,ol')}
function setBlock(b,tag,cls){let el=b;if(b.tagName.toLowerCase()!==tag){el=document.createElement(tag);el.innerHTML=b.innerHTML;if(b.getAttribute('style'))el.setAttribute('style',b.getAttribute('style'));if(b.dir)el.dir=b.dir;if(b.id)el.id=b.id;b.replaceWith(el)}el.className=cls;if(!el.className)el.removeAttribute('class');return el}
function splitAtCaret(){
  const r=S.range;let n=r.startContainer;const body=bodyOf(n.nodeType===1?n:n.parentElement)||firstBody();const page=pageOf(body);
  const tail=document.createRange();if(body.contains(r.startContainer))tail.setStart(r.startContainer,r.startOffset);else tail.setStart(body,body.childNodes.length);tail.setEnd(body,body.childNodes.length);
  const frag=tail.extractContents();const np=makePage('');const nb=np.querySelector('.pg-body');nb.innerHTML='';nb.appendChild(frag);
  const fix=b=>{[...b.children].forEach(c=>{if(/^(P|H1|H2|LI)$/.test(c.tagName)&&!c.innerHTML.trim())c.innerHTML='<br>'});if(!b.innerHTML.trim()||!b.children.length)b.innerHTML='<p><br></p>'};
  fix(nb);fix(body);page.after(np);return np;
}
function afterPages(){applyPage();renderHF();syncNotes();fillPageNums();updateStatus();SIM.emit('change')}
function COVER_HTML(i){const t='<p class="wtitle">[عنوان المستند]</p><p class="wsub">[العنوان الفرعي للمستند]</p><p><br></p><p>[اسم المؤلف]</p><p>[التاريخ]</p>';
  const bg=['border-top:120px solid #4472c4;padding-top:30px','border-right:30px solid #ed7d31;padding-right:20px','background:#e8f0fb;padding:40px 20px;text-align:center','border-bottom:8px solid #7030a0;padding-bottom:30px'][i];
  return `<div class="covbox" style="${bg};margin-top:150px">${t}</div>`}
function HF_HTML(i){if(i===1)return '<p style="display:flex;justify-content:space-between"><span class="ph">[اكتب هنا]</span><span class="ph">[اكتب هنا]</span><span class="ph">[اكتب هنا]</span></p>';if(i===2)return '<p style="border-bottom:2px solid #4472c4;padding-bottom:3px"><span class="ph">[عنوان المستند]</span></p>';if(i===3)return '<p style="border-bottom:1px solid #000"><span class="ph">[اكتب هنا]</span></p>';return '<p><span class="ph">[اكتب هنا]</span></p>'}
function selectPlaceholder(){const ph=doc.querySelector('.hfmode .pg-hdr .ph, .hfmode .pg-ftr .ph');const act=document.activeElement;let target=null;if(act&&act.closest&&act.closest('.pg-hdr,.pg-ftr'))target=act.querySelector('.ph');target=target||ph;if(target)selectNode(target)}
document.addEventListener('input',e=>{const t=e.target;if(t.closest&&t.closest('.pg-hdr,.pg-ftr')){t.querySelectorAll('.ph').forEach(p=>{if(!/^\[.*\]$/.test(p.textContent))p.classList.remove('ph')})}});
/* painter apply */
document.addEventListener('mouseup',()=>{if(!S.painter)return;setTimeout(()=>{const r=curRange();if(r&&!r.collapsed){S.range=r.cloneRange();styleSel(S.painter.css);logAct('painterApplied');if(!S.painter.sticky){S.painter=null;doc.style.cursor=''}}},10)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.painter){S.painter=null;doc.style.cursor=''}});
document.addEventListener('copy',e=>{const r=curRange();if(r&&!r.collapsed){const d=document.createElement('div');d.appendChild(r.cloneContents());S.clip={html:d.innerHTML,text:r.toString()};logAct('copy')}});
document.addEventListener('cut',e=>{const r=curRange();if(r&&!r.collapsed){const d=document.createElement('div');d.appendChild(r.cloneContents());S.clip={html:d.innerHTML,text:r.toString()};logAct('cut')}});
document.addEventListener('paste',e=>{if(curRange())logAct('paste:keep')});
/* =rand() / =lorem() */
function tryRand(){
  const r=curRange();if(!r||!r.collapsed)return false;let n=r.startContainer;n=n.nodeType===1?n:n.parentElement;const b=n.closest('p');if(!b||!bodyOf(b))return false;
  const t=b.textContent.trim().replace(/[‎‏]/g,'');const m=t.match(/^=(rand|lorem)\((\d*)\s*,?\s*(\d*)\)$/i);if(!m)return false;
  snap();const lor=m[1].toLowerCase()==='lorem';const P=+m[2]||(lor?3:5),Sn=+m[3]||(lor?3:3);const src=lor?LOREM_SENT:RAND_SENT;let k=0;const ps=[];
  for(let i=0;i<P;i++){const ss=[];for(let j=0;j<Sn;j++)ss.push(src[(k++)%src.length]);const p=document.createElement('p');p.textContent=ss.join(' ');if(lor)p.dir='ltr';ps.push(p)}
  b.replaceWith(...ps);const np=document.createElement('p');np.innerHTML='<br>';ps.at(-1).after(np);placeCaretIn(np,true);logAct('rand:'+P+','+Sn);return true;
}
/* page merge on Backspace at start / Delete at end */
doc&&0;document.addEventListener('keydown',e=>{
  if(!(e.key==='Backspace'||e.key==='Delete'))return;const r=curRange();if(!r||!r.collapsed)return;const body=bodyOf(r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement);if(!body)return;
  const pre=document.createRange();pre.selectNodeContents(body);
  if(e.key==='Backspace'){pre.setEnd(r.startContainer,r.startOffset);if(pre.toString().length||pre.cloneContents().querySelector('img,.obj,table,.eq'))return;const pg=pageOf(body),prev=pg.previousElementSibling;if(!prev)return;e.preventDefault();snap();const pb=prev.querySelector('.pg-body');const last=pb.lastElementChild;const empty=!body.textContent.trim()&&!body.querySelector('.obj,table');if(!empty)[...body.childNodes].forEach(c=>pb.appendChild(c));pg.remove();afterPages();placeCaretIn(last||pb,false);logAct('mergePage')}
  else{pre.setStart(r.endContainer,r.endOffset);if(pre.toString().length)return;const pg=pageOf(body),next=pg.nextElementSibling;if(!next||!next.classList.contains('page'))return;e.preventDefault();snap();const nb=next.querySelector('.pg-body');if(nb.textContent.trim()||nb.querySelector('.obj,table'))[...nb.childNodes].forEach(c=>body.appendChild(c));next.remove();afterPages();logAct('mergePage')}
},true);
/* lists: Tab inside list item = demote */
document.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const r=curRange();if(!r)return;let n=r.startContainer;n=n.nodeType===1?n:n.parentElement;if(n.closest('td'))return;const li=n.closest('li');if(!li)return;e.preventDefault();e.stopImmediatePropagation();ex(e.shiftKey?'outdent':'indent');logAct(e.shiftKey?'listUp':'listDown')},true);
/* replace dialog & find */
function textNodes(root){const out=[];const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('.toc,.pnum,.fnr,.enr')?2:1});let x;while(x=w.nextNode())out.push(x);return out}
function replaceDlg(){
  const sel=selText().trim();
  dialog({title:'بحث واستبدال',w:440,body:`<label class="row" style="justify-content:space-between">البحث عن: <input type="text" id="rf" value="${sel}" style="width:260px" data-hid="dlg-find"></label><label class="row" style="justify-content:space-between">استبدال بـ: <input type="text" id="rr" style="width:260px" data-hid="dlg-repl"></label>`,
   buttons:[{label:'استبدال الكل',act:()=>{const n=replaceAll($('#rf').value,$('#rr').value);dialog({title:'Microsoft Word',body:n?`تم الانتهاء. تم إجراء ${n} من عمليات الاستبدال.`:'لم يتم العثور على النص المطلوب.'});return false}},{label:'استبدال',act:()=>{replaceOne($('#rf').value,$('#rr').value);return false}},{label:'بحث عن التالي',pri:1,act:()=>{findNext($('#rf').value);return false}},{label:'إلغاء'}],
   onOpen:()=>setTimeout(()=>$('#rf').focus(),30)});
}
function replaceAll(f,t){if(!f)return 0;snap();let n=0;doc.querySelectorAll('.pg-body').forEach(b=>textNodes(b).forEach(tn=>{const parts=tn.nodeValue.split(f);if(parts.length>1){n+=parts.length-1;tn.nodeValue=parts.join(t)}}));logAct('replaceAll:'+f+'>'+t+':'+n);return n}
function findNext(f){if(!f)return false;const tns=[];doc.querySelectorAll('.pg-body').forEach(b=>tns.push(...textNodes(b)));const cur=S.range;let started=!cur;
  for(const pass of [0,1])for(const tn of tns){let from=0;if(!started&&cur){if(tn===cur.endContainer){from=cur.endOffset;started=true}else if(cur.endContainer.contains&&cur.endContainer.contains(tn)){started=true}else if(cur.compareBoundaryPoints&&(()=>{const rr=document.createRange();rr.setStart(tn,0);return rr.compareBoundaryPoints(Range.START_TO_END,cur)>0})()){started=true}else continue}
    const i=tn.nodeValue.indexOf(f,from);if(i>=0){const r=document.createRange();r.setStart(tn,i);r.setEnd(tn,i+f.length);const h=editHost(tn);h.focus();const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange();tn.parentElement.scrollIntoView({block:'center'});return true}if(pass===0)started=true}
  simToast('انتهى البحث في المستند');return false}
function replaceOne(f,t){const s=selText();if(s===f){snap();restoreSel();ex('insertText',t);logAct('replaceOne')}findNext(f)}
/* navigation pane */
function renderNav(){
  const np=$('#navpane');if(!S.nav){np.hidden=true;clearMarks();return}np.hidden=false;S.navTab=S.navTab||'heads';
  if(!np.querySelector('#navq')){np.innerHTML=`<div class="pane-h"><b>التنقل</b><button data-x>✕</button></div><div class="nsearch"><input id="navq" placeholder="البحث في المستند" data-hid="nav-search">🔍</div><div class="ntabs"><button data-nt="heads">العناوين</button><button data-nt="pages">الصفحات</button><button data-nt="res">النتائج</button></div><div class="nlist" id="nlist"></div>`;
    np.querySelector('[data-x]').onclick=()=>{S.nav=false;renderNav();syncRibbon()};np.querySelectorAll('[data-nt]').forEach(b=>b.onclick=()=>{S.navTab=b.dataset.nt;renderNav()});
    $('#navq').addEventListener('input',()=>{S.navTab='res';renderNav()});}
  np.querySelectorAll('[data-nt]').forEach(b=>b.classList.toggle('on',b.dataset.nt===S.navTab));
  const L=$('#nlist'),q=$('#navq').value.trim();
  if(S.navTab==='heads'){clearMarks();const hs=[...doc.querySelectorAll('.pg-body h1,.pg-body h2')];L.innerHTML=hs.length?hs.map((h,i)=>`<button class="nh ${h.tagName==='H2'?'l2':''}" data-h="${i}">${h.textContent||'(عنوان فارغ)'}</button>`).join(''):`<div class="nmsg">أنشئ مخططًا تفصيليًا تفاعليًا للمستند.<br>إنها طريقة رائعة لتتبّع موقعك أو نقل المحتوى بسرعة.<br>للبدء، انتقل إلى علامة التبويب «الصفحة الرئيسية» وطبّق أنماط العناوين على العناوين في المستند.</div>`;L.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{const h=hs[+b.dataset.h];h.scrollIntoView({block:'center'});placeCaretIn(h,true)})}
  else if(S.navTab==='pages'){clearMarks();L.innerHTML=pages().map((p,i)=>`<button class="nh" data-p="${i}" style="display:flex;flex-direction:column;align-items:center;gap:4px"><span style="width:90px;height:120px;border:1px solid #ccc;background:#fff;display:block"></span>${i+1}</button>`).join('');L.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>pages()[+b.dataset.p].scrollIntoView({block:'start'}))}
  else{clearMarks();if(!q){L.innerHTML='<div class="nmsg">اكتب في مربع البحث للعثور على نص في المستند.</div>';return}
    let n=0;const hits=[];doc.querySelectorAll('.pg-body').forEach(b=>textNodes(b).forEach(tn=>{let i,from=0;const v=tn.nodeValue;const idx=[];while((i=v.indexOf(q,from))>=0){idx.push(i);from=i+q.length}
      for(let k=idx.length-1;k>=0;k--){const r=document.createRange();r.setStart(tn,idx[k]);r.setEnd(tn,idx[k]+q.length);const m=document.createElement('mark');m.className='fh';r.surroundContents(m);hits.unshift(m);n++}}));
    L.innerHTML=`<div class="nmsg"><b>${n}</b> ${n===1?'نتيجة':'نتائج'}</div>`+hits.map((m,i)=>`<button class="nres" data-m="${i}">…${(m.previousSibling?.nodeValue||'').slice(-18)}<mark>${q}</mark>${(m.nextSibling?.nodeValue||'').slice(0,18)}…</button>`).join('');
    L.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>hits[+b.dataset.m].scrollIntoView({block:'center'}));logAct('findResults:'+n);}
}
function clearMarks(){doc.querySelectorAll('mark.fh').forEach(m=>{const p=m.parentNode;m.replaceWith(...m.childNodes);p.normalize()})}
/* TOC */
function buildToc(type){
  const el=document.createElement('div');el.className='toc';el.contentEditable='false';el.dataset.type=type;updateTocEl(el,true);return el}
function updateTocEl(el,all){
  const hs=[...doc.querySelectorAll('.pg-body h1,.pg-body h2')].filter(h=>!h.closest('.toc'));
  hs.forEach((h,i)=>{if(!h.id)h.id='h'+Math.random().toString(36).slice(2,8)});
  const pn=h=>fmtNum(pageIndex(h)+(+S.hf.pnStart||1),'decimal');const tx=h=>{const c=h.cloneNode(true);c.querySelectorAll('.fnr,.enr').forEach(x=>x.remove());return c.textContent};
  if(all||!el.querySelector('.te')){
    const manual=el.dataset.type==='manual';
    el.innerHTML=`<div class="tbar"><button data-tu="1">${'📄'} تحديث الجدول...</button></div><div class="toch">${el.dataset.type==='auto2'?'جدول المحتويات':'المحتويات'}</div>`+
      (manual?['اكتب عنوان الفصل (المستوى 1)','اكتب عنوان الفصل (المستوى 2)','اكتب عنوان الفصل (المستوى 1)'].map((t,i)=>`<div class="te ${i===1?'l2':''}"><span>${t}</span><span class="dots"></span><span>${i+1}</span></div>`).join(''):
      (hs.length?hs.map(h=>`<div class="te ${h.tagName==='H2'?'l2':''}" data-t="${h.id}"><span>${tx(h)}</span><span class="dots"></span><span class="pg">${pn(h)}</span></div>`).join(''):'<p>لم يتم العثور على إدخالات جدول محتويات.</p>'));
  }else el.querySelectorAll('.te[data-t]').forEach(te=>{const h=document.getElementById(te.dataset.t);if(h)te.querySelector('.pg').textContent=pn(h)});
}
doc&&0;document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('.toc');doc&&doc.querySelectorAll('.toc.sel').forEach(x=>{if(x!==t)x.classList.remove('sel')});if(!t)return;t.classList.add('sel');
  if(e.target.closest('[data-tu]')){OPS.updateToc();return}
  const te=e.target.closest('.te[data-t]');if(te){if(e.ctrlKey||e.metaKey){const h=document.getElementById(te.dataset.t);if(h){h.scrollIntoView({block:'center'});placeCaretIn(h,true);logAct('tocJump')}}else simToast('اضغط Ctrl + نقر لتتبّع الارتباط')}});
/* comments */
function addComment(){
  if(!needDoc())return;if(!inText()){simToast('حدِّد الكلمة أولًا ثم أضف التعليق');return}restoreSel();let r=S.range;
  if(r.collapsed){const s=getSelection();s.modify('move','backward','word');s.modify('extend','forward','word');r=s.getRangeAt(0);if(r.collapsed){simToast('حدِّد الكلمة أولًا ثم أضف التعليق');return}}
  snap();const id=S.cid++;const sp=document.createElement('span');sp.className='cmt';sp.dataset.c=id;sp.appendChild(r.extractContents());r.insertNode(sp);
  S.comments.push({id,author:'سارة حرب',text:'',posted:false,replies:[]});S.activeC=id;S.cmts=true;renderComments();
  setTimeout(()=>{const t=$(`#cmtpane .ccard[data-c="${id}"] .ctext`);if(t){t.focus()}},30);logAct('comment:add');
}
function renderComments(){
  const p=$('#cmtpane');if(!p)return;
  S.comments=S.comments.filter(c=>doc.querySelector(`.cmt[data-c="${c.id}"]`));
  if(!S.comments.length||!S.cmts){p.hidden=true;return}p.hidden=false;
  p.innerHTML=`<div class="pane-h"><b>التعليقات</b><button data-x>✕</button></div><div class="clist">${S.comments.map(c=>`<div class="ccard ${S.activeC==c.id?'act':''}" data-c="${c.id}"><div class="who ${c.author!=='سارة حرب'?'t':''}"><i>${c.author.split(' ').map(w=>w[0]).join(' ')}</i>${c.author}</div>
    ${c.posted?`<div class="ctext">${c.text}</div>`:`<div class="ctext" contenteditable="true" data-hid="cmt-text">${c.text}</div><div class="cact"><button data-post>نشر</button><button class="g" data-cancel>إلغاء</button></div>`}
    ${c.replies.map(r=>`<div class="reply"><div class="who ${r.author!=='سارة حرب'?'t':''}"><i>${r.author.split(' ').map(w=>w[0]).join(' ')}</i>${r.author}</div><div class="ctext">${r.text}</div></div>`).join('')}
    ${c.posted?`<div class="rbox"><input placeholder="رد" data-hid="cmt-reply"><button data-reply>إرسال</button></div>`:''}</div>`).join('')}</div>`;
  p.querySelector('[data-x]').onclick=()=>{S.cmts=false;renderComments()};
  p.querySelectorAll('.ccard').forEach(card=>{const id=+card.dataset.c;const c=S.comments.find(x=>x.id===id);
    card.addEventListener('mousedown',e=>{if(S.activeC!==id){S.activeC=id;doc.querySelectorAll('.cmt').forEach(s=>s.classList.toggle('act',s.dataset.c==id));p.querySelectorAll('.ccard').forEach(x=>x.classList.toggle('act',+x.dataset.c===id))}});
    const t=card.querySelector('.ctext[contenteditable]');if(t)t.addEventListener('input',()=>c.text=t.innerHTML);
    card.querySelector('[data-post]')?.addEventListener('click',()=>{if(!c.text.trim()){simToast('اكتب نص التعليق أولًا');return}c.posted=true;renderComments();logAct('comment:post')});
    card.querySelector('[data-cancel]')?.addEventListener('click',()=>{if(!c.text.trim()){doc.querySelectorAll(`.cmt[data-c="${id}"]`).forEach(s=>s.replaceWith(...s.childNodes));S.comments=S.comments.filter(x=>x.id!==id)}renderComments()});
    const send=()=>{const i=card.querySelector('.rbox input');if(!i.value.trim())return;c.replies.push({author:'سارة حرب',text:i.value.trim()});renderComments();logAct('comment:reply')};
    card.querySelector('[data-reply]')?.addEventListener('click',send);card.querySelector('.rbox input')?.addEventListener('keydown',e=>{if(e.key==='Enter')send()});
  });
  doc.querySelectorAll('.cmt').forEach(s=>s.classList.toggle('act',s.dataset.c==S.activeC));
}
function stepComment(d){if(!S.comments.length){simToast('لا توجد تعليقات في المستند');return}let i=S.comments.findIndex(c=>c.id==S.activeC);i=(i+d+S.comments.length)%S.comments.length;S.activeC=S.comments[i].id;S.cmts=true;renderComments();doc.querySelector(`.cmt[data-c="${S.activeC}"]`)?.scrollIntoView({block:'center'});logAct('comment:step')}
doc&&0;document.addEventListener('click',e=>{const c=e.target.closest&&e.target.closest('#doc .cmt');if(c){S.activeC=+c.dataset.c;renderComments()}});
/* date & time */
const AR_MONTHS=['كانون الثاني','شباط','آذار','نيسان','أيار','حزيران','تموز','آب','أيلول','تشرين الأول','تشرين الثاني','كانون الأول'];
const AR_DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const EN_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'],EN_DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function dateFormats(lang){const d=new Date(),D=d.getDate(),M=d.getMonth(),Y=d.getFullYear(),dd=String(D).padStart(2,'0'),mm=String(M+1).padStart(2,'0'),h=d.getHours(),mi_=String(d.getMinutes()).padStart(2,'0');
  if(lang==='ar')return [`${D}/${M+1}/${Y}`,`${dd}/${mm}/${Y}`,`${AR_DAYS[d.getDay()]}، ${dd} ${AR_MONTHS[M]}، ${Y}`,`${dd} ${AR_MONTHS[M]}، ${Y}`,`${dd} ${AR_MONTHS[M]} ${Y}`,`${AR_MONTHS[M]} ${Y}`,`${h%12||12}:${mi_} ${h<12?'ص':'م'}`,`${String(h).padStart(2,'0')}:${mi_}`];
  return [`${M+1}/${D}/${Y}`,`${EN_DAYS[d.getDay()]}, ${EN_MONTHS[M]} ${D}, ${Y}`,`${EN_MONTHS[M]} ${D}, ${Y}`,`${D} ${EN_MONTHS[M]} ${Y}`,`${Y}-${mm}-${dd}`,`${h%12||12}:${mi_} ${h<12?'AM':'PM'}`]}
function dateDlg(){let sel=0;
  dialog({title:'التاريخ والوقت',w:470,body:`<div style="display:flex;gap:14px"><div><div style="margin-bottom:4px">التنسيقات المتوفرة:</div><div class="dtlist" id="dtl" data-hid="dlg-dtlist"></div></div><div style="display:flex;flex-direction:column;gap:10px"><label>اللغة:<br><select id="dtlang" data-hid="dlg-dtlang"><option value="en">الإنجليزية (الولايات المتحدة)</option><option value="ar">العربية (فلسطين)</option></select></label><label class="row"><input type="checkbox" id="dtauto" data-hid="dlg-dtauto" checked> تحديث تلقائي</label></div></div>`,
   onOpen:()=>{const fill=()=>{const fs=dateFormats($('#dtlang').value);$('#dtl').innerHTML=fs.map((f,i)=>`<button data-i="${i}" class="${i===sel?'on':''}">${f}</button>`).join('');$('#dtl').querySelectorAll('button').forEach(b=>b.onclick=()=>{sel=+b.dataset.i;fill()})};$('#dtlang').onchange=()=>{sel=0;fill()};fill()},
   buttons:[{label:'موافق',pri:1,act:()=>{const lang=$('#dtlang').value,f=dateFormats(lang)[sel],auto=$('#dtauto').checked;restoreSel();snap();
     if(auto){const s=document.createElement('span');s.className='dtf';s.dataset.auto='1';s.dataset.lang=lang;s.textContent=f;insertInline(s)}else{const s=document.createElement('span');s.className='dtx';s.dataset.lang=lang;s.textContent=f;insertInline(s)}
     logAct(`date:${lang}:${sel}:${auto?'auto':'fixed'}`)}},{label:'إلغاء'}]});
}
/* symbols */
function pushRecent(s){window.SYM_RECENT=[s,...SYM_RECENT.filter(x=>x!==s)].slice(0,20);$$('.dd').forEach(dd=>{if(dd.querySelector('#symRecent'))dd.innerHTML=PANELS.symbols()})}
function symbolDlg(){let cur=null;
  dialog({title:'رمز',w:470,body:`<div style="margin-bottom:6px">الخط: (نص عادي)</div><div class="symgrid" id="sgrid">${SYMBOLS_ALL.map(s=>`<button data-s="${s}">${s}</button>`).join('')}</div><div style="margin-top:6px">الرموز المستخدمة مؤخرًا:</div><div class="symgrid" style="grid-template-columns:repeat(16,26px)">${SYM_RECENT.slice(0,16).map(s=>`<button data-s="${s}">${s}</button>`).join('')}</div><div id="sname" style="margin-top:6px;color:#605e5c;min-height:18px"></div>`,
   onOpen:d=>d.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{cur=b.dataset.s;d.querySelectorAll('[data-s]').forEach(x=>x.classList.toggle('on',x===b));$('#sname').textContent=(SYM_NAMES[cur]||'رمز')+'  —  رمز الحرف: '+cur.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}),
   buttons:[{label:'إدراج',pri:1,act:()=>{if(!cur){simToast('اختر رمزًا أولًا');return false}OPS.insSymbol(cur);return false}},{label:'إغلاق'}]});
}
function colorDlg(cb){dialog({title:'ألوان',body:`<label class="row">اختر لونًا: <input type="color" id="cdc" value="#2b579a"></label>`,buttons:[{label:'موافق',pri:1,act:()=>cb($('#cdc').value)},{label:'إلغاء'}]})}

/* clicking a footnote reference selects it (so Delete removes it) */
document.addEventListener('mousedown',e=>{const r=e.target.closest&&e.target.closest('#doc .fnr,#doc .enr');if(!r)return;e.preventDefault();const rr=document.createRange();rr.selectNode(r);editHost(r.parentElement).focus();const s=getSelection();s.removeAllRanges();s.addRange(rr);S.range=rr.cloneRange();logAct('noteRefSel')});
document.addEventListener('keydown',e=>{if(!(e.key==='Delete'||e.key==='Backspace'))return;const r=curRange();if(!r||r.collapsed)return;const n=r.cloneContents().querySelector('.fnr,.enr');if(!n)return;e.preventDefault();snap();ex('delete');[...doc.querySelectorAll('.fnr,.enr')].forEach(x=>{if(r.intersectsNode(x))x.remove()});syncNotes();logAct('noteDeleted')},true);
