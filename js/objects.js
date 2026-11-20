/* ================= Floating objects: pictures, shapes, text boxes, WordArt + equations ================= */
const HANDLES='<i class="h tl"></i><i class="h t"></i><i class="h tr"></i><i class="h l"></i><i class="h r"></i><i class="h bl"></i><i class="h b"></i><i class="h br"></i><i class="h rot"></i><i class="anchor">⚓</i>';
function picHTML(src,w=360,h,extra=''){h=h||Math.round(w*2/3);return `<span class="obj pic" contenteditable="false" data-wrap="inline" data-w="${w}" data-h="${h}" data-iw="${w}" data-ih="${h}" data-ix="0" data-iy="0" data-rot="0" data-src="${src}" ${extra}><span class="crop"><img src="${src}" alt="" draggable="false"></span>${HANDLES}</span>`}
function shapeHTML(kind,w,h,o={}){const cls=kind==='textbox'?' textbox':kind==='wordart'?' wordart':'';
  const d={fill:'#4472c4',line:'#2f528f',lw:1.5,tcol:'#ffffff',...o};
  if(kind==='textbox'){d.fill='#ffffff';d.line='#000000';d.lw=.75;d.tcol='#000000'}if(kind==='wordart'){d.fill='none';d.line='none'}
  if(kind==='line'||kind==='arrowLine'){d.fill='none';d.line='#4472c4';d.lw=2}
  return `<span class="obj shp${cls}" contenteditable="false" data-kind="${kind}" data-wrap="${o.wrap||(kind==='wordart'?'inline':'front')}" data-w="${w}" data-h="${h}" data-x="${o.x||0}" data-y="${o.y||0}" data-rot="0" data-fill="${d.fill}" data-line="${d.line}" data-lw="${d.lw}" data-dash="solid" data-tcol="${d.tcol}" ${o.tfill?`data-tfill="${o.tfill}"`:''} ${o.tout?`data-tout="${o.tout}"`:''} ${o.tfx?`data-tfx="${o.tfx}"`:''}><svg><path/></svg><div class="stxt" contenteditable="${kind==='textbox'||kind==='wordart'?'true':'false'}">${o.text||''}</div>${HANDLES}</span>`}
