import {
  GoogleOAuthProvider,
  GoogleLogin,
} from "@react-oauth/google";

import type {
  CredentialResponse,
} from "@react-oauth/google";

import styles from "./RegisterGoogle.module.css";

interface Props {
  googleClientId: string;
  containerWidth: number;
  googleContainerRef: React.RefObject<HTMLDivElement | null>;
  onSuccess: (response: CredentialResponse) => void;
  onError: () => void;
}

export default function RegisterGoogle({
  googleClientId,
  containerWidth,
  googleContainerRef,
  onSuccess,
  onError,
}: Props) {
  return (
    <>
      <div className={styles.divider}>
        <span>ou</span>
      </div>

      <div
        ref={googleContainerRef}
        className={styles.googleButtonWrapper}
      >
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
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
              text="signup_with"
              locale="pt-BR"
              shape="rectangular"
            />
          </GoogleOAuthProvider>
        ) : (
          <div className={styles.googleWarning}>
            <p>⚠️ Google não configurado</p>

            <small>
              Configure VITE_GOOGLE_CLIENT_ID
            </small>
          </div>
        )}
      </div>
    </>
  );
}