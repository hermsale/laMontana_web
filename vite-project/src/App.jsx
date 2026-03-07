// ============================================================================
// Archivo: App.jsx
// Contexto: Raíz de la SPA de la landing. Define rutas de landing, carrito,
//            mis datos y placeholder de servicios, compartiendo Header/Footer.
// Alcance: Orquesta layout y estado global del sidebar/login para todas las
//          secciones públicas.
// Funciones/componentes clave:
//  - Estado sidebarOpen/sidebarTab y handlers open/close
//  - Rutas con <Routes>/<Route> para "/", "/carrito", "/mis-datos", "/servicios"
//  - Renderiza Header, SectionHero, SectionNews, SectionCatalog, Footer, CartPage,
//    MisDatos, placeholder Servicios.
// ============================================================================

import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";



// import CartPage from "./components/Cart/CartPage";
// import MisDatos from "./components/MisDatos";


import "./App.css";
import Layout from "./layout/Layout";

// rutas
import HomePage from "./routes/Home/HomePage";
import CartPage from "./routes/Cart/CartPage";
import ProfilePage from "./routes/Profile/ProfilePage";
import { useAuth } from "./context/useAuth.jsx";
import ImpresionesPage from "./routes/Impresiones/ImpresionesPage.jsx";
import ServicesPage from "./routes/Services/ServicesPage.jsx";

// Protege rutas que requieren sesión. Si no hay user, redirige a home y abre login.
function RequireAuth({ children, onUnauthorized }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (onUnauthorized) onUnauthorized();
      navigate("/", { replace: true });
    }
  }, [user, navigate, onUnauthorized]);

  if (!user) return null;
  return children;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("login");

  const openSidebar = (tab = "login", options = {}) => {
    setSidebarTab(tab);
    setSidebarOpen(true);
    if (options.scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    // Se agrego un Layout que envuelve todas las páginas, incluyendo el header y el footer. 
    // Se definio ésta como la HomePage la cual contiene las secciones Hero, News y Catalog
    <Routes>
      <Route
        path="/"
        element={
          <>
           
            <Layout
              sidebarOpen={sidebarOpen}
              sidebarTab={sidebarTab}
              onSidebarOpen={openSidebar}
              onSidebarClose={closeSidebar}
            >
              <HomePage onRequestAuth={(tab) => openSidebar(tab, { scrollToTop: true })} />
            </Layout>
          </>
        }
      />

{/*   pagina donde se visualiza el carrito */}
      <Route
        path="/carrito"
        element={
          <RequireAuth onUnauthorized={() => openSidebar("login", { scrollToTop: true })}>
            <Layout
              sidebarOpen={sidebarOpen}
              sidebarTab={sidebarTab}
              onSidebarOpen={openSidebar}
              onSidebarClose={closeSidebar}
            >
              <CartPage />
            </Layout>
          </RequireAuth>
        }
      />

      <Route
        path="/servicios"
        element={
          <Layout
            sidebarOpen={sidebarOpen}
            sidebarTab={sidebarTab}
            onSidebarOpen={openSidebar}
            onSidebarClose={closeSidebar}
          >
            <ServicesPage onRequestAuth={(tab) => openSidebar(tab, { scrollToTop: true })} />
          </Layout>
        }
      />

{/* pagina donde se visualiza los datos del usuario logiado */}
      <Route
        path="/mis-datos"
        element={
          <RequireAuth onUnauthorized={() => openSidebar("login", { scrollToTop: true })}>
            <Layout
              sidebarOpen={sidebarOpen}
              sidebarTab={sidebarTab}
              onSidebarOpen={openSidebar}
              onSidebarClose={closeSidebar}
            >
              <ProfilePage onRequireLogin={() => openSidebar("login", { scrollToTop: true })} />
            </Layout>
          </RequireAuth>
        }
      />

      <Route
        path="/impresiones"
        element={
          <RequireAuth onUnauthorized={() => openSidebar("login", { scrollToTop: true })}>
            <Layout
              sidebarOpen={sidebarOpen}
              sidebarTab={sidebarTab}
              onSidebarOpen={openSidebar}
              onSidebarClose={closeSidebar}
            >
              <ImpresionesPage />
            </Layout>
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
