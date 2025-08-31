import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://inspectia-web.onrender.com";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    empresa: "",
  });

  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejo de submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setLoading(false);
        setSuccessPopup(true);

        // Ocultar popup después de 3s y redirigir
        setTimeout(() => {
          setSuccessPopup(false);
          navigate("/login");
        }, 3000);
      } else {
        setLoading(false);
        const error = await response.json();
        alert("Error: " + (error.message || "No se pudo registrar"));
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Error de conexión con el servidor ❌");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 py-20 px-4 relative">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-3xl">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          Crear Cuenta
        </h2>
        <p className="text-gray-600 mb-10 text-center">
          Regístrate y comienza a optimizar tus procesos de testing con IA.
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-gray-700 mb-2">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Empresa */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Empresa</label>
            <input
              type="text"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Contraseña */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Botón */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>

      {/* Popup de Loading (sin fondo negro) */}
      {loading && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-800">Registrando...</p>
          </div>
        </div>
      )}

      {/* Popup de éxito (sin fondo negro) */}
      {successPopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-green-500 text-white px-8 py-6 rounded-2xl shadow-lg text-center text-lg font-semibold">
            ✅ Usuario registrado exitosamente
          </div>
        </div>
      )}
    </div>
  );
}
