import { Game } from "@spp/shared-domain";

export const name = function name(id: Game.Id) {
  return `/games/${id}/name`;
};

export const cards = function cards(id: Game.Id) {
  return `/games/${id}/points`;
};

export const owner = function owner(id: Game.Id) {
  return `/games/${id}/owner`;
};

export const voting = function voting(id: Game.Id) {
  return `/games/${id}/voting`;
};

export const joinedPlayers = function joinedPlayers(id: Game.Id) {
  return `/games/${id}/joinedPlayers`;
};