function applyObj(o){
  const d=o.dataset;let w=+d.w,h=+d.h;o.style.width=w+'px';o.style.height=h+'px';
  const wrap=d.wrap||'inline';o.classList.remove('float','behind','front','sq','tb');o.style.position='';o.style.left='';o.style.top='';o.style.float='';o.style.margin='';o.style.display='';o.style.zIndex='';o.style.shapeOutside='';
  if(wrap==='inline'){if(d.align){o.style.display='block';o.style.marginRight=d.align==='right'?'0':'auto';o.style.marginLeft=d.align==='left'?'0':'auto'}}
  else if(['square','tight','through'].includes(wrap)){o.classList.add('sq');const side=d.side||'right';o.style.float=side;o.style.margin=side==='right'?'4px 0 6px 14px':'4px 14px 6px 0';if(wrap!=='square'&&o.classList.contains('shp'))o.style.shapeOutside='margin-box'}
  else if(wrap==='topbottom'){o.classList.add('tb');o.style.display='block';o.style.margin='6px '+(d.side==='left'?'auto 6px 0':d.side==='center'?'auto':'0 6px auto')}
  else{o.classList.add('float',wrap==='behind'?'behind':'front');o.style.left=(+d.x||0)+'px';o.style.top=(+d.y||0)+'px';o.style.zIndex=wrap==='behind'?'-1':String(5+(+d.z||0))}
  let tf=`rotate(${+d.rot||0}deg)`;if(d.flipH)tf+=' scaleX(-1)';if(d.flipV)tf+=' scaleY(-1)';o.style.transform=tf;
  if(o.classList.contains('pic')){
    const img=o.querySelector('img');const c=o.querySelector('.crop');img.style.width=(+d.iw||w)+'px';img.style.height=(+d.ih||h)+'px';img.style.left=(+d.ix||0)+'px';img.style.top=(+d.iy||0)+'px';
    if(img.getAttribute('src')!==(d.nobg||d.src))img.src=d.nobg||d.src;
    const f=[d.corr?`brightness(${d.corr.split(',')[0]}) contrast(${d.corr.split(',')[1]})`:'',d.pcol&&d.pcol!=='none'?d.pcol:'',d.art&&d.art!=='none'?d.art:''].filter(Boolean).join(' ');img.style.filter=f;img.style.opacity=d.transp?1-(+d.transp):'';
    c.className='crop'+(d.ps&&d.ps!=='none'?' ps-'+d.ps:'')+(d.fx&&d.fx!=='none'?' fx-'+d.fx:'');c.style.border=d.border&&d.border!=='none'?`3px solid ${d.border}`:'';
    if(d.ps==='simple'||d.ps==='thick')c.style.boxSizing='border-box';
  }else{
    const svg=o.querySelector('svg'),p=svg.querySelector('path');const k=d.kind;svg.setAttribute('viewBox',`0 0 ${w} ${h}`);p.setAttribute('d',shapePath(k,w,h));
    const lw=+d.lw||1;p.setAttribute('fill',d.fill==='none'?'none':d.fill);p.setAttribute('stroke',d.line==='none'?'none':d.line);p.setAttribute('stroke-width',lw);p.setAttribute('stroke-dasharray',d.dash==='dash'?`${lw*4} ${lw*3}`:d.dash==='dot'?`${lw} ${lw*2}`:'');
    svg.querySelectorAll('.ex').forEach(x=>x.remove());const ex2=shapeExtra(k,w,h);if(ex2){const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','ex');g.style.color=d.line==='none'?'#333':d.line;g.innerHTML=ex2;svg.appendChild(g)}
    svg.setAttribute('class',d.fx&&d.fx!=='none'?'fx-'+d.fx:'');
    const t=o.querySelector('.stxt');t.style.color=d.tfill||d.tcol||'';t.style.webkitTextStroke=d.tout&&d.tout!=='none'?`1px ${d.tout}`:'';
    t.style.textShadow=d.tfx==='shadow'?'3px 3px 3px rgba(0,0,0,.4)':d.tfx==='glow'?'0 0 8px #ffc000,0 0 4px #ffc000':'';t.style.webkitBoxReflect=d.tfx==='reflection'?'below -6px linear-gradient(transparent 50%,rgba(255,255,255,.4))':'';
    t.style.transform=d.tfx==='arch'?'perspective(200px) rotateX(18deg)':'';
    if(k==='wordart'){const nat=t.scrollWidth;if(nat+8>w&&!d.fixedW){d.w=nat+8;o.style.width=d.w+'px'}}
  }
}
function selectObj(o){if(!o)return;clearObjSel(true);S.obj=o;o.classList.add('sel');syncRibbon();updateCtx();logAct('objSel:'+(o.classList.contains('pic')?'pic':o.dataset.kind));SIM.emit('change')}
function clearObjSel(keep){doc&&doc.querySelectorAll('.obj.sel').forEach(x=>{x.classList.remove('sel','cropping')});if(!keep){S.obj=null;updateCtx()}}
/* insert */
function placeFloat(o,body,x,y){body.appendChild(o);o.dataset.x=x;o.dataset.y=y;applyObj(o)}
function insertPicture(src){
  if(!needDoc())return;if(!inText()||S.hfMode&&!editHost(S.range.startContainer)?.closest('.pg-hdr,.pg-ftr'))placeCaretIn(pages().at(-1).querySelector('.pg-body'),false);restoreSel();snap();
  const tmp=document.createElement('div');const host=editHost(S.range.startContainer);const maxW=Math.min(420,(host?host.clientWidth:500)-10);tmp.innerHTML=picHTML(src,host&&host.closest('td,.pg-hdr,.pg-ftr')?Math.min(120,maxW):maxW);const o=tmp.firstChild;
  insertInline(o);applyObj(o);selectObj(o);showCtxTab('pformat');logAct('picture');SIM.emit('change');
}
Object.assign(OPS,{
  pictures(){simToast('اختر «هذا الجهاز...» أو صورة جاهزة من القائمة')},
  picDevice(){const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>{const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=()=>insertPicture(r.result);r.readAsDataURL(f)};i.click()},
  picStock(){OPS.insPic(1)},picOnline(){dialog({title:'صور عبر الإنترنت',body:`<p>اختر صورة:</p><div class="pgal" style="grid-template-columns:repeat(4,96px)">${SAMPLE_IMGS.map((s,i)=>`<button data-i="${i}"><img src="${s}"></button>`).join('')}</div>`,buttons:[{label:'إلغاء'}],onOpen:d=>d.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{closeDialog();OPS.insPic(+b.dataset.i)})})},
  onlinePic(){OPS.picOnline()},
  insPic(i){insertPicture(SAMPLE_IMGS[+i])},
  icons(){OPS.insShape('smiley')},smartart(){simToast('SmartArt: للعرض فقط')},chart(){simToast('مخطط: للعرض فقط')},screenshot(){simToast('لقطة شاشة: للعرض فقط')},
  insShape(k){if(!needDoc())return;S.drawKind=k;doc.classList.add('drawing');closeMenus();simToast(k==='textbox'?'اسحب على الصفحة لرسم مربع النص':'اسحب على الصفحة لرسم الشكل (مع Shift يبقى متناسقًا)');logAct('drawStart:'+k)},
  drawTextbox(){OPS.insShape('textbox')},newCanvas(){simToast('لوحة رسم: للعرض فقط')},
  insTextbox(a){if(!needDoc())return;snap();const body=(inText()&&bodyOf(S.range.startContainer.nodeType===1?S.range.startContainer:S.range.startContainer.parentElement))||firstBody();
    const tmp=document.createElement('div');tmp.innerHTML=shapeHTML('textbox',240,110,{text:a==='quote'?'<p style="font-style:italic;font-size:14pt;color:#4472c4">[«احصل على انتباه القارئ باقتباس رائع من المستند»]</p>':'<p>[احصل على انتباه القارئ باقتباس رائع من المستند أو استخدم هذه المساحة للتركيز على نقطة رئيسية.]</p>',x:Math.max(0,body.clientWidth/2-120),y:60});
    const o=tmp.firstChild;placeFloat(o,body,o.dataset.x,o.dataset.y);selectObj(o);showCtxTab('sformat');setTimeout(()=>{const t=o.querySelector('.stxt');selectNode(t)},20);logAct('textbox')},
  insWordArt(i){if(!needDoc())return;if(!inText())placeCaretIn(firstBody(),true);restoreSel();snap();const s=WA_STYLES[+i||0];const tmp=document.createElement('div');
    tmp.innerHTML=shapeHTML('wordart',300,70,{text:'النص هنا',tfill:s.fill,tout:s.out,tfx:s.fx,wrap:'inline'});const o=tmp.firstChild;const p=document.createElement('p');p.appendChild(o);insertBlock(p);applyObj(o);selectObj(o);showCtxTab('sformat');
    setTimeout(()=>selectNode(o.querySelector('.stxt')),20);logAct('wordart')},
  /* picture format */
  removeBg(){const o=picOnly();if(!o)return;snap();const i=SAMPLE_IMGS.indexOf(o.dataset.src);if(i>=0){o.dataset.nobg=SAMPLE_NOBG[i]}else o.dataset.ps='oval';applyObj(o);simToast('تمت إزالة الخلفية ✓');logAct('removeBg')},
  corrections(a){const o=picOnly();if(!o)return;snap();o.dataset.corr=a;applyObj(o);logAct('corrections')},
  picColor(f){const o=picOnly();if(!o)return;snap();o.dataset.pcol=f;applyObj(o);logAct('picColor')},
  artistic(f){const o=picOnly();if(!o)return;snap();o.dataset.art=f;applyObj(o);logAct('artistic')},
  transparency(v){const o=picOnly();if(!o)return;snap();o.dataset.transp=v;applyObj(o)},
  compress(){simToast('تم ضغط الصور')},changePic(){OPS.picOnline()},
  resetPic(){const o=picOnly();if(!o)return;snap();['corr','pcol','art','transp','ps','fx','border','nobg','flipH','flipV'].forEach(k=>delete o.dataset[k]);o.dataset.rot=0;o.dataset.iw=o.dataset.w;o.dataset.ih=o.dataset.h;o.dataset.ix=0;o.dataset.iy=0;applyObj(o)},
  pstyle(id){const o=picOnly();if(!o)return;snap();o.dataset.ps=id;applyObj(o);logAct('pstyle:'+id)},
  picBorder(c){const o=picOnly();if(!o)return;if(c==='more'){colorDlg(v=>OPS.picBorder(v));return}snap();o.dataset.border=c;applyObj(o);logAct('picBorder')},
  picEffects(f){const o=picOnly();if(!o)return;snap();o.dataset.fx=f;applyObj(o);logAct('picEffects:'+f)},
  picLayout(){simToast('تخطيط الصورة: للعرض فقط')},
  crop(){const o=picOnly();if(!o)return;o.classList.toggle('cropping');if(o.classList.contains('cropping')){snap();simToast('اسحب المقابض السوداء لاقتصاص الصورة، ثم انقر خارجها')}logAct('crop:'+o.classList.contains('cropping'))},
  /* shape format */
  sstyle(i){const o=shpOnly();if(!o)return;snap();const s=SSTYLES[i];o.dataset.fill=s.fill;o.dataset.line=s.line;o.dataset.tcol=s.text;applyObj(o);logAct('sstyle')},
  shapeFill(c){const o=shpOnly();if(!o)return;if(c==='more'){colorDlg(v=>OPS.shapeFill(v));return}snap();o.dataset.fill=c;applyObj(o);logAct('shapeFill:'+c)},
  shapeOutline(c){const o=shpOnly();if(!o)return;if(c==='more'){colorDlg(v=>OPS.shapeOutline(v));return}snap();o.dataset.line=c;applyObj(o);logAct('shapeOutline:'+c)},
  outlineW(w){const o=shpOnly();if(!o)return;snap();o.dataset.lw=w;if(o.dataset.line==='none')o.dataset.line='#000000';applyObj(o);logAct('outlineW')},
  outlineD(d){const o=shpOnly();if(!o)return;snap();o.dataset.dash=d;applyObj(o)},
  shapeEffects(f){const o=shpOnly();if(!o)return;snap();o.dataset.fx=f;applyObj(o);logAct('shapeEffects:'+f)},
  textFill(c){const o=shpOnly();if(!o)return;if(c==='more'){colorDlg(v=>OPS.textFill(v));return}snap();o.dataset.tfill=c;applyObj(o);logAct('textFill:'+c)},
  textOutline(c){const o=shpOnly();if(!o)return;snap();o.dataset.tout=c;applyObj(o);logAct('textOutline')},
  textEffects(f){const o=shpOnly();if(!o)return;snap();o.dataset.tfx=f;applyObj(o);logAct('textEffects:'+f)},
  wastyle(i){const o=shpOnly();if(!o)return;snap();const s=WA_STYLES[i];o.dataset.tfill=s.fill;o.dataset.tout=s.out;o.dataset.tfx=s.fx;applyObj(o)},
  editShape(){simToast('تحرير الشكل: للعرض فقط')},alignText(){const o=shpOnly();if(!o)return;const t=o.querySelector('.stxt');t.style.alignItems=t.style.alignItems==='flex-start'?'center':'flex-start'},createLink(){simToast('إنشاء ارتباط: للعرض فقط')},
  addShapeText(){const o=shpOnly();if(!o)return;const t=o.querySelector('.stxt');t.contentEditable='true';placeCaretIn(t,false);logAct('addShapeText')},
  /* arrange (shared) */
  wrap(a){const o=objOnly();if(!o)return;snap();const d=o.dataset;const was=d.wrap;
    if(['behind','front'].includes(a)&&!['behind','front'].includes(was)){const body=bodyOf(o);const br=body.getBoundingClientRect(),or=o.getBoundingClientRect(),z=(S.zoom/100*(window.SIMSCALE||1));d.x=Math.round((or.left-br.left)/z);d.y=Math.round((or.top-br.top)/z);if(o.parentElement!==body){body.appendChild(o)}}
    if(!['behind','front'].includes(a)&&['behind','front'].includes(was)){const body=bodyOf(o);const blocks=[...body.children].filter(b=>b!==o&&!b.classList.contains('obj'));const y=+d.y||0;let tgt=blocks.find(b=>b.offsetTop+b.offsetHeight>y)||blocks.at(-1);if(a==='inline'){const p=document.createElement('p');p.appendChild(o);tgt?tgt.before(p):body.appendChild(p)}else{tgt?tgt.prepend(o):body.prepend(o)}}
    d.wrap=a;if(a!=='inline')delete d.align;applyObj(o);logAct('wrap:'+a)},
  wrapMore(){simToast('خيارات تخطيط إضافية: للعرض فقط')},
  position(p){const o=objOnly();if(!o)return;snap();const d=o.dataset;const body=bodyOf(o);const [v,h]=[p[0],p[1]];
    d.wrap='square';d.side=h==='l'?'left':'right';if(h==='c'){d.wrap='topbottom';d.side='center'}
    const blocks=[...body.children].filter(b=>b!==o&&!b.contains(o));const tgt=v==='t'?blocks[0]:v==='m'?blocks[Math.floor(blocks.length/2)]:blocks.at(-1);if(tgt){if(o.parentElement.tagName==='P'&&!o.parentElement.textContent.trim()&&o.parentElement.children.length===1){const pp=o.parentElement;tgt.prepend(o);pp.remove()}else tgt.prepend(o)}
    applyObj(o);logAct('position:'+p)},
  forward(){const o=objOnly();if(!o)return;snap();if(o.dataset.wrap==='behind'){o.dataset.wrap='front'}else o.dataset.z=(+o.dataset.z||0)+1;applyObj(o);logAct('forward')},
  backward(){const o=objOnly();if(!o)return;snap();if(o.dataset.wrap==='front'&&!(+o.dataset.z>0)){o.dataset.wrap='behind'}else o.dataset.z=(+o.dataset.z||0)-1;applyObj(o);logAct('backward')},
  alignObj(a){const o=objOnly();if(!o)return;snap();const d=o.dataset;const body=bodyOf(o);
    if(d.wrap==='inline'){if(['right','center','left'].includes(a))d.align=a}else if(['square','tight','through','topbottom'].includes(d.wrap)){if(a==='center'){d.wrap='topbottom';d.side='center'}else if(['right','left'].includes(a))d.side=a}
    else{if(a==='right')d.x=body.clientWidth-o.offsetWidth;if(a==='left')d.x=0;if(a==='center')d.x=(body.clientWidth-o.offsetWidth)/2;if(a==='top')d.y=0;if(a==='middle')d.y=Math.max(0,(body.clientHeight-o.offsetHeight)/2);if(a==='bottom')d.y=Math.max(0,body.clientHeight-o.offsetHeight)}
    applyObj(o);logAct('alignObj:'+a)},
  groupObj(){simToast('تجميع: حدّد عدة كائنات أولًا')},
  rotate(a){const o=objOnly();if(!o)return;snap();const d=o.dataset;if(a==='reset'){d.rot=0;delete d.flipH;delete d.flipV}else if(a==='flipH')d.flipH=d.flipH?'':'1';else if(a==='flipV')d.flipV=d.flipV?'':'1';else d.rot=((+d.rot||0)+(+a))%360;applyObj(o);logAct('rotate:'+a)},
  delObj(){delSelObj()},
  objH(v){const o=objOnly();if(!o)return;snap();const d=o.dataset;const nh=+v*CM;if(o.classList.contains('pic')){scaleObj(o,nh/+d.h)}else{d.h=nh;applyObj(o)}logAct('objH')},
  objW(v){const o=objOnly();if(!o)return;snap();const d=o.dataset;const nw=+v*CM;if(o.classList.contains('pic')){scaleObj(o,nw/+d.w)}else{d.w=nw;d.fixedW=1;applyObj(o)}logAct('objW')},
});
function objOnly(){if(!S.obj){simToast('انقر على الصورة أو الشكل أولًا');return null}return S.obj}
function picOnly(){if(!S.obj||!S.obj.classList.contains('pic')){simToast('انقر على الصورة أولًا');return null}return S.obj}
function shpOnly(){if(!S.obj||!S.obj.classList.contains('shp')){simToast('انقر على الشكل أولًا');return null}return S.obj}
function scaleObj(o,f){const d=o.dataset;['w','h','iw','ih','ix','iy'].forEach(k=>{if(d[k]!=null)d[k]=Math.round(+d[k]*f)});applyObj(o)}
/* mouse interactions */
let drag=null;
document.addEventListener('mousedown',e=>{
  if(!e.target.closest||!e.target.closest('#doc'))return;
  if(S.drawKind&&e.target.closest('.page')){e.preventDefault();const page=e.target.closest('.page');const body=page.querySelector('.pg-body');const br=body.getBoundingClientRect(),z=(S.zoom/100*(window.SIMSCALE||1));
    const box=document.createElement('div');box.className='drawbox';body.appendChild(box);drag={mode:'draw',body,box,x0:(e.clientX-br.left)/z,y0:(e.clientY-br.top)/z,br,z};return}
  const o=e.target.closest('.obj');
  if(!o){if(S.obj){const cropEnd=S.obj.classList.contains('cropping');clearObjSel();if(cropEnd)logAct('cropDone')}return}
  if(e.button===2){selectObj(o);return}
  const stxt=e.target.closest('.stxt');if(stxt&&stxt.isContentEditable&&o.classList.contains('sel')){return}
  if(stxt&&stxt.isContentEditable&&!o.classList.contains('sel')){selectObj(o);if(o.classList.contains('wordart')||o.classList.contains('textbox'))return}
  e.preventDefault();selectObj(o);const d=o.dataset,z=(S.zoom/100*(window.SIMSCALE||1));
  const h=e.target.closest('.h');
  if(h&&!h.classList.contains('anchor')){const cls=[...h.classList].find(c=>c!=='h');snap();drag={mode:h.classList.contains('rot')?'rot':o.classList.contains('cropping')?'crop':'resize',o,h:cls,x0:e.clientX,y0:e.clientY,d0:{...d},z,c:o.getBoundingClientRect()};return}
  snap();drag={mode:'move',o,x0:e.clientX,y0:e.clientY,d0:{...d},z,moved:false};
});
document.addEventListener('mousemove',e=>{
  if(!drag)return;const z=drag.z;
  if(drag.mode==='draw'){const br=drag.br;let x=(e.clientX-br.left)/z,y=(e.clientY-br.top)/z;let w=Math.abs(x-drag.x0),h=Math.abs(y-drag.y0);if(e.shiftKey){w=h=Math.max(w,h)}const L=x<drag.x0?drag.x0-w:drag.x0,T=y<drag.y0?drag.y0-h:drag.y0;Object.assign(drag.box.style,{left:L+'px',top:T+'px',width:w+'px',height:h+'px'});drag.r={L,T,w,h,shift:e.shiftKey};return}
  const o=drag.o,d=o.dataset,d0=drag.d0;const dx=(e.clientX-drag.x0)/z,dy=(e.clientY-drag.y0)/z;
  if(drag.mode==='move'){if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;if(['behind','front'].includes(d.wrap)){d.x=Math.round(+d0.x+dx);d.y=Math.round(+d0.y+dy);applyObj(o)}return}
  if(drag.mode==='rot'){const r=o.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;let a=Math.atan2(e.clientY-cy,e.clientX-cx)*180/Math.PI+90;if(e.shiftKey)a=Math.round(a/15)*15;d.rot=Math.round(a);applyObj(o);return}
  const hd=drag.h;const isPic=o.classList.contains('pic');
  if(drag.mode==='crop'){let w=+d0.w,h=+d0.h,ix=+d0.ix,iy=+d0.iy;
    if(hd.includes('r')||hd==='r'){w=Math.max(20,+d0.w+dx);w=Math.min(w,+d0.iw+ix)}
    if(hd==='l'||hd==='tl'||hd==='bl'){const c=Math.min(Math.max(dx,-(-ix)),(+d0.w)-20);w=+d0.w-c;ix=+d0.ix-c;if(['behind','front'].includes(d.wrap))d.x=+d0.x+c}
    if(hd==='b'||hd==='bl'||hd==='br'){h=Math.max(20,Math.min(+d0.h+dy,+d0.ih+iy))}
    if(hd==='t'||hd==='tl'||hd==='tr'){const c=Math.min(Math.max(dy,iy),(+d0.h)-20);h=+d0.h-c;iy=+d0.iy-c;if(['behind','front'].includes(d.wrap))d.y=+d0.y+c}
    d.w=Math.round(w);d.h=Math.round(h);d.ix=Math.round(ix);d.iy=Math.round(iy);applyObj(o);return}
  let w=+d0.w,h=+d0.h;const sx=hd.includes('l')&&hd!=='tl'&&hd!=='bl'?0:0;
  const right=hd==='r'||hd==='tr'||hd==='br', left=hd==='l'||hd==='tl'||hd==='bl', top=hd==='t'||hd==='tl'||hd==='tr', bottom=hd==='b'||hd==='bl'||hd==='br';
  if(right)w=+d0.w+dx;if(left)w=+d0.w-dx;if(bottom)h=+d0.h+dy;if(top)h=+d0.h-dy;
  const corner=hd.length===2;
  if(corner&&(isPic||e.shiftKey)){const f=Math.max(w/(+d0.w),h/(+d0.h));w=+d0.w*f;h=+d0.h*f}
  w=Math.max(16,Math.min(1200,w));h=Math.max(12,Math.min(1600,h));
  const fx=w/(+d0.w),fy=h/(+d0.h);d.w=Math.round(w);d.h=Math.round(h);if(isPic){d.iw=Math.round(+d0.iw*fx);d.ih=Math.round(+d0.ih*fy);d.ix=Math.round(+d0.ix*fx);d.iy=Math.round(+d0.iy*fy);if(Math.abs(fx-fy)>.03)d.distorted='1';else delete d.distorted}else d.fixedW=1;
  if(['behind','front'].includes(d.wrap)){if(left)d.x=Math.round(+d0.x+(+d0.w-w));if(top)d.y=Math.round(+d0.y+(+d0.h-h))}
  applyObj(o);
});
document.addEventListener('mouseup',e=>{
  if(!drag)return;const g=drag;drag=null;
  if(g.mode==='draw'){g.box.remove();doc.classList.remove('drawing');const k=S.drawKind;S.drawKind=null;let r=g.r;if(!r||r.w<8||r.h<8){r={L:g.x0,T:g.y0,w:k==='textbox'?200:120,h:k==='textbox'?80:120}}
    if(k==='line'||k==='arrowLine')r.h=Math.max(r.h,14);snap();const tmp=document.createElement('div');tmp.innerHTML=shapeHTML(k,Math.round(r.w),Math.round(r.h),{x:Math.round(r.L),y:Math.round(r.T)});const o=tmp.firstChild;placeFloat(o,g.body,Math.round(r.L),Math.round(r.T));if(r.shift)o.dataset.shift='1';
    selectObj(o);showCtxTab('sformat');if(k==='textbox')setTimeout(()=>placeCaretIn(o.querySelector('.stxt')),20);logAct('shape:'+k+(r.shift?':shift':'')+(Math.abs(r.w-r.h)<4?':square':''));SIM.emit('change');return}
  const o=g.o,d=o.dataset;
  if(g.mode==='move'&&g.moved){
    if(d.wrap==='inline'){const pos=document.caretRangeFromPoint?document.caretRangeFromPoint(e.clientX,e.clientY):null;if(pos&&bodyOf(pos.startContainer.nodeType===1?pos.startContainer:pos.startContainer.parentElement)&&!o.contains(pos.startContainer)){pos.insertNode(o);logAct('objMove:inline')}else logAct('objMoveFail:inline');simToast('الصورة «مع النص» تتحرّك كحرف في السطر فقط')}
    else if(['square','tight','through','topbottom'].includes(d.wrap)){const body=bodyOf(o);const br=body.getBoundingClientRect();d.side=e.clientX<br.left+br.width/2?'left':'right';const blocks=[...body.children].filter(b=>b!==o&&!b.contains(o)&&!b.classList.contains('obj'));const t=blocks.find(b=>b.getBoundingClientRect().bottom>e.clientY)||blocks.at(-1);if(t&&t!==o.parentElement){const old=o.parentElement;t.prepend(o);if(old&&old.tagName==='P'&&!old.textContent.trim()&&!old.querySelector('.obj'))old.remove()}applyObj(o);logAct('objMove:'+d.wrap)}
    else logAct('objMove:'+d.wrap);
  }else if(g.mode==='move'){undoStack.pop()}
  if(g.mode==='resize')logAct('resize'+(d.distorted?':distorted':':prop'));if(g.mode==='crop')logAct('cropDrag');if(g.mode==='rot')logAct('rotate:drag');
  syncRibbon();SIM.emit('change');
});
function cancelDraw(){if(S.drawKind){S.drawKind=null;doc.classList.remove('drawing')}}
function objContext(o,x,y){selectObj(o);const isP=o.classList.contains('pic');
  showCtx(x,y,[['cut',null,'قص','cut'],['copy',null,'نسخ','copy'],['delObj',null,'حذف','delete'],'-',...(isP?[['changePic',null,'تغيير الصورة','changepic']]:[['addShapeText',null,'إضافة نص','addtext']]),['wrap','square','التفاف النص: مربع','wrap'],['wrap','inline','التفاف النص: مع النص','wrap'],['wrap','front','التفاف النص: أمام النص','wrap'],'-',['forward',null,'إحضار للأمام','forward'],['backward',null,'إرسال للخلف','backward'],['newComment',null,'تعليق جديد','newcomment']])}
