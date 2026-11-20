/* ===== شريط التحديد (الهامش الأيمن): نقرة = سطر، نقرتان = فقرة، ثلاث = المستند كله — مثل Word ===== */
(function(){
const SB_CUR="url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><path d='M18 2 L6 8 L10 10 L4 17 L6 18 L12 11 L14 15 Z' fill='white' stroke='black' stroke-width='1'/></svg>\") 16 3, pointer";
function zoneAt(e){const t=e.target;if(!t||!t.closest)return null;const pg=t.closest('#doc .page');if(!pg||t.closest('.pg-body,.pg-hdr,.pg-ftr,.obj'))return null;const body=pg.querySelector('.pg-body');if(!body)return null;
  const R=body.getBoundingClientRect(),P=pg.getBoundingClientRect();const rtl=getComputedStyle(body).direction!=='ltr';
  const inX=rtl?(e.clientX>R.right&&e.clientX<P.right):(e.clientX<R.left&&e.clientX>P.left);if(!inX||e.clientY<R.top||e.clientY>R.bottom)return null;return {body,R,rtl}}
function blockAtY(body,y){let best=null;for(const b of body.querySelectorAll(':scope > p,:scope > h1,:scope > h2,:scope > h3,:scope > ul li,:scope > ol li,:scope > ul,:scope > ol')){if(/^(UL|OL)$/.test(b.tagName))continue;const r=b.getBoundingClientRect();if(y>=r.top-2&&y<=r.bottom+2){best=b}}return best}
function selLine(z,y){const x=z.rtl?z.R.right-2:z.R.left+2;let r=document.caretRangeFromPoint?document.caretRangeFromPoint(x,y):null;if(!r&&document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);if(p){r=document.createRange();r.setStart(p.offsetNode,p.offset)}}
  if(!r||!z.body.contains(r.startContainer))return false;const s=getSelection();s.removeAllRanges();s.addRange(r);try{s.modify('move','backward','lineboundary');s.modify('extend','forward','lineboundary')}catch(e){return false}
  if(s.rangeCount){S.range=s.getRangeAt(0).cloneRange()}logAct('selLine');return true}
function selBlock(b){const r=document.createRange();r.selectNodeContents(b);const s=getSelection();s.removeAllRanges();s.addRange(r);S.range=r.cloneRange();logAct('selPara')}
document.addEventListener('mousemove',e=>{if(typeof doc==='undefined')return;const z=S.app==='doc'&&!S.tool&&!S.drawKind&&zoneAt(e);const pg=e.target&&e.target.closest&&e.target.closest('#doc .page');if(pg)pg.style.cursor=z?SB_CUR:''},true);
document.addEventListener('mousedown',e=>{if(e.button!==0||S.app!=='doc'||S.tool||S.drawKind||S.hfMode)return;const z=zoneAt(e);if(!z)return;e.preventDefault();e.stopPropagation();
  const n=e.detail||1;if(n>=3){run('selectAll');return}const b=blockAtY(z.body,e.clientY);if(n===2){if(b)selBlock(b);return}selLine(z,e.clientY)},true);
})();

/* ===== تتبّع ما حدّده الطالب (لتمارين التحديد) ===== */
window.SELSEEN=new Set();
function selKinds(){const s=getSelection();if(!s.rangeCount)return [];const r=s.getRangeAt(0);if(r.collapsed||!firstBody().contains(r.commonAncestorContainer))return [];
  const t=r.toString().replace(/ /g,' ').trim();const out=['text:'+t];
  const blk=n=>(n.nodeType===1?n:n.parentElement).closest('p,h1,h2,h3,li');const a=blk(r.startContainer),z=blk(r.endContainer);
  const all=[...doc.querySelectorAll('.pg-body')].map(b=>b.textContent).join(' ').replace(/\s+/g,' ').trim();if(t.replace(/\s+/g,' ')===all)out.push('all');
  if(a&&a===z){const bt=a.textContent.replace(/ /g,' ').trim();if(t===bt)out.push('para:'+bt.slice(0,12));
    const pre=document.createRange();pre.selectNodeContents(a);pre.setEnd(r.startContainer,r.startOffset);
    const rects=[...r.getClientRects()].filter(x=>x.width>1);const tops=[...new Set(rects.map(x=>Math.round(x.top/4)))];
    if(!pre.toString().trim()&&rects.length&&tops.length===1&&t!==bt){const post=document.createRange();post.selectNodeContents(a);post.setStart(r.endContainer,r.endOffset);const pr=[...post.getClientRects()].filter(x=>x.width>1)[0];if(pr&&Math.abs(pr.top-rects[0].top)>4)out.push('line1:'+bt.slice(0,12))}}
  return out}
document.addEventListener('selectionchange',()=>{if(typeof CO==='undefined'||!CO.item||!CO.item.selTask)return;selKinds().forEach(k=>SELSEEN.add(k));clearTimeout(window._selT);window._selT=setTimeout(()=>{try{SIM.emit('change')}catch(e){}},120)});
