import React from 'react';
import { useNode, Element } from '@craftjs/core';

// 1. COMPONENTE CONTENEDOR (Filas/Columnas)
export const Container = ({ children, padding, margin, background, flexDir }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div 
      ref={(ref: any) => connect(drag(ref))}
      style={{
        padding: `${padding}px`,
        margin: `${margin}px`,
        background: background || 'transparent',
        display: 'flex',
        flexDirection: flexDir || 'column',
        gap: '16px',
        minHeight: '50px',
        width: '100%',
        transition: 'all 0.2s ease'
      }}
      className="border border-dashed border-white/5 hover:border-blue-500/30 relative group"
    >
      {children}
    </div>
  );
};

Container.craft = {
  props: { padding: 20, margin: 0, background: 'transparent', flexDir: 'column' },
  rules: { canMoveIn: () => true }
};

// 2. COMPONENTE TEXTO
export const Text = ({ text, fontSize, color, fontWeight, textAlign }: any) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({ selected: state.events.selected }));
  return (
    <div ref={(ref: any) => connect(drag(ref))} className={`relative ${selected ? 'ring-2 ring-blue-500 rounded' : ''}`}>
      <p style={{ fontSize: `${fontSize}px`, color: color || 'white', fontWeight: fontWeight || 'normal', textAlign: textAlign || 'left', margin: 0 }}>
        {text}
      </p>
    </div>
  );
};

Text.craft = {
  props: { text: 'Texto de ejemplo', fontSize: 16, color: '#ffffff', fontWeight: 'normal', textAlign: 'left' }
};

// 3. COMPONENTE BOTÓN
export const Button = ({ text, color, bgColor }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <button ref={(ref: any) => connect(drag(ref))} style={{ backgroundColor: bgColor || '#3b82f6', color: color || 'white' }} className="px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">
      {text}
    </button>
  );
};

Button.craft = {
  props: { text: 'Haz Clic', bgColor: '#3b82f6', color: '#ffffff' }
};

// 4. COMPONENTE IMAGEN
export const Image = ({ src, width, borderRadius, height }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} style={{ width: width || '100%' }}>
      <img src={src || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800'} style={{ borderRadius: `${borderRadius}px` || '0px', height: height || 'auto', objectFit: 'cover' }} className="w-full" />
    </div>
  );
};

Image.craft = {
  props: { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', width: '100%', height: '200px', borderRadius: 20 }
};

// 5. COMPONENTE CARRUSEL (NUEVO)
export const Carousel = ({ children, height }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div 
      ref={(ref: any) => connect(drag(ref))}
      style={{ height: `${height}px`, minHeight: '100px' }}
      className="w-full flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 custom-scrollbar border border-dashed border-white/5 hover:border-blue-500/30"
    >
      {/* Indicador para el Admin si está vacío */}
      {React.Children.count(children) === 0 ? (
         <div className="flex-1 flex items-center justify-center text-white/20 text-[10px] uppercase tracking-widest font-black italic">
           Arrastra elementos (Cards/Imágenes) aquí dentro
         </div>
      ) : children}
    </div>
  );
};

Carousel.craft = {
  props: { height: 300 },
  rules: { canMoveIn: () => true }
};
