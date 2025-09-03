import { useParams, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const BACKEND_URL = "https://inspectia-web.onrender.com";
export default function CasosPage() {
  const { id } = useParams(); // id del proyecto
  const [casos, setCasos] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  // Normalizar estado
  const normalizarEstado = (estado) => (estado || "").toLowerCase();

  useEffect(() => {
    const fetchCasos = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/proyectos/${id}/casos`
        );
        if (!res.ok) throw new Error("Error cargando casos");
        const data = await res.json();

        // 🔹 Orden fijo por ID
        const ordenados = [...data].sort((a, b) => a.id - b.id);
        setCasos(ordenados);
      } catch (err) {
        console.error("Error cargando casos:", err);
      }
    };
    fetchCasos();
  }, [id]);

  // Cambiar estado en backend
  const handleChangeEstado = async (casoId, nuevoEstado) => {
    try {
      // Actualizar estado del caso
      console.log("Enviando petición PUT a:", `${BACKEND_URL}/casos/${casoId}/estado`, "con body:", { estado: nuevoEstado });
      const res = await fetch(
        `${BACKEND_URL}/casos/${casoId}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );
      const json = await res.json();
      console.log("Respuesta de /casos/:id/estado:", json);

      if (!res.ok) throw new Error("Error actualizando caso");

      setCasos((prev) =>
        prev.map((c) => (c.id === casoId ? { ...c, estado: nuevoEstado } : c))
      );

      // Notificar cambio de estado al proyecto (sin body ni headers)
      console.log("Enviando petición PUT a:", `${BACKEND_URL}/${id}/estado`);
      const resProyecto = await fetch(
        `${BACKEND_URL}/${id}/estado`,
        {
          method: "PUT"
        }
      );
      const jsonProyecto = await resProyecto.json().catch(() => ({}));
      console.log("Respuesta de /:id/estado:", jsonProyecto);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  // Drag & Drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const casoId = parseInt(draggableId, 10);
    const nuevoEstado =
      destination.droppableId === "NEW"
        ? "Pendiente"
        : destination.droppableId === "ACTIVE"
        ? "En Ejecución"
        : destination.droppableId === "FAIL"
        ? "Fallo"
        : "Finalizado";

    handleChangeEstado(casoId, nuevoEstado);
  };

  // Agrupar casos
  const columnas = {
    NEW: casos.filter((c) => {
      const estado = normalizarEstado(c.estado);
      return estado === "pendiente" || estado === "nuevo" || estado === "";
    }),
    ACTIVE: casos.filter(
      (c) => normalizarEstado(c.estado) === "en ejecución"
    ),
    FAIL: casos.filter((c) => normalizarEstado(c.estado) === "fallo"),
    CLOSED: casos.filter(
      (c) =>
        normalizarEstado(c.estado) === "finalizado" ||
        normalizarEstado(c.estado) === "cerrado"
    ),
  };

  // Nombres y colores de columnas
  const COLUMN_CONFIG = {
    NEW: { label: "Pendientes", color: "bg-blue-100 border-blue-400" },
    ACTIVE: { label: "En Ejecución", color: "bg-yellow-100 border-yellow-400" },
    FAIL: { label: "Fallidos", color: "bg-red-100 border-red-400" },
    CLOSED: { label: "Finalizados", color: "bg-green-100 border-green-400" },
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
         
          Casos de Prueba - Proyecto {id}
        </h2>
        <Link
          to="/dashboard"
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          ⬅ Volver
        </Link>
      </div>

      {/* Tablero */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(columnas).map(([col, items]) => (
            <Droppable droppableId={col} key={col}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`rounded-lg shadow p-3 min-h-[350px] border-2 transition-all
                    ${COLUMN_CONFIG[col].color}
                    ${snapshot.isDraggingOver ? "ring-4 ring-blue-300" : ""}
                  `}
                >
                  <h3 className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
                    {/* Iconos por columna */}
                    {col === "NEW" && <span>🆕</span>}
                    {col === "ACTIVE" && <span>⚡</span>}
                    {col === "FAIL" && <span>❌</span>}
                    {col === "CLOSED" && <span>✅</span>}
                    {COLUMN_CONFIG[col].label}
                  </h3>

                  {items.length === 0 && (
                    <p className="text-gray-400 text-sm text-center">Vacío</p>
                  )}

                  <div className="space-y-3">
                    {items.map((c, index) => (
                      <Draggable
                        key={c.id.toString()}
                        draggableId={c.id.toString()}
                        index={index}
                        isDragDisabled={user?.rol !== "tester"}
                      >
                        {(provided, snapshot) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className={`bg-white p-3 rounded shadow hover:shadow-lg transition cursor-pointer border-l-4
                              ${
                                col === "NEW"
                                  ? "border-blue-400"
                                  : col === "ACTIVE"
                                  ? "border-yellow-400"
                                  : col === "FAIL"
                                  ? "border-red-400"
                                  : "border-green-400"
                              }
                              ${snapshot.isDragging ? "scale-105 ring-2 ring-blue-200" : ""}
                            `}
                            onClick={() =>
                              navigate(`/proyectos/${id}/casos/${c.id}`)
                            }
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm truncate">
                                📝 {c.descripcion}
                              </span>
                              <span className="text-xs text-gray-400 ml-2">#{c.id}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600">
                                {c.estado || "Pendiente"}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
