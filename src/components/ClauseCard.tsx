import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  IndianRupee,
  Award,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Clause } from '../types/contract';

interface ClauseCardProps {
  clause: Clause;
  onOpenCompareModal: (clause: Clause) => void;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({
  clause,
  onOpenCompareModal,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const formatCategoryBadge = (category: string) => {
    switch (category) {
      case 'technical_requirement':
        return 'TECHNICAL SPEC';
      case 'assignment_rules':
        return 'ASSIGNMENT RULE';
      case 'submission_deadline':
        return 'DEADLINE';
      case 'grading_criteria':
        return 'GRADING CRITERIA';
      case 'penalties':
        return 'PENALTY / DEDUCTION';
      case 'legal':
        return 'TERMS & RULES';
      case 'working_hours':
        return 'TIMELINE / HOURS';
      case 'payouts':
        return 'PAYOUTS';
      case 'deactivation':
        return 'DEACTIVATION';
      case 'insurance':
        return 'INSURANCE';
      case 'equipment':
        return 'GEAR & SETUP';
      case 'general':
      default:
        return category.replace(/_/g, ' ').toUpperCase();
    }
  };

  const isAcademicImpact = Boolean(
    clause.financialImpact &&
    /(mark|grade|score|point|academic|exam|lab)/i.test(clause.financialImpact)
  );

  const isCurrencyImpact = Boolean(
    clause.financialImpact &&
    /(₹|rs|inr|rupee|\$|fine|fee)/i.test(clause.financialImpact) &&
    !isAcademicImpact
  );

  const styles = {
    RISK: {
      tagBg: 'bg-[#DC2626] text-white',
      borderLeft: 'border-l-4 border-l-[#DC2626]',
      quoteBg: 'bg-rose-950/30 text-slate-100 border-l-2 border-l-[#DC2626]',
      label: 'IMPORTANT / RISK',
    },
    CAUTION: {
      tagBg: 'bg-[#D97706] text-slate-950 font-black',
      borderLeft: 'border-l-4 border-l-[#D97706]',
      quoteBg: 'bg-amber-950/30 text-slate-100 border-l-2 border-l-[#D97706]',
      label: 'REQUIREMENT',
    },
    SAFE: {
      tagBg: 'bg-[#059669] text-white',
      borderLeft: 'border-l-4 border-l-[#059669]',
      quoteBg: 'bg-emerald-950/30 text-slate-100 border-l-2 border-l-[#059669]',
      label: 'STANDARD',
    },
  }[clause.riskLevel];

  return (
    <div
      className={`civic-card p-3.5 sm:p-5 rounded-xs transition-all mb-3.5 ${styles.borderLeft}`}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5 font-mono text-xs">
            {/* Risk / Severity Tag */}
            <span
              className={`px-1.5 py-0.2 rounded-2xs font-bold uppercase tracking-wider text-[10px] ${styles.tagBg}`}
            >
              {styles.label}
            </span>

            {/* Document Context Category Badge (Not forced into 'LEGAL') */}
            <span className="font-bold uppercase text-[10px] text-slate-300 bg-[#1E293B] border border-slate-700 px-1.5 py-0.2 rounded-2xs">
              {formatCategoryBadge(clause.category)}
            </span>

            {/* Impact / Grading Badge */}
            {clause.financialImpact && (
              <span className="inline-flex items-center gap-1 font-bold text-[11px] text-slate-200 bg-[#0E1626] border border-slate-700 px-1.5 py-0.2 rounded-2xs">
                {isCurrencyImpact ? (
                  <IndianRupee className="w-3 h-3 text-[#DC2626]" />
                ) : isAcademicImpact ? (
                  <Award className="w-3 h-3 text-[#FF7700]" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-[#F59E0B]" />
                )}
                <span>{clause.financialImpact}</span>
              </span>
            )}
          </div>

          <h4 className="font-heading font-black text-sm sm:text-base text-white leading-snug">
            {clause.title}
          </h4>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-2xs border border-slate-700 hover:bg-slate-800 cursor-pointer shrink-0 text-slate-300"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 space-y-2.5 pt-2.5 border-t border-slate-800 text-xs sm:text-sm">
          {/* Plain Meaning */}
          <p className="text-slate-200 leading-normal font-medium">
            {clause.plainExplanation}
          </p>

          {/* Analogy */}
          {clause.analogy && (
            <div className="p-2 sm:p-2.5 rounded-2xs border border-dashed border-amber-600/60 bg-amber-950/20 text-xs">
              <span className="font-bold text-[#FBBF24] mr-1">Analogy:</span>
              <span className="italic text-slate-300">"{clause.analogy}"</span>
            </div>
          )}

          {/* Verbatim Quote */}
          <div className={`p-2 sm:p-2.5 rounded-2xs text-[11px] font-mono italic leading-relaxed ${styles.quoteBg}`}>
            "{clause.originalText}"
          </div>

          {/* Action Precaution Bar */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-start gap-1.5 text-slate-400">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF7700] shrink-0 mt-0.5" />
              <span><strong className="text-white">Action: </strong>{clause.actionableTip}</span>
            </div>

            <button
              onClick={() => onOpenCompareModal(clause)}
              className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#FF7700] hover:underline shrink-0 cursor-pointer self-end sm:self-auto"
            >
              <span>Side-by-Side</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
