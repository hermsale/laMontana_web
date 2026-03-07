// ============================================================================
// Componente: HeroFeature
// Ubicación:  src/components/SectionHero/HeroFeature/HeroFeature.jsx
// ----------------------------------------------------------------------------
// Propósito:
//   - Representa un ítem individual de la fila de características (ícono + texto).
//   - Mantiene el look & feel del HTML original (clases, tamaños, spacing).
// Props:
//   - icon: ReactNode (SVG o componente de ícono)
//   - text: string (etiqueta visible)
// Accesibilidad:
//   - role="listitem" se define aquí para que el contenedor pueda usar role="list".
// Estilos:
//   - Aislados en HeroFeature.css (clases .feature, .feature__icon, .feature__label).
// ============================================================================

import React from "react";
import "./HeroFeature.css";

const HeroFeature = ({ icon, text }) => {
  return (
    <div className="feature" role="listitem">
      {/* Ícono del feature */}
      <span className="feature__icon" aria-hidden="true">
        {icon}
      </span>

      {/* Texto del feature */}
      <div className="feature__label">{text}</div>
    </div>
  );
};

export default HeroFeature;
