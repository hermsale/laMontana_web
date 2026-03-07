/**
 * =============================================================================
 *  SUBCOMPONENTE: FooterContact (index.jsx)
 *  UBICACIÓN:     src/components/Footer/FooterContact/index.jsx
 * -----------------------------------------------------------------------------
 *  ¿Qué hace?
 *    - Renderiza la columna de "Contacto" del footer:
 *      • Teléfono (click-to-call)
 *      • Email (mailto)
 *      • Título y texto de horarios
 *
 *  Datos:
 *    - Se leen desde src/lib/footerData.js → contactData
 *
 *  Estilos:
 *    - Estilos específicos en: ./FooterContact.css
 *    - El layout global del footer (grilla, fondo, paddings) irá en Footer.css
 * =============================================================================
 */

import React from "react";
import { contactData } from "/src/lib/footerData.js";
import "./FooterContact.css"; // ← Estilos del bloque de contacto

// =============================================================================
//  Render
// =============================================================================
export default function FooterContact() {
  return (
    <>
      {/* ============================================================
          CONTACTO: teléfono + email + horarios
         ============================================================ */}
      <h4>Contacto</h4>

      <address>
        <a className="contact-link" href={contactData.phoneHref}>
          {contactData.phoneText}
        </a>
        <br />
        <a className="contact-link" href={contactData.emailHref}>
          {contactData.emailText}
        </a>
      </address>

      <h4 className="spaced">{contactData.scheduleTitle}</h4>
      <p className="schedule">{contactData.scheduleText}</p>
    </>
  );
}
