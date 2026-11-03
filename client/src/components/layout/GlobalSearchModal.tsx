import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Code2,
  FolderGit2,
  BrainCircuit,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { projects, openFile } = useProject();

  if (!isOpen) return null;

  const quickLinks = [
    { label: 'AI Code Editor (Workspace)', path: '/editor', icon: Code2, category: 'Core IDE' },
    { label: 'Start Real-Time Collab Room', path: '/rooms', icon: Sparkles, category: 'Collaboration' },
    { label: 'AI Code Review & Security Audit', path: '/review', icon: ShieldCheck, category: 'Code Health' },
    { label: 'DSA Practice: Two Sum', path: '/dsa', icon: BrainCircuit, category: 'Algorithms' },
    { label: 'DSA Practice: LRU Cache', path: '/dsa', icon: BrainCircuit, category: 'Algorithms' },
    { label: 'FAANG AI Mock Interview', path: '/interview', icon: GraduationCap, category: 'Career Prep' },
    { label: 'Learning & Coding Analytics', path: '/analytics', icon: FolderGit2, category: 'Stats' },
  ];

  const filteredLinks = quickLinks.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.language.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#111114] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#27272A] gap-3">
          <Search className="w-5 h-5 text-purple-400" />
          <input
            type="text"
            placeholder="Type a command, project, file, or search DSA problems..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#18181B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Nav & AI Tools */}
          <div>
            <div className="text-[10px] uppercase font-mono font-semibold text-zinc-400 px-2 mb-1.5">
              AI Tools & Navigation
            </div>
            <div className="space-y-1">
              {filteredLinks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#18181B] text-zinc-300 hover:text-white transition-all text-xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-[#18181B] group-hover:bg-purple-900/30 text-purple-400 border border-zinc-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-400">{item.category}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-mono font-semibold text-zinc-400 px-2 mb-1.5">
                Projects
              </div>
              <div className="space-y-1">
                {filteredProjects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('/editor')}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#18181B] text-zinc-300 hover:text-white transition-all text-xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-[#18181B] text-cyan-400 border border-zinc-800">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-white">{p.name}</div>
                        <div className="text-[10px] text-zinc-400">{p.description}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">
                      {p.language}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 border-t border-[#27272A] bg-[#0E0E11] flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-300">↑</kbd> <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-300">↓</kbd></span>
            <span>Select: <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-300">↵</kbd></span>
          </div>
          <span>CodeBuddy Spotlight</span>
        </div>
      </div>
    </div>
  );
};
