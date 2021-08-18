import { createStoryPoint } from "./story-point";

describe("domains", () => {
  describe("story-point", () => {
    test("create story point with positive number", () => {
      // Arrange

      // Act
      const ret = createStoryPoint(1);

      // Assert
      expect(ret.value).toEqual(1);
    });

    test("throw error if point is less than 1", () => {
      // Arrange

      // Act

      // Assert
      expect(() => createStoryPoint(0)).toThrowError();
      expect(() => createStoryPoint(-1)).toThrowError();
    });

    test("throw error if point is NaN", () => {
      // Arrange

      // Act

      // Assert
      expect(() => createStoryPoint(NaN)).toThrowError();
    });
  });
});
