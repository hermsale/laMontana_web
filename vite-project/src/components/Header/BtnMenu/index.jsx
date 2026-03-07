// Botón de menú hamburguesa para abrir el sidebar de cuenta.
function BtnMenu({ onClick }) {
  return (
    <>
      <button
        type="button"
        className="hamburger"
        id="menu-toggle"
        aria-expanded="false"
        aria-controls="sidebar"
        aria-label="Abrir menú"
        onClick={onClick}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white">
          <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </>
  );
}

export default BtnMenu;
