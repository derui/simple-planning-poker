import type { Meta, StoryObj } from "@storybook/react";

import { install } from "@twind/core";

import { RoundThemeEditor } from "./round-theme-editor";
import twind from "@/twind.config.cjs";

install(twind);

const meta = {
  title: "Presentational/Round Theme Editor",
  component: RoundThemeEditor,
  tags: ["autodocs"],
} satisfies Meta<typeof RoundThemeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoTheme: Story = {
  render() {
    return <RoundThemeEditor />;
  },
};

export const InitialTheme: Story = {
  render() {
    return <RoundThemeEditor initialTheme="Initial theme" />;
  },
};

export const NotEditable: Story = {
  render() {
    return <RoundThemeEditor initialTheme="Initial theme" editable={false} />;
  },
};

export const Loading: Story = {
  render() {
    return <RoundThemeEditor initialTheme="Initial theme" loading />;
  },
};
