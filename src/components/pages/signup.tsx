import classNames from "classnames";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { SignIn } from "../presentations/signin";
import { Overlay } from "../presentations/overlay";
import { Loader } from "../presentations/loader";
import { signUp } from "@/status/actions/signin";
import { selectAuthenticated, selectAuthenticating } from "@/status/selectors/auth";

const styles = {
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
export function SignUpPage() {
  const authenticating = useAppSelector(selectAuthenticating());
  const authenticated = useAppSelector(selectAuthenticated());
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = ({ email, password }: { email: string; password: string }) => {
    dispatch(signUp({ email, password }));
  };

  useEffect(() => {
    if (authenticated) {
      navigate("/game", { replace: true });
    }
  }, [authenticated]);

  return (
    <div>
      <Overlay show={authenticating} testid={"overlay"}>
        <div className={styles.overlayDialog}>
          <Loader size="m" shown={true} testid={"loader"} />
          <span className={styles.dialogText}>Authenticating...</span>
        </div>
      </Overlay>
      <SignIn title="Sign Up" onSubmit={handleSubmit} authenticating={authenticating} testid="signin"></SignIn>
    </div>
  );
}

export default SignUpPage;
