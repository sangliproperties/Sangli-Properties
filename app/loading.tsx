export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-orange-500" />
        <p className="text-sm font-semibold text-gray-700">
          Loading...
        </p>
      </div>
    </div>
  );
}