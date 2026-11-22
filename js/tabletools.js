/* ================= Table tools that work like real Word =================
   نسخ تنسيق الحدود (الريشة) · رسم جدول (القلم) · الممحاة · نافذة «حدود وتظليل» (مربع/الكل/شبكة/مخصّص) */
const SIDE_CAP={top:'Top',bottom:'Bottom',left:'Left',right:'Right'};
const OPP={top:'bottom',bottom:'top',left:'right',right:'left'};
const isRTLt=t=>getComputedStyle(t).direction!=='ltr';
function penBd(){const p=S.pen||{};const w=Math.max(+p.w||1,p.s==='double'?4:1);return `${w}px ${p.s||'solid'} ${p.c||'#000'}`}
/* neighbour of a cell across one physical side (using the visual grid) */
function neighbour(td,side){const t=td.closest('table'),g=gridMap(t),v=g.get(td);if(!v)return null;const rtl=isRTLt(t);let r,c;
  if(side==='top'){r=v.r1-1;c=v.c1}else if(side==='bottom'){r=v.r2+1;c=v.c1}
  else{const toLow=(side==='right')===rtl;r=v.r1;c=toLow?v.c1-1:v.c2+1}
  let o=null;g.forEach((w,x)=>{if(r>=w.r1&&r<=w.r2&&c>=w.c1&&c<=w.c2)o=x});return o}
function nearestSide(td,x,y){const r=td.getBoundingClientRect();const d={top:y-r.top,bottom:r.bottom-y,right:r.right-x,left:x-r.left};let s='top';for(const k in d)if(d[k]<d[s])s=k;return [s,d[s]]}
function paintEdge(td,side,bd){td.style['border'+SIDE_CAP[side]]=bd;const n=neighbour(td,side);if(n)n.style['border'+SIDE_CAP[OPP[side]]]=bd}
/* eraser: remove the line between two cells (merge) — or hide an outer line */
function eraseEdge(td,side){const t=td.closest('table'),g=gridMap(t),a=g.get(td),n=neighbour(td,side);
  if(!n){td.style['border'+SIDE_CAP[side]]='none';return 'hide'}
  const b=g.get(n);
  if(side==='top'||side==='bottom'){if(a.c1!==b.c1||a.c2!==b.c2){simToast('لا يمكن مسح هذا الخط: الخليتان بعرضين مختلفين');return null}
    const up=a.r1<b.r1?td:n,dn=up===td?n:td;if(dn.textContent.trim()){up.innerHTML+=(up.textContent.trim()?'<br>':'')+dn.innerHTML}up.rowSpan=(up.rowSpan||1)+(dn.rowSpan||1);const tr=dn.parentElement;dn.remove();
    if(!tr.cells.length){const ri=tr.rowIndex;gridMap(t).forEach((w,x)=>{if(w.r1<ri&&w.r2>=ri)x.rowSpan=Math.max(1,x.rowSpan-1)});tr.remove()}return 'merge'}
  if(a.r1!==b.r1||a.r2!==b.r2){simToast('لا يمكن مسح هذا الخط: الخليتان بارتفاعين مختلفين');return null}
  const first=a.c1<b.c1?td:n,second=first===td?n:td;if(second.textContent.trim()){first.innerHTML+=(first.textContent.trim()?' ':'')+second.innerHTML}first.colSpan=(first.colSpan||1)+(second.colSpan||1);second.remove();return 'merge'}
/* pen: a line drawn through a cell splits it */
function splitByLine(td,dir){const t=td.closest('table'),g=gridMap(t),v=g.get(td);
  if(dir==='v'){ if(td.colSpan>1){const k=Math.floor(td.colSpan/2);td.colSpan-=k;const n=newCell();n.colSpan=k;n.rowSpan=td.rowSpan;td.after(n);return}
    const n=newCell();n.rowSpan=td.rowSpan;td.after(n);g.forEach((w,x)=>{if(x!==td&&w.c1<=v.c1&&w.c2>=v.c1&&!(w.r1>=v.r1&&w.r2<=v.r2))x.colSpan+=1});
    /* other rows covered by td's rows are fine; rows outside get the wider cell */ return}
  /* horizontal */
  if(td.rowSpan>1){const k=Math.floor(td.rowSpan/2);td.rowSpan-=k;const rr=t.rows[v.r1+td.rowSpan];const n=newCell();n.colSpan=td.colSpan;n.rowSpan=k;
    const g2=gridMap(t);let before=null;[...rr.cells].forEach(x=>{const w=g2.get(x);if(!before&&w.c1>v.c1)before=x});rr.insertBefore(n,before);return}
  const tr=td.parentElement,nr=document.createElement('tr');tr.after(nr);const n=newCell();n.colSpan=td.colSpan;nr.appendChild(n);
  g.forEach((w,x)=>{if(x!==td&&w.r1<=v.r1&&w.r2>=v.r1)x.rowSpan=(x.rowSpan||1)+1})}

/* ---- tool modes ---- */
const TOOL_BTN={painter:'borderPainter',draw:'drawTable',eraser:'eraser'};
const TOOL_MSG={painter:'الريشة مفعّلة: انقر على أي خط في الجدول ليأخذ نمط القلم ولونه وسُمكه. Esc للإيقاف.',draw:'القلم مفعّل: اسحب خطًّا داخل خلية لتقسيمها، أو انقر على خط لتلوينه. Esc للإيقاف.',eraser:'الممحاة مفعّلة: انقر على الخط بين خليتين لدمجهما. Esc للإيقاف.'};
const TOOL_NAME={painter:'🖌️ الريشة مفعّلة',draw:'✏️ القلم مفعّل',eraser:'🧽 الممحاة مفعّلة'};
function setTool(t){S.tool=t;Object.entries(TOOL_BTN).forEach(([k,id])=>$$(`#ribbon [data-hid="${id}"]`).forEach(b=>b.classList.toggle('on',S.tool===k)));
  document.body.classList.remove('tool-painter','tool-draw','tool-eraser');let c=$('#toolchip');
  if(t){document.body.classList.add('tool-'+t);simToast(TOOL_MSG[t]);if(!c){c=document.createElement('div');c.id='toolchip';($('.simwrap')||document.body).appendChild(c)}
    c.innerHTML=`<span>${TOOL_NAME[t]}</span><small>${t==='draw'?'اسحب لترسم':'انقر على خط · اسحب للتحديد'}</small><button>إيقاف</button>`;c.querySelector('button').onclick=()=>setTool(null);c.style.display='flex'}
  else if(c)c.style.display='none'}
