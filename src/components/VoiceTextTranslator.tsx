import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  MessageSquare, 
  FileText,
  AlertCircle,
  Share2,
  Radio,
  AudioLines,
  CheckCircle2
} from 'lucide-react';
import { TRANSLATION_LANGUAGES, TranslationResult } from '../types/contract';
import { requestUniversalTranslation, requestGeminiTTS } from '../services/api';

const QUICK_SCENARIOS = [
  {
    label: '📦 Delivery Arrival',
    text: 'Sir, I have reached your delivery location. Please collect your order or confirm the door code.',
    hint: 'Customer delivery handover'
  },
  {
    label: '🌧️ Weather / Bike Delay',
    text: 'Due to severe rainfall and waterlogging, my bike got delayed. I am safely reaching in 8 minutes.',
    hint: 'Avoid late penalty'
  },
  {
    label: '💰 Payout Dispute',
    text: 'There is an unexplained deduction of ₹150 in my Tuesday weekly settlement. Please share the breakdown.',
    hint: 'Hub lead clarification'
  },
  {
    label: '🎓 Assignment Submission',
    text: 'Respected instructor, I have uploaded my shell scripting lab assignment with all test cases completed.',
    hint: 'Academic submission'
  },
  {
    label: '⚖️ Grievance Appeal',
    text: 'My account was temporarily blocked without prior 14-day notice. I request an official grievance hearing.',
    hint: 'Worker rights defense'
  }
];

