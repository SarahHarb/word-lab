/* ================= Table tools that work like real Word =================
   نسخ تنسيق الحدود (الريشة) · رسم جدول (القلم) · الممحاة · نافذة «حدود وتظليل» (مربع/الكل/شبكة/مخصّص) */
const SIDE_CAP={top:'Top',bottom:'Bottom',left:'Left',right:'Right'};
const OPP={top:'bottom',bottom:'top',left:'right',right:'left'};
const isRTLt=t=>getComputedStyle(t).direction!=='ltr';
function penBd(){const p=S.pen||{};const w=+p.w||(p.s==='double'?3:1);return `${w}px ${p.s||'solid'} ${p.c||'#000'}`}
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
function setTool(t){S.tool=t;Object.entries(TOOL_BTN).forEach(([k,id])=>$$(`#ribbon [data-hid="${id}"]`).forEach(b=>b.classList.toggle('on',S.tool===k)));
  document.body.classList.remove('tool-painter','tool-draw','tool-eraser');if(t){document.body.classList.add('tool-'+t);simToast(TOOL_MSG[t])}}
function toggleTool(t){setTool(S.tool===t?null:t);logAct('tool:'+(S.tool||'off'))}
Object.assign(OPS,{borderPainter(){toggleTool('painter')},drawTable(){toggleTool('draw')},eraser(){toggleTool('eraser')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.tool)setTool(null)},true);
let toolDrag=null;
document.addEventListener('mousedown',e=>{if(!S.tool||e.button!==0||!e.target.closest)return;const td=e.target.closest('#doc table.wt:not(.prev) td');if(!td)return;
  e.preventDefault();e.stopPropagation();S.curCell=td;
  if(S.tool==='draw'){toolDrag={td,x:e.clientX,y:e.clientY};showDrawLine(e.clientX,e.clientY,e.clientX,e.clientY);return}
  const [side]=nearestSide(td,e.clientX,e.clientY);snap();
  if(S.tool==='painter'){paintEdge(td,side,penBd());logAct('paint:'+side)}
  else if(S.tool==='eraser'){const r=eraseEdge(td,side);if(r)logAct('erase:'+r)}
  SIM.emit&&SIM.emit('change')},true);
document.addEventListener('mousemove',e=>{if(!toolDrag)return;showDrawLine(toolDrag.x,toolDrag.y,e.clientX,e.clientY)},true);
document.addEventListener('mouseup',e=>{if(!toolDrag)return;const {td,x,y}=toolDrag;toolDrag=null;hideDrawLine();const dx=e.clientX-x,dy=e.clientY-y;snap();
  if(Math.max(Math.abs(dx),Math.abs(dy))<8){const [side]=nearestSide(td,x,y);paintEdge(td,side,penBd());logAct('paint:'+side)}
  else{splitByLine(td,Math.abs(dx)>Math.abs(dy)?'h':'v');logAct('draw:'+(Math.abs(dx)>Math.abs(dy)?'h':'v'))}
  SIM.emit&&SIM.emit('change')},true);
function showDrawLine(x1,y1,x2,y2){let l=$('#drawline');if(!l){l=document.createElement('div');l.id='drawline';document.body.appendChild(l)}const hz=Math.abs(x2-x1)>Math.abs(y2-y1);
  Object.assign(l.style,hz?{left:Math.min(x1,x2)+'px',top:y1+'px',width:Math.abs(x2-x1)+'px',height:'0',borderTop:'1.5px dashed #333',borderLeft:'0'}:{left:x1+'px',top:Math.min(y1,y2)+'px',height:Math.abs(y2-y1)+'px',width:'0',borderLeft:'1.5px dashed #333',borderTop:'0'});l.style.display='block'}
function hideDrawLine(){const l=$('#drawline');if(l)l.style.display='none'}

/* ---- «حدود وتظليل» dialog: بلا / مربع / الكل / شبكة / مخصّص ---- */
function applyBorderSet(cs,sides,bd,thick){const t=cs[0].closest('table'),g=gridMap(t),rtl=isRTLt(t);const bs=cs.map(c=>g.get(c));
  const R1=Math.min(...bs.map(b=>b.r1)),R2=Math.max(...bs.map(b=>b.r2)),C1=Math.min(...bs.map(b=>b.c1)),C2=Math.max(...bs.map(b=>b.c2));
  const lowSide=rtl?'right':'left',highSide=rtl?'left':'right';
  cs.forEach(c=>{const v=g.get(c);const outer={top:v.r1===R1,bottom:v.r2===R2,[lowSide]:v.c1===C1,[highSide]:v.c2===C2};
    ['top','bottom','left','right'].forEach(s=>{const on=outer[s]?sides[s]:((s==='top'||s==='bottom')?sides.ih:sides.iv);const val=on?(outer[s]&&thick?thick:bd):'none';c.style['border'+SIDE_CAP[s]]=val;
      if(outer[s]){const n=neighbour(c,s);if(n&&!cs.includes(n))n.style['border'+SIDE_CAP[OPP[s]]]=val}})})}
