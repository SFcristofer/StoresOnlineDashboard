import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import VisualBuilder from './VisualBuilder';
import { 
  Plus, Globe, Zap, LogOut, Smartphone, Rocket, Layers
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  custom_domain: string;
  theme_color: string;
  industry: string;
  site_config?: any;
}

const Dashboard: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  
  const [siteName, setSiteName] = useState('');
  const [siteDomain, setSiteDomain] = useState('');

  useEffect(() => { fetchTenants(); }, []);

  async function fetchTenants() {
    const { data } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
    setTenants(data || []);
    setLoading(false);
  }

  if (editingTenant) return <VisualBuilder tenant={editingTenant} onBack={() => { setEditingTenant(null); fetchTenants(); }} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans antialiased">
      {/* SIDEBAR COMPACTO */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Rocket size={16} />
           </div>
           <span className="font-bold text-sm tracking-tight">WAAS_CONTROL</span>
        </div>
        <nav className="flex-1 space-y-1">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/10">
            <Layers size={14} /> Despliegues
          </button>
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="mt-auto flex items-center gap-3 p-3 text-red-500/50 hover:text-red-500 text-xs font-bold transition-all">
          <LogOut size={14} /> Salir
        </button>
      </aside>

      {/* VIEWPORT ESCALADO */}
      <main className="flex-1 overflow-y-auto p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1 uppercase italic">Dashboard_</h1>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Gestión de flota de sitios web activos.</p>
          </div>
          <button onClick={() => setIsCreating(true)} className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs hover:scale-105 transition-all flex items-center gap-2">
            <Plus size={14} /> Nuevo Sitio
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((t) => (
            <div key={t.id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all shadow-xl group">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-500"><Globe size={18} /></div>
                 <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">Live</span>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight mb-1">{t.name}</h3>
              <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-6">{t.custom_domain}</p>
              <div className="flex gap-2">
                 <button onClick={() => setEditingTenant(t)} className="flex-1 bg-white/5 border border-white/10 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-all">Ajustes</button>
                 <a href={`http://${t.custom_domain}`} target="_blank" rel="noreferrer" className="px-4 bg-white text-black py-2 rounded-lg text-[10px] font-bold uppercase">Visitar</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
