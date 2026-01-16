import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./radio";

const meta: Meta<typeof Radio> = {
  title: "Form/Radio",
  component: Radio,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A radio button component for single selection from a group of options.",
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
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: "Option 1",
    name: "radio-group",
  },
};

export const Checked: Story = {
  args: {
    label: "Selected option",
    name: "radio-group",
    checked: true,
  },
};

export const RadioGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <Radio name="example" label="Option 1" value="1" />
      <Radio name="example" label="Option 2" value="2" />
      <Radio name="example" label="Option 3" value="3" />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: "Required option",
    name: "radio-group",
    error: true,
    helperText: "Please select an option",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled option",
    name: "radio-group",
    disabled: true,
  },
};
