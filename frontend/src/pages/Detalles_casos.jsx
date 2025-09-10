import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  User,
  MessageSquare,
  Image as ImageIcon,
  Upload,
  X,
  Eye,
  Download,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
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
        if (!res.ok)
          throw new Error(`Error ${res.status}: ${await res.text()}`);
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
      console.log(
        `Enviando petición a ${BACKEND_URL}/${proyectoId}/estado con estado:`,
        nuevo
      );
      const res = await fetch(`${BACKEND_URL}/${proyectoId}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevo }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al actualizar estado");
      console.log("Respuesta de /proyecto_id/estado:", data);

      // Petición adicional a casos/id/estado
      const resCaso = await fetch(`${BACKEND_URL}/casos/${casoId}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevo }),
      });
      const dataCaso = await resCaso.json();
      if (!resCaso.ok)
        throw new Error(
          dataCaso.message || "Error al actualizar estado del caso"
        );
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="text-lg text-gray-600 font-medium">Cargando caso de prueba...</span>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Toast de notificación */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {popup}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header mejorado */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to={`/proyectos/${proyectoId}/casos`}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Volver a Casos</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-lg text-base font-semibold">
                    Caso #{caso.id}
                  </span>
                  {caso.titulo || 'Sin título'}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Generado por: {caso.generado_por || "IA"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Proyecto: {proyecto?.nombre_proyecto || 'Cargando...'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Estado del caso */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                estado === 'Finalizado' ? 'bg-green-100 text-green-700' :
                estado === 'En Ejecución' ? 'bg-blue-100 text-blue-700' :
                estado === 'Fallo' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {estado === 'Finalizado' ? <CheckCircle className="w-4 h-4" /> :
                 estado === 'En Ejecución' ? <Play className="w-4 h-4" /> :
                 estado === 'Fallo' ? <AlertCircle className="w-4 h-4" /> :
                 <Clock className="w-4 h-4" />}
                <span className="font-medium">{estado}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Descripción</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {caso.descripcion || "Sin descripción"}
                </p>
              </div>
            </motion.div>

            {/* Pasos a seguir */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Play className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Pasos a Seguir</h2>
                <span className="ml-auto bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm font-medium">
                  {(caso.pasos || []).length} pasos
                </span>
              </div>
              <div className="space-y-3">
                {(caso.pasos || []).map((paso, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 flex-1 pt-1">{paso}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Resultado esperado */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Resultado Esperado</h2>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  {caso.resultado_esperado || "No se ha definido un resultado esperado"}
                </p>
              </div>
            </motion.div>

            {/* Comentarios y Ejecución */}
            {rol === "tester" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Ejecución y Comentarios</h2>
                  <span className="ml-auto bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm font-medium">
                    {comentariosHistorial.length} {comentariosHistorial.length === 1 ? 'comentario' : 'comentarios'}
                  </span>
                </div>
                
                {comentariosHistorial.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {comentariosHistorial.map((comentario, idx) => (
                      <motion.div 
                        key={comentario.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleComentario(comentario.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {String(comentario.tester_id || "T")[0]}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 font-medium">{comentario.comentarios}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Tester #{comentario.tester_id} • {new Date().toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          </div>
                          <button className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                            <Eye className="w-4 h-4" />
                            {comentarioExpandido === comentario.id ? 'Ocultar' : 'Ver evidencias'}
                          </button>
                        </div>
                        
                        <AnimatePresence>
                          {comentarioExpandido === comentario.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-100"
                            >
                              {evidencias[comentario.id] && evidencias[comentario.id].length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {evidencias[comentario.id].map((evidencia, evidenciaIdx) => (
                                    <div key={evidenciaIdx} className="group relative">
                                      <img
                                        src={`${BACKEND_URL}/${evidencia.archivo_url}`}
                                        alt={`Evidencia ${evidenciaIdx + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200 group-hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => window.open(`${BACKEND_URL}/${evidencia.archivo_url}`, '_blank')}
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">No hay evidencias adjuntas</p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {!mostrarFormulario ? (
                  <button
                    onClick={() => setMostrarFormulario(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all transform hover:scale-[1.02]"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Añadir Comentario de Ejecución
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files);
                      if (files.length > 0) {
                        setImagenes((prev) => [...prev, ...files]);
                      }
                    }}
                  >
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      rows={4}
                      placeholder="Describe el resultado de la ejecución del caso de prueba..."
                      value={nuevoComentario}
                      onChange={(e) => setNuevoComentario(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                          const disabled = !nuevoComentario.trim() && imagenes.length === 0;
                          if (!disabled) handleGuardar();
                        }
                      }}
                    />
                    
                    {/* Preview de archivos */}
                    {imagenes.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {imagenes.map((file, idx) => {
                          const isImage = file.type.startsWith("image/");
                          return (
                            <div key={idx} className="relative group">
                              <button
                                type="button"
                                onClick={() => setImagenes(imagenes.filter((_, i) => i !== idx))}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              {isImage ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                              ) : (
                                <div className="w-full h-24 bg-gray-200 rounded-lg border flex items-center justify-center">
                                  <FileText className="w-8 h-8 text-gray-400" />
                                  <span className="text-xs text-gray-500 mt-1">{file.name}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Acciones del formulario */}
                    <div className="flex items-center justify-between mt-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        <Upload className="w-4 h-4" />
                        Adjuntar archivos
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png,.pdf,.log"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setMostrarFormulario(false);
                            setNuevoComentario("");
                            setImagenes([]);
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleGuardar}
                          disabled={!nuevoComentario.trim() && imagenes.length === 0}
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Guardar Ejecución
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Tip: Puedes usar Ctrl/Cmd + Enter para guardar rápidamente
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Control de Estado */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Estado del Caso</h3>
              </div>
              
              {rol === "tester" ? (
                <select
                  value={estado}
                  onChange={(e) => handleEstadoChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="Pendiente">⏳ Pendiente</option>
                  <option value="En Ejecución">▶️ En Ejecución</option>
                  <option value="Finalizado">✅ Finalizado</option>
                  <option value="Fallo">❌ Fallo</option>
                </select>
              ) : (
                <div className={`p-3 rounded-lg text-center font-medium ${
                  estado === 'Finalizado' ? 'bg-green-100 text-green-700' :
                  estado === 'En Ejecución' ? 'bg-blue-100 text-blue-700' :
                  estado === 'Fallo' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {estado}
                </div>
              )}
            </motion.div>
            
            {/* Información del Proyecto */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Recursos</h3>
              </div>
              
              <div className="space-y-3">
                {proyecto?.url_sitio && (
                  <a
                    href={proyecto.url_sitio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                  >
                    <div className="p-1 bg-blue-200 rounded">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-900">Sitio Web</p>
                      <p className="text-xs text-blue-700 truncate">{proyecto.url_sitio}</p>
                    </div>
                  </a>
                )}
                
                {proyecto?.url_descarga && (
                  <a
                    href={proyecto.url_descarga}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                  >
                    <div className="p-1 bg-green-200 rounded">
                      <Download className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-900">Mockup/Diseño</p>
                      <p className="text-xs text-green-700 truncate">{proyecto.url_descarga}</p>
                    </div>
                  </a>
                )}
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">Proyecto</p>
                  <p className="text-sm text-gray-600">{proyecto?.nombre_proyecto || 'Cargando...'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
