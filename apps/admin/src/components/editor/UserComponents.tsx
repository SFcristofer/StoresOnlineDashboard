import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { supabase } from '../../lib/supabase';
import { Loader2, UploadCloud } from 'lucide-react';

const getCommonStyles = (p: any) => {
  const n = (v: any) => typeof v === 'string' && v.includes('px') ? parseInt(v.replace('px','')) : (v || 0);
  const mAuto = p.margin === '0 auto' || p.margin === 'auto';
  
  return {
    paddingTop: `${n(p.paddingT || p.paddingTop || p.padding)}px`,
    paddingRight: `${n(p.paddingR || p.paddingRight || p.padding)}px`,
    paddingBottom: `${n(p.paddingB || p.paddingBottom || p.padding)}px`,
    paddingLeft: `${n(p.paddingL || p.paddingLeft || p.padding)}px`,
    marginTop: `${n(p.marginT || p.marginTop || (mAuto ? 0 : p.margin))}px`,
    marginRight: mAuto ? 'auto' : `${n(p.marginR || p.marginRight || p.margin)}px`,
    marginBottom: `${n(p.marginB || p.marginBottom || (mAuto ? 0 : p.margin))}px`,
    marginLeft: mAuto ? 'auto' : `${n(p.marginL || p.marginLeft || p.margin)}px`,
    borderRadius: `${n(p.borderRadius || p.radius)}px`,
    backgroundColor: p.background || p.backgroundColor || p.bgColor || 'transparent',
    border: `${n(p.borderWidth)}px ${p.borderStyle || 'solid'} ${p.borderColor || 'rgba(255,255,255,0.1)'}`,
    boxShadow: p.shadow || 'none',
    maxWidth: p.maxWidth || '100%',
    textAlign: p.textAlign || 'left',
  };
};

export const Section = ({ children, ...p }: any) => {
  const { connectors: { connect, drag }, selected, isHovered } = useNode((s) => ({ selected: s.events.selected, isHovered: s.events.hovered }));
  return (
    <section ref={(r: any) => connect(drag(r))} style={{...getCommonStyles(p), width: '100%', minHeight: '100px', outline: selected ? '2px solid #3b82f6' : isHovered ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: p.gap ? `${p.gap}px` : '40px'}} className="relative transition-all overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-10 relative z-10">{children}</div>
    </section>
  );
};
Section.craft = { displayName: 'Sección', props: { padding: 80, background: '#050505' } };

export const Grid = ({ children, ...p }: any) => {
  const { connectors: { connect, drag }, isHovered } = useNode(s => ({ isHovered: s.events.hovered }));
  const cols = p.cols || p.columns || 1;
  return (
    <div ref={(r: any) => connect(drag(r))} style={{ ...getCommonStyles(p), display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: `${p.gap || 32}px`, outline: isHovered ? '1px dashed #3b82f6' : 'none' }} className="w-full">
      {children}
    </div>
  );
};
Grid.craft = { displayName: 'Cuadrícula', props: { cols: 2, gap: 32 } };

export const Box = ({ children, ...p }: any) => {
  const { connectors: { connect, drag }, isHovered } = useNode(s => ({ isHovered: s.events.hovered }));
  return (
    <div ref={(r: any) => connect(drag(r))} style={{...getCommonStyles(p), display: 'flex', flexDirection: p.flexDirection || 'column', alignItems: p.alignItems || 'stretch', justifyContent: p.justifyContent || 'flex-start', gap: `${p.gap || 16}px`, outline: isHovered ? '1px dotted #3b82f6' : 'none'}} className="w-full">
      {children}
    </div>
  );
};
Box.craft = { displayName: 'Contenedor', props: { padding: 20 } };

export const Text = ({ text, fontSize, color, bold, fontWeight, textAlign, ...p }: any) => {
  const { connectors: { connect, drag } } = useNode();
  const n = (v: any) => typeof v === 'string' ? parseInt(v.replace('px','')) : (v || 16);
  const isBold = bold === true || bold === 'true' || fontWeight === 'bold' || fontWeight === '800' || fontWeight === 800;
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className="w-full flex">
      <p style={{ fontSize: `${n(fontSize)}px`, color: color || '#fff', fontWeight: isBold ? '800' : '400', lineHeight: '1.2', margin: 0, letterSpacing: isBold && n(fontSize) > 30 ? '-0.03em' : 'normal', width: '100%' }}>{text}</p>
    </div>
  );
};
Text.craft = { displayName: 'Texto', props: { text: 'Nuevo Texto', fontSize: 16 } };

