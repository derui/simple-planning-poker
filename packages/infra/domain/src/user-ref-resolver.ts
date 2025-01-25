import { User } from "@spp/shared-domain";

export const name = function name(id: User.Id) {
  return `/users/${id}/name`;
};

export const ownerGames = function ownerGames(id: User.Id) {
  return `/users/${id}/ownerGames`;
};
