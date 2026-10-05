import React from 'react';
import { Filter, AlertTriangle } from 'lucide-react';
import { RiskLevel, ClauseCategory } from '../types/contract';

interface FilterBarProps {
  selectedRisk: RiskLevel | 'ALL';
  onSelectRisk: (risk: RiskLevel | 'ALL') => void;
  selectedCategory: ClauseCategory | 'ALL';
  onSelectCategory: (cat: ClauseCategory | 'ALL') => void;
  totalCount: number;
  riskCount: number;
  cautionCount: number;
  safeCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedRisk,
  onSelectRisk,
  selectedCategory,
  onSelectCategory,
  totalCount,
  riskCount,
  cautionCount,
  safeCount,
}) => {
  const categories: { key: ClauseCategory | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'All Categories' },
    { key: 'technical_requirement', label: 'Technical Specs' },
    { key: 'assignment_rules', label: 'Assignment Rules' },
    { key: 'submission_deadline', label: 'Deadlines' },
    { key: 'grading_criteria', label: 'Grading Criteria' },
    { key: 'penalties', label: 'Penalties & Fines' },
    { key: 'legal', label: 'Terms & Compliance' },
    { key: 'payouts', label: 'Payouts & Deductions' },
    { key: 'deactivation', label: 'ID Deactivation' },
    { key: 'insurance', label: 'Accident & Health' },
    { key: 'working_hours', label: 'Hours & Timeline' },
    { key: 'equipment', label: 'Gear & Kit' },
    { key: 'general', label: 'General Guidelines' },
  ];

  return (
    <div className="civic-card p-2.5 sm:p-3.5 rounded-xs mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono text-xs">
        {/* Risk Level Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3 text-[#FF7700]" />
            <span className="hidden xs:inline">Filter:</span>
          </span>

          <button
            onClick={() => onSelectRisk('ALL')}
            className={`px-2.5 py-1 rounded-2xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
              selectedRisk === 'ALL'
                ? 'bg-[#FF7700] text-slate-950 border-black shadow-[1px_1px_0px_#000]'
                : 'bg-[#111827] border-slate-700 text-slate-300 hover:bg-[#1E293B]'
            }`}
          >
            All ({totalCount})
          </button>

          <button
            onClick={() => onSelectRisk('RISK')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-2xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
              selectedRisk === 'RISK'
                ? 'bg-[#DC2626] text-white border-black shadow-[1px_1px_0px_#000]'
                : 'bg-[#111827] border-slate-700 text-[#DC2626] hover:bg-[#1E293B]'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Strict / Critical ({riskCount})</span>
          </button>

          <button
            onClick={() => onSelectRisk('CAUTION')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-2xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
              selectedRisk === 'CAUTION'
                ? 'bg-[#D97706] text-slate-950 border-black shadow-[1px_1px_0px_#000]'
                : 'bg-[#111827] border-slate-700 text-[#D97706] hover:bg-[#1E293B]'
            }`}
          >
            <span>Requirements ({cautionCount})</span>
          </button>

          <button
            onClick={() => onSelectRisk('SAFE')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-2xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
              selectedRisk === 'SAFE'
                ? 'bg-[#059669] text-white border-black shadow-[1px_1px_0px_#000]'
                : 'bg-[#111827] border-slate-700 text-[#059669] hover:bg-[#1E293B]'
            }`}
          >
            <span>Standard ({safeCount})</span>
          </button>
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <span className="text-slate-400">Category:</span>
          <div className="bg-[#111827] border-2 border-slate-700 px-2 py-0.5 rounded-2xs shadow-[1px_1px_0px_#000]">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value as any)}
              className="bg-transparent font-bold text-white focus:outline-hidden cursor-pointer text-xs"
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key} className="text-white bg-[#111827]">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
