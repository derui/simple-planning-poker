import { Dependencies } from "@/dependencies";
import { createUserId } from "@/domains/user";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { RecoilRoot } from "recoil";
import createUseSignIn from "./use-signin";
import React, { useEffect } from "react";
import { render } from "@testing-library/react";
import { flushPromisesAndTimers, RecoilObserver } from "@/lib.test";
import currentUserState from "../atoms/current-user";

test("do not update state if user is not found", async () => {
  const registrar = createDependencyRegistrar<Dependencies>();

  const authenticator = {
    signIn: jest.fn().mockImplementation(async () => createUserId("id")),
  };
  const userRepository = {
    findBy: jest.fn().mockImplementation(async () => undefined),
    save: jest.fn(),
  };

  registrar.register("authenticator", authenticator);
  registrar.register("userRepository", userRepository);

  const useHook = createUseSignIn(registrar);
  const callback = jest.fn();
  const V = () => {
    let hook = useHook();

    useEffect(() => {
      hook("email", "password", callback);
    });

    return <span />;
  };

  render(
    <RecoilRoot>
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();

  expect(callback).not.toBeCalled();
  expect(userRepository.findBy).toBeCalledTimes(1);
  expect(authenticator.signIn).toBeCalledWith("email", "password");
});

test("update state if user is found", async () => {
  const registrar = createDependencyRegistrar<Dependencies>();

  const authenticator = {
    signIn: jest.fn().mockImplementation(async () => createUserId("id")),
  };
  const userRepository = {
    findBy: jest.fn().mockImplementation(async () => ({})),
    save: jest.fn(),
  };

  registrar.register("authenticator", authenticator);
  registrar.register("userRepository", userRepository);

  const useHook = createUseSignIn(registrar);
  const V = () => {
    let hook = useHook();

    useEffect(() => {
      hook("email", "password", () => {});
    });

    return <span />;
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
