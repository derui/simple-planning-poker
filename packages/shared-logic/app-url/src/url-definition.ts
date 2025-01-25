import { Voting } from "@spp/shared-domain";

/**
 * Get index of game
 */
export const gameIndexPage = function gameIndexPage(): string {
  return "/game";
};

/**
 * Get path to page of the voting
 */
export const votingPage = function votingPage(id: Voting.Id): string {
  return `/voting/${id}`;
};

/**
 * Get path to revealed page of the voting
 */
export const revealedPage = function revealedPage(id: Voting.Id): string {
  return `/voting/${id}/revealed`;
};

/**
 * login page
 */
export const loginPage = function loginPage(): string {
  return "/login";
};

/**
 * sign in page
 */
export const signInPage = function signInPage(): string {
  return "/signin";
};

/**
 * sign up page
 */
export const signUpPage = function signUpPage(): string {
  return "/signup";
};

/**
 * game creation page
 */
export const gameCreatePage = function gameCreatePage(): string {
  return "/game/create";
};
