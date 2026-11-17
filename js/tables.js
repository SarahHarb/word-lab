/* ================= Tables ================= */
(function(){const st=document.createElement('style');st.textContent=TSTYLES.map((t,i)=>`
table.wt.ts${i} td{border-color:${t.l}}
table.wt.ts${i}:not(.nohdr) tr:first-child td{background:${t.h};color:${i===0||i===6?'inherit':'#fff'};font-weight:700}
table.wt.ts${i}:not(.noband) tr:nth-child(even):not(:first-child) td{background:${t.b1}}
table.wt.ts${i}.nohdr:not(.noband) tr:nth-child(odd) td{background:${t.b1}}
table.wt.ts${i}.tot tr:last-child td{font-weight:700;border-top:2px solid ${t.h==='#fff'?'#000':t.h}}
table.wt.ts${i}.fcol td:first-child{font-weight:700}table.wt.ts${i}.lcol td:last-child{font-weight:700}
table.wt.ts${i}.bcols td:nth-child(even){background:${t.b1}}`).join('')+`
table.wt.ts4 tr:first-child td{border-bottom:2px solid #000}table.wt.ts6 td{border-color:transparent}
table.wt.b-none td{border-color:transparent!important}table.wt.b-outside td{border-color:transparent!important}table.wt.b-outside{outline:1px solid #000;outline-offset:-1px}
table.wt.b-inside{outline:0}`;document.head.appendChild(st)})();
const cols=t=>Math.max(...[...t.rows].map(r=>[...r.cells].reduce((a,c)=>a+c.colSpan,0)));
const newCell=()=>{const td=document.createElement('td');td.innerHTML='<br>';return td};
function newRow(t){const tr=document.createElement('tr');for(let i=0;i<cols(t);i++)tr.appendChild(newCell());return tr}
function tableEl(r,c){const t=document.createElement('table');t.className='wt ts0';const tb=t.createTBody();for(let i=0;i<r;i++){const tr=tb.insertRow();for(let j=0;j<c;j++)tr.appendChild(newCell())}return t}
function insertTable(r,c){
  if(!needDoc())return;removeTablePreview();if(!inText())placeCaretIn(pages().at(-1).querySelector('.pg-body'),false);restoreSel();snap();
  const t=tableEl(r,c);const host=editHost(S.range.startContainer);
  if(host&&host.closest('td')){insertInline(t)}else insertBlock(t);
  placeCaretIn(t.rows[0].cells[0],true);S.curCell=t.rows[0].cells[0];updateCtx();showCtxTab('tdesign');logAct(`table:${c}x${r}`);
}
let tpv=null;
function showTablePreview(r,c){if(!S.range||!doc.contains(S.range.startContainer))return;if(!tpv){tpv=tableEl(r,c);tpv.classList.add('prev');tpv.contentEditable='false'}
  tpv.innerHTML='<tbody>'+('<tr>'+'<td></td>'.repeat(c)+'</tr>').repeat(r)+'</tbody>';if(!tpv.isConnected){const b=topBlock();const host=editHost(S.range.startContainer);if(b&&b.parentElement===host)b.before(tpv);else (host||firstBody()).appendChild(tpv)}}
function removeTablePreview(){if(tpv&&tpv.isConnected)tpv.remove()}
document.addEventListener('mouseover',e=>{const s=e.target.closest&&e.target.closest('#tgrid span');if(!s)return;const r=+s.dataset.r,c=+s.dataset.c;
  s.parentElement.querySelectorAll('span').forEach(x=>x.classList.toggle('h',+x.dataset.r<=r&&+x.dataset.c<=c));const cap=$('#gridCap');if(cap)cap.textContent=`جدول ${c}×${r}`;showTablePreview(r,c)});
