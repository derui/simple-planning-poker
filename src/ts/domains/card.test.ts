import { createGiveUpCard, createStoryPointCard } from "./card";
import { createStoryPoint } from "./story-point";

describe("domains", () => {
  describe("card", () => {
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
  });
});
