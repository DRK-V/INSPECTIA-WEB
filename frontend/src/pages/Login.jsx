import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useUser } from '../components/UserContext';

export default function Login() {
  const { login, usuarios } = useUser();
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Usuario temporal
    if (email === 'usuario@demo.com' && password === 'demo123') {
      setError('')
      navigate('/dashboard')
    } else {
      setError('Credenciales incorrectas')
    }
  }

  const handleLogin = (username) => {
    login(username);
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 py-20">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Iniciar Sesión
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Accede a la plataforma profesional de gestión de pruebas QA.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Correo electrónico</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors">
            Entrar
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600">¿No tienes cuenta? </span>
          <Link to="/register" className="text-purple-600 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </div>
        <div className="mt-4 text-xs text-gray-400 text-center">
          Usuario demo: usuario@demo.com / demo123
        </div>
        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Selecciona tu usuario</h1>
          <div className="space-y-4">
            {usuarios.map(u => (
              <button
                key={u.username}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded font-medium hover:bg-purple-700"
                onClick={() => handleLogin(u.username)}
              >
                {u.nombre} ({u.rol})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
