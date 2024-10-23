import * as Url from "@spp/shared-app-url";
import { Dialog } from "@spp/ui-dialog";
import { Loader } from "@spp/ui-loader";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthStatus } from "../atoms/atom.js";
import { hooks } from "../hooks/facade.js";
import * as styles from "./login.css.js";

const Authenticating = function Authenticating() {
  return (
    <div className={styles.authenticatingLoader.root}>
      <p className={styles.authenticatingLoader.text}>Checking user authenticating status...</p>
      <div className={styles.authenticatingLoader.loader}>
        <Loader size="l" shown />
      </div>
    </div>
  );
};

// eslint-disable-next-line func-style
export function Login() {
  const auth = hooks.useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status == AuthStatus.Authenticated) {
      navigate(Url.gameIndexPage(), { replace: true });
    }
  }, [auth.status]);

  useEffect(() => {
    auth.checkLogined();
  }, []);

  return (
    <div className={styles.root}>
      <Dialog title="Login">
        {auth.status == AuthStatus.Checking ? (
          <Authenticating />
        ) : (
          <div className={styles.children}>
            <p className={styles.info}>Choose login method.</p>
            <Link to={Url.signInPage()} className={styles.link}>
              Sign In
            </Link>
            <Link to={Url.signUpPage()} className={styles.link}>
              Sign Up
            </Link>
          </div>
        )}
      </Dialog>
    </div>
  );
}
