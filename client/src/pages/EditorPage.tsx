import React, { useState, useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import {
  Play,
  Save,
  Sparkles,
  Bug,
  Zap,
  TestTube,
  ShieldCheck,
  RotateCcw,
  Copy,
  Check,
  Plus,
  Trash2,
  FileCode,
  FolderTree,
  Search,
  Maximize2,
  Terminal,
  Send,
  Loader2,
  ChevronDown,
  X,
  FileText,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Split,
  MessageSquare,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { AIMode, AIChatMessage, ExecutionResult, ProjectFile } from '../types';

export const EditorPage: React.FC = () => {
  const {
    activeProject,
    activeFile,
    openFileIds,
    openFile,
    closeFile,
    updateFileContent,
    createFile,
    deleteFile,
    changeLanguage,
    saveCurrentProject,
    resetProjectCode,
  } = useProject();

  const { geminiApiKey } = useAuth();

  // Editor states
  const editorRef = useRef<any>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // File explorer filter
  const [fileSearch, setFileSearch] = useState('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  // Terminal / Execution state
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [terminalTab, setTerminalTab] = useState<'output' | 'input' | 'tests'>('output');
  const [stdin, setStdin] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>({
    stdout: 'Ready to execute. Click "Run Code" or press Shift+Enter to compile and run.',
    stderr: '',
    exitCode: 0,
    executionTimeMs: 0,
    source: 'sandbox',
  });

  // AI Assistant states
  const [aiMode, setAiMode] = useState<AIMode>('chat');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      mode: 'chat',
      content: `Hello! I am **CodeBuddy AI**, your senior pair programmer.\n\nI have indexed your active file \`${activeFile?.name || 'project'}\` and I am ready to:\n- ⚡ **Generate** idiomatic implementations\n- 🔍 **Explain** complexity line-by-line\n- 🐛 **Debug** and patch syntax/runtime errors\n- 🚀 **Optimize** time & space complexity\n- 🧪 **Synthesize** automated unit tests\n\nSelect any code snippet or ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'Gemini 2.0 Agentic Engine',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiLoading]);

  // Handle Monaco Mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define sleek Deep Black / Electric Violet Monaco theme
    monaco.editor.defineTheme('codebuddyDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '71717A', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C084FC', fontStyle: 'bold' },
        { token: 'string', foreground: '34D399' },
        { token: 'number', foreground: 'FBBF24' },
        { token: 'type', foreground: '22D3EE' },
        { token: 'function', foreground: '60A5FA' },
      ],
      colors: {
        'editor.background': '#09090B',
        'editor.foreground': '#F4F4F5',
        'editor.lineHighlightBackground': '#18181B',
        'editorLineNumber.foreground': '#52525B',
        'editorLineNumber.activeForeground': '#A855F7',
        'editor.selectionBackground': '#8B5CF633',
        'editor.inactiveSelectionBackground': '#8B5CF61A',
        'editorCursor.foreground': '#22D3EE',
        'editorWhitespace.foreground': '#27272A',
        'editorIndentGuide.background': '#1F1F23',
        'editorIndentGuide.activeBackground': '#3F3F46',
      },
    });

    monaco.editor.setTheme('codebuddyDark');

    // Track text selection for contextual AI prompting
    editor.onDidChangeCursorSelection((e) => {
      const selection = editor.getModel()?.getValueInRange(e.selection);
      setSelectedText(selection && selection.trim().length > 0 ? selection : '');
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });
  };

  // Run Code
  const handleRunCode = async () => {
    if (!activeFile) return;
    setIsExecuting(true);
    setIsTerminalOpen(true);
    setTerminalTab('output');

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeFile.language,
          code: activeFile.content,
          stdin,
        }),
      });

      const data = await res.json();
      setExecutionResult(data);

      // If execution generated an error, notify AI
      if (data.stderr || data.exitCode !== 0) {
        // Automatically give quick option to debug
      }
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err.message || 'Execution connection failed',
        exitCode: 1,
        executionTimeMs: 0,
        source: 'sandbox',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Save Code
  const handleSave = async () => {
    await saveCurrentProject();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  // Copy Code
  const handleCopyCode = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format Code
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  // Apply AI Generated Code to Monaco Editor
  const handleApplyAiCode = (codeText: string) => {
    if (!activeFile || !editorRef.current) return;

    // Extract code block if wrapped in markdown
    const codeMatch = codeText.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const cleanCode = codeMatch ? codeMatch[1] : codeText;

    if (selectedText && selectedText.trim().length > 0) {
      // Replace selection
      const selection = editorRef.current.getSelection();
      editorRef.current.executeEdits('ai-apply', [
        {
          range: selection,
          text: cleanCode,
          forceMoveMarkers: true,
        },
      ]);
      updateFileContent(activeFile.id, editorRef.current.getValue());
    } else {
      // Replace or update entire file content
      updateFileContent(activeFile.id, cleanCode);
    }

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  // Quick Action triggered from Toolbar (Explain, Debug, Optimize, Tests)
  const handleQuickAction = async (action: 'explain' | 'debug' | 'optimize' | 'tests') => {
    if (!activeFile) return;

    const actionModes: Record<string, AIMode> = {
      explain: 'explain',
      debug: 'debug',
      optimize: 'optimize',
      tests: 'tests',
    };

    const targetMode = actionModes[action];
    setAiMode(targetMode);

    const userMsg: AIChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      mode: targetMode,
      content: `Run ${action.toUpperCase()} on ${selectedText ? 'selected snippet' : activeFile.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/quick-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          action,
          code: activeFile.content,
          language: activeFile.language,
          selectedCode: selectedText,
          error: executionResult?.stderr,
          userApiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      const aiReply: AIChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        mode: targetMode,
        content: data.result || 'No response generated',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model,
      };

      setChatMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          content: `Error connecting to AI service: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Submit AI Prompt from Right Panel Chat Bar
  const handleSendPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPrompt.trim() || isAiLoading) return;

    const userText = aiPrompt.trim();
    setAiPrompt('');

    const userMsg: AIChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      mode: aiMode,
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': geminiApiKey,
        },
        body: JSON.stringify({
          mode: aiMode,
          prompt: userText,
          code: activeFile?.content || '',
          language: activeFile?.language || 'typescript',
          selectedCode: selectedText,
          executionError: executionResult?.stderr,
          userApiKey: geminiApiKey,
        }),
      });

      const data = await res.json();
      const aiReply: AIChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        mode: aiMode,
        content: data.result || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model,
      };

      setChatMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          content: `Could not process request: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Create new file handler
  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    createFile(newFileName.trim());
    setNewFileName('');
    setIsCreatingFile(false);
  };

  // Filter project files
  const filteredFiles = activeProject?.files.filter((f) =>
    f.name.toLowerCase().includes(fileSearch.toLowerCase())
  ) || [];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#09090B] overflow-hidden select-none">
      {/* ========================================================== */}
      {/* 1. LEFT PANEL: FILE EXPLORER & PROJECT STRUCTURE */}
      {/* ========================================================== */}
      <div className="w-60 bg-[#111114] border-r border-[#27272A] flex flex-col shrink-0">
        {/* Explorer Header */}
        <div className="h-10 px-3 border-b border-[#27272A] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-300 uppercase tracking-wider text-[11px] font-mono">
            <FolderTree className="w-3.5 h-3.5 text-purple-400" />
            <span>Explorer</span>
          </div>
          <button
            onClick={() => setIsCreatingFile(true)}
            title="Create New File"
            className="p-1 rounded hover:bg-[#18181B] text-zinc-400 hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Project Name & Search */}
        <div className="p-2 border-b border-[#27272A] space-y-2">
          <div className="text-xs font-semibold text-zinc-200 truncate px-1">
            {activeProject?.name || 'Workspace'}
          </div>
          <div className="relative">
            <Search className="w-3 h-3 text-zinc-500 absolute left-2 top-2" />
            <input
              type="text"
              placeholder="Filter files..."
              value={fileSearch}
              onChange={(e) => setFileSearch(e.target.value)}
              className="w-full pl-6 pr-2 py-1 bg-[#18181B] border border-[#27272A] rounded text-[11px] text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* New File Inline Form */}
        {isCreatingFile && (
          <form onSubmit={handleCreateFileSubmit} className="p-2 border-b border-purple-500/30 bg-purple-950/20">
            <input
              type="text"
              autoFocus
              placeholder="filename.ext (e.g. algo.py)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={() => !newFileName && setIsCreatingFile(false)}
              className="w-full px-2 py-1 bg-[#18181B] border border-purple-500 rounded text-xs text-white focus:outline-none font-mono"
            />
          </form>
        )}

        {/* File Tree List */}
        <div className="flex-1 overflow-y-auto py-1 px-1.5 space-y-0.5">
          {filteredFiles.map((file) => {
            const isActive = activeFile?.id === file.id;
            return (
              <div
                key={file.id}
                onClick={() => openFile(file.id)}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181B]'
                }`}
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <FileCode
                    className={`w-3.5 h-3.5 shrink-0 ${
                      file.name.endsWith('.py')
                        ? 'text-yellow-400'
                        : file.name.endsWith('.cpp')
                        ? 'text-blue-400'
                        : file.name.endsWith('.ts')
                        ? 'text-cyan-400'
                        : 'text-purple-400'
                    }`}
                  />
                  <span className="truncate font-mono text-[12px]">{file.name}</span>
                </div>

                {/* Delete button (show on hover) */}
                {activeProject && activeProject.files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.id);
                    }}
                    title="Delete file"
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-500 hover:text-red-400 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Explorer Footer Quick Templates */}
        <div className="p-2 border-t border-[#27272A] bg-[#0D0D10] text-[11px] text-zinc-400">
          <div className="font-semibold text-zinc-300 mb-1 flex items-center gap-1 font-mono">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>Templates</span>
          </div>
          <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
            <button
              onClick={() => createFile('algo.py', 'python', 'def solve():\n    print("Running Python...")\n\nsolve()\n')}
              className="px-1.5 py-1 rounded bg-[#18181B] hover:bg-[#202025] text-zinc-300 text-left border border-zinc-800"
            >
              + Python
            </button>
            <button
              onClick={() => createFile('main.cpp', 'cpp', '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "C++ Speed!" << endl;\n    return 0;\n}\n')}
              className="px-1.5 py-1 rounded bg-[#18181B] hover:bg-[#202025] text-zinc-300 text-left border border-zinc-800"
            >
              + C++
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. CENTER PANEL: MONACO CODE EDITOR & TERMINAL */}
      {/* ========================================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090B]">
        {/* Top File Tabs Bar */}
        <div className="h-10 bg-[#111114] border-b border-[#27272A] flex items-center justify-between px-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1">
            {openFileIds.map((fileId) => {
              const file = activeProject?.files.find((f) => f.id === fileId);
              if (!file) return null;
              const isActive = activeFile?.id === fileId;
              return (
                <div
                  key={fileId}
                  onClick={() => openFile(fileId)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer border-t-2 transition-all ${
                    isActive
                      ? 'bg-[#09090B] text-zinc-100 border-purple-500 font-medium shadow-sm'
                      : 'bg-[#141418] text-zinc-400 border-transparent hover:text-zinc-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-mono text-[11px]">{file.name}</span>
                  {openFileIds.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeFile(fileId);
                      }}
                      className="p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Language Selector in Tab Bar */}
          {activeFile && (
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={activeFile.language}
                onChange={(e) => changeLanguage(activeFile.id, e.target.value)}
                className="bg-[#18181B] text-zinc-300 text-[11px] font-mono px-2 py-1 rounded border border-[#27272A] focus:outline-none focus:border-purple-500"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
              </select>
            </div>
          )}
        </div>

        {/* Editor Action Toolbar */}
        <div className="h-10 bg-[#0E0E11] border-b border-[#27272A] px-3 flex items-center justify-between gap-2 shrink-0">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Run Code Button */}
            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>Run Code</span>
              <kbd className="hidden sm:inline text-[9px] bg-emerald-700/60 px-1 rounded font-mono">⇧↵</kbd>
            </button>

            {/* Save Code */}
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#18181B] hover:bg-[#222227] text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/70 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-zinc-400" />
              <span>{savedNotice ? 'Saved!' : 'Save'}</span>
            </button>

            {/* Format */}
            <button
              onClick={handleFormatCode}
              title="Format Document"
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#18181B] hover:bg-[#222227] text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/70 transition-colors"
            >
              <Split className="w-3.5 h-3.5 text-zinc-400" />
              <span>Format</span>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#18181B] hover:bg-[#222227] text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/70 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={resetProjectCode}
              title="Reset code"
              className="p-1 rounded-md hover:bg-[#18181B] text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right AI Quick Triggers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleQuickAction('explain')}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-[11px] font-medium transition-all"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Explain</span>
            </button>

            <button
              onClick={() => handleQuickAction('debug')}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[11px] font-medium transition-all"
            >
              <Bug className="w-3 h-3 text-rose-400" />
              <span>Debug</span>
            </button>

            <button
              onClick={() => handleQuickAction('optimize')}
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 text-[11px] font-medium transition-all"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Optimize</span>
            </button>

            <button
              onClick={() => handleQuickAction('tests')}
              className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition-all"
            >
              <TestTube className="w-3 h-3 text-cyan-400" />
              <span>Tests</span>
            </button>
          </div>
        </div>

        {/* Center: Monaco Editor Container */}
        <div className="flex-1 relative overflow-hidden">
          {activeFile ? (
            <Editor
              height="100%"
              theme="codebuddyDark"
              language={activeFile.language}
              value={activeFile.content}
              onChange={(value) => updateFileContent(activeFile.id, value || '')}
              onMount={handleEditorDidMount}
              options={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13.5,
                lineHeight: 22,
                minimap: { enabled: true, side: 'right' },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                formatOnPaste: true,
                formatOnType: true,
                padding: { top: 12, bottom: 12 },
                tabSize: 2,
                automaticLayout: true,
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
              Select or create a file to start coding
            </div>
          )}
        </div>

        {/* Collapsible Bottom Terminal / Output Console */}
        <div
          className={`border-t border-[#27272A] bg-[#0E0E11] transition-all flex flex-col ${
            isTerminalOpen ? 'h-52' : 'h-8'
          }`}
        >
          {/* Terminal Tabs & Header */}
          <div className="h-8 px-3 border-b border-[#27272A] flex items-center justify-between text-xs bg-[#111114]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTerminalTab('output')}
                className={`flex items-center gap-1.5 font-mono text-[11px] font-medium ${
                  terminalTab === 'output' ? 'text-purple-400 border-b border-purple-500' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>Console Output</span>
                {executionResult && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                      executionResult.exitCode === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    code: {executionResult.exitCode}
                  </span>
                )}
              </button>

              <button
                onClick={() => setTerminalTab('input')}
                className={`flex items-center gap-1.5 font-mono text-[11px] font-medium ${
                  terminalTab === 'input' ? 'text-cyan-400 border-b border-cyan-500' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Terminal Input (stdin)</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {executionResult && (
                <span className="text-[10px] font-mono text-zinc-400">
                  {executionResult.executionTimeMs}ms • {executionResult.source.toUpperCase()}
                </span>
              )}
              <button
                onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                className="text-zinc-400 hover:text-white"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTerminalOpen ? '' : 'rotate-180'}`} />
              </button>
            </div>
          </div>

          {/* Terminal Content Body */}
          {isTerminalOpen && (
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs leading-relaxed">
              {terminalTab === 'output' ? (
                <div>
                  {executionResult?.stdout && (
                    <pre className="text-zinc-200 whitespace-pre-wrap">{executionResult.stdout}</pre>
                  )}
                  {executionResult?.stderr && (
                    <div className="mt-2 p-2 rounded bg-rose-950/30 border border-rose-500/30 text-rose-300">
                      <div className="font-semibold text-rose-400 mb-1 flex items-center gap-1">
                        <Bug className="w-3.5 h-3.5" /> Runtime/Compiler Error:
                      </div>
                      <pre className="whitespace-pre-wrap text-[11px]">{executionResult.stderr}</pre>
                    </div>
                  )}
                  {!executionResult?.stdout && !executionResult?.stderr && (
                    <span className="text-zinc-500">Program executed with empty output.</span>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <textarea
                    placeholder="Enter standard input (stdin) lines here before running..."
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    className="w-full h-full bg-transparent text-zinc-200 font-mono text-xs resize-none focus:outline-none placeholder-zinc-600"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 3. RIGHT PANEL: AI PAIR PROGRAMMING ASSISTANT */}
      {/* ========================================================== */}
      <div className="w-80 lg:w-96 bg-[#111114] border-l border-[#27272A] flex flex-col shrink-0">
        {/* AI Assistant Header */}
        <div className="h-10 px-3 border-b border-[#27272A] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>AI Pair Programmer</span>
          </div>

          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/20">
            Gemini Live
          </span>
        </div>

        {/* AI Mode Selector Dropdown */}
        <div className="p-2 border-b border-[#27272A] bg-[#141418]">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1 font-mono">
            <span>Specialized Mode</span>
            <span className="text-cyan-400">{aiMode.toUpperCase()}</span>
          </div>
          <select
            value={aiMode}
            onChange={(e) => setAiMode(e.target.value as AIMode)}
            className="w-full bg-[#18181B] text-zinc-200 text-xs px-2.5 py-1.5 rounded-lg border border-[#27272A] focus:outline-none focus:border-purple-500 font-medium"
          >
            <option value="chat">💬 Pair Programmer Chat</option>
            <option value="generate">⚡ Code Generation</option>
            <option value="explain">🔍 Code Explainer</option>
            <option value="debug">🐛 Debug Assistant</option>
            <option value="optimize">🚀 Code Optimizer</option>
            <option value="review">🛡️ Code Reviewer</option>
            <option value="tests">🧪 Unit Test Generator</option>
            <option value="dsa">🧠 DSA Mentor</option>
            <option value="docs">📚 Documentation Generator</option>
          </select>
        </div>

        {/* Active Context Indicators */}
        <div className="px-3 py-1.5 bg-[#0D0D10] border-b border-[#27272A] flex items-center gap-2 overflow-x-auto text-[10px] font-mono text-zinc-400">
          <span className="text-purple-400 flex items-center gap-1">
            <FileCode className="w-3 h-3" />
            {activeFile?.name || 'No file'}
          </span>
          {selectedText && (
            <span className="text-cyan-400 bg-cyan-950/40 px-1 rounded border border-cyan-500/30">
              Selection Attached ({selectedText.split('\n').length} lines)
            </span>
          )}
          {executionResult?.stderr && (
            <span className="text-rose-400 bg-rose-950/40 px-1 rounded border border-rose-500/30">
              Error Attached
            </span>
          )}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-purple-600/20 text-purple-100 border border-purple-500/30 ml-4'
                  : 'bg-[#18181B] text-zinc-200 border border-[#27272A] mr-1'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1.5 font-mono">
                <span className="font-semibold text-purple-400">
                  {msg.sender === 'user' ? 'You' : 'CodeBuddy AI'}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Content */}
              <div className="whitespace-pre-wrap font-sans space-y-2">
                {msg.content}
              </div>

              {/* One-Click Apply Button for AI Code Blocks */}
              {msg.sender === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-[#27272A] flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleApplyAiCode(msg.content)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold shadow-sm transition-all"
                  >
                    <ArrowRight className="w-3 h-3 text-cyan-300" />
                    <span>Apply to Editor</span>
                  </button>
                </div>
              )}
            </div>
          ))}

          {isAiLoading && (
            <div className="p-3 rounded-xl bg-[#18181B] border border-purple-500/30 flex items-center gap-2.5 text-xs text-purple-300 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Analyzing code and synthesizing solution...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 border-t border-[#27272A] bg-[#141418] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => {
              setAiPrompt('Explain this code line by line with time complexity.');
            }}
            className="whitespace-nowrap px-2 py-0.5 rounded-full bg-[#1F1F24] hover:bg-[#27272C] text-zinc-300 border border-zinc-700/80"
          >
            Explain line-by-line
          </button>
          <button
            onClick={() => {
              setAiPrompt('Optimize time complexity to O(N) single-pass.');
            }}
            className="whitespace-nowrap px-2 py-0.5 rounded-full bg-[#1F1F24] hover:bg-[#27272C] text-zinc-300 border border-zinc-700/80"
          >
            Optimize to O(N)
          </button>
          <button
            onClick={() => {
              setAiPrompt('Generate comprehensive unit test suite.');
            }}
            className="whitespace-nowrap px-2 py-0.5 rounded-full bg-[#1F1F24] hover:bg-[#27272C] text-zinc-300 border border-zinc-700/80"
          >
            Unit Tests
          </button>
        </div>

        {/* AI Input Form */}
        <form onSubmit={handleSendPrompt} className="p-2.5 border-t border-[#27272A] bg-[#0E0E11]">
          <div className="relative flex items-center">
            <textarea
              rows={2}
              placeholder={`Ask CodeBuddy (${aiMode} mode)...`}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendPrompt();
                }
              }}
              className="w-full pl-3 pr-10 py-2 bg-[#18181B] border border-[#27272A] rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none font-sans"
            />
            <button
              type="submit"
              disabled={!aiPrompt.trim() || isAiLoading}
              className="absolute right-2 p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
