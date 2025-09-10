import { useParams, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import { useToast } from "../components/Toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  MoreVertical,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Archive,
  RefreshCw,
  GripVertical,
  Loader2
} from "lucide-react";

const BACKEND_URL = "https://inspectia-web.onrender.com";

export default function CasosPage() {
  const { id } = useParams();
  const [casos, setCasos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showStats, setShowStats] = useState(true);
  const [casosUpdating, setCasosUpdating] = useState(new Set()); // IDs de casos siendo actualizados
  const { user } = useUser();
  const toast = useToast();
  const navigate = useNavigate();

  // Normalizar estado
  const normalizarEstado = (estado) => (estado || "").toLowerCase();

  useEffect(() => {
    const fetchCasos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/proyectos/${id}/casos`);
        if (!res.ok) throw new Error("Error cargando casos");
        const data = await res.json();

        // Orden fijo por ID
        const ordenados = [...data].sort((a, b) => a.id - b.id);
        setCasos(ordenados);
      } catch (err) {
        console.error("Error cargando casos:", err);
        toast.error("Error cargando casos de prueba");
      }
    };
    fetchCasos();
  }, [id, toast]);

  // Cambiar estado en backend (versión original)
  const handleChangeEstado = async (casoId, nuevoEstado) => {
    try {
      const res = await fetch(`${BACKEND_URL}/casos/${casoId}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error actualizando caso");

      setCasos((prev) =>
        prev.map((c) => (c.id === casoId ? { ...c, estado: nuevoEstado } : c))
      );

      // Notificar cambio de estado al proyecto
      await fetch(`${BACKEND_URL}/${id}/estado`, {
        method: "PUT"
      });

      toast.success(`Caso actualizado a: ${nuevoEstado}`);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      toast.error("Error al actualizar el estado del caso");
    }
  };

  // Cambiar estado con actualización optimista
  const handleChangeEstadoOptimistic = async (casoId, nuevoEstado, estadoOriginal) => {
    // Agregar al set de casos en actualización
    setCasosUpdating(prev => new Set([...prev, casoId]));
    
    try {
      const res = await fetch(`${BACKEND_URL}/casos/${casoId}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error actualizando caso");

      // Notificar cambio de estado al proyecto
      await fetch(`${BACKEND_URL}/${id}/estado`, {
        method: "PUT"
      });

      // Confirmación exitosa
      toast.success(`✅ Caso actualizado a: ${nuevoEstado}`);
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      
      // Rollback - revertir el cambio en la UI
      setCasos((prev) =>
        prev.map((c) => (c.id === casoId ? { ...c, estado: estadoOriginal } : c))
      );
      
      toast.error(`❌ Error: No se pudo actualizar el caso. Revertiendo cambios.`);
    } finally {
      // Remover del set de casos en actualización
      setCasosUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(casoId);
        return newSet;
      });
    }
  };

  // Drag & Drop optimizado
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

    // Actualización optimista - actualizar UI inmediatamente
    const casoOriginal = casos.find(c => c.id === casoId);
    const estadoOriginal = casoOriginal?.estado;
    
    // Actualizar inmediatamente en la UI
    setCasos((prev) =>
      prev.map((c) => (c.id === casoId ? { ...c, estado: nuevoEstado } : c))
    );

    // Mostrar toast de feedback inmediato
    toast.info(`Moviendo caso a: ${nuevoEstado}`);

    // Realizar la actualización en el servidor
    handleChangeEstadoOptimistic(casoId, nuevoEstado, estadoOriginal);
  };

  // Filtrar casos
  const casosFiltrados = casos.filter(caso => {
    const matchesSearch = caso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caso.id.toString().includes(searchTerm);
    
    // Aquí podrías agregar lógica de prioridad si tienes ese campo
    const matchesFilter = filterPriority === "all"; // Por ahora todos

    return matchesSearch && matchesFilter;
  });

  // Agrupar casos
  const columnas = {
    NEW: casosFiltrados.filter((c) => {
      const estado = normalizarEstado(c.estado);
      return estado === "pendiente" || estado === "nuevo" || estado === "";
    }),
    ACTIVE: casosFiltrados.filter(
      (c) => normalizarEstado(c.estado) === "en ejecución"
    ),
    FAIL: casosFiltrados.filter((c) => normalizarEstado(c.estado) === "fallo"),
    CLOSED: casosFiltrados.filter(
      (c) =>
        normalizarEstado(c.estado) === "finalizado" ||
        normalizarEstado(c.estado) === "cerrado"
    ),
  };

  // Configuración de columnas
  const COLUMN_CONFIG = {
    NEW: { 
      label: "Pendientes", 
      color: "bg-slate-50 border-slate-200",
      headerColor: "bg-slate-100",
      textColor: "text-slate-600",
      icon: <Clock className="w-5 h-5" />,
      badgeColor: "bg-slate-100 text-slate-600"
    },
    ACTIVE: { 
      label: "En Ejecución", 
      color: "bg-blue-50 border-blue-200",
      headerColor: "bg-blue-100",
      textColor: "text-blue-600",
      icon: <Zap className="w-5 h-5" />,
      badgeColor: "bg-blue-100 text-blue-600"
    },
    FAIL: { 
      label: "Fallidos", 
      color: "bg-red-50 border-red-200",
      headerColor: "bg-red-100",
      textColor: "text-red-600",
      icon: <XCircle className="w-5 h-5" />,
      badgeColor: "bg-red-100 text-red-600"
    },
    CLOSED: { 
      label: "Finalizados", 
      color: "bg-green-50 border-green-200",
      headerColor: "bg-green-100",
      textColor: "text-green-600",
      icon: <CheckCircle className="w-5 h-5" />,
      badgeColor: "bg-green-100 text-green-600"
    },
  };

  // Estadísticas
  const stats = {
    total: casos.length,
    pendientes: columnas.NEW.length,
    activos: columnas.ACTIVE.length,
    fallidos: columnas.FAIL.length,
    completados: columnas.CLOSED.length,
    progreso: casos.length > 0 ? Math.round((columnas.CLOSED.length / casos.length) * 100) : 0
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Volver al Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Casos de Prueba
                </h1>
                <p className="text-sm text-gray-500">Proyecto #{id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Estadísticas
              </button>
              
              <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{stats.pendientes}</p>
                  <p className="text-sm text-slate-600">Pendientes</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{stats.activos}</p>
                  <p className="text-sm text-blue-600">Activos</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-red-900">{stats.fallidos}</p>
                  <p className="text-sm text-red-600">Fallidos</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-900">{stats.completados}</p>
                  <p className="text-sm text-green-600">Completados</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{stats.progreso}%</p>
                  <p className="text-sm text-purple-600">Progreso</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar casos por descripción o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            
       
          </div>
        </div>
      </div>

      {/* Tablero Kanban */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 gap-6">
            {Object.entries(columnas).map(([col, items]) => (
              <motion.div
                key={col}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: Object.keys(columnas).indexOf(col) * 0.1 }}
              >
                <Droppable droppableId={col}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`rounded-xl shadow-sm border-2 transition-all duration-300 min-h-[600px]
                        ${COLUMN_CONFIG[col].color}
                        ${
                          snapshot.isDraggingOver
                            ? "ring-4 ring-purple-400 scale-[1.02] shadow-lg border-purple-300 bg-gradient-to-b from-purple-50 to-transparent"
                            : "hover:shadow-md"
                        }
                      `}
                    >
                      {/* Header de columna */}
                      <div className={`p-4 rounded-t-xl border-b ${COLUMN_CONFIG[col].headerColor}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={COLUMN_CONFIG[col].textColor}>
                              {COLUMN_CONFIG[col].icon}
                            </div>
                            <div>
                              <h3 className={`font-semibold ${COLUMN_CONFIG[col].textColor}`}>
                                {COLUMN_CONFIG[col].label}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {items.length} caso{items.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${COLUMN_CONFIG[col].badgeColor}`}>
                            {items.length}
                          </span>
                        </div>
                      </div>

                      {/* Contenido de columna */}
                      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                        {items.length === 0 && (
                          <div className="text-center py-8">
                            <Archive className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">Sin casos</p>
                          </div>
                        )}

                        {items.map((caso, index) => (
                          <Draggable
                            key={caso.id.toString()}
                            draggableId={caso.id.toString()}
                            index={index}
                            isDragDisabled={user?.rol !== "tester"}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-lg border p-4 mb-3 transition-all duration-200
                                  ${
                                    user?.rol === "tester"
                                      ? "cursor-grab active:cursor-grabbing"
                                      : "cursor-pointer"
                                  }
                                  ${
                                    snapshot.isDragging
                                      ? "shadow-lg rotate-3 scale-105"
                                      : "shadow-sm hover:shadow-md"
                                  }
                                `}
                                onClick={() => navigate(`/proyectos/${id}/casos/${caso.id}`)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="text-sm font-medium text-gray-900 flex-1">
                                    {caso.descripcion}
                                  </h4>
                                  {user?.rol === "tester" && (
                                    <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Caso #{caso.id}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${COLUMN_CONFIG[col].badgeColor}`}>
                                    {caso.estado || "Pendiente"}
                                  </span>
                                </div>
                                
                                {caso.fecha_creacion && (
                                  <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(caso.fecha_creacion).toLocaleDateString("es-ES")}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </motion.div>
            ))}
          </div>
        </DragDropContext>
      </div>

    </div>
  );
}
