import "./CatalogFilters.css";

const CatalogFilters = ({
  tipo,
  onTipoChange,
  categoria,
  onCategoriaChange,
  precioMax,
  onPrecioChange,
  categoriasDisponibles,
  usaPrecio,
  onTogglePrecio,
  onPrecioInput,
}) => {
  return (
    <div className="catalogo-filtros" role="group" aria-label="Filtros de catálogo">
      <div className="filtro">
        <label htmlFor="filtro-tipo">Tipo</label>
        <select
          id="filtro-tipo"
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="producto">Productos</option>
          <option value="servicio">Servicios</option>
        </select>
      </div>

      <div className="filtro">
        <label htmlFor="filtro-categoria">Categoría</label>
        <select
          id="filtro-categoria"
          value={categoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
        >
          {categoriasDisponibles.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "todas" ? "Todas" : cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro filtro-precio">
        <label className="checkbox-precio">
          <input
            type="checkbox"
            checked={usaPrecio}
            onChange={(e) => onTogglePrecio(e.target.checked)}
          />
          Filtrar por precio
        </label>

        {usaPrecio && (
          <div className="precio-control">
            <label htmlFor="filtro-precio">Hasta: ${precioMax}</label>
            <input
              id="filtro-precio"
              type="range"
              min="0"
              max="10000"
              step="100"
              value={precioMax}
              onChange={(e) => onPrecioChange(Number(e.target.value))}
            />
            <input
              type="number"
              min="0"
              max="10000"
              step="100"
              value={precioMax}
              onChange={(e) => onPrecioInput(Number(e.target.value))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogFilters;
