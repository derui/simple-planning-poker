import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { MemoryRouter } from "react-router-dom";
import { GameListItem } from "./game-list-item.js";

const meta: Meta<typeof GameListItem> = {
  title: "Presentations/Game List Item",
  component: GameListItem,
  args: {
    gameId: "id",
    name: "Test",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Joined: Story = {
  args: {
    gameId: "foo",
    name: "Test",
  },
  render(args) {
    return (
      <MemoryRouter>
        <div className={themeClass}>
          <GameListItem {...args} />
        </div>
      </MemoryRouter>
    );
  },
};

export const Owned: Story = {
  args: {
    gameId: "foo",
    owned: true,
    name: "Test",
  },
  render(args) {
    return (
      <MemoryRouter>
        <div className={themeClass}>
          <GameListItem {...args} />
        </div>
      </MemoryRouter>
    );
  },
};
