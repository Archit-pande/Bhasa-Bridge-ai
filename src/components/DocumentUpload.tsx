import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Camera, 
  Sparkles, 
  Layers, 
  FileCheck, 
  RefreshCw, 
  X, 
  ArrowRight,
  AlertCircle,
  Mic,
  MicOff,
  Radio
} from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES, AnalyzeRequest } from '../types/contract';
import { SAMPLE_DOCUMENTS, SampleDocument } from '../data/sampleContracts';

interface DocumentUploadProps {
  onAnalyze: (req: AnalyzeRequest) => Promise<void>;
  isLoading: boolean;
  selectedLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onSelectSampleDirect: (sample: SampleDocument) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onAnalyze,
  isLoading,
  selectedLanguage,
  onLanguageChange,
  onSelectSampleDirect,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'sample'>('upload');
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_DOCUMENTS[0].id);
  const [pastedText, setPastedText] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [extractedFileText, setExtractedFileText] = useState<string>('');
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
      setFileError('Speech recognition is not supported in this browser. You can type or paste text.');
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
      else if (file.name.endsWith('.txt') || file.name.endsWith('.sh') || file.name.endsWith('.py') || file.name.endsWith('.md')) mimeType = 'text/plain';
    }

    // Read as Base64 for multimodal vision & API processing
    const base64Reader = new FileReader();
    base64Reader.onload = () => {
      const result = base64Reader.result as string;
      setSelectedImage({
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        base64: result,
        mimeType: mimeType || 'application/pdf',
      });
    };
    base64Reader.onerror = () => {
      setFileError('Failed to read the file. Please try another format.');
    };
    base64Reader.readAsDataURL(file);

    // If text-like or code, also read raw text to send directly alongside
    if (file.type.startsWith('text/') || file.name.match(/\.(txt|md|sh|py|json|csv|js|ts|c|cpp|java)$/i)) {
      const textReader = new FileReader();
      textReader.onload = () => {
        setExtractedFileText(textReader.result as string);
      };
      textReader.readAsText(file);
    } else {
      setExtractedFileText('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClearFile = () => {
    setSelectedImage(null);
    setDocumentTitle('');
    setExtractedFileText('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyzeClick = async () => {
    if (isLoading) return;

    if (activeTab === 'sample') {
      const sample = SAMPLE_DOCUMENTS.find((s) => s.id === selectedSampleId);
      if (sample) {
        onSelectSampleDirect(sample);
      }
      return;
    }

    if (activeTab === 'upload') {
      if (!selectedImage) return;
      setLoadingStep(`Analyzing "${selectedImage.file.name}" with Gemini AI...`);
      await onAnalyze({
        imageBase64: selectedImage.base64,
        mimeType: selectedImage.mimeType,
        documentTitle: documentTitle || selectedImage.file.name,
        documentText: extractedFileText || undefined,
        targetLanguage: selectedLanguage,
      });
      return;
    }

    if (activeTab === 'text') {
      if (!pastedText.trim()) return;
      setLoadingStep('Parsing clauses & guidelines with Gemini AI...');
      await onAnalyze({
        documentText: pastedText,
        documentTitle: documentTitle || 'Pasted Document / Assignment Text',
        targetLanguage: selectedLanguage,
      });
    }
  };

  return (
    <div id="upload-section" className="my-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white">
          Inspect a <span className="text-[#FF7700]">Contract or Document</span>
        </h2>
        <span className="font-mono text-xs text-slate-400 hidden sm:inline">
          Live Gemini Multimodal Vision & OCR
        </span>
      </div>

      {/* Main Container */}
      <div className="civic-card p-4 sm:p-6 rounded-xs">
        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto font-mono text-xs scrollbar-none">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-xs font-bold transition-all cursor-pointer border-2 whitespace-nowrap ${
                activeTab === 'upload'
                  ? 'bg-[#FF7700] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#111827] text-slate-300 border-slate-700 hover:bg-[#1E293B]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Document / PDF</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`px-3 py-1.5 rounded-xs font-bold transition-all cursor-pointer border-2 whitespace-nowrap ${
                activeTab === 'text'
                  ? 'bg-[#FF7700] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#111827] text-slate-300 border-slate-700 hover:bg-[#1E293B]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Paste Text</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sample')}
              className={`px-3 py-1.5 rounded-xs font-bold transition-all cursor-pointer border-2 whitespace-nowrap ${
                activeTab === 'sample'
                  ? 'bg-[#FF7700] text-slate-950 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-[#111827] text-slate-300 border-slate-700 hover:bg-[#1E293B]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Verified Samples</span>
              </span>
            </button>
          </div>

          {/* Voice Language Selector */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400 font-bold hidden sm:inline">Voice:</span>
            <div className="bg-[#111827] border-2 border-slate-700 px-2 py-0.5 shadow-[1px_1px_0px_#000]">
              <select
                aria-label="Select audio speech language"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-transparent font-bold text-white focus:outline-hidden cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-white bg-[#111827]">
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
              accept="image/*,application/pdf,.pdf,.txt,.doc,.docx,.sh,.py,.json,.csv,.md"
              className="hidden"
            />

            {!selectedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`civic-card-dashed p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#FF7700] bg-[#FF7700]/10 scale-[1.01]'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <UploadCloud className="w-9 h-9 text-[#FF7700] mx-auto mb-2" />
                <h3 className="text-sm sm:text-base font-heading font-black text-white">
                  Upload PDF, Photo, or Document
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Drag and drop your PDF agreement, assignment, code script, or photo. Gemini vision analyzes every line directly.
                </p>
                <span className="inline-block mt-3 px-3 py-1 rounded-2xs bg-[#1E293B] border border-slate-700 text-[11px] font-mono font-bold text-slate-300">
                  Select File from Computer / Phone
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xs border-2 border-slate-700 bg-[#0E1626]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {selectedImage.previewUrl ? (
                      <img
                        src={selectedImage.previewUrl}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-2xs border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xs bg-[#FF7700] text-slate-950 border-2 border-black flex items-center justify-center font-mono font-black text-xs uppercase shadow-[1px_1px_0px_#000] shrink-0">
                        {selectedImage.file.name.split('.').pop() || 'DOC'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-heading font-bold text-sm text-white flex items-center gap-1.5 truncate">
                        <FileCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span className="truncate">{selectedImage.file.name}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                        {(selectedImage.file.size / 1024).toFixed(1)} KB • Ready for AI Multi-modal Vision
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleClearFile}
                    className="p-1 rounded-2xs border border-slate-700 bg-[#1E293B] hover:bg-rose-950/50 hover:border-rose-600 text-slate-300 hover:text-rose-200 cursor-pointer shadow-[1px_1px_0px_#000] shrink-0"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Paste Text */}
        {activeTab === 'text' && (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Document or assignment title (e.g. Shell Scripting Lab 5)"
              className="w-full font-mono text-xs sm:text-sm p-2 rounded-xs border-2 border-slate-700 bg-[#0E1626] text-white focus:outline-hidden"
            />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-slate-400">Content / Clauses:</span>
                
                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleDictation}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-2xs font-mono font-bold text-[11px] cursor-pointer border transition-all ${
                    isDictating
                      ? 'bg-[#DC2626] text-white border-white animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.7)]'
                      : 'bg-[#1E293B] hover:bg-[#2A3B54] text-slate-200 border-slate-700 shadow-[1px_1px_0px_#000]'
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
                      <span>Dictate with Mic</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dictation Live Waveform Banner */}
              {isDictating && (
                <div className="mb-2 p-2 rounded-2xs bg-red-950/40 border border-red-800 flex items-center justify-between gap-2 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-mono text-[11px] font-bold text-red-200">
                      Speaking live — words will appear automatically below
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
                placeholder="Paste contract clauses, cancellation rules, lab questions, or dictate directly with the microphone above..."
                className={`w-full font-mono text-xs sm:text-sm p-3 rounded-xs border-2 bg-[#0E1626] text-white focus:outline-hidden transition-all ${
                  isDictating ? 'border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-slate-700'
                }`}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Sample Contracts */}
        {activeTab === 'sample' && (
          <div id="sample-section" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SAMPLE_DOCUMENTS.map((sample) => {
                const isSelected = selectedSampleId === sample.id;
                return (
                  <div
                    key={sample.id}
                    onClick={() => setSelectedSampleId(sample.id)}
                    className={`p-3.5 rounded-xs border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#FF7700] bg-[#192438] shadow-[3px_3px_0px_#FF7700]'
                        : 'border-slate-700 bg-[#0E1626] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5 font-mono text-xs">
                      <span className="font-bold px-1.5 py-0.2 rounded-2xs bg-[#0B132B] text-[#FF7700] border border-slate-700">
                        {sample.categoryBadge}
                      </span>
                      <span className="font-bold text-slate-400 text-[11px]">
                        {sample.platform.split('/')[0]}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-sm sm:text-base text-white">
                      {sample.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {sample.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                      <span className="text-slate-400">
                        Score: <strong className="text-[#FF7700]">{sample.precomputedResult.safetyScore}/100</strong>
                      </span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <span>{isSelected ? 'Selected' : 'Choose'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t-2 border-slate-800 flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>Active Multimodal AI Engine</span>
          </span>

          <button
            onClick={handleAnalyzeClick}
            disabled={isLoading || (activeTab === 'upload' && !selectedImage) || (activeTab === 'text' && !pastedText.trim())}
            className={`px-5 py-2 rounded-xs font-mono font-bold text-xs uppercase tracking-wider text-slate-950 transition-all cursor-pointer border-2 border-black ${
              isLoading || (activeTab === 'upload' && !selectedImage) || (activeTab === 'text' && !pastedText.trim())
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed border-slate-800'
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
                <span>
                  {activeTab === 'sample'
                    ? 'Inspect Sample'
                    : 'Decode My Document'}
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
