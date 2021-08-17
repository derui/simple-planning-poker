import { createGiveUpCard, createStoryPointCard } from "./card";

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
      const card = createStoryPointCard(10);

      // Assert
      expect(card).toEqual({
        kind: "storypoint",
        storyPoint: 10,
      });
    });

    test("throw error when story point is less than 0", () => {
      // Arrange

      // Act

      // Assert
      expect(() => createStoryPointCard(0)).toThrowError(/Can not create story point/);
      expect(() => createStoryPointCard(-1)).toThrowError(/Can not create story point/);
      expect(() => createStoryPointCard(NaN)).toThrowError(/Can not create story point/);
    });
  });
});
