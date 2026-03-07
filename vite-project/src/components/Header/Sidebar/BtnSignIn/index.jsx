import "./BtnSignIn.css";
function BtnSignIn({ disabled }) {
  return (
    <>
      <button type="submit" className="btn full" disabled={disabled}>
        Ingresar
      </button>
    </>
  );
}

export default BtnSignIn;
