import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

/**
 * مكون عرض حالة الاتصال بـ Google Sheets
 */

interface ConnectionStatusProps {
  /** هل تم جلب البيانات من Google Sheets */
  isConnected: boolean;
  /** عدد المنتجات المحملة */
  productsCount: number;
  /** رسالة الحالة */
  message?: string;
}

export function ConnectionStatus({ 
  isConnected, 
  productsCount,
  message 
}: ConnectionStatusProps) {
  
  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-800 mb-1">
              ✅ متصل بـ Google Sheets
            </h3>
            <p className="text-sm text-green-700">
              تم تحميل <span className="font-bold">{productsCount}</span> منتج من قاعدة البيانات
            </p>
            {message && (
              <p className="text-xs text-green-600 mt-1">{message}</p>
            )}
          </div>
          <Wifi className="h-5 w-5 text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-800 mb-1">
            ⚠️ غير متصل بـ Google Sheets
          </h3>
          <p className="text-sm text-amber-700">
            يتم استخدام <span className="font-bold">{productsCount}</span> منتج تجريبي للاختبار
          </p>
          <div className="mt-2 text-xs text-amber-600 space-y-1">
            <p>💡 للاتصال بجدولك:</p>
            <ol className="list-decimal list-inside mr-4 space-y-1">
              <li>افتح Google Sheet وانقر "مشاركة"</li>
              <li>اختر "أي شخص لديه الرابط" + "مشاهد"</li>
              <li>أعد تحميل الصفحة (F5)</li>
            </ol>
            <p className="mt-2">
              📖 المزيد من التفاصيل في ملف{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded">
                STEP_BY_STEP_AR.md
              </code>
            </p>
          </div>
          {message && (
            <p className="text-xs text-amber-600 mt-2 font-mono bg-amber-100 p-2 rounded">
              {message}
            </p>
          )}
        </div>
        <WifiOff className="h-5 w-5 text-amber-600" />
      </div>
    </div>
  );
}
