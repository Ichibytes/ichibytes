import type { Meta, StoryObj } from "@storybook/react";
import { Ichibytes } from "./ichibytes";

const meta: Meta<typeof Ichibytes> = {
  title: "Welcome/Ichibytes",
  component: Ichibytes,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Ichibytes>;

export const Default: Story = {
  args: {},
};
