import { Dependencies } from "@/dependencies";
import { createUserId } from "@/domains/user";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { createMockedGameRepository } from "@/lib.test";
import { createUseApplyAuthenticated } from "./use-apply-authenticated";
import { createRoot } from "solid-js";

test("call error callback if user is not found", () =>
  createRoot(async (dispose) => {
    const registrar = createDependencyRegistrar<Dependencies>();

    const authenticator = {
      currentUserIdIfExists: jest.fn().mockImplementation(async () => undefined),
    };
    const userRepository = {
      findBy: jest.fn().mockImplementation(async () => undefined),
      save: jest.fn(),
    };

    registrar.register("authenticator", authenticator as any);
    registrar.register("userRepository", userRepository);
    registrar.register("gameRepository", createMockedGameRepository());

    const useHook = createUseApplyAuthenticated(registrar);
    const callback = jest.fn();

    let hook = useHook();
    await hook(() => {}, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    dispose();
  }));

test("update state if user is found", () =>
  createRoot(async (dispose) => {
    const registrar = createDependencyRegistrar<Dependencies>();

    const authenticator = {
      currentUserIdIfExists: jest.fn().mockImplementation(async () => createUserId("id")),
    };
    const userRepository = {
      findBy: jest.fn().mockImplementation(async () => ({ id: createUserId("id"), name: "name", joinedGames: [] })),
      save: jest.fn(),
    };
    const gameRepository = createMockedGameRepository();
    gameRepository.findBy.mockImplementation(async () => {});

    registrar.register("authenticator", authenticator as any);
    registrar.register("userRepository", userRepository);
    registrar.register("gameRepository", gameRepository);

    const useHook = createUseApplyAuthenticated(registrar);
    const callback = jest.fn();
    let hook = useHook();

    await hook(callback, () => {});

    expect(callback).toHaveBeenCalledTimes(1);
    dispose();
  }));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
