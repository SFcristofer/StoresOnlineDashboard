import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Dashboard from './pages/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, Loader2, AlertCircle, UserPlus } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (isLogin) {
      // LOGIN
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) setError(`ERROR DE ACCESO: ${authError.message}`);
    } else {
      // REGISTRO (SIGN UP)
      const { error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: window.location.origin }
      });
      if (authError) {
        setError(`ERROR DE REGISTRO: ${authError.message}`);
      } else {
        setSuccess('¡CUENTA CREADA! Ahora ejecuta el PASO FINAL en Supabase para activarte como Admin.');
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full"></div>
      
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[48px] shadow-2xl">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
              {isLogin ? 'Iniciar Sesión' : 'Nueva Cuenta'}
            </h1>
            <p className="text-white/30 text-[10px] font-black tracking-widest uppercase mt-2">
              {isLogin ? 'Portal de Administración' : 'Configuración de Acceso Maestro'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Email</label>
              <input 
                type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 text-white font-bold"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">Contraseña</label>
              <input 
                type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 text-white font-bold"
                required
              />
            </div>

            <AnimatePresence>
              {error && <motion.div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase">{error}</motion.div>}
              {success && <motion.div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-[10px] font-black uppercase">{success}</motion.div>}
            </AnimatePresence>

            <button type="submit" disabled={loading} className="w-full bg-white text-black p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex justify-center items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />)}
              {isLogin ? 'ENTRAR' : 'CREAR CUENTA'}
            </button>

            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-[#050505] text-blue-500 font-black">CARGANDO...</div>;
  return !user ? <Login /> : <Dashboard />;
}

export default App;
