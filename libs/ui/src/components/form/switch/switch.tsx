import React from "react";
import { cn } from "../../../utils/cn";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-center space-x-2">
          <div className="relative inline-flex h-6 w-11 items-center">
            <input
              type="checkbox"
              role="switch"
              id={switchId}
              ref={ref}
              className={cn("peer sr-only cursor-pointer", className)}
              {...props}
            />
            <div
              className={cn(
                "h-6 w-11 rounded-full border-2 transition-colors cursor-pointer",
                "peer-checked:bg-primary-600 peer-checked:border-primary-600 dark:peer-checked:bg-primary-500 dark:peer-checked:border-primary-500",
                "bg-secondary-200 border-secondary-300 dark:bg-secondary-700 dark:border-secondary-600",
                "peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2 dark:peer-focus:ring-primary-400 dark:peer-focus:ring-offset-secondary-800",
                "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                error && "border-error-500 dark:border-error-400"
              )}
            >
              <div
                className={cn(
                  "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform dark:bg-secondary-200",
                  "peer-checked:translate-x-5"
                )}
              />
            </div>
          </div>
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                "text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-secondary-50",
                error && "text-error-600 dark:text-error-400"
              )}
            >
              {label}
            </label>
          )}
        </div>
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

Switch.displayName = "Switch";
