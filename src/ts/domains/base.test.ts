import { createId, equalId } from "./base";

describe("domains", () => {
  describe("base", () => {
    describe("id", () => {
      test("get id", () => {
        // Arrange

        // Act
        const id = createId<"foo">("constant");

        // Assert
        expect(id).toEqual(createId<"foo">("constant"));
      });

      test("equal id", () => {
        // Arrange

        // Act
        const id1 = createId<"foo">("constant1");
        const id2 = createId<"foo">("constant2");

        // Assert
        expect(equalId(id1, id2)).toBeFalsy;
        expect(equalId(id1, createId<"foo">("constant1"))).toBeTruthy;
      });
    });
  });
});
