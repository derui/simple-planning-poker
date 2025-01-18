import { Auth } from "firebase/auth";

let _auth: Auth;

/**
 * Sets the authentication instance.
 * @param auth - The Firebase Auth instance to set.
 */
export const setAuth = function setAuth(auth: Auth): void {
  _auth = auth;
};

/**
 * Gets the authentication instance if it has been set, otherwise returns undefined.
 * @returns The Firebase Auth instance or undefined if not yet set.
 */
export const getAuth = function getAuth(): Auth | undefined {
  return _auth;
};
