import { Auth } from "firebase/auth";

let _auth: Auth;

export const setAuth = function setAuth(auth: Auth): void {
  _auth = auth;
};

export const getAuth = function getAuth(): Auth | undefined {
  return _auth;
};
