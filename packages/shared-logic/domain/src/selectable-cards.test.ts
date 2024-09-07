import { test, expect } from "vitest";
import * as Card from "./card.js";
import { clone, contains, create } from "./selectable-cards.js";
import * as StoryPoint from "./story-point.js";

test("make cards from numbers", () => {
  // Arrange
  const numbers = [1, 2, 3, 4].map(StoryPoint.create);

  // Act
  const ret = create(numbers);

  // Assert
  expect(ret).toHaveLength(4);
  expect(ret[0]).toEqual(Card.create(numbers[0]));
  expect(ret[1]).toEqual(Card.create(numbers[1]));
  expect(ret[2]).toEqual(Card.create(numbers[2]));
  expect(ret[3]).toEqual(Card.create(numbers[3]));
});

test("ignore duplicate storypoint", () => {
  // Arrange
  const numbers = [1, 2, 3, 4].map(StoryPoint.create);

  // Act
  const ret = create(numbers);

  // Assert
  expect(ret).toHaveLength(4);
  expect(ret[0]).toEqual(Card.create(numbers[0]));
  expect(ret[1]).toEqual(Card.create(numbers[1]));
  expect(ret[2]).toEqual(Card.create(numbers[2]));
  expect(ret[3]).toEqual(Card.create(numbers[3]));
});

test("should be able to check a card contains in cards", () => {
  // Arrange
  const numbers = [1, 2, 3, 4].map(StoryPoint.create);

  // Act
  const ret = create(numbers);

  // Assert
  expect(contains(ret, Card.create(StoryPoint.create(5)))).toBeFalsy();
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

test("selected cards can not modifieable", () => {
  // Arrange
  const numbers = [1, 2, 3].map(StoryPoint.create);

  // Act
  const ret = create(numbers);

  // Assert
  expect(() => {
    ret[0] = Card.create(StoryPoint.create(25));
  }).toThrowError();

  expect(() => {
    ret.push(Card.create(StoryPoint.create(25)));
  }).toThrowError();
});
