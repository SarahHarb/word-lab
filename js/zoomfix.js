/* Safari/WebKit: getBoundingClientRect ignores CSS zoom of ancestors (returns values divided by zoom).
   Detect once and correct, so the guide ring, menus and mouse tools land on the right spot. */
(function(){
  function detect(){const p=document.createElement('div');p.style.cssText='position:absolute;left:0;top:0;width:50px;height:10px;zoom:2;visibility:hidden';document.body.appendChild(p);const w=p.getBoundingClientRect().width;p.remove();return w>0&&w<75}
  function zOf(n){let z=1;for(let e=n&&n.nodeType===1?n:n&&n.parentElement;e;e=e.parentElement){const s=e.style&&e.style.zoom;if(s){const v=parseFloat(s);if(v&&v!==1)z*=s.indexOf('%')>0?v/100:v}}return z}
  function fix(r,z){if(z===1)return r;return new DOMRect(r.left*z,r.top*z,r.width*z,r.height*z)}
  function install(){if(!detect())return;window.__zoomFix=true;
    const eb=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){return fix(eb.call(this),zOf(this))};
    const rb=Range.prototype.getBoundingClientRect;Range.prototype.getBoundingClientRect=function(){return fix(rb.call(this),zOf(this.startContainer))};
    const rc=Range.prototype.getClientRects;Range.prototype.getClientRects=function(){const z=zOf(this.startContainer),l=rc.call(this);if(z===1)return l;return Array.from(l,r=>fix(r,z))};
  }
  if(document.body)install();else document.addEventListener('DOMContentLoaded',install);
})();
