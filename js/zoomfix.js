/* Safari/WebKit: getBoundingClientRect ignores CSS zoom of ancestors (returns values divided by zoom).
   Detect once and correct, so the guide ring, menus and mouse tools land on the right spot. */
(function(){
  let PZ=false,SZ=false;
  function detect(){const A=document.createElement('div');A.style.cssText='position:fixed;left:200px;top:200px;width:60px;height:60px;visibility:hidden;pointer-events:none;direction:ltr';
    A.innerHTML='<div style="zoom:2;margin:0;padding:0"><div style="width:10px;height:10px;margin:0"></div></div>';document.body.appendChild(A);
    const ar=A.getBoundingClientRect(),cr=A.firstChild.firstChild.getBoundingClientRect();A.remove();
    PZ=ar.left>150&&cr.left<ar.left*0.75; SZ=cr.width>0&&cr.width<15; window.__zoomFixInfo={a:[ar.left,ar.top],c:[cr.left,cr.top,cr.width],PZ,SZ};return PZ||SZ}
  function zOf(n){let z=1;for(let e=n&&n.nodeType===1?n:n&&n.parentElement;e;e=e.parentElement){const s=e.style&&e.style.zoom;if(s){const v=parseFloat(s);if(v&&v!==1)z*=s.indexOf('%')>0?v/100:v}}return z}
  function fix(r,z){if(z===1)return r;const p=PZ?z:1,q=SZ?z:1;return new DOMRect(r.left*p,r.top*p,r.width*q,r.height*q)}
  function install(){if(!detect())return;window.__zoomFix=true;
    const eb=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){return fix(eb.call(this),zOf(this))};
    const rb=Range.prototype.getBoundingClientRect;Range.prototype.getBoundingClientRect=function(){return fix(rb.call(this),zOf(this.startContainer))};
    const rc=Range.prototype.getClientRects;Range.prototype.getClientRects=function(){const z=zOf(this.startContainer),l=rc.call(this);if(z===1)return l;return Array.from(l,r=>fix(r,z))};
  }
  if(document.body)install();else document.addEventListener('DOMContentLoaded',install);
})();
