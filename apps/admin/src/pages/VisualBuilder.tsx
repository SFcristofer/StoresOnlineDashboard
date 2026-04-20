import React, { useState, useEffect } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { supabase } from '../lib/supabase';
import { Section, Grid, Box, Text, Button, Image, Video, Carousel, ServiceCard, HeroBlock, FeaturesBlock } from '../components/editor/UserComponents';
import { SettingsPanel } from '../components/editor/SettingsPanel';
import { AIGenerator } from '../components/editor/AIGenerator';
import { MediaPicker } from '../components/editor/MediaPicker';
import { 
  Type, ImageIcon, MousePointer2, Save, ArrowLeft, Loader2, 
  Layers, Columns, Monitor, Smartphone, LayoutGrid, Box as BoxIcon, Briefcase, GalleryHorizontal,
  Undo2, Redo2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Tenant {
  id: string;
  name: string;
  site_config: {
    craft?: string;
    [key: string]: any;
  };
}

const HistoryControls = () => {
  const { canUndo, canRedo, actions } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  return (
    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
      <button onClick={() => actions.history.undo()} disabled={!canUndo} className={`p-1.5 rounded ${canUndo ? 'hover:bg-white/10 text-white' : 'text-white/10 cursor-not-allowed'}`}><Undo2 size={16} /></button>
      <button onClick={() => actions.history.redo()} disabled={!canRedo} className={`p-1.5 rounded ${canRedo ? 'hover:bg-white/10 text-white' : 'text-white/10 cursor-not-allowed'}`}><Redo2 size={16} /></button>
    </div>
  );
};

const Toolbox = () => {
  const { connectors } = useEditor();
  return (
    <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col shrink-0 z-20">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 italic">Laboratorio_</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <section className="space-y-2">
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-1 mb-3">Estructura</p>
          <div ref={(ref:any) => connectors.create(ref, <Element is={Section} canvas />)} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/50 hover:bg-blue-600/5 cursor-grab flex items-center gap-3 group transition-all">
            <BoxIcon size={16} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">Sección</span>
          </div>
          <div ref={(ref:any) => connectors.create(ref, <Element is={Grid} cols={2} canvas><Element is={Box} canvas /><Element is={Box} canvas /></Element>)} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/50 hover:bg-blue-600/5 cursor-grab flex items-center gap-3 group transition-all">
            <Columns size={16} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">2_Columnas</span>
          </div>
          <div ref={(ref:any) => connectors.create(ref, <Element is={Box} canvas />)} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/50 hover:bg-blue-600/5 cursor-grab flex items-center gap-3 group transition-all">
            <LayoutGrid size={16} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">Contenedor</span>
          </div>
        </section>
        <section className="space-y-2">
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-1 mb-3">Contenido</p>
          <div ref={(ref:any) => connectors.create(ref, <Text text="Nuevo_Texto" fontSize={32} />)} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/50 hover:bg-blue-600/5 cursor-grab flex items-center gap-3 group transition-all">
            <Type size={16} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">Texto_Industrial</span>
          </div>
          <div ref={(ref:any) => connectors.create(ref, <Button text="Ejecutar_Acción" />)} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/50 hover:bg-blue-600/5 cursor-grab flex items-center gap-3 group transition-all">
            <MousePointer2 size={16} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">Botón_Pro</span>
          </div>
          <div ref={(ref:any) => connectors.create(ref, <Image />)} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/50 hover:bg-blue-600/5 cursor-grab flex items-center gap-3 group transition-all">
            <ImageIcon size={16} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">Imagen_Asset</span>
          </div>
        </section>
        <section className="space-y-2">
          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] ml-1 mb-3">Arquitectura</p>
          <div ref={(ref:any) => connectors.create(ref, <HeroBlock title="SISTEMA_STUDIO" subtitle="Diseño de alta fidelidad." buttonText="INICIAR" />)} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/50 hover:bg-blue-600/5 cursor-grab flex items-center gap-3 group transition-all">
            <Layers size={16} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">Bloque_Hero</span>
          </div>
        </section>
      </div>
    </aside>
  );
};

const PropUpdater = () => {
  const { actions, selectedNodeId } = useEditor((state) => ({
    selectedNodeId: state.events.selected.size > 0 ? Array.from(state.events.selected)[0] : null
  }));

  useEffect(() => {
    if (selectedNodeId) {
      (window as any).setProp = (prop: string, value: any) => {
        actions.setProp(selectedNodeId as string, (props: any) => {
          props[prop] = value;
        });
      };
    }
  }, [selectedNodeId, actions]);

  return null;
};

