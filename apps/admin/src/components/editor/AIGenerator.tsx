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

  const callGemini = async (modelName: string, systemPrompt: string, userPrompt: string, apiKey: string) => {
    console.log(`[AI_LOG] Intentando con modelo: ${modelName}`);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\nDiseña: ${userPrompt}` }] }]
      })
    });
    return response;
  };

  const generateSite = async () => {
    if (!prompt || loading) return;
    if (credits <= 0) {
      alert("Créditos agotados.");
      return;
    }

    setLoading(true);
    setDebugInfo('Conectando con Red Neuronal...');
    
    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const systemPrompt = `
        Eres un Director de Arte Galardonado y Arquitecto Craft.js.
        Tu misión es generar el JSON exacto para un sitio de lujo.
        
        REGLAS ESTÉTICAS (OBLIGATORIAS):
        1. DARK MODE SIEMPRE: Usa fondos #050505, #0a0a0a o #111111. NUNCA uses fondos blancos (#ffffff) a menos que sea un botón.
        2. TIPOGRAFÍA MASIVA: Títulos del Hero entre 64px y 96px. Subtítulos en 18px. Color de texto principal #ffffff.
        3. ACENTOS PREMIUM: Usa colores técnicos (Ej: #3b82f6, #10b981) o metálicos (#d97706) SOLO para botones o precios.
        4. ESPACIADO (RESPIRA): Usa "padding" de 80px a 120px en Sections. Usa "gap" de 40px en Grids.
        
        REGLAS TÉCNICAS (CRÍTICAS PARA QUE NO FALLE):
        1. JERARQUÍA: ROOT (Section) -> Grid -> Box -> (Text/Button/Image).
        2. GRID: Usa "cols" (1, 2, 3 o 4).
        3. NEGOCIOS: Si piden restaurantes/barberías, OBLIGATORIO usar "ServiceCard" y "BookingSystem".
        
        FORMATO EXACTO DEL NODO (NO USES STRINGS PARA TYPE):
        "id-del-nodo": {
          "type": { "resolvedName": "NombreComponente" },
          "isCanvas": true,
          "props": { "background": "#050505", "padding": 80 },
          "parent": "ROOT",
          "nodes": ["id-hijo"]
        }
        
        RESPONDE SOLO JSON PURO. CERO TEXTO EXTRA.
      `;

      // --- ESTRATEGIA DE RESILIENCIA ---
      let response = await callGemini('gemini-3-flash-preview', systemPrompt, prompt, API_KEY);
      let data = await response.json();

      // Si el modelo 3 está saturado o no disponible, usamos el 1.5 de respaldo automáticamente
      if (data.error && (data.error.message.includes('demand') || data.error.code === 429 || data.error.code === 404)) {
        console.warn("[AI_WARN] Gemini 3 saturado. Aplicando respaldo Gemini 1.5...");
        setDebugInfo('Cerebro 3 ocupado... Activando motor de respaldo 1.5...');
        response = await callGemini('gemini-1.5-flash', systemPrompt, prompt, API_KEY);
        data = await response.json();
      }

      if (data.error) throw new Error(data.error.message);

      const aiText = data.candidates[0].content.parts[0].text;
      const cleanJson = aiText.replace(/```json|```/g, "").trim();
      
      console.log("[AI_SUCCESS] Respuesta recibida:", cleanJson);

      let parsed;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse JSON:", cleanJson);
        throw new Error("La IA generó JSON inválido.");
      }
      
      const invalidNodes = [];
      for (const [key, node] of Object.entries(parsed)) {
        if (!node || typeof node !== 'object') {
          invalidNodes.push({ id: key, reason: "No es objeto" });
          continue;
        }
        const nodeObj = node as any;
        if (!nodeObj.type || typeof nodeObj.type !== 'object' || !nodeObj.type.resolvedName) {
          invalidNodes.push({ id: key, reason: "Falta type.resolvedName", content: nodeObj });
        }
      }

      if (invalidNodes.length > 0) {
        console.error("🚫 [AI_FATAL] Nodos corruptos:", invalidNodes);
        throw new Error(`La IA falló el formato (ej: en el nodo ${invalidNodes[0].id}). Intenta generar de nuevo.`);
      }

      // Cobrar crédito e historial
      const newHistory = [prompt, ...history].slice(0, 10);
      await supabase.from('tenants').update({ 
        ai_credits: credits - 1,
        prompt_history: newHistory
      }).eq('id', tenantId);

      try {
        actions.deserialize(parsed);
      } catch (e: any) {
        console.error("🚫 [CRAFT_ERROR] Fallo al inyectar:", e);
        throw new Error("Craft.js rechazó el diseño. Revisa consola F12.");
      }

      setHistory(newHistory);
      setCredits(credits - 1);
      setIsOpen(false);
      alert("¡Diseño de Élite Desplegado!");

    } catch (error: any) {
      console.error("[AI_FATAL] Error en generación:", error);
      setDebugInfo(`ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-10 py-5 rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all z-50 border border-white/10"
    >
      <Sparkles size={18} className="text-blue-600" /> Studio_IA
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80">
      <div className="bg-[#0a0a0a] border border-white/5 w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex h-[650px]">
        
        {/* HISTORIAL */}
        <aside className="w-80 border-r border-white/5 bg-[#0f121d] p-8 flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-8 opacity-40">
            <History size={16} />
            <span className="text-xs font-black uppercase tracking-widest text-white">Memoria_IA</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {history.map((item, i) => (
              <button key={i} onClick={() => setPrompt(item)} className="w-full text-left p-5 bg-white/5 border border-white/5 rounded-3xl hover:border-blue-500/30 transition-all group">
                <p className="text-xs text-white/40 group-hover:text-white line-clamp-3 leading-relaxed font-medium">{item}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* GENERADOR */}
        <div className="flex-1 p-12 flex flex-col relative text-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]"></div>
          
          <header className="flex justify-between items-center mb-10 relative z-10">
            <div className="flex items-center gap-4 text-blue-500">
               <Sparkles size={28} />
               <h2 className="text-2xl font-black italic uppercase tracking-tighter">AI_DESIGNER_PRO</h2>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-5 py-2 rounded-2xl">
                  <Coins size={16} className="text-yellow-500" />
                  <span className="text-sm font-black text-yellow-500">{credits}</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/20 hover:text-white transition-all"><X size={20} /></button>
            </div>
          </header>

          <textarea 
            placeholder="Describe tu visión técnica..."
            className="flex-1 w-full bg-white/[0.02] border border-white/5 p-8 rounded-[40px] outline-none focus:border-blue-500 font-medium text-white mb-8 transition-all resize-none text-lg placeholder:text-white/10"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {debugInfo && (
            <div className={`mb-8 p-5 border rounded-3xl flex items-center gap-4 text-xs font-bold uppercase tracking-widest ${debugInfo.startsWith('ERROR') ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
              {debugInfo.startsWith('ERROR') ? <AlertTriangle size={18} /> : <Cpu size={18} />}
              {debugInfo}
            </div>
          )}

          <button onClick={generateSite} disabled={loading || credits <= 0} className="w-full bg-white text-black p-8 rounded-3xl font-black uppercase text-sm tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 active:scale-95 shadow-xl">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} 
            {loading ? 'PROCESANDO_ALGORITMO...' : 'DESPLEGAR_SISTEMA_IA'}
          </button>
        </div>
      </div>
    </div>
  );
};
