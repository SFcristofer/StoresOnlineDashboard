'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { 
  Scissors, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Instagram, 
  Clock, 
  Award,
  ChevronDown
} from 'lucide-react';

export default function TenantPage({ params }: { params: { domain: string } }) {
  const { domain } = params;
  const [tenant, setTenant] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: tenantData } = await supabase.from('tenants').select('*').eq('custom_domain', domain).single();
        if (tenantData) {
          setTenant(tenantData);
          const { data: servicesData } = await supabase.from('services').select('*').eq('tenant_id', tenantData.id).eq('is_active', true);
          setServices(servicesData || []);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadData();
  }, [domain]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-white font-serif italic text-3xl tracking-widest">
        Loading_
      </motion.div>
    </div>
  );

  if (!tenant) return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white font-mono text-xs tracking-[0.5em]">
      INSTANCE_NOT_FOUND
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans selection:bg-[#c4a661] selection:text-black">
      
      {/* HEADER MINIMALISTA */}
      <nav className="fixed top-0 w-full z-50 px-10 py-8 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full">
              <Scissors className="w-4 h-4 text-white" />
           </div>
           <span className="font-serif italic text-2xl tracking-tighter text-white uppercase">{tenant.name}</span>
        </div>
        <div className="hidden md:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
           <a href="#services" className="hover:text-white transition-colors">Servicios</a>
           <a href="#about" className="hover:text-white transition-colors">Nosotros</a>
           <a href="#contact" className="hover:text-white transition-colors">Ubicación</a>
        </div>
        <button className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:invert transition-all">
          Reservar
        </button>
      </nav>

      {/* HERO SECTION - IMPACTO VISUAL */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 border-b border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c4a661]/10 blur-[180px] rounded-full"></div>
        </div>

        <motion.span 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-[#c4a661] text-[10px] font-black uppercase tracking-[0.6em] mb-8"
        >
          Established in 2026 — Experience Excellence
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-8xl md:text-[12rem] font-serif italic leading-none tracking-tighter mb-10 text-white"
        >
          {tenant.name.split(' ')[0]}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="max-w-xl text-white/40 text-lg font-light leading-relaxed uppercase tracking-widest"
        >
          Elevando el estándar de {tenant.industry} a través del diseño industrial y técnica maestra.
        </motion.p>

        <div className="absolute bottom-10 animate-bounce opacity-20">
           <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* SECCIÓN DE SERVICIOS - ESTILO EDITORIAL */}
      <section id="services" className="max-w-[1600px] mx-auto py-40 px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-32 gap-10">
           <div className="max-w-2xl">
              <h2 className="text-6xl font-serif italic mb-8 text-white uppercase">Nuestro <br />Catálogo_</h2>
              <p className="text-white/30 text-xl font-light leading-relaxed">
                 Cada servicio es una obra de ingeniería personalizada para tu estilo único. 
                 Utilizamos herramientas de grado industrial y productos de gama alta.
              </p>
           </div>
           <div className="flex gap-4">
              <div className="p-8 border border-white/10 rounded-3xl text-center min-w-[150px]">
                 <p className="text-4xl font-serif text-white mb-2">{services.length}</p>
                 <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Specialties</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-white/5 border border-white/5 overflow-hidden rounded-[60px]">
          {services.map((s, index) => (
            <motion.div 
              key={s.id}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              className="p-16 flex flex-col justify-between min-h-[500px] bg-[#0a0a0a] transition-colors group"
            >
               <div>
                  <div className="flex justify-between items-start mb-12">
                     <span className="text-[10px] font-black text-[#c4a661] border-b border-[#c4a661]/30 pb-2">0{index + 1}</span>
                     <Award className="w-5 h-5 text-white/10 group-hover:text-[#c4a661] transition-colors" />
                  </div>
                  <h3 className="text-4xl font-serif italic text-white mb-6 group-hover:translate-x-2 transition-transform uppercase tracking-tighter">{s.name}</h3>
                  <p className="text-white/30 text-sm font-light leading-relaxed mb-10">{s.description}</p>
               </div>
               <div className="flex justify-between items-end">
                  <span className="text-4xl font-serif text-white">${s.price}</span>
                  <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                    Add to Session <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECCIÓN SOBRE NOSOTROS / INFO */}
      <section id="about" className="py-40 bg-white/5 px-10 lg:px-40 flex flex-col lg:flex-row items-center gap-32">
         <div className="flex-1">
            <h2 className="text-5xl font-serif italic text-white mb-10 uppercase">La Nueva Era del Estilo_</h2>
            <p className="text-white/50 text-lg font-light leading-relaxed mb-12">
              Ubicados en el corazón de la ciudad, {tenant.name} redefine el concepto de {tenant.industry}. 
              No somos solo un local, somos un hub de diseño para la identidad moderna.
            </p>
            <div className="grid grid-cols-2 gap-10">
               <div className="space-y-4">
                  <Clock className="w-6 h-6 text-[#c4a661]" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Horario</p>
                  <p className="text-sm font-bold">LUN — SÁB / 09:00 — 21:00</p>
               </div>
               <div className="space-y-4">
                  <MapPin className="w-6 h-6 text-[#c4a661]" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Dirección</p>
                  <p className="text-sm font-bold">AV. CENTRAL 1024, CDMX</p>
               </div>
            </div>
         </div>
         <div className="flex-1 w-full aspect-square border border-white/10 rounded-[100px] flex items-center justify-center p-20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#c4a661]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Scissors className="w-40 h-40 text-white/5" />
            <div className="absolute bottom-10 right-10 text-[8px] font-black uppercase tracking-[0.5em] text-white/20">INDUSTRIAL GRADE</div>
         </div>
      </section>

      {/* FOOTER INDUSTRIAL */}
      <footer id="contact" className="py-20 border-t border-white/5 px-10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="text-center md:text-left">
            <span className="font-serif italic text-4xl text-white uppercase">{tenant.name}</span>
            <p className="text-white/20 mt-4 text-[10px] font-black tracking-widest uppercase">Digital Instance Powered by FuturApp OS v2</p>
          </div>
          <div className="flex gap-16">
            <a href="#" className="text-white/30 hover:text-[#c4a661] transition-colors font-black text-[10px] tracking-widest uppercase">Instagram</a>
            <a href="#" className="text-white/30 hover:text-[#c4a661] transition-colors font-black text-[10px] tracking-widest uppercase">WhatsApp</a>
            <a href="#" className="text-white/30 hover:text-[#c4a661] transition-colors font-black text-[10px] tracking-widest uppercase">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
