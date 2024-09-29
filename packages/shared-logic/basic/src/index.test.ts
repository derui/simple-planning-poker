import { test, expect } from "vitest";
import { filterUndefined } from "./index.js";

test("filter undefined", () => {
  // arrange

  // do

  // verify
  expect(filterUndefined(undefined)).toBe(false);
  expect(filterUndefined("value")).toBe(true);
  expect(filterUndefined("")).toBe(true);
});
