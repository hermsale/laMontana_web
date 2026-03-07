/**
 * =============================================================================
 *  MÓDULO: footerData.js
 *  UBICACIÓN: src/lib/footerData.js
 * -----------------------------------------------------------------------------
 *  ¿Qué hace?
 *    - Centraliza TODOS los datos editables que usa el Footer:
 *      • Datos de contacto (teléfono, email, horarios)
 *      • Datos de marca (logo, nombre, subtítulo, descripción)
 *      • Listado de servicios a mostrar
 *      • Enlaces a redes sociales
 *
 *  ¿Por qué así?
 *    - Permite mantener el Footer como componente "tonto" (presentacional),
 *      y cambiar contenido desde un solo archivo de configuración.
 *    - Facilita futuras integraciones (p. ej. cargar estos datos desde una API).
 *
 *  ¿Cómo se usa?
 *    import { contactData, brandData, services, socialLinks } from "@/lib/footerData";
 *
 *  Notas:
 *    - Los valores `*Href` son enlaces listos para usar en <a href="...">.
 *    - Ajustá `logoSrc` según la ruta real en tu proyecto.
 * =============================================================================
 */

/* =============================================================================
 *  CONTACTO
 * =============================================================================
 */
export const contactData = {
  /** Teléfono para mostrar en pantalla (formato humano) */
  phoneText: "+54 11 1234 5678",

  /** Enlace telefónico listo para <a href="..."> */
  phoneHref: "tel:+541112345678",

  /** Email para mostrar en pantalla */
  emailText: "info@lamontana.com.ar",

  /** Enlace mailto listo para <a href="..."> */
  emailHref: "mailto:info@lamontana.com.ar",

  /** Título del bloque de horarios */
  scheduleTitle: "Horarios",

  /** Texto de horarios (puede incluir saltos de línea) */
  scheduleText: "Lunes a Viernes 8:30 - 19:00 hs",
};

/* =============================================================================
 *  MARCA
 * =============================================================================
 */
export const brandData = {
  /** Nombre de la marca (título bajo el logo) */
  name: "La Montaña",

  /** Subtítulo o eslogan corto */
  subtitle: "Impresión Profesional",

  /** Descripción breve (párrafo) */
  about:
    "Tu imprenta de confianza para todos tus proyectos. Calidad garantizada y servicio personalizado.",

  /** Enlace del logo (normalmente a la página de inicio) */
  homeHref: "/",

  /**
   * Ruta de la imagen de logo.
   * Ajusta según tu estructura real. Ejemplos:
   *  - "/image/icon.jpg"   (si usas Vite con carpeta public/)
   *  - "/assets/icon.jpg"  (si empaquetas como asset)
   */


  // se corrigio la ruta. 
  logoSrc: "/images/icon.jpg",
};

/* =============================================================================
 *  SERVICIOS
 *  - Se muestran como lista en la columna de "Servicios".
 *  - Ordena los ítems según prioridad visual.
 * =============================================================================
 */
export const services = ["Impresión", "Encuadernación", "Anillado", "Copias"];

/* =============================================================================
 *  REDES SOCIALES
 *  - Enlaces a perfiles oficiales. Ajusta los URLs según tu marca.
 *  - WhatsApp usa la API oficial con número en formato internacional.
 * =============================================================================
 */
export const socialLinks = {
  whatsapp: "https://wa.me/5491112345678",
  instagram: "https://instagram.com/lamontana",
  facebook: "https://facebook.com/lamontana",
};

/* =============================================================================
 *  (OPCIONAL) HELPERS
 *  - Utilidades simples para construir HREFs válidos si cambias el formato.
 *  - No son requeridas por el Footer, pero pueden servirte a futuro.
 * =============================================================================
 */

/**
 * Construye un enlace tel: asegurando formato sin espacios ni guiones.
 * @param {string} rawPhone Ej: "+54 11 1234 5678"
 * @returns {string} "tel:+541112345678"
 */
export const toTelHref = (rawPhone) =>
  `tel:${String(rawPhone).replace(/[^\d+]/g, "")}`;

/**
 * Construye un enlace mailto: con codificación básica.
 * @param {string} email Ej: "info@lamontana.com.ar"
 * @returns {string} "mailto:info@lamontana.com.ar"
 */
export const toMailHref = (email) => `mailto:${encodeURIComponent(email)}`;


