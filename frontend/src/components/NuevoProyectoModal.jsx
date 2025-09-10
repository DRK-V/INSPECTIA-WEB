import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./Toast";
import {
  X,
  FolderPlus,
  FileText,
  Globe,
  Image,
  Smartphone,
  Monitor,
  Tablet,
  Upload,
  Loader2,
  AlertTriangle
} from "lucide-react";

const BACKEND_URL = "https://inspectia-web.onrender.com";

function NuevoProyectoModalNew({ isOpen, onClose, usuarioId, onProyectoCreado }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    nombreProyecto: "",
    descripcion: "",
    urlSitio: "",
    urlMockup: "",
    tipoAplicacion: []
  });
  const [archivoHu, setArchivoHu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const tiposAplicacion = [
    { value: "Web", label: "Web", icon: <Globe className="w-4 h-4" /> },
    { value: "Móvil", label: "Móvil", icon: <Smartphone className="w-4 h-4" /> },
    { value: "Escritorio", label: "Escritorio", icon: <Monitor className="w-4 h-4" /> },
    { value: "Tablet", label: "Tablet", icon: <Tablet className="w-4 h-4" /> }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => ({
      ...prev,
      tipoAplicacion: prev.tipoAplicacion.includes(value)
        ? prev.tipoAplicacion.filter(item => item !== value)
        : [...prev.tipoAplicacion, value]
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes("sheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        setArchivoHu(file);
      } else {
        toast.error("Solo se permiten archivos de Excel (.xlsx, .xls)");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArchivoHu(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      nombreProyecto: "",
      descripcion: "",
      urlSitio: "",
      urlMockup: "",
      tipoAplicacion: []
    });
    setArchivoHu(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("usuario_id", usuarioId);
      formDataToSend.append("nombre_proyecto", formData.nombreProyecto);
      formDataToSend.append("descripcion", formData.descripcion);
      
      if (formData.urlSitio) formDataToSend.append("url_sitio", formData.urlSitio);
      if (formData.urlMockup) formDataToSend.append("url_descarga", formData.urlMockup);
      if (formData.tipoAplicacion.length > 0) {
        formDataToSend.append("tipo_aplicacion", JSON.stringify(formData.tipoAplicacion));
      }
      if (archivoHu) formDataToSend.append("archivo_hu", archivoHu);

      const res = await fetch(`${BACKEND_URL}/create`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (res.ok) {
        onProyectoCreado(data.proyecto);
        toast.success("¡Proyecto creado exitosamente!");
        resetForm();
        onClose();
      } else {
        toast.error(data.message || "Error al crear el proyecto");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      toast.error("Error de conexión al crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.nombreProyecto.trim() && formData.descripcion.trim();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[calc(100vh-2rem)] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FolderPlus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Crear Nuevo Proyecto</h2>
                  <p className="text-purple-100 text-sm">
                    Configura tu nuevo proyecto de testing QA
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 min-h-0">
            <form onSubmit={handleSubmit} className="space-y-6" id="proyecto-form">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    name="nombreProyecto"
                    value={formData.nombreProyecto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Ej: Testing App Mobile Banking"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción del Proyecto *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe las funcionalidades principales y alcance del proyecto..."
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    URL del Sitio Web
                  </label>
                  <input
                    type="url"
                    name="urlSitio"
                    value={formData.urlSitio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="https://ejemplo.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Image className="w-4 h-4 inline mr-1" />
                    URL del Mockup/Diseño
                  </label>
                  <input
                    type="url"
                    name="urlMockup"
                    value={formData.urlMockup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="https://figma.com/design..."
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Tipo de aplicación */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tipo de Aplicación
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tiposAplicacion.map(tipo => (
                    <motion.button
                      key={tipo.value}
                      type="button"
                      onClick={() => handleCheckboxChange(tipo.value)}
                      disabled={loading}
                      className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        formData.tipoAplicacion.includes(tipo.value)
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tipo.icon}
                      <span className="text-sm font-medium">{tipo.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Archivo HU */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Upload className="w-4 h-4 inline mr-1" />
                  Archivo de Historias de Usuario (Excel)
                </label>
                
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                    dragActive
                      ? "border-purple-500 bg-purple-50"
                      : archivoHu
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-purple-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                  />
                  
                  <div className="text-center">
                    {archivoHu ? (
                      <div className="flex items-center justify-center gap-2 text-green-700">
                        <FileText className="w-8 h-8" />
                        <div>
                          <p className="font-medium">{archivoHu.name}</p>
                          <p className="text-sm text-green-600">
                            {(archivoHu.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">
                          Arrastra tu archivo aquí o haz clic para seleccionar
                        </p>
                        <p className="text-sm">Solo archivos .xlsx o .xls</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {archivoHu && (
                  <button
                    type="button"
                    onClick={() => setArchivoHu(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                    disabled={loading}
                  >
                    Quitar archivo
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Footer - Siempre visible */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t flex-shrink-0 gap-4 sm:gap-0 shadow-lg">
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Los campos marcados con * son obligatorios
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                Cancelar
              </button>
              
              <motion.button
                type="submit"
                form="proyecto-form"
                disabled={loading || !isFormValid()}
                className={`px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all w-full sm:w-auto ${
                  loading || !isFormValid()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                }`}
                whileHover={{ scale: loading || !isFormValid() ? 1 : 1.02 }}
                whileTap={{ scale: loading || !isFormValid() ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-4 h-4" />
                    Crear Proyecto
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default NuevoProyectoModalNew;
