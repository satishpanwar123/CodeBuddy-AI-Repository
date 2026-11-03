import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Code2,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ==========================================
// 1. LOGIN PAGE
// ==========================================
export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('alex@codebuddy.ai');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const success = await login(email, password);
      if (success) navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setIsLoading(true);
    await demoLogin();
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-center items-center px-4 select-none relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#111114] border border-[#27272A] rounded-2xl shadow-2xl p-8 relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/25 mb-1">
            <div className="w-full h-full bg-[#111114] rounded-[14px] flex items-center justify-center">
              <Code2 className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Sign in to CodeBuddy AI</h1>
          <p className="text-xs text-zinc-400">Code Together. Build Smarter. Ship Faster.</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* 1-Click Demo Login Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Instant Evaluator Access</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Pre-loaded</span>
          </div>
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={isLoading}
            className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Launch Demo Developer Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#27272A]" />
          <span className="absolute px-3 bg-[#111114] text-[11px] font-mono text-zinc-500 uppercase">
            Or credentials
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 font-mono">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full pl-9 pr-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-zinc-300 font-mono">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-purple-400 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-[#202025] hover:bg-[#27272C] text-white text-xs font-semibold border border-zinc-700/80 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Sign In with Password</span>
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SIGNUP PAGE
// ==========================================
export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signup(name, email, password);
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-center items-center px-4 select-none relative overflow-hidden">
      <div className="w-full max-w-md bg-[#111114] border border-[#27272A] rounded-2xl shadow-2xl p-8 relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">Create your CodeBuddy account</h1>
          <p className="text-xs text-zinc-400">Start pair programming with Gemini AI in seconds.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 font-mono">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Chen"
                className="w-full pl-9 pr-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 font-mono">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@startup.io"
                className="w-full pl-9 pr-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 font-mono">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Create Developer Workspace</span>
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Already registered?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. FORGOT PASSWORD PAGE
// ==========================================
export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-center items-center px-4 select-none relative overflow-hidden">
      <div className="w-full max-w-md bg-[#111114] border border-[#27272A] rounded-2xl shadow-2xl p-8 relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="text-xs text-zinc-400">Enter your email and we'll send a recovery link.</p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-center">
            <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
            <div className="text-xs font-semibold text-white">Reset Link Dispatched</div>
            <p className="text-[11px] text-zinc-400">
              We have dispatched recovery instructions to <span className="text-emerald-300">{email}</span>.
            </p>
            <div className="pt-2">
              <Link to="/login" className="text-xs text-purple-400 hover:underline">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1 font-mono">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@codebuddy.ai"
                className="w-full px-3 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
            >
              Send Instructions
            </button>

            <div className="text-center text-xs text-zinc-400">
              <Link to="/login" className="text-purple-400 hover:underline">
                Back to Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
