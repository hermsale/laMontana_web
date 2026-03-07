// ============================================================================
// Archivo: components/Header/index.jsx
// Contexto: Encabezado principal de la landing. Incluye brand, chip de usuario,
//            botón de menú y sidebar de autenticación/cuenta.
// Alcance: Se muestra en todas las vistas públicas; controla apertura/cierre
//          del sidebar según props recibidas desde App.
// Funciones/componentes:
//  - <Brand />: logo y título
//  - <UserChip />: estado de usuario
//  - <BtnMenu />: abre sidebar
//  - <Sidebar />: panel de login/registro o menú de usuario
// ============================================================================
import Brand from "./Brand";
import BtnMenu from "./BtnMenu";
import "./Header.css";
import UserChip from "./UserChip";

import Sidebar from "./Sidebar";

function Header({
  sidebarOpen = false,
  sidebarTab = "login",
  onSidebarOpen = () => {},
  onSidebarClose = () => {},
}) {
  return (
    <header>
      <div className="header-container">
        
        <div className="wrap header-bar">
          
          <Brand />
          <UserChip />
          <BtnMenu onClick={() => onSidebarOpen("login")} />

        </div>


        <Sidebar 
          open={sidebarOpen}
          onClose={onSidebarClose} // cuando se hace click en el onClose, se cambia el estado a false
          defaultTab={sidebarTab}
        />

      </div>
    </header>
  );
}

export default Header;
