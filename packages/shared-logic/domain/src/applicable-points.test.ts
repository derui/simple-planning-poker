import { expect, test } from "vitest";
import { clone, contains, create, pick } from "./applicable-points.js";
import { ApplicablePoints } from "./index.js";
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

test.each([
  ["1,2,3", ApplicablePoints.create([StoryPoint.create(1), StoryPoint.create(2), StoryPoint.create(3)])],
  [
    "1, 2, 3  ,4   ",
    ApplicablePoints.create([StoryPoint.create(1), StoryPoint.create(2), StoryPoint.create(3), StoryPoint.create(4)]),
  ],
])("parse from string: %s", (input, expected) => {
  // Arrange

  // Act
  const ret = ApplicablePoints.parse(input);

  // Assert
  expect(ret).toEqual(expected);
});

test.each(["1,2,", "1,,3", "-1,4,5", "?,3,5"])("should throw error if input is not valid: %s", (input) => {
  // Arrange

  // Act

  // Assert
  expect(ApplicablePoints.parse(input)).toBeUndefined();
});
