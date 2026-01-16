import React from "react";
import { cn } from "../../../utils/cn";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  helperText?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, helperText, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-50 dark:ring-offset-secondary-800 dark:focus-visible:ring-primary-400",
            error &&
              "border-error-500 focus-visible:ring-error-500 dark:border-error-400 dark:focus-visible:ring-error-400",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {helperText && (
          <p
            className={cn(
              "mt-1 text-sm",
              error
                ? "text-error-600 dark:text-error-400"
                : "text-secondary-500 dark:text-secondary-400"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
