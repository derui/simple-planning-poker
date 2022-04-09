import { selector } from "recoil";
import signInState from "../atoms/signing";
import SelectorKeys from "./key";

const passwordToSignIn = selector<string>({
  key: SelectorKeys.passwordToSignIn,
  get: ({ get }) => {
    return get(signInState).password;
  },
});

export default passwordToSignIn;
