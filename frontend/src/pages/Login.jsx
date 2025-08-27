import React from 'react'
import LoginForm from '../components/Auth/LoginForm.jsx'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm onRegister={() => navigate('/register')} />
    </div>
  )
}
