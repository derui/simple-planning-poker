import { Id } from "@/domains/game";

export const name = function name(id: Id) {
  return `/games/${id}/name`;
};

export const cards = function cards(id: Id) {
  return `/games/${id}/cards`;
};

export const owner = function owner(id: Id) {
  return `/games/${id}/owner`;
};

export const round = function round(id: Id) {
  return `/games/${id}/round`;
};

export const finishedRounds = function finishedRounds(id: Id) {
  return `/games/${id}/finishedRounds`;
};

export const joinedPlayers = function joinedPlayers(id: Id) {
  return `/games/${id}/joinedPlayers`;
};
