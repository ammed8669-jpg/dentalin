import { User, MapPin, Phone } from 'lucide-react';
import { CustomerInfo } from '../types';

/**
 * مكون نموذج معلومات العميل
 * يسمح بإدخال اسم وعنوان ورقم هاتف العميل
 */

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onUpdate: (info: CustomerInfo) => void;
}

export default function CustomerInfoForm({ customerInfo, onUpdate }: CustomerInfoFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-indigo-600" />
        معلومات العميل
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* اسم العميل */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            اسم العميل
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => onUpdate({ ...customerInfo, name: e.target.value })}
              className="w-full pr-3 pl-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-right"
              placeholder="أدخل اسم العميل"
            />
          </div>
        </div>

        {/* رقم الهاتف */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            رقم الهاتف
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Phone className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => onUpdate({ ...customerInfo, phone: e.target.value })}
              className="w-full pr-3 pl-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-right"
              placeholder="07XX XXX XXXX"
              dir="ltr"
            />
          </div>
        </div>

        {/* العنوان */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 text-right">
            العنوان
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={customerInfo.address}
              onChange={(e) => onUpdate({ ...customerInfo, address: e.target.value })}
              className="w-full pr-3 pl-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-right"
              placeholder="أدخل العنوان"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
