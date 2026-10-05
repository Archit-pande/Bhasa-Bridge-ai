import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  FileCheck, 
  RefreshCw, 
  X, 
  AlertCircle,
  Mic,
  Radio,
  Camera,
  FileCode
} from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES, AnalyzeRequest } from '../types/contract';

interface DocumentUploadProps {
  onAnalyze: (req: AnalyzeRequest) => Promise<void>;
  isLoading: boolean;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onAnalyze,
  isLoading,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [pastedText, setPastedText] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Voice Dictation state
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const toggleDictation = () => {
    if (isDictating) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
      setIsDictating(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setFileError('Speech recognition is not supported in this browser. You can type or paste contract text directly.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'en' ? 'en-IN' : 'hi-IN';

      let lastFinalText = pastedText;

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const appended = (lastFinalText ? lastFinalText.trim() + ' ' : '') + final + interim;
        setPastedText(appended);
      };

      recognition.onerror = (e: any) => {
        console.warn('Dictation error:', e?.error);
        setIsDictating(false);
      };

      recognition.onend = () => {
        setIsDictating(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsDictating(true);
    } catch (err) {
      console.warn('Could not start dictation:', err);
      setFileError('Could not start microphone dictation. Please allow mic permissions in browser.');
      setIsDictating(false);
    }
  };

  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);

  const [loadingStep, setLoadingStep] = useState<string>('Reading document...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setFileError(null);

    // 25 MB max limit
    if (file.size > 25 * 1024 * 1024) {
      setFileError('File size exceeds 25 MB. Please upload a smaller file or copy the text.');
      return;
    }

    setDocumentTitle(file.name);

    // Determine correct MIME type
    let mimeType = file.type;
    if (!mimeType) {
      if (file.name.endsWith('.pdf')) mimeType = 'application/pdf';
      else if (file.name.endsWith('.png')) mimeType = 'image/png';
      else if (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) mimeType = 'text/plain';
    }

    // Read as Base64 for multimodal vision & API processing
    const base64Reader = new FileReader();
    base64Reader.onload = () => {
      const result = base64Reader.result as string;
      setSelectedImage({
        file,
        previewUrl: file.type.startsWith('image/') ? result : '',
        base64: result,
        mimeType: mimeType || 'application/pdf',
      });
    };
    base64Reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedImage(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeClick = async () => {
    if (isLoading) return;
    setFileError(null);

    if (activeTab === 'upload') {
      if (!selectedImage) {
        setFileError('Please select a document or image to analyze.');
        return;
      }
      setLoadingStep('Uploading & scanning document...');
      await onAnalyze({
        imageBase64: selectedImage.base64,
        mimeType: selectedImage.mimeType,
        documentTitle: documentTitle || selectedImage.file.name,
        targetLanguage: selectedLanguage,
      });
    } else {
      if (!pastedText.trim()) {
        setFileError('Please paste agreement clauses or dictate text with the microphone.');
        return;
      }
      setLoadingStep('Analyzing text & isolating legal risks...');
      await onAnalyze({
        documentText: pastedText.trim(),
        documentTitle: documentTitle || 'Pasted Contract Text',
        targetLanguage: selectedLanguage,
      });
    }
  };

  return (
    <div id="upload-section" className="my-5 sm:my-6 max-w-5xl mx-auto scroll-mt-24">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
            Inspect <span className="text-[#FF7700]">Contract or Policy</span>
          </h2>
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit actual agreements, rate cards, deduction notices, and terms of service.
          </p>
        </div>

        <span className="font-mono text-xs text-[#10B981] font-bold flex items-center gap-1.5 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span>Multimodal OCR Active</span>
        </span>
      </div>

      <div className="civic-card p-3.5 sm:p-6 rounded-xs border-2 border-slate-300 dark:border-slate-800">
        {/* Tab & Language Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-slate-200 dark:border-slate-800">
          {/* Focused Input Tabs (No Examples!) */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-1.5 rounded-xs font-bold transition-all cursor-pointer border-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-[#FF7700] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-[#1E293B]'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Document / Photo</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`px-3.5 py-1.5 rounded-xs font-bold transition-all cursor-pointer border-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'text'
                  ? 'bg-[#FF7700] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-[#1E293B]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Text / Dictate</span>
            </button>
          </div>

          {/* Spoken Voice Language Selector */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-bold hidden sm:inline">Voice:</span>
            <div className="bg-slate-100 dark:bg-[#111827] border-2 border-slate-300 dark:border-slate-700 px-2 py-0.5 shadow-[1px_1px_0px_#000]">
              <select
                aria-label="Select audio speech language"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-transparent font-bold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-slate-900 dark:text-white bg-slate-50 dark:bg-[#111827]">
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* File Error Display if any */}
        {fileError && (
          <div className="mt-3 p-3 rounded-2xs bg-rose-950/40 border border-[#DC2626] text-rose-200 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        {/* Tab 1: Upload (Primary with Drag & Drop) */}
        {activeTab === 'upload' && (
          <div className="mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf,.pdf,.txt,.doc,.docx,.md"
              className="hidden"
            />

            {!selectedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`civic-card-dashed p-6 sm:p-9 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#FF7700] bg-[#FF7700]/10 scale-[1.01]'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="w-12 h-12 rounded-xs bg-[#FF7700]/15 border-2 border-[#FF7700] text-[#FF7700] flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-heading font-black text-slate-900 dark:text-white">
                  Drop Your Contract, Rate Card, or Take a Photo
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  Upload onboarding PDFs, photos of printed terms sheets, phone screenshots of weekly payout statements or penalty notifications.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xs bg-[#FF7700] text-slate-950 font-mono font-bold text-xs border border-black shadow-[2px_2px_0px_#000]">
                    Select PDF or Image from Device
                  </span>
                  <span className="px-3 py-1.5 rounded-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs border border-slate-300 dark:border-slate-700 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Camera Photos Supported</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xs border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#0E1626]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {selectedImage.previewUrl ? (
                      <img
                        src={selectedImage.previewUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-2xs border border-slate-400 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xs bg-[#FF7700] text-slate-950 border-2 border-black flex items-center justify-center font-mono font-black text-xs uppercase shadow-[1px_1px_0px_#000] shrink-0">
                        {selectedImage.file.name.split('.').pop() || 'DOC'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                        <FileCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span className="truncate">{selectedImage.file.name}</span>
                      </div>
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {(selectedImage.file.size / 1024).toFixed(1)} KB • Ready for Multimodal Vision & OCR
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleClearFile}
                    className="p-1.5 rounded-2xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E293B] hover:bg-rose-950/50 hover:border-rose-600 text-slate-700 dark:text-slate-300 hover:text-rose-200 cursor-pointer shadow-[1px_1px_0px_#000] shrink-0"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Text / Dictate */}
        {activeTab === 'text' && (
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Contract / Policy Title (e.g. Swiggy Rain Shift Terms, Ola Driver Agreement)"
              className="w-full font-mono text-xs sm:text-sm p-2.5 rounded-xs border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1626] text-slate-900 dark:text-white focus:outline-hidden focus:border-[#FF7700]"
            />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold">
                  Agreement Text or Disputed Clause:
                </span>
                
                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleDictation}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-2xs font-mono font-bold text-xs cursor-pointer border transition-all ${
                    isDictating
                      ? 'bg-[#DC2626] text-white border-white animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.7)]'
                      : 'bg-slate-200 hover:bg-slate-300 dark:bg-[#1E293B] dark:hover:bg-[#2A3B54] text-slate-900 dark:text-slate-200 border-slate-300 dark:border-slate-700 shadow-[1px_1px_0px_#000]'
                  }`}
                  title={isDictating ? 'Stop dictating' : 'Dictate with microphone'}
                >
                  {isDictating ? (
                    <>
                      <Radio className="w-3.5 h-3.5 text-white animate-ping" />
                      <span>Listening... (Tap to stop)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-[#FF7700]" />
                      <span>Dictate Clause with Mic</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dictation Live Waveform Banner */}
              {isDictating && (
                <div className="mb-2 p-2.5 rounded-2xs bg-red-950/40 border border-red-800 flex items-center justify-between gap-2 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="font-mono text-xs font-bold text-red-200">
                      Speaking live — your spoken words are appearing in the box below
                    </span>
                  </div>
                  {/* Miniature wave bars */}
                  <div className="flex items-end gap-0.5 h-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-500 rounded-full audio-bar-live"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste platform terms, penalty notice, manager WhatsApp messages, or dictate directly with the microphone above..."
                className={`w-full font-mono text-xs sm:text-sm p-3 rounded-xs border-2 bg-slate-50 dark:bg-[#0E1626] text-slate-900 dark:text-white focus:outline-hidden transition-all ${
                  isDictating ? 'border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-slate-300 dark:border-slate-700 focus:border-[#FF7700]'
                }`}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 pt-3.5 border-t-2 border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Verbatim Grounding • Concrete Financial & Deactivation Audit</span>
          </span>

          <button
            onClick={handleAnalyzeClick}
            disabled={isLoading || (activeTab === 'upload' && !selectedImage) || (activeTab === 'text' && !pastedText.trim())}
            className={`px-5 py-2.5 rounded-xs font-mono font-bold text-xs uppercase tracking-wider text-slate-950 transition-all cursor-pointer border-2 border-black ${
              isLoading || (activeTab === 'upload' && !selectedImage) || (activeTab === 'text' && !pastedText.trim())
                ? 'bg-slate-400 dark:bg-slate-700 text-slate-600 dark:text-slate-500 cursor-not-allowed border-slate-400 dark:border-slate-800'
                : 'bg-[#FF7700] hover:bg-[#FF881A] shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{loadingStep}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Audit This Document</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
