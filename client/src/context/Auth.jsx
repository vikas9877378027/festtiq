import React, { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("auth_user");
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));

  const signIn = ({ user, token }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    localStorage.setItem("auth_token", token);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  // Optional: keep user in sync if multiple tabs
  useEffect(() => {
    const onStorage = () => {
      const u = localStorage.getItem("auth_user");
      const t = localStorage.getItem("auth_token");
      setUser(u ? JSON.parse(u) : null);
      setToken(t || null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
