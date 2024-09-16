import { User } from "@spp/shared-domain";

export const name = function name(id: User.Id) {
  return `/users/${id}/name`;
};

export const joinedGames = function joinedGames(id: User.Id) {
  return `/users/${id}/joinedGames`;
};
