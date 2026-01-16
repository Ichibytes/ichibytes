import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "./icon";
import {
  Heart,
  Star,
  Home,
  User,
  Settings,
  Search,
  Bell,
  Mail,
  ChevronRight,
  Check,
  Plus,
  Minus,
  Edit,
  Trash2,
} from "lucide-react";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A wrapper component for Lucide React icons. Provides consistent sizing and styling for icons throughout the application.",
      },
    },
  },
  argTypes: {
    icon: {
      description: "The Lucide React icon component to render",
      control: false,
    },
    size: {
      control: "number",
      description: "The size of the icon in pixels",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for custom styling",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    icon: Heart,
    size: 24,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon={Star} size={16} />
      <Icon icon={Star} size={24} />
      <Icon icon={Star} size={32} />
      <Icon icon={Star} size={48} />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon={Heart} className="text-primary-600" />
      <Icon icon={Heart} className="text-success-600" />
      <Icon icon={Heart} className="text-error-600" />
      <Icon icon={Heart} className="text-warning-600" />
    </div>
  ),
};

export const CommonIcons: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Home} />
        <span className="text-xs text-secondary-600 dark:text-secondary-400">
          Home
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={User} />
        <span className="text-xs text-secondary-600 dark:text-secondary-400">
          User
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Settings} />
        <span className="text-xs text-secondary-600 dark:text-secondary-400">
          Settings
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Search} />
        <span className="text-xs text-secondary-600 dark:text-secondary-400">
          Search
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Bell} />
        <span className="text-xs text-secondary-600 dark:text-secondary-400">
          Bell
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Mail} />
        <span className="text-xs text-secondary-600 dark:text-secondary-400">
          Mail
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={ChevronRight} />
        <span className="text-xs text-secondary-600 dark:text-secondary-400">
          Chevron
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon icon={Check} />
        <span className="text-xs text-secondary-600 dark:text-secondary-400">
          Check
        </span>
      </div>
    </div>
  ),
};

export const ActionIcons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon={Plus} className="text-primary-600" />
      <Icon icon={Minus} className="text-secondary-600" />
      <Icon icon={Edit} className="text-primary-600" />
      <Icon icon={Trash2} className="text-error-600" />
    </div>
  ),
};
