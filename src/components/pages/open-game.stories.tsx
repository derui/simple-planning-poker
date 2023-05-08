import type { Meta, StoryObj } from "@storybook/react";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import OpenGamePage from "./open-game";
import { createPureStore } from "@/status/store";

const meta = {
  title: "Page/Open Game",
  component: OpenGamePage,
  tags: ["autodocs"],
} satisfies Meta<typeof OpenGamePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {
  render() {
    const store = createPureStore();

    return (
      <Provider store={store}>
        <MemoryRouter>
          <OpenGamePage />
        </MemoryRouter>
      </Provider>
    );
  },
};
