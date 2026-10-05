import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckSquare, 
  GraduationCap, 
  Printer, 
  MessageCircle, 
  Check, 
  FileCode,
  Scale
} from 'lucide-react';
import { AnalysisResult } from '../types/contract';

interface AdvocateGuidanceProps {
  analysis: AnalysisResult;
}

export const AdvocateGuidance: React.FC<AdvocateGuidanceProps> = ({ analysis }) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'checklist' | 'policies'>('questions');

  const isAcademic = analysis.documentType === 'academic_assignment';
  const isTechnical = analysis.documentType === 'technical_document';
  const isNonContract = isAcademic || isTechnical || analysis.documentType === 'other';

  const handleCopySummary = () => {
    const exposureStatus = analysis.redFlagsCount > 0 ? 'CRITICAL EXPOSURE (Red Flags Found)' : analysis.cautionCount > 0 ? 'CAUTION (Conditional Terms)' : 'BALANCED (Protected)';
    const text = isAcademic
      ? `📋 *Bhasha Bridge Academic Assignment Report*\n\nDocument: ${analysis.documentTitle}\nStatus: ${exposureStatus}\n\n📌 Key Tasks:\n${analysis.clauses.map(c => `• ${c.title}`).join('\n')}\n\n❓ Questions to clarify with Instructor:\n${analysis.workerQuestionsToAsk.map((q) => `• ${q}`).join('\n')}\n\n_Decoded with Bhasha Bridge AI_`
      : `📋 *Bhasha Bridge Gig Worker Contract Audit*\n\nPlatform: ${analysis.platformName}\nDocument: ${analysis.documentTitle}\nProtection Status: ${exposureStatus}\n\n🚨 Critical Traps: ${analysis.redFlagsCount}\n⚠️ Ambiguous Terms: ${analysis.cautionCount}\n🛡️ Protected Clauses: ${analysis.safeCount}\n\n🔍 Impact Summary:\n${analysis.summary}\n\n❓ Action Questions for Platform Manager:\n${analysis.workerQuestionsToAsk.map((q) => `• ${q}`).join('\n')}\n\n_Decoded with Bhasha Bridge AI_`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="my-5 sm:my-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-lg sm:text-2xl font-black font-heading tracking-tight text-white">
          {isAcademic ? (
            <>Submission <span className="text-[#FF7700]">Guidance & Checklist</span></>
          ) : (
            <>Action <span className="text-[#FF7700]">Toolkit</span></>
          )}
        </h2>
        <span className="font-mono text-xs text-slate-400">
          {isAcademic ? 'Academic checklist & questions' : 'Protective questions & statutory rights'}
        </span>
      </div>

      <div className="civic-card p-3.5 sm:p-6 rounded-xs">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b-2 border-slate-800">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-bold">
              {isAcademic 
                ? 'Recommended Next Steps for Students' 
                : 'Next Steps for Independent Contractors'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs w-full sm:w-auto">
            <button
              onClick={handleCopySummary}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xs font-bold border-2 border-black transition-all cursor-pointer ${
                copiedSummary
                  ? 'bg-[#10B981] text-slate-950'
                  : 'bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 shadow-[1px_1px_0px_#000]'
              }`}
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied' : 'Share Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xs font-bold text-white bg-[#1E293B] hover:bg-[#2A3B54] border-2 border-slate-700 cursor-pointer shadow-[1px_1px_0px_#000]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 sm:gap-2 border-b-2 border-slate-800 mt-3 pb-2.5 overflow-x-auto font-mono text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-2xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'questions'
                ? 'bg-[#FF7700] text-slate-950 border-black'
                : 'bg-[#111827] text-slate-300 border-slate-700 hover:bg-[#1E293B]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-current" />
            <span>
              {isAcademic ? 'Questions for Instructor' : 'Questions to Ask'} ({analysis.workerQuestionsToAsk.length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-2xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'checklist'
                ? 'bg-[#FF7700] text-slate-950 border-black'
                : 'bg-[#111827] text-slate-300 border-slate-700 hover:bg-[#1E293B]'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-current" />
            <span>{isAcademic ? 'Pre-Submission Checklist' : 'Action Checklist'}</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-2xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'policies'
                ? 'bg-[#FF7700] text-slate-950 border-black'
                : 'bg-[#111827] text-slate-300 border-slate-700 hover:bg-[#1E293B]'
            }`}
          >
            {isAcademic ? <GraduationCap className="w-3.5 h-3.5 text-current" /> : <Scale className="w-3.5 h-3.5 text-current" />}
            <span>{isAcademic ? 'Academic Guidelines' : 'Statutory Rights'}</span>
          </button>
        </div>

        {/* Tab 1: Questions */}
        {activeTab === 'questions' && (
          <div className="mt-3.5 space-y-2">
            {analysis.workerQuestionsToAsk.map((q, idx) => (
              <div
                key={idx}
                className="p-2.5 sm:p-3 rounded-xs border border-slate-700 bg-[#0E1626] flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-2xs bg-[#FF7700] text-slate-950 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-xs sm:text-sm text-white leading-snug">
                    {q}
                  </p>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                    {isAcademic 
                      ? 'Clarify with your course instructor, TA, or batch group.' 
                      : 'Ask in writing on WhatsApp or email for proof.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Checklist */}
        {activeTab === 'checklist' && (
          <div className="mt-3.5 space-y-2">
            {(isAcademic ? [
              { title: 'Test execution permissions (chmod +x script.sh)', desc: 'Ensure scripts are executable before uploading to evaluation portal.' },
              { title: 'Check edge cases (empty folders, missing arguments, non-root users)', desc: 'Unhandled edge conditions frequently trigger automated test failures.' },
              { title: 'Verify shebang header (#!/bin/bash)', desc: 'Standard interpreter line avoids syntax errors on automated grading servers.' },
              { title: 'Keep backup timestamped copies of your work', desc: 'Retain code snapshots in case of submission portal server crashes or timeouts.' },
            ] : [
              { title: 'Check emergency SOS numbers before riding in rain', desc: 'Confirm platform accident helpline and partnered hospital list.' },
              { title: 'Tap "Merchant Delay" if order packing takes >3 minutes', desc: 'Freezes your countdown timer so late penalties do not apply.' },
              { title: 'Verify kit deposit deductions stop after 4 installments', desc: 'Review Tuesday settlement statement to avoid recurring gear fees.' },
              { title: 'Keep screenshots of customer disputes or chat abuse', desc: 'Required to appeal wallet deductions or unfair low ratings.' },
            ]).map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xs border border-slate-800 bg-[#0E1626] flex items-start gap-2 text-xs"
              >
                <div className="w-4 h-4 rounded-2xs bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white">{item.title}</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Policies / Rights */}
        {activeTab === 'policies' && (
          <div className="mt-3.5 space-y-2.5 text-xs">
            {isAcademic ? (
              <>
                <div className="p-3 rounded-xs border-l-4 border-l-[#FF7700] bg-[#0E1626]">
                  <h4 className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-[#FF7700]" />
                    <span>Academic Code Integrity & Plagiarism Standards</span>
                  </h4>
                  <p className="text-slate-300 leading-normal">
                    Scripts must be original implementations. Plagiarized scripts, copy-pasting from peers, or uncredited repositories lead to zero marks or academic inquiry.
                  </p>
                </div>

                <div className="p-3 rounded-xs border-l-4 border-l-[#10B981] bg-[#0E1626]">
                  <h4 className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Submission Portal Grace Period & Dispute Policy</span>
                  </h4>
                  <p className="text-slate-300 leading-normal">
                    If technical portal errors or network outages occur near 5:00 PM, take timestamped terminal screenshots immediately to request formal deadline review from course staff.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 rounded-xs border-l-4 border-l-[#F59E0B] bg-[#0E1626]">
                  <h4 className="font-bold text-white mb-0.5">
                    Social Security Code 2020 (Gig Workers Chapter)
                  </h4>
                  <p className="text-slate-300 leading-normal">
                    Aggregators must contribute 1-2% of annual turnover towards social security funds covering life & disability insurance.
                  </p>
                </div>

                <div className="p-3 rounded-xs border-l-4 border-l-[#DC2626] bg-[#0E1626]">
                  <h4 className="font-bold text-white mb-0.5">
                    Section 27, Indian Contract Act (Non-Compete Limit)
                  </h4>
                  <p className="text-slate-300 leading-normal">
                    Contract clauses restricting workers from providing independent services within 5km after leaving an app are void under Indian law.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
