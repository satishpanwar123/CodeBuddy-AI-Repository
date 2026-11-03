# CodeBuddy AI – AI-Powered Collaborative Coding Platform

> **"Code Together. Build Smarter. Ship Faster."**

CodeBuddy AI is a production-grade developer platform combining **AI pair programming**, a **multi-tab Monaco code editor**, **real-time collaborative coding rooms**, **intelligent agentic debugging**, **automated code reviews**, and **FAANG coding interview preparation**.

Designed with the aesthetic and speed of **Cursor AI, Linear, Vercel, and Raycast**, CodeBuddy AI provides software engineers and programming teams with an end-to-end intelligent development environment.

---

## 🌟 Key Features

### 1. ⚡ AI Pair Programming Workspace (Cursor-style 3-Panel IDE)
- **Left Panel (File Explorer)**: Collapsible project file tree, multi-language support (TypeScript, JavaScript, Python, C++, Java, Markdown, JSON), file creation, deletion, rename, and starter templates.
- **Center Panel (Monaco Editor)**: Full-featured Monaco code editor with custom Deep Black syntax highlighting, multi-file tabs, line numbers, minimap, document formatting, and language selection.
- **Action Toolbar**:
  - `Run Code` (with execution timing in ms, exit code, memory profile)
  - `Save Code` (Ctrl+S / Cmd+S)
  - `Format Code`
  - `Explain Code`
  - `Debug Code` (Agentic bug detector)
  - `Optimize Code` (Time & space complexity reduction)
  - `Generate Tests` (Automated unit test suite synthesis)
  - `Copy Code` / `Reset`
- **Bottom Terminal Console**: Collapsible interactive terminal featuring stdout, stderr, execution profiling, and standard input (`stdin`) support.
- **Right Panel (AI Coding Assistant)**: Context-aware assistant that receives selected code snippets, active file contents, programming language, and terminal runtime errors. Includes one-click **"Apply to Editor"** to immediately patch code.

### 2. 🤖 Specialized AI Engineering Modes (Powered by Gemini)
1. **💬 Pair Programmer Chat**: Conversational senior engineer partner.
2. **⚡ Code Generation**: Generates production-ready, type-safe modules with guard clauses.
3. **🔍 Code Explanation**: Line-by-line decomposition with Big-O time and space analysis.
4. **🐛 Debug Assistant**: Agentic debugging workflow identifying root cause, hazard lines, and verified fixes.
5. **🚀 Code Optimization**: Algorithmic vectorization, caching, and loop unrolling.
6. **🛡️ Code Reviewer**: Full security audit, cyclomatic complexity check, and code smell detection.
7. **🧪 Unit Test Generation**: Edge-case and boundary testing using Vitest/PyTest/JUnit formats.
8. **🧠 DSA Mentor**: Socratic coaching without spoiling answers.
9. **📚 Documentation Generator**: JSDoc, Docstring, and technical spec synthesis.

### 3. 👥 Real-Time Collaborative Coding Rooms
- Instant room creation and joining via 6-character room codes (e.g., `ROOM42`).
- WebSockets (**Socket.IO**) syncing code edits across all connected peers in real time.
- Colored peer presence indicators and active participant roster.
- In-room collaborative chat with timestamps.
- **Shared Code Runner**: When one engineer executes code, the output is broadcast to all members.

### 4. 🛡️ AI Code Review & Security Audit
- Paste source code or import from the active workspace.
- Audit filters: Security & Injection, Performance & Scalability, Clean Code & Architecture.
- Output includes:
  - **Overall Code Health Score** (0-100) and Letter Grade (A+, A, B, C, F).
  - Severity classification: `Critical`, `High`, `Medium`, `Low`.
  - Pinpointed line numbers with flawed snippet and recommended refactored patch.

### 5. 🧠 DSA Practice & Problem Catalog
- Categorized algorithmic challenges: Two Sum, LRU Cache, Trapping Rain Water, and more.
- Starter code in 5 languages: Python, C++, Java, JavaScript, TypeScript.
- Built-in test case runner with automatic validation against expected outputs and celebratory confetti animations.
- Socratic hints from the AI mentor.

### 6. 🎓 AI Staff Technical Mock Interview
- Realistic 45-minute timed interview simulation.
- 5-stage FAANG pipeline:
  1. *Clarifying Questions & Edge Cases*
  2. *Algorithmic Approach & Trade-offs*
  3. *Live Code Implementation*
  4. *Dry Run & Complexity Analysis*
  5. *Final Evaluation & Hire Verdict*
- Interactive AI interviewer assessing candidate reasoning and trade-offs.

### 7. 📊 Learning & Velocity Analytics
- Visual metrics tracking coding hours, AI collaboration acceptance rate (94.2%), and problem streaks.
- Skill mastery bars across Algorithms, Vector Search, System Design, Concurrency, and Unit Testing.
- Weekly activity timeline and language distribution charts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express.js, TypeScript (`tsx`), Socket.IO, JWT, bcryptjs, Axios |
| **AI Engine** | Google Gemini API (with built-in neural fallback synthesizer for offline zero-downtime execution) |
| **Execution** | Multi-language container runner (Python, C++, Java, JS, TS) with Piston API & Node sandbox |
| **Styling & UX** | Deep Black `#09090B`, Sidebar `#111114`, Cards `#18181B`, Electric Violet `#8B5CF6`, Cyan `#22D3EE` |

---

## 🚀 Quick Start (Run Locally in 60 Seconds)

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/codebuddy-ai.git
cd codebuddy-ai

# Install root, client, and server dependencies
npm run install:all
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
*(Optional: Add your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey). If left empty, CodeBuddy runs using its built-in intelligent engine!)*

### 3. Start Both Frontend & Backend
```bash
npm run dev
```

Open your browser at:
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

> **Tip**: Click **"Launch Demo Developer Profile"** on the login page for instant 1-click access with pre-loaded projects and stats!

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Global Spotlight Search (Projects, DSA, AI tools) |
| `Shift + Enter` | Run Code in Editor |
| `Ctrl + S` / `Cmd + S` | Save Current File |
| `Alt + F` | Auto-format Code Document |

---

## 🌐 Production Deployment Guide

### Deploy Frontend to Vercel
1. Set the root directory to `client`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Configure rewrites for client-side routing in `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Deploy Backend to Render
1. Create a **Web Service** pointing to the repository.
2. Root directory: `server`.
3. Build command: `npm install && npm run build`.
4. Start command: `node dist/index.js`.
5. Add environment variables:
   - `PORT=5000`
   - `JWT_SECRET=your_production_secret`
   - `GEMINI_API_KEY=your_gemini_api_key`
   - `CORS_ORIGIN=https://your-frontend.vercel.app`

---

## 📄 License
MIT © 2026 CodeBuddy AI Team. Built for developers who ship with velocity.
