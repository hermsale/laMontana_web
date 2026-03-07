import "../BtnSignUp/BtnSignUp.css";

function BtnLogin({ activo, onClick }) {
  return (
    <>
      <button
        className={`tab ${activo ? "active" : ""}`}
        data-tab="login"
        id="tab-login"
        type="button"
        aria-pressed={activo}
        onClick={onClick}
      >
        Iniciar sesión
      </button>
    </>
  );
}

export default BtnLogin;
