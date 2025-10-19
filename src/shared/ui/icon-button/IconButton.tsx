import { ButtonLoader } from "../loader";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const baseClasses = [
  "inline-flex",
  "items-center",
  "justify-center",
  "font-medium",
  "rounded-md",
  "transition-colors",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-offset-2",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "cursor-pointer",
];

const variantClasses = {
  primary: [
    "bg-blue-600",
    "text-white",
    "hover:bg-blue-700",
    "focus:ring-blue-500",
  ],
  secondary: [
    "bg-gray-600",
    "text-white",
    "hover:bg-gray-700",
    "focus:ring-gray-500",
  ],
  outline: [
    "border",
    "border-gray-300",
    "bg-white",
    "text-gray-700",
    "hover:bg-gray-50",
    "focus:ring-blue-500",
  ],
  ghost: ["text-gray-700", "hover:bg-gray-100", "focus:ring-gray-500"],
  danger: [
    "bg-red-600",
    "text-white",
    "hover:bg-red-700",
    "focus:ring-red-500",
  ],
};

const sizeClasses = {
  sm: ["text-sm", "p-1.5"],
  md: ["text-sm", "p-2"],
  lg: ["text-base", "p-3"],
};

export const IconButton = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: IconButtonProps) => {
  const allClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size],
    className,
  ].join(" ");

  const isDisabled = disabled || isLoading;

  return (
    <button className={allClasses} disabled={isDisabled} {...props}>
      {isLoading ? <ButtonLoader /> : <>{children}</>}
    </button>
  );
};
