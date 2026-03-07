// ============================================================================
// Componente: Filters
// Ubicación : src/components/SectionNews/Filters/Filters.jsx
// Descripción:
//   - Renderiza los controles de filtrado de la sección News:
//       • Botones "Recientes" y "Todas"
//       • Dropdown de "Categorías" con opciones seleccionables
//   - NO aplica el filtro directamente. Solo emite eventos al padre (SectionNews)
//     para que él actualice el estado global y la lista de ítems.
//
// Accesibilidad:
//   - Botón de categorías con aria-haspopup="true" y aria-expanded (controlado).
//   - Menú con role="menu" y opciones con role="menuitemradio" + aria-checked.
//   - Compatible con teclado básico: Enter/Espacio seleccionan; Escape cierra.
//
// Props esperadas:
//   - filterMode            : 'recientes' | 'todas'
//   - onFilterModeChange    : (mode) => void
//   - categories            : string[]            (ej: ["todas","fotocopias","encuadernados",...])
//   - selectedCategory      : string              (ej: "todas")
//   - onCategoryChange      : (category) => void
//
// ============================================================================

import React, { useId, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Filters.css";

const Filters = ({
  filterMode = "recientes",
  onFilterModeChange,
  categories = ["todas"],
  selectedCategory = "todas",
  onCategoryChange,
}) => {
  // Estado interno de apertura/cierre del menú de categorías
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // --------------------------------------------------------------------------
  // Cerrar el menú si se hace click fuera
  // --------------------------------------------------------------------------
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      const btn = btnRef.current;
      const menu = menuRef.current;
      const target = e.target;
      if (btn && btn.contains(target)) return;
      if (menu && menu.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // --------------------------------------------------------------------------
  // Handlers de UI
  // --------------------------------------------------------------------------
  const setMode = (mode) => {
    if (typeof onFilterModeChange === "function") onFilterModeChange(mode);
  };

  const toggleMenu = () => setOpen((v) => !v);

  const selectCategory = (cat) => {
    if (typeof onCategoryChange === "function") onCategoryChange(cat);
    setOpen(false);
  };

  const onMenuKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  return (
    <div className="chips-row" role="group" aria-label="Filtros de noticias">
      {/* Botones: Recientes / Todas */}
      <button
        type="button"
        className={`chip ${filterMode === "recientes" ? "active" : ""}`}
        onClick={() => setMode("recientes")}
        aria-pressed={filterMode === "recientes"}
        id="btn-news-recientes"
      >
        Recientes
      </button>

      <button
        type="button"
        className={`chip ${filterMode === "todas" ? "active" : ""}`}
        onClick={() => setMode("todas")}
        aria-pressed={filterMode === "todas"}
        id="btn-news-todas"
      >
        Todas
      </button>

      {/* Dropdown: Categorías */}
      <div className="dropdown">
        <button
          type="button"
          ref={btnRef}
          id="btn-news-categorias"
          className="chip"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={toggleMenu}
          onKeyDown={(e) => {
            if ((e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") && !open) {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          Categorías ▾
        </button>

        {open && (
          <div
            id={menuId}
            className="dropdown-menu"
            role="menu"
            ref={menuRef}
            onKeyDown={onMenuKeyDown}
          >
            {categories.map((cat) => {
              const checked = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className="cat-item"
                  role="menuitemradio"
                  aria-checked={checked}
                  data-cat={cat}
                  onClick={() => selectCategory(cat)}
                >
                  {/* Marca visual simple para el seleccionado */}
                  {checked ? "✓ " : ""}
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

Filters.propTypes = {
  filterMode: PropTypes.oneOf(["recientes", "todas"]),
  onFilterModeChange: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.string),
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func,
};

export default Filters;
