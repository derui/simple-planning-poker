import { expect, test } from "vitest";
import { points, count, revealed, joinedPlayers, theme, userEstimations } from "./voting-ref-resolver.js";
import { Voting } from "@spp/shared-domain";

test("get count", () => {
  const ret = count(Voting.createId("id"));

  expect(ret).toBe("/voting/id/count");
});

test("get finished", () => {
  const ret = revealed(Voting.createId("id"));

  expect(ret).toBe("/voting/id/revealed");
});

test("get user estimations", () => {
  const ret = userEstimations(Voting.createId("id"));

  expect(ret).toBe("/voting/id/userEstimations");
});

test("get cards", () => {
  const ret = points(Voting.createId("id"));

  expect(ret).toBe("/voting/id/points");
});

test("joined player", () => {
  const ret = joinedPlayers(Voting.createId("id"));

  expect(ret).toBe("/voting/id/joinedPlayers");
});

test("theme", () => {
  const ret = theme(Voting.createId("id"));

  expect(ret).toBe("/voting/id/theme");
});
