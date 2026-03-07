// ============================================================================
// Componente: CardList
// Ubicación : src/components/SectionNews/CardList/CardList.jsx
// Descripción:
//   - Lista mixta de "promos" y "noticias", renderizadas en un grid vertical.
//   - Mantiene el nombre de clase .news-list (del CSS original), ahora modularizado.
//   - Este componente NO filtra ni pagina; solo recibe los items ya preparados
//     (por el componente padre) y los muestra. Así se separan responsabilidades.
//
// Props:
//   - items        (Array<Object>) → Elementos a mostrar en orden (ya filtrados/ordenados).
//     · item.type: 'promo' | 'news'
//     · Campos para 'promo':
//         label, headline, description, ratingText, dateISO, dateLabel,
//         discount, categories (string[]), ctaText, ctaHref
//     · Campos para 'news':
//         title, description, dateISO, dateLabel, isNew, categories (string[]), discount?
//   - visibleCount (Number)        → Cuántos items mostrar (slicing), opcional.
//                                   (El valor por defecto muestra todos).
//
// Accesibilidad:
//   - Cada tarjeta ya incorpora su propio role/aria en PromoCard/NewsCard.
//
// Notas:
//   - Si 'visibleCount' se provee, se muestra un slice de items.
//   - Las keys se derivan de: item.id || combinación estable (type + title/headline + dateISO).
// ============================================================================

import React from "react";
import PropTypes from "prop-types";
import "./CardList.css";

import PromoCard from "../PromoCard/PromoCard";
import NewsCard from "../NewsCard/NewsCard";

const CardList = ({ items = [], visibleCount, onSelectItem }) => {
  const list = Array.isArray(items) ? items : [];
  const toRender =
    typeof visibleCount === "number" ? list.slice(0, visibleCount) : list;

  if (toRender.length === 0) {
    // Estado vacío simple (opcional): el estilo puede manejarlo el padre si preferís.
    return (
      <div className="news-list" aria-live="polite">
        {/* Puedes personalizar este mensaje o moverlo al padre si querés */}
        <div className="news-empty">No hay contenidos para mostrar.</div>
      </div>
    );
  }

  return (
    <div className="news-list">
      {toRender.map((item, idx) => {
        const key =
          item.id ||
          `${item.type}-${item.title || item.headline || "item"}-${
            item.dateISO || idx
          }`;

        if (item.type === "promo") {
          return (
            <PromoCard
              key={key}
              label={item.label}
              headline={item.headline}
              description={item.description}
              ratingText={item.ratingText}
              dateISO={item.dateISO}
              dateLabel={item.dateLabel}
              discount={item.discount}
              categories={item.categories}
              ctaText={item.ctaText}
              ctaHref={item.ctaHref}
              onCtaClick={() => onSelectItem?.(item)}
            />
          );
        }

        // Por defecto, tratamos el item como "news"
        return(
          <NewsCard
            key={key}
            title={item.title}
            description={item.description}
            dateISO={item.dateISO}
            dateLabel={item.dateLabel}
            isNew={Boolean(item.isNew)}
            categories={item.categories}
            discount={item.discount}
            idForTitle={item.idForTitle}
            onSelect={() => onSelectItem?.(item)}
          />);
      })}
    </div>
  );
};

CardList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["promo", "news"]).isRequired,
    })
  ),
  visibleCount: PropTypes.number,
  onSelectItem: PropTypes.func,
};

export default CardList;
