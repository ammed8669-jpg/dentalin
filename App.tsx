import { useState, useEffect } from 'react';
import { Product, InvoiceItem, CustomerInfo, InvoiceDiscount, Invoice } from './types';
import { fetchProductsFromSheet, getUniqueGroups, filterByGroup, searchProducts, getIsUsingDemoData } from './services/sheetService';
import { GroupSelector } from './components/GroupSelector';
import { SearchBar } from './components/SearchBar';
import { ProductList } from './components/ProductList';
import InvoiceTable from './components/InvoiceTable';
import ExportButtons from './components/ExportButtons';
import { ConnectionStatus } from './components/ConnectionStatus';
import CustomerInfoForm from './components/CustomerInfoForm';
import NotesSection from './components/NotesSection';
import DiscountSection from './components/DiscountSection';
import Login from './components/Login';
import { LogOut } from 'lucide-react';

/**
 * المكون الرئيسي لتطبيق الفواتير مع نظام تسجيل الدخول
 */
export function App() {
  // حالة تسجيل الدخول
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  /**
   * التحقق من حالة تسجيل الدخول عند تحميل التطبيق
   */
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(authStatus === 'true');
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  /**
   * دالة تسجيل الدخول
   */
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  /**
   * دالة تسجيل الخروج
   */
  const handleLogout = () => {
    if (window.confirm('هل تريد تسجيل الخروج؟')) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('loginTime');
      setIsAuthenticated(false);
    }
  };

  // شاشة التحميل أثناء التحقق من المصادقة
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-semibold text-gray-700">جاري التحقق...</h2>
        </div>
      </div>
    );
  }

  // إذا لم يسجل دخول، عرض صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // إذا سجل دخول، عرض التطبيق الرئيسي
  return <MainApp onLogout={handleLogout} />;
}

/**
 * المكون الرئيسي للتطبيق (بعد تسجيل الدخول)
 */
