import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./stat-card";
import { Icon } from "../icon";
import { Layout, FileText, Palette } from "lucide-react";

const meta: Meta<typeof StatCard> = {
  title: "Components/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A card component designed for displaying statistics or metrics. Shows a label, value, optional icon, and optional description.",
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "The label text for the statistic",
    },
    value: {
      control: "text",
      description: "The main value to display (can be string or number)",
    },
    description: {
      control: "text",
      description: "Optional description text below the value",
    },
    icon: {
      description: "Optional icon element to display",
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

const ComponentIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
    />
  </svg>
);

export const Default: Story = {
  args: {
    label: "Total Components",
    value: "20+",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Components",
    value: "20+",
    icon: <ComponentIcon />,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Components",
    value: "20+",
    icon: <ComponentIcon />,
    description: "Reusable React components",
  },
};

export const WithLucideIcon: Story = {
  args: {
    label: "Components",
    value: "20+",
    icon: <Icon icon={Layout} size={32} />,
    description: "Reusable React components",
  },
};

export const MultipleStats: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        label="Components"
        value="20+"
        icon={<Icon icon={Layout} size={32} />}
        description="Reusable React components"
      />
      <StatCard
        label="Form Components"
        value="6"
        icon={<Icon icon={FileText} size={32} />}
        description="Input, Select, Checkbox, etc."
      />
      <StatCard
        label="Color Scales"
        value="6"
        icon={<Icon icon={Palette} size={32} />}
        description="Primary, Secondary, Success, Error, Warning, Neutral"
      />
    </div>
  ),
};
