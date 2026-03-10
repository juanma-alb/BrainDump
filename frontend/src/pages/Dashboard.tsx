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

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await noteService.getNotes(page, 9);
      setNotes(result.items);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Error al cargar las notas:', err);
      setError('No se pudieron cargar las notas');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

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

              {user?.role === 'USER' && (<button
                onClick={handleOpenNewNoteModal}
                className="rounded-full bg-blue-400 text-white px-6 py-2.5 text-sm font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-500 hover:shadow-[0_6px_16px_rgb(59,130,246,0.4)] transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
              >
                + Nueva Nota
              </button>)}

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
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium transition-colors">Cargando notas...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 max-w-md transition-colors">
              <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <NoteAnimation />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                No tienes notas aún
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">
                Comienza creando tu primera nota
              </p>
              <button
                onClick={handleOpenNewNoteModal}
                className="rounded-full bg-blue-400 text-white px-6 py-3 text-sm font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-500 transition-all duration-200"
              >
                + Crear mi primera nota
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grid de Notas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => handleOpenEditNoteModal(note)}
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