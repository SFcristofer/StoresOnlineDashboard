import React from 'react';

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

const Components: Record<string, React.FC<any>> = {
  Section: ({ children, ...props }: any) => (
    <section style={getCommonStyles(props)} className="w-full relative">
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  ),
  Grid: ({ children, cols, gap, ...props }: any) => (
    <div style={{ ...getCommonStyles(props), display: 'grid', gridTemplateColumns: `repeat(${cols || 1}, minmax(0, 1fr))`, gap: `${gap || 20}px` }} className="w-full">{children}</div>
  ),
  Box: ({ children, ...props }: any) => (
    <div style={{...getCommonStyles(props), display: 'flex', flexDirection: 'column', gap: '15px'}} className="w-full">{children}</div>
  ),
  Text: ({ text, fontSize, color, bold, textAlign, ...props }: any) => (
    <div style={getCommonStyles(props)} className="w-full">
      <p style={{ fontSize: `${fontSize}px`, color: color || '#fff', fontWeight: bold ? '800' : '400', textAlign: textAlign || 'left', lineHeight: '1.4' }}>{text}</p>
    </div>
  ),
  Button: ({ text, bgColor, color, ...props }: any) => (
    <div style={getCommonStyles(props)} className="inline-block">
      <button style={{ backgroundColor: bgColor || '#fff', color: color || '#000' }} className="px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl">{text}</button>
    </div>
  ),
  Image: ({ src, height, ...props }: any) => (
    <div style={{...getCommonStyles(props), height: `${height || 300}px`, overflow: 'hidden' }} className="w-full bg-[#111] border border-white/5">
      <img src={src || 'https://images.unsplash.com/photo-1634017831461-452137a2701d?q=80&w=800'} className="w-full h-full object-cover" alt="Visual" />
    </div>
  ),
  Video: ({ url, ...props }: any) => (
    <div style={getCommonStyles(props)} className="w-full aspect-video overflow-hidden border border-white/10 shadow-2xl bg-black">
      <iframe src={url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'} className="w-full h-full" frameBorder="0" allowFullScreen />
    </div>
  ),
  Carousel: ({ children, height, ...props }: any) => (
    <div style={{ ...getCommonStyles(props), height: `${height || 400}px` }} className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar">
      {React.Children.map(children, child => <div className="snap-center shrink-0 min-w-[80vw] md:min-w-[40vw] lg:min-w-[30vw] h-full">{child}</div>)}
    </div>
  ),
  ServiceCard: ({ title, price, desc, ...props }: any) => (
    <div style={getCommonStyles(props)} className="bg-[#111] border border-white/5 p-8 rounded-3xl w-full hover:border-blue-500/30 transition-all">
      <h3 className="text-xl font-bold text-white uppercase italic mb-1">{title || 'Servicio'}</h3>
      <p className="text-blue-500 font-black text-lg mb-4">${price || '0'}</p>
      <p className="text-white/40 text-[11px] leading-relaxed mb-8">{desc || 'Descripción...'}</p>
      <button className="w-full py-4 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest">Reservar_Cita</button>
    </div>
  ),
  BookingSystem: ({ title, ...props }: any) => (
    <div style={getCommonStyles(props)} className="w-full bg-[#0a0a0a] border border-white/5 rounded-[40px] p-12 shadow-2xl">
      <h2 className="text-2xl font-black text-white uppercase italic mb-8 text-center">{title || 'Calendario'}</h2>
      <div className="grid grid-cols-7 gap-2 mb-8">
        {[...Array(28)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">{i+1}</div>)}
      </div>
      <button className="w-full py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">Confirmar_Reserva_Cita</button>
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
