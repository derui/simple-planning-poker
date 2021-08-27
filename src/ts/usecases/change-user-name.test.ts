import { UserJoined } from "@/domains/event";
import { createGame, createGameId } from "@/domains/game";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUser, createUserId } from "@/domains/user";
import { createMockedDispatcher, createMockedGameRepository, createMockedUserRepository } from "@/lib.test";
import { ChangeUserNameUseCase } from "./change-user-name";
import { JoinUserUseCase } from "./join-user";

describe("use case", () => {
  describe("change user name", () => {
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
      const repository = createMockedUserRepository();
      const useCase = new ChangeUserNameUseCase(dispatcher, repository);
      repository.findBy.mockImplementation(() => createUser(userId, "foo"));

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
      const repository = createMockedUserRepository();
      const useCase = new ChangeUserNameUseCase(dispatcher, repository);
      repository.findBy.mockImplementation(() => createUser(userId, "foo"));

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("success");
      expect(dispatcher.dispatch).toBeCalledTimes(1);
    });

    test("should save changed user", async () => {
      // Arrange
      const userId = createUserId();
      const input = {
        userId,
        name: "name",
      };
      const dispatcher = createMockedDispatcher();
      const repository = createMockedUserRepository();
      const useCase = new ChangeUserNameUseCase(dispatcher, repository);
      repository.findBy.mockImplementation(() => createUser(userId, "foo"));

      // Act
      const ret = await useCase.execute(input);

      // Assert
      expect(ret.kind).toBe("success");
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save.mock.calls[0][0]?.name).toEqual("name");
    });
  });
});