function toggleTool(t){setTool(S.tool===t?null:t);logAct('tool:'+(S.tool||'off'))}
Object.assign(OPS,{borderPainter(){toggleTool('painter')},drawTable(){toggleTool('draw')},eraser(){toggleTool('eraser')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.tool)setTool(null)},true);
let toolDrag=null;
document.addEventListener('mousedown',e=>{if(!S.tool||e.button!==0||!e.target.closest)return;const td=e.target.closest('#doc table.wt:not(.prev) td');if(!td)return;
  e.preventDefault();e.stopPropagation();S.curCell=td;
  if(S.tool==='draw'){toolDrag={td,x:e.clientX,y:e.clientY};showDrawLine(e.clientX,e.clientY,e.clientX,e.clientY);return}
  toolClick={td,x:e.clientX,y:e.clientY}},true);
let toolClick=null;
/* painter / eraser: a click acts; a drag means "I want to select" → the tool switches off and the drag selects */
document.addEventListener('mousemove',e=>{if(!toolClick)return;if(Math.hypot(e.clientX-toolClick.x,e.clientY-toolClick.y)>7){const td=toolClick.td;toolClick=null;setTool(null);clearCells();S.curCell=td;tdDrag=td;simToast('أُوقفت الأداة — اسحب لتحديد الخلايا')}},true);
document.addEventListener('mouseup',e=>{if(!toolClick)return;const {td,x,y}=toolClick;toolClick=null;const [side]=nearestSide(td,x,y);snap();
  if(S.tool==='painter'){paintEdge(td,side,penBd());logAct('paint:'+side)}
  else if(S.tool==='eraser'){const r=eraseEdge(td,side);if(r)logAct('erase:'+r)}
  SIM.emit&&SIM.emit('change')},true);
/* switch the tool off when leaving the table, changing ribbon tab, or opening another lesson */
document.addEventListener('mousedown',e=>{if(!S.tool||!e.target.closest)return;if(e.target.closest('#doc')&&!e.target.closest('#doc table.wt'))setTool(null)},true);
document.addEventListener('click',e=>{if(!S.tool||!e.target.closest)return;const tb=e.target.closest('#wtabs [data-tab]');if(tb&&!['tdesign','tlayout'].includes(tb.dataset.tab))setTool(null)},true);
const _aps=window.applySetup;if(_aps)window.applySetup=function(...a){setTool(null);const r=_aps.apply(this,a);try{doc.classList.toggle('vgrid',S.gridOn!==false);if(LW()<700&&!(a[0]&&a[0].print)){if(S.view!=='web'){S.view='web';applyPage()}if(S.zoom<150)setZoom(160)}}catch(e){}return r};
document.addEventListener('mousemove',e=>{if(!toolDrag)return;showDrawLine(toolDrag.x,toolDrag.y,e.clientX,e.clientY)},true);
document.addEventListener('mouseup',e=>{if(!toolDrag)return;const {td,x,y}=toolDrag;toolDrag=null;hideDrawLine();const dx=e.clientX-x,dy=e.clientY-y;snap();
  if(Math.max(Math.abs(dx),Math.abs(dy))<8){const [side]=nearestSide(td,x,y);paintEdge(td,side,penBd());logAct('paint:'+side)}
  else{splitByLine(td,Math.abs(dx)>Math.abs(dy)?'h':'v');logAct('draw:'+(Math.abs(dx)>Math.abs(dy)?'h':'v'))}
  SIM.emit&&SIM.emit('change')},true);
function showDrawLine(x1,y1,x2,y2){let l=$('#drawline');if(!l){l=document.createElement('div');l.id='drawline';document.body.appendChild(l)}const hz=Math.abs(x2-x1)>Math.abs(y2-y1);
  Object.assign(l.style,hz?{left:Math.min(x1,x2)+'px',top:y1+'px',width:Math.abs(x2-x1)+'px',height:'0',borderTop:'1.5px dashed #333',borderLeft:'0'}:{left:x1+'px',top:Math.min(y1,y2)+'px',height:Math.abs(y2-y1)+'px',width:'0',borderLeft:'1.5px dashed #333',borderTop:'0'});l.style.display='block'}
function hideDrawLine(){const l=$('#drawline');if(l)l.style.display='none'}

/* ---- «حدود وتظليل» dialog: بلا / مربع / الكل / شبكة / مخصّص ---- */
/* spec: {top,bottom,left,right,ih,iv} → true = draw with bd, false = remove, undefined = leave as is */
function applyBorderSet(cs,spec,bd,thick){const t=cs[0].closest('table'),g=gridMap(t),rtl=isRTLt(t);const bs=cs.map(c=>g.get(c));
  const R1=Math.min(...bs.map(b=>b.r1)),R2=Math.max(...bs.map(b=>b.r2)),C1=Math.min(...bs.map(b=>b.c1)),C2=Math.max(...bs.map(b=>b.c2));
  const lowSide=rtl?'right':'left',highSide=rtl?'left':'right';
  cs.forEach(c=>{const v=g.get(c);const outer={top:v.r1===R1,bottom:v.r2===R2,[lowSide]:v.c1===C1,[highSide]:v.c2===C2};
    ['top','bottom','left','right'].forEach(s=>{const want=outer[s]?spec[s]:((s==='top'||s==='bottom')?spec.ih:spec.iv);if(want===undefined)return;
      const val=want?(outer[s]&&thick?thick:bd):'none';c.style['border'+SIDE_CAP[s]]=val;const n=neighbour(c,s);if(n&&(!cs.includes(n)||true))n.style['border'+SIDE_CAP[OPP[s]]]=val})})}
const _tb=OPS.tborders;
OPS.tborders=function(a){if(a==='more')return bordersDlg();if(!needCell())return;const t=S.curCell.closest('table');const cs=S.selCells.length?[...S.selCells]:[...t.querySelectorAll('td')];snap();
  const SP={none:{top:false,bottom:false,left:false,right:false,ih:false,iv:false},all:{top:true,bottom:true,left:true,right:true,ih:true,iv:true},outside:{top:true,bottom:true,left:true,right:true},inside:{ih:true,iv:true},
   top:{top:true},bottom:{bottom:true},left:{left:true},right:{right:true}}[a||'all'];if(!SP)return _tb.call(this,a);applyBorderSet(cs,SP,penBd());logAct('tborders:'+a);SIM.emit&&SIM.emit('change')};
