interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
};

const sizeStyles = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
};

export const Chip = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}: ChipProps) => {
  const baseClasses = "inline-flex items-center rounded-full font-medium";
  const variantClasses = variantStyles[variant];
  const sizeClasses = sizeStyles[size];

  return (
    <span
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};
