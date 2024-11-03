import { cleanup, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { afterEach, expect, test } from "vitest";
import { VotingStatus } from "../../atoms/voting.js";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { VotingArea } from "./voting-area.js";

afterEach(cleanup);

test("Pass valid states to child component", async () => {
  // Arrange
  const store = createStore();

  const hooks: Hooks = {
    useJoin: sinon.fake(),
    useVoting: sinon.fake.returns<[], ReturnType<Hooks["useVoting"]>>({
      changeTheme: sinon.fake(),
      changeVoterRole: sinon.fake(),
      estimate: sinon.fake(),
      reveal: sinon.fake(),
      revealable: true,
    }),
    useRevealed: sinon.fake(),
    usePollingPlace: sinon.fake.returns({
      estimations: [{ name: "player1" }],
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
        <VotingArea />
      </Provider>
    </ImplementationProvider>
  );

  // Assert
  expect(screen.getByRole("tab", { name: "1" })).not.toBeNull();
  expect(screen.getByRole("tab", { name: "1" })).not.toBeNull();
});
