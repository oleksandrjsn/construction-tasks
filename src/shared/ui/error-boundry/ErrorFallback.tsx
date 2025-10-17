interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
}

export const ErrorFallback = ({ error, retry }: ErrorFallbackProps) => {
  return (
    <div className="p-5 m-5 border border-red-400 rounded-lg bg-red-50 text-red-800">
      <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
      <details className="whitespace-pre-wrap mb-4">
        <summary className="cursor-pointer font-medium mb-2">
          Error details
        </summary>
        <p className="mb-2">
          <strong>Type:</strong> {error.name}
        </p>
        <p className="mb-2">
          <strong>Message:</strong> {error.message}
        </p>
        {import.meta.env.DEV && (
          <pre className="text-sm bg-gray-100 p-2 rounded mt-2 overflow-auto">
            {error.stack}
          </pre>
        )}
      </details>
      <button
        onClick={retry}
        className="px-4 py-2 bg-blue-600 text-white border-none rounded hover:bg-blue-700 cursor-pointer transition-colors"
      >
        Try again
      </button>
    </div>
  );
};
