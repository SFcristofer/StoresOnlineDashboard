import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { CraftRenderer } from '@/components/blocks/CraftRenderer';

// Tipado estricto para el Tenant
interface Tenant {
  id: string;
  name: string;
  custom_domain: string;
  site_config: {
    craft?: any;
    [key: string]: any;
  } | null;
  created_at?: string;
}

// ISR: El sitio se regenera en segundo plano cada hora, o cuando se solicite manualmente
export const revalidate = 3600; 

interface DomainPageProps {
  params: { 
    domain: string 
  };
}

export default async function DomainPage({ params }: DomainPageProps) {
  const domain = params.domain;

  // 1. Buscar la información del negocio en Supabase con tipado
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('custom_domain', domain)
    .single();

  // Si no hay datos o hay error, mostramos 404
  if (error || !tenant) {
    console.error(`[DomainPage] Error fetching tenant for domain ${domain}:`, error);
    notFound();
  }

  const typedTenant = tenant as Tenant;

  // 2. Extraer el JSON generado por el constructor Craft.js y el Tema
  const craftJson = typedTenant.site_config?.craft;
  const theme = typedTenant.site_config?.theme || {
    primaryColor: '#2563eb',
    backgroundColor: '#0a0c14',
    textColor: '#ffffff',
    borderRadius: 12
  };

  return (
    <main 
      className="min-h-screen selection:bg-blue-500 selection:text-white"
      style={{ 
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        '--primary-color': theme.primaryColor,
        '--site-radius': `${theme.borderRadius}px`
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-color: ${theme.primaryColor};
          --site-radius: ${theme.borderRadius}px;
        }
        body {
          background-color: ${theme.backgroundColor};
          color: ${theme.textColor};
        }
      `}} />
      
      {/* Si hay diseño guardado, lo renderizamos de forma nativa */}
      {craftJson ? (
        <CraftRenderer json={craftJson} />
      ) : (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
             <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
             </div>
          </div>
          <h1 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">Sitio_En_Construcción</h1>
          <p className="text-white/20 uppercase font-bold text-xs tracking-[0.3em] max-w-md">
            Este local aún no ha desplegado su arquitectura visual avanzada. Por favor, vuelve más tarde.
          </p>
        </div>
      )}
      
      {/* Footer Fijo Industrial para todos los sitios */}
      <footer className="py-20 bg-black border-t border-white/5 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-xl font-black italic tracking-tighter text-white/50 hover:text-white transition-colors cursor-default">
            {typedTenant.name.toUpperCase()}_CORE
          </div>
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            © 2026 Powered by SFcristofer WaaS Platform
          </div>
        </div>
      </footer>
    </main>
  );
}
