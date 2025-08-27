import React from 'react';

function GestionCasosPrueba() {
  // Mock de casos generados
  const casos = [
    { id: 1, descripcion: "Login válido", estado: "Pendiente", asignado: "QA Tester 1" },
    { id: 2, descripcion: "Registro con email inválido", estado: "Validado", asignado: "QA Tester 2" }
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Casos de Prueba</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Asignado a</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {casos.map(c => (
              <tr key={c.id} className="border-t">
                <td className="py-2">{c.descripcion}</td>
                <td className="py-2">{c.estado}</td>
                <td className="py-2">{c.asignado}</td>
                <td className="py-2">
                  <button className="text-purple-600 hover:underline mr-2">Validar</button>
                  <button className="text-purple-600 hover:underline">Asignar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GestionCasosPrueba;
