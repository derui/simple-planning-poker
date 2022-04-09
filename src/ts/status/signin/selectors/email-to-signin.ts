import { selector } from "recoil";
import signInState from "../atoms/signing";
import SelectorKeys from "./key";

const emailToSignIn = selector<string>({
  key: SelectorKeys.emailToSignIn,
  get: ({ get }) => {
    return get(signInState).email;
  },
});

export default emailToSignIn;
