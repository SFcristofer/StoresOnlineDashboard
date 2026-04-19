import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { CraftRenderer } from '@/components/blocks/CraftRenderer';

export const revalidate = 0; // Para ver cambios al instante sin necesidad de recargar el servidor

export default async function DomainPage({ params }: { params: { domain: string } }) {
  const domain = params.domain;

  // 1. Buscar la información del negocio en Supabase
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('custom_domain', domain)
    .single();

  if (error || !tenant) {
    notFound();
  }

  // 2. Extraer el JSON generado por el constructor Craft.js
  const craftJson = tenant.site_config?.craft;

  return (
    <main className="min-h-screen bg-[#0a0c14] text-white selection:bg-blue-500 selection:text-white">
      
      {/* Si hay diseño guardado, lo renderizamos de forma nativa */}
      {craftJson ? (
        <CraftRenderer json={craftJson} />
      ) : (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">Sitio_En_Construcción</h1>
          <p className="text-white/20 uppercase font-bold text-xs tracking-[0.3em]">
            Este local aún no ha desplegado su arquitectura visual avanzada.
          </p>
        </div>
      )}
      
      {/* Footer Fijo Industrial para todos los sitios */}
      <footer className="py-20 bg-black border-t border-white/5 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-10">
          <div className="text-xl font-black italic tracking-tighter text-white/50 hover:text-white transition-colors cursor-default">
            {tenant.name.toUpperCase()}_CORE
          </div>
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            © 2026 Powered by SFcristofer WaaS Platform
          </div>
        </div>
      </footer>
    </main>
  );
}
