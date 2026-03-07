function BtnCreateUser({ disabled }) {
  return (
    <>
      <button type="submit" className="btn full" disabled={disabled}>
        Crear cuenta
      </button>
    </>
  );
}

export default BtnCreateUser;
