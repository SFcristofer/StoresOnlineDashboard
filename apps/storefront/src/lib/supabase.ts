import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Función para obtener los datos del negocio (tenant) basándose en el dominio.
 * Esta función será usada por el Storefront para saber qué renderizar.
 */
export async function getTenantByDomain(domain: string) {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('custom_domain', domain)
    .single();

  if (error) {
    console.error('Error fetching tenant:', error);
    return null;
  }

  return data;
}
