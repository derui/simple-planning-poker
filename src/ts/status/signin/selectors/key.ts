const prefix = "signin";

const SelectorKeys = {
  authenticated: `${prefix}:authenticated`,
  emailToSignIn: `${prefix}:emailToSignIn`,
  passwordToSignIn: `${prefix}:passwordToSignIn`,
  authenticating: `${prefix}:authenticating`,
} as const;

export default SelectorKeys;
