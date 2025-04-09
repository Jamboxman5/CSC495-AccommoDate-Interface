import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, logout, isTokenExpired } from "./auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token && isTokenExpired(token)) {
      logout();
      navigate("/login");
    }
  }, []);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};
