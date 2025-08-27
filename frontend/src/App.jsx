import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <UserProvider>
      {/* <Navbar /> Si deseas que esté en todas las páginas */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      {/* <Footer /> Si deseas que esté en todas las páginas */}
    </UserProvider>
  );
}