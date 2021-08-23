// key definitions for atom
export const AtomKeys = {
  currentUserId: "currentUserId",
  signInState: "signInState",
  gameCreationState: "gameCreationState",
  currentGameState: "currentGameState",
  currentGameIdState: "currentGameIdState",
  inGameCurrentUser: "inGameCurrentUser",
} as const;

// key definitions for selector
export const SelectorKeys = {
  authenticated: "authenticated",
  authenticating: "authenticating",
  emailToSignIn: "emailToSignIn",
  defaultCards: "defaultCards",
  inGameCurrentSelectableCards: "inGameCurrentSelectableCards",
  inGameCurrentUserSelectedCard: "inGameCurrentUserSelectedCard",
  inGameCurrentGame: "inGameCurrentGame",
} as const;
