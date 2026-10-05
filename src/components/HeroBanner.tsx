import React from 'react';
import { ShieldAlert, Headphones, Languages, Layers } from 'lucide-react';

interface HeroBannerProps {
  onQuickStart: () => void;
  onPlayAudioDirect: () => void;
  onOpenTranslator: () => void;
  onOpenVault?: () => void;
  hasAnalysis?: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onQuickStart, 
  onPlayAudioDirect,
  onOpenTranslator,
  onOpenVault,
  hasAnalysis = false,
}) => {
  return (
    <section className="pt-4 pb-3 sm:pt-6 sm:pb-4 max-w-5xl mx-auto">
      {/* Category Lead Tag */}
      <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
        <span className="w-2.5 h-2.5 bg-[#FF7700] border border-black inline-block rounded-2xs" />
        <span>Civic Legal AI • Delivery Riders, Daily Earners & Students</span>
      </div>

      {/* Primary Display Title */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-heading leading-tight">
        Decode Complex Terms & Translate Any Voice. <br className="hidden sm:inline" />
        Speak in <span className="text-[#FF7700]">Your Mother Tongue</span> with Confidence.
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-xs sm:text-base text-slate-300 max-w-2xl leading-normal font-medium">
        Multimodal AI decoding contracts, assignments, and policies, with universal voice & text translation across 22+ Indian regional & global languages.
      </p>

      {/* 4 Clean Action Cards / Quick Launchers */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Document Inspection */}
        <div 
          onClick={onQuickStart}
          className="civic-card p-3.5 sm:p-4 rounded-xs cursor-pointer group hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all border-l-4 border-l-[#FF7700]"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading font-black text-sm sm:text-base text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#FF7700]" />
              <span>Contract Auditor</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-[#FF7700] group-hover:translate-x-0.5 transition-transform">
              Open Tab →
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
            Upload PDF or photo to flag hidden deactivation risks, fines, and strict rules.
          </p>
        </div>

        {/* Card 2: Voice & Text Translator */}
        <div 
          onClick={onOpenTranslator}
          className="civic-card p-3.5 sm:p-4 rounded-xs cursor-pointer group hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all border-l-4 border-l-[#10B981]"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading font-black text-sm sm:text-base text-white flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-[#10B981]" />
              <span>Voice Translator</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-[#10B981] group-hover:translate-x-0.5 transition-transform">
              Open Tab →
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
            Speak with live animated waveform in any dialect. Gemini translates with audio.
          </p>
        </div>

        {/* Card 3: Verified Contract Vault */}
        <div 
          onClick={onOpenVault || onQuickStart}
          className="civic-card p-3.5 sm:p-4 rounded-xs cursor-pointer group hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all border-l-4 border-l-[#38BDF8]"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-heading font-black text-sm sm:text-base text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#38BDF8]" />
              <span>Contract Vault</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-[#38BDF8] group-hover:translate-x-0.5 transition-transform">
              Browse →
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
            Pre-audited agreements for Swiggy, Zomato, Blinkit, Uber, and Urban Company.
          </p>
        </div>
      </div>
    </section>
  );
};
