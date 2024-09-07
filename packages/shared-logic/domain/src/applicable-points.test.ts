import { test, expect } from "vitest";
import { clone, contains, create, pick } from "./applicable-points.js";
import * as StoryPoint from "./story-point.js";

test("make points from numbers", () => {
  // Arrange
  const numbers = [1, 2, 3, 4].map(StoryPoint.create);

  // Act
  const ret = create(numbers);

  // Assert
  expect(ret).toHaveLength(4);
  expect(ret[0]).toEqual(StoryPoint.create(numbers[0]));
  expect(ret[1]).toEqual(StoryPoint.create(numbers[1]));
  expect(ret[2]).toEqual(StoryPoint.create(numbers[2]));
  expect(ret[3]).toEqual(StoryPoint.create(numbers[3]));
});

test("ignore duplicate storypoint", () => {
  // Arrange
  const numbers = [1, 2, 3, 4].map(StoryPoint.create);

  // Act
  const ret = create(numbers);

  // Assert
  expect(ret).toHaveLength(4);
  expect(ret[0]).toEqual(StoryPoint.create(numbers[0]));
  expect(ret[1]).toEqual(StoryPoint.create(numbers[1]));
  expect(ret[2]).toEqual(StoryPoint.create(numbers[2]));
  expect(ret[3]).toEqual(StoryPoint.create(numbers[3]));
});

test("should be able to check a card contains in cards", () => {
  // Arrange
  const numbers = [1, 2, 3, 4].map(StoryPoint.create);

  // Act
  const ret = create(numbers);

  // Assert
  expect(contains(ret, StoryPoint.create(5))).toBeFalsy();
});

test("should be able to pick a number if applicable", () => {
  // Arrange
  const numbers = [1, 2, 3, 4].map(StoryPoint.create);

  // Act
  const ret = create(numbers);

  // Assert
  expect(pick(ret, StoryPoint.create(4))).toEqual(numbers[3]);
});

test("clone the cards", () => {
  // Arrange
  const numbers = [1, 2, 3].map(StoryPoint.create);

  // Act
  const ret = create(numbers);
  const cloned = clone(ret);

  // Assert
  expect(cloned).not.toBe(ret);
  expect(cloned).toEqual(ret);
});
