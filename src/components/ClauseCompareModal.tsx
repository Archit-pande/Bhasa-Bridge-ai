import React from 'react';
import { X, Quote, Shield, IndianRupee, Award, AlertTriangle, Lightbulb } from 'lucide-react';
import { Clause } from '../types/contract';

interface ClauseCompareModalProps {
  clause: Clause | null;
  onClose: () => void;
}

export const ClauseCompareModal: React.FC<ClauseCompareModalProps> = ({
  clause,
  onClose,
}) => {
  if (!clause) return null;

  const isAcademicImpact = Boolean(
    clause.financialImpact &&
    /(mark|grade|score|point|academic|exam|lab)/i.test(clause.financialImpact)
  );

  const isCurrencyImpact = Boolean(
    clause.financialImpact &&
    /(₹|rs|inr|rupee|\$|fine|fee)/i.test(clause.financialImpact) &&
    !isAcademicImpact
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#0B132B] text-white rounded-xs max-w-2xl w-full p-5 sm:p-7 border-2 border-slate-700 shadow-[6px_6px_0px_#000] relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xs border border-slate-700 bg-[#172545] hover:bg-[#203258] text-white shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2 font-mono text-xs">
          <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#FF7700] text-slate-950 border border-black shadow-[1px_1px_0px_#000]">
            Side-by-Side Breakdown
          </span>
          <span className="font-bold text-slate-400 uppercase">
            {clause.category.replace(/_/g, ' ')}
          </span>
        </div>

        <h3 className="font-heading font-black text-lg sm:text-2xl text-white pr-8">
          {clause.title}
        </h3>

        {/* Side-by-Side Boxes */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: What Document Wrote */}
          <div className="p-4 rounded-xs border-2 border-slate-700 bg-[#0E1626] shadow-[3px_3px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-[#FF7700]" />
                <span>Original Verbatim Text:</span>
              </div>
              <p className="text-xs font-mono text-slate-300 italic leading-relaxed">
                "{clause.originalText}"
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] text-slate-500">
              Extracted directly from the source file.
            </div>
          </div>

          {/* Right: What It Actually Means */}
          <div className="p-4 rounded-xs border-2 border-slate-700 bg-[#0E1626] shadow-[3px_3px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Plain Meaning:</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                {clause.plainExplanation}
              </p>

              {clause.analogy && (
                <div className="mt-3 p-2.5 rounded-xs border border-amber-500/30 bg-amber-950/20 flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong className="text-[#F59E0B]">Analogy:</strong> "{clause.analogy}"
                  </p>
                </div>
              )}
            </div>

            {clause.financialImpact && (
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1.5 font-mono text-xs font-bold text-[#FF7700]">
                {isCurrencyImpact ? (
                  <IndianRupee className="w-3.5 h-3.5 text-[#DC2626]" />
                ) : isAcademicImpact ? (
                  <Award className="w-3.5 h-3.5 text-[#FF7700]" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                )}
                <span>Impact: {clause.financialImpact}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Tip */}
        <div className="mt-4 p-4 rounded-xs border-2 border-dashed border-amber-600/50 bg-amber-950/20 shadow-[2px_2px_0px_#000]">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Recommended Precaution / Action Tip:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            {clause.actionableTip}
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xs font-mono font-bold text-xs uppercase bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
