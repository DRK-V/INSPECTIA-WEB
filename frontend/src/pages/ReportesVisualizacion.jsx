import React from 'react';

function ReportesVisualizacion() {
  // Mock de métricas
  const metricas = {
    total: 20,
    aprobados: 16,
    fallidos: 4,
    porcentaje: 80
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Reportes y Métricas de Ejecución</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-lg font-semibold">Total Casos: {metricas.total}</div>
            <div className="text-green-600">Aprobados: {metricas.aprobados}</div>
            <div className="text-red-600">Fallidos: {metricas.fallidos}</div>
          </div>
          <div className="text-xl font-bold">
            {metricas.porcentaje}% Completado
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
      {/* Aquí se pueden agregar gráficos y visualizaciones */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <span className="text-gray-500">Gráficos de avance y resultados aquí...</span>
      </div>
    </div>
  );
}

export default ReportesVisualizacion;
