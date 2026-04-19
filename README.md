# 🚀 FuturWaaS: Industrial Website Factory

FuturWaaS es una plataforma **Website as a Service (WaaS)** de grado industrial diseñada para el despliegue masivo y automatizado de sitios web para negocios locales (barberías, restaurantes, estudios de diseño).

## 🛠️ Arquitectura Técnica (Desacoplada)

La plataforma utiliza una arquitectura de **Monorepo** para garantizar la escalabilidad y facilitar el mantenimiento:

*   **/apps/storefront (Next.js 14):** El motor de renderizado público. Utiliza un **Middleware Multi-tenant** que detecta automáticamente si el cliente accede vía dominio propio (`barberia.com`) o subdominio (`pepe.tuplataforma.com`).
*   **/apps/admin (React + Vite):** Centro de comando para la gestión de locales. Permite el "Spawner" de nuevas instancias digitales en segundos.
*   **/supabase (PostgreSQL):** Backend as a Service que gestiona la autenticación, seguridad a nivel de filas (RLS) y almacenamiento de datos industriales.

## 🎨 Diseño de Alta Fidelidad
*   **Estética:** Luxury Dark / Industrial.
*   **Tech Stack UI:** Tailwind CSS + Framer Motion (animaciones cinemáticas) + Lucide Icons.
*   **Tipografía:** Combinación editorial de Serif y Sans-Serif técnica.

## 🌍 Estrategia de Dominios (Escalabilidad)

El sistema está configurado para manejar dos tipos de clientes:
1.  **Clientes Entry-level:** Utilizan un subdominio gratuito (ej. `cliente.tuapp.com`).
2.  **Clientes Premium:** Utilizan su propio dominio raíz (ej. `www.cliente.com`).

## 🚀 Guía de Despliegue a Producción

### 1. Backend (Supabase)
*   Las migraciones están en `/supabase/migrations`. Ejecútalas en el SQL Editor.
*   Desactiva "Confirm Email" en Auth Settings para un registro instantáneo.

### 2. Frontend (Vercel)
*   Crea dos proyectos en Vercel apuntando a este repo.
*   **Proyecto 1:** Root en `apps/admin`.
*   **Proyecto 2:** Root en `apps/storefront`.
*   Añade un registro **Wildcard DNS** (`*.tuplataforma.com`) en Vercel para soportar subdominios ilimitados.

## 📈 Rentabilidad
Este sistema permite un costo operativo de **$0 USD** por cada nuevo cliente, permitiéndote cobrar suscripciones mensuales recurrentes con un margen de ganancia del 100%.

---
Desarrollado por [SFcristofer](https://github.com/SFcristofer)