export const Button = ({ text, bgColor, backgroundColor, color, ...p }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className="inline-block">
      <button style={{ backgroundColor: bgColor || backgroundColor || p.background || '#fff', color: color || '#000' }} className="px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest pointer-events-none transition-all shadow-xl">{text}</button>
    </div>
  );
};
Button.craft = { displayName: 'Botón', props: { text: 'Botón', bgColor: '#fff', color: '#000', borderRadius: 100 } };

export const ServiceCard = ({ title, price, desc, description, image, ...p }: any) => {
  const { connectors: { connect, drag } } = useNode();
  const finalDesc = desc || description || 'Servicio Premium...';
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className="bg-[#0f0f11] border border-white/10 p-8 rounded-[32px] w-full flex flex-col gap-4 group hover:border-blue-500/50 transition-all hover:-translate-y-2 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
      {image && <div className="h-40 bg-white/5 rounded-2xl overflow-hidden mb-2"><img src={image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /></div>}
      <div className="flex justify-between items-start gap-4 relative z-10">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{title || 'Servicio'}</h3>
        <span className="text-blue-400 font-black text-lg bg-blue-500/10 px-3 py-1 rounded-lg">${price || '0'}</span>
      </div>
      <p className="text-white/40 text-xs leading-relaxed relative z-10">{finalDesc}</p>
      <button className="w-full py-4 bg-white/5 text-white hover:bg-white hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest mt-auto transition-colors border border-white/10 relative z-10">Reservar_</button>
    </div>
  );
};
ServiceCard.craft = { displayName: 'Tarjeta Servicio', props: { title: '', price: '', desc: '', image: '' } };

export const BookingSystem = ({ title, ...p }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className="w-full bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col gap-8">
      <h2 className="text-2xl font-black text-white uppercase italic mb-2 text-center">{title || 'Gestión de Citas'}</h2>
      <div className="grid grid-cols-7 gap-2 opacity-50">{[...Array(28)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">{i+1}</div>)}</div>
      <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">Confirmar Reserva</button>
    </div>
  );
};
BookingSystem.craft = { displayName: 'Sistema Citas', props: { title: '' } };

export const Image = ({ src, height, ...p }: any) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const [up, setUp] = useState(false);
  const handleDrop = async (e: any) => {
    e.preventDefault(); const file = e.dataTransfer.files[0]; if (!file) return; setUp(true);
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('site-assets').upload(`uploads/${fileName}`, file);
    if (!error) { const { data } = supabase.storage.from('site-assets').getPublicUrl(`uploads/${fileName}`); setProp((p: any) => p.src = data.publicUrl); }
    setUp(false);
  };
  return (
    <div ref={(r: any) => connect(drag(r))} onDragOver={e => e.preventDefault()} onDrop={handleDrop} style={{...getCommonStyles(p), height: `${typeof height === 'string' ? parseInt(height) : (height || 300)}px` }} className="w-full overflow-hidden relative border border-white/5 bg-[#111]">
      {up && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}
      <img src={src || 'https://images.unsplash.com/photo-1634017831461-452137a2701d?q=80&w=800'} className="w-full h-full object-cover pointer-events-none" />
    </div>
  );
};
Image.craft = { displayName: 'Imagen', props: { height: 300, borderRadius: 24 } };

export const Carousel = ({ children, height, ...p }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(r: any) => connect(drag(r))} style={{ ...getCommonStyles(p), height: `${typeof height === 'string' ? parseInt(height) : (height || 400)}px` }} className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 no-scrollbar">{children}</div>
  );
};
Carousel.craft = { displayName: 'Carrusel', props: { height: 400 } };

export const Video = ({ url, ...p }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className="w-full aspect-video bg-black overflow-hidden border border-white/10"><iframe src={url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'} className="w-full h-full pointer-events-none" frameBorder="0" /></div>
  );
};
Video.craft = { displayName: 'Video', props: { borderRadius: 12 } };
