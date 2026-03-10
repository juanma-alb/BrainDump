import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { noteService } from '../services/noteService';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import type { Note } from '../types/note';
import NoteAnimation from '../components/animations/NoteAnimation';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

  // Estados de Búsqueda y Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [filterTag, setFilterTag] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Efecto de Debounce para la búsqueda (espera 500ms antes de buscar)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset a primera página al buscar
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset a primera página cuando cambian otros filtros
  useEffect(() => {
    setPage(1);
  }, [filterFavorite, filterTag, startDate, endDate]);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await noteService.getNotes(page, 9, {
        search: debouncedSearch || undefined,
        isFavorite: filterFavorite ? true : undefined,
        tag: filterTag || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setNotes(result.items);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Error al cargar las notas:', err);
      setError('No se pudieron cargar las notas');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filterFavorite, filterTag, startDate, endDate]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleToggleFavorite = async (noteToToggle: Note) => {
    const updatedStatus = !noteToToggle.isFavorite;
    setNotes(currentNotes => 
      currentNotes.map(n => n.id === noteToToggle.id ? { ...n, isFavorite: updatedStatus } : n)
    );

    try {
      await noteService.updateNote(noteToToggle.id, { 
        title: noteToToggle.title,
        content: noteToToggle.content,
        tags: noteToToggle.tags,
        isFavorite: updatedStatus 
      });
      
      fetchNotes(); 
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      setNotes(currentNotes => 
        currentNotes.map(n => n.id === noteToToggle.id ? { ...n, isFavorite: !updatedStatus } : n)
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenNewNoteModal = () => {
    setSelectedNote(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditNoteModal = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(undefined);
  };

  const handleSaveNote = () => {
    fetchNotes();
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
                {user?.role === 'USER' ? 'Mis Notas' : 'Todas las notas'}              
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 transition-colors duration-300">
                Hola, {user?.username}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 ease-out hover:scale-[1.05] active:scale-[0.95]"
                aria-label="Alternar modo oscuro"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 animate-in spin-in duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 animate-in spin-in-[-180deg] duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-6 py-2.5 text-sm font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
                >
                  Panel Admin
                </Link>
              )}

              {user?.role === 'USER' && (
                <button
                  onClick={handleOpenNewNoteModal}
                  className="rounded-full bg-blue-500 text-white px-6 py-2.5 text-sm font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
                >
                  + Nueva Nota
                </button>
              )}

              <button
                onClick={handleLogout}
                className="rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-6 py-2.5 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        
        {/* ================= BARRA DE BÚSQUEDA Y FILTROS ================= */}
        <div className="mb-10 space-y-4">
          {/* Barra de búsqueda principal */}
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
              className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-800/80 dark:text-white backdrop-blur-md border border-gray-200/50 dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
          </div>

          {/* Filtros secundarios */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Toggle Favoritas */}
            <button
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
            </button>

            {/* Filtro por Etiqueta */}
            <div className="relative">
              <input
                type="text"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                placeholder="# Filtra por tag..."
                className="w-36 px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 dark:text-white backdrop-blur-md border border-gray-200/50 dark:border-slate-700 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Filtro por Rango de Fechas */}
            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-200/50 dark:border-slate-700 rounded-full px-4 py-1.5 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm dark:text-white text-gray-700 focus:outline-none cursor-pointer"
              />
              <span className="text-gray-300 dark:text-slate-600">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm dark:text-white text-gray-700 focus:outline-none cursor-pointer"
              />
            </div>

            
            {(searchQuery || filterFavorite || filterTag || startDate || endDate) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterFavorite(false);
                  setFilterTag('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 underline-offset-4 hover:underline px-2 transition-all"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* lista de notas body */}
        {loading && notes.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium transition-colors">Cargando notas...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 max-w-md transition-colors">
              <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px] animate-in fade-in duration-500">
            <div className="text-center">
              {searchQuery || filterFavorite || filterTag || startDate || endDate ? (
                <>
                  <div className="text-6xl mb-4 opacity-50">🔍</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                    No se encontraron resultados
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors">
                    Intenta ajustar tus filtros de búsqueda
                  </p>
                </>
              ) : (
                <>
                  <NoteAnimation />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                    No tienes notas aún
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">
                    Comienza creando tu primera nota
                  </p>
                  <button
                    onClick={handleOpenNewNoteModal}
                    className="rounded-full bg-blue-500 text-white px-6 py-3 text-sm font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 transition-all duration-200"
                  >
                    + Crear mi primera nota
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Grid de Notas con opacidad si está cargando background */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => handleOpenEditNoteModal(note)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {/* Controles de Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 ${pageNum === page
                            ? 'bg-blue-500 text-white shadow-[0_4px_12px_rgb(59,130,246,0.3)]'
                            : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 shadow-sm'
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        noteToEdit={selectedNote}
        onSave={handleSaveNote}
      />
    </div>
  );
}