import { clsx } from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Overlay } from "@spp/ui-overlay";
import { Loader } from "@spp/ui-loader";
import { Dialog } from "@spp/ui-dialog";

const styles = {
  root: clsx("h-full", "w-full"),
  link: clsx("text-primary-500", "hover:underline"),
  children: clsx("text-center", "mt-4", "mr-4"),
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
  inputContainer: clsx("flex", "flex-col", "w-full", "mx-auto", "list-none", "py-0", "px-3"),

  inputTerm: clsx("flex", "flex-auto", "items-center", "mb-4", "last:mb-0"),

  inputLabel: clsx("flex-[0_0_auto]", "w-24"),

  input: clsx(
    "flex-auto",
    "w-full",
    "p-2",
    "outline-none",
    "rounded",
    "border",
    "border-lightgray/40",
    "bg-lightgray/20",
    "transition-colors",
    "focus:border-secondary2-500",
    "focus:bg-white"
  ),
};

// eslint-disable-next-line func-style
export function LoginPage(props: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authenticating = useAppSelector(selectAuthenticating);
  const authenticated = useAppSelector(selectAuthenticated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (props.method === "signIn") {
      dispatch(signIn({ email, password }));
    } else {
      dispatch(signUp({ email, password }));
    }
  };

  useEffect(() => {
    if (authenticated) {
      navigate("/game", { replace: true });
    }
  }, [authenticated]);

  let link: JSX.Element | null = null;
  if (props.method === "signIn") {
    link = (
      <p className={styles.children}>
        or{" "}
        <Link className={styles.link} to={"/signup"}>
          Sign up
        </Link>
      </p>
    );
  }
  const title = props.method === "signIn" ? "Sign In" : "Sign Up";

  return (
    <div className={styles.root}>
      <Overlay show={authenticating} testid={"overlay"}>
        <div className={styles.overlayDialog}>
          <Loader size="m" shown={true} testid={"loader"} />
          <span className={styles.dialogText}>Authenticating...</span>
        </div>
      </Overlay>
      <Dialog
        title={title}
        onSubmitClick={handleSubmit}
        buttonState={authenticating ? "loading" : "enabled"}
        testid="signin"
      >
        <form className={styles.root} onSubmit={handleSubmit} data-testid={"root"}>
          <ul className={styles.inputContainer}>
            <li className={styles.inputTerm}>
              <label className={styles.inputLabel}>email</label>
              <input
                type="text"
                name="email"
                className={styles.input}
                value={email}
                placeholder="e.g. yourname@yourdomain.com"
                data-testid={"email"}
                onChange={(e) => setEmail(e.target.value)}
              />
            </li>
            <li className={styles.inputTerm}>
              <label className={styles.inputLabel}>password</label>
              <input
                type="password"
                name="password"
                minLength={6}
                className={styles.input}
                placeholder="Password"
                value={password}
                data-testid={"password"}
                onChange={(e) => setPassword(e.target.value)}
              />
            </li>
          </ul>
          {link}
        </form>
      </Dialog>
    </div>
  );
}

export default SignInPage;
