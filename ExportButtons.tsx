import { FileImage, Printer } from 'lucide-react';
import { Invoice } from '../types';
import { exportToPDF, exportToImage } from '../utils/exportInvoice';

/**
 * مكون أزرار التصدير
 * يتيح تصدير الفاتورة بصيغتين فقط: PDF وصورة
 */

interface ExportButtonsProps {
  invoice: Invoice;
  disabled?: boolean;
}

export default function ExportButtons({ invoice, disabled }: ExportButtonsProps) {
  if (invoice.items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Printer className="w-5 h-5 text-indigo-600" />
        حفظ وتصدير الفاتورة
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* تصدير PDF/طباعة */}
        <button
          onClick={() => exportToPDF(invoice)}
          disabled={disabled}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          <Printer className="w-6 h-6" />
          <span>تصدير PDF</span>
        </button>

        {/* تصدير كصورة */}
        <button
          onClick={() => exportToImage(invoice)}
          disabled={disabled}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          <FileImage className="w-6 h-6" />
          <span>تصدير كصورة</span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 text-right">
          💡 <strong>نصيحة:</strong> استخدم PDF للطباعة والأرشفة، أو احفظها كصورة للمشاركة السريعة
        </p>
      </div>
    </div>
  );
}
