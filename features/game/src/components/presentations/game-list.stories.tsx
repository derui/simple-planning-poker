import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { GameList } from "./game-list.js";

const meta: Meta<typeof GameList> = {
  title: "Presentations/Game List",
  component: GameList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    games: [
      { id: "id1", name: "Normal game", owned: false },
      { id: "id2", name: "Long name game", owned: true },
    ],
  },
  render(args) {
    return (
      <div className={themeClass}>
        <GameList {...args} />
      </div>
    );
  },
};
