import React from 'react';
import { useEditor } from '@craftjs/core';
import { 
  Type, 
  Maximize, 
  Square, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  ChevronDown,
  Trash2
} from 'lucide-react';

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

  if (!isEnabled || !selected) return (
    <div className="h-full flex items-center justify-center p-10 text-center text-white/10 italic text-[10px] uppercase tracking-[0.5em] font-black">
      Selecciona un elemento para configurar el sistema
    </div>
  );

  const setProp = (prop: string, value: any) => {
    actions.setProp(selected.id, (props: any) => props[prop] = value);
  };

  const ControlGroup = ({ title, icon: Icon, children }: any) => (
    <div className="border-b border-white/5 p-8">
      <div className="flex items-center gap-3 mb-8 opacity-40">
        <Icon size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-[#0f121d]">
      <header className="p-8 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 italic">Propiedades_</h2>
        <span className="text-[9px] font-black bg-white/5 px-3 py-1 rounded-full uppercase">{selected.name}</span>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* TIPOGRAFÍA */}
        {selected.props.text !== undefined && (
          <ControlGroup title="Tipografía" icon={Type}>
             <div>
              <label className="text-[9px] font-bold text-white/20 uppercase mb-3 block">Contenido</label>
              <textarea 
                className="w-full bg-white/5 border border-white/5 p-4 rounded-xl outline-none focus:border-blue-500 font-medium text-sm text-white h-24"
                value={selected.props.text}
                onChange={(e) => setProp('text', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold text-white/20 uppercase mb-3 block">Tamaño</label>
                <input type="number" className="w-full bg-white/5 border border-white/5 p-3 rounded-lg text-xs" value={selected.props.fontSize} onChange={e => setProp('fontSize', e.target.value)} />
              </div>
              <div>
                <label className="text-[9px] font-bold text-white/20 uppercase mb-3 block">Fuente</label>
                <select className="w-full bg-white/5 border border-white/5 p-3 rounded-lg text-xs" value={selected.props.fontType} onChange={e => setProp('fontType', e.target.value)}>
                  <option value="sans">SANS</option>
                  <option value="serif">SERIF</option>
                  <option value="mono">MONO</option>
                  <option value="display">DISPLAY</option>
                </select>
              </div>
            </div>

            <div className="flex bg-white/5 p-1 rounded-xl gap-1">
               <button onClick={() => setProp('textAlign', 'left')} className={`flex-1 p-2 rounded-lg ${selected.props.textAlign === 'left' ? 'bg-blue-600' : 'hover:bg-white/5'}`}><AlignLeft size={14} /></button>
               <button onClick={() => setProp('textAlign', 'center')} className={`flex-1 p-2 rounded-lg ${selected.props.textAlign === 'center' ? 'bg-blue-600' : 'hover:bg-white/5'}`}><AlignCenter size={14} /></button>
               <button onClick={() => setProp('textAlign', 'right')} className={`flex-1 p-2 rounded-lg ${selected.props.textAlign === 'right' ? 'bg-blue-600' : 'hover:bg-white/5'}`}><AlignRight size={14} /></button>
               <button onClick={() => setProp('textAlign', 'justify')} className={`flex-1 p-2 rounded-lg ${selected.props.textAlign === 'justify' ? 'bg-blue-600' : 'hover:bg-white/5'}`}><AlignJustify size={14} /></button>
            </div>
          </ControlGroup>
        )}

        {/* COLORES */}
        <ControlGroup title="Colores & Fondo" icon={Palette}>
           <div className="grid grid-cols-2 gap-4">
              {selected.props.color && (
                <div>
                  <label className="text-[9px] font-bold text-white/20 uppercase mb-3 block">Texto</label>
                  <input type="color" className="w-full h-10 rounded-lg bg-transparent cursor-pointer" value={selected.props.color} onChange={e => setProp('color', e.target.value)} />
                </div>
              )}
              <div>
                <label className="text-[9px] font-bold text-white/20 uppercase mb-3 block">Fondo</label>
                <input type="color" className="w-full h-10 rounded-lg bg-transparent cursor-pointer" value={selected.props.background || selected.props.bgColor} onChange={e => setProp(selected.props.background ? 'background' : 'bgColor', e.target.value)} />
              </div>
           </div>
        </ControlGroup>

        {/* ESPACIADO (PADDING) */}
        <ControlGroup title="Espaciado (Padding)" icon={Maximize}>
           <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {['T', 'B', 'L', 'R'].map(dir => (
                <div key={dir}>
                  <label className="text-[9px] font-bold text-white/20 uppercase mb-2 block">{dir === 'T' ? 'Arriba' : dir === 'B' ? 'Abajo' : dir === 'L' ? 'Izq' : 'Der'}</label>
                  <input type="number" className="w-full bg-white/5 border border-white/5 p-3 rounded-lg text-xs" value={selected.props[`padding${dir}`] || 0} onChange={e => setProp(`padding${dir}`, parseInt(e.target.value))} />
                </div>
              ))}
           </div>
        </ControlGroup>

        {/* BORDES & SOMBRAS */}
        <ControlGroup title="Bordes & Sombras" icon={Square}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold text-white/20 uppercase mb-3 block">Grosor</label>
                <input type="number" className="w-full bg-white/5 border border-white/5 p-3 rounded-lg text-xs" value={selected.props.borderWidth || 0} onChange={e => setProp('borderWidth', parseInt(e.target.value))} />
              </div>
              <div>
                <label className="text-[9px] font-bold text-white/20 uppercase mb-3 block">Radio</label>
                <input type="number" className="w-full bg-white/5 border border-white/5 p-3 rounded-lg text-xs" value={selected.props.borderRadius} onChange={e => setProp('borderRadius', parseInt(e.target.value))} />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-bold text-white/20 uppercase mb-3 block">Sombra</label>
              <select className="w-full bg-white/5 border border-white/5 p-3 rounded-lg text-xs" value={selected.props.shadow || 'none'} onChange={e => setProp('shadow', e.target.value)}>
                <option value="none">NINGUNA</option>
                <option value="soft">SUAVE</option>
                <option value="medium">MEDIA</option>
                <option value="intense">INTENSA</option>
              </select>
            </div>
        </ControlGroup>
      </div>

      <footer className="p-8 border-t border-white/5">
        {selected.isDeletable && (
          <button 
            onClick={() => actions.delete(selected.id)}
            className="w-full py-4 bg-red-500/5 text-red-500 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-red-500/10 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={14} /> Eliminar Componente
          </button>
        )}
      </footer>
    </div>
  );
};
