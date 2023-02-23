import { Id } from "@/domains/game";

export interface GameRefResolver {
  name(id: Id): string;

  userHands(id: Id): string;

  cards(id: Id): string;

  showedDown(id: Id): string;
  users(id: Id): string;
}

export const createGameRefResolver = (): GameRefResolver => {
  return {
    name(id: Id) {
      return `/games/${id}/name`;
    },

    userHands(id: Id) {
      return `/games/${id}/userHands`;
    },

    cards(id: Id) {
      return `/games/${id}/cards`;
    },

    showedDown(id: Id) {
      return `/games/${id}/showedDown`;
    },

    users(id: Id) {
      return `/games/${id}/users`;
    },
  };
};
