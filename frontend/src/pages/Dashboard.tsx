import { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import NoteAnimation from '../components/animations/NoteAnimation';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFilters from '../components/dashboard/DashboardFilters';
import Pagination from '../components/dashboard/Pagination';
import type { Note } from '../types/note';

export default function Dashboard() {
  const {
    notes, loading, error, page, totalPages, setPage,
    searchQuery, setSearchQuery, filterFavorite, setFilterFavorite,
    filterTag, setFilterTag, startDate, setStartDate, endDate, setEndDate,
    availableTags, handleToggleFavorite, fetchNotes
  } = useNotes();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

  const handleOpenNewNoteModal = () => { setSelectedNote(undefined); setIsModalOpen(true); };
  const handleOpenEditNoteModal = (note: Note) => { setSelectedNote(note); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setSelectedNote(undefined); };

  const hasActiveFilters = searchQuery || filterFavorite || filterTag || startDate || endDate;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors duration-300">
      <DashboardHeader onNewNote={handleOpenNewNoteModal} />

      <main className="max-w-7xl mx-auto px-8 py-8">
        <DashboardFilters 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          filterFavorite={filterFavorite} setFilterFavorite={setFilterFavorite}
          filterTag={filterTag} setFilterTag={setFilterTag}
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
          availableTags={availableTags}
        />

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
              {hasActiveFilters ? (
                <>
                  <div className="text-6xl mb-4 opacity-50">🔍</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">No se encontraron resultados</h2>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors">Intenta ajustar tus filtros de búsqueda</p>
                </>
              ) : (
                <>
                  <NoteAnimation />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">No tienes notas aún</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">Comienza creando tu primera nota</p>
                  <button onClick={handleOpenNewNoteModal} className="rounded-full bg-blue-500 text-white px-6 py-3 text-sm font-semibold shadow-[0_4px_12px_rgb(59,130,246,0.3)] hover:bg-blue-600 transition-all duration-200">
                    + Crear mi primera nota
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} onClick={() => handleOpenEditNoteModal(note)} onToggleFavorite={handleToggleFavorite} />
              ))}
            </div>
            
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        )}
      </main>

      <NoteModal isOpen={isModalOpen} onClose={handleCloseModal} noteToEdit={selectedNote} onSave={fetchNotes} />
    </div>
  );
}