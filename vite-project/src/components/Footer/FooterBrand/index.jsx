/**
 * =============================================================================
 *  SUBCOMPONENTE: FooterBrand (index.jsx)
 *  UBICACIÓN:     src/components/Footer/FooterBrand/index.jsx
 * -----------------------------------------------------------------------------
 *  ¿Qué hace?
 *    - Renderiza el bloque central de marca dentro del Footer:
 *      • Logo (enlace a Home)
 *      • Nombre (h4)
 *      • Subtítulo / eslogan
 *      • Descripción breve
 *
 *  Datos:
 *    - Se leen desde src/lib/footerData.js → brandData
 *
 *  Estilos:
 *    - Estilos específicos en: ./FooterBrand.css
 *    - El layout global del footer (grid, colores de fondo, etc.) irá en
 *      src/components/Footer/Footer.css
 * =============================================================================
 */

import React from "react";
import { brandData } from "/src/lib/footerData.js";
import "./FooterBrand.css"; // ← Estilos específicos del bloque de marca

// =============================================================================
//  Render
// =============================================================================
export default function FooterBrand() {
  return (
    <>
      {/* =========================================================================
          BLOQUE: MARCA (centrado)
          -------------------------------------------------------------------------
          - logo: imagen clickeable que lleva al Home
          - h4:   nombre de la marca
          - div:  subtítulo / tagline
          - p:    descripción corta
         ========================================================================= */}
      <a
        className="logo"
        href={brandData.homeHref}
        aria-label={`Inicio ${brandData.name}`}
      >
        <img src={brandData.logoSrc} alt={`Logo ${brandData.name}`} />
      </a>

      <h4>{brandData.name}</h4>

      <div className="subtitle">{brandData.subtitle}</div>

      <p className="about">{brandData.about}</p>
    </>
  );
}
