import type { Meta, StoryObj } from "@storybook/react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { CreateGamePage } from "./create-game";
import { createPureStore } from "@/status/store";

const meta = {
  title: "Page/Create Game",
  component: CreateGamePage,
  tags: ["autodocs"],
} satisfies Meta<typeof CreateGamePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  render() {
    const store = createPureStore();

    return (
      <Provider store={store}>
        <MemoryRouter>
          <CreateGamePage />
        </MemoryRouter>
      </Provider>
    );
  },
};
