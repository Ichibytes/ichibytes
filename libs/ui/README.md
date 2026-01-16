# UI Component Library

Shared React components and design system for the Ichibytes website.

## Structure

```
libs/ui/
├── .storybook/              # Storybook configuration
│   ├── main.ts              # Storybook main config
│   └── preview.ts           # Storybook preview config
├── src/
│   ├── components/          # React components
│   │   ├── button/
│   │   │   ├── button.tsx
│   │   │   ├── button.stories.tsx
│   │   │   └── index.ts
│   │   ├── card/
│   │   │   ├── card.tsx
│   │   │   ├── card.stories.tsx
│   │   │   └── index.ts
│   │   ├── input/
│   │   │   ├── input.tsx
│   │   │   ├── input.stories.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── tokens/              # Design system tokens
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   ├── styles/               # Global styles
│   │   └── globals.css
│   ├── utils/                # Utility functions
│   │   └── cn.ts
│   └── index.ts
├── tailwind.config.js        # TailwindCSS configuration
└── postcss.config.js         # PostCSS configuration
```

## Technology

- React
- TypeScript
- TailwindCSS
- Storybook
- Jest

## Usage

### Import Components

```typescript
import { Button, Card, Input } from '@ichibytes/ui';

function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
      <Input placeholder="Enter text..." />
    </Card>
  );
}
```

### Import Design Tokens

```typescript
import { colors, spacing, typography } from "@ichibytes/ui";

const primaryColor = colors.primary[600];
const padding = spacing[4];
```

## Storybook

View and interact with components in Storybook:

```bash
nx storybook ui
```

Build static Storybook:

```bash
nx build-storybook ui
```

## Component Structure

Each component follows this structure:

```
component-name/
├── component-name.tsx        # Component implementation
├── component-name.stories.tsx # Storybook stories
└── index.ts                  # Component exports
```

## Design System

### Colors

- **Primary**: Blue scale (50-900)
- **Secondary**: Gray scale (50-900)
- **Success**: Green scale (50-900)
- **Error**: Red scale (50-900)
- **Warning**: Yellow scale (50-900)
- **Neutral**: Gray scale (50-900)

### Spacing

Consistent spacing scale from 0 to 64 (0 to 16rem).

### Typography

- Font families: Sans, Mono
- Font sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
- Font weights: normal, medium, semibold, bold

## Components

### Button

Primary, secondary, outline, ghost, and danger variants with small, medium, and large sizes.

### Card

Card component with header, title, description, content, and footer sections.

### Input

Text input with error states and helper text support.

## Development

### Adding a New Component

1. Create component folder: `src/components/my-component/`
2. Create component file: `my-component.tsx`
3. Create stories file: `my-component.stories.tsx`
4. Create index file: `index.ts`
5. Export from `src/components/index.ts`

### Running Tests

```bash
nx test ui
```

### Building

```bash
nx build ui
```
