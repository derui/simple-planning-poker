import * as Url from "@spp/shared-app-url";
import { Dialog } from "@spp/ui-dialog";
import { Loader } from "@spp/ui-loader";
import { Link } from "react-router-dom";
import * as styles from "./login.css.js";

interface Props {
  authenticating?: boolean;
}

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
export function LoginLayout({ authenticating = false }: Props): JSX.Element {
  return (
    <div className={styles.root}>
      <Dialog title="Login">
        {authenticating ? (
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
