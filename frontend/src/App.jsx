import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Login />
          <Footer />
        </div>
      } />
      <Route path="/register" element={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Register />
          <Footer />
        </div>
      } />
      <Route path="/dashboard" element={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Dashboard />
          <Footer />
        </div>
      } />
    </Routes>
  );
}