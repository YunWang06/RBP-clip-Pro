import React, { useState } from 'react';
import { CELL_LINES, METHODS, TARGET_TYPES } from '../constants';
import { FilterState, FilterCategory } from '../types';
import { Search, ChevronRight, Check } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  onToggleFilter: (category: FilterCategory, value: string) => void;
  onClearCategory: (category: FilterCategory) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ filters, onToggleFilter, onClearCategory }) => {
  const [cellLineSearch, setCellLineSearch] = useState('');

  const filteredCellLines = CELL_LINES.filter(line => 
    line.toLowerCase().includes(cellLineSearch.toLowerCase())
  );

  const renderSectionHeader = (title: string, category: FilterCategory) => (
    <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-l-4 border-blue-500 pl-3">
            {title}
        </h3>
        {filters[category].length > 0 && (
            <button 
                onClick={() => onClearCategory(category)}
                className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
            >
                重置
            </button>
        )}
    </div>
  );

  const renderCheckboxItem = (label: string, category: FilterCategory) => {
    const isChecked = filters[category].includes(label);
    return (
      <li key={label} className="mb-2">
        <label className={`flex items-center cursor-pointer p-2 rounded-md transition-colors ${isChecked ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
          <div className={`w-4 h-4 mr-3 flex items-center justify-center border rounded ${isChecked ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
             {isChecked && <Check size={12} className="text-white" />}
             {/* Hidden checkbox for semantic accessible behavior */}
             <input 
               type="checkbox" 
               className="hidden" 
               checked={isChecked} 
               onChange={() => onToggleFilter(category, label)} 
             />
          </div>
          <span className={`text-sm ${isChecked ? 'font-medium text-blue-700' : 'text-slate-600'}`}>{label}</span>
        </label>
      </li>
    );
  };

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden shrink-0 shadow-lg z-10">
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        
        {/* Section 1: RBP-Target */}
        <div className="mb-8">
          {renderSectionHeader('1. RBP-TARGET', 'targets')}
          <ul className="space-y-1">
            {TARGET_TYPES.map(type => renderCheckboxItem(type, 'targets'))}
          </ul>
        </div>

        {/* Section 2: Cell Line */}
        <div className="mb-8">
          {renderSectionHeader(`2. 细胞系 (${CELL_LINES.length})`, 'cellLines')}
          
          {/* Internal Search Box for Cell Lines */}
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search cell line..." 
              value={cellLineSearch}
              onChange={(e) => setCellLineSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>

          <ul className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {filteredCellLines.map(line => renderCheckboxItem(line, 'cellLines'))}
            {filteredCellLines.length === 0 && (
                <li className="text-xs text-slate-400 italic text-center py-2">无匹配细胞系</li>
            )}
          </ul>
        </div>

        {/* Section 3: CLIP-seq Data */}
        <div className="mb-8">
           {renderSectionHeader('3. CLIP-seq 实验类型', 'methods')}
          <ul className="space-y-1">
            {METHODS.map(method => renderCheckboxItem(method, 'methods'))}
          </ul>
        </div>

      </div>
    </aside>
  );
};
