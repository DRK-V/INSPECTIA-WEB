import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
const BACKEND_URL = "https://inspectia-web.onrender.com";
export default function CasoDetalle({ rol = "tester" }) {
  const { casoId } = useParams();
  const [caso, setCaso] = useState(null);
  const [proyecto, setProyecto] = useState(null);
  const [estado, setEstado] = useState("Pendiente");
  const [resultado, setResultado] = useState("aprobado");

  const [comentariosHistorial, setComentariosHistorial] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [ejecucionId, setEjecucionId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  //manejo de evidencias por comentario (cacheadas)
  const [evidencias, setEvidencias] = useState({});
  const [comentarioExpandido, setComentarioExpandido] = useState(null);

  const proyectoId = Cookies.get("proyectoId");
  const testerId = Cookies.get("testerId") || 1;

  //carga caso + proyecto
  useEffect(() => {
    const fetchCasoYProyecto = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/casos/${casoId}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
        const dataCaso = await res.json();

        if (typeof dataCaso.pasos === "string") {
          dataCaso.pasos = dataCaso.pasos
            .split(/\r?\n/)
            .map((p) => p.trim())
            .filter(Boolean);
        }
        setCaso(dataCaso);

        if (proyectoId) {
          const resCasos = await fetch(
            `${BACKEND_URL}/proyectos/${proyectoId}/casos`
          );
          const lista = await resCasos.json();
          const actual = lista.find((c) => c.id === parseInt(casoId, 10));
          if (actual?.estado) setEstado(actual.estado);

          const resProyecto = await fetch(
            `${BACKEND_URL}/proyecto/${proyectoId}`
          );
          const dataProyecto = await resProyecto.json();
          setProyecto(dataProyecto);
        }
      } catch (err) {
        console.error("Error cargando detalle:", err);
      }
    };

    fetchCasoYProyecto();
  }, [casoId, proyectoId]);

  //carga comentarios
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/ejecuciones/${casoId}`);
        if (!res.ok) return;
        const data = await res.json();
        setComentariosHistorial(data || []);
      } catch (err) {
        console.error("Error cargando comentarios:", err);
      }
    };
    fetchComentarios();
  }, [casoId]);

  const handleEstadoChange = async (nuevo) => {
    setEstado(nuevo);
    if (!proyectoId) return;
    try {
      // Petición a proyecto
      console.log(`Enviando petición a ${BACKEND_URL}/${proyectoId}/estado con estado:`, nuevo);
      const res = await fetch(
        `${BACKEND_URL}/${proyectoId}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevo }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar estado");
      console.log("Respuesta de /proyecto_id/estado:", data);

      // Petición adicional a casos/id/estado
      const resCaso = await fetch(
        `${BACKEND_URL}/casos/${casoId}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevo }),
        }
      );
      const dataCaso = await resCaso.json();
      if (!resCaso.ok) throw new Error(dataCaso.message || "Error al actualizar estado del caso");
      console.log("Respuesta de /casos/id/estado:", dataCaso);

    } catch (err) {
      console.error("Error actualizando estado:", err);
      alert("Error al actualizar el estado");
    }
  };

  const handleFileChange = (e) => setImagenes([...imagenes, ...e.target.files]);

  const [popup, setPopup] = useState(null);

  // guardar comentario nuevo
  const handleGuardar = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/ejecuciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caso_id: parseInt(casoId, 10),
          tester_id: testerId,
          resultado,
          comentarios: nuevoComentario,
        }),
      });

      const data = await res.json();
      const id = data.ejecucion?.id;
      if (!id) throw new Error("No se recibió ejecucion_id válido");
      setEjecucionId(id);

      if (imagenes.length > 0) {
        for (const file of imagenes) {
          const formData = new FormData();
          formData.append("ejecucion_id", id);
          formData.append("tipo", "imagen");
          formData.append("archivo", file);

          await fetch(`${BACKEND_URL}/evidencias`, {
            method: "POST",
            body: formData,
          });
        }
      }

      // actualizar historial
      setComentariosHistorial([
        ...comentariosHistorial,
        { id, comentarios: nuevoComentario, tester_id: testerId },
      ]);

      setNuevoComentario("");
      setImagenes([]);
      setMostrarFormulario(false);

      // Mostrar popup de éxito por 3 segundos
      setPopup("✅ Comentario guardado correctamente");
      setTimeout(() => setPopup(null), 3000);
    } catch (err) {
      console.error("Error guardando ejecución/evidencias:", err);
      alert("❌ Error al guardar comentario o evidencias");
    }
  };

  // toggle desplegar comentario con evidencias
  const toggleComentario = async (ejecucionId) => {
    if (comentarioExpandido === ejecucionId) {
      setComentarioExpandido(null);
      return;
    }
    setComentarioExpandido(ejecucionId);

    if (!evidencias[ejecucionId]) {
      try {
        const res = await fetch(`${BACKEND_URL}/evidencias/${ejecucionId}`);
        if (!res.ok) return;
        const data = await res.json();
        setEvidencias((prev) => ({
          ...prev,
          [ejecucionId]: data || [],
        }));
      } catch (err) {
        console.error("Error cargando evidencias:", err);
      }
    }
  };

  if (!caso)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg text-gray-600">Cargando caso...</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Popup temporal */}
      {popup && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg animate-fade-in">
          {popup}
        </div>
      )}
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white shadow-md border-b border-blue-200 flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2">Tarea {caso.id}</span>
            {caso.titulo}
          </h2>
          <p className="text-xs text-gray-500 mt-1">Generado por: {caso.generado_por || "IA"}</p>
        </div>
        <Link
          to={`/proyectos/${proyectoId}/casos`}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition"
        >
          ⬅ Volver a Casos
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna principal */}
        <section className="md:col-span-2 space-y-8">
          {/* Descripción */}
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              Descripción
            </h3>
            <p className="text-gray-700">{caso.descripcion || "Sin descripción"}</p>
          </div>

          {/* Pasos */}
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-indigo-400">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-indigo-400 rounded-full"></span>
              Pasos a seguir
            </h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-1 pl-4">
              {(caso.pasos || []).map((p, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-indigo-100 rounded-full"></span>
                  {p}
                </li>
              ))}
            </ol>
          </div>

          {/* Resultado esperado */}
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-400">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
              Resultados esperados
            </h3>
            <p className="bg-green-50 border border-green-200 rounded p-3 text-green-800 font-medium flex items-center gap-2">
              <span className="material-icons text-green-400"></span>
              {caso.resultado_esperado || "No definido"}
            </p>
          </div>

          {/* Comentarios */}
          {rol === "tester" && (
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-400">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
                Discusión
              </h3>
              {comentariosHistorial.length > 0 ? (
                <ul className="mb-4 space-y-4">
                  {comentariosHistorial.map((c, idx) => (
                    <li
                      key={c.id}
                      className={`relative group transition border rounded-xl p-4 bg-gradient-to-r from-yellow-50 to-white shadow-sm hover:shadow-lg`}
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleComentario(c.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                            {String(c.tester_id || "T")[0]}
                          </div>
                          <span className="text-gray-800">{c.comentarios}</span>
                        </div>
                        <span className="text-blue-600 text-xs font-semibold ml-2 group-hover:underline">
                          {comentarioExpandido === c.id ? "▲ Ocultar" : "▼ Ver evidencias"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1 ml-11">
                        {/* Timestamp ficticio */}
                        {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                      </div>
                      {/* evidencias */}
                      {comentarioExpandido === c.id && (
                        <div className="mt-4 pl-11 animate-fade-in">
                          {evidencias[c.id] && evidencias[c.id].length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {evidencias[c.id].map((ev, idx) => (
                                <div key={idx} className="border rounded-lg overflow-hidden bg-gray-50 shadow">
                                  <img
                                    src={`${BACKEND_URL}/${ev.archivo_url}`}
                                    alt="Evidencia"
                                    className="w-full h-32 object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No hay evidencias</p>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm mb-4">No hay comentarios aún</p>
              )}

              {!mostrarFormulario && (
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded shadow hover:bg-yellow-500 transition"
                >
                  ➕ Añadir comentario
                </button>
              )}

              {mostrarFormulario && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  <textarea
                    className="w-full border rounded p-2 focus:ring-2 focus:ring-yellow-300"
                    rows="3"
                    placeholder="Escribe tu comentario..."
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                  />

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.log,.pdf"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-600"
                  />
                  {imagenes.length > 0 && (
                    <ul className="mb-2 text-sm text-gray-600">
                      {Array.from(imagenes).map((file, idx) => (
                        <li key={idx}>📂 {file.name}</li>
                      ))}
                    </ul>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={handleGuardar}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={() => setMostrarFormulario(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Columna lateral */}
        <aside className="space-y-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-400">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
              Plan
            </h3>
            <p>
              <span className="font-semibold">Estado:</span>{" "}
              {rol === "tester" ? (
                <select
                  value={estado}
                  onChange={(e) => handleEstadoChange(e.target.value)}
                  className="border p-1 rounded w-full mt-1 focus:ring-2 focus:ring-blue-300"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Ejecución">En Ejecución</option>
                  <option value="Finalizado">Finalizado</option>
                   <option value="Fallo">Fallo</option>
                </select>
              ) : (
                <span className="inline-block px-2 py-1 bg-blue-100 rounded text-blue-700">{estado}</span>
              )}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-400">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
              Datos requeridos
            </h3>
            {proyecto?.url_sitio && (
              <p>
                <span className="font-semibold">URL página:</span>{" "}
                <a
                  href={proyecto.url_sitio}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {proyecto.url_sitio}
                </a>
              </p>
            )}
            {proyecto?.url_descarga && (
              <p>
                <span className="font-semibold">Mockup:</span>{" "}
                <a
                  href={proyecto.url_descarga}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {proyecto.url_descarga}
                </a>
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-gray-400">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
              Trabajo
            </h3>
            <p>
              <span className="font-semibold">Parent:</span>{" "}
              Proyecto {proyecto?.nombre_proyecto || "Cargando..."}
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
