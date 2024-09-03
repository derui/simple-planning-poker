// A base event interface
export interface DomainEvent {
  kind: DOMAIN_EVENTS;
}

// define event kinds
export enum DOMAIN_EVENTS {
  GameCreated,
  NewRoundStarted,
  UserNameChanged,
  GamePlayerModeChanged,
  UserJoined,
  GameShowedDown,
  GamePlayerCardSelected,
  UserLeftFromGame,
  GamePlayerGiveUp,
  RoundFinished,
}
