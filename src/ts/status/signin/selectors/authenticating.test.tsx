import { MutableSnapshot, RecoilRoot } from "recoil";
import signInState from "../atoms/signing";
import authenticatingState from "./authenticating";
import { render } from "@testing-library/react";
import React from "react";
import { flushPromisesAndTimers } from "@/lib.test";

test("user is not authenticating if state is default", async () => {
  const V = () => {
    const v = authenticatingState();

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

test("get authenticating", async () => {
  const snapshot = ({ set }: MutableSnapshot) => {
    set(signInState, (prev) => ({ ...prev, authenticating: true }));
  };

  const V = () => {
    const v = authenticatingState();

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
