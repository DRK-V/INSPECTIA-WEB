import React, { useState } from 'react'

export default function LoginForm({ onRegister }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Email o usuario"
          className="border rounded px-3 py-2"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border rounded px-3 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-black text-white py-2 rounded hover:bg-gray-800">
          Entrar
        </button>
      </form>
      <div className="text-center mt-4">
        <button className="text-blue-600 underline" onClick={onRegister}>
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  )
}
