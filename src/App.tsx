import React, { useState } from 'react';
import { Header, AppTab } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { DocumentUpload } from './components/DocumentUpload';
import { VoiceTextTranslator } from './components/VoiceTextTranslator';
import { RiskScoreCard } from './components/RiskScoreCard';
import { FilterBar } from './components/FilterBar';
import { ClauseCard } from './components/ClauseCard';
import { AdvocateGuidance } from './components/AdvocateGuidance';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { ClauseCompareModal } from './components/ClauseCompareModal';
import { WorkerRightsModal } from './components/WorkerRightsModal';
import { ContractVault } from './components/ContractVault';
import { WorkerRightsView } from './components/WorkerRightsView';
import { SampleDocument, SAMPLE_DOCUMENTS } from './data/sampleContracts';
import { 
  AnalysisResult, 
  Clause, 
  ClauseCategory, 
  LanguageCode, 
  RiskLevel, 
  AnalyzeRequest 
} from './types/contract';
import { requestDocumentAnalysis } from './services/api';
import { 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  Layers, 
  RotateCcw,
  Languages,
  FileSearch,
  Scale,
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('hi');
  const [activeTab, setActiveTab] = useState<AppTab>('auditor');
  
  // Document analysis state
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtering state
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ClauseCategory | 'ALL'>('ALL');

  // Modals state
  const [comparingClause, setComparingClause] = useState<Clause | null>(null);
  const [isRightsModalOpen, setIsRightsModalOpen] = useState<boolean>(false);

  // Audio Playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
  };

  const handleSelectSampleDirect = (sample: SampleDocument) => {
    setCurrentAnalysis(sample.precomputedResult);
    setIsPlayingAudio(false);
    setSelectedRiskFilter('ALL');
    setSelectedCategoryFilter('ALL');
    setErrorMessage(null);
    setActiveTab('auditor');

    setTimeout(() => {
      const resultsElem = document.getElementById('analysis-results');
      if (resultsElem) {
        resultsElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleAnalyze = async (req: AnalyzeRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsPlayingAudio(false);

    try {
      const result = await requestDocumentAnalysis({
        ...req,
        targetLanguage: selectedLanguage,
      });
      setCurrentAnalysis(result);
      setSelectedRiskFilter('ALL');
      setSelectedCategoryFilter('ALL');
      setActiveTab('auditor');

      setTimeout(() => {
        const resultsElem = document.getElementById('analysis-results');
        if (resultsElem) {
          resultsElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Failed to complete analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAnalysis = () => {
    setCurrentAnalysis(null);
    setIsPlayingAudio(false);
    setErrorMessage(null);
    setActiveTab('auditor');
  };

  // Filter clauses if analysis exists
  const filteredClauses = currentAnalysis
    ? currentAnalysis.clauses.filter((clause) => {
        const matchesRisk = selectedRiskFilter === 'ALL' || clause.riskLevel === selectedRiskFilter;
        const matchesCategory = selectedCategoryFilter === 'ALL' || clause.category === selectedCategoryFilter;
        return matchesRisk && matchesCategory;
      })
    : [];

  const currentAudioScript = currentAnalysis
    ? currentAnalysis.spokenScripts[selectedLanguage] ||
      currentAnalysis.spokenScripts['hi'] ||
      currentAnalysis.spokenScripts['en']
    : null;

  return (
    <div className="dark bg-[#090E17] text-[#F8FAFC] min-h-screen flex flex-col pb-36 sm:pb-28 selection:bg-[#FF7700] selection:text-slate-950 font-sans">
      {/* Dark Civic Header */}
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHelp={() => setIsRightsModalOpen(true)}
        onToggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
        isPlayingAudio={isPlayingAudio}
        hasAnalysis={Boolean(currentAnalysis)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        {/* Hero Section */}
        <HeroBanner 
          onQuickStart={() => setActiveTab('auditor')} 
          onOpenTranslator={() => setActiveTab('translator')}
          onOpenVault={() => setActiveTab('vault')}
          hasAnalysis={Boolean(currentAnalysis)}
          onPlayAudioDirect={() => {
            if (currentAnalysis) {
              setIsPlayingAudio(true);
            } else {
              setActiveTab('auditor');
            }
          }}
        />

        {/* Production Workspace Tabs Switcher */}
        <section className="my-6 max-w-5xl mx-auto">
          <div className="bg-[#0B132B] p-1.5 sm:p-2 rounded-xs border-2 border-slate-800 shadow-[3px_3px_0px_#000]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 font-mono text-xs">
              {/* Tab 1: Contract Auditor */}
              <button
                onClick={() => setActiveTab('auditor')}
                className={`p-2.5 sm:p-3 rounded-xs font-bold text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeTab === 'auditor'
                    ? 'bg-[#FF7700] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-[#0E1626] hover:bg-[#1E293B] text-slate-300 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <FileSearch className="w-4 h-4 shrink-0" />
                    <span className="font-heading font-black text-xs sm:text-sm">Auditor</span>
                  </div>
                  {currentAnalysis && (
                    <span className={`px-1.5 py-0.2 rounded-2xs text-[9px] font-black uppercase ${
                      activeTab === 'auditor' ? 'bg-slate-950 text-white' : 'bg-[#FF7700] text-slate-950'
                    }`}>
                      Score {currentAnalysis.safetyScore}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] leading-tight truncate ${
                  activeTab === 'auditor' ? 'text-slate-900 font-medium' : 'text-slate-400'
                }`}>
                  Decode PDF & fine-print risks
                </span>
              </button>

              {/* Tab 2: Voice & Text Translator */}
              <button
                onClick={() => setActiveTab('translator')}
                className={`p-2.5 sm:p-3 rounded-xs font-bold text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeTab === 'translator'
                    ? 'bg-[#10B981] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-[#0E1626] hover:bg-[#1E293B] text-slate-300 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-4 h-4 shrink-0" />
                    <span className="font-heading font-black text-xs sm:text-sm">Voice AI</span>
                  </div>
                  <span className={`px-1.5 py-0.2 rounded-2xs text-[9px] font-black uppercase ${
                    activeTab === 'translator' ? 'bg-slate-950 text-white' : 'bg-[#10B981] text-slate-950'
                  }`}>
                    Live Mic
                  </span>
                </div>
                <span className={`text-[10px] leading-tight truncate ${
                  activeTab === 'translator' ? 'text-slate-900 font-medium' : 'text-slate-400'
                }`}>
                  Translate 22+ languages with audio
                </span>
              </button>

              {/* Tab 3: Contract Vault */}
              <button
                onClick={() => setActiveTab('vault')}
                className={`p-2.5 sm:p-3 rounded-xs font-bold text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeTab === 'vault'
                    ? 'bg-[#38BDF8] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-[#0E1626] hover:bg-[#1E293B] text-slate-300 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span className="font-heading font-black text-xs sm:text-sm">Vault</span>
                  </div>
                  <span className={`px-1.5 py-0.2 rounded-2xs text-[9px] font-black uppercase ${
                    activeTab === 'vault' ? 'bg-slate-950 text-white' : 'bg-[#38BDF8] text-slate-950'
                  }`}>
                    {SAMPLE_DOCUMENTS.length} Docs
                  </span>
                </div>
                <span className={`text-[10px] leading-tight truncate ${
                  activeTab === 'vault' ? 'text-slate-900 font-medium' : 'text-slate-400'
                }`}>
                  Swiggy, Zomato, Blinkit & Uber
                </span>
              </button>

              {/* Tab 4: Worker Rights */}
              <button
                onClick={() => setActiveTab('rights')}
                className={`p-2.5 sm:p-3 rounded-xs font-bold text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeTab === 'rights'
                    ? 'bg-[#F59E0B] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-[#0E1626] hover:bg-[#1E293B] text-slate-300 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-4 h-4 shrink-0" />
                    <span className="font-heading font-black text-xs sm:text-sm">Rights & Law</span>
                  </div>
                  <span className={`px-1.5 py-0.2 rounded-2xs text-[9px] font-black uppercase ${
                    activeTab === 'rights' ? 'bg-slate-950 text-white' : 'bg-[#F59E0B] text-slate-950'
                  }`}>
                    Recourse
                  </span>
                </div>
                <span className={`text-[10px] leading-tight truncate ${
                  activeTab === 'rights' ? 'text-slate-950 font-medium' : 'text-slate-400'
                }`}>
                  14-day notice, helplines & appeal
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Global Error notification if any */}
        {errorMessage && (
          <div className="max-w-5xl mx-auto my-4 p-4 rounded-xs border-2 border-black bg-[#FF5A36]/15 text-rose-200 flex items-center gap-3 shadow-[3px_3px_0px_#000] animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-[#FF5A36] shrink-0" />
            <p className="font-mono text-xs sm:text-sm font-bold">{errorMessage}</p>
          </div>
        )}

        {/* TAB 1 CONTENT: Contract & Document Auditor */}
        {activeTab === 'auditor' && (
          <div className="space-y-6 animate-fadeIn">
            {/* If Analysis Result Exists, Show Top Analysis Control Banner */}
            {currentAnalysis && (
              <div className="max-w-5xl mx-auto p-3.5 sm:p-4 rounded-xs bg-[#0E1626] border-2 border-[#10B981] shadow-[3px_3px_0px_#000] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                  <div>
                    <div className="font-mono text-[10px] text-slate-400 uppercase font-bold">
                      Active Contract Inspection
                    </div>
                    <div className="font-heading font-black text-sm sm:text-base text-white truncate max-w-sm sm:max-w-md">
                      {currentAnalysis.documentTitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs font-mono font-bold text-xs cursor-pointer border transition-all ${
                      isPlayingAudio
                        ? 'bg-[#DC2626] text-white border-white animate-pulse'
                        : 'bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 border-black shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingAudio ? 'Pause Brief' : 'Play 60s Voice Brief'}</span>
                  </button>

                  <button
                    onClick={handleResetAnalysis}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#172545] hover:bg-[#203258] text-slate-200 border border-slate-700 font-mono text-xs font-bold cursor-pointer transition-colors shadow-[1px_1px_0px_#000]"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#FF7700]" />
                    <span>Inspect Another Document</span>
                  </button>
                </div>
              </div>
            )}

            {/* Ingestion & Upload Section (Always available, collapsed/expandable when analyzing) */}
            <DocumentUpload
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              onSelectSampleDirect={handleSelectSampleDirect}
            />

            {/* Analysis Results View */}
            {currentAnalysis ? (
              <div id="analysis-results" className="scroll-mt-24 space-y-8">
                {/* Risk Score Gauge & Big Verdict Card */}
                <RiskScoreCard
                  analysis={currentAnalysis}
                  onPlayAudio={() => setIsPlayingAudio(!isPlayingAudio)}
                  isPlayingAudio={isPlayingAudio}
                />

                {/* Clauses Header & Filter Bar */}
                <div className="max-w-5xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                        Decoded <span className="text-[#FF7700]">Fine-Print Clauses</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                        Showing {filteredClauses.length} of {currentAnalysis.clauses.length} extracted fine-print conditions
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#15201B] border-2 border-slate-600 shadow-[2px_2px_0px_#000] font-mono text-xs font-bold text-white self-start sm:self-auto">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span>Verbatim Legal Grounding</span>
                    </div>
                  </div>

                  {/* Filter Bar */}
                  <FilterBar
                    selectedRisk={selectedRiskFilter}
                    onSelectRisk={setSelectedRiskFilter}
                    selectedCategory={selectedCategoryFilter}
                    onSelectCategory={setSelectedCategoryFilter}
                    totalCount={currentAnalysis.clauses.length}
                    riskCount={currentAnalysis.redFlagsCount}
                    cautionCount={currentAnalysis.cautionCount}
                    safeCount={currentAnalysis.safeCount}
                  />

                  {/* Clause Cards List */}
                  {filteredClauses.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      {filteredClauses.map((clause) => (
                        <ClauseCard
                          key={clause.id}
                          clause={clause}
                          onOpenCompareModal={(c) => setComparingClause(c)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="civic-card text-center py-12 p-8 rounded-xs border-2 border-slate-800 mt-4">
                      <p className="font-mono text-xs sm:text-sm text-slate-400 font-bold">
                        No clauses found matching the current filters.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedRiskFilter('ALL');
                          setSelectedCategoryFilter('ALL');
                        }}
                        className="mt-3 px-4 py-2 rounded-xs font-mono font-bold text-xs uppercase bg-[#FF7700] text-slate-950 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Worker Advocate Guidance Toolkit */}
                <AdvocateGuidance analysis={currentAnalysis} />
              </div>
            ) : (
              /* Clean Ready State when no document loaded */
              <div className="max-w-5xl mx-auto">
                <div className="civic-card p-6 sm:p-8 rounded-xs border-2 border-[#1E293B] text-center">
                  <div className="w-12 h-12 rounded-xs bg-[#FF7700]/10 border-2 border-[#FF7700] text-[#FF7700] flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-white">
                    Ready to Audit Your First Document
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                    Upload your PDF agreement above, dictate text with the microphone, or click any verified platform contract below to start immediately.
                  </p>

                  {/* Quick Launch Verified Samples */}
                  <div className="mt-5 pt-5 border-t border-slate-800">
                    <span className="font-mono text-[11px] text-slate-400 uppercase font-bold block mb-3">
                      ⚡ Or Test Instant Analysis with Verified Samples:
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {SAMPLE_DOCUMENTS.slice(0, 4).map((sample) => (
                        <button
                          key={sample.id}
                          onClick={() => handleSelectSampleDirect(sample)}
                          className="px-3 py-1.5 rounded-2xs bg-[#0E1626] hover:bg-[#1E293B] border border-slate-700 hover:border-[#FF7700] text-slate-200 hover:text-white font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="text-[#FF7700] font-bold">{sample.name.split(' ')[0]}</span>
                          <span className="text-slate-400 text-[10px]">({sample.categoryBadge})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2 CONTENT: Voice & Text Translator */}
        {activeTab === 'translator' && (
          <div className="animate-fadeIn">
            <VoiceTextTranslator />
          </div>
        )}

        {/* TAB 3 CONTENT: Verified Contract Vault */}
        {activeTab === 'vault' && (
          <div className="animate-fadeIn max-w-5xl mx-auto">
            <ContractVault 
              onSelectSample={handleSelectSampleDirect}
              selectedSampleId={currentAnalysis?.id}
            />
          </div>
        )}

        {/* TAB 4 CONTENT: Worker Rights & Legal Defense */}
        {activeTab === 'rights' && (
          <div className="animate-fadeIn">
            <WorkerRightsView />
          </div>
        )}
      </main>

      {/* Floating Bottom Audio Player - Only rendered when an analysis is active */}
      {currentAnalysis && currentAudioScript && (
        <AudioPlayerBar
          currentScript={currentAudioScript}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          isPlaying={isPlayingAudio}
          onTogglePlay={() => setIsPlayingAudio(!isPlayingAudio)}
        />
      )}

      {/* Side-by-Side Clause Compare Modal */}
      <ClauseCompareModal
        clause={comparingClause}
        onClose={() => setComparingClause(null)}
      />

      {/* Worker Rights & Emergency Support Modal */}
      <WorkerRightsModal
        isOpen={isRightsModalOpen}
        onClose={() => setIsRightsModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-14 border-t-2 border-slate-900 bg-[#060A14] text-white py-6 px-4">
        <div className="transit-track mb-5 -mx-4 -mt-6" />

        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-xs sm:text-sm text-[#FF7700] uppercase">
              BHASHA BRIDGE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Civic Legal Defense & Multilingual Speech AI for India
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <button
              onClick={() => {
                setActiveTab('auditor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white cursor-pointer"
            >
              Auditor
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('translator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white cursor-pointer"
            >
              Translator
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('vault');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white cursor-pointer"
            >
              Contract Vault
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('rights');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white cursor-pointer"
            >
              Worker Rights
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
