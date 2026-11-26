/* تنزيل المستند كملف Word حقيقي (.docx) — يُبنى في المتصفح بدون مكتبات */
(function(){
const X=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const AR=/[֐-ࣿיִ-ﻼ]/;
const PX2TW=15, PX2EMU=9525;
const hex=c=>{if(!c)return null;const m=c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(!m)return null;if(m[4]!=null&&+m[4]<.05)return null;return [m[1],m[2],m[3]].map(v=>(+v).toString(16).padStart(2,'0')).join('').toUpperCase()};
const cs=el=>getComputedStyle(el);

/* ---------- ZIP (بدون ضغط) ---------- */
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=t[(c^b[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}})();
function zip(files){const enc=new TextEncoder();const parts=[],cen=[];let off=0;
  for(const f of files){const name=enc.encode(f.name),data=typeof f.data==='string'?enc.encode(f.data):f.data,crc=CRC(data);
    const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint32(14,crc,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,name.length,true);
    parts.push(new Uint8Array(h.buffer),name,data);
    const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,name.length,true);c.setUint32(42,off,true);
    cen.push(new Uint8Array(c.buffer),name);off+=30+name.length+data.length}
  const cl=cen.reduce((a,b)=>a+b.length,0);const e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cl,true);e.setUint32(16,off,true);
  return new Blob([...parts,...cen,new Uint8Array(e.buffer)],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})}

/* ---------- الصور: كل كائن يُرسم إلى PNG ---------- */
const media=[];let rid=100,did=1;
function loadImg(src){return new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src})}
async function toPNG(o){const d=o.dataset,w=Math.max(4,Math.round(+d.w||o.offsetWidth)),h=Math.max(4,Math.round(+d.h||o.offsetHeight));const K=2;
  const cv=document.createElement('canvas');cv.width=w*K;cv.height=h*K;const g=cv.getContext('2d');g.scale(K,K);
  if(o.classList.contains('pic')){const im=await loadImg(d.src||o.querySelector('img')?.src);if(im){const iw=+d.iw||w,ih=+d.ih||h,ix=+d.ix||0,iy=+d.iy||0;g.save();if(d.flipH){g.translate(w,0);g.scale(-1,1)}if(d.flipV){g.translate(0,h);g.scale(1,-1)}g.drawImage(im,-ix,-iy,iw,ih);g.restore()}
    const b=cs(o.querySelector('.crop')||o);const bc=hex(b.borderTopColor),bw=parseFloat(b.borderTopWidth)||0;if(bc&&bw){g.strokeStyle='#'+bc;g.lineWidth=bw*2;g.strokeRect(0,0,w,h)}}
  else{const sv=o.querySelector('svg');if(sv){const c=sv.cloneNode(true);c.setAttribute('xmlns','http://www.w3.org/2000/svg');c.setAttribute('width',w);c.setAttribute('height',h);
      const im=await loadImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(c)));if(im)g.drawImage(im,0,0,w,h)}
    const t=o.querySelector('.stxt');const txt=t?t.innerText.trim():'';if(txt){const s=cs(t);g.fillStyle=s.color;g.font=`${s.fontWeight} ${s.fontStyle==='italic'?'italic ':''}${parseFloat(s.fontSize)}px ${s.fontFamily}`;g.textAlign='center';g.textBaseline='middle';g.direction=AR.test(txt)?'rtl':'ltr';
      const ls=txt.split('\n'),lh=parseFloat(s.fontSize)*1.25;ls.forEach((l,i)=>g.fillText(l,w/2,h/2+(i-(ls.length-1)/2)*lh,w-6))}}
  const blob=await new Promise(r=>cv.toBlob(r,'image/png'));const data=new Uint8Array(await blob.arrayBuffer());const id='rId'+(rid++);media.push({id,name:`image${media.length+1}.png`,data});return {id,w,h}}

