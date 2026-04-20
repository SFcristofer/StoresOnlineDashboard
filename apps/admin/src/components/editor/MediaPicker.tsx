import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';

interface MediaPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  tenantId: string;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, onClose, tenantId }) => {
  const [images, setImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('tenant-assets')
        .list(`${tenantId}/`);

      if (error) throw error;
      
      const imageUrls = data.map(file => ({
        name: file.name,
        url: supabase.storage.from('tenant-assets').getPublicUrl(`${tenantId}/${file.name}`).data.publicUrl
      }));

      setImages(imageUrls);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [tenantId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${tenantId}/${fileName}`;

      const { error } = await supabase.storage
        .from('tenant-assets')
        .upload(filePath, file);

      if (error) throw error;
      
      await fetchImages();
    } catch (err) {
      alert("Error al subir imagen. Asegúrate de que el bucket 'tenant-assets' existe en tu Supabase.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <ImageIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter italic">Librería_Multimedia</h3>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Gestiona tus activos visuales</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all text-white/20 hover:text-white border border-transparent hover:border-white/10">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <label className="aspect-square border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500/50 hover:bg-blue-600/5 transition-all group shadow-2xl">
              <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} accept="image/*" />
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                  <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Subiendo...</span>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600/20 transition-colors">
                    <Upload className="text-white/20 group-hover:text-blue-500 transition-colors" size={28} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors text-center">Añadir_Archivo</span>
                </>
              )}
            </label>

            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-white/[0.02] rounded-[32px] animate-pulse border border-white/5" />
              ))
            ) : (
              images.map((img) => (
                <div 
                  key={img.name} 
                  onClick={() => onSelect(img.url)}
                  className="aspect-square bg-[#111] rounded-[32px] overflow-hidden cursor-pointer border border-white/5 hover:border-blue-500 transition-all group relative shadow-xl"
                >
                  <img src={img.url} alt="asset" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-2xl">
                      <Check size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <footer className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-end">
          <button 
            onClick={onClose} 
            className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all border border-white/5 shadow-lg active:scale-95"
          >
            CERRAR_VENTANA_X
          </button>
        </footer>
      </div>
    </div>
  );
};
