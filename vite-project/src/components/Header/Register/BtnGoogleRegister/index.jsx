import GoogleAuthButton from "../../GoogleAuthButton";

function BtnGoogleRegister({ onSuccess }) {
  return <GoogleAuthButton mode="register" onSuccess={onSuccess} />;
}

export default BtnGoogleRegister;
