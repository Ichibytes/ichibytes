import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./heading";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible heading component that supports all HTML heading levels (h1-h6) with customizable sizes. Provides semantic HTML while allowing visual flexibility.",
      },
    },
  },
  argTypes: {
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      description: "The HTML heading element to render",
    },
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
      ],
      description:
        "The visual size of the heading (independent of the semantic level)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: {
    children: "Heading Text",
  },
};

export const H1: Story = {
  args: {
    as: "h1",
    children: "Heading 1",
  },
};

export const H2: Story = {
  args: {
    as: "h2",
    children: "Heading 2",
  },
};

export const H3: Story = {
  args: {
    as: "h3",
    children: "Heading 3",
  },
};

export const CustomSize: Story = {
  args: {
    as: "h2",
    size: "5xl",
    children: "Custom Size Heading",
  },
};

export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading as="h1">Heading 1</Heading>
      <Heading as="h2">Heading 2</Heading>
      <Heading as="h3">Heading 3</Heading>
      <Heading as="h4">Heading 4</Heading>
      <Heading as="h5">Heading 5</Heading>
      <Heading as="h6">Heading 6</Heading>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading size="xs">Extra Small (xs)</Heading>
      <Heading size="sm">Small (sm)</Heading>
      <Heading size="md">Medium (md)</Heading>
      <Heading size="lg">Large (lg)</Heading>
      <Heading size="xl">Extra Large (xl)</Heading>
      <Heading size="2xl">2X Large (2xl)</Heading>
      <Heading size="3xl">3X Large (3xl)</Heading>
      <Heading size="4xl">4X Large (4xl)</Heading>
      <Heading size="5xl">5X Large (5xl)</Heading>
      <Heading size="6xl">6X Large (6xl)</Heading>
    </div>
  ),
};

export const SemanticVsVisual: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
          Semantic h2 with default size (3xl):
        </p>
        <Heading as="h2">This is an h2 element</Heading>
      </div>
      <div>
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
          Semantic h2 with custom size (5xl):
        </p>
        <Heading as="h2" size="5xl">
          This is also an h2, but visually larger
        </Heading>
      </div>
      <div>
        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
          Semantic h4 with large size:
        </p>
        <Heading as="h4" size="lg">
          This is an h4, but visually larger than default
        </Heading>
      </div>
    </div>
  ),
};
