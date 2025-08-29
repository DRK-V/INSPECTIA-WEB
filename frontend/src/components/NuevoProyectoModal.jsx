import React, { useState } from "react";

function NuevoProyectoModal({ isOpen, onClose, usuarioId, onProyectoCreado }) {
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urlSitio, setUrlSitio] = useState("");
  const [urlMockup, setUrlMockup] = useState("");
  const [tipoAplicacion, setTipoAplicacion] = useState([]);
  const [archivoHu, setArchivoHu] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Manejo de checks
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTipoAplicacion((prev) => [...prev, value]);
    } else {
      setTipoAplicacion((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      const res = await fetch("http://localhost:3000/api/users/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Proyecto creado exitosamente 🚀");
        onProyectoCreado(data.proyecto);
        onClose();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error al crear proyecto:", err);
      alert("Error de red al crear el proyecto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-purple-700 border-b pb-3">
          Crear Nuevo Proyecto
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block font-medium mb-1">Nombre del Proyecto</label>
            <input
              type="text"
              value={nombreProyecto}
              onChange={(e) => setNombreProyecto(e.target.value)}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-medium mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          {/* URL sitio */}
          <div>
            <label className="block font-medium mb-1">URL del Sitio</label>
            <input
              type="url"
              value={urlSitio}
              onChange={(e) => setUrlSitio(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* URL mockup */}
          <div>
            <label className="block font-medium mb-1">URL del Mockup</label>
            <input
              type="url"
              value={urlMockup}
              onChange={(e) => setUrlMockup(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Tipo aplicación con checks */}
          <div>
            <label className="block font-medium mb-1">Tipo de Aplicación</label>
            <div className="space-y-2">
              {["Web", "Móvil", "Escritorio"].map((tipo) => (
                <label key={tipo} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={tipo}
                    checked={tipoAplicacion.includes(tipo)}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span>{tipo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Archivo HU */}
          <div>
            <label className="block font-medium mb-1">
              Archivo HU (Excel)
            </label>
            <input
              type="file"
              onChange={(e) => setArchivoHu(e.target.files[0])}
              accept=".xlsx,.xls"
              className="w-full border p-2 rounded focus:outline-none"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {loading ? "Creando..." : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoProyectoModal;
