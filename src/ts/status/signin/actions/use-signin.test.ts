import { Dependencies } from "@/dependencies";
import { createUserId } from "@/domains/user";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { createUseSignIn } from "./use-signin";
import { currentUserState } from "@/status/user/atoms/current-user-state";
import { createRoot } from "solid-js";

test("do not update state if user is not found", async () =>
  createRoot(async (dispose) => {
    const registrar = createDependencyRegistrar<Dependencies>();

    const authenticator = {
      signIn: jest.fn().mockImplementation(async () => createUserId("id")),
    };
    const userRepository = {
      findBy: jest.fn().mockImplementation(async () => undefined),
      save: jest.fn(),
    };

    registrar.register("authenticator", authenticator as any);
    registrar.register("userRepository", userRepository);

    const useHook = createUseSignIn(registrar);
    const callback = jest.fn();
    const hook = useHook();

    await hook("email", "password", callback);

    expect(callback).not.toHaveBeenCalled();
    expect(userRepository.findBy).toHaveBeenCalledTimes(1);
    expect(authenticator.signIn).toHaveBeenCalledWith("email", "password");
    dispose();
  }));

test("update state if user is found", async () =>
  createRoot(async (dispose) => {
    const registrar = createDependencyRegistrar<Dependencies>();

    const authenticator = {
      signIn: jest.fn().mockImplementation(async () => createUserId("id")),
    };
    const userRepository = {
      findBy: jest.fn().mockImplementation(async () => ({ name: "name" })),
      save: jest.fn(),
    };

    registrar.register("authenticator", authenticator as any);
    registrar.register("userRepository", userRepository);

    const useHook = createUseSignIn(registrar);
    let hook = useHook();

    await hook("email", "password", () => {});

    const value = currentUserState();

    expect(value).toEqual({ id: createUserId("id"), name: "name", joinedGames: [] });
    dispose();
  }));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
