import { Loader } from "./Loader";

interface ButtonLoaderProps {
  className?: string;
}

export function ButtonLoader({ className = "" }: ButtonLoaderProps) {
  return <Loader size="sm" className={`inline-flex ${className}`} />;
}
