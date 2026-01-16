import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "Form/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A textarea component for multi-line text input with error states and helper text support.",
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
    rows: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Enter your message...",
  },
};

export const WithValue: Story = {
  args: {
    value: "This is a sample textarea content.",
    placeholder: "Enter your message...",
  },
};

export const WithError: Story = {
  args: {
    error: true,
    placeholder: "Enter your message...",
    helperText: "This field is required",
  },
};

export const WithHelperText: Story = {
  args: {
    placeholder: "Enter your message...",
    helperText: "Maximum 500 characters",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "This textarea is disabled",
  },
};
