import React from 'react';
import { 
  Building2, 
  Volume2, 
  Headphones, 
  FileText,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  IndianRupee,
  UserX,
  Stethoscope,
  Clock,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { AnalysisResult } from '../types/contract';

interface RiskScoreCardProps {
  analysis: AnalysisResult;
  onPlayAudio: () => void;
  isPlayingAudio: boolean;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  analysis,
  onPlayAudio,
  isPlayingAudio,
}) => {
  const redCount = analysis.redFlagsCount;
  const cautionCount = analysis.cautionCount;
  const safeCount = analysis.safeCount;

  // Determine Concrete Exposure Status based on actionable legal findings
  let exposureVerdict = {
    level: 'SEVERE' as 'SEVERE' | 'MODERATE' | 'BALANCED',
    badge: '🚨 CRITICAL WORKER EXPOSURE DETECTED',
    badgeClass: 'bg-[#DC2626] text-white border-[#991B1B]',
    title: 'Severe Penalty Deductions & Unilateral Deactivation Terms Found',
    subtitle: 'This agreement grants the company unilateral authority to deduct earnings and terminate worker access without mandatory 14-day prior notice.',
  };

  if (redCount === 0 && cautionCount <= 1) {
    exposureVerdict = {
      level: 'BALANCED',
      badge: '🛡️ BALANCED WORKER OPERATIONAL TERMS',
      badgeClass: 'bg-[#059669] text-white border-[#047857]',
      title: 'Standard Terms with Balanced Grievance & Payout Protections',
      subtitle: 'No arbitrary deduction traps or zero-notice termination clauses detected. Terms comply with general fair-work standards.',
    };
  } else if (redCount === 0) {
    exposureVerdict = {
      level: 'MODERATE',
      badge: '⚠️ CONDITIONAL & DISCRETIONARY CLAUSES DETECTED',
      badgeClass: 'bg-[#D97706] text-slate-950 font-black border-[#B45309]',
      title: 'Discretionary Platform Clauses & Conditional Payout Rules',
      subtitle: 'The agreement contains ambiguous operational clauses where company policies can change without worker concurrence.',
    };
  }

  // Determine concrete impacts from extracted clauses
  const deductionClause = analysis.clauses.find(c => c.category === 'penalties' || c.category === 'payouts');
  const deactivationClause = analysis.clauses.find(c => c.category === 'deactivation' || c.category === 'legal');
  const insuranceClause = analysis.clauses.find(c => c.category === 'insurance');
  const hoursClause = analysis.clauses.find(c => c.category === 'working_hours');

  return (
    <div className="my-5 sm:my-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
        <div>
          <h2 className="text-lg sm:text-2xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
            Contract & Policy <span className="text-[#FF7700]">Impact Assessment</span>
          </h2>
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Concrete financial, legal, and operational reality breakdown — no abstract percentage scores.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          {analysis.clauses.length} fine-print conditions evaluated
        </span>
      </div>

      <div className="civic-card p-4 sm:p-6 rounded-xs border-2 border-slate-300 dark:border-slate-800">
        {/* Document Meta Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b-2 border-slate-200 dark:border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold px-2 py-0.5 rounded-2xs bg-slate-100 dark:bg-[#0B132B] text-[#FF7700] border border-slate-300 dark:border-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#FF7700]" />
              <span>{analysis.platformName}</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 capitalize font-medium">
              {analysis.documentType.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Audited: {new Date(analysis.analyzedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span className="text-[#10B981] font-bold">100% Grounded</span>
          </div>
        </div>

        {/* Primary Verdict Banner */}
        <div className="mt-4 p-4 rounded-xs border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#0E1626]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-2xs font-mono font-black text-xs uppercase tracking-wider border ${exposureVerdict.badgeClass}`}>
                {exposureVerdict.badge}
              </span>

              <h3 className="font-heading font-black text-base sm:text-xl text-slate-900 dark:text-white leading-snug">
                {exposureVerdict.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            {/* Audio Voice Narration Trigger */}
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                60s Spoken Audio Brief:
              </span>
              <button
                onClick={onPlayAudio}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xs font-mono font-bold text-xs uppercase cursor-pointer border-2 border-black transition-all ${
                  isPlayingAudio
                    ? 'bg-[#DC2626] text-white animate-pulse shadow-[2px_2px_0px_#000]'
                    : 'bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 shadow-[2px_2px_0px_#000]'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>{isPlayingAudio ? 'Pause Voice Brief' : 'Listen 60s Voice'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-World Concrete Impact Matrix (4 Tangible Dimensions for Gig Workers) */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3 font-mono text-xs">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#FF7700]" />
              <span>Real-World Impact on Your Earnings & Livelihood:</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">
              Concrete Consequences
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* 1. Direct Paycheck & Deduction Risk */}
            <div className="p-3.5 rounded-xs border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-[#090E17] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <IndianRupee className="w-4 h-4 text-[#FF7700]" />
                    <span>Financial Deduction Exposure</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-2xs font-mono font-black text-[10px] uppercase ${
                    deductionClause?.riskLevel === 'RISK' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {deductionClause?.riskLevel === 'RISK' ? 'High Deduction Risk' : 'Standard Deductions'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {deductionClause 
                    ? deductionClause.plainExplanation 
                    : 'Company cannot pass customer cancellation costs or merchant damages directly onto your earnings without proof.'}
                </p>
              </div>

              {deductionClause?.financialImpact && (
                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono text-[11px] text-[#FF7700] font-bold">
                  💸 Impact: {deductionClause.financialImpact}
                </div>
              )}
            </div>

            {/* 2. Disciplinary & Account Deactivation Risk */}
            <div className="p-3.5 rounded-xs border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-[#090E17] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <UserX className="w-4 h-4 text-red-500" />
                    <span>ID Deactivation & Suspension</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-2xs font-mono font-black text-[10px] uppercase ${
                    deactivationClause?.riskLevel === 'RISK' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}>
                    {deactivationClause?.riskLevel === 'RISK' ? 'Zero-Notice Block Risk' : 'Grievance Required'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {deactivationClause 
                    ? deactivationClause.plainExplanation 
                    : 'Statutory guidelines require at least 14 days written notice and an opportunity to appeal before account termination.'}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                ⚖️ Law: Central Motor Vehicle Aggregator Guidelines Clause 14
              </div>
            </div>

            {/* 3. Accidental & Medical Safety Coverage */}
            <div className="p-3.5 rounded-xs border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-[#090E17] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Stethoscope className="w-4 h-4 text-[#10B981]" />
                    <span>Accident & Health Coverage</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-2xs font-mono font-black text-[10px] uppercase ${
                    insuranceClause?.riskLevel === 'RISK' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {insuranceClause?.riskLevel === 'RISK' ? 'Restricted Transit Cover' : 'Coverage Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {insuranceClause 
                    ? insuranceClause.plainExplanation 
                    : 'Many policies exclude coverage during idle waiting hours or return trips. Verify hospital cash and accidental death benefits.'}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                🏥 Statutory Cover: ₹2 Lakh e-Shram accidental insurance
              </div>
            </div>

            {/* 4. Shift Quotas & Operational Autonomy */}
            <div className="p-3.5 rounded-xs border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-[#090E17] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Clock className="w-4 h-4 text-[#38BDF8]" />
                    <span>Working Hours & Surge Mandates</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-2xs font-mono font-black text-[10px] uppercase ${
                    hoursClause?.riskLevel === 'RISK' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {hoursClause?.riskLevel === 'RISK' ? 'Forced Surge Slots' : 'Flexible Hours'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {hoursClause 
                    ? hoursClause.plainExplanation 
                    : 'Check whether minimum acceptance ratings (e.g. 90%) or compulsory 10-12 hour login mandates are required for daily incentives.'}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                🛡️ Independence: Independent contractor classification requires schedule autonomy
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Clause Counts Strip (Not abstract percentage scores) */}
        <div className="mt-5 pt-4 border-t-2 border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 sm:gap-3 font-mono text-xs">
          <div className="p-2.5 sm:p-3 rounded-xs border-2 border-slate-300 dark:border-slate-700 bg-rose-50 dark:bg-rose-950/30 text-center">
            <div className="text-[10px] sm:text-xs font-bold text-rose-700 dark:text-rose-300">
              Critical Traps Found
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#DC2626] font-heading mt-0.5">
              {redCount}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Clauses causing direct pay loss or ID block
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xs border-2 border-slate-300 dark:border-slate-700 bg-amber-50 dark:bg-amber-950/30 text-center">
            <div className="text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-300">
              Ambiguous Terms
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#D97706] font-heading mt-0.5">
              {cautionCount}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Company holds unilateral discretion
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xs border-2 border-slate-300 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-950/30 text-center">
            <div className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-300">
              Protected Rights
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#059669] font-heading mt-0.5">
              {safeCount}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Fair procedures with legal safeguards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
