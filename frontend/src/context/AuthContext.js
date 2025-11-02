import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  }, [token, username]);

  const logout = () => {
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, username, setUsername, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
