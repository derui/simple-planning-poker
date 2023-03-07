import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../hooks";
import { SignIn } from "../presentations/signin";
import { Overlay } from "../presentations/overlay";
import { Loader } from "../presentations/loader";
import { signIn } from "@/status/actions/signin";
import { selectAuthenticating } from "@/status/selectors/auth";

const styles = {
  link: classNames("text-primary-500", "hover:underline"),
  children: classNames("text-center", "mt-4", "mr-4"),
  overlayDialog: classNames(
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
  dialogText: classNames("ml-3"),
};

// eslint-disable-next-line func-style
export function SignInPage() {
  const authenticating = useAppSelector(selectAuthenticating());
  const dispatch = useAppDispatch();

  const handleSubmit = ({ email, password }: { email: string; password: string }) => {
    dispatch(signIn({ email, password }));
  };

  return (
    <div>
      <Overlay show={authenticating} testid={"overlay"}>
        <div className={styles.overlayDialog}>
          <Loader size="m" shown={true} testid={"loader"} />
          <span className={styles.dialogText}>Authenticating...</span>
        </div>
      </Overlay>
      <SignIn title="Sign In" onSubmit={handleSubmit} authenticating={authenticating} testid="signin">
        <p className={styles.children}>
          or{" "}
          <a className={styles.link} href="/signup">
            Sign up
          </a>
        </p>
      </SignIn>
    </div>
  );
}
