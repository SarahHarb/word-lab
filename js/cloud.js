/* ================= Cloud (Supabase): Google sign-in, allowed students, sections, unlocks, progress ================= */
const CLOUD={on:false,sb:null,user:null,email:null,admin:false,student:null};
window.UNLOCKED=null; // null = everything open (offline mode / admin)
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
const GICON='<svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/></svg>';
async function sbLoad(){await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');CLOUD.sb=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);CLOUD.on=true}
function signInGoogle(){CLOUD.sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname,queryParams:{prompt:'select_account'}}})}
function signOut(){CLOUD.sb.auth.signOut().then(()=>location.reload())}
function gate(kind,extra=''){const g=$('#gate');g.hidden=false;
  const logo='<div class="glogo">W</div><h1>برنامج وورد</h1><p class="gs">دليل التطبيق العملي · إعداد: سارة حرب</p>';
  if(kind==='loading')g.innerHTML=`<div class="gcard">${logo}<p>جارٍ التحميل…</p></div>`;
  if(kind==='login')g.innerHTML=`<div class="gcard">${logo}<p>سجّل الدخول بحساب Google الخاص بك لتبدأ.</p><button class="gbtn" id="gIn">${GICON} تسجيل الدخول بحساب Google</button>${extra}</div>`;
  if(kind==='denied')g.innerHTML=`<div class="gcard">${logo}<div class="gwarn">الحساب <b dir="ltr">${extra}</b> غير مسجّل في الصف.<br>تواصل مع المعلّمة لإضافتك.</div><button class="gbtn alt" id="gOut">تسجيل الدخول بحساب آخر</button></div>`;
  const i=$('#gIn');if(i)i.onclick=signInGoogle;const o=$('#gOut');if(o)o.onclick=signOut;
}
function alertGate(m){const g=$('#gate .gcard');if(g)g.insertAdjacentHTML('beforeend',`<div class="gwarn">${m}</div>`)}
let appStarted=false,handled=false;
function startOnce(){if(appStarted){renderNav2();return}appStarted=true;buildSim();initApp()}
async function cloudInit(){
  if(!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY){startOnce();return}
  gate('loading');
  try{await sbLoad()}catch(e){$('#gate').hidden=true;startOnce();return}
  const {data:{session}}=await CLOUD.sb.auth.getSession();
  if(session)await onUser(session.user);else gate('login');
  CLOUD.sb.auth.onAuthStateChange((ev,s)=>{if(ev==='SIGNED_IN'&&s&&!handled)onUser(s.user);if(ev==='SIGNED_OUT')location.reload()});
}
async function onUser(u){
  handled=true;gate('loading');const sb=CLOUD.sb;const email=(u.email||'').toLowerCase();CLOUD.user=u;CLOUD.email=email;
  try{
    const a=await sb.from('admins').select('email').eq('email',email).maybeSingle();CLOUD.admin=!!a.data;
    if(!CLOUD.admin){
      const st=await sb.from('students').select('*').eq('email',email).maybeSingle();if(!st.data){gate('denied',email);return}CLOUD.student=st.data;
      const loadSec=async()=>{const r=await sb.from('sections').select('unlocked').eq('id',CLOUD.student.section_id).maybeSingle();window.UNLOCKED=r.data?(r.data.unlocked||[]):[];if(appStarted){renderNav2();if(CO.unit&&!isUnlocked(CO.unit))openWorkspace()}};
      await loadSec();
      try{sb.channel('sec').on('postgres_changes',{event:'*',schema:'public',table:'sections'},loadSec).subscribe()}catch(e){}
      setInterval(loadSec,60000);
    }else window.UNLOCKED=null;
    const pr=await sb.from('progress').select('done').eq('email',email).maybeSingle();
    if(pr.data&&pr.data.done){const d=pr.data.done;Object.keys(d).forEach(k=>{P[k]=P[k]||{p:{}};P[k].p={...(P[k].p||{}),...(d[k].p||{})}});saveP(true)}
  }catch(e){alertGate('خطأ في الاتصال: '+e.message);return}
  $('#gate').hidden=true;startOnce();renderUser();
}
let csT;function cloudSave(){if(!CLOUD.on||!CLOUD.user||CLOUD.admin)return;clearTimeout(csT);csT=setTimeout(async()=>{const done={};Object.keys(P).forEach(k=>{if(P[k]&&P[k].p&&Object.keys(P[k].p).length)done[k]={p:P[k].p}});
  const {error}=await CLOUD.sb.from('progress').upsert({email:CLOUD.email,name:CLOUD.student?.name||CLOUD.user.user_metadata?.full_name||'',section_id:CLOUD.student?.section_id||null,done,last:new Date().toISOString()});if(error)console.warn(error)},1200)}
function isUnlocked(u){return !window.UNLOCKED||window.UNLOCKED.includes(u.id)}
function renderUser(){const b=$('#suser');if(!b||!CLOUD.user)return;const m=CLOUD.user.user_metadata||{};b.hidden=false;b.innerHTML=`<img src="${m.avatar_url||m.picture||''}" alt=""><span><b>${CLOUD.student?.name||m.full_name||''}</b><small dir="ltr">${CLOUD.email}</small></span>${CLOUD.admin?'<a href="admin.html" class="adm">لوحة المعلّمة</a>':''}<button id="sOut">خروج</button>`;$('#sOut').onclick=signOut}
