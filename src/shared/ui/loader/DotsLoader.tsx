interface DotsLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function DotsLoader({
  size = "md",
  className = "",
  text,
}: DotsLoaderProps) {
  const dotSizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex space-x-1">
        <div
          className={`${dotSizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={`${dotSizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}
          style={{ animationDelay: "150ms" }}
        />
        <div
          className={`${dotSizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}
          style={{ animationDelay: "300ms" }}
        />
      </div>
      {text && <p className="mt-3 text-sm text-gray-600">{text}</p>}
    </div>
  );
}
