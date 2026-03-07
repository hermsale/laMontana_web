import { useEffect, useState } from "react";
import "./ImpresionesShipping.css";

function ImpresionesShipping({ shipping, setShipping, user }) {
  const [usarCuenta, setUsarCuenta] = useState(false);

  const setValue = (key, value) => setShipping((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (usarCuenta && user?.direccion) {
      setValue("direccionEnvio", user.direccion);
    }
    if (usarCuenta && user?.telefono) {
      setValue("telefonoContacto", user.telefono);
    }
    if (!usarCuenta) {
      setValue("direccionEnvio", shipping.direccionEnvio || "");
      setValue("telefonoContacto", shipping.telefonoContacto || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usarCuenta, user]);

  return (
    <div className="imp-ship">
      <h3>Envío</h3>
      <p className="imp-ship__hint">Envíos gratis en CABA/GBA. Otras zonas a coordinar.</p>
      <label className="imp-ship__label check">
        <input
          type="checkbox"
          checked={usarCuenta}
          onChange={(e) => setUsarCuenta(e.target.checked)}
        />
        Usar dirección de mi cuenta
      </label>
      <label className="imp-ship__label">
        Dirección
        <input
          type="text"
          value={shipping.direccionEnvio}
          onChange={(e) => setValue("direccionEnvio", e.target.value)}
          placeholder="Calle y número"
        />
      </label>
      <label className="imp-ship__label">
        Teléfono de contacto
        <input
          type="text"
          value={shipping.telefonoContacto}
          onChange={(e) => setValue("telefonoContacto", e.target.value)}
          placeholder="+54..."
        />
      </label>
      <label className="imp-ship__label">
        Notas de envío
        <textarea
          rows="3"
          value={shipping.notasEnvio}
          onChange={(e) => setValue("notasEnvio", e.target.value)}
          placeholder="Indicaciones de entrega, horarios, timbre, etc."
        />
      </label>
      <label className="imp-ship__label">
        Código postal
        <input
          type="text"
          value={shipping.cp}
          onChange={(e) => setValue("cp", e.target.value)}
          placeholder="Ej: 1406"
        />
      </label>
    </div>
  );
}

export default ImpresionesShipping;
