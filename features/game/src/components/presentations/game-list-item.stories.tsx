import type { Meta, StoryObj } from "@storybook/react";

import { GameListItem } from "./game-list-item.js";
import { MemoryRouter } from "react-router-dom";

const meta = {
  title: "Presentations/Game List Item",
  component: GameListItem,
  tags: ["autodocs"],
} satisfies Meta<typeof GameListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Joined: Story = {
  args: {
    name: "Test",
  },
  render(args) {
    return (
      <MemoryRouter>
        <GameListItem {...args} />
      </MemoryRouter>
    );
  },
};

export const Owned: Story = {
  args: {
    owned: true,
    name: "Test",
  },
  render(args) {
    return (
      <MemoryRouter>
        <GameListItem {...args} />
      </MemoryRouter>
    );
  },
};
