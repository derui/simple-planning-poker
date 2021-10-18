import { GameId } from "~/src/ts/domains/game";

export interface GameRefResolver {
  name(id: GameId): string;

  userHands(id: GameId): string;

  cards(id: GameId): string;

  showedDown(id: GameId): string;
  users(id: GameId): string;
}

export const createGameRefResolver = (): GameRefResolver => {
  return {
    name(id: GameId) {
      return `/games/${id}/name`;
    },

    userHands(id: GameId) {
      return `/games/${id}/userHands`;
    },

    cards(id: GameId) {
      return `/games/${id}/cards`;
    },

    showedDown(id: GameId) {
      return `/games/${id}/showedDown`;
    },

    users(id: GameId) {
      return `/games/${id}/users`;
    },
  };
};
