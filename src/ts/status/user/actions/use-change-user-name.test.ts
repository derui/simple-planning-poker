import { Dependencies } from "@/dependencies";
import { createUserId } from "@/domains/user";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { flushPromisesAndTimers } from "@/lib.test";
import { createUseChangeUserName } from "./use-change-user-name";
import { setCurrentUserState } from "../atoms/current-user-state";
import { createRoot } from "solid-js";

test("do not execute use case if not logged in", async () =>
  createRoot(async (dispose) => {
    const registrar = createDependencyRegistrar<Dependencies>();

    const useCase = {
      execute: jest.fn().mockImplementation(async () => undefined),
    };

    registrar.register("changeUserNameUseCase", useCase as any);

    const useHook = createUseChangeUserName(registrar);
    let hook = useHook();
    hook("name");

    await flushPromisesAndTimers();

    expect(useCase.execute).toHaveBeenCalledTimes(0);
    dispose();
  }));

test("execute use case and update state", async () =>
  createRoot(async (dispose) => {
    const registrar = createDependencyRegistrar<Dependencies>();

    const useCase = {
      execute: jest.fn().mockImplementation(async () => undefined),
    };

    registrar.register("changeUserNameUseCase", useCase as any);
    const currentUser = { id: createUserId("id"), name: "", joinedGames: [] };
    setCurrentUserState(currentUser);

    const useHook = createUseChangeUserName(registrar);
    let hook = useHook();
    hook("name");

    await flushPromisesAndTimers();

    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(useCase.execute).toHaveBeenCalledWith({ userId: createUserId("id"), name: "name" });
    dispose();
  }));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
