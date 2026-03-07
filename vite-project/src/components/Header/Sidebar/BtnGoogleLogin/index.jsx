import GoogleAuthButton from "../../GoogleAuthButton";

function BtnGoogleLogin({ onSuccess }) {
  return <GoogleAuthButton mode="login" onSuccess={onSuccess} />;
}

export default BtnGoogleLogin;
