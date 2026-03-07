// ============================================================================
// Archivo: MisDatos.jsx
// Contexto: Vista "Mis datos" en la landing. Permite al usuario ver y actualizar
//            su información de perfil (nombre, apellido, email, teléfono,
//            dirección) y cambiar la contraseña.
// Alcance: Usa auth global, validaciones front, y sincroniza con backend (PUT /usuarios/:id).
// Funciones/componentes:
//  - Estado form y validaciones (validate)
//  - refreshUser(): trae datos actualizados del backend
//  - updateUser(): envía cambios (y contraseña si aplica)
//  - Renderiza formulario con hints/errores y mensajes de éxito/error.
// ============================================================================
import { useEffect, useMemo,  useState } from "react";
import "./MisDatos.css";
import { useAuth } from "../../context/useAuth.jsx";

const initialState = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  direccion: "",
  passwordActual: "",
  passwordNueva: "",
};

const MisDatos = ({ onRequireLogin = () => {} }) => {
  const { user, updateUser, loading, error } = useAuth();
  const [form, setForm] = useState(initialState);
  const [mensaje, setMensaje] = useState(null);
  const [errores, setErrores] = useState({});

  const loggedIn = !!user?.id || !!user?.email;
  const userId = user?.id;

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
      }));
    }
  }, [user]);

  // useEffect(() => {
  //   if (!userId) return;

  //   const sync = async () => {
  //     try {
  //       // const refreshed = await refreshUser(userId);
  //       const u = refreshed.data ?? refreshed;

  //       setForm((prev) => ({
  //         ...prev,
  //         nombre: u.nombre || "",
  //         apellido: u.apellido || "",
  //         email: u.email || "",
  //         telefono: u.telefono || "",
  //         direccion: u.direccion || "",
  //       }));
  //     } catch (err) {
  //       console.error("Error refrescando usuario", err);
  //     }
  //   };

  //   sync();
  // }, [userId] );

  const validate = useMemo(
    () => () => {
      const errs = {};
      if (!form.nombre.trim()) errs.nombre = "Ingresa tu nombre.";
      if (!form.apellido.trim()) errs.apellido = "Ingresa tu apellido.";
      if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
        errs.email = "Correo inválido.";
      }
      if (form.telefono && form.telefono.trim().length < 6) {
        errs.telefono = "El teléfono debe tener al menos 6 caracteres.";
      }
      if (form.direccion && form.direccion.trim().length < 5) {
        errs.direccion = "La dirección debe tener al menos 5 caracteres.";
      }
      if (form.passwordNueva && form.passwordNueva.length < 6) {
        errs.passwordNueva = "La nueva contraseña debe tener al menos 6 caracteres.";
      }
      if (form.passwordNueva && !form.passwordActual) {
        errs.passwordActual = "Ingresa tu contraseña actual para poder cambiarla.";
      }
      return errs;
    },
    [form]
  );

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setErrores({});

    if (!loggedIn) {
      onRequireLogin();
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrores(errs);
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
    };

    if (form.passwordNueva) {
      payload.passwordActual = form.passwordActual;
      payload.passwordNueva = form.passwordNueva;
    }

    try {
      await updateUser(userId, payload);
      setMensaje("Tus datos se actualizaron correctamente.");
      setErrores({});
      setForm((prev) => ({
        ...prev,
        passwordActual: "",
        passwordNueva: "",
      }));
    } catch (err) {
      setMensaje(null);
      setErrores({ api: err.message });
    }
  };

  if (!loggedIn) {
    return (
      <main className="misdatos wrap" aria-labelledby="misdatos-title">
        <h1 id="misdatos-title">Mis datos</h1>
        <p className="misdatos__hint">
          Necesitas iniciar sesión para ver y editar tu perfil.
        </p>
        <button type="button" className="btn-primary" onClick={onRequireLogin}>
          Ir a iniciar sesión
        </button>
      </main>
    );
  }

  return (
    <main className="misdatos wrap" aria-labelledby="misdatos-title">
      <h1 id="misdatos-title">Mis datos</h1>
      <p className="misdatos__subtitle">
        Actualiza tu información de contacto y credenciales. Completa solo los campos que quieras
        cambiar. Para modificar la contraseña, ingresa la actual y la nueva.
      </p>

      <form className="misdatos__form" onSubmit={handleSubmit} noValidate>
        <div className="misdatos__grid">
          <label className="misdatos__field">
            <span>Nombre</span>
            <input
              type="text"
              value={form.nombre}
              onChange={handleChange("nombre")}
              required
            />
            {errores.nombre && <small className="misdatos__error">{errores.nombre}</small>}
          </label>

          <label className="misdatos__field">
            <span>Apellido</span>
            <input
              type="text"
              value={form.apellido}
              onChange={handleChange("apellido")}
              required
            />
            {errores.apellido && <small className="misdatos__error">{errores.apellido}</small>}
          </label>

          <label className="misdatos__field">
            <span>Correo electrónico</span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
            <small className="misdatos__hint">Usa un correo al que tengas acceso.</small>
            {errores.email && <small className="misdatos__error">{errores.email}</small>}
          </label>

          <label className="misdatos__field">
            <span>Teléfono</span>
            <input
              type="text"
              value={form.telefono}
              onChange={handleChange("telefono")}
              placeholder="+54..."
            />
            <small className="misdatos__hint">
              Incluye prefijo de país y área (mínimo 6 caracteres).
            </small>
            {errores.telefono && <small className="misdatos__error">{errores.telefono}</small>}
          </label>

          <label className="misdatos__field full">
            <span>Dirección</span>
            <input
              type="text"
              value={form.direccion}
              onChange={handleChange("direccion")}
              placeholder="Calle, número, piso/depto"
            />
            <small className="misdatos__hint">
              Dinos dónde quieres recibir tus pedidos (mínimo 5 caracteres).
            </small>
            {errores.direccion && <small className="misdatos__error">{errores.direccion}</small>}
          </label>
        </div>

        <div className="misdatos__card">
          <h2>Seguridad</h2>
          <p>Para cambiar tu contraseña, ingresa la actual y la nueva.</p>
          <div className="misdatos__grid">
            <label className="misdatos__field">
              <span>Contraseña actual</span>
              <input
                type="password"
                value={form.passwordActual}
                onChange={handleChange("passwordActual")}
                autoComplete="current-password"
              />
              <small className="misdatos__hint spacer">espacio</small>
              {errores.passwordActual && (
                <small className="misdatos__error">{errores.passwordActual}</small>
              )}
            </label>
            <label className="misdatos__field">
              <span>Nueva contraseña</span>
              <input
                type="password"
                value={form.passwordNueva}
                onChange={handleChange("passwordNueva")}
                autoComplete="new-password"
              />
              <small className="misdatos__hint">Mínimo 6 caracteres.</small>
              {errores.passwordNueva && (
                <small className="misdatos__error">{errores.passwordNueva}</small>
              )}
            </label>
          </div>
        </div>

        {errores.api && <div className="misdatos__alert error">{errores.api}</div>}
        {error && <div className="misdatos__alert error">{error}</div>}
        {mensaje && <div className="misdatos__alert ok">{mensaje}</div>}

        <div className="misdatos__actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            Guardar cambios
          </button>
        </div>
      </form>
    </main>
  );
};

export default MisDatos;
