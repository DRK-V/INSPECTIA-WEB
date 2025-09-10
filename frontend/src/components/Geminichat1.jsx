import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, User, Sparkles, X, Zap } from "lucide-react";

const avatarUrl = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";

const API_KEY = "AIzaSyBqUaK5uLKOb0DXV0JjQGFPwkTeYWURXVE";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

function GeminiChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! 👋 Soy tu asistente inteligente de INSPECTIA. ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Obtén el contexto de la página landing (puedes ajustar esto según tu estructura)
  // Aquí se toma el texto de todo el body, pero puedes limitarlo a una sección específica si lo prefieres.
  const getLandingContext = () => {
    const landing = document.getElementById("landing");
    return landing ? landing.innerText : document.body.innerText;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { from: "user", text: input };
    const currentInput = input;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const context = getLandingContext();
      const prompt = `
Eres un asistente especializado de INSPECTIA, una plataforma de testing QA.
Responde de forma profesional, clara y concisa (máximo 4 oraciones).
Enfócate en ayudar con temas relacionados con testing, QA, y los servicios de la plataforma.
Si la pregunta no está relacionada con QA/testing, redirige amablemente hacia los servicios de INSPECTIA.

Contexto de la página: ${context}

Pregunta del usuario: ${currentInput}
      `;

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          },
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      
      const geminiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Lo siento, no pude procesar tu consulta en este momento. ¿Podrías reformular tu pregunta?";

      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text: geminiResponse }]);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error al consultar Gemini:', err);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "🔧 Ups, algo salió mal. Por favor intenta nuevamente o contacta con nuestro equipo de soporte." },
        ]);
        setLoading(false);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <>
      {/* Botón flotante mejorado */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="group relative bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
          aria-label="Abrir Asistente IA"
        >
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
          {!open && (
            <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce font-bold">
              IA
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-30 animate-ping"></div>
        </button>
      </div>

      {/* Modal de chat mejorado */}
      {open && (
        <div className="fixed bottom-6 left-6 z-50 flex items-end justify-start pointer-events-none">
          <div className="relative w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col max-h-[85vh] pointer-events-auto border border-gray-200/50 animate-slide-up">
            {/* Header con diseño moderno */}
            <div className="flex items-center gap-3 p-5 border-b border-gray-200/50 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse">
                  <Zap className="w-2 h-2 text-white ml-0.5 mt-0.5" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  Asistente IA
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                </h3>
                <p className="text-xs text-gray-500">Potenciado por Gemini AI</p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            {/* Área de mensajes mejorada */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/30 to-white/30 min-h-[400px]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2 animate-fade-in ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {msg.from === "bot" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-md"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.from === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Indicador de escritura mejorado */}
              {loading && (
                <div className="flex items-end gap-2 animate-fade-in">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">IA procesando...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            {/* Input área mejorada */}
            <div className="border-t border-gray-200/50 p-4 bg-white/80 backdrop-blur-sm">
              <form
                className="flex items-end gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-200 max-h-24"
                    placeholder="Pregúntame sobre testing QA, metodologías, herramientas..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    rows={1}
                    style={{
                      minHeight: '44px',
                      height: 'auto'
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                    }}
                  />
                  {input && (
                    <button
                      type="button"
                      onClick={() => setInput('')}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </form>
              
              {/* Sugerencias rápidas */}
              {messages.length === 1 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    '¿Qué tipos de testing ofrecen?',
                    'Háblame sobre testing automatizado',
                    '¿Cómo funciona el testing de APIs?'
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 transition-colors"
                      disabled={loading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Estilos CSS para animaciones */}
            <style jsx>{`
              @keyframes slide-up {
                from {
                  opacity: 0;
                  transform: translateY(20px) scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
              
              @keyframes fade-in {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              
              .animate-slide-up {
                animation: slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              }
              
              .animate-fade-in {
                animation: fade-in 0.3s ease-out;
                animation-fill-mode: both;
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}

export default GeminiChatBot;
