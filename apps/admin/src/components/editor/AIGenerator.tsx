import React, { useState, useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import { Sparkles, Loader2, X, Send, Terminal, History, Coins, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AIGenerator = ({ tenantId }: { tenantId: string }) => {
  const { actions } = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  
  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) fetchUsageData();
  }, [isOpen]);

  async function fetchUsageData() {
    const { data } = await supabase.from('tenants').select('ai_credits, prompt_history').eq('id', tenantId).single();
    if (data) {
      setCredits(data.ai_credits ?? 3);
      setHistory(data.prompt_history || []);
    }
  }

  const generateSite = async () => {
    if (!prompt || loading) return;
    if (credits <= 0) {
      alert("Créditos agotados. Por favor, recarga tu cuenta.");
      return;
    }

    setLoading(true);
    setDebugInfo('Cifrando arquitectura visual...');
    
    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      
      const systemPrompt = `
        Eres un Arquitecto de Software Senior. Genera el JSON serializado para Craft.js.
        
        REGLAS DE ORO:
        1. SOLO RESPONDE JSON PURO.
        2. Jerarquía: ROOT (Section) -> Row -> Column -> Elementos.
        3. COMPONENTE ESPECIALES:
           - "ServiceCard": { "title": string, "price": string, "desc": string, "image": string }
           - "BookingSystem": { "title": string }
           - "Carousel": { "height": number }
        
        EJEMPLO MAESTRO (Úsalo para todos los nodos):
        {
          "ROOT": { "type": { "resolvedName": "Section" }, "isCanvas": true, "props": { "background": "#050505" }, "nodes": ["r1"], "displayName": "Sección" },
          "r1": { "type": { "resolvedName": "Row" }, "isCanvas": true, "props": { "gap": 32 }, "parent": "ROOT", "nodes": ["c1"], "displayName": "Fila" },
          "c1": { "type": { "resolvedName": "Column" }, "isCanvas": true, "props": { "width": 1 }, "parent": "r1", "nodes": ["t1"], "displayName": "Columna" },
          "t1": { "type": { "resolvedName": "Text" }, "props": { "text": "Hola", "fontSize": 32 }, "parent": "c1", "nodes": [] }
        }
      `;

      // Forzamos el uso de Gemini 3 Flash Preview como solicitaste
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nDiseña: ${prompt}` }] }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const aiText = data.candidates[0].content.parts[0].text;
      const cleanJson = aiText.replace(/```json|```/g, "").trim();
      
      const parsed = JSON.parse(cleanJson);
      
      // Cobrar crédito e historial
      const newHistory = [prompt, ...history].slice(0, 10);
      await supabase.from('tenants').update({ 
        ai_credits: credits - 1,
        prompt_history: newHistory
      }).eq('id', tenantId);

      // Cargar en editor
      actions.deserialize(parsed);
      setHistory(newHistory);
      setCredits(credits - 1);
      setIsOpen(false);
      alert("¡Diseño de Élite Desplegado!");

    } catch (error: any) {
      console.error("AI Error Detail:", error);
      setDebugInfo(`ERROR_IA: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all z-50 border border-white/10"
    >
      <Sparkles size={16} className="text-blue-600" /> Studio_IA
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
      <div className="bg-[#0a0a0a] border border-white/5 w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex h-[650px]">
        <aside className="w-80 border-r border-white/5 bg-[#0f121d] p-8 flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-8 opacity-40">
            <History size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Memoria_IA</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {history.map((item, i) => (
              <button key={i} onClick={() => setPrompt(item)} className="w-full text-left p-5 bg-white/5 border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all group">
                <p className="text-[10px] text-white/30 group-hover:text-white line-clamp-3 leading-relaxed font-medium">{item}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 p-12 flex flex-col relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]"></div>
          <header className="flex justify-between items-center mb-10 relative z-10">
            <div className="flex items-center gap-4 text-blue-500">
               <Sparkles size={24} />
               <h2 className="text-2xl font-black italic uppercase tracking-tighter">AI_DESIGNER_V4</h2>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-5 py-2 rounded-2xl">
                  <Coins size={14} className="text-yellow-500" />
                  <span className="text-[11px] font-black text-yellow-500">{credits} CRÉDITOS</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-all"><X size={18} /></button>
            </div>
          </header>

          <textarea 
            placeholder="Describe tu visión técnica..."
            className="flex-1 w-full bg-white/[0.02] border border-white/5 p-8 rounded-[40px] outline-none focus:border-blue-500 font-medium text-white mb-8 transition-all resize-none text-lg placeholder:text-white/10"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {debugInfo && (
            <div className={`mb-8 p-5 border rounded-3xl flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest ${debugInfo.startsWith('ERROR') ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
              {debugInfo.startsWith('ERROR') ? <AlertTriangle size={16} /> : <Terminal size={16} />}
              {debugInfo}
            </div>
          )}

          <button onClick={generateSite} disabled={loading || credits <= 0} className="w-full bg-white text-black p-7 rounded-3xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 active:scale-95">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} 
            {loading ? 'Sincronizando_Arquitectura...' : 'Desplegar_Sistema_IA'}
          </button>
        </div>
      </div>
    </div>
  );
};
