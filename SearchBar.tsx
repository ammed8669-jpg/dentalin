import React from 'react';

/**
 * مكون شريط البحث للبحث عن المنتجات
 */
interface SearchBarProps {
  searchTerm: string;                      // نص البحث الحالي
  onSearchChange: (term: string) => void;  // دالة عند تغيير نص البحث
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        <span className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          البحث عن منتج
        </span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث باسم المنتج..."
          className="w-full px-4 py-3 pr-12 bg-white border-2 border-gray-200 
                     rounded-lg focus:border-indigo-500 focus:ring-2 
                     focus:ring-indigo-200 transition-all duration-200 text-right
                     hover:border-gray-300 shadow-sm"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 
                        text-gray-400 pointer-events-none">
          🔍
        </div>
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 
                       text-gray-400 hover:text-gray-600 transition-colors"
            title="مسح البحث"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
