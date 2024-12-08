import { ApplicablePoints, DomainEvent, Game, GameName, StoryPoint, User, VotingRepository } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import sinon from "sinon";
import { describe, expect, test } from "vitest";
import { newStartVotingUseCase } from "./start-voting.js";

describe("errors", () => {
  test("should return error if game does not exist", async () => {
    // Arrange
    const gameId = Game.createId();
    const useCase = newStartVotingUseCase(newMemoryGameRepository(), newMemoryVotingRepository(), sinon.fake());

    // Act
    const result = await useCase({ gameId });

    // Assert
    expect(result.kind).toEqual("notFound");
  });

  test("should fail when raised exception on save", async () => {
    // Arrange
    const mockRepository: VotingRepository.T = {
      ...newMemoryVotingRepository(),
      save: sinon.fake.throws(""),
    };
    const gameId = Game.createId();
    const useCase = newStartVotingUseCase(
      newMemoryGameRepository([
        Game.create({
          id: gameId,
          name: GameName.create("name"),
          owner: User.createId(),
          points: ApplicablePoints.create([StoryPoint.create(1)]),
        })[0],
      ]),
      mockRepository,
      sinon.fake()
    );

    // Act
    const ret = await useCase({ gameId });

    // Assert
    expect(ret.kind).toEqual("failed");
  });
});

describe("happy path", () => {
  test("should successfully start voting", async () => {
    // Arrange
    const gameId = Game.createId();
    const repository = newMemoryVotingRepository();
    const useCase = newStartVotingUseCase(
      newMemoryGameRepository([
        Game.create({
          id: gameId,
          name: GameName.create("name"),
          owner: User.createId(),
          points: ApplicablePoints.create([StoryPoint.create(1)]),
        })[0],
      ]),
      repository,
      sinon.fake()
    );

    // Act
    const result = await useCase({ gameId });

    // Assert
    if (result.kind == "success") {
      expect(result.voting).toEqual(await repository.findBy(result.voting.id));
    } else {
      expect.fail("should succeeed");
    }
  });

  test("dispatch event", async () => {
    // Arrange
    const gameId = Game.createId();
    const repository = newMemoryVotingRepository();
    const dispatcher = sinon.fake<[DomainEvent.T]>();
    const useCase = newStartVotingUseCase(
      newMemoryGameRepository([
        Game.create({
          id: gameId,
          name: GameName.create("name"),
          owner: User.createId(),
          points: ApplicablePoints.create([StoryPoint.create(1)]),
        })[0],
      ]),
      repository,
      dispatcher
    );

    // Act
    await useCase({ gameId });

    // Assert
    expect(dispatcher.callCount).toEqual(1);
    expect(dispatcher.lastCall.args[0].kind).toEqual(DomainEvent.DOMAIN_EVENTS.VotingStarted);
  });
});
