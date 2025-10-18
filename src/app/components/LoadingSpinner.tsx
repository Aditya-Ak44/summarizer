'use client';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <span className="ml-4 text-gray-600 font-semibold">Generating summary...</span>
    </div>
  );
}