document.addEventListener('dblclick',e=>{const o=e.target.closest&&e.target.closest('#doc .obj.shp');if(o&&!o.classList.contains('textbox')&&!o.classList.contains('wordart')){const t=o.querySelector('.stxt');if(!t.isContentEditable&&t.textContent.trim()){t.contentEditable='true';placeCaretIn(t,false)}}});
/* ---------- equations ---------- */
const Z='​';
function curEq(){const r=S.range;if(!r)return null;const n=r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement;return n.closest&&n.closest('.eq')}
function newEq(){if(!needDoc())return null;if(!inText())placeCaretIn(firstBody(),false);restoreSel();snap();const r=S.range;let n=r.startContainer;n=n.nodeType===1?n:n.parentElement;const b=n.closest('p');
  const e=document.createElement('span');e.className='eq';e.innerHTML=Z;if(b&&!b.textContent.trim()){e.classList.add('disp');b.innerHTML='';b.appendChild(e)}else insertInline(e);
  const t=e.firstChild;const rr=document.createRange();rr.setStart(t,1);rr.collapse(true);e.closest('[contenteditable="true"]').focus();const s=getSelection();s.removeAllRanges();s.addRange(rr);S.range=rr.cloneRange();updateCtx();showCtxTab('eqdesign');return e}
