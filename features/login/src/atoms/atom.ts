import { User } from "@spp/shared-domain";
import { Authenticator } from "@spp/infra-authenticator";
import { atom, useAtom } from "jotai";

/**
 * User id that is logined.
 */
const currentUserIdAtom = atom<User.Id | undefined>();

/**
 * An user is logined or not
 */
const loginedAtom = atom((get) => get(currentUserIdAtom) != undefined);

/**
 * Login status
 */
enum LoginStatus {
  Logined = "logined",
  NotLogined = "notLogined",
  Doing = "doing",
}

/**
 * Atom for login status
 */
const loginStatusAtom = atom<LoginStatus>(LoginStatus.NotLogined);
const loginErrorAtom = atom<string | undefined>();

/**
 * Hook interface
 */
export type UseAuth = () => {
  /**
   * logined or not
   */
  logined: boolean;

  /**
   * Logined user id
   */
  currentUserId: User.Id | undefined;

  /**
   * Logout user
   */
  logout(): Promise<void>;
};

/**
 * Hook factory for `useAuth`
 */
export const useAuth: UseAuth = () => {
  const [logined] = useAtom(loginedAtom);
  const [currentUserId, setCurrentUserId] = useAtom(currentUserIdAtom);

  return {
    logined,
    currentUserId,
    logout: () => {
      setCurrentUserId(undefined);
      return Promise.resolve();
    },
  };
};

/**
 * Hook to login
 */
export type UseLogin = () => {
  /**
   * sign in existance user
   */
  signIn(email: string, password: string): void;

  /**
   * sign up new user
   */
  signUp(email: string, password: string): void;

  /**
   * Login status
   */
  status: "logined" | "notLogined" | "doing";

  /**
   * Set error message when login failed
   */
  loginError: string | undefined;
};

/**
 * Factory function to create `useLogin` hook
 */
export const createUseLogin = function createUseLogin(authenticator: Authenticator): UseLogin {
  return () => {
    const [, setCurrentUserId] = useAtom(currentUserIdAtom);
    const [status, setStatus] = useAtom(loginStatusAtom);
    const [loginError, setLoginError] = useAtom(loginErrorAtom);

    return {
      signIn(email, password) {
        setStatus(LoginStatus.Doing);

        authenticator
          .signIn(email, password)
          .then((userId) => {
            if (userId) {
            } else {
              setStatus(LoginStatus.NotLogined);
              setLoginError("Email or password is invalid");
            }
          })
          .catch(() => {
            setStatus(LoginStatus.NotLogined);
            setLoginError("Error occurred on backend. Please retry later");
          });
      },
      signUp(email, password) {
        setStatus(LoginStatus.Doing);

        authenticator
          .signUp(email, email, password)
          .then((userId) => {
            if (userId) {
              setCurrentUserId(userId);
              setStatus(LoginStatus.Logined);
            } else {
              setStatus(LoginStatus.NotLogined);
              setLoginError("Email or password is invalid");
            }
          })
          .catch(() => {
            setStatus(LoginStatus.NotLogined);
            setLoginError("Error occurred on backend. Please retry later");
          });
      },

      status,
      loginError,
    };
  };
};
