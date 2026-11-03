import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Award,
  Clock,
  Sparkles,
  BrainCircuit,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();

  const skillMastery = [
    { skill: 'Data Structures & Algorithms', level: 85, color: '#8B5CF6' },
    { skill: 'Vector Search & Embeddings', level: 78, color: '#22D3EE' },
    { skill: 'System Design & Distributed State', level: 72, color: '#10B981' },
    { skill: 'Concurrency & Multi-threading', level: 64, color: '#F59E0B' },
    { skill: 'Clean Architecture & Unit Testing', level: 92, color: '#EC4899' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Real-time Engineering Metrics</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Learning & Performance Analytics</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Track your algorithmic velocity, AI-assisted development hours, and problem-solving milestones.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] space-y-2">
          <div className="text-xs text-zinc-400">Total Coding Velocity</div>
          <div className="text-2xl font-bold text-white font-mono">148.5 hrs</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3.5 h-3.5" /> +14% month-over-month
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] space-y-2">
          <div className="text-xs text-zinc-400">AI Collaboration Rate</div>
          <div className="text-2xl font-bold text-white font-mono">94.2%</div>
          <div className="text-[11px] text-purple-400 flex items-center gap-1 font-mono">
            <Sparkles className="w-3.5 h-3.5" /> 382 Accepted Suggestions
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] space-y-2">
          <div className="text-xs text-zinc-400">DSA Success Ratio</div>
          <div className="text-2xl font-bold text-white font-mono">87.5%</div>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
            <BrainCircuit className="w-3.5 h-3.5" /> 46 Problems Solved
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] space-y-2">
          <div className="text-xs text-zinc-400">Code Health Average</div>
          <div className="text-2xl font-bold text-white font-mono">92 / 100</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" /> Grade A Production Standard
          </div>
        </div>
      </div>

      {/* Engineering Skill Mastery */}
      <div className="p-6 rounded-xl bg-[#18181B] border border-[#27272A] space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Engineering Skill Mastery</h2>
          <p className="text-xs text-zinc-400">Benchmarked across solved problems and production code commits</p>
        </div>

        <div className="space-y-4 pt-2">
          {skillMastery.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-200">{item.skill}</span>
                <span className="font-mono text-zinc-400">{item.level}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#27272A] overflow-hidden">
                <div
                  style={{ width: `${item.level}%`, backgroundColor: item.color }}
                  className="h-full rounded-full transition-all duration-700"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
