import { test, expect } from "vitest";
import { createId } from "./base";

test("get id", () => {
  // Arrange

  // Act
  const id = createId<"foo">("constant");

  // Assert
  expect(id).toEqual(createId<"foo">("constant"));
});

test("equal id", () => {
  // Arrange

  // Act
  const id1 = createId<"foo">("constant1");
  const id2 = createId<"foo">("constant2");

  // Assert
  expect(id1).not.toBe(id2);
  expect(id1).toBe(createId<"foo">("constant1"));
});
