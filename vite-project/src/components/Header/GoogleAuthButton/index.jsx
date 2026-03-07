import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/useAuth.jsx";
import { ensureGoogleIdentityScript } from "../../../services/googleIdentity.js";
import "./GoogleAuthButton.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const textByMode = {
  login: "signin_with",
  register: "signup_with",
};

function GoogleAuthButton({ mode = "login", onSuccess = () => {} }) {
  const { loginWithGoogleIdToken } = useAuth();
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const setupGoogleButton = async () => {
      if (!GOOGLE_CLIENT_ID) {
        setError("Google no está configurado. Falta VITE_GOOGLE_CLIENT_ID.");
        return;
      }

      try {
        await ensureGoogleIdentityScript();
        if (cancelled || !containerRef.current || !window.google?.accounts?.id) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (!response?.credential) {
              setError("No se recibió credencial de Google.");
              return;
            }
            try {
              await loginWithGoogleIdToken(response.credential);
              onSuccess();
            } catch (err) {
              setError(err.message || "No se pudo autenticar con Google.");
            }
          },
          ux_mode: "popup",
        });

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: textByMode[mode] || "continue_with",
          shape: "rectangular",
          width: 288,
          logo_alignment: "left",
        });
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "No se pudo inicializar Google.");
        }
      }
    };

    setupGoogleButton();

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogleIdToken, mode, onSuccess]);

  return (
    <div className="google-auth-container">
      <div ref={containerRef} className="google-auth-button" />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

export default GoogleAuthButton;
