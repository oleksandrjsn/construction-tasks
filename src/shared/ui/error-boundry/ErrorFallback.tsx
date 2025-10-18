interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: (...args: unknown[]) => void;
}

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) => {
  const err = error instanceof Error ? error : new Error("Unknown error");

  return (
    <div className="p-5 m-5 border border-red-400 rounded-lg bg-red-50 text-red-800">
      <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
      <details className="whitespace-pre-wrap mb-4">
        <summary className="cursor-pointer font-medium mb-2">
          Error details
        </summary>
        <p className="mb-2">
          <strong>Type:</strong> {err.name}
        </p>
        <p className="mb-2">
          <strong>Message:</strong> {err.message}
        </p>
        {import.meta.env.DEV && (
          <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
            {err.stack}
          </pre>
        )}
      </details>
      <button
        onClick={() => resetErrorBoundary()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
};
