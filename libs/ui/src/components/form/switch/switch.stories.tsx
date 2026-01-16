import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
  title: "Form/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A switch component (toggle) for boolean input with optional label and helper text.",
      },
    },
  },
  argTypes: {
    error: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    checked: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    label: "Enable notifications",
  },
};

export const Checked: Story = {
  args: {
    label: "Notifications enabled",
    checked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Dark mode",
    helperText: "Toggle dark mode theme",
  },
};

export const WithError: Story = {
  args: {
    label: "Required setting",
    error: true,
    helperText: "This setting is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled switch",
    disabled: true,
  },
};
