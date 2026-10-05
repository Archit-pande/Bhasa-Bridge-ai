import React from 'react';
import { 
  Building2, 
  Volume2, 
  Headphones, 
  GraduationCap, 
  FileCode, 
  FileText 
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
  const score = analysis.safetyScore;
  const isAcademic = analysis.documentType === 'academic_assignment';
  const isTechnical = analysis.documentType === 'technical_document';
  const isNonContract = isAcademic || isTechnical || analysis.documentType === 'other';

  let verdict = {
    badge: isAcademic ? 'STRICT RULES' : isNonContract ? 'ATTENTION REQUIRED' : 'HIGH RISK',
    badgeBg: 'bg-[#DC2626] text-white',
    title: isAcademic 
      ? 'Strict Assignment Deadlines & Grading Penalties Found' 
      : isNonContract 
      ? 'Key Specifications & Directives Found' 
      : 'Critical Traps & Deactivation Risks Found',
  };

  if (score >= 70) {
    verdict = {
      badge: isAcademic ? 'CLEAR ASSIGNMENT' : isNonContract ? 'BALANCED' : 'FAIR TERMS',
      badgeBg: 'bg-[#059669] text-white',
      title: isAcademic 
        ? 'Standard Lab Submission & Practical Requirements' 
        : isNonContract 
        ? 'Standard Operational Specifications' 
        : 'Standard Terms with Balanced Worker Rights',
    };
  } else if (score >= 50) {
    verdict = {
      badge: isAcademic ? 'KEY REQUIREMENTS' : isNonContract ? 'IMPORTANT' : 'CAUTION',
      badgeBg: 'bg-[#D97706] text-slate-950 font-black',
      title: isAcademic 
        ? 'Important Coding Guidelines & Submission Policies' 
        : isNonContract 
        ? 'Guidelines & Operational Conditions' 
        : 'Hidden Penalties & Minimum Obligations',
    };
  }

  const scoreLabel = isAcademic 
    ? 'Clarity & Rules Score' 
    : isNonContract 
    ? 'Fairness Score' 
    : 'Safety Score';

  const redPillLabel = isAcademic ? 'Strict Rules' : isNonContract ? 'Important Rules' : 'Red Flags';
  const amberPillLabel = isAcademic ? 'Guidelines' : isNonContract ? 'Conditions' : 'Cautions';
  const greenPillLabel = isAcademic ? 'Standard Tasks' : isNonContract ? 'Standard Rules' : 'Safe Terms';

  return (
    <div className="my-5 sm:my-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-lg sm:text-2xl font-black font-heading tracking-tight text-white">
          {isAcademic ? (
            <>Assignment <span className="text-[#FF7700]">Breakdown</span></>
          ) : (
            <>Document <span className="text-[#FF7700]">Verdict</span></>
          )}
        </h2>
        <span className="font-mono text-xs text-slate-400">
          {analysis.clauses.length} items analyzed
        </span>
      </div>

      <div className="civic-card p-3.5 sm:p-6 rounded-xs">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold px-2 py-0.5 rounded-2xs bg-[#0B132B] text-[#FF7700] border border-slate-700 flex items-center gap-1.5">
              {isAcademic ? <GraduationCap className="w-3.5 h-3.5 text-[#FF7700]" /> : isTechnical ? <FileCode className="w-3.5 h-3.5 text-[#FF7700]" /> : <FileText className="w-3.5 h-3.5 text-[#FF7700]" />}
              <span>{analysis.platformName}</span>
            </span>
            <span className="text-slate-400 capitalize font-medium">
              {analysis.documentType.replace('_', ' ')}
            </span>
          </div>

          <span className="text-slate-400 text-[11px]">
            {new Date(analysis.analyzedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Score & Verdict Row */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-center">
          {/* Score Box */}
          <div className="lg:col-span-4 p-3.5 sm:p-4 rounded-xs bg-[#0E1626] border-2 border-slate-700 text-center">
            <div className="font-mono text-[11px] uppercase font-bold text-slate-400">
              {scoreLabel}
            </div>

            <div className="font-heading font-black text-4xl sm:text-5xl text-white tabular-nums tracking-tight my-1">
              {score}
              <span className="text-sm font-mono text-slate-400">/100</span>
            </div>

            {/* Segmented meter */}
            <div className="w-full bg-slate-800 h-2.5 rounded-2xs border border-slate-700 p-0.5 flex gap-0.5">
              {Array.from({ length: 15 }).map((_, i) => {
                const filled = (i + 1) * (100 / 15) <= score;
                return (
                  <div
                    key={i}
                    className={`flex-1 h-full rounded-3xs ${
                      filled
                        ? score < 50
                          ? 'bg-[#DC2626]'
                          : score < 70
                          ? 'bg-[#D97706]'
                          : 'bg-[#059669]'
                        : 'bg-transparent'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Verdict + Metrics */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <span className={`inline-block px-2 py-0.5 rounded-2xs font-mono font-black text-[11px] uppercase tracking-wider mb-1.5 ${verdict.badgeBg}`}>
                {verdict.badge}
              </span>

              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                {verdict.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-normal">
                {analysis.summary}
              </p>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mt-3.5 font-mono text-xs">
              <div className="p-2 sm:p-2.5 rounded-xs border-2 border-slate-700 bg-rose-950/30 text-center">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-300">{redPillLabel}</div>
                <div className="text-lg sm:text-xl font-black text-[#DC2626] font-heading">{analysis.redFlagsCount}</div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xs border-2 border-slate-700 bg-amber-950/30 text-center">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-300">{amberPillLabel}</div>
                <div className="text-lg sm:text-xl font-black text-[#D97706] font-heading">{analysis.cautionCount}</div>
              </div>

              <div className="p-2 sm:p-2.5 rounded-xs border-2 border-slate-700 bg-emerald-950/30 text-center">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-300">{greenPillLabel}</div>
                <div className="text-lg sm:text-xl font-black text-[#059669] font-heading">{analysis.safeCount}</div>
              </div>
            </div>

            {/* Audio Action Button */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-400">60-sec voice brief ready</span>
              <button
                onClick={onPlayAudio}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs font-mono font-bold text-xs uppercase cursor-pointer border-2 border-slate-900 ${
                  isPlayingAudio
                    ? 'bg-[#DC2626] text-white animate-pulse'
                    : 'bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 shadow-[2px_2px_0px_#000]'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? 'Pause Voice' : 'Play 60s Voice'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
