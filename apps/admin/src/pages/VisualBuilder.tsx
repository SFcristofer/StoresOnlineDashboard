import React, { useState } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { supabase } from '../lib/supabase';
import { Section, Row, Column, Text, Button, Image, ServiceCard, BookingSystem, Carousel } from '../components/editor/UserComponents';
import { SettingsPanel } from '../components/editor/SettingsPanel';
import { AIGenerator } from '../components/editor/AIGenerator';
import { 
  Type, ImageIcon, MousePointer2, Save, ArrowLeft, Loader2, 
  Layers, Columns, Laptop, Smartphone 
} from 'lucide-react';

const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <aside className="w-64 border-r border-white/5 p-6 bg-[#0f121d] overflow-y-auto shrink-0 z-10 flex flex-col">
      <div className="mb-8">
        <p className="text-[9px] font-bold text-white/20 uppercase mb-4 tracking-widest">Estructura</p>
        <div className="space-y-2">
          <div ref={(ref: any) => connectors.create(ref, <Element is={Section} canvas />)} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-blue-600/10 cursor-grab flex items-center gap-3 group transition-all">
            <Layers size={14} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Sección</span>
          </div>
          <div ref={(ref: any) => connectors.create(ref, <Element is={Row} canvas><Element is={Column} width={1} canvas /><Element is={Column} width={1} canvas /></Element>)} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-blue-600/10 cursor-grab flex items-center gap-3 group transition-all">
            <Columns size={14} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">2 Columnas</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[9px] font-bold text-white/20 uppercase mb-4 tracking-widest">Elementos</p>
        <div className="space-y-2">
          <div ref={(ref: any) => connectors.create(ref, <Text text="Título de ejemplo" fontSize={28} bold={true} center={false} />)} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-blue-600/10 cursor-grab flex items-center gap-3 group transition-all">
            <Type size={14} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Texto</span>
          </div>
          <div ref={(ref: any) => connectors.create(ref, <Image />)} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-blue-600/10 cursor-grab flex items-center gap-3 group transition-all">
            <ImageIcon size={14} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Imagen</span>
          </div>
          <div ref={(ref: any) => connectors.create(ref, <Button text="Acción" />)} className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-blue-600/10 cursor-grab flex items-center gap-3 group transition-all">
            <MousePointer2 size={14} className="text-white/20 group-hover:text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Botón</span>
          </div>
        </div>
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
    <Editor resolver={{ Section, Row, Column, Text, Button, Image, ServiceCard, BookingSystem, Carousel, Element }}>
      <div className="h-screen bg-[#0a0c14] text-white flex flex-col font-sans overflow-hidden">
        {/* GENERADOR DE IA FLOTANTE */}
        <AIGenerator tenantId={tenant.id} />

        <header className="border-b border-white/5 px-6 py-4 flex justify-between items-center bg-[#0f121d] shrink-0 z-50">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-all"><ArrowLeft size={18} /></button>
            <h1 className="text-sm font-bold uppercase tracking-widest">Editor Visual</h1>
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl gap-1">
             <button onClick={() => setViewMode('desktop')} className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-blue-600' : 'hover:bg-white/5'}`}><Laptop size={14} /></button>
             <button onClick={() => setViewMode('mobile')} className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-blue-600' : 'hover:bg-white/5'}`}><Smartphone size={14} /></button>
          </div>
          
          <SaveButton onSave={saveConfig} isSaving={isSaving} />
        </header>

        <div className="flex-1 flex overflow-hidden">
          <Toolbox />
          <main className="flex-1 bg-black/60 overflow-y-auto custom-scrollbar flex justify-center p-10">
            <div 
              style={{ 
                width: viewMode === 'mobile' ? '375px' : '100%', 
                maxWidth: viewMode === 'mobile' ? '375px' : '1000px',
                minHeight: '100%'
              }}
              className="bg-[#0a0c14] shadow-2xl transition-all duration-300 relative border border-white/5 rounded-xl flex flex-col"
            >
              <Frame>
                <Element is={Section} paddingY={80} background="#000000" canvas>
                  <Text text="Diseño con Inteligencia Artificial" fontSize={32} bold={true} center={true} />
                  <Text text="Describe tu sitio y deja que Gemini haga el trabajo pesado." fontSize={14} color="#ffffff40" center={true} />
                </Element>
              </Frame>
            </div>
          </main>

          <aside className="w-80 border-l border-white/5 bg-[#0f121d] shrink-0 overflow-y-auto">
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
    <button onClick={() => onSave(query)} disabled={isSaving} className="bg-blue-600 px-6 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
      {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Guardar
    </button>
  );
};

export default VisualBuilder;
