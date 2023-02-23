import {
  createEventId,
  DOMAIN_EVENTS,
  GameCreated,
  GamePlayerCardSelected,
  GamePlayerGiveUp,
  GamePlayerModeChanged,
  GameShowedDown,
  NewGameStarted,
  UserInvited,
  UserLeavedFromGame,
  UserNameChanged,
} from "./event";
import { Id } from "./game";
import * as User from "./user";
import * as GamePlayer from "./game-player";
import * as Card from "./card";
import * as SelectableCards from "./selectable-cards";

export const newGameStarted = function newGameStarted(gameId: Id): NewGameStarted {
  return {
    id: createEventId(),
    kind: DOMAIN_EVENTS.NewGameStarted,
    gameId,
  };
};

export const userNameChanged = function userNameChanged(userId: User.Id, name: string): UserNameChanged {
  return {
    id: createEventId(),
    kind: DOMAIN_EVENTS.UserNameChanged,
    userId,
    name,
  };
};

export const userInvited = function userInvited(gamePlayerId: GamePlayer.Id, gameId: Id, userId: User.Id): UserInvited {
  return {
    id: createEventId(),
    kind: DOMAIN_EVENTS.UserInvited,
    gameId,
    userId,
    gamePlayerId,
  };
};

export const gameShowedDown = function gameShowedDown(gameId: Id): GameShowedDown {
  return {
    id: createEventId(),
    kind: DOMAIN_EVENTS.GameShowedDown,
    gameId,
  };
};

export const gamePlayerCardSelected = function gamePlayerCardSelected(
  gamePlayerId: GamePlayer.Id,
  card: Card.T
): GamePlayerCardSelected {
  return {
    id: createEventId(),
    kind: DOMAIN_EVENTS.GamePlayerCardSelected,
    gamePlayerId,
    card,
  };
};

export const gamePlayerGiveUp = function gamePlayerGiveUp(gamePlayerId: GamePlayer.Id): GamePlayerGiveUp {
  return {
    id: createEventId(),
    kind: DOMAIN_EVENTS.GamePlayerGiveUp,
    gamePlayerId,
  };
};

export const gameCreated = function gameCreated(
  gameId: Id,
  name: string,
  userId: User.Id,
  playerId: GamePlayer.Id,
  selectableCards: SelectableCards.T
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
};

export const gamePlayerModeChanged = function gamePlayerModeChanged(
  gamePlayerId: GamePlayer.Id,
  mode: GamePlayer.UserMode
): GamePlayerModeChanged {
  return {
    id: createEventId(),
    kind: DOMAIN_EVENTS.GamePlayerModeChanged,
    gamePlayerId,
    mode,
  };
};

export const userLeaveFromGame = function userLeaveFromGame(
  userId: User.Id,
  gamePlayerId: GamePlayer.Id,
  gameId: Id
): UserLeavedFromGame {
  return {
    id: createEventId(),
    kind: DOMAIN_EVENTS.UserLeavedFromGame,
    gamePlayerId,
    userId,
    gameId,
  };
};
