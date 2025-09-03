import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUser } from "./UserContext";

const avatarUrl = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
const BACKEND_URL = "https://inspectia-web.onrender.com";

function Chatbot() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState("INIT"); 
  const [proyectos, setProyectos] = useState([]);

  const iniciarSaludo = () => {
    if (user?.nombre && user?.apellido) {
      setMessages([
        { from: "bot", text: `¡Hola ${user.nombre} ${user.apellido}! Soy tu asistente.` },
        { from: "bot", text: "¿Quieres información sobre tus proyectos?", options: ["Sí", "No"] },
      ]);
      setState("WAIT_PROJECT_OPTION");
    }
  };

  useEffect(() => {
    if (open && messages.length === 0) iniciarSaludo();
  }, [open]);

  const handleOptionClick = async (option) => {
    setMessages((prev) => [...prev, { from: "user", text: option }]);

    if (state === "WAIT_PROJECT_OPTION") {
      if (option === "Sí") {
        try {
          const res = await fetch(`${BACKEND_URL}/proyectos/${user.id}`);
          const data = await res.json();
          setProyectos(data);

          if (data.length === 0) {
            setMessages((prev) => [...prev, { from: "bot", text: "No tienes proyectos asignados." }]);
            setState("INIT");
          } else {
            setMessages((prev) => [
              ...prev,
              {
                from: "bot",
                text: "Estos son tus proyectos:",
                proyectosLista: data.map((p, idx) => `${idx + 1}. ${p.nombre_proyecto}`),
              },
              {
                from: "bot",
                text: "¿Sobre cuál proyecto quieres información?",
                options: data.map((_, idx) => `${idx + 1}`), // aquí solo números para elegir
              },
            ]);
            setState("WAIT_PROJECT_DETAIL");
          }
        } catch (err) {
          console.error(err);
          setMessages((prev) => [...prev, { from: "bot", text: "Ocurrió un error al obtener tus proyectos." }]);
          setState("INIT");
        }
      } else {
        setMessages((prev) => [...prev, { from: "bot", text: "Gracias, ¡hasta la próxima!" }]);
        setState("INIT");
      }
    } else if (state === "WAIT_PROJECT_DETAIL") {
      const index = parseInt(option) - 1;
      if (index >= 0 && index < proyectos.length) {
        const proyectoSeleccionado = proyectos[index];
        setMessages((prev) => [...prev, { from: "bot", text: "Esperando datos del proyecto..." }]);
        try {
          const res = await fetch(
            `${BACKEND_URL}/proyectos/nombre/${encodeURIComponent(proyectoSeleccionado.nombre_proyecto)}`
          );
          const data = await res.json();

          const resumen = generarResumen(data);
          setMessages((prev) => [...prev, { from: "bot", type: "resumen", data: resumen }]);
        } catch (err) {
          console.error(err);
          setMessages((prev) => [...prev, { from: "bot", text: "Ocurrió un error al obtener los detalles del proyecto." }]);
        }
        setState("INIT");
      } else {
        setMessages((prev) => [...prev, { from: "bot", text: "Por favor selecciona un número válido." }]);
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
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-white border border-gray-300 hover:shadow-lg rounded-full w-14 h-14 flex items-center justify-center shadow z-50"
        title="Chatbot"
      >
        <img src={avatarUrl} alt="bot" className="w-8 h-8 rounded-full" />
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
            <div className="flex items-center gap-2">
              <img src={avatarUrl} alt="bot" className="w-6 h-6 rounded-full" />
              <span className="font-semibold text-gray-800">Asistente</span>
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X size={18} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`px-3 py-2 rounded-lg max-w-[90%] ${
                  m.from === "user"
                    ? "bg-blue-100 text-blue-800 ml-auto"
                    : "bg-white border text-gray-800"
                }`}
              >
                {/* Mensaje normal */}
                {m.from === "bot" && m.type !== "resumen" && (
                  <div className="flex items-start gap-2">
                    <img src={avatarUrl} alt="bot" className="w-6 h-6 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <span>{m.text}</span>

                      {/* Lista enumerada de proyectos */}
                      {m.proyectosLista && (
                        <ul className="list-decimal list-inside text-sm text-gray-700 mt-1">
                          {m.proyectosLista.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {/* Resumen especial */}
                {m.type === "resumen" && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-blue-700 mb-2">
                      Resumen de "{m.data.nombre}"
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-xl shadow text-center">
                        <div className="text-xl font-bold">{m.data.totalCasos}</div>
                        <div className="text-sm text-gray-600">Total Casos</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-xl shadow text-center">
                        <div className="text-xl font-bold">{m.data.enEjecucion}</div>
                        <div className="text-sm text-gray-600">En Ejecución</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-xl shadow text-center">
                        <div className="text-xl font-bold">{m.data.pendientes}</div>
                        <div className="text-sm text-gray-600">Pendientes</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-xl shadow text-center">
                        <div className="text-xl font-bold">{m.data.porcentajeAvance}%</div>
                        <div className="text-sm text-gray-600">% Avance</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones de opciones */}
                {m.options && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {m.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionClick(opt)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs shadow"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
