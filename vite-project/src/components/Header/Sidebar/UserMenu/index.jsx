import { useNavigate } from "react-router-dom";
import "./UserMenu.css";

function UserMenu({ logout, onClose }) {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onClose) {
      onClose();
    }
  };

  const goToCatalog = () => goTo("/impresiones");

  return (
    <>
      {/* Menú visible solo si hay sesión */}
      <nav id="auth-menu" className="panel" role="menu">
        <button
          type="button"
          className="menu-item"
          role="menuitem"
          onClick={() => goTo("/")}
        >
          Inicio
        </button>
        <button
          type="button"
          className="menu-item"
          role="menuitem"
          onClick={() => goTo("/mis-datos")}
        >
          Mis datos
        </button>
        <button
          type="button"
          className="menu-item"
          role="menuitem"
          onClick={goToCatalog}
        >
          Impresiones y copias
        </button>
        <button
          type="button"
          className="menu-item"
          role="menuitem"
          onClick={() => goTo("/carrito")}
        >
          Carrito
        </button>

        <button
          type="button"
          id="logout-btn"
          className="logout-btn"
          role="menuitem"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </nav>
    </>
  );
}

export default UserMenu;
