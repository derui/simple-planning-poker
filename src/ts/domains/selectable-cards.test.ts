import { createGiveUpCard, createStoryPointCard } from "./card";
import { createSelectableCards } from "./selectable-cards";
import { createStoryPoint } from "./story-point";

describe("domains", () => {
  describe("selectable-cards", () => {
    test("make cards from numbers", () => {
      // Arrange
      const numbers = [1, 2, 3, 4].map(createStoryPoint);

      // Act
      const ret = createSelectableCards(numbers);

      // Assert
      expect(ret.cards).toHaveLength(5);
      expect(ret.cards[0]).toEqual(createStoryPointCard(numbers[0]));
      expect(ret.cards[1]).toEqual(createStoryPointCard(numbers[1]));
      expect(ret.cards[2]).toEqual(createStoryPointCard(numbers[2]));
      expect(ret.cards[3]).toEqual(createStoryPointCard(numbers[3]));
      expect(ret.cards[4]).toEqual(createGiveUpCard());
    });

    test("ignore duplicate storypoint", () => {
      // Arrange
      const numbers = [1, 2, 3, 4].map(createStoryPoint);

      // Act
      const ret = createSelectableCards(numbers);

      // Assert
      expect(ret.cards).toHaveLength(5);
      expect(ret.cards[0]).toEqual(createStoryPointCard(numbers[0]));
      expect(ret.cards[1]).toEqual(createStoryPointCard(numbers[1]));
      expect(ret.cards[2]).toEqual(createStoryPointCard(numbers[2]));
      expect(ret.cards[3]).toEqual(createStoryPointCard(numbers[3]));
      expect(ret.cards[4]).toEqual(createGiveUpCard());
    });
  });
});
