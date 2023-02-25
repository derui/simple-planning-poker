import { cards, count, finished, finishedAt, userHands } from "./round-ref-resolver";
import { expect, test } from "vitest";
import { createId } from "@/domains/round";

test("get count", () => {
  const ret = count(createId("id"));

  expect(ret).toBe("/rounds/id/count");
});

test("get finished", () => {
  const ret = finished(createId("id"));

  expect(ret).toBe("/rounds/id/finished");
});

test("get user hands", () => {
  const ret = userHands(createId("id"));

  expect(ret).toBe("/rounds/id/userHands");
});

test("get cards", () => {
  const ret = cards(createId("id"));

  expect(ret).toBe("/rounds/id/cards");
});

test("finished at", () => {
  const ret = finishedAt(createId("id"));

  expect(ret).toBe("/rounds/id/finishedAt");
});