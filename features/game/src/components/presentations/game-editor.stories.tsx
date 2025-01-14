import type { Meta, StoryObj } from "@storybook/react";

import { themeClass } from "@spp/ui-theme";
import { GameEditor } from "./game-editor.js";

const meta: Meta<typeof GameEditor> = {
  title: "Presentations/GameEditor",
  component: GameEditor,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render() {
    return (
      <div className={themeClass}>
        <GameEditor />
      </div>
    );
  },
};

export const Errors: Story = {
  render() {
    return (
      <div className={themeClass}>
        <GameEditor errors={["InvalidName"]} />
      </div>
    );
  },
};
