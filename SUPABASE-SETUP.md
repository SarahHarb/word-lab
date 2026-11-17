# ربط الموقع بحسابات Google عبر Supabase (حوالي 20 دقيقة)

## 1) إنشاء مشروع Supabase
1. افتحي https://supabase.com ← **Start your project** ← سجّلي الدخول (بحساب GitHub أو Google).
2. **New project** ← اسم: `word-lab` ← كلمة سر لقاعدة البيانات (احفظيها) ← المنطقة: **Central EU (Frankfurt)** ← **Create**.

## 2) قاعدة البيانات
1. من القائمة: **SQL Editor** ← **New query**.
2. الصقي محتوى ملف `supabase.sql` كاملًا، وغيّري في آخره `TEACHER_EMAIL@gmail.com` إلى إيميلك ← **Run**.

## 3) مفتاح Google (من Google Cloud)
1. افتحي https://console.cloud.google.com ← أنشئي مشروعًا جديدًا (مثل `word-lab`).
2. **APIs & Services ← OAuth consent screen** ← اختاري **External** ← اكتبي اسم التطبيق «برنامج وورد» وإيميلك ← احفظي حتى النهاية ← **Publish app**.
3. **APIs & Services ← Credentials ← Create credentials ← OAuth client ID** ← النوع: **Web application**.
4. في **Authorized redirect URIs** أضيفي:
   `https://<رمز-مشروعك>.supabase.co/auth/v1/callback`
   (تجدين الرابط الدقيق في Supabase: Authentication ← Providers ← Google).
5. **Create** ← انسخي **Client ID** و **Client secret**.

## 4) تفعيل Google في Supabase
1. **Authentication ← Providers ← Google** ← فعّليه ← الصقي Client ID و Client secret ← **Save**.
2. **Authentication ← URL Configuration**:
   - **Site URL**: `https://sarahharb.github.io/word-lab/`
   - **Redirect URLs** ← أضيفي: `https://sarahharb.github.io/word-lab/**`

## 5) أرسلي لي
من **Project Settings ← API**: انسخي **Project URL** و **anon public key** وأرسليهما لي (أو ضعيهما في `js/config.js`).

ملاحظة: المشروع المجاني يتوقّف إذا لم يُستخدم 7 أيام — أعيدي تشغيله من لوحة Supabase بزر **Restore**.
