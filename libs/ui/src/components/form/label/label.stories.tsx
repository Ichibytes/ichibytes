import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";

const meta: Meta<typeof Label> = {
  title: "Form/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A label component for form fields with optional required indicator.",
      },
    },
  },
  argTypes: {
    required: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Label",
  },
};

export const Required: Story = {
  args: {
    required: true,
    children: "Required Field",
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <input
        id="email"
        type="email"
        className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm"
        placeholder="email@example.com"
      />
    </div>
  ),
};
