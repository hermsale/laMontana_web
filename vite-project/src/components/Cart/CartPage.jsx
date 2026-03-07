// ============================================================================
// Archivo: CartPage.jsx
// Contexto: Vista de carrito (landing). Muestra productos agregados, permite
//            seleccionar, modificar cantidades y simular pago. Incluye datos de envío.
// Alcance: Carga y sincroniza carrito con backend, maneja selección y acciones.
// Funciones/componentes:
//  - fetchJson: helper para peticiones a la API de carritos/pedidos.
//  - cargarCarrito(): GET carrito del usuario (solo productos).
//  - actualizarCantidad(): PATCH cantidad de un producto.
//  - eliminarItem(): DELETE producto del carrito.
//  - realizarPagoMock(): placeholder de pago.
//  - calcularEnvio(): lógica simple de envío (gratis CABA/GBA).
//  - Renderiza header/footer, formulario de envío y lista de productos.
// ============================================================================
import { useEffect, useMemo, useState } from "react";
import "./CartPage.css";
import { useAuth } from "../../context/useAuth.jsx";
import { API_BASE } from "../../config/api.js";
import { readCartCache, writeCartCache } from "../../utils/cartCache.js";

const fetchJson = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || data.mensaje || "Error al comunicarse con la API");
    error.status = res.status;
    throw error;
  }
  return data;
};

const CartPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [seleccionados, setSeleccionados] = useState({});
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [carritoApiDisponible, setCarritoApiDisponible] = useState(true);
  const [carritoId, setCarritoId] = useState(null);
  const [cp, setCp] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notasEnvio, setNotasEnvio] = useState("");
  const [telExtra, setTelExtra] = useState("");
  const [mensajeEnvio, setMensajeEnvio] = useState("");
  const [usarDireccionCuenta, setUsarDireccionCuenta] = useState(false);

  const obtenerKey = (item) => item.productoId || item.id;

  const getPrecio = (item) =>
    typeof item.precioUnitario === "number" ? item.precioUnitario : item.precio || 0;

  const totalSeleccionado = useMemo(() => {
    return items.reduce((acc, item) => {
      const key = obtenerKey(item);
      if (!seleccionados[key]) return acc;
      const precioFinal = getPrecio(item);
      return acc + precioFinal * (item.cantidad || 0);
    }, 0);
  }, [items, seleccionados]);

  const cargarCarrito = async () => {
    if (!user) {
      setItems([]);
      setSeleccionados({});
      setCarritoId(null);
      return;
    }
    if (!carritoApiDisponible) {
      return;
    }
    setLoading(true);
    setError(null);
    setMensaje(null);
    try {
      const data = await fetchJson(`/carritos`);
      const lista = (data.data?.items || []).filter((it) => it.tipo === "producto");
      const pre = {};
      lista.forEach((it) => {
        const key = obtenerKey(it);
        if (key) pre[key] = true;
      });
      const nextCartId = data.data?.id || null;
      writeCartCache(user, lista, nextCartId);
      setCarritoId(nextCartId);
      setItems(lista);
      setSeleccionados(pre);
    } catch (err) {
      const local = readCartCache(user);
      if (local.items.length > 0) {
        const pre = {};
        local.items.forEach((it) => {
          const key = obtenerKey(it);
          if (key) pre[key] = true;
        });
        setItems(local.items);
        setSeleccionados(pre);
        setCarritoId(local.cartId);
        setMensaje(
          "No pudimos sincronizar el carrito con el servidor. Mostrando tu carrito guardado localmente."
        );
        return;
      }
      if (err.status === 404) {
        setMensaje("El carrito aún no está conectado al backend. Mostrando vacío por ahora.");
        setCarritoApiDisponible(false);
        setItems([]);
        setSeleccionados({});
        setCarritoId(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCarrito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user?.direccion && usarDireccionCuenta) {
      setDireccion(user.direccion);
    }
  }, [user, usarDireccionCuenta]);

  const toggleSeleccion = (key) => {
    setSeleccionados((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    if (!carritoId) {
      setError("No se pudo identificar el carrito");
      return;
    }
    setLoading(true);
    setError(null);
    setMensaje(null);
    try {
      const respuesta = await fetchJson(`/carritos/${carritoId}/items/${productoId}`, {
        method: "PATCH",
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });
      const lista = (respuesta.data?.items || []).filter((it) => it.tipo === "producto");
      writeCartCache(user, lista, carritoId);
      setItems(lista);
      setCarritoId(respuesta.data?.id || carritoId);
      setSeleccionados((prev) => {
        const copia = { ...prev };
        if (nuevaCantidad <= 0) {
          delete copia[productoId];
        } else {
          copia[productoId] = true;
        }
        return copia;
      });
    } catch (err) {
      setItems((prev) => {
        const next = prev
          .map((it) =>
            obtenerKey(it) === productoId
              ? { ...it, cantidad: Math.max(0, Number(nuevaCantidad) || 0) }
              : it
          )
          .filter((it) => (Number(it.cantidad) || 0) > 0);
        writeCartCache(user, next, carritoId);
        return next;
      });
      setError(
        `${err.message}. No se pudo sincronizar el servidor, pero actualizamos tu carrito localmente.`
      );
    } finally {
      setLoading(false);
    }
  };

  const eliminarItem = async (productoId) => {
    if (!carritoId) {
      setError("No se pudo identificar el carrito");
      return;
    }
    setLoading(true);
    setError(null);
    setMensaje(null);
    try {
      const respuesta = await fetchJson(`/carritos/${carritoId}/items/${productoId}`, {
        method: "DELETE",
      });
      const lista = (respuesta.data?.items || []).filter((it) => it.tipo === "producto");
      writeCartCache(user, lista, carritoId);
      setItems(lista);
      setCarritoId(respuesta.data?.id || carritoId);
      setSeleccionados((prev) => {
        const copia = { ...prev };
        delete copia[productoId];
        return copia;
      });
      setMensaje("Ítem eliminado del carrito");
    } catch (err) {
      setItems((prev) => {
        const next = prev.filter((it) => obtenerKey(it) !== productoId);
        writeCartCache(user, next, carritoId);
        return next;
      });
      setError(
        `${err.message}. No se pudo sincronizar el servidor, pero eliminamos el ítem localmente.`
      );
    } finally {
      setLoading(false);
    }
  };

  const realizarPagoMock = () => {
    setMensaje("Funcionalidad de pago no desarrollada aún. Próximamente.");
    setError(null);
  };

  const calcularEnvio = () => {
    if (!cp) {
      setMensajeEnvio("Ingresa un código postal para calcular el envío.");
      return;
    }
    if (/^1\d{3}$/.test(cp)) {
      setMensajeEnvio("Envío gratis a CABA y Gran Buenos Aires.");
    } else {
      setMensajeEnvio("Por ahora no realizamos envíos a esa provincia.");
    }
  };

  const isSeleccionado = (key) => !!seleccionados[key];

  return (
    <>
      
      <main className="cart wrap" aria-labelledby="carrito-titulo">
        <h1 id="carrito-titulo">Carrito</h1>
        <p className="cart__intro">
          Bienvenido a tu carrito. Revisa tus productos, ajusta las cantidades con + y -, selecciona
          los que quieras pagar y continúa cuando estés listo. Los servicios tendrán su vista
          dedicada más adelante.
        </p>
        {!user && <p className="cart__hint">Inicia sesión para ver tu carrito.</p>}
        {error && <div className="cart__alert error">{error}</div>}
        {mensaje && <div className="cart__alert ok">{mensaje}</div>}
        {loading && <p className="cart__hint">Cargando...</p>}

        <div className="cart__layout">
          <aside className="cart__shipping">
            <h3>Envíos</h3>
            <p>
              Envíos gratis dentro de CABA y GBA. Por ahora no realizamos envíos a otras provincias.
            </p>
            <label className="cart__label check">
              <input
                type="checkbox"
                checked={usarDireccionCuenta}
                onChange={(e) => setUsarDireccionCuenta(e.target.checked)}
              />
              Usar dirección de mi cuenta
            </label>
            {usarDireccionCuenta && !user?.direccion && (
              <p className="cart__envio-alert">Aún no cargaste dirección en tu cuenta.</p>
            )}
            <label className="cart__label">
              Dirección
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Calle y número"
              />
            </label>
            <label className="cart__label">
              Código Postal
              <input
                type="text"
                value={cp}
                onChange={(e) => setCp(e.target.value)}
                placeholder="Ej: 1406"
              />
            </label>
            <label className="cart__label">
              Teléfono de contacto (opcional)
              <input
                type="text"
                value={telExtra}
                onChange={(e) => setTelExtra(e.target.value)}
                placeholder="+54..."
              />
            </label>
            <label className="cart__label">
              Notas sobre el envío (opcional)
              <textarea
                rows="3"
                value={notasEnvio}
                onChange={(e) => setNotasEnvio(e.target.value)}
                placeholder="Indicaciones de entrega, horarios, etc."
              />
            </label>
            <button type="button" className="btn-cart" onClick={calcularEnvio}>
              Calcular envío
            </button>
            {mensajeEnvio && <p className="cart__envio-msg">{mensajeEnvio}</p>}
          </aside>

          <div className="cart__grid">
            <h3 className="cart__products-title">Productos</h3>
          {items.map((item) => {
            const key = obtenerKey(item);
            const precioBase = item.precio || getPrecio(item);
            const tienePromo = !!item.promo;
            const descuento = tienePromo ? Math.round(item.promo.descuento * 100) : 0;
            const precioFinal = tienePromo ? precioBase * (1 - item.promo.descuento) : getPrecio(item);
            return (
              <article
                className={`cart-card ${isSeleccionado(key) ? "selected" : ""}`}
                key={key}
                onClick={() => toggleSeleccion(key)}
              >
                <div className="cart-card__top">
                  <button
                    className="cart-card__remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarItem(key);
                    }}
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </div>
                <div className="cart-card__body">
                  {item.imagen && (
                    <div className="cart-card__img">
                      <img src={item.imagen} alt={item.nombre} loading="lazy" />
                    </div>
                  )}
                  <div>
                    <div className="cart-card__title">{item.nombre}</div>
                    <div className="cart-card__desc">{item.descripcion || ""}</div>
                    <div className="cart-card__meta">
                      <span className="pill tipo">Producto</span>
                      {tienePromo && <span className="pill promo">Promo -{descuento}%</span>}
                    </div>
                    <div className="cart-card__precios">
                      {tienePromo && <span className="tachado">${precioBase}</span>}
                      <span className="final">${precioFinal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="cart-card__qty">
                    <button
                      type="button"
                      aria-label="Restar uno"
                      onClick={(e) => {
                        e.stopPropagation();
                        actualizarCantidad(key, (item.cantidad || 0) - 1);
                      }}
                      disabled={loading}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={item.cantidad || 0}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => actualizarCantidad(key, Number(e.target.value) || 0)}
                      aria-label="Cantidad"
                    />
                    <button
                      type="button"
                      aria-label="Sumar uno"
                      onClick={(e) => {
                        e.stopPropagation();
                        actualizarCantidad(key, (item.cantidad || 0) + 1);
                      }}
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
          </div>
        </div>

        {items.length > 0 && (
          <aside className="cart__resume">
            <div className="cart__resume-row">
              <span>Seleccionados</span>
              <strong>{Object.values(seleccionados).filter(Boolean).length} ítem(s)</strong>
            </div>
            <div className="cart__resume-row total">
              <span>Total</span>
              <strong>${totalSeleccionado.toFixed(2)}</strong>
            </div>
            <button
              className="btn-cart outline"
              onClick={() =>
                setSeleccionados(
                  items.reduce((acc, it) => {
                    const key = obtenerKey(it);
                    acc[key] = true;
                    return acc;
                  }, {})
                )
              }
              disabled={loading}
            >
              Seleccionar todo
            </button>
          </aside>
        )}

        <div className="cart__checkout">
          <button
            className="btn-cart cart__pay"
            onClick={realizarPagoMock}
            disabled={loading || items.length === 0}
          >
            Realizar el Pago
          </button>
        </div>
      </main>
    
    </>
  );
};

export default CartPage;
