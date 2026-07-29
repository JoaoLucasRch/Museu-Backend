import { GoogleLogin, GoogleOAuthProvider, } from "@react-oauth/google";

import type { CredentialResponse, } from "@react-oauth/google";

import styles from "./LoginGoogle.module.css";

interface Props {
  clientId: string;
  containerRef:
    React.RefObject<HTMLDivElement | null>;
  containerWidth: number;
  loading: boolean;
  onSuccess: (
    response: CredentialResponse
  ) => void;
  onError: () => void;
}


export default function LoginGoogle({
  clientId,
  containerRef,
  containerWidth,
  loading,
  onSuccess,
  onError,
}: Props) {

  if (!clientId) {
    return (
      <div className={styles.googleWarning}>
        ⚠️ Google Login não configurado
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={styles.googleButtonWrapper}
    >
      <GoogleOAuthProvider
        clientId={clientId}
      >

        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap={false}
          theme="outline"
          size="large"
          width={
            containerWidth > 0
              ? containerWidth.toString()
              : "300"
          }
          text="continue_with"
          locale="pt-BR"
          shape="rectangular"
        />

      </GoogleOAuthProvider>
      {loading && (
        <p className={styles.loading}>
          Autenticando...
        </p>
      )}
    </div>
  );
}