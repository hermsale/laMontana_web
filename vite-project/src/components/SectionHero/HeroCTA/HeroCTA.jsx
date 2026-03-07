// ============================================================================
// Componente: HeroCTA
// Descripción:
//   - Renderiza el botón principal de llamada a la acción ("Comenzar a imprimir").
//   - Recibe tres props: href (enlace destino), label (texto visible) e icon (SVG).
//   - Mantiene la estructura y estilo del botón original del hero en HTML.
//   - Reutiliza las variables de color y transiciones definidas globalmente.
// Accesibilidad:
//   - Usa <a> con role="button" y aria-label descriptivo.
// ============================================================================

import React from "react";
import "./HeroCTA.css";

const HeroCTA = ({ href = "#", label = "Comenzar", icon, onClick }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a className="hero-btn" href={href} role="button" aria-label={label} onClick={handleClick}>
      {icon && <span className="hero-btn__icon">{icon}</span>}
      <span className="hero-btn__label">{label}</span>
    </a>
  );
};

export default HeroCTA;
