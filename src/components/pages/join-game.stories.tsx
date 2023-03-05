import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Provider } from "react-redux";
import { JoinGamePage } from "./join-game";
import twind from "@/twind.config.cjs";
import { createPureStore } from "@/status/store";

install(twind);

const meta = {
  title: "Page/Join Game",
  component: JoinGamePage,
  tags: ["autodocs"],
} satisfies Meta<typeof JoinGamePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  render() {
    const store = createPureStore();

    return (
      <Provider store={store}>
        <JoinGamePage />
      </Provider>
    );
  },
};