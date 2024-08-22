import * as User from "@/domains/user";

export const name = function name(id: User.Id) {
  return `/users/${id}/name`;
};

export const joinedGames = function joinedGames(id: User.Id) {
  return `/users/${id}/joinedGames`;
};
