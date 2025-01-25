import { expect, test } from "vitest";
import { StoryPoint } from "./index.js";
import { create, parse, value } from "./story-point.js";

test("create story point with positive number", () => {
  // Arrange

  // Act
  const ret = create(1);

  // Assert
  expect(ret).toEqual(1);
});

test("throw error if point is less than 0", () => {
  // Arrange

  // Act

  // Assert
  expect(() => create(0)).not.toThrowError();
  expect(() => create(-2)).toThrowError();
  expect(() => create(-1)).toThrowError();
});

test("throw error if point is NaN", () => {
  // Arrange

  // Act

  // Assert
  expect(() => create(NaN)).toThrowError();
});

test("get value", () => {
  const point = create(10);

  expect(value(point)).toBe(10);
});

test.each(["1", "0", "10", "100"])("parse number from string: %d", (v) => {
  expect(parse(v)).toBe(StoryPoint.create(parseInt(v, 10)));
});

test.each(["", " ", "-1", "-10", "-100"])("should get with invalid string: %d", (v) => {
  expect(parse(v)).toBeUndefined();
});
