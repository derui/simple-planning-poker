import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Provider } from "react-redux";
import { Round } from "./round";
import twind from "@/twind.config.cjs";
import { createPureStore } from "@/status/store";
import { openGameSuccess } from "@/status/actions/game";
import { randomGame, randomUser } from "@/test-lib";
import { UserMode } from "@/domains/game-player";
import { tryAuthenticateSuccess } from "@/status/actions/signin";

install(twind);

const meta = {
  title: "Page/Round",
  component: Round,
  tags: ["autodocs"],
} satisfies Meta<typeof Round>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render() {
    const store = createPureStore();

    return (
      <Provider store={store}>
        <Round />
      </Provider>
    );
  },
};

export const Loaded: Story = {
  render() {
    const store = createPureStore();

    const users = [randomUser({}), randomUser({})];
    const owner = randomUser({});
    store.dispatch(
      openGameSuccess({
        game: randomGame({ owner: owner.id, joinedPlayers: users.map((v) => ({ user: v.id, mode: UserMode.normal })) }),
        players: users,
      })
    );
    store.dispatch(tryAuthenticateSuccess({ user: owner }));

    return (
      <Provider store={store}>
        <Round />
      </Provider>
    );
  },
};
