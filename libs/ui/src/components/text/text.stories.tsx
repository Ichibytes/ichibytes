import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A flexible text component that supports multiple HTML elements (p, span, div, label, small, strong, em) with customizable size, weight, color, and alignment. Provides semantic HTML while allowing visual flexibility.",
      },
    },
  },
  argTypes: {
    as: {
      control: "select",
      options: ["p", "span", "div", "label", "small", "strong", "em"],
      description: "The HTML element to render",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "base", "lg", "xl", "2xl"],
      description: "The font size",
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold"],
      description: "The font weight",
    },
    color: {
      control: "select",
      options: [
        "default",
        "secondary",
        "muted",
        "primary",
        "error",
        "success",
        "warning",
      ],
      description: "The text color variant",
    },
    align: {
      control: "select",
      options: ["left", "center", "right", "justify"],
      description: "The text alignment",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: "This is default text",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-2">
      <Text size="xs">Extra small text (xs)</Text>
      <Text size="sm">Small text (sm)</Text>
      <Text size="base">Base text (base)</Text>
      <Text size="lg">Large text (lg)</Text>
      <Text size="xl">Extra large text (xl)</Text>
      <Text size="2xl">2X large text (2xl)</Text>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="space-y-2">
      <Text weight="normal">Normal weight text</Text>
      <Text weight="medium">Medium weight text</Text>
      <Text weight="semibold">Semibold weight text</Text>
      <Text weight="bold">Bold weight text</Text>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="space-y-2">
      <Text color="default">Default color text</Text>
      <Text color="secondary">Secondary color text</Text>
      <Text color="muted">Muted color text</Text>
      <Text color="primary">Primary color text</Text>
      <Text color="success">Success color text</Text>
      <Text color="warning">Warning color text</Text>
      <Text color="error">Error color text</Text>
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="space-y-4">
      <Text align="left">Left aligned text</Text>
      <Text align="center">Center aligned text</Text>
      <Text align="right">Right aligned text</Text>
      <Text align="justify">
        Justified text that spreads across the full width of the container. This
        is useful for longer paragraphs where you want the text to align evenly
        on both sides.
      </Text>
    </div>
  ),
};

export const AsSpan: Story = {
  args: {
    as: "span",
    children: "This is a span element",
  },
};

export const AsStrong: Story = {
  args: {
    as: "strong",
    weight: "bold",
    children: "This is strong text",
  },
};

export const AllElements: Story = {
  render: () => (
    <div className="space-y-3">
      <Text as="p">Paragraph (p) - Default element</Text>
      <Text as="span">Span element - Inline text</Text>
      <Text as="div">Div element - Block container</Text>
      <Text as="label">Label element - Form label</Text>
      <Text as="small">Small element - Fine print</Text>
      <Text as="strong" weight="bold">
        Strong element - Important text
      </Text>
      <Text as="em">Emphasis element - Emphasized text</Text>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Text size="2xl" weight="bold" color="primary">
        Article Title
      </Text>
      <Text size="sm" color="muted">
        Published on January 16, 2024
      </Text>
      <Text size="base" color="default" align="justify">
        This is a paragraph of body text that demonstrates how the Text
        component can be used in a real-world context. It supports multiple
        sizes, weights, and colors to create a rich typographic hierarchy.
      </Text>
      <Text size="base" color="secondary">
        Secondary text can be used for less important information or supporting
        content.
      </Text>
      <div className="pt-2">
        <Text as="small" size="xs" color="muted">
          Footer text or disclaimers can use the small element with muted color.
        </Text>
      </div>
    </div>
  ),
};
