import React from "react";
import { Card, CardContent } from "../card/card";
import { cn } from "../../utils/cn";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ label, value, icon, description, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "border-secondary-200 dark:border-secondary-700",
          className
        )}
        {...props}
      >
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                {label}
              </p>
              <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-50 mt-2">
                {value}
              </p>
              {description && (
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            {icon && (
              <div className="ml-4 text-primary-600 dark:text-primary-400">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatCard.displayName = "StatCard";
