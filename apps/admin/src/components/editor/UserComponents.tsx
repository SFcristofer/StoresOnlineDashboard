import React from 'react';
import { useNode } from '@craftjs/core';

const getCommonStyles = (props: any) => ({
  padding: `${props.paddingT || 0}px ${props.paddingR || 0}px ${props.paddingB || 0}px ${props.paddingL || 0}px`,
  margin: `${props.marginT || 0}px ${props.marginR || 0}px ${props.marginB || 0}px ${props.marginL || 0}px`,
  borderRadius: `${props.borderRadius || 0}px`,
  backgroundColor: props.background || 'transparent',
});

// --- SECCIÓN ---
export const Section = ({ children, ...props }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <section ref={(ref: any) => connect(drag(ref))} style={{...getCommonStyles(props), width: '100%'}}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
};
Section.craft = { displayName: 'Sección', props: { paddingT: 80, paddingB: 80, background: '#050505' } };

// --- FILA ---
export const Row = ({ children, gap }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} style={{ gap: `${gap || 32}px`, display: 'flex' }} className="flex flex-col md:flex-row w-full">{children}</div>
  );
};
Row.craft = { displayName: 'Fila', props: { gap: 32 } };

// --- COLUMNA ---
export const Column = ({ children, ...props }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} style={{...getCommonStyles(props), flex: props.width || 1, display: 'flex', flexDirection: 'column', gap: '20px'}}>
      {children}
    </div>
  );
};
Column.craft = { displayName: 'Columna', props: { width: 1 } };

// --- COMPONENTE: TARJETA DE SERVICIO (ELITE) ---
export const ServiceCard = ({ title, price, desc, image }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} className="bg-[#111] border border-white/5 p-6 rounded-[32px] overflow-hidden group hover:border-blue-500/50 transition-all shadow-2xl">
      <div className="h-48 bg-[#1a1a1a] rounded-2xl mb-6 overflow-hidden">
        <img src={image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
      </div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">{title || 'Corte Pro'}</h3>
        <span className="text-blue-500 font-black tracking-tighter text-lg">${price || '25'}</span>
      </div>
      <p className="text-white/40 text-xs leading-relaxed mb-6">{desc || 'Servicio premium con acabados industriales.'}</p>
      <button className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-[0.2em]">Reservar_Ahora</button>
    </div>
  );
};
ServiceCard.craft = { displayName: 'Tarjeta Servicio', props: { title: '', price: '', desc: '', image: '' } };

// --- COMPONENTE: SISTEMA DE AGENDAMIENTO (ELITE) ---
export const BookingSystem = ({ title }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} className="w-full bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 shadow-[0_0_100px_rgba(0,0,0,1)]">
      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-10 text-center">{title || 'Gestión_De_Citas'}</h2>
      <div className="grid grid-cols-7 gap-2 mb-8">
        {[...Array(31)].map((_, i) => (
          <div key={i} className={`h-12 rounded-xl flex items-center justify-center text-[10px] font-bold border ${i === 14 ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/5 text-white/20'}`}>{i + 1}</div>
        ))}
      </div>
      <div className="space-y-3">
         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">Horarios_Disponibles</p>
         <div className="grid grid-cols-3 gap-3">
            {['09:00', '10:30', '14:00', '16:00', '18:30'].map(t => (
              <div key={t} className="py-3 bg-white/5 rounded-xl text-center text-[10px] font-bold text-white hover:bg-blue-600 transition-colors cursor-pointer border border-white/5">{t}</div>
            ))}
         </div>
      </div>
    </div>
  );
};
BookingSystem.craft = { displayName: 'Sistema Citas', props: { title: '' } };

// --- COMPONENTE: TEXTO ---
export const Text = ({ text, fontSize, color, bold, textAlign }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} className="w-full py-2">
      <p style={{ fontSize: `${fontSize}px`, color: color || '#ffffff', fontWeight: bold ? '900' : '400', textAlign: textAlign || 'left', lineHeight: '1.2' }} className="font-sans uppercase tracking-tighter italic">
        {text}
      </p>
    </div>
  );
};
Text.craft = { displayName: 'Texto', props: { text: 'Título...', fontSize: 32, color: '#ffffff', bold: true } };

// --- COMPONENTE: BOTÓN ---
export const Button = ({ text }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} className="py-4">
      <button className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all">
        {text}
      </button>
    </div>
  );
};
Button.craft = { displayName: 'Botón', props: { text: 'Acción' } };

// --- COMPONENTE: IMAGEN ---
export const Image = ({ src, height, borderRadius }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} style={{ height: `${height || 300}px`, borderRadius: `${borderRadius || 24}px` }} className="w-full overflow-hidden border border-white/5 shadow-2xl my-4">
      <img src={src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" alt="Visual" />
    </div>
  );
};
Image.craft = { displayName: 'Imagen', props: { src: '', height: 300, borderRadius: 24 } };

// --- COMPONENTE: CARRUSEL ---
export const Carousel = ({ children, height }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} style={{ height: `${height || 400}px` }} className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 custom-scrollbar p-4">
      {children}
    </div>
  );
};
Carousel.craft = { displayName: 'Carrusel', props: { height: 400 } };
