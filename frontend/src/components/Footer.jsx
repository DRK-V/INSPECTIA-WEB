import React from 'react';
import { Shield, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">INSPECTIA-WEB</span>
            </div>
            <p className="text-gray-400 text-sm">
              Plataforma líder en gestión de pruebas QA con inteligencia artificial.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Testing Automatizado</li>
              <li>Testing Manual</li>
              <li>Reportes y Métricas</li>
              <li>Gestión de Equipos</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Acerca de Nosotros</li>
              <li>Certificaciones</li>
              <li>Casos de Éxito</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>inspectia-web@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Colombia, Medellín</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 INSPECTIA-WEB. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
