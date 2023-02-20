import { test, expect } from "vitest";
import { createStoryPoint } from "./story-point";

test("create story point with positive number", () => {
  // Arrange

  // Act
  const ret = createStoryPoint(1);

  // Assert
  expect(ret.value).toEqual(1);
});

test("throw error if point is less than 0", () => {
  // Arrange

  // Act

  // Assert
  expect(() => createStoryPoint(0)).not.toThrowError();
  expect(() => createStoryPoint(-2)).toThrowError();
  expect(() => createStoryPoint(-1)).toThrowError();
});

test("throw error if point is NaN", () => {
  // Arrange

  // Act

  // Assert
  expect(() => createStoryPoint(NaN)).toThrowError();
});
