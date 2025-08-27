import React from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">INSPECTIA-WEB</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#servicios" className="text-gray-700 hover:text-blue-600 transition-colors">
              Servicios
            </a>
            <a href="#normas" className="text-gray-700 hover:text-blue-600 transition-colors">
              Normas ISO
            </a>
            <a href="#tipos" className="text-gray-700 hover:text-blue-600 transition-colors">
              Tipos de Pruebas
            </a>
            <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contacto
            </a>
          </nav>
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </header>
  );
}