import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { SelectGamePage } from "./select-game";
import twind from "@/twind.config.cjs";
import { createPureStore } from "@/status/store";
import { signInSuccess } from "@/status/actions/signin";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";

install(twind);

const meta = {
  title: "Page/Select Game",
  component: SelectGamePage,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectGamePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render() {
    const store = createPureStore();

    return (
      <Provider store={store}>
        <MemoryRouter>
          <SelectGamePage />
        </MemoryRouter>
      </Provider>
    );
  },
};

export const SomeGames: Story = {
  render() {
    const store = createPureStore();
    const user = User.create({ id: User.createId(), name: "foo" });

    store.dispatch(
      signInSuccess({
        user,
        joinedGames: {
          [Game.createId()]: "name",
          [Game.createId()]: "long name",
          [Game.createId()]: "looooong name",
        },
      })
    );

    return (
      <Provider store={store}>
        <MemoryRouter>
          <SelectGamePage />
        </MemoryRouter>
      </Provider>
    );
  },
};
