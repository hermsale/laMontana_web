import "./UserChip.css";
import { useAuth } from "../../../context/useAuth.jsx";

function UserChip() {

  const { user } = useAuth();

// si no hay un usuario logueado, no muestro el chip
  if(!user) return null;

  return(
      /* Chip de usuario logueado */
    <>
      
      <div id="user-chip" className="user-chip">
        <span
          className="dot online"
          aria-label="Conectado"
          title="Conectado"
        ></span>
        {/* muestro el email  */}
        <span id="user-chip-email">{user.email}</span>
      </div>
    </>
  );
}

export default UserChip;
