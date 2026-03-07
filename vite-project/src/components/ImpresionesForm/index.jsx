import { useState } from "react";
import "./ImpresionesForm.css";

const formatPrecio = (p) => `$${Number(p).toFixed(2)}`;

function ImpresionesForm({ form, setForm, precios, onArchivoSelect, loadingServicios }) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) onArchivoSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onArchivoSelect(file);
  };

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const paperLabels = {
    A4: "A4 (+0%)",
    "US-letter": "US Letter (+5%)",
    A3: "A3 (+60%)",
    Oficio: "Oficio (+15%)",
  };

  return (
    <div className="imp-form">
      <h3>Configura tu pedido</h3>

      <div
        className={`imp-dropzone ${dragOver ? "over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <p>Arrastra y suelta tu archivo PDF / DOCX / TXT</p>
        <input
          ref={(input) => {
            // guardamos ref en closure simple para el click del botón
            handleFileInput.input = input;
          }}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
        />
        <button
          type="button"
          className="btn-outline"
          onClick={() => handleFileInput.input && handleFileInput.input.click()}
        >
          <span>Examinar</span>
        </button>
        {form.archivo && (
          <p className="imp-file">
            {form.archivo.nombre} ({(form.archivo.tamano / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      <div className="imp-field">
        <label>Carillas</label>
        <input
          type="number"
          min="0"
          value={form.carillas}
          onChange={(e) => setValue("carillas", Number(e.target.value) || 0)}
          className="imp-carillas"
        />
        <small>Precio por carilla B/N: {formatPrecio(precios.bn)} | Color: {formatPrecio(precios.color)}</small>
      </div>

      <div className="imp-field">
        <label>Tamaño de hoja</label>
        <select value={form.paperSize} onChange={(e) => setValue("paperSize", e.target.value)}>
          <option value="A4">{paperLabels.A4}</option>
          <option value="US-letter">{paperLabels["US-letter"]}</option>
          <option value="A3">{paperLabels.A3}</option>
          <option value="Oficio">{paperLabels.Oficio}</option>
        </select>
        <small>El precio base está calculado para A4; otros tamaños aplican un ajuste.</small>
      </div>

      <div className="imp-options">
        <label>Modo de impresión</label>
        <div className="imp-radio-row">
          <label>
            <input
              type="radio"
              name="modo"
              value="bn"
              checked={form.modo === "bn"}
              onChange={() => setValue("modo", "bn")}
            />
            Blanco y negro
          </label>
          <label>
            <input
              type="radio"
              name="modo"
              value="color"
              checked={form.modo === "color"}
              onChange={() => setValue("modo", "color")}
            />
            Color
          </label>
        </div>
      </div>

      <div className="imp-options">
        <label>Otras opciones</label>
        <label className="imp-check">
          <input
            type="checkbox"
            checked={form.dobleFaz}
            onChange={(e) => setValue("dobleFaz", e.target.checked)}
          />
          Doble faz (20% menos por carilla)
        </label>
        <label className="imp-check">
          <input
            type="checkbox"
            checked={form.encuadernado}
            onChange={(e) => setValue("encuadernado", e.target.checked)}
          />
          Encuadernado ({formatPrecio(precios.encuadernado)})
        </label>
        <label className="imp-check">
          <input
            type="checkbox"
            checked={form.anillado}
            onChange={(e) => setValue("anillado", e.target.checked)}
          />
          Anillado ({formatPrecio(precios.anillado)})
        </label>
      </div>

      <div className="imp-field">
        <label>Método de pago</label>
        <select
          value={form.metodoPago}
          onChange={(e) => setValue("metodoPago", e.target.value)}
        >
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      <div className="imp-field">
        <label>Notas</label>
        <textarea
          rows="3"
          value={form.notasCliente}
          onChange={(e) => setValue("notasCliente", e.target.value)}
          placeholder="Indicaciones sobre entrega, impresión o plazos"
        />
      </div>

      {loadingServicios && <p className="imp-hint">Cargando tarifas...</p>}
    </div>
  );
}

export default ImpresionesForm;
