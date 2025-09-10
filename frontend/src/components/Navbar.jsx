import React, { useState, useEffect } from "react";
import { Shield, User, ChevronDown, Menu, X, Home, FolderOpen, Users, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import { motion, AnimatePresence } from "framer-motion";

export default function NavbarNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleNavClick = (sectionId) => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Obtener breadcrumbs basado en la ruta actual
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [];

    if (path === "/") {
      breadcrumbs.push({ label: "Inicio", path: "/" });
    } else if (path === "/dashboard") {
      // No agregar breadcrumbs para el dashboard - mantenerlo limpio
    } else if (path.includes("/proyectos") && path.includes("/casos") && !path.includes("/casos/")) {
      breadcrumbs.push({ label: "Dashboard", path: "/dashboard" });
      breadcrumbs.push({ label: "Casos de Prueba", path: path });
    } else if (path.includes("/proyectos") && path.includes("/casos/")) {
      breadcrumbs.push({ label: "Dashboard", path: "/dashboard" });
      breadcrumbs.push({ label: "Casos", path: path.split('/').slice(0, -1).join('/') });
      breadcrumbs.push({ label: "Detalles", path: path });
    } else if (path === "/usuarios") {
      breadcrumbs.push({ label: "Dashboard", path: "/dashboard" });
      breadcrumbs.push({ label: "Gestión de Usuarios", path: "/usuarios" });
    } else if (path === "/login") {
      breadcrumbs.push({ label: "Iniciar Sesión", path: "/login" });
    } else if (path === "/register") {
      breadcrumbs.push({ label: "Registrarse", path: "/register" });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Elementos de navegación principales para usuarios logueados
  const getMainNavItems = () => {
    const items = [];

    if (user) {
      items.push({
        label: "Dashboard",
        path: "/dashboard",
        icon: <Home className="w-4 h-4" />,
        isActive: location.pathname === "/dashboard"
      });

      if (user.rol === "manager") {
        items.push({
          label: "Usuarios",
          path: "/usuarios",
          icon: <Users className="w-4 h-4" />,
          isActive: location.pathname === "/usuarios"
        });
      }
    }

    return items;
  };

  const mainNavItems = getMainNavItems();

  return (
    <>
      {/* Navbar principal */}
      <header className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo y navegación principal */}
            <div className="flex items-center space-x-8">
              <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => navigate("/")}
              >
                <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg group-hover:from-purple-700 group-hover:to-indigo-700 transition-all duration-200">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  INSPECTIA-WEB
                </span>
              </div>

              {/* Navegación principal - Desktop */}
              <nav className="hidden lg:flex space-x-1">
                {!user ? (
                  <>
                    <button
                      onClick={() => handleNavClick("servicios")}
                      className="px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      Servicios
                    </button>
                    <button
                      onClick={() => handleNavClick("normas")}
                      className="px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      Normas ISO
                    </button>
                    <button
                      onClick={() => handleNavClick("tipos")}
                      className="px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      Tipos de Pruebas
                    </button>
                    <button
                      onClick={() => handleNavClick("contacto")}
                      className="px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      Contacto
                    </button>
                  </>
                ) : (
                  mainNavItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        item.isActive
                          ? "bg-purple-50 text-purple-600"
                          : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))
                )}
              </nav>
            </div>

            {/* Usuario y menú móvil */}
            <div className="flex items-center space-x-4">
              {!user ? (
                <button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg text-sm font-medium"
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </button>
              ) : (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.nombre} {user.apellido}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{user.rol}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown del usuario */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50"
                      >
                        {/* Info del usuario */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.nombre} {user.apellido}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1 capitalize">
                            {user.rol}
                          </span>
                        </div>

                        {/* Opciones de navegación */}
                        <div className="py-1">
                          <button
                            onClick={() => {
                              navigate("/dashboard");
                              setDropdownOpen(false);
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          >
                            <FolderOpen className="w-4 h-4 mr-3" />
                            Gestiones
                          </button>

                          {user.rol === "manager" && (
                            <button
                              onClick={() => {
                                navigate("/usuarios");
                                setDropdownOpen(false);
                              }}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            >
                              <Users className="w-4 h-4 mr-3" />
                              Usuarios
                            </button>
                          )}

                         
                        </div>

                        {/* Cerrar sesión */}
                        <div className="border-t border-gray-100 py-1">
                          <button
                            onClick={() => {
                              logout();
                              setDropdownOpen(false);
                              navigate("/");
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <X className="w-4 h-4 mr-3" />
                            Cerrar sesión
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Botón menú móvil */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                {!user ? (
                  <>
                    <button
                      onClick={() => {
                        handleNavClick("servicios");
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      Servicios
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick("normas");
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      Normas ISO
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick("tipos");
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      Tipos de Pruebas
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick("contacto");
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      Contacto
                    </button>
                  </>
                ) : (
                  mainNavItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        item.isActive
                          ? "bg-purple-50 text-purple-600"
                          : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

    </>
  );
}
