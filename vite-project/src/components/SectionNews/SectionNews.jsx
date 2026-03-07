// ============================================================================
// Componente: SectionNews (padre/orquestador)
// Ubicacion : src/components/SectionNews/SectionNews.jsx
//
// Rol:
//   - Orquesta el bloque de "Noticias, Descuentos y Novedades".
//   - Mantiene el estado global de filtros (modo y categoria) y del paginado.
//   - Carga datos desde la API (sin mock local) y aplica sort + filter.
//   - Renderiza: titulo, Filters, contenedor "news-box" + CardList, y Action.
//
// Decisiones de diseno:
//   - "Recientes" = lista ordenada por fecha DESC.
//   - "Todas"     = orden natural (tal como llegan).
//   - Categoria   = filtra por coincidencia exacta dentro de item.categories.
//   - Paginado    = "Mostrar mas" incrementa visibleCount en pasos fijos.
//
// Accesibilidad:
//   - <section aria-labelledby="noticias"> con titulo <h2 id="noticias">.
//   - Armoniza aria-controls entre el boton de "Mostrar mas" y el contenedor visible.
//
// Notas de estilos:
//   - Este componente importa SectionNews.css con estilos compartidos:
//       - .news-box (contenedor con scroll/tema)
//       - .btn, .btn.outline, .btn.small (botoneria compartida)
//       - .section-title
// ============================================================================

import React, { useEffect, useMemo, useState } from "react";
import "./SectionNews.css";

import Filters from "./Filters/Filters";
import CardList from "./CardList/CardList";
import Action from "./Action/Action";
import { API_BASE } from "../../config/api.js";

const INITIAL_STEP = 4;   // cantidad inicial a mostrar
const LOAD_MORE_STEP = 3; // incremento por clic en "Mostrar mas"


const normalizarItems = (items = []) =>
  (Array.isArray(items) ? items : []).map((item, idx) => {
    const tipo = item.type === "promo" ? "promo" : "news";
    const categorias = Array.isArray(item.categories)
      ? item.categories
      : item.category
        ? [item.category]
        : tipo === "promo"
          ? ["promociones"]
          : ["noticias"];
    const dateISO = item.dateISO || item.fecha || null;
    const descuento =
      typeof item.discount === "number"
        ? item.discount
        : item.descuento && Number(item.descuento) <= 1
          ? Math.round(Number(item.descuento) * 100)
          : item.descuento;

    return {
      id: item.id || `${tipo}-${idx}`,
      type: tipo,
      label: item.label,
      headline: item.headline || item.title,
      title: item.title || item.headline,
      description: item.description || "",
      ratingText: item.ratingText || null,
      dateISO,
      dateLabel: item.dateLabel || item.fechaLabel || item.fecha,
      discount: descuento,
      categories: categorias,
      ctaText: item.ctaText || "Ver detalle",
      ctaHref: item.ctaHref || "#",
      isNew: Boolean(item.isNew || item.esNueva || item.reciente),
      note: item.note || item.nota,
    };
  });

const fetchJson = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const dataResp = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(dataResp.error || dataResp.mensaje || "Error al comunicarse con la API");
    error.status = res.status;
    throw error;
  }
  return dataResp;
};

export default function SectionNews() {
  // Estado global de la seccion
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [filterMode, setFilterMode] = useState("recientes"); // 'recientes' | 'todas'
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [visibleCount, setVisibleCount] = useState(INITIAL_STEP);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [detalleItem, setDetalleItem] = useState(null);

  useEffect(() => {
    const cargarContenido = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const respuesta = await fetchJson("/noticias");
        const remotos = normalizarItems(respuesta.data?.items || []);
        setItems(remotos);
        if (!remotos.length) {
          setFetchError("No hay datos cargados.");
        }
        setVisibleCount(INITIAL_STEP);
      } catch (error) {
        console.error("No se pudo cargar noticias/promociones", error);
        setItems([]);
        setFetchError("No se pudo cargar noticias/promociones desde la API.");
      } finally {
        setIsFetching(false);
      }
    };

    cargarContenido();
  }, []);

  // Helpers: categorias unicas
  const allCategories = useMemo(() => ["todas", "promociones", "noticias"], []);

  // Derivacion: aplicar sort + filter
  const preparedItems = useMemo(() => {
    const list = Array.isArray(items) ? [...items] : [];

    if (filterMode === "recientes") {
      list.sort((a, b) => {
        const da = a.dateISO ? new Date(a.dateISO).getTime() : 0;
        const db = b.dateISO ? new Date(b.dateISO).getTime() : 0;
        return db - da;
      });
    }

    if (selectedCategory === "promociones") {
      return list.filter((item) => item.type === "promo");
    }

    if (selectedCategory === "noticias") {
      return list.filter((item) => item.type === "news");
    }

    return list;
  }, [items, filterMode, selectedCategory]);

  // Paginado: mostrar mas
  const canLoadMore = preparedItems.length > visibleCount;

  const handleLoadMore = () => {
    if (isFetching) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((n) => n + LOAD_MORE_STEP);
      setIsLoadingMore(false);
    }, 300);
  };

  // Reset de paginado al cambiar filtros
  const handleModeChange = (mode) => {
    setFilterMode(mode);
    setVisibleCount(INITIAL_STEP);
  };
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(INITIAL_STEP);
  };

  const listBoxId = "news-box";

  return (
    <section aria-labelledby="noticias" className="wrap">
      <h2 id="noticias" className="section-title">
        Noticias, Descuentos y Novedades
      </h2>

      <Filters
        filterMode={filterMode}
        onFilterModeChange={handleModeChange}
        categories={allCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {fetchError && <p className="catalogo-servicio-hint">{fetchError}</p>}

      <div id={listBoxId} className="news-box">
        {isFetching ? (
          <p className="catalogo-servicio-hint">Cargando noticias y promociones...</p>
        ) : (
          <CardList
            items={preparedItems}
            visibleCount={visibleCount}
            onSelectItem={(item) => setDetalleItem(item)}
          />
        )}
      </div>

      <Action
        onMore={handleLoadMore}
        disabled={!canLoadMore || isFetching}
        isLoading={isLoadingMore || isFetching}
        controlsId={listBoxId}
        label="Mostrar mas"
        busyLabel="Cargando..."
      />

      {detalleItem && (
        <div className="news-modal-backdrop" role="presentation">
          <div className="news-modal" role="dialog" aria-modal="true">
            <div className="news-modal__header">
              <h3>{detalleItem.headline || detalleItem.title}</h3>
              <button type="button" className="news-modal__close" onClick={() => setDetalleItem(null)}>
                &times;
              </button>
            </div>
            <div className="news-modal__body">
              {detalleItem.type === "promo" ? (
                <>
                  <p className="news-modal__badge">
                    -
                    {typeof detalleItem.discount === "number" && detalleItem.discount !== 0
                      ? detalleItem.discount
                      : "Sin"}%
                  </p>
                  {detalleItem.dateLabel && (
                    <p className="news-modal__meta">Valido: {detalleItem.dateLabel}</p>
                  )}
                  <p className="news-modal__text">{detalleItem.description || "Sin descripcion."}</p>
                  <p className="news-modal__note">
                    {detalleItem.note || "Sin condiciones especiales."}
                  </p>
                </>
              ) : (
                <p className="news-modal__text">{detalleItem.description || "Sin descripcion."}</p>
              )}
            </div>
            <div className="news-modal__footer">
              <button type="button" className="btn" onClick={() => setDetalleItem(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
