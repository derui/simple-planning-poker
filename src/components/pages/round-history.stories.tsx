import type { Meta, StoryObj } from "@storybook/react";

import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import RoundHistoryPage from "./round-history";
import { createPureStore } from "@/status/store";
import { openGameSuccess } from "@/status/actions/game";
import { randomFinishedRound, randomGame, randomUser } from "@/test-lib";
import { tryAuthenticateSuccess } from "@/status/actions/signin";
import { openFinishedRoundsSuccess, openRoundHistory } from "@/status/actions/round";
import { estimated } from "@/domains/user-estimation";
import { notifyOtherUserChanged } from "@/status/actions/user";
import { between } from "@/utils/array";

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
    const round = randomFinishedRound({
      theme: "something",
      cards: game.cards,
      estimations: [{ user: owner.id, estimation: estimated(game.cards[0]) }],
    });
    store.dispatch(notifyOtherUserChanged({ id: users[0].id, name: users[0].name }));
    store.dispatch(notifyOtherUserChanged({ id: users[1].id, name: users[1].name }));
    store.dispatch(openFinishedRoundsSuccess([round]));
    store.dispatch(openRoundHistory(round.id));

    // this line is hack
    store.replaceReducer((state) => state!);

    const route = createMemoryRouter(
      [
        {
          path: "/:gameId/:roundId",
          element: <RoundHistoryPage />,
        },
      ],
      { initialEntries: [`/${game.id}/${round.id}`] }
    );

    return (
      <Provider store={store}>
        <RouterProvider router={route} />
      </Provider>
    );
  },
};

export const LargeHistories: Story = {
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
    const round = randomFinishedRound({
      theme: "something",
      cards: game.cards,
      estimations: [{ user: owner.id, estimation: estimated(game.cards[0]) }],
    });
    store.dispatch(notifyOtherUserChanged({ id: users[0].id, name: users[0].name }));
    store.dispatch(notifyOtherUserChanged({ id: users[1].id, name: users[1].name }));
    store.dispatch(
      openFinishedRoundsSuccess([round].concat(between(0, 10).map((n) => randomFinishedRound({ theme: `Round ${n}` }))))
    );
    store.dispatch(openRoundHistory(round.id));

    // this line is hack
    store.replaceReducer((state) => state!);

    const route = createMemoryRouter(
      [
        {
          path: "/:gameId/:roundId",
          element: <RoundHistoryPage />,
        },
      ],
      { initialEntries: [`/${game.id}/${round.id}`] }
    );

    return (
      <Provider store={store}>
        <RouterProvider router={route} />
      </Provider>
    );
  },
};
