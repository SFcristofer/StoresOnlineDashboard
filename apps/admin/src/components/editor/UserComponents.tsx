import React from 'react';
import { useNode } from '@craftjs/core';
import { UploadCloud } from 'lucide-react';

const getCommonStyles = (p: any) => {
  const paddingTop = p.paddingTop !== undefined ? p.paddingTop : (p.padding || 0);
  const paddingBottom = p.paddingBottom !== undefined ? p.paddingBottom : (p.padding || 0);
  const paddingLeft = p.paddingLeft !== undefined ? p.paddingLeft : (p.padding || 0);
  const paddingRight = p.paddingRight !== undefined ? p.paddingRight : (p.padding || 0);
  
  const marginTop = p.marginTop !== undefined ? p.marginTop : (p.margin || 0);
  const marginBottom = p.marginBottom !== undefined ? p.marginBottom : (p.margin || 0);

  return {
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    borderRadius: `${p.borderRadius || 0}px`,
    backgroundColor: p.background || 'transparent',
    color: p.color || 'inherit',
    textAlign: p.textAlign || 'left',
    display: 'flex',
    flexDirection: (p.flexDirection || 'column') as any,
    gap: `${p.gap || 0}px`,
  };
};

export const Section = ({ children, ...p }: any) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  return (
    <section 
      ref={(r: any) => connect(drag(r))} 
      style={{...getCommonStyles(p), minHeight: '80px'}} 
      className={`relative w-full transition-all ${selected ? 'ring-2 ring-blue-500 ring-inset' : 'hover:outline hover:outline-1 hover:outline-blue-500/30'}`}
    >
      <div className="max-w-7xl mx-auto w-full h-full min-h-[40px]">
        {children}
        {React.Children.count(children) === 0 && (
          <div className="py-10 text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/5 border border-dashed border-white/10 rounded-xl">
            Arquitectura_Vacia_Arrastra_Componentes
          </div>
        )}
      </div>
    </section>
  );
};
Section.craft = { displayName: 'Sección', props: { padding: 40, background: '#050505' } };

export const Grid = ({ children, ...p }: any) => {
  const { connectors: { connect, drag }, selected } = useNode(s => ({ selected: s.events.selected }));
  return (
    <div 
      ref={(r: any) => connect(drag(r))} 
      style={{ 
        ...getCommonStyles(p), 
        display: 'grid', 
        gridTemplateColumns: `repeat(${p.cols || 2}, minmax(0, 1fr))`, 
        gap: `${p.gap || 20}px` 
      }} 
      className={`w-full p-4 ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {children}
    </div>
  );
};
Grid.craft = { displayName: 'Grilla', props: { cols: 2, gap: 20 } };

export const Text = ({ text, fontSize, color, ...p }: any) => {
  const { connectors: { connect, drag }, selected } = useNode();
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className={selected ? 'ring-1 ring-blue-500' : ''}>
      <p style={{ fontSize: `${fontSize || 16}px`, color: color || '#ffffff', margin: 0, fontWeight: p.bold ? '800' : '400' }}>{text}</p>
    </div>
  );
};
Text.craft = { displayName: 'Texto', props: { text: 'Nuevo Texto', fontSize: 16, color: '#ffffff' } };

export const Button = ({ text, ...p }: any) => {
  const { connectors: { connect, drag }, selected } = useNode();
  return (
    <div ref={(r: any) => connect(drag(r))} style={{...getCommonStyles(p), width: 'auto'}} className="inline-block p-1">
      <button 
        style={{ backgroundColor: p.background || '#2563eb', color: p.color || '#ffffff', borderRadius: `${p.borderRadius || 8}px` }} 
        className={`px-8 py-3 font-black uppercase text-[10px] tracking-widest border-none ${selected ? 'ring-2 ring-white' : ''}`}
      >
        {text}
      </button>
    </div>
  );
};
Button.craft = { displayName: 'Botón', props: { text: 'ACCIÓN', background: '#2563eb', color: '#ffffff', borderRadius: 8 } };

export const Image = ({ src, ...p }: any) => {
  const { connectors: { connect, drag }, selected } = useNode();
  const openPicker = () => { if ((window as any).openMediaPicker) (window as any).openMediaPicker((url: string) => (window as any).setProp('src', url)); };
  return (
    <div ref={(r: any) => connect(drag(r))} onClick={openPicker} style={{...getCommonStyles(p), height: `${p.height || 300}px` }} className={`overflow-hidden flex items-center justify-center bg-[#111] cursor-pointer ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      {!src ? <UploadCloud className="text-white/10" size={32} /> : <img src={src} className="w-full h-full object-cover pointer-events-none" />}
    </div>
  );
};
Image.craft = { displayName: 'Imagen', props: { height: 300, borderRadius: 12 } };

export const HeroBlock = ({ title, subtitle, buttonText, ...p }: any) => {
  const { connectors: { connect, drag }, selected } = useNode();
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className={`text-center py-20 px-10 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <h1 style={{ fontSize: `${p.titleSize || 64}px` }} className="font-black italic uppercase tracking-tighter mb-4">{title}</h1>
      <p style={{ fontSize: `${p.subSize || 18}px` }} className="opacity-40 max-w-2xl mx-auto mb-8">{subtitle}</p>
      <button style={{ background: p.primaryColor || '#2563eb', borderRadius: '100px' }} className="px-10 py-4 font-black uppercase text-xs tracking-widest">{buttonText}</button>
    </div>
  );
};
HeroBlock.craft = { displayName: 'Hero', props: { title: 'TÍTULO_MAESTRO', subtitle: 'Descripción técnica.', buttonText: 'EMPEZAR', titleSize: 64, subSize: 18 } };

export const Box = ({ children, ...p }: any) => {
  const { connectors: { connect, drag }, selected } = useNode(s => ({ selected: s.events.selected }));
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className={`min-h-[40px] w-full ${selected ? 'ring-2 ring-blue-500' : 'border border-dashed border-white/5'}`}>
      {children}
    </div>
  );
};
Box.craft = { displayName: 'Caja', props: { padding: 20 } };

export const Carousel = ({ children, ...p }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className="flex overflow-x-auto gap-4 p-4">{children}</div>;
};
Carousel.craft = { displayName: 'Carrusel', props: { padding: 20 } };

export const ServiceCard = ({ title, price, ...p }: any) => {
  const { connectors: { connect, drag }, selected } = useNode();
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className={`bg-white/5 border border-white/10 p-8 rounded-3xl ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <h3 className="text-xl font-black italic uppercase text-blue-500 mb-2">{title}</h3>
      <div className="text-2xl font-black mb-4">${price}</div>
    </div>
  );
};
ServiceCard.craft = { displayName: 'Servicio', props: { title: 'Servicio', price: '99' } };

export const Video = ({ url, ...p }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className="aspect-video bg-black rounded-2xl overflow-hidden">
      <iframe src={url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'} className="w-full h-full pointer-events-none" />
    </div>
  );
};
Video.craft = { displayName: 'Video', props: { url: '' } };

export const FeaturesBlock = ({ title, ...p }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(r: any) => connect(drag(r))} style={getCommonStyles(p)} className="py-20 text-center">
       <h2 className="text-3xl font-black uppercase italic mb-10">{title}</h2>
       <div className="grid grid-cols-3 gap-8 px-10">
          {[1,2,3].map(i => <div key={i} className="p-10 bg-white/5 rounded-[32px] border border-white/5 text-white font-bold uppercase italic">Ventaja_{i}</div>)}
       </div>
    </div>
  );
};
FeaturesBlock.craft = { displayName: 'Características', props: { title: 'VENTAJAS' } };
