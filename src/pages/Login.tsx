import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { TrainFront, Lock, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);

    try {
      const success = await login(password);
      if (success) {
        navigate('/', { replace: true });
      } else {
        setError(true);
        setIsSubmitting(false);
      }
    } catch (err) {
      setError(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-900/20">
            <TrainFront className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-tight">
            Choo Choo <br />
            <span className="text-red-500 not-italic">Tortas Admin</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-sm font-medium">Restricted access for station personnel only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Access Passcode</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="password" 
                required
                autoFocus
                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl pl-14 pr-6 py-4 text-white font-bold outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-500 mt-2 ml-1"
              >
                <AlertCircle size={14} />
                <span className="text-xs font-bold uppercase tracking-wide">Invalid Passcode</span>
              </motion.div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-sm shadow-xl shadow-red-900/20 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              'Enter Terminal'
            )}
          </button>

          <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            Use password: tortas2026
          </p>
        </form>
      </motion.div>
    </div>
  );
}