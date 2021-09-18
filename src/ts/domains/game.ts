import { createId, Id } from "./base";
import { Card } from "./card";
import { EventFactory, GameShowedDown, NewGameStarted } from "./event";
import { GamePlayerId } from "./game-player";
import { SelectableCards } from "./selectable-cards";
import { createStoryPoint, StoryPoint } from "./story-point";

export type GameId = Id<"Game">;

export const createGameId = () => createId<"Game">();

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

  return {
    _name: name,
    _showedDown: false,
    _cards: cards,

    get id() {
      return id;
    },

    get name() {
      return this._name;
    },

    get showedDown() {
      return this._showedDown;
    },

    get players() {
      return players;
    },

    get cards() {
      return this._cards;
    },

    canShowDown(): boolean {
      return hands.length > 0;
    },

    showDown(): GameShowedDown | undefined {
      if (this.canShowDown()) {
        this._showedDown = true;
        return EventFactory.gamdShowedDown(this.id);
      }

      return undefined;
    },

    calculateAverage(): StoryPoint | undefined {
      if (!this.showedDown) {
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
      if (!this.canChangeName(name)) {
        throw new Error("can not change name");
      }
      this._name = name;
    },

    canChangeName(name: string) {
      return name !== "";
    },

    newGame() {
      this._showedDown = false;

      return EventFactory.newGameStarted(this.id);
    },
  } as InternalGame;
};
