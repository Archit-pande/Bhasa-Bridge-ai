import React, { useState } from 'react';
import { 
  SAMPLE_DOCUMENTS, 
  SampleDocument 
} from '../data/sampleContracts';
import { 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  Search,
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ContractVaultProps {
  onSelectSample: (sample: SampleDocument) => void;
  selectedSampleId?: string;
}

export const ContractVault: React.FC<ContractVaultProps> = ({
  onSelectSample,
  selectedSampleId,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Platform Contracts' },
    { id: 'Food Delivery', label: 'Food Delivery' },
    { id: 'Cab & Ride Hailing', label: 'Ride Hailing' },
    { id: 'Quick Commerce & Grocery', label: 'Quick Commerce' },
    { id: 'Home Services & Logistics', label: 'Services & Logistics' },
  ];

  const filteredContracts = SAMPLE_DOCUMENTS.filter((doc) => {
    const matchesCategory = categoryFilter === 'ALL' || doc.categoryBadge.toLowerCase().includes(categoryFilter.toLowerCase()) || doc.platform.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-2xs bg-[#38BDF8] text-slate-950 font-mono font-black text-[10px] uppercase">
              Pre-Audited Library
            </span>
            <span className="font-mono text-xs text-slate-400">
              {SAMPLE_DOCUMENTS.length} Verified Agreements & Policies
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Verified <span className="text-[#38BDF8]">Contract Vault</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-2xl">
            Browse real platform contracts from Swiggy, Zomato, Blinkit, Uber, Urban Company & Porter with precomputed safety scores and fine-print risk audits.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search platform or clause..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xs border-2 border-slate-700 bg-[#0B132B] text-xs font-mono text-white focus:outline-hidden focus:border-[#38BDF8]"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1 rounded-xs font-bold transition-all cursor-pointer border whitespace-nowrap ${
              categoryFilter === cat.id
                ? 'bg-[#38BDF8] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-[#111827] text-slate-300 border-slate-700 hover:bg-[#1E293B]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContracts.map((contract) => {
          const score = contract.precomputedResult.safetyScore;
          const isSelected = selectedSampleId === contract.id;
          const isHighRisk = score < 60;
          const isModerate = score >= 60 && score < 75;

          return (
            <div
              key={contract.id}
              className={`civic-card p-4 sm:p-5 rounded-xs flex flex-col justify-between transition-all relative ${
                isSelected ? 'border-[#38BDF8] shadow-[4px_4px_0px_#38BDF8]' : 'hover:border-slate-500'
              }`}
            >
              <div>
                {/* Header Meta */}
                <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                  <span className="font-bold px-2 py-0.5 rounded-2xs bg-[#0B132B] text-[#38BDF8] border border-slate-700">
                    {contract.categoryBadge}
                  </span>
                  <span className="text-slate-400 font-bold text-[11px]">
                    {contract.platform}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading font-black text-base sm:text-lg text-white mb-1.5 leading-snug">
                  {contract.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {contract.description}
                </p>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 rounded-2xs bg-[#0E1626] border border-slate-800 font-mono text-center mb-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Safety Score</div>
                    <div className={`text-sm font-black ${
                      isHighRisk ? 'text-[#DC2626]' : isModerate ? 'text-[#F59E0B]' : 'text-[#10B981]'
                    }`}>
                      {score}/100
                    </div>
                  </div>

                  <div className="border-x border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Red Flags</div>
                    <div className="text-sm font-black text-[#DC2626]">
                      {contract.precomputedResult.redFlagsCount}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Clauses</div>
                    <div className="text-sm font-black text-white">
                      {contract.precomputedResult.clauses.length}
                    </div>
                  </div>
                </div>

                {/* Sample Fine-Print Highlight */}
                {contract.precomputedResult.clauses[0] && (
                  <div className="p-2.5 rounded-2xs bg-[#080D1A] border border-slate-800 text-[11px] font-mono text-slate-300 mb-4">
                    <span className="text-[#FF7700] font-bold block mb-0.5">
                      ⚠️ Fine-Print Risk: {contract.precomputedResult.clauses[0].title}
                    </span>
                    <span className="text-slate-400 line-clamp-2 italic">
                      "{contract.precomputedResult.clauses[0].plainExplanation}"
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectSample(contract)}
                className={`w-full py-2 px-3 rounded-xs font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
                  isSelected
                    ? 'bg-[#10B981] hover:bg-[#12C288] text-slate-950'
                    : 'bg-[#FF7700] hover:bg-[#FF881A] text-slate-950'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Loaded in Auditor (View Now)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Audit in Contract Inspector</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
