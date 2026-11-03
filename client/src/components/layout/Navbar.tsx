import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  Command,
  ExternalLink,
  CheckCircle2,
  Code,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NewProjectModal } from './NewProjectModal';

export const Navbar: React.FC<{ title?: string }> = ({ title }) => {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-[#27272A] bg-[#09090B]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 select-none">
        {/* Left: Section Title or Breadcrumbs */}
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <span>{title || 'Developer Platform'}</span>
          </h1>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Live v2.4</span>
          </span>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full h-9 px-3 rounded-lg bg-[#18181B] border border-[#27272A] hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 flex items-center justify-between text-xs transition-colors shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>Search projects, files, DSA problems, AI tools...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 bg-[#27272A] rounded border border-zinc-700">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Create Project Button */}
          <button
            onClick={() => setIsNewProjectOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Project</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#18181B] border border-transparent hover:border-[#27272A] transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full ring-2 ring-[#09090B]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#18181B] border border-[#27272A] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#27272A] mb-2">
                  <span className="text-xs font-semibold text-white">Notifications</span>
                  <span className="text-[10px] text-purple-400 font-mono">3 unread</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-[#202025] border border-zinc-800 text-xs">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Gemini 2.0 Integration Active</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">Multi-modal pair programmer with agentic self-debugging is ready.</p>
                  </div>

                  <div className="p-2 rounded-lg bg-[#141416] border border-zinc-800/80 text-xs">
                    <div className="flex items-center gap-1.5 text-purple-300 font-medium">
                      <Zap className="w-3 h-3 text-purple-400" />
                      <span>DSA Challenge Available</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">Daily Hard: Trapping Rain Water with live mock interviewer.</p>
                  </div>

                  <div className="p-2 rounded-lg bg-[#141416] border border-zinc-800/80 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Code Review Passed</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">Smart Search Vector Store passed review with 92/100 Grade A.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#27272A]">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="w-7 h-7 rounded-full object-cover border border-[#27272A]"
            />
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NewProjectModal isOpen={isNewProjectOpen} onClose={() => setIsNewProjectOpen(false)} />
    </>
  );
};
