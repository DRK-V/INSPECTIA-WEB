import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProyectoDetalles from "./components/ProyectoDetalles";
import CasosPage from "./pages/CasosPage";
import CasoDetalle from "./pages/Detalles_casos.jsx";


export default function App() {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen">
        {/* Navbar siempre arriba */}
        <Navbar />

        {/* Contenido dinámico */}
        <main className="flex-grow pt-16"> 
          {/* pt-16 da espacio para el navbar fijo */}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/proyecto/:id" element={<ProyectoDetalles />} />
             <Route path="/proyectos/:id/casos" element={<CasosPage />} />
             <Route path="/proyectos/:id/casos/:casoId" element={<CasoDetalle />} />
          </Routes>
        </main>

        {/* Footer siempre abajo */}
        <Footer />
      </div>
    </UserProvider>
  );
}
