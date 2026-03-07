// ============================================================================
// Componente: NewsCard
// Ubicación : src/components/SectionNews/NewsCard/NewsCard.jsx
// Descripción:
//   - Renderiza una "tarjeta de noticia" con título, fecha y descripción.
//   - Usa las clases originales de tu CSS (.news-card, .badge-new).
//   - Todos los estilos visuales están ahora en NewsCard.css (sin inline styles).
//   - Admite data-* para filtros por categoría o descuento.
//
// Props:
//   - title        (string)   → Título de la noticia.
//   - dateISO      (string)   → Fecha ISO (para <time datetime>).
//   - dateLabel    (string)   → Texto visible de la fecha.
//   - description  (string)   → Contenido de la noticia.
//   - categories   (string[]) → Categorías asociadas.
//   - isNew        (bool)     → Muestra la insignia “Nuevo”.
//   - discount     (number)   → % de descuento (opcional).
//   - idForTitle   (string)   → ID accesible opcional.
//
// ============================================================================

import React, { useId } from "react";
import PropTypes from "prop-types";
import "./NewsCard.css";

const NewsCard = ({
  title,
  dateISO,
  dateLabel,
  description,
  categories = [],
  isNew = false,
  discount,
  idForTitle,
  onSelect,
}) => {
  // ID accesible único para cada card
  const reactUid = useId();
  if (!title) return null;
  const headingId = idForTitle || `news-${reactUid}`;

  // Unimos categorías para data-cats
  const catsString = Array.isArray(categories) ? categories.join(",") : "";

  return (
    <article
      className="news-card"
      role="article"
      aria-labelledby={headingId}
      data-cats={catsString}
      data-discount={typeof discount === "number" ? discount : undefined}
    >
      {/* ──────────────────────────────
          Cabecera: título + insignia
         ────────────────────────────── */}
      <div className="news-header">
        <h3 id={headingId} className="news-title">
          {title}
        </h3>
        {isNew && <span className="badge-new">Nuevo</span>}
      </div>

      {/* ──────────────────────────────
          Fecha con ícono
         ────────────────────────────── */}
      {(dateISO || dateLabel) && (
        <div className="news-date">
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

      {/* ──────────────────────────────
          Contenido / descripción
         ────────────────────────────── */}
      {description && <p className="news-desc">{description}</p>}

      <button type="button" className="news-detail-btn" onClick={onSelect}>
        Ver detalle
      </button>
    </article>
  );
};

NewsCard.propTypes = {
  title: PropTypes.string.isRequired,
  dateISO: PropTypes.string,
  dateLabel: PropTypes.string,
  description: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
  isNew: PropTypes.bool,
  discount: PropTypes.number,
  idForTitle: PropTypes.string,
  onSelect: PropTypes.func,
};

export default NewsCard;
