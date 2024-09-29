// library for test. DO NOT USE ANY CLASS/FUNCTION IN THIS MODULE FROM PRODUCTION CODE!!
import * as sinon from "sinon";
import { GameRepository } from "./domains/game-repository";
import { UserRepository } from "./domains/user-repository";
import { Authenticator } from "./status/type";
import { EventDispatcher, UseCase } from "./usecases/base";
import { ChangeUserModeUseCase } from "./usecases/change-user-mode";
import { ChangeUserNameUseCase } from "./usecases/change-user-name";
import { CreateGameUseCase } from "./usecases/create-game";
import { EstimatePlayerUseCase } from "./usecases/estimate-player";
import { JoinUserUseCase } from "./usecases/join-user";
import { LeaveGameUseCase } from "./usecases/leave-game";
import { ShowDownUseCase } from "./usecases/show-down";
import { GameObserver, RoundObserver, UserObserver } from "./infrastractures/observer";
import { RoundRepository } from "./domains/round-repository";
import { RoundHistoryRepository } from "./infrastractures/round-history-repository";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";

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
    listUserJoined: mock.listUserJoined ?? sinon.fake.resolves([]),
  };
};

export const createMockedRoundRepository = (mock: Partial<RoundRepository> = {}): RoundRepository => {
  return {
    save: mock.save ?? sinon.fake(),
    findBy: mock.findBy ?? sinon.fake(),
    findFinishedRoundBy: mock.findFinishedRoundBy ?? sinon.fake(),
  };
};

export const createMockedRoundHistoryRepository = (
  mock: Partial<RoundHistoryRepository> = {}
): RoundHistoryRepository => {
  return {
    save: mock.save ?? sinon.fake(),
    listBy: mock.listBy ?? sinon.fake(),
  };
};

export const createMockedUserRepository = (mock: Partial<UserRepository> = {}): UserRepository => {
  return {
    save: mock.save ?? sinon.fake(),
    findBy: mock.findBy ?? sinon.fake(),
    listIn: mock.listIn ?? sinon.fake(),
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

export const createMockedEstimatePlayerUseCase = function createMockedEstimatePlayerUseCase(
  mock: Partial<EstimatePlayerUseCase> = {}
) {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as EstimatePlayerUseCase;
};

export const createMockedLeaveGameUseCase = function createMockedLeaveGameUseCase(
  mock: Partial<LeaveGameUseCase> = {}
) {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as LeaveGameUseCase;
};

export const createMockedUseCase = function createMockedUseCase<T extends UseCase<unknown>>(mock: Partial<T> = {}) {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as T;
};

export const createMockedJoinUserUseCase = function createMockedJoinUserUseCase(mock: Partial<JoinUserUseCase> = {}) {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as JoinUserUseCase;
};

export const createMockedCreateGameUseCase = function createMockedCreateGameUseCase(
  mock: Partial<CreateGameUseCase> = {}
) {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as CreateGameUseCase;
};

export const createMockedShowDownUseCase = function createMockedShowDownUseCase(mock: Partial<ShowDownUseCase> = {}) {
  return {
    execute: mock.execute ?? sinon.fake(),
  } as ShowDownUseCase;
};

export const createMockedAuthenticator = function createMockedAuthenticator(mock: Partial<Authenticator> = {}) {
  return {
    currentUserIdIfExists: mock.currentUserIdIfExists ?? sinon.fake(),
    signIn: mock.signIn ?? sinon.fake(),
    signUp: mock.signUp ?? sinon.fake(),
  } as Authenticator;
};

export const createMockedUserObserver = function createMockedUserObserver(mock: Partial<UserObserver> = {}) {
  return {
    subscribe: mock.subscribe ?? sinon.fake(),
    unsubscribe: mock.unsubscribe ?? sinon.fake(),
  } as UserObserver;
};

export const createMockedGameObserver = function createMockedGameObserver(mock: Partial<GameObserver> = {}) {
  return {
    subscribe: mock.subscribe ?? sinon.fake(),
    unsubscribe: mock.unsubscribe ?? sinon.fake(),
  } as GameObserver;
};

export const createMockedRoundObserver = function createMockedRoundObserver(mock: Partial<RoundObserver> = {}) {
  return {
    subscribe: mock.subscribe ?? sinon.fake(),
    unsubscribe: mock.unsubscribe ?? sinon.fake(),
  } as RoundObserver;
};

export const randomCards = function randomCards() {
  const length = Math.floor(Math.random() * 10) + 1;
  const cards = new Array(length);

  for (let i = 0; i < length; i++) {
    cards[i] = Math.floor(Math.random() * 100);
  }

  return SelectableCards.create(cards.map(StoryPoint.create));
};

/**
 * create random game for test usage
 */
export const randomGame = function randomGame(args: Partial<Parameters<typeof Game.create>[0]>) {
  return Game.create({
    id: args.id ?? Game.createId(),
    cards: args.cards ?? randomCards(),
    owner: args.owner ?? User.createId(),
    name: args.name ?? "random game",
    round: args.round ?? Round.createId(),
  })[0];
};

/**
 * create random round for test usage
 */
export const randomRound = function randomRound(args: Partial<Parameters<typeof Round.roundOf>[0]> = {}): Round.T {
  return Round.roundOf({
    id: args.id ?? Round.createId(),
    cards: args.cards ?? randomCards(),
    estimations: args.estimations ?? [],
    theme: args.theme,
  });
};

/**
 * create random round for test usage
 */
export const randomFinishedRound = function randomFinishedRound(
  args: Partial<Parameters<typeof Round.finishedRoundOf>[0]> = {}
): Round.FinishedRound {
  return Round.finishedRoundOf({
    id: args.id ?? Round.createId(),
    cards: args.cards ?? randomCards(),
    estimations: args.estimations ?? [],
    theme: args.theme,
    finishedAt: args.finishedAt ?? new Date().toISOString(),
  });
};

/**
 * create random game for test usage
 */
export const randomUser = function randomUser(args: Partial<Parameters<typeof User.create>[0]>) {
  return User.create({
    id: args.id ?? User.createId(),
    name: args.name ?? "random user",
  });
};
