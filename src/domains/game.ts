import { isSuperset } from "@/utils/set";
import produce from "immer";
import * as Base from "./base";
import { DomainEvent } from "./event";
import * as EventFactory from "./event-factory";
import * as GamePlayer from "./game-player";
import * as Invitation from "./invitation";
import * as SelectableCards from "./selectable-cards";
import * as StoryPoint from "./story-point";
import { Branded } from "./type";
import * as Hand from "./user-hand";

export type GameId = Base.Id<"Game">;

export const createId = function createGameId(v?: string) {
  return Base.create<"Game">(v);
};

export interface PlayerHand {
  readonly playerId: GamePlayer.Id;
  readonly hand: Hand.T;
}

const tag = Symbol();
type CalculatedStoryPoint = Branded<number, typeof tag>;

// Game is value object
export interface Game {
  readonly id: GameId;
  readonly name: string;
  readonly showedDown: boolean;
  readonly players: GamePlayer.Id[];
  readonly cards: SelectableCards.T;
  readonly hands: PlayerHand[];
}

export const create = ({
  id,
  name,
  players,
  cards,
  hands = [],
}: {
  id: GameId;
  name: string;
  players: GamePlayer.Id[];
  cards: SelectableCards.T;
  hands?: PlayerHand[];
}): Game => {
  if (players.length === 0) {
    throw new Error("Least one player need in game");
  }

  const handedPlayers = new Set(hands.map((v) => v.playerId));
  const playerIds = new Set(players);
  if (!isSuperset(playerIds, handedPlayers)) {
    throw new Error("Found unknown player not in this game");
  }

  return {
    id,
    name,
    showedDown: false,
    cards,
    players: Array.from(players),
    hands: Array.from(hands),
  };
};

export const makeInvitation = function makeInvitation(game: Game) {
  return Invitation.create(game.id);
};

export const canShowDown = function canShowDown(game: Game) {
  return game.hands.length > 0;
};

export const showDown = function showDown(game: Game): [Game, DomainEvent?] {
  if (!canShowDown(game)) {
    return [game];
  }

  return [
    produce(game, (draft) => {
      draft.showedDown = true;
    }),
    EventFactory.gameShowedDown(game.id),
  ];
};

export const calculateAverage = function calculateAverage(game: Game) {
  if (!game.showedDown) {
    return undefined;
  }

  const cards = game.hands
    .map((v) => v.hand)
    .filter(Hand.isHanded)
    .map((v) => v.card);

  if (cards.length === 0) {
    return StoryPoint.create(0);
  }

  const average =
    cards.reduce((point, v) => {
      return point + v;
    }, 0) / cards.length;

  return average as CalculatedStoryPoint;
};
export const canChangeName = function canChangeName(name: string) {
  return name !== "";
};

export const changeName = function changeName(game: Game, name: string) {
  if (!canChangeName(name)) {
    throw new Error("can not change name");
  }

  return produce(game, (draft) => {
    draft.name = name;
  });
};

export const newGame = function newGame(game: Game): [Game, DomainEvent] {
  const newObj = produce(game, (draft) => {
    draft.showedDown = false;
  });

  return [newObj, EventFactory.newGameStarted(game.id)];
};
