import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  BrainCircuit,
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Clock,
  ArrowRight,
  Loader2,
  ChevronRight,
  Code2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DsaProblem } from '../types';

export const DsaPracticePage: React.FC = () => {
  const [problems, setProblems] = useState<DsaProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<DsaProblem | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'typescript' | 'python' | 'cpp' | 'java'>('javascript');
  const [code, setCode] = useState<string>('');
  const [showHints, setShowHints] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [aiMentorHint, setAiMentorHint] = useState<string | null>(null);
  const [isAiHintLoading, setIsAiHintLoading] = useState(false);

  // Fetch problems
  useEffect(() => {
    fetch('/api/dsa')
      .then((res) => res.json())
      .then((data) => {
        if (data.problems && data.problems.length > 0) {
          setProblems(data.problems);
          setSelectedProblem(data.problems[0]);
          setCode(data.problems[0].starterCode[selectedLanguage] || '');
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // When problem or language changes, update editor code
  useEffect(() => {
    if (selectedProblem) {
      setCode(selectedProblem.starterCode[selectedLanguage] || '');
      setTestResults(null);
      setAiMentorHint(null);
    }
  }, [selectedProblem, selectedLanguage]);

  // Submit & evaluate test cases
  const handleSubmitCode = async () => {
    if (!selectedProblem) return;
    setIsRunning(true);
    try {
      const res = await fetch(`/api/dsa/${selectedProblem.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      setTestResults(data.testResults || []);

      if (data.passed) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  // Ask AI DSA Mentor
  const handleAskMentor = async () => {
    if (!selectedProblem) return;
    setIsAiHintLoading(true);
    try {
      const res = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'dsa',
          code,
          language: selectedLanguage,
          prompt: `Give me a helpful Socratic hint for the problem "${selectedProblem.title}" without spoiling the full solution.`,
        }),
      });
      const data = await res.json();
      setAiMentorHint(data.result);
    } catch (err) {
      setAiMentorHint('Consider using a Hash Map or Two Pointer technique to achieve O(N) complexity.');
    } finally {
      setIsAiHintLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#09090B] overflow-hidden select-none">
      {/* Left 1: Problem List Sidebar */}
      <div className="w-72 bg-[#111114] border-r border-[#27272A] flex flex-col shrink-0">
        <div className="h-12 px-4 border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span>Problem Catalog</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">{problems.length} challenges</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {problems.map((prob) => {
            const isSelected = selectedProblem?.id === prob.id;
            return (
              <div
                key={prob.id}
                onClick={() => setSelectedProblem(prob)}
                className={`p-3 rounded-lg text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{prob.title}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                      prob.difficulty === 'Easy'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : prob.difficulty === 'Medium'
                        ? 'text-yellow-400 bg-yellow-500/10'
                        : 'text-rose-400 bg-rose-500/10'
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 flex items-center justify-between font-mono">
                  <span>{prob.category}</span>
                  <span>{prob.acceptanceRate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Left: Problem Details */}
      <div className="w-96 lg:w-[420px] bg-[#0E0E11] border-r border-[#27272A] flex flex-col shrink-0 overflow-y-auto p-5 space-y-5">
        {selectedProblem ? (
          <>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    selectedProblem.difficulty === 'Easy'
                      ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                      : selectedProblem.difficulty === 'Medium'
                      ? 'text-yellow-400 bg-yellow-500/15 border border-yellow-500/30'
                      : 'text-rose-400 bg-rose-500/15 border border-rose-500/30'
                  }`}
                >
                  {selectedProblem.difficulty}
                </span>
                <span className="text-xs text-zinc-400 font-mono">{selectedProblem.category}</span>
              </div>
              <h1 className="text-lg font-bold text-white">{selectedProblem.title}</h1>
            </div>

            {/* Description */}
            <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
              {selectedProblem.description}
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-white uppercase font-mono">Examples</div>
              {selectedProblem.examples.map((ex, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#18181B] border border-[#27272A] space-y-1 font-mono text-[11px]">
                  <div><span className="text-zinc-500">Input:</span> <span className="text-purple-300">{ex.input}</span></div>
                  <div><span className="text-zinc-500">Output:</span> <span className="text-emerald-400">{ex.output}</span></div>
                  {ex.explanation && (
                    <div className="text-[10px] text-zinc-400 pt-1 font-sans">{ex.explanation}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-white uppercase font-mono">Constraints</div>
              <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 font-mono">
                {selectedProblem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* AI DSA Mentor Hint Button */}
            <div className="pt-2">
              <button
                onClick={handleAskMentor}
                disabled={isAiHintLoading}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {isAiHintLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                <span>Ask AI Mentor for Hint</span>
              </button>

              {aiMentorHint && (
                <div className="mt-3 p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-zinc-200 leading-relaxed animate-in fade-in">
                  <div className="font-semibold text-cyan-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> FAANG Mentor Advice:
                  </div>
                  <p className="whitespace-pre-wrap">{aiMentorHint}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-zinc-500 text-xs">Select a problem to view specifications.</div>
        )}
      </div>

      {/* Right: Monaco Code Editor & Test Cases */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
        {/* Editor Controls */}
        <div className="h-12 bg-[#111114] border-b border-[#27272A] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="bg-[#18181B] text-zinc-200 text-xs px-3 py-1 rounded border border-[#27272A] focus:outline-none focus:border-purple-500 font-mono"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => selectedProblem && setCode(selectedProblem.starterCode[selectedLanguage] || '')}
              className="p-1 rounded hover:bg-[#18181B] text-zinc-400 hover:text-white"
              title="Reset code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleSubmitCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>Run & Submit Tests</span>
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            theme="vs-dark"
            language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13.5,
              lineHeight: 22,
              minimap: { enabled: false },
              padding: { top: 12 },
            }}
          />
        </div>

        {/* Bottom Test Case Results */}
        {testResults && (
          <div className="h-44 bg-[#0E0E11] border-t border-[#27272A] p-4 font-mono text-xs overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">Test Case Evaluation</span>
              <span className="text-[10px] text-zinc-400">
                {testResults.filter((t) => t.passed).length} / {testResults.length} Passed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {testResults.map((tc, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border text-[11px] ${
                    tc.passed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">Case {tc.testCaseIndex}</span>
                    {tc.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                  <div className="text-zinc-400 text-[10px]">Expected: {tc.expected}</div>
                  <div className="text-[10px]">Output: {tc.output}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
