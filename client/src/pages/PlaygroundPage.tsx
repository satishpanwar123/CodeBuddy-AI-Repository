import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  RotateCcw,
  Sparkles,
  Loader2,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PlaygroundPage: React.FC = () => {
  const { geminiApiKey } = useAuth();
  const [language, setLanguage] = useState<'python' | 'javascript' | 'typescript' | 'cpp' | 'java'>('python');
  const [code, setCode] = useState<string>(`# Fast Python scratchpad
import math

def calculate_primes(limit: int) -> list[int]:
    primes = []
    for num in range(2, limit + 1):
        if all(num % p != 0 for p in primes if p * p <= num):
            primes.append(num)
    return primes

print("Primes up to 50:", calculate_primes(50))
`);

  const [output, setOutput] = useState<string>('Click "Run Code" to compile and execute.');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      setOutput(data.stdout || data.stderr || 'Execution finished with 0 output.');
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#09090B] overflow-hidden select-none">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Playground Top Bar */}
        <div className="h-12 bg-[#111114] border-b border-[#27272A] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Multi-Language Scratchpad</span>
            </span>

            <select
              value={language}
              onChange={(e) => {
                const lang = e.target.value as any;
                setLanguage(lang);
                if (lang === 'python') setCode('print("Hello from Python 3.10!")\n');
                else if (lang === 'cpp') setCode('#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello C++!" << endl;\n    return 0;\n}\n');
                else if (lang === 'java') setCode('public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Java!");\n    }\n}\n');
                else setCode('console.log("Hello from JavaScript runtime!");\n');
              }}
              className="bg-[#18181B] text-zinc-200 text-xs px-2.5 py-1 rounded border border-[#27272A] focus:outline-none focus:border-purple-500 font-mono"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-[#18181B] hover:bg-[#202025] text-zinc-300 text-xs font-medium border border-zinc-700/70"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>Run Sandbox</span>
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13.5,
              lineHeight: 22,
              minimap: { enabled: true },
              padding: { top: 12 },
            }}
          />
        </div>

        {/* Terminal Output */}
        <div className="h-44 bg-[#0E0E11] border-t border-[#27272A] p-4 font-mono text-xs overflow-y-auto">
          <div className="text-zinc-500 text-[10px] uppercase font-semibold mb-1">Standard Output (stdout)</div>
          <pre className="text-zinc-200 whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
};
