import { test, expect } from "vitest";
import * as User from "@/domains/user";
import { createMockedDispatcher, createMockedUserRepository } from "@/test-lib";
import { ChangeUserNameUseCase } from "./change-user-name";
import * as sinon from "sinon";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    name: "foo",
  };
  const dispatcher = createMockedDispatcher();
  const repository = createMockedUserRepository();
  const useCase = new ChangeUserNameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

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
  const dispatcher = createMockedDispatcher();
  const repository = createMockedUserRepository({
    findBy: sinon.fake.returns(Promise.resolve(User.create({ id: userId, name: "foo" }))),
  });
  const useCase = new ChangeUserNameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

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
  const dispatcher = createMockedDispatcher();
  const save = sinon.fake();
  const repository = createMockedUserRepository({
    save,
    findBy: sinon.fake.returns(Promise.resolve(User.create({ id: userId, name: "foo" }))),
  });
  const useCase = new ChangeUserNameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("success");
  expect(save.callCount).toBe(1);
  expect(save.lastCall.firstArg.name).toEqual("name");
});
