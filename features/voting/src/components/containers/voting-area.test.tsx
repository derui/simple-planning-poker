import { cleanup, render, screen } from "@testing-library/react";
import { test, expect, afterEach } from "vitest";
import { userEvent } from "@testing-library/user-event";
import { Hooks, ImplementationProvider } from "../../hooks/facade.js";
import { createStore, Provider } from "jotai";
import { ApplicablePoints, Estimations, StoryPoint, User, Voter, Voting } from "@spp/shared-domain";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { VotingStatus } from "../../atoms/voting.js";
import { VotingArea } from "./voting-area.js";
import sinon from "sinon";

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
    }),
    useRevealed: sinon.fake(),
    usePollingPlace: sinon.fake.returns({
      estimations: [{ name: "player1", estimated: false }],
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
