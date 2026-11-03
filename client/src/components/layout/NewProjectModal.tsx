import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, FolderPlus, Terminal, Code } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [template, setTemplate] = useState('default');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createProject } = useProject();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createProject(name.trim(), description.trim(), language, template);
      onClose();
      navigate('/editor');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#111114] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Create New Project</h2>
              <p className="text-xs text-zinc-400">Initialize a workspace powered by CodeBuddy AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#18181B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Project Name <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. distributed-kv-store"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Brief summary of your application or algorithm..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Primary Language</label>
              <select
                value={language}
                onChange={e => {
                  setLanguage(e.target.value);
                  setTemplate(e.target.value === 'python' ? 'python' : e.target.value === 'cpp' ? 'cpp' : e.target.value === 'java' ? 'java' : 'default');
                }}
                className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Starter Template</label>
              <select
                value={template}
                onChange={e => setTemplate(e.target.value)}
                className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
              >
                <option value="default">Standard Application</option>
                <option value="python">Python Algorithm Script</option>
                <option value="cpp">Competitive C++ Template</option>
                <option value="java">Enterprise Java Starter</option>
              </select>
            </div>
          </div>

          {/* AI Pair Feature highlight */}
          <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/20 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-zinc-300 leading-relaxed">
              CodeBuddy AI will automatically index your project files and provide context-aware suggestions while you code.
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#27272A]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-[#18181B] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>{isSubmitting ? 'Initializing Workspace...' : 'Create & Open Workspace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
