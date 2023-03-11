// A base event interface
export interface DomainEvent {
  kind: keyof DomainEvents;
}

// define event kinds

export const DOMAIN_EVENTS = {
  GameCreated: "GameCreated",
  NewRoundStarted: "NewRoundStarted",
  UserNameChanged: "UserNameChanged",
  GamePlayerModeChanged: "GameJoinedUserModeChanged",
  UserJoined: "UserJoined",
  GameShowedDown: "GameShowedDown",
  GamePlayerCardSelected: "GamePlayerCardSelected",
  UserLeavedFromGame: "UserLeavedFromGame",
  GamePlayerGiveUp: "GamePlayerGiveUp",
  RoundFinished: "RoundFinished",
} as const;

export type DomainEvents = { [key in keyof typeof DOMAIN_EVENTS]: (typeof DOMAIN_EVENTS)[key] };
