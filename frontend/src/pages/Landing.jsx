import React, { useEffect, useState } from "react";
import { Shield, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GeminiChatBot from "../components/Geminichat1.jsx";
import { useUser } from "../components/UserContext";

function Landing() {
  const navigate = useNavigate();
  const { user } = useUser(); // Obtener usuario del contexto
  const [loading, setLoading] = useState(true); // Estado para el popup

  // Ahora isLoggedIn depende del contexto
  const isLoggedIn = !!user;

  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        await fetch("https://inspectia-web.onrender.com/health");
        console.log("✅ Backend despierto");
      } catch (error) {
        console.error("⚠️ No se pudo despertar el backend:", error);
      } finally {
        setLoading(false); // Ocultar popup cuando finalice
      }
    };

    wakeUpBackend();
  }, []);

  if (loading) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl border text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">
              Cargando Backend...
            </h2>
          <p className="text-gray-600 mt-2">
            Por favor espera mientras iniciamos el servidor.
          </p>
        </div>
      </div>
    );
  }

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

      {/* --- resto del contenido igual --- */}

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
                  <img
                    src="/icon/12966881.png"
                    alt="Testing IA"
                    className="w-8 h-8"
                  />
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
                  <img
                    src="/icon/tarea-completada.webp"
                    alt="Testing IA"
                    className="w-8 h-8"
                  />
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
                  <img
                    src="/icon/17026992.png"
                    alt="Testing IA"
                    className="w-8 h-8"
                  />
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
                  <img
                    src="/icon/4727413.png"
                    alt="Testing IA"
                    className="w-8 h-8"
                  />
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
                  <img
                    src="/icon/7910150.png"
                    alt="Testing IA"
                    className="w-8 h-8"
                  />
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
                  <img
                    src="/icon/8444080.png"
                    alt="Testing IA"
                    className="w-8 h-8"
                  />
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

      {/* Tipos de pruebas */}
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
                icon: "/icon/5009854.png",
              },
              {
                titulo: "Pruebas de Integración",
                desc: "Testing de la comunicación entre diferentes módulos y sistemas.",
                icon: "/icon/2275022.png",
              },
              {
                titulo: "Pruebas de Usabilidad",
                desc: "Evaluación de la experiencia del usuario y facilidad de uso.",
                icon: "/icon/17023757.png",
              },
              {
                titulo: "Pruebas de Compatibilidad",
                desc: "Testing en diferentes navegadores, dispositivos y sistemas operativos.",
                icon: "/icon/11923457.png",
              },
              {
                titulo: "Pruebas de Regresión",
                desc: "Verificación de que los cambios no afecten funcionalidades existentes.",
                icon: "/icon/3295505.png",
              },
              {
                titulo: "Pruebas de API",
                desc: "Testing de interfaces de programación de aplicaciones y servicios web.",
                icon: "/icon/10169724.png",
              },
              {
                titulo: "Pruebas de Accesibilidad",
                desc: "Verificación del cumplimiento de estándares de accesibilidad web.",
                icon: "/icon/5392792.png",
              },
              {
                titulo: "Pruebas Automatizadas",
                desc: "Scripts automatizados para testing continuo y eficiente.",
                icon: "/icon/2031688.png",
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
                <span className="flex items-center justify-center bg-purple-200 rounded-full mt-1 w-14 h-14 shrink-0">
                  <img
                    src={item.icon}
                    alt={item.titulo}
                    className="w-7 h-7 object-contain"
                  />
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
