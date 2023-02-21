import { create, Id } from "./base";
import { Card } from "./card";
import { EventFactory, GamePlayerCardSelected, GamePlayerModeChanged } from "./event";
import { GameId } from "./game";
import { SelectableCards } from "./selectable-cards";
import { UserId } from "./user";

export type GamePlayerId = Id<"GamePlayer">;

export const createGamePlayerId = (value?: string): GamePlayerId => {
  if (value) {
    return value as GamePlayerId;
  } else {
    return create<"GamePlayer">();
  }
};

export const UserMode = {
  normal: "normal",
  inspector: "inspector",
} as const;
export type UserMode = (typeof UserMode)[keyof typeof UserMode];

export interface GamePlayer {
  get id(): GamePlayerId;
  get user(): UserId;
  get game(): GameId;
  get mode(): UserMode;
  get hand(): Card | undefined;

  changeUserMode(newMode: UserMode): GamePlayerModeChanged;
  takeHand(card: Card): GamePlayerCardSelected | undefined;
}

/**
   create user from id and name
 */
export const createGamePlayer = ({
  id,
  gameId,
  userId,
  cards,
  hand,
  mode = UserMode.normal,
}: {
  id: GamePlayerId;
  userId: UserId;
  gameId: GameId;
  hand?: Card;
  cards: SelectableCards;
  mode?: UserMode;
}): GamePlayer => {
  const obj = {
    userMode: mode,
    userHand: hand,

    get id() {
      return id;
    },

    get user() {
      return userId;
    },

    get mode() {
      return obj.userMode;
    },

    get hand() {
      return obj.userHand;
    },

    get game() {
      return gameId;
    },

    changeUserMode(newMode: UserMode) {
      obj.userMode = newMode;

      return EventFactory.gamePlayerModeChanged(obj.id, newMode);
    },

    takeHand(card: Card) {
      if (!cards.contains(card)) {
        return undefined;
      }

      obj.userHand = card;

      return EventFactory.gamePlayerCardSelected(obj.id, card);
    },
  } as GamePlayer & { userMode: UserMode; userHand: Card | undefined };

  return obj;
};
