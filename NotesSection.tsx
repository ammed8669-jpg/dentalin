import { FileText } from 'lucide-react';

/**
 * مكون خانة الملاحظات
 * يسمح بإضافة ملاحظات على الفاتورة
 */

interface NotesSectionProps {
  notes: string;
  onUpdate: (notes: string) => void;
}

export default function NotesSection({ notes, onUpdate }: NotesSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        ملاحظات
      </h3>

      <textarea
        value={notes}
        onChange={(e) => onUpdate(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-right resize-none"
        placeholder="أضف أي ملاحظات إضافية للفاتورة..."
        rows={3}
      />
    </div>
  );
}
