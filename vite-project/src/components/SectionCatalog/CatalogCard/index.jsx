import "./CatalogCard.css";

const CatalogCard = ({ item, onAdd, onRequest }) => {
  const tienePromo = !!item.promo;
  const precioFinal = tienePromo
    ? Math.round(item.precio * (1 - item.promo.descuento))
    : item.precio;
  const esServicio = item.tipo === "servicio";

  return (
    <article className="catalog-card" role="listitem">
      {item.imagen && (
        <div className="catalog-card__img">
          <img src={item.imagen} alt={item.nombre} loading="lazy" />
        </div>
      )}
      <div className="catalog-card__top">
        <span className={`pill tipo-${item.tipo}`}>
          {item.tipo === "producto" ? "Producto" : "Servicio"}
        </span>
        {tienePromo && (
          <span className="pill promo">
            {item.promo.nombre} · -{Math.round(item.promo.descuento * 100)}%
          </span>
        )}
      </div>

      <h3 className="catalog-card__title">{item.nombre}</h3>
      <p className="catalog-card__desc">{item.descripcion}</p>

      <div className="catalog-card__meta">
        <span className="categoria">{item.categoria}</span>
      </div>

      <div className="catalog-card__precio">
        {tienePromo && <span className="precio tachado">${item.precio}</span>}
        <span className="precio final">${precioFinal}</span>
      </div>

      <div className="catalog-card__actions">
        <button
          type="button"
          className="btn-card"
          onClick={esServicio ? onRequest : onAdd}
        >
          {esServicio ? "Solicitar" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
};

export default CatalogCard;
