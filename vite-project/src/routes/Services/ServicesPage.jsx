import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth.jsx";

function ServicesPage({ onRequestAuth = () => {} }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContinuar = () => {
    if (!user?.token) {
      onRequestAuth("login");
      return;
    }
    navigate("/impresiones");
  };

  return (
    <main className="wrap" style={{ padding: "40px 16px", textAlign: "center" }}>
      <h1>Servicios</h1>
      <p>
        Esta sección centraliza solicitudes especiales. Para continuar con impresiones y copias,
        usa el botón de abajo.
      </p>
      <button type="button" className="btn-primary" onClick={handleContinuar}>
        Ir a impresiones y copias
      </button>
    </main>
  );
}

export default ServicesPage;
