import { Dependencies } from "@/dependencies";
import { createUserId } from "@/domains/user";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { RecoilRoot } from "recoil";
import React, { useEffect } from "react";
import { render } from "@testing-library/react";
import { flushPromisesAndTimers, RecoilObserver } from "@/lib.test";
import createUseSignUp from "./use-signup";
import currentUserState from "@/status/user/atoms/current-user-state";

test("do not update state if user is not found", async () => {
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
  const V = () => {
    let hook = useHook();

    useEffect(() => {
      hook("email", "password", callback);
    });

    return <></>;
  };

  render(
    <RecoilRoot>
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();

  expect(callback).not.toHaveBeenCalled();
  expect(userRepository.findBy).toHaveBeenCalledTimes(1);
  expect(authenticator.signUp).toHaveBeenCalledWith("email", "email", "password");
});

test("update state if user is found", async () => {
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
  const V = () => {
    let hook = useHook();

    useEffect(() => {
      hook("email", "password", () => {});
    });

    return <></>;
  };

  const onChange = jest.fn();

  render(
    <RecoilRoot>
      <RecoilObserver node={currentUserState} onChange={onChange} />
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();

  expect(onChange).toHaveBeenCalledWith({ id: createUserId("id"), name: "email", joinedGames: [] });
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
