export const setAuth = function setAuth(auth): void {
  _auth = auth;
};

export const getAuth = function getAuth(): Auth | undefined {
  return _auth;
};
