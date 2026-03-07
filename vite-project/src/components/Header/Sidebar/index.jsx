import "./Sidebar.css";
import BtnSignIn from "./BtnSignIn";
import BtnSignUp from "./BtnSignUp";
import BtnLogin from "./BtnLogin";
import UserMenu from "./UserMenu/index.jsx";
import BtnGoogleLogin from "./BtnGoogleLogin";
import Register from "../Register";

import { useAuth } from "../../../context/useAuth.jsx";
import { useEffect, useState } from "react";

function Sidebar({ open, onClose, defaultTab = "login" }) {
  const { user, logout, loginWithCredentials, registerUser, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tabActiva, setTabActiva] = useState("login");
  const [mensajeError, setMensajeError] = useState(null);

  useEffect(() => {
    if (error) {
      setMensajeError(error);
    }
  }, [error]);

  useEffect(() => {
    if (open) {
      setTabActiva(defaultTab || "login");
    }
  }, [defaultTab, open]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensajeError(null);
    try {
      await loginWithCredentials(email, password);
      onClose();
    } catch (err) {
      setMensajeError(err.message || "No se pudo iniciar sesión");
    }
  };

  const handleRegister = async (datos) => {
    setMensajeError(null);
    try {
      await registerUser(datos);
      onClose();
    } catch (err) {
      setMensajeError(err.message || "No se pudo crear la cuenta");
      throw err;
    }
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`sidebar ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        {/* ===========================
            USUARIO LOGUEADO
        =========================== */}
        {user ? (
          <>
            <div className="sidebar-header">
              <h2 id="sidebar-title">Bienvenido</h2>
              <button
                type="button"
                id="sidebar-close"
                className="sidebar-close"
                aria-label="Cerrar menú"
                onClick={onClose}
              >
                &times;
              </button>
            </div>

            <UserMenu 
              logout={logout} 
              onClose={onClose} />
          </>
        ) : (
          <>
            {/* ===========================
                USUARIO NO LOGUEADO
            =========================== */}
            <div className="sidebar-header">
              <h2 id="sidebar-title">Tu cuenta</h2>
              <button
                type="button"
                id="sidebar-close"
                className="sidebar-close"
                aria-label="Cerrar menú"
                onClick={onClose}
              >
                &times;
              </button>
            </div>

            <div className="tabs" role="tablist">
              <BtnLogin activo={tabActiva === "login"} onClick={() => setTabActiva("login")} />
              <BtnSignUp activo={tabActiva === "register"} onClick={() => setTabActiva("register")} />
            </div>

            {tabActiva === "login" ? (
              <form
                id="form-login"
                className="panel active"
                role="tabpanel"
                onSubmit={handleLogin}
              >
                <label htmlFor="login-email">Correo</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="login-password">Contraseña</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {mensajeError && <p className="form-error">{mensajeError}</p>}

                <BtnSignIn disabled={loading} />

                <BtnGoogleLogin onSuccess={onClose} />
                <p className="sidebar-test-credentials" role="note">
                  Usuario de prueba: <strong>prueba@prueba.com</strong>
                  <br />
                  Contraseña: <strong>targetgtr</strong>
                </p>
              </form>
            ) : (
              <Register onSubmit={handleRegister} cargando={loading} onGoogleSuccess={onClose} />
            )}
          </>
        )}
      </aside>

      {/* Overlay */}
      {open && <div className="overlay" onClick={onClose}></div>}
    </>
  );
}

export default Sidebar;
