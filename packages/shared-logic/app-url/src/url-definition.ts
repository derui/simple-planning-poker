import { Game } from "@spp/shared-domain";

/**
 * Get index of game
 */
export const gameIndexPage = function gameIndexPage(): string {
  return "/game";
};

/**
 * Get path to voting of the game
 */
export const votingPage = function votingPage(id: Game.Id): string {
  return `/voting/${id}`;
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