function eqInsert(html,focusSlot=true,grab=false){let e=curEq();if(!e)e=newEq();if(!e)return;restoreSel();const r=S.range;let run='';if(grab&&r.collapsed&&r.startContainer.nodeType===3){const tn=r.startContainer;const before=tn.nodeValue.slice(0,r.startOffset).replace(/\u200b/g,'');const m=before.match(/[A-Za-z0-9\u0600-\u06FF\u0660-\u0669]+$/);if(m){run=m[0];const full=tn.nodeValue.slice(0,r.startOffset);let cut=0,k=full.length;while(cut<run.length&&k>0){k--;if(full[k]!=='\u200b')cut++}tn.nodeValue=full.slice(0,k)+tn.nodeValue.slice(r.startOffset);r.setStart(tn,k);r.collapse(true)}}const tmp=document.createElement('span');tmp.innerHTML=html;const frag=document.createDocumentFragment();const nodes=[...tmp.childNodes];nodes.forEach(n=>frag.appendChild(n));r.deleteContents();r.insertNode(frag);
  const slots=nodes.flatMap(n=>n.nodeType===1?(n.classList.contains('slot')?[n]:[...n.querySelectorAll('.slot')]):[]);let slot=focusSlot&&slots[0];if(run&&slots.length>1){slots[0].textContent=run;slot=slots[1]}
  const after=document.createTextNode(Z);nodes.at(-1).after(after);
  const rr=document.createRange();if(slot){rr.setStart(slot.firstChild||slot,slot.firstChild?slot.firstChild.length:0)}else rr.setStart(after,1);rr.collapse(true);const s=getSelection();s.removeAllRanges();s.addRange(rr);S.range=rr.cloneRange();snap();SIM.emit('change')}
