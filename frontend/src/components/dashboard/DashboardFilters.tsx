import { useAuth } from '../../context/AuthContext';
interface DashboardFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterFavorite: boolean;
  setFilterFavorite: (value: boolean) => void;
  filterTag: string;
  setFilterTag: (tag: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

export default function DashboardFilters({
  searchQuery, setSearchQuery, filterFavorite, setFilterFavorite,
  filterTag, setFilterTag, startDate, setStartDate, endDate, setEndDate
}: DashboardFiltersProps) {
  const {user} = useAuth();

  return (
    <div className="mb-10 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar notas por título o contenido..."
          className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-800/80 dark:text-white backdrop-blur-md border border-gray-200/50 dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        { user?.role === 'USER' && (<button
          onClick={() => setFilterFavorite(!filterFavorite)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
            filterFavorite 
              ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/50' 
              : 'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 border-gray-200/50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
          }`}
        >
          <svg className={`w-4 h-4 ${filterFavorite ? 'fill-yellow-400' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Solo Favoritas
        </button>)}

        <div className="relative">
          <input
            type="text"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            placeholder="# Filtra por tag..."
            className="w-36 px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 dark:text-white backdrop-blur-md border border-gray-200/50 dark:border-slate-700 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-200/50 dark:border-slate-700 rounded-full px-4 py-1.5 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha:</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-sm dark:text-white text-gray-700 focus:outline-none cursor-pointer" />
          <span className="text-gray-300 dark:text-slate-600">-</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-sm dark:text-white text-gray-700 focus:outline-none cursor-pointer" />
        </div>

        {(searchQuery || filterFavorite || filterTag || startDate || endDate) && (
          <button
            onClick={() => { setSearchQuery(''); setFilterFavorite(false); setFilterTag(''); setStartDate(''); setEndDate(''); }}
            className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 underline-offset-4 hover:underline px-2 transition-all"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}