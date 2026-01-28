import { Trash2, Edit3, Percent, DollarSign } from 'lucide-react';
import { InvoiceItem } from '../types';
import { useState } from 'react';

/**
 * مكون جدول الفاتورة
 * يعرض المنتجات المختارة مع الكميات والأسعار والخصومات
 */

interface InvoiceTableProps {
  items: InvoiceItem[];
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onUpdatePrice: (index: number, price: number) => void;
  onUpdateDiscount: (index: number, discount: number, discountType: 'percentage' | 'fixed') => void;
}

export default function InvoiceTable({ 
  items, 
  onRemove, 
  onUpdateQuantity, 
  onUpdatePrice,
  onUpdateDiscount 
}: InvoiceTableProps) {
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 text-center">
        <p className="text-gray-500">لم يتم إضافة أي منتجات للفاتورة بعد</p>
      </div>
    );
  }

  // حساب السعر النهائي للعنصر مع الخصم
  const calculateItemTotal = (item: InvoiceItem) => {
    const price = item.customPrice ?? item.product.unitPrice;
    let total = price * item.quantity;
    
    if (item.discount && item.discount > 0) {
      if (item.discountType === 'percentage') {
        total = total - (total * item.discount / 100);
      } else {
        total = total - item.discount;
      }
    }
    
    return Math.max(0, total);
  };

  // حساب المجموع الكلي
  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white text-right">الفاتورة</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" dir="rtl">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">المنتج</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">الكمية</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">سعر الوحدة</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">خصم</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">الإجمالي</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => {
              const isEditing = editingItemIndex === index;
              const itemTotal = calculateItemTotal(item);
              const price = item.customPrice ?? item.product.unitPrice;

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {/* اسم المنتج */}
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.product.productName}</div>
                    <div className="text-xs text-gray-500">{item.product.group}</div>
                  </td>

                  {/* الكمية */}
                  <td className="px-4 py-4 text-center">
                    <input
                      type="number"
                      min="1"
                      max={item.product.availableQty}
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(index, parseInt(e.target.value) || 1)}
                      className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <div className="text-xs text-gray-500 mt-1">من {item.product.availableQty}</div>
                  </td>

                  {/* سعر الوحدة */}
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={price}
                        onChange={(e) => onUpdatePrice(index, parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <Edit3 className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">IQD</div>
                  </td>

                  {/* الخصم */}
                  <td className="px-4 py-4 text-center">
                    {isEditing ? (
                      <div className="space-y-2">
                        <select
                          value={item.discountType || 'percentage'}
                          onChange={(e) => {
                            const type = e.target.value as 'percentage' | 'fixed';
                            onUpdateDiscount(index, item.discount || 0, type);
                          }}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="percentage">نسبة %</option>
                          <option value="fixed">مبلغ ثابت</option>
                        </select>
                        <input
                          type="number"
                          min="0"
                          max={item.discountType === 'percentage' ? 100 : price * item.quantity}
                          value={item.discount || 0}
                          onChange={(e) => {
                            const discount = parseFloat(e.target.value) || 0;
                            onUpdateDiscount(index, discount, item.discountType || 'percentage');
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-center"
                          placeholder="0"
                        />
                        <button
                          onClick={() => setEditingItemIndex(null)}
                          className="text-xs text-green-600 hover:text-green-700"
                        >
                          حفظ
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => setEditingItemIndex(index)}
                        className="cursor-pointer hover:bg-gray-100 rounded p-1"
                      >
                        {item.discount && item.discount > 0 ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-medium text-green-600">
                              {item.discountType === 'percentage' ? `${item.discount}%` : `${item.discount.toLocaleString()} IQD`}
                            </span>
                            {item.discountType === 'percentage' ? (
                              <Percent className="w-3 h-3 text-green-500" />
                            ) : (
                              <DollarSign className="w-3 h-3 text-green-500" />
                            )}
                          </div>
                        ) : (
                          <button className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            إضافة خصم
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  {/* الإجمالي */}
                  <td className="px-4 py-4 text-center">
                    <div className="font-bold text-indigo-600 text-lg">
                      {itemTotal.toLocaleString('en-US')}
                    </div>
                    <div className="text-xs text-gray-500">IQD</div>
                  </td>

                  {/* حذف */}
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => onRemove(index)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      title="حذف من الفاتورة"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* إجمالي الفاتورة */}
          <tfoot className="bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2 border-indigo-200">
            <tr>
              <td colSpan={4} className="px-6 py-4 text-right">
                <span className="text-lg font-bold text-gray-800">المجموع الكلي:</span>
              </td>
              <td colSpan={2} className="px-6 py-4 text-center">
                <div className="text-2xl font-bold text-indigo-700">
                  {subtotal.toLocaleString('en-US')} <span className="text-lg">IQD</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {subtotal.toLocaleString('ar-IQ')} دينار عراقي
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* معلومات الفاتورة */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>عدد المنتجات: <strong>{items.length}</strong></span>
          <span>إجمالي الوحدات: <strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong></span>
        </div>
      </div>
    </div>
  );
}