document.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest('#tgrid')&&!(e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest('#tgrid'))){$$('#tgrid .h').forEach(x=>x.classList.remove('h'));const cap=$('#gridCap');if(cap)cap.textContent='إدراج جدول';removeTablePreview()}});
document.addEventListener('mousedown',e=>{if(e.target.closest&&e.target.closest('#tgrid'))e.preventDefault()},true);
document.addEventListener('click',e=>{const s=e.target.closest&&e.target.closest('#tgrid span');if(!s)return;closeMenus();insertTable(+s.dataset.r,+s.dataset.c)});
/* cell selection */
let tdDrag=null;
function clearCells(){S.selCells.forEach(c=>c.classList.remove('sel'));S.selCells=[]}
function setCells(a){clearCells();S.selCells=a.filter(Boolean);S.selCells.forEach(c=>c.classList.add('sel'));logAct('cellsSelected:'+S.selCells.length);SIM.emit('change')}
/* visual grid (handles merged cells): each cell -> {r1,r2,c1,c2} */
function gridMap(t){const occ=[];const m=new Map();[...t.rows].forEach((tr,r)=>{occ[r]=occ[r]||[];let c=0;[...tr.cells].forEach(td=>{while(occ[r][c])c++;const rs=td.rowSpan||1,cs=td.colSpan||1;for(let i=0;i<rs;i++){occ[r+i]=occ[r+i]||[];for(let j=0;j<cs;j++)occ[r+i][c+j]=td}m.set(td,{r1:r,r2:r+rs-1,c1:c,c2:c+cs-1});c+=cs})});return m}
function rectCells(a,b){const t=a.closest('table');const g=gridMap(t);const A=g.get(a),B=g.get(b);if(!A||!B)return [a];let r1=Math.min(A.r1,B.r1),r2=Math.max(A.r2,B.r2),c1=Math.min(A.c1,B.c1),c2=Math.max(A.c2,B.c2);
  let grow=true;while(grow){grow=false;g.forEach(v=>{if(v.r2>=r1&&v.r1<=r2&&v.c2>=c1&&v.c1<=c2){if(v.r1<r1){r1=v.r1;grow=true}if(v.r2>r2){r2=v.r2;grow=true}if(v.c1<c1){c1=v.c1;grow=true}if(v.c2>c2){c2=v.c2;grow=true}}})}
  const o=[];g.forEach((v,td)=>{if(v.r2>=r1&&v.r1<=r2&&v.c2>=c1&&v.c1<=c2)o.push(td)});return o}
document.addEventListener('mousedown',e=>{if(!e.target.closest)return;const td=e.target.closest('#doc table.wt td');if(e.target.closest('#ribbon,.dd,#dlgs,#wtabs'))return;
  if(td&&e.shiftKey&&S.curCell&&S.curCell.closest('table')===td.closest('table')){e.preventDefault();setCells(rectCells(S.curCell,td));return}
  if(e.target.closest('#doc'))clearCells();tdDrag=td||null});
document.addEventListener('mouseover',e=>{if(!tdDrag||e.buttons!==1||!e.target.closest)return;const td=e.target.closest('#doc table.wt td');if(td&&td!==tdDrag&&td.closest('table')===tdDrag.closest('table')){setCells(rectCells(tdDrag,td))}});
document.addEventListener('mouseup',()=>tdDrag=null);
const targetCells=()=>S.selCells.length?S.selCells:(S.curCell?[S.curCell]:[]);
function needCell(){if(!S.curCell&&!S.selCells.length){simToast('انقر داخل الجدول أولًا');return false}if(!S.curCell)S.curCell=S.selCells[0];return true}
function tableTab(e){const r=curRange();if(!r)return false;let n=r.startContainer;n=n.nodeType===1?n:n.parentElement;const td=n.closest('td');if(!td||!td.closest('table.wt'))return false;
  e.preventDefault();clearCells();const t=td.closest('table');const all=[...t.querySelectorAll('td')];let i=all.indexOf(td)+(e.shiftKey?-1:1);
  if(i>=all.length){snap();const tr=newRow(t);t.rows[t.rows.length-1].after(tr);placeCaretIn(tr.cells[0]);logAct('tabNewRow');return true}
  if(i>=0)placeCaretIn(all[i],true,true);logAct('tab');return true}
