import React, { useState } from "react";
import { Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    // Ir al home primero
    navigate("/");

    // Dar un pequeño delay para que cargue el home y luego haga scroll
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Shield className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">
              INSPECTIA-WEB
            </span>
          </div>

          {/* Menú de navegación */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => handleNavClick("servicios")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Servicios
            </button>
            <button
              onClick={() => handleNavClick("normas")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Normas ISO
            </button>
            <button
              onClick={() => handleNavClick("tipos")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Tipos de Pruebas
            </button>
            <button
              onClick={() => handleNavClick("contacto")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Contacto
            </button>
          </nav>

        
          <div className="flex gap-4 items-center relative">
            {!user ? (
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
            ) : (
              <div>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center"
                >
                  <User className="h-8 w-8 text-gray-700 hover:text-purple-600" />
                  <span className="ml-2 font-medium text-gray-700">
                    {user.nombre}
                  </span>
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100"
                    >
                      Gestiones
                    </button>
                    <button
                      onClick={() => {
                        logout(); 
                        setOpen(false);
                        navigate("/"); 
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
