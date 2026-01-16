import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { variant = "default", size = "md", className, children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      default:
        "bg-secondary-100 text-secondary-800 focus:ring-secondary-500 dark:bg-secondary-700 dark:text-secondary-200",
      primary:
        "bg-primary-100 text-primary-800 focus:ring-primary-500 dark:bg-primary-900/50 dark:text-primary-200",
      secondary:
        "bg-secondary-200 text-secondary-900 focus:ring-secondary-500 dark:bg-secondary-600 dark:text-secondary-100",
      success:
        "bg-success-100 text-success-800 focus:ring-success-500 dark:bg-success-900/50 dark:text-success-200",
      error:
        "bg-error-100 text-error-800 focus:ring-error-500 dark:bg-error-900/50 dark:text-error-200",
      warning:
        "bg-warning-100 text-warning-800 focus:ring-warning-500 dark:bg-warning-900/50 dark:text-warning-200",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-sm",
      lg: "px-3 py-1 text-base",
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
