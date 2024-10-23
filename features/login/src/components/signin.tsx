import * as Url from "@spp/shared-app-url";
import { Dialog } from "@spp/ui-dialog";
import { Loader } from "@spp/ui-loader";
import { Overlay } from "@spp/ui-overlay";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hooks } from "../hooks/facade.js";
import { LoginForm } from "./presentations/login-form.js";
import * as styles from "./signin.css.js";

// eslint-disable-next-line func-style
export function SignIn() {
  const login = hooks.useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (login.status == "logined") {
      navigate(Url.gameIndexPage());
    }
  }, [login.status]);

  const handleSubmit = (email: string, password: string) => {
    login.signIn(email, password);
  };

  return (
    <main className={styles.root}>
      <Overlay show={login.status == "doing"}>
        <div className={styles.overlayDialog}>
          <Loader size="m" shown={true} />
          <span className={styles.dialogText}>Authenticating...</span>
        </div>
      </Overlay>
      <Dialog title="Sign In">
        <div className={styles.dialogContent}>
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </Dialog>
    </main>
  );
}
