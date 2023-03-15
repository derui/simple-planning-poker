import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Provider } from "react-redux";
import { createMemoryRouter, RouterProvider } from "react-router";
import { RoundResultPage } from "./round-result";
import twind from "@/twind.config.cjs";
import { createPureStore } from "@/status/store";
import { openGameSuccess } from "@/status/actions/game";
import { randomGame, randomUser } from "@/test-lib";
import { UserMode } from "@/domains/game-player";
import * as Game from "@/domains/game";
import { tryAuthenticateSuccess } from "@/status/actions/signin";
import { giveUp, handed } from "@/domains/user-hand";
import { showDownSuccess } from "@/status/actions/round";

install(twind);

const meta = {
  title: "Page/Round Result",
  component: RoundResultPage,
  tags: ["autodocs"],
} satisfies Meta<typeof RoundResultPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render() {
    const store = createPureStore();

    const route = createMemoryRouter(
      [
        {
          path: "/:gameId",
          element: <RoundResultPage />,
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
    let game = randomGame({
      owner: owner.id,
      joinedPlayers: users.map((v) => ({ user: v.id, mode: UserMode.normal })),
    });
    store.dispatch(
      openGameSuccess({
        game,
        players: users,
      })
    );
    store.dispatch(tryAuthenticateSuccess({ user: owner }));
    game = Game.acceptPlayerHand(game, owner.id, giveUp());
    game = Game.acceptPlayerHand(game, users[0].id, handed(game.cards[0]));
    store.dispatch(showDownSuccess(Game.showDown(game, new Date())[0].round));

    const route = createMemoryRouter(
      [
        {
          path: "/:gameId",
          element: <RoundResultPage />,
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
