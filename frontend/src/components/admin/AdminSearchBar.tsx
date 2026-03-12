import type { FormEvent } from 'react';

interface AdminSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: FormEvent) => void;
  loading: boolean;
  error: string | null;
}

export default function AdminSearchBar({ searchQuery, setSearchQuery, handleSearch, loading, error }: AdminSearchBarProps) {
  return (
    <div className="mb-12">
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-400 dark:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar usuario por username..."
            className="w-full pl-16 pr-32 py-5 bg-white/90 dark:bg-slate-800/90 dark:text-white backdrop-blur-xl border border-gray-200/50 dark:border-slate-700 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-[1.5rem] transition-all duration-200 shadow-[0_4px_12px_rgb(147,51,234,0.3)] hover:shadow-[0_6px_16px_rgb(147,51,234,0.4)] disabled:bg-purple-400 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : 'Buscar'}
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-2xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-4 flex items-start gap-3 transition-colors">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 dark:text-red-400 text-sm font-medium transition-colors">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}