import { test, expect } from "vitest";
import { filterUndefined } from "./basic";

test("filter undefined", () => {
  // arrange

  // do

  // verify
  expect(filterUndefined(undefined)).toBe(false);
  expect(filterUndefined("value")).toBe(true);
  expect(filterUndefined("")).toBe(true);
});
