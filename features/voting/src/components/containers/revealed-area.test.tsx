import { cleanup, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { VotingStatus } from "../../atoms/voting.js";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { RevealedArea } from "./revealed-area.js";

afterEach(cleanup);

test("Pass valid states to child component", async () => {
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useJoin: sinon.fake(),
    useVoting: sinon.fake(),
    useRevealed: sinon.fake.returns({
      changeTheme: sinon.fake(),
      reset: sinon.fake(),
    }),
    usePollingPlace: sinon.fake.returns({
      estimations: [{ name: "player1" }, { name: "player2" }],
      inspectors: [],
      loading: false,
      points: ["1", "2"],
      userRole: "player",
      theme: "",
    }),
    useVotingStatus: sinon.fake.returns({
      status: VotingStatus.Voting,
    }),
  };

  // Act
  render(
    <ImplementationProvider implementation={hooks}>
      <Provider store={store}>
        <RevealedArea />
      </Provider>
    </ImplementationProvider>
  );

  // Assert
  expect(screen.getByText("player1")).not.toBeNull();
  expect(screen.getByText("player2")).not.toBeNull();
});
