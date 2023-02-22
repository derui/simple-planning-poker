import { test, expect } from "vitest";
import { createGiveUpCard, create } from "@/domains/card";
import { create } from "@/domains/story-point";
import { deserializeCard, serializeCard } from "./card-converter";

test("serialize and deserialize give up card", () => {
  // Arrange
  const card = createGiveUpCard();

  // Act
  const ret = deserializeCard(serializeCard(card));

  // Assert
  expect(ret).toEqual(card);
});

test("serialize and deserialize give up card", () => {
  // Arrange
  const card = create(create(3));

  // Act
  const ret = deserializeCard(serializeCard(card));

  // Assert
  expect(ret).toEqual(card);
});