function bordersDlg(){if(!needCell())return;const t=S.curCell.closest('table');const cs=S.selCells.length?[...S.selCells]:[...t.querySelectorAll('td')];
  const p=S.pen||{};let sides={top:1,bottom:1,left:1,right:1,ih:1,iv:1},setting='all';const touched=new Set();
  const PRE={none:{top:0,bottom:0,left:0,right:0,ih:0,iv:0},box:{top:1,bottom:1,left:1,right:1,ih:0,iv:0},all:{top:1,bottom:1,left:1,right:1,ih:1,iv:1},grid:{top:1,bottom:1,left:1,right:1,ih:1,iv:1}};
  const cols=['#000000','#0070c0','#00b050','#c00000','#7030a0','#ffc000','#7f7f7f','#ffffff'];
  dialog({title:'حدود وتظليل',w:680,body:`<div class="bdlg">
   <div class="bd-set"><b>الإعداد</b>${[['none','بلا'],['box','مربع'],['all','الكل'],['grid','شبكة'],['custom','مخصّص']].map(([k,l])=>`<button class="bset ${k===setting?'on':''}" data-set="${k}"><i class="bi bi-${k}"></i>${l}</button>`).join('')}</div>
   <div class="bd-mid"><label>النمط<select id="bdS"><option value="solid">──── متصل</option><option value="dashed">- - - متقطع</option><option value="dotted">····· منقّط</option><option value="double">════ مزدوج</option></select></label>
    <label>اللون<span class="bd-cols">${cols.map(c=>`<button class="bdc" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('')}</span></label>
    <label>العرض<select id="bdW"><option value="1">½ نقطة</option><option value="2">1½ نقطة</option><option value="3">2¼ نقطة</option><option value="4">3 نقاط</option></select></label>
    <div class="bd-desc" id="bdDesc"></div><small class="bd-ap">يُطبَّق على: <b>${S.selCells.length?'الخلايا المحدّدة':'الجدول كله'}</b></small></div>
   <div class="bd-prev"><b>معاينة</b><small>انقر على الأزرار لإضافة خط أو إزالته</small><div class="bp-box"><div class="bp-in"><span class="ih"></span><span class="iv"></span></div>
    <button class="bp t" data-s="top" title="حد علوي">▔</button><button class="bp b" data-s="bottom" title="حد سفلي">▁</button><button class="bp r" data-s="right" title="حد أيمن">▕</button><button class="bp l" data-s="left" title="حد أيسر">▏</button><button class="bp h" data-s="ih" title="داخلي أفقي">═</button><button class="bp v" data-s="iv" title="داخلي عمودي">║</button></div></div>
  </div>`,buttons:[{label:'موافق',pri:1,act:d=>{const bd=`${d.querySelector('#bdW').value}px ${d.querySelector('#bdS').value} ${d.dataset.c||p.c||'#000000'}`;snap();
      const thick=setting==='grid'?`${Math.max(3,+d.querySelector('#bdW').value+1)}px ${d.querySelector('#bdS').value} ${d.dataset.c||p.c||'#000000'}`:null;const spec={};['top','bottom','left','right','ih','iv'].forEach(k=>{if(setting!=='custom'||touched.has(k))spec[k]=!!sides[k]});applyBorderSet(cs,spec,bd,thick);logAct('bordersDlg:'+setting);SIM.emit&&SIM.emit('change')}},{label:'إلغاء'}],
   onOpen:d=>{d.querySelector('#bdS').value=p.s||'solid';d.querySelector('#bdW').value=String(p.w||1);d.dataset.c=p.c||'#000000';
     const paint=()=>{const box=d.querySelector('.bp-box'),bd=`${Math.min(3,+d.querySelector('#bdW').value)}px ${d.querySelector('#bdS').value} ${d.dataset.c}`;const bi=d.querySelector('.bp-in');
       bi.style.borderTop=sides.top?bd:'1px dotted #ccc';bi.style.borderBottom=sides.bottom?bd:'1px dotted #ccc';bi.style.borderRight=sides.right?bd:'1px dotted #ccc';bi.style.borderLeft=sides.left?bd:'1px dotted #ccc';
       bi.querySelector('.ih').style.borderTop=sides.ih?bd:'1px dotted #ccc';bi.querySelector('.iv').style.borderLeft=sides.iv?bd:'1px dotted #ccc';
       box.querySelectorAll('.bp').forEach(b=>b.classList.toggle('on',!!sides[b.dataset.s]));d.querySelectorAll('.bset').forEach(b=>b.classList.toggle('on',b.dataset.set===setting));
       d.querySelectorAll('.bdc').forEach(b=>b.classList.toggle('on',b.dataset.c===d.dataset.c));d.querySelector('#bdDesc').innerHTML={none:'<b>بلا:</b> يزيل كل الخطوط.',box:'<b>مربع:</b> إطار خارجي فقط — ويُزيل الخطوط الداخلية! لتغيير الإطار وإبقاء الداخلية استخدم «مخصّص» أو «حدود خارجية».',all:'<b>الكل:</b> كل الخطوط الخارجية والداخلية بالشكل نفسه.',grid:'<b>شبكة:</b> إطار خارجي أسمك + خطوط داخلية.',custom:'<b>مخصّص:</b> انقر الخطوط في المعاينة: يتغيّر ما تنقره فقط، ويبقى الباقي كما هو.'}[setting]};
     d.querySelectorAll('.bset').forEach(b=>b.onclick=()=>{setting=b.dataset.set;touched.clear();if(PRE[setting])sides={...PRE[setting]};paint()});
     d.querySelectorAll('.bp').forEach(b=>b.onclick=()=>{sides[b.dataset.s]=sides[b.dataset.s]?0:1;touched.add(b.dataset.s);setting='custom';paint()});
     d.querySelectorAll('.bdc').forEach(b=>b.onclick=()=>{d.dataset.c=b.dataset.c;paint()});d.querySelector('#bdS').onchange=paint;d.querySelector('#bdW').onchange=paint;paint()}})}

/* ---- more table commands that work ---- */
(function(){
 const _sh=OPS.shading,_pc=OPS.penColor;
 OPS.shading=function(c){if(c==='more'){colorDlg(v=>OPS.shading(v));return}return _sh.call(this,c)};
 OPS.penColor=function(c){if(c==='more'){colorDlg(v=>OPS.penColor(v));return}return _pc.call(this,c)};
 const tbl=()=>S.curCell&&S.curCell.closest('table');
 const cmv=px=>(parseFloat(px)/CM||0).toFixed(2).replace(/\.?0+$/,'');
 OPS.viewGrid=function(){doc.classList.toggle('vgrid');S.gridOn=doc.classList.contains('vgrid');$$('#ribbon [data-hid="viewGrid"]').forEach(b=>b.classList.toggle('on',doc.classList.contains('vgrid')));simToast(doc.classList.contains('vgrid')?'خطوط الشبكة ظاهرة (لا تُطبع)':'أُخفيت خطوط الشبكة')};
 OPS.repeatHeader=function(){if(!needCell())return;const t=tbl();snap();t.classList.toggle('rpthdr');$$('#ribbon [data-hid="repeatHeader"]').forEach(b=>b.classList.toggle('on',t.classList.contains('rpthdr')));simToast(t.classList.contains('rpthdr')?'سيتكرر صف العناوين أعلى كل صفحة إذا امتد الجدول':'أُلغي تكرار صف العناوين');logAct('repeatHeader')};
 OPS.cellMargins=function(){if(!needCell())return;const t=tbl();const td=t.querySelector('td');const cs=getComputedStyle(td);
  dialog({title:'خيارات الجدول — هوامش الخلايا',body:`<p class="sm">المسافة بين الكتابة وحدود الخلية (سم):</p>${[['mt','أعلى',cs.paddingTop],['mb','أسفل',cs.paddingBottom],['mr','يمين',cs.paddingRight],['ml','يسار',cs.paddingLeft]].map(([id,l,v])=>`<label class="row" style="justify-content:space-between">${l}: <input type="number" step="0.1" min="0" max="3" id="${id}" value="${cmv(v)}" style="width:70px"></label>`).join('')}`,
   buttons:[{label:'موافق',pri:1,act:d=>{snap();const g=id=>(+d.querySelector('#'+id).value||0)*CM+'px';t.querySelectorAll('td').forEach(x=>{x.style.paddingTop=g('mt');x.style.paddingBottom=g('mb');x.style.paddingRight=g('mr');x.style.paddingLeft=g('ml')});logAct('cellMargins')}},{label:'إلغاء'}]})};
 OPS.tprops=function(){if(!needCell())return;const t=tbl(),c=S.curCell,tr=c.parentElement;const al=t.style.marginRight==='auto'&&t.style.marginLeft==='auto'?'center':(t.style.marginRight==='auto'?'left':'right');
  const w=t.style.width&&t.style.width.endsWith('%')?parseFloat(t.style.width):'';
  dialog({title:'خصائص الجدول',w:460,body:`<div class="tpr">
   <fieldset><legend>الجدول</legend><label class="row">العرض المفضّل: <input type="number" id="tpW" min="20" max="100" value="${w}" placeholder="تلقائي" style="width:70px"> %</label>
    <div class="row">المحاذاة: ${[['right','يمين'],['center','وسط'],['left','يسار']].map(([k,l])=>`<label><input type="radio" name="tpA" value="${k}" ${al===k?'checked':''}> ${l}</label>`).join(' ')}</div></fieldset>
   <fieldset><legend>الصف</legend><label class="row">الارتفاع: <input type="number" step="0.1" id="tpH" value="${tr.cells[0]?.style.height?cmv(tr.cells[0].style.height):''}" placeholder="تلقائي" style="width:70px"> سم</label></fieldset>
   <fieldset><legend>العمود</legend><label class="row">العرض: <input type="number" step="0.1" id="tpC" value="${c.style.width?cmv(c.style.width):''}" placeholder="تلقائي" style="width:70px"> سم</label></fieldset>
   <fieldset><legend>الخلية</legend><div class="row">المحاذاة العمودية: ${[['top','أعلى'],['middle','وسط'],['bottom','أسفل']].map(([k,l])=>`<label><input type="radio" name="tpV" value="${k}" ${(c.style.verticalAlign||'top')===k?'checked':''}> ${l}</label>`).join(' ')}</div></fieldset></div>`,
   buttons:[{label:'موافق',pri:1,act:d=>{snap();const W=d.querySelector('#tpW').value;t.style.width=W?W+'%':'';const A=d.querySelector('[name=tpA]:checked').value;
     t.style.marginLeft=A==='right'?'auto':(A==='center'?'auto':'0');t.style.marginRight=A==='left'?'auto':(A==='center'?'auto':'0');if(A==='right'){t.style.marginLeft='auto';t.style.marginRight='0'}
     const H=d.querySelector('#tpH').value;if(H)[...tr.cells].forEach(x=>x.style.height=(+H*CM)+'px');const C=d.querySelector('#tpC').value;if(C){OPS.colW(C)}
     const V=d.querySelector('[name=tpV]:checked').value;targetCells().forEach(x=>x.style.verticalAlign=V);logAct('tprops');SIM.emit&&SIM.emit('change')}},{label:'إلغاء'}]})};
 /* formula: =SUM(ABOVE) / AVERAGE / MAX / MIN / COUNT with ABOVE, BELOW, RIGHT, LEFT */
 function nums(t,cell,dir){const g=gridMap(t),v=g.get(cell),rtl=isRTLt(t),out=[];g.forEach((w,x)=>{if(x===cell)return;let ok=false;
   if(dir==='ABOVE')ok=w.r2<v.r1&&w.c1<=v.c1&&w.c2>=v.c1;else if(dir==='BELOW')ok=w.r1>v.r2&&w.c1<=v.c1&&w.c2>=v.c1;
   else{const low=(dir==='RIGHT')===rtl;ok=w.r1<=v.r1&&w.r2>=v.r1&&(low?w.c2<v.c1:w.c1>v.c2)}
   if(ok){const n=parseFloat(normT(x.textContent).replace(/[^\d.\-]/g,''));if(!isNaN(n))out.push(n)}});return out}
 OPS.formula=function(){if(!needCell())return;const t=tbl(),c=S.curCell;const def=nums(t,c,'ABOVE').length?'=SUM(ABOVE)':(nums(t,c,isRTLt(t)?'RIGHT':'LEFT').length?(isRTLt(t)?'=SUM(RIGHT)':'=SUM(LEFT)'):'=SUM(ABOVE)');
  dialog({title:'صيغة',w:420,body:`<label class="row" style="flex-direction:column;align-items:stretch">الصيغة:<input id="fx" value="${def}" dir="ltr" style="padding:4px"></label>
   <label class="row">لصق دالة: <select id="fxf"><option value="">—</option>${['SUM','AVERAGE','MAX','MIN','COUNT'].map(f=>`<option>${f}</option>`).join('')}</select>
   <select id="fxd">${['ABOVE','BELOW','RIGHT','LEFT'].map(f=>`<option>${f}</option>`).join('')}</select></label>
   <p class="sm">SUM مجموع · AVERAGE معدّل · MAX أكبر · MIN أصغر · COUNT عدد — ABOVE فوق · BELOW تحت · RIGHT يمين · LEFT يسار</p>`,
   buttons:[{label:'موافق',pri:1,act:d=>{const f=d.querySelector('#fx').value.trim().toUpperCase().match(/^=?\s*(SUM|AVERAGE|MAX|MIN|COUNT)\s*\(\s*(ABOVE|BELOW|RIGHT|LEFT)\s*\)$/);
     if(!f){simToast('اكتب صيغة مثل =SUM(ABOVE)');return false}const a=nums(t,c,f[2]);if(!a.length&&f[1]!=='COUNT'){simToast('لا توجد أرقام في هذا الاتجاه');return false}
     const r={SUM:a.reduce((x,y)=>x+y,0),AVERAGE:a.reduce((x,y)=>x+y,0)/(a.length||1),MAX:Math.max(...a),MIN:Math.min(...a),COUNT:a.length}[f[1]];snap();
     c.textContent=String(Math.round(r*100)/100);c.dataset.fx=f[0];logAct('formula:'+f[1]);SIM.emit&&SIM.emit('change')}},{label:'إلغاء'}],
   onOpen:d=>{const up=()=>{const fn=d.querySelector('#fxf').value;if(fn)d.querySelector('#fx').value=`=${fn}(${d.querySelector('#fxd').value})`};d.querySelector('#fxf').onchange=up;d.querySelector('#fxd').onchange=up}})};
 /* shading inside «حدود وتظليل» */
 const _bd=bordersDlg;
 window.bordersDlg=function(){_bd();const d=$('#dlgs .dlg');if(!d)return;const body=d.querySelector('.bdlg');if(!body)return;
  const cs=S.selCells.length?[...S.selCells]:[...S.curCell.closest('table').querySelectorAll('td')];
  const sh=document.createElement('div');sh.className='bd-shade';sh.innerHTML=`<b>التظليل</b><span class="bd-cols">${['','#d9e2f3','#deebf6','#e2efda','#fff2cc','#fbe5d6','#ffc000','#70ad47','#4472c4','#7030a0','#c00000'].map(c=>`<button class="bds" data-c="${c}" title="${c||'بلا لون'}" style="background:${c||'#fff'}">${c?'':'∅'}</button>`).join('')}</span><label><input type="checkbox" id="bdPat"> نقش مائل</label>`;
  body.after(sh);let pick=null;sh.querySelectorAll('.bds').forEach(b=>b.onclick=()=>{pick=b.dataset.c;sh.querySelectorAll('.bds').forEach(x=>x.classList.toggle('on',x===b))});
  const ok=d.querySelector('.df .pri');const prev=ok.onclick;ok.onclick=()=>{const pat=sh.querySelector('#bdPat').checked;if(pick!==null||pat){snap();cs.forEach(x=>{if(pick!==null)x.style.backgroundColor=pick;if(pat)x.style.backgroundImage='repeating-linear-gradient(45deg,#000 0 2px,#fff 2px 7px)'})}prev&&prev()}};
 OPS.tborders=function(a){if(a==='more')return window.bordersDlg();return _tb.call(this,a)};
})();

/* «حذف خلايا...» like Word: a small dialog; empty rows/tables never stay behind */
(function(){const _td=OPS.tdel;
 const cleanup=t=>{[...t.rows].forEach(r=>{if(!r.cells.length)r.remove()});if(!t.rows.length||!t.querySelector('td'))t.remove()};
 OPS.tdel=function(a){if(a!=='cells')return _td.call(this,a);if(!needCell())return;const t=S.curCell.closest('table');const cs=targetCells();
  dialog({title:'حذف الخلايا',w:340,body:`${[['shift','إزاحة الخلايا (حذف الخلايا فقط)'],['row','حذف صف بالكامل'],['col','حذف عمود بالكامل']].map(([k,l],i)=>`<label class="row"><input type="radio" name="dcx" value="${k}" ${i===0?'checked':''}> ${l}</label>`).join('')}<p class="sm">لحذف الجدول كله استخدم «حذف ← حذف جدول».</p>`,
   buttons:[{label:'موافق',pri:1,act:d=>{const v=d.querySelector('[name=dcx]:checked').value;if(v!=='shift'){setCells(cs);return _td.call(OPS,v)}snap();cs.forEach(c=>c.remove());cleanup(t);S.curCell=null;clearCells();updateCtx();logAct('tdel:cells');SIM.emit&&SIM.emit('change')}},{label:'إلغاء'}]})};
})();

/* gridlines: mark sides without a visible border */
(function boot(){if(typeof doc==='undefined'||!doc||!doc.querySelector){setTimeout(boot,200);return}let tm=null;
 function upd(){tm=null;doc.querySelectorAll('table.wt td').forEach(td=>{const cs=getComputedStyle(td);[['Top','gl-t'],['Bottom','gl-b'],['Left','gl-l'],['Right','gl-r']].forEach(([S2,k])=>{const st=cs['border'+S2+'Style'],w=parseFloat(cs['border'+S2+'Width'])||0,c=cs['border'+S2+'Color'];
   const none=st==='none'||st==='hidden'||w===0||/rgba\(0, 0, 0, 0\)|transparent/.test(c);if(td.classList.contains(k)!==none)td.classList.toggle(k,none)})})}
 const sched=()=>{if(!tm)tm=setTimeout(upd,60)};
 new MutationObserver(m=>{if(m.some(x=>!(x.type==='attributes'&&x.attributeName==='class')))sched()}).observe(doc,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});
 doc.classList.add('vgrid');setTimeout(()=>{$$('#ribbon [data-hid="viewGrid"]').forEach(b=>b.classList.add('on'));upd()},300);
 })();

/* ===== «حدود وتظليل» — مثل Word: تبويب الحدود + تبويب التظليل (تعبئة + نقش) + «تطبيق على» ===== */
const PATS=[['clear','واضح'],['solid','خالص (100%)'],['p10','10%'],['p25','25%'],['p50','50%'],['p75','75%'],
 ['dkH','أفقي داكن'],['dkV','عمودي داكن'],['dkD','قطري لأسفل داكن'],['dkU','قطري لأعلى داكن'],['dkG','شبكة داكنة'],['dkT','تعريشة داكنة'],
 ['ltH','أفقي فاتح'],['ltV','عمودي فاتح'],['ltD','قطري لأسفل فاتح'],['ltU','قطري لأعلى فاتح']];
function hexA(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}
function patCSS(k,c){const st=(deg,w,gap)=>`repeating-linear-gradient(${deg}deg,${c} 0 ${w}px,transparent ${w}px ${gap}px)`;
 return ({clear:'',solid:`linear-gradient(${c},${c})`,p10:`linear-gradient(${hexA(c,.1)},${hexA(c,.1)})`,p25:`linear-gradient(${hexA(c,.25)},${hexA(c,.25)})`,p50:`linear-gradient(${hexA(c,.5)},${hexA(c,.5)})`,p75:`linear-gradient(${hexA(c,.75)},${hexA(c,.75)})`,
  dkH:st(0,2,6),dkV:st(90,2,6),dkD:st(45,2,7),dkU:st(135,2,7),dkG:st(0,2,7)+','+st(90,2,7),dkT:st(45,2,7)+','+st(135,2,7),ltH:st(0,1,6),ltV:st(90,1,6),ltD:st(45,1,6),ltU:st(135,1,6)})[k]||''}
const LINE_STYLES=[['solid','──────────'],['dotted','··············'],['dashed','- - - - - - - -'],['double','══════════'],['groove','≡≡ محفور'],['ridge','≡≡ بارز']];
const FILLS=['','#ffffff','#f2f2f2','#d9d9d9','#bfbfbf','#deebf6','#d9e2f3','#bdd7ee','#e2efda','#c6e0b4','#fff2cc','#ffe699','#fbe5d6','#f8cbad','#ffff00','#ffc000','#92d050','#00b050','#00b0f0','#0070c0','#4472c4','#7030a0','#c00000','#ff0000','#000000'];
window.bordersDlg=function(tab){if(!needCell())return;const t=S.curCell.closest('table');const sel=S.selCells.length?[...S.selCells]:[S.curCell];const p=S.pen||{};
 let setting=null,sides={top:1,bottom:1,left:1,right:1,ih:1,iv:1};const touched=new Set();let bChanged=false,sChanged=false;
 const st={style:p.s||'solid',color:p.c||'#000000',w:String(p.w||1),fill:null,pat:'clear',pcol:'#000000',apply:'cell'};
 const PRE={none:{top:0,bottom:0,left:0,right:0,ih:0,iv:0},box:{top:1,bottom:1,left:1,right:1,ih:0,iv:0},all:{top:1,bottom:1,left:1,right:1,ih:1,iv:1},grid:{top:1,bottom:1,left:1,right:1,ih:1,iv:1}};
 const DESC={none:'<b>بلا:</b> يزيل كل الخطوط.',box:'<b>مربع:</b> إطار خارجي فقط — ويُزيل الخطوط الداخلية!',all:'<b>الكل:</b> كل الخطوط الخارجية والداخلية بالشكل نفسه.',grid:'<b>شبكة:</b> إطار خارجي أسمك + خطوط داخلية.',custom:'<b>مخصّص:</b> اختر النمط واللون والعرض، ثم انقر الخطوط في المعاينة: يتغيّر ما تنقره فقط.'};
 const sw=(cls,arr,cur)=>arr.map(c=>`<button class="${cls}" data-c="${c}" title="${c||'بلا لون'}" style="background:${c||'#fff'}">${c?'':'✕'}</button>`).join('');
 const applySel=`<label class="bd-apl">تطبيق على: <select class="bdApply"><option value="cell">${sel.length>1?'الخلايا المحدّدة':'الخلية'}</option><option value="table">الجدول</option></select></label>`;
 const d=dialog({title:'حدود وتظليل',w:700,body:`<div class="bdtabs"><button data-t="borders" class="on">الحدود</button><button data-t="page">حدود الصفحة</button><button data-t="shade">التظليل</button></div>
  <div class="bdpane" data-p="borders"><div class="bdlg">
   <div class="bd-set"><b>الإعداد:</b>${[['none','بلا'],['box','مربع'],['all','الكل'],['grid','شبكة'],['custom','مخصّص']].map(([k,l])=>`<button class="bset" data-set="${k}"><i class="bi bi-${k}"></i>${l}</button>`).join('')}</div>
   <div class="bd-mid"><b>النمط:</b><div class="bd-lines">${LINE_STYLES.map(([k,l])=>`<button class="bln" data-s="${k}"><span style="border-top:${k==='double'?4:2}px ${k} #000"></span></button>`).join('')}</div>
    <label>اللون:<span class="bd-cols">${sw('bdc',['#000000','#7f7f7f','#0070c0','#00b0f0','#00b050','#92d050','#ffc000','#c00000','#7030a0','#ffffff'])}</span></label>
    <label>العرض:<select class="bdW"><option value="1">½ نقطة</option><option value="2">1½ نقطة</option><option value="3">2¼ نقطة</option><option value="4">3 نقاط</option><option value="6">4½ نقاط</option></select></label></div>
   <div class="bd-prev"><b>معاينة</b><small>انقر على الرسم أدناه أو استخدم الأزرار لتطبيق الحدود</small><div class="bp-box"><div class="bp-in"><span class="ih"></span><span class="iv"></span></div>
    <button class="bp t" data-s="top" title="حد علوي">▔</button><button class="bp b" data-s="bottom" title="حد سفلي">▁</button><button class="bp r" data-s="right" title="حد أيمن">▕</button><button class="bp l" data-s="left" title="حد أيسر">▏</button><button class="bp h" data-s="ih" title="داخلي أفقي">═</button><button class="bp v" data-s="iv" title="داخلي عمودي">║</button></div>${applySel}</div>
  </div><div class="bd-desc" id="bdDesc">اختر إعدادًا، أو غيّر النمط/اللون/العرض ثم انقر الخطوط في المعاينة.</div></div>
  <div class="bdpane" data-p="page" hidden><p class="sm" style="padding:30px 10px;text-align:center">«حدود الصفحة» إطار حول الصفحة كلها — من «تصميم ← حدود الصفحة». (ليس للجدول)</p></div>
  <div class="bdpane" data-p="shade" hidden><div class="shg">
   <div><b>تعبئة:</b><div class="bd-fills">${sw('bdf',FILLS)}</div><small class="sm">✕ = بلا لون</small></div>
   <div><b>النقش:</b><label>النمط:<select class="bdP">${PATS.map(([k,l])=>`<option value="${k}">${l}</option>`).join('')}</select></label>
    <label>اللون:<span class="bd-cols">${sw('bdpc',['#000000','#7f7f7f','#0070c0','#00b050','#c00000','#7030a0','#ffc000','#ffffff'])}</span></label></div>
   <div class="bd-prev"><b>معاينة</b><div class="shprev"><span>أب ج</span></div>${applySel}</div></div>
   <p class="sm">التعبئة = لون الخلفية. النقش = خطوط أو نقاط فوق التعبئة (مثل «قطري لأسفل»).</p></div>`,
  buttons:[{label:'موافق',pri:1,act:dd=>{const cs=st.apply==='table'?[...t.querySelectorAll('td')]:sel;snap();
     if(bChanged){const bd=`${st.w}px ${st.style} ${st.color}`;const spec={};['top','bottom','left','right','ih','iv'].forEach(k=>{if(setting&&setting!=='custom'||touched.has(k))spec[k]=!!sides[k]});
       const thick=setting==='grid'?`${Math.max(3,+st.w+1)}px ${st.style} ${st.color}`:null;applyBorderSet(cs,spec,bd,thick);S.pen={s:st.style,c:st.color,w:st.w}}
     if(sChanged){cs.forEach(x=>{if(st.fill!==null)x.style.backgroundColor=st.fill;x.style.backgroundImage=patCSS(st.pat,st.pcol)})}
     logAct('bordersDlg');SIM.emit&&SIM.emit('change')}},{label:'إلغاء'}],
  onOpen:dd=>{const q=s=>dd.querySelector(s),qa=s=>[...dd.querySelectorAll(s)];
   const paint=()=>{const bd=`${Math.min(4,+st.w)}px ${st.style} ${st.color}`,off='1px dotted #ccc';const bi=q('.bp-in');
     bi.style.borderTop=sides.top?bd:off;bi.style.borderBottom=sides.bottom?bd:off;bi.style.borderRight=sides.right?bd:off;bi.style.borderLeft=sides.left?bd:off;
     bi.querySelector('.ih').style.borderTop=sides.ih?bd:off;bi.querySelector('.iv').style.borderLeft=sides.iv?bd:off;
     qa('.bp').forEach(b=>b.classList.toggle('on',!!sides[b.dataset.s]));qa('.bset').forEach(b=>b.classList.toggle('on',b.dataset.set===setting));
     qa('.bln').forEach(b=>b.classList.toggle('on',b.dataset.s===st.style));qa('.bdc').forEach(b=>b.classList.toggle('on',b.dataset.c===st.color));
     if(setting)q('#bdDesc').innerHTML=DESC[setting];
     qa('.bdf').forEach(b=>b.classList.toggle('on',st.fill!==null&&b.dataset.c===st.fill));qa('.bdpc').forEach(b=>b.classList.toggle('on',b.dataset.c===st.pcol));
     const sp=q('.shprev');sp.style.backgroundColor=st.fill||'#fff';sp.style.backgroundImage=patCSS(st.pat,st.pcol);qa('.bdApply').forEach(x=>x.value=st.apply)};
   qa('.bdtabs button').forEach(b=>b.onclick=()=>{qa('.bdtabs button').forEach(x=>x.classList.toggle('on',x===b));qa('.bdpane').forEach(x=>x.hidden=x.dataset.p!==b.dataset.t)});
   qa('.bset').forEach(b=>b.onclick=()=>{setting=b.dataset.set;touched.clear();if(PRE[setting])sides={...PRE[setting]};bChanged=true;paint()});
   const sig=()=>st.style+st.color+st.w,sideSig={};const flip=k=>{if(sides[k]&&touched.has(k)&&sideSig[k]===sig()){sides[k]=0}else if(sides[k]&&!touched.has(k)&&sideSig[k]===undefined&&sig()===initSig){sides[k]=0}else{sides[k]=1;sideSig[k]=sig()}touched.add(k);setting='custom';bChanged=true;paint()};const initSig=sig();
   qa('.bp').forEach(b=>b.onclick=()=>flip(b.dataset.s));
   q('.bp-in').onclick=e=>{const r=q('.bp-in').getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const dd2={top:y,bottom:r.height-y,left:x,right:r.width-x,ih:Math.abs(y-r.height/2),iv:Math.abs(x-r.width/2)};let k='top';for(const z in dd2)if(dd2[z]<dd2[k])k=z;flip(k)};
   qa('.bln').forEach(b=>b.onclick=()=>{st.style=b.dataset.s;bChanged=true;if(!setting)setting='custom';paint()});
   qa('.bdc').forEach(b=>b.onclick=()=>{st.color=b.dataset.c;bChanged=true;if(!setting)setting='custom';paint()});
   q('.bdW').value=st.w;q('.bdW').onchange=e=>{st.w=e.target.value;bChanged=true;if(!setting)setting='custom';paint()};
   qa('.bdf').forEach(b=>b.onclick=()=>{st.fill=b.dataset.c;sChanged=true;paint()});
   q('.bdP').onchange=e=>{st.pat=e.target.value;sChanged=true;paint()};qa('.bdpc').forEach(b=>b.onclick=()=>{st.pcol=b.dataset.c;sChanged=true;paint()});
   qa('.bdApply').forEach(x=>x.onchange=()=>{st.apply=x.value;paint()});
   if(tab==='shade')qa('.bdtabs button')[2].click();paint()}})};
OPS.tborders=(function(prev){return function(a){if(a==='more')return window.bordersDlg();return prev.call(this,a)}})(OPS.tborders);

/* ===== قائمة «حدود» مثل Word: كل أمر يعمل كمفتاح — إذا كان الحد موجودًا بنفس القلم يُزال، وإلا يُطبَّق ===== */
(function(){
const KS={all:['top','bottom','left','right','ih','iv'],outside:['top','bottom','left','right'],inside:['ih','iv'],ih:['ih'],iv:['iv'],top:['top'],bottom:['bottom'],left:['left'],right:['right']};
const tbCells=()=>{const t=S.curCell.closest('table');return S.selCells.length?[...S.selCells]:[...t.querySelectorAll('td')]};
const inf=(td,s)=>{const c=getComputedStyle(td),S2=SIDE_CAP[s];return {s:c['border'+S2+'Style'],w:parseFloat(c['border'+S2+'Width'])||0,c:c['border'+S2+'Color']}};
const vis=i=>i.s!=='none'&&i.s!=='hidden'&&i.w>0&&!/rgba\(0, 0, 0, 0\)|transparent/.test(i.c);
const rgb=h=>{const d=document.createElement('i');d.style.color=h;document.body.appendChild(d);const v=getComputedStyle(d).color;d.remove();return v};
function pen(){const p=S.pen||{};return {s:p.s||'solid',w:Math.max(+p.w||1,p.s==='double'?4:1),c:rgb(p.c||'#000')}}
const same=(i,p)=>i.s===p.s&&Math.abs(i.w-p.w)<.6&&i.c===p.c;
function edges(cs){const t=cs[0].closest('table'),g=gridMap(t),rtl=isRTLt(t);const bs=cs.map(c=>g.get(c)).filter(Boolean);if(!bs.length)return [];
  const R1=Math.min(...bs.map(b=>b.r1)),R2=Math.max(...bs.map(b=>b.r2)),C1=Math.min(...bs.map(b=>b.c1)),C2=Math.max(...bs.map(b=>b.c2));const lo=rtl?'right':'left',hi=rtl?'left':'right';const out=[];
  cs.forEach(c=>{const v=g.get(c);if(!v)return;const outer={top:v.r1===R1,bottom:v.r2===R2,[lo]:v.c1===C1,[hi]:v.c2===C2};
    ['top','bottom','left','right'].forEach(s=>{const k=outer[s]?s:(s==='top'||s==='bottom')?'ih':'iv';out.push({k,td:c,s})})});return out}
function edgeOn(e,p){const a=inf(e.td,e.s);if(vis(a))return p?same(a,p):true;const n=neighbour(e.td,e.s);if(n){const b=inf(n,OPP[e.s]);if(vis(b))return p?same(b,p):true}return false}
const DG={diagDown:'d',diagUp:'u'};
function hasDiag(td,k){return (td.dataset.dg||'').includes(k)}
function drawDiag(td){td.querySelector(':scope > svg.tdiag')?.remove();const dg=td.dataset.dg||'';if(!dg){if(td.style.position==='relative')td.style.position='';return}
  const c=td.dataset.dgc||'#000',w=td.dataset.dgw||1;td.style.position='relative';
  const ns='http://www.w3.org/2000/svg',sv=document.createElementNS(ns,'svg');sv.setAttribute('class','tdiag');sv.setAttribute('viewBox','0 0 100 100');sv.setAttribute('preserveAspectRatio','none');sv.setAttribute('contenteditable','false');
  sv.setAttribute('style','position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible');
  sv.innerHTML=(dg.includes('d')?`<line x1="0" y1="0" x2="100" y2="100" stroke="${c}" stroke-width="${w}" vector-effect="non-scaling-stroke"/>`:'')+(dg.includes('u')?`<line x1="0" y1="100" x2="100" y2="0" stroke="${c}" stroke-width="${w}" vector-effect="non-scaling-stroke"/>`:'');td.appendChild(sv)}
window.drawDiag=drawDiag;
window.TB_STATE=a=>{try{if(!S.curCell||!S.curCell.closest('table'))return false;const cs=tbCells();if(DG[a])return cs.every(td=>hasDiag(td,DG[a]));
  if(a==='none'){return edges(cs).every(e=>!edgeOn(e))&&cs.every(td=>!td.dataset.dg)}const ks=KS[a];if(!ks)return false;const es=edges(cs).filter(e=>ks.includes(e.k));return es.length>0&&es.every(e=>edgeOn(e))}catch(e){return false}};
const prev=OPS.tborders;
OPS.tborders=function(a){if(a==='more')return window.bordersDlg();if(a==='drawTable'||a==='viewGrid')return run(a);if(!needCell())return;const cs=tbCells();
  if(DG[a]){snap();const k=DG[a],on=!cs.every(td=>hasDiag(td,k)),p=S.pen||{};cs.forEach(td=>{let d=(td.dataset.dg||'').replace(k,'');if(on){d+=k;td.dataset.dgc=p.c||'#000';td.dataset.dgw=Math.max(+p.w||1,1)}if(d)td.dataset.dg=d;else{delete td.dataset.dg;delete td.dataset.dgc;delete td.dataset.dgw}drawDiag(td)});logAct('tborders:'+a+(on?'':':off'));SIM.emit&&SIM.emit('change');return}
  const ks=KS[a||'all'];
  if(ks){const P=pen();const es=edges(cs).filter(e=>ks.includes(e.k));const off=es.length&&es.every(e=>edgeOn(e,P));
    if(off&&!S._noTog){snap();const sp={};ks.forEach(k=>sp[k]=false);applyBorderSet(cs,sp,penBd());logAct('tborders:'+a+':off');SIM.emit&&SIM.emit('change');try{simToast('أُزيل الحد — اضغطه مرة أخرى لإرجاعه')}catch(e){}return}
    snap();const sp={};ks.forEach(k=>sp[k]=true);applyBorderSet(cs,sp,penBd());logAct('tborders:'+(a||'all'));SIM.emit&&SIM.emit('change');return}
  if(a==='none'){const r=prev.call(this,a);cs.forEach(td=>{if(td.dataset.dg){delete td.dataset.dg;delete td.dataset.dgc;delete td.dataset.dgw;drawDiag(td)}});return r}
  return prev.call(this,a)};
/* إظهار الأمر المفعّل في القائمة (مثل Word) */
const _om=openMenu;openMenu=function(w){_om(w);try{const dd=w.querySelector('[data-dd]');const cmd=dd&&dd.dataset.cmd;const F=cmd==='tborders'?window.TB_STATE:cmd==='pborders'?window.PB_STATE:null;
  w.querySelectorAll('.dd .mi.act').forEach(m=>m.classList.remove('act'));if(F)w.querySelectorAll('.dd .mi[data-arg]').forEach(m=>{if(!['more','hr','drawTable'].includes(m.dataset.arg)&&F(m.dataset.arg))m.classList.add('act')});
  if(cmd==='tborders'||cmd==='pborders'){const g=w.querySelector('.dd .mi[data-arg="viewGrid"]');if(g)g.classList.toggle('act',doc.classList.contains('vgrid'))}}catch(e){}};
})();

OPS.borderPainter=function(){S._noTog=1;try{OPS.tborders('all')}finally{S._noTog=0}};
