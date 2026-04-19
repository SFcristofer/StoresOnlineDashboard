import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

export const revalidate = 0; // Para ver cambios al instante

export default async function DomainPage({ params }: { params: { domain: string } }) {
  const domain = params.domain;

  // 1. Buscar el tenant por dominio
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('custom_domain', domain)
    .single();

  if (error || !tenant) {
    notFound();
  }

  // 2. Extraer los bloques de la configuración del sitio
  // Si no hay configuración, mostramos un mensaje por defecto
  const blocks = tenant.site_config?.blocks || [];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white">
      {blocks.length > 0 ? (
        <BlockRenderer blocks={blocks} />
      ) : (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">Sitio_En_Construcción</h1>
          <p className="text-white/20 uppercase font-bold text-xs tracking-[0.3em]">Este local aún no ha desplegado sus módulos visuales.</p>
        </div>
      )}
      
      {/* Footer Industrial */}
      <footer className="py-20 bg-black border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-10">
          <div className="text-xl font-black italic tracking-tighter">{tenant.name.toUpperCase()}_CORE</div>
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            © 2026 Powered by SFcristofer WaaS Platform
          </div>
        </div>
      </footer>
    </main>
  );
}
