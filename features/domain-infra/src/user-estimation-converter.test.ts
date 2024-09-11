import { test, expect } from "vitest";
import { deserialize, serialize } from "./user-estimation-converter.js";
import { StoryPoint, UserEstimation } from "@spp/shared-domain";

test("serialize and deserialize give up estimation", () => {
  // Arrange
  const estimation = UserEstimation.giveUpOf();

  // Act
  const ret = deserialize(serialize(estimation));

  // Assert
  expect(ret).toEqual(estimation);
});

test("serialize and deserialize estimationed", () => {
  // Arrange
  const estimation = UserEstimation.submittedOf(StoryPoint.create(3));

  // Act
  const ret = deserialize(serialize(estimation));

  // Assert
  expect(ret).toEqual(estimation);
});

test("serialize and deserialize unselected", () => {
  // Arrange
  const estimation = UserEstimation.unsubmitOf();

  // Act
  const ret = deserialize(serialize(estimation));

  // Assert
  expect(ret).toEqual(estimation);
});
