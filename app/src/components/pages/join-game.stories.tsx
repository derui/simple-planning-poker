import type { Meta, StoryObj } from "@storybook/react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { JoinGamePage } from "./join-game";
import { createPureStore } from "@/status/store";

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
        <MemoryRouter>
          <JoinGamePage />
        </MemoryRouter>
      </Provider>
    );
  },
};
