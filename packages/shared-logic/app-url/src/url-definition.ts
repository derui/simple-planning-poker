import { Game } from "@spp/shared-domain";

/**
 * Get index of game
 */
export const gameIndexPage = function gameIndexPage() {
  return "/game";
};

/**
 * Get path to voting of the game
 */
export const votingPage = function votingPage(id: Game.Id) {
  return `/game/${id}/voting`;
};

/**
 * login page
 */
export const loginPage = function loginPage() {
  return "/login";
};

/**
 * sign in page
 */
export const signInPage = function signInPage() {
  return "/signin";
};

/**
 * sign up page
 */
export const signUpPage = function signUpPage() {
  return "/signup";
};
