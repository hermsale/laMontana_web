// ============================================================================
// Archivo: Header/Brand/index.jsx
// Contexto: Bloque de marca dentro del header (logo + título/subtítulo).
// Alcance: Se usa en el header de la landing; navega al inicio al hacer click.
// Funciones/componentes:
//  - goHome(): usa navigate hacia "/" y hace scroll al top
//  - Renderiza logo y textos descriptivos
// ============================================================================
import { useNavigate } from "react-router-dom";
import "./Brand.css";

export default function Brand() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className="brand brand-link"
      aria-label="La Montaña - ir al inicio"
      onClick={goHome}
    >
      <div className="logo">
        <img src="/images/icon.jpg" alt="icono" />
      </div>
      <div>
        <h1>La Montaña</h1>
        <p>Servicios de Impresión Profesional</p>
      </div>
    </button>
  );
}
