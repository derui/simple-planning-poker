import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { RoundPage } from "./round";
import twind from "@/twind.config.cjs";
import { createPureStore } from "@/status/store";
import { openGameSuccess } from "@/status/actions/game";
import { randomGame, randomRound, randomUser } from "@/test-lib";
import { tryAuthenticateSuccess } from "@/status/actions/signin";
import { joinUserAsPlayer, makeInvitation } from "@/domains/game";
import { notifyRoundUpdated } from "@/status/actions/round";

install(twind);

const meta = {
  title: "Page/Round",
  component: RoundPage,
  tags: ["autodocs"],
} satisfies Meta<typeof RoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render() {
    const store = createPureStore();

    return (
      <Provider store={store}>
        <MemoryRouter>
          <RoundPage />
        </MemoryRouter>
      </Provider>
    );
  },
};

export const Loaded: Story = {
  render() {
    const store = createPureStore();

    const users = [randomUser({}), randomUser({})];
    const owner = randomUser({});

    let game = randomGame({ owner: owner.id });
    users.forEach((user) => {
      game = joinUserAsPlayer(game, user.id, makeInvitation(game))[0];
    });
    let round = randomRound({ cards: game.cards });

    store.dispatch(
      openGameSuccess({
        game,
        players: users,
      })
    );
    store.dispatch(tryAuthenticateSuccess({ user: owner }));
    store.dispatch(notifyRoundUpdated(round));

    return (
      <Provider store={store}>
        <MemoryRouter>
          <RoundPage />
        </MemoryRouter>
      </Provider>
    );
  },
};
