# 📊 دليل إعداد Google Sheets

## خطوات ربط التطبيق بـ Google Sheets

### الطريقة 1️⃣: نشر الجدول كـ CSV (الأسهل - مستخدمة حالياً)

#### 1. إنشاء الجدول
أنشئ Google Sheet جديد بالهيكل التالي:

| Group | Product Name | Available Qty | Unit Price |
|-------|-------------|---------------|------------|
| إلكترونيات | لابتوب HP ProBook | 15 | 3500 |
| إلكترونيات | ماوس لاسلكي | 50 | 85 |
| مكتبيات | دفتر A4 | 200 | 15 |
| أثاث | كرسي مكتب | 25 | 800 |

#### 2. نشر الجدول
1. اذهب إلى `File` → `Share` → `Publish to web`
2. في قسم `Link`:
   - اختر `Entire Document` أو اسم الورقة المحددة
   - اختر صيغة `Comma-separated values (.csv)`
3. اضغط على `Publish`
4. انسخ الرابط الذي يظهر

#### 3. تحديث الكود
افتح ملف `src/services/sheetService.ts` وغير السطر:

```typescript
const SHEET_URL = 'YOUR_GOOGLE_SHEET_CSV_LINK_HERE';
```

إلى الرابط الذي نسخته:

```typescript
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQabcd.../pub?output=csv';
```

---

### الطريقة 2️⃣: استخدام SheetDB (بديل متقدم)

#### 1. إنشاء حساب في SheetDB
- اذهب إلى [sheetdb.io](https://sheetdb.io/)
- أنشئ حساب مجاني
- اربط Google Sheet الخاص بك

#### 2. احصل على API URL
- ستحصل على رابط مثل: `https://sheetdb.io/api/v1/YOUR_API_ID`

#### 3. تعديل الكود
في `src/services/sheetService.ts`، عدل الدالة `fetchProductsFromSheet`:

```typescript
export async function fetchProductsFromSheet(): Promise<Product[]> {
  try {
    const response = await fetch('https://sheetdb.io/api/v1/YOUR_API_ID');
    const data = await response.json();
    
    return data.map((row: any) => ({
      group: row.Group,
      productName: row['Product Name'],
      availableQty: parseInt(row['Available Qty']) || 0,
      unitPrice: parseFloat(row['Unit Price']) || 0
    }));
  } catch (error) {
    console.error('خطأ في جلب البيانات:', error);
    return getDemoData();
  }
}
```

---

### الطريقة 3️⃣: Google Apps Script (للمستخدمين المتقدمين)

#### 1. إنشاء Web App
في Google Sheets:
1. اذهب إلى `Extensions` → `Apps Script`
2. احذف الكود الموجود والصق هذا:

```javascript
function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var products = [];
  
  for (var i = 1; i < data.length; i++) {
    var product = {};
    for (var j = 0; j < headers.length; j++) {
      product[headers[j]] = data[i][j];
    }
    products.push(product);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(products))
    .setMimeType(ContentService.MimeType.JSON);
}
```

#### 2. نشر Web App
1. اضغط `Deploy` → `New deployment`
2. اختر `Web app`
3. في `Who has access`، اختر `Anyone`
4. اضغط `Deploy`
5. انسخ رابط الـ Web app

#### 3. استخدام الرابط
في `src/services/sheetService.ts`:

```typescript
const SHEET_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';

export async function fetchProductsFromSheet(): Promise<Product[]> {
  try {
    const response = await fetch(SHEET_URL);
    const data = await response.json();
    
    return data.map((row: any) => ({
      group: row.Group,
      productName: row['Product Name'],
      availableQty: parseInt(row['Available Qty']) || 0,
      unitPrice: parseFloat(row['Unit Price']) || 0
    }));
  } catch (error) {
    console.error('خطأ في جلب البيانات:', error);
    return getDemoData();
  }
}
```

---

## 🔄 مزامنة البيانات

### إعادة تحميل البيانات تلقائياً
لإعادة تحميل البيانات كل فترة، أضف في `src/App.tsx`:

```typescript
useEffect(() => {
  const loadProducts = async () => {
    const products = await fetchProductsFromSheet();
    setAllProducts(products);
    setFilteredProducts(products);
    setGroups(getUniqueGroups(products));
  };

  // تحميل أولي
  loadProducts();

  // إعادة تحميل كل 5 دقائق
  const interval = setInterval(loadProducts, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

---

## ⚠️ مشاكل شائعة وحلولها

### 1. CORS Error
**المشكلة**: رسالة خطأ Cross-Origin Request Blocked

**الحل**:
- تأكد من نشر الجدول للعامة
- استخدم الطريقة 2 (SheetDB) أو 3 (Apps Script)

### 2. البيانات لا تظهر
**المشكلة**: التطبيق يعرض البيانات التجريبية فقط

**الحل**:
- تحقق من رابط Google Sheet
- افتح الرابط في المتصفح للتأكد من أنه يعمل
- تحقق من تنسيق الأعمدة

### 3. أخطاء في التحليل
**المشكلة**: خطأ في تحويل CSV إلى JSON

**الحل**:
- تأكد من عدم وجود فواصل (,) في أسماء المنتجات
- استخدم الفاصلة المنقوطة (;) بدلاً من الفواصل في النصوص

---

## 📝 نصائح للاستخدام الأمثل

1. **استخدم البيانات التجريبية للاختبار** قبل ربط Google Sheets
2. **احتفظ بنسخة احتياطية** من بياناتك
3. **لا تضع معلومات حساسة** في Google Sheets المنشور
4. **استخدم Apps Script** للتحكم الكامل في البيانات
5. **للإنتاج الفعلي** فكر في استخدام قاعدة بيانات حقيقية

---

## 🔐 ملاحظات الأمان

⚠️ **تحذير**: عند نشر Google Sheet للعامة، يمكن لأي شخص الوصول للبيانات

**للحماية**:
- لا تضع أسعار سرية أو معلومات عملاء
- استخدم هذه الطريقة للبيانات العامة فقط
- للبيانات الحساسة، استخدم Google Sheets API مع OAuth

---

## 📞 دعم إضافي

إذا احتجت مساعدة:
1. تحقق من Developer Console في المتصفح (F12)
2. ابحث عن رسائل الخطأ
3. راجع الملف `src/services/sheetService.ts`

**نموذج Google Sheet للتجربة**:
يمكنك إنشاء نسخة من [هذا النموذج](https://docs.google.com/spreadsheets/d/EXAMPLE)

---

✅ بعد إعداد Google Sheets بنجاح، سيتم جلب البيانات تلقائياً عند تحميل الصفحة!
