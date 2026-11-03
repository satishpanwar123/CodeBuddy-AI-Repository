import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';
import { db, User } from '../db/storage.js';

export const authRouter = Router();

// Middleware to extract user from JWT
export const authenticate = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const user = db.users.get(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Signup
authRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if email already registered
    for (const u of db.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase().trim()) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: `usr_${uuidv4().slice(0, 8)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'developer',
      preferences: {
        theme: 'deep-black',
        editorTheme: 'vs-dark',
        fontSize: 14,
        tabSize: 2,
        keybinding: 'standard',
        autoSave: true,
      },
      stats: {
        totalProjects: 1,
        codingHours: 0,
        aiSuggestions: 0,
        problemsSolved: 0,
        linesOfCode: 0,
      },
      createdAt: new Date().toISOString(),
    };

    db.users.set(newUser.id, newUser);

    const token = jwt.sign({ userId: newUser.id }, config.jwtSecret, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = newUser;

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error during signup' });
  }
});

// Login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let foundUser: User | undefined;
    for (const u of db.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase().trim()) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: foundUser.id }, config.jwtSecret, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = foundUser;

    return res.json({
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error during login' });
  }
});

// Demo 1-Click Login
authRouter.post('/demo-login', async (_req: Request, res: Response) => {
  try {
    const demoUser = db.users.get('usr_demo_1');
    if (!demoUser) {
      return res.status(404).json({ error: 'Demo user not found' });
    }

    const token = jwt.sign({ userId: demoUser.id }, config.jwtSecret, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = demoUser;

    return res.json({
      message: 'Logged in as Demo Developer',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get Current Profile
authRouter.get('/me', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

// Update Profile & Preferences
authRouter.put('/profile', authenticate, (req: Request, res: Response) => {
  const currentUser = (req as any).user as User;
  const { name, geminiApiKey, preferences } = req.body;

  if (name) currentUser.name = name;
  if (geminiApiKey !== undefined) currentUser.geminiApiKey = geminiApiKey;
  if (preferences) {
    currentUser.preferences = {
      ...currentUser.preferences,
      ...preferences,
    };
  }

  db.users.set(currentUser.id, currentUser);
  const { passwordHash: _, ...safeUser } = currentUser;

  return res.json({
    message: 'Profile updated successfully',
    user: safeUser,
  });
});

// Forgot Password
authRouter.post('/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }
  // Simulate secure reset link generation
  return res.json({
    message: `Password reset instructions sent to ${email}. Check your inbox or use demo login.`,
  });
});
