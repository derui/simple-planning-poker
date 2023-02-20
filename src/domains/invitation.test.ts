import { GameId } from "./game";
import { createInvitation } from "./invitation";

describe("domains", () => {
  describe("invitation", () => {
    test("should create unique invitation of a game", () => {
      // Arrange

      // Act
      const ret = createInvitation("f" as GameId);

      // Assert
      expect(ret.signature).toEqual("252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111");
    });
  });
});
