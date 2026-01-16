import React from "react";
import { cn } from "../../utils/cn";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
  variant?: "default" | "primary" | "muted" | "underline";
  children: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      external = false,
      variant = "default",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "cursor-pointer transition-colors";

    const variants = {
      default:
        "text-secondary-700 hover:text-secondary-900 dark:text-secondary-300 dark:hover:text-secondary-100",
      primary:
        "text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300",
      muted:
        "text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200",
      underline:
        "text-primary-600 hover:text-primary-700 underline underline-offset-4 dark:text-primary-400 dark:hover:text-primary-300",
    };

    return (
      <a
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = "Link";
