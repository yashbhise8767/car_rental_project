import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    // Initialize from localStorage on component mount
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      role: storedRole ? JSON.parse(storedRole) : null,
      token: storedToken || null,
    };
  });

  useEffect(() => {
    // Update localStorage whenever authData changes
    if (authData.token) {
      localStorage.setItem("token", authData.token);
    } else {
      localStorage.removeItem("token");
    }

    if (authData.user) {
        localStorage.setItem("user", JSON.stringify(authData.user));
    } else {
        localStorage.removeItem("user");
    }
    if (authData.role) {
        localStorage.setItem("role", JSON.stringify(authData.role));
    } else {
        localStorage.removeItem("role");
    }
  }, [authData]); // Run this effect whenever authData changes

  const login = (userData, token) => {
    setAuthData({ user: userData, role: userData.role, token });
  };

  const logout = () => {
    setAuthData({ user: null, role: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);