import { clsx } from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader } from "@spp/ui-loader";
import { hooks } from "../hooks/facade.js";
import { AuthStatus } from "../atoms/atom.js";
import * as Url from "@spp/shared-app-url";
import { Dialog } from "@spp/ui-dialog";

const styles = {
  root: clsx("h-full", "w-full"),
  link: clsx("text-orange-700", "hover:underline", "text-lg", "grid", "place-content-center"),
  children: clsx("grid", "grid-cols-2", "grid-rows-2", "p-4"),
  info: clsx(
    "text-chestnut-700",
    "bg-chestnut-200",
    "border",
    "border-chestnut-500",
    "p-4",
    "rounded",
    "col-span-2",
    "mb-4",
    "grid",
    "place-content-center",
    "font-bold"
  ),
  authenticatingLoader: {
    root: clsx("grid", "grid-rows-2", "place-content-center", "py-4"),
    loader: clsx("grid", "place-content-center", "my-4"),
    text: clsx(
      "grid",
      "place-content-center",
      "p-4",
      "bg-teal-200",
      "text-teal-700",
      "border",
      "border-teal-500",
      "rounded",
      "font-bold"
    ),
  },
};

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
