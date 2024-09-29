import { describe, expect, test } from "vitest";
import { isSuperset } from "./set";

describe("isSuperSet", () => {
  test("empty is super set of empty", () => {
    const set1 = new Set();
    const set2 = new Set();

    expect(isSuperset(set1, set2)).toBeTruthy();
  });

  test("empty is not super set of not empty set", () => {
    const set1 = new Set();
    const set2 = new Set([1]);

    expect(isSuperset(set1, set2)).toBeFalsy();
    expect(isSuperset(set2, set1)).toBeTruthy();
  });

  test("super set should contains all elements in other", () => {
    const set1 = new Set([1, 2, 3, 4]);
    const set2 = new Set([1, 3]);

    expect(isSuperset(set1, set2)).toBeTruthy();
    expect(isSuperset(set2, set1)).toBeFalsy();
  });
});
