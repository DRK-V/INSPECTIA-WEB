import React, { useState, useEffect } from "react";
import { useUser } from "../components/UserContext";
import { useNavigate } from "react-router-dom";
import NuevoProyectoModal from "../components/NuevoProyectoModal";
import Cookies from "js-cookie"; // 👈 Importamos cookies
const BACKEND_URL = "https://inspectia-web.onrender.com";
function Dashboard() {
  const { user } = useUser();
  const [proyectos, setProyectos] = useState([]);
  const [proyectosOrden, setProyectosOrden] = useState([]); // <--- Nuevo estado para el orden
  const [casos, setCasos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [asignarModal, setAsignarModal] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [selectedUsuarios, setSelectedUsuarios] = useState([]);
  const [successPopup, setSuccessPopup] = useState(false); // Nuevo estado para el popup
  const [popupMsg, setPopupMsg] = useState(""); // Mensaje dinámico para el popup
  const [loadingGenerar, setLoadingGenerar] = useState(false); // Estado de loading para generación de casos
  const navigate = useNavigate();

  //  Cargar proyectos
  useEffect(() => {
    if (!user) return;

    const fetchProyectos = async () => {
      try {
        const url =
          user.rol === "cliente"
            ? `${BACKEND_URL}/proyectos/${user.id}`
            : `${BACKEND_URL}/proyectos`;

        console.log("👉 Fetching proyectos desde:", url);
        const res = await fetch(url);
        let data = await res.json();
        console.log("📥 Proyectos recibidos del backend:", data);

        //  Si es manager → validar casos
        if (user.rol === "manager") {
          const proyectosConValidacion = await Promise.all(
            data.map(async (p) => {
              try {
                const resp = await fetch(
                  `${BACKEND_URL}/${p.id}/validar-casos`
                );
                const result = await resp.json();
                return { ...p, tieneCasos: result.tieneCasos };
              } catch (err) {
                console.error("Error validando casos:", err);
                return { ...p, tieneCasos: false };
              }
            })
          );
          data = proyectosConValidacion;
          console.log("📊 Proyectos manager con validación:", data);
        }

        //  Si es tester → filtrar solo los proyectos asignados a él
        if (user.rol === "tester") {
          data = data.filter((p) => {
            if (!p.asignado_a) return false;

            if (Array.isArray(p.asignado_a)) {
              return p.asignado_a.includes(user.id);
            }

            if (typeof p.asignado_a === "string") {
              return p.asignado_a
                .split(",")
                .map((id) => parseInt(id))
                .includes(user.id);
            }

            return p.asignado_a === user.id;
          });
        }

        // Si es cliente, obtener el total de casos por proyecto
        if (user.rol === "cliente") {
          data = await Promise.all(
            data.map(async (p) => {
              try {
                const resCasos = await fetch(
                  `${BACKEND_URL}/proyectos/${p.id}/casos`
                );
                const casos = await resCasos.json();
                return {
                  ...p,
                  total_casos: Array.isArray(casos) ? casos.length : 0,
                };
              } catch (err) {
                return { ...p, total_casos: 0 };
              }
            })
          );
          // Ordenar por id ascendente
          data = data.sort((a, b) => a.id - b.id);
        }

        // Guardar el orden por id ascendente
        if (user.rol === "cliente" && Array.isArray(data)) {
          setProyectosOrden(data.map((p) => p.id));
        }

        setProyectos(data);
      } catch (err) {
        console.error("❌ Error cargando proyectos:", err);
      }
    };

    fetchProyectos();
  }, [user]);

  //  Crear nuevo proyecto
  const handleProyectoCreado = (nuevoProyecto) => {
    setProyectos((prev) => {
      // Insertar y ordenar por id ascendente
      const nuevos = [...prev, nuevoProyecto];
      return nuevos.sort((a, b) => a.id - b.id);
    });
    setProyectosOrden((prev) => {
      const nuevos = [...prev, nuevoProyecto.id];
      return nuevos.sort((a, b) => a - b);
    });
    setPopupMsg("¡Proyecto creado exitosamente!");
    setSuccessPopup(true);
    setTimeout(() => setSuccessPopup(false), 3000);
  };

  //  Ver casos (para manager/tester)
  const verCasos = async (proyectoId) => {
    try {
      // Guardar proyectoId en cookies 👇
      Cookies.set("proyectoId", proyectoId);

      const res = await fetch(`${BACKEND_URL}/proyectos/${proyectoId}/casos`);
      const data = await res.json();
      setCasos(data);

      // Navegar a la ruta de casos
      navigate(`/proyectos/${proyectoId}/casos`);
    } catch (err) {
      console.error("Error cargando casos:", err);
    }
  };

  //  Subir evidencia (tester)
  const subirEvidencia = async (casoId, archivo, estado) => {
    const formData = new FormData();
    formData.append("caso_id", casoId);
    formData.append("estado", estado);
    if (archivo) formData.append("archivo", archivo);

    try {
      const res = await fetch(`${BACKEND_URL}/evidencias`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // alert("Evidencia subida ✅");
        setPopupMsg("¡Evidencia subida exitosamente!");
        setSuccessPopup(true);
        setTimeout(() => setSuccessPopup(false), 3000);
        setCasos((prev) =>
          prev.map((c) =>
            c.id === casoId ? { ...c, estado, evidencia: data.archivo } : c
          )
        );
      } else {
        // alert("Error: " + data.message);
        setPopupMsg("Error: " + data.message);
        setSuccessPopup(true);
        setTimeout(() => setSuccessPopup(false), 3000);
      }
    } catch (err) {
      console.error("Error subiendo evidencia:", err);
      setPopupMsg("Error subiendo evidencia");
      setSuccessPopup(true);
      setTimeout(() => setSuccessPopup(false), 3000);
    }
  };

  // -----------------  Asignación de proyectos -----------------
  const abrirAsignarModal = async (proyecto) => {
    setSelectedProyecto(proyecto);
    try {
      const res = await fetch(`${BACKEND_URL}/users`);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
    setAsignarModal(true);
  };

  const toggleUsuario = (id) => {
    setSelectedUsuarios((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const asignarUsuarios = async () => {
    try {
      for (let usuarioId of selectedUsuarios) {
        await fetch(`${BACKEND_URL}/asignarProyecto`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proyecto_id: selectedProyecto.id,
            usuario_id: usuarioId,
          }),
        });
      }

      setAsignarModal(false);
      setSelectedUsuarios([]);
      setSelectedProyecto(null);
      setPopupMsg("¡Usuarios asignados exitosamente!");
      setSuccessPopup(true);
      setTimeout(() => setSuccessPopup(false), 3000);
    } catch (err) {
      console.error("Error asignando usuarios:", err);
      // alert("❌ Error asignando usuarios");
      setPopupMsg("❌ Error asignando usuarios");
      setSuccessPopup(true);
      setTimeout(() => setSuccessPopup(false), 3000);
    }
  };

  // ----------------- UI -----------------
  if (!user) {
    return (
      <div className="py-20 text-center text-xl">
        Debes iniciar sesión para ver el dashboard.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Popup de éxito al crear proyecto, asignar usuarios o generar casos */}
      {successPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded shadow-lg flex flex-col items-center">
            <span className="font-semibold mb-2">{popupMsg}</span>
          </div>
        </div>
      )}
      {/* Loading para generación de casos */}
      {loadingGenerar && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white px-8 py-6 rounded shadow-lg flex flex-col items-center border border-purple-200 pointer-events-auto">
            <span className="mb-2 font-semibold text-lg">
              Generando casos...
            </span>
            <div className="loader border-4 border-purple-200 border-t-purple-600 rounded-full w-8 h-8 animate-spin"></div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">
        Bienvenido, {user.nombre} {user.apellido}
      </h1>

      {/* ----------------- CLIENTE ----------------- */}
      {user.rol === "cliente" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Mis Proyectos</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              + Nuevo Proyecto
            </button>
          </div>

          {proyectos.length === 0 ? (
            <p>No tienes proyectos registrados.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proyectosOrden
                .map((id) => proyectos.find((p) => p.id === id))
                .filter(Boolean)
                .map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-bold">{p.nombre_proyecto}</h2>
                      <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                        {p.estado || "En Progreso"}
                      </span>
                    </div>
                    <p className="text-gray-600">{p.descripcion}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      creado:{" "}
                      {p.fecha_creacion
                        ? new Date(p.fecha_creacion).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Pendiente"}
                      {" • "}
                      {p.total_casos || 0} casos generados
                    </p>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => verCasos(p.id)} // 👈 ahora guarda en cookies
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Ver Detalles
                      </button>

                      {p.archivo_hu && (
                        <a
                          href={`${BACKEND_URL}/proyectos/${p.id}/hu`}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                        >
                          Descargar HU
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          <NuevoProyectoModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            usuarioId={user.id}
            onProyectoCreado={handleProyectoCreado}
          />
        </>
      )}

      {/* ----------------- MANAGER ----------------- */}
      {user.rol === "manager" && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            📋 Proyectos QA
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700 uppercase tracking-wide text-xs">
                  <th className="py-3 px-4 border-b">Nombre</th>
                  <th className="py-3 px-4 border-b">Cliente</th>
                  <th className="py-3 px-4 border-b">Archivo HU</th>
                  <th className="py-3 px-4 border-b text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {[...proyectos]
                  .sort((a, b) => a.id - b.id)
                  .map((p) => (
                    <tr
                      key={p.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {p.nombre_proyecto}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {p.usuarios?.nombre || "Desconocido"}
                      </td>
                      <td className="py-3 px-4">
                        {p.archivo_hu ? (
                          <a
                            href={`${BACKEND_URL}/proyectos/${p.id}/hu`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline truncate max-w-[180px] inline-block"
                            title="Descargar archivo de Historias de Usuario"
                          >
                            Descargar HU
                          </a>
                        ) : (
                          <span className="text-gray-400 italic">
                            Sin archivo
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={() => verCasos(p.id)}
                          aria-label="Ver Casos"
                          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition"
                        >
                          📑 Ver Casos
                        </button>

                        {!p.tieneCasos && (
                          <button
                            onClick={async () => {
                              try {
                                setLoadingGenerar(true);
                                const validarRes = await fetch(
                                  `${BACKEND_URL}/${p.id}/validar-casos`
                                );
                                const validarData = await validarRes.json();

                                if (validarData.existe) {
                                  setLoadingGenerar(false);
                                  setPopupMsg(
                                    `⚠️ ${validarData.message} (Cantidad: ${validarData.cantidad})`
                                  );
                                  setSuccessPopup(true);
                                  setTimeout(
                                    () => setSuccessPopup(false),
                                    3000
                                  );
                                  return;
                                }

                                const res = await fetch(
                                  `${BACKEND_URL}/proyectos/${p.id}/generar-casos`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ proyectoId: p.id }),
                                  }
                                );
                                const data = await res.json();
                                setLoadingGenerar(false);

                                if (res.ok) {
                                  setPopupMsg(
                                    "✅ Casos generados exitosamente"
                                  );
                                  setSuccessPopup(true);
                                  setTimeout(
                                    () => setSuccessPopup(false),
                                    3000
                                  );
                                  verCasos(p.id);
                                  setProyectos((prev) =>
                                    prev.map((proj) =>
                                      proj.id === p.id
                                        ? { ...proj, tieneCasos: true }
                                        : proj
                                    )
                                  );
                                } else {
                                  setPopupMsg(
                                    "⚠️ Error: " +
                                      (data.message || "Ocurrió un error")
                                  );
                                  setSuccessPopup(true);
                                  setTimeout(
                                    () => setSuccessPopup(false),
                                    3000
                                  );
                                }
                              } catch (err) {
                                setLoadingGenerar(false);
                                console.error(
                                  "Error en generación de casos:",
                                  err
                                );
                                setPopupMsg(
                                  "❌ Error en la conexión con el servidor"
                                );
                                setSuccessPopup(true);
                                setTimeout(() => setSuccessPopup(false), 3000);
                              }
                            }}
                            aria-label="Generar Casos"
                            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition"
                          >
                            ⚡ Generar Casos
                          </button>
                        )}

                        <button
                          onClick={() => abrirAsignarModal(p)}
                          aria-label="Asignar Proyecto"
                          className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition"
                        >
                          👤 Asignar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- TESTER ----------------- */}
      {user.rol === "tester" && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
            Proyectos Asignados
          </h2>

          {proyectos.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No tienes proyectos asignados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <th className="py-3 px-4 border-b font-medium text-left">
                      Nombre
                    </th>
                    <th className="py-3 px-4 border-b font-medium text-left">
                      Descripción
                    </th>
                    <th className="py-3 px-4 border-b font-medium text-center">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {proyectos.map((p, index) => (
                    <tr
                      key={p.id}
                      className={`transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                    >
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {p.nombre_proyecto}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {p.descripcion}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => verCasos(p.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-sm transition"
                        >
                          Ver Casos
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ----------------- MODAL DE ASIGNACIÓN ----------------- */}
      {asignarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[420px] border border-gray-200 pointer-events-auto animate-fade-in">
            {/* Header */}
            <h3 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-purple-600 rounded-full"></span>
              Asignar Proyecto
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Proyecto seleccionado:{" "}
              <span className="font-semibold text-gray-800">
                {selectedProyecto?.nombre_proyecto}
              </span>
            </p>

            {/* Lista de usuarios */}
            <div className="max-h-60 overflow-y-auto border rounded-lg p-3 mb-6">
              {usuarios.filter((u) => u.rol === "tester").length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No hay testers disponibles.
                </p>
              ) : (
                usuarios
                  .filter((u) => u.rol === "tester")
                  .map((u) => (
                    <label
                      key={u.id}
                      className="flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsuarios.includes(u.id)}
                        onChange={() => toggleUsuario(u.id)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-700">
                        {u.nombre} {u.apellido}
                      </span>
                    </label>
                  ))
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAsignarModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={asignarUsuarios}
                disabled={selectedUsuarios.length === 0}
                className={`px-5 py-2 rounded-lg text-sm font-medium shadow-md transition ${
                  selectedUsuarios.length === 0
                    ? "bg-purple-300 text-white cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
