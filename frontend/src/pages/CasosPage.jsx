import { useParams, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
          `http://localhost:3000/api/users/proyectos/${id}/casos`
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
      const res = await fetch(
        `http://localhost:3000/api/users/casos/${casoId}/estado`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      if (!res.ok) throw new Error("Error actualizando caso");

      setCasos((prev) =>
        prev.map((c) => (c.id === casoId ? { ...c, estado: nuevoEstado } : c))
      );
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

  return (
    <div className="p-6">
    
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📋 Casos de Prueba - Proyecto {id}</h2>
        <Link
          to="/dashboard"
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          ⬅ Volver
        </Link>
      </div>

      {/* Tablero */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(columnas).map(([col, items]) => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-100 rounded-lg shadow p-4 min-h-[400px]"
                >
                  <h3 className="text-lg font-bold mb-4 text-center">{col}</h3>

                  {items.length === 0 && (
                    <p className="text-gray-400 text-sm text-center">Vacío</p>
                  )}

                  <div className="space-y-3">
                    {items.map((c, index) => (
                      <Draggable
                        key={c.id.toString()}
                        draggableId={c.id.toString()}
                        index={index}
                        isDragDisabled={user?.rol !== "tester"} // 👈 solo tester puede mover
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="bg-white p-3 rounded shadow hover:shadow-lg transition cursor-pointer"
                            onClick={() =>
                              navigate(`/proyectos/${id}/casos/${c.id}`)
                            } 
                          >
                            <p className="font-semibold text-sm">
                              📝 {c.descripcion}
                            </p>
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
