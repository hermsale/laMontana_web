/**
 * =============================================================================
 *  SUBCOMPONENTE: FooterServices (index.jsx)
 *  UBICACIÓN:     src/components/Footer/FooterServices/index.jsx
 * -----------------------------------------------------------------------------
 *  ¿Qué hace?
 *    - Renderiza la columna de “Servicios” en el footer:
 *      • Título (h4)
 *      • Lista vertical con chips (ul.services > li)
 *
 *  Datos:
 *    - Se leen desde src/lib/footerData.js → services (array de strings)
 *
 *  Estilos:
 *    - Estilos específicos en: ./FooterServices.css
 *    - El layout global del footer (grid, fondo, paddings) irá en Footer.css
 * =============================================================================
 */

import React from "react";
import { services } from "/src/lib/footerData.js";
import "./FooterServices.css"; // ← Estilos del bloque de servicios

// =============================================================================
//  Render
// =============================================================================
export default function FooterServices() {
  return (
    <>
      {/* ============================================================
          SERVICIOS: listado como chips (flex column)
         ============================================================ */}
      <h4>Servicios</h4>

      <ul className="services" role="list">
        {services.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </>
  );
}
