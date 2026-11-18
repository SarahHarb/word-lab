/* ================= Mouse on tables, like Word =================
   • اسحب الخط بين عمودين لتغيير العرض، والخط تحت الصف لتغيير الارتفاع
   • فوق العمود ⬇ انقر لتحديد العمود · يمين الصف ➜ انقر لتحديد الصف · داخل حافة الخلية ↗ لتحديد الخلية
   • مقبض ⊞ عند زاوية الجدول لتحديد الجدول كله */
(function(){
 const SCL=()=>((S.zoom||100)/100)*(window.SIMSCALE||1);
 const docTables=()=>[...doc.querySelectorAll('table.wt:not(.prev)')];
 const cur=(svg,x,y,fb)=>`url("data:image/svg+xml,${encodeURIComponent(svg)}") ${x} ${y},${fb}`;
 const C_DOWN=cur("<svg xmlns='http://www.w3.org/2000/svg' width='16' height='20'><path d='M8 19L2 11h4V1h4v10h4z' fill='#000' stroke='#fff'/></svg>",8,19,'s-resize');
 const C_ROW=cur("<svg xmlns='http://www.w3.org/2000/svg' width='20' height='16'><path d='M1 8l8-6v4h10v4H9v4z' fill='#000' stroke='#fff'/></svg>",1,8,'w-resize');
 const C_CELL=cur("<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><path d='M2 14L14 2M14 2H7M14 2v7' stroke='#000' stroke-width='2.2' fill='none'/></svg>",14,2,'pointer');
 let zone=null,rs=null;
 function edgeZone(td,x,y){const r=td.getBoundingClientRect();if(x-r.left<=4)return {kind:'col',side:'left',td,r};if(r.right-x<=4)return {kind:'col',side:'right',td,r};if(r.bottom-y<=4)return {kind:'row',td,r};
   const rtl=isRTLt(td.closest('table'));const din=rtl?r.right-x:x-r.left;if(din>4&&din<=11)return {kind:'cell',td};return null}
 function outerZone(x,y){for(const t of docTables()){const r=t.getBoundingClientRect();const rtl=isRTLt(t);
   if(x>=r.left&&x<=r.right&&y>=r.top-12&&y<r.top+1)return {kind:'colsel',t,x};
   if(y>=r.top&&y<=r.bottom&&(rtl?(x>r.right&&x<=r.right+16):(x<r.left&&x>=r.left-16)))return {kind:'rowsel',t,y}}return null}
 function setCursor(z){const v=!z?'':z.kind==='col'?'col-resize':z.kind==='row'?'row-resize':z.kind==='colsel'?C_DOWN:z.kind==='rowsel'?C_ROW:z.kind==='cell'?C_CELL:'';
   const pg=$('#doc');if(pg)pg.style.cursor=v;docTables().forEach(t=>t.style.cursor=v)}
 document.addEventListener('mousemove',e=>{if(rs){resizeMove(e);return}if(S.tool||e.buttons)return;if(!e.target.closest||!e.target.closest('#doc')){if(zone){zone=null;setCursor(null)}return}
   const td=e.target.closest('#doc table.wt:not(.prev) td');zone=td?edgeZone(td,e.clientX,e.clientY):outerZone(e.clientX,e.clientY);setCursor(zone);showHandle(e)},true);
 document.addEventListener('mousedown',e=>{if(S.tool||!zone||e.button!==0)return;const z=zone;
   if(z.kind==='col'||z.kind==='row'){e.preventDefault();e.stopPropagation();startResize(z,e);return}
   e.preventDefault();e.stopPropagation();
   if(z.kind==='cell'){clearCells();setCur(z.td);setCells([z.td]);logAct('mouse:cell')}
   if(z.kind==='colsel'){const g=gridMap(z.t);let hit=null;z.t.querySelectorAll('td').forEach(td=>{const r=td.getBoundingClientRect();if(!hit&&z.x>=r.left&&z.x<=r.right)hit=td});if(hit){setCur(hit);const v=g.get(hit);const o=[];g.forEach((w,td)=>{if(w.c1<=v.c2&&w.c2>=v.c1)o.push(td)});setCells(o);logAct('mouse:col')}}
   if(z.kind==='rowsel'){const tr=[...z.t.rows].find(r=>{const b=r.getBoundingClientRect();return z.y>=b.top&&z.y<=b.bottom});if(tr&&tr.cells[0]){setCur(tr.cells[0]);setCells(rectCells(tr.cells[0],tr.cells[tr.cells.length-1]));logAct('mouse:row')}}
   updateCtx()},true);
 /* resizing */
 function startResize(z,e){rs={...z,x0:e.clientX,y0:e.clientY};snap();const l=guide();if(z.kind==='col'){const tr=z.td.closest('table').getBoundingClientRect();Object.assign(l.style,{left:e.clientX+'px',top:tr.top+'px',height:tr.height+'px',width:'0',borderLeft:'1px dashed #2b579a',borderTop:'0',display:'block'})}
   else{const tr=z.td.closest('table').getBoundingClientRect();Object.assign(l.style,{top:e.clientY+'px',left:tr.left+'px',width:tr.width+'px',height:'0',borderTop:'1px dashed #2b579a',borderLeft:'0',display:'block'})}}
 function guide(){let l=$('#rsguide');if(!l){l=document.createElement('div');l.id='rsguide';l.style.cssText='position:fixed;z-index:4000;pointer-events:none';document.body.appendChild(l)}return l}
 function resizeMove(e){const l=guide();if(rs.kind==='col')l.style.left=e.clientX+'px';else l.style.top=e.clientY+'px'}
 document.addEventListener('mouseup',e=>{if(!rs)return;const z=rs;rs=null;guide().style.display='none';const k=SCL();const t=z.td.closest('table'),g=gridMap(t),v=g.get(z.td);
   if(z.kind==='col'){const w=Math.max(0.4*CM,(z.side==='left'?z.r.right-e.clientX:e.clientX-z.r.left)/k);const rtl=isRTLt(t);const col=(z.side==='left')===rtl?v.c2:v.c1;
     t.style.tableLayout='auto';g.forEach((x,td)=>{if(x.c1===x.c2&&x.c1===col)td.style.width=Math.round(w)+'px'});if(z.td.colSpan===1)z.td.style.width=Math.round(w)+'px';logAct('mouse:colW');simToast(`العرض: ${(w/CM).toFixed(2)} سم`)}
   else{const h=Math.max(0.4*CM,(e.clientY-z.r.top)/k);const row=v.r2;g.forEach((x,td)=>{if(x.r1===x.r2&&x.r1===row)td.style.height=Math.round(h)+'px'});if((z.td.rowSpan||1)===1)z.td.style.height=Math.round(h)+'px';logAct('mouse:rowH');simToast(`الارتفاع: ${(h/CM).toFixed(2)} سم`)}
   SIM.emit&&SIM.emit('change');updateCtx()},true);
 /* ⊞ table handle */
 function showHandle(e){let hd=$('#tblhandle');const t=e.target.closest&&e.target.closest('#doc table.wt:not(.prev)');if(!t){if(hd&&!e.target.closest('#tblhandle'))hd.style.display='none';return}
   if(!hd){hd=document.createElement('button');hd.id='tblhandle';hd.textContent='⊞';hd.title='تحديد الجدول كله';document.body.appendChild(hd);
     hd.addEventListener('mousedown',ev=>{ev.preventDefault();ev.stopPropagation();const tt=hd._t;if(!tt)return;setCur(tt.querySelector('td'));setCells([...tt.querySelectorAll('td')]);updateCtx();logAct('mouse:table')},true)}
   const r=t.getBoundingClientRect(),rtl=isRTLt(t);hd._t=t;Object.assign(hd.style,{display:'block',top:(r.top-16)+'px',left:(rtl?r.right+2:r.left-16)+'px'})}
 document.addEventListener('scroll',()=>{const hd=$('#tblhandle');if(hd)hd.style.display='none'},true);
})();
