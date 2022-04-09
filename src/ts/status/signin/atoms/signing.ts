import { atom } from "recoil";
import AtomKeys from "./key";

const signInState = atom<{ password: string; email: string; authenticating: boolean }>({
  key: AtomKeys.signIn,
  default: {
    email: "",
    password: "",
    authenticating: false,
  },
});

export default signInState;
