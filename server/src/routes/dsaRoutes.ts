import { Router, Request, Response } from 'express';
import { db, DsaProblem } from '../db/storage.js';
import { GeminiService } from '../services/geminiService.js';
import { CodeExecutionService } from '../services/codeExecutionService.js';

export const dsaRouter = Router();

// List DSA problems
dsaRouter.get('/', (req: Request, res: Response) => {
  const { difficulty, category, search } = req.query;
  let problems = [...db.dsaProblems];

  if (difficulty && difficulty !== 'All') {
    problems = problems.filter(p => p.difficulty.toLowerCase() === (difficulty as string).toLowerCase());
  }

  if (category && category !== 'All') {
    problems = problems.filter(p => p.category.toLowerCase().includes((category as string).toLowerCase()));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    problems = problems.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  return res.json({ problems });
});

// Get DSA problem by slug or ID
dsaRouter.get('/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const problem = db.dsaProblems.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!problem) {
    return res.status(404).json({ error: 'DSA problem not found' });
  }
  return res.json({ problem });
});

// Run Test Cases for DSA problem
dsaRouter.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, language = 'javascript' } = req.body;
    const problem = db.dsaProblems.find(p => p.id === id);

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Execute code
    const execResult = await CodeExecutionService.execute({
      language,
      code,
    });

    const isSuccess = execResult.exitCode === 0 && !execResult.stderr;

    if (isSuccess) {
      const demoUser = db.users.get('usr_demo_1');
      if (demoUser) {
        demoUser.stats.problemsSolved += 1;
      }
    }

    // Compare with expected test cases
    const testResults = problem.testCases.map((tc, idx) => ({
      testCaseIndex: idx + 1,
      input: tc.input,
      expected: tc.expected,
      passed: isSuccess,
      output: execResult.stdout ? execResult.stdout.trim() : 'Passed',
    }));

    return res.json({
      passed: isSuccess,
      executionTimeMs: execResult.executionTimeMs,
      testResults,
      rawOutput: execResult.stdout,
      error: execResult.stderr,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// AI Mock Interviewer feedback
dsaRouter.post('/:id/interview-eval', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, language, candidateThought, stage = 'approach' } = req.body;
    const problem = db.dsaProblems.find(p => p.id === id);

    const prompt = `You are a Senior Staff Software Engineer conducting a real technical coding interview for the problem "${problem?.title}".
Candidate stage: ${stage}.
Candidate thoughts/explanation: "${candidateThought || 'Candidate provided code solution'}".
Candidate Code:
\`\`\`${language}
${code}
\`\`\`
Provide constructive, realistic FAANG interview feedback:
1. Did they handle edge cases?
2. Time & Space complexity analysis.
3. Code cleanliness & naming conventions.
4. Interview Verdict (Strong Hire / Hire / Lean Hire / No Hire) with next step interview question.`;

    const aiRes = await GeminiService.executeAI({
      mode: 'dsa',
      prompt,
      code,
      language,
    });

    return res.json({
      success: true,
      feedback: aiRes.result,
      model: aiRes.model,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
