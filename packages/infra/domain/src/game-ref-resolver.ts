import { Game } from "@spp/shared-domain";

export const game = function game(id: Game.Id): string {
  return `/games/${id}`;
};

export const name = function name(id: Game.Id): string {
  return `/games/${id}/name`;
};

export const cards = function cards(id: Game.Id): string {
  return `/games/${id}/points`;
};

export const owner = function owner(id: Game.Id): string {
  return `/games/${id}/owner`;
};
