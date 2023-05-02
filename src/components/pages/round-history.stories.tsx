import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import RoundHistoryPage from "./round-history";
import twind from "@/twind.config.cjs";
import { createPureStore } from "@/status/store";
import { openGameSuccess } from "@/status/actions/game";
import { randomFinishedRound, randomGame, randomUser } from "@/test-lib";
import { tryAuthenticateSuccess } from "@/status/actions/signin";
import { openFinishedRoundsSuccess, openRoundHistory } from "@/status/actions/round";

install(twind);

const meta = {
  title: "Page/Round History",
  component: RoundHistoryPage,
  tags: ["autodocs"],
} satisfies Meta<typeof RoundHistoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render() {
    const store = createPureStore();

    const route = createMemoryRouter(
      [
        {
          path: "/:gameId",
          element: <RoundHistoryPage />,
        },
      ],
      { initialEntries: ["/12345"] }
    );

    return (
      <Provider store={store}>
        <RouterProvider router={route} />
      </Provider>
    );
  },
};

export const Loaded: Story = {
  render() {
    const store = createPureStore();

    const users = [randomUser({}), randomUser({})];
    const owner = randomUser({});
    const game = randomGame({ owner: owner.id });
    store.dispatch(
      openGameSuccess({
        game,
        players: users,
      })
    );
    store.dispatch(tryAuthenticateSuccess({ user: owner }));
    const round = randomFinishedRound();
    store.dispatch(openFinishedRoundsSuccess([round]));
    store.dispatch(openRoundHistory(round.id));

    const route = createMemoryRouter(
      [
        {
          path: "/:gameId",
          element: <RoundHistoryPage />,
        },
      ],
      { initialEntries: [`/${game.id}`] }
    );

    return (
      <Provider store={store}>
        <RouterProvider router={route} />
      </Provider>
    );
  },
};
