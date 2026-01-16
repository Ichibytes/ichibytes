import React from "react";
import { cn } from "../../utils/cn";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { orientation = "horizontal", decorative = true, className, ...props },
    ref
  ) => {
    const baseStyles = "shrink-0 bg-secondary-200 dark:bg-secondary-700";

    const orientations = {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    };

    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={orientation}
        className={cn(baseStyles, orientations[orientation], className)}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";