Object.assign(OPS,{
  tableDlg(){dialog({title:'إدراج جدول',body:`<b>حجم الجدول</b><label class="row" style="justify-content:space-between">عدد الأعمدة: <input type="number" id="tc" value="5" min="1" max="20" style="width:70px"></label><label class="row" style="justify-content:space-between">عدد الصفوف: <input type="number" id="tr" value="2" min="1" max="60" style="width:70px"></label>`,buttons:[{label:'موافق',pri:1,act:()=>insertTable(Math.max(1,+$('#tr').value||2),Math.max(1,+$('#tc').value||5))},{label:'إلغاء'}]})},
  insertTableRC(a){const [r,c]=String(a).split('x').map(Number);insertTable(r,c)},
  drawTable(){simToast('رسم جدول: استخدم «إدراج جدول» في المحاكي')},quickTables(){insertTable(4,3)},
  convertText(){if(S.curCell){snap();const t=S.curCell.closest('table');const ps=[...t.rows].map(r=>{const p=document.createElement('p');p.textContent=[...r.cells].map(c=>c.textContent).join('    ');return p});t.replaceWith(...ps);S.curCell=null;updateCtx()}else simToast('حدّد النص لتحويله إلى جدول')},
  /* design */
  tstyle(i){if(!needCell())return;snap();const t=S.curCell.closest('table');t.className=t.className.replace(/\bts\d\b/g,'').trim()+' ts'+i;t.querySelectorAll('td').forEach(c=>c.style.backgroundColor='');logAct('tstyle:'+i)},
  optHeader(v){if(!needCell())return;S.curCell.closest('table').classList.toggle('nohdr',!v)},optTotal(v){if(!needCell())return;S.curCell.closest('table').classList.toggle('tot',!!v)},
  optBanded(v){if(!needCell())return;S.curCell.closest('table').classList.toggle('noband',!v)},optFirstCol(v){if(!needCell())return;S.curCell.closest('table').classList.toggle('fcol',!!v)},
  optLastCol(v){if(!needCell())return;S.curCell.closest('table').classList.toggle('lcol',!!v)},optBandCols(v){if(!needCell())return;S.curCell.closest('table').classList.toggle('bcols',!!v)},
  shading(c){const cs=targetCells();if(!cs.length){simToast('حدِّد الخلايا أولًا');return}snap();if(c==='pattern'){cs.forEach(x=>x.style.backgroundImage='repeating-linear-gradient(45deg,#000 0 2px,#fff 2px 7px)');logAct('shading:pattern');return}cs.forEach(x=>{x.style.backgroundColor=c==='none'?'':(c||'#ffff00');if(c==='none')x.style.backgroundImage=''});logAct('shading:'+cs.length)},
  penStyle(a){S.pen=Object.assign(S.pen||{},{s:a})},penWeight(a){S.pen=Object.assign(S.pen||{},{w:a})},penColor(a){S.pen=Object.assign(S.pen||{},{c:a==='more'?'#000':a})},
  tborders(a){if(!needCell())return;snap();const t=S.curCell.closest('table');const cs=S.selCells.length?S.selCells:[...t.querySelectorAll('td')];const p=S.pen||{};const bd=`${p.w||(p.s==='double'?3:1)}px ${p.s||'solid'} ${p.c||'#000'}`;
    if(a==='none'){cs.forEach(c=>c.style.border='1px solid transparent')}else if(a==='all'||!a){cs.forEach(c=>c.style.border=bd)}
    else if(a==='outside'){const g=gridMap(t);const bs=cs.map(c=>g.get(c)).filter(Boolean);const r1=Math.min(...bs.map(b=>b.r1)),r2=Math.max(...bs.map(b=>b.r2)),c1=Math.min(...bs.map(b=>b.c1)),c2=Math.max(...bs.map(b=>b.c2));cs.forEach(c=>{const v=g.get(c);if(!v)return;if(v.r1===r1)c.style.borderTop=bd;if(v.r2===r2)c.style.borderBottom=bd;const ltr=getComputedStyle(t).direction==='ltr';if(v.c1===c1)c.style[ltr?'borderLeft':'borderRight']=bd;if(v.c2===c2)c.style[ltr?'borderRight':'borderLeft']=bd})}
    else if(a==='inside'){cs.forEach(c=>c.style.border=bd)}else{const k={top:'borderTop',bottom:'borderBottom',right:'borderRight',left:'borderLeft'}[a];cs.forEach(c=>c.style[k]=bd)}logAct('tborders:'+a)},
  borderPainter(){OPS.tborders('all')},
  /* layout */
  tselect(a){if(!needCell())return;const t=S.curCell.closest('table');if(a==='cell')setCells([S.curCell]);if(a==='row')setCells([...S.curCell.parentElement.cells]);if(a==='col'){const g=gridMap(t),v=g.get(S.curCell);const o=[];g.forEach((w,td)=>{if(w.c2>=v.c1&&w.c1<=v.c2)o.push(td)});setCells(o)}if(a==='table')setCells([...t.querySelectorAll('td')])},
  viewGrid(){doc.classList.toggle('vgrid')},tprops(){simToast('خصائص الجدول: للعرض فقط')},eraser(){simToast('الممحاة: استخدم «دمج الخلايا»')},
  tdel(a){if(!needCell())return;snap();const t=S.curCell.closest('table');const cs=targetCells();
    if(a==='table'){t.remove()}else if(a==='row'){new Set(cs.map(c=>c.parentElement)).forEach(r=>r.remove());if(!t.rows.length)t.remove()}
    else if(a==='col'){const idx=[...new Set(cs.map(c=>c.cellIndex))].sort((x,y)=>y-x);[...t.rows].forEach(r=>idx.forEach(i=>{const c=r.cells[i];if(!c)return;if(c.colSpan>1)c.colSpan--;else c.remove()}));[...t.rows].forEach(r=>{if(!r.cells.length)r.remove()});if(!t.rows.length)t.remove()}
    else{cs.forEach(c=>c.remove())}S.curCell=null;clearCells();updateCtx();logAct('tdel:'+a)},
  insAbove(){if(!needCell())return;snap();const t=S.curCell.closest('table');S.curCell.parentElement.before(newRow(t));logAct('insAbove')},
  insBelow(){if(!needCell())return;snap();const t=S.curCell.closest('table');const rows=[...new Set(targetCells().map(c=>c.parentElement))];rows.at(-1).after(newRow(t));logAct('insBelow')},
  insRight(){addCol(true)},insLeft(){addCol(false)},
  merge(){const cs=S.selCells.slice();if(cs.length<2){simToast('حدِّد خليتين أو أكثر أولًا (اسحب الفأرة فوق الخلايا)');return}snap();const rows=new Set(cs.map(c=>c.parentElement));
    if(rows.size===1){cs.sort((a,b)=>a.cellIndex-b.cellIndex);const f=cs[0];let span=f.colSpan;cs.slice(1).forEach(o=>{span+=o.colSpan;if(o.textContent.trim())f.innerHTML+=' '+o.innerHTML;o.remove()});f.colSpan=span}
    else{const ci=new Set(cs.map(c=>c.cellIndex));if(ci.size===1){cs.sort((a,b)=>a.parentElement.rowIndex-b.parentElement.rowIndex);const f=cs[0];let span=f.rowSpan;cs.slice(1).forEach(o=>{span+=o.rowSpan;if(o.textContent.trim())f.innerHTML+='<br>'+o.innerHTML;o.remove()});f.rowSpan=span}
      else{const byRow=[...rows];const f=cs[0];const t=f.closest('table');let w=0;[...byRow[0].cells].forEach(c=>{if(cs.includes(c))w+=c.colSpan});cs.slice(1).forEach(o=>{if(o.textContent.trim())f.innerHTML+=' '+o.innerHTML;o.remove()});f.colSpan=w;f.rowSpan=byRow.length}}
    clearCells();S.curCell=cs[0];placeCaretIn(cs[0],false);logAct('merge');simToast('تم دمج الخلايا ✓')},
  splitCells(){if(!needCell())return;const c=S.curCell;dialog({title:'تقسيم الخلايا',body:`<label class="row" style="justify-content:space-between">عدد الأعمدة: <input type="number" id="sc" value="${Math.max(2,c.colSpan)}" min="1" max="10" style="width:60px"></label><label class="row" style="justify-content:space-between">عدد الصفوف: <input type="number" id="sr" value="1" min="1" max="10" style="width:60px"></label>`,
    buttons:[{label:'موافق',pri:1,act:()=>{snap();const n=Math.max(1,+$('#sc').value),rr=Math.max(1,+$('#sr').value);const t=c.closest('table');
      if(n>1){if(c.colSpan>=n){const extra=c.colSpan-1;c.colSpan=1;for(let i=0;i<n-1;i++)c.after(newCell());const rem=extra-(n-1);if(rem>0)c.nextElementSibling.colSpan+=rem}
        else{const add=n-c.colSpan;const ci=c.cellIndex;for(let i=0;i<add;i++)c.after(newCell());c.colSpan=1;[...t.rows].forEach(r=>{if(r===c.parentElement)return;const x=r.cells[Math.min(ci,r.cells.length-1)];if(x)x.colSpan+=add})}}
      if(rr>1){const tr=c.parentElement;for(let i=0;i<rr-1;i++){const nr=document.createElement('tr');[...tr.cells].forEach(x=>{if(x!==c&&!(n>1&&x.previousElementSibling===c))x.rowSpan++});const nc=newCell();nc.colSpan=1;nr.appendChild(nc);tr.after(nr)}}
      logAct('splitCells')}},{label:'إلغاء'}]})},
  splitTable(){if(!needCell())return;snap();const t=S.curCell.closest('table'),tr=S.curCell.parentElement;if(tr.rowIndex===0)return;const t2=t.cloneNode(false);const tb=document.createElement('tbody');t2.appendChild(tb);let r=tr;while(r){const n=r.nextElementSibling;tb.appendChild(r);r=n}const p=document.createElement('p');p.innerHTML='<br>';t.after(p,t2);logAct('splitTable')},
  autofit(a){if(!needCell())return;snap();const t=S.curCell.closest('table');t.style.tableLayout=a==='content'?'auto':'fixed';t.style.width=a==='content'?'auto':'100%'},
  rowH(v){if(!needCell())return;snap();new Set(targetCells().map(c=>c.parentElement)).forEach(r=>[...r.cells].forEach(c=>c.style.height=(+v*CM)+'px'));logAct('rowH')},
  colW(v){if(!needCell())return;snap();const t=S.curCell.closest('table');t.style.tableLayout='auto';const idx=new Set(targetCells().map(c=>c.cellIndex));[...t.rows].forEach(r=>idx.forEach(i=>{if(r.cells[i])r.cells[i].style.width=(+v*CM)+'px'}));logAct('colW')},
  distRows(){if(!needCell())return;const t=S.curCell.closest('table');const h=Math.max(...[...t.rows].map(r=>r.offsetHeight));[...t.rows].forEach(r=>[...r.cells].forEach(c=>c.style.height=h+'px'))},
  distCols(){if(!needCell())return;const t=S.curCell.closest('table');t.style.tableLayout='fixed';t.querySelectorAll('td').forEach(c=>c.style.width='')},
  calign(a){const cs=targetCells();if(!cs.length){simToast('انقر داخل خلية أولًا');return}snap();const [v,h]=a.split('-');cs.forEach(c=>{c.style.verticalAlign=v;c.style.textAlign=h})},
  textDir(){if(S.obj&&S.obj.classList.contains('shp')){const t=S.obj.querySelector('.stxt');t.style.writingMode=t.style.writingMode?'':'vertical-rl';return}const cs=targetCells();cs.forEach(c=>c.style.writingMode=c.style.writingMode?'':'vertical-rl')},
  cellMargins(){simToast('هوامش الخلايا: للعرض فقط')},
  tsort(){if(!needCell())return;snap();const t=S.curCell.closest('table');const rows=[...t.rows].slice(t.classList.contains('nohdr')?0:1);const ci=S.curCell.cellIndex;rows.sort((a,b)=>(a.cells[ci]?.textContent||'').localeCompare(b.cells[ci]?.textContent||'','ar',{numeric:true}));rows.forEach(r=>t.tBodies[0].appendChild(r));simToast('تم فرز الجدول')},
  repeatHeader(){simToast('تكرار صفوف الرأس: مفعّل')},formula(){simToast('صيغة: للعرض فقط')},
});
function addCol(right){if(!needCell())return;snap();const i=S.curCell.cellIndex;[...S.curCell.closest('table').rows].forEach(r=>{const ref=r.cells[Math.min(i,r.cells.length-1)];const td=newCell();right?ref.before(td):ref.after(td)});logAct(right?'insRight':'insLeft')}
