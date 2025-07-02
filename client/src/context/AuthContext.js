import React, { createContext, useContext, useState, useEffect } from "react";
import API_BASE_URL from '../api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          localStorage.removeItem("token");
          throw new Error("Invalid token");
        }
      })
      .then(userData => {
        setUser({ ...userData, token });
      })
      .catch(err => {
        localStorage.removeItem("token");
        setUser(null);
      });
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(profile => setUser({ ...profile, token }))
      .catch(() => setUser({ ...userData, token }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = (profile) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
} 