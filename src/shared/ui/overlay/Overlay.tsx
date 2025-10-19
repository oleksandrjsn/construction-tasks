export const Overlay = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
    />
  );
};
