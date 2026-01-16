import React from "react";
import {
  Container,
  Stack,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Separator,
  CodeBlock,
  LinkButton,
  StatCard,
  ColorSwatch,
  Heading,
  Text,
  Icon,
  Link,
} from "../components";
import {
  Code2,
  Smartphone,
  Palette,
  BookOpen,
  Layout,
  FileText,
  Palette as PaletteIcon,
  ExternalLink,
  Github,
  Heart,
  Rocket,
  Zap,
} from "lucide-react";
import { cn } from "../utils/cn";
import { colors } from "../tokens";
import logoImage from "../assets/ichibytes-logo-rounded.png";

export interface IchibytesProps {
  className?: string;
}

export function Ichibytes({ className }: IchibytesProps) {
  const componentCategories = [
    {
      title: "Base Components",
      components: [
        "Button",
        "Card",
        "Input",
        "Badge",
        "Spinner",
        "Alert",
        "Separator",
      ],
    },
    {
      title: "Layout Components",
      components: ["Container", "Stack", "Box"],
    },
    {
      title: "Form Components",
      components: [
        "Label",
        "Textarea",
        "Select",
        "Checkbox",
        "Radio",
        "Switch",
      ],
    },
  ];

  const features = [
    {
      title: "Type-Safe",
      description:
        "Built with TypeScript for full type safety and excellent developer experience",
      icon: Code2,
    },
    {
      title: "Accessible",
      description:
        "Components follow WCAG guidelines with proper ARIA attributes and keyboard navigation",
      icon: Smartphone,
    },
    {
      title: "Customizable",
      description:
        "Flexible design system with tokens for colors, spacing, and typography",
      icon: Palette,
    },
    {
      title: "Documented",
      description:
        "Comprehensive Storybook documentation with interactive examples",
      icon: BookOpen,
    },
  ];

  const stats = [
    {
      label: "Components",
      value: "20+",
      description: "Reusable React components",
      icon: Layout,
    },
    {
      label: "Form Components",
      value: "6",
      description: "Input, Select, Checkbox, etc.",
      icon: FileText,
    },
    {
      label: "Color Scales",
      value: "6",
      description: "Primary, Secondary, Success, Error, Warning, Neutral",
      icon: PaletteIcon,
    },
  ];

  return (
    <div
      className={cn(
        "min-h-screen bg-linear-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800 py-12",
        className
      )}
    >
      <Container size="lg">
        <Stack spacing={8}>
          {/* Header - Enhanced */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="absolute w-96 h-96 bg-primary-400/10 dark:bg-primary-500/10 rounded-full blur-3xl" />
              <div className="absolute w-64 h-64 bg-secondary-400/10 dark:bg-secondary-500/10 rounded-full blur-2xl -translate-x-32" />
              <div className="absolute w-64 h-64 bg-primary-300/10 dark:bg-primary-600/10 rounded-full blur-2xl translate-x-32" />
            </div>

            <div className="text-center relative z-10">
              {/* Logo - Simplified and elegant */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  {/* Subtle glow behind logo */}
                  <div className="absolute inset-0 -top-8 -bottom-8 -left-8 -right-8 bg-primary-500/5 dark:bg-primary-400/10 rounded-full blur-3xl" />

                  {/* Logo */}
                  <div className="relative">
                    <img
                      src={logoImage}
                      alt="Ichibytes Logo"
                      className="h-28 w-28 md:h-36 md:w-36 object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Title with badge */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <Heading
                    as="h1"
                    size="5xl"
                    className="text-primary-900 dark:text-primary-100 font-bold"
                  >
                    @ichibytes/ui
                  </Heading>
                  <Badge
                    variant="primary"
                    size="lg"
                    className="text-sm font-semibold px-3 py-1"
                  >
                    v1.0.0
                  </Badge>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <Badge variant="secondary" size="sm" className="font-medium">
                    <Icon icon={Code2} size={14} className="mr-1.5" />
                    TypeScript
                  </Badge>
                  <Badge variant="secondary" size="sm" className="font-medium">
                    <Icon icon={Palette} size={14} className="mr-1.5" />
                    TailwindCSS
                  </Badge>
                  <Badge variant="secondary" size="sm" className="font-medium">
                    <Icon icon={Smartphone} size={14} className="mr-1.5" />
                    Accessible
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="max-w-3xl mx-auto space-y-3">
                <Text
                  as="p"
                  size="2xl"
                  className="font-semibold text-primary-800 dark:text-primary-200"
                >
                  UI Component Library
                </Text>
                <Text
                  as="p"
                  size="lg"
                  color="secondary"
                  className="leading-relaxed"
                >
                  A modern, accessible React component library built with
                  TypeScript and TailwindCSS.
                  <br />
                  <span className="text-primary-600 dark:text-primary-400 font-medium">
                    Designed to make my life easier and have more consistency
                    for the Ichibytes website.
                  </span>
                </Text>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                label={stat.label}
                value={stat.value}
                description={stat.description}
                icon={<Icon icon={stat.icon} size={32} />}
              />
            ))}
          </div>

          {/* About the Library - Enhanced Section */}
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-primary-600 dark:via-primary-700 dark:to-primary-800 p-8 md:p-12 text-white shadow-xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                    <Icon icon={BookOpen} size={32} className="text-white" />
                  </div>
                  <Heading as="h2" size="4xl" className="text-white">
                    About the Library
                  </Heading>
                </div>
                <Text size="lg" className="text-white/90 max-w-2xl">
                  A comprehensive collection of reusable React components for
                  building modern, accessible, and beautiful web applications
                </Text>
              </div>
            </div>

            {/* Component Categories - Enhanced */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Icon
                    icon={Layout}
                    size={24}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <Heading as="h3" size="2xl">
                  Component Categories
                </Heading>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {componentCategories.map((category, index) => (
                  <Card
                    key={index}
                    className="group border-2 border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-300 overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 dark:from-primary-900/0 dark:to-primary-800/0 group-hover:from-primary-50/50 group-hover:to-primary-100/30 dark:group-hover:from-primary-900/20 dark:group-hover:to-primary-800/20 transition-all duration-300" />
                    <CardContent className="pt-6 relative z-10">
                      <Heading
                        as="h4"
                        size="lg"
                        className="mb-4 font-semibold text-primary-900 dark:text-primary-100"
                      >
                        {category.title}
                      </Heading>
                      <div className="flex flex-wrap gap-2">
                        {category.components.map((component) => (
                          <Badge
                            key={component}
                            variant="secondary"
                            size="sm"
                            className="group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors"
                          >
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Key Features - Enhanced */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
                  <Icon
                    icon={Code2}
                    size={24}
                    className="text-success-600 dark:text-success-400"
                  />
                </div>
                <Heading as="h3" size="2xl">
                  Key Features
                </Heading>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <Card
                      key={index}
                      className="group border-2 border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-transparent group-hover:from-primary-50/30 dark:group-hover:from-primary-900/10 transition-all duration-300" />
                      <CardContent className="pt-6 relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors shrink-0">
                            <FeatureIcon
                              className="text-primary-600 dark:text-primary-400"
                              size={28}
                            />
                          </div>
                          <div className="flex-1">
                            <Heading
                              as="h4"
                              size="lg"
                              className="mb-2 font-semibold"
                            >
                              {feature.title}
                            </Heading>
                            <Text
                              size="base"
                              color="secondary"
                              className="leading-relaxed"
                            >
                              {feature.description}
                            </Text>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Design System - Enhanced */}
            <Card className="border-2 border-secondary-200 dark:border-secondary-700 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                    <Icon icon={PaletteIcon} size={24} className="text-white" />
                  </div>
                  <Heading as="h3" size="2xl" className="text-white">
                    Design System
                  </Heading>
                </div>
              </div>
              <CardContent className="pt-6">
                <Stack spacing={8}>
                  {/* Colors Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge
                        variant="primary"
                        size="lg"
                        className="text-sm font-semibold"
                      >
                        Colors
                      </Badge>
                      <Text size="sm" color="secondary">
                        Primary, secondary, success, error, warning, and neutral
                        scales
                      </Text>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      <ColorSwatch
                        color={colors.primary[500]}
                        name="Primary"
                        value={colors.primary[500]}
                        className="hover:scale-105 transition-transform"
                      />
                      <ColorSwatch
                        color={colors.secondary[500]}
                        name="Secondary"
                        value={colors.secondary[500]}
                        className="hover:scale-105 transition-transform"
                      />
                      <ColorSwatch
                        color={colors.success[500]}
                        name="Success"
                        value={colors.success[500]}
                        className="hover:scale-105 transition-transform"
                      />
                      <ColorSwatch
                        color={colors.error[500]}
                        name="Error"
                        value={colors.error[500]}
                        className="hover:scale-105 transition-transform"
                      />
                      <ColorSwatch
                        color={colors.warning[500]}
                        name="Warning"
                        value={colors.warning[500]}
                        className="hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Spacing & Typography */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-secondary-200 dark:border-secondary-700 bg-secondary-50/50 dark:bg-secondary-900/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge
                            variant="primary"
                            size="lg"
                            className="text-sm font-semibold"
                          >
                            Spacing
                          </Badge>
                        </div>
                        <Text
                          size="sm"
                          color="secondary"
                          className="leading-relaxed"
                        >
                          Consistent spacing scale from 0 to 64 (0 to 16rem)
                          with semantic naming for predictable layouts
                        </Text>
                      </CardContent>
                    </Card>
                    <Card className="border-secondary-200 dark:border-secondary-700 bg-secondary-50/50 dark:bg-secondary-900/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge
                            variant="primary"
                            size="lg"
                            className="text-sm font-semibold"
                          >
                            Typography
                          </Badge>
                        </div>
                        <Text
                          size="sm"
                          color="secondary"
                          className="leading-relaxed"
                        >
                          Font families, sizes, and weights with responsive
                          scaling and semantic heading styles
                        </Text>
                      </CardContent>
                    </Card>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </div>

          {/* Quick Start - Enhanced */}
          <Card className="border-2 border-primary-200 dark:border-primary-700 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                  <Icon icon={Rocket} size={24} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-2xl">
                    Quick Start
                  </CardTitle>
                  <CardDescription className="text-white/90 text-sm">
                    Get started in minutes with our component library
                  </CardDescription>
                </div>
              </div>
            </div>
            <CardContent className="pt-6">
              <Stack spacing={6}>
                {/* Installation Step */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="primary"
                      size="sm"
                      className="font-semibold"
                    >
                      Step 1
                    </Badge>
                    <Heading
                      as="h4"
                      size="md"
                      className="text-primary-900 dark:text-primary-100"
                    >
                      Install the package
                    </Heading>
                  </div>
                  <CodeBlock language="bash">
                    {`npm install @ichibytes/ui`}
                  </CodeBlock>
                </div>

                <Separator />

                {/* Usage Step */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="primary"
                      size="sm"
                      className="font-semibold"
                    >
                      Step 2
                    </Badge>
                    <Heading
                      as="h4"
                      size="md"
                      className="text-primary-900 dark:text-primary-100"
                    >
                      Import and use components
                    </Heading>
                  </div>
                  <CodeBlock language="typescript">
                    {`import { Button, Card, Input } from '@ichibytes/ui';

function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Click me</Button>
      <Input placeholder="Enter text..." />
    </Card>
  );
}`}
                  </CodeBlock>
                </div>
              </Stack>
            </CardContent>
          </Card>

          {/* Explore Components - Enhanced */}
          <Card className="border-2 border-secondary-200 dark:border-secondary-700 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-secondary-900/50 dark:to-secondary-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Icon
                    icon={Zap}
                    size={24}
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div>
                  <CardTitle className="text-2xl">Explore Components</CardTitle>
                  <CardDescription className="text-base">
                    Discover all available components and their capabilities
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Stack spacing={6} align="center">
                <Text
                  size="base"
                  color="secondary"
                  align="center"
                  className="max-w-2xl leading-relaxed"
                >
                  Browse all components in the sidebar to see examples, props,
                  and usage. Each component includes interactive stories and
                  comprehensive documentation to help you build amazing user
                  interfaces.
                </Text>

                {/* Action Button to GitHub Repository */}
                <div className="flex flex-wrap justify-center gap-4 w-full">
                  <LinkButton
                    href="https://github.com/Ichibytes/ichibytes"
                    external
                    variant="primary"
                    className="group"
                    icon={<Icon icon={Github} size={18} />}
                  >
                    View on GitHub
                    <Icon
                      icon={ExternalLink}
                      size={14}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </LinkButton>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pt-4">
                  <div className="text-center p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-700">
                    <Icon
                      icon={Code2}
                      size={24}
                      className="text-primary-600 dark:text-primary-400 mx-auto mb-2"
                    />
                    <Text size="sm" className="font-semibold mb-1">
                      Type-Safe
                    </Text>
                    <Text size="xs" color="muted">
                      Full TypeScript support
                    </Text>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-700">
                    <Icon
                      icon={Smartphone}
                      size={24}
                      className="text-primary-600 dark:text-primary-400 mx-auto mb-2"
                    />
                    <Text size="sm" className="font-semibold mb-1">
                      Accessible
                    </Text>
                    <Text size="xs" color="muted">
                      WCAG compliant
                    </Text>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-700">
                    <Icon
                      icon={Palette}
                      size={24}
                      className="text-primary-600 dark:text-primary-400 mx-auto mb-2"
                    />
                    <Text size="sm" className="font-semibold mb-1">
                      Customizable
                    </Text>
                    <Text size="xs" color="muted">
                      Easy to theme
                    </Text>
                  </div>
                </div>
              </Stack>
            </CardContent>
          </Card>

          {/* Footer - Enhanced */}
          <footer className="pt-2 pb-12 mt-2">
            <Card className="border-2 border-secondary-200 dark:border-secondary-700 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500/10 via-secondary-500/5 to-primary-500/10 dark:from-primary-600/20 dark:via-secondary-600/10 dark:to-primary-600/20 px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Logo and Brand Section */}
                  <div className="md:col-span-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={logoImage}
                        alt="Ichibytes Logo"
                        className="h-12 w-12 object-contain"
                      />
                      <div>
                        <Heading
                          as="h3"
                          size="xl"
                          className="text-primary-900 dark:text-primary-100"
                        >
                          @ichibytes/ui
                        </Heading>
                        <Text size="sm" color="muted">
                          UI Component Library
                        </Text>
                      </div>
                    </div>
                    <Text
                      size="sm"
                      color="secondary"
                      className="leading-relaxed"
                    >
                      A modern, accessible React component library built with
                      TypeScript and TailwindCSS. Part of the{" "}
                      <Link
                        href="https://ichibytes.dev"
                        external
                        variant="primary"
                        className="font-medium"
                      >
                        Ichibytes.dev
                      </Link>{" "}
                      monorepo.
                    </Text>
                  </div>

                  {/* Quick Links Section */}
                  <div className="md:col-span-4 space-y-4">
                    <Heading
                      as="h4"
                      size="lg"
                      className="text-primary-900 dark:text-primary-100"
                    >
                      Quick Links
                    </Heading>
                    <div className="flex flex-col gap-3">
                      <Link
                        href="https://github.com/Ichibytes/ichibytes"
                        external
                        variant="muted"
                        className="flex items-center gap-2 group hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <div className="p-1.5 bg-secondary-100 dark:bg-secondary-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                          <Icon icon={Github} size={18} />
                        </div>
                        <span className="font-medium">GitHub Repository</span>
                      </Link>
                      <Link
                        href="https://ichibytes.dev"
                        external
                        variant="muted"
                        className="flex items-center gap-2 group hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <div className="p-1.5 bg-secondary-100 dark:bg-secondary-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                          <Icon icon={ExternalLink} size={18} />
                        </div>
                        <span className="font-medium">Ichibytes.dev</span>
                      </Link>
                    </div>
                  </div>

                  {/* About Creator Section */}
                  <div className="md:col-span-4 space-y-4">
                    <Heading
                      as="h4"
                      size="lg"
                      className="text-primary-900 dark:text-primary-100"
                    >
                      Created By
                    </Heading>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Text size="sm" color="muted">
                          Built with
                        </Text>
                        <Icon
                          icon={Heart}
                          size={16}
                          className="text-error-500 dark:text-error-400 animate-pulse"
                        />
                        <Text size="sm" color="muted">
                          by
                        </Text>
                      </div>
                      <Link
                        href="https://ichibytes.dev"
                        external
                        variant="primary"
                        className="font-semibold text-base inline-flex items-center gap-2 group"
                      >
                        <span>Ezequiel Migueles</span>
                        <Icon
                          icon={ExternalLink}
                          size={14}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </Link>
                      <Text size="xs" color="muted" className="pt-2">
                        Full-stack developer passionate about creating
                        beautiful, accessible web experiences.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Copyright */}
              <div className="px-6 py-4 bg-secondary-50 dark:bg-secondary-900/30 border-t border-secondary-200 dark:border-secondary-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <Text size="sm" color="muted">
                    © {new Date().getFullYear()} Ichibytes. All rights
                    reserved.
                  </Text>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" size="sm">
                      MIT License
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      Open Source
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </footer>
        </Stack>
      </Container>
    </div>
  );
}

export default Ichibytes;
