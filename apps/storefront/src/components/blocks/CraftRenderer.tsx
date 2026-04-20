import React from 'react';

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

const Components: Record<string, React.FC<any>> = {
  Section: ({ children, ...p }: any) => (
    <section style={{...getCommonStyles(p), width: '100%', display: 'flex', flexDirection: 'column', gap: p.gap ? `${p.gap}px` : '40px', overflow: 'hidden'}} className="relative">
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-10 relative z-10">{children}</div>
    </section>
  ),
  Grid: ({ children, ...p }: any) => {
    const cols = p.cols || p.columns || 1;
    return (
      <div style={{ ...getCommonStyles(p), display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: `${p.gap || 32}px` }} className="w-full">
        {children}
      </div>
    );
  },
  Box: ({ children, ...p }: any) => (
    <div style={{...getCommonStyles(p), display: 'flex', flexDirection: p.flexDirection || 'column', alignItems: p.alignItems || 'stretch', justifyContent: p.justifyContent || 'flex-start', gap: `${p.gap || 16}px`}} className="w-full">
      {children}
    </div>
  ),
  Text: ({ text, fontSize, color, bold, fontWeight, textAlign, ...p }: any) => {
    const n = (v: any) => typeof v === 'string' ? parseInt(v.replace('px','')) : (v || 16);
    const isBold = bold === true || bold === 'true' || fontWeight === 'bold' || fontWeight === '800' || fontWeight === 800;
    return (
      <div style={getCommonStyles(p)} className="w-full flex">
        <p style={{ fontSize: `${n(fontSize)}px`, color: color || '#fff', fontWeight: isBold ? '800' : '400', lineHeight: '1.2', margin: 0, letterSpacing: isBold && n(fontSize) > 30 ? '-0.03em' : 'normal', width: '100%' }}>{text}</p>
      </div>
    );
  },
  Button: ({ text, bgColor, backgroundColor, color, ...p }: any) => (
    <div style={getCommonStyles(p)} className="inline-block">
      <button style={{ backgroundColor: bgColor || backgroundColor || p.background || '#fff', color: color || '#000' }} className="px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">{text}</button>
    </div>
  ),
  Image: ({ src, height, ...p }: any) => {
    const n = (v: any) => typeof v === 'string' ? parseInt(v.replace('px','')) : (v || 200);
    return (
      <div style={{...getCommonStyles(p), height: `${n(height)}px` }} className="w-full overflow-hidden border border-white/5 bg-[#111] relative">
        <img src={src || 'https://images.unsplash.com/photo-1634017831461-452137a2701d?q=80&w=800'} className="w-full h-full object-cover" alt="Visual" />
      </div>
    );
  },
  Video: ({ url, ...p }: any) => (
    <div style={getCommonStyles(p)} className="w-full aspect-video bg-black overflow-hidden border border-white/10">
      <iframe src={url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'} className="w-full h-full" frameBorder="0" allowFullScreen />
    </div>
  ),
  Carousel: ({ children, height, ...p }: any) => {
    const n = (v: any) => typeof v === 'string' ? parseInt(v.replace('px','')) : (v || 300);
    return (
      <div style={{ ...getCommonStyles(p), height: `${n(height)}px` }} className="w-full flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar">
        {React.Children.map(children, child => <div className="snap-center shrink-0 min-w-[80vw] md:min-w-[40vw] lg:min-w-[30vw] h-full">{child}</div>)}
      </div>
    );
  },
  ServiceCard: ({ title, price, desc, description, image, ...p }: any) => {
    const finalDesc = desc || description || 'Servicio Premium...';
    return (
      <div style={getCommonStyles(p)} className="bg-[#0f0f11] border border-white/10 p-8 rounded-[32px] w-full flex flex-col gap-4 group hover:border-blue-500/50 transition-all hover:-translate-y-2 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
        {image && <div className="h-40 bg-white/5 rounded-2xl overflow-hidden mb-2"><img src={image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={title} /></div>}
        <div className="flex justify-between items-start gap-4 relative z-10">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{title || 'Servicio'}</h3>
          <span className="text-blue-400 font-black text-lg bg-blue-500/10 px-3 py-1 rounded-lg">${price || '0'}</span>
        </div>
        <p className="text-white/40 text-xs leading-relaxed relative z-10">{finalDesc}</p>
        <button className="w-full py-4 bg-white/5 text-white hover:bg-white hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest mt-auto transition-colors border border-white/10 relative z-10">Reservar_</button>
      </div>
    );
  },
  BookingSystem: ({ title, ...p }: any) => (
    <div style={getCommonStyles(p)} className="w-full bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col gap-8">
      <h2 className="text-2xl font-black text-white uppercase italic mb-2 text-center">{title || 'Gestión de Citas'}</h2>
      <div className="grid grid-cols-7 gap-2 opacity-50">{[...Array(28)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">{i+1}</div>)}</div>
      <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg">Confirmar Reserva</button>
    </div>
  )
};

export const CraftRenderer = ({ json }: { json: any }) => {
  if (!json) return null;
  const nodes = typeof json === 'string' ? JSON.parse(json) : json;
  const renderNode = (nodeId: string): React.ReactNode => {
    const node = nodes[nodeId];
    if (!node) return null;
    const ComponentName = node.type.resolvedName;
    const Component = Components[ComponentName];
    if (!Component) return null;
    const children = (node.nodes || []).map((id: string) => renderNode(id));
    return <Component key={nodeId} {...node.props}>{children}</Component>;
  };
  return <div className="antialiased bg-[#050505] min-h-screen text-white">{renderNode('ROOT')}</div>;
};
