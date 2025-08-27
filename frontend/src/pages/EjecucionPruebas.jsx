import React, { useState } from 'react';

function EjecucionPruebas() {
  // Mock de casos asignados
  const casos = [
    { id: 1, descripcion: "Login válido", estado: "Pendiente" },
    { id: 2, descripcion: "Registro con email inválido", estado: "Pendiente" }
  ];

  const [evidencia, setEvidencia] = useState({});

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Ejecución de Pruebas</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Evidencia</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {casos.map(c => (
              <tr key={c.id} className="border-t">
                <td className="py-2">{c.descripcion}</td>
                <td className="py-2">{c.estado}</td>
                <td className="py-2">
                  <input
                    type="file"
                    onChange={e => setEvidencia({ ...evidencia, [c.id]: e.target.files[0] })}
                  />
                </td>
                <td className="py-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded mr-2">Aprobar</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">Fallido</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EjecucionPruebas;
