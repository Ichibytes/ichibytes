import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./code-block";

const meta: Meta<typeof CodeBlock> = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A code block component for displaying code snippets with optional language labels and line numbers.",
      },
    },
  },
  argTypes: {
    language: {
      control: "select",
      options: [
        "typescript",
        "javascript",
        "jsx",
        "tsx",
        "css",
        "html",
        "json",
        "bash",
      ],
    },
    showLineNumbers: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

const sampleCode = `import { Button, Card, Input } from '@ichibytes/ui';

function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
      <Input placeholder="Enter text..." />
    </Card>
  );
}`;

export const Default: Story = {
  args: {
    children: sampleCode,
    language: "typescript",
  },
};

export const JavaScript: Story = {
  args: {
    children: `function greet(name) {
  return \`Hello, \${name}!\`;
}`,
    language: "javascript",
  },
};

export const JSX: Story = {
  args: {
    children: `<Button variant="primary" size="lg">
  Click me
</Button>`,
    language: "jsx",
  },
};

export const WithLineNumbers: Story = {
  args: {
    children: sampleCode,
    language: "typescript",
    showLineNumbers: true,
  },
};

export const JSON: Story = {
  args: {
    children: `{
  "name": "ichibytes",
  "version": "0.1.0"
}`,
    language: "json",
  },
};
