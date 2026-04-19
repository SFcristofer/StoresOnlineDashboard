import React from 'react';

const Hero = ({ data }: any) => (
  <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent"></div>
    <div className="relative z-10 text-center px-6">
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 uppercase italic">
        Future_<span className="text-blue-500">Service</span>
      </h1>
      <p className="text-white/40 text-lg font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto">
        Experiencias industriales de nueva generación para negocios visionarios.
      </p>
      <button className="mt-12 bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
        Explorar Ahora
      </button>
    </div>
  </section>
);

const Features = ({ data }: any) => (
  <section className="py-32 bg-[#0a0c14] px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#141824] p-10 rounded-[40px] border border-white/5 hover:border-blue-500/50 transition-all">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mb-8 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">0{i}</div>
          <h3 className="text-2xl font-black text-white uppercase italic mb-4">Servicio_Premium</h3>
          <p className="text-white/40 text-sm leading-relaxed">Implementación de flujos de trabajo automatizados con tecnología de vanguardia.</p>
        </div>
      ))}
    </div>
  </section>
);

const Pricing = ({ data }: any) => (
  <section className="py-32 bg-black px-6">
    <div className="max-w-4xl mx-auto bg-[#141824] border border-white/10 rounded-[50px] p-12 md:p-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px]"></div>
      <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic mb-12 text-center">Plan_Inversión</h2>
      <div className="space-y-6">
        {['Básico', 'Pro', 'Enterprise'].map((plan) => (
          <div key={plan} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
            <span className="text-lg font-bold text-white uppercase tracking-widest">{plan}</span>
            <span className="text-blue-500 font-black text-xl">$99<small className="text-[10px] text-white/20">/MES</small></span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section className="py-32 bg-[#0a0c14] px-6">
    <div className="max-w-xl mx-auto text-center">
      <h2 className="text-4xl font-black text-white uppercase italic mb-8">Contacto_Directo</h2>
      <form className="space-y-4">
        <input className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl outline-none focus:border-blue-500 text-white font-bold" placeholder="TU EMAIL" />
        <textarea className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl outline-none focus:border-blue-500 text-white font-bold h-32" placeholder="MENSAJE" />
        <button className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Enviar Transmisión</button>
      </form>
    </div>
  </section>
);

export const BlockRenderer = ({ blocks }: { blocks: any[] }) => {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.id) {
          case 'hero': return <Hero key={index} data={block} />;
          case 'features': return <Features key={index} data={block} />;
          case 'pricing': return <Pricing key={index} data={block} />;
          case 'contact': return <Contact key={index} />;
          default: return null;
        }
      })}
    </>
  );
};
