import "./BtnSignUp.css";

function BtnSignUp({ activo, onClick }) {
  return (
    <button
      className={`tab ${activo ? "active" : ""}`}
      data-tab="register"
      id="tab-register"
      type="button"
      aria-pressed={activo}
      onClick={onClick}
    >
      Crear cuenta
    </button>
  );
}

export default BtnSignUp;