const SL=`<span class="slot">${Z}</span>`;
Object.assign(OPS,{
  equation(){OPS.insEq()},
  insEq(){newEq();logAct('eq:new')},
  insEqReady(i){const e=newEq();if(!e)return;e.innerHTML=EQ_READY[+i].html;e.classList.add('disp');logAct('eq:ready')},
  inkEq(){simToast('معادلة حبر: للعرض فقط')},inkMath(){simToast('الحبر إلى رياضيات: للعرض فقط')},
  eqSym(s){eqInsert(s,false);logAct('eq:sym:'+s)},
  eqFrac(a){eqInsert(a==='lin'||a==='skew'?`${SL}/${SL}`:`<span class="fr">${SL}${SL}</span>`,true,true);logAct('eq:frac:'+(a||'stack'))},
  eqScript(a){eqInsert(a==='sub'?`${SL}<sub class="slot">${Z}</sub>`:`${SL}<sup class="slot">${Z}</sup>`,true,true);logAct('eq:'+(a||'sup'))},
  eqRad(a){eqInsert(`<span class="rad">${a==='n'?`<sup class="slot">${Z}</sup>`:''}<span class="rs">√</span><span class="rb slot">${Z}</span></span>`);logAct('eq:rad')},
  eqInt(){eqInsert(`∫${SL}`)},eqLarge(){eqInsert(`∑${SL}`)},eqBracket(){eqInsert(`(${SL})`)},eqMatrix(){eqInsert(`[${SL} ${SL}]`)},
  eqPro(){simToast('احترافي')},eqLinear(){simToast('خطي')},eqNormal(){simToast('نص عادي')},
});

