import { ApplicablePoints, DomainEvent, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { clear as clearGame } from "@spp/shared-domain/mock/game-repository";
import { clear as clearVoting, injectErrorOnSave } from "@spp/shared-domain/mock/voting-repository";
import sinon from "sinon";
import { beforeEach, describe, expect, test } from "vitest";

import { GameRepository } from "@spp/shared-domain/game-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { clearSubsctiptions, subscribe } from "./event-dispatcher.js";
import { StartVotingUseCase } from "./start-voting.js";

beforeEach(() => {
  clearVoting();
  clearGame();
  clearSubsctiptions();
});

describe("errors", () => {
  test("should return error if game does not exist", async () => {
    // Arrange
    const gameId = Game.createId();

    // Act
    const result = await StartVotingUseCase({ gameId });

    // Assert
    expect(result).toEqual({ kind: "error", detail: "notFound" });
  });

  test("should fail when raised exception on save", async () => {
    // Arrange
    const gameId = Game.createId();
    await GameRepository.save({
      game: Game.create({
        id: gameId,
        name: GameName.create("name"),
        owner: User.createId(),
        points: ApplicablePoints.create([StoryPoint.create(1)]),
      })[0],
    });
    injectErrorOnSave("");

    // Act
    const ret = await StartVotingUseCase({ gameId });

    // Assert
    expect(ret).toEqual({ kind: "error", detail: "failed" });
  });
});

describe("happy path", () => {
  test("should successfully start voting", async () => {
    // Arrange
    const gameId = Game.createId();
    await GameRepository.save({
      game: Game.create({
        id: gameId,
        name: GameName.create("name"),
        owner: User.createId(),
        points: ApplicablePoints.create([StoryPoint.create(1)]),
      })[0],
    });

    // Act
    const result = await StartVotingUseCase({ gameId });

    // Assert
    if (result.kind == "success") {
      expect(result.voting).toEqual(await VotingRepository.findBy({ id: result.voting.id }));
    } else {
      expect.fail("should succeeed");
    }
  });

  test("dispatch event", async () => {
    // Arrange
    const gameId = Game.createId();
    const dispatcher = sinon.fake<[DomainEvent.T]>();
    await GameRepository.save({
      game: Game.create({
        id: gameId,
        name: GameName.create("name"),
        owner: User.createId(),
        points: ApplicablePoints.create([StoryPoint.create(1)]),
      })[0],
    });

    subscribe(dispatcher);

    // Act
    await StartVotingUseCase({ gameId });

    // Assert
    expect(dispatcher.callCount).toEqual(1);
    expect(dispatcher.lastCall.args[0].kind).toEqual(DomainEvent.DOMAIN_EVENTS.VotingStarted);
  });
});
