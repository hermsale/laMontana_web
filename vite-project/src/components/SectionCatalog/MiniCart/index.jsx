// ============================================================================
// Archivo: MiniCart.jsx
// Contexto: Mini carrito flotante en catálogo. Muestra totales y permite
//            eliminar ítems rápidos o ir a la vista carrito.
// Alcance: Solo productos visibles, máximo 3 ítems listados.
// Funciones/componentes:
//  - Render header (cantidad/total)
//  - Lista de ítems con botón de eliminar (onRemove)
//  - Botón para navegar a /carrito
// ============================================================================
import { useNavigate } from "react-router-dom";
import "./MiniCart.css";

const MiniCart = ({ items, total, onRemove = () => {} }) => {
  const navigate = useNavigate();
  const cantidad = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
  const itemsVisibles = items.slice(0, 3);

  // Navegar a la vista del carrito
  const onCartClick = () => {
    navigate("/carrito");
  };

  return (
    <aside className="mini-cart" aria-label="Carrito">
      <div className="mini-cart__header">
        <div>
          <p className="mini-cart__title">Carrito</p>
          <p className="mini-cart__subtitle">
            {cantidad === 0 ? "Vacío" : `${cantidad} ítem(s)`}
          </p>
        </div>
        <span className="mini-cart__total">${total.toFixed(2)}</span>
      </div>

      <div className="mini-cart__body">
        {itemsVisibles.length === 0 ? (
          <p className="mini-cart__empty">Agrega productos para verlos aquí.</p>
        ) : (
          <ul>
            {itemsVisibles.map((item) => (
              <li key={item.productoId || item.id}>
                <div className="mini-cart__item-info">
                  <span className="mini-cart__item-name">{item.nombre}</span>
                  <span className="mini-cart__item-qty">x{item.cantidad}</span>
                </div>
                <button
                  type="button"
                  className="mini-cart__remove"
                  aria-label={`Eliminar ${item.nombre}`}
                  onClick={() => onRemove(item.productoId || item.id)}
                >
                  &#10005;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mini-cart__actions">
        <button
          type="button"
          className="btn-mini destacado"
          onClick={onCartClick}
        >
          Ver carrito
        </button>
      </div>
    </aside>
  );
};

export default MiniCart;