/* Tab moves between equation slots */
document.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const eq=curEq();if(!eq)return;e.preventDefault();e.stopImmediatePropagation();const slots=[...eq.querySelectorAll('.slot')];const r=S.range;let n=r.startContainer;n=n.nodeType===1?n:n.parentElement;const cur=n.closest('.slot');let i=slots.indexOf(cur);const nx=slots[i+1];const rr=document.createRange();if(nx){rr.selectNodeContents(nx);rr.collapse(false)}else{let t=eq.lastChild;if(!t||t.nodeType!==3){t=document.createTextNode(Z);eq.appendChild(t)}rr.setStart(t,t.length);rr.collapse(true)}const s=getSelection();s.removeAllRanges();s.addRange(rr);S.range=rr.cloneRange()},true);
/* زر «حذف» يظهر فوق الصورة/الشكل المحدّد (مفيد خاصة على الجوال حيث لا يوجد زر Delete) */
function delSelObj(){if(!S.obj)return;snap();const o=S.obj,p=o.parentElement;o.remove();if(p&&p.tagName==='P'&&!p.textContent.trim()&&!p.querySelector('.obj,img'))p.innerHTML='<br>';clearObjSel();updateCtx();logAct('objDelete');SIM.emit('change');placeObjBar()}
function placeObjBar(){let b=document.getElementById('objbar');const o=S.obj;
  if(!o||!doc.contains(o)||S.drawKind||o.classList.contains('cropping')){if(b)b.style.display='none';return}
  if(!b){b=document.createElement('div');b.id='objbar';b.innerHTML='<button type="button" data-hid="obj-delete">🗑 حذف</button>';(document.getElementById('ovl')||document.body).appendChild(b);
    const btn=b.querySelector('button');const go=e=>{e.preventDefault();e.stopPropagation();delSelObj()};btn.addEventListener('mousedown',go);btn.addEventListener('touchstart',go,{passive:false})}
  const R=typeof realRect==='function'?realRect(o):o.getBoundingClientRect();if(!R.width&&!R.height){b.style.display='none';return}
  const O=typeof OX==='function'?OX():{x:scrollX,y:scrollY};b.style.display='block';
  const bw=b.offsetWidth||70,bh=b.offsetHeight||30;let y=R.top-bh-8;if(y<4)y=R.bottom+8;let x=R.left+R.width/2-bw/2;x=Math.max(4,Math.min(LW()-bw-4,x));
  b.style.left=(x+O.x)+'px';b.style.top=(y+O.y)+'px'}
setInterval(placeObjBar,250);
