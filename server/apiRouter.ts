import { Router, Request, Response } from 'express';
import { 
  analyzeDocumentWithGemini, 
  generateGeminiSpeech, 
  translateContentWithGemini 
} from './geminiService.ts';

export const apiRouter = Router();

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Bhasha Bridge Backend',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

apiRouter.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { documentText, imageBase64, mimeType, documentTitle, targetLanguage } = req.body || {};

    if (!documentText && !imageBase64) {
      return res.status(400).json({
        error: 'Either documentText or imageBase64 is required for analysis.',
      });
    }

    const result = await analyzeDocumentWithGemini({
      documentText,
      imageBase64,
      mimeType,
      documentTitle,
      targetLanguage,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({
      error: 'Failed to complete document analysis',
      message: error?.message || 'Unknown server error',
    });
  }
});

apiRouter.post('/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName } = req.body || {};
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const audioBase64 = await generateGeminiSpeech(text, voiceName || 'Kore');
    if (!audioBase64) {
      return res.status(200).json({
        audioBase64: null,
        fallbackToWebSpeech: true,
      });
    }

    res.json({
      audioBase64,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    res.status(200).json({
      audioBase64: null,
      fallbackToWebSpeech: true,
    });
  }
});

apiRouter.post('/translate', async (req: Request, res: Response) => {
  try {
    const { text, audioBase64, audioMimeType, sourceLanguage, targetLanguage } = req.body || {};

    if (!text && !audioBase64) {
      return res.status(400).json({
        error: 'Either text or audioBase64 is required for translation.',
      });
    }

    const result = await translateContentWithGemini({
      text,
      audioBase64,
      audioMimeType,
      sourceLanguage,
      targetLanguage: targetLanguage || 'English',
    });

    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/translate:', error);
    res.status(500).json({
      error: 'Failed to complete translation',
      message: error?.message || 'Unknown server error',
    });
  }
});
