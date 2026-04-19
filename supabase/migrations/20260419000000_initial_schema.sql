-- Migración inicial: Estructura Multi-tenant WaaS

-- 1. Tabla de Tenants (Inquilinos/Negocios)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    custom_domain TEXT UNIQUE NOT NULL, -- Ej: 'barberiapepe.com'
    logo_url TEXT,
    theme_color TEXT DEFAULT '#3b82f6', -- Color por defecto (blue-500)
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Extender tabla de Users de Auth (Vía Row Level Security - RLS)
-- Para esto usaremos la tabla pública que manejaremos desde el Admin
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Servicios (Catálogo)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar Row Level Security (RLS) para proteger los datos
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Nota: Las políticas de acceso se configurarán en Supabase Dashboard o vía SQL
-- dependiendo de si es para lectura pública (Storefront) o edición (Admin).
