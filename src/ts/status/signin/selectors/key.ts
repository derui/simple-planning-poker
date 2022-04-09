const prefix = "signin";

const SelectorKeys = {
  authenticated: `${prefix}:authenticated`,
  authenticating: `${prefix}:authenticating`,
} as const;

export default SelectorKeys;
