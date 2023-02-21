import { test, expect } from "vitest";
import { createUser, createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedUserRepository } from "@/test-lib";
import { ChangeUserNameUseCase } from "./change-user-name";
import * as sinon from "sinon";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: createUserId(),
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
  const userId = createUserId();
  const input = {
    userId,
    name: "",
  };
  const dispatcher = createMockedDispatcher();
  const repository = createMockedUserRepository({
    findBy: sinon.fake.returns(Promise.resolve(createUser({ id: userId, name: "foo", joinedGames: [] }))),
  });
  const useCase = new ChangeUserNameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("canNotChangeName");
});

test("should dispatch event", async () => {
  // Arrange
  const userId = createUserId();
  const input = {
    userId,
    name: "name",
  };
  const dispatcher = createMockedDispatcher();
  const save = sinon.fake();
  const repository = createMockedUserRepository({
    save,
    findBy: sinon.fake.returns(Promise.resolve(createUser({ id: userId, name: "foo", joinedGames: [] }))),
  });
  const useCase = new ChangeUserNameUseCase(dispatcher, repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("success");
  expect(save).toBeCalledTimes(1);
  expect(save.callArgWith(0)).toEqual("name");
});
