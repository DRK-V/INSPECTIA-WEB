import React from 'react'
import RegisterForm from '../components/Auth/RegisterForm.jsx'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <RegisterForm onLogin={() => navigate('/login')} />
    </div>
  )
}
