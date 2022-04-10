import { MutableSnapshot, RecoilRoot, useRecoilValue } from "recoil";
import { render } from "@testing-library/react";
import { flushPromisesAndTimers } from "@/lib.test";
import React from "react";
import authenticatedState from "./authenticated-state";
import signInState from "../atoms/signin-state";

test("user is not authenticated if state is default", async () => {
  const V = () => {
    const v = useRecoilValue(authenticatedState);

    expect(v).toEqual(false);

    return <></>;
  };

  render(
    <RecoilRoot>
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();
});

test("user is authenticated if user is setted", async () => {
  const snapshot = ({ set }: MutableSnapshot) => {
    set(signInState, (prev) => ({ ...prev, authenticated: true }));
  };

  const V = () => {
    const v = useRecoilValue(authenticatedState);

    expect(v).toEqual(true);

    return <></>;
  };

  render(
    <RecoilRoot initializeState={snapshot}>
      <V />
    </RecoilRoot>
  );

  await flushPromisesAndTimers();
});

beforeEach(() => {
  jest.useFakeTimers();
});
afterEach(() => {
  jest.useRealTimers();
});
