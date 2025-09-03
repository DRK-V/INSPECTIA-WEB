import React, { useState } from "react";

const BACKEND_URL = "https://inspectia-web.onrender.com";

function NuevoProyectoModal({ isOpen, onClose, usuarioId, onProyectoCreado }) {
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urlSitio, setUrlSitio] = useState("");
  const [urlMockup, setUrlMockup] = useState("");
  const [tipoAplicacion, setTipoAplicacion] = useState([]);
  const [archivoHu, setArchivoHu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setTipoAplicacion((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("usuario_id", usuarioId);
      formData.append("nombre_proyecto", nombreProyecto);
      formData.append("descripcion", descripcion);
      if (urlSitio) formData.append("url_sitio", urlSitio);
      if (urlMockup) formData.append("url_descarga", urlMockup);
      if (tipoAplicacion.length > 0)
        formData.append("tipo_aplicacion", JSON.stringify(tipoAplicacion));
      if (archivoHu) formData.append("archivo_hu", archivoHu);

      const res = await fetch(`${BACKEND_URL}/create`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        onProyectoCreado(data.proyecto);

        // Reset
        setNombreProyecto("");
        setDescripcion("");
        setUrlSitio("");
        setUrlMockup("");
        setTipoAplicacion([]);
        setArchivoHu(null);

        onClose();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Error al crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-3xl animate-slideUp border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Crear Nuevo Proyecto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 grid grid-cols-1 md:grid-cols-2 md:gap-6"
        >
          {/* Columna 1 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                value={nombreProyecto}
                onChange={(e) => setNombreProyecto(e.target.value)}
                required
                className="w-full border border-gray-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                className="w-full border border-gray-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                URL del Sitio
              </label>
              <input
                type="url"
                value={urlSitio}
                onChange={(e) => setUrlSitio(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
          </div>

          {/* Columna 2 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                URL del Mockup
              </label>
              <input
                type="url"
                value={urlMockup}
                onChange={(e) => setUrlMockup(e.target.value)}
                className="w-full border border-gray-200 p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Tipo de Aplicación
              </label>
              <div className="flex flex-col gap-2">
                {["Web", "Móvil", "Escritorio"].map((tipo) => (
                  <label
                    key={tipo}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={tipo}
                      checked={tipoAplicacion.includes(tipo)}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-700">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Archivo HU (Excel)
              </label>
              <input
                type="file"
                onChange={(e) => setArchivoHu(e.target.files[0])}
                accept=".xlsx,.xls"
                className="w-full border border-gray-200 p-2 rounded-xl shadow-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="md:col-span-2 flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70 transition"
            >
              {loading ? "Creando..." : "Crear Proyecto"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Animación */}
      <style jsx>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}

export default NuevoProyectoModal;
