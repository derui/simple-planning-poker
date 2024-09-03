import { test, expect } from "vitest";
import { storyPoint, create, equals } from "./card";
import * as StoryPoint from "./story-point";

test("create story point card", () => {
  // Arrange

  // Act
  const card = create(StoryPoint.create(10));

  // Assert
  expect(card).toEqual({ storyPoint: 10 });
});

test("should return true if cards are same", () => {
  // Arrange
  const card1 = create(StoryPoint.create(10));
  const card2 = create(StoryPoint.create(10));

  // Act
  const ret = equals(card1, card2);

  // Assert
  expect(ret).toBeTruthy();
});

test("should return false if story point is different", () => {
  // Arrange
  const card1 = create(StoryPoint.create(10));
  const card2 = create(StoryPoint.create(11));

  // Act
  const ret = equals(card1, card2);

  // Assert
  expect(ret).toBeFalsy();
});

test("should return story point if card is story point card", () => {
  // Arrange
  const card1 = create(StoryPoint.create(11));

  // Act
  const ret = storyPoint(card1);

  // Assert
  expect(ret).toBe(StoryPoint.create(11));
});
