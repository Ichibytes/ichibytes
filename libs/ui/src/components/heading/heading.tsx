import React from "react";
import { cn } from "../../utils/cn";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";
  children: React.ReactNode;
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
};

const defaultSizes = {
  h1: "4xl",
  h2: "3xl",
  h3: "2xl",
  h4: "xl",
  h5: "lg",
  h6: "md",
} as const;

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as = "h1", size, className, children, ...props }, ref) => {
    const Component = as;
    const sizeClass = size
      ? sizeClasses[size]
      : sizeClasses[defaultSizes[as] as keyof typeof sizeClasses];

    return (
      <Component
        ref={ref}
        className={cn(
          "font-bold leading-tight text-secondary-900 dark:text-secondary-50",
          sizeClass,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";
