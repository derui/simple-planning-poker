import { atom } from "recoil";
import AtomKeys from "./key";

const signInState = atom<{ authenticating: boolean; authenticated: boolean }>({
  key: AtomKeys.signIn,
  default: {
    authenticating: false,
    authenticated: false,
  },
});

export default signInState;
