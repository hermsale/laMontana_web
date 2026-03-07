import CatalogCard from "../CatalogCard";
import "./CatalogGrid.css";

const CatalogGrid = ({ items, onAdd, onRequestService }) => {
  if (!items.length) {
    return (
      <div className="catalogo-vacio">
        <p>No encontramos resultados con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="catalogo-grid" role="list">
      {items.map((item) => (
        <CatalogCard
          key={item.id}
          item={item}
          onAdd={(event) => onAdd(item, event)}
          onRequest={() => onRequestService?.(item)}
        />
      ))}
    </div>
  );
};

export default CatalogGrid;

