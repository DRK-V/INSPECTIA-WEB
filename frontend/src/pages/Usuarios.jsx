import React, { useEffect, useState } from "react";
const BACKEND_URL = "https://inspectia-web.onrender.com";
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    empresa: "INSPECTIA-WEB",
    rol: "tester",
  });

  // Diccionario de mensajes de error personalizados
  const mensajesErrores = {
    'duplicate key value violates unique constraint "usuarios_email_key"':
      "Correo ya registrado",
    'duplicate key value violates unique constraint "usuarios_telefono_key"':
      "Teléfono ya registrado",
    "password too short": "La contraseña es demasiado corta",
    "invalid email format": "Formato de correo inválido",
    "invalid phone number": "Número de teléfono inválido",
  };

  // Cargar usuarios desde el backend
  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/users`);
      const data = await res.json();
      const ordenados = data.sort((a, b) => a.id - b.id);
      setUsuarios(ordenados);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    setNuevoUsuario({
      ...nuevoUsuario,
      [e.target.name]: e.target.value,
    });
  };

  // Registrar nuevo usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (res.ok) {
        setShowModal(false);
        setNuevoUsuario({
          nombre: "",
          apellido: "",
          email: "",
          password: "",
          telefono: "",
          empresa: "INSPECTIA-WEB",
          rol: "tester",
        });
        fetchUsuarios();
        setSuccessPopup(true);
        setTimeout(() => setSuccessPopup(false), 3000);
      } else {
        const errorData = await res.json();

        // Traducción de error técnico a amigable
        const mensaje =
          mensajesErrores[errorData.message] || "Error al registrar usuario";

        setErrorPopup(mensaje);
        setTimeout(() => setErrorPopup(""), 4000);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrorPopup("Error de conexión con el servidor");
      setTimeout(() => setErrorPopup(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 mt-20 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          + Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 shadow-sm">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Apellido</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Teléfono</th>
              <th className="px-4 py-2 border">Empresa</th>
              <th className="px-4 py-2 border">Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="text-center hover:bg-gray-100">
                <td className="px-4 py-2 border">{u.nombre}</td>
                <td className="px-4 py-2 border">{u.apellido}</td>
                <td className="px-4 py-2 border">{u.email}</td>
                <td className="px-4 py-2 border">{u.telefono}</td>
                <td className="px-4 py-2 border">{u.empresa}</td>
                <td className="px-4 py-2 border">{u.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de registro */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-2xl font-bold mb-4">Registrar Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-3 p-2">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={nuevoUsuario.nombre}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={nuevoUsuario.apellido}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={nuevoUsuario.email}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={nuevoUsuario.password}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={nuevoUsuario.telefono}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="empresa"
                placeholder="Empresa"
                value={nuevoUsuario.empresa}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <select
                name="rol"
                value={nuevoUsuario.rol}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="tester">Tester</option>
                <option value="master">Master</option>
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup de loading */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
            <p className="text-gray-700 font-semibold">Registrando usuario...</p>
          </div>
        </div>
      )}

      {/* Popup de éxito */}
      {successPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg">
            Usuario registrado exitosamente
          </div>
        </div>
      )}

      {/* Popup de error */}
      {errorPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-red-500 text-white px-8 py-4 rounded-lg shadow-lg">
            {errorPopup}
          </div>
        </div>
      )}
    </div>
  );
}
