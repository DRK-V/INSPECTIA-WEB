import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Usuarios simulados
  const usuarios = [
    { username: 'cliente', rol: 'cliente', nombre: 'Cliente QA' },
    { username: 'manager', rol: 'manager', nombre: 'QA Manager' },
    { username: 'tester', rol: 'tester', nombre: 'QA Tester' }
  ];

  const login = (username) => {
    const u = usuarios.find(u => u.username === username);
    setUser(u || null);
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, login, logout, usuarios }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
