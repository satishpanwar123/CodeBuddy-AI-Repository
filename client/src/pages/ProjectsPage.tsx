import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Play,
  Trash2,
  ExternalLink,
  Code2,
  Clock,
  Sparkles,
  FileCode,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { NewProjectModal } from '../components/layout/NewProjectModal';

export const ProjectsPage: React.FC = () => {
  const { projects, setActiveProject, deleteFile } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Projects</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your AI-powered codebases, algorithms, and microservices.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] hover:border-zinc-700 transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-purple-600/10 text-purple-400 border border-purple-500/20">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111114] text-zinc-300 uppercase border border-zinc-800">
                  {proj.language}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {proj.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {proj.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono pt-2">
                <FileCode className="w-3.5 h-3.5 text-zinc-400" />
                <span>{proj.files.length} files indexed</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#27272A] flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">
                {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
              </span>

              <button
                onClick={() => {
                  setActiveProject(proj);
                  navigate('/editor');
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-semibold border border-purple-500/30 transition-all"
              >
                <Play className="w-3 h-3" />
                <span>Open in IDE</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