const VisualBuilder: React.FC<VisualBuilderProps> = ({ tenant, onBack }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [globalTheme, setGlobalTheme] = useState(tenant.site_config?.theme || { primaryColor: '#2563eb', backgroundColor: '#050505', textColor: '#ffffff', borderRadius: 12 });
  const [mediaPicker, setMediaPicker] = useState<{ isOpen: boolean; onSelect: (url: string) => void } | null>(null);

  useEffect(() => {
    (window as any).openMediaPicker = (onSelect: (url: string) => void) => {
      setMediaPicker({ isOpen: true, onSelect });
    };
  }, []);

  const saveConfig = async (json: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('tenants').update({ site_config: { ...tenant.site_config, craft: json, theme: globalTheme } }).eq('id', tenant.id);
      if (error) throw error;
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) { setSaveStatus('error'); } finally { setIsSaving(false); }
  };

  return (
    <Editor resolver={{ Section, Grid, Box, Text, Button, Image, Video, Carousel, ServiceCard, HeroBlock, FeaturesBlock, Element }}>
      <div className="h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden antialiased">
        <PropUpdater />
        <AIGenerator tenantId={tenant.id} />
        {mediaPicker?.isOpen && <MediaPicker tenantId={tenant.id} onClose={() => setMediaPicker(null)} onSelect={(url) => { mediaPicker.onSelect(url); setMediaPicker(null); }} />}
        
        <style dangerouslySetInnerHTML={{ __html: `
          .craft-selected-node { outline: 2px solid #2563eb !important; outline-offset: -2px; }
        `}} />

        <header className="h-14 border-b border-white/5 px-6 flex justify-between items-center bg-[#0a0a0a] z-50">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg text-white/40 transition-colors hover:text-white"><ArrowLeft size={18} /></button>
            <HistoryControls />
            <div className="h-4 w-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">Studio_Engine <span className="text-blue-500">/</span> {tenant.name}</span>
          </div>

          <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
             <button onClick={() => setViewMode('desktop')} className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-2 ${viewMode === 'desktop' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}><Monitor size={14} /><span className="text-[9px] font-black uppercase">Desktop</span></button>
             <button onClick={() => setViewMode('mobile')} className={`px-4 py-1.5 rounded-md transition-all flex items-center gap-2 ${viewMode === 'mobile' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}><Smartphone size={14} /><span className="text-[9px] font-black uppercase">Mobile</span></button>
          </div>

          <PublishButton onSave={saveConfig} isSaving={isSaving} saveStatus={saveStatus} />
        </header>

        <div className="flex-1 flex overflow-hidden">
          <Toolbox />
          <main className="flex-1 overflow-y-auto p-12 flex justify-center bg-[#080808] bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] custom-scrollbar">
            <motion.div 
              animate={{ width: viewMode === 'mobile' ? '375px' : '100%', maxWidth: viewMode === 'mobile' ? '375px' : '1200px' }}
              className="bg-black shadow-[0_0_100px_rgba(0,0,0,0.5)] min-h-[85vh] h-fit overflow-hidden"
              style={{ backgroundColor: globalTheme.backgroundColor }}
            >
              <Frame>
                <Element is={Section} canvas>
                  <HeroBlock title="STUDIO_V1" subtitle="SISTEMA_OPERATIVO_LISTO" buttonText="INICIAR" />
                </Element>
              </Frame>
            </motion.div>
          </main>
          <aside className="w-80 border-l border-white/5 bg-[#0a0a0a] shrink-0 overflow-y-auto shadow-2xl z-20">
            <SettingsPanel theme={globalTheme} setTheme={setGlobalTheme} />
          </aside>
        </div>
      </div>
    </Editor>
  );
};

const PublishButton = ({ onSave, isSaving, saveStatus }: any) => {
  const { query } = useEditor();
  return (
    <button onClick={() => onSave(query.serialize())} disabled={isSaving} className="bg-blue-600 px-8 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
      {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
      {saveStatus === 'success' ? 'GUARDADO!' : 'PUBLICAR_SISTEMA'}
    </button>
  );
};

export default VisualBuilder;
