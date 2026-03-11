// src/components/dashboard/Pagination.tsx
interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <button
        onClick={() => { if (page > 1) setPage(page - 1); }}
        disabled={page === 1}
        className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ← Anterior
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 ${
              pageNum === page
                ? 'bg-blue-500 text-white shadow-[0_4px_12px_rgb(59,130,246,0.3)]'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 shadow-sm'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        onClick={() => { if (page < totalPages) setPage(page + 1); }}
        disabled={page === totalPages}
        className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Siguiente →
      </button>
    </div>
  );
}