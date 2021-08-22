// key definitions for atom
export const AtomKeys = {
  currentUserId: "currentUserId",
  signInState: "signInState",
  gameCreationState: "gameCreationState",
  currentGameState: "currentGameState",
} as const;

// key definitions for selector
export const SelectorKeys = {
  authenticated: "authenticated",
  authenticating: "authenticating",
  emailToSignIn: "emailToSignIn",
  defaultCards: "defaultCards",
} as const;