async function drawing(o,anchorY){const m=await toPNG(o);const d=o.dataset,wr=d.wrap||'inline',cx=m.w*PX2EMU,cy=m.h*PX2EMU,n=did++;const rot=(+d.rot||0)*60000;
  const pic=`<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${n}" name="صورة ${n}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${m.id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm${rot?` rot="${rot}"`:''}><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic>`;
  if(wr==='inline')return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${n}" name="صورة ${n}"/><wp:cNvGraphicFramePr/>${pic}</wp:inline></w:drawing></w:r>`;
  const body=o.closest('.pg-body');const br=body.getBoundingClientRect(),or=o.getBoundingClientRect();const z=parseFloat(o.style.zoom||1)||1;
  const x=Math.round((or.left-br.left)/((document.getElementById('doc').style.zoom||1)*1)),y=Math.round(anchorY!=null?anchorY:(or.top-br.top));
  const wrapX={square:'<wp:wrapSquare wrapText="bothSides"/>',tight:'<wp:wrapTight wrapText="bothSides"><wp:wrapPolygon edited="0"><wp:start x="0" y="0"/><wp:lineTo x="0" y="21600"/><wp:lineTo x="21600" y="21600"/><wp:lineTo x="21600" y="0"/><wp:lineTo x="0" y="0"/></wp:wrapPolygon></wp:wrapTight>',through:'<wp:wrapThrough wrapText="bothSides"><wp:wrapPolygon edited="0"><wp:start x="0" y="0"/><wp:lineTo x="0" y="21600"/><wp:lineTo x="21600" y="21600"/><wp:lineTo x="21600" y="0"/><wp:lineTo x="0" y="0"/></wp:wrapPolygon></wp:wrapThrough>',topbottom:'<wp:wrapTopAndBottom/>'}[wr]||'<wp:wrapNone/>';
  const side=d.side;const posH=(['square','tight','through','topbottom'].includes(wr)&&side)?`<wp:positionH relativeFrom="margin"><wp:align>${side==='center'?'center':side==='left'?'left':'right'}</wp:align></wp:positionH>`:`<wp:positionH relativeFrom="margin"><wp:posOffset>${Math.max(0,x)*PX2EMU}</wp:posOffset></wp:positionH>`;
  const posV=(['square','tight','through','topbottom'].includes(wr)&&side)?`<wp:positionV relativeFrom="paragraph"><wp:posOffset>0</wp:posOffset></wp:positionV>`:`<wp:positionV relativeFrom="margin"><wp:posOffset>${Math.max(0,y)*PX2EMU}</wp:posOffset></wp:positionV>`;
  const zi=+d.z||0;
  return `<w:r><w:drawing><wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0" relativeHeight="${251659264+zi*1024+n}" behindDoc="${wr==='behind'?1:0}" locked="0" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/>${posH}${posV}<wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>${wrapX}<wp:docPr id="${n}" name="صورة ${n}"/><wp:cNvGraphicFramePr/>${pic}</wp:anchor></w:drawing></w:r>`}

