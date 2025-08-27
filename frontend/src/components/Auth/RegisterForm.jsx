import React, { useState } from 'react'

export default function RegisterForm({ onLogin }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    empresa: ''
  })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
      <form className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className="border rounded px-3 py-2"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="nombre"
          type="text"
          placeholder="Nombre"
          className="border rounded px-3 py-2"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          name="apellido"
          type="text"
          placeholder="Apellido"
          className="border rounded px-3 py-2"
          value={form.apellido}
          onChange={handleChange}
        />
        <input
          name="telefono"
          type="text"
          placeholder="Teléfono"
          className="border rounded px-3 py-2"
          value={form.telefono}
          onChange={handleChange}
        />
        <input
          name="empresa"
          type="text"
          placeholder="Empresa"
          className="border rounded px-3 py-2"
          value={form.empresa}
          onChange={handleChange}
        />
        <button type="submit" className="bg-black text-white py-2 rounded hover:bg-gray-800">
          Registrarse
        </button>
      </form>
      <div className="text-center mt-4">
        <button className="text-blue-600 underline" onClick={onLogin}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  )
}
