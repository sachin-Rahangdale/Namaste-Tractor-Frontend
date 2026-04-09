import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData && userData !== "{}") {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await apiLogin(username, password);
      console.log("Login response:", res.data); // Debug: see what backend returns

      let token = null;
      let userInfo = null;

      // Try to extract token and user from various possible response structures
      if (res.data.token) {
        token = res.data.token;
      } else if (res.data.accessToken) {
        token = res.data.accessToken;
      } else if (typeof res.data === "string") {
        // If response is just a string token, we need another call to get user
        token = res.data;
        // You may need to fetch user profile separately here
        // For now, we'll set a minimal user object
        userInfo = { username, role: "USER" }; // fallback
      }

      if (res.data.user) {
        userInfo = res.data.user;
      } else if (res.data.id || res.data.username) {
        userInfo = res.data;
      } else if (!userInfo) {
        // If no user object, assume the whole response (minus token) is user info
        const { token: t, ...rest } = res.data;
        userInfo = rest;
      }

      // Ensure userInfo has at least username and role
      if (!userInfo.role) userInfo.role = "USER"; // default role

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);
      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (name, username, password) => {
    const res = await apiRegister(name, username, password);
    // After registration, you might want to auto-login or just return
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);