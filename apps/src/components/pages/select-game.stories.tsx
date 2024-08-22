import type { Meta, StoryObj } from "@storybook/react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { SelectGamePage } from "./select-game";
import { createPureStore } from "@/status/store";
import { signInSuccess } from "@/status/actions/signin";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { JoinedGameState } from "@/domains/game-repository";

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
          [Game.createId()]: { name: "name", state: JoinedGameState.joined },
          [Game.createId()]: { name: "long name", state: JoinedGameState.joined },
          [Game.createId()]: { name: "looooong name", state: JoinedGameState.joined },
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
