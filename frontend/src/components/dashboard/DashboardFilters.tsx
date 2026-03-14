import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface DashboardFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterFavorite: boolean;
  setFilterFavorite: (value: boolean) => void;
  filterTag: string;
  setFilterTag: (tag: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  availableTags: string[]; 
}

export default function DashboardFilters({
  searchQuery, setSearchQuery, filterFavorite, setFilterFavorite,
  filterTag, setFilterTag, dateFilter, setDateFilter, availableTags
}: DashboardFiltersProps) {
  const { user } = useAuth();
  
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);

  const dateOptions = ['Hoy', 'Esta semana', 'Este mes', 'Este año'];

  return (
    <div className="mb-6 md:mb-10 space-y-3 md:space-y-4">
      {/* Searchbar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none">
          <svg className="h-4 w-4 md:h-5 md:w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Busca tus notas por contenido o título..."
          className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 text-sm md:text-base bg-white/80 dark:bg-slate-800/80 dark:text-white backdrop-blur-md border border-gray-200/50 dark:border-slate-700 rounded-xl md:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 w-full relative z-30">
        
        {/* Toggle Favoritas */}
        {user?.role === 'USER' && (
          <button
            onClick={() => setFilterFavorite(!filterFavorite)}
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 border ${
              filterFavorite 
                ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700/50' 
                : 'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 border-gray-200/50 dark:border-slate-700 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 ${filterFavorite ? 'fill-yellow-400' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Favoritas
          </button>
        )}

        {/* Filtro por Etiqueta*/}
        <div className="relative">
          {user?.role === 'USER' && (
            <button
              onClick={() => { setIsTagMenuOpen(!isTagMenuOpen); setIsDateMenuOpen(false); }}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 border ${
                filterTag
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700/50'
                  : 'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 border-gray-200/50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              } shadow-sm focus:outline-none`}
            >
              <span className="text-sm md:text-lg opacity-70">#</span>
              {filterTag ? filterTag : 'Etiquetas'}
              <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 ml-0.5 md:ml-1 opacity-60 transition-transform duration-300 ${isTagMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {isTagMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsTagMenuOpen(false)}></div>
              <div className="absolute left-0 sm:-left-10 md:left-0 mt-2 w-64 md:w-72 max-w-[calc(100vw-2rem)] p-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] dark:shadow-black/50 rounded-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">Filtra por etiqueta</h4>
                {availableTags.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500 px-1 py-2 italic">No tienes etiquetas aún.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto custom-scrollbar p-1">
                    {availableTags.map(tag => (
                      <button key={tag} onClick={() => { setFilterTag(filterTag === tag ? '' : tag); setIsTagMenuOpen(false); }} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${filterTag === tag ? 'bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/30' : 'bg-slate-100 dark:bg-slate-700/50 text-gray-700 dark:text-gray-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600'}`}>{tag}</button>
                    ))}
                  </div>
                )}
                {filterTag && (
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700/50">
                    <button onClick={() => { setFilterTag(''); setIsTagMenuOpen(false); }} className="w-full py-2 text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">Quitar filtro</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Filtro de Fechas */}
        <div className="relative">
          <button
            onClick={() => { setIsDateMenuOpen(!isDateMenuOpen); setIsTagMenuOpen(false); }}
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 border ${
              dateFilter
                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700/50'
                : 'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 border-gray-200/50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
            } shadow-sm focus:outline-none`}
          >
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dateFilter ? dateFilter : 'Fechas'}
            <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 ml-0.5 md:ml-1 opacity-60 transition-transform duration-300 ${isDateMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDateMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDateMenuOpen(false)}></div>
              <div className="absolute right-0 sm:right-auto md:left-0 mt-2 w-56 p-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-slate-700/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] dark:shadow-black/50 rounded-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Filtra por fecha</h4>
                <div className="flex flex-col gap-1">
                  {dateOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => { setDateFilter(dateFilter === option ? '' : option); setIsDateMenuOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        dateFilter === option
                          ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {dateFilter && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-700/50">
                    <button onClick={() => { setDateFilter(''); setIsDateMenuOpen(false); }} className="w-full py-2 text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">Quitar filtro</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {(searchQuery || filterFavorite || filterTag || dateFilter) && (
          <button
            onClick={() => { setSearchQuery(''); setFilterFavorite(false); setFilterTag(''); setDateFilter(''); }}
            className="w-full md:w-auto text-center text-xs md:text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 underline-offset-4 hover:underline px-2 transition-all mt-2 md:mt-0"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}