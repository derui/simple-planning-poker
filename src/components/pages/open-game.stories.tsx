import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import OpenGamePage from "./open-game";
import twind from "@/twind.config.cjs";
import { createPureStore } from "@/status/store";

install(twind);

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
