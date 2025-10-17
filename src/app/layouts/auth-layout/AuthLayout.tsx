import React from "react";
import { Typography } from "../../../shared/ui";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="text-center mb-6">
            <Typography variant="h2" color="primary" align="center">
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body1"
                color="muted"
                align="center"
                className="mt-2"
              >
                {subtitle}
              </Typography>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
