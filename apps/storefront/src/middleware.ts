import { NextRequest, NextResponse } from 'next/server';

export const middleware = (req: NextRequest) => {
  const url = req.nextUrl;
  let hostname = req.headers.get('host') || '';

  // 1. Limpieza inicial (quitar puerto para desarrollo local)
  hostname = hostname.split(':')[0];

  // 2. Definir tu dominio principal (el que usarás para vender)
  const rootDomain = 'tuplataforma.com'; // Cambia esto por tu dominio real en producción

  // Ignorar archivos internos y APIs
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.includes('/api/') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 3. Lógica de Subdominios vs Dominios Propios
  let currentDomain = hostname;

  // Si el usuario entra a pepe.tuplataforma.com, extraemos "pepe"
  if (hostname.endsWith(`.${rootDomain}`)) {
    currentDomain = hostname.replace(`.${rootDomain}`, '');
  }

  // 4. Reescritura interna
  // Ejemplo 1: barberiapepe.com -> /app/barberiapepe.com
  // Ejemplo 2: pepe.tuplataforma.com -> /app/pepe
  url.pathname = `/${currentDomain}${url.pathname}`;
  
  return NextResponse.rewrite(url);
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
