export type RiskLevel = 'SAFE' | 'CAUTION' | 'RISK';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type LanguageCode = 'hi' | 'en' | 'ta' | 'te' | 'mr' | 'bn' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी (Hinglish/Hindi)', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'Simple English', flag: '🌐' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
];

export interface TranslationLanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const TRANSLATION_LANGUAGES: TranslationLanguageOption[] = [
  { code: 'Hindi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'English', name: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'Hinglish', name: 'Hinglish', nativeName: 'Hinglish (Colloquial)', flag: '🇮🇳' },
  { code: 'Tamil', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'Telugu', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'Marathi', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'Bengali', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'Kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'Gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'Malayalam', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'Punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'Odia', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'Assamese', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'Urdu', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'Spanish', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'French', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'German', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'Arabic', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'Japanese', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'Chinese', name: 'Chinese (Mandarin)', nativeName: '中文', flag: '🇨🇳' },
  { code: 'Russian', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'Portuguese', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
];

export type ClauseCategory = 
  | 'payouts'
  | 'penalties'
  | 'deactivation'
  | 'insurance'
  | 'working_hours'
  | 'equipment'
  | 'legal'
  | 'assignment_rules'
  | 'technical_requirement'
  | 'submission_deadline'
  | 'grading_criteria'
  | 'general';

export interface Clause {
  id: string;
  title: string;
  category: ClauseCategory;
  riskLevel: RiskLevel;
  originalText: string;
  plainExplanation: string;
  analogy: string;
  actionableTip: string;
  financialImpact?: string;
}

export interface AudioScript {
  language: string;
  languageCode: LanguageCode;
  title: string;
  scriptText: string;
  bulletPoints: string[];
  audioBase64?: string;
}

export type DocumentType = 
  | 'contract'
  | 'policy_update'
  | 'payout_slip'
  | 'penalty_notice'
  | 'academic_assignment'
  | 'technical_document'
  | 'other';

export interface AnalysisResult {
  id: string;
  documentTitle: string;
  documentType: DocumentType;
  platformName: string;
  safetyScore: number; // 0 - 100
  confidence: ConfidenceLevel;
  summary: string;
  workerAdvocateAdvice: string[];
  redFlagsCount: number;
  cautionCount: number;
  safeCount: number;
  clauses: Clause[];
  spokenScripts: Record<LanguageCode, AudioScript>;
  workerQuestionsToAsk: string[];
  analyzedAt: string;
}

export interface AnalyzeRequest {
  documentText?: string;
  imageBase64?: string;
  mimeType?: string;
  documentTitle?: string;
  targetLanguage?: LanguageCode;
}

export interface TranslationRequest {
  text?: string;
  audioBase64?: string;
  audioMimeType?: string;
  sourceLanguage?: string;
  targetLanguage: string;
}

export interface TranslationResult {
  sourceText: string;
  detectedLanguage: string;
  targetLanguage: string;
  translatedText: string;
  transliteration?: string;
  audioBase64?: string | null;
}
