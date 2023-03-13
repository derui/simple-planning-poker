import { Id } from "@/domains/round";

export const count = function count(id: Id) {
  return `/rounds/${id}/count`;
};

export const userHands = function userHands(id: Id) {
  return `/rounds/${id}/userHands`;
};

export const cards = function cards(id: Id) {
  return `/rounds/${id}/cards`;
};

export const finished = function finished(id: Id) {
  return `/rounds/${id}/finished`;
};

export const finishedAt = function finishedAt(id: Id) {
  return `/rounds/${id}/finishedAt`;
};

export const joinedPlayers = function joinedPlayers(id: Id) {
  return `/rounds/${id}/joinedPlayers`;
};
