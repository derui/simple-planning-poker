import { atom } from "recoil";
import AtomKeys from "./key";

const signInState = atom<{ password: string; email: string; authenticating: boolean; authenticated: boolean }>({
  key: AtomKeys.signIn,
  default: {
    email: "",
    password: "",
    authenticating: false,
    authenticated: false,
  },
});

export default signInState;
