import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Layout, 
  Type, 
  Image as ImageIcon, 
  CreditCard, 
  GripVertical,
  Trash2,
  Save,
  ArrowLeft,
  Loader2,
  Plus,
  Mail,
  MapPin,
  Share2,
  FileText
} from 'lucide-react';

const AVAILABLE_BLOCKS = [
  { id: 'hero', name: 'Hero Section', icon: <Layout className="w-4 h-4" />, content: 'Encabezado Impactante' },
  { id: 'features', name: 'Características', icon: <Type className="w-4 h-4" />, content: 'Lista de Servicios' },
  { id: 'gallery', name: 'Galería', icon: <ImageIcon className="w-4 h-4" />, content: 'Imágenes del Local' },
  { id: 'pricing', name: 'Precios', icon: <CreditCard className="w-4 h-4" />, content: 'Tabla de Precios' },
  { id: 'contact', name: 'Contacto', icon: <Mail className="w-4 h-4" />, content: 'Formulario de Cliente' },
  { id: 'map', name: 'Mapa', icon: <MapPin className="w-4 h-4" />, content: 'Ubicación GPS' },
  { id: 'social', name: 'Redes Sociales', icon: <Share2 className="w-4 h-4" />, content: 'Enlaces de Perfil' },
];

interface SortableBlockProps {
  id: string;
  block: any;
  onRemove: (id: string) => void;
}

const SortableBlock = ({ id, block, onRemove }: SortableBlockProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="group relative bg-[#1a1f2e] border border-white/5 p-6 rounded-2xl mb-4 hover:border-blue-500/50 transition-all shadow-xl">
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab text-white/20 hover:text-white transition-colors">
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">{block.name}</p>
          <div className="h-20 bg-black/20 rounded-xl flex items-center justify-center border border-white/5 border-dashed">
            <span className="text-white/20 text-xs font-bold uppercase italic">{block.content}</span>
          </div>
        </div>
        <button onClick={() => onRemove(id)} className="text-red-500/20 hover:text-red-500 transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const VisualBuilder: React.FC<{ tenant: any, onBack: () => void }> = ({ tenant, onBack }) => {
  const [currentPage, setCurrentPage] = useState('/');
  const [config, setConfig] = useState<any>(tenant.site_config || { pages: { '/': { blocks: [] } } });
  const [isSaving, setIsSaving] = useState(false);

  const blocks = config.pages[currentPage]?.blocks || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const addBlock = (type: string) => {
    const template = AVAILABLE_BLOCKS.find(b => b.id === type);
    const newBlock = { ...template, instanceId: `${type}-${Date.now()}` };
    
    const newConfig = { ...config };
    if (!newConfig.pages[currentPage]) newConfig.pages[currentPage] = { blocks: [] };
    newConfig.pages[currentPage].blocks = [...blocks, newBlock];
    setConfig(newConfig);
  };

  const removeBlock = (id: string) => {
    const newConfig = { ...config };
    newConfig.pages[currentPage].blocks = blocks.filter((b: any) => b.instanceId !== id);
    setConfig(newConfig);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((i: any) => i.instanceId === active.id);
      const newIndex = blocks.findIndex((i: any) => i.instanceId === over.id);
      
      const newConfig = { ...config };
      newConfig.pages[currentPage].blocks = arrayMove(blocks, oldIndex, newIndex);
      setConfig(newConfig);
    }
  };

  const addPage = () => {
    const pageName = prompt("Nombre de la subpágina (ej: /nosotros):");
    if (pageName && !config.pages[pageName]) {
      const newConfig = { ...config };
      newConfig.pages[pageName] = { blocks: [] };
      setConfig(newConfig);
      setCurrentPage(pageName);
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    // Para retrocompatibilidad, también guardamos los bloques de '/' en la raíz si es necesario
    const payload = { 
      site_config: { 
        ...config,
        blocks: config.pages['/']?.blocks || [] // Mantener la estructura simple para el storefront actual
      } 
    };

    const { error } = await supabase.from('tenants').update(payload).eq('id', tenant.id);
    if (!error) alert("Sistema actualizado.");
    setIsSaving(false);
  };

  return (
    <div className="h-screen bg-[#0a0c14] text-white flex flex-col font-sans">
      <header className="border-b border-white/5 p-6 flex justify-between items-center bg-[#0f121d]">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white/5 p-2 rounded-xl flex gap-2">
               {Object.keys(config.pages).map(page => (
                 <button 
                  key={page} 
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === page ? 'bg-blue-600 text-white' : 'text-white/20 hover:text-white'}`}
                 >
                   {page === '/' ? 'INICIO' : page.replace('/', '').toUpperCase()}
                 </button>
               ))}
               <button onClick={addPage} className="p-2 text-white/20 hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <button onClick={saveConfig} disabled={isSaving} className="bg-blue-600 px-8 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-lg shadow-blue-600/20">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} GUARDAR
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-white/5 p-8 bg-[#0f121d] overflow-y-auto">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 italic">Módulos_Disponibles</h2>
          <div className="grid grid-cols-1 gap-4">
            {AVAILABLE_BLOCKS.map(block => (
              <button key={block.id} onClick={() => addBlock(block.id)} className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-blue-500 transition-colors">{block.icon}</div>
                <p className="text-xs font-black uppercase tracking-widest italic">{block.name}</p>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 bg-black/40 p-12 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map((b: any) => b.instanceId)} strategy={verticalListSortingStrategy}>
                {blocks.map((block: any) => (
                  <SortableBlock key={block.instanceId} id={block.instanceId} block={block} onRemove={removeBlock} />
                ))}
              </SortableContext>
            </DndContext>
            {blocks.length === 0 && (
              <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[40px]">
                <p className="text-white/10 font-black uppercase text-[10px] tracking-widest">Página Vacía - Inserta un bloque</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisualBuilder;
