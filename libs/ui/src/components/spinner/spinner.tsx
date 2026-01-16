import React from "react";
import { cn } from "../../utils/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "white";
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", variant = "primary", className, ...props }, ref) => {
    const baseStyles =
      "animate-spin rounded-full border-2 border-t-transparent";

    const variants = {
      primary: "border-primary-600 dark:border-primary-400",
      secondary: "border-secondary-600 dark:border-secondary-400",
      white: "border-white dark:border-secondary-50",
    };

    const sizes = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
