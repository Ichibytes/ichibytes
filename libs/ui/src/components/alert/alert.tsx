import React from "react";
import { cn } from "../../utils/cn";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "success" | "error" | "warning";
  children: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "default", className, children, ...props }, ref) => {
    const baseStyles = "rounded-lg border p-4 shadow-sm";

    const variants = {
      default:
        "bg-white border-secondary-200 text-secondary-900 dark:bg-secondary-800 dark:border-secondary-700 dark:text-secondary-50",
      primary:
        "bg-primary-50 border-primary-200 text-primary-900 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-100",
      success:
        "bg-success-50 border-success-200 text-success-900 dark:bg-success-900/30 dark:border-success-700 dark:text-success-100",
      error:
        "bg-error-50 border-error-200 text-error-900 dark:bg-error-900/30 dark:border-error-700 dark:text-error-100",
      warning:
        "bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-900/30 dark:border-warning-700 dark:text-warning-100",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h5
        ref={ref}
        className={cn(
          "mb-1 font-semibold leading-none tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h5>
    );
  }
);

AlertTitle.displayName = "AlertTitle";

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
});

AlertDescription.displayName = "AlertDescription";
