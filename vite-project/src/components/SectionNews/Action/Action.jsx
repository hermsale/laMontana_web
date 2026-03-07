// ============================================================================
// Componente: Action (Mostrar más)
// Ubicación : src/components/SectionNews/Action/Action.jsx
// Descripción:
//   - Renderiza el contenedor de acciones de la sección News (solo el botón
//     "Mostrar más").
//   - No implementa lógica de paginado: emite el evento onMore al padre.
//   - Mantiene las clases originales del proyecto: .news-actions y el botón
//     usa .btn .outline .small (definidas de forma global/parent).
//
// Accesibilidad:
//   - aria-controls: id del contenedor/lista que se ve afectado por la acción.
//   - aria-busy    : indica estado de "cargando" si isLoading === true.
//   - disabled     : bloquea el botón si no hay más elementos o mientras carga.
//
// Props:
//   - onMore     : () => void            → Callback al hacer click.
//   - disabled   : boolean               → Deshabilitar botón.
//   - isLoading  : boolean               → Estado de carga (visual + aria-busy).
//   - label      : string                → Texto del botón (por defecto "Mostrar más").
//   - busyLabel  : string                → Texto mientras carga (por defecto "Cargando…").
//   - controlsId : string                → id del elemento afectado (ej. la lista), para aria-controls.
//
// ============================================================================

import React from "react";
import PropTypes from "prop-types";
import "./Action.css";

const Action = ({
  onMore,
  disabled = false,
  isLoading = false,
  label = "Mostrar más",
  busyLabel = "Cargando…",
  controlsId,
}) => {
  const handleClick = () => {
    if (typeof onMore === "function") onMore();
  };

  return (
    <div className="news-actions">
      <button
        id="btn-news-more"
        type="button"
        className="btn outline small"
        onClick={handleClick}
        disabled={disabled || isLoading}
        aria-controls={controlsId}
        aria-busy={isLoading || undefined}
      >
        {isLoading ? busyLabel : label}
      </button>
    </div>
  );
};

Action.propTypes = {
  onMore: PropTypes.func,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  busyLabel: PropTypes.string,
  controlsId: PropTypes.string,
};

export default Action;
