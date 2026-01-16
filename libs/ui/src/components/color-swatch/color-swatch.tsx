import React from "react";
import { cn } from "../../utils/cn";

export interface ColorSwatchProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  name: string;
  value?: string;
  showValue?: boolean;
}

export const ColorSwatch = React.forwardRef<HTMLDivElement, ColorSwatchProps>(
  ({ color, name, value, showValue = true, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col", className)} {...props}>
        <div
          className="w-full h-16 rounded-md border border-secondary-200 dark:border-secondary-700 shadow-sm"
          style={{ backgroundColor: color }}
        />
        <div className="mt-2">
          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-50">
            {name}
          </p>
          {showValue && (
            <p className="text-xs text-secondary-500 dark:text-secondary-400 font-mono mt-1">
              {value || color}
            </p>
          )}
        </div>
      </div>
    );
  }
);

ColorSwatch.displayName = "ColorSwatch";
