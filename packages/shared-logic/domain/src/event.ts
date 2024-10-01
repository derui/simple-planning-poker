/**
 * base interface for DomainEvent
 */
export interface T {
  kind: DOMAIN_EVENTS;
}

/**
 * Kind of domain event.
 */
export enum DOMAIN_EVENTS {
  GameCreated,
  VotingStarted,
  UserNameChanged,
  VoterChanged,
  VoterJoined,
  VoterSelected,
  VoterGiveUpped,
  VotingRevealed,
}
