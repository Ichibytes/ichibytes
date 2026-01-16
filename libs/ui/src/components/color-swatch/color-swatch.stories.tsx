import type { Meta, StoryObj } from "@storybook/react";
import { ColorSwatch } from "./color-swatch";
import { colors } from "../../tokens";

const meta: Meta<typeof ColorSwatch> = {
  title: "Components/ColorSwatch",
  component: ColorSwatch,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A component for displaying color swatches with their name and hex value. Useful for showcasing design system colors.",
      },
    },
  },
  argTypes: {
    color: {
      control: "color",
      description: "The color value (hex, rgb, etc.)",
    },
    name: {
      control: "text",
      description: "The name of the color",
    },
    value: {
      control: "text",
      description: "The color value to display (defaults to color prop)",
    },
    showValue: {
      control: "boolean",
      description: "Whether to show the color value below the swatch",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorSwatch>;

export const Default: Story = {
  args: {
    color: "#0ea5e9",
    name: "Primary 500",
    value: "#0ea5e9",
  },
};

export const WithoutValue: Story = {
  args: {
    color: "#0ea5e9",
    name: "Primary 500",
    showValue: false,
  },
};

export const DesignSystemColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      <ColorSwatch
        color={colors.primary[500]}
        name="Primary"
        value={colors.primary[500]}
      />
      <ColorSwatch
        color={colors.secondary[500]}
        name="Secondary"
        value={colors.secondary[500]}
      />
      <ColorSwatch
        color={colors.success[500]}
        name="Success"
        value={colors.success[500]}
      />
      <ColorSwatch
        color={colors.error[500]}
        name="Error"
        value={colors.error[500]}
      />
      <ColorSwatch
        color={colors.warning[500]}
        name="Warning"
        value={colors.warning[500]}
      />
    </div>
  ),
};