function MainApp({ onLogout }: { onLogout: () => void }) {
  // حالات التطبيق
  const [allProducts, setAllProducts] = useState<Product[]>([]);           // جميع المنتجات
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // المنتجات المصفاة
  const [selectedGroup, setSelectedGroup] = useState<string>('');          // المجموعة المختارة
  const [searchTerm, setSearchTerm] = useState<string>('');               // نص البحث
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);    // عناصر الفاتورة
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({        // معلومات العميل
    name: '',
    address: '',
    phone: ''
  });
  const [notes, setNotes] = useState<string>('');                         // ملاحظات الفاتورة
  const [invoiceDiscount, setInvoiceDiscount] = useState<InvoiceDiscount | undefined>(); // خصم الفاتورة
  const [isLoading, setIsLoading] = useState<boolean>(true);              // حالة التحميل
  const [groups, setGroups] = useState<string[]>([]);                     // قائمة المجموعات
  const [isConnectedToSheet, setIsConnectedToSheet] = useState<boolean>(false); // حالة الاتصال بـ Google Sheets

  /**
   * جلب البيانات عند تحميل التطبيق
   */
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await fetchProductsFromSheet();
        setAllProducts(products);
        setFilteredProducts(products);
        setGroups(getUniqueGroups(products));
        
        // تحديد حالة الاتصال بناءً على مصدر البيانات
        setIsConnectedToSheet(!getIsUsingDemoData());
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        setIsConnectedToSheet(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  /**
   * تصفية المنتجات عند تغيير المجموعة أو البحث
   */
  useEffect(() => {
    let filtered = allProducts;

    // تصفية حسب المجموعة
    if (selectedGroup) {
      filtered = filterByGroup(filtered, selectedGroup);
    }

    // تصفية حسب البحث
    if (searchTerm) {
      filtered = searchProducts(filtered, searchTerm);
    }

    setFilteredProducts(filtered);
  }, [selectedGroup, searchTerm, allProducts]);

  /**
   * إضافة منتج للفاتورة
   */
  const handleAddToInvoice = (product: Product, quantity: number) => {
    // التحقق من وجود المنتج في الفاتورة
    const existingItemIndex = invoiceItems.findIndex(
      item => item.product.productName === product.productName
    );

    if (existingItemIndex >= 0) {
      // تحديث الكمية إذا كان المنتج موجود
      const updatedItems = [...invoiceItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      if (newQuantity <= product.availableQty) {
        updatedItems[existingItemIndex].quantity = newQuantity;
        const price = updatedItems[existingItemIndex].customPrice ?? product.unitPrice;
        updatedItems[existingItemIndex].totalPrice = newQuantity * price;
        setInvoiceItems(updatedItems);
      } else {
        alert('⚠️ الكمية المطلوبة تتجاوز المخزون المتاح');
      }
    } else {
      // إضافة منتج جديد
      const newItem: InvoiceItem = {
        product,
        quantity,
        totalPrice: quantity * product.unitPrice
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }

    // تحديث المخزون المتاح في الواجهة
    updateProductStock(product.productName, -quantity);
  };

  /**
   * حذف عنصر من الفاتورة
   */
  const handleRemoveItem = (index: number) => {
    const item = invoiceItems[index];
    // إرجاع الكمية للمخزون
    updateProductStock(item.product.productName, item.quantity);
    
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  /**
   * تحديث كمية عنصر في الفاتورة
   */
  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    const item = invoiceItems[index];
    const quantityDiff = newQuantity - item.quantity;
    
    // التحقق من توفر الكمية
    const currentStock = allProducts.find(
      p => p.productName === item.product.productName
    )?.availableQty || 0;
    
    if (quantityDiff <= currentStock || quantityDiff < 0) {
      const updatedItems = [...invoiceItems];
      updatedItems[index].quantity = newQuantity;
      const pricePerUnit = updatedItems[index].customPrice ?? updatedItems[index].product.unitPrice;
      updatedItems[index].totalPrice = newQuantity * pricePerUnit;
      setInvoiceItems(updatedItems);
      
      // تحديث المخزون
      updateProductStock(item.product.productName, -quantityDiff);
    } else {
      alert('⚠️ الكمية المطلوبة تتجاوز المخزون المتاح');
    }
  };

  /**
   * تحديث سعر عنصر في الفاتورة
   */
  const handleUpdatePrice = (index: number, newPrice: number) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index].customPrice = newPrice;
    updatedItems[index].totalPrice = newPrice * updatedItems[index].quantity;
    setInvoiceItems(updatedItems);
  };

  /**
   * تحديث خصم منتج في الفاتورة
   */
  const handleUpdateDiscount = (index: number, discount: number, discountType: 'percentage' | 'fixed') => {
    const updatedItems = [...invoiceItems];
    updatedItems[index].discount = discount;
    updatedItems[index].discountType = discountType;
    setInvoiceItems(updatedItems);
  };

  /**
   * تحديث المخزون المتاح
   */
  const updateProductStock = (productName: string, quantityChange: number) => {
    setAllProducts(prevProducts =>
      prevProducts.map(p =>
        p.productName === productName
          ? { ...p, availableQty: p.availableQty + quantityChange }
          : p
      )
    );
  };

  /**
   * حساب المجموع الفرعي (قبل خصم الفاتورة)
   */
  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => {
      const price = item.customPrice ?? item.product.unitPrice;
      let total = price * item.quantity;
      
      if (item.discount && item.discount > 0) {
        if (item.discountType === 'percentage') {
          total = total - (total * item.discount / 100);
        } else {
          total = total - item.discount;
        }
      }
      
      return sum + Math.max(0, total);
    }, 0);
  };

  /**
   * حساب قيمة خصم الفاتورة
   */
  const calculateInvoiceDiscountValue = () => {
    if (!invoiceDiscount || invoiceDiscount.amount === 0) return 0;
    
    const subtotal = calculateSubtotal();
    
    if (invoiceDiscount.type === 'percentage') {
      return (subtotal * invoiceDiscount.amount) / 100;
    }
    return invoiceDiscount.amount;
  };

  /**
   * حساب المجموع الكلي (بعد خصم الفاتورة)
   */
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountValue = calculateInvoiceDiscountValue();
    return Math.max(0, subtotal - discountValue);
  };

  /**
   * إنشاء كائن الفاتورة للتصدير
   */
  const createInvoice = (): Invoice => {
    return {
      items: invoiceItems,
      customerInfo: customerInfo.name || customerInfo.phone || customerInfo.address ? customerInfo : undefined,
      notes: notes.trim() || undefined,
      discount: invoiceDiscount,
      subtotal: calculateSubtotal(),
      totalAmount: calculateTotal(),
      date: new Date(),
      invoiceNumber: `INV-${Date.now()}`
    };
  };

  /**
   * مسح الفاتورة
   */
  const handleClearInvoice = () => {
    if (invoiceItems.length === 0) return;
    
    if (window.confirm('هل تريد مسح جميع عناصر الفاتورة؟')) {
      // إرجاع جميع الكميات للمخزون
      invoiceItems.forEach(item => {
        updateProductStock(item.product.productName, item.quantity);
      });
      setInvoiceItems([]);
      setCustomerInfo({ name: '', address: '', phone: '' });
      setNotes('');
      setInvoiceDiscount(undefined);
    }
  };

  // شاشة التحميل
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚙️</div>
          <h2 className="text-2xl font-semibold text-gray-700">جاري تحميل البيانات...</h2>
          <p className="text-gray-500 mt-2">الرجاء الانتظار</p>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const discountValue = calculateInvoiceDiscountValue();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4" dir="rtl">
      {/* العنوان الرئيسي */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-4xl">🧾</span>
                نظام الفواتير للمبيعات
              </h1>
              <p className="text-gray-600 mt-2">
                إدارة الفواتير وتتبع المخزون بسهولة
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={onLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 
                         rounded-lg font-semibold transition-all duration-200 
                         shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>
              {invoiceItems.length > 0 && (
                <button
                  onClick={handleClearInvoice}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 
                           rounded-lg font-semibold transition-all duration-200 
                           shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>🗑️</span>
                  مسح الفاتورة
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto space-y-6">
        {/* حالة الاتصال بـ Google Sheets */}
        <ConnectionStatus
          isConnected={isConnectedToSheet}
          productsCount={allProducts.length}
          message={isConnectedToSheet ? 
            'البيانات محدثة من Google Sheets الخاص بك' : 
            'تأكد من نشر Google Sheet للعامة'}
        />

        {/* معلومات العميل */}
        <CustomerInfoForm
          customerInfo={customerInfo}
          onUpdate={setCustomerInfo}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* القسم الأيسر: المنتجات */}
          <div className="space-y-6">
            {/* البحث والتصفية */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🔍</span>
                البحث والتصفية
              </h2>
              <div className="space-y-4">
                <GroupSelector
                  groups={groups}
                  selectedGroup={selectedGroup}
                  onGroupChange={setSelectedGroup}
                />
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
              </div>
            </div>

            {/* قائمة المنتجات */}
            <ProductList
              products={filteredProducts}
              onAddToInvoice={handleAddToInvoice}
            />
          </div>

          {/* القسم الأيمن: الفاتورة */}
          <div className="space-y-6">
            {/* جدول الفاتورة */}
            <InvoiceTable
              items={invoiceItems}
              onRemove={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdatePrice={handleUpdatePrice}
              onUpdateDiscount={handleUpdateDiscount}
            />

            {/* قسم الخصومات */}
            {invoiceItems.length > 0 && (
              <DiscountSection
                discount={invoiceDiscount}
                subtotal={subtotal}
                onUpdate={setInvoiceDiscount}
              />
            )}

            {/* عرض المجموع النهائي */}
            {invoiceItems.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-lg">
                    <span>المجموع الفرعي:</span>
                    <span className="font-bold">{subtotal.toLocaleString('en-US')} IQD</span>
                  </div>
                  
                  {discountValue > 0 && (
                    <div className="flex justify-between items-center text-lg text-green-200">
                      <span>الخصم:</span>
                      <span className="font-bold">-{discountValue.toLocaleString('en-US')} IQD</span>
                    </div>
                  )}
                  
                  <div className="border-t-2 border-white/30 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">المجموع الكلي:</span>
                      <span className="text-3xl font-bold">{total.toLocaleString('en-US')} IQD</span>
                    </div>
                    <div className="text-center mt-2 text-sm opacity-90">
                      {total.toLocaleString('ar-IQ')} دينار عراقي
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* الملاحظات */}
        {invoiceItems.length > 0 && (
          <NotesSection notes={notes} onUpdate={setNotes} />
        )}

        {/* أزرار التصدير */}
        {invoiceItems.length > 0 && (
          <ExportButtons invoice={createInvoice()} />
        )}
      </main>

      {/* التذييل */}
      <footer className="max-w-7xl mx-auto mt-12 text-center">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <p className="text-gray-600">
            💡 <strong>ميزات جديدة:</strong> خصومات على المنتجات والفاتورة • معلومات العميل • ملاحظات • تحديث تلقائي للمخزون
          </p>
          <p className="text-sm text-gray-500 mt-2">
            تم تطويره باستخدام React و TypeScript و Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
