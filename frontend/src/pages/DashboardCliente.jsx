import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardCliente() {
  const navigate = useNavigate();

  // Mock de proyectos
  const proyectos = [
    { id: 1, nombre: "Proyecto Web", estado: "En ejecución" },
    { id: 2, nombre: "App Móvil", estado: "Finalizado" }
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Proyectos QA</h1>
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700"
          onClick={() => navigate('/nuevo-proyecto')}
        >
          Nuevo Proyecto
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Nombre</th>
              <th className="text-left py-2">Estado</th>
              <th className="text-left py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.map(p => (
              <tr key={p.id} className="border-t">
                <td className="py-2">{p.nombre}</td>
                <td className="py-2">{p.estado}</td>
                <td className="py-2">
                  <button
                    className="text-purple-600 hover:underline"
                    onClick={() => navigate(`/proyecto/${p.id}`)}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardCliente;