const _tb=OPS.tborders;
OPS.tborders=function(a){if(a==='more')return bordersDlg();return _tb.call(this,a)};
function bordersDlg(){if(!needCell())return;const t=S.curCell.closest('table');const cs=S.selCells.length?[...S.selCells]:[...t.querySelectorAll('td')];
  const p=S.pen||{};let sides={top:1,bottom:1,left:1,right:1,ih:1,iv:1},setting='all';
  const PRE={none:{top:0,bottom:0,left:0,right:0,ih:0,iv:0},box:{top:1,bottom:1,left:1,right:1,ih:0,iv:0},all:{top:1,bottom:1,left:1,right:1,ih:1,iv:1},grid:{top:1,bottom:1,left:1,right:1,ih:1,iv:1}};
  const cols=['#000000','#0070c0','#00b050','#c00000','#7030a0','#ffc000','#7f7f7f','#ffffff'];
  dialog({title:'حدود وتظليل',w:680,body:`<div class="bdlg">
   <div class="bd-set"><b>الإعداد</b>${[['none','بلا'],['box','مربع'],['all','الكل'],['grid','شبكة'],['custom','مخصّص']].map(([k,l])=>`<button class="bset ${k===setting?'on':''}" data-set="${k}"><i class="bi bi-${k}"></i>${l}</button>`).join('')}</div>
   <div class="bd-mid"><label>النمط<select id="bdS"><option value="solid">──── متصل</option><option value="dashed">- - - متقطع</option><option value="dotted">····· منقّط</option><option value="double">════ مزدوج</option></select></label>
    <label>اللون<span class="bd-cols">${cols.map(c=>`<button class="bdc" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('')}</span></label>
    <label>العرض<select id="bdW"><option value="1">½ نقطة</option><option value="2">1½ نقطة</option><option value="3">2¼ نقطة</option><option value="4">3 نقاط</option></select></label>
    <small class="bd-ap">يُطبَّق على: <b>${S.selCells.length?'الخلايا المحدّدة':'الجدول كله'}</b></small></div>
   <div class="bd-prev"><b>معاينة</b><small>انقر على الأزرار لإضافة خط أو إزالته</small><div class="bp-box"><div class="bp-in"><span class="ih"></span><span class="iv"></span></div>
    <button class="bp t" data-s="top" title="حد علوي">▔</button><button class="bp b" data-s="bottom" title="حد سفلي">▁</button><button class="bp r" data-s="right" title="حد أيمن">▕</button><button class="bp l" data-s="left" title="حد أيسر">▏</button><button class="bp h" data-s="ih" title="داخلي أفقي">═</button><button class="bp v" data-s="iv" title="داخلي عمودي">║</button></div></div>
  </div>`,buttons:[{label:'موافق',pri:1,act:d=>{const bd=`${d.querySelector('#bdW').value}px ${d.querySelector('#bdS').value} ${d.dataset.c||p.c||'#000000'}`;snap();
      const thick=setting==='grid'?`${Math.max(3,+d.querySelector('#bdW').value+1)}px ${d.querySelector('#bdS').value} ${d.dataset.c||p.c||'#000000'}`:null;applyBorderSet(cs,sides,bd,thick);logAct('bordersDlg:'+setting);SIM.emit&&SIM.emit('change')}},{label:'إلغاء'}],
   onOpen:d=>{d.querySelector('#bdS').value=p.s||'solid';d.querySelector('#bdW').value=String(p.w||1);d.dataset.c=p.c||'#000000';
     const paint=()=>{const box=d.querySelector('.bp-box'),bd=`${Math.min(3,+d.querySelector('#bdW').value)}px ${d.querySelector('#bdS').value} ${d.dataset.c}`;const bi=d.querySelector('.bp-in');
       bi.style.borderTop=sides.top?bd:'1px dotted #ccc';bi.style.borderBottom=sides.bottom?bd:'1px dotted #ccc';bi.style.borderRight=sides.right?bd:'1px dotted #ccc';bi.style.borderLeft=sides.left?bd:'1px dotted #ccc';
       bi.querySelector('.ih').style.borderTop=sides.ih?bd:'1px dotted #ccc';bi.querySelector('.iv').style.borderLeft=sides.iv?bd:'1px dotted #ccc';
       box.querySelectorAll('.bp').forEach(b=>b.classList.toggle('on',!!sides[b.dataset.s]));d.querySelectorAll('.bset').forEach(b=>b.classList.toggle('on',b.dataset.set===setting));
       d.querySelectorAll('.bdc').forEach(b=>b.classList.toggle('on',b.dataset.c===d.dataset.c))};
     d.querySelectorAll('.bset').forEach(b=>b.onclick=()=>{setting=b.dataset.set;if(PRE[setting])sides={...PRE[setting]};paint()});
     d.querySelectorAll('.bp').forEach(b=>b.onclick=()=>{sides[b.dataset.s]=sides[b.dataset.s]?0:1;setting='custom';paint()});
     d.querySelectorAll('.bdc').forEach(b=>b.onclick=()=>{d.dataset.c=b.dataset.c;paint()});d.querySelector('#bdS').onchange=paint;d.querySelector('#bdW').onchange=paint;paint()}})}

/* ---- more table commands that work ---- */
(function(){
 const _sh=OPS.shading,_pc=OPS.penColor;
 OPS.shading=function(c){if(c==='more'){colorDlg(v=>OPS.shading(v));return}return _sh.call(this,c)};
 OPS.penColor=function(c){if(c==='more'){colorDlg(v=>OPS.penColor(v));return}return _pc.call(this,c)};
 const tbl=()=>S.curCell&&S.curCell.closest('table');
 const cmv=px=>(parseFloat(px)/CM||0).toFixed(2).replace(/\.?0+$/,'');
 OPS.viewGrid=function(){doc.classList.toggle('vgrid');$$('#ribbon [data-hid="viewGrid"]').forEach(b=>b.classList.toggle('on',doc.classList.contains('vgrid')));simToast(doc.classList.contains('vgrid')?'خطوط الشبكة ظاهرة (لا تُطبع)':'أُخفيت خطوط الشبكة')};
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
