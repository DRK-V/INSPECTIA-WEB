import React from 'react';
import { useUser } from '../components/UserContext';

function Dashboard() {
  const { user } = useUser();

  // Mock de proyectos y casos
  const proyectos = [
    { id: 1, nombre: "Proyecto Web", estado: "En ejecución", resultado: "80% aprobado" },
    { id: 2, nombre: "App Móvil", estado: "Finalizado", resultado: "95% aprobado" }
  ];
  const casos = [
    { id: 1, descripcion: "Login válido", estado: "Pendiente", evidencia: null },
    { id: 2, descripcion: "Registro con email inválido", estado: "Aprobado", evidencia: "img1.png" }
  ];

  if (!user) {
    return <div className="py-20 text-center text-xl">Debes iniciar sesión para ver el dashboard.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Bienvenido, {user.nombre}</h1>
      {/* Proyectos para todos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Proyectos Solicitados</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Resultado</th>
                {user.rol !== 'cliente' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {proyectos.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.nombre}</td>
                  <td className="py-2">{p.estado}</td>
                  <td className="py-2">{p.resultado}</td>
                  {user.rol !== 'cliente' && (
                    <td className="py-2">
                      {user.rol === 'manager' && (
                        <button className="text-purple-600 hover:underline mr-2">Editar</button>
                      )}
                      <button className="text-purple-600 hover:underline">Ver Casos</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Casos de prueba para QA y Manager */}
      {(user.rol === 'manager' || user.rol === 'tester') && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Casos de Prueba</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Evidencia</th>
                  {user.rol === 'manager' && <th>Acciones</th>}
                  {user.rol === 'tester' && <th>Subir Evidencia</th>}
                </tr>
              </thead>
              <tbody>
                {casos.map(c => (
                  <tr key={c.id} className="border-t">
                    <td className="py-2">{c.descripcion}</td>
                    <td className="py-2">{c.estado}</td>
                    <td className="py-2">{c.evidencia ? c.evidencia : 'Sin evidencia'}</td>
                    {user.rol === 'manager' && (
                      <td className="py-2">
                        <button className="text-purple-600 hover:underline mr-2">Validar</button>
                        <button className="text-purple-600 hover:underline">Asignar</button>
                      </td>
                    )}
                    {user.rol === 'tester' && (
                      <td className="py-2">
                        <input type="file" className="mb-2" />
                        <button className="bg-green-500 text-white px-3 py-1 rounded mr-2">Aprobar</button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded">Fallido</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Reportes para cliente */}
      {user.rol === 'cliente' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Reportes y Métricas</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-lg font-semibold">Total Casos: 20</div>
                <div className="text-green-600">Aprobados: 16</div>
                <div className="text-red-600">Fallidos: 4</div>
              </div>
              <div className="text-xl font-bold">
                80% Completado
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Descargar PDF
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Descargar Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
