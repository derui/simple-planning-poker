import { createId, Id } from "./base";
import { Card } from "./card";
import { GameId } from "./game";
import { SelectableCards } from "./selectable-cards";
import { UserId } from "./user";

export type EventId = Id<"Event">;

// A base event interface
export interface Event<Kind extends string> {
  id: EventId;
  kind: Kind;
}

// create event id
export const createEventId = (): EventId => createId<"Event">();

// define event kinds

export const DOMAIN_EVENTS = {
  GameCreated: "GameCreated",
  NewGameStarted: "NewGameStarted",
  UserNameChanged: "UserNameChanged",
  UserJoined: "UserJoined",
  GameShowedDown: "GameShowedDown",
  UserCardSelected: "UserCardSelected",
} as const;

export type DomainEvents = { [key in keyof typeof DOMAIN_EVENTS]: typeof DOMAIN_EVENTS[key] };

export type DefinedDomainEvents =
  | GameCreated
  | NewGameStarted
  | UserNameChanged
  | GameShowedDown
  | UserCardSelected
  | UserJoined;

// define domain events

export interface GameCreated extends Event<DomainEvents["GameCreated"]> {
  gameId: GameId;
  name: string;
  createdBy: UserId;
  selectableCards: SelectableCards;
}

export interface NewGameStarted extends Event<DomainEvents["NewGameStarted"]> {}
export interface UserNameChanged extends Event<DomainEvents["UserNameChanged"]> {
  userId: UserId;
  name: string;
}

export interface UserJoined extends Event<DomainEvents["UserJoined"]> {
  gameId: GameId;
  userId: UserId;
  name: string;
}

export interface GameShowedDown extends Event<DomainEvents["GameShowedDown"]> {
  gameId: GameId;
}

export interface UserCardSelected extends Event<DomainEvents["UserCardSelected"]> {
  gameId: GameId;
  userId: UserId;
  card: Card;
}

export const EventFactory = {
  newGameStarted(): NewGameStarted {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.NewGameStarted,
    };
  },

  userNameChanged(userId: UserId, name: string): UserNameChanged {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.UserNameChanged,
      userId,
      name,
    };
  },

  userJoined(gameId: GameId, userId: UserId, name: string): UserJoined {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.UserJoined,
      gameId,
      userId,
      name,
    };
  },

  gamdShowedDown(gameId: GameId): GameShowedDown {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.GameShowedDown,
      gameId,
    };
  },

  userCardSelected(gameId: GameId, userId: UserId, card: Card): UserCardSelected {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.UserCardSelected,
      gameId,
      userId,
      card,
    };
  },

  gameCreated(gameId: GameId, name: string, userId: UserId, selectableCards: SelectableCards): GameCreated {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.GameCreated,
      gameId,
      createdBy: userId,
      name,
      selectableCards,
    };
  },
};
