import { test, expect } from "vitest";
import { create } from "./base.js";

test("get id", () => {
  // Arrange

  // Act
  const _sym = Symbol();
  const id = create<typeof _sym>("constant");

  // Assert
  expect(id).toEqual(create<typeof _sym>("constant"));
});

test("equal id", () => {
  // Arrange

  // Act
  const _sym = Symbol();
  const id1 = create<typeof _sym>("constant1");
  const id2 = create<typeof _sym>("constant2");

  // Assert
  expect(id1).not.toBe(id2);
  expect(id1).toBe(create<typeof _sym>("constant1"));
});
