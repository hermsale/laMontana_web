import "./ImpresionesSummary.css";

const formatPrecio = (p) => `$${Number(p).toFixed(2)}`;

function ImpresionesSummary({ form, precios, total, onSubmit, error }) {
  const paperLabels = {
    A4: "A4 (+0%)",
    "US-letter": "US Letter (+5%)",
    A3: "A3 (+60%)",
    Oficio: "Oficio (+15%)",
  };

  return (
    <div className="imp-summary">
      <h3>Resumen</h3>
      <div className="imp-summary__row">
        <span>Carillas</span>
        <span>{form.carillas}</span>
      </div>
      <div className="imp-summary__row">
        <span>Modo</span>
        <span>{form.modo === "color" ? "Color" : "Blanco y negro"}</span>
      </div>
      <div className="imp-summary__row">
        <span>Tamaño de hoja</span>
        <span>{paperLabels[form.paperSize] || form.paperSize}</span>
      </div>
      <div className="imp-summary__row">
        <span>Precio unitario</span>
        <span>{form.modo === "color" ? formatPrecio(precios.color) : formatPrecio(precios.bn)}</span>
      </div>
      <div className="imp-summary__row">
        <span>Doble faz</span>
        <span>{form.dobleFaz ? "Sí (20% menos por carilla)" : "No"}</span>
      </div>
      <div className="imp-summary__row">
        <span>Encuadernado</span>
        <span>{form.encuadernado ? formatPrecio(precios.encuadernado) : "No"}</span>
      </div>
      <div className="imp-summary__row">
        <span>Anillado</span>
        <span>{form.anillado ? formatPrecio(precios.anillado) : "No"}</span>
      </div>

      <div className="imp-summary__total">
        <span>Total a pagar</span>
        <strong>{formatPrecio(total)}</strong>
      </div>

      {error && <div className="imp-summary__error">{error}</div>}

      <button type="button" className="btn-cart" onClick={onSubmit}>
        Realizar pedido
      </button>
    </div>
  );
}

export default ImpresionesSummary;
