// ============================================================================
// Archivo: ImpresionesPage.jsx
// Contexto: Vista de "Impresiones y copias". Permite subir archivo, elegir
//            opciones de impresión/encuadernado, ver costo y confirmar pedido.
// Funciones/Métodos declarados:
//   - fetchJson: helper HTTP con manejo de errores JSON.
//   - ImpresionesPage: componente principal, orquesta estado y UI.
//   - handleArchivo: valida archivo y calcula carillas (PDF/TXT).
//   - handleSubmit: envía pedido, genera número y resetea formularios.
// ============================================================================
import { useEffect, useMemo, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { API_BASE } from "../../config/api.js";
import ImpresionesForm from "../../components/ImpresionesForm";
import ImpresionesSummary from "../../components/ImpresionesSummary";
import ImpresionesShipping from "../../components/ImpresionesShipping";
import { useAuth } from "../../context/useAuth.jsx";
import "./ImpresionesPage.css";

const fetchJson = async (path, options = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
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

// ---------------------------------------------------------------------------
// Ajuste porcentual por tamaño de papel respecto a A4.
// ---------------------------------------------------------------------------
const paperSizeFactors = {
  A4: 1,
  "US-letter": 1.05,
  A3: 1.6,
  Oficio: 1.15,
};

const requiredServicios = ["fotocopiado_bn", "fotocopiado_color", "doble_faz", "encuadernado", "anillado"];
const errorTarifasMsg = "No se pudieron cargar las tarifas desde la base de datos. Intenta recargar.";

// ---------------------------------------------------------------------------
// Estado inicial del formulario de configuracion de pedido.
// ---------------------------------------------------------------------------
const initialForm = {
  carillas: 0,
  modo: "bn",
  dobleFaz: false,
  encuadernado: false,
  anillado: false,
  archivo: null,
  notasCliente: "",
  metodoPago: "efectivo",
  paperSize: "A4",
};

// ---------------------------------------------------------------------------
// Estado inicial del formulario de envio.
// ---------------------------------------------------------------------------
const initialShipping = {
  direccionEnvio: "",
  telefonoContacto: "",
  notasEnvio: "",
  cp: "",
};

const ImpresionesPage = () => {
  const { user } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [shipping, setShipping] = useState(initialShipping);
  const [error, setError] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const cargarServicios = async () => {
      setLoadingServicios(true);
      try {
        const resp = await fetchJson("/servicios");
        setServicios(resp.data || []);
      } catch (e) {
        setError(errorTarifasMsg);
        console.error("No se pudieron cargar servicios", e);
      } finally {
        setLoadingServicios(false);
      }
    };
    cargarServicios();
  }, []);

  useEffect(() => {
    setForm({ ...initialForm });
    setShipping({ ...initialShipping });
    setError(null);
    setOrderNumber(null);
    setShowConfirm(false);
  }, []);

  const precios = useMemo(() => {
    const findPrecio = (nombre) => {
      const found = servicios.find((s) => s.nombre === nombre);
      return Number(found?.precio) || 0;
    };
    return {
      bn: findPrecio("fotocopiado_bn"),
      color: findPrecio("fotocopiado_color"),
      dobleFazFactor: findPrecio("doble_faz"),
      encuadernado: findPrecio("encuadernado"),
      anillado: findPrecio("anillado"),
    };
  }, [servicios]);

  useEffect(() => {
    if (loadingServicios) return;
    const missing = requiredServicios.filter((nombre) => !servicios.some((s) => s.nombre === nombre));
    if (missing.length) {
      setError(errorTarifasMsg);
    } else if (error === errorTarifasMsg) {
      setError(null);
    }
  }, [loadingServicios, servicios, error]);

  const total = useMemo(() => {
    const carillas = Number(form.carillas) || 0;
    const baseUnit = form.modo === "color" ? precios.color : precios.bn;
    const factor = form.dobleFaz ? precios.dobleFazFactor : 1;
    const paperFactor = paperSizeFactors[form.paperSize] || 1;
    let subtotal = carillas * baseUnit * factor * paperFactor;
    if (form.encuadernado) subtotal += precios.encuadernado;
    if (form.anillado) subtotal += precios.anillado;
    return Math.max(subtotal, 0);
  }, [form, precios]);

  GlobalWorkerOptions.workerSrc = pdfWorker;

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleArchivo = async (file) => {
    if (!file) return;
    if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword", "text/plain"].includes(file.type)) {
      setError("Solo se permiten PDF, DOCX o TXT");
      return;
    }
    setForm((prev) => ({
      ...prev,
      archivo: {
        nombre: file.name,
        tipo: file.type,
        tamano: file.size,
      },
    }));

    if (file.type === "application/pdf") {
      try {
        const buffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: buffer }).promise;
        setForm((prev) => ({ ...prev, carillas: pdf.numPages || prev.carillas }));
      } catch (e) {
        console.error("No se pudo contar carillas del PDF", e);
      }
    } else if (file.type === "text/plain") {
      try {
        const text = await file.text();
        const charsPerPage = 1800; // aproximación A4
        const pages = Math.max(1, Math.ceil(text.length / charsPerPage));
        setForm((prev) => ({ ...prev, carillas: pages }));
      } catch (e) {
        console.error("No se pudo contar carillas del TXT", e);
      }
    }
  };

  const handleSubmit = async () => {
    const missing = requiredServicios.filter((nombre) => !servicios.some((s) => s.nombre === nombre));
    if (missing.length) {
      setError(errorTarifasMsg);
      return;
    }
    setError(null);
    setOrderNumber(null);
    try {
      const payload = {
        ...form,
        total,
        direccionEnvio: shipping.direccionEnvio,
        telefonoContacto: shipping.telefonoContacto,
        notasCliente: form.notasCliente || shipping.notasEnvio || "",
        metodoPago: form.metodoPago,
      };
      const resp = await fetchJson("/pedidos", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const generatedOrder = `A-${String(Math.floor(Math.random() * 1_000_000_000)).padStart(9, "0")}`;
      const numeroPedidoApi = resp.data?.numeroPedido || resp.data?.id;
      const numeroPedido =
        typeof numeroPedidoApi === "string" && numeroPedidoApi.trim() !== ""
          ? numeroPedidoApi
          : generatedOrder;
      setOrderNumber(numeroPedido);
      setShowConfirm(true);
      setForm({ ...initialForm });
      setShipping({ ...initialShipping });
    } catch (e) {
      setError(e.message || "No se pudo crear el pedido");
    }
  };

  const displayOrder = orderNumber || "";

  return (
    <main className="impresiones wrap">
      <h1 className="impresiones__title">Impresiones y Copias</h1>
      <div className="impresiones__layout">
        <div className="impresiones__col">
          <ImpresionesShipping shipping={shipping} setShipping={setShipping} user={user} />
        </div>
        <div className="impresiones__col">
          <p className="impresiones__intro">
            Sube tu archivo, elige tipo de impresión y extras. Calculamos el total al instante.
          </p>
          <ImpresionesForm
            form={form}
            setForm={setForm}
            precios={precios}
            onArchivoSelect={handleArchivo}
            loadingServicios={loadingServicios}
          />
        </div>
      </div>
      <div className="impresiones__summary">
        <ImpresionesSummary
          form={form}
          precios={precios}
          total={total}
          onSubmit={handleSubmit}
          error={error}
        />
      </div>
      {showConfirm && (
        <div className="imp-modal-backdrop" role="presentation">
          <div className="imp-modal" role="dialog" aria-modal="true">
            <h3>Pedido confirmado</h3>
            <p>Gracias por tu compra.</p>
            {displayOrder && <p className="imp-modal__order">Orden numero: {displayOrder}</p>}
            <button type="button" className="btn-cart" onClick={() => setShowConfirm(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ImpresionesPage;
