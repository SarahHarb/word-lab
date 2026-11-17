# ربط الموقع بحسابات Google (Firebase) — حوالي 10 دقائق

## 1) إنشاء المشروع
1. افتحي https://console.firebase.google.com وسجّلي الدخول بحسابك.
2. **Add project / إضافة مشروع** ← اكتبي اسمًا مثل `word-lab` ← يمكنك إيقاف Google Analytics ← **Create**.

## 2) تفعيل تسجيل الدخول بـ Google
1. من القائمة: **Build ← Authentication ← Get started**.
2. تبويب **Sign-in method** ← **Google** ← فعّليه (Enable) ← اختاري إيميلك ← **Save**.
3. تبويب **Settings ← Authorized domains** ← **Add domain** ← اكتبي: `sarahharb.github.io`

## 3) قاعدة البيانات
1. **Build ← Firestore Database ← Create database** ← اختاري موقعًا (مثل `eur3`) ← **Start in production mode**.
2. تبويب **Rules** ← امسحي الموجود والصقي محتوى ملف `firestore.rules`، وغيّري `TEACHER_EMAIL@gmail.com` إلى إيميلك ← **Publish**.

## 4) إعدادات الموقع
1. ⚙️ **Project settings** ← في الأسفل **Your apps** ← اضغطي أيقونة الويب `</>` ← اكتبي اسمًا ← **Register app**.
2. سيظهر لك كود فيه `const firebaseConfig = { ... }` — انسخيه وأرسليه لي (أو ضعيه في `js/config.js`) مع إيميلك.

بعدها: افتحي `admin.html` ← أضيفي الشعب والطلاب ← افتحي الدروس بعد كل محاضرة.
