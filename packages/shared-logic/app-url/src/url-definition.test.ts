import { Voting } from "@spp/shared-domain";
import { expect, test } from "vitest";
import { gameIndexPage, loginPage, signInPage, signUpPage, votingPage } from "./url-definition.js";

test("game index path", () => {
  expect(gameIndexPage()).toEqual("/game");
});

test("voting page path", () => {
  expect(votingPage(Voting.createId("123"))).toEqual("/voting/123");
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
