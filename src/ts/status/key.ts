// key definitions for atom
export const AtomKeys = {
  currentUserId: "currentUserId",
  signInState: "signInState",
  gameCreationState: "gameCreationState",
  currentGameState: "currentGameState",
  currentGameIdState: "currentGameIdState",
  inGameCurrentUser: "inGameCurrentUser",
  user: "user",
} as const;

// key definitions for selector
export const SelectorKeys = {
  authenticated: "authenticated",
  authenticating: "authenticating",
  emailToSignIn: "emailToSignIn",
  defaultCards: "defaultCards",
  inGameCurrentSelectableCards: "inGameCurrentSelectableCards",
  inGameCurrentUserSelectedCard: "inGameCurrentUserSelectedCard",
  inGameCurrentGameName: "inGameCurrentGameName",
  inGameCurrentUserJoined: "inGameCurrentUserJoined",
  inGameCurrentGame: "inGameCurrentGame",
  inGameUpperLineUserHands: "inGameUpperLineUserHands",
  inGameLowerLineUserHands: "inGameLownerLineUserHands",
  inGameCurrentGameStatus: "inGameCurrentGameStatus",
  inGameShowDownResult: "inGameShowDownResult",
} as const;
