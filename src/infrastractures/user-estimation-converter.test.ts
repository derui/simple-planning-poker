import { test, expect } from "vitest";
import { deserialize, serialize } from "./user-estimation-converter";
import * as Card from "@/domains/card";
import * as StoryPoint from "@/domains/story-point";
import * as UserEstimation from "@/domains/user-estimation";

test("serialize and deserialize give up hand", () => {
  // Arrange
  const hand = UserEstimation.giveUp();

  // Act
  const ret = deserialize(serialize(hand));

  // Assert
  expect(ret).toEqual(hand);
});

test("serialize and deserialize handed", () => {
  // Arrange
  const hand = UserEstimation.estimated(Card.create(StoryPoint.create(3)));

  // Act
  const ret = deserialize(serialize(hand));

  // Assert
  expect(ret).toEqual(hand);
});

test("serialize and deserialize unselected", () => {
  // Arrange
  const hand = UserEstimation.unselected();

  // Act
  const ret = deserialize(serialize(hand));

  // Assert
  expect(ret).toEqual(hand);
});
