import { test, expect } from "vitest";
import * as sinon from "sinon";
import { JoinUserUseCase } from "./join-user";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import * as Invitation from "@/domains/invitation";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as Round from "@/domains/round";
import { createMockedDispatcher, createMockedGameRepository, createMockedUserRepository } from "@/test-lib";
import { DOMAIN_EVENTS } from "@/domains/event";

test("should return error if user not found", async () => {
  // Arrange
  const signature = Invitation.create(Game.createId());
  const input = {
    userId: User.createId(),
    signature: signature,
  };
  const dispatcher = createMockedDispatcher();
  const userRepository = createMockedUserRepository();
  const gameRepository = createMockedGameRepository();
  const useCase = new JoinUserUseCase(dispatcher, userRepository, gameRepository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "notFoundUser" });
});

test("should be error when signature is invalid", async () => {
  // Arrange
  const gameId = Game.createId();
  const signature = Invitation.create(gameId);
  const user = User.create({ id: User.createId(), name: "test" });
  const input = {
    signature: signature,
    userId: user.id,
    gameId,
  };

  const dispatcher = createMockedDispatcher();
  const userRepository = createMockedUserRepository({
    findBy: sinon.fake.resolves(user),
  });
  const gameRepository = createMockedGameRepository();
  const useCase = new JoinUserUseCase(dispatcher, userRepository, gameRepository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "notFoundGame" });
});

test("should save game that user joined in", async () => {
  // Arrange
  const gameId = Game.createId();
  const signature = Invitation.create(gameId);
  const user = User.create({ id: User.createId(), name: "test" });
  const input = {
    signature: signature,
    userId: user.id,
    gameId,
  };

  const game = Game.create({
    id: input.gameId,
    name: "name",
    cards: SelectableCards.create([StoryPoint.create(1)]),
    owner: User.createId("owner"),
    round: Round.createId(),
  })[0];

  const dispatcher = createMockedDispatcher();
  const userRepository = createMockedUserRepository({
    findBy: sinon.fake.resolves(user),
  });
  const save = sinon.fake();
  const gameRepository = createMockedGameRepository({
    save,
    findByInvitation: sinon.fake.resolves(game),
  });
  const useCase = new JoinUserUseCase(dispatcher, userRepository, gameRepository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret).toEqual({ kind: "success", game: save.lastCall.lastArg });
});

test("should dispatch event to be joined by user", async () => {
  // Arrange
  const gameId = Game.createId();
  const signature = Invitation.create(gameId);
  const user = User.create({ id: User.createId(), name: "test" });
  const input = {
    signature: signature,
    userId: user.id,
    gameId,
  };

  const game = Game.create({
    id: input.gameId,
    name: "name",
    cards: SelectableCards.create([StoryPoint.create(1)]),
    owner: User.createId("owner"),
    round: Round.createId(),
  })[0];

  const dispatch = sinon.fake();
  const dispatcher = createMockedDispatcher({
    dispatch,
  });
  const userRepository = createMockedUserRepository({
    findBy: sinon.fake.resolves(user),
  });
  const gameRepository = createMockedGameRepository({
    findByInvitation: sinon.fake.resolves(game),
  });
  const useCase = new JoinUserUseCase(dispatcher, userRepository, gameRepository);

  // Act
  await useCase.execute(input);

  // Assert
  expect(dispatch.callCount).toBe(1);
  expect(dispatch.lastCall.lastArg).toEqual({
    kind: DOMAIN_EVENTS.UserJoined,
    userId: user.id,
    gameId: game.id,
  } as Game.UserJoined);
});
