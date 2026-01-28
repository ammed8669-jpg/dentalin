import React, { useState } from 'react';
import { Product } from '../types';

/**
 * مكون لعرض قائمة المنتجات وإضافتها للفاتورة
 */
interface ProductListProps {
  products: Product[];                              // قائمة المنتجات المتاحة
  onAddToInvoice: (product: Product, quantity: number) => void;  // دالة إضافة منتج للفاتورة
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToInvoice
}) => {
  // حالة لتخزين الكمية المدخلة لكل منتج
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  /**
   * تعيين الكمية لمنتج معين
   */
  const handleQuantityChange = (productName: string, value: string) => {
    const quantity = parseInt(value) || 0;
    setQuantities({
      ...quantities,
      [productName]: quantity
    });
  };

  /**
   * إضافة منتج للفاتورة
   */
  const handleAdd = (product: Product) => {
    const quantity = quantities[product.productName] || 1;
    if (quantity > 0 && quantity <= product.availableQty) {
      onAddToInvoice(product, quantity);
      // إعادة تعيين الكمية بعد الإضافة
      setQuantities({
        ...quantities,
        [product.productName]: 0
      });
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-lg">❌ لا توجد منتجات مطابقة</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>📦</span>
        المنتجات المتاحة ({products.length})
      </h3>
      
      <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
        {products.map((product) => {
          const currentQty = quantities[product.productName] || 0;
          const isValidQty = currentQty > 0 && currentQty <= product.availableQty;
          const isOutOfStock = product.availableQty === 0;

          return (
            <div
              key={product.productName}
              className={`bg-white p-4 rounded-lg border-2 transition-all duration-200 
                         ${isOutOfStock ? 'border-red-200 bg-red-50 opacity-60' : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'}`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* معلومات المنتج */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {product.productName}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">المجموعة:</span>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                        {product.group}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">المتاح:</span>
                      <span className={`font-semibold ${
                        product.availableQty < 10 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {product.availableQty}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">السعر:</span>
                      <span className="text-indigo-600 font-bold">
                        {product.unitPrice.toLocaleString('en-US')} IQD
                      </span>
                    </span>
                  </div>
                </div>

                {/* إدخال الكمية وزر الإضافة */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={product.availableQty}
                    value={currentQty || ''}
                    onChange={(e) => handleQuantityChange(product.productName, e.target.value)}
                    placeholder="الكمية"
                    disabled={isOutOfStock}
                    className={`w-20 px-2 py-2 border-2 rounded-lg text-center 
                               focus:ring-2 focus:ring-indigo-200 transition-all
                               ${isOutOfStock ? 'bg-gray-100 cursor-not-allowed' : 
                                 currentQty > product.availableQty ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    onClick={() => handleAdd(product)}
                    disabled={!isValidQty || isOutOfStock}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
                               ${isValidQty && !isOutOfStock
                                 ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {isOutOfStock ? 'نفذ' : 'إضافة'}
                  </button>
                </div>
              </div>

              {/* تحذير إذا تجاوزت الكمية المتاحة */}
              {currentQty > product.availableQty && !isOutOfStock && (
                <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  ⚠️ الكمية المطلوبة تتجاوز المخزون المتاح
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
