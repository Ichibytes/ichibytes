import type { Meta, StoryObj } from "@storybook/react";
import { LinkButton } from "./link-button";
import { Icon } from "../icon/icon";
import { ExternalLink, Github, ArrowRight } from "lucide-react";

const meta: Meta<typeof LinkButton> = {
  title: "Components/LinkButton",
  component: LinkButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A button component that renders as a link. Combines the visual appearance of a Button with the navigation behavior of a link. Supports external links and icon positioning.",
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
      description: "Whether the link opens in a new tab",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
      description: "The visual style variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "The size of the button",
    },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
      description: "Position of the icon relative to the text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LinkButton>;

export const Default: Story = {
  args: {
    href: "#",
    children: "Click me",
  },
};

export const External: Story = {
  args: {
    href: "https://github.com",
    external: true,
    children: "View on GitHub",
    icon: <Icon icon={ExternalLink} size={16} />,
  },
};

export const WithLeftIcon: Story = {
  args: {
    href: "https://github.com",
    external: true,
    children: "GitHub",
    icon: <Icon icon={Github} size={16} />,
    iconPosition: "left",
  },
};

export const WithArrow: Story = {
  args: {
    href: "#",
    children: "Learn More",
    icon: <Icon icon={ArrowRight} size={16} />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <LinkButton href="#" variant="primary">
        Primary
      </LinkButton>
      <LinkButton href="#" variant="secondary">
        Secondary
      </LinkButton>
      <LinkButton href="#" variant="outline">
        Outline
      </LinkButton>
      <LinkButton href="#" variant="ghost">
        Ghost
      </LinkButton>
      <LinkButton href="#" variant="danger">
        Danger
      </LinkButton>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <LinkButton href="#" size="sm">
        Small
      </LinkButton>
      <LinkButton href="#" size="md">
        Medium
      </LinkButton>
      <LinkButton href="#" size="lg">
        Large
      </LinkButton>
    </div>
  ),
};
