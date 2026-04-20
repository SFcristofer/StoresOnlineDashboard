import React from 'react';

const Components: Record<string, React.FC<any>> = {
  Section: ({ children, background, paddingT, paddingB }: any) => (
    <section style={{ backgroundColor: background || '#050505', padding: `${paddingT || 80}px 24px ${paddingB || 80}px` }} className="w-full relative">
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  ),
  Row: ({ children, gap }: any) => (
    <div style={{ gap: `${gap || 32}px` }} className="flex flex-col md:flex-row w-full">{children}</div>
  ),
  Column: ({ children, width, paddingT, paddingB, paddingL, paddingR }: any) => (
    <div style={{ flex: width || 1, padding: `${paddingT || 0}px ${paddingR || 0}px ${paddingB || 0}px ${paddingL || 0}px`, display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {children}
    </div>
  ),
  ServiceCard: ({ title, price, desc, image }: any) => (
    <div className="bg-[#111] border border-white/5 p-6 rounded-[32px] overflow-hidden group hover:border-blue-500/50 transition-all shadow-2xl w-full">
      <div className="h-48 bg-[#1a1a1a] rounded-2xl mb-6 overflow-hidden">
        <img src={image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Service" />
      </div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">{title}</h3>
        <span className="text-blue-500 font-black tracking-tighter text-lg">${price}</span>
      </div>
      <p className="text-white/40 text-[11px] leading-relaxed mb-6">{desc}</p>
      <button className="w-full py-4 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-colors">Reservar_Cita</button>
    </div>
  ),
  BookingSystem: ({ title }: any) => (
    <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 shadow-2xl">
      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-7 gap-1 mb-8 opacity-50">
        {[...Array(31)].map((_, i) => (
          <div key={i} className={`h-10 rounded-lg flex items-center justify-center text-[9px] font-bold ${i === 14 ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40'}`}>{i + 1}</div>
        ))}
      </div>
      <div className="space-y-4">
         <div className="grid grid-cols-2 gap-3">
            {['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM'].map(t => (
              <div key={t} className="py-3 bg-white/5 border border-white/5 rounded-xl text-center text-[10px] font-bold text-white hover:bg-blue-600 transition-all cursor-pointer">{t}</div>
            ))}
         </div>
         <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">Confirmar_Reserva</button>
      </div>
    </div>
  ),
  Text: ({ text, fontSize, color, bold, textAlign }: any) => (
    <p style={{ fontSize: `${fontSize || 16}px`, color: color || '#ffffff', fontWeight: bold ? '900' : '400', textAlign: textAlign || 'left', lineHeight: '1.2' }} className="uppercase tracking-tighter italic break-words">
      {text}
    </p>
  ),
  Button: ({ text }: any) => (
    <button className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">
      {text}
    </button>
  ),
  Image: ({ src, height, borderRadius }: any) => (
    <div style={{ height: `${height || 300}px`, borderRadius: `${borderRadius || 24}px` }} className="w-full overflow-hidden border border-white/5 shadow-2xl my-4">
      <img src={src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" alt="Visual" />
    </div>
  ),
  Carousel: ({ children, height }: any) => (
    <div style={{ height: `${height || 400}px` }} className="w-full flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 custom-scrollbar">
      {React.Children.map(children, child => (
        <div className="snap-center shrink-0 min-w-[80vw] md:min-w-[40vw] lg:min-w-[30vw] h-full">
          {child}
        </div>
      ))}
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
