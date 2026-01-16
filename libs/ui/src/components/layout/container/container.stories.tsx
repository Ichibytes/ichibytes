import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./container";

const meta: Meta<typeof Container> = {
  title: "Layout/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A container component that centers content and applies responsive max-width constraints.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: (
      <div className="rounded-lg border border-secondary-200 bg-white p-8 text-center">
        Container content
      </div>
    ),
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: (
      <div className="rounded-lg border border-secondary-200 bg-white p-8 text-center">
        Small container
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: (
      <div className="rounded-lg border border-secondary-200 bg-white p-8 text-center">
        Large container
      </div>
    ),
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
    children: (
      <div className="rounded-lg border border-secondary-200 bg-white p-8 text-center">
        Extra large container
      </div>
    ),
  },
};
