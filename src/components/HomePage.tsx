import React from 'react';
import { Hero3DScene } from './Hero3DScene';
import { TiltCard3D } from './TiltCard3D';
import { 
  FileSearch, 
  Languages, 
  Scale, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  IndianRupee,
  Clock,
  UserX,
  Stethoscope,
  Bike
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'auditor' | 'translator' | 'rights') => void;
  theme?: 'dark' | 'light';
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  theme = 'dark',
}) => {
  // Realistic statutory standards across gig platforms in India
  const platformStandards = [
    {
      sector: 'Food Delivery',
      platforms: 'Zomato, Swiggy, Magicpin',
      commonTrap: 'Order cancellation clawbacks and bad weather penalties deducted directly from rider payouts.',
      legalShield: 'Section 73 Indian Contract Act — platform cannot pass customer default losses onto worker pay without written proof.',
      icon: IndianRupee,
      tagColor: 'text-[#FF7700] bg-[#FF7700]/10 border-[#FF7700]/30',
    },
    {
      sector: 'Quick Commerce & Grocery',
      platforms: 'Blinkit, Zepto, Instamart',
      commonTrap: 'Unrealistic 10-minute speed expectations combined with severe penalties for customer delay disputes.',
      legalShield: 'Central Motor Vehicle Aggregator Guidelines 2020 — statutory speed limits and road safety override platform delivery timers.',
      icon: Clock,
      tagColor: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30',
    },
    {
      sector: 'Cab & Ride Hailing',
      platforms: 'Ola, Uber, Rapido',
      commonTrap: 'Instant automated ID deactivation if rating drops below 4.6, with zero access to human appeal.',
      legalShield: 'Clause 14 Aggregator Guidelines — requires minimum 14 days written notice and mandatory grievance hearing before termination.',
      icon: UserX,
      tagColor: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30',
    },
    {
      sector: 'Logistics & Home Services',
      platforms: 'Porter, Urban Company',
      commonTrap: 'Compulsory equipment/bag fees and high non-refundable onboarding deposits withheld from earnings.',
      legalShield: 'Section 27 Indian Contract Act — restrictive covenants and excessive gear withholdings are void in restraint of trade.',
      icon: Scale,
      tagColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    },
  ];

  return (
    <div className="space-y-12 animate-fadeIn max-w-6xl mx-auto py-2 sm:py-4">
      {/* SECTION 1: Interactive 3D Gig Worker Ecosystem Hero */}
      <section className="civic-card p-6 sm:p-10 rounded-xs border-2 border-slate-300 dark:border-slate-800 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-4 z-10">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#FF7700] bg-[#FF7700]/10 border border-[#FF7700]/30 px-2.5 py-1 rounded-2xs">
              <span className="w-2 h-2 rounded-full bg-[#FF7700] animate-ping" />
              <span>Next-Gen Civic Legal & Multilingual AI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Decode Complex Terms. <br />
              <span className="text-[#FF7700]">Protect Your Paycheck</span> with 3D Clarity.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
              Empowering India's delivery riders, drivers, quick-commerce pickers, and daily wage workers to audit platform agreements, detect unfair penalty deductions, and translate spoken voice in real time across 22+ languages.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('auditor')}
                className="px-5 py-2.5 rounded-xs font-mono font-bold text-xs uppercase tracking-wider bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <FileSearch className="w-4 h-4" />
                <span>Audit Your Contract</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('translator')}
                className="px-5 py-2.5 rounded-xs font-mono font-bold text-xs uppercase tracking-wider bg-[#10B981] hover:bg-[#12C288] text-slate-950 border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Languages className="w-4 h-4" />
                <span>Live Voice AI Translator</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Section 27 Legal Grounding</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>22+ Indian Regional Dialects</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>No Abstract Scores • Concrete Impacts</span>
              </span>
            </div>
          </div>

          {/* Right Column: 3D Interactive WebGL Scene */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <Hero3DScene theme={theme} />
          </div>
        </div>
      </section>

      {/* SECTION 2: Dedicated Feature Workspaces (3D Perspective Tilt Cards) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
              Explore Dedicated <span className="text-[#FF7700]">Platform Tools</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Production-grade workspaces designed for high-focus reading, real document audits, and speech AI.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-500 font-bold hidden sm:inline">
            Separated Workspaces
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Page Card 1: Contract Auditor */}
          <TiltCard3D onClick={() => onNavigate('auditor')}>
            <div className="civic-card p-6 rounded-xs h-full border-t-4 border-t-[#FF7700] flex flex-col justify-between hover:shadow-[5px_5px_0px_#FF7700] transition-shadow">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xs bg-[#FF7700]/15 border-2 border-[#FF7700] text-[#FF7700] flex items-center justify-center font-black">
                    <FileSearch className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] uppercase font-bold border border-slate-300 dark:border-slate-700">
                    Dedicated Workspace
                  </span>
                </div>

                <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white mb-2">
                  Document & Contract Auditor
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Upload PDF agreements, take photos of terms sheets, or voice-dictate clauses. Gemini Multimodal vision inspects every line, isolating penalty traps and computing concrete financial deduction risks.
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[11px] mb-4">
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    PDF & Camera OCR
                  </span>
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    Concrete Impact Matrix
                  </span>
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    60s Spoken Audio
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-xs font-bold text-[#FF7700]">
                <span>Open Contract Auditor</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </TiltCard3D>

          {/* Page Card 2: Voice & Text Translator */}
          <TiltCard3D onClick={() => onNavigate('translator')}>
            <div className="civic-card p-6 rounded-xs h-full border-t-4 border-t-[#10B981] flex flex-col justify-between hover:shadow-[5px_5px_0px_#10B981] transition-shadow">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xs bg-[#10B981]/15 border-2 border-[#10B981] text-[#10B981] flex items-center justify-center font-black">
                    <Languages className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] uppercase font-bold border border-slate-300 dark:border-slate-700">
                    Live Equalizer AI
                  </span>
                </div>

                <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white mb-2">
                  Universal Voice & Text AI
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Speak in Hindi, Tamil, Telugu, Marathi, Bengali, or any local dialect. A live 16-band animated waveform equalizer visualizes your voice while Gemini transcribes, translates, and generates spoken regional responses.
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[11px] mb-4">
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    16-Band Equalizer
                  </span>
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    22+ Languages
                  </span>
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    Gemini TTS Audio
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-xs font-bold text-[#10B981]">
                <span>Open Voice AI Page</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </TiltCard3D>

          {/* Page Card 3: Worker Rights Guide */}
          <TiltCard3D onClick={() => onNavigate('rights')}>
            <div className="civic-card p-6 rounded-xs h-full border-t-4 border-t-[#F59E0B] flex flex-col justify-between hover:shadow-[5px_5px_0px_#F59E0B] transition-shadow">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xs bg-[#F59E0B]/15 border-2 border-[#F59E0B] text-[#F59E0B] flex items-center justify-center font-black">
                    <Scale className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] uppercase font-bold border border-slate-300 dark:border-slate-700">
                    Legal Defense Hub
                  </span>
                </div>

                <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white mb-2">
                  Worker Rights & Legal Recourse
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Full reference guide on 14-day mandatory deactivation notices, e-Shram accidental insurance (₹2 Lakh), weather delay exemptions, toll-free helplines, and a 1-click legal appeal notice generator.
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[11px] mb-4">
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    14-Day Notice Protection
                  </span>
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    SOS Helplines (1800-11-4000)
                  </span>
                  <span className="px-2 py-0.5 rounded-2xs bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    Appeal Notice Generator
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-xs font-bold text-[#F59E0B]">
                <span>Open Rights & Law Page</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </TiltCard3D>
        </div>
      </section>

      {/* SECTION 3: Actionable Platform Terms & Worker Protection Standards (Meaningful, No Abstract Scores!) */}
      <section className="civic-card p-6 sm:p-8 rounded-xs border-2 border-slate-300 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold uppercase text-[#FF7700]">Platform Terms Standards</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white">
              Common Fine-Print Traps & Your Legal Defense
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Know your rights across major gig work sectors under Indian labor laws and aggregator guidelines.
            </p>
          </div>

          <button
            onClick={() => onNavigate('auditor')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs font-mono font-bold text-xs bg-[#0F172A] dark:bg-white text-white dark:text-slate-900 cursor-pointer shadow-[2px_2px_0px_#FF7700]"
          >
            <span>Audit Your Terms Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platformStandards.map((std, idx) => {
            const Icon = std.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xs border-2 border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0E1626] hover:border-[#FF7700] transition-colors"
              >
                <div className="flex items-center justify-between mb-2 font-mono text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-[#FF7700]" />
                    <span>{std.sector}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-2xs font-mono font-bold text-[10px] border ${std.tagColor}`}>
                    {std.platforms}
                  </span>
                </div>

                <div className="space-y-2 mt-2 font-mono text-xs">
                  <div className="p-2 rounded-2xs bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300">
                    <span className="font-bold block mb-0.5 text-rose-900 dark:text-rose-200">
                      ⚠️ Common Platform Practice:
                    </span>
                    <span className="text-[11px] leading-relaxed">
                      {std.commonTrap}
                    </span>
                  </div>

                  <div className="p-2 rounded-2xs bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold block mb-0.5 text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                      <span>Statutory Worker Shield:</span>
                    </span>
                    <span className="text-[11px] leading-relaxed">
                      {std.legalShield}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
