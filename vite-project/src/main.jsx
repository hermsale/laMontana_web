// ============================================================================
// Archivo: main.jsx
// Contexto: Punto de entrada del frontend (landing). Monta la app con
//            HashRouter y el proveedor de autenticación global.
// Alcance: Inicializa React, aplica estilos globales y enruta toda la SPA.
// Funciones/estructuras:
//  - fetch de ReactDOM.createRoot y render de <App />
//  - Wrapper con <AuthProvider> y <HashRouter>
// ============================================================================
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/useAuth.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <HashRouter>
    <AuthProvider>
        <App />
    </AuthProvider>
      </HashRouter>
  </StrictMode>
);
