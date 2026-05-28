export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-card animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-1 bg-gray-200 rounded-full" />
        <div className="w-12 h-5 bg-gray-200 rounded-full" />
        <div className="ml-auto w-16 h-4 bg-gray-200 rounded" />
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-1" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-3" />
      <div className="flex items-center gap-2">
        <div className="w-12 h-5 bg-gray-200 rounded" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function VocabCardSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto h-[420px] bg-white rounded-xl shadow-card animate-pulse p-8 flex flex-col items-center justify-center">
      <div className="w-16 h-6 bg-gray-200 rounded-full mb-6" />
      <div className="w-32 h-10 bg-gray-200 rounded mb-3" />
      <div className="w-24 h-5 bg-gray-200 rounded mb-8" />
      <div className="w-28 h-10 bg-gray-200 rounded-full" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-card animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        <div>
          <div className="w-12 h-6 bg-gray-200 rounded mb-1" />
          <div className="w-16 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
