import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./link";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A styled link component with multiple variants for different use cases. Supports external links with proper security attributes.",
      },
    },
  },
  argTypes: {
    href: {
      control: "text",
      description: "The URL to navigate to",
    },
    external: {
      control: "boolean",
      description:
        "Whether the link opens in a new tab (adds noopener noreferrer)",
    },
    variant: {
      control: "select",
      options: ["default", "primary", "muted", "underline"],
      description: "The visual style variant",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    href: "#",
    children: "Default Link",
  },
};

export const Primary: Story = {
  args: {
    href: "#",
    variant: "primary",
    children: "Primary Link",
  },
};

export const Muted: Story = {
  args: {
    href: "#",
    variant: "muted",
    children: "Muted Link",
  },
};

export const Underline: Story = {
  args: {
    href: "#",
    variant: "underline",
    children: "Underlined Link",
  },
};

export const External: Story = {
  args: {
    href: "https://example.com",
    external: true,
    children: "External Link",
  },
};

export const InText: Story = {
  render: () => (
    <p className="text-base text-secondary-700 dark:text-secondary-300">
      This is a paragraph with a{" "}
      <Link href="#" variant="primary">
        primary link
      </Link>{" "}
      inside it. You can also have a{" "}
      <Link href="#" variant="underline">
        underlined link
      </Link>{" "}
      for emphasis.
    </p>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Link href="#" variant="default">
          Default Link
        </Link>
      </div>
      <div>
        <Link href="#" variant="primary">
          Primary Link
        </Link>
      </div>
      <div>
        <Link href="#" variant="muted">
          Muted Link
        </Link>
      </div>
      <div>
        <Link href="#" variant="underline">
          Underlined Link
        </Link>
      </div>
    </div>
  ),
};
