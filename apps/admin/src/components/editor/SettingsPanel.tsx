import React from 'react';
import { useEditor } from '@craftjs/core';

export const SettingsPanel = () => {
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
        props: state.nodes[currentNodeId].data.props,
      };
    }

    return {
      selected,
      isEnabled: state.options.enabled,
    };
  });

  if (!isEnabled || !selected) return (
    <div className="h-full flex items-center justify-center p-10 text-center text-white/10 italic text-[10px] uppercase tracking-widest font-black">
      Selecciona un elemento para configurar sus parámetros
    </div>
  );

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-black italic uppercase tracking-tighter text-blue-500">Inspector_</h2>
        <span className="text-[10px] font-black text-white/20 bg-white/5 px-3 py-1 rounded-full">{selected.name}</span>
      </div>

      <div className="space-y-8">
        {/* Renderizado dinámico de props según el componente */}
        {Object.keys(selected.props).map((propKey) => {
          const value = selected.props[propKey];

          return (
            <div key={propKey}>
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3 block italic">{propKey}</label>
              
              {typeof value === 'number' ? (
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={value} 
                  onChange={(e) => actions.setProp(selected.id, (props: any) => props[propKey] = parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              ) : propKey.toLowerCase().includes('color') || propKey.toLowerCase().includes('bg') ? (
                <div className="flex gap-4">
                  <input 
                    type="color" 
                    value={value} 
                    onChange={(e) => actions.setProp(selected.id, (props: any) => props[propKey] = e.target.value)}
                    className="w-12 h-12 rounded-lg bg-transparent border-none"
                  />
                  <input 
                    className="flex-1 bg-white/5 border border-white/5 p-3 rounded-xl outline-none focus:border-blue-500 font-bold uppercase text-[10px]"
                    value={value}
                    onChange={(e) => actions.setProp(selected.id, (props: any) => props[propKey] = e.target.value)}
                  />
                </div>
              ) : (
                <input 
                  className="w-full bg-white/5 border border-white/5 p-4 rounded-xl outline-none focus:border-blue-500 font-bold"
                  value={value}
                  onChange={(e) => actions.setProp(selected.id, (props: any) => props[propKey] = e.target.value)}
                />
              )}
            </div>
          );
        })}

        {selected.isDeletable && (
          <button 
            onClick={() => actions.deserialize(selected.id)} // Simulación de borrado (ajustar luego)
            className="w-full py-4 bg-red-500/10 text-red-500 rounded-xl font-black uppercase text-[10px] tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all mt-10"
          >
            Eliminar Componente
          </button>
        )}
      </div>
    </div>
  );
};
