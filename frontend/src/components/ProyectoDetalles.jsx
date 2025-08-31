import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const BACKEND_URL = "https://inspectia-web.onrender.com";
function ProyectoDetalles() {
  const { id } = useParams();
  const [casos, setCasos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/casos/${id}`)
      .then((res) => res.json())
      .then((data) => setCasos(data))
      .catch((err) => console.error("Error cargando casos:", err));
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-purple-600 hover:underline"
      >
        ← Volver
      </button>

      <h1 className="text-2xl font-bold mb-6">Casos de Uso</h1>
      <div className="bg-white shadow rounded-lg p-6">
        {casos.length === 0 ? (
          <p>No hay casos registrados para este proyecto.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Descripción</th>
                <th className="py-2 px-4 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {casos.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="py-2 px-4">{c.id}</td>
                  <td className="py-2 px-4">{c.descripcion}</td>
                  <td className="py-2 px-4">{c.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProyectoDetalles;
