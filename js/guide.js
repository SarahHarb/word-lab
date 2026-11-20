/* ================= «👆 أرني أين» — يمشي مع الطالب خطوة خطوة =================
   يضيء العنصر التالي فقط (الخلية ← التبويب ← الزر ← عنصر القائمة ← تبويب النافذة ← القائمة المنسدلة ← موافق)
   وينتقل للخطوة التالية عندما ينفّذها الطالب بنفسه. */
const GP={
 cell:(fn,say)=>({el:fn,say,done:()=>{const e=fn();return !!e&&!!S.curCell&&(e===S.curCell||e.contains(S.curCell)||(S.selCells||[]).some(c=>e.contains(c)||e===c))}}),
 tab:(tab)=>({el:()=>$(`#wtabs [data-tab="${tab}"]`),say:`افتح تبويب «${$(`#wtabs [data-tab="${tab}"]`)?.textContent.trim()||tab}»`,done:()=>!!$(`#wtabs [data-tab="${tab}"]`)?.classList.contains('on')}),
 btn:(tab,hid,say)=>({el:()=>$(`#ribbon [data-panel="${tab}"] [data-hid="${hid}"]`),say,click:1}),
 dd:(tab,hid,say)=>({el:()=>$(`#ribbon [data-panel="${tab}"] [data-hid="${hid}"]`),say,done:()=>!!$('.ddw.open')}),
 mi:(cmd,arg,say)=>{const A=arg==null||arg==='null'?'':`[data-arg="${arg}"]`;return {avoid:1,el:()=>$(`.ddw.open .mi[data-cmd="${cmd}"]${A}`)||$(`.ddw.open [data-cmd="${cmd}"]${A}`),say,click:1}},
 menu:(say)=>({el:()=>$('.ddw.open > .dd')||$('.ddw.open'),say,click:1,avoid:1}),
 sel:(q,say,done)=>({el:()=>$(q),say,done,click:done?0:1}),
};
const GD={on:false,steps:[],i:0,r:null,clicked:false};
const ARGLBL={tdelete:{col:'حذف أعمدة',row:'حذف صفوف',table:'حذف جدول',cells:'حذف خلايا...'},tselect:{col:'تحديد عمود',row:'تحديد صف',table:'تحديد الجدول',cell:'تحديد خلية'},autofit:{content:'احتواء تلقائي للمحتويات',window:'احتواء تلقائي للإطار',fixed:'عرض عمود ثابت'},tborders:{none:'بلا حدود',all:'كل الحدود',outside:'حدود خارجية',inside:'حدود داخلية',bottom:'حد سفلي',top:'حد علوي',left:'حد أيسر',right:'حد أيمن',more:'حدود وتظليل...'}};
const DDSAY={shading:'اختر اللون المطلوب',penColor:'اختر اللون المطلوب',fontcolor:'اختر اللون المطلوب',penWeight:'اختر السُّمك المطلوب',penStyle:'اختر نمط الخط المطلوب',tborders:'اختر نوع الحد المطلوب',table:'مرّر على المربعات حتى العدد المطلوب ثم انقر'};
function guideArg(r){const f=(r.fix||'')+'';const c=r.cmd;
 if(c==='tdelete')return /حذف أعمدة|حذف عمود/.test(f)?'col':/حذف جدول/.test(f)?'table':/حذف صفوف|حذف صف/.test(f)?'row':null;
 if(c==='tselect')return /تحديد عمود/.test(f)?'col':/تحديد صف/.test(f)?'row':/تحديد الجدول/.test(f)?'table':null;
 if(c==='autofit')return /للمحتويات/.test(f)?'content':/للإطار|للنافذة/.test(f)?'window':null;
 if(c==='tborders')return /بلا حدود/.test(f)?'none':/كل الحدود/.test(f)?'all':/حدود خارجية/.test(f)?'outside':/حدود داخلية/.test(f)?'inside':/حد سفلي/.test(f)?'bottom':/حد علوي/.test(f)?'top':/حد أيسر/.test(f)?'left':/حد أيمن/.test(f)?'right':null;
 return null}
function buildGuide(r){if(r.path)return (typeof r.path==='function'?r.path():r.path).slice();const st=[];let where=null;try{where=r.where&&r.where()}catch(e){}
 if(where&&doc.contains(where)&&where.tagName!=='TABLE'&&where.closest&&where.closest('table'))st.push(GP.cell(()=>{try{return r.where()}catch(e){return null}},where.tagName==='TR'?'انقر في هذا الصف (أو حدّده)':'انقر في الخلية المضيئة'));
 if(where&&doc.contains(where)&&where.classList&&where.classList.contains('obj'))st.push({el:()=>{try{return r.where()}catch(e){return null}},say:where.classList.contains('pic')?'انقر على الصورة لتحديدها':'انقر على حدّ الشكل لتحديده',done:()=>{let w=null;try{w=r.where()}catch(e){}return !!w&&S.obj===w}});
 if(r.hfFirst)st.push({el:()=>pages()[r.hfPage||0]?.querySelector(r.hfFirst==='ftr'?'.pg-ftr':'.pg-hdr'),say:'انقر نقرًا مزدوجًا هنا لفتح '+(r.hfFirst==='ftr'?'التذييل':'الرأس'),done:()=>S.hfMode});
 if(r.caretIn){const w=()=>{let e=null;try{e=r.where()}catch(x){}return e};st.push({el:w,say:'انقر في هذا السطر',done:()=>{const e=w(),g=S.range||curRange();return (!!e&&!!g&&e.contains(g.startContainer))||(()=>{try{return r.check()}catch(x){return false}})()}})}
 if(r.selText){const w=()=>{let e=null;try{e=r.where()}catch(x){}return e};st.push({el:w,say:`حدّد «${r.selText.length>18?r.selText.slice(0,18)+'…':r.selText}» — اسحب عليها بالفأرة، أو انقر على الكلمة نقرًا مزدوجًا`,done:()=>{const t=selText().replace(/\s+/g,' ').trim();return !!t&&(t.includes(r.selText)||r.selText.includes(t)&&t.length>=Math.min(2,r.selText.length))||(()=>{try{return r.check()}catch(x){return false}})()}})}
 if(r.tab==='eqdesign'){if(doc.querySelector('.pg-body .eq'))st.push({el:()=>doc.querySelector('.pg-body .eq'),say:'انقر داخل المعادلة',done:()=>!!curEq()});
   else{const w=()=>{let e=null;try{e=r.where()}catch(x){}return e};st.push({el:w,say:'انقر في السطر الفارغ',done:()=>{const e=w(),g=S.range;return !!curEq()||(!!e&&!!g&&e.contains(g.startContainer))}},{...GP.tab('insert'),done:()=>!!curEq()||!!$('#wtabs [data-tab="insert"]')?.classList.contains('on')},{el:()=>$('#ribbon [data-panel="insert"] [data-hid="equation"]'),say:'انقر «معادلة»',done:()=>!!curEq()})}}
 if(r.cmd&&r.gal&&(r.tab||tabOfCmd(r.cmd))){const tab=r.tab||tabOfCmd(r.cmd);st.push(GP.tab(tab));st.push({avoid:1,el:()=>$(`#ribbon [data-panel="${tab}"] ${r.gal[0]}`),say:r.gal[1],click:1})}
 else if(r.cmd){const tab=r.tab||tabOfCmd(r.cmd);const b=tab&&$(`#ribbon [data-panel="${tab}"] [data-hid="${r.cmd}"]`);
   if(tab&&b){st.push(GP.tab(tab));const lbl=(b.dataset.tip||b.textContent||'').trim().replace(/▾/g,'');
     if(b.dataset.dd){st.push(GP.dd(tab,r.cmd,`افتح قائمة «${lbl}» ▾`));const a=guideArg(r);if(r.sub)st.push({avoid:1,el:()=>$(`.ddw.open [data-sub="${r.sub[0]}"]`),say:`مرّر على «${r.sub[1]}» ◂`,done:()=>!!$(`.ddw.open .subm[data-subm="${r.sub[0]}"].open`)});if(r.mi)st.push(GP.mi(r.mi[0],r.mi[1],`اختر: «${r.mi[2]}»`));else if(a)st.push(GP.mi(r.cmd,a,`اختر: «${(ARGLBL[r.cmd]||{})[a]||a}»`));else st.push(GP.menu(DDSAY[r.cmd]||'اختر من القائمة'))}
     else if(b.querySelector('input[type=checkbox]')||b.matches('label'))st.push({el:()=>$(`#ribbon [data-panel="${tab}"] [data-hid="${r.cmd}"]`),say:`${/أزل|ألغِ/.test(r.fix||'')?'أزل':'ضع'} ✓ على «${lbl}»`,done:()=>{try{return r.check()}catch(e){return false}}});
     else if(b.querySelector('input'))st.push({el:()=>$(`#ribbon [data-panel="${tab}"] [data-hid="${r.cmd}"] input`),say:`«${lbl}»: اكتب الرقم ثم Enter`,done:()=>{try{return r.check()}catch(e){return false}}});
     else st.push(GP.btn(tab,r.cmd,`انقر «${lbl}»`))}else if(tab&&r.gal){st.push(GP.tab(tab));st.push({avoid:1,el:()=>$(`#ribbon [data-panel="${tab}"] ${r.gal[0]}`),say:r.gal[1],click:1})}}
 return st}
function startGuide(i){const r=CO.item&&CO.item.reqs&&CO.item.reqs[i];if(!r)return false;const st=buildGuide(r);if(!st.length)return false;
 st.push({el:()=>{let e=null;try{e=r.where&&r.where()}catch(x){}return e||PT_()},say:fixOf(r),done:()=>false,last:1});
 if(typeof isPhone==='function'&&isPhone())$('#refpanel')?.classList.add('mcol');GD.on=true;GD.steps=st;GD.i=0;GD.r=r;GD.clicked=false;CO.exEl=null;clearHints();gTick();return true}
function stopGuide(msg){if(!GD.on)return;GD.on=false;hideCoach();if(msg)simToast(msg)}
function gTick(){if(!GD.on)return;const r=GD.r;if(!CO.item||!CO.item.reqs.includes(r)){stopGuide();return}
 let ok=false;try{ok=r.check()}catch(e){}if(ok){stopGuide('✓ '+r.t);return}
 let s=GD.steps[GD.i];let el=null;try{el=s.el()}catch(e){}
 if(!el||!vis(el)){if(Date.now()-(GD.hold||0)<700)return;if(GD.i>0){GD.i--;GD.clicked=false}else hideCoach();return}
 let d=false;try{d=!!(s.done&&s.done())}catch(e){}
 if((d||GD.clicked)&&!s.last){GD.i++;GD.clicked=false;return}
 if(doc.contains(el)&&canvas&&canvas.contains(el)){const rr=el.getBoundingClientRect();if(rr.bottom<0||rr.top>LH())el.scrollIntoView({block:'center'})}
 placeCoach(el,`<span class="bt">${s.last?'الآن':`الخطوة ${GD.i+1} من ${GD.steps.length-1}`}</span>${s.say}<br><button class="gstop" onmousedown="event.stopPropagation();stopGuide()">إيقاف الإرشاد</button>`);avoidCover(s.avoid?($('.ddw.open > .dd')||el):($('#dlgs.show .dlg')&&$('#dlgs.show .dlg').contains(el)?null:null))}
function avoidCover(box){if(!box)return;const b=$('#bubble');if(!b||b.style.display==='none')return;const R=box.getBoundingClientRect(),V=VP(),k=+b.dataset.k||1,bw=b.offsetWidth*k,bh=b.offsetHeight*k,L=V.l,T=V.t,W=V.l+V.w,H=V.t+V.h;
 const O=OX(),r={left:R.left+O.x,right:R.right+O.x,top:R.top+O.y,bottom:R.bottom+O.y};
 const cl=(v,a,z)=>Math.max(a,Math.min(z,v));
 const cand=[[r.left-bw-14,cl(r.top,T+8,H-bh-8)],[r.right+14,cl(r.top,T+8,H-bh-8)],[cl(r.left,L+8,W-bw-8),r.bottom+12],[cl(r.left,L+8,W-bw-8),r.top-bh-12],[L+8,H-bh-8]];
 for(const [x,y] of cand){if(x>=L+4&&y>=T+4&&x+bw<=W-4&&y+bh<=H-4&&(x+bw<=r.left||x>=r.right||y+bh<=r.top||y>=r.bottom)){b.style.left=x+'px';b.style.top=y+'px';b.className='free';return}}
 b.style.left=Math.max(L+8,W-bw-8)+'px';b.style.top=(H-bh-8)+'px';b.className='free'}
setInterval(gTick,220);
document.addEventListener('mousedown',e=>{if(!GD.on||!e.target.closest)return;if(e.target.closest('.gstop'))return;const s=GD.steps[GD.i];let el=null;try{el=s&&s.el()}catch(x){}if(el&&(el===e.target||el.contains(e.target))&&!s.last){if(s.click){GD.i=Math.min(GD.i+1,GD.steps.length-1);GD.clicked=false;GD.hold=Date.now()}else GD.clicked=true}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&GD.on)stopGuide()},true);
(function(){const old=window.showReqHint;window.showReqHint=function(i){if(startGuide(i))return;return old(i)}})();
/* explicit, deeper paths */
(function(){
 const pat=(cellFn,cellSay)=>()=>[GP.cell(cellFn,cellSay),GP.tab('tdesign'),GP.dd('tdesign','tborders','افتح قائمة «حدود» ▾'),GP.mi('tborders','more','اختر «حدود وتظليل...» (آخر القائمة)'),
   GP.sel('.bdtabs [data-t="shade"]','افتح تبويب «التظليل»',()=>!!$('.bdtabs [data-t="shade"]')?.classList.contains('on')),
   GP.sel('.bdP','افتح قائمة «النمط» وانزل بالتمرير حتى «قطري لأسفل داكن»',()=>/^(dkD|dkU|ltD|ltU)$/.test($('.bdP')?.value||'')),
   GP.sel('[data-p="shade"] .bdApply','تأكد أن «تطبيق على» = «الخلية» (وليس الجدول)',()=>$('[data-p="shade"] .bdApply')?.value==='cell'),
   GP.sel('#dlgs .df .pri','اضغط «موافق»')];
 if(typeof PIC_SHADE!=='undefined'){const r=PIC_SHADE.reqs.find(q=>/كعك/.test(q.t));if(r)r.path=pat(()=>findCell('كعك'),'انقر في خلية «كعك»')}
 if(typeof HOUSE_TASK!=='undefined'){const r=HOUSE_TASK.reqs.find(q=>/نقش/.test(q.t));if(r)r.path=pat(()=>{const t=HT();return t&&t.rows[1]?t.rows[1].cells[t.rows[1].cells.length-1]:null},'انقر في الخلية التي سيكون فيها النقش (الصف الثاني، فوق المربع الكبير)')}
 const dlgBorders=(cellFn,say,setting,extra)=>()=>[GP.cell(cellFn,say),GP.tab('tdesign'),GP.dd('tdesign','tborders','افتح قائمة «حدود» ▾'),GP.mi('tborders','more','اختر «حدود وتظليل...»'),...(extra||[]),GP.sel('#dlgs .df .pri','اضغط «موافق»')];
 if(typeof PIC_DASH!=='undefined'){const r=PIC_DASH.reqs[0];if(r)r.path=dlgBorders(()=>PT_()?.rows[1]?.cells[0],'انقر داخل الجدول',null,[
   GP.sel('.bln[data-s="dashed"]','من «النمط» اختر الخط المتقطع',()=>!!$('.bln[data-s="dashed"]')?.classList.contains('on')),
   GP.sel('.bp.h','في المعاينة: انقر الخط الداخلي الأفقي ═',()=>!!$('.bp.h')?.classList.contains('on')&&$('.bset[data-set="custom"]')?.classList.contains('on')),
   GP.sel('.bp.v','وانقر الخط الداخلي العمودي ║',()=>!!$('.bp.v')?.classList.contains('on')&&$('.bset[data-set="custom"]')?.classList.contains('on')),
   GP.sel('[data-p="borders"] .bdApply','«تطبيق على» = الجدول',()=>$('[data-p="borders"] .bdApply')?.value==='table')])}
})();
