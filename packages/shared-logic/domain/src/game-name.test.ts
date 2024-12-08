import { expect, test } from "vitest";
import { create, value } from "./game-name.js";

test("create game name", () => {
  // Arrange

  // Act
  const ret = create("new game");

  // Assert
  expect(ret).toEqual("new game");
});

test("create game name with trimed", () => {
  // Arrange

  // Act
  const ret = create("\t new game\n");

  // Assert
  expect(ret).toEqual("new game");
});

test("throw error if game name is blank or empty", () => {
  // Arrange

  // Act

  // Assert
  expect(() => create("")).toThrowError();
  expect(() => create("  ")).toThrowError();
  expect(() => create("\t\n")).toThrowError();
});

test("get value", () => {
  const point = create("name");

  expect(value(point)).toBe("name");
});
