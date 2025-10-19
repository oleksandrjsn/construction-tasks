interface PulseLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function PulseLoader({
  size = "md",
  className = "",
  text,
}: PulseLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
}
