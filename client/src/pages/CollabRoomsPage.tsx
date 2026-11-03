import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import {
  Users2,
  Copy,
  Check,
  Play,
  Send,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  Loader2,
  Terminal,
  LogOut,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CollabRoom, CollabUser, CollabMessage } from '../types';

export const CollabRoomsPage: React.FC = () => {
  const { user } = useAuth();
  const [roomIdInput, setRoomIdInput] = useState('');
  const [activeRoomId, setActiveRoomId] = useState<string | null>('ROOM42');
  const [roomData, setRoomData] = useState<CollabRoom | null>(null);
  const [code, setCode] = useState<string>('// Connecting to collaborative room...');
  const [language, setLanguage] = useState('typescript');
  const [users, setUsers] = useState<CollabUser[]>([]);
  const [messages, setMessages] = useState<CollabMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('Ready for collaborative execution.');
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const editorRef = useRef<any>(null);

  // Fetch available rooms
  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        if (data.rooms) setAvailableRooms(data.rooms);
      })
      .catch(() => {});
  }, []);

  // Connect Socket.IO when activeRoomId is set
  useEffect(() => {
    if (!activeRoomId) return;

    const socket = io('/', {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    const devUser = {
      id: user?.id || `usr_${Date.now()}`,
      name: user?.name || 'Developer',
      color: ['#8B5CF6', '#22D3EE', '#10B981', '#F59E0B', '#EC4899'][Math.floor(Math.random() * 5)],
    };

    socket.emit('join_room', {
      roomId: activeRoomId,
      user: devUser,
    });

    socket.on('room_state', (data: { room: CollabRoom }) => {
      setRoomData(data.room);
      setCode(data.room.code);
      setLanguage(data.room.language || 'typescript');
      setUsers(data.room.users);
      setMessages(data.room.messages || []);
    });

    socket.on('user_joined', (data: { user: CollabUser; activeUsers: CollabUser[] }) => {
      setUsers(data.activeUsers);
    });

    socket.on('user_left', (data: { userId: string; activeUsers: CollabUser[] }) => {
      setUsers(data.activeUsers);
    });

    socket.on('code_updated', (data: { code: string; updatedBy: string }) => {
      setCode(data.code);
    });

    socket.on('new_message', (message: CollabMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('shared_execution_result', (data: { result: any; executedBy: string }) => {
      setTerminalOutput(
        `[Broadcast from ${data.executedBy}]\n${data.result.stdout || data.result.stderr || 'Executed cleanly'}`
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [activeRoomId, user]);

  // Handle local code edit
  const handleCodeChange = (newCode?: string) => {
    const val = newCode || '';
    setCode(val);
    if (socketRef.current && activeRoomId) {
      socketRef.current.emit('code_change', {
        roomId: activeRoomId,
        code: val,
      });
    }
  };

  // Run code collaboratively
  const handleRunCode = async () => {
    if (!activeRoomId) return;
    setIsRunning(true);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      const output = data.stdout || data.stderr || 'Done';
      setTerminalOutput(output);

      // Broadcast to room
      if (socketRef.current) {
        socketRef.current.emit('code_executed', {
          roomId: activeRoomId,
          result: data,
        });
      }
    } catch (err: any) {
      setTerminalOutput(`Execution error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Send Chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !socketRef.current || !activeRoomId) return;
    socketRef.current.emit('send_message', {
      roomId: activeRoomId,
      text: chatInput.trim(),
    });
    setChatInput('');
  };

  // Copy Room Code
  const handleCopyCode = () => {
    if (!activeRoomId) return;
    navigator.clipboard.writeText(activeRoomId);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#09090B] overflow-hidden select-none">
      {/* Active Room Workspace */}
      {activeRoomId ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Collab Room Navbar */}
          <div className="h-12 bg-[#111114] border-b border-[#27272A] px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-xs font-semibold text-white">Room {activeRoomId}</h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {users.length} connected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#18181B] hover:bg-[#202025] text-zinc-300 text-xs font-mono border border-[#27272A]"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{activeRoomId}</span>
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>Run (Broadcast)</span>
              </button>

              <button
                onClick={() => setActiveRoomId(null)}
                className="p-1.5 rounded hover:bg-[#18181B] text-zinc-400 hover:text-red-400"
                title="Leave Room"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Collab Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={handleCodeChange}
              options={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13.5,
                lineHeight: 22,
                minimap: { enabled: true },
                padding: { top: 12 },
              }}
            />
          </div>

          {/* Shared Execution Terminal Output */}
          <div className="h-36 bg-[#0E0E11] border-t border-[#27272A] p-3 font-mono text-xs overflow-y-auto">
            <div className="flex items-center gap-1.5 text-zinc-400 mb-1 font-semibold text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span>Shared Terminal Output</span>
            </div>
            <pre className="text-zinc-200 whitespace-pre-wrap">{terminalOutput}</pre>
          </div>
        </div>
      ) : (
        /* Room Selection Lobby */
        <div className="flex-1 p-8 max-w-4xl mx-auto flex flex-col justify-center space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-2">
              <Users2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Live Collaborative Coding Rooms</h1>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Pair program in real-time with your teammates. Synchronized cursor edits, shared execution, and instant room chat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto w-full">
            {/* Join by Code */}
            <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] space-y-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Join Existing Room</h3>
              <input
                type="text"
                placeholder="Enter 6-char room code..."
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-[#111114] border border-[#27272A] rounded-lg text-xs font-mono text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => roomIdInput && setActiveRoomId(roomIdInput)}
                disabled={!roomIdInput.trim()}
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                Join Session
              </button>
            </div>

            {/* Quick Demo Room */}
            <div className="p-5 rounded-xl bg-[#18181B] border border-[#27272A] space-y-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Instant Pair Room</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Jump into the public featured session ROOM42 to test collaborative multi-user editing.
              </p>
              <button
                onClick={() => setActiveRoomId('ROOM42')}
                className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Demo Room 42</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Sidebar: Active Room Members & Live Chat */}
      {activeRoomId && (
        <div className="w-80 bg-[#111114] border-l border-[#27272A] flex flex-col shrink-0">
          {/* Members List */}
          <div className="p-3 border-b border-[#27272A]">
            <div className="text-[11px] font-mono font-semibold text-zinc-400 uppercase mb-2">
              Participants ({users.length})
            </div>
            <div className="space-y-1.5">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-[#18181B] text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: u.color }} />
                  <span className="font-medium text-zinc-200">{u.name}</span>
                  {u.id === user?.id && <span className="text-[10px] text-zinc-500 ml-auto font-mono">(You)</span>}
                </div>
              ))}
            </div>
          </div>

          {/* In-Room Chat Stream */}
          <div className="p-3 border-b border-[#27272A] flex items-center gap-1.5 text-xs font-semibold text-white">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Room Discussion</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
            {messages.map((m) => (
              <div key={m.id} className="p-2 rounded-lg bg-[#18181B] border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-semibold" style={{ color: m.userColor }}>
                    {m.userName}
                  </span>
                  <span className="text-zinc-500">{m.timestamp}</span>
                </div>
                <p className="text-zinc-300 text-[11px]">{m.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-2.5 border-t border-[#27272A] bg-[#0E0E11] flex gap-2">
            <input
              type="text"
              placeholder="Message room..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
