import { create, Id } from "./base";
import { Card } from "./card";
import { EventFactory, GameShowedDown, NewGameStarted } from "./event";
import { GamePlayerId } from "./game-player";
import { createInvitation, Invitation } from "./invitation";
import { SelectableCards } from "./selectable-cards";
import { createStoryPoint, StoryPoint } from "./story-point";

export type GameId = Id<"Game">;

export const createGameId = (v?: string) => create<"Game">(v);

export interface PlayerHand {
  playerId: GamePlayerId;
  card: Card;
}

// Game is value object
export interface Game {
  get id(): GameId;
  get name(): string;
  get showedDown(): boolean;
  get players(): GamePlayerId[];
  get cards(): SelectableCards;

  makeInvitation(): Invitation;

  changeName(name: string): void;

  canChangeName(name: string): boolean;

  canShowDown(): boolean;

  // show down all cards betted by user
  showDown(): GameShowedDown | undefined;

  // calulate average story point in this game.
  calculateAverage(): StoryPoint | undefined;

  // start new game
  newGame(): NewGameStarted;
}

type InternalGame = Game & {
  _showedDown: boolean;
  _name: string;
  _cards: SelectableCards;
};

const isSuperset = function <T>(baseSet: Set<T>, subset: Set<T>) {
  for (let elem of subset) {
    if (!baseSet.has(elem)) {
      return false;
    }
  }
  return true;
};

export const createGame = ({
  id,
  name,
  players,
  cards,
  hands = [],
}: {
  id: GameId;
  name: string;
  players: GamePlayerId[];
  cards: SelectableCards;
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

  const obj = {
    _name: name,
    _showedDown: false,
    _cards: cards,

    get id() {
      return id;
    },

    get name() {
      return obj._name;
    },

    get showedDown() {
      return obj._showedDown;
    },

    get players() {
      return players;
    },

    get cards() {
      return obj._cards;
    },

    makeInvitation() {
      return createInvitation(obj.id);
    },

    canShowDown(): boolean {
      return hands.length > 0;
    },

    showDown(): GameShowedDown | undefined {
      if (obj.canShowDown()) {
        obj._showedDown = true;
        return EventFactory.gamdShowedDown(obj.id);
      }

      return undefined;
    },

    calculateAverage(): StoryPoint | undefined {
      if (!obj.showedDown) {
        return undefined;
      }

      const cards = hands.map((v) => v.card).filter((v) => v && v.kind === "storypoint");
      if (cards.length === 0) {
        return createStoryPoint(0);
      }

      const average =
        cards.reduce((point, v) => {
          switch (v.kind) {
            case "storypoint":
              return point + v.storyPoint.value;
            case "giveup":
              return point;
          }
        }, 0) / cards.length;

      return createStoryPoint(average);
    },

    changeName(name: string) {
      if (!obj.canChangeName(name)) {
        throw new Error("can not change name");
      }
      obj._name = name;
    },

    canChangeName(name: string) {
      return name !== "";
    },

    newGame() {
      obj._showedDown = false;

      return EventFactory.newGameStarted(obj.id);
    },
  } as InternalGame;

  return obj;
};
