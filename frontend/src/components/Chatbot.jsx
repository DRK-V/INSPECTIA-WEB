import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUser } from "./UserContext";

const avatarUrl = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";

function Chatbot() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [state, setState] = useState("INIT"); // INIT, WAIT_PROJECT_OPTION, WAIT_PROJECT_DETAIL
  const [proyectos, setProyectos] = useState([]);

  const iniciarSaludo = () => {
    if (user?.nombre && user?.apellido) {
      setMessages((prev) => [
        ...prev,
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
          const res = await fetch(`http://localhost:3000/proyectos/${user.id}`);
          const data = await res.json();
          setProyectos(data);

          if (data.length === 0) {
            setMessages((prev) => [...prev, { from: "bot", text: "No tienes proyectos asignados." }]);
            setState("INIT");
          } else {
            const proyectosEnumerados = data.map((p, idx) => `${idx + 1}. ${p.nombre_proyecto}`).join("\n");
            setMessages((prev) => [
              ...prev,
              { from: "bot", text: `Estos son tus proyectos:\n${proyectosEnumerados}` },
              { from: "bot", text: "¿Sobre cuál proyecto quieres información?", options: data.map((_, idx) => `${idx + 1}`) },
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
    // Cuando el usuario selecciona un proyecto
} else if (state === "WAIT_PROJECT_DETAIL") {
  const index = parseInt(option) - 1;
  if (index >= 0 && index < proyectos.length) {
    const proyectoSeleccionado = proyectos[index];
    setMessages((prev) => [...prev, { from: "bot", text: "Esperando datos del proyecto..." }]);
    try {
      const res = await fetch(
        `http://localhost:3000/proyectos/nombre/${encodeURIComponent(proyectoSeleccionado.nombre_proyecto)}`
      );
      const data = await res.json();

      // Generar resumen
      const resumen = generarResumen(data);
      setMessages((prev) => [
        ...prev,
        { from: "bot", type: "resumen", data: resumen }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Ocurrió un error al obtener los detalles del proyecto." }
      ]);
    }
    setState("INIT");
  } else {
    setMessages((prev) => [
      ...prev,
      { from: "bot", text: "Por favor selecciona un número válido." }
    ]);
  }
}

  };

const generarResumen = (data) => {
  const { proyecto, casos } = data;

  const pendientes = casos.filter(
    (c) => c.estado.toLowerCase() === "pendiente"
  ).length;

  const enEjecucion = casos.filter(
    (c) => c.estado.toLowerCase() === "en ejecución"
  ).length;

  const completados = casos.filter(
    (c) =>
      c.estado.toLowerCase() === "completado" ||
      c.estado.toLowerCase() === "finalizado"
  ).length;

  const totalCasos = casos.length;

  // Nuevo cálculo: Avance = (enEjecucion + completados) / totalCasos
  const porcentajeAvance =
    totalCasos > 0
      ? (((enEjecucion + completados) / totalCasos) * 100).toFixed(1)
      : 0;

  return {
    nombre: proyecto.nombre_proyecto,
    totalCasos,
    pendientes,
    enEjecucion,
    completados,
    porcentajeAvance,
  };
};





  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);

    if (state === "INIT") {
      iniciarSaludo();
    }

    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50"
        title="Chatbot"
      >
        <img src={avatarUrl} alt="bot" className="w-6 h-6 rounded-full" />
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
          <div className="bg-purple-600 text-white flex justify-between items-center px-4 py-2">
            <span className="font-bold">Chatbot</span>
            <button onClick={() => setOpen(false)}><X size={18} /></button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((m, idx) => (
  <div
    key={idx}
    className={`px-3 py-2 rounded-lg max-w-[90%] ${
      m.from === "user"
        ? "bg-purple-100 text-purple-800 ml-auto"
        : "bg-gray-50 text-gray-800"
    } `}
  >
    {/* Mensajes normales */}
    {m.from === "bot" && m.type !== "resumen" && (
      <div className="flex items-start gap-2">
        <img src={avatarUrl} alt="bot" className="w-6 h-6 rounded-full" />
        <span>{m.text}</span>
      </div>
    )}

    {/* Render especial para resumen */}
    {m.type === "resumen" && (
      <div className="space-y-3">
        <h4 className="font-bold text-purple-700 mb-2">
          Resumen de "{m.data.nombre}"
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-4 rounded-2xl shadow text-center">
            <div className="text-2xl font-bold">{m.data.totalCasos}</div>
            <div className="text-sm text-gray-600">Total Casos</div>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl shadow text-center">
            <div className="text-2xl font-bold">{m.data.enEjecucion}</div>
            <div className="text-sm text-gray-600">En Ejecución</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-2xl shadow text-center">
            <div className="text-2xl font-bold">{m.data.pendientes}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-2xl shadow text-center">
            <div className="text-2xl font-bold">{m.data.porcentajeAvance}%</div>
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
          >
            {opt}
          </button>
        ))}
      </div>
    )}
  </div>
))}

          </div>

          <div className="p-2 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe un mensaje..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button onClick={handleSend} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Enviar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
