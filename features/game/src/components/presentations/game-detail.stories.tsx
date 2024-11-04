import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { GameDetail } from "./game-detail.js";

const meta: Meta<typeof GameDetail> = {
  title: "Presentations/Game Detail",
  component: GameDetail,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Game",
    points: "1,2,3,4,5,6",
  },
  render(args) {
    return (
      <div className={themeClass} style={{ height: "500px" }}>
        <GameDetail {...args} />
      </div>
    );
  },
};
