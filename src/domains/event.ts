import { createId, Id } from "./base";
import { Card } from "./card";
import { GameId } from "./game";
import { GamePlayerId, UserMode } from "./game-player";
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
  GamePlayerModeChanged: "GameJoinedUserModeChanged",
  UserInvited: "UserInvited",
  GameShowedDown: "GameShowedDown",
  GamePlayerCardSelected: "GamePlayerCardSelected",
  UserLeavedFromGame: "UserLeavedFromGame",
} as const;

export type DomainEvents = { [key in keyof typeof DOMAIN_EVENTS]: typeof DOMAIN_EVENTS[key] };

export type DefinedDomainEvents =
  | GameCreated
  | NewGameStarted
  | UserNameChanged
  | GamePlayerModeChanged
  | GameShowedDown
  | UserInvited
  | GamePlayerCardSelected
  | UserLeavedFromGame;

// define domain events

export interface GameCreated extends Event<DomainEvents["GameCreated"]> {
  gameId: GameId;
  name: string;
  createdBy: {
    userId: UserId;
    gamePlayerId: GamePlayerId;
  };
  selectableCards: SelectableCards;
}

export interface NewGameStarted extends Event<DomainEvents["NewGameStarted"]> {
  gameId: GameId;
}

export interface GamePlayerModeChanged extends Event<DomainEvents["GamePlayerModeChanged"]> {
  gamePlayerId: GamePlayerId;
  mode: UserMode;
}

export interface UserNameChanged extends Event<DomainEvents["UserNameChanged"]> {
  userId: UserId;
  name: string;
}

export interface UserInvited extends Event<DomainEvents["UserInvited"]> {
  gameId: GameId;
  userId: UserId;
  gamePlayerId: GamePlayerId;
}

export interface GameShowedDown extends Event<DomainEvents["GameShowedDown"]> {
  gameId: GameId;
}

export interface GamePlayerCardSelected extends Event<DomainEvents["GamePlayerCardSelected"]> {
  gamePlayerId: GamePlayerId;
  card: Card;
}

export interface UserLeavedFromGame extends Event<DomainEvents["UserLeavedFromGame"]> {
  userId: UserId;
  gamePlayerId: GamePlayerId;
  gameId: GameId;
}

export const EventFactory = {
  newGameStarted(gameId: GameId): NewGameStarted {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.NewGameStarted,
      gameId,
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

  userInvited(gamePlayerId: GamePlayerId, gameId: GameId, userId: UserId): UserInvited {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.UserInvited,
      gameId,
      userId,
      gamePlayerId,
    };
  },

  gamdShowedDown(gameId: GameId): GameShowedDown {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.GameShowedDown,
      gameId,
    };
  },

  gamePlayerCardSelected(gamePlayerId: GamePlayerId, card: Card): GamePlayerCardSelected {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.GamePlayerCardSelected,
      gamePlayerId,
      card,
    };
  },

  gameCreated(
    gameId: GameId,
    name: string,
    userId: UserId,
    playerId: GamePlayerId,
    selectableCards: SelectableCards
  ): GameCreated {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.GameCreated,
      gameId,
      createdBy: {
        userId,
        gamePlayerId: playerId,
      },
      name,
      selectableCards,
    };
  },

  gamePlayerModeChanged(gamePlayerId: GamePlayerId, mode: UserMode): GamePlayerModeChanged {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.GamePlayerModeChanged,
      gamePlayerId,
      mode,
    };
  },

  userLeaveFromGame(userId: UserId, gamePlayerId: GamePlayerId, gameId: GameId): UserLeavedFromGame {
    return {
      id: createEventId(),
      kind: DOMAIN_EVENTS.UserLeavedFromGame,
      gamePlayerId,
      userId,
      gameId,
    };
  },
};
