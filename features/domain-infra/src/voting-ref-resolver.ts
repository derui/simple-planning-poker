import { Voting } from "@spp/shared-domain";

export const count = function count(id: Voting.Id) {
  return `/voting/${id}/count`;
};

export const userEstimations = function userEstimations(id: Voting.Id) {
  return `/voting/${id}/userEstimations`;
};

export const points = function points(id: Voting.Id) {
  return `/voting/${id}/points`;
};

export const revealed = function revealed(id: Voting.Id) {
  return `/voting/${id}/revealed`;
};

export const joinedPlayers = function joinedPlayers(id: Voting.Id) {
  return `/voting/${id}/joinedPlayers`;
};

export const theme = function theme(id: Voting.Id) {
  return `/voting/${id}/theme`;
};
