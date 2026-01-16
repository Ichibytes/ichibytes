import React from "react";
import { Button, ButtonProps } from "../button/button";
import { cn } from "../../utils/cn";

export interface LinkButtonProps extends Omit<ButtonProps, "as"> {
  href: string;
  external?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  (
    {
      href,
      external = false,
      icon,
      iconPosition = "right",
      children,
      className,
      ...props
    },
    ref
  ) => {
    const iconElement = icon && (
      <span
        className={cn(
          "inline-flex items-center",
          iconPosition === "left" ? "mr-2" : "ml-2"
        )}
      >
        {icon}
      </span>
    );

    return (
      <a
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="inline-block cursor-pointer"
      >
        <Button className={className} {...props}>
          {iconPosition === "left" && iconElement}
          {children}
          {iconPosition === "right" && iconElement}
        </Button>
      </a>
    );
  }
);

LinkButton.displayName = "LinkButton";
