import { expect, test } from "vitest";
import { points, count, revealed, voters, theme, estimations, voter } from "./voting-ref-resolver.js";
import { User, Voting } from "@spp/shared-domain";

test("get count", () => {
  const ret = count(Voting.createId("id"));

  expect(ret).toBe("/voting/id/count");
});

test("get finished", () => {
  const ret = revealed(Voting.createId("id"));

  expect(ret).toBe("/voting/id/revealed");
});

test("get user estimations", () => {
  const ret = estimations(Voting.createId("id"));

  expect(ret).toBe("/voting/id/estimations");
});

test("get cards", () => {
  const ret = points(Voting.createId("id"));

  expect(ret).toBe("/voting/id/points");
});

test("joined voters", () => {
  const ret = voters(Voting.createId("id"));

  expect(ret).toBe("/voting/id/voters");
});

test("theme", () => {
  const ret = theme(Voting.createId("id"));

  expect(ret).toBe("/voting/id/theme");
});

test("voter", () => {
  const ret = voter(Voting.createId("id"), User.createId("user"));

  expect(ret).toBe("/voting/id/voters/user");
});
