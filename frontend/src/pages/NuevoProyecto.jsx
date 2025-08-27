import React, { useState } from 'react';

function NuevoProyecto() {
  const [nombre, setNombre] = useState('');
  const [url, setUrl] = useState('');
  const [mockup, setMockup] = useState(null);
  const [excel, setExcel] = useState(null);

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Proyecto</h1>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del proyecto"
          className="w-full border rounded px-3 py-2"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <input
          type="url"
          placeholder="URL del sistema"
          className="w-full border rounded px-3 py-2"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <div>
          <label className="block mb-1">Mockups (opcional)</label>
          <input type="file" accept="image/*" onChange={e => setMockup(e.target.files[0])} />
        </div>
        <div>
          <label className="block mb-1">HU/Criterios (Excel)</label>
          <input type="file" accept=".xlsx,.xls" onChange={e => setExcel(e.target.files[0])} />
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700"
        >
          Registrar Proyecto
        </button>
      </form>
    </div>
  );
}

export default NuevoProyecto;
