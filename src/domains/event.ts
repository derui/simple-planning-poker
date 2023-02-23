import { create, Id } from "./base";
import * as Card from "./card";
import { Id } from "./game";
import * as GamePlayer from "./game-player";
import * as SelectableCards from "./selectable-cards";
import * as User from "./user";

export type EventId = Id<"Event">;

// A base event interface
export interface DomainEvent {
  id: EventId;
  kind: string;
}

type Eventize<Kind extends string> = DomainEvent & { kind: Kind };

// create event id
export const createEventId = (): EventId => create<"Event">();

// define event kinds

export const DOMAIN_EVENTS = {
  GameCreated: "GameCreated",
  NewGameStarted: "NewGameStarted",
  UserNameChanged: "UserNameChanged",
  GamePlayerModeChanged: "GameJoinedUserModeChanged",
  UserInvited: "UserInvited",
  GameShowedDown: "GameShowedDown",
  GamePlayerCardSelected: "GamePlayerCardSelected",
  UserLeavedFromGame: "UserLeavedFromGame",
  GamePlayerGiveUp: "GamePlayerGiveUp",
} as const;

export type DomainEvents = { [key in keyof typeof DOMAIN_EVENTS]: (typeof DOMAIN_EVENTS)[key] };

export type DefinedDomainEvents =
  | GameCreated
  | NewGameStarted
  | UserNameChanged
  | GamePlayerModeChanged
  | GameShowedDown
  | UserInvited
  | GamePlayerCardSelected
  | UserLeavedFromGame
  | GamePlayerGiveUp;

// define domain events

export interface GameCreated extends Eventize<DomainEvents["GameCreated"]> {
  gameId: Id;
  name: string;
  createdBy: {
    userId: User.Id;
    gamePlayerId: GamePlayer.Id;
  };
  selectableCards: SelectableCards.T;
}

export interface NewGameStarted extends Eventize<DomainEvents["NewGameStarted"]> {
  gameId: Id;
}

export interface GamePlayerModeChanged extends Eventize<DomainEvents["GamePlayerModeChanged"]> {
  gamePlayerId: GamePlayer.Id;
  mode: GamePlayer.UserMode;
}

export interface UserNameChanged extends Eventize<DomainEvents["UserNameChanged"]> {
  userId: User.Id;
  name: string;
}

export interface UserInvited extends Eventize<DomainEvents["UserInvited"]> {
  gameId: Id;
  userId: User.Id;
  gamePlayerId: GamePlayer.Id;
}

export interface GameShowedDown extends Eventize<DomainEvents["GameShowedDown"]> {
  gameId: Id;
}

export interface GamePlayerCardSelected extends Eventize<DomainEvents["GamePlayerCardSelected"]> {
  gamePlayerId: GamePlayer.Id;
  card: Card.T;
}

export interface GamePlayerGiveUp extends Eventize<DomainEvents["GamePlayerGiveUp"]> {
  gamePlayerId: GamePlayer.Id;
}

export interface UserLeavedFromGame extends Eventize<DomainEvents["UserLeavedFromGame"]> {
  userId: User.Id;
  gamePlayerId: GamePlayer.Id;
  gameId: Id;
}
