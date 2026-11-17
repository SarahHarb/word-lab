/* ================= Cloud: Google sign-in, allowed students, sections, unlocks, progress ================= */
const CLOUD={on:false,user:null,email:null,admin:false,student:null,db:null};
window.UNLOCKED=null; // null = everything open (offline mode / admin)
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
const FBV='https://www.gstatic.com/firebasejs/10.12.2/';
async function fbLoad(){await loadScript(FBV+'firebase-app-compat.js');await loadScript(FBV+'firebase-auth-compat.js');await loadScript(FBV+'firebase-firestore-compat.js');firebase.initializeApp(window.FB_CONFIG);CLOUD.db=firebase.firestore();CLOUD.on=true}
function gate(kind,extra=''){const g=$('#gate');g.hidden=false;
  const logo='<div class="glogo">W</div><h1>برنامج وورد</h1><p class="gs">دليل التطبيق العملي · إعداد: سارة حرب</p>';
  if(kind==='loading')g.innerHTML=`<div class="gcard">${logo}<p>جارٍ التحميل…</p></div>`;
  if(kind==='login')g.innerHTML=`<div class="gcard">${logo}<p>سجّل الدخول بحساب Google الخاص بك لتبدأ.</p><button class="gbtn" id="gIn"><svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41 35.4 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/></svg>تسجيل الدخول بحساب Google</button>${extra}</div>`;
  if(kind==='denied')g.innerHTML=`<div class="gcard">${logo}<div class="gwarn">الحساب <b dir="ltr">${extra}</b> غير مسجّل في الصف.<br>تواصل مع المعلّمة لإضافتك.</div><button class="gbtn alt" id="gOut">تسجيل الدخول بحساب آخر</button></div>`;
  const i=$('#gIn');if(i)i.onclick=async()=>{try{const pr=new firebase.auth.GoogleAuthProvider();pr.setCustomParameters({prompt:'select_account'});await firebase.auth().signInWithPopup(pr)}catch(e){try{await firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider())}catch(e2){alertGate('تعذّر تسجيل الدخول: '+e.message)}}};
  const o=$('#gOut');if(o)o.onclick=()=>firebase.auth().signOut();
}
function alertGate(m){const g=$('#gate .gcard');if(g)g.insertAdjacentHTML('beforeend',`<div class="gwarn">${m}</div>`)}
let appStarted=false;
function startOnce(){if(appStarted){renderNav2();return}appStarted=true;buildSim();initApp()}
async function cloudInit(){
  if(!window.FB_CONFIG){startOnce();return}
  gate('loading');
  try{await fbLoad()}catch(e){$('#gate').hidden=true;startOnce();return}
  firebase.auth().onAuthStateChanged(async u=>{
    if(!u){CLOUD.user=null;gate('login');return}
    gate('loading');const email=(u.email||'').toLowerCase();CLOUD.user=u;CLOUD.email=email;CLOUD.admin=(window.ADMIN_EMAILS||[]).map(x=>x.toLowerCase()).includes(email);
    try{
      if(!CLOUD.admin){const st=await CLOUD.db.collection('students').doc(email).get();if(!st.exists){gate('denied',email);return}CLOUD.student=st.data();
        CLOUD.db.collection('sections').doc(CLOUD.student.section||'_').onSnapshot(d=>{window.UNLOCKED=d.exists?(d.data().unlocked||[]):[];if(appStarted){renderNav2();if(CO.unit&&!isUnlocked(CO.unit))openWorkspace()}})}
      else window.UNLOCKED=null;
      const pr=await CLOUD.db.collection('progress').doc(email).get();if(pr.exists&&pr.data().done){const d=pr.data().done;Object.keys(d).forEach(k=>{P[k]=P[k]||{p:{}};P[k].p={...(P[k].p||{}),...(d[k].p||{})}});saveP(true)}
    }catch(e){alertGate('خطأ في الاتصال: '+e.message);return}
    $('#gate').hidden=true;startOnce();renderUser();
  });
}
let csT;function cloudSave(){if(!CLOUD.on||!CLOUD.user||CLOUD.admin)return;clearTimeout(csT);csT=setTimeout(()=>{const done={};Object.keys(P).forEach(k=>{if(P[k]&&P[k].p&&Object.keys(P[k].p).length)done[k]={p:P[k].p}});
  CLOUD.db.collection('progress').doc(CLOUD.email).set({done,name:CLOUD.student?.name||CLOUD.user.displayName||'',section:CLOUD.student?.section||'',email:CLOUD.email,last:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(e=>console.warn(e))},1200)}
function isUnlocked(u){return !window.UNLOCKED||window.UNLOCKED.includes(u.id)}
function renderUser(){const b=$('#suser');if(!b||!CLOUD.user)return;b.hidden=false;b.innerHTML=`<img src="${CLOUD.user.photoURL||''}" alt=""><span><b>${CLOUD.student?.name||CLOUD.user.displayName||''}</b><small dir="ltr">${CLOUD.email}</small></span>${CLOUD.admin?'<a href="admin.html" class="adm">لوحة المعلّمة</a>':''}<button id="sOut">خروج</button>`;$('#sOut').onclick=()=>firebase.auth().signOut().then(()=>location.reload())}
