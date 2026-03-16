import { useState } from 'react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSearchBar from '../components/admin/AdminSearchBar';
import AdminSearchResults from '../components/admin/AdminSearchResults';
import NoteModal from '../components/NoteModal';
import type { Note } from '../types/note';
import { noteService } from '../services/noteService'; 
import { toast } from 'sonner'; 
import ConfirmModal from '../components/ConfirmModal'; 
import SearchAnimation from '../components/animations/SearchUser';

export default function AdminDashboard() {
  const {
    searchQuery, setSearchQuery, searchedUser, userNotes,
    loading, error, handleSearch, 
  } = useAdminDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null); 


  const handleOpenNoteModal = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(undefined);
  };

  const handleSaveNote = () => {
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleDeleteNoteFromCard = (note: Note) => {
    setNoteToDelete(note);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await noteService.deleteNote(noteToDelete.id);
      toast.success('Nota del usuario eliminada');
      handleSaveNote(); 
    } catch (err) {
      console.error('Error al eliminar la nota:', err);
      toast.error('Error al eliminar la nota');
    } finally {
      setNoteToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors duration-300">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12">
        <AdminSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          loading={loading}
          error={error}
        />

        {searchedUser && (
          <AdminSearchResults 
            searchedUser={searchedUser} 
            userNotes={userNotes} 
            onNoteClick={handleOpenNoteModal} 
            onDeleteNote={handleDeleteNoteFromCard}
          />
        )}

       {/* initial state */}
        {!searchedUser && !loading && !error && (
          <div className="text-center pt-2 md:pt-4 pb-10 md:pb-20 px-4">
            
            <div className="flex justify-center opacity-80 mb-2 md:mb-4">
              <SearchAnimation />
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              Busca un usuario
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 transition-colors">
              Ingresa el username de un usuario para ver su información y notas
            </p>
          </div>
        )}
      </main>

      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        noteToEdit={selectedNote}
        onSave={handleSaveNote}
      />

      <ConfirmModal 
        isOpen={!!noteToDelete} 
        onClose={() => setNoteToDelete(null)} 
        onConfirm={confirmDelete} 
        title="¿Eliminar nota de usuario?" 
        message="Esta acción no se puede deshacer. Se eliminará permanentemente de la base de datos." 
      />
    </div>
  );
}