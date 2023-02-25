// library for test. DO NOT USE ANY CLASS/FUNCTION IN THIS MODULE FROM PRODUCTION CODE!!
import * as sinon from "sinon";
import { GameRepository } from "./domains/game-repository";
import { UserRepository } from "./domains/user-repository";
import { EventDispatcher } from "./usecases/base";

export const createMockedDispatcher = (mock: Partial<EventDispatcher> = {}) => {
  return {
    dispatch: mock.dispatch ?? sinon.fake(),
  };
};

export const createMockedGameRepository = (mock: Partial<GameRepository> = {}): GameRepository => {
  return {
    save: mock.save ?? sinon.fake(),
    findBy: mock.findBy ?? sinon.fake(),
    findByInvitation: mock.findByInvitation ?? sinon.fake(),
  };
};

export const createMockedUserRepository = (mock: Partial<UserRepository> = {}) => {
  return {
    save: mock.save ?? sinon.fake(),
    findBy: mock.findBy ?? sinon.fake(),
  };
};
