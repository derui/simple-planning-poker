// library for test. DO NOT USE ANY CLASS/FUNCTION IN THIS MODULE FROM PRODUCTION CODE!!
import * as sinon from "sinon";
import { GamePlayerRepository } from "./domains/game-player-repository";
import { GameRepository } from "./domains/game-repository";
import { UserRepository } from "./domains/user-repository";
import { EventDispatcher } from "./usecases/base";
import * as GamePlayer from "./domains/game-player";

export const createMockedDispatcher = (mock: Partial<EventDispatcher> = {}) => {
  return {
    dispatch: mock.dispatch ?? sinon.fake(),
  };
};

export const createMockedGameRepository = (mock: Partial<GameRepository> = {}) => {
  return {
    save: mock.save ?? sinon.fake(),
    findBy: mock.findBy ?? sinon.fake(),
    findByInvitationSignature: mock.findByInvitationSignature ?? sinon.fake(),
  };
};

export const createMockedUserRepository = (mock: Partial<UserRepository> = {}) => {
  return {
    save: mock.save ?? sinon.fake(),
    findBy: mock.findBy ?? sinon.fake(),
  };
};

export const createMockedGamePlayerRepository = (mock: Partial<GamePlayerRepository> = {}) => {
  return {
    save: mock.save ?? sinon.fake(),
    findBy: mock.findBy ?? sinon.fake(),
    findByUserAndGame: mock.findByUserAndGame ?? sinon.fake(),
    delete: mock.delete ?? sinon.fake(),
  };
};

export const createMemoryGamePlayerRepository = function createMemoryGamePlayerRepository(
  initial: GamePlayer.T[] = []
): GamePlayerRepository {
  const map = new Map<GamePlayer.Id, GamePlayer.T>(initial.map((g) => [g.id, g] as const));

  return {
    async save(gamePlayer) {
      map.set(gamePlayer.id, gamePlayer);
    },

    async findBy(id) {
      return map.get(id);
    },
    async findByUserAndGame(userId, gameId) {
      return Array.from(map.values()).find((g) => {
        return g.user === userid && g.game === gameId;
      });
    },

    async delete(player) {
      map.delete(player.id);
    },
  };
};
