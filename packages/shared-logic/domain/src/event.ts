/**
 * base interface for DomainEvent
 */
export interface DomainEvent {
  kind: DOMAIN_EVENTS;
}

/**
 * Kind of domain event.
 */
export enum DOMAIN_EVENTS {
  GameCreated,
  VotingStarted,
  UserNameChanged,
  GamePlayerModeChanged,
  UserJoined,
  GameShowedDown,
  GamePlayerCardSelected,
  UserLeftFromGame,
  GamePlayerGiveUp,
  VotingRevealed,
}
