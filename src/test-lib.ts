// library for test. DO NOT USE ANY CLASS/FUNCTION IN THIS MODULE FROM PRODUCTION CODE!!
import * as sinon from "sinon";
import { GameRepository } from "./domains/game-repository";
import { UserRepository } from "./domains/user-repository";
import { EventDispatcher } from "./usecases/base";
import { ChangeUserModeUseCase } from "./usecases/change-user-mode";
import { ChangeUserNameUseCase } from "./usecases/change-user-name";
import { HandCardUseCase } from "./usecases/hand-card";
import { JoinUserUseCase } from "./usecases/join-user";
import { LeaveGameUseCase } from "./usecases/leave-game";

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

export const createMockedChangeUserNameUseCase = function createMockedChangeUserNameUseCase(
  mock: Partial<ChangeUserNameUseCase> = {}
): ChangeUserNameUseCase {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as ChangeUserNameUseCase;
};

export const createMockedChangeUserModeUseCase = function createMockedChangeUserModeUseCase(
  mock: Partial<ChangeUserModeUseCase> = {}
) {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as ChangeUserModeUseCase;
};

export const createMockedHandCardUseCase = function createMockedHandCardUseCase(mock: Partial<HandCardUseCase> = {}) {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as HandCardUseCase;
};

export const createMockedLeaveGameUseCase = function createMockedLeaveGameUseCase(
  mock: Partial<LeaveGameUseCase> = {}
) {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as LeaveGameUseCase;
};
export const createMockedJoinUserUseCase = function createMockedJoinUserUseCase(mock: Partial<JoinUserUseCase> = {}) {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as JoinUserUseCase;
};
