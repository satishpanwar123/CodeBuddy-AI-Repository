export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  geminiApiKey?: string;
  role: 'developer' | 'admin' | 'lead';
  preferences: {
    theme: 'dark' | 'midnight' | 'deep-black';
    editorTheme: string;
    fontSize: number;
    tabSize: number;
    keybinding: 'standard' | 'vim' | 'emacs';
    autoSave: boolean;
  };
  stats: {
    totalProjects: number;
    codingHours: number;
    aiSuggestions: number;
    problemsSolved: number;
    linesOfCode: number;
  };
  createdAt: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isFolder?: boolean;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  language: string;
  files: ProjectFile[];
  activeFileId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AIMode = 
  | 'chat'
  | 'generate'
  | 'explain'
  | 'debug'
  | 'optimize'
  | 'review'
  | 'tests'
  | 'dsa'
  | 'docs';

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  mode?: AIMode;
  content: string;
  codeSnippet?: string;
  language?: string;
  timestamp: string;
  model?: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  memoryKb?: number;
  error?: string;
  source: 'piston' | 'sandbox' | 'emulated';
}

export interface CollabUser {
  id: string;
  name: string;
  color: string;
  cursor?: { lineNumber: number; column: number };
}

export interface CollabMessage {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  text: string;
  timestamp: string;
}

export interface CollabRoom {
  roomId: string;
  name: string;
  language: string;
  code: string;
  files: ProjectFile[];
  activeFileId: string;
  hostId: string;
  users: CollabUser[];
  messages: CollabMessage[];
  createdAt: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptanceRate: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python: string;
    javascript: string;
    typescript: string;
    cpp: string;
    java: string;
  };
  testCases: {
    input: string;
    expected: string;
  }[];
  hints: string[];
}
