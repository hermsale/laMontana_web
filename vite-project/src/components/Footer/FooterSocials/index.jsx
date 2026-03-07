/**
 * =============================================================================
 *  SUBCOMPONENTE: FooterSocials (index.jsx)
 *  UBICACIÓN:     src/components/Footer/FooterSocials/index.jsx
 * -----------------------------------------------------------------------------
 *  ¿Qué hace?
 *    - Renderiza la fila de íconos con enlaces a redes sociales:
 *      • WhatsApp | Instagram | Facebook
 *
 *  Datos:
 *    - Se leen desde src/lib/footerData.js → socialLinks
 *
 *  Accesibilidad:
 *    - Usa aria-label por enlace y <nav aria-label="Redes sociales">
 *    - target="_blank" + rel="noopener" por seguridad
 *
 *  Estilos:
 *    - Estilos específicos en: ./FooterSocials.css
 *    - El layout global (grid y áreas) se aplicará en Footer.css (más adelante).
 * =============================================================================
 */

import React from "react";
import { socialLinks } from "/src/lib/footerData.js";
import "./FooterSocials.css"; // ← Estilos específicos de la barra de redes

// =============================================================================
//  Render
// =============================================================================
export default function FooterSocials() {
  return (
    <nav className="socials footer-socials" aria-label="Redes sociales">
      {/* ==========================
          WhatsApp
         ========================== */}
      <a
        href={socialLinks.whatsapp}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp"
        title="WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.5 3.5A11 11 0 0 0 3.1 17.4L2 22l4.7-1.2A11 11 0 0 0 12 23a11 11 0 0 0 8.5-18.5zM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-2.7.7.7-2.6-.2-.3A9 9 0 1 1 12 21zm5-6.2c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.8 0a7.7 7.7 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.4 0-.6.2-.8l.5-.7c.2-.2.3-.4.4-.6.1-.3 0-.5 0-.7l-1-2c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.6c.2.3 2.4 3.7 5.8 5.2l2 .8c.8.3 1.5.3 2 .2.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.6-.3z"
          />
        </svg>
      </a>

      {/* ==========================
          Instagram
         ========================== */}
      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener"
        aria-label="Instagram"
        title="Instagram"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.7.7.7.4 1.3.9 1.8 1.8.4.7.7 1.5.7 2.7.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.7 2.7-.4.7-.9 1.3-1.8 1.8-.7.4-1.5.6-2.7.7-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.7-.7a4.7 4.7 0 0 1-1.8-1.8c-.4-.7-.6-1.5-.7-2.7C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-2 .7-2.7.4-.7.9-1.3 1.8-1.8.7-.4 1.5-.6 2.7-.7C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 0-1.6.2-2 .4-.5.2-.8.4-1.1.8-.4.3-.6.7-.8 1.1-.2.4-.4 1-.4 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 1 .2 1.6.4 2 .2.4.4.8.8 1.1.3.4.7.6 1.1.8.4.2 1 .4 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.6-.2 2-.4.4-.2.8-.4 1.1-.8.4-.3.6-.7.8-1.1.2-.4.4-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1-.2-1.6-.4-2-.2-.4-.4-.8-.8-1.1-.3-.4-.7-.6-1.1-.8-.4-.2-1-.4-2-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zm0 2a4.5 4.5 0 1 0 .01 9.01A4.5 4.5 0 0 0 12 9.5zm5.3-3a1.2 1.2 0 1 1 0 2.5 1.2 1.2 0 0 1 0-2.5z"
          />
        </svg>
      </a>

      {/* ==========================
          Facebook
         ========================== */}
      <a
        href={socialLinks.facebook}
        target="_blank"
        rel="noopener"
        aria-label="Facebook"
        title="Facebook"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            fill="currentColor"
            d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.4V12h2.4V9.7c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.5.7-1.5 1.4V12h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z"
          />
        </svg>
      </a>
    </nav>
  );
}
