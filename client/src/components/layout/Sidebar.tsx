import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Code2,
  Terminal,
  Users2,
  ShieldCheck,
  BrainCircuit,
  GraduationCap,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/projects', label: 'My Projects', icon: FolderGit2 },
  { path: '/editor', label: 'AI Code Editor', icon: Code2, badge: 'Cursor AI' },
  { path: '/playground', label: 'AI Playground', icon: Terminal },
  { path: '/rooms', label: 'Coding Rooms', icon: Users2, badge: 'Live' },
  { path: '/review', label: 'AI Code Review', icon: ShieldCheck },
  { path: '/dsa', label: 'DSA Practice', icon: BrainCircuit },
  { path: '/interview', label: 'Mock Interviews', icon: GraduationCap, badge: 'AI Staff' },
  { path: '/analytics', label: 'Learning Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-[#111114] border-r border-[#27272A] flex flex-col h-screen select-none shrink-0 z-20">
      {/* Brand Header */}
      <div className="h-16 border-b border-[#27272A] flex items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#111114] rounded-[10px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-purple-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white font-mono">CodeBuddy</span>
              <span className="text-[10px] font-semibold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider font-mono">AI</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium">Build Smarter. Ship Faster.</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase font-mono">
          Workspace
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181B]'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* AI Pair Program CTA Card */}
        <div className="pt-4 px-1">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-900/30 to-indigo-950/40 border border-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Gemini 2.0 Agentic Pair</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-2.5">
              Live syntax fix, complexity check, and instant unit test synthesis.
            </p>
            <button
              onClick={() => navigate('/editor')}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition-colors shadow-md shadow-purple-600/25"
            >
              <span>Open IDE Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-[#27272A] bg-[#0E0E11]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-purple-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111114] rounded-full" />
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-zinc-200 truncate">{user?.name || 'Developer'}</div>
              <div className="text-[10px] text-zinc-400 truncate font-mono">{user?.role || 'Staff Engineer'}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-[#18181B] rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
