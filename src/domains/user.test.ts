import { test, expect } from "vitest";
import { DOMAIN_EVENTS } from "./event";
import { create, createId, changeName, canChangeName } from "./user";

test("create user with id", () => {
  // Arrange
  const name = "name";

  // Act
  const ret = create({
    id: createId(),
    name,
  });

  // Assert
  expect(ret.name).toEqual("name");
});

test("join user into a game", () => {
  // Arrange
  const name = "name";

  // Act
  const ret = create({
    id: createId(),
    name,
  });

  // Assert
  expect(ret.name).toEqual("name");
});

test("change name", () => {
  // Arrange
  const name = "name";
  const user = create({
    id: createId(),
    name,
  });

  // Act
  const [ret] = changeName(user, "changed name");

  // Assert
  expect(ret.name).toEqual("changed name");
});

test("throw error if user name is empty", () => {
  // Arrange

  // Act

  // Assert
  expect(() =>
    create({
      id: createId(),
      name: "",
    })
  ).toThrowError();
});

test("throw error when change to empty name", () => {
  // Arrange
  const name = "name";
  const user = create({
    id: createId(),
    name,
  });

  // Act

  // Assert
  expect(() => changeName(user, "")).toThrowError();
});

test("validate name", () => {
  // Arrange

  // Act

  // Assert
  expect(canChangeName("")).toBeFalsy;
  expect(canChangeName("foo")).toBeTruthy;
});

test("should return event to notify user name changed", () => {
  // Arrange
  const name = "name";
  const user = create({
    id: createId(),
    name,
  });

  // Act
  const [, event] = changeName(user, "foobar");

  // Assert
  expect(event.kind).toEqual(DOMAIN_EVENTS.UserNameChanged);
  expect(event.name).toEqual("foobar");
  expect(event.userId).toBe(user.id);
});
