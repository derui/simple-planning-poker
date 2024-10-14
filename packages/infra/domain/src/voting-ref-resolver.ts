import { User, Voting } from "@spp/shared-domain";

export const count = function count(id: Voting.Id) {
  return `/voting/${id}/count`;
};

/**
 * Estimation of voters
 */
export const estimations = function estimations(id: Voting.Id) {
  return `/voting/${id}/estimations`;
};

export const points = function points(id: Voting.Id) {
  return `/voting/${id}/points`;
};

export const revealed = function revealed(id: Voting.Id) {
  return `/voting/${id}/revealed`;
};

export const voters = function voters(id: Voting.Id) {
  return `/voting/${id}/voters`;
};

export const voter = function voter(id: Voting.Id, user: User.Id) {
  return `/voting/${id}/voters/${user}`;
};

export const theme = function theme(id: Voting.Id) {
  return `/voting/${id}/theme`;
};
