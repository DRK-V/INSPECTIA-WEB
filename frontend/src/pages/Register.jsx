import React, { useState } from 'react';
import RegisterForm from '../components/Auth/RegisterForm.jsx'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 py-20">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Crear Cuenta
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Regístrate y comienza a optimizar tus procesos de testing con IA.
        </p>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre completo</label>
            <input type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Correo electrónico</label>
            <input type="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input type="password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
