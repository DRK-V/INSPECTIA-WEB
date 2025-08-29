import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

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

  // 👇 manejo de evidencias por comentario (cacheadas)
  const [evidencias, setEvidencias] = useState({});
  const [comentarioExpandido, setComentarioExpandido] = useState(null);

  const proyectoId = Cookies.get("proyectoId");
  const testerId = Cookies.get("testerId") || 1;

  // 🔹 carga caso + proyecto
  useEffect(() => {
    const fetchCasoYProyecto = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/casos/${casoId}`);
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
            `http://localhost:3000/api/users/proyectos/${proyectoId}/casos`
          );
          const lista = await resCasos.json();
          const actual = lista.find((c) => c.id === parseInt(casoId, 10));
          if (actual?.estado) setEstado(actual.estado);

          const resProyecto = await fetch(
            `http://localhost:3000/api/users/proyecto/${proyectoId}`
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

  // 🔹 carga comentarios
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/ejecuciones/${casoId}`);
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
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/casos/${casoId}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevo }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar estado");
      console.log("✅ Estado actualizado:", data);
    } catch (err) {
      console.error("Error actualizando estado:", err);
      alert("Error al actualizar el estado");
    }
  };

  const handleFileChange = (e) => setImagenes([...imagenes, ...e.target.files]);

  // 🔹 guardar comentario nuevo
  const handleGuardar = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/users/ejecuciones", {
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

          await fetch("http://localhost:3000/api/users/evidencias", {
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

      alert("✅ Comentario guardado correctamente");
    } catch (err) {
      console.error("Error guardando ejecución/evidencias:", err);
      alert("❌ Error al guardar comentario o evidencias");
    }
  };

  // 🔹 toggle desplegar comentario con evidencias
  const toggleComentario = async (ejecucionId) => {
    if (comentarioExpandido === ejecucionId) {
      setComentarioExpandido(null);
      return;
    }
    setComentarioExpandido(ejecucionId);

    if (!evidencias[ejecucionId]) {
      try {
        const res = await fetch(`http://localhost:3000/api/users/evidencias/${ejecucionId}`);
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

  if (!caso) return <p className="p-6">Cargando caso...</p>;

  return (
    <div className="p-6 w-full bg-gray-100 min-h-screen">
      {/* Encabezado */}
      <div className="bg-white p-4 shadow rounded mb-6 border-b-4 border-blue-600">
        <h2 className="text-2xl font-bold">Tarea {caso.id} - {caso.titulo}</h2>
        <p className="text-sm text-gray-500">Generado por: {caso.generado_por || "IA"}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Columna izquierda */}
        <div className="col-span-2 space-y-6">
          {/* Description */}
          <section className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">descripcion</h3>
            <p className="text-gray-700">{caso.descripcion || "Sin descripción"}</p>
          </section>

          {/* Pasos */}
          <section className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">pasos a seguir</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {(caso.pasos || []).map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </section>

          {/* Resultado esperado */}
          <section className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Resultados esperados</h3>
            <p className="bg-green-50 border border-green-200 rounded p-2">
              {caso.resultado_esperado || "No definido"}
            </p>
          </section>

          {/* Comentarios */}
          {rol === "tester" && (
            <section className="bg-white shadow rounded p-4">
              <h3 className="text-lg font-semibold mb-2">Discusión</h3>

              {comentariosHistorial.length > 0 ? (
                <ul className="mb-4 space-y-2">
                  {comentariosHistorial.map((c) => (
                    <li key={c.id} className="border rounded p-2 bg-gray-50">
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleComentario(c.id)}
                      >
                        <span>💬 {c.comentarios}</span>
                        <span className="text-blue-600 text-sm">
                          {comentarioExpandido === c.id ? "▲ Ocultar" : "▼ Ver evidencias"}
                        </span>
                      </div>

                      {/* evidencias */}
                      {comentarioExpandido === c.id && (
                        <div className="mt-2 pl-4">
                          {evidencias[c.id] && evidencias[c.id].length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                              {evidencias[c.id].map((ev, idx) => (
                                <div key={idx} className="border rounded overflow-hidden">
                                  <img
                                    src={`http://localhost:3000/${ev.archivo_url}`}
                                    alt="Evidencia"
                                    className="w-full object-cover"
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
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                >
                  ➕ Añadir comentario
                </button>
              )}

              {mostrarFormulario && (
                <div className="mt-4 space-y-3">
                  <textarea
                    className="w-full border rounded p-2"
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
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      💾 Guardar
                    </button>
                    <button
                      onClick={() => setMostrarFormulario(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Columna derecha */}
        <div className="col-span-1 space-y-6">
          <section className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Plan</h3>
            <p>
              <span className="font-semibold">Estado:</span>{" "}
              {rol === "tester" ? (
                <select
                  value={estado}
                  onChange={(e) => handleEstadoChange(e.target.value)}
                  className="border p-1 rounded w-full mt-1"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Ejecución">En Ejecución</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              ) : (
                <span>{estado}</span>
              )}
            </p>
          </section>

          <section className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">datos requeridos</h3>
            {proyecto?.url_sitio && (
              <p>
                url-pag{" "}
                <a
                  href={proyecto.url_sitio}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {proyecto.url_sitio}
                </a>
              </p>
            )}
            {proyecto?.url_descarga && (
              <p>
                mokup{" "}
                <a
                  href={proyecto.url_descarga}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {proyecto.url_descarga}
                </a>
              </p>
            )}
          </section>

          <section className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-2">Trabajo</h3>
            <p>Parent: Proyecto {proyecto?.nombre_proyecto || "Cargando..."}</p>
          </section>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to={`/proyectos/${proyectoId}/casos`}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 inline-block"
        >
          ⬅ Back to Cases
        </Link>
      </div>
    </div>
  );
}
