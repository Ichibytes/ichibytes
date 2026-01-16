import React from "react";
import { cn } from "../../utils/cn";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div" | "label" | "small" | "strong" | "em";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?:
    | "default"
    | "secondary"
    | "muted"
    | "primary"
    | "error"
    | "success"
    | "warning";
  align?: "left" | "center" | "right" | "justify";
  children: React.ReactNode;
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const colorClasses = {
  default: "text-secondary-900 dark:text-secondary-50",
  secondary: "text-secondary-700 dark:text-secondary-300",
  muted: "text-secondary-500 dark:text-secondary-400",
  primary: "text-primary-600 dark:text-primary-400",
  error: "text-error-600 dark:text-error-400",
  success: "text-success-600 dark:text-success-400",
  warning: "text-warning-600 dark:text-warning-400",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as = "p",
      size = "base",
      weight = "normal",
      color = "default",
      align,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as;

    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={cn(
          sizeClasses[size],
          weightClasses[weight],
          colorClasses[color],
          align && alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";
