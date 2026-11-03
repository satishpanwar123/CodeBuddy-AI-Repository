import { Router, Request, Response } from 'express';
import { CodeExecutionService } from '../services/codeExecutionService.js';
import { db } from '../db/storage.js';

export const executeRouter = Router();

executeRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { language, code, stdin = '' } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required for execution' });
    }

    const result = await CodeExecutionService.execute({
      language,
      code,
      stdin,
    });

    // Update demo stats (coding hours / lines)
    const demoUser = db.users.get('usr_demo_1');
    if (demoUser) {
      demoUser.stats.linesOfCode += code.split('\n').length;
    }

    return res.json({
      success: result.exitCode === 0,
      ...result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Execution failed',
      stdout: '',
      stderr: err.message,
      exitCode: 1,
      executionTimeMs: 0,
    });
  }
});
