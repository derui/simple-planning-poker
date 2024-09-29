import { expect, test } from "vitest";
import { cards, count, finished, finishedAt, joinedPlayers, theme, userEstimations } from "./round-ref-resolver";
import { createId } from "@/domains/round";

test("get count", () => {
  const ret = count(createId("id"));

  expect(ret).toBe("/rounds/id/count");
});

test("get finished", () => {
  const ret = finished(createId("id"));

  expect(ret).toBe("/rounds/id/finished");
});

test("get user estimations", () => {
  const ret = userEstimations(createId("id"));

  expect(ret).toBe("/rounds/id/userEstimations");
});

test("get cards", () => {
  const ret = cards(createId("id"));

  expect(ret).toBe("/rounds/id/cards");
});

test("finished at", () => {
  const ret = finishedAt(createId("id"));

  expect(ret).toBe("/rounds/id/finishedAt");
});

test("joined player", () => {
  const ret = joinedPlayers(createId("id"));

  expect(ret).toBe("/rounds/id/joinedPlayers");
});

test("theme", () => {
  const ret = theme(createId("id"));

  expect(ret).toBe("/rounds/id/theme");
});
