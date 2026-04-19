import React from 'react';

const Hero = ({ data }: any) => (
  <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white px-6">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent"></div>
    <div className="relative z-10 text-center">
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 uppercase italic">
        {data.title || 'FUTURE_SERVICE'}
      </h1>
      <p className="text-white/40 text-lg font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto mb-12">
        {data.subtitle || 'Experiencias industriales de nueva generación.'}
      </p>
      {data.buttonText && (
        <button className="bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
          {data.buttonText}
        </button>
      )}
    </div>
  </section>
);

const Features = ({ data }: any) => (
  <section className="py-32 bg-[#0a0c14] px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      {(data.items || [1, 2, 3]).map((item: any, i: number) => (
        <div key={i} className="bg-[#141824] p-10 rounded-[40px] border border-white/5 hover:border-blue-500/50 transition-all">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mb-8 flex items-center justify-center text-white font-bold">
            0{i + 1}
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic mb-4">
            {item.title || 'Servicio_Premium'}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed">
            {item.desc || 'Implementación de flujos de trabajo automatizados.'}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const Pricing = ({ data }: any) => (
  <section className="py-32 bg-black px-6">
    <div className="max-w-4xl mx-auto bg-[#141824] border border-white/10 rounded-[50px] p-12 md:p-20 relative overflow-hidden">
      <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic mb-12 text-center">
        {data.title || 'PLAN_INVERSIÓN'}
      </h2>
      <div className="space-y-6">
        {(data.plans || ['Básico', 'Pro']).map((plan: any, i: number) => (
          <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
            <span className="text-lg font-bold text-white uppercase tracking-widest">
              {plan.name || plan}
            </span>
            <span className="text-blue-500 font-black text-xl">
              ${plan.price || '99'}<small className="text-[10px] text-white/20">/MES</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = ({ data }: any) => (
  <section className="py-32 bg-[#0a0c14] px-6">
    <div className="max-w-xl mx-auto text-center">
      <h2 className="text-4xl font-black text-white uppercase italic mb-8">
        {data.title || 'CONTACTO_DIRECTO'}
      </h2>
      <p className="text-blue-500 font-bold mb-10">{data.email}</p>
      <form className="space-y-4">
        <input className="w-full bg-white/5 border border-white/5 p-6 rounded-2xl outline-none focus:border-blue-500 text-white font-bold" placeholder="TU EMAIL" />
        <button className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all">
          Enviar Transmisión
        </button>
      </form>
    </div>
  </section>
);

export const BlockRenderer = ({ blocks }: { blocks: any[] }) => {
  return (
    <>
      {blocks.map((block, index) => {
        const blockData = block.data || {};
        switch (block.id) {
          case 'hero': return <Hero key={block.instanceId || index} data={blockData} />;
          case 'features': return <Features key={block.instanceId || index} data={blockData} />;
          case 'pricing': return <Pricing key={block.instanceId || index} data={blockData} />;
          case 'contact': return <Contact key={block.instanceId || index} data={blockData} />;
          default: return null;
        }
      })}
    </>
  );
};
