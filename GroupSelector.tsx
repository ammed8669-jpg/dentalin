import React from 'react';

/**
 * مكون لاختيار المجموعة من قائمة منسدلة
 */
interface GroupSelectorProps {
  groups: string[];              // قائمة المجموعات المتاحة
  selectedGroup: string;         // المجموعة المحددة حالياً
  onGroupChange: (group: string) => void;  // دالة عند تغيير المجموعة
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  selectedGroup,
  onGroupChange
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        <span className="flex items-center gap-2">
          <span className="text-lg">🏷️</span>
          اختر المجموعة
        </span>
      </label>
      <select
        value={selectedGroup}
        onChange={(e) => onGroupChange(e.target.value)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg 
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                   transition-all duration-200 text-right cursor-pointer
                   hover:border-gray-300 shadow-sm"
      >
        <option value="">جميع المجموعات</option>
        {groups.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
    </div>
  );
};