export const VoiceTextTranslator: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<string>('Auto-Detect');
  const [targetLang, setTargetLang] = useState<string>('English');
  const [inputText, setInputText] = useState<string>('');
  
  // Recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(16).fill(15));
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [isWebSpeechActive, setIsWebSpeechActive] = useState<boolean>(false);

  // Translation & output states
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Refs for audio handling
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const liveTranscriptRef = useRef<string>('');

  // Keep liveTranscriptRef in sync
  useEffect(() => {
    liveTranscriptRef.current = liveTranscript;
  }, [liveTranscript]);

  // Clean up all audio resources on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanupAudio = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
      speechRecognitionRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch {}
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
  };

  // Real-time audio frequency visualizer using Web Audio API
  const setupAudioVisualizer = (stream: MediaStream) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      const audioCtx = new AudioCtxClass();
      audioContextRef.current = audioCtx;

      // Resume context if suspended (common browser autoplay policy)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        const bands = 16;
        const step = Math.max(1, Math.floor(bufferLength / bands));
        const levels: number[] = [];
        let totalVal = 0;

        for (let i = 0; i < bands; i++) {
          const val = dataArray[i * step] || 0;
          totalVal += val;
          // Scale to 12% - 100% height with slight random jitter for alive feel
          const basePct = (val / 255) * 100;
          const jitter = Math.sin(Date.now() / 150 + i) * 6;
          const clamped = Math.min(100, Math.max(12, Math.round(basePct + jitter)));
          levels.push(clamped);
        }

        const avg = Math.min(100, Math.round((totalVal / (bands * 255)) * 100));
        setVolumeLevel(avg);
        setAudioLevels(levels);

        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (err) {
      console.warn('AudioContext visualizer setup note:', err);
    }
  };

  // Dual Web Speech API recognition for instant live transcription
  const startSpeechRecognition = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setIsWebSpeechActive(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;

      const langMap: Record<string, string> = {
        Hindi: 'hi-IN',
        English: 'en-IN',
        Hinglish: 'hi-IN',
        Tamil: 'ta-IN',
        Telugu: 'te-IN',
        Marathi: 'mr-IN',
        Bengali: 'bn-IN',
        Kannada: 'kn-IN',
        Gujarati: 'gu-IN',
        Malayalam: 'ml-IN',
        Punjabi: 'pa-IN',
        Urdu: 'ur-PK',
        Spanish: 'es-ES',
        French: 'fr-FR',
        German: 'de-DE',
        Arabic: 'ar-SA',
        Japanese: 'ja-JP',
        Chinese: 'zh-CN',
      };

      recognition.lang = langMap[sourceLang] || 'hi-IN';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        const cleaned = transcript.trim();
        if (cleaned) {
          setLiveTranscript(cleaned);
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition notice:', e?.error);
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
      setIsWebSpeechActive(true);
    } catch (err) {
      console.warn('Speech recognition start note:', err);
      setIsWebSpeechActive(false);
    }
  };

  const startVoiceRecording = async () => {
    setErrorMessage(null);
    setTranslationResult(null);
    setLiveTranscript('');
    setVolumeLevel(0);
    audioChunksRef.current = [];

    // Verify browser support
    if (!navigator?.mediaDevices?.getUserMedia) {
      // Fallback: try SpeechRecognition only
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        setIsRecording(true);
        setRecordingDuration(0);
        timerRef.current = setInterval(() => setRecordingDuration((p) => p + 1), 1000);
        startSpeechRecognition();
        return;
      }

      setErrorMessage(
        'Microphone is not supported in this browser environment. You can type or paste text, or try our sample phrases.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;

      // Detect best supported MIME type
      let chosenMime = '';
      if (typeof MediaRecorder !== 'undefined') {
        const mimeCandidates = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/mp4',
          'audio/aac',
          'audio/ogg;codecs=opus',
          'audio/ogg',
        ];
        for (const candidate of mimeCandidates) {
          if (MediaRecorder.isTypeSupported(candidate)) {
            chosenMime = candidate;
            break;
          }
        }
      }

      const recorderOptions = chosenMime ? { mimeType: chosenMime } : undefined;
      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const actualMime = mediaRecorder.mimeType || chosenMime || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
        const capturedTranscript = liveTranscriptRef.current;

        cleanupAudio();

        if (audioBlob.size > 300) {
          // Convert audio blob to Base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Data = reader.result as string;
            await handleTranslateVoice(base64Data, actualMime, capturedTranscript);
          };
          reader.readAsDataURL(audioBlob);
        } else if (capturedTranscript) {
          // Audio stream was short or empty, but live speech recognized text
          setInputText(capturedTranscript);
          await handleTranslateText(capturedTranscript);
        } else {
          setErrorMessage('No voice detected. Please hold the mic or speak clearly for 1-2 seconds.');
        }
      };

      // Start recording and audio analysis
      mediaRecorder.start(250);
      setupAudioVisualizer(stream);
      startSpeechRecognition();

      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone permission error:', err);
      // Fallback: try SpeechRecognition if getUserMedia blocked
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        setIsRecording(true);
        setRecordingDuration(0);
        timerRef.current = setInterval(() => setRecordingDuration((p) => p + 1), 1000);
        startSpeechRecognition();
        return;
      }

      setErrorMessage(
        'Microphone access was denied or unavailable. Tap the site settings/lock icon in your browser address bar to allow microphone access.'
      );
    }
  };

  const stopVoiceRecording = () => {
    if (!isRecording) return;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.requestData();
      } catch (e) {
        console.warn('requestData error:', e);
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // SpeechRecognition only mode
      const captured = liveTranscriptRef.current;
      cleanupAudio();
      setIsRecording(false);

      if (captured) {
        setInputText(captured);
        handleTranslateText(captured);
      }
    }
  };

  const handleTranslateVoice = async (audioBase64: string, mimeType: string, transcriptHint?: string) => {
    setIsTranslating(true);
    setErrorMessage(null);

    try {
      const result = await requestUniversalTranslation({
        audioBase64,
        audioMimeType: mimeType,
        text: transcriptHint || undefined,
        sourceLanguage: sourceLang === 'Auto-Detect' ? undefined : sourceLang,
        targetLanguage: targetLang,
      });

      setTranslationResult(result);
      if (result.sourceText) {
        setInputText(result.sourceText);
      }
    } catch (err: any) {
      console.error('Translation error:', err);
      // If audio fails but we have transcript hint, try text translation
      if (transcriptHint) {
        await handleTranslateText(transcriptHint);
      } else {
        setErrorMessage(err.message || 'Failed to translate audio. Please try again or type your text.');
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateText = async (customText?: string) => {
    const textToTranslate = customText || inputText;
    if (!textToTranslate.trim() || isTranslating) return;

    setIsTranslating(true);
    setErrorMessage(null);

    try {
      const result = await requestUniversalTranslation({
        text: textToTranslate,
        sourceLanguage: sourceLang === 'Auto-Detect' ? undefined : sourceLang,
        targetLanguage: targetLang,
      });

      setTranslationResult(result);
    } catch (err: any) {
      console.error('Text translation error:', err);
      setErrorMessage(err.message || 'Failed to complete translation.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'Auto-Detect') {
      setSourceLang(targetLang);
      setTargetLang('Hindi');
    } else {
      const prevSource = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(prevSource);
    }

    if (translationResult) {
      setInputText(translationResult.translatedText);
      setTranslationResult(null);
    }
  };

  const handlePlayAudio = async () => {
    if (!translationResult || !translationResult.translatedText) return;

    if (isPlayingAudio) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);

    // If Gemini TTS base64 is already returned
    if (translationResult.audioBase64) {
      try {
        const audioSrc = translationResult.audioBase64.startsWith('data:')
          ? translationResult.audioBase64
          : `data:audio/wav;base64,${translationResult.audioBase64}`;
        const audio = new Audio(audioSrc);
        audioElementRef.current = audio;

        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => fallbackWebSpeech(translationResult.translatedText, targetLang);
        await audio.play();
        return;
      } catch (e) {
        console.warn('Direct audio play error:', e);
      }
    }

    // Attempt on-demand TTS
    const newBase64 = await requestGeminiTTS(translationResult.translatedText);
    if (newBase64) {
      try {
        const audioSrc = newBase64.startsWith('data:') ? newBase64 : `data:audio/wav;base64,${newBase64}`;
        const audio = new Audio(audioSrc);
        audioElementRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => fallbackWebSpeech(translationResult.translatedText, targetLang);
        await audio.play();
        return;
      } catch (e) {
        console.warn('Fallback after TTS fetch:', e);
      }
    }

    fallbackWebSpeech(translationResult.translatedText, targetLang);
  };

  const fallbackWebSpeech = (text: string, langName: string) => {
    if (!('speechSynthesis' in window)) {
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    const langMap: Record<string, string> = {
      Hindi: 'hi-IN',
      English: 'en-IN',
      Hinglish: 'hi-IN',
      Tamil: 'ta-IN',
      Telugu: 'te-IN',
      Marathi: 'mr-IN',
      Bengali: 'bn-IN',
      Kannada: 'kn-IN',
      Gujarati: 'gu-IN',
      Malayalam: 'ml-IN',
      Punjabi: 'pa-IN',
      Urdu: 'ur-PK',
      Spanish: 'es-ES',
      French: 'fr-FR',
      German: 'de-DE',
      Arabic: 'ar-SA',
      Japanese: 'ja-JP',
      Chinese: 'zh-CN',
    };

    utterance.lang = langMap[langName] || 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    if (!translationResult) return;
    navigator.clipboard.writeText(translationResult.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!translationResult) return;
    const shareText = encodeURIComponent(
      `🗣️ *Translated with Bhasha Bridge*\n\n"${translationResult.translatedText}"\n\n(Original: "${translationResult.sourceText}")`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  // Test voice demo simulation if user does not have a working mic hardware
  const handleSimulateVoiceInput = (sampleText: string) => {
    setInputText(sampleText);
    handleTranslateText(sampleText);
  };

  return (
    <div id="voice-translator-section" className="my-8 max-w-5xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-2xs bg-[#FF7700] text-slate-950 font-mono font-black text-[10px] uppercase">
              Multimodal Audio
            </span>
            <span className="font-mono text-xs text-[#10B981] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Live Speech & Text AI</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Voice & Text <span className="text-[#FF7700]">Universal Translator</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Speak or type in any language. Gemini listens with real-time waveform analysis and translates with natural colloquial phrasing.
          </p>
        </div>
      </div>

      <div className={`civic-card p-4 sm:p-6 rounded-xs transition-all ${isRecording ? 'recording-active-glow' : ''}`}>
        {/* Language Selection Header */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b-2 border-slate-800">
          {/* Source Language */}
          <div className="flex-1 min-w-[130px]">
            <label className="block font-mono text-[10px] text-slate-400 uppercase font-bold mb-1">
              From (Speak / Type):
            </label>
            <div className="bg-[#0B132B] border-2 border-slate-700 px-2.5 py-1.5 rounded-2xs shadow-[1px_1px_0px_#000]">
              <select
                aria-label="Select source speech language"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full bg-transparent font-bold text-white focus:outline-hidden cursor-pointer text-xs sm:text-sm"
              >
                <option value="Auto-Detect" className="bg-[#0B132B] text-white">
                  ✨ Auto-Detect (Any Language)
                </option>
                {TRANSLATION_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#0B132B] text-white">
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapLanguages}
            className="p-2 mt-4 rounded-xs border-2 border-slate-700 bg-[#1E293B] hover:bg-[#2A3B54] text-slate-200 hover:text-white cursor-pointer shadow-[1px_1px_0px_#000] active:scale-95 transition-all self-center"
            title="Swap Source and Target Languages"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#FF7700]" />
          </button>

          {/* Target Language */}
          <div className="flex-1 min-w-[130px]">
            <label className="block font-mono text-[10px] text-slate-400 uppercase font-bold mb-1">
              To (Translated Language):
            </label>
            <div className="bg-[#0B132B] border-2 border-slate-700 px-2.5 py-1.5 rounded-2xs shadow-[1px_1px_0px_#000]">
              <select
                aria-label="Select target translated language"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-transparent font-bold text-white focus:outline-hidden cursor-pointer text-xs sm:text-sm"
              >
                {TRANSLATION_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#0B132B] text-white">
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Input Zone: Voice Microphone + Textarea */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Voice Recording Area with Real-Time Animations */}
          <div className="lg:col-span-5 p-4 rounded-xs border-2 border-slate-800 bg-[#0E1626] text-center flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
            {/* Background live soundwave grid when recording */}
            {isRecording && (
              <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                <div className="w-72 h-72 rounded-full bg-red-600 blur-3xl animate-pulse" />
              </div>
            )}

            <div className="font-mono text-xs font-bold uppercase mb-2 flex items-center gap-1.5 z-10">
              {isRecording ? (
                <span className="text-[#DC2626] flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-[#DC2626] animate-pulse" />
                  <span>Recording Live Audio...</span>
                </span>
              ) : (
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-[#FF7700]" />
                  <span>Tap to Speak in Any Language</span>
                </span>
              )}
            </div>

            {/* Mic Button with Concentric Animated Rings */}
            <div className="relative my-2 z-10 flex items-center justify-center">
              {/* Pulsing Concentric Ripple Rings when recording */}
              {isRecording && (
                <>
                  <div className="absolute w-28 h-28 rounded-full border-2 border-red-500/60 mic-recording-pulse pointer-events-none" />
                  <div 
                    className="absolute w-36 h-36 rounded-full border border-orange-500/40 pointer-events-none animate-ping" 
                    style={{ animationDuration: '2s' }}
                  />
                </>
              )}

              <button
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                disabled={isTranslating}
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all cursor-pointer shadow-[4px_4px_0px_#000] z-20 ${
                  isRecording
                    ? 'bg-[#DC2626] border-white text-white scale-105 shadow-[0_0_20px_rgba(220,38,38,0.7)]'
                    : 'bg-[#FF7700] hover:bg-[#FF881A] border-black text-slate-950 hover:scale-105 active:scale-95'
                }`}
                title={isRecording ? 'Click to Stop & Translate' : 'Click to Speak'}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8 stroke-[2.5]" />
                ) : (
                  <Mic className="w-8 h-8 stroke-[2.5]" />
                )}
              </button>
            </div>

            {/* Dynamic Equalizer Waveform Animation when Recording */}
            {isRecording ? (
              <div className="w-full mt-3 px-2 z-10 flex flex-col items-center">
                {/* 16 Responsive Equalizer Bars */}
                <div className="flex items-end justify-center gap-1 h-10 w-full max-w-xs mb-2">
                  {audioLevels.map((lvl, idx) => {
                    // Stagger animation delays for natural organic wave feel
                    const barHeight = Math.max(8, lvl);
                    const isPeak = barHeight > 65;
                    const isMid = barHeight > 35;
                    const barBg = isPeak 
                      ? 'bg-[#DC2626]' 
                      : isMid 
                      ? 'bg-[#FF7700]' 
                      : 'bg-[#10B981]';

                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all duration-75 ${barBg} ${
                          volumeLevel === 0 ? 'audio-bar-live' : ''
                        }`}
                        style={{
                          height: `${barHeight}%`,
                          minHeight: '4px',
                          animationDelay: `${idx * 0.07}s`,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Duration and Stop Action Badge */}
                <div className="flex items-center justify-center gap-2">
                  <div className="font-mono text-xs font-bold text-[#DC2626] bg-red-950/60 border border-red-800 px-2 py-0.5 rounded-2xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
                    <span>00:{recordingDuration < 10 ? `0${recordingDuration}` : recordingDuration}s</span>
                  </div>

                  <button
                    onClick={stopVoiceRecording}
                    className="px-2.5 py-0.5 rounded-2xs bg-[#DC2626] hover:bg-red-700 text-white font-mono font-bold text-[11px] cursor-pointer border border-white/40 active:scale-95 transition-all shadow-[1px_1px_0px_#000]"
                  >
                    Done • Translate
                  </button>
                </div>

                {/* Real-time speech transcript preview if speech recognition detects words */}
                {liveTranscript && (
                  <div className="mt-2.5 p-2 rounded-2xs bg-[#0B132B] border border-emerald-600/50 text-emerald-300 font-mono text-[11px] max-w-xs text-left w-full truncate animate-fadeIn">
                    <span className="text-slate-400 font-bold mr-1">Hearing:</span>
                    <span>"{liveTranscript}"</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="z-10">
                <p className="font-mono text-[11px] text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Tap mic and speak Hindi, Tamil, Telugu, Marathi, English, or any dialect.
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-2xs">
                    <AudioLines className="w-3 h-3 text-[#10B981]" />
                    <span>Live Waveform Active</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Text Area */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                <span className="text-slate-300 font-bold flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#FF7700]" />
                  <span>Or Type / Paste Words to Translate:</span>
                </span>
                {inputText && (
                  <button
                    onClick={() => {
                      setInputText('');
                      setLiveTranscript('');
                    }}
                    className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <textarea
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste words in Hindi, Hinglish, Bengali, Marathi, English, etc..."
                className="w-full font-mono text-xs sm:text-sm p-3 rounded-xs border-2 border-slate-700 bg-[#0B132B] text-white focus:outline-hidden focus:border-[#FF7700] resize-none"
              />
            </div>

            {/* Translate Button */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-slate-400">
                {inputText.length} characters
              </span>

              <button
                onClick={() => handleTranslateText()}
                disabled={!inputText.trim() || isTranslating}
                className={`px-5 py-2 rounded-xs font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border-2 border-black flex items-center gap-2 ${
                  !inputText.trim() || isTranslating
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed border-slate-800'
                    : 'bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
                }`}
              >
                {isTranslating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Translating with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Translate into {targetLang}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Voice Simulation Presets & Scenarios */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[11px]">
            <span className="text-slate-400 uppercase font-bold flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-[#FF7700]" />
              <span>Quick Everyday Gig & Student Phrases (Tap to translate):</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_SCENARIOS.map((scenario, idx) => (
              <button
                key={idx}
                onClick={() => handleSimulateVoiceInput(scenario.text)}
                className="px-2.5 py-1 rounded-2xs bg-[#0E1626] hover:bg-[#1E293B] border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-[11px] transition-colors cursor-pointer text-left flex items-center gap-1"
                title={scenario.hint}
              >
                <span>{scenario.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-2xs bg-rose-950/40 border border-[#DC2626] text-rose-200 text-xs font-mono flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMessage}</span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <button
                  onClick={() => handleSimulateVoiceInput('Bhaiya main delivery location par pahunch gaya hoon, kripya apna gate open karein.')}
                  className="px-2 py-0.5 rounded-2xs bg-[#FF7700] text-slate-950 font-bold text-[10px] cursor-pointer"
                >
                  Test Sample Voice (Hindi)
                </button>
                <button
                  onClick={() => handleSimulateVoiceInput('Sir, I have reached your door. Please collect your parcel.')}
                  className="px-2 py-0.5 rounded-2xs bg-[#1E293B] border border-slate-600 text-white font-bold text-[10px] cursor-pointer"
                >
                  Test Sample Voice (English)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Translation Output Card */}
        {translationResult && (
          <div className="mt-5 p-4 sm:p-5 rounded-xs border-2 border-[#10B981] bg-[#0E1626] animate-fadeIn shadow-[3px_3px_0px_#000]">
            {/* Output Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-2xs bg-[#10B981] text-slate-950 font-bold uppercase text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Translated into {translationResult.targetLanguage}</span>
                </span>
                <span className="text-slate-400 text-[11px]">
                  Detected: <strong className="text-white">{translationResult.detectedLanguage}</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayAudio}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-2xs font-mono font-bold text-xs cursor-pointer border transition-all ${
                    isPlayingAudio
                      ? 'bg-[#DC2626] text-white border-white animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.6)]'
                      : 'bg-[#FF7700] hover:bg-[#FF881A] text-slate-950 border-black shadow-[1px_1px_0px_#000]'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Speak Translation</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-2xs border border-slate-700 bg-[#1E293B] hover:bg-slate-700 text-slate-200 cursor-pointer shadow-[1px_1px_0px_#000]"
                  title="Copy Translation"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="p-1.5 rounded-2xs border border-slate-700 bg-[#1E293B] hover:bg-[#25D366]/20 text-[#25D366] cursor-pointer shadow-[1px_1px_0px_#000]"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Translated Result Content */}
            <div className="mt-3">
              <h3 className="text-base sm:text-xl font-bold font-heading text-white leading-relaxed">
                {translationResult.translatedText}
              </h3>

              {/* Transliteration Guide (Pronunciation) */}
              {translationResult.transliteration && (
                <div className="mt-2.5 p-2 rounded-2xs bg-[#0B132B] border border-slate-800 font-mono text-xs text-[#FF7700]">
                  <span className="font-bold text-slate-400 mr-1.5 uppercase text-[10px]">
                    How to Pronounce:
                  </span>
                  <span className="italic">{translationResult.transliteration}</span>
                </div>
              )}

              {/* Source Original Text */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 font-mono text-xs text-slate-400 flex items-start gap-2">
                <span className="font-bold uppercase text-[10px] text-slate-500 shrink-0 mt-0.5">
                  Original ({translationResult.detectedLanguage}):
                </span>
                <span className="italic text-slate-300">"{translationResult.sourceText}"</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
