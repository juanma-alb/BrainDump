import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { noteService } from '../services/noteService';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import type { Note } from '../types/note';

export default function Dashboard() {
  const { user, logout } = useAuth();
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
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Navigation Bar - Estilo iOS */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Mis Notas
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Hola, {user?.username} 👋
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenNewNoteModal}
                className="rounded-full bg-blue-500 text-white px-6 py-2.5 text-sm font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 hover:shadow-[0_6px_16px_rgb(59,130,246,0.4)] transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
              >
                + Nueva Nota
              </button>
              
              <button
                onClick={handleLogout}
                className="rounded-full bg-gray-100 text-gray-700 px-6 py-2.5 text-sm font-semibold hover:bg-gray-200 transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
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
              <p className="text-gray-600 font-medium">Cargando notas...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md">
              <p className="text-red-600 text-center font-medium">{error}</p>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No tienes notas aún
              </h2>
              <p className="text-gray-600 mb-6">
                Comienza creando tu primera nota
              </p>
              <button
                onClick={handleOpenNewNoteModal}
                className="rounded-full bg-blue-500 text-white px-6 py-3 text-sm font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 transition-all duration-200"
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
                  className="rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/80 disabled:hover:shadow-sm"
                >
                  ← Anterior
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 ${
                          pageNum === page
                            ? 'bg-blue-500 text-white shadow-[0_4px_12px_rgb(59,130,246,0.3)]'
                            : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:shadow-md'
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
                  className="rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/80 disabled:hover:shadow-sm"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de Creación/Edición */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        noteToEdit={selectedNote}
        onSave={handleSaveNote}
      />
    </div>
  );
}
