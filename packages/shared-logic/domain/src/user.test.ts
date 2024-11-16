import { expect, test } from "vitest";
import { DOMAIN_EVENTS } from "./event.js";
import { canChangeName, changeDefaultVoterType, changeName, create, createId, isUserNameChanged } from "./user.js";
import * as VoterType from "./voter-type.js";

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
  expect(canChangeName("")).toBeFalsy();
  expect(canChangeName("foo")).toBeTruthy();
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
  if (isUserNameChanged(event)) {
    expect(event.newName).toEqual("foobar");
    expect(event.userId).toBe(user.id);
  } else {
    expect.fail("should be UserNameChanged");
  }
});

test("default voter type is normal", () => {
  // Arrange

  // Act
  const user = create({
    id: createId(),
    name: "foo",
  });

  // Assert
  expect(user.defaultVoterType).toEqual(VoterType.Normal);
});

test("change user default voter type", () => {
  // Arrange
  const user = create({
    id: createId(),
    name: "foo",
  });

  // Act
  const actual = changeDefaultVoterType(user, VoterType.Inspector);

  // Assert
  expect(actual.defaultVoterType).toEqual(VoterType.Inspector);
});
