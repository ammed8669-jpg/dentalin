import { Percent, DollarSign } from 'lucide-react';
import { InvoiceDiscount } from '../types';

/**
 * مكون إدارة الخصومات
 * يسمح بإضافة خصم نسبة مئوية أو مبلغ ثابت على الفاتورة
 */

interface DiscountSectionProps {
  discount: InvoiceDiscount | undefined;
  subtotal: number;
  onUpdate: (discount: InvoiceDiscount | undefined) => void;
}

export default function DiscountSection({ discount, subtotal, onUpdate }: DiscountSectionProps) {
  const handleTypeChange = (type: 'percentage' | 'fixed') => {
    if (discount) {
      onUpdate({ ...discount, type });
    } else {
      onUpdate({ amount: 0, type });
    }
  };

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    if (discount) {
      onUpdate({ ...discount, amount });
    } else {
      onUpdate({ amount, type: 'percentage' });
    }
  };

  const clearDiscount = () => {
    onUpdate(undefined);
  };

  // حساب قيمة الخصم الفعلية
  const getDiscountValue = () => {
    if (!discount || discount.amount === 0) return 0;
    
    if (discount.type === 'percentage') {
      return (subtotal * discount.amount) / 100;
    }
    return discount.amount;
  };

  const discountValue = getDiscountValue();

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6 border border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Percent className="w-5 h-5 text-green-600" />
          الخصومات
        </h3>
        
        {discount && discount.amount > 0 && (
          <button
            onClick={clearDiscount}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            إلغاء الخصم
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* نوع الخصم */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            نوع الخصم
          </label>
          <select
            value={discount?.type || 'percentage'}
            onChange={(e) => handleTypeChange(e.target.value as 'percentage' | 'fixed')}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-right bg-white"
          >
            <option value="percentage">نسبة مئوية (%)</option>
            <option value="fixed">مبلغ ثابت (IQD)</option>
          </select>
        </div>

        {/* قيمة الخصم */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            {discount?.type === 'percentage' ? 'نسبة الخصم (%)' : 'مبلغ الخصم (IQD)'}
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {discount?.type === 'percentage' ? (
                <Percent className="w-4 h-4 text-gray-400" />
              ) : (
                <DollarSign className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <input
              type="number"
              min="0"
              max={discount?.type === 'percentage' ? 100 : subtotal}
              step={discount?.type === 'percentage' ? 1 : 100}
              value={discount?.amount || 0}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full pr-3 pl-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-right"
              placeholder="0"
            />
          </div>
        </div>

        {/* عرض قيمة الخصم */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            قيمة الخصم الفعلية
          </label>
          <div className="bg-white border-2 border-green-300 rounded-lg px-3 py-2.5 text-right">
            <span className="font-bold text-green-700">
              {discountValue.toLocaleString('en-US')} IQD
            </span>
          </div>
        </div>
      </div>

      {/* معلومات إضافية */}
      {discount && discount.amount > 0 && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-sm text-green-800 text-right">
            {discount.type === 'percentage' 
              ? `سيتم خصم ${discount.amount}% من إجمالي الفاتورة (${discountValue.toLocaleString('en-US')} IQD)`
              : `سيتم خصم ${discount.amount.toLocaleString('en-US')} دينار عراقي من الفاتورة`
            }
          </p>
        </div>
      )}
    </div>
  );
}
