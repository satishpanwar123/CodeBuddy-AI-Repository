import React, { useState } from 'react';
import {
  Settings,
  Key,
  Monitor,
  Check,
  Sparkles,
  Save,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, geminiApiKey, setGeminiApiKey, updateUserPreferences } = useAuth();
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editor preferences
  const [fontSize, setFontSize] = useState(user?.preferences?.fontSize || 14);
  const [tabSize, setTabSize] = useState(user?.preferences?.tabSize || 2);
  const [keybinding, setKeybinding] = useState(user?.preferences?.keybinding || 'standard');
  const [theme, setTheme] = useState(user?.preferences?.theme || 'deep-black');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(apiKeyInput.trim());
    updateUserPreferences({
      fontSize,
      tabSize,
      keybinding,
      theme,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 select-none">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure your AI engine credentials, Monaco editor preferences, and workspace visual theme.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gemini API Key Configuration */}
        <div className="p-6 rounded-xl bg-[#18181B] border border-[#27272A] space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-600/15 text-purple-400 border border-purple-500/20">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Google Gemini API Key</h2>
              <p className="text-xs text-zinc-400">
                Connect your personal Google AI Studio key for unlimited high-speed pairing.
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-3 py-2 pr-10 bg-[#111114] border border-[#27272A] rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="text-[11px] text-zinc-500 leading-relaxed">
            Note: If left blank, CodeBuddy AI automatically uses our built-in high-performance fallback engine so you can code without interruption.
          </div>
        </div>

        {/* Editor Configuration */}
        <div className="p-6 rounded-xl bg-[#18181B] border border-[#27272A] space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-600/15 text-cyan-400 border border-cyan-500/20">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Monaco Editor Configuration</h2>
              <p className="text-xs text-zinc-400">Personalize font sizing, indents, and cursor behaviors.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono">Font Size</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full bg-[#111114] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value={12}>12 px (Compact)</option>
                <option value={13}>13 px</option>
                <option value={14}>14 px (Default)</option>
                <option value={16}>16 px (Comfortable)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono">Tab Size</label>
              <select
                value={tabSize}
                onChange={(e) => setTabSize(Number(e.target.value))}
                className="w-full bg-[#111114] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 font-mono">Keybinding</label>
              <select
                value={keybinding}
                onChange={(e) => setKeybinding(e.target.value as any)}
                className="w-full bg-[#111114] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value="standard">Standard (VS Code)</option>
                <option value="vim">Vim Mode</option>
                <option value="emacs">Emacs Mode</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visual Theme Selection */}
        <div className="p-6 rounded-xl bg-[#18181B] border border-[#27272A] space-y-4">
          <h2 className="text-sm font-semibold text-white">Visual Design System</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'deep-black', label: 'Deep Black (#09090B)', preview: '#09090B' },
              { id: 'midnight', label: 'Midnight (#0F172A)', preview: '#0F172A' },
              { id: 'dark', label: 'VS Code Dark (#1E1E1E)', preview: '#1E1E1E' },
            ].map((t) => (
              <div
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  theme === t.id
                    ? 'border-purple-500 bg-purple-950/20 text-white'
                    : 'border-[#27272A] bg-[#111114] text-zinc-400 hover:text-white'
                }`}
              >
                <div className="w-full h-8 rounded mb-2" style={{ backgroundColor: t.preview }} />
                <span className="text-xs font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 transition-all"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Preferences Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
