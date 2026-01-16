import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./box";

const meta: Meta<typeof Box> = {
  title: "Layout/Box",
  component: Box,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A simple box component that serves as a base for building other components. Accepts all standard HTML div props and className.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  args: {
    children: "Box content",
    className: "rounded-lg border border-secondary-200 bg-white p-4",
  },
};

export const WithCustomStyles: Story = {
  args: {
    children: "Custom styled box",
    className:
      "rounded-lg bg-primary-100 border-2 border-primary-500 p-8 text-primary-900",
  },
};
