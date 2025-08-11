# نشر Discord Broadcaster Pro على Railway

## لماذا Railway؟
- ✅ **مجاني** للمشاريع الصغيرة
- ✅ **يدعم PHP** بالكامل
- ✅ **نشر تلقائي** من GitHub
- ✅ **SSL مجاني** 
- ✅ **سهل جداً** في الاستخدام

---

## الخطوات التفصيلية:

### 1. إعداد Discord Application
قبل النشر، تأكد من إعداد Discord Bot:

1. اذهب إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. أنشئ Application جديد أو استخدم موجود
3. في قسم **OAuth2**:
   - أضف Redirect URI: `https://your-app-name.up.railway.app/auth.php`
   - اختر Scopes: `identify`, `guilds`
4. في قسم **Bot**:
   - أنشئ Bot إذا لم يكن موجود
   - انسخ Bot Token
   - فعّل **Server Members Intent**

### 2. نشر على Railway

#### الخطوة 1: إنشاء حساب
1. اذهب إلى [Railway.app](https://railway.app)
2. اضغط **"Start a New Project"**
3. سجل دخول بـ **GitHub**

#### الخطوة 2: إنشاء مشروع جديد
1. اضغط **"New Project"**
2. اختر **"Deploy from GitHub repo"**
3. اختر repository: `brodcast-discord`
4. اضغط **"Deploy Now"**

#### الخطوة 3: إضافة متغيرات البيئة
1. في لوحة Railway، اضغط على مشروعك
2. اذهب إلى تبويب **"Variables"**
3. أضف المتغيرات التالية:

```
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
REDIRECT_URI=https://your-app-name.up.railway.app/auth.php
BOT_TOKEN=your_bot_token
APP_ENV=production
DEBUG=false
```

#### الخطوة 4: الحصول على الرابط
1. في تبويب **"Settings"**
2. انسخ **"Public URL"**
3. سيكون شكله: `https://your-app-name.up.railway.app`

#### الخطوة 5: تحديث Discord Redirect URI
1. ارجع إلى Discord Developer Portal
2. في OAuth2 → Redirects
3. حدث الرابط إلى: `https://your-app-name.up.railway.app/auth.php`
4. احفظ التغييرات

### 3. اختبار الموقع
1. اذهب إلى رابط موقعك على Railway
2. اضغط **"Login with Discord"**
3. أدخل Bot Token
4. اختبر إرسال رسالة

---

## استكشاف الأخطاء:

### إذا ظهر خطأ "Configuration file not found":
- تأكد من إضافة جميع متغيرات البيئة في Railway
- تأكد من أن أسماء المتغيرات صحيحة

### إذا فشل تسجيل الدخول:
- تأكد من صحة DISCORD_CLIENT_ID و DISCORD_CLIENT_SECRET
- تأكد من أن REDIRECT_URI يطابق ما في Discord Developer Portal

### إذا فشل البوت:
- تأكد من صحة BOT_TOKEN
- تأكد من تفعيل Server Members Intent
- تأكد من إضافة البوت للسيرفر مع الصلاحيات المطلوبة

---

## نصائح مهمة:

### الأمان:
- ✅ لا تشارك Bot Token مع أحد
- ✅ استخدم متغيرات البيئة فقط
- ✅ لا ترفع ملف .env إلى GitHub

### الأداء:
- Railway يعطي 500 ساعة مجانية شهرياً
- إذا انتهت، الموقع سيتوقف حتى الشهر التالي
- يمكن ترقية الحساب للاستخدام المكثف

### النشر التلقائي:
- أي تحديث في GitHub سيؤدي لنشر تلقائي
- يمكن إيقاف النشر التلقائي من الإعدادات

---

## روابط مفيدة:
- [Railway Documentation](https://docs.railway.app)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [PHP on Railway Guide](https://docs.railway.app/guides/php)

---

**🎉 مبروك! موقعك الآن يعمل على Railway بـ PHP كامل!**
