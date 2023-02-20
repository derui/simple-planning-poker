import { createGiveUpCard, createStoryPointCard } from "@/domains/card";
import { createStoryPoint } from "@/domains/story-point";
import { deserializeCard, serializeCard } from "./card-converter";

describe("infrastracture", () => {
  describe("card converter", () => {
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
      const card = createStoryPointCard(createStoryPoint(3));

      // Act
      const ret = deserializeCard(serializeCard(card));

      // Assert
      expect(ret).toEqual(card);
    });
  });
});
