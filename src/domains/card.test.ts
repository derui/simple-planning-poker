import { test, expect } from "vitest";
import { asStoryPoint, createGiveUpCard, createStoryPointCard, equalCard } from "./card";
import { createStoryPoint } from "./story-point";

test("create give up card", () => {
  // Arrange

  // Act
  const card = createGiveUpCard();

  // Assert
  expect(card.kind).toEqual("giveup");
});

test("create story point card", () => {
  // Arrange

  // Act
  const card = createStoryPointCard(createStoryPoint(10));

  // Assert
  expect(card).toEqual({
    kind: "storypoint",
    storyPoint: createStoryPoint(10),
  });
});

test("should be able to compare give up and story point", () => {
  // Arrange
  const giveUp = createGiveUpCard();
  const storyPoint = createStoryPointCard(createStoryPoint(10));

  // Act

  // Assert
  expect(equalCard(giveUp, createGiveUpCard())).toBeTruthy;
  expect(equalCard(giveUp, storyPoint)).toBeFalsy;
  expect(equalCard(storyPoint, giveUp)).toBeFalsy;
  expect(equalCard(storyPoint, createStoryPointCard(createStoryPoint(10)))).toBeTruthy;
});

test("should return false if story point is different", () => {
  // Arrange
  const card1 = createStoryPointCard(createStoryPoint(10));
  const card2 = createStoryPointCard(createStoryPoint(11));

  // Act
  const ret = equalCard(card1, card2);

  // Assert
  expect(ret).toBeFalsy;
});

test("should return null if card is give up", () => {
  // Arrange
  const card1 = createGiveUpCard();

  // Act
  const ret = asStoryPoint(card1);

  // Assert
  expect(ret).toBeNull;
});

test("should return story point if card is story point card", () => {
  // Arrange
  const card1 = createStoryPointCard(createStoryPoint(11));

  // Act
  const ret = asStoryPoint(card1);

  // Assert
  expect(ret?.value).toBe(11);
});
