/**
 * Authentication status. Not same as login status.
 */
export enum AuthStatus {
  Checking = "checking",
  NotAuthenticated = "notAuthenticated",
  Authenticated = "authenticated",
}

/**
 * Login status
 */
export enum LoginStatus {
  Logined = "logined",
  NotLogined = "notLogined",
  Doing = "doing",
}
