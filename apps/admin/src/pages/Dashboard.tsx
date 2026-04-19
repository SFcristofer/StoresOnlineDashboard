import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import VisualBuilder from './VisualBuilder';
import { 
  Plus, 
  Globe, 
  Layout, 
  BarChart3, 
  Settings, 
  Zap, 
  ExternalLink,
  Terminal,
  Layers,
  Rocket,
  AlertCircle,
  LogOut,
  Smartphone
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  custom_domain: string;
  theme_color: string;
  industry: string;
  status: string;
  site_config?: any;
}

const Dashboard: React.FC = () => {
  const { tenantId } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  
  const [siteName, setSiteName] = useState('');
  const [siteDomain, setSiteDomain] = useState('');
  const [siteColor, setSiteColor] = useState('#3b82f6');
  const [siteIndustry, setSiteIndustry] = useState('barber');

  useEffect(() => {
    fetchTenants();
  }, []);

  async function fetchTenants() {
    try {
      const { data, error } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTenants(data || []);
    } catch (e) {
      console.error("Error al cargar locales:", e);
    } finally {
      setLoading(false);
    }
  }

  async function spawnSite(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('tenants').insert([{
      name: siteName,
      custom_domain: siteDomain,
      theme_color: siteColor,
      industry: siteIndustry,
      site_config: { blocks: [] }
    }]);

    if (!error) {
      setIsCreating(false);
      setSiteName(''); 
      setSiteDomain('');
      fetchTenants();
    } else {
      alert("Error en despliegue: " + error.message);
    }
    setLoading(false);
  }

  if (editingTenant) {
    return (
      <VisualBuilder 
        tenant={editingTenant} 
        onBack={() => {
          setEditingTenant(null);
          fetchTenants();
        }} 
      />
    );
  }

  if (loading && tenants.length === 0) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0c14]">
       <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
       <p className="mt-6 text-blue-400 font-bold tracking-widest uppercase text-[10px]">Sincronizando Plataforma...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white flex overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-24 lg:w-72 border-r border-white/5 flex flex-col bg-[#0f121d] p-6 lg:p-8 shrink-0 z-30">
        <div className="flex items-center gap-4 mb-16">
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket className="w-6 h-6 text-white" />
           </div>
           <div className="hidden lg:block font-black text-xl tracking-tighter">WAAS.CORE</div>
        </div>

        <nav className="flex-1 space-y-4">
          <button className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20">
            <Layers className="w-5 h-5" /> <span className="hidden lg:block uppercase tracking-widest text-[10px]">Infraestructura</span>
          </button>
          <button className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl text-white/30 hover:bg-white/5 font-bold text-sm">
            <Zap className="w-5 h-5" /> <span className="hidden lg:block uppercase tracking-widest text-[10px]">Despliegues</span>
          </button>
        </nav>

        <button onClick={() => supabase.auth.signOut()} className="mt-auto flex items-center justify-center lg:justify-start gap-4 p-4 text-red-500/40 hover:text-red-500 font-black text-[10px] tracking-widest uppercase">
          <LogOut className="w-5 h-5" /> <span className="hidden lg:block">Cerrar Sistema</span>
        </button>
      </aside>

      {/* VIEWPORT */}
      <main className="flex-1 overflow-y-auto relative bg-[#0a0c14]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[200px] rounded-full"></div>

        <div className="p-10 lg:p-20 max-w-7xl mx-auto relative z-10">
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-24">
            <div>
              <h1 className="text-6xl lg:text-7xl font-black tracking-tighter mb-4 uppercase italic">Deployments_</h1>
              <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Gestor de flota de sitios web activos.</p>
            </div>
            <button onClick={() => setIsCreating(true)} className="bg-white text-black px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3">
              <Plus className="w-4 h-4" /> Nuevo Sitio
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {tenants.map((t) => (
              <motion.div key={t.id} className="bg-[#141824] border border-white/10 p-10 rounded-[40px] hover:border-blue-500/50 transition-all shadow-xl">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center" style={{ color: t.theme_color }}>
                      <Globe className="w-7 h-7" />
                   </div>
                   <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Live</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">{t.name}</h3>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-10 flex items-center gap-2">
                   <Smartphone className="w-3 h-3" /> {t.industry}
                </p>
                <div className="grid grid-cols-2 gap-4">
                   <a href={`http://${t.custom_domain}`} target="_blank" rel="noreferrer" className="bg-white text-black p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest">Web</a>
                   <button 
                    onClick={() => setEditingTenant(t)}
                    className="bg-white/5 border border-white/10 text-white p-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                   >
                    Ajustes
                   </button>
                </div>
              </motion.div>
            ))}
            
            {tenants.length === 0 && (
              <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                 <AlertCircle className="w-12 h-12 mx-auto text-white/10 mb-4" />
                 <p className="text-white/20 font-black uppercase text-xs tracking-widest">No hay despliegues activos.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {isCreating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-3xl bg-black/60">
            <motion.form initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onSubmit={spawnSite} className="bg-[#141824] border border-white/10 p-12 rounded-[50px] max-w-xl w-full">
              <h2 className="text-4xl font-black mb-10 tracking-tighter uppercase italic">SPAWN_SITE</h2>
              <div className="space-y-6">
                <input className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl outline-none focus:border-blue-500 font-bold text-white" placeholder="NOMBRE CLIENTE" value={siteName} onChange={e => setSiteName(e.target.value)} required />
                <input className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl outline-none focus:border-blue-500 font-bold text-white" placeholder="DOMINIO (localhost:3000)" value={siteDomain} onChange={e => setSiteDomain(e.target.value)} required />
                <select className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl outline-none focus:border-blue-500 font-bold text-white uppercase text-xs" value={siteIndustry} onChange={e => setSiteIndustry(e.target.value)}>
                  <option value="barber">BARBERÍA</option>
                  <option value="restaurant">RESTAURANTE</option>
                  <option value="beauty">ESTÉTICA</option>
                </select>
              </div>
              <div className="flex gap-4 mt-12">
                <button type="submit" className="flex-1 bg-blue-600 text-white p-6 rounded-2xl font-black uppercase text-[10px] tracking-widest">Iniciar Despliegue</button>
                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 bg-white/5 text-white/20 p-6 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancelar</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
