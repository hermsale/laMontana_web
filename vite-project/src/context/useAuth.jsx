import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/authApi";

const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const persistUser = (data) => {
    const raw = data.data ?? data;
    const usuario = raw.usuario ?? raw;
    const userData = { ...usuario };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const loginWithCredentials = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      persistUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register(payload);
      persistUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.update(id, payload);
      persistUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleIdToken = async (idToken) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.google(idToken);
      persistUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async (id) => {
    const data = await authApi.getUser(id);
    persistUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Si falla la API, se limpia igual en cliente.
    }
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginWithCredentials,
        registerUser,
        updateUser,
        refreshUser,
        logout,
        loginWithGoogleIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
