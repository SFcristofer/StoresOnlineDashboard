import React, { useState } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { supabase } from '../lib/supabase';
import { Section, Grid, Box, Text, Button, Image, Video, Carousel, ServiceCard, HeroBlock, FeaturesBlock } from '../components/editor/UserComponents';
import { SettingsPanel } from '../components/editor/SettingsPanel';
import { AIGenerator } from '../components/editor/AIGenerator';
import { 
  Type, ImageIcon, MousePointer2, Save, ArrowLeft, Loader2, 
  Layers, Columns, Monitor, Smartphone, Play, LayoutGrid, Box as BoxIcon, Calendar, Briefcase, GalleryHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, refProp }: any) => (
  <div ref={refProp} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-blue-600/5 cursor-grab flex flex-col items-center justify-center gap-2.5 group transition-all">
    <div className="text-white/40 group-hover:text-blue-500 transition-colors"><Icon size={20} /></div>
    <span className="text-xs font-bold uppercase tracking-tight opacity-50 group-hover:opacity-100 text-center leading-none">{label}</span>
  </div>
);

const Toolbox = () => {
  const { connectors } = useEditor();
  return (
    <aside className="w-72 border-r border-white/5 bg-[#0a0a0a] flex flex-col shrink-0 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
        <h2 className="text-sm font-black uppercase tracking-widest text-white/60">HERRAMIENTAS</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
        <section>
          <p className="text-[10px] font-black text-blue-500 uppercase mb-4 tracking-widest italic opacity-50">Estructuras_</p>
          <div className="grid grid-cols-2 gap-3">
            <SidebarItem icon={BoxIcon} label="Sección" refProp={(ref: any) => connectors.create(ref, <Element is={Section} canvas />)} />
            <SidebarItem icon={Columns} label="2 Cols" refProp={(ref: any) => connectors.create(ref, <Element is={Grid} cols={2} canvas><Element is={Box} canvas /><Element is={Box} canvas /></Element>)} />
            <SidebarItem icon={LayoutGrid} label="Grilla 3" refProp={(ref: any) => connectors.create(ref, <Element is={Grid} cols={3} canvas><Element is={Box} canvas /><Element is={Box} canvas /><Element is={Box} canvas /></Element>)} />
            <SidebarItem icon={GalleryHorizontal} label="Carrusel" refProp={(ref: any) => connectors.create(ref, <Element is={Carousel} canvas />)} />
          </div>
        </section>

        <section>
          <p className="text-[10px] font-black text-blue-500 uppercase mb-4 tracking-widest italic opacity-50">Átomos_</p>
          <div className="grid grid-cols-2 gap-3">
            <SidebarItem icon={Type} label="Texto" refProp={(ref: any) => connectors.create(ref, <Text text="Nuevo Título" fontSize={32} bold={true} />)} />
            <SidebarItem icon={MousePointer2} label="Botón" refProp={(ref: any) => connectors.create(ref, <Button text="Acción" />)} />
            <SidebarItem icon={ImageIcon} label="Imagen" refProp={(ref: any) => connectors.create(ref, <Image />)} />
            <SidebarItem icon={Play} label="Video" refProp={(ref: any) => connectors.create(ref, <Video />)} />
          </div>
        </section>

        <section>
          <p className="text-[10px] font-black text-blue-500 uppercase mb-4 tracking-widest italic opacity-50">Funciones_</p>
          <div className="grid grid-cols-2 gap-3">
            <SidebarItem icon={Briefcase} label="Servicio" refProp={(ref: any) => connectors.create(ref, <ServiceCard title="Servicio Elite" price="25" />)} />
            <SidebarItem icon={Layers} label="Hero" refProp={(ref: any) => connectors.create(ref, <HeroBlock title="Título Principal" subtitle="Subtítulo persuasivo" />)} />
            <SidebarItem icon={LayoutGrid} label="Features" refProp={(ref: any) => connectors.create(ref, <FeaturesBlock title="Características" />)} />
          </div>
        </section>
      </div>
    </aside>
  );
};

const VisualBuilder: React.FC<{ tenant: any, onBack: () => void }> = ({ tenant, onBack }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const saveConfig = async (query: any) => {
    setIsSaving(true);
    const json = query.serialize();
    await supabase.from('tenants').update({ site_config: { craft: json } }).eq('id', tenant.id);
    alert("Diseño Guardado.");
    setIsSaving(false);
  };

  return (
    <Editor resolver={{ 
      Section, Grid, Box, Text, Button, Image, Video, Carousel, ServiceCard, HeroBlock, FeaturesBlock, Element 
    }}>
      <div className="h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden antialiased">
        <AIGenerator tenantId={tenant.id} />
        <header className="h-16 border-b border-white/5 px-8 flex justify-between items-center bg-[#0a0a0a] shrink-0 z-50 shadow-2xl">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2.5 hover:bg-white/5 rounded-xl transition-all border border-white/5"><ArrowLeft size={20} /></button>
            <div className="h-6 w-px bg-white/10" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-white/40 italic text-blue-500">STUDIO_ENGINE <span className="text-white/20 mx-2">/</span> <span className="text-white/80">{tenant.name}</span></span>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl gap-2">
             <button onClick={() => setViewMode('desktop')} className={`px-6 py-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5'}`}><Monitor size={18} /></button>
             <button onClick={() => setViewMode('mobile')} className={`px-6 py-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5'}`}><Smartphone size={18} /></button>
          </div>
          <SaveButton onSave={saveConfig} isSaving={isSaving} />
        </header>
        <div className="flex-1 flex overflow-hidden">
          <Toolbox />
          <main className="flex-1 overflow-y-auto p-12 flex justify-center bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]">
            <motion.div animate={{ width: viewMode === 'mobile' ? '375px' : '1000px' }} className="bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 rounded-3xl overflow-hidden h-fit min-h-screen origin-top">
              <Frame>
                <Element is={Section} canvas>
                  <Text text="Arquitectura de Diseño Studio" fontSize={48} bold={true} center={true} />
                  <Text text="Diseña sitios industriales con precisión nanométrica." fontSize={16} color="rgba(255,255,255,0.4)" center={true} />
                </Element>
              </Frame>
            </motion.div>
          </main>
          <aside className="w-96 border-l border-white/5 bg-[#0a0a0a] shrink-0 overflow-y-auto shadow-2xl">
            <SettingsPanel />
          </aside>
        </div>
      </div>
    </Editor>
  );
};

const SaveButton = ({ onSave, isSaving }: any) => {
  const { query } = useEditor();
  return (
    <button onClick={() => onSave(query)} disabled={isSaving} className="bg-blue-600 px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} PUBLICAR
    </button>
  );
};

export default VisualBuilder;
