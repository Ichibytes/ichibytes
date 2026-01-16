import React from "react";
import { cn } from "../../../utils/cn";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id={radioId}
            ref={ref}
            className={cn(
              "h-4 w-4 border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:border-secondary-600 dark:bg-secondary-800 dark:ring-offset-secondary-800 dark:focus:ring-primary-400",
              error && "border-error-500 dark:border-error-400",
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={radioId}
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

Radio.displayName = "Radio";
