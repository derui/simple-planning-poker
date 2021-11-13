// key definitions for atom
export const AtomKeys = {
  currentUserId: "currentUserId",
  signInState: "signInState",
  gameCreationState: "gameCreationState",
  currentGameState: "currentGameState",
  currentGamePlayerState: "currentGamePlayerState",
  inGameCurrentUser: "inGameCurrentUser",
  user: "user",
} as const;

// key definitions for selector
export const SelectorKeys = {
  userJoinedGames: "userJoinedGames",
  authenticated: "authenticated",
  authenticating: "authenticating",
  emailToSignIn: "emailToSignIn",
  passwordToSignIn: "passwordToSignIn",
  defaultCards: "defaultCards",
  inGameCurrentSelectableCards: "inGameCurrentSelectableCards",
  inGameCurrentUserSelectedCard: "inGameCurrentUserSelectedCard",
  inGameCurrentUserMode: "inGameCurrentUserMode",
  inGameCurrentGamePlayer: "inGameCurrentGamePlayer",
  inGameCurrentGameName: "inGameCurrentGameName",
  inGameCurrentUserJoined: "inGameCurrentUserJoined",
  inGameCurrentGame: "inGameCurrentGame",
  inGameUpperLineUserHands: "inGameUpperLineUserHands",
  inGameLowerLineUserHands: "inGameLownerLineUserHands",
  inGameCurrentGameStatus: "inGameCurrentGameStatus",
  inGameShowDownResult: "inGameShowDownResult",
  inGameCurrentInvitationSignature: "inGameCurrentInvitationSignature",
} as const;
