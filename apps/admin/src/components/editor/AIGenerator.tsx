import React, { useState, useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import { Sparkles, Loader2, X, Send, Terminal, History, Coins, AlertTriangle, Cpu } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AIGenerator = ({ tenantId }: { tenantId: string }) => {
  const { actions } = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => { if (isOpen) fetchUsageData(); }, [isOpen]);

  async function fetchUsageData() {
    const { data } = await supabase.from('tenants').select('ai_credits, prompt_history').eq('id', tenantId).single();
    if (data) { setCredits(data.ai_credits ?? 3); setHistory(data.prompt_history || []); }
  }

  const generateSite = async () => {
    if (!prompt || loading) return;
    if (credits <= 0) { alert("Créditos agotados."); return; }

    setLoading(true);
    setDebugInfo('Sincronizando con Motor de Diseño v2.0...');
    
    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const systemPrompt = `
        Eres STUDIO_ENGINE AI, un arquitecto de interfaces especializado en diseño INDUSTRIAL y CYBERPUNK.
        Tu misión es construir estructuras JSON para Craft.js utilizando una biblioteca estrictamente definida.

        FILOSOFÍA DE DISEÑO:
        - Estética: Minimalista, colores oscuros con acentos neón, bordes definidos.
        - Tono: Profesional, técnico, directo.
        - Tipografía: Inter o fuentes Sans-Serif modernas.

        BIBLIOTECA DE BLOQUES PERMITIDOS (resolvedName):
        1. HeroBlock: { title: string, subtitle: string, buttonText: string, theme: "dark" }
        2. FeaturesBlock: { title: string, features: Array<{t: string, d: string}> }
        3. ServiceCard: { title: string, price: string, desc: string, image?: string }
        4. Text: { text: string, fontSize: number, bold: boolean, center?: boolean }
        5. Button: { text: string, bgColor: string, color: string }
        6. Image: { src: string, height: number }
        7. Section: El contenedor raíz indispensable.
        8. Grid: { cols: number }
        9. Box: Contenedor flexible.

        ESTRUCTURA DE RESPUESTA:
        Debes responder ÚNICAMENTE con el objeto JSON de Craft.js. 
        Raíz siempre: "ROOT" (Section).
        Ejemplo de nodo: "node-id": {"type": {"resolvedName": "HeroBlock"}, "isCanvas": false, "props": {...}, "nodes": [], "parent": "ROOT"}
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\nDiseña: ${prompt}` }] }] })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const aiText = data.candidates[0].content.parts[0].text;
      const cleanJson = aiText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      
      // Cobrar crédito e historial
      const newHistory = [prompt, ...history].slice(0, 10);
      await supabase.from('tenants').update({ ai_credits: credits - 1, prompt_history: newHistory }).eq('id', tenantId);

      actions.deserialize(parsed);
      setHistory(newHistory);
      setCredits(credits - 1);
      setIsOpen(false);
      alert("Diseño Desplegado.");

    } catch (error: any) {
      console.error("AI Error:", error);
      setDebugInfo(`ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all z-50 border border-white/10">
      <Sparkles size={18} className="text-blue-600" /> Studio_IA
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
      <div className="bg-[#0a0a0a] border border-white/5 w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex h-[650px]">
        <aside className="w-80 border-r border-white/5 bg-[#0f121d] p-8 flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-8 opacity-40"><History size={16} /><span className="text-xs font-black uppercase tracking-widest text-white">Memoria</span></div>
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
            {history.map((item, i) => (
              <button key={i} onClick={() => setPrompt(item)} className="w-full text-left p-5 bg-white/5 border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all group">
                <p className="text-xs text-white/40 group-hover:text-white line-clamp-3 leading-relaxed font-medium">{item}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 p-12 flex flex-col relative text-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]"></div>
          <header className="flex justify-between items-center mb-10 relative z-10">
            <div className="flex items-center gap-4 text-blue-500"><Sparkles size={28} /><h2 className="text-2xl font-black italic uppercase tracking-tighter">AI_DESIGNER_PRO</h2></div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-5 py-2 rounded-2xl"><Coins size={16} className="text-yellow-500" /><span className="text-sm font-black text-yellow-500">{credits}</span></div>
               <button onClick={() => setIsOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-all"><X size={20} /></button>
            </div>
          </header>

          <textarea 
            placeholder="Describe tu visión técnica (ej: Un landing para una barbería futurista con tonos neón)..." 
            className="flex-1 w-full bg-white/[0.02] border border-white/5 p-8 rounded-[32px] outline-none focus:border-blue-500 font-medium text-white mb-8 transition-all resize-none text-lg placeholder:text-white/10" 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
          />

          {debugInfo && (
            <div className={`mb-8 p-5 border rounded-2xl flex items-center gap-4 text-xs font-bold uppercase tracking-widest ${debugInfo.startsWith('ERROR') ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
              {debugInfo.startsWith('ERROR') ? <AlertTriangle size={18} /> : <Cpu size={18} />}
              {debugInfo}
            </div>
          )}

          {/* BARRA DE ACCIONES FINAL */}
          <footer className="flex gap-4 pt-6 border-t border-white/5">
            <button 
              onClick={() => setIsOpen(false)} 
              className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] text-white/20 hover:text-white hover:bg-white/5 transition-all border border-white/5"
            >
              CANCELAR_X
            </button>
            <button 
              onClick={generateSite} 
              disabled={loading || credits <= 0 || !prompt} 
              className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} 
              {loading ? 'PROCESANDO_NÚCLEO...' : 'CONFIRMAR_Y_GENERAR'}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};
