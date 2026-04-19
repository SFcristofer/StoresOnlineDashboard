-- 1. Mejorar la tabla de Tenants para ser una Fábrica de Sitios
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT 'general', -- 'barber', 'restaurant', 'beauty'
ADD COLUMN IF NOT EXISTS theme_type TEXT DEFAULT 'futuristic', -- 'futuristic', 'minimal', 'classic'
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- 2. Asegurar que el RLS permita al usuario maestro crear locales
DROP POLICY IF EXISTS "Permitir crear locales" ON public.tenants;
CREATE POLICY "Permitir crear locales" ON public.tenants FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir editar locales" ON public.tenants;
CREATE POLICY "Permitir editar locales" ON public.tenants FOR UPDATE USING (true);
