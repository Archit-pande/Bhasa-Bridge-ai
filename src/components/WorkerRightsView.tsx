import React, { useState } from 'react';
import { 
  Scale, 
  PhoneCall, 
  FileText, 
  Copy, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Send
} from 'lucide-react';

export const WorkerRightsView: React.FC = () => {
  const [copiedLetter, setCopiedLetter] = useState<boolean>(false);
  const [workerName, setWorkerName] = useState<string>('Rahul Kumar');
  const [platformName, setPlatformName] = useState<string>('Swiggy / Zomato');
  const [partnerId, setPartnerId] = useState<string>('RIDER-89211');
  const [disputeReason, setDisputeReason] = useState<string>('arbitrary_block');

  const getAppealLetter = () => {
    let specificParagraph = '';
    if (disputeReason === 'arbitrary_block') {
      specificParagraph = `My delivery partner ID was deactivated without the mandatory 14-day prior written notice or opportunity for an internal grievance hearing, which is in direct violation of statutory protections under Section 19 of the Platform Based Gig Workers Act and fair labor principles.`;
    } else if (disputeReason === 'weather_delay') {
      specificParagraph = `The deductions and late penalty fines levied on my account on the date of severe rainfall were unwarranted. Under occupational safety guidelines, delivery partners cannot be penalized for transit delays caused by force majeure weather conditions and severe waterlogging.`;
    } else {
      specificParagraph = `There is an unexplained deduction in my weekly payout settlement. As guaranteed under statutory transparency regulations, every delivery worker is entitled to an itemized transaction slip detailing every incentive deduction, customer refund chargeback, and platform commission.`;
    }

    return `To: Grievance Officer / Operations Lead
Company: ${platformName}
Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

Subject: Formal Grievance Appeal & Notice regarding ID ${partnerId} (${workerName})

Respected Sir/Madam,

I am writing this formal appeal as a registered delivery partner (${partnerId}). 

${specificParagraph}

I hereby request:
1. Immediate reinstatement of my delivery partner account or immediate refund of unauthorized deductions.
2. A full itemized audit trail and electronic evidence regarding the alleged violation.
3. An official grievance hearing with the internal dispute resolution committee within 7 working days.

Kindly acknowledge receipt of this formal communication.

Sincerely,
${workerName}
Partner ID: ${partnerId}
Contact: Available on registered mobile`;
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(getAppealLetter());
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b-2 border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-2xs bg-[#F59E0B] text-slate-950 font-mono font-black text-[10px] uppercase">
            Legal Defense & Recourse
          </span>
          <span className="font-mono text-xs text-slate-400">
            Based on Indian Labor Code & Gig Worker Enactments
          </span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black font-heading tracking-tight text-white">
          Worker Rights & <span className="text-[#F59E0B]">Legal Defense Guide</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Know your statutory protections, emergency SOS helplines, and generate instant legal grievance appeal notices for account blocks or deductions.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Right 1 */}
        <div className="civic-card p-4 sm:p-5 rounded-xs border-l-4 border-l-[#FF7700]">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-[#FF7700]">
            <span className="w-5 h-5 rounded-2xs bg-[#FF7700] text-slate-950 flex items-center justify-center font-black">1</span>
            <span>Right Against Silent Deactivation</span>
          </div>
          <h3 className="font-heading font-black text-base text-white mb-1.5">
            14-Day Mandatory Prior Notice
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Platforms cannot permanently terminate or shadow-ban delivery accounts without written electronic notification at least 14 days in advance, providing clear reasons and access to an internal appeal hearing.
          </p>
        </div>

        {/* Right 2 */}
        <div className="civic-card p-4 sm:p-5 rounded-xs border-l-4 border-l-[#10B981]">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-[#10B981]">
            <span className="w-5 h-5 rounded-2xs bg-[#10B981] text-slate-950 flex items-center justify-center font-black">2</span>
            <span>Algorithmic Transparency</span>
          </div>
          <h3 className="font-heading font-black text-base text-white mb-1.5">
            Itemized Payout Breakdown
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Platforms cannot deduct money under opaque "tech adjustment" labels. Workers have the statutory right to view exact calculation formulas for commissions, customer cancellations, and incentive multipliers.
          </p>
        </div>

        {/* Right 3 */}
        <div className="civic-card p-4 sm:p-5 rounded-xs border-l-4 border-l-[#38BDF8]">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-[#38BDF8]">
            <span className="w-5 h-5 rounded-2xs bg-[#38BDF8] text-slate-950 flex items-center justify-center font-black">3</span>
            <span>Social Security & Welfare</span>
          </div>
          <h3 className="font-heading font-black text-base text-white mb-1.5">
            e-Shram Universal Account & Insurance
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All gig workers in India are eligible for the Central Ministry of Labour's e-Shram portal with a 12-digit UAN card providing ₹2,00,000 accidental death/disability coverage and state welfare cess access.
          </p>
        </div>

        {/* Right 4 */}
        <div className="civic-card p-4 sm:p-5 rounded-xs border-l-4 border-l-[#EC4899]">
          <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-[#EC4899]">
            <span className="w-5 h-5 rounded-2xs bg-[#EC4899] text-slate-950 flex items-center justify-center font-black">4</span>
            <span>Weather & Hazard Immunity</span>
          </div>
          <h3 className="font-heading font-black text-base text-white mb-1.5">
            Exemption During Severe Rain / Curfews
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Under occupational safety principles, platforms cannot impose late delivery fines, rating drops, or order cancellation surcharges during extreme rainfall, waterlogging, or localized civic disruptions.
          </p>
        </div>
      </div>

      {/* Emergency Helpline Strip */}
      <div className="p-4 sm:p-5 rounded-xs border-2 border-dashed border-amber-600/70 bg-amber-950/20 shadow-[3px_3px_0px_#000]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-heading font-bold text-white text-sm sm:text-base flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-[#FF7700]" />
            <span>Emergency Grievance & Legal Helplines</span>
          </h3>
          <span className="font-mono text-[10px] text-amber-300 uppercase px-2 py-0.5 rounded-2xs bg-amber-900/50 border border-amber-700">
            Government of India
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xs bg-[#0E1626] border border-slate-800">
            <span className="text-slate-400 block text-[11px]">National Labour Helpline:</span>
            <strong className="text-white text-sm">1800-11-4000</strong>
            <span className="text-slate-500 block text-[10px] mt-0.5">Toll Free • Central Labor Comm.</span>
          </div>

          <div className="p-3 rounded-2xs bg-[#0E1626] border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Accident & Highway SOS:</span>
            <strong className="text-white text-sm">1033 / 108</strong>
            <span className="text-slate-500 block text-[10px] mt-0.5">Emergency Ambulance Dispatch</span>
          </div>

          <div className="p-3 rounded-2xs bg-[#0E1626] border border-slate-800">
            <span className="text-slate-400 block text-[11px]">e-Shram Portal Helpline:</span>
            <strong className="text-white text-sm">14434</strong>
            <span className="text-slate-500 block text-[10px] mt-0.5">Registration & UAN Card Support</span>
          </div>
        </div>
      </div>

      {/* Legal Appeal Notice Generator */}
      <div className="civic-card p-4 sm:p-6 rounded-xs">
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF7700]" />
              <span>Instant Grievance Appeal Notice Generator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize and copy an official legal appeal to send to your hub manager or platform support.
            </p>
          </div>

          <button
            onClick={handleCopyLetter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs font-mono font-bold text-xs bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            {copiedLetter ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Letter</span>
              </>
            )}
          </button>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase font-bold mb-1">
              Your Name:
            </label>
            <input
              type="text"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              className="w-full font-mono text-xs p-2 rounded-xs border-2 border-slate-700 bg-[#0B132B] text-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase font-bold mb-1">
              Partner ID / Code:
            </label>
            <input
              type="text"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              className="w-full font-mono text-xs p-2 rounded-xs border-2 border-slate-700 bg-[#0B132B] text-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-slate-400 uppercase font-bold mb-1">
              Dispute Category:
            </label>
            <select
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full font-mono text-xs p-2 rounded-xs border-2 border-slate-700 bg-[#0B132B] text-white focus:outline-hidden cursor-pointer"
            >
              <option value="arbitrary_block">Silent Account Deactivation</option>
              <option value="weather_delay">Rain / Weather Late Penalty</option>
              <option value="payout_deduction">Unexplained Payout Deduction</option>
            </select>
          </div>
        </div>

        {/* Letter Preview Box */}
        <pre className="p-4 rounded-xs bg-[#080D1A] border-2 border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
          {getAppealLetter()}
        </pre>
      </div>
    </div>
  );
};
