import React from 'react';
import { X, Scale, PhoneCall } from 'lucide-react';

interface WorkerRightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkerRightsModal: React.FC<WorkerRightsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#0B132B] text-white rounded-xs max-w-2xl w-full p-5 sm:p-7 border-2 border-slate-700 shadow-[6px_6px_0px_#000] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xs border border-slate-700 bg-[#172545] hover:bg-[#203258] text-white shadow-[2px_2px_0px_#000] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 font-mono text-xs">
          <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#10B981] text-slate-950 border border-black shadow-[1px_1px_0px_#000]">
            Legal Defense Handbook
          </span>
        </div>

        <h3 className="font-heading font-black text-lg sm:text-2xl text-white">
          Worker Rights & Safety Handbook (India)
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Essential laws, safety protections, and official recourse helplines for delivery riders, drivers, and daily wage workers in India.
        </p>

        <div className="mt-5 space-y-3.5">
          <div className="p-4 rounded-xs border-2 border-slate-700 bg-[#0E1626] shadow-[3px_3px_0px_#000]">
            <h4 className="font-heading font-bold text-white text-sm mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-xs bg-[#FF7700] text-slate-950 font-mono font-black text-xs flex items-center justify-center border border-black">1</span>
              <span>Right to Transparent Algorithmic Calculations</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Platforms cannot hide deductions under vague "tech fee" names. You are legally entitled to receive an itemized transaction slip explaining every single penalty and bonus calculation.
            </p>
          </div>

          <div className="p-4 rounded-xs border-2 border-slate-700 bg-[#0E1626] shadow-[3px_3px_0px_#000]">
            <h4 className="font-heading font-bold text-white text-sm mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-xs bg-[#FF7700] text-slate-950 font-mono font-black text-xs flex items-center justify-center border border-black">2</span>
              <span>Right Against Arbitrary Silent Deactivation</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Under recent state gig worker regulations (e.g. Rajasthan Platform Based Gig Workers Act 2023), companies must provide a 14-day prior notice before permanent deactivation, along with a written reason and an internal grievance hearing.
            </p>
          </div>

          <div className="p-4 rounded-xs border-2 border-slate-700 bg-[#0E1626] shadow-[3px_3px_0px_#000]">
            <h4 className="font-heading font-bold text-white text-sm mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-xs bg-[#FF7700] text-slate-950 font-mono font-black text-xs flex items-center justify-center border border-black">3</span>
              <span>Mandatory Social Security Registration (e-Shram)</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every gig worker in India can register on the Ministry of Labour's <strong>e-Shram portal</strong> (eshram.gov.in) to get a Universal Account Number (UAN) with ₹2,00,000 accidental death/disability coverage.
            </p>
          </div>

          <div className="p-4 rounded-xs border-2 border-dashed border-amber-600/50 bg-amber-950/20 shadow-[3px_3px_0px_#000]">
            <h4 className="font-heading font-bold text-white text-sm mb-2 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#FF7700]" />
              <span>Emergency Helpline Numbers</span>
            </h4>
            <ul className="font-mono text-xs text-slate-300 space-y-1.5">
              <li className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span>National Labour Helpline:</span>
                <strong className="text-white">1800-11-4000 (Toll Free)</strong>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span>Highway & Ambulance SOS:</span>
                <strong className="text-white">1033 / 108</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Rider Union Alliances:</span>
                <span className="text-[#FF7700]">IFAT / TGPWU</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xs font-mono font-bold text-xs uppercase bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            I Understand My Rights
          </button>
        </div>
      </div>
    </div>
  );
};
