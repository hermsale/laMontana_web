/**
 * =============================================================================
 *  COMPONENTE: Footer (index.jsx)
 *  UBICACIÓN:  src/components/Footer/index.jsx
 * -----------------------------------------------------------------------------
 *  ¿Qué hace?
 *    - Orquesta el pie de página completo con la misma estructura y clases
 *      que el HTML original (mobile-first, grilla en desktop).
 *    - Integra los subcomponentes:
 *        • FooterContact  → columna izquierda (tel/mail/horarios)
 *        • FooterBrand    → columna central (logo/nombre/subtítulo/about)
 *        • FooterServices → columna derecha (chips de servicios)
 *        • FooterSocials  → fila inferior centrada con íconos de redes
 *
 *  Datos dinámicos:
 *    - Usa brandData (src/lib/footerData.js) para el copyright.
 *
 *  Estilos:
 *    - Este archivo importa "./Footer.css" con:
 *        • colores de fondo del footer
 *        • layout .footer-inner (grid areas)
 *        • espaciados/paddings del bloque general
 *      Los estilos específicos de cada sub-bloque están en sus propios CSS.
 * =============================================================================
 */

import React from "react";
import "./Footer.css"; // ← Layout y estilos globales del Footer

// Subcomponentes
import FooterContact from "./FooterContact";    // ./FooterContact/index.jsx
import FooterBrand from "./FooterBrand";        // ./FooterBrand/index.jsx
import FooterServices from "./FooterServices";  // ./FooterServices/index.jsx
import FooterSocials from "./FooterSocials";    // ./FooterSocials/index.jsx

// Datos de marca para el copy
import { brandData } from "/src/lib/footerData.js";
// =============================================================================
//  Render principal
// =============================================================================
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Contenedor max-width + grilla responsiva */}
      <div className="wrap footer-inner">
        {/* =====================================================================
            COLUMNA: CONTACTO (área: contact)
            ---------------------------------------------------------------------
            Contiene:
              - Teléfono (click-to-call)
              - Email (mailto)
              - Horarios
           ===================================================================== */}
        <div className="footer-col footer-contact">
          <FooterContact />
        </div>

        {/* =====================================================================
            COLUMNA: MARCA (área: brand, centrada)
            ---------------------------------------------------------------------
            Contiene:
              - Logo (link a Home)
              - Nombre + subtítulo
              - Párrafo “about”
           ===================================================================== */}
        <div className="footer-col footer-brand">
          <FooterBrand />
        </div>

        {/* =====================================================================
            COLUMNA: SERVICIOS (área: services)
            ---------------------------------------------------------------------
            Contiene:
              - Título
              - Lista vertical de chips de servicio
           ===================================================================== */}
        <div className="footer-col footer-services">
          <FooterServices />
        </div>

        {/* =====================================================================
            FILA INFERIOR: REDES (área: socials, centrada)
           ===================================================================== */}
        <FooterSocials />
      </div>

      {/* Línea inferior de copyright */}
      <div className="footer-copy">
        © {year} {brandData.name} Impresiones. Todos los derechos reservados.
      </div>
    </footer>
  );
}
