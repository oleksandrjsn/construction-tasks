import { Loader } from "./Loader";

interface FullscreenLoaderProps {
  text?: string;
}

export function FullscreenLoader({
  text = "Loading...",
}: FullscreenLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <Loader size="lg" text={text} />
    </div>
  );
}
