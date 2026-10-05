import React, { useState, useEffect } from 'react';
import { Header, AppTab } from './components/Header';
import { HomePage } from './components/HomePage';
import { DocumentUpload } from './components/DocumentUpload';
import { VoiceTextTranslator } from './components/VoiceTextTranslator';
import { RiskScoreCard } from './components/RiskScoreCard';
import { FilterBar } from './components/FilterBar';
import { ClauseCard } from './components/ClauseCard';
import { AdvocateGuidance } from './components/AdvocateGuidance';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { ClauseCompareModal } from './components/ClauseCompareModal';
import { WorkerRightsModal } from './components/WorkerRightsModal';
import { WorkerRightsView } from './components/WorkerRightsView';
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
  RotateCcw,
  Languages,
  FileSearch,
  Scale,
  ArrowRight,
  CheckCircle2,
  Home,
  ShieldAlert,
  IndianRupee,
  Clock,
  UserX
} from 'lucide-react';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('hi');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bhasha_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  // Sync theme changes with DOM documentElement
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('bhasha_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="bg-slate-50 text-slate-900 dark:bg-[#090E17] dark:text-[#F8FAFC] min-h-screen flex flex-col pb-36 sm:pb-28 selection:bg-[#FF7700] selection:text-slate-950 font-sans transition-colors duration-200">
      {/* Top Header Bar */}
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenHelp={() => setIsRightsModalOpen(true)}
        onToggleAudio={() => setIsPlayingAudio(!isPlayingAudio)}
        isPlayingAudio={isPlayingAudio}
        hasAnalysis={Boolean(currentAnalysis)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        {/* Workspace Pages Navigation Bar (Separated tabs, production-grade) */}
        <nav aria-label="Page navigation" className="mb-6 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-[#0B132B] p-1.5 sm:p-2 rounded-xs border-2 border-slate-300 dark:border-slate-800 shadow-[3px_3px_0px_#CBD5E1] dark:shadow-[3px_3px_0px_#000]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 font-mono text-xs">
              {/* Page 1: Home (3D Overview) */}
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 sm:p-2.5 rounded-xs font-bold text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeTab === 'home'
                    ? 'bg-[#FF7700] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-slate-50 dark:bg-[#0E1626] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-heading font-black text-xs">Home</span>
                  </div>
                  <span className={`px-1 py-0.2 rounded-2xs text-[9px] font-black uppercase ${
                    activeTab === 'home' ? 'bg-slate-950 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    3D Scene
                  </span>
                </div>
                <span className={`text-[10px] leading-tight truncate ${
                  activeTab === 'home' ? 'text-slate-900 font-medium' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  Overview & 3D vehicle
                </span>
              </button>

              {/* Page 2: Contract Auditor */}
              <button
                onClick={() => {
                  setActiveTab('auditor');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 sm:p-2.5 rounded-xs font-bold text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeTab === 'auditor'
                    ? 'bg-[#FF7700] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-slate-50 dark:bg-[#0E1626] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <FileSearch className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-heading font-black text-xs">Contract Auditor</span>
                  </div>
                  {currentAnalysis && (
                    <span className={`px-1 py-0.2 rounded-2xs text-[9px] font-black uppercase ${
                      activeTab === 'auditor' ? 'bg-slate-950 text-white' : 'bg-[#FF7700] text-slate-950'
                    }`}>
                      {currentAnalysis.redFlagsCount > 0 ? '⚠️ Traps Found' : '✓ Audited'}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] leading-tight truncate ${
                  activeTab === 'auditor' ? 'text-slate-900 font-medium' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  PDF & OCR inspection
                </span>
              </button>

              {/* Page 3: Voice AI Translator */}
              <button
                onClick={() => {
                  setActiveTab('translator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 sm:p-2.5 rounded-xs font-bold text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeTab === 'translator'
                    ? 'bg-[#10B981] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-slate-50 dark:bg-[#0E1626] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-heading font-black text-xs">Voice AI</span>
                  </div>
                  <span className={`px-1 py-0.2 rounded-2xs text-[9px] font-black uppercase ${
                    activeTab === 'translator' ? 'bg-slate-950 text-white' : 'bg-[#10B981] text-slate-950'
                  }`}>
                    Live Mic
                  </span>
                </div>
                <span className={`text-[10px] leading-tight truncate ${
                  activeTab === 'translator' ? 'text-slate-900 font-medium' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  22+ Langs & Equalizer
                </span>
              </button>

              {/* Page 4: Worker Rights & Legal Recourse */}
              <button
                onClick={() => {
                  setActiveTab('rights');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 sm:p-2.5 rounded-xs font-bold text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeTab === 'rights'
                    ? 'bg-[#F59E0B] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                    : 'bg-slate-50 dark:bg-[#0E1626] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-heading font-black text-xs">Worker Rights</span>
                  </div>
                  <span className={`px-1 py-0.2 rounded-2xs text-[9px] font-black uppercase ${
                    activeTab === 'rights' ? 'bg-slate-950 text-white' : 'bg-[#F59E0B] text-slate-950'
                  }`}>
                    Law Shield
                  </span>
                </div>
                <span className={`text-[10px] leading-tight truncate ${
                  activeTab === 'rights' ? 'text-slate-950 font-medium' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  14-Day Notice & e-Shram
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="max-w-5xl mx-auto my-4 p-4 rounded-xs border-2 border-black bg-[#FF5A36]/15 text-rose-800 dark:text-rose-200 flex items-center gap-3 shadow-[3px_3px_0px_#000] animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-[#FF5A36] shrink-0" />
            <p className="font-mono text-xs sm:text-sm font-bold">{errorMessage}</p>
          </div>
        )}

        {/* ================= PAGE 1: HOME (3D Overview) ================= */}
        {activeTab === 'home' && (
          <HomePage 
            onNavigate={(p) => {
              setActiveTab(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            theme={theme}
          />
        )}

        {/* ================= PAGE 2: CONTRACT & DOC AUDITOR ================= */}
        {activeTab === 'auditor' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Active Analysis Control Banner */}
            {currentAnalysis && (
              <div className="max-w-5xl mx-auto p-4 rounded-xs bg-white dark:bg-[#0E1626] border-2 border-[#10B981] shadow-[3px_3px_0px_#000] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                  <div>
                    <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">
                      Active Contract Inspection
                    </div>
                    <div className="font-heading font-black text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-slate-100 hover:bg-slate-200 dark:bg-[#172545] dark:hover:bg-[#203258] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold cursor-pointer transition-colors shadow-[1px_1px_0px_#000]"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#FF7700]" />
                    <span>Inspect Another Document</span>
                  </button>
                </div>
              </div>
            )}

            {/* Ingestion & Upload Section (No example tabs!) */}
            <DocumentUpload
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />

            {/* Analysis Results View */}
            {currentAnalysis ? (
              <div id="analysis-results" className="scroll-mt-24 space-y-8">
                {/* Concrete Risk Exposure Card (Zero abstract scores) */}
                <RiskScoreCard
                  analysis={currentAnalysis}
                  onPlayAudio={() => setIsPlayingAudio(!isPlayingAudio)}
                  isPlayingAudio={isPlayingAudio}
                />

                {/* Clauses Header & Filter Bar */}
                <div className="max-w-5xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
                        Decoded <span className="text-[#FF7700]">Fine-Print Clauses</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
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
                    <div className="civic-card text-center py-12 p-8 rounded-xs border-2 border-slate-300 dark:border-slate-800 mt-4">
                      <p className="font-mono text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">
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
              /* Clean Ready State when no document loaded (No example buttons!) */
              <div className="max-w-5xl mx-auto">
                <div className="civic-card p-6 sm:p-8 rounded-xs border-2 border-slate-300 dark:border-[#1E293B] text-center">
                  <div className="w-12 h-12 rounded-xs bg-[#FF7700]/10 border-2 border-[#FF7700] text-[#FF7700] flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                    Ready to Audit Your Platform Contract
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                    Upload your onboarding PDF above, take a photo of your paper terms, or paste and dictate text with the microphone.
                  </p>

                  {/* 3 Step Guidance Cards for Gig Workers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-left font-mono">
                    <div className="p-3.5 rounded-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E1626]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#FF7700] text-slate-950 font-bold text-xs flex items-center justify-center font-heading">
                          1
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Upload or Dictate</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        Submit any contract, rate card, penalty notice, or speak directly into the microphone.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E1626]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#10B981] text-slate-950 font-bold text-xs flex items-center justify-center font-heading">
                          2
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Multimodal Scan</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        Gemini Multimodal extracts fine print, detecting unfair penalties and Section 27 violations.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xs border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E1626]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#38BDF8] text-slate-950 font-bold text-xs flex items-center justify-center font-heading">
                          3
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Spoken Clarity</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        Listen to a 60-second voice briefing in your own regional language with actionable rights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= PAGE 3: VOICE & TEXT TRANSLATOR ================= */}
        {activeTab === 'translator' && (
          <div className="animate-fadeIn">
            <VoiceTextTranslator />
          </div>
        )}

        {/* ================= PAGE 4: WORKER RIGHTS & LEGAL DEFENSE ================= */}
        {activeTab === 'rights' && (
          <div className="animate-fadeIn">
            <WorkerRightsView />
          </div>
        )}
      </main>

      {/* Floating Bottom Audio Player - Active analysis audio stream */}
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

      {/* Production Footer */}
      <footer className="mt-14 border-t-2 border-slate-300 dark:border-slate-900 bg-white dark:bg-[#060A14] text-slate-900 dark:text-white py-6 px-4">
        <div className="transit-track mb-5 -mx-4 -mt-6" />

        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-xs sm:text-sm text-[#FF7700] uppercase">
              BHASHA BRIDGE
            </span>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span className="text-slate-600 dark:text-slate-400">
              Civic Legal Defense & Multilingual Speech AI for Gig Workers
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Home
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('auditor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Auditor
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('translator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Voice AI
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('rights');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Worker Rights
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
