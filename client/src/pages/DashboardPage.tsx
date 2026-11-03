import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  FolderGit2,
  Clock,
  Sparkles,
  BrainCircuit,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Terminal,
  Play,
  ShieldCheck,
  GraduationCap,
  Users2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { projects, setActiveProject } = useProject();
  const navigate = useNavigate();

  // Weekly coding activity mock (Mon-Sun)
  const weeklyActivity = [
    { day: 'Mon', hours: 4.5, commits: 12, aiAssists: 28 },
    { day: 'Tue', hours: 6.2, commits: 19, aiAssists: 45 },
    { day: 'Wed', hours: 5.8, commits: 15, aiAssists: 36 },
    { day: 'Thu', hours: 7.1, commits: 24, aiAssists: 62 },
    { day: 'Fri', hours: 8.4, commits: 31, aiAssists: 84 },
    { day: 'Sat', hours: 3.2, commits: 8, aiAssists: 19 },
    { day: 'Sun', hours: 4.0, commits: 11, aiAssists: 25 },
  ];

  // Language Distribution
  const languages = [
    { name: 'TypeScript', percent: 45, color: '#3178C6' },
    { name: 'Python', percent: 28, color: '#3572A5' },
    { name: 'C++', percent: 14, color: '#F34B7D' },
    { name: 'Java', percent: 8, color: '#B07219' },
    { name: 'JavaScript', percent: 5, color: '#F7DF1E' },
  ];

  // Recent AI Assistant Activity
  const aiActivity = [
    {
      id: 1,
      type: 'Agentic Debugging',
      desc: 'Fixed memory boundary leak in VectorStore cosine similarity cache',
      time: '12m ago',
      icon: Sparkles,
      color: 'text-purple-400',
    },
    {
      id: 2,
      type: 'Unit Test Generation',
      desc: 'Synthesized 8 unit test suites with 98% coverage for Dijkstra graph solver',
      time: '1h ago',
      icon: Terminal,
      color: 'text-cyan-400',
    },
    {
      id: 3,
      type: 'Code Review Passed',
      desc: 'Rated Grade A (94/100) on Distributed Raft consensus implementation',
      time: '3h ago',
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#18181B] via-[#151518] to-[#121215] border border-[#27272A] p-6 lg:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-32 -mb-16 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Pair Programming System</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
              Welcome back, {user?.name || 'Developer'}!
            </h1>
            <p className="text-sm text-zinc-400">
              Your AI-powered coding workspace is ready. What would you like to ship today?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/editor')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <Code2 className="w-4 h-4 text-cyan-300" />
              <span>Open Code Workspace</span>
            </button>
            <button
              onClick={() => navigate('/rooms')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#202025] hover:bg-[#27272C] text-zinc-200 border border-zinc-700/80 text-xs font-semibold transition-colors"
            >
              <Users2 className="w-4 h-4 text-purple-400" />
              <span>Join Collab Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] hover:border-zinc-700 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400">Total Projects</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            {user?.stats?.totalProjects ?? 14}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2 new repositories this week</span>
          </div>
        </div>

        {/* Coding Hours */}
        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] hover:border-zinc-700 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400">Coding Hours</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            {user?.stats?.codingHours ?? 148} hrs
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
            <span>39.2 hrs active this week</span>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] hover:border-zinc-700 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400">AI Suggestions</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            {user?.stats?.aiSuggestions ?? 382}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-purple-300">
            <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>94.8% accepted rate</span>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] hover:border-zinc-700 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-400">Problems Solved</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            {user?.stats?.problemsSolved ?? 46}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Top 5% algorithm streak</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Weekly Coding Activity + Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Coding Activity Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#18181B] border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Weekly Coding Activity</h2>
              <p className="text-xs text-zinc-400">Total hours and AI pair sessions across the last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" /> Coding Hours
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> AI Assists
              </span>
            </div>
          </div>

          {/* Interactive Chart Bars */}
          <div className="pt-4 h-48 flex items-end justify-between gap-3 px-2">
            {weeklyActivity.map((item, idx) => {
              const maxHours = 10;
              const heightPercent = Math.round((item.hours / maxHours) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-zinc-300 bg-[#27272A] px-2 py-0.5 rounded shadow pointer-events-none">
                    {item.hours}h ({item.aiAssists} AI)
                  </div>
                  <div className="w-full max-w-[42px] bg-[#27272A] h-36 rounded-lg relative overflow-hidden flex flex-col justify-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-purple-600 via-indigo-600 to-cyan-400 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Distribution Breakdown (1 col) */}
        <div className="p-6 rounded-xl bg-[#18181B] border border-[#27272A] space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Language Distribution</h2>
            <p className="text-xs text-zinc-400">Workspace codebase composition</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {languages.map((lang, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  <span className="font-mono text-zinc-400 text-[11px]">{lang.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#27272A] overflow-hidden">
                  <div
                    style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                    className="h-full rounded-full transition-all duration-700"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-zinc-400 border-t border-[#27272A]">
            Auto-detected from active projects and synchronized repositories.
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/editor')}
          className="p-4 rounded-xl bg-gradient-to-br from-[#18181B] to-[#1F1F24] border border-[#27272A] hover:border-purple-500/50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Code2 className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-purple-400 transition-colors" />
          </div>
          <div className="text-xs font-semibold text-white">AI Pair Workspace</div>
          <div className="text-[11px] text-zinc-400 mt-1">Multi-tab Monaco editor with agentic auto-debug.</div>
        </button>

        <button
          onClick={() => navigate('/rooms')}
          className="p-4 rounded-xl bg-gradient-to-br from-[#18181B] to-[#1F1F24] border border-[#27272A] hover:border-cyan-500/50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-600 group-hover:text-white transition-all">
              <Users2 className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-xs font-semibold text-white">Live Collab Room</div>
          <div className="text-[11px] text-zinc-400 mt-1">Multi-cursor pair coding with synchronized runner.</div>
        </button>

        <button
          onClick={() => navigate('/review')}
          className="p-4 rounded-xl bg-gradient-to-br from-[#18181B] to-[#1F1F24] border border-[#27272A] hover:border-emerald-500/50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-xs font-semibold text-white">AI Code Review</div>
          <div className="text-[11px] text-zinc-400 mt-1">Security vulnerabilities, code health score & fixes.</div>
        </button>

        <button
          onClick={() => navigate('/dsa')}
          className="p-4 rounded-xl bg-gradient-to-br from-[#18181B] to-[#1F1F24] border border-[#27272A] hover:border-amber-500/50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <GraduationCap className="w-4 h-4" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-xs font-semibold text-white">DSA & Mock Interview</div>
          <div className="text-[11px] text-zinc-400 mt-1">Practice Two Sum, LRU Cache with AI FAANG mentor.</div>
        </button>
      </div>

      {/* Bottom Grid: Recent Projects + AI Assistant Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#18181B] border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Recent Projects</h2>
              <p className="text-xs text-zinc-400">Continue working on your saved repositories</p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {projects.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-lg bg-[#202025]/60 hover:bg-[#202025] border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[#18181B] text-purple-400 border border-zinc-800">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">{p.description}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181B] text-zinc-300 uppercase border border-zinc-800">
                    {p.language}
                  </span>
                  <button
                    onClick={() => {
                      setActiveProject(p);
                      navigate('/editor');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-medium border border-purple-500/30 transition-all"
                  >
                    <Play className="w-3 h-3" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Activity Feed (1 col) */}
        <div className="p-6 rounded-xl bg-[#18181B] border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">AI Assistant Feed</h2>
            <span className="text-[10px] font-mono text-cyan-400">Real-time</span>
          </div>

          <div className="space-y-3">
            {aiActivity.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="p-3 rounded-lg bg-[#141417] border border-zinc-800/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span className="text-xs font-semibold text-zinc-200">{item.type}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/editor')}
            className="w-full py-2 rounded-lg bg-[#202025] hover:bg-[#27272C] text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/60 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Open AI Chat Assistant</span>
          </button>
        </div>
      </div>
    </div>
  );
};
