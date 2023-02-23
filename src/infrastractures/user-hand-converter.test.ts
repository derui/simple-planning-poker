import { test, expect } from "vitest";
import * as Card from "@/domains/card";
import * as StoryPoint from "@/domains/story-point";
import * as UserHand from "@/domains/user-hand";
import { deserialize, serialize } from "./user-hand-converter";

test("serialize and deserialize give up hand", () => {
  // Arrange
  const hand = UserHand.giveUp();

  // Act
  const ret = deserialize(serialize(hand));

  // Assert
  expect(ret).toEqual(hand);
});

test("serialize and deserialize handed", () => {
  // Arrange
  const hand = UserHand.handed(Card.create(StoryPoint.create(3)));

  // Act
  const ret = deserialize(serialize(hand));

  // Assert
  expect(ret).toEqual(hand);
});

test("serialize and deserialize unselected", () => {
  // Arrange
  const hand = UserHand.unselected();

  // Act
  const ret = deserialize(serialize(hand));

  // Assert
  expect(ret).toEqual(hand);
});
