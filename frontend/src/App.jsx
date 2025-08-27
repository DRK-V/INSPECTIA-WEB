import React, { useState } from 'react';
import { Shield, CheckCircle, Award, Phone, Mail, MapPin } from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      {/* Header */}
   

      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Gestión de Pruebas QA
            <br />
            con <span className="text-purple-600">Inteligencia Artificial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma profesional para la gestión de pruebas de calidad asistida por IA.
            <br />
            Optimiza tus procesos de testing con tecnología de vanguardia.
          </p>
          <button className="bg-black text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors">
            Solicitar Servicio
          </button>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios QA
            </h2>
            <p className="text-xl text-gray-600">
              Servicios especializados de testing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Testing Manual
                <br />
                Especializado
              </h3>
              <p className="text-gray-600 mb-6">
                Pruebas manuales ejecutadas por expertos QA con metodologías probadas y documentación detallada.
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                solicitar servicio
              </button>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Testing de Seguridad
              </h3>
              <p className="text-gray-600 mb-6">
                Auditorías de seguridad y pruebas de penetración para identificar vulnerabilidades en tus sistemas.
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                solicitar servicio
              </button>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Testing Manual
                <br />
                Testing de Seguridad
              </h3>
              <p className="text-gray-600 mb-6">
                Pruebas manuales ejecutadas por expertos QA con metodologías probadas y documentación detallada.
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                solicitar servicio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Certificaciones Section */}
      <section id="normas" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Certificaciones y Normas ISO
            </h2>
            <p className="text-xl text-gray-600">
              Cumplimos con los más altos estándares internacionales de calidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg text-center shadow-sm">
              <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ISO 9001:2015</h3>
              <p className="text-gray-600">
                Sistema de Gestión de Calidad para procesos de testing
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg text-center shadow-sm">
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ISO 27001:2013</h3>
              <p className="text-gray-600">
                Gestión de Seguridad de la Información en testing
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg text-center shadow-sm">
              <CheckCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ISO 29119</h3>
              <p className="text-gray-600">
                Estándar internacional para testing de software
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Pruebas Section */}
      <section id="tipos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tipos de Pruebas Especializadas
            </h2>
            <p className="text-xl text-gray-600">
              Cobertura completa de testing para todos los aspectos de tu aplicación
            </p>
          </div>

          {/* Aquí puedes agregar más contenido de tipos de pruebas */}
          <div className="bg-gray-50 p-12 rounded-lg text-center">
            <p className="text-gray-500 text-lg">
              Contenido de tipos de pruebas especializadas...
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Login />
          <Footer />
        </div>
      } />
      <Route path="/register" element={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Register />
          <Footer />
        </div>
      } />
    </Routes>
  );
}