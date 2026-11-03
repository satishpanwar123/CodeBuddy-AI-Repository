import { Router, Request, Response } from 'express';
import { GeminiService, AIRequestOptions } from '../services/geminiService.js';
import { db } from '../db/storage.js';

export const aiRouter = Router();

aiRouter.post('/process', async (req: Request, res: Response) => {
  try {
    const {
      mode = 'chat',
      prompt = '',
      code = '',
      language = 'typescript',
      selectedCode = '',
      executionError = '',
      userApiKey = '',
    } = req.body;

    // Optional user token extraction to update user stats
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Increment AI suggestions stat for demo user
      const demoUser = db.users.get('usr_demo_1');
      if (demoUser) {
        demoUser.stats.aiSuggestions += 1;
      }
    }

    const aiOptions: AIRequestOptions = {
      mode,
      prompt,
      code,
      language,
      selectedCode,
      executionError,
      userApiKey: userApiKey || req.headers['x-gemini-api-key'] as string,
    };

    const response = await GeminiService.executeAI(aiOptions);
    return res.json({
      success: true,
      ...response,
    });
  } catch (err: any) {
    console.error('AI Processing Route Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'AI engine processing failed',
    });
  }
});

// Quick action endpoint for common editor buttons
aiRouter.post('/quick-action', async (req: Request, res: Response) => {
  try {
    const { action, code, language, selectedCode, error, userApiKey } = req.body;
    
    let mode: AIRequestOptions['mode'] = 'explain';
    let prompt = '';

    switch (action) {
      case 'explain':
        mode = 'explain';
        prompt = 'Explain this code in detail, breaking down logic and time/space complexity.';
        break;
      case 'debug':
        mode = 'debug';
        prompt = 'Find and fix all syntax, runtime, and logical bugs in this code.';
        break;
      case 'optimize':
        mode = 'optimize';
        prompt = 'Optimize this code for execution speed and lower memory usage.';
        break;
      case 'tests':
        mode = 'tests';
        prompt = 'Generate a comprehensive unit test suite covering edge cases.';
        break;
      case 'review':
        mode = 'review';
        prompt = 'Perform a thorough code review assessing security, performance, and best practices.';
        break;
      case 'docs':
        mode = 'docs';
        prompt = 'Generate clean JSDoc / documentation for all functions and classes.';
        break;
      default:
        mode = 'chat';
        prompt = 'Review and enhance this code.';
    }

    const response = await GeminiService.executeAI({
      mode,
      prompt,
      code,
      language,
      selectedCode,
      executionError: error,
      userApiKey,
    });

    return res.json({
      success: true,
      action,
      ...response,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
