import React from 'react';
import { 
  Globe, 
  HelpCircle, 
  Volume2, 
  ShieldCheck,
  Languages, 
  FileSearch,
  Layers,
  Scale,
  Sun,
  Moon,
  Home
} from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../types/contract';

export type AppTab = 'home' | 'auditor' | 'translator' | 'rights';

interface HeaderProps {
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenHelp: () => void;
  onToggleAudio?: () => void;
  isPlayingAudio?: boolean;
  hasAnalysis?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLanguage,
  onLanguageChange,
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme,
  onOpenHelp,
  onToggleAudio,
  isPlayingAudio,
  hasAnalysis = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* Top Header Bar */}
      <div className="bg-[#0B132B] dark:bg-[#0B132B] text-white border-b-2 border-slate-900 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-13 sm:h-15">
          {/* Logo / Brand Zone */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-1.5 sm:gap-2 group cursor-pointer focus:outline-hidden text-left"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xs bg-[#FF7700] border-2 border-black flex items-center justify-center text-slate-950 font-black text-xs sm:text-sm shadow-[2px_2px_0px_#000] shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 font-heading">
                <span className="font-extrabold text-sm sm:text-lg tracking-tight text-white uppercase whitespace-nowrap">
                  BHASHA BRIDGE
                </span>
                <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded-xs bg-[#10B981] text-slate-950 font-mono font-black text-[9px] sm:text-[10px] border border-black shadow-[1px_1px_0px_#000]">
                  AI
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Tabs) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-bold text-slate-300">
            <button 
              onClick={() => onSelectTab('home')}
              className={`hover:text-[#FF7700] transition-colors cursor-pointer flex items-center gap-1.5 pb-1 ${
                activeTab === 'home' ? 'text-[#FF7700] border-b-2 border-[#FF7700]' : ''
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button 
              onClick={() => onSelectTab('auditor')}
              className={`hover:text-[#FF7700] transition-colors cursor-pointer flex items-center gap-1.5 pb-1 ${
                activeTab === 'auditor' ? 'text-[#FF7700] border-b-2 border-[#FF7700]' : ''
              }`}
            >
              <FileSearch className="w-3.5 h-3.5 text-[#FF7700]" />
              <span>Contract Auditor</span>
            </button>

            <button 
              onClick={() => onSelectTab('translator')}
              className={`hover:text-[#10B981] transition-colors cursor-pointer flex items-center gap-1.5 pb-1 ${
                activeTab === 'translator' ? 'text-[#10B981] border-b-2 border-[#10B981]' : ''
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Voice AI Translator</span>
            </button>

            <button 
              onClick={() => onSelectTab('rights')}
              className={`hover:text-[#F59E0B] transition-colors cursor-pointer flex items-center gap-1.5 pb-1 ${
                activeTab === 'rights' ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]' : ''
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Worker Rights & Law</span>
            </button>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button (Light Mode / Dark Mode) */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-xs border-2 border-slate-700 bg-[#172545] hover:bg-[#203258] text-amber-300 hover:text-amber-200 cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-300" />
              )}
            </button>

            {/* Quick Action to Voice AI */}
            <button
              onClick={() => onSelectTab('translator')}
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-xs font-mono font-bold text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-all ${
                activeTab === 'translator' 
                  ? 'bg-[#10B981] text-slate-950 ring-2 ring-emerald-400' 
                  : 'bg-[#10B981] hover:bg-[#12C288] text-slate-950'
              }`}
              title="Open Voice & Text Translator"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Voice AI</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-[#172545] border border-slate-700 rounded-xs px-2 py-1 shadow-[2px_2px_0px_#000]">
              <Globe className="w-3 h-3 text-[#FF7700] mr-1 hidden xs:block" />
              <select
                aria-label="Select audio and explanation language"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-transparent text-[11px] sm:text-xs font-mono font-bold text-white focus:outline-hidden cursor-pointer pr-0.5"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-white bg-[#111827]">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Transit Line Accent */}
      <div className="transit-track w-full" />

      {/* Secondary Strip */}
      <div className="bg-[#0B1220] border-b-2 border-slate-800 px-3 sm:px-6 lg:px-8 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 font-mono text-[10px] sm:text-[11px]">
          {/* Status info */}
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
            <span className="font-bold truncate">Bhasha AI Production Workspace</span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">
              {isDark ? 'Dark Mode' : 'Light Mode'} • 3D Spatial Graphics • 22+ Languages
            </span>
          </div>

          {/* Quick Audio Play Pill (Only shown when analysis is loaded) */}
          {hasAnalysis && onToggleAudio && (
            <button
              onClick={onToggleAudio}
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs font-bold text-[10px] sm:text-xs cursor-pointer border-2 transition-all shadow-[1px_1px_0px_#000] shrink-0 active:translate-x-0.5 active:translate-y-0.5 ${
                isPlayingAudio
                  ? 'bg-[#DC2626] text-white border-black animate-pulse'
                  : 'bg-[#1E293B] text-white border-slate-600 hover:bg-[#2A3B54]'
              }`}
            >
              <Volume2 className="w-3 h-3 text-[#FF7700]" />
              <span className="font-mono font-bold">
                {isPlayingAudio ? 'Playing' : 'Play 60s Voice'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

