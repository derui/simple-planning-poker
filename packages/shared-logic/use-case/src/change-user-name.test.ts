import { test, expect } from "vitest";
import * as sinon from "sinon";
import { newChangeUserNameUseCase } from "./change-user-name.js";
import { DomainEvent, User } from "@spp/shared-domain";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    name: "foo",
  };
  const dispatcher = sinon.fake();
  const repository = newMemoryUserRepository();
  const useCase = newChangeUserNameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

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
  const dispatcher = sinon.fake();
  const repository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
  const useCase = newChangeUserNameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

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
  const repository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
  const useCase = newChangeUserNameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase(input);

  // Assert
  expect(ret.kind).toBe("success");

  const saved = await repository.findBy(userId);
  expect(saved!.name).toEqual("name");
  expect(dispatcher.lastCall.firstArg).toEqual({
    kind: DomainEvent.DOMAIN_EVENTS.UserNameChanged,
    userId,
    newName: "name",
  });
});
