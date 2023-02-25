import { Id } from "@/domains/game";

export const name = function name(id: Id) {
  return `/games/${id}/name`;
};

export const cards = function cards(id: Id) {
  return `/games/${id}/cards`;
};

export const users = function users(id: Id) {
  return `/games/${id}/users`;
};

export const round = function round(id: Id) {
  return `/games/${id}/round`;
};

export const finishedRounds = function finishedRounds(id: Id) {
  return `/games/${id}/finishedRounds`;
};
