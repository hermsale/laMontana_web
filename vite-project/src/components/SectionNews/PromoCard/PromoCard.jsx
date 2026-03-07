// ============================================================================
// Componente: PromoCard
// Ubicación : src/components/SectionNews/PromoCard/PromoCard.jsx
// Descripción:
//   - Renderiza una "tarjeta de promoción" (descuento + CTA).
//   - Se pensó para convivir con NewsCard dentro de CardList.
//   - Usa atributos data-* para facilitar filtros (categorías, descuento).
//   - Accesibilidad: role="article", aria-label y <time> con datetime.
//
// Props sugeridas:
//   - label         (string)  → Texto corto superior (ej: "⚡ Oferta Especial")
//   - headline      (string)  → Título fuerte (ej: "20% de descuento...")
//   - description   (string)  → Bajada/explicación
//   - ratingText    (string)  → Texto de valoración (ej: "★★★★★  +1000 clientes")
//   - dateISO       (string)  → Fecha ISO para <time datetime="">
//   - dateLabel     (string)  → Fecha visible (ej: "23 de enero de 2025")
//   - discount      (number)  → Descuento numérico (ej: 20, 30, 15)
//   - categories    (string[])-> Categorías (ej: ["varias","copias a color"])
//   - ctaText       (string)  → Texto del botón (ej: "Obtener Descuento")
//   - ctaHref       (string)  → Enlace del botón (ej: "#descuento")
//   - onCtaClick    (func)    → Callback opcional al click del CTA
//
// Nota de estilos:
//   - Este componente importa su propio CSS (PromoCard.css) con clases
//     "scoped" al componente para evitar choques con css.txt.
// ============================================================================

import React from "react";
import PropTypes from "prop-types";
import "./PromoCard.css";

const PromoCard = ({
  label = "🎉 Promoción",
  headline,
  description,
  ratingText,
  dateISO,
  dateLabel,
  discount,
  categories = [],
  ctaText = "Ver detalle",
  ctaHref = "#",
  onCtaClick,
}) => {
  // --------------------------------------------------------------------------
  // Seguridad/defensiva: si no hay headline, no tiene sentido renderizar la card
  // --------------------------------------------------------------------------
  if (!headline) return null;

  // Construimos los data-* como strings (para futuros filtros en CardList)
  const catsString = Array.isArray(categories) ? categories.join(",") : "";

  const handleClick = (e) => {
    if (typeof onCtaClick === "function") {
      e.preventDefault();
      onCtaClick(e);
      return;
    }
    if (!ctaHref || ctaHref === "#") return;
    window.location.assign(ctaHref);
  };

  return (
    <div
      className="promo"
      role="article"
      aria-label={headline}
      data-discount={typeof discount === "number" ? discount : undefined}
      data-cats={catsString}
    >
      {/* Columna izquierda: textos de la promo */}
      <div className="left">
        {/* Etiqueta corta arriba (ícono + texto breve) */}
        {label && <div className="promo-label">{label}</div>}

        {/* Título fuerte / beneficio principal */}
        <div className="promo-headline">{headline}</div>

        {/* Descripción corta de soporte */}
        {description && <div className="promo-desc">{description}</div>}

        {/* “Valoración” (texto libre: estrellas, claims, etc.) */}
        {ratingText && <div className="promo-rating">{ratingText}</div>}

        {/* Fecha de publicación con ícono cuadrado simple (ligero) */}
        {(dateISO || dateLabel) && (
          <div className="promo-date">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M8 7h8v8H8z" strokeWidth="1.4" />
            </svg>
            <time dateTime={dateISO || ""}>{dateLabel || dateISO}</time>
          </div>
        )}
      </div>

      {/* Columna derecha: CTA + meta secundaria */}
      <div className="promo-right">
        <button type="button" className="cta-mini" onClick={handleClick}>
          {ctaText}
        </button>
        <div className="promo-note">Oferta valida por tiempo limitado</div>
      </div>
    </div>
  );
};

PromoCard.propTypes = {
  label: PropTypes.string,
  headline: PropTypes.string.isRequired,
  description: PropTypes.string,
  ratingText: PropTypes.string,
  dateISO: PropTypes.string,
  dateLabel: PropTypes.string,
  discount: PropTypes.number,
  categories: PropTypes.arrayOf(PropTypes.string),
  ctaText: PropTypes.string,
  ctaHref: PropTypes.string,
  onCtaClick: PropTypes.func,
};

export default PromoCard;
