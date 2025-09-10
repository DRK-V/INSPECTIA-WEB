import React, { useState, useEffect } from "react";
import { useUser } from "../components/UserContext";
import { useToast } from "../components/Toast";
import { useNavigate } from "react-router-dom";
import NuevoProyectoModal from "../components/NuevoProyectoModal";
import Cookies from "js-cookie";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Eye, 
  Download, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Users,
  FolderOpen,
  Activity,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";
import Chatbot from "../components/Chatbot";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const BACKEND_URL = "https://inspectia-web.onrender.com";

function Dashboard() {
  const { user } = useUser();
  const toast = useToast();
  const [proyectos, setProyectos] = useState([]);
  const [proyectosOrden, setProyectosOrden] = useState([]);
  const [casos, setCasos] = useState([]);
  const [todosCasos, setTodosCasos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [asignarModal, setAsignarModal] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [selectedUsuarios, setSelectedUsuarios] = useState([]);
  const [loadingGenerar, setLoadingGenerar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  // Estados para validación
  const [validacionPopup, setValidacionPopup] = useState({ open: false, msg: "" });

  useEffect(() => {
    if (validacionPopup.open) {
      const timer = setTimeout(() => {
        setValidacionPopup({ open: false, msg: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [validacionPopup]);

  // Validar acción cliente
  const validarAccionCliente = (proyecto, accion) => {
    if (!proyecto.total_casos || proyecto.total_casos === 0) {
      toast.warning(
        `El proyecto "${proyecto.nombre_proyecto}" aún está en estado pendiente. No tiene casos generados.`
      );
      return false;
    }

    if (accion === "ver") {
      verCasos(proyecto.id);
    } else if (accion === "reporte") {
      window.location.href = `${BACKEND_URL}/proyectos/nombre/${encodeURIComponent(
        proyecto.nombre_proyecto
      )}/reporte`;
    }
  };

  // Cargar proyectos
  useEffect(() => {
    if (!user) return;

    const fetchProyectos = async () => {
      try {
        const url =
          user.rol === "cliente"
            ? `${BACKEND_URL}/proyectos/${user.id}`
            : `${BACKEND_URL}/proyectos`;

        const res = await fetch(url);
        let data = await res.json();

        // Lógica específica por rol
        if (user.rol === "manager") {
          const proyectosConValidacion = await Promise.all(
            data.map(async (p) => {
              try {
                const resp = await fetch(`${BACKEND_URL}/${p.id}/validar-casos`);
                const result = await resp.json();
                return { ...p, tieneCasos: result.tieneCasos };
              } catch (err) {
                return { ...p, tieneCasos: false };
              }
            })
          );
          data = proyectosConValidacion;
        }

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

        if (user.rol === "cliente") {
          data = await Promise.all(
            data.map(async (p) => {
              try {
                const resCasos = await fetch(`${BACKEND_URL}/proyectos/${p.id}/casos`);
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
          data = data.sort((a, b) => a.id - b.id);
        }

        if (user.rol === "cliente" && Array.isArray(data)) {
          setProyectosOrden(data.map((p) => p.id));
        }

        setProyectos(data);
      } catch (err) {
        console.error("❌ Error cargando proyectos:", err);
        toast.error("Error cargando proyectos");
      }
    };

    fetchProyectos();
  }, [user, toast]);

  // Cargar todos los casos para métricas
  useEffect(() => {
    const fetchTodosCasos = async () => {
      if (!proyectos.length) return;
      
      try {
        const todosCasosPromises = proyectos.map(async (proyecto) => {
          try {
            const res = await fetch(`${BACKEND_URL}/proyectos/${proyecto.id}/casos`);
            if (!res.ok) return [];
            const casos = await res.json();
            return Array.isArray(casos) ? casos : [];
          } catch (err) {
            console.error(`Error cargando casos del proyecto ${proyecto.id}:`, err);
            return [];
          }
        });
        
        const resultados = await Promise.all(todosCasosPromises);
        const casosFlat = resultados.flat();
        setTodosCasos(casosFlat);
      } catch (err) {
        console.error("Error cargando todos los casos:", err);
      }
    };

    fetchTodosCasos();
  }, [proyectos]);

  // Crear nuevo proyecto
  const handleProyectoCreado = (nuevoProyecto) => {
    setProyectos((prev) => {
      const nuevos = [...prev, nuevoProyecto];
      return nuevos.sort((a, b) => a.id - b.id);
    });
    setProyectosOrden((prev) => {
      const nuevos = [...prev, nuevoProyecto.id];
      return nuevos.sort((a, b) => a - b);
    });
    toast.success("¡Proyecto creado exitosamente!");
  };

  // Ver casos
  const verCasos = async (proyectoId) => {
    try {
      Cookies.set("proyectoId", proyectoId);
      const res = await fetch(`${BACKEND_URL}/proyectos/${proyectoId}/casos`);
      const data = await res.json();
      setCasos(data);
      navigate(`/proyectos/${proyectoId}/casos`);
    } catch (err) {
      console.error("Error cargando casos:", err);
      toast.error("Error cargando casos");
    }
  };

  // Asignación de proyectos
  const abrirAsignarModal = async (proyecto) => {
    setSelectedProyecto(proyecto);
    try {
      const res = await fetch(`${BACKEND_URL}/users`);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      toast.error("Error cargando usuarios");
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
      toast.success("¡Usuarios asignados exitosamente!");
    } catch (err) {
      console.error("Error asignando usuarios:", err);
      toast.error("Error asignando usuarios");
    }
  };

  // Métricas calculadas
  const getMetricas = () => {
    const total = proyectos.length;
    const pendientes = proyectos.filter(p => 
      !p.estado || 
      p.estado.toLowerCase() === "pendientes" || 
      p.estado.toLowerCase() === "pendiente"
    ).length;
    const enProceso = proyectos.filter(p => 
      p.estado && 
      (p.estado.toLowerCase() === "proceso" || 
       p.estado.toLowerCase() === "en proceso")
    ).length;
    
    // Contar casos por estado
    const casosFinalizados = todosCasos.filter(caso => {
      const estadoCaso = caso.estado ? caso.estado.toLowerCase() : "";
      return estadoCaso === "finalizado" || 
             estadoCaso === "finalizados" || 
             estadoCaso === "completado" || 
             estadoCaso === "completados";
    }).length;
    
    const casosEnProceso = todosCasos.filter(caso => {
      const estadoCaso = caso.estado ? caso.estado.toLowerCase() : "";
      return estadoCaso === "en ejecución" || 
             estadoCaso === "en ejecucion" || 
             estadoCaso === "proceso" || 
             estadoCaso === "en proceso";
    }).length;
    
    const casosPendientes = todosCasos.filter(caso => {
      const estadoCaso = caso.estado ? caso.estado.toLowerCase() : "";
      return !caso.estado || 
             estadoCaso === "pendiente" || 
             estadoCaso === "pendientes" || 
             estadoCaso === "nuevo";
    }).length;
    
    const totalCasos = todosCasos.length;

    // Proyectos finalizados (para el gráfico)
    const proyectosFinalizados = proyectos.filter(p => 
      p.estado && 
      (p.estado.toLowerCase() === "finalizados" || 
       p.estado.toLowerCase() === "finalizado")
    ).length;

    return { 
      total, 
      pendientes, 
      enProceso, 
      proyectosFinalizados,
      casosFinalizados, 
      casosEnProceso, 
      casosPendientes, 
      totalCasos 
    };
  };

  const metricas = getMetricas();

  // Datos para gráficos
  const pieChartData = {
    labels: ['En Proceso', 'Finalizados', 'Pendientes'],
    datasets: [
      {
        data: [metricas.enProceso, metricas.proyectosFinalizados, metricas.pendientes],
        backgroundColor: [
          '#fbbf24',
          '#10b981',
          '#6b7280'
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      }
    ]
  };

  // Filtrado de proyectos
  const proyectosFiltrados = proyectos.filter(proyecto => {
    const matchesSearch = proyecto.nombre_proyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (proyecto.descripcion && proyecto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const estadoLower = proyecto.estado ? proyecto.estado.toLowerCase() : "";
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "pendiente" && (!proyecto.estado || estadoLower === "pendientes" || estadoLower === "pendiente")) ||
                         (filterStatus === "proceso" && (estadoLower === "proceso" || estadoLower === "en proceso")) ||
                         (filterStatus === "finalizado" && (estadoLower === "finalizados" || estadoLower === "finalizado"));
    
    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Debes iniciar sesión para ver el dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Loading para generación de casos */}
      {loadingGenerar && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white px-8 py-6 rounded-xl shadow-xl flex flex-col items-center border"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-200 border-t-purple-600 mb-4"></div>
            <span className="font-semibold text-lg text-gray-800">Generando casos...</span>
            <p className="text-sm text-gray-500 mt-1">Por favor espera un momento</p>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenido de vuelta, {user.nombre}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {user.rol === "cliente" ? "Panel de Cliente" : 
                 user.rol === "manager" ? "Panel de Gestión QA" : 
                 "Panel de Testing"}
              </p>
            </div>
            
            {user.rol === "cliente" && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setModalOpen(true)}
                className="mt-4 lg:mt-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Nuevo Proyecto
              </motion.button>
            )}
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Proyectos</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-600">{metricas.pendientes}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-yellow-600">{metricas.enProceso}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Casos</p>
                <p className="text-2xl font-bold text-purple-600">{metricas.totalCasos}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Casos Finalizados</p>
                <p className="text-2xl font-bold text-green-600">{metricas.casosFinalizados}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de proyectos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.rol === "cliente" ? "Mis Proyectos" : 
                     user.rol === "manager" ? "Proyectos QA" : 
                     "Proyectos Asignados"}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar proyectos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="all">Todos</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="proceso">En Proceso</option>
                      <option value="finalizado">Finalizados</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {proyectosFiltrados.length === 0 ? (
                  <div className="p-12 text-center">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm || filterStatus !== "all" ? "No se encontraron proyectos" : "No tienes proyectos registrados"}
                    </p>
                  </div>
                ) : (
                  proyectosFiltrados.map((proyecto, index) => (
                    <ProyectoCard 
                      key={proyecto.id}
                      proyecto={proyecto}
                      user={user}
                      onVerCasos={user.rol === "cliente" ? validarAccionCliente : verCasos}
                      onGenerarCasos={async (p) => {
                        try {
                          setLoadingGenerar(true);
                          const res = await fetch(`${BACKEND_URL}/proyectos/${p.id}/generar-casos`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ proyectoId: p.id }),
                          });
                          const data = await res.json();
                          setLoadingGenerar(false);
                          
                          if (res.ok) {
                            toast.success("✅ Casos generados exitosamente");
                            verCasos(p.id);
                            setProyectos(prev => prev.map(proj => 
                              proj.id === p.id ? { ...proj, tieneCasos: true } : proj
                            ));
                          } else {
                            toast.error("⚠️ Error: " + (data.message || "Ocurrió un error"));
                          }
                        } catch (err) {
                          setLoadingGenerar(false);
                          toast.error("❌ Error en la conexión con el servidor");
                        }
                      }}
                      onAsignar={abrirAsignarModal}
                      index={index}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar con gráficos y stats */}
          <div className="space-y-6">
            {metricas.total > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Proyectos</h3>
                <div className="h-48 flex items-center justify-center">
                  <Pie data={pieChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    }
                  }} />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-3">
                {proyectos.slice(0, 3).map((proyecto) => (
                  <div key={proyecto.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {proyecto.nombre_proyecto}
                      </p>
                      <p className="text-xs text-gray-500">
                        {proyecto.fecha_creacion ? 
                          new Date(proyecto.fecha_creacion).toLocaleDateString() : 
                          'Fecha pendiente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {user.rol === "cliente" && <Chatbot />}
          </div>
        </div>

        {/* Modales */}
        {user.rol === "cliente" && (
          <NuevoProyectoModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            usuarioId={user.id}
            onProyectoCreado={handleProyectoCreado}
          />
        )}

        {/* Modal de asignación */}
        {asignarModal && (
          <AsignarModal 
            proyecto={selectedProyecto}
            usuarios={usuarios}
            selectedUsuarios={selectedUsuarios}
            onToggleUsuario={toggleUsuario}
            onAsignar={asignarUsuarios}
            onClose={() => setAsignarModal(false)}
          />
        )}

        {/* Popup de validación */}
        {validacionPopup.open && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-red-50 border border-red-200 text-red-800 px-8 py-5 rounded-lg shadow-lg text-center max-w-md">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <span className="font-semibold text-lg">{validacionPopup.msg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de tarjeta de proyecto
const ProyectoCard = ({ proyecto, user, onVerCasos, onGenerarCasos, onAsignar, index }) => {
  const [showActions, setShowActions] = useState(false);

  const handleVerCasos = () => {
    if (user.rol === "cliente") {
      onVerCasos(proyecto, "ver");
    } else {
      onVerCasos(proyecto.id);
    }
  };

  const handleReporte = () => {
    if (user.rol === "cliente") {
      onVerCasos(proyecto, "reporte");
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 hover:bg-gray-50 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{proyecto.nombre_proyecto}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              proyecto.estado && (proyecto.estado.toLowerCase() === "finalizados" || proyecto.estado.toLowerCase() === "finalizado")
                ? "bg-green-100 text-green-700" 
                : proyecto.estado && (proyecto.estado.toLowerCase() === "proceso" || proyecto.estado.toLowerCase() === "en proceso")
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {proyecto.estado || "Pendiente"}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{proyecto.descripcion}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {proyecto.fecha_creacion ? 
                new Date(proyecto.fecha_creacion).toLocaleDateString("es-ES") : 
                "Fecha pendiente"}
            </span>
            {proyecto.total_casos !== undefined && (
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {proyecto.total_casos} casos
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-100">
          {/* Botones específicos por rol */}
          {user.rol === "cliente" && (
            <>
              <button
                onClick={handleVerCasos}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
              >
                <Eye className="w-3 h-3" />
                Ver
              </button>
              {proyecto.archivo_hu && (
                <a
                  href={`${BACKEND_URL}/proyectos/${proyecto.id}/hu`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg transition-colors"
                >
                  <Download className="w-3 h-3" />
                  HU
                </a>
              )}
              <button
                onClick={handleReporte}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
              >
                <FileText className="w-3 h-3" />
                Reporte
              </button>
            </>
          )}

          {user.rol === "manager" && (
            <>
              <button
                onClick={handleVerCasos}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
              >
                <Eye className="w-3 h-3" />
                Ver Casos
              </button>
              {!proyecto.tieneCasos && (
                <button
                  onClick={() => onGenerarCasos(proyecto)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Generar
                </button>
              )}
              <button
                onClick={() => onAsignar(proyecto)}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-lg transition-colors"
              >
                <Users className="w-3 h-3" />
                Asignar
              </button>
            </>
          )}

          {user.rol === "tester" && (
            <button
              onClick={handleVerCasos}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors"
            >
              <Eye className="w-3 h-3" />
              Ver Casos
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Componente de modal de asignación
const AsignarModal = ({ proyecto, usuarios, selectedUsuarios, onToggleUsuario, onAsignar, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Asignar Proyecto</h3>
        <p className="text-sm text-gray-600 mb-4">
          Proyecto: <span className="font-medium">{proyecto?.nombre_proyecto}</span>
        </p>

        <div className="max-h-60 overflow-y-auto border rounded-lg p-3 mb-6">
          {usuarios.filter(u => u.rol === "tester").length === 0 ? (
            <p className="text-gray-500 text-sm">No hay testers disponibles.</p>
          ) : (
            usuarios
              .filter(u => u.rol === "tester")
              .map(usuario => (
                <label
                  key={usuario.id}
                  className="flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsuarios.includes(usuario.id)}
                    onChange={() => onToggleUsuario(usuario.id)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-700">
                    {usuario.nombre} {usuario.apellido}
                  </span>
                </label>
              ))
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onAsignar}
            disabled={selectedUsuarios.length === 0}
            className={`px-5 py-2 rounded-lg transition-colors ${
              selectedUsuarios.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            Asignar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
