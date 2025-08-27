import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard de Usuario</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">ID</th>
              <th className="border px-4 py-2 text-left">Prueba</th>
              <th className="border px-4 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">1</td>
              <td className="border px-4 py-2">Login QA</td>
              <td className="border px-4 py-2">Completada</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">2</td>
              <td className="border px-4 py-2">Registro QA</td>
              <td className="border px-4 py-2">Pendiente</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
