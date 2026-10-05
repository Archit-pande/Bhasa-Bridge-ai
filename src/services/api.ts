import { AnalysisResult, AnalyzeRequest, TranslationRequest, TranslationResult } from '../types/contract';
import { SAMPLE_DOCUMENTS } from '../data/sampleContracts';

const API_URL = import.meta.env.VITE_API_URL;

export async function requestDocumentAnalysis(payload: AnalyzeRequest): Promise<AnalysisResult> {
  if (payload.documentText && !payload.imageBase64) {
    const matchedSample = SAMPLE_DOCUMENTS.find(
      (s) => s.rawText.trim() === payload.documentText?.trim()
    );

    if (matchedSample) {
      return {
        ...matchedSample.precomputedResult,
        id: 'analysis-' + Date.now(),
        analyzedAt: new Date().toISOString(),
      };
    }
  }

  const res = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Server analysis error (${res.status})`);
  }

  const data: AnalysisResult = await res.json();
  return data;
}

export async function requestGeminiTTS(text: string, voiceName: string = 'Kore'): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voiceName }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.audioBase64 || null;
  } catch (err) {
    console.warn('TTS request error:', err);
    return null;
  }
}

export async function requestUniversalTranslation(payload: TranslationRequest): Promise<TranslationResult> {
  const res = await fetch(`${API_URL}/api/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Translation error (${res.status})`);
  }

  const data: TranslationResult = await res.json();
  return data;
}