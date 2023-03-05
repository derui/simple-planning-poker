import classNames from "classnames";
import { useAppDispatch } from "../hooks";
import { SignIn } from "../presentations/signin";
import { signIn } from "@/status/actions/signin";

const styles = {
  link: classNames("text-primary-500", "hover:underline"),
  children: classNames("text-center", "mt-4", "mr-4"),
};

// eslint-disable-next-line func-style
export function SignInPage() {
  const dispatch = useAppDispatch();

  const handleSubmit = ({ email, password }: { email: string; password: string }) => {
    dispatch(signIn({ email, password }));
  };

  return (
    <SignIn title="Sign In" onSubmit={handleSubmit} authenticating={false} testid="signin">
      <p className={styles.children}>
        or{" "}
        <a className={styles.link} href="/signup">
          Sign up
        </a>
      </p>
    </SignIn>
  );
}
