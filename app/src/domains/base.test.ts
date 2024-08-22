import { test, expect } from "vitest";
import { create } from "./base";

test("get id", () => {
  // Arrange

  // Act
  const id = create<"foo">("constant");

  // Assert
  expect(id).toEqual(create<"foo">("constant"));
});

test("equal id", () => {
  // Arrange

  // Act
  const id1 = create<"foo">("constant1");
  const id2 = create<"foo">("constant2");

  // Assert
  expect(id1).not.toBe(id2);
  expect(id1).toBe(create<"foo">("constant1"));
});
