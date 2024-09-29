import { expect, test } from "vitest";
import { gameIndexPage, loginPage, signInPage, signUpPage, votingPage } from "./url-definition.js";
import { Game } from "@spp/shared-domain";

test("game index path", () => {
  expect(gameIndexPage()).toEqual("/game");
});

test("voting page path", () => {
  expect(votingPage(Game.createId("123"))).toEqual("/game/123/voting");
});

test("login page", () => {
  expect(loginPage()).toEqual("/login");
});

test("sign in page", () => {
  expect(signInPage()).toEqual("/signin");
});

test("sign up page", () => {
  expect(signUpPage()).toEqual("/signup");
});
