import React, { useState, useEffect, useRef } from "react";
import { X, MessageCircle, User, Bot, Activity, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useUser } from "./UserContext";

const avatarUrl = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
const BACKEND_URL = "https://inspectia-web.onrender.com";

function Chatbot() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState("INIT"); 
  const [proyectos, setProyectos] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const iniciarSaludo = () => {
    if (user?.nombre && user?.apellido) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          { from: "bot", text: `¡Hola ${user.nombre} ${user.apellido}! 👋 Soy tu asistente personal de INSPECTIA.` },
        ]);
        setIsTyping(false);
        
        setTimeout(() => {
          setMessages(prev => [...prev, 
            { from: "bot", text: "¿Te gustaría ver información sobre tus proyectos?", options: ["Sí, mostrar proyectos", "No, gracias"] }
          ]);
          setState("WAIT_PROJECT_OPTION");
        }, 1000);
      }, 800);
    }
  };

  useEffect(() => {
    if (open && messages.length === 0) iniciarSaludo();
  }, [open]);

  const handleOptionClick = async (option) => {
    setMessages((prev) => [...prev, { from: "user", text: option }]);
    setIsTyping(true);

    if (state === "WAIT_PROJECT_OPTION") {
      if (option === "Sí, mostrar proyectos") {
        try {
          const res = await fetch(`${BACKEND_URL}/proyectos/${user.id}`);
          const data = await res.json();
          setProyectos(data);
          setIsTyping(false);

          if (data.length === 0) {
            setTimeout(() => {
              setMessages((prev) => [...prev, { from: "bot", text: "📋 No tienes proyectos asignados actualmente." }]);
              setState("INIT");
            }, 500);
          } else {
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  from: "bot",
                  text: "📊 Aquí están tus proyectos activos:",
                  proyectosLista: data.map((p, idx) => `${p.nombre_proyecto}`),
                },
              ]);
            }, 500);
            
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  from: "bot",
                  text: "¿Sobre cuál proyecto quieres ver el resumen?",
                  options: data.map((_, idx) => `Proyecto ${idx + 1}`),
                },
              ]);
              setState("WAIT_PROJECT_DETAIL");
            }, 1200);
          }
        } catch (err) {
          console.error(err);
          setIsTyping(false);
          setTimeout(() => {
            setMessages((prev) => [...prev, { from: "bot", text: "❌ Ocurrió un error al obtener tus proyectos. Intenta más tarde." }]);
            setState("INIT");
          }, 500);
        }
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: "bot", text: "¡Perfecto! 😊 Estoy aquí cuando necesites ayuda. ¡Que tengas un excelente día!" }]);
          setState("INIT");
        }, 500);
      }
    } else if (state === "WAIT_PROJECT_DETAIL") {
      const index = parseInt(option.replace('Proyecto ', '')) - 1;
      if (index >= 0 && index < proyectos.length) {
        const proyectoSeleccionado = proyectos[index];
        
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: "bot", text: "🔍 Analizando datos del proyecto..." }]);
        }, 300);
        
        try {
          const res = await fetch(
            `${BACKEND_URL}/proyectos/nombre/${encodeURIComponent(proyectoSeleccionado.nombre_proyecto)}`
          );
          const data = await res.json();
          setIsTyping(false);

          const resumen = generarResumen(data);
          setTimeout(() => {
            setMessages((prev) => [...prev, { from: "bot", type: "resumen", data: resumen }]);
          }, 800);
        } catch (err) {
          console.error(err);
          setIsTyping(false);
          setTimeout(() => {
            setMessages((prev) => [...prev, { from: "bot", text: "❌ Error al obtener los detalles del proyecto. Intenta nuevamente." }]);
          }, 500);
        }
        setState("INIT");
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: "bot", text: "⚠️ Por favor selecciona una opción válida." }]);
        }, 300);
      }
    }
  };

  const generarResumen = (data) => {
    const { proyecto, casos } = data;

    const pendientes = casos.filter((c) => c.estado.toLowerCase() === "pendiente").length;
    const enEjecucion = casos.filter((c) => c.estado.toLowerCase() === "en ejecución").length;
    const completados = casos.filter((c) => ["completado", "finalizado"].includes(c.estado.toLowerCase())).length;
    const totalCasos = casos.length;

    const porcentajeAvance =
      totalCasos > 0 ? (((enEjecucion + completados) / totalCasos) * 100).toFixed(1) : 0;

    return { nombre: proyecto.nombre_proyecto, totalCasos, pendientes, enEjecucion, completados, porcentajeAvance };
  };

  const handleClose = () => {
    setOpen(false);
    setMessages([]);  // 🔹 limpiar la conversación al cerrar
    setState("INIT");
  };

  return (
    <>
      {/* Botón flotante mejorado */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
          title="Asistente Virtual"
        >
          <MessageCircle className="w-8 h-8 text-white" />
          {!open && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
              !
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-20 animate-ping"></div>
        </button>
      </div>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 flex flex-col overflow-hidden z-50 animate-slide-up">
          {/* Header mejorado */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Asistente INSPECTIA</h3>
                <p className="text-xs text-gray-500">Siempre disponible para ayudarte</p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mensajes mejorados */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-2 animate-fade-in ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {m.from === "bot" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm ${
                    m.from === "user"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {/* Mensaje normal */}
                  {m.from === "bot" && m.type !== "resumen" && (
                    <div>
                      <p className="text-sm leading-relaxed">{m.text}</p>
                      {/* Lista de proyectos mejorada */}
                      {m.proyectosLista && (
                        <div className="mt-3 space-y-2">
                          {m.proyectosLista.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <Activity className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              <span className="text-sm font-medium">{p}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Mensaje de usuario */}
                  {m.from === "user" && (
                    <p className="text-sm font-medium">{m.text}</p>
                  )}

                  {/* Resumen especial mejorado */}
                  {m.type === "resumen" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-5 h-5 text-purple-600" />
                        <h4 className="font-bold text-gray-800">
                          📊 Resumen: "{m.data.nombre}"
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 text-center hover:scale-105 transition-transform">
                          <div className="text-2xl font-bold text-blue-600">{m.data.totalCasos}</div>
                          <div className="text-xs text-blue-800 font-medium">Total Casos</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 text-center hover:scale-105 transition-transform">
                          <div className="text-2xl font-bold text-green-600">{m.data.enEjecucion}</div>
                          <div className="text-xs text-green-800 font-medium">En Ejecución</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200 text-center hover:scale-105 transition-transform">
                          <div className="text-2xl font-bold text-yellow-600">{m.data.pendientes}</div>
                          <div className="text-xs text-yellow-800 font-medium">Pendientes</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 text-center hover:scale-105 transition-transform">
                          <div className="text-2xl font-bold text-purple-600">{m.data.porcentajeAvance}%</div>
                          <div className="text-xs text-purple-800 font-medium">Progreso</div>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${m.data.porcentajeAvance}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 text-center">Progreso del proyecto</p>
                      </div>
                    </div>
                  )}

                  {/* Botones de opciones mejorados */}
                  {m.options && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {m.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOptionClick(opt)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-1"
                        >
                          {opt.includes('Sí') && <CheckCircle className="w-3 h-3" />}
                          {opt.includes('No') && <X className="w-3 h-3" />}
                          {opt.includes('Proyecto') && <Activity className="w-3 h-3" />}
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {m.from === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Indicador de typing */}
            {isTyping && (
              <div className="flex items-end gap-2 animate-fade-in">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Estilos CSS para animaciones */}
          <style jsx>{`
            @keyframes slide-up {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
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
              animation: slide-up 0.3s ease-out;
            }
            
            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
              animation-fill-mode: both;
            }
          `}</style>
        </div>
      )}
    </>
  );
}

export default Chatbot;
