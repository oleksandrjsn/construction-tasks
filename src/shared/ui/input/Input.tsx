import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: "default" | "filled" | "outlined";
  onRightIconClick?: () => void;
  onLeftIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      variant = "default",
      className = "",
      onRightIconClick,
      onLeftIconClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    const containerClasses = [fullWidth ? "w-full" : "w-auto"].join(" ");

    const inputWrapperClasses = [
      "relative",
      "flex",
      "items-center",
      fullWidth ? "w-full" : "w-auto",
    ].join(" ");

    const baseInputClasses = [
      "block",
      "w-full",
      "rounded-md",
      "border",
      "text-sm",
      "transition-colors",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-offset-2",
      "disabled:opacity-50",
      "disabled:cursor-not-allowed",
      "disabled:bg-gray-50",
    ];

    const variantClasses = {
      default: [
        "border-gray-300",
        "bg-white",
        "focus:border-blue-500",
        "focus:ring-blue-500",
      ],
      filled: [
        "border-gray-200",
        "bg-gray-50",
        "focus:border-blue-500",
        "focus:ring-blue-500",
        "focus:bg-white",
      ],
      outlined: [
        "border-2",
        "border-gray-300",
        "bg-transparent",
        "focus:border-blue-500",
        "focus:ring-blue-500",
      ],
    };

    const errorClasses = hasError
      ? ["border-red-500", "focus:border-red-500", "focus:ring-red-500"]
      : [];

    const paddingClasses = {
      left: leftIcon ? "pl-10" : "pl-3",
      right: rightIcon ? "pr-10" : "pr-3",
      vertical: "py-2",
    };

    const inputClasses = [
      ...baseInputClasses,
      ...variantClasses[variant],
      ...errorClasses,
      paddingClasses.left,
      paddingClasses.right,
      paddingClasses.vertical,
      className,
    ].join(" ");

    const iconClasses = [
      "absolute",
      "top-1/2",
      "transform",
      "-translate-y-1/2",
      "text-gray-400",
      "w-5",
      "h-5",
    ].join(" ");

    const leftIconClasses = [
      ...iconClasses.split(" "),
      "left-3",
      onLeftIconClick ? "cursor-pointer hover:text-gray-600" : "",
    ].join(" ");

    const rightIconClasses = [
      ...iconClasses.split(" "),
      "right-3",
      onRightIconClick ? "cursor-pointer hover:text-gray-600" : "",
    ].join(" ");

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        <div className={inputWrapperClasses}>
          {leftIcon && (
            <div className={leftIconClasses} onClick={onLeftIconClick}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className={rightIconClasses} onClick={onRightIconClick}>
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
