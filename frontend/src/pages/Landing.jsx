import React, { useEffect } from "react";
import { Shield, CheckCircle, Award } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import GeminiChatBot from "../components/GeminiChatBot.jsx";
import { useUser } from "../components/UserContext";

function Landing() {
  const navigate = useNavigate();
  const { user } = useUser(); // Obtener usuario del contexto

  // Ahora isLoggedIn depende del contexto
  const isLoggedIn = !!user;
  useEffect(() => {
  const wakeUpBackend = async () => {
    try {
      await fetch("https://inspectia-web.onrender.com/health");
      console.log("✅ Backend despierto");
    } catch (error) {
      console.error("⚠️ No se pudo despertar el backend:", error);
    }
  };

  wakeUpBackend();
}, []);



  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Chat bot flotante */}
      <GeminiChatBot />

      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Gestión de Pruebas QA
            <br />
            con <span className="text-purple-600">Inteligencia Artificial</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma profesional para la gestión de pruebas de calidad
            asistida por IA.
            <br />
            Optimiza tus procesos de testing con tecnología de vanguardia.
          </p>
          {!isLoggedIn && (
            <button
              className="bg-black text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors"
              onClick={() => navigate("/login")}
            >
              Solicitar Servicio
            </button>
          )}
        </div>
      </section>

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
            <div className="bg-gray-50 p-8 rounded-lg flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-purple-200 p-3 rounded-lg">
                  <svg width="32" height="32" fill="none">
                    <rect width="32" height="32" rx="8" fill="#A78BFA" />
                    <path
                      d="M16 10v12M10 16h12"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Testing Automatizado con IA
              </h3>
              <p className="text-gray-600 mb-6">
                Generación automática de casos de prueba utilizando inteligencia
                artificial para optimizar la cobertura y eficiencia del testing.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-purple-200 p-3 rounded-lg">
                  <svg width="32" height="32" fill="none">
                    <rect width="32" height="32" rx="8" fill="#A78BFA" />
                    <path
                      d="M10 22V10h12v12H10z"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Testing Manual Especializado
              </h3>
              <p className="text-gray-600 mb-6">
                Pruebas manuales ejecutadas por expertos QA con metodologías
                probadas y documentación detallada.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-purple-200 p-3 rounded-lg">
                  <svg width="32" height="32" fill="none">
                    <rect width="32" height="32" rx="8" fill="#A78BFA" />
                    <path
                      d="M10 22v-6m4 6v-10m4 10v-4"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Reportes y Métricas
              </h3>
              <p className="text-gray-600 mb-6">
                Dashboards interactivos y reportes detallados con métricas de
                calidad y recomendaciones de mejora.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-purple-200 p-3 rounded-lg">
                  <svg width="32" height="32" fill="none">
                    <rect width="32" height="32" rx="8" fill="#A78BFA" />
                    <path
                      d="M16 14a2 2 0 100-4 2 2 0 000 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Gestión de Equipos QA
              </h3>
              <p className="text-gray-600 mb-6">
                Plataforma colaborativa para la gestión de equipos de testing
                con asignación inteligente de tareas.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-purple-200 p-3 rounded-lg">
                  <svg width="32" height="32" fill="none">
                    <rect width="32" height="32" rx="8" fill="#A78BFA" />
                    <path
                      d="M16 10v6l4 2"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Testing de Performance
              </h3>
              <p className="text-gray-600 mb-6">
                Pruebas de rendimiento y carga para garantizar la escalabilidad
                y estabilidad de tus aplicaciones.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-purple-200 p-3 rounded-lg">
                  <svg width="32" height="32" fill="none">
                    <rect width="32" height="32" rx="8" fill="#A78BFA" />
                    <path
                      d="M16 10l6 2v4c0 4.418-3.582 8-8 8s-8-3.582-8-8v-4l6-2z"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Testing de Seguridad
              </h3>
              <p className="text-gray-600 mb-6">
                Auditorías de seguridad y pruebas de penetración para
                identificar vulnerabilidades en tus sistemas.
              </p>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ISO 9001:2015
              </h3>
              <p className="text-gray-600">
                Sistema de Gestión de Calidad para procesos de testing
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg text-center shadow-sm">
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ISO 27001:2013
              </h3>
              <p className="text-gray-600">
                Gestión de Seguridad de la Información en testing
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg text-center shadow-sm">
              <CheckCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ISO 29119
              </h3>
              <p className="text-gray-600">
                Estándar internacional para testing de software
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tipos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tipos de Pruebas Especializadas
            </h2>
            <p className="text-xl text-gray-600">
              Cobertura completa de testing para todos los aspectos de tu
              aplicación
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                titulo: "Pruebas Funcionales",
                desc: "Verificación de que el software cumple con los requisitos funcionales especificados.",
                icon: (
                  <svg width="28" height="28" fill="none">
                    <rect width="28" height="28" rx="14" fill="#A78BFA" />
                    <path
                      d="M10 10h8M10 14h8M10 18h5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="8" cy="10" r="1" fill="#fff" />
                    <circle cx="8" cy="14" r="1" fill="#fff" />
                    <circle cx="8" cy="18" r="1" fill="#fff" />
                  </svg>
                ),
              },
              {
                titulo: "Pruebas de Integración",
                desc: "Testing de la comunicación entre diferentes módulos y sistemas.",
                icon: (
                  <svg width="28" height="28" fill="none">
                    <rect width="28" height="28" rx="14" fill="#A78BFA" />
                    <path
                      d="M10 18l8-8M10 10h8v8"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                titulo: "Pruebas de Usabilidad",
                desc: "Evaluación de la experiencia del usuario y facilidad de uso.",
                icon: (
                  <svg width="28" height="28" fill="none">
                    <rect width="28" height="28" rx="14" fill="#A78BFA" />
                    <circle cx="14" cy="12" r="3" fill="#fff" />
                    <path
                      d="M8 20c0-2.21 2.91-4 6-4s6 1.79 6 4"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </svg>
                ),
              },
              {
                titulo: "Pruebas de Compatibilidad",
                desc: "Testing en diferentes navegadores, dispositivos y sistemas operativos.",
                icon: (
                  <svg width="28" height="28" fill="none">
                    <rect width="28" height="28" rx="14" fill="#A78BFA" />
                    <rect
                      x="8"
                      y="10"
                      width="8"
                      height="6"
                      rx="2"
                      fill="#fff"
                    />
                    <rect
                      x="12"
                      y="17"
                      width="4"
                      height="2"
                      rx="1"
                      fill="#fff"
                    />
                  </svg>
                ),
              },
              {
                titulo: "Pruebas de Regresión",
                desc: "Verificación de que los cambios no afecten funcionalidades existentes.",
                icon: (
                  <svg width="28" height="28" fill="none">
                    <rect width="28" height="28" rx="14" fill="#A78BFA" />
                    <path
                      d="M18 10a6 6 0 1 0 2 6h-2m0-6v2h2"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
              },
              {
                titulo: "Pruebas de API",
                desc: "Testing de interfaces de programación de aplicaciones y servicios web.",
                icon: (
                  <svg width="28" height="28" fill="none">
                    <rect width="28" height="28" rx="14" fill="#A78BFA" />
                    <path
                      d="M10 18h8a3 3 0 0 0 0-6 4 4 0 0 0-8 0 3 3 0 0 0 0 6z"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </svg>
                ),
              },
              {
                titulo: "Pruebas de Accesibilidad",
                desc: "Verificación del cumplimiento de estándares de accesibilidad web.",
                icon: (
                  <svg width="28" height="28" fill="none">
                    <rect width="28" height="28" rx="14" fill="#A78BFA" />
                    <ellipse
                      cx="14"
                      cy="14"
                      rx="6"
                      ry="4"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <circle cx="14" cy="14" r="1.5" fill="#fff" />
                  </svg>
                ),
              },
              {
                titulo: "Pruebas Automatizadas",
                desc: "Scripts automatizados para testing continuo y eficiente.",
                icon: (
                  <svg width="28" height="28" fill="none">
                    <rect width="28" height="28" rx="14" fill="#A78BFA" />
                    <rect
                      x="10"
                      y="12"
                      width="8"
                      height="6"
                      rx="2"
                      fill="#fff"
                    />
                    <circle cx="12" cy="15" r="1" fill="#A78BFA" />
                    <circle cx="16" cy="15" r="1" fill="#A78BFA" />
                    <rect
                      x="13"
                      y="10"
                      width="2"
                      height="2"
                      rx="1"
                      fill="#fff"
                    />
                  </svg>
                ),
              },
            ].map((item, idx) => (
              <div
                key={item.titulo}
                className={`bg-white p-6 rounded-xl shadow flex items-start gap-4 transition-all duration-300
                  opacity-0 animate-fade-in
                  hover:-translate-y-2 hover:shadow-lg`}
                style={{
                  animationDelay: `${idx * 0.1}s`,
                  animationFillMode: "forwards",
                }}
              >
                <span className="inline-block bg-purple-500 text-white p-3 rounded-full mt-1">
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {item.titulo}
                  </h3>
                  <p className="text-gray-600 text-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <style>
            {`
              @keyframes fade-in {
                to { opacity: 1; }
              }
              .animate-fade-in {
                animation: fade-in 0.7s ease forwards;
              }
            `}
          </style>
        </div>
      </section>
    </div>
  );
}

export default Landing;
