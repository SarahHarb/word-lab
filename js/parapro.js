/* ================= مجموعة «فقرة»: اتجاه النص، المسافة البادئة، علامات التنسيق، التظليل، الحدود (مثل Word) ================= */
(function(){
const pbBlocks=()=>{const bs=selBlocks().filter(b=>b&&b.closest&&b.closest('.pg-body,.stxt,td,th'));return bs};
const BD=()=>{const p=S.pbPen||{};return `${p.w||1}px ${p.s||'solid'} ${p.c||'#000000'}`};
/* ترتيب الفقرات المتتالية في مجموعات (الحد الخارجي يحيط بالمجموعة كلها كما في Word) */
const groups=bs=>{const out=[];let cur=[];bs.forEach(b=>{if(cur.length&&cur[cur.length-1].nextElementSibling===b)cur.push(b);else{if(cur.length)out.push(cur);cur=[b]}});if(cur.length)out.push(cur);return out};
const side=k=>({top:'borderTop',bottom:'borderBottom',left:'borderLeft',right:'borderRight'})[k];
const has=(b,k)=>!!b.style[side(k)]&&!/none|^0/.test(b.style[side(k)]);
function tidy(b){const any=['top','bottom','left','right'].some(k=>has(b,k));b.style.padding=any?'1px 4px':'';if(!any){b.style.marginBottom='';b.style.marginTop=''}}
function applyPB(bs,spec,bd){groups(bs).forEach(g=>{g.forEach((b,i)=>{const first=i===0,last=i===g.length-1;
   if(spec.left!==undefined)b.style.borderLeft=spec.left?bd:'';if(spec.right!==undefined)b.style.borderRight=spec.right?bd:'';
   if(spec.top!==undefined&&first)b.style.borderTop=spec.top?bd:'';if(spec.bottom!==undefined&&last)b.style.borderBottom=spec.bottom?bd:'';
   if(spec.ih!==undefined){if(!last)b.style.borderBottom=spec.ih?bd:'';if(!first)b.style.borderTop=''}
   if(g.length>1){if(!last)b.style.marginBottom='0';if(!first)b.style.marginTop='0'}
   tidy(b)})})}
function PB_STATE(a){try{const bs=pbBlocks();if(!bs.length)return false;const g=groups(bs);const T=()=>g.every(x=>has(x[0],'top')),B=()=>g.every(x=>has(x[x.length-1],'bottom')),L=()=>bs.every(b=>has(b,'left')),R=()=>bs.every(b=>has(b,'right')),I=()=>g.every(x=>x.slice(0,-1).every(b=>has(b,'bottom')))&&g.some(x=>x.length>1);
  return a==='top'?T():a==='bottom'?B():a==='left'?L():a==='right'?R():a==='box'?T()&&B()&&L()&&R():a==='all'?T()&&B()&&L()&&R()&&(I()||g.every(x=>x.length<2)):a==='inside'||a==='ih'?I():a==='none'?bs.every(b=>!['top','bottom','left','right'].some(k=>has(b,k))):false}catch(e){return false}}
window.PB_STATE=PB_STATE;
OPS.pborders=function(a){if(a==='more')return paraBordersDlg();if(!needSel())return;const bs=pbBlocks();if(!bs.length)return;
  if(a==='drawTable')return run('drawTable');if(a==='viewGrid')return run('viewGrid');
  a=a||S.lastPB||'bottom';snap();const bd=BD();
  if(a==='hr'){const hr=document.createElement('hr');hr.className='whr';bs[bs.length-1].after(hr);logAct('pborders:hr');SIM.emit('change');return}
  S.lastPB=a;const g=groups(bs);
  if(a==='none')applyPB(bs,{top:0,bottom:0,left:0,right:0,ih:0},bd);
  else if(a==='box'){const on=!PB_STATE('box');applyPB(bs,on?{top:1,bottom:1,left:1,right:1,ih:0}:{top:0,bottom:0,left:0,right:0},bd)}
  else if(a==='all'){const on=!PB_STATE('all');applyPB(bs,on?{top:1,bottom:1,left:1,right:1,ih:1}:{top:0,bottom:0,left:0,right:0,ih:0},bd)}
  else if(a==='inside'||a==='ih'){const on=!g.every(x=>x.slice(0,-1).every(b=>has(b,'bottom')));applyPB(bs,{ih:on?1:0},bd)}
  else{const on=a==='top'?!g.every(x=>has(x[0],'top')):a==='bottom'?!g.every(x=>has(x[x.length-1],'bottom')):!bs.every(b=>has(b,a));applyPB(bs,{[a]:on?1:0},bd)}
  logAct('pborders:'+a);SIM.emit('change')};
OPS.pshading=function(c){if(c==='more')return colorDlg(v=>OPS.pshading(v));if(!needSel())return;snap();pbBlocks().forEach(b=>{b.style.backgroundColor=c==='none'?'':(c||S.lastPS||'#d9e2f3');if(c==='none')b.style.backgroundImage=''});if(c&&c!=='none')S.lastPS=c;logAct('pshading:'+(c||'last'));SIM.emit('change')};
OPS.rtl=function(){if(!needSel())return;snap();pbBlocks().forEach(b=>{b.dir='rtl';if(/left/.test(b.style.textAlign))b.style.textAlign=''});logAct('dir:rtl');SIM.emit('change')};
OPS.ltr=function(){if(!needSel())return;snap();pbBlocks().forEach(b=>{b.dir='ltr';if(/right/.test(b.style.textAlign))b.style.textAlign=''});logAct('dir:ltr');SIM.emit('change')};
const mside=b=>getComputedStyle(b).direction==='ltr'?'marginLeft':'marginRight';
OPS.indentInc=function(){if(!needSel())return;snap();if(listOf()){ex('indent');logAct('indentInc');return}pbBlocks().forEach(b=>{const k=mside(b);b.style[k]=((parseFloat(b.style[k])||0)+48)+'px'});logAct('indentInc');SIM.emit('change')};
const lvl1=()=>{const l=listOf();if(!l)return false;return !(l.parentElement&&l.parentElement.closest('ul,ol')&&firstBody().contains(l.parentElement))};
window.listLvl1=lvl1;
OPS.indentDec=function(){if(!needSel())return;if(listOf()){if(lvl1()){simToast('هذا المستوى الأول من القائمة — لإلغاء الترقيم الضغط زر «ترقيم» مرة ثانية');return}snap();ex('outdent');logAct('indentDec');return}snap();pbBlocks().forEach(b=>{const k=mside(b);b.style[k]=Math.max(0,(parseFloat(b.style[k])||0)-48)+'px'||''});logAct('indentDec');SIM.emit('change')};
/* علامات التنسيق: ¶ نهاية الفقرة، · للمسافة، → للجدولة */
function markSpaces(on){doc.querySelectorAll('.pg-body .spm').forEach(s=>s.replaceWith(document.createTextNode(s.textContent)));doc.querySelectorAll('.pg-body').forEach(b=>b.normalize());
  if(!on)return;doc.querySelectorAll('.pg-body').forEach(b=>{const w=document.createTreeWalker(b,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('.obj,.eq,.spm')||!/ /.test(n.data)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});const ns=[];let n;while(n=w.nextNode())ns.push(n);
   ns.forEach(t=>{const f=document.createDocumentFragment();t.data.split(/( )/).forEach(x=>{if(x===' '){const s=document.createElement('span');s.className='spm';s.textContent=' ';f.appendChild(s)}else if(x)f.appendChild(document.createTextNode(x))});t.replaceWith(f)})})}
OPS.marks=function(){S.marks=!S.marks;applyPage();markSpaces(S.marks);logAct('marks:'+S.marks);typeof syncRibbon==='function'&&syncRibbon()};
window.markSpaces=markSpaces;

/* حدود وتظليل للفقرة: الحدود / حدود الصفحة / التظليل */
window.paraBordersDlg=function(tab){if(!needSel())return;const bs=pbBlocks();if(!bs.length)return;const r0=S.range.cloneRange();const p=S.pbPen||{};
 const b0=bs[0];let setting=null;let sides={top:has(b0,'top'),bottom:has(bs[bs.length-1],'bottom'),left:has(b0,'left'),right:has(b0,'right'),ih:bs.length>1&&has(b0,'bottom')};
 const st={style:p.s||'solid',color:p.c||'#000000',w:String(p.w||1),fill:null,pat:'clear',pcol:'#000000',apply:'para',papply:'para'};let bCh=false,sCh=false;
 const PRE={none:{top:0,bottom:0,left:0,right:0,ih:0},box:{top:1,bottom:1,left:1,right:1,ih:0},shadow:{top:1,bottom:1,left:1,right:1,ih:0},all:{top:1,bottom:1,left:1,right:1,ih:1}};
 const DESC={none:'<b>بلا:</b> يزيل الحدود.',box:'<b>مربع:</b> إطار حول الفقرة (أو الفقرات المحدّدة معًا).',shadow:'<b>ظل:</b> إطار مع ظل أسفل ويسار.',all:'<b>الكل:</b> إطار + خط بين كل فقرتين.',custom:'<b>مخصّص:</b> اختيار النمط واللون والعرض، ثم النقر على الجوانب في المعاينة.'};
 const sw=(cls,arr)=>arr.map(c=>`<button class="${cls}" data-c="${c}" title="${c||'بلا لون'}" style="background:${c||'#fff'}">${c?'':'✕'}</button>`).join('');
 const LS=(typeof LINE_STYLES!=='undefined'?LINE_STYLES:[['solid','متصل'],['dotted','منقّط'],['dashed','متقطّع'],['double','مزدوج']]);
 const FL=typeof FILLS!=='undefined'?FILLS:['','#ffffff','#f2f2f2','#d9d9d9','#bfbfbf','#fff2cc','#fbe4d5','#e2efda','#ddebf7','#d9e2f3','#ededed','#ffff00','#ffc000','#92d050','#00b0f0','#c00000'];
 const pb=S.page.border||{s:'solid',c:'#000000',w:2};
 const d=dialog({title:'حدود وتظليل',w:700,body:`<div class="bdtabs"><button data-t="borders" class="on">الحدود</button><button data-t="page">حدود الصفحة</button><button data-t="shade">التظليل</button></div>
  <div class="bdpane" data-p="borders"><div class="bdlg">
   <div class="bd-set"><b>الإعداد:</b>${[['none','بلا'],['box','مربع'],['shadow','ظل'],['all','الكل'],['custom','مخصّص']].map(([k,l])=>`<button class="bset" data-set="${k}" data-hid="pb-set-${k}"><i class="bi bi-${k==='shadow'?'box':k==='all'?'all':k}"></i>${l}</button>`).join('')}</div>
   <div class="bd-mid"><b>النمط:</b><div class="bd-lines">${LS.map(([k])=>`<button class="bln" data-s="${k}"><span style="border-top:${k==='double'?4:2}px ${k} #000"></span></button>`).join('')}</div>
    <label>اللون:<span class="bd-cols">${sw('bdc',['#000000','#7f7f7f','#0070c0','#00b0f0','#00b050','#92d050','#ffc000','#c00000','#7030a0','#ffffff'])}</span></label>
    <label>العرض:<select class="bdW"><option value="1">½ نقطة</option><option value="2">1½ نقطة</option><option value="3">2¼ نقطة</option><option value="4">3 نقاط</option><option value="6">4½ نقاط</option></select></label></div>
   <div class="bd-prev"><b>معاينة</b><small>النقر على الجوانب لإضافة حدّ أو إزالته</small><div class="bp-box"><div class="bp-in pp-in"><span class="ih"></span><i class="ppl"></i><i class="ppl"></i></div>
    <button class="bp t" data-s="top" title="حد علوي">▔</button><button class="bp b" data-s="bottom" title="حد سفلي">▁</button><button class="bp r" data-s="right" title="حد أيمن">▕</button><button class="bp l" data-s="left" title="حد أيسر">▏</button><button class="bp h" data-s="ih" title="حد بين الفقرات">═</button></div>
    <label class="bd-apl">تطبيق على: <select class="pbApply"><option value="para">الفقرة</option><option value="text">النص</option></select></label></div>
  </div><div class="bd-desc" id="bdDesc">${DESC.custom}</div></div>
  <div class="bdpane" data-p="page" hidden><div class="pgb">
   <label class="row">الإعداد: <select id="pgSet"><option value="none">بلا</option><option value="box" ${S.page.border?'selected':''}>مربع</option><option value="shadow">ظل</option></select></label>
   <label class="row">النمط: <select id="pgS">${LS.map(([k,l])=>`<option value="${k}" ${pb.s===k?'selected':''}>${l}</option>`).join('')}</select></label>
   <label class="row">اللون: <input type="color" id="pgC" value="${pb.c}"></label>
   <label class="row">العرض: <select id="pgW">${[[1,'½ نقطة'],[2,'1½ نقطة'],[4,'3 نقاط'],[6,'4½ نقطة']].map(([v,l])=>`<option value="${v}" ${+pb.w===v?'selected':''}>${l}</option>`).join('')}</select></label>
   <p class="sm">حدود الصفحة إطار حول الصفحة كلها (كل الصفحات).</p></div></div>
  <div class="bdpane" data-p="shade" hidden><div class="shg">
   <div><b>تعبئة:</b><div class="bd-fills">${sw('bdf',FL)}</div><button type="button" class="pbmore" style="margin-top:6px">ألوان أخرى...</button></div>
   <div><b>النقش:</b><label>النمط:<select class="bdP">${(typeof PATS!=='undefined'?PATS:[['clear','واضح']]).map(([k,l])=>`<option value="${k}">${l}</option>`).join('')}</select></label>
    <label>اللون:<span class="bd-cols">${sw('bdpc',['#000000','#7f7f7f','#0070c0','#00b050','#c00000','#7030a0','#ffc000','#ffffff'])}</span></label></div>
   <div class="bd-prev"><b>معاينة</b><div class="shprev"><span>أب ج</span></div><label class="bd-apl">تطبيق على: <select class="psApply"><option value="para">الفقرة</option><option value="text">النص</option></select></label></div></div></div>`,
  buttons:[{label:'موافق',pri:1,act:dd=>{const sl=getSelection();sl.removeAllRanges();sl.addRange(r0);S.range=r0.cloneRange();snap();
     if(bCh){const bd=`${st.w}px ${st.style} ${st.color}`;S.pbPen={s:st.style,c:st.color,w:st.w};
       if(st.apply==='text'){styleSel(`border:${sides.top||sides.left||sides.right||sides.bottom?bd:'none'};padding:0 2px`)}
       else{applyPB(bs,{top:sides.top?1:0,bottom:sides.bottom?1:0,left:sides.left?1:0,right:sides.right?1:0,ih:sides.ih?1:0},bd);bs.forEach(b=>b.style.boxShadow=setting==='shadow'?`-4px 4px 0 ${st.color}`:'')}}
     if(sCh){const bg=patCSS?patCSS(st.pat,st.pcol):'';if(st.papply==='text'){if(st.fill!==null)styleSel(`background-color:${st.fill||'transparent'}`)}else bs.forEach(b=>{if(st.fill!==null)b.style.backgroundColor=st.fill;b.style.backgroundImage=bg})}
     const q1=x=>dd.querySelector(x);const ps=q1('#pgSet');if(ps&&ps.dataset.ch){const v=ps.value;S.page.border=v==='none'?null:{s:q1('#pgS').value,c:q1('#pgC').value,w:+q1('#pgW').value,sh:v==='shadow'};applyPage();logAct('pageBorder')}
     logAct('paraBordersDlg');SIM.emit('change')}},{label:'إلغاء'}],
  onOpen:dd=>{const q=s=>dd.querySelector(s),qa=s=>[...dd.querySelectorAll(s)];
   const paint=()=>{const bd=`${Math.min(4,+st.w)}px ${st.style} ${st.color}`,off='1px dotted #ccc';const bi=q('.bp-in');
     bi.style.borderTop=sides.top?bd:off;bi.style.borderBottom=sides.bottom?bd:off;bi.style.borderRight=sides.right?bd:off;bi.style.borderLeft=sides.left?bd:off;bi.querySelector('.ih').style.borderTop=sides.ih?bd:off;
     bi.style.boxShadow=setting==='shadow'?`-4px 4px 0 ${st.color}`:'';
     qa('.bp').forEach(b=>b.classList.toggle('on',!!sides[b.dataset.s]));qa('.bset').forEach(b=>b.classList.toggle('on',b.dataset.set===setting));
     qa('.bln').forEach(b=>b.classList.toggle('on',b.dataset.s===st.style));qa('.bdc').forEach(b=>b.classList.toggle('on',b.dataset.c===st.color));
     if(setting)q('#bdDesc').innerHTML=DESC[setting];
     qa('.bdf').forEach(b=>b.classList.toggle('on',st.fill!==null&&b.dataset.c===st.fill));qa('.bdpc').forEach(b=>b.classList.toggle('on',b.dataset.c===st.pcol));
     const sp=q('.shprev');sp.style.backgroundColor=st.fill||'#fff';sp.style.backgroundImage=patCSS?patCSS(st.pat,st.pcol):''};
   qa('.bdtabs button').forEach(b=>b.onclick=()=>{qa('.bdtabs button').forEach(x=>x.classList.toggle('on',x===b));qa('.bdpane').forEach(x=>x.hidden=x.dataset.p!==b.dataset.t)});
   qa('.bset').forEach(b=>b.onclick=()=>{setting=b.dataset.set;if(PRE[setting])sides={...PRE[setting]};bCh=true;paint()});
   qa('.bp').forEach(b=>b.onclick=()=>{const k=b.dataset.s;sides[k]=!sides[k];setting='custom';bCh=true;paint()});
   qa('.bln').forEach(b=>b.onclick=()=>{st.style=b.dataset.s;bCh=true;if(!setting)setting='custom';paint()});
   qa('.bdc').forEach(b=>b.onclick=()=>{st.color=b.dataset.c;bCh=true;if(!setting)setting='custom';paint()});
   q('.bdW').value=st.w;q('.bdW').onchange=e=>{st.w=e.target.value;bCh=true;if(!setting)setting='custom';paint()};
   q('.pbApply').onchange=e=>{st.apply=e.target.value;bCh=true};q('.psApply').onchange=e=>{st.papply=e.target.value;sCh=true};
   qa('.bdf').forEach(b=>b.onclick=()=>{st.fill=b.dataset.c;sCh=true;paint()});
   q('.pbmore').onclick=()=>{const i=document.createElement('input');i.type='color';i.value='#d9e2f3';i.style.cssText='position:fixed;opacity:0;pointer-events:none';document.body.appendChild(i);i.oninput=()=>{st.fill=i.value;sCh=true;paint()};i.onchange=()=>i.remove();i.click()};
   q('.bdP').onchange=e=>{st.pat=e.target.value;sCh=true;paint()};qa('.bdpc').forEach(b=>b.onclick=()=>{st.pcol=b.dataset.c;sCh=true;paint()});
   ['#pgSet','#pgS','#pgC','#pgW'].forEach(s=>{const e=q(s);if(e)e.addEventListener('change',()=>{q('#pgSet').dataset.ch=1;if(s!=='#pgSet'&&q('#pgSet').value==='none')q('#pgSet').value='box'})});
   if(tab==='shade')qa('.bdtabs button')[2].click();if(tab==='page')qa('.bdtabs button')[1].click();paint()}});
};
OPS.paraBordersDlg=()=>paraBordersDlg();
})();
