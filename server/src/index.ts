import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config.js';
import { authRouter } from './routes/authRoutes.js';
import { aiRouter } from './routes/aiRoutes.js';
import { executeRouter } from './routes/executeRoutes.js';
import { projectRouter } from './routes/projectRoutes.js';
import { dsaRouter } from './routes/dsaRoutes.js';
import { setupCollabSocket } from './socket/collabSocket.js';
import { db } from './db/storage.js';

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupCollabSocket(io);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'CodeBuddy AI Backend Platform',
    timestamp: new Date().toISOString(),
    geminiLiveConfigured: !!config.geminiApiKey,
  });
});

// App Routes
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/execute', executeRouter);
app.use('/api/projects', projectRouter);
app.use('/api/dsa', dsaRouter);

// Collab rooms meta endpoint
app.get('/api/rooms', (_req, res) => {
  const rooms = Array.from(db.rooms.values()).map(r => ({
    roomId: r.roomId,
    name: r.name,
    language: r.language,
    activeUsersCount: r.users.length,
    users: r.users,
    createdAt: r.createdAt,
  }));
  res.json({ rooms });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Global Error]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

server.listen(config.port, () => {
  console.log(`🚀 CodeBuddy AI Server running on http://localhost:${config.port}`);
  console.log(`⚡ WebSocket Server initialized for real-time collaboration`);
  console.log(`🤖 AI Engine loaded (Gemini Live API status: ${config.geminiApiKey ? 'Configured' : 'Offline / Smart Fallback Engine Ready'})`);
});
