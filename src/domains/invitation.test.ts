import { test, expect } from "vitest";
import { createId } from "./game";
import { create } from "./invitation";

test("should create unique invitation of a game", () => {
  // Arrange

  // Act
  const ret = create(createId("f"));

  // Assert
  expect(ret.signature).toEqual("252f10c83610ebca1a059c0bae8255eba2f95be4d1d7bcfa89d7248a82d9f111");
});