/* ---------- النص ---------- */
const decoOf=el=>{let u=false,s=false;for(let e=el;e&&!e.classList?.contains('pg-body')&&e.tagName!=='TD';e=e.parentElement){const t=cs(e).textDecorationLine||'';if(t.includes('underline'))u=true;if(t.includes('line-through'))s=true}return {u,s}};
function bgOf(el,stop){for(let e=el;e&&e!==stop;e=e.parentElement){if(e.tagName==='TD'||/^(P|DIV|LI|H\d)$/.test(e.tagName))break;const b=hex(cs(e).backgroundColor);if(b)return b}return null}
function rPr(el,stop,txt){const s=cs(el),o=[];const ff=s.fontFamily.split(',')[0].replace(/["']/g,'').trim();
  if(ff)o.push(`<w:rFonts w:ascii="${X(ff)}" w:hAnsi="${X(ff)}" w:cs="${X(ff)}"/>`);const b=+s.fontWeight>=600;if(b)o.push('<w:b/><w:bCs/>');if(s.fontStyle==='italic')o.push('<w:i/><w:iCs/>');
  const dd=decoOf(el);if(dd.s)o.push('<w:strike/>');const c=hex(s.color);if(c&&c!=='000000')o.push(`<w:color w:val="${c}"/>`);
  const sz=Math.round(parseFloat(s.fontSize)*.75*2);if(sz)o.push(`<w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/>`);
  if(dd.u)o.push('<w:u w:val="single"/>');const bg=bgOf(el,stop);if(bg)o.push(`<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>`);
  const va=s.verticalAlign;if(va==='super')o.push('<w:vertAlign w:val="superscript"/>');else if(va==='sub')o.push('<w:vertAlign w:val="subscript"/>');
  if(AR.test(txt))o.push('<w:rtl/>');return o.length?`<w:rPr>${o.join('')}</w:rPr>`:''}
async function runs(node,stop,floats){let out='';
  for(const n of node.childNodes){
    if(n.nodeType===3){const t=n.data.replace(/​/g,'');if(!t)continue;const p=n.parentElement;
      out+=t.split('\t').map((seg,i)=>(i?`<w:r>${rPr(p,stop,seg)}<w:tab/></w:r>`:'')+(seg?`<w:r>${rPr(p,stop,seg)}<w:t xml:space="preserve">${X(seg)}</w:t></w:r>`:'')).join('');continue}
    if(n.nodeType!==1)continue;const e=n;
    if(e.classList.contains('h')||e.classList.contains('pg-wm')||e.classList.contains('tdiag')||e.classList.contains('spm')&&false)continue;
    if(e.classList.contains('obj')){if((e.dataset.wrap||'inline')==='inline')out+=await drawing(e);else floats.push(e);continue}
    if(e.tagName==='BR'){out+='<w:r><w:br/></w:r>';continue}
    if(e.tagName==='IMG'){continue}
    if(/^(UL|OL|TABLE|P|DIV)$/.test(e.tagName)&&cs(e).display==='block'){out+=await runs(e,stop,floats);continue}
    out+=await runs(e,stop,floats)}
  return out}
function pPr(el,extra='',box=true){const s=cs(el),o=[];const rtl=s.direction==='rtl';const PB=[],SH=[];
  const ta=s.textAlign;let jc=null;if(ta==='center')jc='center';else if(ta==='justify')jc='both';else if(ta==='right'||(ta==='start'&&rtl)||(ta==='end'&&!rtl))jc=rtl?'left':'right';else if(ta==='left'||(ta==='start'&&!rtl)||(ta==='end'&&rtl))jc=rtl?'right':'left';
  /* في الفقرات العربية: left/right في Word يعنيان بداية/نهاية السطر */
  const sb=box?Math.round(parseFloat(s.marginTop)*PX2TW)||0:0,sa=box?Math.round(parseFloat(s.marginBottom)*PX2TW)||0:0;const fs=parseFloat(s.fontSize)||16;const lh=s.lineHeight==='normal'?1.15:parseFloat(s.lineHeight)/fs;
  o.push(`<w:spacing w:before="${sb}" w:after="${sa}" w:line="${Math.round(240*Math.max(1.05,Math.min(3,lh/1.15)))}" w:lineRule="auto"/>`);
  const ir=!box?0:Math.round((parseFloat(s.paddingRight)+parseFloat(s.marginRight))*PX2TW)||0,il=!box?0:Math.round((parseFloat(s.paddingLeft)+parseFloat(s.marginLeft))*PX2TW)||0,ti=Math.round(parseFloat(s.textIndent)*PX2TW)||0;
  if(ir||il||ti)o.push(`<w:ind w:left="${il}" w:right="${ir}"${ti>0?` w:firstLine="${ti}"`:ti<0?` w:hanging="${-ti}"`:''}/>`);
  if(jc)o.push(`<w:jc w:val="${jc}"/>`);const bg=box&&hex(s.backgroundColor);if(bg)SH.push(`<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>`);
  const bd=!box?'':['Top','Left','Bottom','Right'].map(k=>{const st=s['border'+k+'Style'],w=parseFloat(s['border'+k+'Width']),c=hex(s['border'+k+'Color']);if(st==='none'||!w||!c)return '';return `<w:${k.toLowerCase()} w:val="${st==='double'?'double':st==='dashed'?'dashed':st==='dotted'?'dotted':'single'}" w:sz="${Math.max(2,Math.round(w*6))}" w:space="1" w:color="${c}"/>`}).join('');if(bd)PB.push(`<w:pBdr>${bd}</w:pBdr>`);
  return `<w:pPr>${extra}${PB.join('')}${SH.join('')}${rtl?'<w:bidi/>':''}${o.join('')}</w:pPr>`}

/* ---------- القوائم ---------- */
const nums=[];
function numFor(list){if(list._num)return list._num;const t=cs(list).listStyleType;const ol=list.tagName==='OL';const n=nums.length+1;
  let fmt='decimal',txt='%1.';const lt=t.replace(/"/g,'');
  if(!ol){fmt='bullet';txt=lt==='circle'?'o':lt==='square'?'▪':/check|✓|✔/.test(lt)?'✓':lt.length===1||lt.length===2&&lt.trim()?lt.trim():'•'}
  else if(/lower-alpha|lower-latin/.test(lt))fmt='lowerLetter';else if(/upper-alpha|upper-latin/.test(lt))fmt='upperLetter';else if(/lower-roman/.test(lt))fmt='lowerRoman';else if(/upper-roman/.test(lt))fmt='upperRoman';else if(/arabic-indic/.test(lt))fmt='arabicAlpha'.replace('arabicAlpha','decimal');else if(/abjad/.test(lt)){fmt='arabicAbjad'}
  nums.push({n,fmt,txt,start:+list.getAttribute('start')||1});return list._num=n}

/* ---------- الكتل ---------- */
async function para(el,extra,floats,stop,box=true){const r=await runs(el,stop||el,floats);return `<w:p>${pPr(el,extra,box)}${r}</w:p>`}
async function block(el,out,floats,lvl=0){
  if(el.nodeType===3){if(el.data.trim())out.push(`<w:p><w:pPr><w:bidi/></w:pPr><w:r><w:t xml:space="preserve">${X(el.data)}</w:t></w:r></w:p>`);return}
  if(el.nodeType!==1)return;
  if(el.classList.contains('obj')){floats.push(el);return}
  if(el.tagName==='TABLE'){out.push(await table(el));out.push('<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>');return}
  if(el.tagName==='UL'||el.tagName==='OL'){const id=numFor(el);for(const li of el.children){if(li.tagName!=='LI'){await block(li,out,floats,lvl);continue}
      const sub=[...li.children].filter(c=>c.tagName==='UL'||c.tagName==='OL');const c=li.cloneNode(true);c.querySelectorAll(':scope > ul, :scope > ol').forEach(x=>x.remove());
      li.parentNode.insertBefore(c,li);c.style.display='block';const p=await para(c,`<w:numPr><w:ilvl w:val="${Math.min(8,lvl)}"/><w:numId w:val="${id}"/></w:numPr>`,floats,c);c.remove();out.push(p);
      for(const s of sub)await block(s,out,floats,lvl+1)}return}
  if(el.tagName==='DIV'&&[...el.children].some(c=>/^(P|DIV|TABLE|UL|OL|H\d)$/.test(c.tagName))){for(const c of el.childNodes)await block(c,out,floats,lvl);return}
  const extra=cs(el).breakBefore==='column'?'':'';out.push(await para(el,extra,floats));if(cs(el).breakBefore==='column')out[out.length-1]=out[out.length-1].replace(/(<\/w:pPr>)/,'$1<w:r><w:br w:type="column"/></w:r>')}

async function table(t){const g=typeof gridMap==='function'?gridMap(t):null;const rows=[...t.rows];let nc=0;
  if(g){g.forEach(v=>{nc=Math.max(nc,v.c2+1)})}else nc=Math.max(...rows.map(r=>[...r.cells].reduce((a,c)=>a+(c.colSpan||1),0)));
  const colW=Array(nc).fill(0);if(g){g.forEach((v,td)=>{if(v.c1===v.c2)colW[v.c1]=Math.max(colW[v.c1],td.getBoundingClientRect().width)})}
  const tw=t.getBoundingClientRect().width;colW.forEach((w,i)=>{if(!w)colW[i]=tw/nc});
  const z=parseFloat(document.getElementById('doc').style.zoom||1)||1;const TW=w=>Math.round(w/z*PX2TW);
  const ts=cs(t);const rtl=ts.direction==='rtl';const center=ts.marginLeft===ts.marginRight&&parseFloat(ts.marginLeft)>2;
  let x=`<w:tbl><w:tblPr>${rtl?'<w:bidiVisual/>':''}<w:tblW w:w="${TW(tw)}" w:type="dxa"/>${center?'<w:jc w:val="center"/>':''}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${colW.map(w=>`<w:gridCol w:w="${TW(w)}"/>`).join('')}</w:tblGrid>`;
  for(let r=0;r<rows.length;r++){const tr=rows[r];const hh=tr.style.height?parseFloat(tr.style.height):0;x+=`<w:tr>${hh?`<w:trPr><w:trHeight w:val="${TW(hh)}" w:hRule="atLeast"/></w:trPr>`:''}`;
    /* خلايا هذا الصف بترتيب الأعمدة، مع خلايا الاستمرار للدمج العمودي */
    const list=[];if(g){g.forEach((v,td)=>{if(v.r1===r)list.push({c:v.c1,td,v,cont:false});else if(v.r1<r&&v.r2>=r)list.push({c:v.c1,td,v,cont:true})})}else [...tr.cells].forEach((td,i)=>list.push({c:i,td,v:{c1:i,c2:i+(td.colSpan||1)-1,r1:r,r2:r},cont:false}));
    list.sort((a,b)=>a.c-b.c);
    for(const it of list){const td=it.td,s=cs(td),span=it.v.c2-it.v.c1+1;const w=colW.slice(it.v.c1,it.v.c2+1).reduce((a,b)=>a+b,0);
      const bd=['top','left','bottom','right'].map(k=>{const K=k[0].toUpperCase()+k.slice(1);const st=s['border'+K+'Style'],bw=parseFloat(s['border'+K+'Width']),c=hex(s['border'+K+'Color']);
        if(st==='none'||st==='hidden'||!bw||!c)return `<w:${k} w:val="nil"/>`;return `<w:${k} w:val="${st==='double'?'double':st==='dashed'?'dashed':st==='dotted'?'dotted':'single'}" w:sz="${Math.max(2,Math.round(bw*6))}" w:space="0" w:color="${c}"/>`}).join('');
      const dg=td.dataset.dg||'';const dgc=(td.dataset.dgc||'#000000').replace('#','');const diag=(dg.includes('d')?`<w:tl2br w:val="single" w:sz="6" w:color="${dgc}"/>`:'')+(dg.includes('u')?`<w:tr2bl w:val="single" w:sz="6" w:color="${dgc}"/>`:'');
      const bg=hex(s.backgroundColor);const va=s.verticalAlign==='middle'?'center':s.verticalAlign==='bottom'?'bottom':'top';const tdn=window.tdirOf?tdirOf(td):0;const tdir=tdn===2?'btLr':tdn===1?'tbRl':'';
      x+=`<w:tc><w:tcPr><w:tcW w:w="${TW(w)}" w:type="dxa"/>${span>1?`<w:gridSpan w:val="${span}"/>`:''}${it.v.r2>it.v.r1?`<w:vMerge${it.cont?'':' w:val="restart"'}/>`:''}<w:tcBorders>${bd}${diag}</w:tcBorders>${bg?`<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>`:''}${tdir?`<w:textDirection w:val="${tdir}"/>`:''}<w:vAlign w:val="${va}"/></w:tcPr>`;
      if(it.cont){x+='<w:p/></w:tc>';continue}
      const inner=[],fl=[];const hasBlock=[...td.children].some(c=>/^(P|DIV|UL|OL|TABLE|H\d)$/.test(c.tagName));
      if(hasBlock){for(const c of td.childNodes)await block(c,inner,fl)}else inner.push(await para(td,'',fl,td,false));
      for(const f of fl)inner.push(`<w:p>${await drawing(f)}</w:p>`);
      x+=(inner.join('')||'<w:p/>')+'</w:tc>'}
    x+='</w:tr>'}
  return x+'</w:tbl>'}

async function hfXML(el,tag){if(!el||!el.textContent.trim()&&!el.querySelector('.obj'))return null;const out=[],fl=[];const c=el.cloneNode(true);c.querySelectorAll('.pnum').forEach(s=>s.setAttribute('data-pn','1'));
  for(const n of el.childNodes)await block(n,out,fl);let s=out.join('');
  /* أرقام الصفحات كحقل PAGE */
  el.querySelectorAll('.pnum').forEach(p=>{const v=X(p.textContent);s=s.replace(`<w:t xml:space="preserve">${v}</w:t>`,`<w:fldSimple w:instr=" PAGE "><w:t>${v}</w:t></w:fldSimple>`.replace(/^/,'')).replace(/<w:r>(<w:rPr>(?:(?!<\/w:rPr>).)*<\/w:rPr>)?<w:fldSimple/g,'<w:r>$1</w:r><w:fldSimple').replace(/<\/w:fldSimple><\/w:r>/g,'</w:fldSimple>')});
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:${tag} ${NS}>${s||'<w:p/>'}</w:${tag}>`}

const NS='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';

async function build(){media.length=0;nums.length=0;rid=100;did=1;const D=document.getElementById('doc');const z0=D.style.zoom;D.style.zoom=1;D.classList.add('exporting');
  try{const pages=[...D.querySelectorAll('.page')];const body=[];
    for(let pi=0;pi<pages.length;pi++){const b=pages[pi].querySelector('.pg-body');const out=[],floats=[];
      for(const n of b.childNodes)await block(n,out,floats);
      if(!out.length)out.push('<w:p/>');
      /* الكائنات العائمة تُثبَّت في الفقرة الأولى بموضعها على الصفحة */
      if(floats.length){let dr='';for(const f of floats)dr+=await drawing(f);out[0]=out[0].replace(/<\/w:p>$/,dr+'</w:p>').replace(/^<w:p\/>$/,'<w:p>'+dr+'</w:p>')}
      if(pi>0)out[0]=out[0].replace(/^<w:p>(<w:pPr>(?:(?!<\/w:pPr>).)*<\/w:pPr>)?/,(m,pp)=>`<w:p>${pp||''}<w:r><w:br w:type="page"/></w:r>`).replace(/^<w:p\/>/,'<w:p><w:r><w:br w:type="page"/></w:r></w:p>').replace(/^<w:tbl>/,'<w:p><w:r><w:br w:type="page"/></w:r></w:p><w:tbl>');
      body.push(...out)}
    const st=cs(D);const px=v=>parseFloat(st.getPropertyValue(v))||0;const pw=px('--pw'),ph=px('--ph');const P=S.page||{};
    const land=P.orient==='landscape';const W=Math.round((land?Math.max(pw,ph):Math.min(pw,ph))*PX2TW),H=Math.round((land?Math.min(pw,ph):Math.max(pw,ph))*PX2TW);
    const hdr=await hfXML(pages[0].querySelector('.pg-hdr'),'hdr'),ftr=await hfXML(pages[0].querySelector('.pg-ftr'),'ftr');
    const cols=+P.cols||1;
    const sect=`<w:sectPr>${hdr?'<w:headerReference w:type="default" r:id="rIdH"/>':''}${ftr?'<w:footerReference w:type="default" r:id="rIdF"/>':''}<w:pgSz w:w="${W||11906}" w:h="${H||16838}"${land?' w:orient="landscape"':''}/><w:pgMar w:top="${Math.round(px('--mt')*PX2TW)}" w:right="${Math.round(px('--mr')*PX2TW)}" w:bottom="${Math.round(px('--mb')*PX2TW)}" w:left="${Math.round(px('--ml')*PX2TW)}" w:header="708" w:footer="708" w:gutter="0"/>${cols>1?`<w:cols w:num="${cols}" w:space="708"${D.classList.contains('colline')?' w:sep="1"':''}/>`:'<w:cols w:space="708"/>'}<w:bidi/></w:sectPr>`;
    const pc=hex(st.getPropertyValue('--pc')||'')||null;
    const docXML=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${NS}>${pc?`<w:background w:color="${pc}"/>`:''}<w:body>${body.join('')}${sect}</w:body></w:document>`;
    const lvls=(n)=>Array.from({length:9},(_,i)=>{const bul=n.fmt==='bullet';const ch=bul?(i%3===0?n.txt:i%3===1?'o':'▪'):'%'+(i+1)+'.';return `<w:lvl w:ilvl="${i}"><w:start w:val="${i?1:n.start}"/><w:numFmt w:val="${n.fmt}"/><w:lvlText w:val="${X(ch)}"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="${720*(i+1)}" w:hanging="360"/></w:pPr>${bul?'<w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/></w:rPr>':''}</w:lvl>`}).join('');
    const numXML=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ${NS}>${nums.map(n=>`<w:abstractNum w:abstractNumId="${n.n}"><w:multiLevelType w:val="hybridMultilevel"/>${lvls(n)}</w:abstractNum>`).join('')}${nums.map(n=>`<w:num w:numId="${n.n}"><w:abstractNumId w:val="${n.n}"/></w:num>`).join('')}</w:numbering>`;
    const df=(st.getPropertyValue('--df')||'Arial').trim().replace(/["']/g,'')||'Arial';
    const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${X(df)}" w:hAnsi="${X(df)}" w:cs="${X(df)}" w:eastAsia="${X(df)}"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:bidi/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>`;
    const rels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdS" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdN" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/><Relationship Id="rIdT" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${hdr?'<Relationship Id="rIdH" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>':''}${ftr?'<Relationship Id="rIdF" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>':''}${media.map(m=>`<Relationship Id="${m.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${m.name}"/>`).join('')}</Relationships>`;
    /* صور الرأس والتذييل تحتاج علاقات في ملفاتها أيضًا */
    const hfRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${media.map(m=>`<Relationship Id="${m.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${m.name}"/>`).join('')}</Relationships>`;
    const ct=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>${hdr?'<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>':''}${ftr?'<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>':''}<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`;
    const root=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`;
    const now=new Date().toISOString().replace(/\.\d+Z$/,'Z');
    const core=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>برنامج وورد — مساحتي الحرة</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`;
    const settings=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings ${NS}>${pc?'<w:displayBackgroundShape/>':''}<w:defaultTabStop w:val="720"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`;
    const files=[{name:'[Content_Types].xml',data:ct},{name:'_rels/.rels',data:root},{name:'docProps/core.xml',data:core},{name:'word/document.xml',data:docXML},{name:'word/styles.xml',data:styles},{name:'word/numbering.xml',data:numXML},{name:'word/settings.xml',data:settings},{name:'word/_rels/document.xml.rels',data:rels}];
    if(hdr){files.push({name:'word/header1.xml',data:hdr},{name:'word/_rels/header1.xml.rels',data:hfRels})}if(ftr){files.push({name:'word/footer1.xml',data:ftr},{name:'word/_rels/footer1.xml.rels',data:hfRels})}
    media.forEach(m=>files.push({name:'word/media/'+m.name,data:m.data}));
    return zip(files)}
  finally{D.style.zoom=z0;D.classList.remove('exporting')}}

function save(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000)}
window.exportDocx=async function(name){try{const sel=document.querySelectorAll('#doc .obj.sel');sel.forEach(o=>o.classList.remove('sel'));
    const b=await build();let n=(name||'').trim()||'مستندي';n=n.replace(/[\\/:*?"<>|]/g,'_');if(!/\.docx$/i.test(n))n+='.docx';save(b,n);try{simToast('تم تنزيل الملف: '+n)}catch(e){}return b}
  catch(e){console.error(e);alert('تعذّر إنشاء الملف: '+e.message)}};
window._buildDocx=build;
})();
