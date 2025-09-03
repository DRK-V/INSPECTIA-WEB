import React, { useState } from "react";

// Puedes reemplazar esta URL por la imagen que desees
const avatarUrl = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";

const API_KEY = "AIzaSyBqUaK5uLKOb0DXV0JjQGFPwkTeYWURXVE";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

function GeminiChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtén el contexto de la página landing (puedes ajustar esto según tu estructura)
  // Aquí se toma el texto de todo el body, pero puedes limitarlo a una sección específica si lo prefieres.
  const getLandingContext = () => {
    const landing = document.getElementById("landing");
    return landing ? landing.innerText : document.body.innerText;
  };

const handleSend = async () => {
  if (!input.trim()) return;
  const userMsg = { from: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setLoading(true);

  try {
    const context = getLandingContext();
    const prompt = `
Eres un asistente en una landing page.
Tu tarea es responder de forma resumida, clara y útil (máximo 3-4 oraciones).
Enfócate en lo esencial y evita divagar.

Contexto de la página: ${context}

Pregunta del usuario: ${input}
    `;

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();
    const geminiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.response ||
      "No tengo respuesta en este momento.";

    setMessages((prev) => [...prev, { from: "bot", text: geminiResponse }]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { from: "bot", text: "Ocurrió un error al consultar Gemini." },
    ]);
  }
  setLoading(false);
};


  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full bg-white p-2 border border-gray-200 hover:scale-105 transition"
        style={{ width: 64, height: 64 }}
        aria-label="Abrir chat Gemini"
      >
        <img
          src={avatarUrl}
          alt="Gemini Chat"
          className="rounded-full w-full h-full object-cover"
        />
      </button>

      {/* Modal de chat */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end pointer-events-none">
          <div className="relative w-80 bg-white rounded-xl shadow-2xl flex flex-col max-h-[80vh] pointer-events-auto">
            <div className="flex items-center gap-2 p-4 border-b">
              <img src={avatarUrl} alt="Gemini" className="w-8 h-8 rounded-full" />
              <span className="font-semibold text-purple-700">ChatBot</span>
              <button
                className="ml-auto text-gray-400 hover:text-gray-700"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg text-sm ${
                      msg.from === "user"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-gray-400 text-xs">Gemini está escribiendo...</div>
              )}
            </div>
            <form
              className="flex border-t p-2 gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Escribe tu consulta..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-3 py-1 rounded disabled:opacity-50"
                disabled={loading || !input.trim()}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default GeminiChatBot;
