import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  MessageCircle 
} from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES, AudioScript } from '../types/contract';

interface AudioPlayerBarProps {
  currentScript: AudioScript;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentScript,
  selectedLanguage,
  onLanguageChange,
  isPlaying,
  onTogglePlay,
}) => {
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  useEffect(() => {
    if (!synthRef.current) return;

    if (!isPlaying) {
      synthRef.current.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    if (currentScript.audioBase64) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = `data:audio/wav;base64,${currentScript.audioBase64}`;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(() => {
        fallbackToWebSpeech();
      });
      audioRef.current.onended = () => {
        onTogglePlay();
      };
      return;
    }

    fallbackToWebSpeech();

    return () => {
      synthRef.current?.cancel();
    };
  }, [isPlaying, currentScript, selectedLanguage, playbackRate]);

  const fallbackToWebSpeech = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(currentScript.scriptText);
    utteranceRef.current = utterance;

    const langMap: Record<LanguageCode, string> = {
      hi: 'hi-IN',
      en: 'en-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      kn: 'kn-IN',
    };

    utterance.lang = langMap[selectedLanguage] || 'hi-IN';
    utterance.rate = playbackRate;

    const voices = synthRef.current.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang.startsWith(utterance.lang.split('-')[0]) || v.lang === utterance.lang
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      onTogglePlay();
    };

    utterance.onerror = () => {
      onTogglePlay();
    };

    synthRef.current.speak(utterance);
  };

  const handleCycleSpeed = () => {
    const speeds = [0.85, 1.0, 1.25];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackRate(newSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    if (synthRef.current && isPlaying) {
      fallbackToWebSpeech();
    }
  };

  const handleRestart = () => {
    if (synthRef.current) synthRef.current.cancel();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    if (isPlaying) {
      fallbackToWebSpeech();
    } else {
      onTogglePlay();
    }
  };

  const handleShareWhatsApp = () => {
    const textToShare = `📢 *Bhasha Bridge Voice Brief*\n\n${currentScript.title}\n\n"${currentScript.scriptText}"\n\n📌 Key Points:\n${currentScript.bulletPoints.map((b) => `• ${b}`).join('\n')}\n\n_Decoded with Bhasha Bridge AI_`;

    navigator.clipboard.writeText(textToShare).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    });
  };

  return (
    <div className="fixed bottom-2 inset-x-2 sm:bottom-4 sm:inset-x-4 max-w-3xl mx-auto z-50">
      <div className="rounded-xs bg-[#0B132B] text-white p-2.5 sm:p-3.5 border-2 border-black shadow-[4px_4px_0px_#000]">
        {/* Main Controls Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Play/Pause Button + Title & Soundwave */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <button
              onClick={onTogglePlay}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xs flex items-center justify-center transition-all cursor-pointer border-2 border-black shrink-0 ${
                isPlaying
                  ? 'bg-[#DC2626] text-white shadow-[1px_1px_0px_#000] animate-pulse'
                  : 'bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
              }`}
              title={isPlaying ? 'Pause Audio' : 'Play 60s Spoken Audio'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />}
            </button>

            <div className="min-w-0 flex-1">
              <div className="font-heading font-black text-xs sm:text-sm text-white truncate">
                {currentScript.title}
              </div>

              {/* Soundwave bars */}
              <div className="flex items-center gap-0.5 sm:gap-1 mt-0.5 h-2">
                {[30, 80, 100, 50, 90, 40, 85, 60].map((height, i) => (
                  <span
                    key={i}
                    style={{ height: isPlaying ? `${height}%` : '25%' }}
                    className={`w-0.5 sm:w-1 rounded-3xs transition-all ${
                      isPlaying
                        ? i % 2 === 0
                          ? 'bg-[#FF7700]'
                          : 'bg-[#059669]'
                        : 'bg-slate-600'
                    }`}
                  />
                ))}
                <span className="font-mono text-[9px] text-slate-400 ml-1 truncate">
                  {isPlaying ? 'Speaking...' : '60s Voice'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Icons (Ultra-compact on Mobile) */}
          <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-xs shrink-0">
            {/* Speed Toggle */}
            <button
              onClick={handleCycleSpeed}
              className="px-1.5 sm:px-2 py-1 rounded-2xs bg-[#172545] hover:bg-[#203258] text-white border border-slate-700 cursor-pointer font-bold text-[10px] sm:text-[11px]"
              title="Change speed"
            >
              {playbackRate}x
            </button>

            {/* Restart */}
            <button
              onClick={handleRestart}
              className="p-1 sm:p-1 rounded-2xs bg-[#172545] hover:bg-[#203258] text-slate-300 border border-slate-700 cursor-pointer"
              title="Restart audio"
            >
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-2xs font-bold text-[10px] sm:text-[11px] transition-colors cursor-pointer border border-black ${
                copiedShare
                  ? 'bg-[#059669] text-white'
                  : 'bg-[#059669] hover:bg-[#047857] text-white'
              }`}
              title="Share voice summary on WhatsApp"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3 h-3" />
                  <span className="hidden xs:inline">Copied</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-3 h-3" />
                  <span className="hidden xs:inline">WhatsApp</span>
                </>
              )}
            </button>

            {/* Expand / Collapse Script */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-2xs bg-[#172545] hover:bg-[#203258] text-slate-300 border border-slate-700 cursor-pointer"
              title="Toggle transcript drawer"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Transcript Drawer */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-700 animate-fadeIn">
            {/* Language Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1.5 mb-1.5 font-mono text-[10px] sm:text-[11px]">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isCurrent = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`px-2 py-0.5 rounded-2xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isCurrent
                        ? 'bg-[#FF7700] text-slate-950 font-black'
                        : 'bg-[#172545] text-slate-300 hover:bg-[#203258]'
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                );
              })}
            </div>

            {/* Transcript text */}
            <div className="bg-[#070C18] rounded-2xs p-2.5 border border-slate-800 max-h-32 sm:max-h-40 overflow-y-auto text-xs text-slate-200 leading-normal font-sans">
              <div className="font-mono text-[10px] sm:text-[11px] font-bold text-[#F59E0B] mb-1 flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>Spoken Audio Script:</span>
              </div>
              <p>{currentScript.scriptText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
