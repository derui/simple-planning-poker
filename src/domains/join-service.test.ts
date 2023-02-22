import sinon from "sinon";
import { test, expect } from "vitest";
import { DOMAIN_EVENTS } from "./event";
import * as Game from "./game";
import * as GamePlayer from "./game-player";
import { GamePlayerRepository } from "./game-player-repository";
import { GameRepository } from "./game-repository";
import { create } from "./join-service";
import * as SelectableCards from "./selectable-cards";
import * as StoryPoint from "./story-point";
import * as User from "./user";
import * as Invitation from "./invitation";

const CARDS = SelectableCards.create([1, 2].map(StoryPoint.create));

test("should return no events if game is not found", async () => {
  // Arrange
  const gameRepository: GameRepository = {
    save: () => Promise.resolve(),
    findBy: () => Promise.resolve(undefined),
    findByInvitationSignature: () => Promise.resolve(undefined),
  };
  const gamePlayerRepository: GamePlayerRepository = {
    save: () => Promise.resolve(),
    findBy: () => Promise.resolve(undefined),
    findByUserAndGame: () => Promise.resolve(undefined),
    delete: () => Promise.resolve(),
  };

  const service = create(gameRepository, gamePlayerRepository);

  // Act
  const user = User.createUser({ id: User.createId(), name: "foo", joinedGames: [] });
  const ret = await service.join(user, Invitation.create(Game.createId()).signature);

  // Assert
  expect(ret).toBeUndefined;
});

test("should return domain event to notify player joined", async () => {
  // Arrange
  const user = User.createUser({ id: User.createId(), name: "foo", joinedGames: [] });
  const player = GamePlayer.createGamePlayer({
    id: GamePlayer.createId(),
    userId: user.id,
    gameId: Game.createId(),
  });

  const game = Game.create({
    id: Game.createId(),
    name: "name",
    players: [player.id],
    cards: CARDS,
  });
  const gameRepository: GameRepository = {
    save: () => Promise.resolve(),
    findBy: () => Promise.resolve(undefined),
    findByInvitationSignature: () => Promise.resolve(game),
  };
  const gamePlayerRepository: GamePlayerRepository = {
    save: () => Promise.resolve(),
    findBy: () => Promise.resolve(undefined),
    findByUserAndGame: () => Promise.resolve(undefined),
    delete: () => Promise.resolve(),
  };

  const service = create(gameRepository, gamePlayerRepository);

  // Act
  const ret = await service.join(user, Invitation.create(game.id).signature);

  // Assert
  expect(ret?.kind).toEqual(DOMAIN_EVENTS.UserInvited);
});

test("should save a new player", async () => {
  // Arrange
  const user = User.createUser({ id: User.createId(), name: "foo", joinedGames: [] });
  const game = Game.create({
    id: Game.createId(),
    name: "name",
    players: [GamePlayer.createId()],
    cards: CARDS,
  });
  const save = sinon.fake();
  const gameRepository: GameRepository = {
    save: () => Promise.resolve(),
    findBy: () => Promise.resolve(undefined),
    findByInvitationSignature: () => Promise.resolve(game),
  };
  const gamePlayerRepository: GamePlayerRepository = {
    save,
    findBy: () => Promise.resolve(undefined),
    findByUserAndGame: () => Promise.resolve(undefined),
    delete: () => Promise.resolve(),
  };

  const service = create(gameRepository, gamePlayerRepository);

  // Act
  await service.join(user, Invitation.create(game.id).signature);

  // Assert
  expect(save.callCount).toBe(1);
});

test("should not create new player if user is already joined a game", async () => {
  // Arrange
  const playerId = GamePlayer.createId();
  const game = Game.create({
    id: Game.createId(),
    name: "name",
    players: [playerId],
    cards: CARDS,
  });
  const user = User.createUser({ id: User.createId(), name: "foo", joinedGames: [{ gameId: game.id, playerId }] });
  const save = sinon.fake();
  const gameRepository: GameRepository = {
    save: () => Promise.resolve(),
    findBy: () => Promise.resolve(undefined),
    findByInvitationSignature: () => Promise.resolve(game),
  };
  const gamePlayerRepository: GamePlayerRepository = {
    save,
    findBy: () => Promise.resolve(undefined),
    findByUserAndGame: () => Promise.resolve(undefined),
    delete: () => Promise.resolve(),
  };

  const service = create(gameRepository, gamePlayerRepository);

  // Act
  const ret = await service.join(user, Invitation.create(game.id).signature);

  // Assert
  expect(ret!.kind).toEqual(DOMAIN_EVENTS.UserInvited);
  expect(save.called).toBeFalsy();
});
