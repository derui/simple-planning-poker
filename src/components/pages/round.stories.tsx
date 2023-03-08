import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { Provider } from "react-redux";
import { Round } from "./round";
import twind from "@/twind.config.cjs";
import { createPureStore } from "@/status/store";

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
