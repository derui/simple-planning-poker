import { useAppDispatch } from "../hooks";
import { SignIn } from "../presentations/signin";
import { signUp } from "@/status/actions/signin";

// eslint-disable-next-line func-style
export function SignUpPage() {
  const dispatch = useAppDispatch();

  const handleSubmit = ({ email, password }: { email: string; password: string }) => {
    dispatch(signUp({ email, password }));
  };

  return <SignIn title="Sign In" onSubmit={handleSubmit} authenticating={false} testid="signin"></SignIn>;
}
