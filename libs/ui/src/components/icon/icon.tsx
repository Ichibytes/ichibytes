import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: LucideIcon;
  size?: number | string;
  className?: string;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size = 24, className, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        size={size}
        className={cn("text-current", className)}
        {...props}
      />
    );
  }
);

Icon.displayName = "Icon";
