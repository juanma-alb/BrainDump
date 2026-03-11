// src/pages/AdminDashboard.tsx
import { useState } from 'react';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import AdminHeader from '../components/admin/AdminHeader';
import AdminSearchBar from '../components/admin/AdminSearchBar';
import AdminSearchResults from '../components/admin/AdminSearchResults';
import NoteModal from '../components/NoteModal';
import type { Note } from '../types/note';

export default function AdminDashboard() {
  const {
    searchQuery, setSearchQuery, searchedUser, userNotes,
    loading, error, handleSearch
  } = useAdminDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

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

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-colors duration-300">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-8 py-12">
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
          />
        )}

        {/* Estado Inicial */}
        {!searchedUser && !loading && !error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-6 transition-colors">
              <svg className="w-12 h-12 text-purple-600 dark:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              Busca un usuario
            </h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">
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
    </div>
  );
}