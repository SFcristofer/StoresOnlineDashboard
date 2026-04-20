import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { supabase } from '../../lib/supabase';
import { Loader2, UploadCloud } from 'lucide-react';

const getCommonStyles = (props: any) => ({
  padding: `${props.paddingT ?? 0}px ${props.paddingR ?? 0}px ${props.paddingB ?? 0}px ${props.paddingL ?? 0}px`,
  margin: `${props.marginT ?? 0}px ${props.marginR ?? 0}px ${props.marginB ?? 0}px ${props.marginL ?? 0}px`,
  borderRadius: `${props.borderRadius ?? 0}px`,
  backgroundColor: props.background || 'transparent',
  borderWidth: `${props.borderWidth ?? 0}px`,
  borderColor: props.borderColor || 'rgba(255,255,255,0.1)',
  borderStyle: props.borderStyle || 'solid',
  boxShadow: props.shadow || 'none',
});

// 1. SECCIÓN
export const Section = ({ children, ...props }: any) => {
  const { connectors: { connect, drag }, selected, isHovered } = useNode((s) => ({ selected: s.events.selected, isHovered: s.events.hovered }));
  return (
    <section 
      ref={(ref: any) => connect(drag(ref))} 
      style={{
        ...getCommonStyles(props), 
        width: '100%', 
        minHeight: '80px', 
        outline: selected ? '2px solid #3b82f6' : isHovered ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
        outlineOffset: '-1px'
      }}
      className="relative transition-all"
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
};
Section.craft = { displayName: 'Sección', props: { paddingT: 40, paddingB: 40, background: '#050505' } };

// 2. GRID / FILA
export const Grid = ({ children, cols, gap, ...props }: any) => {
  const { connectors: { connect, drag }, isHovered } = useNode(s => ({ isHovered: s.events.hovered }));
  return (
    <div 
      ref={(ref: any) => connect(drag(ref))} 
      style={{ 
        ...getCommonStyles(props), 
        display: 'grid', 
        gridTemplateColumns: `repeat(${cols || 1}, minmax(0, 1fr))`, 
        gap: `${gap || 20}px`, 
        outline: isHovered ? '1px dashed #3b82f6' : '1px dashed rgba(255,255,255,0.1)',
        outlineOffset: '-1px'
      }} 
      className="w-full min-h-[40px]"
    >{children}</div>
  );
};
Grid.craft = { displayName: 'Cuadrícula', props: { cols: 2, gap: 20 } };

// 3. CAJA / COLUMNA
export const Box = ({ children, ...props }: any) => {
  const { connectors: { connect, drag }, isHovered } = useNode(s => ({ isHovered: s.events.hovered }));
  return (
    <div 
      ref={(ref: any) => connect(drag(ref))} 
      style={{
        ...getCommonStyles(props), 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px',
        outline: isHovered ? '1px dotted #3b82f6' : '1px dotted rgba(255,255,255,0.1)'
      }} 
      className="min-h-[40px]"
    >{children}</div>
  );
};
Box.craft = { displayName: 'Contenedor', props: { paddingT: 10, paddingB: 10, paddingL: 10, paddingR: 10 } };

// 4. TEXTO
export const Text = ({ text, fontSize, color, bold, textAlign, ...props }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} style={getCommonStyles(props)} className="w-full">
      <p style={{ fontSize: `${fontSize}px`, color: color || '#fff', fontWeight: bold ? '800' : '400', textAlign: textAlign || 'left', lineHeight: '1.4' }}>{text}</p>
    </div>
  );
};
Text.craft = { displayName: 'Texto', props: { text: 'Nuevo Texto', fontSize: 14, color: '#ffffff' } };

// 5. BOTÓN
export const Button = ({ text, bgColor, color, ...props }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} style={getCommonStyles(props)} className="inline-block">
      <button style={{ backgroundColor: bgColor || '#fff', color: color || '#000' }} className="px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest pointer-events-none">{text}</button>
    </div>
  );
};
Button.craft = { displayName: 'Botón', props: { text: 'BOTÓN', bgColor: '#ffffff', color: '#000000', borderRadius: 6 } };

// 6. IMAGEN (DROP-TO-UPLOAD)
export const Image = ({ src, height, ...props }: any) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('site-assets').upload(`uploads/${fileName}`, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(`uploads/${fileName}`);
      setProp((p: any) => p.src = publicUrl);
    } catch (err: any) { alert(err.message); } finally { setUploading(false); }
  };

  return (
    <div 
      ref={(ref: any) => connect(drag(ref))} 
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{...getCommonStyles(props), height: `${height || 200}px` }} 
      className={`w-full overflow-hidden border transition-all flex items-center justify-center relative ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-[#111]'}`}
    >
      {uploading && <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={16} /></div>}
      {!src && !uploading && <UploadCloud size={20} className="opacity-20" />}
      {src && <img src={src} className="w-full h-full object-cover pointer-events-none" />}
    </div>
  );
};
Image.craft = { displayName: 'Imagen', props: { src: '', height: 200, borderRadius: 12 } };

// 7. VIDEO
export const Video = ({ url, ...props }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} style={getCommonStyles(props)} className="w-full aspect-video bg-black overflow-hidden border border-white/10">
      <iframe src={url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'} className="w-full h-full pointer-events-none" frameBorder="0" />
    </div>
  );
};
Video.craft = { displayName: 'Video', props: { borderRadius: 12 } };

// 8. CARRUSEL
export const Carousel = ({ children, height, ...props }: any) => {
  const { connectors: { connect, drag }, isHovered } = useNode(s => ({ isHovered: s.events.hovered }));
  return (
    <div 
      ref={(ref: any) => connect(drag(ref))} 
      style={{ ...getCommonStyles(props), height: `${height || 300}px`, outline: isHovered ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)' }} 
      className="w-full flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar"
    >{children}</div>
  );
};
Carousel.craft = { displayName: 'Carrusel', props: { height: 300 } };

// 9. SERVICE CARD
export const ServiceCard = ({ title, price, desc, ...props }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} style={getCommonStyles(props)} className="bg-[#111] border border-white/5 p-6 rounded-2xl w-full">
      <h3 className="text-lg font-bold text-white uppercase italic">{title || 'Servicio'}</h3>
      <p className="text-blue-500 font-black text-sm mb-2">${price || '0'}</p>
      <p className="text-white/40 text-[10px] leading-relaxed mb-4">{desc || 'Descripción...'}</p>
      <button className="w-full py-2 bg-white text-black rounded-lg text-[9px] font-bold uppercase">Reservar</button>
    </div>
  );
};
ServiceCard.craft = { displayName: 'Tarjeta Servicio', props: { title: '', price: '', desc: '' } };

// 10. BOOKING SYSTEM
export const BookingSystem = ({ title, ...props }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref: any) => connect(drag(ref))} style={getCommonStyles(props)} className="w-full bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-xl font-black text-white uppercase italic mb-6 text-center">{title || 'Calendario'}</h2>
      <div className="grid grid-cols-7 gap-1 opacity-50 mb-4">
        {[...Array(28)].map((_, i) => <div key={i} className="h-8 rounded bg-white/5 flex items-center justify-center text-[8px] font-bold text-white/40">{i+1}</div>)}
      </div>
      <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase">Confirmar_Cita</button>
    </div>
  );
};
BookingSystem.craft = { displayName: 'Sistema Citas', props: { title: '' } };
