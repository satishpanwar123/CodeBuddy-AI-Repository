import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  GraduationCap,
  Clock,
  Sparkles,
  Send,
  Loader2,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export const MockInterviewPage: React.FC = () => {
  const { geminiApiKey } = useAuth();

  // 45 minute countdown timer
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Interview stage
  const [stage, setStage] = useState<'clarify' | 'approach' | 'coding' | 'complexity' | 'evaluation'>('approach');
  const [candidateThoughts, setCandidateThoughts] = useState('');
  const [code, setCode] = useState(`// Problem: Design an LRU Cache with O(1) Get and Put
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const oldest = this.cache.keys().next().value;
            this.cache.delete(oldest);
        }
        this.cache.set(key, value);
    }
}
`);

  const [interviewDialogue, setInterviewDialogue] = useState<
    { sender: 'interviewer' | 'candidate'; text: string; time: string }[]
  >([
    {
      sender: 'interviewer',
      text: "Welcome to your Staff Software Engineer technical interview. Today's problem is LRU Cache design with strict O(1) time bounds. Before writing code, how are you approaching the problem and what trade-offs are you considering?",
      time: '00:01',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Timer tick
  useEffect(() => {
    if (!isTimerActive || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, secondsLeft]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Submit response to AI Interviewer
  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateThoughts.trim() || isLoading) return;

    const thoughtText = candidateThoughts.trim();
    setCandidateThoughts('');

    const newCandidateMsg = {
      sender: 'candidate' as const,
      text: thoughtText,
      time: formatTimer(45 * 60 - secondsLeft),
    };
    setInterviewDialogue((prev) => [...prev, newCandidateMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/dsa/dsa_2/interview-eval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          stage,
          candidateThought: thoughtText,
          code,
          language: 'javascript',
        }),
      });

      const data = await res.json();
      const interviewerReply = {
        sender: 'interviewer' as const,
        text: data.feedback || 'Good explanation. Let us proceed to the next stage.',
        time: formatTimer(45 * 60 - secondsLeft),
      };

      setInterviewDialogue((prev) => [...prev, interviewerReply]);

      // Progress stage
      if (stage === 'clarify') setStage('approach');
      else if (stage === 'approach') setStage('coding');
      else if (stage === 'coding') setStage('complexity');
      else if (stage === 'complexity') {
        setStage('evaluation');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      setInterviewDialogue((prev) => [
        ...prev,
        {
          sender: 'interviewer',
          text: `Solid technical reasoning. Your approach satisfies O(1) amortized hash map iteration. Proceed with code verification.`,
          time: 'now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#09090B] overflow-hidden select-none">
      {/* Left Panel: Problem, Stages & AI Interviewer Dialogue */}
      <div className="w-[460px] bg-[#111114] border-r border-[#27272A] flex flex-col shrink-0">
        {/* Interview Top Bar */}
        <div className="h-14 px-4 border-b border-[#27272A] flex items-center justify-between bg-[#141418]">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-xs font-semibold text-white">Staff Interviewer Simulation</div>
              <div className="text-[10px] text-zinc-400 font-mono">Google / Meta Level 6</div>
            </div>
          </div>

          {/* 45 min Countdown */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700/80 font-mono text-xs text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>
        </div>

        {/* 5-Step Interview Pipeline Progress */}
        <div className="px-4 py-2.5 bg-[#0D0D10] border-b border-[#27272A] flex items-center justify-between text-[10px] font-mono">
          {['Clarify', 'Approach', 'Coding', 'Complexity', 'Verdict'].map((s, idx) => {
            const stageKeys = ['clarify', 'approach', 'coding', 'complexity', 'evaluation'];
            const activeIndex = stageKeys.indexOf(stage);
            const isDone = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            return (
              <div
                key={s}
                className={`flex items-center gap-1 ${
                  isCurrent
                    ? 'text-purple-400 font-bold'
                    : isDone
                    ? 'text-emerald-400'
                    : 'text-zinc-500'
                }`}
              >
                <span>{idx + 1}. {s}</span>
              </div>
            );
          })}
        </div>

        {/* Dialogue Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {interviewDialogue.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl leading-relaxed ${
                item.sender === 'interviewer'
                  ? 'bg-[#18181B] text-zinc-200 border border-[#27272A] mr-4'
                  : 'bg-purple-600/20 text-purple-100 border border-purple-500/30 ml-4'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span className={item.sender === 'interviewer' ? 'text-cyan-400 font-semibold' : 'text-purple-300'}>
                  {item.sender === 'interviewer' ? 'Senior Staff Interviewer' : 'You (Candidate)'}
                </span>
                <span>{item.time}</span>
              </div>
              <div className="whitespace-pre-wrap">{item.text}</div>
            </div>
          ))}

          {isLoading && (
            <div className="p-3 rounded-xl bg-[#18181B] border border-purple-500/20 flex items-center gap-2 text-xs text-purple-300 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Interviewer is evaluating your response...</span>
            </div>
          )}
        </div>

        {/* Candidate Response Input */}
        <form onSubmit={handleSendResponse} className="p-3 border-t border-[#27272A] bg-[#0E0E11] space-y-2">
          <textarea
            rows={2}
            placeholder="Explain your approach, trade-offs, or answer interviewer question..."
            value={candidateThoughts}
            onChange={(e) => setCandidateThoughts(e.target.value)}
            className="w-full p-2.5 bg-[#18181B] border border-[#27272A] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none font-sans"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400">Stage: {stage.toUpperCase()}</span>
            <button
              type="submit"
              disabled={!candidateThoughts.trim() || isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold disabled:opacity-40 shadow-sm"
            >
              <span>Submit to Interviewer</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel: Live Coding Whiteboard */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
        <div className="h-14 bg-[#111114] border-b border-[#27272A] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Candidate Live Whiteboard (JavaScript / TypeScript)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setStage('evaluation');
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Award className="w-3.5 h-3.5 text-cyan-300" />
              <span>Complete Mock Interview</span>
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            theme="vs-dark"
            language="javascript"
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
      </div>
    </div>
  );
};
