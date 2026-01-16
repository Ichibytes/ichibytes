import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "./stack";

const meta: Meta<typeof Stack> = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A stack component for arranging children in a row or column with consistent spacing.",
      },
    },
  },
  argTypes: {
    direction: {
      control: "select",
      options: ["row", "column"],
    },
    spacing: {
      control: "select",
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Column: Story = {
  args: {
    direction: "column",
    spacing: 4,
    children: (
      <>
        <div className="rounded border border-secondary-200 bg-white p-4">
          Item 1
        </div>
        <div className="rounded border border-secondary-200 bg-white p-4">
          Item 2
        </div>
        <div className="rounded border border-secondary-200 bg-white p-4">
          Item 3
        </div>
      </>
    ),
  },
};

export const Row: Story = {
  args: {
    direction: "row",
    spacing: 4,
    children: (
      <>
        <div className="rounded border border-secondary-200 bg-white p-4">
          Item 1
        </div>
        <div className="rounded border border-secondary-200 bg-white p-4">
          Item 2
        </div>
        <div className="rounded border border-secondary-200 bg-white p-4">
          Item 3
        </div>
      </>
    ),
  },
};

export const Centered: Story = {
  args: {
    direction: "column",
    spacing: 4,
    align: "center",
    justify: "center",
    children: (
      <>
        <div className="rounded border border-secondary-200 bg-white p-4">
          Centered
        </div>
        <div className="rounded border border-secondary-200 bg-white p-4">
          Content
        </div>
      </>
    ),
  },
};
