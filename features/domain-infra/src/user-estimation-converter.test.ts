import { test, expect } from "vitest";
import { deserialize, serialize } from "./user-estimation-converter";
import * as Card from "@/domains/card";
import * as StoryPoint from "@/domains/story-point";
import * as UserEstimation from "@/domains/user-estimation";

test("serialize and deserialize give up estimation", () => {
  // Arrange
  const estimation = UserEstimation.giveUp();

  // Act
  const ret = deserialize(serialize(estimation));

  // Assert
  expect(ret).toEqual(estimation);
});

test("serialize and deserialize estimationed", () => {
  // Arrange
  const estimation = UserEstimation.estimated(Card.create(StoryPoint.create(3)));

  // Act
  const ret = deserialize(serialize(estimation));

  // Assert
  expect(ret).toEqual(estimation);
});

test("serialize and deserialize unselected", () => {
  // Arrange
  const estimation = UserEstimation.unselected();

  // Act
  const ret = deserialize(serialize(estimation));

  // Assert
  expect(ret).toEqual(estimation);
});
