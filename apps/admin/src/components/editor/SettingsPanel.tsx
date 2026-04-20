import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { 
  Palette, Maximize, Settings, Trash2, AlignLeft, AlignCenter, AlignRight, 
  Smartphone, Monitor, ChevronRight
} from 'lucide-react';

const ControlGroup = ({ title, children }: any) => (
  <div className="space-y-4 border-b border-white/5 pb-8 mb-8">
    <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] italic">{title}_</p>
    {children}
  </div>
);

const PropertyInput = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-2">
    <label className="text-[8px] font-black text-white/30 uppercase tracking-widest">{label}</label>
    {type === "textarea" ? (
      <textarea 
        className="w-full bg-white/[0.02] border border-white/10 p-3 rounded-lg text-xs text-white outline-none focus:border-blue-500 resize-none h-24"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input 
        type={type}
        className="w-full bg-white/[0.02] border border-white/10 p-3 rounded-lg text-xs text-white outline-none focus:border-blue-500"
        value={value || ''}
        onChange={(e) => onChange(type === "number" ? parseInt(e.target.value) : e.target.value)}
      />
    )}
  </div>
);

export const SettingsPanel = ({ theme, setTheme }: { theme?: any, setTheme?: any }) => {
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected;
    let selected;
    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.displayName || state.nodes[currentNodeId].data.name,
        props: state.nodes[currentNodeId].data.props,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }
    return { selected, isEnabled: state.options.enabled };
  });

  if (!selected) return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
       <header className="p-8 border-b border-white/5">
        <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 italic">Global_Control</h2>
        <p className="text-2xl font-black italic text-white uppercase tracking-tighter">Site Theme</p>
      </header>
      <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
        <ControlGroup title="Colores_Maestros">
          <PropertyInput type="color" label="Color Primario" value={theme?.primaryColor} onChange={(v:any) => setTheme({...theme, primaryColor: v})} />
          <PropertyInput type="color" label="Fondo Global" value={theme?.backgroundColor} onChange={(v:any) => setTheme({...theme, backgroundColor: v})} />
          <PropertyInput type="color" label="Texto Global" value={theme?.textColor} onChange={(v:any) => setTheme({...theme, textColor: v})} />
        </ControlGroup>
        <ControlGroup title="Geometría">
          <PropertyInput type="number" label="Radio de Bordes (PX)" value={theme?.borderRadius} onChange={(v:any) => setTheme({...theme, borderRadius: v})} />
        </ControlGroup>
      </div>
    </div>
  );

  const setProp = (prop: string, value: any) => {
    actions.setProp(selected.id, (props: any) => props[prop] = value);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] animate-in slide-in-from-right duration-300">
      <header className="p-8 border-b border-white/10 bg-blue-600/5">
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Editando_Nodo</span>
           </div>
           {selected.isDeletable && (
             <button onClick={() => actions.delete(selected.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
           )}
        </div>
        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter truncate">{selected.name}</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-2 custom-scrollbar pb-32">
        {/* EDITAR TEXTOS (DINÁMICO) */}
        <ControlGroup title="Contenido_Visual">
          {selected.props.text !== undefined && <PropertyInput type="textarea" label="Texto Principal" value={selected.props.text} onChange={(v:any) => setProp('text', v)} />}
          {selected.props.title !== undefined && <PropertyInput type="text" label="Título" value={selected.props.title} onChange={(v:any) => setProp('title', v)} />}
          {selected.props.subtitle !== undefined && <PropertyInput type="textarea" label="Subtítulo" value={selected.props.subtitle} onChange={(v:any) => setProp('subtitle', v)} />}
          {selected.props.buttonText !== undefined && <PropertyInput type="text" label="Texto Botón" value={selected.props.buttonText} onChange={(v:any) => setProp('buttonText', v)} />}
        </ControlGroup>

        {/* TIPOGRAFÍA Y ESTILO */}
        {(selected.props.fontSize !== undefined || selected.props.background !== undefined) && (
          <ControlGroup title="Apariencia_Tecnica">
            {selected.props.fontSize !== undefined && <PropertyInput type="number" label="Tamaño Fuente" value={selected.props.fontSize} onChange={(v:any) => setProp('fontSize', v)} />}
            {selected.props.background !== undefined && <PropertyInput type="color" label="Color Fondo" value={selected.props.background} onChange={(v:any) => setProp('background', v)} />}
            {selected.props.color !== undefined && <PropertyInput type="color" label="Color Texto" value={selected.props.color} onChange={(v:any) => setProp('color', v)} />}
            {selected.props.borderRadius !== undefined && <PropertyInput type="number" label="Bordes (PX)" value={selected.props.borderRadius} onChange={(v:any) => setProp('borderRadius', v)} />}
          </ControlGroup>
        )}

        {/* ESPACIADO (PADDING/MARGIN) */}
        <ControlGroup title="Arquitectura_Espacial">
           <div className="grid grid-cols-2 gap-4">
              <PropertyInput type="number" label="Padding Top" value={selected.props.paddingTop || selected.props.padding || 0} onChange={(v:any) => setProp('paddingTop', v)} />
              <PropertyInput type="number" label="Padding Bottom" value={selected.props.paddingBottom || selected.props.padding || 0} onChange={(v:any) => setProp('paddingBottom', v)} />
              <PropertyInput type="number" label="Margin Top" value={selected.props.marginTop || selected.props.margin || 0} onChange={(v:any) => setProp('marginTop', v)} />
              <PropertyInput type="number" label="Margin Bottom" value={selected.props.marginBottom || selected.props.margin || 0} onChange={(v:any) => setProp('marginBottom', v)} />
           </div>
        </ControlGroup>
      </div>
    </div>
  );
};
