// ============================================================================
// Archivo: SectionCatalog.jsx
// Contexto: Catálogo de productos y servicios en la landing.
// Alcance: Filtra y lista ítems, integra con el backend de carritos (solo productos),
//          y muestra mini-cart flotante; bloquea servicios y deriva a /servicios.
// Funciones/componentes:
//  - Estado de filtros (tipo, categoría, precio) y paginación.
//  - fetchJson para sincronizar carrito (GET/POST/DELETE).
//  - handleAgregar/handleEliminar: manejan carrito y fallback local si falla la API.
//  - handleSolicitarServicio: navegación a placeholder de servicios.
//  - Render: filtros, grid de cards, aviso auth, CTA de “Mostrar más” y MiniCart.
// ============================================================================
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SectionCatalog.css";
import CatalogFilters from "./CatalogFilters";
import CatalogGrid from "./CatalogGrid";
import MiniCart from "./MiniCart";
import { useAuth } from "../../context/useAuth.jsx";
import { API_BASE } from "../../config/api.js";
import { readCartCache, writeCartCache } from "../../utils/cartCache.js";

const STEP_INICIAL = 6;
const STEP_CARGA = 4;


const normalizarPromoItem = (promo) => {
  if (!promo || typeof promo !== "object") return null;
  let descuento = Number(promo.descuento);
  if (!Number.isFinite(descuento) || descuento <= 0) return null;
  if (descuento > 1) {
    descuento = descuento / 100;
  }
  return {
    nombre: promo.nombre || "Promoción",
    descuento: Math.min(Math.max(descuento, 0), 1),
  };
};

const normalizarCatalogo = (items = []) =>
  items
    .filter(Boolean)
    .map((item, index) => {
      const tipo = item.tipo === "servicio" ? "servicio" : "producto";
      const imagen = item.imagen
        ? item.imagen
        : Array.isArray(item.imagenes)
          ? item.imagenes.find((url) => typeof url === "string" && url.trim() !== "")
          : "";
      const categoria =
        item.categoria || item.tipo || (tipo === "servicio" ? "servicios" : "productos");

      return {
        id: item.id || item.productoId || item.uid || item.nombre || `item-${index}`,
        nombre: item.nombre || "",
        descripcion: item.descripcion || "",
        categoria,
        tipo,
        precio: Number(item.precio) || 0,
        promo: normalizarPromoItem(item.promo),
        imagen,
      };
    });

const calcularPrecioMaximo = (items = []) => {
  const maxPrecio = items.reduce((acc, item) => {
    const precio = Number(item.precio) || 0;
    return precio > acc ? precio : acc;
  }, 0);

  if (!maxPrecio) return null;

  const redondeado = Math.ceil(maxPrecio / 100) * 100;
  return Math.min(redondeado, 10000);
};

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

