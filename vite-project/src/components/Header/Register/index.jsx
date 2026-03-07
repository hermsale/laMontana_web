import { useState } from "react";
import BtnCreateUser from "./BtnCreateUser";
import BtnGoogleRegister from "./BtnGoogleRegister";

function Register({ onSubmit, cargando, onGoogleSuccess = () => {} }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const copia = { ...prev };
      delete copia[name];
      return copia;
    });
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    try {
      await onSubmit(form);
    } catch (err) {
      if (Array.isArray(err.detalles)) {
        const mapa = err.detalles.reduce((acc, det) => {
          if (det.campo) acc[det.campo] = det.mensaje;
          return acc;
        }, {});
        setFieldErrors(mapa);
      }
      setError(err.message || "No se pudo crear la cuenta");
    }
  };

  return (
    <>
      <form
        id="form-register"
        className="panel"
        role="tabpanel"
        aria-labelledby="tab-register"
        onSubmit={manejarRegistro}
      >
        <label htmlFor="reg-nombre">Nombre</label>
        <input
          type="text"
          id="reg-nombre"
          name="nombre"
          required
          autoComplete="given-name"
          value={form.nombre}
          onChange={manejarCambio}
          onInvalid={(e) => e.target.setCustomValidity("El nombre es obligatorio")}
          onInput={(e) => e.target.setCustomValidity("")}
        />

        <label htmlFor="reg-apellido">Apellido</label>
        <input
          type="text"
          id="reg-apellido"
          name="apellido"
          required
          autoComplete="family-name"
          value={form.apellido}
          onChange={manejarCambio}
          onInvalid={(e) => e.target.setCustomValidity("El apellido es obligatorio")}
          onInput={(e) => e.target.setCustomValidity("")}
        />

        <label htmlFor="reg-email">Correo</label>
        <input
          type="email"
          id="reg-email"
          name="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={manejarCambio}
          onInvalid={(e) =>
            e.target.setCustomValidity("Ingresa un correo válido (ej: nombre@dominio.com)")
          }
          onInput={(e) => e.target.setCustomValidity("")}
        />

        <label htmlFor="reg-telefono">Teléfono</label>
        <input
          type="tel"
          id="reg-telefono"
          name="telefono"
          autoComplete="tel"
          value={form.telefono}
          onChange={manejarCambio}
          className={fieldErrors.telefono ? "input-error" : ""}
        />
        {fieldErrors.telefono && (
          <p className="field-error">
            {fieldErrors.telefono} (opcional, si lo completas usa al menos 6 dígitos).
          </p>
        )}

        <label htmlFor="reg-direccion">Dirección</label>
        <input
          type="text"
          id="reg-direccion"
          name="direccion"
          autoComplete="street-address"
          value={form.direccion}
          onChange={manejarCambio}
          className={fieldErrors.direccion ? "input-error" : ""}
        />
        {fieldErrors.direccion && (
          <p className="field-error">
            {fieldErrors.direccion} (opcional, puedes dejarla vacía).
          </p>
        )}

        <label htmlFor="reg-password">Contraseña</label>
        <input
          type="password"
          id="reg-password"
          name="password"
          required
          autoComplete="new-password"
          value={form.password}
          onChange={manejarCambio}
          onInvalid={(e) =>
            e.target.setCustomValidity("La contraseña debe tener al menos 6 caracteres")
          }
          onInput={(e) => e.target.setCustomValidity("")}
        />

        {error && <p className="form-error">{error}</p>}

        <BtnCreateUser disabled={cargando} />

        <BtnGoogleRegister onSuccess={onGoogleSuccess} />
        <p className="sidebar-test-credentials" role="note">
          Usuario de prueba: <strong>prueba@prueba.com</strong>
          <br />
          Contraseña: <strong>targetgtr</strong>
        </p>
      </form>
    </>
  );
}

export default Register;
