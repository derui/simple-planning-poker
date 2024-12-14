import { DomainEvent, User } from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import * as sinon from "sinon";
import { beforeEach, expect, test } from "vitest";
import { ChangeUserNameUseCase } from "./change-user-name.js";
import { clearSubsctiptions, subscribe } from "./event-dispatcher.js";

beforeEach(() => {
  clear();
  clearSubsctiptions();
});

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    name: "foo",
  };

  // Act
  const ret = await ChangeUserNameUseCase(input);

  // Assert
  expect(ret.kind).toBe("notFound");
});

test("should return error if can not change name of the user", async () => {
  // Arrange
  const userId = User.createId();
  const input = {
    userId,
    name: "",
  };
  await UserRepository.save({ user: User.create({ id: userId, name: "foo" }) });

  // Act
  const ret = await ChangeUserNameUseCase(input);

  // Assert
  expect(ret.kind).toBe("canNotChangeName");
});

test("should dispatch event", async () => {
  // Arrange
  const userId = User.createId();
  const input = {
    userId,
    name: "name",
  };
  const dispatcher = sinon.fake();
  subscribe(dispatcher);
  await UserRepository.save({ user: User.create({ id: userId, name: "foo" }) });

  // Act
  const ret = await ChangeUserNameUseCase(input);

  // Assert
  expect(ret.kind).toBe("success");

  const saved = await UserRepository.findBy({ id: userId });
  expect(saved!.name).toEqual("name");
  expect(dispatcher.lastCall.firstArg).toEqual({
    kind: DomainEvent.DOMAIN_EVENTS.UserNameChanged,
    userId,
    newName: "name",
  });
});
