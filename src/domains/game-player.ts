import produce from "immer";
import * as Base from "./base";
import { DomainEvent } from "./event";
import * as EventFactory from "./event-factory";
import * as Game from "./game";
import * as User from "./user";
import * as Card from "./card";
import * as UserHand from "./user-hand";
import * as SelectableCards from "./selectable-cards";
import { Branded } from "./type";

export type Id = Base.Id<"GamePlayer">;

export const createId = (value?: string): Id => {
  if (value) {
    return value as Id;
  } else {
    return Base.create<"GamePlayer">();
  }
};

export const UserMode = {
  normal: "normal",
  inspector: "inspector",
} as const;
export type UserMode = (typeof UserMode)[keyof typeof UserMode];

const Tag = Symbol("GamePlayer");
export type T = Branded<
  {
    readonly id: Id;
    readonly user: User.Id;
    readonly game: Game.Id;
    readonly mode: UserMode;
    readonly hand: UserHand.T;
  },
  typeof Tag
>;

/**
   create user from id and name
 */
export const create = ({
  id,
  gameId,
  userId,
  hand = UserHand.unselected(),
  mode = UserMode.normal,
}: {
  id: Id;
  userId: User.Id;
  gameId: Game.Id;
  hand?: UserHand.T;
  mode?: UserMode;
}): T => {
  return {
    id,
    user: userId,
    mode: mode,
    hand: hand,
    game: gameId,
  } as T;
};

export const changeUserMode = (player: T, newMode: UserMode): [T, DomainEvent] => {
  const newObj = produce(player, (draft) => {
    draft.mode = newMode;
  });

  return [newObj, EventFactory.gamePlayerModeChanged(player.id, newMode)];
};

export const giveUp = function giveUp(player: T): [T, DomainEvent?] {
  const newObj = produce(player, (draft) => {
    draft.hand = UserHand.giveUp();
  });

  return [newObj, EventFactory.gamePlayerGiveUp(player.id)];
};

export const takeHand = (player: T, card: Card.T, cards: SelectableCards.T): [T, DomainEvent?] => {
  if (!SelectableCards.contains(cards, card)) {
    throw new Error("can not take the card because this card is not selectable in this game");
  }

  const newObj = produce(player, (draft) => {
    draft.hand = UserHand.handed(card);
  });

  return [newObj, EventFactory.gamePlayerCardSelected(player.id, card)];
};
