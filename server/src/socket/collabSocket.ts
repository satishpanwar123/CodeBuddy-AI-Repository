import { Server, Socket } from 'socket.io';
import { db } from '../db/storage.js';

interface UserInfo {
  id: string;
  name: string;
  color: string;
  cursor?: { lineNumber: number; column: number };
}

export function setupCollabSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    let currentRoomId: string | null = null;
    let currentUser: UserInfo = {
      id: socket.id,
      name: `Dev_${socket.id.slice(0, 4)}`,
      color: ['#8B5CF6', '#22D3EE', '#10B981', '#F59E0B', '#EC4899'][Math.floor(Math.random() * 5)],
    };

    // Join room
    socket.on('join_room', ({ roomId, user }) => {
      currentRoomId = roomId;
      if (user && user.id) {
        currentUser = {
          id: user.id,
          name: user.name || currentUser.name,
          color: user.color || currentUser.color,
        };
      }

      socket.join(roomId);

      // Check if room exists in DB, or create dynamic room
      let room = db.rooms.get(roomId);
      if (!room) {
        room = {
          roomId,
          name: `Room ${roomId}`,
          language: 'typescript',
          code: `// Collaborative Coding Room: ${roomId}\n// Type together in real time!\n\nconsole.log("Ready to collaborate!");\n`,
          files: [
            {
              id: 'f_main',
              name: 'main.ts',
              path: '/main.ts',
              language: 'typescript',
              content: `console.log("CodeBuddy Collab Room ${roomId}");`,
            }
          ],
          activeFileId: 'f_main',
          hostId: currentUser.id,
          users: [],
          messages: [],
          createdAt: new Date().toISOString(),
        };
        db.rooms.set(roomId, room);
      }

      // Add user to room if not present
      if (!room.users.some(u => u.id === currentUser.id)) {
        room.users.push(currentUser);
      }

      // Send initial room snapshot to joining user
      socket.emit('room_state', {
        room,
        currentUser,
      });

      // Broadcast user joined
      socket.to(roomId).emit('user_joined', {
        user: currentUser,
        activeUsers: room.users,
      });

      console.log(`[Socket] User ${currentUser.name} joined room ${roomId}`);
    });

    // Real-time code edit
    socket.on('code_change', ({ roomId, code, fileId }) => {
      const room = db.rooms.get(roomId);
      if (room) {
        room.code = code;
        if (fileId && room.files) {
          const file = room.files.find(f => f.id === fileId);
          if (file) file.content = code;
        }
      }
      socket.to(roomId).emit('code_updated', {
        code,
        fileId,
        updatedBy: currentUser.name,
      });
    });

    // Cursor position broadcast
    socket.on('cursor_move', ({ roomId, cursor }) => {
      socket.to(roomId).emit('peer_cursor', {
        userId: currentUser.id,
        userName: currentUser.name,
        userColor: currentUser.color,
        cursor,
      });
    });

    // Chat message
    socket.on('send_message', ({ roomId, text }) => {
      if (!text || !text.trim()) return;

      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userColor: currentUser.color,
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const room = db.rooms.get(roomId);
      if (room) {
        room.messages.push(message);
      }

      io.to(roomId).emit('new_message', message);
    });

    // Shared execution result
    socket.on('code_executed', ({ roomId, result }) => {
      io.to(roomId).emit('shared_execution_result', {
        result,
        executedBy: currentUser.name,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (currentRoomId) {
        const room = db.rooms.get(currentRoomId);
        if (room) {
          room.users = room.users.filter(u => u.id !== currentUser.id);
          io.to(currentRoomId).emit('user_left', {
            userId: currentUser.id,
            userName: currentUser.name,
            activeUsers: room.users,
          });
        }
      }
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
}
