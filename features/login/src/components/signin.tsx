import { clsx } from "clsx";
import { useNavigate } from "react-router-dom";
import { Overlay } from "@spp/ui-overlay";
import { Loader } from "@spp/ui-loader";
import { hooks } from "../hooks/facade.js";
import { LoginForm } from "./presentations/login-form.js";
import { Dialog } from "@spp/ui-dialog";
import { useEffect } from "react";
import * as Url from "@spp/shared-app-url";

const styles = {
  root: clsx("h-full", "w-full", "grid", "place-content-center"),
  overlayDialog: clsx(
    "flex",
    "flex-row",
    "p-4",
    "h-16",
    "border",
    "border-secondary1-400",
    "rounded",
    "bg-white",
    "items-center"
  ),
  dialogText: clsx("ml-3"),
};

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
        <LoginForm onSubmit={handleSubmit} />
      </Dialog>
    </main>
  );
}