const SectionCatalog = ({ onRequestAuth = () => {} }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [catalogo, setCatalogo] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(false);
  const [catalogoError, setCatalogoError] = useState(null);
  const [tipo, setTipo] = useState("todos"); // todos | producto | servicio
  const [categoria, setCategoria] = useState("todas");
  const [precioMax, setPrecioMax] = useState(8000);
  const [usaPrecio, setUsaPrecio] = useState(false);
  const [visible, setVisible] = useState(STEP_INICIAL);
  const [carrito, setCarrito] = useState([]);
  const [carritoId, setCarritoId] = useState(null);
  const [mostrarAvisoAuth, setMostrarAvisoAuth] = useState(false);
  const [posYAuth, setPosYAuth] = useState(null);
  const [mensajeError, setMensajeError] = useState(null);

  useEffect(() => {
    const cargarCatalogo = async () => {
      setCargandoCatalogo(true);
      setCatalogoError(null);
      try {
        const respuesta = await fetchJson("/catalogo");
        const itemsApi = normalizarCatalogo(respuesta.data?.items || []);

        setCatalogo(itemsApi);
        const maxPrecio = calcularPrecioMaximo(itemsApi);
        if (maxPrecio) setPrecioMax(maxPrecio);
        setVisible(STEP_INICIAL);
      } catch (error) {
        console.error("No se pudo cargar el catálogo", error);
        setCatalogo([]);
        setCatalogoError("No se pudo cargar el catálogo desde la API.");
      } finally {
        setCargandoCatalogo(false);
      }
    };

    cargarCatalogo();
  }, []);

  const categoriasDisponibles = useMemo(() => {
    const set = new Set(["todas"]);
    catalogo.forEach((item) => {
      if (item.categoria) {
        set.add(item.categoria);
      }
    });
    return Array.from(set);
  }, [catalogo]);

  const itemsFiltrados = useMemo(() => {
    let items = [...catalogo];

    if (tipo !== "todos") {
      items = items.filter((item) => item.tipo === tipo);
    }

    if (categoria !== "todas") {
      items = items.filter((item) => item.categoria === categoria);
    }

    if (usaPrecio) {
      items = items.filter((item) => item.precio <= precioMax);
    }

    return items;
  }, [catalogo, tipo, categoria, precioMax, usaPrecio]);

  const puedeCargarMas = itemsFiltrados.length > visible;

  const handleCargarMas = () => setVisible((n) => n + STEP_CARGA);

  useEffect(() => {
    const cargarCarrito = async () => {
      if (!user) {
        setCarrito([]);
        setCarritoId(null);
        return;
      }
      try {
        const data = await fetchJson(`/carritos`);
        const items = (data.data?.items || []).filter((it) => it.tipo === "producto");
        const nextCartId = data.data?.id || null;
        setCarrito(items);
        setCarritoId(nextCartId);
        writeCartCache(user, items, nextCartId);
        setMensajeError(null);
      } catch (error) {
        const local = readCartCache(user);
        setCarrito(local.items);
        setCarritoId(local.cartId);
        if (local.items.length > 0) {
          setMensajeError(
            "No pudimos sincronizar el carrito con el servidor. Mostrando tu carrito local."
          );
        } else {
          console.error("No se pudo cargar el carrito", error);
          setMensajeError("No pudimos cargar tu carrito. Intenta nuevamente.");
        }
      }
    };

    cargarCarrito();
  }, [user]);

  const handleAgregar = async (item, event) => {
    if (item.tipo !== "producto") {
      handleSolicitarServicio();
      return;
    }

    if (!user) {
      const clickY = event?.clientY ?? window.innerHeight / 2;
      setPosYAuth(clickY);
      setMostrarAvisoAuth(true);
      return;
    }

    const precioFinal = item.promo ? item.precio * (1 - item.promo.descuento) : item.precio;

    try {
      const respuesta = await fetchJson("/carritos/items", {
        method: "POST",
        body: JSON.stringify({
          item: {
            productoId: item.id,
            tipo: "producto",
            cantidad: 1,
            precioUnitario: precioFinal,
            nombre: item.nombre,
            descripcion: item.descripcion,
            imagen: item.imagen,
            categoria: item.categoria,
          },
        }),
      });
      const items = (respuesta.data?.items || []).filter((it) => it.tipo === "producto");
      const nextCartId = respuesta.data?.id || carritoId;
      setCarrito(items);
      setCarritoId(nextCartId);
      writeCartCache(user, items, nextCartId);
      setMensajeError(null);
    } catch (error) {
      console.error("No se pudo agregar al carrito", error);
      // Fallback local para no perder la acción del usuario
      setCarrito((prev) => {
        const existente = prev.find((p) => p.productoId === item.id || p.id === item.id);
        let nextItems = prev;
        if (existente) {
          nextItems = prev.map((p) =>
            p.productoId === item.id || p.id === item.id
              ? { ...p, cantidad: (p.cantidad || 0) + 1 }
              : p
          );
        } else {
          nextItems = [
            ...prev,
            {
              productoId: item.id,
              nombre: item.nombre,
              cantidad: 1,
              precioUnitario: precioFinal,
              tipo: "producto",
              descripcion: item.descripcion,
              imagen: item.imagen,
              categoria: item.categoria,
            },
          ];
        }
        writeCartCache(user, nextItems, carritoId);
        return nextItems;
      });
      setMensajeError("No se pudo sincronizar con el servidor. Guardamos el cambio localmente.");
    }
  };

  const handleSolicitarServicio = () => {
    navigate("/servicios");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (productoId) => {
    if (!carritoId) return;
    try {
      const respuesta = await fetchJson(`/carritos/${carritoId}/items/${productoId}`, {
        method: "DELETE",
      });
      const items = (respuesta.data?.items || []).filter((it) => it.tipo === "producto");
      writeCartCache(user, items, carritoId);
      setCarrito(items);
      setMensajeError(null);
    } catch {
      setCarrito((prev) => {
        const nextItems = prev.filter((it) => (it.productoId || it.id) !== productoId);
        writeCartCache(user, nextItems, carritoId);
        return nextItems;
      });
      setMensajeError(
        "No se pudo eliminar en el servidor. Eliminamos el ítem localmente para que puedas seguir."
      );
    }
  };

  const totalCarrito = carrito.reduce((acc, item) => {
    const precioFinal =
      typeof item.precioUnitario === "number"
        ? item.precioUnitario
        : item.promo
          ? item.precio * (1 - item.promo.descuento)
          : item.precio;
    return acc + precioFinal * (item.cantidad || 0);
  }, 0);

  useEffect(() => {
    if (user) {
      setMostrarAvisoAuth(false);
      setPosYAuth(null);
    }
  }, [user]);

  const handleIrALogin = () => {
    setMostrarAvisoAuth(false);
    onRequestAuth("login");
  };

  const handleIrARegistro = () => {
    setMostrarAvisoAuth(false);
    onRequestAuth("register");
  };

  const handleCerrarAviso = () => {
    setMostrarAvisoAuth(false);
    setPosYAuth(null);
  };

  return (
    <section className="catalogo wrap" aria-labelledby="catalogo-titulo">
      <div className="catalogo-header">
        <h2 id="catalogo-titulo">Productos & Servicios</h2>
        <p className="catalogo-sub">
          Explora nuestras opciones y filtra según lo que necesites. Agrega al
          carrito para cotizar y comprar de manera ágil.
        </p>
      </div>

      <CatalogFilters
        tipo={tipo}
        onTipoChange={setTipo}
        categoria={categoria}
        onCategoriaChange={setCategoria}
        precioMax={precioMax}
        onPrecioChange={setPrecioMax}
        onPrecioInput={setPrecioMax}
        usaPrecio={usaPrecio}
        onTogglePrecio={setUsaPrecio}
        categoriasDisponibles={categoriasDisponibles}
      />

      {catalogoError && <p className="catalogo-servicio-hint">{catalogoError}</p>}

      {cargandoCatalogo ? (
        <p className="catalogo-servicio-hint">Cargando catálogo...</p>
      ) : (
        <CatalogGrid
          items={itemsFiltrados.slice(0, visible)}
          onAdd={handleAgregar}
          onRequestService={handleSolicitarServicio}
        />
      )}

      {mostrarAvisoAuth && !user && (
        <div
          className="catalogo-auth"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            top: posYAuth ?? "20%",
          }}
        >
          <div className="catalogo-auth__text">
            <p className="catalogo-auth__title">Inicia sesión para continuar</p>
            <p className="catalogo-auth__desc">
              Para comprar productos o servicios primero inicia sesión o crea tu cuenta.
            </p>
          </div>
          <div className="catalogo-auth__actions">
            <button type="button" className="btn-auth primario" onClick={handleIrALogin}>
              Ir a login
            </button>
            <button type="button" className="btn-auth secundario" onClick={handleIrARegistro}>
              Crear cuenta
            </button>
          </div>
          <button
            type="button"
            className="catalogo-auth__close"
            aria-label="Cerrar aviso"
            onClick={handleCerrarAviso}
          >
            &times;
          </button>
        </div>
      )}

      <div className="catalogo-actions">
        <button
          type="button"
          className="btn-catalogo"
          onClick={handleCargarMas}
          disabled={!puedeCargarMas || cargandoCatalogo}
        >
          {cargandoCatalogo
            ? "Cargando..."
            : puedeCargarMas
              ? "Mostrar más"
              : "No hay más ítems"}
        </button>
      </div>

      {mensajeError && <p className="catalogo-servicio-hint">{mensajeError}</p>}

      {user && (
        <MiniCart
          items={carrito}
          total={totalCarrito}
          carritoId={carritoId}
          onRemove={handleEliminar}
        />
      )}
    </section>
  );
};

export default SectionCatalog;
