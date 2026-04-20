import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { Palette, Maximize, Settings, Trash2, MousePointer2, Droplets, Square } from 'lucide-react';

export const SettingsPanel = () => {
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;
    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.displayName || state.nodes[currentNodeId].data.name,
        isDeletable: query.node(currentNodeId).isDeletable(),
        props: state.nodes[currentNodeId].data.props,
      };
    }
    return { selected, isEnabled: state.options.enabled };
  });

  const [activeTab, setActiveTab] = useState('style');

  if (!isEnabled || !selected) return (
    <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30">
       <MousePointer2 size={32} className="mb-4" />
       <p className="text-xs font-black uppercase tracking-[0.3em]">Seleccionar_Elemento</p>
    </div>
  );

  const setProp = (prop: string, value: any) => {
    actions.setProp(selected.id, (props: any) => props[prop] = value);
  };

  const TabButton = ({ id, icon: Icon, label }: any) => (
    <button onClick={() => setActiveTab(id)} className={`flex-1 flex flex-col items-center gap-2 py-4 border-b-2 transition-all ${activeTab === id ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'border-transparent text-white/20'}`}>
      <Icon size={16} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      <header className="p-6 border-b border-white/5 bg-white/[0.01]">
        <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1 italic">Propiedades_</p>
        <p className="text-lg font-black italic uppercase text-white truncate">{selected.name}</p>
      </header>
      <div className="flex border-b border-white/5">
        <TabButton id="style" icon={Palette} label="Estilo" />
        <TabButton id="layout" icon={Maximize} label="Espacio" />
        <TabButton id="content" icon={Settings} label="Config" />
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
        {activeTab === 'style' && (
          <>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-white/40 uppercase mb-2 block font-black text-[9px]">Fondo</label>
                <input type="color" className="w-full h-10 rounded-xl bg-transparent border border-white/10 cursor-pointer" value={selected.props.background || '#000000'} onChange={e => setProp('background', e.target.value)} />
              </div>
              {selected.props.color && (
                <div>
                  <label className="text-white/40 uppercase mb-2 block font-black text-[9px]">Texto</label>
                  <input type="color" className="w-full h-10 rounded-xl bg-transparent border border-white/10 cursor-pointer" value={selected.props.color || '#ffffff'} onChange={e => setProp('color', e.target.value)} />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className="text-white/40 uppercase font-black text-[9px]">Redondeado</label>
                <span className="text-[10px] font-mono text-blue-500">{selected.props.borderRadius}px</span>
              </div>
              <input type="range" min="0" max="100" className="w-full accent-blue-600" value={selected.props.borderRadius || 0} onChange={e => setProp('borderRadius', parseInt(e.target.value))} />
            </div>
          </>
        )}
        {activeTab === 'layout' && (
           <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              {['T', 'B', 'L', 'R'].map(dir => (
                <div key={dir}>
                  <label className="text-white/40 uppercase mb-2 block font-black text-[9px]">Padding {dir}</label>
                  <input type="number" className="w-full bg-white/5 border border-white/5 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500" value={selected.props[`padding${dir}`] || 0} onChange={e => setProp(`padding${dir}`, parseInt(e.target.value))} />
                </div>
              ))}
           </div>
        )}
        {activeTab === 'content' && (
           <div className="space-y-8">
              {selected.props.text !== undefined && (
                <div>
                  <label className="text-white/40 uppercase mb-2 block font-black text-[9px]">Contenido</label>
                  <textarea className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-sm font-medium text-white h-40 outline-none focus:border-blue-500 resize-none" value={selected.props.text} onChange={(e) => setProp('text', e.target.value)} />
                </div>
              )}
              {selected.props.src !== undefined && (
                <div>
                  <label className="text-white/40 uppercase mb-2 block font-black text-[9px]">URL Imagen</label>
                  <input className="w-full bg-white/5 border border-white/5 p-3 rounded-xl text-xs text-white focus:border-blue-500 outline-none" value={selected.props.src} onChange={(e) => setProp('src', e.target.value)} />
                </div>
              )}
           </div>
        )}
      </div>
      <footer className="p-6 border-t border-white/5">
        {selected.isDeletable && (
          <button onClick={() => actions.delete(selected.id)} className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all border border-red-500/10 flex items-center justify-center gap-2">
            <Trash2 size={14} /> Eliminar_Componente
          </button>
        )}
      </footer>
    </div>
  );
};
