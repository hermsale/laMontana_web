// ============================================================================
// Componente: HeroFeaturesRow
// Ubicación:  src/components/SectionHero/HeroFeaturesRow/HeroFeaturesRow.jsx
// ----------------------------------------------------------------------------
// Propósito:
//   - Renderiza la fila de características del Hero (ícono + texto).
//   - Mantiene la semántica del HTML original con role="list" y "listitem".
// Props:
//   - features: Array<{ id: string, text: string, icon: ReactNode }>
// Accesibilidad:
//   - Contenedor con role="list".
//   - Cada item con role="listitem".
// Estilos:
//   - CSS aislado en HeroFeaturesRow.css (clases .icons-row, .feature).
// ============================================================================

import React from "react";
import "./HeroFeaturesRow.css";
import HeroFeature from "../HeroFeature/HeroFeature";

const HeroFeaturesRow = ({ features = [] }) => {
  return (
    <div className="icons-row" role="list" aria-label="Características destacadas">
      {features.map(({ id, text, icon }) => (
        <HeroFeature key={id} icon={icon} text={text} />
      ))}
    </div>
  );
};

export default HeroFeaturesRow;
