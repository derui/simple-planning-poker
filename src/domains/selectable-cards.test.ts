import { test, expect } from "vitest";
import { createGiveUpCard, createStoryPointCard } from "./card";
import { createSelectableCards } from "./selectable-cards";
import { createStoryPoint } from "./story-point";

test("make cards from numbers", () => {
  // Arrange
  const numbers = [1, 2, 3, 4].map(createStoryPoint);

  // Act
  const ret = createSelectableCards(numbers);

  // Assert
  expect(ret.cards).toHaveLength(5);
  expect(ret.at(0)).toEqual(createStoryPointCard(numbers[0]));
  expect(ret.at(1)).toEqual(createStoryPointCard(numbers[1]));
  expect(ret.at(2)).toEqual(createStoryPointCard(numbers[2]));
  expect(ret.at(3)).toEqual(createStoryPointCard(numbers[3]));
  expect(ret.at(4)).toEqual(createGiveUpCard());
});

test("ignore duplicate storypoint", () => {
  // Arrange
  const numbers = [1, 2, 3, 4].map(createStoryPoint);

  // Act
  const ret = createSelectableCards(numbers);

  // Assert
  expect(ret.cards).toHaveLength(5);
  expect(ret.at(0)).toEqual(createStoryPointCard(numbers[0]));
  expect(ret.at(1)).toEqual(createStoryPointCard(numbers[1]));
  expect(ret.at(2)).toEqual(createStoryPointCard(numbers[2]));
  expect(ret.at(3)).toEqual(createStoryPointCard(numbers[3]));
  expect(ret.at(4)).toEqual(createGiveUpCard());
});

test("should be able to check a card contains in cards", () => {
  // Arrange
  const numbers = [1, 2, 3, 4].map(createStoryPoint);

  // Act
  const ret = createSelectableCards(numbers);

  // Assert
  expect(ret.contains(ret.at(0)!!)).toBeTruthy();
  expect(ret.contains(ret.giveUp)).toBeTruthy();
  expect(ret.contains(createStoryPointCard(createStoryPoint(5)))).toBeFalsy();
});
