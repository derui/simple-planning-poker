import { Dependencies } from "@/dependencies";
import { createUserId } from "@/domains/user";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { createUseSignUp } from "./use-signup";
import { currentUserState } from "@/status/user/atoms/current-user-state";
import { createRoot } from "solid-js";

test("do not update state if user is not found", async () =>
  createRoot(async (dispose) => {
    const registrar = createDependencyRegistrar<Dependencies>();

    const authenticator = {
      signUp: jest.fn().mockImplementation(async () => createUserId("id")),
    };
    const userRepository = {
      findBy: jest.fn().mockImplementation(async () => undefined),
      save: jest.fn(),
    };

    registrar.register("authenticator", authenticator as any);
    registrar.register("userRepository", userRepository);

    const useHook = createUseSignUp(registrar);
    const callback = jest.fn();
    let hook = useHook();

    await hook("email", "password", callback);

    expect(callback).not.toHaveBeenCalled();
    expect(userRepository.findBy).toHaveBeenCalledTimes(1);
    expect(authenticator.signUp).toHaveBeenCalledWith("email", "email", "password");
    dispose();
  }));

test("update state if user is found", async () =>
  createRoot(async (dispose) => {
    const registrar = createDependencyRegistrar<Dependencies>();

    const authenticator = {
      signUp: jest.fn().mockImplementation(async () => createUserId("id")),
    };
    const userRepository = {
      findBy: jest.fn().mockImplementation(async () => ({ name: "email" })),
      save: jest.fn(),
    };

    registrar.register("authenticator", authenticator as any);
    registrar.register("userRepository", userRepository);

    const useHook = createUseSignUp(registrar);
    let hook = useHook();

    await hook("email", "password", () => {});

    const value = currentUserState();
    expect(value).toEqual({ id: createUserId("id"), name: "email", joinedGames: [] });
    dispose;
  }));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
