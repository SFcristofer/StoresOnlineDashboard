import React, { useState } from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { supabase } from '../lib/supabase';
import { 
  Container, 
  Text, 
  Button, 
  Image,
  Carousel
} from '../components/editor/UserComponents';
import { SettingsPanel } from '../components/editor/SettingsPanel';
import { 
  Layout, 
  Type, 
  Image as ImageIcon, 
  MousePointer2, 
  Save, 
  ArrowLeft, 
  Loader2, 
  Plus,
  Box,
  Columns,
  GalleryHorizontalEnd
} from 'lucide-react';

const VisualBuilder: React.FC<{ tenant: any, onBack: () => void }> = ({ tenant, onBack }) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveConfig = async (query: any) => {
    setIsSaving(true);
    const json = query.serialize();
    await supabase.from('tenants').update({ site_config: { craft: json } }).eq('id', tenant.id);
    alert("Diseño Profesional Guardado.");
    setIsSaving(false);
  };

  const Toolbox = () => {
    const { connectors } = useEditor();
    return (
      <aside className="w-72 border-r border-white/5 p-6 bg-[#0f121d] overflow-y-auto">
        <p className="text-[10px] font-black text-white/20 uppercase mb-6 tracking-widest italic">Librería_Átomos</p>
        <div className="grid grid-cols-1 gap-3">
          <button ref={(ref: any) => connectors.create(ref, <Element is={Container} padding={20} canvas />)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-blue-600/20 transition-all">
            <Box className="w-4 h-4 text-blue-500" /> <span className="text-[10px] font-black uppercase italic">Fila / Sección</span>
          </button>
          
          <button ref={(ref: any) => connectors.create(ref, <Element is={Carousel} height={300} canvas />)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-blue-600/20 transition-all">
            <GalleryHorizontalEnd className="w-4 h-4 text-blue-500" /> <span className="text-[10px] font-black uppercase italic">Carrusel</span>
          </button>

          <button ref={(ref: any) => connectors.create(ref, <Text text="Nuevo Texto" />)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-blue-600/20 transition-all">
            <Type className="w-4 h-4 text-blue-500" /> <span className="text-[10px] font-black uppercase italic">Texto</span>
          </button>

          <button ref={(ref: any) => connectors.create(ref, <Button text="Botón" />)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-blue-600/20 transition-all">
            <MousePointer2 className="w-4 h-4 text-blue-500" /> <span className="text-[10px] font-black uppercase italic">Botón</span>
          </button>

          <button ref={(ref: any) => connectors.create(ref, <Image />)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-blue-600/20 transition-all">
            <ImageIcon className="w-4 h-4 text-blue-500" /> <span className="text-[10px] font-black uppercase italic">Imagen</span>
          </button>
        </div>
      </aside>
    );
  };

  return (
    <Editor
      resolver={{ Container, Text, Button, Image, Carousel, Element }}
    >
      <div className="h-screen bg-[#0a0c14] text-white flex flex-col font-sans overflow-hidden">
        {/* Header */}
        <header className="border-b border-white/5 p-6 flex justify-between items-center bg-[#0f121d] shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="text-white/40 hover:text-white transition-colors"><ArrowLeft /></button>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">Pro_Builder_V2</h1>
          </div>
          
          <SaveButton onSave={saveConfig} isSaving={isSaving} />
        </header>

        <div className="flex-1 flex overflow-hidden">
          <Toolbox />

          <main className="flex-1 bg-black/40 p-12 overflow-y-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto bg-black min-h-screen shadow-2xl rounded-t-[50px] border-x border-t border-white/5 overflow-hidden">
              <Frame>
                <Element is={Container} padding={50} background="transparent" canvas>
                  <Text text="Arrastra elementos aquí para empezar a diseñar tu sitio profesional." fontSize={24} textAlign="center" color="#ffffff40" />
                </Element>
              </Frame>
            </div>
          </main>

          <aside className="w-96 border-l border-white/5 bg-[#0f121d]">
            <SettingsPanel />
          </aside>
        </div>
      </div>
    </Editor>
  );
};

// Sub-componente para acceder al contexto del Editor de Craft.js
import { useEditor } from '@craftjs/core';
const SaveButton = ({ onSave, isSaving }: any) => {
  const { query } = useEditor();
  return (
    <button 
      onClick={() => onSave(query)} 
      disabled={isSaving}
      className="bg-blue-600 px-8 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-lg shadow-blue-600/20"
    >
      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} GUARDAR
    </button>
  );
};

export default VisualBuilder;
