import { Authenticator } from "@spp/infra-authenticator/base";
import { User } from "@spp/shared-domain";
import { Atom, atom, WritableAtom } from "jotai";
import { AuthStatus, LoginStatus } from "./type.js";

/**
 * Package-global authentication state.
 */
const internalAuthStatusAtom = atom<AuthStatus>(AuthStatus.NotAuthenticated);

export const authStatusAtom: Atom<AuthStatus> = atom((get) => get(internalAuthStatusAtom));

/**
 * Package-global logined user id.
 */
const internalLoginedUserAtom = atom<User.Id | undefined>();

export const loginedUserAtom: Atom<User.Id | undefined> = atom((get) => get(internalLoginedUserAtom));

/**
 * Start checking any users logined or not. This atom is write-only
 */
export const checkLoginedAtom: WritableAtom<null, [], void> = atom(null, (_get, set) => {
  set(internalAuthStatusAtom, AuthStatus.Checking);

  Authenticator.currentUserIdIfExists(undefined)
    .then((userId) => {
      if (!userId) {
        set(internalAuthStatusAtom, AuthStatus.NotAuthenticated);
      } else {
        set(internalLoginedUserAtom, userId);
        set(internalAuthStatusAtom, AuthStatus.Authenticated);
      }
    })
    .catch(() => {
      set(internalAuthStatusAtom, AuthStatus.NotAuthenticated);
    });
});

/**
 * logout current user
 */
export const logoutAtom: WritableAtom<null, [], void> = atom(null, (_get, set) => {
  set(internalLoginedUserAtom, undefined);
  set(internalAuthStatusAtom, AuthStatus.NotAuthenticated);
});

/**
 * Atom for login status
 */
const internalLoginStatusAtom = atom<LoginStatus>(LoginStatus.NotLogined);
const internalLoginErrorAtom = atom<string | undefined>();

export const loginStatusAtom: Atom<LoginStatus> = atom((get) => get(internalLoginStatusAtom));
export const loginErrorAtom: Atom<string | undefined> = atom((get) => get(internalLoginErrorAtom));

/**
 * Do sign in
 */
export const signInAtom: WritableAtom<null, [email: string, password: string], void> = atom(
  null,
  (get, set, email: string, password: string) => {
    const authStatus = get(internalAuthStatusAtom);
    const loginStatus = get(internalLoginStatusAtom);

    if (!(authStatus == AuthStatus.NotAuthenticated && loginStatus != LoginStatus.NotLogined)) {
      return;
    }

    set(internalLoginStatusAtom, LoginStatus.Doing);

    Authenticator.signIn({ email, password })
      .then((userId) => {
        if (userId) {
          set(internalLoginedUserAtom, userId);
          set(internalAuthStatusAtom, AuthStatus.Authenticated);
          set(internalLoginStatusAtom, LoginStatus.Logined);
        } else {
          set(internalLoginStatusAtom, LoginStatus.NotLogined);
          set(internalLoginErrorAtom, "Email or password is invalid");
        }
      })
      .catch(() => {
        set(internalLoginStatusAtom, LoginStatus.NotLogined);
        set(internalLoginErrorAtom, "Error occurred on backend. Please retry later");
      });
  }
);

/**
 * Do sign up
 */
export const signUpAtom: WritableAtom<null, [email: string, password: string], void> = atom(
  null,
  (get, set, email: string, password: string) => {
    const authStatus = get(internalAuthStatusAtom);
    const loginStatus = get(internalLoginStatusAtom);

    if (!(authStatus == AuthStatus.NotAuthenticated && loginStatus == LoginStatus.NotLogined)) {
      return;
    }

    set(internalLoginStatusAtom, LoginStatus.Doing);

    Authenticator.signUp({ name: email, email, password })
      .then((userId) => {
        if (userId) {
          set(internalLoginedUserAtom, userId);
          set(internalAuthStatusAtom, AuthStatus.Authenticated);
          set(internalLoginStatusAtom, LoginStatus.Logined);
        } else {
          set(internalLoginStatusAtom, LoginStatus.NotLogined);
          set(internalLoginErrorAtom, "Email or password is invalid");
        }
      })
      .catch(() => {
        set(internalLoginStatusAtom, LoginStatus.NotLogined);
        set(internalLoginErrorAtom, "Error occurred on backend. Please retry later");
      });
  }
);
